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

export function extractSlugFromPath(pathname: string): string | undefined {
	const segments = pathname.split('/').filter(Boolean);
	if (segments.length === 0) return undefined;

	const first = segments[0];

	// Reserved segment at root level — not a slug
	if (RESERVED_SEGMENTS.includes(first.toLowerCase())) return undefined;

	// If only one segment and it looks like a portal prefix — not a slug
	if (segments.length === 1 && ROOT_PORTAL_PREFIXES.includes(first.toLowerCase())) return undefined;

	// Two+ segments: first is a slug unless it's a reserved segment
	// With independent domains, the pattern is /{slug}/route, not /{slug}/{portal}/route
	if (segments.length >= 2) {
		if (!RESERVED_SEGMENTS.includes(first.toLowerCase())) {
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
