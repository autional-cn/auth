'use client';

import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
	extractSlugFromPath,
	getAccessToken,
	getPortalUrl,
	isValidRedirect,
	useCurrentTenantId,
	usePublicTenantSlugs,
} from '@autional-cn/shared';
import { pickSessionSlug } from '@/lib/tenant-store';

/**
 * auth 入口路由（裸根 `/` 与 `/login`）。唯一选择器是 brand，这里只做三分支收口：
 *
 * 1. 回程目标自带租户（`?redirect=https://<门户>/<slug>/...` 且 slug 真实存在）
 *    → 直达 `/<slug>/login?redirect=…`，由登录页自己判会话（有会话 authMe 后直接回跳）；
 * 2. 否则有会话且能解析出会话租户 → `/<slug>/dashboard`（不经过 brand）；
 * 3. 其余（无租户上下文）→ 整页交棒 brand 选品牌。
 */

function useSessionSlug(
	hasToken: boolean,
	knownTenants: Array<{ id?: string; name?: string; slug?: string }> | undefined,
): string | undefined {
	const currentTenantId = useCurrentTenantId();
	return useMemo(
		() => (hasToken ? pickSessionSlug(knownTenants, currentTenantId) : undefined),
		[hasToken, knownTenants, currentTenantId],
	);
}

export function EntryRouter() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const rawRedirect = searchParams.get('redirect');
	const redirect = rawRedirect && isValidRedirect(rawRedirect) ? rawRedirect : null;

	// 回程目标首段（`/`、保留段一律 undefined；是否真租户交给下方名单校验）
	const candidate = useMemo(() => {
		if (!redirect) return undefined;
		try {
			return extractSlugFromPath(new URL(redirect, window.location.origin).pathname);
		} catch {
			return undefined;
		}
	}, [redirect]);

	const token = getAccessToken();
	const hasToken = !!token && token !== 'undefined' && token !== 'null';

	// 复用 shared 的公开租户名单（public-tenants 查询键与 TenantIndexGuard 共享缓存）。
	// 该 hook 任何失败都回落空数组且置 isSuccess ⇒ ready 必达，不会卡加载态。
	const { data: knownTenants, isSuccess: slugsLoaded } = usePublicTenantSlugs();
	const sessionSlug = useSessionSlug(hasToken, knownTenants);

	const knownSlugs = useMemo(
		() =>
			(knownTenants ?? [])
				.map((t) => t.name || t.slug)
				.filter(Boolean) as string[],
		[knownTenants],
	);

	// 有会话时也要等名单：会话租户 → slug 的唯一权威来源就是它，
	// 等不到就跳 brand 会把已登录用户整页送走（名单必达，故等待有界）
	const ready = slugsLoaded || (!hasToken && !candidate);
	const redirectSlug = candidate && knownSlugs.includes(candidate) ? candidate : undefined;

	useEffect(() => {
		if (!ready) return;
		const slug = redirectSlug ?? sessionSlug;
		if (slug) {
			const qs = redirect ? `?redirect=${encodeURIComponent(redirect)}` : '';
			navigate(`/${slug}/${redirect ? 'login' : 'dashboard'}${qs}`, { replace: true });
			return;
		}
		const brand = getPortalUrl('brand');
		if (!brand) return; // 未配置 brand 门户时保持当前页，避免死循环
		window.location.replace(
			redirect ? `${brand}/?redirect=${encodeURIComponent(redirect)}` : `${brand}/`,
		);
	}, [ready, redirectSlug, sessionSlug, redirect, navigate]);

	if (!ready) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--color-brand)]" />
			</div>
		);
	}

	return null;
}

export default EntryRouter;
