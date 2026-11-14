import User from '../models/User.js';
import { createToken } from '../utils/token.js';
import { hashPassword, checkPassword } from '../utils/password.js';

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

  const passwordHash = await hashPassword(password);

  // Only these fields are saved. A "role" sent by the client is ignored,
  // so every new account is a member.
  const user = await User.create({ name, email, passwordHash });

  // Return a login token too, so the user is signed in straight after registering.
  res.status(201).json({ message: 'Registration successful.', token: createToken(user), user });
}

// POST /api/auth/login
// The request body has already been checked by validateLogin.
export async function login(req, res) {
  const email = req.body.email.trim().toLowerCase();
  const { password } = req.body;

  // passwordHash is hidden by default (select: false), so request it here.
  const user = await User.findOne({ email }).select('+passwordHash');

  // Same message for a wrong email or a wrong password.
  if (!user || !(await checkPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  res.json({ message: 'Login successful.', token: createToken(user), user });
}
