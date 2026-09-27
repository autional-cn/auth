import { describe, it, expect } from 'vitest';
import { extractSlugFromPath } from '../slug-from-url';

describe('extractSlugFromPath', () => {
	describe('tenant slug patterns', () => {
		it('extracts slug from /{slug}/admin', () => {
			expect(extractSlugFromPath('/acme/admin')).toBe('acme');
		});

		it('extracts slug from /{slug}/developer', () => {
			expect(extractSlugFromPath('/foo/developer')).toBe('foo');
		});

		it('extracts slug from /{slug}/security', () => {
			expect(extractSlugFromPath('/bar/security')).toBe('bar');
		});

		it('extracts slug from /{slug}/admin/dashboard (3 segments)', () => {
			expect(extractSlugFromPath('/mycorp/admin/dashboard')).toBe('mycorp');
		});

		it('extracts slug with dashes and numbers', () => {
			expect(extractSlugFromPath('/acme-corp-123/admin')).toBe('acme-corp-123');
		});

		it('extracts slug when followed by portal prefix in path with extra segments', () => {
			expect(extractSlugFromPath('/tenant1/admin/users/123')).toBe('tenant1');
		});
	});

	describe('no slug — returns undefined', () => {
		it('returns undefined for root /', () => {
			expect(extractSlugFromPath('/')).toBeUndefined();
		});

		it('returns admin as slug candidate for /admin (no root portal prefix after domain migration)', () => {
			expect(extractSlugFromPath('/admin')).toBe('admin');
		});

		it('returns developer as slug candidate (no longer a root portal after domain migration)', () => {
			// ADR-005: each portal has its own domain, /developer is no longer a root portal prefix
			expect(extractSlugFromPath('/developer')).toBe('developer');
		});

		it('returns undefined for reserved paths', () => {
			expect(extractSlugFromPath('/oauth/callback')).toBeUndefined();
			expect(extractSlugFromPath('/bff/identity/api/v1/me')).toBeUndefined();
			expect(extractSlugFromPath('/api/v1/health')).toBeUndefined();
			expect(extractSlugFromPath('/assets/logo.png')).toBeUndefined();
		});

		it('returns admin as slug candidate for /admin/users (domain migration: no portal prefix at root)', () => {
			// ADR-005: each portal has its own domain, so /{slug}/users pattern is expected
			expect(extractSlugFromPath('/admin/users')).toBe('admin');
		});
	});

	describe('edge cases', () => {
		it('handles empty string', () => {
			expect(extractSlugFromPath('')).toBeUndefined();
		});

		it('handles trailing slash', () => {
			expect(extractSlugFromPath('/acme/admin/')).toBe('acme');
		});

		it('returns undefined for reserved-first segment even with portal second', () => {
			// oauth is reserved, so /oauth/admin has no valid slug
			expect(extractSlugFromPath('/oauth/admin')).toBeUndefined();
		});

		it('returns admin as slug candidate for /admin/settings (no portal prefix at root after domain migration)', () => {
			// ADR-005: independent domains — no root portal prefixes
			expect(extractSlugFromPath('/admin/settings')).toBe('admin');
		});
	});
});
