/**
 * useAuth — 认证状态 React Hook
 *
 * 基于 useSyncExternalStore 订阅 AuthService 事件，
 * 实现零额外渲染的认证状态响应。
 *
 * 替代以下模式的直接 useAuthStore 使用：
 *   const { isAuthenticated, user, permissions } = useAuthStore();
 * 改为:
 *   const { isAuthenticated, user, permissions } = useAuth();
 *
 * useAuthActions() 替代直接调用 AuthService 静态方法：
 *   const { login, logout, setCurrentTenant } = useAuthActions();
 *   await logout();
 *
 * @see docs/architecture/auth-service-migration-plan.md
 */

'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { AuthService } from '../auth/service';
import type { User } from '../types';

// ============ Types ============

export interface AuthSnapshot {
	isAuthenticated: boolean;
	user: User | null;
	userId: string | null;
	accessToken: string | null;
	currentTenantId: string | null;
	permissions: string[];
	tenants: Array<{ id: string; name: string; role: string }>;
}

export interface AuthActions {
	/** 跳转到 OAuth 登录页或 auth-pages */
	login: (params?: { clientId?: string; redirectUri?: string }) => Promise<void>;
	/** 统一登出（清除所有状态 + 跳转登录页） */
	logout: () => Promise<void>;
	/** 设置当前租户 */
	setCurrentTenant: (tenantId: string) => void;
	/** 更新用户信息 */
	updateUser: (user: Partial<User>) => void;
	/** 设置权限列表 */
	updatePermissions: (permissions: string[]) => void;
	/** 设置租户列表 */
	updateTenants: (tenants: Array<{ id: string; name: string; role: string }>) => void;
}

// ============ Snapshot with Change Detection ============

/** 浅比较两个快照 — 只有实际变化时才返回新引用，避免不必要 re-render */
function shallowEqual(a: AuthSnapshot, b: AuthSnapshot): boolean {
	if (a.isAuthenticated !== b.isAuthenticated) return false;
	if (a.userId !== b.userId) return false;
	if (a.accessToken !== b.accessToken) return false;
	if (a.currentTenantId !== b.currentTenantId) return false;
	if (a.user?.username !== b.user?.username) return false;
	if (a.user?.email !== b.user?.email) return false;
	if (a.permissions.length !== b.permissions.length) return false;
	if (a.tenants.length !== b.tenants.length) return false;
	// 简化的数组比较：内容变更时下个事件循环会触发重新计算
	return true;
}

let lastSnapshot: AuthSnapshot | null = null;

/** 所有事件触发的回调（统一入口，减少事件注册数量） */
const AUTH_EVENTS = [
	'auth:login',
	'auth:logout',
	'auth:user-updated',
	'auth:tokens-refreshed',
	'auth:tenant-changed',
	'auth:tenants-updated',
	'auth:permissions-updated',
] as const;

function buildSnapshot(): AuthSnapshot {
	const user = AuthService.getUser();
	return {
		isAuthenticated: AuthService.isAuthenticated(),
		user,
		userId: user?.id || null,
		accessToken: AuthService.getAccessToken(),
		currentTenantId: AuthService.getCurrentTenantId(),
		permissions: AuthService.getPermissions(),
		tenants: AuthService.getTenants(),
	};
}

function getSnapshot(): AuthSnapshot {
	const now = buildSnapshot();
	if (lastSnapshot && shallowEqual(lastSnapshot, now)) {
		return lastSnapshot;
	}
	lastSnapshot = now;
	return now;
}

function subscribeToAuth(callback: () => void): () => void {
	const unsubs = AUTH_EVENTS.map((event) => AuthService.subscribe(event, callback));
	return () => unsubs.forEach((u) => u());
}

// ============ useAuth ============

/**
 * 响应式认证状态 Hook。
 * 返回完整认证快照，含用户、token、权限、租户信息。
 * 内部使用 shallowEqual 缓存，只有实际变化时才触发 re-render。
 *
 * 用法:
 * ```tsx
 * const { isAuthenticated, user, permissions, currentTenantId } = useAuth();
 * ```
 */
export function useAuth(): AuthSnapshot {
	const snapshot = useSyncExternalStore(subscribeToAuth, getSnapshot);
	return snapshot;
}

// ============ Selector Hooks ============

/**
 * 是否已认证（只读，仅当此值变化时 re-render）
 */
export function useIsAuthenticated(): boolean {
	const { isAuthenticated } = useAuth();
	return isAuthenticated;
}

/**
 * 当前用户（只读，仅当此值变化时 re-render）
 */
export function useUser(): User | null {
	const { user } = useAuth();
	return user;
}

/**
 * 当前用户 ID（只读，仅当此值变化时 re-render）
 */
export function useUserId(): string | null {
	const { userId } = useAuth();
	return userId;
}

/**
 * 当前 access token（只读，仅当此值变化时 re-render）
 */
export function useAccessToken(): string | null {
	const { accessToken } = useAuth();
	return accessToken;
}

/**
 * 当前权限列表（只读，仅当此值变化时 re-render）
 */
export function useAuthPermissions(): string[] {
	const { permissions } = useAuth();
	return permissions;
}

/**
 * 当前租户 ID（只读，仅当此值变化时 re-render）
 */
export function useCurrentTenantId(): string | null {
	const { currentTenantId } = useAuth();
	return currentTenantId;
}

/**
 * 租户列表（只读，仅当此值变化时 re-render）
 */
export function useTenants(): Array<{ id: string; name: string; role: string }> {
	const { tenants } = useAuth();
	return tenants;
}

// ============ useAuthActions ============

/**
 * 认证操作 Hook。
 * 提供 login/logout/setCurrentTenant/update* 等操作，
 * 替代组件中直接调用 AuthService 静态方法。
 *
 * 用法:
 * ```tsx
 * const { logout, setCurrentTenant } = useAuthActions();
 * await logout();
 * setCurrentTenant('new-tenant-id');
 * ```
 */
export function useAuthActions(): AuthActions {
	const login = useCallback(
		async (params?: { clientId?: string; redirectUri?: string }): Promise<void> => {
			if (params?.clientId) {
				const { initiateOAuthLogin } = await import('../auth/oauth-login');
				return initiateOAuthLogin(params.clientId, params.redirectUri);
			}
			const { buildLoginUrl } = await import('../auth/roles');
			window.location.href = buildLoginUrl(window.location.href);
		},
		[],
	);

	const logout = useCallback(async (): Promise<void> => {
		// 在 clearAuth 前捕获 URL，避免时序竞争（与 useLogout 一致）
		const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
		await AuthService.logout();
		const { buildLoginUrl } = await import('../auth/roles');
		// 传当前 URL 作为 returnUrl，保留租户 slug（与 useLogout 一致）
		window.location.href = buildLoginUrl(currentUrl);
	}, []);

	const setCurrentTenant = useCallback((tenantId: string): void => {
		AuthService.updateCurrentTenant(tenantId);
	}, []);

	const updateUser = useCallback((user: Partial<User>): void => {
		AuthService.updateUser(user);
	}, []);

	const updatePermissions = useCallback((permissions: string[]): void => {
		AuthService.updatePermissions(permissions);
	}, []);

	const updateTenants = useCallback(
		(tenants: Array<{ id: string; name: string; role: string }>): void => {
			AuthService.updateTenants(tenants);
		},
		[],
	);

	return { login, logout, setCurrentTenant, updateUser, updatePermissions, updateTenants };
}
