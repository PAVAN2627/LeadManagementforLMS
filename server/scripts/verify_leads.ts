import { supabase } from '../src/db';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Helper to mimic fetch if node-fetch is not available (Node 18+ has global fetch)
const myFetch = (globalThis.fetch || fetch) as unknown as typeof fetch;

if (!myFetch) {
    console.error('Fetch API not found. Please use Node 18+ or install node-fetch.');
    process.exit(1);
}

dotenv.config();

const API_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'test_admin_phase2@example.com';
const TEST_PASSWORD = 'password123';

async function main() {
    console.log('Starting verification script...');

    // 1. Setup Test User
    console.log('Setting up test admin user...');
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

    // Check if user exists
    let { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', TEST_EMAIL)
        .single();

    if (!user) {
        console.log('Creating new test user...');
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                email: TEST_EMAIL,
                password_hash: hashedPassword,
                role: 'Admin',
                name: 'Test Admin',
                status: 'Active',
                must_change_password: false
            })
            .select()
            .single();

        if (createError) {
            console.error('Failed to create test user:', createError);
            process.exit(1);
        }
        user = newUser;
    } else {
        console.log('Test user already exists, ensuring password match...');
        await supabase
            .from('users')
            .update({ password_hash: hashedPassword }) // Reset password to ensure we can login
            .eq('id', user.id);
    }

    console.log('Test user ready:', user.email);

    // 2. Login to get Token
    console.log('Logging in...');
    const loginRes = await myFetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
    });

    if (!loginRes.ok) {
        const err = await loginRes.text();
        console.error('Login failed:', err);
        process.exit(1);
    }

    const { token } = await loginRes.json() as any;
    console.log('Login successful, token received.');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // 3. Create Lead
    console.log('Testing create lead...');
    const newLead = {
        name: 'Verification Lead',
        email: 'verify@example.com',
        phone: '1234567890',
        company: 'Verify Inc',
        source: 'Script',
        status: 'new',
        assigned_agent_id: user.id
    };

    const createRes = await myFetch(`${API_URL}/leads`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newLead)
    });

    if (!createRes.ok) {
        const err = await createRes.text();
        console.error('Create lead failed:', err);
        process.exit(1);
    }

    const createdLead = await createRes.json() as any;
    console.log('Lead created:', createdLead.id);

    // 4. List Leads
    console.log('Testing list leads...');
    const listRes = await myFetch(`${API_URL}/leads`, { headers });
    const listData = await listRes.json() as any;

    // Check if created lead is in list
    const found = listData.data.find((l: any) => l.id === createdLead.id);
    if (found) {
        console.log('Created lead found in list.');
    } else {
        console.error('Created lead NOT found in list!');
    }

    // 5. Update Lead
    console.log('Testing update lead...');
    const updateRes = await myFetch(`${API_URL}/leads/${createdLead.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: 'contacted' })
    });

    if (!updateRes.ok) {
        console.error('Update lead failed:', await updateRes.text());
    } else {
        const updatedLead = await updateRes.json() as any;
        console.log('Lead updated status:', updatedLead.status);
    }

    // 6. Delete Lead
    console.log('Testing delete lead...');
    const deleteRes = await myFetch(`${API_URL}/leads/${createdLead.id}`, {
        method: 'DELETE',
        headers
    });

    if (deleteRes.status === 204) {
        console.log('Lead deleted successfully.');
    } else {
        console.error('Delete lead failed:', await deleteRes.text());
    }

    console.log('Verification complete.');
}

main().catch(console.error);
