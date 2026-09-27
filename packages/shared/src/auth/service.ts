/**
 * Autional AuthService — 认证系统的唯一入口
 *
 * 职责:
 *  - 统一管理认证状态的读写（取代分散在各文件的直接 store/LS 操作）
 *  - 提供 token 刷新、登出、401 处理等标准流程
 *  - 提供事件订阅机制用于可观测性
 *
 * 使用原则:
 *  - 所有组件必须通过 AuthService 访问认证状态，不得直接 import useAuthStore
 *  - 所有组件必须通过 AuthService 变更认证状态，不得直接调 store action
 *  - apiClient 必须通过 AuthService.refreshToken() 处理 token 刷新
 *  - logout 只有 AuthService.logout() 一个实现
 *
 * @see docs/architecture/auth-service-migration-plan.md
 */

import {
	useAuthStore,
	getAccessToken,
	getRefreshToken,
	getCurrentRole,
	isTokenExpired as checkExpired,
} from './store';
import { loginWithTokens } from './store';
import { buildLoginUrl } from './roles';
import type { User } from '../types';

// ============ Internal State ============

let redirectingToLogin = false;
let refreshPromise: Promise<string | null> | null = null;

// ============ OAuth PKCE Bootstrap Lock ============

let _bootstrapLocked = false;

/** Suppress onUnauthorized redirects during OAuth PKCE initialization */
export function setBootstrapLock(locked: boolean): void {
	_bootstrapLocked = locked;
	if (typeof window !== 'undefined') (window as any).__bootstrapLocked = locked;
}

export function isBootstrapLocked(): boolean {
	return _bootstrapLocked;
}
const listeners = new Map<string, Set<(data?: unknown) => void>>();

function emit(event: string, data?: unknown) {
	listeners.get(event)?.forEach((fn) => {
		try {
			fn(data);
		} catch {
			/* ignore */
		}
	});
}

// ============ Cross-tab Sync (BroadcastChannel) ============

const BC_CHANNEL = 'authms-auth';
let bc: BroadcastChannel | null = null;

function initBroadcastChannel(): void {
	if (typeof BroadcastChannel === 'undefined') return;
	if (bc) return;
	try {
		bc = new BroadcastChannel(BC_CHANNEL);
		bc.onmessage = (event) => {
			const msg = event.data;
			if (!msg || !msg.type) return;

			switch (msg.type) {
				case 'auth:logout':
					// 另一个 tab 触发了登出 → 同步清除本 tab 状态
					useAuthStore.getState().clearAuth();
					if (typeof window !== 'undefined') {
						localStorage.removeItem('authms-auth-v1');
						localStorage.removeItem('access_token');
						localStorage.removeItem('refresh_token');
					}
					emit('auth:logout', { source: 'broadcast' });
					break;

				case 'auth:login':
					// 另一个 tab 登录成功 → 刷新本 tab 状态（可选）
					// 可由消费方决定是否同步
					emit('auth:login-broadcast', msg.data);
					break;
			}
		};
	} catch (e) {
		console.warn('[AuthService] BroadcastChannel not available', (e as Error)?.message || '');
	}
}

function broadcast(event: string, data?: unknown): void {
	if (!bc) return;
	try {
		bc.postMessage({ type: event, data });
	} catch {
		/* ignore */
	}
}

// ============ AuthService ============

// Initialize cross-tab sync channel
initBroadcastChannel();

export const AuthService = {
	// ==================== 读取（纯函数，无副作用） ====================

	/** 获取 access token：Zustand store 优先，localStorage fallback */
	getAccessToken: (): string | null => getAccessToken(),

	/** 获取 refresh token */
	getRefreshToken: (): string | null => getRefreshToken(),

	/** 获取当前用户信息 */
	getUser: (): User | null => useAuthStore.getState().user,

	/** 是否已认证 */
	isAuthenticated: (): boolean => useAuthStore.getState().isAuthenticated,

	/** token 是否已过期 */
	isTokenExpired: (token?: string): boolean => checkExpired(token || getAccessToken() || ''),

	/** 获取当前租户 ID */
	getCurrentTenantId: (): string | null => useAuthStore.getState().currentTenantId,

	/** 获取当前租户列表 */
	getTenants: (): Array<{ id: string; name: string; role: string }> =>
		useAuthStore.getState().tenants,

	/** 获取当前权限列表 */
	getPermissions: (): string[] => useAuthStore.getState().permissions,

	/** 获取当前角色（userinfo-first，委托 store 派生） */
	getCurrentRole: (): string | null => getCurrentRole(),

	// ==================== 写入（唯一变更入口） ====================

	/** 登录成功后设置完整认证状态 */
	setAuth: (accessToken: string, refreshToken: string, user: User): void => {
		loginWithTokens(accessToken, refreshToken, user);
		emit('auth:login', { userId: user.id, username: user.username });
		broadcast('auth:login', { userId: user.id });
	},

	/** token 刷新后更新令牌 */
	updateTokens: (accessToken: string, refreshToken: string): void => {
		useAuthStore.getState().setTokens(accessToken, refreshToken);
		emit('auth:tokens-refreshed');
	},

	/** 更新用户信息（来自 /auth/me） */
	updateUser: (user: Partial<User>): void => {
		const current = useAuthStore.getState().user;
		// 防止跨用户覆盖：如果 store 中有用户但 ID 不匹配，忽略
		if (current && user.id && current.id !== user.id) return;
		useAuthStore.setState({ user: user as User });
		emit('auth:user-updated', { userId: user.id });
	},

	/** 设置租户列表 */
	updateTenants: (tenants: Array<{ id: string; name: string; role: string }>): void => {
		useAuthStore.getState().setTenants(tenants);
		emit('auth:tenants-updated');
	},

	/** 设置权限列表 */
	updatePermissions: (permissions: string[]): void => {
		useAuthStore.getState().setPermissions(permissions);
		emit('auth:permissions-updated');
	},

	/** 切换当前租户 */
	updateCurrentTenant: (tenantId: string): void => {
		useAuthStore.getState().setCurrentTenant(tenantId);
		emit('auth:tenant-changed', { tenantId });
	},

	// ==================== 登出（唯一实现） ====================

	/**
	 * 统一登出：
	 * 1. 清除内存状态（立即生效）
	 * 2. 清除所有持久化数据
	 * 3. 服务端 token 吊销（best-effort，不阻塞）
	 */
	logout: async (): Promise<void> => {
		const at = AuthService.getAccessToken();
		const rt = AuthService.getRefreshToken();

		// 1. 清除内存状态（立即生效，阻止后续操作使用过期 token）
		useAuthStore.getState().clearAuth();

		// 2. 清除所有持久化数据
		if (typeof window !== 'undefined') {
			localStorage.removeItem('authms-auth-v1');
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			localStorage.removeItem('__oauth_bridge_token');
		}

		// 3. 服务端 token 吊销（best-effort，不阻塞登出流程）
		try {
			if (at || rt) {
				const { default: axios } = await import('axios');
				const { getApiBaseUrl } = await import('../config');
				const baseUrl = getApiBaseUrl();
				// S9-A：撤销端点要求客户端认证；PKCE 公开客户端凭注册 client_id（对应 none）
				const clientId =
					typeof window !== 'undefined' ? (window as any).__APP_CONFIG__?.VITE_OAUTH_CLIENT_ID : '';
				const revokeParams = (token: string, hint: string) => {
					const params = new URLSearchParams({ token, token_type_hint: hint });
					if (clientId) params.set('client_id', clientId);
					return params.toString();
				};
				if (at) {
					await axios
						.post(
							`${baseUrl}/oauth/api/v1/oauth/revoke`,
							revokeParams(at, 'access_token'),
							{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
						)
						.catch(() => {});
				}
				if (rt) {
					await axios
						.post(
							`${baseUrl}/oauth/api/v1/oauth/revoke`,
							revokeParams(rt, 'refresh_token'),
							{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
						)
						.catch(() => {});
				}
			}
		} catch {
			/* best-effort */
		}

		// 4. BFF 会话吊销（best-effort，httpOnly cookie 清理）
		try {
			const { bffLogout } = await import('../api/bff-client');
			await bffLogout();
		} catch {
			/* best-effort */
		}

		broadcast('auth:logout');
		emit('auth:logout');
	},

	// ==================== Token 刷新（统一超时防重入） ====================

	/**
	 * 刷新 access token。
	 * 防重入：同一时间只会有一个刷新请求进行中。
	 * 刷新失败时自动调用 onUnauthorized。
	 */
	refreshToken: async (): Promise<string | null> => {
		if (refreshPromise) return refreshPromise;

		refreshPromise = (async () => {
			const rt = AuthService.getRefreshToken();
			if (!rt) {
				// During OAuth PKCE bootstrap (no token yet), suppress redirect.
				// RequireAuth will handle OAuth PKCE vs BFF fallback once tenantRoute resolves.
				if (!_bootstrapLocked) {
					AuthService.onUnauthorized();
				}
				return null;
			}

			try {
				const { default: axios } = await import('axios');
				const { getApiBaseUrl } = await import('../config');
				const baseUrl = getApiBaseUrl();

				// 按 refresh token 格式分流：
				// - JWT（三段式，identity 链签发）→ identity /auth/refresh（现状逻辑）
				// - opaque（rt- 前缀，OAuth PKCE 链签发）→ oauth /oauth/refresh（扁平 JSON，轮换式）
				const isJwtRefreshToken = rt.split('.').length === 3;
				const clientId =
					typeof window !== 'undefined' ? (window as any).__APP_CONFIG__?.VITE_OAUTH_CLIENT_ID : '';

				let data: {
					access_token?: string;
					accessToken?: string;
					refresh_token?: string;
					refreshToken?: string;
				};
				if (isJwtRefreshToken || !clientId) {
					// identity 链：信封响应 { code, data: { access_token, refresh_token } }
					const resp = await axios.post(`${baseUrl}/identity/api/v1/auth/refresh`, {
						refresh_token: rt,
					});
					data = resp.data;
				} else {
					// OAuth 链：扁平 JSON 响应 { access_token, refresh_token, token_type, expires_in, scope }
					const resp = await axios.post(`${baseUrl}/oauth/api/v1/oauth/refresh`, {
						refresh_token: rt,
						client_id: clientId,
					});
					data = resp.data;
				}
				const newAT = data.access_token || data.accessToken;
				const newRT = data.refresh_token || data.refreshToken;
				if (newAT) {
					AuthService.updateTokens(newAT, newRT || rt);
				}
				return newAT || null;
			} catch (err) {
				console.warn('[AuthService] Token refresh failed', (err as Error)?.message || '');
				AuthService.onUnauthorized();
				return null;
			} finally {
				refreshPromise = null;
			}
		})();

		return refreshPromise;
	},

	// ==================== 401/未授权处理 ====================

	/**
	 * 处理 401 未授权响应：
	 * 1. 登出（清除所有状态）
	 * 2. 重定向到登录页（防重入锁）
	 */
	onUnauthorized: (): void => {
		// Suppress redirect during OAuth PKCE bootstrap — RequireAuth handles it
		if (_bootstrapLocked) return;
		// 先清除状态，不等待 logout 的异步吊销
		useAuthStore.getState().clearAuth();
		if (typeof window !== 'undefined') {
			// 清除 localStorage（同步，立即生效）
			localStorage.removeItem('authms-auth-v1');
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
		}

		if (!redirectingToLogin && typeof window !== 'undefined') {
			redirectingToLogin = true;
			setTimeout(() => {
				window.location.replace(buildLoginUrl(window.location.href, true));
			}, 0);
		}
	},

	// ==================== 事件订阅（可观测性） ====================

	/**
	 * 订阅认证事件。
	 * @returns 取消订阅函数
	 */
	subscribe: (event: string, handler: (data?: unknown) => void): (() => void) => {
		if (!listeners.has(event)) listeners.set(event, new Set());
		listeners.get(event)!.add(handler);
		return () => {
			listeners.get(event)?.delete(handler);
		};
	},
};
