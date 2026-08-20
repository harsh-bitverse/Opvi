export interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
}

export const PASSWORD_MIN_LENGTH = 15;
export const PASSWORD_MAX_LENGTH = 128;

/**
 * Validates password acceptance policy according to OPVI security invariants:
 * - Minimum 15 Unicode code points
 * - Maximum 128 Unicode code points
 * - Must be a string
 * - Passwords are treated strictly as opaque strings (no trimming, lowercasing, or normalization)
 */
export function validatePasswordPolicy(password: unknown): PasswordValidationResult {
  if (typeof password !== 'string') {
    return {
      isValid: false,
      error: 'Password must be a string.',
    };
  }

  // Measure length in terms of Unicode code points using spread operator
  const codePointCount = [...password].length;

  if (codePointCount < PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
    };
  }

  if (codePointCount > PASSWORD_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Password must not exceed ${PASSWORD_MAX_LENGTH} characters.`,
    };
  }

  return { isValid: true };
}
