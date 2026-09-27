import { describe, it, expect } from 'vitest';
import { isAdminRedirect } from '../page';

describe('isAdminRedirect', () => {
	describe('relative paths', () => {
		it('matches /admin', () => {
			expect(isAdminRedirect('/admin')).toBe(true);
		});
		it('matches /admin/dashboard', () => {
			expect(isAdminRedirect('/admin/dashboard')).toBe(true);
		});
		it('matches /developer', () => {
			expect(isAdminRedirect('/developer')).toBe(true);
		});
		it('matches /developer/projects', () => {
			expect(isAdminRedirect('/developer/projects')).toBe(true);
		});
		it('matches /security', () => {
			expect(isAdminRedirect('/security')).toBe(true);
		});
		it('matches /security/alerts', () => {
			expect(isAdminRedirect('/security/alerts')).toBe(true);
		});
		it('matches /platform', () => {
			expect(isAdminRedirect('/platform')).toBe(true);
		});
		it('matches /platform/settings', () => {
			expect(isAdminRedirect('/platform/settings')).toBe(true);
		});
		it('does not match /admin-other (exact prefix guard)', () => {
			expect(isAdminRedirect('/admin-other')).toBe(false);
		});
		it('does not match /user', () => {
			expect(isAdminRedirect('/user')).toBe(false);
		});
		it('does not match /login', () => {
			expect(isAdminRedirect('/login')).toBe(false);
		});
		it('does not match /', () => {
			expect(isAdminRedirect('/')).toBe(false);
		});
	});

	describe('absolute URLs', () => {
		it('matches https://app.iam.tianv.com/admin', () => {
			expect(isAdminRedirect('https://app.iam.tianv.com/admin')).toBe(true);
		});
		it('matches https://app.iam.tianv.com/admin/dashboard', () => {
			expect(isAdminRedirect('https://app.iam.tianv.com/admin/dashboard')).toBe(true);
		});
		it('matches https://app.iam.tianv.com/developer', () => {
			expect(isAdminRedirect('https://app.iam.tianv.com/developer')).toBe(true);
		});
		it('matches https://app.iam.tianv.com/security', () => {
			expect(isAdminRedirect('https://app.iam.tianv.com/security')).toBe(true);
		});
		it('matches https://app.iam.tianv.com/platform', () => {
			expect(isAdminRedirect('https://app.iam.tianv.com/platform')).toBe(true);
		});
		it('matches with query params', () => {
			expect(isAdminRedirect('https://app.iam.tianv.com/admin?foo=bar')).toBe(true);
		});
		it('does not match non-admin absolute URL', () => {
			expect(isAdminRedirect('https://user.iam.tianv.com/dashboard')).toBe(false);
		});
		it('does not match auth domain', () => {
			expect(isAdminRedirect('https://auth.iam.tianv.com/login')).toBe(false);
		});
	});

	describe('tenant-slug paths', () => {
		it('matches /acme-corp/admin', () => {
			expect(isAdminRedirect('/acme-corp/admin')).toBe(true);
		});
		it('matches /acme-corp/admin/dashboard', () => {
			expect(isAdminRedirect('/acme-corp/admin/dashboard')).toBe(true);
		});
		it('matches /acme-corp/developer', () => {
			expect(isAdminRedirect('/acme-corp/developer')).toBe(true);
		});
		it('matches /acme-corp/security', () => {
			expect(isAdminRedirect('/acme-corp/security')).toBe(true);
		});
		it('matches /acme-corp/platform', () => {
			expect(isAdminRedirect('/acme-corp/platform')).toBe(true);
		});
		it('does not match /acme-corp/user (not admin)', () => {
			expect(isAdminRedirect('/acme-corp/user')).toBe(false);
		});
		it('does not match /acme-corp/login', () => {
			expect(isAdminRedirect('/acme-corp/login')).toBe(false);
		});
		it('does not match single-segment slug', () => {
			expect(isAdminRedirect('/admin')).toBe(true); // direct match, not slug
			expect(isAdminRedirect('/onlyslug')).toBe(false);
		});
		it('matches absolute URL with tenant slug', () => {
			expect(isAdminRedirect('https://app.iam.tianv.com/acme-corp/admin')).toBe(true);
		});
		it('matches absolute URL with tenant slug and subpath', () => {
			expect(isAdminRedirect('https://app.iam.tianv.com/acme-corp/admin/dashboard')).toBe(true);
		});
		it('does not match absolute URL with non-admin tenant slug path', () => {
			expect(isAdminRedirect('https://app.iam.tianv.com/acme-corp/dashboard')).toBe(false);
		});
	});

	describe('edge cases', () => {
		it('returns false for null', () => {
			expect(isAdminRedirect(null)).toBe(false);
		});
		it('returns false for empty string', () => {
			expect(isAdminRedirect('')).toBe(false);
		});
		it('matches /admin with trailing slash (handled as startsWith /admin/)', () => {
			expect(isAdminRedirect('/admin/')).toBe(true);
		});
		it('does not match /administrator (exact prefix guard)', () => {
			expect(isAdminRedirect('/administrator')).toBe(false);
		});
		it('does not match /developers (exact prefix guard)', () => {
			expect(isAdminRedirect('/developers')).toBe(false);
		});
	});
});
