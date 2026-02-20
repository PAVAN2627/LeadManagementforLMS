
import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../src/lib/db.js';
import User from '../../src/models/User.js';
import { verifyToken } from '../../src/lib/jwt.js';
import { z } from 'zod';


const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    avatar: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    bio: z.string().optional(),
    department: z.string().optional(),
    location: z.string().optional(),
    settings: z.any().optional(),
    // Allow case-insensitive role
    role: z.string().transform(val => val.toLowerCase()).pipe(z.enum(['admin', 'manager', 'agent'])).optional(),
    // Allow case-insensitive status
    status: z.string().transform(val => val.toLowerCase()).pipe(z.enum(['active', 'inactive'])).optional(),
});

function setCorsHeaders(res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(res);

    const { method } = req;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await dbConnect();

        // Support both Vercel (req.query.id) and Express (req.params.id) routing
        let id = req.query.id || (req as any).params?.id;

        // Handle array case for id (Vercel specific)
        if (Array.isArray(id)) {
            id = id[0];
        }

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'User ID required' });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token) as any;
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Logic check: Only admin can update anyone, or user can update themselves
        if (decoded.userId !== id && decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        switch (method) {
            case 'GET':
                const user = await User.findById(id).select('-passwordHash');
                if (!user) return res.status(404).json({ message: 'User not found' });
                return res.status(200).json(user);

            case 'PUT':
            case 'PATCH':
                // Validate body
                const body = req.body;
                console.log('Update User Body:', body);

                const validation = updateUserSchema.safeParse(body);

                if (!validation.success) {
                    console.error('Validation Error:', JSON.stringify(validation.error.format()));
                    return res.status(400).json({ message: 'Validation Error', errors: validation.error.format() });
                }

                const updates = validation.data;

                // Security check: only admin can update role or status
                if ((updates.role || updates.status) && decoded.role !== 'admin') {
                    return res.status(403).json({ message: "Forbidden: Only admins can update role or status" });
                }

                const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-passwordHash');

                if (!updatedUser) {
                    return res.status(404).json({ message: 'User not found' });
                }

                return res.status(200).json(updatedUser);

            case 'DELETE':
                // Only admin can delete
                if (decoded.role !== 'admin') {
                    return res.status(403).json({ message: 'Forbidden. Only admins can delete users.' });
                }

                const deletedUser = await User.findByIdAndDelete(id);
                if (!deletedUser) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json({ message: 'User deleted' });

            default:
                return res.status(405).json({ message: `Method ${method} Not Allowed` });
        }

    } catch (error: any) {
        console.error('User API Error:', error);
        return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
}
