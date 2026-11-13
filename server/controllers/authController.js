import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Higher is slower to hash and harder to crack. 12 takes a fraction of a second.
const SALT_ROUNDS = 12;

// POST /api/auth/register
// The request body has already been checked by validateRegister.
export async function register(req, res) {
  const name = req.body.name.trim();
  const email = req.body.email.trim().toLowerCase();
  const { password } = req.body;

  // Quick check for a clear message. If two requests race past this check,
  // the unique index on email still blocks the second one (see errorHandler.js).
  if (await User.exists({ email })) {
    return res.status(409).json({ error: 'This email is already in use.' });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Only these fields are saved. A "role" sent by the client is ignored,
  // so every new account is a member.
  const user = await User.create({ name, email, passwordHash });

  res.status(201).json({ message: 'Registration successful.', user });
}
