import { Router } from 'express';
import { getProfile, getMyPrompts, listMembers, getMember, updateProfile, deleteAccount } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateProfileUpdate, validateAccountDelete } from '../middleware/validateUser.js';

const router = Router();

// All /api/users/profile routes act on the logged-in user's own account.
router.get('/', listMembers);
router.get('/profile/prompts', protect, getMyPrompts);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.delete('/profile', protect, validateAccountDelete, deleteAccount);
router.get('/:id', getMember);

export default router;
