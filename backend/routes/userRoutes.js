import express from 'express'
import { protect, adminOnly } from '../middlewares/authMiddleware.js'
import { createUser } from '../controllers/userControllers.js'

const router = express.Router()
router.post('/', protect, adminOnly, createUser)

export default router