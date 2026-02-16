import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../db';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                mustChangePassword: user.must_change_password
            }
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = (req as any).user.id;

        // Get user to verify old password (optional if we trust the token, but good practice)
        // For forced password change, we might just require the token. 
        // Let's assume user is logged in (has token) but must_change_password is true.

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8);

        const { error: updateError } = await supabase
            .from('users')
            .update({ password_hash: hashedPassword, must_change_password: false })
            .eq('id', userId);

        if (updateError) {
            throw updateError;
        }

        res.json({ message: 'Password updated successfully' });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
