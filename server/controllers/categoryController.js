import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Prompt from '../models/Prompt.js';

// GET /api/categories
// The React filters expect an array of names, not full documents.
export async function listCategories(req, res) {
  const rows = await Category.find().sort({ name: 1 }).select('name');
  res.json({ categories: rows.map((row) => row.name) });
}

// --- Admin only (the routes use protect and requireAdmin) ---

// Compare names without caring about capitals, so "coding" and "Coding" count as the same.
const IGNORE_CASE = { locale: 'en', strength: 2 };

function present(category, promptCount) {
  return { _id: category._id, name: category.name, description: category.description, promptCount };
}

function readBody(body) {
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const details = {};
  if (name.length < 2 || name.length > 40) details.name = 'Category name must be 2 to 40 characters.';
  if (description.length > 200) details.description = 'Description must be 200 characters or less.';
  return { name, description, details };
}

async function findCategory(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ error: 'That category id is not valid.' });
    return null;
  }
  const category = await Category.findById(req.params.id);
  if (!category) res.status(404).json({ error: 'Category not found.' });
  return category;
}

// GET /api/categories/admin
// Every category with its id and how many prompts use it.
export async function listCategoriesForAdmin(req, res) {
  const [categories, counts] = await Promise.all([
    Category.find().sort({ name: 1 }),
    Prompt.aggregate([{ $group: { _id: '$categoryId', count: { $sum: 1 } } }])
  ]);
  const countById = new Map(counts.map((row) => [String(row._id), row.count]));
  res.json({ categories: categories.map((c) => present(c, countById.get(String(c._id)) || 0)) });
}

// POST /api/categories
export async function createCategory(req, res) {
  const { name, description, details } = readBody(req.body);
  if (Object.keys(details).length) return res.status(400).json({ error: 'Validation failed.', details });

  if (await Category.findOne({ name }).collation(IGNORE_CASE)) {
    return res.status(409).json({ error: 'A category with this name already exists.' });
  }
  const category = await Category.create({ name, description });
  res.status(201).json({ category: present(category, 0) });
}

// PUT /api/categories/:id
// Renaming keeps every prompt in the category, because prompts store the category id.
export async function updateCategory(req, res) {
  const category = await findCategory(req, res);
  if (!category) return;

  const { name, description, details } = readBody(req.body);
  if (Object.keys(details).length) return res.status(400).json({ error: 'Validation failed.', details });

  if (await Category.findOne({ name, _id: { $ne: category._id } }).collation(IGNORE_CASE)) {
    return res.status(409).json({ error: 'A category with this name already exists.' });
  }
  category.name = name;
  category.description = description;
  await category.save();
  res.json({ category: present(category, await Prompt.countDocuments({ categoryId: category._id })) });
}

// DELETE /api/categories/:id
// Refused while prompts still use the category, so no prompt is left without one.
export async function deleteCategory(req, res) {
  const category = await findCategory(req, res);
  if (!category) return;

  const inUse = await Prompt.countDocuments({ categoryId: category._id });
  if (inUse > 0) {
    return res.status(409).json({
      error: `"${category.name}" is used by ${inUse} prompt${inUse === 1 ? '' : 's'}. Move or delete them first.`
    });
  }
  await category.deleteOne();
  res.json({ message: 'Category deleted.' });
}
