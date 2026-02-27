import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import dbConnect from '../../src/lib/db.js';
import { verifyToken } from '../../src/lib/jwt.js';
import { Notification } from '../../src/models/Notification.js';

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

        if (req.method === 'GET') {
            // Fetch all notifications for the user
            const notifications = await Notification.find({ userId })
                .sort({ createdAt: -1 })
                .limit(50);

            const unreadCount = await Notification.countDocuments({ 
                userId, 
                isRead: false 
            });

            return res.status(200).json({
                notifications,
                unreadCount
            });
        }

        if (req.method === 'PATCH') {
            // Mark notification(s) as read
            const { notificationId } = req.body;

            if (notificationId) {
                // Mark specific notification as read
                if (!mongoose.Types.ObjectId.isValid(notificationId)) {
                    return res.status(400).json({ message: 'Invalid notification ID' });
                }

                const updatedNotification = await Notification.findOneAndUpdate(
                    { _id: notificationId, userId },
                    { $set: { isRead: true } },
                    { new: true }
                );

                if (!updatedNotification) {
                    return res.status(404).json({ message: 'Notification not found' });
                }

                return res.status(200).json(updatedNotification);
            } else {
                // Mark all notifications as read
                await Notification.updateMany(
                    { userId, isRead: false },
                    { $set: { isRead: true } }
                );

                return res.status(200).json({ message: 'All notifications marked as read' });
            }
        }

        return res.status(405).json({ message: 'Method Not Allowed' });

    } catch (error: any) {
        console.error('Error handling notifications:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
