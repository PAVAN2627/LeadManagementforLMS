
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import dbConnect from '../../src/lib/db';
import User from '../../src/models/User';
import { comparePassword } from '../../src/lib/auth-utils';
import { signToken } from '../../src/lib/jwt';

// Define Validation Schema
const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
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
        const result = LoginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: result.error.errors
            });
        }

        const { email, password } = result.data;

        // 3. Find User
        // Explicitly select passwordHash because it's set to select: false in schema
        const user = await User.findOne({ email }).select('+passwordHash');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 4. Verify Password
        const isValid = await comparePassword(password, user.passwordHash);

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ message: 'Account is inactive' });
        }

        // 5. Generate Token
        const token = signToken({
            userId: user._id as string,
            role: user.role
        });

        // 6. Return Response
        // Don't send password hash back
        const userObject = user.toObject();
        delete (userObject as any).passwordHash;

        return res.status(200).json({
            token,
            user: userObject,
        });

    } catch (error: any) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
