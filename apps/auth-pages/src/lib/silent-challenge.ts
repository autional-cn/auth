/**
 * Silent Challenge (US-S04)
 *
 * JavaScript proof-of-work challenge used as a silent check before login
 * when the rate limit step is >= 2.
 *
 * P0-01: Added onProgress callback to solveProofOfWork
 * P0-02: Web Worker auto-detection with main thread fallback
 */

/**
 * Check if silent challenge (PoW) is enabled for the current auth config.
 * Returns false by default if config is not provided.
 */
export function isSilentChallengeEnabled(authConfig?: {
	silent_challenge_enabled?: boolean;
}): boolean {
	return authConfig?.silent_challenge_enabled ?? false;
}

/**
 * Solve proof-of-work using Web Worker if available, fallback to main thread.
 *
 * @param challenge - The challenge string to solve
 * @param difficulty - Number of leading zeros required (default: 4)
 * @param onProgress - Optional callback for progress updates (current, max)
 * @returns The solved token string
 */
export async function solveProofOfWork(
	challenge: string,
	difficulty: number = 4,
	onProgress?: (current: number, max: number) => void,
): Promise<string> {
	// Try Web Worker first
	try {
		return await solveWithWorker(challenge, difficulty, onProgress);
	} catch {
		// Fallback to main thread
		return solveWithMainThread(challenge, difficulty, onProgress);
	}
}

/**
 * Solve PoW using Web Worker
 */
function solveWithWorker(
	challenge: string,
	difficulty: number,
	onProgress?: (current: number, max: number) => void,
): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			const worker = new Worker(new URL('../workers/pow-solver.worker.ts', import.meta.url), {
				type: 'module',
			});

			worker.onmessage = (
				e: MessageEvent<{
					type: string;
					token?: string;
					current?: number;
					max?: number;
					message?: string;
				}>,
			) => {
				const msg = e.data;
				if (msg.type === 'solved' && msg.token) {
					worker.terminate();
					resolve(msg.token);
				} else if (msg.type === 'progress') {
					onProgress?.(msg.current ?? 0, msg.max ?? 1);
				} else if (msg.type === 'error') {
					worker.terminate();
					reject(new Error(msg.message || 'worker error'));
				}
			};

			worker.onerror = (err) => {
				worker.terminate();
				reject(err);
			};

			worker.postMessage({ challenge, difficulty });
		} catch (err) {
			reject(err);
		}
	});
}

/**
 * Solve PoW on main thread (fallback when Workers unavailable)
 */
async function solveWithMainThread(
	challenge: string,
	difficulty: number,
	onProgress?: (current: number, max: number) => void,
): Promise<string> {
	const encoder = new TextEncoder();
	let nonce = 0;
	const prefix = '0'.repeat(difficulty);
	const estimatedMax = Math.pow(16, difficulty);
	while (true) {
		const data = encoder.encode(challenge + nonce);
		const hash = await crypto.subtle.digest('SHA-256', data);
		const hex = Array.from(new Uint8Array(hash))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
		if (hex.startsWith(prefix)) {
			return 'pow_' + nonce.toString(36);
		}
		nonce++;
		if (nonce % 500 === 0) {
			onProgress?.(nonce, estimatedMax);
			await new Promise((r) => setTimeout(r, 0)); // yield to browser
		}
	}
}
