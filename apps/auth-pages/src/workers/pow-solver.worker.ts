// Web Worker for PoW solving
// P0-02: Offload proof-of-work computation to background thread
// Falls back to main thread when crypto.subtle is unavailable (HTTP context)

self.onmessage = async (e: MessageEvent<{ challenge: string; difficulty: number }>) => {
	const { challenge, difficulty } = e.data;
	const encoder = new TextEncoder();
	let nonce = 0;
	const prefix = '0'.repeat(difficulty);
	const estimatedMax = Math.pow(16, difficulty);

	// crypto.subtle is unavailable in Web Workers over HTTP.
	// When unavailable, fail fast and let the main thread handle it.
	if (typeof crypto === 'undefined' || !crypto.subtle) {
		self.postMessage({ type: 'error', message: 'crypto.subtle unavailable in worker' });
		return;
	}

	while (true) {
		const data = encoder.encode(challenge + nonce);
		try {
			const hash = await crypto.subtle.digest('SHA-256', data);
			const hex = Array.from(new Uint8Array(hash))
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('');
			if (hex.startsWith(prefix)) {
				self.postMessage({ type: 'solved', token: 'pow_' + nonce.toString(36) });
				return;
			}
		} catch {
			self.postMessage({ type: 'error', message: 'crypto.subtle.digest failed' });
			return;
		}
		nonce++;
		if (nonce % 500 === 0) {
			self.postMessage({ type: 'progress', current: nonce, max: estimatedMax });
		}
	}
};
