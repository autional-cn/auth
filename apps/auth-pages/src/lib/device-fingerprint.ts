/**
 * Device Fingerprint (US-S02)
 *
 * Computes a SHA-256 device fingerprint from browser signals.
 * Fields align 1:1 with the server-side buildFingerprint() in identity-service risk engine:
 *   platform | acceptLanguage | userAgent | screen | cores | timezone
 *
 * When Web Crypto API is available (secure context), uses crypto.subtle.digest('SHA-256').
 * Falls back to a compact pure-JS SHA-256 for non-secure contexts (HTTP).
 */

export function isDeviceFingerprintEnabled(authConfig?: {
	deviceFingerprintEnabled?: boolean;
}): boolean {
	return authConfig?.deviceFingerprintEnabled ?? false;
}

export async function computeDeviceFingerprint(): Promise<string> {
	const platform = navigator.platform || 'unknown';
	const language = navigator.language || 'unknown';
	const ua = navigator.userAgent || '';
	const cores = String(navigator.hardwareConcurrency || 'unknown');
	const screenInfo = screen.colorDepth + 'x' + screen.width + 'x' + screen.height;
	const timezone = String(new Date().getTimezoneOffset());

	const str = [platform, language, ua, screenInfo, cores, timezone].join('|');

	let hashHex: string;
	try {
		hashHex = await sha256(str);
	} catch {
		hashHex = sha256PureJS(str);
	}

	return 'dfp_' + hashHex.substring(0, 16);
}

async function sha256(input: string): Promise<string> {
	const data = new TextEncoder().encode(input);
	const hash = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * Pure-JS SHA-256 fallback for HTTP (non-secure context).
 */
function sha256PureJS(input: string): string {
	function rightRotate(v: number, n: number): number {
		return (v >>> n) | (v << (32 - n));
	}

	const K = [
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
	];

	const bytes = new TextEncoder().encode(input);
	const bitLen = bytes.length * 8;

	const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
	padded.set(bytes);
	padded[bytes.length] = 0x80;

	const view = new DataView(padded.buffer);
	view.setUint32(padded.length - 4, bitLen, false);

	let H = [
		0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
	];

	for (let i = 0; i < padded.length; i += 64) {
		const W = new Array<number>(64);
		for (let t = 0; t < 16; t++) {
			W[t] = view.getUint32(i + t * 4, false);
		}
		for (let t = 16; t < 64; t++) {
			const s0 = rightRotate(W[t - 15], 7) ^ rightRotate(W[t - 15], 18) ^ (W[t - 15] >>> 3);
			const s1 = rightRotate(W[t - 2], 17) ^ rightRotate(W[t - 2], 19) ^ (W[t - 2] >>> 10);
			W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
		}

		let [a, b, c, d, e, f, g, h] = H;

		for (let t = 0; t < 64; t++) {
			const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
			const ch = (e & f) ^ (~e & g);
			const temp1 = (h + S1 + ch + K[t] + W[t]) | 0;
			const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
			const maj = (a & b) ^ (a & c) ^ (b & c);
			const temp2 = (S0 + maj) | 0;

			h = g;
			g = f;
			f = e;
			e = (d + temp1) | 0;
			d = c;
			c = b;
			b = a;
			a = (temp1 + temp2) | 0;
		}

		H = [H[0] + a, H[1] + b, H[2] + c, H[3] + d, H[4] + e, H[5] + f, H[6] + g, H[7] + h].map(
			(v) => v | 0,
		);
	}

	return H.map((h) => h.toString(16).padStart(8, '0')).join('');
}
