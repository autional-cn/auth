import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// 动态导入被测函数，避免顶层 window 依赖
import { isValidRedirect } from '../index';

describe('isValidRedirect', () => {
	beforeEach(() => {
		vi.stubGlobal('window', {
			location: {
				origin: 'https://auth.iam.tianv.local',
				hostname: 'auth.iam.tianv.local',
			},
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('accepts same-origin relative path', () => {
		expect(isValidRedirect('/acme-corp/dashboard')).toBe(true);
	});

	it('accepts same-origin absolute URL', () => {
		expect(isValidRedirect('https://auth.iam.tianv.local/acme-corp/dashboard')).toBe(true);
	});

	it('rejects protocol-relative URL (open redirect)', () => {
		expect(isValidRedirect('//evil.com')).toBe(false);
	});

	it('rejects backslash protocol-relative variant', () => {
		expect(isValidRedirect('/\\evil.com')).toBe(false);
	});

	it('rejects percent-encoded backslash variant', () => {
		expect(isValidRedirect('/%5cevil.com')).toBe(false);
	});

	it('rejects external http URL not in allowlist', () => {
		expect(isValidRedirect('https://evil.com/phish')).toBe(false);
	});

	it('rejects empty string', () => {
		expect(isValidRedirect('')).toBe(false);
	});
});
