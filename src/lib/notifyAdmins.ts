import { Notification } from '../models/Notification.js';
import User from '../models/User.js';

export const notifyAdmins = async (message: string, currentUserId: string, excludeRoles: string[] = []) => {
    try {
        const admins = await User.find({ role: 'admin' }, '_id');
        const notifications = admins
            .map(admin => ({
                userId: admin._id,
                type: 'system',
                message
            }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
    } catch (error) {
        console.error('Error notifying admins:', error);
    }
};
