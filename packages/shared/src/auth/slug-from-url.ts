'use client';

/**
 * Extract tenant slug from current URL path.
 * Works for patterns like /{slug}/admin, /{slug}/developer, /{slug}/dashboard, etc.
 * Returns undefined if no slug pattern detected.
 *
 * Portals and reserved paths are excluded from slug detection:
 * - Reserved paths: /oauth, /bff, /api, /health, /assets, etc.
 * - Known portal prefixes at root: /admin, /developer, /security, etc.
 */

const RESERVED_SEGMENTS = [
	'oauth',
	'bff',
	'api',
	'api-v1',
	'health',
	'metrics',
	'assets',
	'docs',
	'scalar',
	'fonts',
	'env.js',
	'sdk',
	'static',
];

const ROOT_PORTAL_PREFIXES: string[] = []; // No longer needed — each portal is now on its own domain

/**
 * 各 portal 自己的**业务路由首段**——它们不是租户 slug。
 *
 * 为什么是「注册」而不是在这里写死一份名单：这是**应用知识**，不是通用知识。
 * auth 的 /login、/mfa-challenge、/account-deletion 对其他 portal 没有意义；
 * 反过来 admin 的 /wallets、/settings 也不该塞进通用层。写死一份大名单，
 * 等于把某一个 app 的路由表变成所有 portal 的契约。
 *
 * 实测（2026-09-29）：这份名单缺席时，extractSlugFromPath 会把**一切业务路由**
 * 判成租户——/settings → 'settings'、/users/123 → 'users'、/dashboard → 'dashboard'。
 * auth 站正是因此自己复制了一份带 24 项白名单的实现，而不是复用这里的函数。
 */
const NON_TENANT_SEGMENTS = new Set<string>();

/** 由各 portal 在启动时注册自己的业务路由首段（大小写不敏感）。可多次调用。 */
export function registerNonTenantSegments(segments: readonly string[]): void {
	for (const s of segments) {
		const v = String(s || '').trim().toLowerCase().replace(/^\/+|\/+$/g, '');
		if (v) NON_TENANT_SEGMENTS.add(v);
	}
}

/** 测试与多租户切换场景用：清空已注册的业务路由。 */
export function clearNonTenantSegments(): void {
	NON_TENANT_SEGMENTS.clear();
}

const isNonTenant = (seg: string) => RESERVED_SEGMENTS.includes(seg) || NON_TENANT_SEGMENTS.has(seg);


export function extractSlugFromPath(pathname: string): string | undefined {
	const segments = pathname.split('/').filter(Boolean);
	if (segments.length === 0) return undefined;

	const first = segments[0];

	// Reserved segment at root level — not a slug
	if (isNonTenant(first.toLowerCase())) return undefined;

	// If only one segment and it looks like a portal prefix — not a slug
	if (segments.length === 1 && ROOT_PORTAL_PREFIXES.includes(first.toLowerCase())) return undefined;

	// Two+ segments: first is a slug unless it's a reserved segment
	// With independent domains, the pattern is /{slug}/route, not /{slug}/{portal}/route
	if (segments.length >= 2) {
		if (!isNonTenant(first.toLowerCase())) {
			return first;
		}
	}

	// Single segment that's not a reserved path or portal prefix — could be a slug
	if (segments.length === 1) {
		return first;
	}

	return undefined;
}

export function useTenantSlugFromUrl(): string | undefined {
	if (typeof window === 'undefined') return undefined;
	return extractSlugFromPath(window.location.pathname);
}
