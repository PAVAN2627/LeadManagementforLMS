import express from 'express';
import { login, changePassword } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.post('/change-password', auth, changePassword);

export default router;
