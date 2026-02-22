import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import dbConnect from '../../src/lib/db.js';
import User from '../../src/models/User.js';
import { hashPassword } from '../../src/lib/auth-utils.js';

// Define Validation Schema
const AdminSignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    secret: z.string().min(1),
    name: z.string().optional().default('Admin'),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // 1. Connect to DB
        await dbConnect();

        // 2. Validate Input
        const result = AdminSignupSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: result.error.errors
            });
        }

        const { email, password, secret, name } = result.data;

        // 3. Verify Secret
        const expectedSecret = process.env.ADMIN_SIGNUP_SECRET;

        if (!expectedSecret || secret !== expectedSecret) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // 4. Check for Duplicate Email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // 5. Hash Password
        const passwordHash = await hashPassword(password);

        // 6. Create User with hardcoded admin role
        const newUser = await User.create({
            name,
            email,
            passwordHash,
            role: 'admin',
            status: 'active'
        });

        // 7. Return Response
        const userObject = newUser.toObject();
        delete (userObject as any).passwordHash;

        return res.status(200).json({
            success: true,
            message: 'Admin user created successfully',
            user: userObject
        });

    } catch (error: any) {
        console.error('Admin signup error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
