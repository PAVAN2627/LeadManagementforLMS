-- Create ENUM for lead status
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'lost', 'converted');

-- Create ENUM for activity type
CREATE TYPE activity_type AS ENUM ('call', 'email', 'meeting', 'note');

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    source TEXT,
    status lead_status DEFAULT 'new',
    assigned_agent_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    next_follow_up TIMESTAMPTZ
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id), -- The user who performed the activity
    type activity_type NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Leads

-- Admin and Manager can view all leads
CREATE POLICY "Admins and Managers can view all leads" ON leads
    FOR SELECT
    USING (
        auth.jwt() ->> 'role' IN ('service_role') OR
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('Admin', 'Manager')
        )
    );

-- Agents can view only their assigned leads
CREATE POLICY "Agents can view assigned leads" ON leads
    FOR SELECT
    USING (
        auth.jwt() ->> 'role' IN ('service_role') OR
        assigned_agent_id = auth.uid()
    );

-- Admin, Manager, and Agent can create leads (Agents might creating their own leads)
CREATE POLICY "Authenticated users can create leads" ON leads
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Admin and Manager can update any lead
CREATE POLICY "Admins and Managers can update all leads" ON leads
    FOR UPDATE
    USING (
        auth.jwt() ->> 'role' IN ('service_role') OR
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('Admin', 'Manager')
        )
    );

-- Agents can update only their assigned leads
CREATE POLICY "Agents can update assigned leads" ON leads
    FOR UPDATE
    USING (
        auth.jwt() ->> 'role' IN ('service_role') OR
        assigned_agent_id = auth.uid()
    );

-- Only Admin and Manager can delete leads
CREATE POLICY "Admins and Managers can delete leads" ON leads
    FOR DELETE
    USING (
        auth.jwt() ->> 'role' IN ('service_role') OR
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('Admin', 'Manager')
        )
    );

-- RLS Policies for Activities
-- Everyone can view activities for leads they have access to (implicitly handled if they can see the lead, but explicit policy is better)
-- For simplicity, let's allow read access to activities if the user can read the lead. However, easier to just check user role or assignment.

CREATE POLICY "Users can view activities for visible leads" ON activities
    FOR SELECT
    USING (
        auth.jwt() ->> 'role' IN ('service_role') OR
        EXISTS (
            SELECT 1 FROM leads
            WHERE leads.id = activities.lead_id
            -- Re-implementing lead visibility logic here might be redundant but necessary for RLS
            AND (
                -- Admin/Manager
                EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('Admin', 'Manager'))
                OR
                -- Assigned Agent
                leads.assigned_agent_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create activities" ON activities
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
