import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetCurrentRole = vi.fn();
const mockIsValidRedirect = vi.fn();
const mockCrossAppUrl = vi.fn((path: string) => path);

vi.mock('@autional/shared', () => ({
	getCurrentRole: () => mockGetCurrentRole(),
	isValidRedirect: (url: string) => mockIsValidRedirect(url),
	crossAppUrl: (path: string) => mockCrossAppUrl(path),
	ADMIN_CONSOLE_URL: () => '/admin',
	SECURITY_DASHBOARD_URL: () => '/security',
}));

import { getPostLoginTarget } from '../post-login-redirect';

describe('getPostLoginTarget', () => {
	beforeEach(() => {
		mockGetCurrentRole.mockReturnValue('member');
		mockIsValidRedirect.mockImplementation(
			(url: string) => url.startsWith('/') && !url.includes('/login'),
		);
	});

	describe('角色路由 (无 redirect)', () => {
		it('admin → admin-console', () => {
			mockGetCurrentRole.mockReturnValue('admin');
			expect(getPostLoginTarget({ tenantSlug: 'Default' })).toBe('/admin');
		});

		it('super_admin → admin-console', () => {
			mockGetCurrentRole.mockReturnValue('super_admin');
			expect(getPostLoginTarget({ tenantSlug: 'Default' })).toBe('/admin');
		});

		it('security_admin → security-dashboard', () => {
			mockGetCurrentRole.mockReturnValue('security_admin');
			expect(getPostLoginTarget({ tenantSlug: 'Default' })).toBe('/security');
		});

		it('member → /{slug}/dashboard', () => {
			mockGetCurrentRole.mockReturnValue('member');
			expect(getPostLoginTarget({ tenantSlug: 'acme' })).toBe('/acme/dashboard');
		});
	});

	describe('redirect 参数', () => {
		it('有效 redirect 优先于角色路由', () => {
			mockIsValidRedirect.mockReturnValue(true);
			expect(getPostLoginTarget({ tenantSlug: 'X', redirect: '/developer' })).toBe('/developer');
		});

		it('无效 redirect 回退到角色路由', () => {
			mockIsValidRedirect.mockReturnValue(false);
			mockGetCurrentRole.mockReturnValue('member');
			expect(getPostLoginTarget({ tenantSlug: 'Default', redirect: '/login' })).toBe(
				'/Default/dashboard',
			);
		});
	});

	describe('tenantSlug', () => {
		it('null slug → /dashboard', () => {
			expect(getPostLoginTarget({ tenantSlug: null })).toBe('/dashboard');
		});

		it('empty slug → /dashboard', () => {
			expect(getPostLoginTarget({ tenantSlug: '' })).toBe('/dashboard');
		});
	});
});
