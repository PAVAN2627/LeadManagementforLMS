import express from 'express';
import { createUser } from '../controllers/userController';
import { auth, requireRole } from '../middleware/auth';

const router = express.Router();

// Only Admins can create users
router.post('/', auth, requireRole(['Admin']), createUser);

export default router;
