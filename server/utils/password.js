import bcrypt from 'bcryptjs';

// Higher is slower to hash and harder to crack. 12 takes a fraction of a second.
const SALT_ROUNDS = 12;

export function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// bcrypt only reads the first 72 bytes, and passwords are never allowed to be
// longer, so a longer one can never be correct.
export async function checkPassword(password, passwordHash) {
  if (typeof password !== 'string' || Buffer.byteLength(password) > 72) return false;
  return bcrypt.compare(password, passwordHash);
}
