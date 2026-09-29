import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildLoginUrl, buildLogoutUrl } from '../roles';

const MOCK_CONFIG = {
	VITE_PORTAL_CONFIG: {
		auth: { host: 'auth', base: '' },
	},
};

function mockWindow(
	hostname: string,
	protocol: string,
	origin: string,
	config: any = MOCK_CONFIG,
): void {
	vi.stubGlobal('window', {
		location: { hostname, protocol, origin },
		__APP_CONFIG__: config,
	});
}

describe('buildLoginUrl', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	describe('basic URL construction', () => {
		it('builds base login URL pointing to auth domain', () => {
			mockWindow('app.iam.tianv.local', 'https:', 'https://app.iam.tianv.local');
			const url = buildLoginUrl();
			expect(url).toBe('https://auth.iam.tianv.local');
		});

		it('includes redirect param when returnUrl provided', () => {
			mockWindow('app.iam.tianv.local', 'https:', 'https://app.iam.tianv.local');
			const url = buildLoginUrl('https://app.iam.tianv.com/admin');
			expect(url).toContain('redirect=');
			expect(url).toContain(encodeURIComponent('https://app.iam.tianv.com/admin'));
		});
	});

	describe('fromRequireAuth parameter', () => {
		it('appends from_requireauth=1 when fromRequireAuth is true', () => {
			mockWindow('app.iam.tianv.local', 'https:', 'https://app.iam.tianv.local');
			const url = buildLoginUrl(undefined, true);
			expect(url).toContain('from_requireauth=1');
		});

		it('appends from_requireauth=1 with redirect param', () => {
			mockWindow('app.iam.tianv.local', 'https:', 'https://app.iam.tianv.local');
			const url = buildLoginUrl('https://app.iam.tianv.com/admin', true);
			expect(url).toContain('redirect=');
			expect(url).toContain('from_requireauth=1');
			expect(url).toContain('&from_requireauth=1');
		});

		it('does not include from_requireauth when fromRequireAuth is false', () => {
			mockWindow('app.iam.tianv.local', 'https:', 'https://app.iam.tianv.local');
			const url = buildLoginUrl('https://app.iam.tianv.com/admin', false);
			expect(url).not.toContain('from_requireauth');
		});

		it('does not include from_requireauth when fromRequireAuth is undefined', () => {
			mockWindow('app.iam.tianv.local', 'https:', 'https://app.iam.tianv.local');
			const url = buildLoginUrl('https://app.iam.tianv.com/admin');
			expect(url).not.toContain('from_requireauth');
		});

		it('returns only from_requireauth=1 when no returnUrl but fromRequireAuth is true', () => {
			mockWindow('app.iam.tianv.local', 'https:', 'https://app.iam.tianv.local');
			const url = buildLoginUrl(undefined, true);
			expect(url).toContain('?from_requireauth=1');
			expect(url).not.toContain('redirect=');
		});
	});

	describe('domain-agnostic', () => {
		it('works with .com domain', () => {
			mockWindow('app.iam.tianv.com', 'https:', 'https://app.iam.tianv.com');
			const url = buildLoginUrl();
			expect(url).toBe('https://auth.iam.tianv.com');
		});

		it('works with autional.com domain', () => {
			mockWindow('app.autional.com', 'https:', 'https://app.autional.com');
			const url = buildLoginUrl();
			expect(url).toBe('https://auth.autional.com');
		});
	});

	describe('tenant-slug preservation', () => {
		const AUTH_CONFIG = {
			VITE_PORTAL_CONFIG: {
				auth: { host: 'auth', base: '' },
			},
		};

		it('redirects to {slug}/login when returnUrl is tenant-scoped on auth domain', () => {
			mockWindow('auth.autional.local', 'https:', 'https://auth.autional.local', AUTH_CONFIG);
			const url = buildLoginUrl('https://auth.autional.local/acme-corp/dashboard');
			expect(url).toBe(
				'https://auth.autional.local/acme-corp/login?redirect=' +
					encodeURIComponent('https://auth.autional.local/acme-corp/dashboard'),
			);
		});

		it('keeps from_requireauth on tenant-scoped login url', () => {
			mockWindow('auth.autional.local', 'https:', 'https://auth.autional.local', AUTH_CONFIG);
			const url = buildLoginUrl('https://auth.autional.local/acme-corp/dashboard', true);
			expect(url).toBe(
				'https://auth.autional.local/acme-corp/login?redirect=' +
					encodeURIComponent('https://auth.autional.local/acme-corp/dashboard') +
					'&from_requireauth=1',
			);
		});

		it('does not treat reserved auth routes as tenant slug', () => {
			mockWindow('auth.autional.local', 'https:', 'https://auth.autional.local', AUTH_CONFIG);
			const url = buildLoginUrl('https://auth.autional.local/reset-password');
			expect(url).toBe(
				'https://auth.autional.local?redirect=' +
					encodeURIComponent('https://auth.autional.local/reset-password'),
			);
		});

		it('preserves cross-domain returnUrl behavior (app domain)', () => {
			mockWindow('auth.autional.local', 'https:', 'https://auth.autional.local', AUTH_CONFIG);
			const url = buildLoginUrl('https://app.autional.com/admin');
			expect(url).toBe(
				'https://auth.autional.local?redirect=' +
					encodeURIComponent('https://app.autional.com/admin'),
			);
		});

		it('does not truncate cross-domain returnUrl containing /login substring (regression P1-2)', () => {
			mockWindow('auth.autional.local', 'https:', 'https://auth.autional.local', AUTH_CONFIG);
			const url = buildLoginUrl('https://app.autional.com/admin/login');
			expect(url).toBe(
				'https://auth.autional.local?redirect=' +
					encodeURIComponent('https://app.autional.com/admin/login'),
			);
		});

		it('truncates auth-domain login page itself (no nested redirect)', () => {
			mockWindow('auth.autional.local', 'https:', 'https://auth.autional.local', AUTH_CONFIG);
			const url = buildLoginUrl('https://auth.autional.local/acme-corp/login');
			expect(url).toBe('https://auth.autional.local/acme-corp/login');
		});
	});

	describe('useLogout unification (logout → login redirect)', () => {
		const AUTH_CONFIG = {
			VITE_PORTAL_CONFIG: {
				auth: { host: 'auth', base: '' },
			},
		};

		it('logout from auth-domain tenant page keeps tenant slug (bug scenario)', () => {
			mockWindow('auth.autional.local', 'https:', 'https://auth.autional.local', AUTH_CONFIG);
			const url = buildLoginUrl('https://auth.autional.local/acme-corp/dashboard');
			expect(url).toBe(
				'https://auth.autional.local/acme-corp/login?redirect=' +
					encodeURIComponent('https://auth.autional.local/acme-corp/dashboard'),
			);
		});

		it('logout from auth root (tenant select page) does not add redirect', () => {
			mockWindow('auth.autional.local', 'https:', 'https://auth.autional.local', AUTH_CONFIG);
			const url = buildLoginUrl('https://auth.autional.local/');
			expect(url).toBe('https://auth.autional.local');
		});

		it('logout from portal domain falls back to generic auth login (no slug misjudge)', () => {
			// useLogout 在 portal app 中跨域调用：returnUrl origin ≠ auth origin，
			// 首段 /admin 不会被误判为租户 slug，跳转 {base}?redirect=<portal-url>
			mockWindow('app.autional.com', 'https:', 'https://app.autional.com', AUTH_CONFIG);
			const url = buildLoginUrl('https://app.autional.com/admin');
			expect(url).toBe(
				'https://auth.autional.com?redirect=' +
					encodeURIComponent('https://app.autional.com/admin'),
			);
		});
	});

	describe('buildLogoutUrl（F-W5c 登出意图标记）', () => {
		const AUTH_CONFIG = {
			VITE_PORTAL_CONFIG: {
				auth: { host: 'auth', base: '' },
			},
		};

		it('门户域登出：auth 裸根 + redirect 回程 + logout=1', () => {
			mockWindow('app.autional.com', 'https:', 'https://app.autional.com', AUTH_CONFIG);
			const url = buildLogoutUrl('https://app.autional.com/demo/');
			expect(url).toBe(
				'https://auth.autional.com/?redirect=' +
					encodeURIComponent('https://app.autional.com/demo/') +
					'&logout=1',
			);
		});

		it('auth 域租户页登出也走裸根：不经 /<slug>/login（那里 logout=1 被静默忽略）', () => {
			mockWindow('auth.autional.local', 'https:', 'https://auth.autional.local', AUTH_CONFIG);
			const url = buildLogoutUrl('https://auth.autional.local/acme-corp/dashboard');
			expect(url).toBe(
				'https://auth.autional.local/?redirect=' +
					encodeURIComponent('https://auth.autional.local/acme-corp/dashboard') +
					'&logout=1',
			);
			expect(url).not.toContain('/acme-corp/login');
		});

		it('无回程：auth 裸根 + logout=1', () => {
			mockWindow('auth.autional.local', 'https:', 'https://auth.autional.local', AUTH_CONFIG);
			const url = buildLogoutUrl();
			expect(url).toBe('https://auth.autional.local/?logout=1');
		});
	});
});
