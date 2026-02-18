import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import dbConnect from '../../src/lib/db';
import { verifyToken } from '../../src/lib/jwt';
import { Lead } from '../../src/models/Lead';
import User from '../../src/models/User';
import { z } from 'zod';

// Validation schema for creating a lead
const createLeadSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone is required'),
    company: z.string().min(1, 'Company is required'),
    source: z.string().min(1, 'Source is required'),
    status: z.enum(["new", "contacted", "qualified", "proposal", "negotiation", "converted", "lost"]).optional(),
    assignedTo: z.string().min(1, 'Assigned agent is required'), // User ID
    date: z.string().optional(),
    nextFollowUp: z.string().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await dbConnect();

    // AUTHENTICATION
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const { role, userId } = decoded;

    // GET: Fetch All Leads
    if (req.method === 'GET') {
        try {
            let query = {};

            // Role-based filtering
            if (role === 'agent') {
                query = { assignedTo: userId };
            }
            // Manager: could filter by team, but for now sees all or we can implement team logic later.
            // Admin: Sees all.

            const leads = await Lead.find(query)
                .populate('assignedTo', 'name email role') // Populate assignedTo with User details
                .sort({ createdAt: -1 });

            return res.status(200).json(leads);
        } catch (error) {
            console.error('Error fetching leads:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // POST: Create New Lead
    if (req.method === 'POST') {
        try {
            const validation = createLeadSchema.safeParse(req.body);

            if (!validation.success) {
                return res.status(400).json({
                    message: 'Validation Error',
                    errors: validation.error.errors,
                });
            }

            const { name, email, phone, company, source, status, assignedTo, date, nextFollowUp } = validation.data;

            // Verify assigned agent exists
            const agent = await User.findById(assignedTo);
            if (!agent) {
                return res.status(404).json({ message: 'Assigned agent not found' });
            }

            const newLead = await Lead.create({
                name,
                email,
                phone,
                company,
                source,
                status: status || 'new',
                assignedTo,
                date: date ? new Date(date) : new Date(),
                nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : undefined,
            });

            // Populate response
            const populatedLead = await newLead.populate('assignedTo', 'name email role');

            return res.status(201).json(populatedLead);
        } catch (error) {
            console.error('Error creating lead:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
