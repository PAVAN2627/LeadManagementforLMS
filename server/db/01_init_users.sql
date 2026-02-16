-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM for user roles
CREATE TYPE user_role AS ENUM ('Admin', 'Manager', 'Agent');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    must_change_password BOOLEAN DEFAULT TRUE
);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies (Simple for now, can be refined later)
-- Admin can do everything
CREATE POLICY "Admins can do everything" ON users
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role'); -- OR check a custom claim

-- For now, let's just allow read access to authenticated users to keep it simple for Phase 1 testing
-- We will lock this down in Phase 1.2
CREATE POLICY "Public read for testing" ON users
    FOR SELECT
    USING (true);
