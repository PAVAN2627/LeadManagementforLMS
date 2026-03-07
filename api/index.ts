import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import all handlers (underscore prefix prevents Vercel from deploying as separate functions)
import analyticsHandler from './_analytics/index.js';
import adminSignupHandler from './_auth/admin-signup.js';
import changePasswordHandler from './_auth/change-password.js';
import loginHandler from './_auth/login.js';
import meHandler from './_auth/me.js';
import sendRemindersHandler from './_cron/send-reminders.js';
import leadsHandler from './_leads/index.js';
import leadByIdHandler from './_leads/[id].js';
import leadNotesHandler from './_leads/[id]/notes.js';
import notificationsHandler from './_notifications/index.js';
import notificationByIdHandler from './_notifications/[id].js';
import usersHandler from './_users/index.js';
import userByIdHandler from './_users/[id].js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Get the pathname - Vercel passes the original path even after rewrite
    const url = req.url || '';
    const pathname = url.split('?')[0];
    
    // The path should already have /api prefix from the original request
    let path = pathname;
    
    // If it doesn't start with /api, add it (shouldn't happen but just in case)
    if (!path.startsWith('/api')) {
        path = '/api' + path;
    }
    
    // Remove /api prefix for matching
    path = path.replace(/^\/api/, '') || '/';
    
    console.log('API Request:', { method: req.method, originalUrl: url, matchPath: path });
    
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
