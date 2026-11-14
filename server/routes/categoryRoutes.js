import { Router } from 'express';
import {
  listCategories,
  listCategoriesForAdmin,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Anyone
router.get('/', listCategories);

// Admins only
router.get('/admin', protect, requireAdmin, listCategoriesForAdmin);
router.post('/', protect, requireAdmin, createCategory);
router.put('/:id', protect, requireAdmin, updateCategory);
router.delete('/:id', protect, requireAdmin, deleteCategory);

export default router;
