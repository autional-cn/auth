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

/**
 * 登出回程 URL：auth 域**裸根**入口 + `logout=1` 显式登出意图标记。
 *
 * 刻意不复用 buildLoginUrl：其租户 slug 保留会把 auth 域页面的登出落到
 * `/<slug>/login`（登录页路由，不经入口路由），`logout=1` 在那里被静默忽略；
 * 带会话回程甚至会被登录页 checkAndRedirect 直接放行成静默重登（F-W5c）。
 * 裸根 = EntryRouter 唯一登出闸门：先终结 auth 域会话，再按「无会话」落 brand。
 */
export function buildLogoutUrl(returnUrl?: string): string {
	const base = getPortalUrl('auth');
	if (!base) return '/';
	const redirect = returnUrl ? `redirect=${encodeURIComponent(returnUrl)}&` : '';
	return `${base}/?${redirect}logout=1`;
}

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
