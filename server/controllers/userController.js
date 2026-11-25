import User from '../models/User.js';
import Prompt from '../models/Prompt.js';
import mongoose from 'mongoose';
import { hashPassword, checkPassword } from '../utils/password.js';

function presentPrompt(prompt) {
  const author = prompt.userId;
  return {
    _id: prompt._id,
    title: prompt.title,
    description: prompt.description,
    content: prompt.content,
    category: prompt.categoryId?.name || '',
    platform: prompt.platform,
    tags: prompt.tags,
    author: author ? { _id: author._id, name: author.name } : null,
    createdAt: prompt.createdAt,
    updatedAt: prompt.updatedAt
  };
}

async function promptsFor(userId) {
  const prompts = await Prompt.find({ userId })
    .populate('userId', 'name')
    .populate('categoryId', 'name')
    .sort({ createdAt: -1 })
    .limit(50);
  return prompts.map(presentPrompt);
}

// All routes here require login. The protect middleware has already
// loaded the logged-in user into req.user.

// GET /api/users/profile
export function getProfile(req, res) {
  res.json({ user: req.user });
}

// GET /api/users/profile/prompts
export async function getMyPrompts(req, res) {
  res.json({ prompts: await promptsFor(req.user._id) });
}

// GET /api/users
export async function listMembers(req, res) {
  const [users, promptCounts] = await Promise.all([
    User.find().select('name createdAt').sort({ name: 1 }),
    Prompt.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } }
    ])
  ]);
  const countsByUser = new Map(promptCounts.map(({ _id, count }) => [String(_id), count]));
  res.json({
    users: users.map((user) => ({
      id: user._id,
      name: user.name,
      createdAt: user.createdAt,
      promptCount: countsByUser.get(String(user._id)) || 0
    }))
  });
}

// GET /api/users/:id
export async function getMember(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'That member id is not valid.' });
  }
  const user = await User.findById(req.params.id).select('name createdAt');
  if (!user) return res.status(404).json({ error: 'Member not found.' });

  const [prompts, promptCount] = await Promise.all([
    promptsFor(user._id),
    Prompt.countDocuments({ userId: user._id })
  ]);
  res.json({
    user: { id: user._id, name: user.name, createdAt: user.createdAt, promptCount },
    prompts
  });
}

// PUT /api/users/profile
// The request body has already been checked by validateProfileUpdate.
export async function updateProfile(req, res) {
  const { name, email, newPassword, currentPassword } = req.body;

  // passwordHash is hidden by default (select: false), so request it here.
  const user = await User.findById(req.user._id).select('+passwordHash');

  const newEmail = email?.trim().toLowerCase();
  const emailChanging = newEmail !== undefined && newEmail !== user.email;

  // Changing the email or password needs the current password,
  // so a stolen login token alone can't take over the account.
  if ((emailChanging || newPassword !== undefined) && !(await checkPassword(currentPassword, user.passwordHash))) {
    return res.status(403).json({ error: 'Current password is incorrect.' });
  }

  if (emailChanging && (await User.exists({ email: newEmail }))) {
    return res.status(409).json({ error: 'This email is already in use.' });
  }

  if (name !== undefined) user.name = name.trim();
  if (emailChanging) user.email = newEmail;
  if (newPassword !== undefined) user.passwordHash = await hashPassword(newPassword);
  await user.save();

  res.json({ message: 'Profile updated.', user });
}

// DELETE /api/users/profile
// Deletes the account and every prompt it created.
// The request body has already been checked by validateAccountDelete.
export async function deleteAccount(req, res) {
  const user = await User.findById(req.user._id).select('+passwordHash');

  if (!(await checkPassword(req.body.password, user.passwordHash))) {
    return res.status(403).json({ error: 'Password is incorrect.' });
  }

  const { deletedCount } = await Prompt.deleteMany({ userId: user._id });
  await user.deleteOne();

  res.json({ message: 'Account deleted.', promptsDeleted: deletedCount });
}
