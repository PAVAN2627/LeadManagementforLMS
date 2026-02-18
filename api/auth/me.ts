
import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../src/lib/db';
import User from '../../src/models/User';
import { verifyToken } from '../../src/lib/jwt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow GET
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // 1. Get Token from Header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // 2. Verify Token
        const decoded = verifyToken(token);
        // verifyToken returns null if invalid, or decoded object (TokenPayload)
        // However, verifyToken implementation returns `TokenPayload | null`
        // Wait, let's double check implementation of verifyToken in previous step 
        // Yes, it returns TokenPayload | null.
        // However, typescript might complain if verifyToken implementation uses verify() which returns string | JwtPayload.
        // In src/lib/jwt.ts I cast it to TokenPayload. 
        // But `jwt.verify` can throw if token is invalid, so try/catch block inside verifyToken handles it?
        // Let's check verifyToken implementation again.
        // export function verifyToken(token: string): TokenPayload | null {
        //   try {
        //     return jwt.verify(token, JWT_SECRET) as TokenPayload;
        //   } catch (error) {
        //     return null;
        //   }
        // }
        // Implementation looks safe.

        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // 3. Connect to DB
        await dbConnect();

        // 4. Fetch User
        const user = await User.findById((decoded as any).userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ message: 'Account is inactive' });
        }

        // 5. Return User
        return res.status(200).json({
            user: user,
        });

    } catch (error: any) {
        console.error('Me endpoint error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
