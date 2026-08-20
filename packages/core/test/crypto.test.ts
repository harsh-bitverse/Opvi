import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validatePasswordPolicy, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, Entitlement } from '@opvi/domain';
import * as domainModule from '@opvi/domain';

import {
  hashPassword,
  verifyPassword,
  needsRehash,
  getEngineDiagnostics,
  setActivePolicy,
  resetActivePolicy,
  validateKdfBounds,
  generateBearerToken,
  hashToken,
  calculateScryptMaxmem,
  InvalidKdfParametersError,
  UnsupportedHashFormatError,
  CryptoEngineError,
  DEFAULT_SCRYPT_FALLBACK_POLICY,
  DEFAULT_KDF_ENVELOPE,
  PasswordHashingPolicy,
} from '../src/index';

describe('Sub-Module 02.1: Domain Contracts & Cryptographic Primitives', () => {
  beforeEach(() => {
    resetActivePolicy();
  });

  afterEach(() => {
    resetActivePolicy();
  });

  // =========================================================================
  // CATEGORY A: CORRECTNESS TESTS
  // =========================================================================
  describe('Category A: Correctness Tests', () => {
    describe('Password Policy Validation', () => {
      it('rejects non-string inputs', () => {
        expect(validatePasswordPolicy(null).isValid).toBe(false);
        expect(validatePasswordPolicy(123456789012345).isValid).toBe(false);
        expect(validatePasswordPolicy(undefined).isValid).toBe(false);
      });

      it('rejects passwords below minimum Unicode code point length (15)', () => {
        const password14 = '12345678901234'; // 14 chars
        const result = validatePasswordPolicy(password14);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain(`at least ${PASSWORD_MIN_LENGTH}`);
      });

      it('accepts passwords at minimum boundary (15 Unicode code points)', () => {
        const password15 = '123456789012345'; // 15 chars
        expect(validatePasswordPolicy(password15).isValid).toBe(true);
      });

      it('correctly counts multi-byte Unicode code points (emojis)', () => {
        // 15 emojis = 15 code points (though UTF-16 string length is 30)
        const emojiPassword = '🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀';
        expect([...emojiPassword].length).toBe(15);
        expect(emojiPassword.length).toBe(30); // UTF-16 code units
        expect(validatePasswordPolicy(emojiPassword).isValid).toBe(true);
      });

      it('rejects passwords exceeding maximum Unicode code point length (128)', () => {
        const password129 = 'a'.repeat(129);
        const result = validatePasswordPolicy(password129);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain(`exceed ${PASSWORD_MAX_LENGTH}`);
      });

      it('accepts passwords at maximum boundary (128 Unicode code points)', () => {
        const password128 = 'a'.repeat(128);
        expect(validatePasswordPolicy(password128).isValid).toBe(true);
      });

      it('preserves opaque strings without trimming or casing mutations', () => {
        const rawPassword = '  PassphraseWithSpacesAndUnicode_🚀_123  ';
        const result = validatePasswordPolicy(rawPassword);
        expect(result.isValid).toBe(true);
      });
    });

    describe('Observable Engine Diagnostics', () => {
      it('returns active backend and current policy', () => {
        const diag = getEngineDiagnostics();
        expect(diag.activeBackend).toMatch(/^(ARGON2ID|SCRYPT)$/);
        expect(diag.activePolicy).toBeDefined();
        expect(diag.activePolicy.algorithm).toBeDefined();
      });
    });

    describe('Password Hashing & Verification (Active Policy)', () => {
      it('hashes a password and verifies it successfully', async () => {
        const password = 'CorrectHorseBatteryStaple123!';
        const encodedHash = await hashPassword(password);

        expect(typeof encodedHash).toBe('string');
        expect(encodedHash.length).toBeGreaterThan(20);

        const isValid = await verifyPassword(password, encodedHash);
        expect(isValid).toBe(true);
      });

      it('rejects an incorrect password during verification', async () => {
        const password = 'CorrectHorseBatteryStaple123!';
        const wrongPassword = 'WrongHorseBatteryStaple123!';
        const encodedHash = await hashPassword(password);

        const isValid = await verifyPassword(wrongPassword, encodedHash);
        expect(isValid).toBe(false);
      });

      it('generates distinct salts and distinct encoded hashes for identical passwords', async () => {
        const password = 'SamePasswordVerification123!';
        const hash1 = await hashPassword(password);
        const hash2 = await hashPassword(password);

        expect(hash1).not.toBe(hash2);
        expect(await verifyPassword(password, hash1)).toBe(true);
        expect(await verifyPassword(password, hash2)).toBe(true);
      });

      it('hashes and verifies using configured scrypt fallback policy', async () => {
        const scryptPolicy: PasswordHashingPolicy = {
          algorithm: 'scrypt',
          cost: 65536,
          blockSize: 8,
          parallelization: 2,
          keyLen: 32,
        };

        const password = 'ScryptFallbackPassphrase123!';
        const hash = await hashPassword(password, scryptPolicy);

        expect(hash.startsWith('$opvi-scrypt$v=1$N=65536,r=8,p=2$')).toBe(true);
        expect(await verifyPassword(password, hash)).toBe(true);
        expect(await verifyPassword('WrongPassword123!', hash)).toBe(false);
      });

      it('derives scrypt maxmem with 2x headroom and baseline 128 MiB floor', () => {
        const maxmem = calculateScryptMaxmem(65536, 8);
        expect(maxmem).toBe(134217728); // 128 MiB
      });
    });

    describe('Token Primitives', () => {
      it('generates 256-bit CSPRNG bearer token (64 hex characters)', () => {
        const token = generateBearerToken();
        expect(typeof token).toBe('string');
        expect(token).toMatch(/^[0-9a-f]{64}$/);
      });

      it('generates unique tokens across 1,000 sample iterations', () => {
        const set = new Set<string>();
        for (let i = 0; i < 1000; i++) {
          set.add(generateBearerToken());
        }
        expect(set.size).toBe(1000);
      });

      it('computes deterministic SHA-256 digest of raw token', () => {
        const token = 'a'.repeat(64);
        const hash1 = hashToken(token);
        const hash2 = hashToken(token);

        expect(hash1).toBe(hash2);
        expect(hash1).toMatch(/^[0-9a-f]{64}$/);
      });

      it('exhibits avalanche effect on 1-character token change', () => {
        const tokenA = '0'.repeat(64);
        const tokenB = '0'.repeat(63) + '1';

        const hashA = hashToken(tokenA);
        const hashB = hashToken(tokenB);

        expect(hashA).not.toBe(hashB);
      });

      it('throws error when hashing empty or invalid token inputs', () => {
        expect(() => hashToken('')).toThrow('non-empty string');
        expect(() => hashToken(123 as unknown as string)).toThrow('non-empty string');
      });
    });

    describe('Policy-Driven Rehash Detection', () => {
      it('returns false when hash matches current active policy', async () => {
        const password = 'RehashTestPassphrase123!';
        const hash = await hashPassword(password);
        expect(needsRehash(hash)).toBe(false);
      });

      it('returns true when hash algorithm differs from active policy', async () => {
        const password = 'RehashTestPassphrase123!';
        const scryptPolicy: PasswordHashingPolicy = {
          algorithm: 'scrypt',
          cost: 65536,
          blockSize: 8,
          parallelization: 2,
          keyLen: 32,
        };
        const scryptHash = await hashPassword(password, scryptPolicy);

        const activeDiag = getEngineDiagnostics();
        if (activeDiag.activeBackend === 'ARGON2ID') {
          expect(needsRehash(scryptHash)).toBe(true);
        }
      });

      it('returns true when stored parameters are lower than active policy parameters', () => {
        const activePolicy: PasswordHashingPolicy = {
          algorithm: 'argon2id',
          memoryCost: 65536,
          timeCost: 3,
          parallelism: 4,
          outputLen: 32,
        };

        const oldHash = '$argon2id$v=19$m=19456,t=2,p=1$c2FsdHNhbHQ$aGFzaGhhc2g';
        expect(needsRehash(oldHash, activePolicy)).toBe(true);
      });
    });
  });

  // =========================================================================
  // CATEGORY B: SECURITY-BOUNDARY & ADVERSARIAL TESTS
  // =========================================================================
  describe('Category B: Security-Boundary & Adversarial Tests', () => {
    describe('KDF Parameter Policy Envelope Enforcement (Pre-KDF DoS Defense)', () => {
      it('rejects Argon2id parameters with memoryCost exceeding envelope maximum BEFORE KDF execution', () => {
        expect(() => {
          validateKdfBounds('argon2id', { memoryCost: 1048576, timeCost: 2, parallelism: 1 });
        }).toThrow(InvalidKdfParametersError);
      });

      it('rejects Argon2id parameters below envelope minimum', () => {
        expect(() => {
          validateKdfBounds('argon2id', { memoryCost: 1024, timeCost: 2, parallelism: 1 });
        }).toThrow(InvalidKdfParametersError);
      });

      it('rejects Argon2id timeCost exceeding envelope maximum', () => {
        expect(() => {
          validateKdfBounds('argon2id', { memoryCost: 19456, timeCost: 100, parallelism: 1 });
        }).toThrow(InvalidKdfParametersError);
      });

      it('rejects scrypt parameters with N (cost) exceeding envelope maximum BEFORE KDF execution', () => {
        expect(() => {
          validateKdfBounds('scrypt', { cost: 1048576, blockSize: 8, parallelization: 2 });
        }).toThrow(InvalidKdfParametersError);
      });

      it('rejects scrypt parameters below envelope minimum', () => {
        expect(() => {
          validateKdfBounds('scrypt', { cost: 1024, blockSize: 8, parallelization: 2 });
        }).toThrow(InvalidKdfParametersError);
      });

      it('rejects verification of stored Argon2id hash containing out-of-bounds memory parameters before KDF call', async () => {
        const outOfBoundsHash = '$argon2id$v=19$m=1048576,t=2,p=1$c2FsdHNhbHQ$aGFzaGhhc2g';
        await expect(verifyPassword('TestPassword123!', outOfBoundsHash)).rejects.toThrow(InvalidKdfParametersError);
      });

      it('rejects verification of stored scrypt hash containing out-of-bounds N parameters before KDF call', async () => {
        const outOfBoundsHash = '$opvi-scrypt$v=1$N=1048576,r=8,p=2$00112233445566778899aabbccddeeff$00112233445566778899aabbccddeeff';
        await expect(verifyPassword('TestPassword123!', outOfBoundsHash)).rejects.toThrow(InvalidKdfParametersError);
      });
    });

    describe('Malformed Hash & Algorithm Rejection', () => {
      it('rejects unsupported legacy hash algorithms (md5, sha1, bcrypt, plain text)', async () => {
        const md5Hash = '$1$salt$hash';
        const bcryptHash = '$2a$10$abcdefghijklmnopqrstuu';
        const plainText = 'PlainPassword123!';

        await expect(verifyPassword('pass', md5Hash)).rejects.toThrow(UnsupportedHashFormatError);
        await expect(verifyPassword('pass', bcryptHash)).rejects.toThrow(UnsupportedHashFormatError);
        await expect(verifyPassword('pass', plainText)).rejects.toThrow(UnsupportedHashFormatError);
      });

      it('rejects malformed or truncated Argon2id hashes safely without crashing', async () => {
        const malformed1 = '$argon2id$v=19$invalidparams$salt$hash';
        const malformed2 = '$argon2id$v=19';

        await expect(verifyPassword('pass', malformed1)).rejects.toThrow(UnsupportedHashFormatError);
        await expect(verifyPassword('pass', malformed2)).rejects.toThrow(UnsupportedHashFormatError);
      });

      it('rejects malformed scrypt hashes safely without crashing', async () => {
        const malformed1 = '$opvi-scrypt$v=2$N=65536,r=8,p=2$salt$key';
        const malformed2 = '$opvi-scrypt$v=1$N=65536$salt';

        await expect(verifyPassword('pass', malformed1)).rejects.toThrow(UnsupportedHashFormatError);
        await expect(verifyPassword('pass', malformed2)).rejects.toThrow(UnsupportedHashFormatError);
      });
    });

    describe('Non-Silent Runtime Failure Boundaries', () => {
      it('does NOT silently downgrade to scrypt if Argon2id is active and receives invalid policy algorithm', async () => {
        const invalidPolicy = { algorithm: 'invalid-algo' } as unknown as PasswordHashingPolicy;
        await expect(hashPassword('TestPass123!', invalidPolicy)).rejects.toThrow(UnsupportedHashFormatError);
      });
    });

    describe('Package Boundary & Credential Leak Isolation', () => {
      it('verifies @opvi/domain exports zero sensitive security primitives or credential hashes', () => {
        const exportedKeys = Object.keys(domainModule);

        // Ensure no internal cryptographic functions or credential storage names leak to domain
        expect(exportedKeys).not.toContain('hashPassword');
        expect(exportedKeys).not.toContain('verifyPassword');
        expect(exportedKeys).not.toContain('passwordHash');
        expect(exportedKeys).not.toContain('generateBearerToken');
        expect(exportedKeys).not.toContain('hashToken');
        expect(exportedKeys).not.toContain('scryptSync');

        // Confirm legitimate domain contracts are exported
        expect(exportedKeys).toContain('Entitlement');
        expect(exportedKeys).toContain('validatePasswordPolicy');
        expect(exportedKeys).toContain('PASSWORD_MIN_LENGTH');
      });
    });
  });
});
