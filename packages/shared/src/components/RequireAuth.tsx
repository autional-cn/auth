import { useEffect } from 'react';
import { AuthService, setBootstrapLock } from '../auth/service';
import { buildLoginUrl } from '../auth/roles';
import { initiateOAuthLogin } from '../auth/oauth-login';
import {
	useTenantRoute,
	resolveEffectiveClientId,
	isSameDomainOAuth,
} from '../auth/tenant-route-middleware';
import { useAuthMachine } from '../auth/auth-machine';

interface RequireAuthProps {
	children: React.ReactNode;
	allowedRoles?: readonly string[];
	fallback?: React.ReactNode;
	loadingFallback?: React.ReactNode;
	/** 确定性未知 slug（by-slug HTTP 404）时渲染的 404 页；缺省用内置极简 404 兜底 */
	notFound?: React.ReactNode;
}

/**
 * 内置极简 404（零依赖，供未注入 notFound 的站点兜底 —— shared 不能 import 各
 * app 的 not-found/page）。样式用 CSS 变量 var(--color-*)，.dark 下自动反转。
 */
function DefaultTenantNotFound() {
	const zh =
		typeof document !== 'undefined' &&
		(document.documentElement.lang || '').toLowerCase().startsWith('zh');
	return (
		<div
			role="alert"
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '40vh',
				gap: '0.5rem',
				width: '100%',
			}}
		>
			<h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>404</h1>
			<p style={{ color: 'var(--color-text-secondary)' }}>
				{zh ? '页面不存在或已被移除' : 'Page not found'}
			</p>
		</div>
	);
}

export function RequireAuth({
	children,
	allowedRoles,
	fallback,
	loadingFallback,
	notFound,
}: RequireAuthProps) {
	const machine = useAuthMachine();
	const tenantRoute = useTenantRoute();

	// F-W6 闸门：URL slug 确定性不存在（by-slug HTTP 404）且本站未配 env 固定
	// client（admin-console 等单租户旁路不适用）→ 本地 404，不发弹跳。
	// 不然：门户 → buildLoginUrl → auth 侧有会话走「回跳 redirect」→ 回到本页
	// → 再弹跳，构成无限整页往返（verification-W5-patch §6）。
	// 网络错误/5xx 不置 unknownSlug（fail-open 仍走登录漏斗）；仅 unauthenticated 终态生效。
	const envClientId =
		typeof window !== 'undefined' ? (window as any).__APP_CONFIG__?.VITE_OAUTH_CLIENT_ID || '' : '';
	const unknownSlugGate =
		machine.status === 'unauthenticated' && tenantRoute.unknownSlug && !envClientId;

	// 挂载时抑制 401 抢跑：若当前域配置了 OAuth client 且本页无有效 token
	// （跨域 admin 场景），任何无 token API 请求的 401 都会触发 onUnauthorized →
	// buildLoginUrl 302 到 auth 登录页，抢跑下方 OAuth PKCE 决策，形成时序竞争。
	// 上锁后未登录跳转的唯一出口是下方 effect 的 OAuth/buildLoginUrl 决策。
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const cfg = (window as any).__APP_CONFIG__;
		const envClientId = cfg?.VITE_OAUTH_CLIENT_ID || '';
		if (!envClientId) return;
		const rawToken = AuthService.getAccessToken();
		const hasToken = !!rawToken && rawToken !== 'undefined' && rawToken !== 'null';
		if (!hasToken) setBootstrapLock(true);
	}, []);

	// Redirect logic: only runs when machine says unauthenticated
	useEffect(() => {
		if (machine.status !== 'unauthenticated') return;
		if (typeof window === 'undefined') return;
		if (tenantRoute.loading) return; // wait for OAuth config

		const cfg = (window as any).__APP_CONFIG__;
		const envClientId = cfg?.VITE_OAUTH_CLIENT_ID || '';

		// F-W6 闸门：确定性未知 slug → 不发起任何弹跳，由渲染分支给本地 404
		if (tenantRoute.unknownSlug && !envClientId) return;

		const effectiveClientId = resolveEffectiveClientId(tenantRoute, envClientId);

		if (effectiveClientId && (isSameDomainOAuth(tenantRoute) || envClientId)) {
			initiateOAuthLogin(effectiveClientId);
			return;
		}

		// Cross-domain or no client: redirect to auth-pages login
		// from_requireauth=1 与 service.ts 的 onUnauthorized 同口径：auth 侧据此先做会话复检
		// （有会话直接回跳，避免「已登录还被要求再登一次」）
		setTimeout(() => {
			window.location.replace(buildLoginUrl(window.location.href, true));
		}, 0);
	}, [machine.status, tenantRoute]);

	if (machine.status === 'checking' || machine.status === 'bootstrap') {
		return loadingFallback ? <>{loadingFallback}</> : null;
	}

	if (unknownSlugGate) {
		return notFound ? <>{notFound}</> : <DefaultTenantNotFound />;
	}

	if (machine.status === 'unauthenticated' || machine.status === 'redirecting') {
		return null;
	}

	// status === 'ready' or 'authenticated'
	if (allowedRoles && allowedRoles.length > 0) {
		const role = AuthService.getCurrentRole();
		if (role && !allowedRoles.includes(role)) {
			const permissions = AuthService.getPermissions();
			if (!permissions || permissions.length === 0) {
				return loadingFallback ? <>{loadingFallback}</> : <>{children}</>;
			}
			const hasAdminPermission = permissions.some(
				(p: string) => p === '*' || allowedRoles.some((r) => p.includes(r)),
			);
			if (!hasAdminPermission) {
				if (fallback) return <>{fallback}</>;
				return null;
			}
		}
	}

	return <>{children}</>;
}
