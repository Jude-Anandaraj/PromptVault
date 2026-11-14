import User from '../models/User.js';
import { verifyToken } from '../utils/token.js';

// Lets a request through only if it carries a valid login token:
//   Authorization: Bearer <token>
// Sets req.user to the logged-in user (without the password hash).
export async function protect(req, res, next) {
  const match = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization ?? '');
  if (!match) {
    return res.status(401).json({ error: 'You must be logged in. Send the token as "Authorization: Bearer <token>".' });
  }

  let payload;
  try {
    payload = verifyToken(match[1]);
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Your session has expired. Please log in again.'
      : 'Invalid token. Please log in again.';
    return res.status(401).json({ error: message });
  }

  // A token stays valid until it expires, so check that the account still exists.
  const user = await User.findById(payload.sub);
  if (!user) {
    return res.status(401).json({ error: 'This account no longer exists.' });
  }

  req.user = user;
  next();
}

// Use after protect. Lets the request through only if the logged-in user is an admin.
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can do this.' });
  }
  next();
}
