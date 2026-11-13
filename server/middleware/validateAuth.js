import { EMAIL_PATTERN } from '../models/User.js';

function isBlank(value) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

// Checks the registration data before it reaches the controller.
// If anything is wrong, responds 400 with one message per invalid field.
export function validateRegister(req, res, next) {
  const { name, email, password } = req.body ?? {};
  const errors = {};

  if (isBlank(name)) {
    errors.name = 'Name is required.';
  } else if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50) {
    errors.name = 'Name must be 2 to 50 characters.';
  }

  if (isBlank(email)) {
    errors.email = 'Email is required.';
  } else if (typeof email !== 'string' || email.trim().length > 254 || !EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  // bcrypt ignores everything after the first 72 bytes, so longer passwords are rejected.
  if (isBlank(password)) {
    errors.password = 'Password is required.';
  } else if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password) > 72) {
    errors.password = 'Password must be 8 to 72 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed.', details: errors });
  }
  next();
}
