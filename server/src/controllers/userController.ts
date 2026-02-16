import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../db';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email, name, role } = req.body;

        // 1. Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // 2. Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 8);

        // 3. Insert into DB
        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                email,
                name,
                role,
                password_hash: hashedPassword,
                must_change_password: true
            })
            .select()
            .single();

        if (error) throw error;

        // 4. Send email (Stub for Phase 1)
        console.log(`[EMAIL STUB] Sending invite to ${email} with password: ${tempPassword}`);
        // In Phase 2: await resend.emails.send(...)

        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
            tempPassword // Returning in response for testing purposes only!
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
