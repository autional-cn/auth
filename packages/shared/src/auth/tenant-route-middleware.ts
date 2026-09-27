/**
 * useTenantRoute — 路由层中间件
 *
 * 从 URL slug 解析租户配置，与认证逻辑解耦。
 * 代替 RequireAuth 直接使用 useOAuthClientIdFromUrl。
 *
 * 职责:
 *  - 从 URL 提取 tenant slug
 *  - 请求 OAuth 客户端配置 (slug → clientId)
 *  - 自动将 tenantId 写入 AuthService
 *  - 暴露 loading/notFound 状态给路由层
 *
 * @see docs/architecture/auth-next-issues-analysis.md
 */

'use client';

import { useEffect } from 'react';
import { useOAuthClientIdFromUrl } from './oauth-client-from-slug';
import { AuthService } from './service';
import { getPortalUrl } from '../config';

export interface TenantRouteResult {
	/** 租户 slug（从 URL 提取） */
	slug: string | null;
	/** 租户 ID（从 OAuth 配置获取） */
	tenantId: string | null;
	/** OAuth 客户端 ID */
	oauthClientId: string | null;
	/** 是否正在加载（API 请求中） */
	loading: boolean;
	/** 未找到（无 slug 或无 OAuth 配置） */
	notFound: boolean;
}

/**
 * 路由层中间件：从 URL slug 解析租户配置。
 *
 * 用法:
 * ```tsx
 * function AppLayout() {
 *   const tenantRoute = useTenantRoute();
 *   if (tenantRoute.loading) return <Spin />;
 *   return <App tenantSlug={tenantRoute.slug} />;
 * }
 * ```
 */
export function useTenantRoute(): TenantRouteResult {
	const slugResolution = useOAuthClientIdFromUrl();

	// Auto-store tenantId in AuthService when resolved
	useEffect(() => {
		if (slugResolution.status === 'resolved' && slugResolution.config.tenantId) {
			AuthService.updateCurrentTenant(slugResolution.config.tenantId);
		}
	}, [slugResolution.status]);

	// slug 在 useOAuthClientIdFromUrl 中通过 extractSlugFromPath 从 URL 提取，
	// 通过 SlugResolution.resolved.slug 传递，无需从 API 响应中读取。
	const slug = slugResolution.status === 'resolved' ? slugResolution.slug : null;

	return {
		slug,
		tenantId: slugResolution.status === 'resolved' ? slugResolution.config.tenantId || null : null,
		oauthClientId: slugResolution.status === 'resolved' ? slugResolution.clientId : null,
		loading: slugResolution.status === 'loading',
		notFound: slugResolution.status === 'not-found',
	};
}

/**
 * 获取有效的 OAuth clientId：配置 > 环境变量 > slug 解析。
 * 这是 redirect 决策的核心逻辑，提取为纯函数便于测试。
 */
export function resolveEffectiveClientId(
	tenantRoute: TenantRouteResult,
	envClientId?: string,
): string | null {
	// slug 解析出的 clientId 优先（多租户场景）
	if (tenantRoute.oauthClientId) return tenantRoute.oauthClientId;
	// 环境变量其次（单租户/开发场景）
	if (envClientId) return envClientId;
	return null;
}

/**
 * 判断 OAuth 是否在同域（slug-resolved 或同域 auth-pages）。
 * SSR 安全：在服务端环境下始终返回 false。
 */
export function isSameDomainOAuth(tenantRoute: TenantRouteResult): boolean {
	if (typeof window === 'undefined') return false; // SSR guard
	if (tenantRoute.notFound) return false;
	// slug 解析到的 client 一定是同域的（API 在同一 gateway 后）
	if (tenantRoute.oauthClientId) return true;
	// 检查 auth-pages URL 是否同域
	try {
		const authPagesUrl = getPortalUrl('auth');
		if (!authPagesUrl) return false;
		return new URL(authPagesUrl).origin === window.location.origin;
	} catch {
		return false;
	}
}
