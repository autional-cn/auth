import { BASE_PATH } from './index';

/**
 * Resolve the React Router basename based on the current URL.
 *
 * This function is used by the END-USER PORTAL only (see apps/end-user-portal/src/main.tsx).
 * In the user portal every route lives under /{tenantSlug}/..., so the basename is
 * always "/{tenantSlug}" — the second path segment is an APPLICATION ROUTE (e.g. /security,
 * /profile, /devices), never a portal slug. Treating the second segment as a portal slug
 * (as the shared getAppPortalSlugs() table does for the admin/developer portals) hijacks
 * URLs such as /acme-corp/security and renders the Dashboard instead of the security page.
 *
 * Returns "/{firstSegment}" when the URL matches /{segment}/{...}, otherwise BASE_PATH.
 *
 * Also syncs window.__APP_CONFIG__.BASE_PATH so oauth-login.ts
 * derives a redirect_uri consistent with the actual basename.
 *
 * @example
 *   URL: /acme-corp/security → basename: "/acme-corp"
 *   URL: /acme-corp/profile  → basename: "/acme-corp"
 *   URL: /oauth/callback     → basename: BASE_PATH (reserved)
 */
export function resolvePortalBasename(): string {
	const base = (BASE_PATH || '').replace(/\/*$/, '') || '/';

	if (typeof window === 'undefined') return base;

	try {
		const path = window.location.pathname;
		const RESERVED = ['oauth', 'bff', 'api', 'health', 'env.js', 'assets', 'docs', 'scalar'];

		const m = path.match(/^\/([a-zA-Z0-9_-]+)(\/[a-z-]+)/);
		let basename = base;
		if (m && !RESERVED.includes(m[1])) {
			// User portal: the first segment is the tenant slug; the second segment
			// (and beyond) are app routes that must stay inside the router path.
			basename = '/' + m[1];
		}

		// Sync __APP_CONFIG__.BASE_PATH for oauth-login.ts redirect_uri derivation
		syncAppConfigPath(basename);
		return basename;
	} catch {
		return base;
	}
}

function syncAppConfigPath(basename: string): void {
	try {
		if (!(globalThis as any).__APP_CONFIG__) {
			(globalThis as any).__APP_CONFIG__ = {};
		}
		(globalThis as any).__APP_CONFIG__.BASE_PATH = basename;
	} catch {
		// ignore
	}
}
