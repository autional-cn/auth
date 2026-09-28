'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { tenantSlugFromPath, useTenantStore } from '@/lib/tenant-store';
import { useTenantAuthConfigBySlug } from '@/hooks/use-tenant-auth-config';
import { tenantPublicTenantsByTenants } from '@autional-cn/shared/generated/api';
import { getCached, setCached, getPreloaded, CACHE_KEYS, TTL } from '@/lib/page-init-cache';
import type { BrandingData } from '@/hooks/useAuthPageInit';

// Extract branding fields from API response (handles both snake_case and camelCase)
function extractBranding(raw: unknown): BrandingData | null {
	if (!raw || typeof raw !== 'object') return null;
	const data = (raw as Record<string, unknown>)?.branding || raw;
	const r = data as Record<string, string>;
	if (r.logo_url || r.logoUrl || r.primary_color || r.primaryColor) {
		return {
			primaryColor: r.primary_color || r.primaryColor || '',
			primaryColorDark: r.primary_color_dark || r.primaryColorDark || undefined,
			logoUrl: r.logo_url || r.logoUrl || '',
			faviconUrl: r.favicon_url || r.faviconUrl || '',
			customCss: r.custom_css || r.customCss || '',
			secondaryColor: r.secondary_color || r.secondaryColor || undefined,
			companyName: r.company_name || r.companyName || undefined,
			loginPageTitle: r.login_page_title || r.loginPageTitle || undefined,
			loginPageDescription: r.login_page_description || r.loginPageDescription || undefined,
			privacyPolicyUrl: r.privacy_policy_url || r.privacyPolicyUrl || undefined,
			termsOfServiceUrl: r.terms_of_service_url || r.termsOfServiceUrl || undefined,
		};
	}
	return null;
}

export function BrandingInitializer() {
	const location = useLocation();
	const tenantSlug = useMemo(() => tenantSlugFromPath(location.pathname) ?? null, [location.pathname]);
	const { data: slugAuthConfig } = useTenantAuthConfigBySlug(tenantSlug);
	const setBranding = useTenantStore((s) => s.setBranding);

	// ── Step 1: Instant first paint from cache ──
	const brandingSetRef = useRef(false);
	useEffect(() => {
		if (brandingSetRef.current) return;
		if (!tenantSlug) return;
		const cached =
			getPreloaded<BrandingData>(CACHE_KEYS.TENANT_BRANDING(tenantSlug)) ??
			getPreloaded<BrandingData>(`tenant-branding:${tenantSlug}`) ?? // legacy key
			getCached<BrandingData>(CACHE_KEYS.TENANT_BRANDING(tenantSlug)) ??
			getCached<BrandingData>(`tenant-branding:${tenantSlug}`); // legacy key
		if (cached) {
			setBranding(cached);
			brandingSetRef.current = true;
		}
	}, [tenantSlug, setBranding]);

	// ── Step 2: Async branding via useQuery (dedup with useAuthPageInit) ──
	// Query key ['tenant-branding', slug] matches useAuthPageInit → single fetch for both
	const { data: tenantBranding } = useQuery<BrandingData | null>({
		queryKey: ['tenant-branding', tenantSlug],
		queryFn: async () => {
			if (!tenantSlug) return null;
			const data = await tenantPublicTenantsByTenants(tenantSlug);
			const extracted = extractBranding(data);
			if (extracted) {
				setCached(CACHE_KEYS.TENANT_BRANDING(tenantSlug), extracted);
			}
			return extracted;
		},
		enabled: !!tenantSlug,
		staleTime: TTL.TENANT_BRANDING,
		gcTime: TTL.TENANT_BRANDING * 2,
	});

	// ── Step 3: Merge branding sources and update store ──
	useEffect(() => {
		const branding = tenantBranding || extractBranding(slugAuthConfig?.branding);
		if (branding) {
			setBranding(branding);
		} else if (!tenantSlug) {
			setBranding(null);
		} else if (slugAuthConfig) {
			// 有 slugAuthConfig 但没有 branding → 显示默认（无品牌色）
			const name = slugAuthConfig?.tenantName || slugAuthConfig?.tenantSlug || '';
			setBranding({
				primaryColor: '',
				logoUrl: name
					? `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60"><rect width="200" height="60" fill="var(--color-primary-700)" rx="4"/><text x="100" y="38" text-anchor="middle" fill="#fff" font-size="20" font-family="sans-serif">${name}</text></svg>`)}`
					: '',
				faviconUrl: '',
				customCss: '',
			});
		}
	}, [slugAuthConfig, tenantBranding, tenantSlug, setBranding]);

	return null;
}
