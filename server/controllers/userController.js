import User from '../models/User.js';
import Prompt from '../models/Prompt.js';
import { hashPassword, checkPassword } from '../utils/password.js';

// All routes here require login. The protect middleware has already
// loaded the logged-in user into req.user.

// GET /api/users/profile
export function getProfile(req, res) {
  res.json({ user: req.user });
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
