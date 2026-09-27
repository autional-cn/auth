import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRootDomain, getPortalUrl } from '../index';

// ─── getRootDomain (pure function, no mock needed) ───

describe('getRootDomain', () => {
	it.each([
		// [hostname, expected]
		['app.iam.tianv.local', 'iam.tianv.local'],
		['auth.iam.tianv.local', 'iam.tianv.local'],
		['app.iam.tianv.com', 'iam.tianv.com'],
		['auth.iam.tianv.com', 'iam.tianv.com'],
		['app.autional.com', 'autional.com'],
		['auth.autional.com', 'autional.com'],
		['iam.tianv.com', 'tianv.com'], // root domain itself
		['127.0.0.1', '127.0.0.1'], // IP address
		['localhost', 'localhost'], // localhost
	])('hostname=%s → %s', (hostname, expected) => {
		expect(getRootDomain(hostname)).toBe(expected);
	});
});

// ─── getPortalUrl (requires window mock) ───

const LOCAL_CONFIG = {
	VITE_PORTAL_CONFIG: {
		auth: { host: 'auth', base: '' },
		landing: { host: '', base: '' },
		admin: { host: 'app', base: '/admin' },
		developer: { host: 'app', base: '/developer' },
		platform: { host: 'platform', base: '' },
		status: { host: 'status', base: '' },
		trust: { host: 'trust', base: '' },
		user: { host: 'user', base: '' },
		authenticator: { host: 'authenticator', base: '' },
		security: { host: 'app', base: '/security' },
	},
};

const COM_CONFIG = {
	VITE_PORTAL_CONFIG: {
		...LOCAL_CONFIG.VITE_PORTAL_CONFIG,
	},
};

describe('getPortalUrl', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	describe('with VITE_PORTAL_CONFIG + .local domain', () => {
		beforeEach(() => {
			vi.stubGlobal('window', {
				location: {
					hostname: 'app.iam.tianv.local',
					protocol: 'https:',
					origin: 'https://app.iam.tianv.local',
				},
				__APP_CONFIG__: LOCAL_CONFIG,
			});
		});

		it('resolves auth to auth.* subdomain', () => {
			expect(getPortalUrl('auth')).toBe('https://auth.iam.tianv.local');
		});

		it('resolves landing to root domain', () => {
			expect(getPortalUrl('landing')).toBe('https://iam.tianv.local');
		});

		it('resolves app-* portals to app.* subdomain with base path', () => {
			expect(getPortalUrl('admin')).toBe('https://app.iam.tianv.local/admin');
			expect(getPortalUrl('developer')).toBe('https://app.iam.tianv.local/developer');
			expect(getPortalUrl('security')).toBe('https://app.iam.tianv.local/security');
		});

		it('resolves platform to its own subdomain', () => {
			expect(getPortalUrl('platform')).toBe('https://platform.iam.tianv.local');
		});

		it('resolves status to its own subdomain', () => {
			expect(getPortalUrl('status')).toBe('https://status.iam.tianv.local');
		});

		it('resolves trust to its own subdomain', () => {
			expect(getPortalUrl('trust')).toBe('https://trust.iam.tianv.local');
		});

		it('resolves user to its own subdomain', () => {
			expect(getPortalUrl('user')).toBe('https://user.iam.tianv.local');
		});

		it('resolves authenticator to its own subdomain', () => {
			expect(getPortalUrl('authenticator')).toBe('https://authenticator.iam.tianv.local');
		});
	});

	describe('with VITE_PORTAL_CONFIG + .com domain', () => {
		beforeEach(() => {
			vi.stubGlobal('window', {
				location: {
					hostname: 'app.iam.tianv.com',
					protocol: 'https:',
					origin: 'https://app.iam.tianv.com',
				},
				__APP_CONFIG__: COM_CONFIG,
			});
		});

		it('resolves auth to auth.*.com subdomain', () => {
			expect(getPortalUrl('auth')).toBe('https://auth.iam.tianv.com');
		});

		it('resolves admin to app.*.com/admin', () => {
			expect(getPortalUrl('admin')).toBe('https://app.iam.tianv.com/admin');
		});

		it('resolves platform to platform.*.com', () => {
			expect(getPortalUrl('platform')).toBe('https://platform.iam.tianv.com');
		});
	});

	describe('with VITE_PORTAL_CONFIG + autional.com domain', () => {
		beforeEach(() => {
			vi.stubGlobal('window', {
				location: {
					hostname: 'app.autional.com',
					protocol: 'https:',
					origin: 'https://app.autional.com',
				},
				__APP_CONFIG__: COM_CONFIG,
			});
		});

		it('resolves auth to auth.autional.com', () => {
			expect(getPortalUrl('auth')).toBe('https://auth.autional.com');
		});

		it('resolves admin to app.autional.com/admin', () => {
			expect(getPortalUrl('admin')).toBe('https://app.autional.com/admin');
		});

		it('resolves landing to autional.com', () => {
			expect(getPortalUrl('landing')).toBe('https://autional.com');
		});
	});

	describe('fallback when VITE_PORTAL_CONFIG is absent (old env.js)', () => {
		beforeEach(() => {
			vi.stubGlobal('window', {
				location: {
					hostname: 'app.iam.tianv.local',
					protocol: 'https:',
					origin: 'https://app.iam.tianv.local',
				},
				__APP_CONFIG__: {
					VITE_AUTH_PAGES_URL: 'https://auth.iam.tianv.com',
					VITE_ADMIN_CONSOLE_URL: 'https://app.iam.tianv.com/admin',
				},
			});
		});

		it('falls back to VITE_AUTH_PAGES_URL for auth', () => {
			expect(getPortalUrl('auth')).toBe('https://auth.iam.tianv.com');
		});

		it('falls back to VITE_ADMIN_CONSOLE_URL for admin', () => {
			expect(getPortalUrl('admin')).toBe('https://app.iam.tianv.com/admin');
		});

		it('falls back to origin for unknown portal', () => {
			expect(getPortalUrl('unknown')).toBe('https://app.iam.tianv.local/unknown');
		});
	});
});
