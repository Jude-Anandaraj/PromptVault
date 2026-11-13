import { Router } from 'express';
import { getProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/users/profile (login required)
router.get('/profile', protect, getProfile);

export default router;
