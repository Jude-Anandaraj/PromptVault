import Category from '../models/Category.js';

// GET /api/categories
// The React filters expect an array of names, not full documents.
export async function listCategories(req, res) {
  const rows = await Category.find().sort({ name: 1 }).select('name');
  res.json({ categories: rows.map((row) => row.name) });
}
