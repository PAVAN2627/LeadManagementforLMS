import express from 'express';
import { supabase } from '../db';

const router = express.Router();

// GET /api/leads - List all leads (with filtering & pagination)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search, assigned_agent_id } = req.query;
        const from = (Number(page) - 1) * Number(limit);
        const to = from + Number(limit) - 1;

        let query = supabase
            .from('leads')
            .select(`
                *,
                assigned_agent:users!assigned_agent_id(id, name, email)
            `, { count: 'exact' })
            .range(from, to)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        if (assigned_agent_id) {
            query = query.eq('assigned_agent_id', assigned_agent_id);
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        res.json({
            data,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total: count,
                totalPages: Math.ceil((count || 0) / Number(limit))
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/leads/:id - Get single lead
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('leads')
            .select(`
                *,
                assigned_agent:users!assigned_agent_id(id, name, email),
                activities(id, type, message, created_at, user:users(name))
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Lead not found' });

        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/leads - Create new lead
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, company, source, status, assigned_agent_id, next_follow_up } = req.body;

        const { data, error } = await supabase
            .from('leads')
            .insert([
                { name, email, phone, company, source, status, assigned_agent_id, next_follow_up }
            ])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/leads/:id - Update lead
// Re-implementing PUT correctly below
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const { data, error } = await supabase
            .from('leads')
            .update({ ...updates, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/leads/:id - Delete lead
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
