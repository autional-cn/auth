// K-anonymity HIBP v2 client-side breach check
// Only sends first 5 chars of SHA-1 hash — server/API never sees full hash or password
const HIBP_API = 'https://api.pwnedpasswords.com/range/';

export interface BreachResult {
	breached: boolean;
	count?: number; // how many times seen in breaches
}

export async function checkPasswordBreached(password: string): Promise<BreachResult> {
	// 1. SHA-1 hash the password in browser (NEVER send plaintext)
	const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password));
	const hashHex = Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
		.toUpperCase();

	const prefix = hashHex.substring(0, 5);
	const suffix = hashHex.substring(5);

	// 2. Only send 5-char prefix — k-anonymity
	try {
		const resp = await fetch(HIBP_API + prefix, {
			headers: { 'Add-Padding': 'true' }, // k-anonymity padding
		});
		const text = await resp.text();

		// 3. Check locally if any returned suffix matches
		for (const line of text.split('\n')) {
			const trimmed = line.trim();
			if (!trimmed) continue;
			const [returnedSuffix, countStr] = trimmed.split(':');
			if (returnedSuffix && returnedSuffix.toUpperCase() === suffix.toUpperCase()) {
				return { breached: true, count: parseInt(countStr || '1', 10) };
			}
		}
		return { breached: false };
	} catch {
		// API unavailable — fail-open (allow)
		return { breached: false };
	}
}
