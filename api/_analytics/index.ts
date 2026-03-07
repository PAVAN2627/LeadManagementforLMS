import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../src/lib/db.js';
import { verifyToken } from '../../src/lib/jwt.js';
import { Lead } from '../../src/models/Lead.js';
import User from '../../src/models/User.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        await dbConnect();

        // AUTHENTICATION
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token) as any;

        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        const { role, userId } = decoded;

        let leadQuery: any = {};

        if (role === 'agent') {
            leadQuery = { assignedTo: userId };
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalLeads,
            convertedLeads,
            lostLeads,
            qualifiedLeads,
            newLeads,
            pendingFollowUp,
            convertedThisMonth
        ] = await Promise.all([
            Lead.countDocuments(leadQuery),
            Lead.countDocuments({ ...leadQuery, status: 'converted' }),
            Lead.countDocuments({ ...leadQuery, status: 'lost' }),
            Lead.countDocuments({ ...leadQuery, status: 'qualified' }),
            Lead.countDocuments({ ...leadQuery, status: 'new' }),
            Lead.countDocuments({ ...leadQuery, nextFollowUp: { $lte: now } }),
            Lead.countDocuments({ ...leadQuery, status: 'converted', updatedAt: { $gte: startOfMonth } })
        ]);

        let activeAgents = 0;
        let agentsUnder = 0;
        if (role === 'admin' || role === 'manager') {
            activeAgents = await User.countDocuments({ role: 'agent', status: 'active' });
            agentsUnder = await User.countDocuments({ role: 'agent' });
        }

        const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';

        const averageDealSize = 12450;
        const totalValue = totalLeads * averageDealSize;

        return res.status(200).json({
            // General & Admin
            totalLeads,
            convertedLeads,
            lostLeads,
            activeAgents,
            conversionRate,
            totalValue,
            averageDealSize,
            // Manager
            totalAssigned: totalLeads,
            pendingFollowUp,
            convertedThisMonth,
            agentsUnder,
            // Agent
            newLeads,
            qualifiedLeads
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
