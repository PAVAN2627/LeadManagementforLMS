import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import all handlers from src/api-handlers
import analyticsHandler from '../src/api-handlers/analytics/index.js';
import adminSignupHandler from '../src/api-handlers/auth/admin-signup.js';
import changePasswordHandler from '../src/api-handlers/auth/change-password.js';
import loginHandler from '../src/api-handlers/auth/login.js';
import meHandler from '../src/api-handlers/auth/me.js';
import sendRemindersHandler from '../src/api-handlers/cron/send-reminders.js';
import leadsHandler from '../src/api-handlers/leads/index.js';
import leadByIdHandler from '../src/api-handlers/leads/[id].js';
import leadNotesHandler from '../src/api-handlers/leads/[id]/notes.js';
import notificationsHandler from '../src/api-handlers/notifications/index.js';
import notificationByIdHandler from '../src/api-handlers/notifications/[id].js';
import usersHandler from '../src/api-handlers/users/index.js';
import userByIdHandler from '../src/api-handlers/users/[id].js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { url } = req;
    
    // Remove /api prefix and get the path
    const path = url?.replace(/^\/api/, '') || '';
    
    try {
        // Analytics
        if (path === '/analytics' || path === '/analytics/') {
            return analyticsHandler(req, res);
        }
        
        // Auth routes
        if (path === '/auth/admin-signup' || path === '/auth/admin-signup/') {
            return adminSignupHandler(req, res);
        }
        if (path === '/auth/change-password' || path === '/auth/change-password/') {
            return changePasswordHandler(req, res);
        }
        if (path === '/auth/login' || path === '/auth/login/') {
            return loginHandler(req, res);
        }
        if (path === '/auth/me' || path === '/auth/me/') {
            return meHandler(req, res);
        }
        
        // Cron
        if (path === '/cron/send-reminders' || path === '/cron/send-reminders/') {
            return sendRemindersHandler(req, res);
        }
        
        // Leads
        if (path === '/leads' || path === '/leads/') {
            return leadsHandler(req, res);
        }
        
        // Lead by ID and notes
        const leadIdMatch = path.match(/^\/leads\/([^\/]+)$/);
        const leadNotesMatch = path.match(/^\/leads\/([^\/]+)\/notes$/);
        
        if (leadNotesMatch) {
            req.query = { ...req.query, id: leadNotesMatch[1] };
            return leadNotesHandler(req, res);
        }
        
        if (leadIdMatch) {
            req.query = { ...req.query, id: leadIdMatch[1] };
            return leadByIdHandler(req, res);
        }
        
        // Notifications
        if (path === '/notifications' || path === '/notifications/') {
            return notificationsHandler(req, res);
        }
        
        const notificationIdMatch = path.match(/^\/notifications\/([^\/]+)$/);
        if (notificationIdMatch) {
            req.query = { ...req.query, id: notificationIdMatch[1] };
            return notificationByIdHandler(req, res);
        }
        
        // Users
        if (path === '/users' || path === '/users/') {
            return usersHandler(req, res);
        }
        
        const userIdMatch = path.match(/^\/users\/([^\/]+)$/);
        if (userIdMatch) {
            req.query = { ...req.query, id: userIdMatch[1] };
            return userByIdHandler(req, res);
        }
        
        // Not found
        return res.status(404).json({ message: 'API endpoint not found' });
        
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
