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
}

export function RequireAuth({
	children,
	allowedRoles,
	fallback,
	loadingFallback,
}: RequireAuthProps) {
	const machine = useAuthMachine();
	const tenantRoute = useTenantRoute();

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
		const effectiveClientId = resolveEffectiveClientId(tenantRoute, envClientId);

		if (effectiveClientId && (isSameDomainOAuth(tenantRoute) || envClientId)) {
			initiateOAuthLogin(effectiveClientId);
			return;
		}

		// Cross-domain or no client: redirect to auth-pages login
		setTimeout(() => {
			window.location.replace(buildLoginUrl(window.location.href));
		}, 0);
	}, [machine.status, tenantRoute]);

	if (machine.status === 'checking' || machine.status === 'bootstrap') {
		return loadingFallback ? <>{loadingFallback}</> : null;
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
