import jwt from 'jsonwebtoken';

const ALGORITHM = 'HS256';
const DEFAULT_EXPIRES_IN = '2h';

function expiresIn() {
  return process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRES_IN;
}

// Called once when the server starts, so a bad setting stops the server
// immediately instead of breaking every login later.
export function checkTokenSettings() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set in server/.env and be at least 32 characters long.');
  }
  try {
    jwt.sign({}, secret, { algorithm: ALGORITHM, expiresIn: expiresIn() });
  } catch {
    throw new Error('JWT_EXPIRES_IN must be a time span with a unit, such as 30m, 2h or 1d.');
  }
}

// Creates a signed login token for a user.
// "sub" (subject) is the standard JWT field for who the token belongs to.
export function createToken(user) {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: expiresIn()
  });
}

// Returns the token's contents, or throws if the token is invalid or expired.
export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, { algorithms: [ALGORITHM] });
}
