import { PasswordHashingPolicy } from './types';
import { hashPassword } from './password';

export interface BenchmarkResult {
  policy: PasswordHashingPolicy;
  iterations: number;
  totalDurationMs: number;
  avgDurationMs: number;
}

/**
 * Benchmark password hashing execution latency on the target environment.
 * Used during infrastructure setup / deployment calibration.
 */
export async function benchmarkHashing(
  policy: PasswordHashingPolicy,
  iterations: number = 3
): Promise<BenchmarkResult> {
  const samplePassword = 'BenchmarkPassphrase123!';
  const startTime = Date.now();

  for (let i = 0; i < iterations; i++) {
    await hashPassword(samplePassword, policy);
  }

  const totalDurationMs = Date.now() - startTime;
  const avgDurationMs = totalDurationMs / iterations;

  return {
    policy,
    iterations,
    totalDurationMs,
    avgDurationMs,
  };
}
