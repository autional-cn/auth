/**
 * Autional 全局认证状态管理 (Zustand)
 * 所有前端应用共用同一个 auth store
 *
 * 职责划分（AC-008）：前端角色（tenants[].role 派生）仅用于 UX 呈现；
 * 安全判断由后端 rbac-backed 授权强制，前端不做凭角色放行的敏感操作。
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
	// State
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	tenants: Array<{ id: string; name: string; role: string }>;
	currentTenantId: string | null;
	permissions: string[];
	isAuthenticated: boolean;

	// Actions
	setAuth: (accessToken: string, refreshToken: string, user: User) => void;
	setTokens: (accessToken: string, refreshToken: string) => void;
	setUser: (user: User) => void;
	setTenants: (tenants: Array<{ id: string; name: string; role: string }>) => void;
	setCurrentTenant: (tenantId: string) => void;
	switchTenant: (tenantId: string) => void;
	setPermissions: (permissions: string[]) => void;
	clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			accessToken: null,
			refreshToken: null,
			tenants: [],
			currentTenantId: null,
			permissions: [],
			isAuthenticated: false,

			setAuth: (accessToken, refreshToken, user) => {
				if (!user) return;
				const validToken = accessToken && accessToken !== 'undefined' && accessToken !== 'null';
				set({
					accessToken: validToken ? accessToken : null,
					refreshToken: validToken ? refreshToken : null,
					user,
					isAuthenticated: true,
				});
			},

			setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

			setUser: (user) => set({ user }),

			setTenants: (tenants) => set({ tenants }),

			setCurrentTenant: (tenantId) => set({ currentTenantId: tenantId }),

			switchTenant: (tenantId) => set({ currentTenantId: tenantId }),

			setPermissions: (permissions) => set({ permissions }),

			clearAuth: () =>
				set({
					user: null,
					accessToken: null,
					refreshToken: null,
					tenants: [],
					currentTenantId: null,
					permissions: [],
					isAuthenticated: false,
				}),
		}),
		{
			name: 'authms-auth-v1',
			version: 1,
			// Custom merge: validate persisted data integrity before merging into store.
			// This prevents corrupted localStorage entries from silently breaking auth.
			merge: (persisted, current) => {
				if (!persisted || typeof persisted !== 'object') return current;
				const state = { ...current, ...persisted };

				// Fix: has accessToken but isAuthenticated is false
				if (state.accessToken && !state.isAuthenticated) {
					state.isAuthenticated = true;
				}
				// Fix: no accessToken but isAuthenticated is true (token was evicted)
				if (!state.accessToken && state.isAuthenticated) {
					state.isAuthenticated = false;
				}
				// Fix: has accessToken but user is missing — recover from JWT
				if (state.accessToken && !state.user) {
					try {
						const payload = JSON.parse(atob(state.accessToken.split('.')[1]));
						state.user = {
							id: (payload.sub || payload.user_id) as string,
							username: (payload.custom?.username || payload.username) as string,
							email: (payload.email as string) || '',
							status: 'active',
						};
					} catch {
						/* keep null user */
					}
				}

				return state;
			},
			migrate: (persisted) => {
				// v0 → v1: no structural changes, data is compatible
				return persisted as any;
			},
			partialize: (state) => {
				return {
					accessToken:
						state.accessToken && state.accessToken !== 'undefined' && state.accessToken !== 'null'
							? state.accessToken
							: null,
					refreshToken:
						state.refreshToken &&
						state.refreshToken !== 'undefined' &&
						state.refreshToken !== 'null'
							? state.refreshToken
							: null,
					user: state.user,
					tenants: state.tenants,
					currentTenantId: state.currentTenantId,
					permissions: state.permissions,
					isAuthenticated: state.isAuthenticated,
				};
			},
			onRehydrateStorage: () => (state, error) => {
				if (error || !state) return;
				// merge already handles all fixups; this is a safety net
				if (state.accessToken && !state.isAuthenticated) {
					useAuthStore.setState({ isAuthenticated: true });
				}
			},
		},
	),
);

/**
 * 获取 access token
 */
export function getAccessToken(): string | null {
	const state = useAuthStore.getState().accessToken;
	if (state && state !== 'undefined' && state !== 'null') return state;

	return null;
}

/**
 * 获取 refresh token
 */
export function getRefreshToken(): string | null {
	const state = useAuthStore.getState().refreshToken;
	if (state && state !== 'undefined' && state !== 'null') return state;
	return null;
}

/**
 * 获取当前租户 ID
 */
export function getCurrentTenantId(): string | null {
	return useAuthStore.getState().currentTenantId;
}

/**
 * 获取当前租户下的角色（userinfo-first，非响应式）
 * 派生自 store.tenants + currentTenantId —— 不解析 token 载荷。
 * 前端角色仅用于 UX 呈现；安全判断由后端 rbac-backed 授权强制（AC-008）。
 */
export function getCurrentRole(): string | null {
	const { tenants, currentTenantId } = useAuthStore.getState();
	if (!tenants || tenants.length === 0) return null;
	if (!currentTenantId) return null;
	return tenants.find((t) => t.id === currentTenantId)?.role ?? null;
}

/**
 * 使用 token 登录（设置认证状态）
 */
export function loginWithTokens(
	accessToken: string | null,
	refreshToken: string | null,
	user: User,
): void {
	useAuthStore.getState().setAuth(accessToken || '', refreshToken || '', user);
}

/**
 * 退出登录（清除认证状态 + localStorage/cookie）
 * 委托给 AuthService.logout() 统一实现
 * 使用动态 import 避免 circular dependency (service.ts → store.ts)
 */
export async function logout(_redirectTo?: string): Promise<void> {
	const { AuthService } = await import('./service');
	return AuthService.logout();
}

function decodeJwtPayload(token: string): { exp?: number } | null {
	try {
		return JSON.parse(atob(token.split('.')[1]));
	} catch {
		return null;
	}
}

export function isTokenExpired(token: string): boolean {
	const payload = decodeJwtPayload(token);
	if (!payload?.exp) return true;
	return Date.now() >= payload.exp * 1000;
}

export async function refreshAccessToken(): Promise<string | null> {
	// 统一委托 AuthService.refreshToken()（含并发去重 + JWT/opaque 分流 + onUnauthorized 处理），
	// 消除双实现：store 版不再持有重复的 refresh 逻辑（此前与 service 版不一致——无并发去重）。
	// 动态 import 避免 store.ts ↔ service.ts 循环依赖。
	const { AuthService } = await import('./service');
	return AuthService.refreshToken();
}
