import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../src/lib/db.js';
import { verifyToken } from '../../src/lib/jwt.js';
import { Notification } from '../../src/models/Notification.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

        const { userId } = decoded;

        // GET: Fetch user's notifications
        if (req.method === 'GET') {
            const notifications = await Notification.find({ userId })
                .sort({ createdAt: -1 })
                .limit(50);

            const unreadCount = await Notification.countDocuments({ userId, isRead: false });

            return res.status(200).json({
                notifications,
                unreadCount
            });
        }

        // PATCH: Mark notification(s) as read
        if (req.method === 'PATCH') {
            const { notificationId } = req.body;

            if (notificationId) {
                // Mark specific as read
                await Notification.findOneAndUpdate(
                    { _id: notificationId, userId },
                    { isRead: true }
                );
            } else {
                // Mark all as read
                await Notification.updateMany(
                    { userId, isRead: false },
                    { isRead: true }
                );
            }

            return res.status(200).json({ message: 'Notifications updated' });
        }

        return res.status(405).json({ message: 'Method Not Allowed' });

    } catch (error) {
        console.error('Error in notifications handler:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
