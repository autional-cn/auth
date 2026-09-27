/**
 * auth-queries — React Query 认证数据查询
 *
 * 为 permissions / tenants / me 等服务端数据提供缓存语义。
 * 替代 useBootstrap 手动管理请求/loading/error 状态的方式。
 *
 * 用法:
 *   const { data: permissions, isLoading } = usePermissionsQuery();
 *   const { data: tenants, isError } = useTenantsQuery();
 *
 * @see docs/architecture/auth-next-issues-analysis.md
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { extractItem } from '../utils/response';

// ============ Constants ============

/** 权限/租户缓存时间：5 分钟内不重复请求 */
export const AUTH_DATA_STALE_TIME = 5 * 60 * 1000;

// ============ Query Keys ============

export const authQueryKeys = {
	all: ['auth'] as const,
	permissions: (tenantId?: string | null) =>
		tenantId
			? ([...authQueryKeys.all, 'permissions', tenantId] as const)
			: ([...authQueryKeys.all, 'permissions'] as const),
	tenants: (tenantId?: string | null) =>
		tenantId
			? ([...authQueryKeys.all, 'tenants', tenantId] as const)
			: ([...authQueryKeys.all, 'tenants'] as const),
	me: () => [...authQueryKeys.all, 'me'] as const,
};

// ============ Queries ============

/**
 * 当前用户权限列表查询。
 * 结果自动写入 AuthService（通过 onSuccess 回调），
 * 供 usePermission hook 和权限检查使用。
 *
 * @param tenantId — 可选，切换租户时自动重新请求
 */
export function usePermissionsQuery(tenantId?: string | null, enabled = true) {
	return useQuery({
		queryKey: authQueryKeys.permissions(tenantId),
		queryFn: async () => {
			const headers: Record<string, string> = {};
			if (tenantId) headers['X-Tenant-ID'] = tenantId;
			const res = await apiClient.get('/identity/api/v1/auth/me/permissions', { headers });
			const d = extractItem(res.data);
			return ((Array.isArray(d) ? d : (d as { permissions?: string[] } | null)?.permissions) ||
				[]) as string[];
		},
		staleTime: AUTH_DATA_STALE_TIME,
		retry: 1,
		retryDelay: 1000,
		// 无 token 时禁止发起请求：未登录时该查询必然 401 → apiClient 401 拦截
		// → refreshToken() 无 refresh token → onUnauthorized() 抢跑 buildLoginUrl，
		// 与 RequireAuth 的 OAuth PKCE 触发形成时序竞争（跨域 admin 场景偶发 302 回登录页）。
		// 未登录的跳转决策统一交给 RequireAuth（OAuth PKCE 或 buildLoginUrl）。
		enabled,
	});
}

/**
 * 当前用户租户列表查询。
 * 结果自动写入 AuthService。
 *
 * @param tenantId — 可选，切换租户时自动重新请求
 */
export function useTenantsQuery(tenantId?: string | null, enabled = true) {
	return useQuery({
		queryKey: authQueryKeys.tenants(tenantId),
		queryFn: async () => {
			const headers: Record<string, string> = {};
			if (tenantId) headers['X-Tenant-ID'] = tenantId;
			const res = await apiClient.get('/identity/api/v1/auth/me/tenants', { headers });
			const d = extractItem(res.data);
			return ((Array.isArray(d)
				? d
				: (d as { tenants?: Array<{ id: string; name: string; role: string }> } | null)?.tenants) ||
				[]) as Array<{
				id: string;
				name: string;
				role: string;
			}>;
		},
		staleTime: AUTH_DATA_STALE_TIME,
		retry: 1,
		retryDelay: 1000,
		// 与 usePermissionsQuery 一致：无 token 时禁止发起请求，
		// 避免 401 → onUnauthorized 抢跑 RequireAuth 的 OAuth PKCE 流程。
		enabled,
	});
}

/**
 * 当前用户信息查询。
 * 用于 OAuth 回调后获取完整用户信息。
 */
export function useMeQuery() {
	return useQuery({
		queryKey: authQueryKeys.me(),
		queryFn: async () => {
			const res = await apiClient.get('/identity/api/v1/auth/me');
			return extractItem(res.data) ?? res.data;
		},
		staleTime: AUTH_DATA_STALE_TIME,
		retry: 1,
		retryDelay: 1000,
	});
}
