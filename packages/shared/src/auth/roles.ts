/**
 * Autional 共享登录 URL 构建工具（仅 buildLoginUrl）
 *
 * 职责划分（AC-008）：
 * - 前端角色仅用于 UI 呈现（UX-only）；安全判断由后端 rbac-backed 授权强制。
 * - 角色获取统一走 userinfo-first：`getCurrentRole()`（store 派生，见 ./store）
 *   与 `useCurrentRole()`（响应式 hook，见 hooks/useCurrentRole）。
 */

import { getPortalUrl } from '../config';

/** auth-pages 的静态/受保护路由 — 首段不会是租户 slug */
const AUTH_ROUTE_RESERVED = new Set([
	'oauth',
	'login',
	'register',
	'forgot-password',
	'reset-password',
	'terms',
	'privacy',
	'error',
	'logout',
	'passkey',
	'reapply',
	'mfa',
	'account',
	'dashboard',
	'magic-link',
	'verify-email',
	'verify-phone',
	'mfa-challenge',
	'mfa-setup',
	'change-password',
	'recover-account',
	'account-deletion',
	'verify-identity',
]);

export function buildLoginUrl(returnUrl?: string, fromRequireAuth?: boolean): string {
	const base = getPortalUrl('auth');
	if (!base) return '/';

	// 保留租户 slug：如果 returnUrl 落在 auth 域且首段是租户 slug，
	// 跳转到 {base}/{slug}/login 而不是根路径（根路径是租户选择页）
	let loginBase = base;
	if (returnUrl) {
		try {
			const clean = new URL(returnUrl, typeof window !== 'undefined' ? window.location.origin : '');
			const baseOrigin = new URL(base).origin;
			const firstSeg = clean.pathname.split('/').filter(Boolean)[0];
			if (
				clean.origin === baseOrigin &&
				firstSeg &&
				!AUTH_ROUTE_RESERVED.has(firstSeg.toLowerCase())
			) {
				loginBase = `${base}/${firstSeg}/login`;
			}
		} catch {
			/* invalid URL — fall through */
		}
	}

	if (returnUrl) {
		// 防止嵌套 redirect：仅当 returnUrl 落在 auth 域且本身已是登录页时才截断
		try {
			const clean = new URL(returnUrl, typeof window !== 'undefined' ? window.location.origin : '');
			const baseOrigin = new URL(base).origin;
			if (
				clean.origin === baseOrigin &&
				(clean.pathname === '/' || clean.pathname.endsWith('/login') || clean.href === base)
			) {
				return fromRequireAuth ? `${loginBase}?from_requireauth=1` : loginBase;
			}
		} catch {
			/* invalid URL — fall through */
		}
		const qs = `?redirect=${encodeURIComponent(returnUrl)}`;
		if (fromRequireAuth) {
			return `${loginBase}${qs}&from_requireauth=1`;
		}
		return `${loginBase}${qs}`;
	}
	if (fromRequireAuth) {
		return `${loginBase}?from_requireauth=1`;
	}
	return loginBase;
}
