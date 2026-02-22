import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../../src/lib/db.js';
import { verifyToken } from '../../../src/lib/jwt.js';
import { Note } from '../../../src/models/Note.js';
import { Lead } from '../../../src/models/Lead.js';
import User from '../../../src/models/User.js';
import { notifyAdmins } from '../../../src/lib/notifyAdmins.js';

function setCorsHeaders(res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await dbConnect();

        let id = req.query.id || (req as any).params?.id;
        if (Array.isArray(id)) id = id[0];

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'Invalid Lead ID' });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token) as any;

        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        const lead = await Lead.findById(id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        if (req.method === 'GET') {
            const notes = await Note.find({ lead: id })
                .populate('author', 'name role')
                .sort({ createdAt: -1 });
            return res.status(200).json(notes);
        }

        if (req.method === 'POST') {
            const { content } = req.body;
            if (!content || typeof content !== 'string') {
                return res.status(400).json({ message: 'Note content is required' });
            }

            const newNote = await Note.create({
                content,
                lead: id,
                author: decoded.userId
            });

            const populatedNote = await newNote.populate('author', 'name role');

            await notifyAdmins(`A note was added to lead "${lead.name}"`, decoded.userId);

            return res.status(201).json(populatedNote);
        }

        return res.status(405).json({ message: 'Method Not Allowed' });

    } catch (error: any) {
        console.error('Error in notes handler:', error);
        return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
}
