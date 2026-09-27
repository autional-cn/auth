/**
 * 本地常见泄露密码黑名单
 *
 * 在调用 HIBP API 之前，先进行 O(1) 的本地检查，
 * 避免对明显弱密码发起不必要的网络请求。
 *
 * 数据来源：NIST SP 800-63B / FBI CISA 2023 / NordPass Top 200
 * 覆盖范围：约 200 个最常见的泄露密码
 */

const TOP_BREACHED_PASSWORDS = new Set([
	// === 1-50: 全球最常泄露密码 ===
	'123456',
	'password',
	'123456789',
	'12345678',
	'12345',
	'1234567',
	'password1',
	'1234567890',
	'123123',
	'000000',
	'iloveyou',
	'1234',
	'1q2w3e4r5t',
	'qwerty123',
	'monkey',
	'dragon',
	'master',
	'qwerty',
	'letmein',
	'password123',
	'admin',
	'welcome',
	'football',
	'abc123',
	'111111',
	'qwerty123',
	'dragon',
	'baseball',
	'sunshine',
	'iloveyou',
	'trustno1',
	'princess',
	'adobe123',
	'1234567a',
	'1qaz2wsx',
	'qwertyuiop',
	'ashley',
	'password12',
	'654321',
	'passw0rd',
	'michael',
	'!@#$%^&*',
	'charlie',
	'aa123456',
	'donald',
	'password1',
	'qwerty12345',
	'admin123',
	// === 51-100 ===
	'123qwe',
	'12345678910',
	'password1234',
	'password12345',
	'google',
	'facebook',
	'batman',
	'whatever',
	'love123',
	'starwars',
	'ninja',
	'hello123',
	'zaq1zaq1',
	'!@#$%^&*()',
	'passwOrd',
	'qwerty123456',
	'123456789a',
	'a123456789',
	'123456a',
	'123456789q',
	'zxcvbnm',
	'asdfghjkl',
	'qazwsx',
	'987654321',
	'0',
	'1',
	'12',
	'123',
	'1234',
	'12345',
	'123456',
	'superman',
	'iloveu',
	'7777777',
	'shadow',
	'121212',
	'password01',
	'123321',
	'password.',
	'pass123',
	'123qweasd',
	'1q2w3e4r',
	'qwertz',
	'159753',
	'102030',
	'112233',
	'test123',
	'abcdef',
	'qwerty123456789',
	// === 101-150 ===
	'123654',
	'password2',
	'iloveyou123',
	'tigger',
	'robert',
	'jennifer',
	'amanda',
	'andrea',
	'michelle',
	'stephanie',
	'jessica',
	'ashley',
	'joshua',
	'matthew',
	'andrew',
	'daniel',
	'justin',
	'thomas',
	'brandon',
	'kevin',
	'nicole',
	'hunter',
	'william',
	'george',
	'richard',
	'joseph',
	'jordan',
	'steven',
	'killer',
	'soccer',
	'hockey',
	'baseball',
	'football',
	'basketball',
	'charlie',
	'thomas',
	'george',
	'dallas',
	'taylor',
	'martin',
	'merlin',
	'chester',
	'harley',
	'buster',
	'samantha',
	'midnight',
	'butterfly',
	'dolphin',
	'ranger',
	'sparky',
	// === 151-200 ===
	'aaaaaa',
	'bbbbbb',
	'cccccc',
	'abcdefgh',
	'abcdefg',
	'121234',
	'121314',
	'11111111',
	'222222',
	'333333',
	'444444',
	'555555',
	'666666',
	'777777',
	'888888',
	'999999',
	'charlie1',
	'cookie',
	'tigger1',
	'william1',
	'summer1',
	'winter1',
	'spring1',
	'autumn1',
	'rainbow',
	'pepper',
	'thomas1',
	'george1',
	'andrew1',
	'hunter1',
	'martin1',
	'ranger1',
	'justin1',
	'daniel1',
	'matthew1',
	'joshua1',
	'robert1',
	'jennifer1',
	'amanda1',
	'andrea1',
	'michelle1',
	'stephanie1',
	'jessica1',
	'ashley1',
	'nicole1',
	'iamking',
	'letmein123',
	'welcome123',
	'access',
]);

/** 对常见弱密码变体进行匹配 */
function checkVariations(password: string): boolean {
	const lower = password.toLowerCase();

	// 直接命中
	if (TOP_BREACHED_PASSWORDS.has(lower)) return true;

	// 常见后缀变体
	const suffixes = ['123', '1', '!', '@', '#', '2023', '2024', '2025', '2026'];
	for (const suffix of suffixes) {
		if (TOP_BREACHED_PASSWORDS.has(lower + suffix)) return true;
	}

	// 基础密码重复
	const basePasswords = ['password', 'passw0rd', 'qwerty', 'admin', 'welcome', 'letmein', 'master'];
	for (const base of basePasswords) {
		if (
			lower === base ||
			lower.startsWith(base + '1') ||
			lower.startsWith(base + '12') ||
			lower.startsWith(base + '123')
		) {
			return true;
		}
	}

	return false;
}

/**
 * 本地检查密码是否属于常见泄露密码。
 * O(1) Set 查询，可作为 HIBP 网络调用前的前置过滤。
 *
 * @returns true 如果密码在本地黑名单中（含常见变体）
 */
export function isLocallyBreached(password: string): boolean {
	if (!password || password.length < 6) return false;
	return checkVariations(password);
}
