export interface Argon2idPolicy {
  algorithm: 'argon2id';
  memoryCost: number; // in KiB (e.g. 19456 = 19 MB)
  timeCost: number;   // iterations (e.g. 2)
  parallelism: number;// threads (e.g. 1)
  outputLen: number;  // bytes (e.g. 32)
}

export interface ScryptPolicy {
  algorithm: 'scrypt';
  cost: number;       // N (e.g. 65536)
  blockSize: number;  // r (e.g. 8)
  parallelization: number; // p (e.g. 2)
  keyLen: number;     // bytes (e.g. 32)
  maxmem?: number;    // optional override, derived automatically if omitted
}

export type PasswordHashingPolicy = Argon2idPolicy | ScryptPolicy;

export interface KdfPolicyEnvelope {
  argon2id: {
    minMemoryCost: number; // KiB (e.g. 7168 KiB)
    maxMemoryCost: number; // KiB (e.g. 131072 KiB / 128 MB)
    minTimeCost: number;   // e.g. 1
    maxTimeCost: number;   // e.g. 10
    minParallelism: number;// e.g. 1
    maxParallelism: number;// e.g. 8
  };
  scrypt: {
    minCost: number; // N (e.g. 8192)
    maxCost: number; // N (e.g. 131072)
    minBlockSize: number; // r (e.g. 8)
    maxBlockSize: number; // r (e.g. 16)
    minParallelization: number; // p (e.g. 1)
    maxParallelization: number; // p (e.g. 10)
  };
}

export interface EngineDiagnostics {
  activeBackend: 'ARGON2ID' | 'SCRYPT';
  activePolicy: PasswordHashingPolicy;
}

// Initial OWASP-aligned baseline policy (Argon2id general web server option)
export const DEFAULT_ACTIVE_HASHING_POLICY: Argon2idPolicy = {
  algorithm: 'argon2id',
  memoryCost: 19456, // 19 MB
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
};

// Initial scrypt fallback baseline policy (OWASP-listed 64 MiB option)
export const DEFAULT_SCRYPT_FALLBACK_POLICY: ScryptPolicy = {
  algorithm: 'scrypt',
  cost: 65536,
  blockSize: 8,
  parallelization: 2,
  keyLen: 32,
};

// Initial defensive policy envelope
export const DEFAULT_KDF_ENVELOPE: KdfPolicyEnvelope = {
  argon2id: {
    minMemoryCost: 7168,
    maxMemoryCost: 131072,
    minTimeCost: 1,
    maxTimeCost: 10,
    minParallelism: 1,
    maxParallelism: 8,
  },
  scrypt: {
    minCost: 8192,
    maxCost: 131072,
    minBlockSize: 8,
    maxBlockSize: 16,
    minParallelization: 1,
    maxParallelization: 10,
  },
};

/**
 * Calculates scrypt maxmem with safe operational headroom.
 * Theoretical single-matrix requirement: 128 * N * r bytes.
 * Adds 2x operational headroom with a baseline floor of 128 MiB (134,217,728 bytes).
 */
export function calculateScryptMaxmem(cost: number, blockSize: number): number {
  const theoreticalBytes = 128 * cost * blockSize;
  return Math.max(theoreticalBytes * 2, 128 * 1024 * 1024);
}

export class InvalidKdfParametersError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidKdfParametersError';
  }
}

export class UnsupportedHashFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedHashFormatError';
  }
}

export class CryptoEngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CryptoEngineError';
  }
}
