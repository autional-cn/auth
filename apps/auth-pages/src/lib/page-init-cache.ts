/**
 * Unified localStorage cache for page initialization data
 *
 * Namespace: `page-init:*` for new caches.
 * Preloading scans both `page-init:*` and legacy namespaces for backward compat.
 *
 * Used by: useAuthPageInit, BrandingInitializer, usePublicTenants, use-tenant-auth-config
 *
 * Key design:
 *   - Module-level preloaded cache: scanned once at import time, sync access
 *   - TTL at write time (not read time): stale data still returned as placeholder
 *   - Silent failures: localStorage quota/availability issues never break the app
 */

// ─── Cache Namespace ───

const PAGE_INIT_PREFIX = 'page-init:';

// Legacy prefixes (for backward compat preloading)
const LEGACY_PREFIXES = ['auth-config:', 'tenant-branding:'];

export const CACHE_KEYS = {
	AUTH_CONFIG: (slug: string) => `${PAGE_INIT_PREFIX}auth-config:${slug}`,
	PUBLIC_TENANTS: `${PAGE_INIT_PREFIX}public-tenants`,
	OAUTH_PROVIDERS: `${PAGE_INIT_PREFIX}oauth-providers`,
	TENANT_BRANDING: (slug: string) => `${PAGE_INIT_PREFIX}tenant-branding:${slug}`,
} as const;

export const TTL = {
	AUTH_CONFIG: 24 * 60 * 60 * 1000, // 24h
	PUBLIC_TENANTS: 6 * 60 * 60 * 1000, // 6h
	OAUTH_PROVIDERS: 24 * 60 * 60 * 1000, // 24h
	TENANT_BRANDING: 24 * 60 * 60 * 1000, // 24h
} as const;

// ─── Entry shape ───

interface CacheEntry<T> {
	data: T;
	_ts: number;
}

// ─── Cache utilities ───

export function getCached<T>(key: string): T | null {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return null;
		const entry: CacheEntry<T> = JSON.parse(raw);
		return entry.data;
	} catch {
		return null;
	}
}

export function setCached<T>(key: string, data: T): void {
	try {
		const entry: CacheEntry<T> = { data, _ts: Date.now() };
		localStorage.setItem(key, JSON.stringify(entry));
	} catch {
		/* storage full or unavailable */
	}
}

export function isCacheFresh(key: string, ttl: number): boolean {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return false;
		const entry: CacheEntry<unknown> = JSON.parse(raw);
		return Date.now() - entry._ts < ttl;
	} catch {
		return false;
	}
}

// ─── Preloaded cache (scanned once at module load) ───

interface PreloadedStore {
	[key: string]: unknown;
}

const preloaded: PreloadedStore = {};

if (typeof window !== 'undefined') {
	try {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (!key) continue;

			// Match page-init namespace
			if (key.startsWith(PAGE_INIT_PREFIX)) {
				const data = getCached(key);
				if (data !== null) preloaded[key] = data;
				continue;
			}

			// Match legacy namespaces for backward compat
			if (LEGACY_PREFIXES.some((p) => key.startsWith(p))) {
				const data = getCached(key);
				if (data !== null) preloaded[key as string] = data;
			}
		}
	} catch {
		/* localStorage unavailable */
	}
}

/**
 * Synchronous read from preloaded cache.
 * Returns the value if it was cached at module load time, else undefined.
 */
export function getPreloaded<T>(key: string): T | undefined {
	return preloaded[key] as T | undefined;
}
