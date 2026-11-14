import { EMAIL_PATTERN } from '../models/User.js';

function sendErrors(errors, res, next) {
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed.', details: errors });
  }
  next();
}

// Checks PUT /api/users/profile. Every field is optional, but at least one
// of name, email or newPassword must be sent.
export function validateProfileUpdate(req, res, next) {
  const { name, email, newPassword, currentPassword } = req.body ?? {};

  if (name === undefined && email === undefined && newPassword === undefined) {
    return res.status(400).json({ error: 'Send at least one of name, email or newPassword.' });
  }

  const errors = {};
  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50)) {
    errors.name = 'Name must be 2 to 50 characters.';
  }
  if (email !== undefined && (typeof email !== 'string' || email.trim().length > 254 || !EMAIL_PATTERN.test(email.trim()))) {
    errors.email = 'Enter a valid email address.';
  }
  // bcrypt ignores everything after the first 72 bytes, so longer passwords are rejected.
  if (newPassword !== undefined && (typeof newPassword !== 'string' || newPassword.length < 8 || Buffer.byteLength(newPassword) > 72)) {
    errors.newPassword = 'New password must be 8 to 72 characters.';
  }
  if (currentPassword !== undefined && typeof currentPassword !== 'string') {
    errors.currentPassword = 'Current password must be text.';
  }
  sendErrors(errors, res, next);
}

// Checks DELETE /api/users/profile: the password is needed to confirm.
export function validateAccountDelete(req, res, next) {
  const { password } = req.body ?? {};
  const errors = {};
  if (typeof password !== 'string' || password === '') {
    errors.password = 'Enter your password to confirm.';
  }
  sendErrors(errors, res, next);
}
