import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../src/lib/db.js';
import { verifyToken } from '../../src/lib/jwt.js';
import User from '../../src/models/User.js';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(['admin', 'manager', 'agent']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    bio: z.string().optional(),
    department: z.string().optional(),
    location: z.string().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await dbConnect();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as any;
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const { role } = decoded;

    if (req.method === 'GET') {
        try {
            // Allow admin/manager to see users, or maybe agents to find colleagues?
            // For lead assignment, only agents are needed usually.

            let query = {};

            // Optional: filtering by role via query param
            if (req.query.role) {
                query = { ...query, role: req.query.role };
            }

            const users = await User.find(query).select('-passwordHash').sort({ createdAt: -1 });
            return res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    if (req.method === 'POST') {
        // Admins can create any user; managers can only create agents
        if (role !== 'admin' && role !== 'manager') {
            return res.status(403).json({ message: "Forbidden: Only admins and managers can create users" });
        }

        try {
            const validation = createUserSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ message: "Validation Error", errors: validation.error.format() });
            }

            const { name, email, password, role: requestedRole, status, phone, company, bio, department, location } = validation.data;

            // Managers can only create agents — prevent privilege escalation
            const assignedRole = (decoded.role === 'manager') ? 'agent' : (requestedRole || 'agent');

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists with this email" });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                name,
                email,
                passwordHash,
                role: assignedRole,
                status: status || 'active',
                phone: phone || '',
                company: company || '',
                bio: bio || '',
                department: department || '',
                location: location || '',
            });

            // Return user without password
            const userObj = newUser.toObject();
            delete (userObj as any).passwordHash;

            return res.status(201).json(userObj);

        } catch (error) {
            console.error("Create User Error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
