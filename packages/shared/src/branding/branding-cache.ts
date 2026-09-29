import type { Branding } from './types';
import { extractBranding } from './extract-branding';

/**
 * 缓存键。三套前缀都要认——顺序不能改，越靠前越早、越权威。
 *
 *   page-init:tenant-branding:  页面内联脚本在 React 之前写入 → 首帧就有缓存色可上
 *   tenant-branding:            运行时写入（writeCachedBranding）
 *   page-init:auth-config: / auth-config:   auth-config 里也带 branding 段，作为兜底
 *
 * 只认第二套的代价是实测过的：首帧读不到缓存，先闪一次品牌默认色再跳到租户色。
 * auth 站的同类实现一直读的是 page-init 键，这里把能力并到共享版，避免两套各读各的。
 */
export const BRANDING_CACHE_PREFIX = 'tenant-branding:';
export const PAGE_INIT_BRANDING_PREFIX = 'page-init:tenant-branding:';
export const AUTH_CONFIG_PREFIX = 'auth-config:';
export const PAGE_INIT_AUTH_CONFIG_PREFIX = 'page-init:auth-config:';

function get(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

/** 兼容 `{data, _ts}` 包装与裸对象两种历史写入形态。 */
function unwrap(raw: string | null): Branding | null {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as { data?: Branding } | Branding;
		return ((parsed as { data?: Branding })?.data ?? parsed) as Branding;
	} catch {
		return null;
	}
}

/** auth-config 缓存里也带 branding 段——作为最后兜底。 */
function fromAuthConfig(slug: string): Branding | null {
	for (const prefix of [PAGE_INIT_AUTH_CONFIG_PREFIX, AUTH_CONFIG_PREFIX]) {
		const raw = get(prefix + slug);
		if (!raw) continue;
		try {
			const cfg = JSON.parse(raw) as { data?: { branding?: unknown } };
			const branding = extractBranding(cfg?.data?.branding);
			if (branding) return branding;
		} catch {
			/* 坏数据视为没有 */
		}
	}
	return null;
}

export function readCachedBranding(slug: string): Branding | null {
	return (
		unwrap(get(PAGE_INIT_BRANDING_PREFIX + slug)) ??
		unwrap(get(BRANDING_CACHE_PREFIX + slug)) ??
		fromAuthConfig(slug)
	);
}

export function writeCachedBranding(slug: string, branding: Branding): void {
	try {
		localStorage.setItem(
			BRANDING_CACHE_PREFIX + slug,
			JSON.stringify({ data: branding, _ts: Date.now() }),
		);
	} catch {
		/* storage full or unavailable */
	}
}
