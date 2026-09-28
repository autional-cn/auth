/**
 * OAuth client_id 持久化（TASK-09 / D8）。
 *
 * 门户的 client_id 平时由 slug 实时解析（`oauth-client-from-slug.ts`）或 env 固定；
 * 但刷新（`AuthService.refreshToken`）与登出吊销（`AuthService.logout`）不在 React
 * 上下文里，拿不到 slug 解析结果 —— 故 OAuth 交棒时把已解析的 client_id 落 localStorage，
 * 两处按「会话值（持久化）→ env → 空」顺序读取（`resolveClientIdForSession`）。
 *
 * 该值属于「本部署用哪个 OAuth 客户端」，非用户私有数据 ⇒ 登出不清除。
 */

const STORAGE_KEY = 'oauth_client_id';

/** OAuth 交棒（PKCE 发起 / 回调兑换成功）时落库 */
export function persistOAuthClientId(clientId: string): void {
	if (typeof window === 'undefined' || !clientId) return;
	try {
		localStorage.setItem(STORAGE_KEY, clientId);
	} catch {
		/* 存储不可用（隐私模式）时静默：刷新回落 env，行为与接线前一致 */
	}
}

export function getPersistedOAuthClientId(): string {
	if (typeof window === 'undefined') return '';
	try {
		return localStorage.getItem(STORAGE_KEY) || '';
	} catch {
		return '';
	}
}

/** 刷新/登出用：会话内已解析值优先，env 兜底 */
export function resolveClientIdForSession(): string {
	const persisted = getPersistedOAuthClientId();
	if (persisted) return persisted;
	if (typeof window !== 'undefined') {
		return (window as any).__APP_CONFIG__?.VITE_OAUTH_CLIENT_ID || '';
	}
	return '';
}
