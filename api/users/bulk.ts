import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../src/lib/db.js';
import { verifyToken } from '../../src/lib/jwt.js';
import User from '../../src/models/User.js';
import bcrypt from 'bcryptjs';
import { notifyAdmins } from '../../src/lib/notifyAdmins.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

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

    const { role, userId } = decoded;

    // Admins and Managers can bulk import users.
    if (role !== 'admin' && role !== 'manager') {
        return res.status(403).json({ message: "Forbidden: Only admins and managers can bulk import users" });
    }

    try {
        const users = req.body.users;
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty users array' });
        }

        const usersToInsert = [];
        let skippedCount = 0;

        for (const u of users) {
            if (!u.name || !u.email) {
                skippedCount++;
                continue;
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email: u.email });
            if (existingUser) {
                skippedCount++;
                continue; // skip existing users
            }

            // Role enforcement
            let assignedRole = u.role || 'agent';
            if (role === 'manager') {
                assignedRole = 'agent'; // Managers can only create agents
            }

            const passwordToHash = u.password || 'password123';
            const passwordHash = await bcrypt.hash(passwordToHash, 10);

            usersToInsert.push({
                name: u.name,
                email: u.email,
                passwordHash,
                role: assignedRole,
                status: u.status || 'active',
                phone: u.phone || '',
                company: u.company || '',
                bio: u.bio || '',
                department: u.department || '',
                location: u.location || '',
            });
        }

        if (usersToInsert.length === 0) {
            return res.status(400).json({ message: 'No valid/new users found in the import. Existing users might have been skipped.' });
        }

        const insertedUsers = await User.insertMany(usersToInsert);

        // Return user without password
        const usersObj = insertedUsers.map(u => {
            const user = u.toObject();
            delete (user as any).passwordHash;
            return user;
        });

        await notifyAdmins(`Bulk imported ${insertedUsers.length} users`, userId);

        return res.status(201).json({
            message: `Successfully imported ${insertedUsers.length} users. Skipped ${skippedCount} items.`,
            users: usersObj
        });
    } catch (error) {
        console.error("Bulk Create User Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
