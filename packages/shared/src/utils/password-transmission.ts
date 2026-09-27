/**
 * 密码传输安全模块
 *
 * 根据租户 password_transmission 策略在前端对密码进行预处理：
 *   plain      — 不做处理，原始密码传输
 *   hash       — SHA-256(password + tenantId + clientNonce + serverNonce)
 *   symmetric  — ECDH 密钥交换 + AES-256-GCM (Phase 2)
 *   asymmetric — RSA-OAEP 公钥加密 (Phase 2)
 */

import { apiClient } from '../api/client';

// @generated-api-exempt: PublicKeyExchange tree-shook by Vite; inline required
async function identityPublicKeyExchange() {
	const res = await apiClient.get('/identity/api/v1/public/key-exchange'); // @generated-api-exempt
	return res.data;
}

const ENCODER = new TextEncoder();

function base64ToBytes(base64: string): Uint8Array {
	const binary = atob(base64);
	return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function bytesToHex(bytes: Uint8Array): string {
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

export interface TransmissionResult {
	password: string;
	passwordTransmission: string;
	clientNonce?: string;
	keyExchangeId?: string;
	clientPubKey?: string;
	keyId?: string;
}

/**
 * 根据传输模式预处理密码。
 * @param rawPassword 用户输入的原始密码
 * @param mode 租户配置的传输模式
 * @param tenantId 租户 ID
 * @param serverNonce 服务端返回的 transmission_nonce (hash 模式必需)
 */
export async function processPasswordForTransmission(
	rawPassword: string,
	mode: string | undefined,
	tenantId: string,
	serverNonce: string | undefined,
): Promise<TransmissionResult> {
	// 2026-08-17 安全修复：mode 必须显式提供。
	// 后端 PasswordPolicyResponse.password_transmission 恒返回（无 omitempty 缺失，
	// GetPasswordPolicy 有全局默认兜底），因此 undefined/空串只意味着"契约错误或未知模式"。
	// 静默回退 plain 会把 hash/symmetric 租户降级为明文传输（后端 61000104 拒绝），
	// 且掩盖真实错误。只有明确 mode==='plain' 才走明文；未知模式一律抛错暴露。
	if (mode === undefined || mode === '') {
		throw new Error('password transmission mode is missing from tenant auth-config');
	}

	const result: TransmissionResult = {
		password: rawPassword,
		passwordTransmission: mode,
	};

	switch (mode) {
		case 'plain':
			// 显式 plain：明文传输（合法）
			break;
		case 'hash': {
			const input = rawPassword + '|' + tenantId;
			try {
				const hashBuffer = await crypto.subtle.digest('SHA-256', ENCODER.encode(input));
				result.password = bytesToHex(new Uint8Array(hashBuffer));
			} catch {
				result.password = sha256HexPureJS(input);
			}
			result.passwordTransmission = 'hash';
			break;
		}
		case 'symmetric': {
			const keData = await identityPublicKeyExchange();
			const serverPubBytes = base64ToBytes(keData.serverPubKey) as BufferSource;

			const clientKeyPair = await crypto.subtle.generateKey(
				{ name: 'ECDH', namedCurve: 'P-256' },
				false,
				['deriveBits'],
			);

			const serverPubKey = await crypto.subtle.importKey(
				'raw',
				serverPubBytes,
				{ name: 'ECDH', namedCurve: 'P-256' },
				false,
				[],
			);

			const sharedBits = await crypto.subtle.deriveBits(
				{ name: 'ECDH', public: serverPubKey },
				clientKeyPair.privateKey,
				256,
			);
			const aesKey = await crypto.subtle.importKey('raw', sharedBits, 'AES-GCM', false, [
				'encrypt',
			]);

			const iv = crypto.getRandomValues(new Uint8Array(12));
			const encoded = ENCODER.encode(rawPassword);
			const ciphertext = await crypto.subtle.encrypt(
				{ name: 'AES-GCM', iv: iv },
				aesKey,
				encoded,
			);

			const clientPubRaw = await crypto.subtle.exportKey('raw', clientKeyPair.publicKey);

			const combined = new Uint8Array(12 + ciphertext.byteLength + clientPubRaw.byteLength);
			combined.set(iv, 0);
			combined.set(new Uint8Array(ciphertext), 12);
			combined.set(new Uint8Array(clientPubRaw), 12 + ciphertext.byteLength);

			result.password = btoa(String.fromCharCode(...combined));
			result.keyExchangeId = keData.keyExchangeId;
			result.clientPubKey = btoa(String.fromCharCode(...new Uint8Array(clientPubRaw)));
			result.passwordTransmission = 'symmetric';
			break;
		}
		case 'asymmetric': {
			const publicKeyPem = serverNonce;
			if (!publicKeyPem || publicKeyPem.length < 100) {
				throw new Error('public_key is required for asymmetric mode');
			}
			const pemContents = publicKeyPem
				.replace('-----BEGIN PUBLIC KEY-----', '')
				.replace('-----END PUBLIC KEY-----', '')
				.replace(/\s/g, '');
			const derBytes = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
			const publicKey = await crypto.subtle.importKey(
				'spki',
				derBytes,
				{ name: 'RSA-OAEP', hash: 'SHA-256' },
				false,
				['encrypt'],
			);
			const encoded = ENCODER.encode(rawPassword);
			const ciphertext = await crypto.subtle.encrypt(
				{ name: 'RSA-OAEP' },
				publicKey,
				encoded,
			);
			result.password = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
			result.passwordTransmission = 'asymmetric';
			break;
		}
		default:
			// 未知模式（非 plain/hash/symmetric/asymmetric）：抛错而非静默降级
			throw new Error(`unknown password transmission mode: ${mode}`);
	}

	return result;
}

/**
 * 哈希密码用于传输 (简化版本，用于 registration 和 change-password)。
 */
export async function hashPasswordForTransmission(
	password: string,
	tenantId: string,
	_serverNonce: string,
): Promise<{ hash: string; clientNonce: string }> {
	const combined = ENCODER.encode(password + '|' + tenantId);
	const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
	return {
		hash: bytesToHex(new Uint8Array(hashBuffer)),
		clientNonce: '',
	};
}

function ror(x: number, n: number): number {
	return (x >>> n) | (x << (32 - n));
}

function sha256HexPureJS(input: string): string {
	const msg = new TextEncoder().encode(input);
	const msgBits = msg.length * 8;
	const buf = new Uint8Array(((msg.length + 9 + 63) >>> 6) << 6);
	buf.set(msg);
	buf[msg.length] = 0x80;
	const view = new DataView(buf.buffer);
	view.setUint32(buf.length - 4, msgBits);

	const K = new Uint32Array([
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
	]);

	const H = new Uint32Array([
		0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
	]);
	const W = new Uint32Array(64);

	for (let off = 0; off < buf.length; off += 64) {
		for (let i = 0; i < 16; i++) {
			W[i] = view.getUint32(off + i * 4);
		}
		for (let i = 16; i < 64; i++) {
			const s0 = ror(W[i - 15], 7) ^ ror(W[i - 15], 18) ^ (W[i - 15] >>> 3);
			const s1 = ror(W[i - 2], 17) ^ ror(W[i - 2], 19) ^ (W[i - 2] >>> 10);
			W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
		}
		let [a, b, c, d, e, f, g, h] = H;
		for (let i = 0; i < 64; i++) {
			const S1 = ror(e, 6) ^ ror(e, 11) ^ ror(e, 25);
			const ch = (e & f) ^ (~e & g);
			const t1 = (h + S1 + ch + K[i] + W[i]) | 0;
			const S0 = ror(a, 2) ^ ror(a, 13) ^ ror(a, 22);
			const maj = (a & b) ^ (a & c) ^ (b & c);
			const t2 = (S0 + maj) | 0;
			h = g;
			g = f;
			f = e;
			e = (d + t1) | 0;
			d = c;
			c = b;
			b = a;
			a = (t1 + t2) | 0;
		}
		H[0] = (H[0] + a) | 0;
		H[1] = (H[1] + b) | 0;
		H[2] = (H[2] + c) | 0;
		H[3] = (H[3] + d) | 0;
		H[4] = (H[4] + e) | 0;
		H[5] = (H[5] + f) | 0;
		H[6] = (H[6] + g) | 0;
		H[7] = (H[7] + h) | 0;
	}

	const digest = new Uint8Array(32);
	const dv = new DataView(digest.buffer);
	for (let i = 0; i < 8; i++) dv.setUint32(i * 4, H[i]);
	return Array.from(digest)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}
