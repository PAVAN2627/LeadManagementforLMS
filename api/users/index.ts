
import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../src/lib/db';
import { verifyToken } from '../../src/lib/jwt';
import User from '../../src/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await dbConnect();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const { role } = decoded;

    if (req.method === 'GET') {
        try {
            // Allow admin/manager to see users, or maybe agents to find colleagues?
            // For lead assignment, only agents are needed usually.

            let query = {};

            // Optional: filtering by role via query param
            if (req.query.role) {
                query = { ...query, role: req.query.role };
            }

            const users = await User.find(query).select('-passwordHash').sort({ createdAt: -1 });
            return res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
