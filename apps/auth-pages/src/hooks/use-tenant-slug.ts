import { useParams, useLocation } from 'react-router';
import { useAuthStore, usePublicTenantSlugs } from '@autional-cn/shared';
import { pickSessionSlug, tenantSlugFromPath } from '@/lib/tenant-store';

/**
 * 用公开租户名单校验 slug（AUTH-48/49）。
 * - 名单未就绪/为空（接口尚未返回或挂掉）→ fail-open 信任传入 slug
 *   （与 TenantIndexGuard 的「名单为空放行」同口径；异步到期后重渲染再收敛）；
 * - 名单就绪且未命中 → undefined（脏 slug，不得当作有效租户上下文）。
 */
export function resolveSlugAgainstList(
	slug: string | undefined,
	knownTenants: Array<{ id?: string; name?: string; slug?: string }> | undefined,
): string | undefined {
	if (!slug) return undefined;
	if (!knownTenants || knownTenants.length === 0) return slug;
	return knownTenants.some((t) => (t.name || t.slug) === slug) ? slug : undefined;
}

/**
 * 当前路由参数的「已解析租户 slug」——param 经公开名单校验（AUTH-48/49）。
 * AuthCard 页脚条款链、terms/privacy 返回链等「租户化上下文」一律以此为据：
 * 未命名租户（或未知 slug）回落到绝对链，不再把脏 slug 递归带进法律页。
 */
export function useResolvedTenantSlug(): string | undefined {
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const { data: knownTenants } = usePublicTenantSlugs();
	return resolveSlugAgainstList(tenantSlug || undefined, knownTenants);
}

/**
 * 当前页面可用的「生效租户 slug」——URL param 优先，缺失时从会话租户
 * （store.currentTenantId）经公开名单解析（AUTH-41）。
 * 跨门户深链（用户中心 /security、/sessions 等）必须带真实租户上下文，
 * 裸链会 404；会话缺失（匿名）时返回 undefined，由调用方决定退路。
 */
export function useEffectiveTenantSlug(): string | undefined {
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const { data: knownTenants } = usePublicTenantSlugs();
	const currentTenantId = useAuthStore((s) => s.currentTenantId);
	const fromUrl = resolveSlugAgainstList(tenantSlug || undefined, knownTenants);
	if (fromUrl) return fromUrl;
	return pickSessionSlug(knownTenants, currentTenantId);
}

/**
 * 路径名推导的生效 slug（供 Routes 之外的 chrome 组件用——useParams 在
 * AppHeader 拿不到路由参数；TenantSwitchChip 消费）。
 */
export function useEffectiveTenantSlugFromPath(): string | undefined {
	const location = useLocation();
	const { data: knownTenants } = usePublicTenantSlugs();
	const currentTenantId = useAuthStore((s) => s.currentTenantId);
	const fromPath = resolveSlugAgainstList(tenantSlugFromPath(location.pathname), knownTenants);
	if (fromPath) return fromPath;
	return pickSessionSlug(knownTenants, currentTenantId);
}
