import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

/**
 * Hash a plaintext password with a per-password random salt using scrypt.
 * The returned string encodes both salt and derived key: `salt:hash` (hex).
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, KEY_LENGTH).toString('hex');

  return `${salt}:${derived}`;
}

/** Verify a plaintext password against a stored `salt:hash` value. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');

  if (!salt || !hash) {
    return false;
  }

  const derived = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(hash, 'hex');

  if (derived.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(derived, expected);
}
