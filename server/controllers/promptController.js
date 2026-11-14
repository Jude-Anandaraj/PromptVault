import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Prompt, { PLATFORMS } from '../models/Prompt.js';

// Shape the current React pages already read:
// category is a name, author has _id and name, the prompt keeps _id.
function present(prompt) {
  const author = prompt.userId;
  return {
    _id: prompt._id,
    title: prompt.title,
    description: prompt.description,
    content: prompt.content,
    category: prompt.categoryId?.name || '',
    platform: prompt.platform,
    tags: prompt.tags,
    author: author
      ? { _id: author._id, name: author.name }
      : null,
    createdAt: prompt.createdAt,
    updatedAt: prompt.updatedAt
  };
}

function cleanTags(value) {
  if (value == null || value === '') return [];
  const list = Array.isArray(value) ? value : String(value).split(',');
  return list.map((tag) => String(tag).trim()).filter(Boolean);
}

function badId(id) {
  return !mongoose.isValidObjectId(id);
}

async function loadPrompt(id) {
  return Prompt.findById(id).populate('userId', 'name').populate('categoryId', 'name');
}

// GET /api/prompts?q=&category=&platform=
export async function listPrompts(req, res) {
  const { q = '', category = '', platform = '' } = req.query;
  const filter = {};

  if (category && category !== 'All') {
    const match = await Category.findOne({ name: category });
    if (!match) return res.json({ prompts: [] });
    filter.categoryId = match._id;
  }

  if (platform) {
    if (!PLATFORMS.includes(platform)) {
      return res.status(400).json({ error: 'That platform is not supported.' });
    }
    filter.platform = platform;
  }

  const text = String(q).trim();
  if (text) {
    const safe = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(safe, 'i');
    filter.$or = [{ title: pattern }, { description: pattern }, { tags: pattern }];
  }

  const rows = await Prompt.find(filter)
    .populate('userId', 'name')
    .populate('categoryId', 'name')
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ prompts: rows.map(present) });
}

// GET /api/prompts/:id
export async function getPrompt(req, res) {
  if (badId(req.params.id)) {
    return res.status(400).json({ error: 'That prompt id is not valid.' });
  }
  const prompt = await loadPrompt(req.params.id);
  if (!prompt) return res.status(404).json({ error: 'Prompt not found.' });
  res.json({ prompt: present(prompt) });
}

async function readBody(body) {
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  const content = String(body.content || '').trim();
  const categoryName = String(body.category || '').trim();
  const tags = cleanTags(body.tags);
  const platform = body.platform ? String(body.platform).trim() : 'General';

  const details = {};
  if (!title) details.title = 'Title is required.';
  if (!description) details.description = 'Description is required.';
  if (!content) details.content = 'Prompt text is required.';
  if (!categoryName) details.category = 'Category is required.';
  if (body.platform && !PLATFORMS.includes(platform)) {
    details.platform = 'That platform is not supported.';
  }
  if (Object.keys(details).length) {
    return { error: { status: 400, body: { error: 'Validation failed.', details } } };
  }

  const category = await Category.findOne({ name: categoryName });
  if (!category) {
    return { error: { status: 400, body: { error: 'Choose a category from the list.' } } };
  }

  return { value: { title, description, content, tags, platform, categoryId: category._id } };
}

function sendKnown(res, error) {
  return res.status(error.status).json(error.body);
}

// POST /api/prompts
export async function createPrompt(req, res) {
  const parsed = await readBody(req.body || {});
  if (parsed.error) return sendKnown(res, parsed.error);

  const prompt = await Prompt.create({
    ...parsed.value,
    userId: req.user._id
  });
  const saved = await loadPrompt(prompt._id);
  res.status(201).json({ prompt: present(saved) });
}

function owns(prompt, user) {
  return String(prompt.userId._id || prompt.userId) === String(user._id) || user.role === 'admin';
}

// PUT /api/prompts/:id
export async function updatePrompt(req, res) {
  if (badId(req.params.id)) {
    return res.status(400).json({ error: 'That prompt id is not valid.' });
  }
  const prompt = await loadPrompt(req.params.id);
  if (!prompt) return res.status(404).json({ error: 'Prompt not found.' });
  if (!owns(prompt, req.user)) {
    return res.status(403).json({ error: 'You can only edit your own prompts.' });
  }

  const parsed = await readBody(req.body || {});
  if (parsed.error) return sendKnown(res, parsed.error);

  prompt.title = parsed.value.title;
  prompt.description = parsed.value.description;
  prompt.content = parsed.value.content;
  prompt.tags = parsed.value.tags;
  prompt.platform = parsed.value.platform;
  prompt.categoryId = parsed.value.categoryId;
  await prompt.save();

  const saved = await loadPrompt(prompt._id);
  res.json({ prompt: present(saved) });
}

// DELETE /api/prompts/:id
export async function deletePrompt(req, res) {
  if (badId(req.params.id)) {
    return res.status(400).json({ error: 'That prompt id is not valid.' });
  }
  const prompt = await Prompt.findById(req.params.id);
  if (!prompt) return res.status(404).json({ error: 'Prompt not found.' });
  if (String(prompt.userId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You can only delete your own prompts.' });
  }
  await prompt.deleteOne();
  res.json({ message: 'Prompt deleted.' });
}
