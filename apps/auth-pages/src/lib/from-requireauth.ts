/**
 * `from_requireauth=1` 分支的 OAuth client_id 解析（ADR-04 / F7）。
 *
 * 回程带租户段（`?redirect=https://<门户>/<slug>/…`）且本 tab 有会话时，
 * 登录页据此直接发起 PKCE 把用户送回目标门户 —— 不再让用户重登一次。
 *
 * client_id 取法：预载缓存优先（页初始化时已拉过，避免重复请求）；
 * 未命中则**实时回源** by-slug —— 与门户侧 RequireAuth 同一接口、同一口径。
 * 仍拿不到 → 返回 null，调用方停住不循环（ADR-04 的最保守行为）。
 */

import { fetchOAuthClientIdBySlug } from '@autional/shared';
import { getPreloaded, getCached, CACHE_KEYS } from './page-init-cache';

export async function resolveClientIdForRequireAuth(slug: string): Promise<string | null> {
	const cachedConfig =
		getPreloaded<Record<string, any>>(CACHE_KEYS.AUTH_CONFIG(slug)) ??
		getPreloaded<Record<string, any>>(`auth-config:${slug}`) ??
		getCached<Record<string, any>>(CACHE_KEYS.AUTH_CONFIG(slug)) ??
		getCached<Record<string, any>>(`auth-config:${slug}`);
	const cached = cachedConfig?.oauthClientId || (cachedConfig as any)?.oauth_client_id;
	if (cached) return cached;
	return fetchOAuthClientIdBySlug(slug);
}
