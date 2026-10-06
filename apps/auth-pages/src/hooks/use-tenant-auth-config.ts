'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@autional/shared';
import {
	PublicAuthConfigByAuthConfig,
	PublicAuthConfigBySlugByBySlug,
} from '@autional/shared/generated/api';
import { getCached, setCached, CACHE_KEYS, TTL } from '@/lib/page-init-cache';

export interface PasswordPolicy {
	minLength?: number;
	maxLength?: number;
	requireUpper?: boolean;
	requireLower?: boolean;
	requireDigit?: boolean;
	requireSpecial?: boolean;
	minStrength?: number;
	expiryDays?: number;
	notRecentlyUsed?: number;
	passwordTransmission?: 'plain' | 'hash' | 'symmetric' | 'asymmetric';
	forceChangeOnFirstLogin?: boolean;
	unicodeAllowed?: boolean;
}

export interface BrandingConfig {
	logoUrl?: string;
	faviconUrl?: string;
	primaryColor?: string;
	primaryColorDark?: string; // ← 与 BrandingData/Branding 类型对齐（二期后端 primary_color_dark 预留）
	secondaryColor?: string;
	companyName?: string;
	loginPageTitle?: string;
	loginPageDescription?: string;
	customCss?: string;
	privacyPolicyUrl?: string;
	termsOfServiceUrl?: string;
}

export interface ComplianceProfile {
	standards?: string[];
	resolvedAt?: string;
}

export interface ComplianceWarning {
	parameter?: string;
	required?: unknown;
	current?: unknown;
	severity?: string;
	description?: string;
}

export interface AuthConfig {
	oauth_client_id?: string;
	oauthClientId?: string;
	passwordPolicy?: PasswordPolicy;
	loginMethods?: string[];
	oauthProviders?: Array<{ type: string; name: string; clientId?: string }>;
	ssoProviders?: Array<{ id: string; name: string }>;
	membershipApproval?: 'open' | 'approval_required' | 'invitation_only';
	magicLinkEnabled?: boolean;
	passkeyEnabled?: boolean;
	breachCheckEnabled?: boolean;
	deviceFingerprintEnabled?: boolean;
	silentChallengeEnabled?: boolean;
	captchaEnabled?: boolean;
	captchaProvider?: string;
	branding?: BrandingConfig;
	complianceProfile?: ComplianceProfile;
	complianceWarnings?: ComplianceWarning[];
	transmissionNonce?: string;
	transmissionNonceExpiresAt?: string;
	transmissionPublicKey?: string;
	transmissionPublicKeyId?: string;
	tenantId?: string;
	tenantSlug?: string;
	tenantName?: string;
}

export type AuthConfigBySlug = AuthConfig & {
	tenantId: string;
	tenantSlug: string;
	tenantName: string;
};

// ─── 持久化缓存（localStorage，跨标签页/会话） ───
// 缓存 TTL 设为 24 小时（品牌色/登录方式等变更不频繁）
const CACHE_TTL = 24 * 60 * 60 * 1000;
const CACHE_PREFIX = 'auth-config:';

interface CacheEntry {
	data: AuthConfigBySlug;
	_ts: number;
}

function getCache(slug: string): AuthConfigBySlug | null {
	try {
		const raw = localStorage.getItem(`${CACHE_PREFIX}${slug}`);
		if (!raw) return null;
		const entry: CacheEntry = JSON.parse(raw);
		return entry.data;
	} catch {
		return null;
	}
}

function setCache(slug: string, data: AuthConfigBySlug): void {
	try {
		const entry: CacheEntry = { data, _ts: Date.now() };
		localStorage.setItem(`${CACHE_PREFIX}${slug}`, JSON.stringify(entry));
	} catch {
		/* storage full or unavailable */
	}
}

function isCacheFresh(slug: string): boolean {
	try {
		const raw = localStorage.getItem(`${CACHE_PREFIX}${slug}`);
		if (!raw) return false;
		const entry: CacheEntry = JSON.parse(raw);
		return Date.now() - entry._ts < CACHE_TTL;
	} catch {
		return false;
	}
}

// ─── 预加载: 打开页面时立即从缓存读取，无等待 ───
// 在 React 组件 mount 之前，同步从 localStorage 读取
// 这样 useQuery 的 placeholderData 能拿到数据，首屏不闪烁
const preloadedCache: Record<string, AuthConfigBySlug> = {};
if (typeof window !== 'undefined') {
	try {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith(CACHE_PREFIX)) {
				const slug = key.slice(CACHE_PREFIX.length);
				const cached = getCache(slug);
				if (cached) preloadedCache[slug] = cached;
			}
		}
	} catch {
		/* ignore */
	}
}

export function getPreloadedConfig(slug: string): AuthConfigBySlug | undefined {
	return preloadedCache[slug];
}

/**
 * 根据 tenantId 获取租户的认证配置
 */
export function useTenantAuthConfig(tenantId: string | null) {
	const cached = tenantId ? getCached<AuthConfig>(CACHE_KEYS.AUTH_CONFIG(tenantId)) : null;

	return useQuery<AuthConfig | null>({
		queryKey: ['tenant-auth-config', tenantId],
		queryFn: async () => {
			if (!tenantId) return null;
			const data = await PublicAuthConfigByAuthConfig(tenantId);
			setCached(CACHE_KEYS.AUTH_CONFIG(tenantId), data);
			return data as AuthConfig;
		},
		enabled: !!tenantId,
		staleTime: TTL.AUTH_CONFIG,
		gcTime: TTL.AUTH_CONFIG * 2,
		placeholderData: cached ?? undefined,
	});
}

/**
 * 根据 tenant slug 获取认证配置
 *
 * 缓存策略（stale-while-revalidate）:
 *   1. 首次访问: 从 localStorage 读缓存 → 直接渲染（零等待）
 *   2. 后台: 发起 API 请求，成功后更新缓存和页面
 *   3. 后续访问: 同上，数据新鲜度由 CACHE_TTL (24h) 控制
 *   4. 缓存过期 (>24h): 仍然先显示旧数据，后台刷新
 */
export function useTenantAuthConfigBySlug(slug: string | null) {
	const cached = slug ? (getCache(slug) ?? preloadedCache[slug] ?? null) : null;

	return useQuery<AuthConfigBySlug | null>({
		queryKey: ['tenant-auth-config-by-slug', slug],
		queryFn: async () => {
			if (!slug) return null;
			const data = await PublicAuthConfigBySlugByBySlug(slug);
			setCache(slug, data as AuthConfigBySlug);
			return data;
		},
		enabled: !!slug,
		staleTime: CACHE_TTL,
		gcTime: CACHE_TTL * 2,
		placeholderData: cached ?? undefined,
		refetchInterval: false,
		refetchOnWindowFocus: false,
	});
}
