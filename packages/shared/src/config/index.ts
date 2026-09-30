// Autional Web Environment Configuration
// Override priority: runtime (window.__APP_CONFIG__) > build-time (import.meta.env) > defaults

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Runtime Config ───
function getRuntimeConfig(): Record<string, string> | undefined {
	try {
		return (globalThis as any)['window']?.__APP_CONFIG__;
	} catch {
		return undefined;
	}
}

const getEnv = (key: string, fallback: string): string => {
	const runtime = getRuntimeConfig();
	if (key === 'BASE_PATH') {
		const viteBase = (() => {
			try {
				const baseUrl = (import.meta as any).env?.BASE_URL;
				if (!baseUrl || baseUrl === '/') return undefined;
				return baseUrl.replace(/\/$/, '');
			} catch {
				return undefined;
			}
		})();
		return runtime?.[key] ?? viteBase ?? fallback;
	}
	const val =
		runtime?.[key] ??
		(() => {
			try {
				return (import.meta as any).env?.[key];
			} catch {
				return undefined;
			}
		})() ??
		fallback;

	if ((import.meta as any).env?.PROD && val.startsWith('http://localhost')) {
		console.error(
			`[Autional] CRITICAL: ${key} resolved to ${val}. ` +
				`env.js is missing or broken. Check deployment pipeline.`,
		);
	}

	return val;
};

// ─── Base Path ───
export const BASE_PATH = getEnv('BASE_PATH', '/');

const APP_PORTAL_SLUGS = ['admin', 'developer', 'security', 'platform', 'status', 'trust'] as const;
void APP_PORTAL_SLUGS;

export function getRouterBasename(): string {
	const base = BASE_PATH.replace(/\/$/, '') || '/';
	if (typeof window === 'undefined') return base;
	if (base === '/') return '/';
	const path = window.location.pathname;
	if (path === '/') return '/';
	const match = path.match(/^\/([a-zA-Z0-9_-]+)(\/[a-z-]+)/);
	if (match) {
		const portal = match[2].replace(/^\//, '').split('/')[0];
		if (getAppPortalSlugs().includes(portal)) {
			return '/' + match[1] + '/' + portal;
		}
		return '/' + match[1];
	}
	return base;
}

export const ROUTER_BASENAME = getRouterBasename();

export const VITE_BASE = BASE_PATH.endsWith('/') ? BASE_PATH : BASE_PATH + '/';

// ─── Portal URL Resolution (API-driven, runtime getRootDomain fallback) ───
export interface PortalEntry {
	host: string;
	base: string;
}

const PORTAL_DEFAULTS: Record<string, PortalEntry> = {
	auth: { host: 'auth', base: '' },
	admin: { host: 'admin', base: '' },
	developer: { host: 'developer', base: '' },
	user: { host: 'user', base: '' },
	security: { host: 'security', base: '' },
	status: { host: 'status', base: '' },
	landing: { host: '', base: '' },
	authenticator: { host: 'authenticator', base: '' },
	trust: { host: 'trust', base: '' },
	platform: { host: 'platform', base: '' },
	brand: { host: 'brand', base: '' },
};

let portalConfig: Record<string, PortalEntry> | null = null;

export async function initPortalConfig(
	apiBaseUrl: string,
	platformTenantId?: string,
): Promise<void> {
	if (portalConfig) return;
	try {
		const tid = platformTenantId || '';
		if (!tid) {
			portalConfig = PORTAL_DEFAULTS;
			return;
		}
		const res = await fetch(
			`${apiBaseUrl}/tenant/api/v1/admin/tenants/${tid}/applications?type=portal&is_platform=true`,
		);
		const json = await res.json();
		if (json.code === 0 && Array.isArray(json.data) && json.data.length > 0) {
			const config: Record<string, PortalEntry> = {};
			for (const app of json.data) {
				config[app.code] = {
					host: app.config?.portal?.host || PORTAL_DEFAULTS[app.code]?.host || app.code,
					base: app.config?.portal?.base || PORTAL_DEFAULTS[app.code]?.base || '',
				};
			}
			portalConfig = config;
			return;
		}
	} catch {
		/* ignore */
	}
	portalConfig = PORTAL_DEFAULTS;
}

// 旧 env.js 直连 URL 键（VITE_*_URL）→ portalId 映射（向后兼容）
const PORTAL_KEY_MAP: Record<string, string> = {
	auth: 'VITE_AUTH_PAGES_URL',
	admin: 'VITE_ADMIN_CONSOLE_URL',
	developer: 'VITE_DEVELOPER_PORTAL_URL',
	user: 'VITE_END_USER_PORTAL_URL',
	security: 'VITE_SECURITY_DASHBOARD_URL',
	status: 'VITE_STATUS_PAGE_URL',
	landing: 'VITE_LANDING_SITE_URL',
	authenticator: 'VITE_AUTHENTICATOR_APP_URL',
	trust: 'VITE_TRUST_CENTER_URL',
	platform: 'VITE_PLATFORM_CONSOLE_URL',
};

/**
 * 读取构建期注入的 VITE_PORTAL_CONFIG（env.js → window.__APP_CONFIG__）。
 * 不存在时返回 null（兼容旧 env.js）。
 */
function getPortalConfigFromEnv(): Record<string, PortalEntry> | null {
	try {
		return (globalThis as any)['window']?.__APP_CONFIG__?.VITE_PORTAL_CONFIG || null;
	} catch {
		return null;
	}
}

function resolvePortalUrl(entry: PortalEntry, hostname: string, slug?: string): string {
	const { host, base } = entry;

	// 推导根域名：如果当前域名以已知 Portal 子域名开头，剥离前缀得到根
	// 例如 auth.iam.tianv.local → iam.tianv.local，auth.autional.local → autional.local
	const knownHosts = Object.values(getPortalEntries())
		.map((e) => e.host)
		.filter(Boolean);
	const parts = hostname.split('.');
	const root =
		parts.length >= 3 && knownHosts.includes(parts[0])
			? parts.slice(1).join('.')
			: getRootDomain(hostname);

	const fullHost = host ? `${host}.${root}` : root;
	let url = `${window.location.protocol}//${fullHost}${base || ''}`;
	if (slug) {
		const slugPath = slug.startsWith('/') ? slug : '/' + slug;
		url += slugPath;
	}
	return url;
}

// 租户段门户白名单：仅这些门户的入口带 /<tenantSlug>（门户 URL 统一方案）。
// platform 于 09-30 修订加入（F-W8 再修）：platform 控制台本就是租户段挂载应用
// （legacy seed 049 requires_slug:true），且 OAuth client 按 slug 解析 —— 不拼租户段时
// 控制台拿不到 client，裸根入口退化为登录死循环。其余门户（status/trust/developer/
// brand/landing）是域根应用，拼租户段会命中不存在的路由 ⇒ 空白/404。
// 新增租户段门户时须同步在此登记。
const SLUG_PORTALS: ReadonlySet<string> = new Set([
	'auth',
	'admin',
	'user',
	'security',
	'authenticator',
	'platform',
]);

export function getPortalUrl(portalId: string, slug?: string): string {
	if (typeof window === 'undefined') return '';
	const hostname = window.location.hostname;
	const effectiveSlug = SLUG_PORTALS.has(portalId) ? slug : undefined;

	// 1. env-driven VITE_PORTAL_CONFIG（构建期写入 env.js，多环境域名解析架构）
	const envConfig = getPortalConfigFromEnv();
	if (envConfig?.[portalId])
		return resolvePortalUrl(envConfig[portalId], hostname, effectiveSlug);

	// 2. 运行时 API 配置（initPortalConfig — platform tenant apps）
	if (portalConfig?.[portalId])
		return resolvePortalUrl(portalConfig[portalId], hostname, effectiveSlug);

	// 3. 旧 env.js 直连 URL（VITE_*_URL，与 VITE_PORTAL_CONFIG 不共存）
	const cfg = getRuntimeConfig();
	const key = PORTAL_KEY_MAP[portalId];
	if (cfg?.[key]) {
		let url = cfg[key];
		if (effectiveSlug)
			url =
				url.replace(/\/+$/, '') +
				(effectiveSlug.startsWith('/') ? effectiveSlug : '/' + effectiveSlug);
		return url;
	}

	// 4. 默认表
	const def = PORTAL_DEFAULTS[portalId];
	if (def) return resolvePortalUrl(def, hostname, effectiveSlug);

	// 5. 未知 portal：回退当前 origin + /portalId（未知门户不在白名单 ⇒ 不拼租户段）
	let fallback = `${window.location.origin}/${portalId}`;
	if (effectiveSlug)
		fallback += effectiveSlug.startsWith('/') ? effectiveSlug : '/' + effectiveSlug;
	return fallback;
}

// 导出 portal 配置（供 getPortalUrl 内部使用）
// 三源合并：env（VITE_PORTAL_CONFIG）优先 → 运行时 API 配置补充 → defaults 兜底，
// 避免 env 只配部分 portal 时 knownHosts 不完整导致域名推导偏差
function getPortalEntries(): Record<string, PortalEntry> {
	const merged: Record<string, PortalEntry> = { ...PORTAL_DEFAULTS, ...portalConfig };
	const envConfig = getPortalConfigFromEnv();
	if (envConfig) {
		Object.assign(merged, envConfig);
	}
	return merged;
}

export function getAppPortalSlugs(): string[] {
	return ['admin', 'developer', 'security', 'platform', 'status', 'trust'];
}

export function getRootDomain(hostname: string, _rootParts?: number): string {
	if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return hostname;
	if (hostname === 'localhost' || hostname === '127.0.0.1') return hostname;

	// 优先从 env.js 读注入的根域名
	const knownRoot = getEnv('VITE_ROOT_DOMAIN', '');
	if (knownRoot && (hostname === knownRoot || hostname.endsWith('.' + knownRoot))) {
		return knownRoot;
	}

	const parts = hostname.split('.');

	// .local 结尾（如 iam.tianv.local）：取 3 段
	if (hostname.endsWith('.local') && parts.length >= 3) {
		return parts.slice(-3).join('.');
	}

	// 常见两段式 TLD（如 .com.cn、.co.uk）
	const twoPartTLDs = new Set(['com.cn', 'co.uk', 'co.jp', 'com.au', 'co.nz']);
	if (parts.length >= 4) {
		const lastTwo = parts.slice(-2).join('.');
		if (twoPartTLDs.has(lastTwo)) return parts.slice(-3).join('.');
	}

	// 常见单段 TLD（.com/.net 等）：与 .local / 两段式 TLD 一致，超过 3 段时保留 3 段
	// app.iam.tianv.com → iam.tianv.com（保留中间段 iam，避免推导成 tianv.com）
	// app.autional.com  → autional.com（3 段走默认规则取后 2 段）
	const singlePartTLDs = new Set([
		'com',
		'net',
		'org',
		'io',
		'co',
		'ai',
		'dev',
		'app',
		'me',
		'info',
		'biz',
		'cn',
		'tech',
		'site',
	]);
	if (parts.length >= 4 && singlePartTLDs.has(parts[parts.length - 1])) {
		return parts.slice(-3).join('.');
	}

	// 标准情况：取后 2 段（domain.tld）
	if (parts.length >= 2) return parts.slice(-2).join('.');
	return hostname;
}

/** Resolve all portal URLs for redirect origin validation. */
function getAllowedRedirectOrigins(): string[] {
	const portalIds = [
		'auth',
		'admin',
		'developer',
		'user',
		'security',
		'status',
		'landing',
		'authenticator',
		'trust',
		'platform',
		'brand',
	];
	return portalIds
		.map((id) => {
			try {
				return getPortalUrl(id);
			} catch {
				return '';
			}
		})
		.filter(Boolean);
}

// ─── Service URLs (runtime-resolved via getPortalUrl) ───
export function getAUTH_PAGES_URL(): string {
	return getPortalUrl('auth');
}
export function getADMIN_CONSOLE_URL(): string {
	return getPortalUrl('admin');
}
export function getDEVELOPER_PORTAL_URL(): string {
	return getPortalUrl('developer');
}
export function getEND_USER_PORTAL_URL(): string {
	return getPortalUrl('user');
}
export function getSECURITY_DASHBOARD_URL(): string {
	return getPortalUrl('security');
}
export function getSTATUS_PAGE_URL(): string {
	return getPortalUrl('status');
}
export function getLANDING_SITE_URL(): string {
	return getPortalUrl('landing');
}
export function getAUTHENTICATOR_APP_URL(): string {
	return getPortalUrl('authenticator');
}
export function getTRUST_CENTER_URL(): string {
	return getPortalUrl('trust');
}
export function getPLATFORM_CONSOLE_URL(): string {
	return getPortalUrl('platform');
}
export const API_BASE_URL = getEnv('VITE_API_BASE_URL', '/bff');

export function getApiBaseUrl(): string {
	return API_BASE_URL;
}

export function isValidRedirect(url: string): boolean {
	// 仅允许站内相对路径；拒绝 //evil.com、/\、/%5c 等协议相对/反斜杠变体
	if (
		url.startsWith('/') &&
		!url.startsWith('//') &&
		!url.startsWith('/\\') &&
		!url.startsWith('/%5c')
	) {
		return true;
	}
	try {
		const target = new URL(url);
		if (typeof window !== 'undefined' && target.origin === window.location.origin) {
			return true;
		}
		const origins = getAllowedRedirectOrigins();
		return origins.some((o) => {
			if (!o) return false;
			try {
				const origin = new URL(o);
				return target.origin === origin.origin;
			} catch {
				return false;
			}
		});
	} catch {
		return false;
	}
}

// ─── Navigation Helpers ───
export function appPath(path: string): string {
	const base = BASE_PATH.replace(/\/$/, '');
	const cleanPath = path.startsWith('/') ? path : '/' + path;
	return base + cleanPath;
}

export function navigateTo(path: string): void {
	if (typeof window !== 'undefined') {
		window.location.href = appPath(path);
	}
}

export function crossAppUrl(base: string, path?: string): string {
	const normalizedBase = base.replace(/\/+$/, '');
	const normalizedPath = path && path !== '/' ? (path.startsWith('/') ? path : '/' + path) : '';
	const full = normalizedBase + normalizedPath;
	if (/^https?:\/\//.test(full)) return full;
	if (typeof window !== 'undefined') {
		return window.location.origin + full;
	}
	return full;
}
