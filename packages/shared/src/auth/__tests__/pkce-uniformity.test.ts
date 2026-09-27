import { describe, it, expect } from 'vitest';
import { generatePKCE } from '../pkce';

// RFC 7636 verifier charset — must stay in sync with generateRandomString in ../pkce.ts
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
const CHAR_SET = new Set(CHARSET.split(''));

describe('generatePKCE (PRNG rejection sampling — no modulo bias)', () => {
	it('produces RFC 7636-compliant verifier: 64 chars from A-Za-z0-9-._~', async () => {
		for (let i = 0; i < 50; i++) {
			const { verifier } = await generatePKCE();
			expect(verifier).toHaveLength(64);
			for (const ch of verifier) {
				expect(CHAR_SET.has(ch), `unexpected char ${ch}`).toBe(true);
			}
		}
	});

	it('verifiers differ across calls (non-deterministic)', async () => {
		const a = await generatePKCE();
		const b = await generatePKCE();
		expect(a.verifier).not.toBe(b.verifier);
	});

	it('each of the 66 chars is near-uniformly distributed (rejection sampling kills modulo bias)', async () => {
		// 30k verifiers × 64 chars = 1.92M samples. With uniform distribution the
		// per-char std dev is ~0.9% of the mean, so ±5% tolerance has ~7σ margin —
		// never flakes, while a naive `byte % 66` would push chars 58-65 ~22%
		// below the mean and be caught immediately.
		const SAMPLES = 30_000;
		const counts = new Array<number>(66).fill(0);
		for (let i = 0; i < SAMPLES; i++) {
			const { verifier } = await generatePKCE();
			for (const ch of verifier) {
				counts[CHARSET.indexOf(ch)]++;
			}
		}
		const total = SAMPLES * 64;
		const expectedFreq = 1 / 66;
		for (let i = 0; i < 66; i++) {
			const freq = counts[i] / total;
			expect(
				Math.abs(freq - expectedFreq),
				`char ${CHARSET[i]} deviated ${(((freq - expectedFreq) / expectedFreq) * 100).toFixed(2)}% from uniform`,
			).toBeLessThan(0.05 * expectedFreq);
		}
	}, 30_000);
});
