'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTenantSlugFromUrl } from '../auth/slug-from-url';
import { tenantPublicTenantsByTenants } from '../generated/api';
import { extractBranding } from './extract-branding';
import { readCachedBranding, writeCachedBranding } from './branding-cache';
import { useTenantBrandingStore } from './tenant-store';
import type { Branding } from './types';

const TTL = 6 * 60 * 60 * 1000; // 6h，与公开租户接口的缓存口径一致

export interface BrandingInitializerProps {
	/**
	 * 覆盖 slug 来源。缺省按 URL 首段取（共享层口径）；
	 * auth 站传入自己的判定——它要求至少两段，裸 /{slug} 视为无租户上下文。
	 */
	slug?: string | null;
	/** 接口尚未返回时的兜底品牌（auth 站用 auth-config 里的 branding 段）。 */
	fallback?: Branding | null;
}

/** 按 slug 拉公开品牌并写入 store；渲染 `null`，只做接线。 */
export function BrandingInitializer({ slug: slugProp, fallback }: BrandingInitializerProps) {
	const urlSlug = useTenantSlugFromUrl();
	const slug = slugProp !== undefined ? slugProp : urlSlug;
	const setBranding = useTenantBrandingStore((s) => s.setBranding);

	// 缓存先到：首屏立即有品牌（未命中则由 useBranding 回落 tokens 缺省）
	useEffect(() => {
		if (!slug) {
			setBranding(null);
			return;
		}
		const cached = readCachedBranding(slug);
		if (cached) setBranding(cached);
	}, [slug, setBranding]);

	const { data } = useQuery<Branding | null>({
		queryKey: ['tenant-branding', slug],
		queryFn: async () => {
			if (!slug) return null;
			const res = await tenantPublicTenantsByTenants(slug);
			const branding = extractBranding(res);
			if (branding) writeCachedBranding(slug, branding);
			return branding;
		},
		enabled: Boolean(slug),
		staleTime: TTL,
		gcTime: TTL * 2,
	});

	useEffect(() => {
		const resolved = data ?? fallback ?? null;
		if (resolved) setBranding(resolved);
	}, [data, fallback, setBranding]);

	return null;
}
