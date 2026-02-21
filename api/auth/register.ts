import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import dbConnect from '../../src/lib/db.js';
import User from '../../src/models/User.js';
import { hashPassword } from '../../src/lib/auth-utils.js';
import { signToken } from '../../src/lib/jwt.js';

// ✅ Sirf Admin ke liye schema
const AdminRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    adminSecretKey: z.string().min(1),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // 1. Connect to DB
        await dbConnect();

        // 2. Validate Input
        const result = AdminRegisterSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: result.error.errors,
            });
        }

        const { email, password, adminSecretKey } = result.data;

        // 3. Secret Key Check
        if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({ message: 'Invalid admin secret key' });
        }

        // 4. Already exists check
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // 5. Hash Password
        const passwordHash = await hashPassword(password);

        // 6. Create Admin
        const admin = await User.create({
            name: 'Admin',
            email,
            passwordHash,
            role: 'admin',
        });

        // 7. Generate Token
        const token = signToken({
            userId: admin._id.toString(),
            role: admin.role,
        });

        const adminObject = admin.toObject();
        delete (adminObject as any).passwordHash;

        return res.status(201).json({ token, user: adminObject });

    } catch (error: any) {
        console.error('Admin register error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}