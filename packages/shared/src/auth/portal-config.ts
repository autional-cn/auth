/**
 * PortalAuthConfig — Portal 认证配置注册表
 *
 * 集中管理所有 Portal 的角色定义和 Guard 配置，
 * 消除跨 Portal 的角色常量重复定义。
 *
 * 用法:
 *   import { ADMIN_GUARDS, AdminGuard } from '@autional-cn/shared';
 *   // 路由中: <AdminGuard><Page /></AdminGuard>
 *   替代: <RequireAuth allowedRoles={['super_admin', 'admin']}><Page /></RequireAuth>
 *
 * @see docs/architecture/auth-next-issues-analysis.md
 */

// ============ Role Sets ============

/** 超级管理员（系统级） */
export const ROLE_SUPER_ADMIN = ['super_admin', 'admin'] as const;
/** 用户管理 */
export const ROLE_USER_MGMT = ['super_admin', 'admin', 'user_manager'] as const;
/** 安全只读（含 admin，用于 admin-console 路由守卫） */
export const ROLE_SECURITY_READ = ['super_admin', 'admin', 'security_admin'] as const;
/** security-dashboard 基础准入（不含 admin — admin 不直接登录 security-dashboard） */
export const ROLE_SECURITY_ENTRY = ['super_admin', 'security_admin', 'auditor'] as const;
/** 审计安全（含 auditor 只读，不含 admin — admin 审计经 admin-console + sod_mode 控制） */
export const ROLE_AUDIT_READ = ['super_admin', 'security_admin', 'auditor'] as const;
/** 安全操作（含配置权限，不含 auditor） */
export const ROLE_SECURITY_FULL = ['super_admin', 'security_admin'] as const;

// ============ Portal Guards ============

/**
 * Portal Guard 配置。
 * 如需新增 Guard，在此添加 role 集即可。
 */
export const ADMIN_GUARDS = {
	admin: { roles: ROLE_SUPER_ADMIN },
	userMgmt: { roles: ROLE_USER_MGMT },
	securityRead: { roles: ROLE_SECURITY_READ },
	auditRead: { roles: ROLE_AUDIT_READ }, // admin-console 审计证据路由
	securityAdmin: { roles: ROLE_SECURITY_FULL }, // admin-console 安全配置管理
} as const;

export const PLATFORM_GUARDS = {
	superAdmin: { roles: ROLE_SUPER_ADMIN },
} as const;

export const SECURITY_GUARDS = {
	security: { roles: ROLE_SECURITY_ENTRY }, // 基础准入（不含 admin）
	auditRead: { roles: ROLE_AUDIT_READ }, // 审计证据页（auditor 只读）
	securityAdmin: { roles: ROLE_SECURITY_FULL }, // 安全配置/平台级操作
	auditor: { roles: ['auditor'] }, // 仅 auditor
} as const;

// ============ Portal Config ============

/** 所有 Portal 的认证配置映射 */
export const PORTAL_AUTH_CONFIG = {
	'admin-console': { guards: ADMIN_GUARDS },
	'platform-console': { guards: PLATFORM_GUARDS },
	'security-dashboard': { guards: SECURITY_GUARDS },
	'end-user-portal': { guards: null }, // 仅需 token，无角色限制
	// developer-portal removed — merged into admin per ADR-006
	'authenticator-app': { guards: null }, // 仅需 token，无角色限制
	'auth-pages': { guards: null }, // 混合（大部分公开）
} as const;

export type PortalName = keyof typeof PORTAL_AUTH_CONFIG;
