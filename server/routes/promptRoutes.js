import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  listPrompts,
  getPrompt,
  createPrompt,
  updatePrompt,
  deletePrompt
} from '../controllers/promptController.js';

const router = Router();

router.get('/', listPrompts);
router.get('/:id', getPrompt);
router.post('/', protect, createPrompt);
router.put('/:id', protect, updatePrompt);
router.delete('/:id', protect, deletePrompt);

export default router;
