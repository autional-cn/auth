'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../auth/store';
import { AuthService } from '../auth/service';
import { usePermissionsQuery, useTenantsQuery } from '../auth/auth-queries';

export type BootstrapState = 'idle' | 'loading' | 'ready' | 'error';

/**
 * 应用启动数据加载 Hook。
 *
 * 使用 React Query 缓存权限和租户数据（5 分钟 staleTime），
 * 避免重复请求。首次加载时自动写入 AuthService。
 *
 * 返回 BootstrapState 用于 Portal Layout 展示加载状态。
 */
export function useBootstrap(): BootstrapState {
	const currentTenantId = useAuthStore((s) => s.currentTenantId);
	const permissionsStore = useAuthStore((s) => s.permissions);
	const tenantsStore = useAuthStore((s) => s.tenants);

	// 无有效 token 时不发起权限/租户查询。
	// 未登录时这些查询必然 401 → apiClient 401 拦截 → refreshToken() 无 refresh token
	// → onUnauthorized() 立即 buildLoginUrl 302，抢跑 RequireAuth 的 OAuth PKCE 决策
	// （跨域 admin 场景偶发：本应跳 authorize，实际却 302 回 auth 登录页）。
	// 未登录的跳转决策统一交给 RequireAuth（OAuth PKCE 或 buildLoginUrl）。
	const rawToken = AuthService.getAccessToken();
	const hasToken = !!rawToken && rawToken !== 'undefined' && rawToken !== 'null';

	// React Query: 5 分钟缓存，自动管理 loading/error
	// key 中包含 currentTenantId，切换租户时自动重新请求
	const permsQuery = usePermissionsQuery(currentTenantId, hasToken);
	const tentsQuery = useTenantsQuery(currentTenantId, hasToken);

	// 同步 React Query 结果到 AuthService（写入 store 触发 persist）
	useEffect(() => {
		if (permsQuery.data && permsQuery.data.length > 0) {
			AuthService.updatePermissions(permsQuery.data);
		}
	}, [permsQuery.data]);

	useEffect(() => {
		if (tentsQuery.data && tentsQuery.data.length > 0) {
			AuthService.updateTenants(tentsQuery.data);
		}
	}, [tentsQuery.data]);

	// 无会话 = 无数据可引导：返回 'idle'，登录交棒由 RequireAuth/守卫决策（见上）。
	// 不得返回 'loading'：Layout 消费者（platform-console）以 bootstrap==='loading'
	// 挡 Outlet，而 RequireAuth 在 Outlet 里 ⇒ 无会话冷启动永停 Spin、守卫永不挂载（F-W5b）。
	if (!hasToken) {
		return 'idle';
	}

	// 已缓存数据 → 立即 ready
	if (permissionsStore.length > 0 && tenantsStore.length > 0) {
		return 'ready';
	}

	// React Query 数据到达（即使是 stale）
	if (permsQuery.data || tentsQuery.data) {
		return 'ready';
	}

	// 两个请求都失败 — keep reporting loading to prevent re-render loops
	// (OAuth PKCE or BFF redirect will resolve the page before error matters)
	if (permsQuery.isError && tentsQuery.isError) {
		return 'loading';
	}

	// 等待中
	return 'loading';
}
