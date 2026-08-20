import crypto from 'node:crypto';

/**
 * Generates a 256-bit cryptographically secure random bearer token.
 * Output: 64-character hexadecimal string representing 32 CSPRNG bytes.
 */
export function generateBearerToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Computes a deterministic SHA-256 digest of a raw token for breach-resistant storage.
 * Output: 64-character hexadecimal SHA-256 hash string.
 */
export function hashToken(rawToken: string): string {
  if (typeof rawToken !== 'string' || rawToken.length === 0) {
    throw new Error('Token must be a non-empty string.');
  }
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}
