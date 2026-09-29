/**
 * PortalGuard — Portal 级 Guard 组件
 *
 * 基于 portal-config.ts 中的角色定义，派生出命名 Guard 组件。
 * 替代在每个路由中重复传入 allowedRoles 的模式。
 *
 * 用法:
 *   import { AdminGuard, PlatformGuard, SecurityGuard } from '@autional-cn/shared';
 *
 *   // admin-console 路由:
 *   <AdminGuard><DashboardPage /></AdminGuard>
 *   <AdminGuard allowedRoles={['user_mgmt']}><UsersPage /></AdminGuard>  // 覆盖默认角色
 *
 * @see portal-config.ts
 */

'use client';

import React from 'react';
import { RequireAuth } from './RequireAuth';
import { ADMIN_GUARDS, PLATFORM_GUARDS, SECURITY_GUARDS } from '../auth/portal-config';

interface PortalGuardProps {
	children: React.ReactNode;
	allowedRoles?: readonly string[];
	fallback?: React.ReactNode;
	loadingFallback?: React.ReactNode;
	/** 确定性未知 slug（by-slug HTTP 404）时渲染的 404 页（透传 RequireAuth） */
	notFound?: React.ReactNode;
}

/**
 * Admin Console Guard — 默认 roles: ['super_admin', 'admin']
 */
export function AdminGuard({ children, allowedRoles, ...rest }: PortalGuardProps) {
	return (
		<RequireAuth allowedRoles={allowedRoles || ADMIN_GUARDS.admin.roles} {...rest}>
			{children}
		</RequireAuth>
	);
}

/**
 * 用户管理 Guard — roles: ['super_admin', 'admin', 'user_manager']
 */
export function UserMgmtGuard({ children, allowedRoles, ...rest }: PortalGuardProps) {
	return (
		<RequireAuth allowedRoles={allowedRoles || ADMIN_GUARDS.userMgmt.roles} {...rest}>
			{children}
		</RequireAuth>
	);
}

/**
 * 安全只读 Guard — roles: ['super_admin', 'admin', 'security_admin']
 */
export function SecurityGuard({ children, allowedRoles, ...rest }: PortalGuardProps) {
	return (
		<RequireAuth allowedRoles={allowedRoles || SECURITY_GUARDS.security.roles} {...rest}>
			{children}
		</RequireAuth>
	);
}

/**
 * Platform Console Guard — roles: ['super_admin', 'admin']
 */
export function PlatformGuard({ children, allowedRoles, ...rest }: PortalGuardProps) {
	return (
		<RequireAuth allowedRoles={allowedRoles || PLATFORM_GUARDS.superAdmin.roles} {...rest}>
			{children}
		</RequireAuth>
	);
}

/**
 * Security Admin Guard — roles: ['super_admin', 'security_admin']
 * 用于 security-dashboard 中仅 security_admin 可访问的平台级页面
 */
export function SecurityAdminGuard({ children, allowedRoles, ...rest }: PortalGuardProps) {
	return (
		<RequireAuth allowedRoles={allowedRoles || SECURITY_GUARDS.securityAdmin.roles} {...rest}>
			{children}
		</RequireAuth>
	);
}

/**
 * Auditor Guard — roles: ['auditor']
 * 仅 auditor 可访问的纯审计页面（只读）
 */
export function AuditorGuard({ children, allowedRoles, ...rest }: PortalGuardProps) {
	return (
		<RequireAuth allowedRoles={allowedRoles || SECURITY_GUARDS.auditor.roles} {...rest}>
			{children}
		</RequireAuth>
	);
}

/**
 * Token-only Guard — 仅需登录，无角色限制
 */
export function AuthGuard({ children, ...rest }: PortalGuardProps) {
	return <RequireAuth {...rest}>{children}</RequireAuth>;
}
