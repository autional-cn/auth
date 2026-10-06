'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import {
	AuthService,
	extractSlugFromPath,
	getAccessToken,
	getPortalUrl,
	isValidRedirect,
	traceEvent,
	traceRedirect,
	useCurrentTenantId,
	usePublicTenantSlugs,
} from '@autional/shared';
import { pickSessionSlug } from '@/lib/tenant-store';

/**
 * auth 入口路由（裸根 `/` 与 `/login`）。唯一选择器是 brand，这里只做三分支收口：
 *
 * 1. 回程目标自带租户（`?redirect=https://<门户>/<slug>/...` 且 slug 真实存在）
 *    → 直达 `/<slug>/login?<原查询串>`（整串透传，含 from_requireauth 等回程标记），
 *    由登录页自己判会话（有会话 authMe 后直接回跳）；
 * 2. 否则有会话且能解析出会话租户 → `/<slug>/dashboard`（不经过 brand）；
 * 3. 其余（无租户上下文）→ 整页交棒 brand 选品牌。
 *
 * 0（优先于三分支）：`logout=1` 登出回程（useLogout/buildLogoutUrl 打标）→ 先经唯一
 * 登出实现终结 auth 域会话；随后回程能解析出真实租户 → 落 `/<slug>/login`（不带
 * 任何回程参数：登出即"重新开始"，登录后走登录页默认去向——偏好门户或租户
 * dashboard，去向选择权交还用户，也避免换账号登录被旧回程弹回）；否则落 brand 裸根。
 * 若放行三分支，残余会话会被登录页接管并静默重登（F-W5c）。
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
	const location = useLocation();
	const [searchParams] = useSearchParams();

	const rawRedirect = searchParams.get('redirect');
	const redirect = rawRedirect && isValidRedirect(rawRedirect) ? rawRedirect : null;
	const logoutRequested = searchParams.get('logout') === '1';

	// 回程目标首段（`/`、保留段一律 undefined；是否真租户交给下方名单校验）
	const candidate = useMemo(() => {
		if (!redirect) return undefined;
		try {
			return extractSlugFromPath(new URL(redirect, window.location.origin).pathname);
		} catch {
			return undefined;
		}
	}, [redirect]);

	// 登出意图下强制按「无会话」分支：不得把带会话的回程当普通深链送 /<slug>/login
	const token = logoutRequested ? null : getAccessToken();
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

	// 登出回程：先终结会话（唯一登出实现），落点后定（声明先于下方导航 effect）。
	// 落点等待有界：无 redirect/无候选 slug 时无需名单即刻可定；反之等名单到
	//（hook 任何失败都置 isSuccess ⇒ 必达，不会卡加载态）。
	const [logoutSettled, setLogoutSettled] = useState(false);
	const logoutFinalizedRef = useRef(false);
	useEffect(() => {
		if (!logoutRequested || logoutFinalizedRef.current) return;
		logoutFinalizedRef.current = true;
		void AuthService.logout().finally(() => setLogoutSettled(true));
	}, [logoutRequested]);

	const logoutReady = logoutSettled && (!redirect || !candidate || slugsLoaded);

	useEffect(() => {
		if (!logoutRequested || !logoutReady) return;
		if (redirectSlug) {
			// 回程只用来判租户，落点剥除全部查询参数（redirect/logout/rt）：
			// 登出后是"重新开始"，登录后走登录页默认去向（偏好门户或租户 dashboard），
			// 不被旧回程弹回（换账号登录时也不会被带去上一个账号的页面）
			traceEvent('entry-route', { to: `/${redirectSlug}/login` });
			navigate(`/${redirectSlug}/login`, { replace: true });
			return;
		}
		const brand = getPortalUrl('brand');
		if (!brand) return; // 未配置 brand 门户时保持当前页，避免死循环
		// 回落同样不携带回程：登出 = 重新选择，而不是回到刚才的位置
		traceRedirect(`${brand}/`, { reason: 'funnel-logout' });
	}, [logoutRequested, logoutReady, redirectSlug, navigate]);

	useEffect(() => {
		if (!ready || logoutRequested) return;
		const slug = redirectSlug ?? sessionSlug;
		if (slug) {
			traceEvent('entry-route', { to: `/${slug}/${redirect ? 'login' : 'dashboard'}` });
			// 整串透传（同 TenantIndexRedirect 先例）：回程参数由发起方打标
			// （from_requireauth=1 等），登录页分支据此直接起 PKCE。
			// 只重建 ?redirect= 会把「待授权回程」退化成裸弹跳 —— 循环根因。
			navigate(
				`/${slug}/${redirect ? 'login' : 'dashboard'}${redirect ? location.search : ''}`,
				{ replace: true },
			);
			return;
		}
		const brand = getPortalUrl('brand');
		if (!brand) return; // 未配置 brand 门户时保持当前页，避免死循环
		traceRedirect(redirect ? `${brand}/?redirect=${encodeURIComponent(redirect)}` : `${brand}/`, {
			reason: 'funnel-brand',
		});
	}, [ready, logoutRequested, redirectSlug, sessionSlug, redirect, navigate, location.search]);

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
