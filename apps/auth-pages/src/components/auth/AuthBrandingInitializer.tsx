'use client';

import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { BrandingInitializer, extractBranding } from '@autional-cn/shared/branding';
import { tenantSlugFromPath } from '@/lib/tenant-store';
import { useTenantAuthConfigBySlug } from '@/hooks/use-tenant-auth-config';

/**
 * auth 站专属的品牌接线。
 *
 * 实现本身（按 slug 拉公开品牌 → 写共享 store → 落到 CSS 变量 / favicon / customCss）
 * 已并入 @autional-cn/shared 的 branding 模块，本站不再各留一份——此前这里有一整套
 * 自己的 useBranding / BrandingInitializer / brand-color 与共享版并行维护。
 *
 * 这里只补两件**确实属于 auth** 的事：
 *   ① slug 判定用 tenantSlugFromPath：要求至少两段，裸 /{slug} 视为无租户上下文
 *      （该路径会立即转向 dashboard）。共享层按 URL 首段取，比这个宽。
 *   ② 公开接口还没返回时，用 auth-config 里的 branding 段兜底。
 */
export function AuthBrandingInitializer() {
	const location = useLocation();
	const slug = useMemo(() => tenantSlugFromPath(location.pathname) ?? null, [location.pathname]);
	const { data: slugAuthConfig } = useTenantAuthConfigBySlug(slug);
	const fallback = useMemo(() => extractBranding(slugAuthConfig?.branding), [slugAuthConfig]);

	return <BrandingInitializer slug={slug} fallback={fallback} />;
}
