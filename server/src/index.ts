import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './db';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import leadsRoutes from './routes/leads';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadsRoutes);

app.get('/', (req, res) => {
    res.send('LMS Backend is running');
});

// Test DB connection
app.get('/api/test-db', async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        if (error) throw error;
        res.json({ message: 'Supabase connection successful', data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Only start server if run directly (dev mode or separate server)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export default app;
