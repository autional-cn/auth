/**
 * HIBP (Have I Been Pwned) API v3 密码泄露检查
 *
 * 使用 k-anonymity 模型：仅发送密码 SHA-1 的前 5 个字符，
 * 保护用户密码隐私。
 *
 * 参考：https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange
 */

async function sha1Hex(data: string): Promise<string> {
	const encoder = new TextEncoder();
	const buffer = await crypto.subtle.digest('SHA-1', encoder.encode(data));
	const hex = Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
	return hex;
}

/**
 * 查询 HIBP API 检查密码泄露次数。
 *
 * @returns 泄露次数（0 表示未发现泄露）
 */
export async function checkHIBP(password: string): Promise<number> {
	if (!password || password.length < 6) return 0;

	const hash = await sha1Hex(password);
	const prefix = hash.substring(0, 5).toUpperCase();
	const suffix = hash.substring(5).toUpperCase();

	const url = `https://api.pwnedpasswords.com/range/${prefix}`;

	const response = await fetch(url, {
		headers: { 'Add-Padding': 'true' }, // 隐私填充
	});

	if (!response.ok) {
		if (import.meta.env.DEV) {
			console.warn('HIBP API request failed:', response.status);
		}
		return 0;
	}

	const text = await response.text();
	const lines = text.split('\n');

	for (const line of lines) {
		const [suffixPart, countStr] = line.split(':');
		if (suffixPart?.trim() === suffix) {
			const count = parseInt(countStr?.trim() || '0', 10);
			return isNaN(count) ? 0 : count;
		}
	}

	return 0;
}
