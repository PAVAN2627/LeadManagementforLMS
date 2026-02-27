import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import dbConnect from '../../src/lib/db.js';
import { verifyToken } from '../../src/lib/jwt.js';
import { Notification } from '../../src/models/Notification.js';
import User from '../../src/models/User.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        await dbConnect();

        // Check token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token) as any;
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const { userId } = decoded;
        const { id } = req.query;

        if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid notification ID' });
        }

        if (req.method === 'PATCH') {
            const updatedNotification = await Notification.findOneAndUpdate(
                { _id: id, userId },
                { $set: { isRead: true } },
                { new: true }
            );

            if (!updatedNotification) {
                return res.status(404).json({ message: 'Notification not found or not owned by user' });
            }

            return res.status(200).json(updatedNotification);
        }

        return res.status(405).json({ message: 'Method Not Allowed' });

    } catch (error: any) {
        console.error('Error updating notification:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
