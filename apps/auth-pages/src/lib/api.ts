/**
 * Auth Pages API 函数
 * 使用 @autional-cn/shared 的统一 apiClient（自动 unwrap + camelCase 转换）
 */

import { useAuthStore } from '@autional-cn/shared';
import { authMePermissions, authMeTenants } from '@autional-cn/shared/generated/api';

/**
 * 登录后加载权限和租户信息到 auth store。
 * 不阻断登录流程，失败静默忽略。
 */
export async function loadAuthExtras(): Promise<void> {
	try {
		const [permsRes, tenantsRes] = await Promise.all([authMePermissions(), authMeTenants()]);
		const store = useAuthStore.getState();
		store.setPermissions((permsRes as any)?.permissions ?? []);
		store.setTenants((tenantsRes as any)?.tenants ?? []);
		if ((tenantsRes as any)?.tenants?.length > 0 && !store.currentTenantId) {
			store.setCurrentTenant((tenantsRes as any).tenants[0].id);
		}
	} catch {
		// 静默忽略：权限/租户加载失败不阻断登录
	}
}

export type { LoginRequest } from '@autional-cn/shared/generated/types';
export type { RegisterRequest } from '@autional-cn/shared/generated/types';

// ApiError & LoginResponse removed (dead code — never imported anywhere).
// Use LoginResponse from @autional-cn/shared/generated/types or ExtractedApiError from @autional-cn/shared.

// All API functions migrated to ./api.generated.ts
// Re-export for backward compat:
export * from './api.generated';
