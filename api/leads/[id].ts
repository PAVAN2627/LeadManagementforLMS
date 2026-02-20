import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import dbConnect from '../../src/lib/db.js';
import { verifyToken } from '../../src/lib/jwt.js';
import { Lead } from '../../src/models/Lead.js';
import { Note } from '../../src/models/Note.js';
import { z } from 'zod';

const updateLeadSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    source: z.string().optional(),
    // Allow case insensitive status
    status: z.string().transform(val => val.toLowerCase()).pipe(z.enum(["new", "contacted", "qualified", "proposal", "negotiation", "converted", "lost"])).optional(),
    assignedTo: z.string().optional().nullable(),
    nextFollowUp: z.string().optional().nullable(),
});

function setCorsHeaders(res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(res);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Support both Vercel (req.query.id) and Express (req.params.id) routing
    let id = req.query.id || (req as any).params?.id;

    // Handle array case for id
    if (Array.isArray(id)) {
        id = id[0];
    }

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid Lead ID' });
    }

    try {
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

        // GET: Fetch Single Lead
        if (req.method === 'GET') {
            const lead = await Lead.findById(id).populate('assignedTo', 'name email role');

            if (!lead) {
                return res.status(404).json({ message: 'Lead not found' });
            }

            // Authorization check for Agent
            if (role === 'agent' && lead.assignedTo?._id.toString() !== userId) {
                return res.status(403).json({ message: 'Forbidden: You do not have access to this lead' });
            }

            return res.status(200).json(lead);
        }

        // PUT/PATCH: Update Lead
        if (req.method === 'PUT' || req.method === 'PATCH') {
            const existingLead = await Lead.findById(id);

            if (!existingLead) {
                return res.status(404).json({ message: 'Lead not found' });
            }

            // Authorization check
            if (role === 'agent' && existingLead.assignedTo?.toString() !== userId) {
                return res.status(403).json({ message: 'Forbidden: You can only update your assigned leads' });
            }

            console.log('Update Lead Body:', req.body); // Debug log

            const validation = updateLeadSchema.safeParse(req.body);

            if (!validation.success) {
                console.error('Validation Error:', JSON.stringify(validation.error.errors)); // Debug log
                return res.status(400).json({
                    message: 'Validation Error',
                    errors: validation.error.errors,
                });
            }

            const updates = validation.data;


            // Handle nextFollowUp specially (Date conversion)
            const updateData: any = { ...updates };
            if (updates.nextFollowUp) {
                updateData.nextFollowUp = new Date(updates.nextFollowUp);
            } else if (updates.nextFollowUp === null) {
                // Allow clearing follow up
                updateData.nextFollowUp = null;
            }

            // Handle empty string for assignedTo (prevent CastError)
            if (updateData.assignedTo === "") {
                updateData.assignedTo = null;
            }


            const updatedLead = await Lead.findByIdAndUpdate(id, updateData, { new: true })
                .populate('assignedTo', 'name email role');

            return res.status(200).json(updatedLead);
        }

        // DELETE: Delete Lead (Admin Only)
        if (req.method === 'DELETE') {
            if (role !== 'admin') {
                return res.status(403).json({ message: 'Forbidden: Only admins can delete leads' });
            }

            const deletedLead = await Lead.findByIdAndDelete(id);

            if (!deletedLead) {
                return res.status(404).json({ message: 'Lead not found' });
            }

            // Also delete associated notes
            await Note.deleteMany({ lead: id });

            return res.status(200).json({ message: 'Lead deleted successfully' });
        }

    } catch (error: any) {
        console.error('Error in lead handler:', error);
        return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
