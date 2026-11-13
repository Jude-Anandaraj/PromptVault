import { Router } from 'express';
import { register } from '../controllers/authController.js';
import { validateRegister } from '../middleware/validateAuth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', validateRegister, register);

export default router;
