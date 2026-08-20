import { Algorithm } from '@node-rs/argon2';
import crypto from 'node:crypto';
import {
  Argon2idPolicy,
  ScryptPolicy,
  PasswordHashingPolicy,
  KdfPolicyEnvelope,
  EngineDiagnostics,
  DEFAULT_ACTIVE_HASHING_POLICY,
  DEFAULT_SCRYPT_FALLBACK_POLICY,
  DEFAULT_KDF_ENVELOPE,
  calculateScryptMaxmem,
  InvalidKdfParametersError,
  UnsupportedHashFormatError,
  CryptoEngineError,
} from './types';

// Native Argon2id module reference (probe on startup)
let argon2Module: typeof import('@node-rs/argon2') | null = null;
let activeBackend: 'ARGON2ID' | 'SCRYPT' = 'SCRYPT';
let activePolicy: PasswordHashingPolicy = DEFAULT_SCRYPT_FALLBACK_POLICY;

// Capability detection at startup
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const argon2 = require('@node-rs/argon2');
  if (argon2 && typeof argon2.hash === 'function') {
    argon2Module = argon2;
    activeBackend = 'ARGON2ID';
    activePolicy = DEFAULT_ACTIVE_HASHING_POLICY;
  }
} catch {
  // Argon2id native binary unavailable on platform — configured fallback is active
  activeBackend = 'SCRYPT';
  activePolicy = DEFAULT_SCRYPT_FALLBACK_POLICY;
}

/**
 * Returns diagnostic metadata regarding current active backend and policy.
 */
export function getEngineDiagnostics(): EngineDiagnostics {
  return {
    activeBackend,
    activePolicy: { ...activePolicy },
  };
}

/**
 * Configures current active password-hashing policy (used for testing or deployment policy override).
 */
export function setActivePolicy(policy: PasswordHashingPolicy): void {
  activePolicy = { ...policy };
}

/**
 * Reset active policy to system default based on active backend.
 */
export function resetActivePolicy(): void {
  activePolicy = activeBackend === 'ARGON2ID'
    ? { ...DEFAULT_ACTIVE_HASHING_POLICY }
    : { ...DEFAULT_SCRYPT_FALLBACK_POLICY };
}

/**
 * Validates parsed KDF parameters against the defensive policy envelope BEFORE calling KDF.
 * Throws InvalidKdfParametersError if parameters exceed safe bounds.
 */
export function validateKdfBounds(
  algorithm: 'argon2id' | 'scrypt',
  params: { memoryCost?: number; timeCost?: number; parallelism?: number; cost?: number; blockSize?: number; parallelization?: number },
  envelope: KdfPolicyEnvelope = DEFAULT_KDF_ENVELOPE
): void {
  if (algorithm === 'argon2id') {
    const mem = params.memoryCost ?? 0;
    const time = params.timeCost ?? 0;
    const par = params.parallelism ?? 0;

    if (
      mem < envelope.argon2id.minMemoryCost ||
      mem > envelope.argon2id.maxMemoryCost ||
      time < envelope.argon2id.minTimeCost ||
      time > envelope.argon2id.maxTimeCost ||
      par < envelope.argon2id.minParallelism ||
      par > envelope.argon2id.maxParallelism
    ) {
      throw new InvalidKdfParametersError(
        `Argon2id parameters out of safe bounds: m=${mem}, t=${time}, p=${par}`
      );
    }
  } else if (algorithm === 'scrypt') {
    const N = params.cost ?? 0;
    const r = params.blockSize ?? 0;
    const p = params.parallelization ?? 0;

    if (
      N < envelope.scrypt.minCost ||
      N > envelope.scrypt.maxCost ||
      r < envelope.scrypt.minBlockSize ||
      r > envelope.scrypt.maxBlockSize ||
      p < envelope.scrypt.minParallelization ||
      p > envelope.scrypt.maxParallelization
    ) {
      throw new InvalidKdfParametersError(
        `scrypt parameters out of safe bounds: N=${N}, r=${r}, p=${p}`
      );
    }
  } else {
    throw new UnsupportedHashFormatError(`Unsupported algorithm: ${algorithm}`);
  }
}

/**
 * Hashes a password using the current active backend and policy.
 */
export async function hashPassword(
  password: string,
  policy: PasswordHashingPolicy = activePolicy
): Promise<string> {
  if (typeof password !== 'string') {
    throw new Error('Password must be a string.');
  }

  if (policy.algorithm === 'argon2id') {
    if (activeBackend !== 'ARGON2ID' || !argon2Module) {
      throw new CryptoEngineError(
        'Argon2id requested but native Argon2id backend is unavailable on this system.'
      );
    }
    try {
      validateKdfBounds('argon2id', policy);
      return await argon2Module.hash(password, {
        memoryCost: policy.memoryCost,
        timeCost: policy.timeCost,
        parallelism: policy.parallelism,
        outputLen: policy.outputLen,
        algorithm: 2 as unknown as Algorithm,
      });
    } catch (err) {
      if (err instanceof InvalidKdfParametersError) throw err;
      throw new CryptoEngineError(
        `Argon2id execution failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  } else if (policy.algorithm === 'scrypt') {
    try {
      validateKdfBounds('scrypt', policy);
      const salt = crypto.randomBytes(16);
      const keyLen = policy.keyLen ?? 32;
      const maxmem = policy.maxmem ?? calculateScryptMaxmem(policy.cost, policy.blockSize);

      const derivedKey = crypto.scryptSync(password, salt, keyLen, {
        N: policy.cost,
        r: policy.blockSize,
        p: policy.parallelization,
        maxmem,
      });

      const saltHex = salt.toString('hex');
      const keyHex = derivedKey.toString('hex');

      return `$opvi-scrypt$v=1$N=${policy.cost},r=${policy.blockSize},p=${policy.parallelization}$${saltHex}$${keyHex}`;
    } catch (err) {
      if (err instanceof InvalidKdfParametersError) throw err;
      throw new CryptoEngineError(
        `scrypt execution failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  } else {
    throw new UnsupportedHashFormatError(`Unsupported algorithm policy: ${(policy as { algorithm: string }).algorithm}`);
  }
}

/**
 * Verifies a candidate password against an encoded hash string.
 * Dispatches by hash prefix ($argon2id$ vs $opvi-scrypt$) and performs constant-time equality check.
 */
export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  if (typeof password !== 'string' || typeof encodedHash !== 'string') {
    return false;
  }

  if (encodedHash.startsWith('$argon2id$')) {
    if (activeBackend !== 'ARGON2ID' || !argon2Module) {
      throw new CryptoEngineError(
        'Argon2id verification requested but native Argon2id backend is unavailable on this system.'
      );
    }
    // Parse Argon2id parameters to validate bounds BEFORE calling KDF
    // Format: $argon2id$v=19$m=19456,t=2,p=1$...
    const parts = encodedHash.split('$');
    if (parts.length < 5) {
      throw new UnsupportedHashFormatError('Malformed Argon2id hash structure.');
    }
    const paramPart = parts[3]; // e.g. "m=19456,t=2,p=1"
    const paramsMap = new Map<string, number>();
    for (const item of paramPart.split(',')) {
      const [k, v] = item.split('=');
      if (k && v) paramsMap.set(k, parseInt(v, 10));
    }

    const memoryCost = paramsMap.get('m');
    const timeCost = paramsMap.get('t');
    const parallelism = paramsMap.get('p');

    if (!memoryCost || !timeCost || !parallelism || isNaN(memoryCost) || isNaN(timeCost) || isNaN(parallelism)) {
      throw new UnsupportedHashFormatError('Malformed Argon2id parameters.');
    }

    // Bounds check BEFORE invoking KDF
    validateKdfBounds('argon2id', { memoryCost, timeCost, parallelism });

    try {
      return await argon2Module.verify(encodedHash, password);
    } catch (err) {
      throw new CryptoEngineError(
        `Argon2id verification error: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  } else if (encodedHash.startsWith('$opvi-scrypt$')) {
    // Format: $opvi-scrypt$v=1$N=65536,r=8,p=2$<saltHex>$<keyHex>
    const parts = encodedHash.split('$');
    if (parts.length !== 6) {
      throw new UnsupportedHashFormatError('Malformed OPVI scrypt hash structure.');
    }
    const versionPart = parts[2]; // "v=1"
    if (versionPart !== 'v=1') {
      throw new UnsupportedHashFormatError(`Unsupported scrypt version: ${versionPart}`);
    }

    const paramPart = parts[3]; // "N=65536,r=8,p=2"
    const paramsMap = new Map<string, number>();
    for (const item of paramPart.split(',')) {
      const [k, v] = item.split('=');
      if (k && v) paramsMap.set(k, parseInt(v, 10));
    }

    const N = paramsMap.get('N');
    const r = paramsMap.get('r');
    const p = paramsMap.get('p');

    if (!N || !r || !p || isNaN(N) || isNaN(r) || isNaN(p)) {
      throw new UnsupportedHashFormatError('Malformed scrypt parameters.');
    }

    // Bounds check BEFORE invoking KDF
    validateKdfBounds('scrypt', { cost: N, blockSize: r, parallelization: p });

    const saltHex = parts[4];
    const expectedKeyHex = parts[5];

    if (!saltHex || !expectedKeyHex || saltHex.length === 0 || expectedKeyHex.length === 0) {
      throw new UnsupportedHashFormatError('Malformed salt or key hex in scrypt hash.');
    }

    const saltBuffer = Buffer.from(saltHex, 'hex');
    const expectedKeyBuffer = Buffer.from(expectedKeyHex, 'hex');
    const maxmem = calculateScryptMaxmem(N, r);

    const derivedKey = crypto.scryptSync(password, saltBuffer, expectedKeyBuffer.length, {
      N,
      r,
      p,
      maxmem,
    });

    if (derivedKey.length !== expectedKeyBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(derivedKey, expectedKeyBuffer);
  } else {
    throw new UnsupportedHashFormatError('Unsupported or invalid hash format header.');
  }
}

/**
 * Determines whether a stored password hash requires re-hashing based on current active policy.
 */
export function needsRehash(
  encodedHash: string,
  policy: PasswordHashingPolicy = activePolicy
): boolean {
  if (policy.algorithm === 'argon2id') {
    if (!encodedHash.startsWith('$argon2id$')) {
      return true; // Algorithm mismatch (e.g. scrypt -> argon2id)
    }
    const parts = encodedHash.split('$');
    if (parts.length < 4) return true;
    const paramPart = parts[3];
    const paramsMap = new Map<string, number>();
    for (const item of paramPart.split(',')) {
      const [k, v] = item.split('=');
      if (k && v) paramsMap.set(k, parseInt(v, 10));
    }

    const m = paramsMap.get('m') ?? 0;
    const t = paramsMap.get('t') ?? 0;
    const p = paramsMap.get('p') ?? 0;

    return m < policy.memoryCost || t < policy.timeCost || p < policy.parallelism;
  } else if (policy.algorithm === 'scrypt') {
    if (!encodedHash.startsWith('$opvi-scrypt$')) {
      return true; // Algorithm mismatch
    }
    const parts = encodedHash.split('$');
    if (parts.length < 4) return true;
    const paramPart = parts[3];
    const paramsMap = new Map<string, number>();
    for (const item of paramPart.split(',')) {
      const [k, v] = item.split('=');
      if (k && v) paramsMap.set(k, parseInt(v, 10));
    }

    const N = paramsMap.get('N') ?? 0;
    const r = paramsMap.get('r') ?? 0;
    const p = paramsMap.get('p') ?? 0;

    return N < policy.cost || r < policy.blockSize || p < policy.parallelization;
  }

  return true;
}
