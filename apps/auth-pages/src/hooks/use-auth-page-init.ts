'use client';

import { useQueries } from '@tanstack/react-query';
import {
	PublicAuthConfigBySlugByBySlug,
	tenantPublicTenants,
	tenantPublicTenantsByTenants,
} from '@autional/shared/generated/api';
import { getOAuthProviders } from '@/lib/api.generated';
import { getCached, setCached, getPreloaded, CACHE_KEYS, TTL } from '@/lib/page-init-cache';
import { extractList } from '@autional/shared';
import type { AuthConfigBySlug } from '@/hooks/use-tenant-auth-config';
import type { TenantOption } from '@/hooks/use-public-tenants';

// ─── Types ───

export interface OAuthProviderItem {
	type: string;
	name: string;
}

export interface BrandingData {
	primaryColor: string;
	primaryColorDark?: string; // ← 新增（二期后端 primary_color_dark，本期恒 undefined）
	logoUrl: string;
	faviconUrl: string;
	customCss: string;
	secondaryColor?: string;
	companyName?: string;
	loginPageTitle?: string;
	loginPageDescription?: string;
	privacyPolicyUrl?: string;
	termsOfServiceUrl?: string;
}

// ─── Branding extractor (handles both snake_case and camelCase) ───

export function extractBrandingFields(raw: unknown): BrandingData | null {
	if (!raw || typeof raw !== 'object') return null;
	const data = (raw as Record<string, unknown>)?.branding || raw;
	const r = data as Record<string, unknown>;
	if (r.logo_url || r.logoUrl || r.primary_color || r.primaryColor) {
		return {
			primaryColor: (r.primary_color as string) || (r.primaryColor as string) || '',
			primaryColorDark:
				(r.primary_color_dark as string) || (r.primaryColorDark as string) || undefined,
			logoUrl: (r.logo_url as string) || (r.logoUrl as string) || '',
			faviconUrl: (r.favicon_url as string) || (r.faviconUrl as string) || '',
			customCss: (r.custom_css as string) || (r.customCss as string) || '',
			secondaryColor: (r.secondary_color as string) || (r.secondaryColor as string) || undefined,
			companyName: (r.company_name as string) || (r.companyName as string) || undefined,
			loginPageTitle: (r.login_page_title as string) || (r.loginPageTitle as string) || undefined,
			loginPageDescription:
				(r.login_page_description as string) || (r.loginPageDescription as string) || undefined,
			privacyPolicyUrl:
				(r.privacy_policy_url as string) || (r.privacyPolicyUrl as string) || undefined,
			termsOfServiceUrl:
				(r.terms_of_service_url as string) || (r.termsOfServiceUrl as string) || undefined,
		};
	}
	return null;
}

// ─── Hook ───

export interface AuthPageInitResult {
	authConfig: {
		data: AuthConfigBySlug | null | undefined;
		isLoading: boolean;
		isError: boolean;
	};
	publicTenants: {
		data: TenantOption[];
		isLoading: boolean;
		isError: boolean;
	};
	oauthProviders: {
		data: OAuthProviderItem[];
		isLoading: boolean;
		isError: boolean;
	};
	branding: {
		data: BrandingData | null | undefined;
		isLoading: boolean;
		isError: boolean;
	};
	/** True when ANY of the four queries is loading */
	isLoading: boolean;
	/** True when ANY of the four queries has errored */
	isError: boolean;
}

/**
 * Unified initialization hook for auth pages.
 *
 * Merges 4 read-only, low-frequency API calls into a single `useQueries` call:
 *   1. Auth config by slug (24h cache)
 *   2. Public tenants list (6h cache)
 *   3. OAuth providers (24h cache)
 *   4. Tenant branding (24h cache)
 *
 * Query keys match existing hooks for automatic deduplication:
 *   - `tenant-auth-config-by-slug` matches useTenantAuthConfigBySlug
 *   - `public-tenants` matches usePublicTenants
 *   - `oauth-providers` matches the inline query in page.tsx
 *   - `tenant-branding` is new (shared with BrandingInitializer)
 *
 * All data is preloaded from localStorage cache at module load for zero-wait first paint.
 */
export function useAuthPageInit(slug: string | null): AuthPageInitResult {
	// ── Sync preloaded data from localStorage cache (module-level) ──
	const preloadedAuthConfig: AuthConfigBySlug | undefined = slug
		? (getPreloaded<AuthConfigBySlug>(CACHE_KEYS.AUTH_CONFIG(slug)) ??
			getPreloaded<AuthConfigBySlug>(`auth-config:${slug}`)) // legacy key
		: undefined;

	const preloadedTenants: TenantOption[] | undefined =
		getPreloaded<TenantOption[]>(CACHE_KEYS.PUBLIC_TENANTS) ?? undefined;

	const preloadedOAuth: OAuthProviderItem[] | undefined =
		getPreloaded<OAuthProviderItem[]>(CACHE_KEYS.OAUTH_PROVIDERS) ?? undefined;

	const preloadedBranding: BrandingData | undefined = slug
		? (getPreloaded<BrandingData>(CACHE_KEYS.TENANT_BRANDING(slug)) ??
			getPreloaded<BrandingData>(`tenant-branding:${slug}`)) // legacy key
		: undefined;

	// ── Fallback to sync getCached if preloaded didn't catch it ──
	const fallbackAuthConfig = slug
		? getCached<AuthConfigBySlug>(CACHE_KEYS.AUTH_CONFIG(slug))
		: null;
	const fallbackTenants = getCached<TenantOption[]>(CACHE_KEYS.PUBLIC_TENANTS);
	const fallbackOAuth = getCached<OAuthProviderItem[]>(CACHE_KEYS.OAUTH_PROVIDERS);
	const fallbackBranding = slug ? getCached<BrandingData>(CACHE_KEYS.TENANT_BRANDING(slug)) : null;

	const results = useQueries({
		queries: [
			// 1. Auth config by slug — key matches useTenantAuthConfigBySlug
			{
				queryKey: ['tenant-auth-config-by-slug', slug],
				queryFn: async () => {
					if (!slug) return null;
					const data = (await PublicAuthConfigBySlugByBySlug(slug)) as AuthConfigBySlug;
					setCached(CACHE_KEYS.AUTH_CONFIG(slug), data);
					return data;
				},
				enabled: !!slug,
				staleTime: TTL.AUTH_CONFIG,
				gcTime: TTL.AUTH_CONFIG * 2,
				placeholderData: (preloadedAuthConfig ?? fallbackAuthConfig ?? undefined) as
					| AuthConfigBySlug
					| undefined,
			},
			// 2. Public tenants — key matches usePublicTenants
			{
				queryKey: ['public-tenants'],
				queryFn: async () => {
					const res = await tenantPublicTenants();
					const items: TenantOption[] = extractList(res);
					setCached(CACHE_KEYS.PUBLIC_TENANTS, items);
					return items;
				},
				staleTime: TTL.PUBLIC_TENANTS,
				gcTime: TTL.PUBLIC_TENANTS * 2,
				placeholderData: (preloadedTenants ?? fallbackTenants ?? undefined) as
					| TenantOption[]
					| undefined,
			},
			// 3. OAuth providers — key matches page.tsx inline query
			{
				queryKey: ['oauth-providers'],
				queryFn: async () => {
					const res = await getOAuthProviders();
					const providers = res?.data?.providers || res?.providers || [];
					const items: OAuthProviderItem[] = (providers as any[]).map((x: any) => {
						if (typeof x === 'string') return { type: x, name: x };
						return { type: x.type || x.name, name: x.name || x.type };
					});
					setCached(CACHE_KEYS.OAUTH_PROVIDERS, items);
					return items;
				},
				staleTime: TTL.OAUTH_PROVIDERS,
				gcTime: TTL.OAUTH_PROVIDERS * 2,
				placeholderData: (preloadedOAuth ?? fallbackOAuth ?? undefined) as
					| OAuthProviderItem[]
					| undefined,
			},
			// 4. Tenant branding — new key (shared with BrandingInitializer)
			{
				queryKey: ['tenant-branding', slug],
				queryFn: async () => {
					if (!slug) return null;
					const data = await tenantPublicTenantsByTenants(slug);
					const extracted = extractBrandingFields(data);
					if (extracted) {
						setCached(CACHE_KEYS.TENANT_BRANDING(slug), extracted);
					}
					return extracted;
				},
				enabled: !!slug,
				staleTime: TTL.TENANT_BRANDING,
				gcTime: TTL.TENANT_BRANDING * 2,
				placeholderData: (preloadedBranding ?? fallbackBranding ?? undefined) as
					| BrandingData
					| undefined,
			},
		],
	});

	return {
		authConfig: {
			data: results[0].data,
			isLoading: results[0].isLoading,
			isError: results[0].isError,
		},
		publicTenants: {
			data: (results[1].data as TenantOption[]) ?? [],
			isLoading: results[1].isLoading,
			isError: results[1].isError,
		},
		oauthProviders: {
			data: (results[2].data as OAuthProviderItem[]) ?? [],
			isLoading: results[2].isLoading,
			isError: results[2].isError,
		},
		branding: {
			data: results[3].data as BrandingData | null | undefined,
			isLoading: results[3].isLoading,
			isError: results[3].isError,
		},
		isLoading: results.some((r) => r.isLoading),
		isError: results.some((r) => r.isError),
	};
}
