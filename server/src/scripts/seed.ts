import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const seedAdmin = async () => {
    const email = 'admin@athenura.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 8);

    const { data, error } = await supabase
        .from('users')
        .insert({
            email,
            name: 'Admin User',
            role: 'Admin',
            password_hash: hashedPassword,
            must_change_password: false // Initial admin doesn't need to force change immediately for testing
        })
        .select();

    if (error) {
        if (error.code === '23505') { // Unique violation
            console.log('Admin user already exists.');
        } else {
            console.error('Error creating admin:', error);
        }
    } else {
        console.log('Admin user created successfully:', data);
    }
};

seedAdmin();
