
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import API routes
// We need to use dynamic imports or require because the API files export default functions 
// which are designed for Vercel (req, res).
// Express (req, res) structure is compatible enough for this use case.

// Helper to wrap Vercel-style handlers for Express
// Vercel handlers read dynamic route params from req.query (e.g. req.query.id)
// but Express puts them in req.params. We merge params into query so handlers work correctly.
const wrapHandler = (handler: any) => async (req: express.Request, res: express.Response) => {
    try {
        // Merge Express route params (e.g. :id) into req.query
        // Use Object.assign to mutate existing object (avoids issues with non-writable descriptors)
        if (req.params && Object.keys(req.params).length > 0) {
            Object.assign(req.query, req.params);
        }
        await handler(req, res);
    } catch (error) {
        console.error('API Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

// Import Handlers
import authLogin from './api/auth/login';
import authMe from './api/auth/me';
import leadsIndex from './api/leads/index';
import leadsId from './api/leads/[id]';
import usersIndex from './api/users/index';
import usersId from './api/users/[id]';

// Define Routes
// Auth
app.all('/api/auth/login', wrapHandler(authLogin));
app.all('/api/auth/me', wrapHandler(authMe));

// Leads
app.all('/api/leads', wrapHandler(leadsIndex));
app.all('/api/leads/:id', wrapHandler(leadsId));

// Users
app.all('/api/users', wrapHandler(usersIndex));
app.all('/api/users/:id', wrapHandler(usersId));

// Health check
app.get('/api/health', (req: express.Request, res: express.Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
