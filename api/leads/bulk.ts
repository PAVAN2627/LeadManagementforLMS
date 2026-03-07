import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../src/lib/db.js';
import { verifyToken } from '../../src/lib/jwt.js';
import { Lead } from '../../src/models/Lead.js';
import User from '../../src/models/User.js';
import { notifyAdmins } from '../../src/lib/notifyAdmins.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

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

    // Only Admin, Manager, and Agent can bulk add leads
    if (role !== 'admin' && role !== 'manager' && role !== 'agent') {
        return res.status(403).json({ message: "Forbidden: Only admins, managers, and agents can bulk import leads" });
    }

    try {
        const leads = req.body.leads; // Expecting an array of leads
        if (!Array.isArray(leads) || leads.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty leads array' });
        }

        // Process leads
        const leadsToInsert = [];
        let skippedCount = 0;

        for (const lead of leads) {
            if (!lead.name || (!lead.email && !lead.phone)) {
                skippedCount++;
                continue; // Skip invalid leads explicitly without breaking
            }

            // Optional: Resolve assignedTo email to user _id
            let assignedToId = undefined;

            if (role === 'agent') {
                // Agents can only assign to themselves
                assignedToId = userId;
            } else {
                if (lead.assignedToEmail) {
                    const agent = await User.findOne({ email: lead.assignedToEmail });
                    if (agent) {
                        assignedToId = agent._id;
                    }
                } else if (lead.assignedTo) {
                    assignedToId = lead.assignedTo;
                }
            }

            leadsToInsert.push({
                name: lead.name,
                email: lead.email || '',
                phone: lead.phone || '',
                company: lead.company || '',
                source: lead.source || 'Website',
                status: lead.status || 'new',
                assignedTo: assignedToId || undefined,
                date: lead.date ? new Date(lead.date) : new Date(),
                nextFollowUp: lead.nextFollowUp ? new Date(lead.nextFollowUp) : undefined,
            });
        }

        if (leadsToInsert.length === 0) {
            return res.status(400).json({ message: 'No valid leads found in the import' });
        }

        const insertedLeads = await Lead.insertMany(leadsToInsert);

        // Notify admins
        await notifyAdmins(`Bulk imported ${insertedLeads.length} leads`, userId);

        return res.status(201).json({
            message: `Successfully imported ${insertedLeads.length} leads. Skipped ${skippedCount} invalid leads.`,
            insertedLeads
        });
    } catch (error) {
        console.error('Error in bulk import:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
