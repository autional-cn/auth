/**
 * 权限检查 Hook
 * 基于 effective_permissions 数组进行前端权限控制
 * 通过 zustand selector 订阅 store 本身实现响应式更新（ADR-002）——
 * loadAuthExtras 直写 store action 不发 AuthService 事件，仅订阅事件会漏刷新。
 */

import { useAuthStore } from '../auth/store';
import { useCurrentRole } from './useCurrentRole';

export interface PermissionResult {
	can: (permission: string) => boolean;
	canAny: (...permissions: string[]) => boolean;
	canAll: (...permissions: string[]) => boolean;
	isSuperAdmin: boolean;
	isTenantAdmin: boolean;
	isAuditor: boolean;
	isDeveloper: boolean;
	isEndUser: boolean;
}

const PERMISSION_MAP: Record<string, string[]> = {
	'user:create': ['tenant:user:read'],
	'user:read': ['tenant:user:read', 'tenant:dashboard:read', 'self:profile:read'],
	'user:update': ['tenant:user:read'],
	'user:delete': ['tenant:user:read'],
	'role:create': ['tenant:role:read'],
	'role:read': ['tenant:role:read'],
	'role:update': ['tenant:role:read'],
	'role:delete': ['tenant:role:read'],
	'audit:read': ['tenant:audit:read', 'tenant:compliance:read'],
	'profile:read': ['tenant:profile:read'],
	'profile:write': ['tenant:profile:read'],
	'profile:archive': ['tenant:profile:read'],
	'profile:export': ['tenant:profile:read', 'tenant:compliance:read'],
	'profile:delete': ['tenant:profile:read'],
	'profile:manage': ['tenant:profile:read'],
	'system:config': [
		'tenant:permission:read',
		'tenant:session:read',
		'tenant:secret:manage',
		'tenant:department:read',
		'tenant:member:read',
		'tenant:app:read',
		'tenant:idp:read',
		'tenant:webhook:read',
		'tenant:mfa:read',
		'tenant:security:read',
		'tenant:branding:read',
		'tenant:notification:read',
		'tenant:communication:read',
		'tenant:storage:read',
		'tenant:wallet:read',
		'tenant:point:read',
	],
};

const EMPTY_PERMS: string[] = [];

export function usePermission(): PermissionResult {
	// zustand selector 订阅 store：permissions 数组取 store 原引用（或模块级常量
	// EMPTY_PERMS），role 为 string 原语 —— 两者均天然引用稳定，值相等即不触发
	// 重渲染（Object.is 比较），根治 React #185 (Maximum update depth exceeded)。
	const permissions = useAuthStore((s) => s.permissions || EMPTY_PERMS);
	const perms = permissions;

	const role = useCurrentRole();
	const isAdminRole = role === 'super_admin' || role === 'admin';

	// Build effective permission set: backend resource:action → frontend scope:resource:action
	const effectivePerms = new Set<string>();
	for (let i = 0; i < perms.length; i++) {
		const p = perms[i];
		if (p) {
			effectivePerms.add(p);
			const mapped = PERMISSION_MAP[p];
			if (mapped) {
				for (let j = 0; j < mapped.length; j++) {
					effectivePerms.add(mapped[j]);
				}
			}
		}
	}
	const allPerms = Array.from(effectivePerms);

	const can = (permission: string): boolean => {
		if (effectivePerms.has(permission)) return true;
		if (isAdminRole && permission.startsWith('tenant:')) return true;
		if (isAdminRole && permission.startsWith('platform:')) return true;
		return false;
	};

	const canAny = (...permissionList: string[]): boolean =>
		permissionList.some((p) => effectivePerms.has(p));

	const canAll = (...permissionList: string[]): boolean =>
		permissionList.every((p) => effectivePerms.has(p));

	const isSuperAdmin = allPerms.some((p) => p.startsWith('platform:'));

	const isTenantAdmin = allPerms.some(
		(p) => p.startsWith('tenant:') && (p.endsWith(':manage') || p.endsWith(':write')),
	);

	const isAuditor =
		allPerms.some((p) => p.startsWith('tenant:audit:')) &&
		!allPerms.some((p) => p.includes(':write') || p.includes(':delete'));

	const isDeveloper =
		allPerms.some((p) => p.startsWith('tenant:app:')) &&
		!allPerms.some((p) => p.startsWith('tenant:user:'));

	const isEndUser = allPerms.every((p) => p.startsWith('self:'));

	return { can, canAny, canAll, isSuperAdmin, isTenantAdmin, isAuditor, isDeveloper, isEndUser };
}
