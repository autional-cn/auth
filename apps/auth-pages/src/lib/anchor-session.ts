import { decodeJwtPayload, useAuthStore } from '@autional-cn/shared';
import { setDashboardSlug } from './dashboard-slug';
import { resolveTenantSlug } from './tenant-store';

/**
 * 会话锚定（AUTH-53 约束⑤）：凡建立会话的入口（密码登录/注册自动登录/magic-link/
 * MFA 挑战/passkey/OAuth 回调）都必须把「会话租户」写进两处持久源：
 *   1. store.currentTenantId —— 跨 tab 随会话持久，是守卫与 dashboard 的 id 级判据；
 *   2. auth_dashboard_slug 标记 —— 无 URL 上下文时的 slug 回落源。
 * 不做锚定的话，从「已有他租户会话」的上下文里新建的会话会带着陈旧租户 id/标记，
 * 被跨租户守卫当成串门误清。
 *
 * tenantId 优先取调用方已知的权威值（表单/路由配置），缺失时回落到 JWT 的
 * `tenant_id` claim（签发侧真源）；slug 优先取调用方上下文（URL 参数），缺失时
 * 用公开租户名单做 id → slug 解析（名单未就绪则跳过标记写入，id 判据仍生效）。
 */
export function anchorSessionFromToken(
	accessToken: string,
	options?: {
		slug?: string | null;
		tenantId?: string | null;
		knownTenants?: Array<{ id?: string; name?: string; slug?: string }>;
	},
): void {
	const payload = accessToken ? decodeJwtPayload(accessToken) : null;
	const tenantId =
		options?.tenantId || (payload?.tenant_id as string | undefined) || null;
	if (tenantId) {
		useAuthStore.getState().setCurrentTenant(tenantId);
	}
	const slug =
		options?.slug || resolveTenantSlug(options?.knownTenants, tenantId) || null;
	if (slug) {
		setDashboardSlug(slug);
	}
}
