/**
 * 租户直达 URL 构造工具。
 * 替代之前由后端返回的 loginUrl/adminUrl，前端根据自身运行时 origin 自行拼接。
 *
 * URL 约定（所有 Portal 统一遵循）：
 *   登录页: {portalOrigin}/{slug}/login?redirect={portalOrigin}/{slug}/admin
 *   管理页: {portalOrigin}/{slug}/admin
 */

export interface TenantUrls {
	/** 租户登录页直达 URL（含 redirect 参数指向管理后台） */
	loginUrl: string;
	/** 租户管理后台直达 URL */
	adminUrl: string;
}

/**
 * 根据租户 slug 构造登录和管理后台直达 URL。
 * 使用当前页面的 origin，适用于所有 Portal（app/user/auth 等）。
 *
 * @param slug - 租户 slug（即 tenant.name）
 * @param portalOrigin - 可选，指定 portal 域名。默认用 `window.location.origin`
 * @returns 包含 loginUrl 和 adminUrl 的对象
 *
 * @example
 *   const { loginUrl, adminUrl } = buildTenantUrls('acme-corp');
 *   // loginUrl = "https://app.iam.tianv.com/acme-corp/login?redirect=https://app.iam.tianv.com/acme-corp/admin"
 *   // adminUrl = "https://app.iam.tianv.com/acme-corp/admin"
 *
 * @example 使用 auth 域名的登录入口
 *   const { loginUrl } = buildTenantUrls('acme-corp', 'https://auth.iam.tianv.com');
 *   // loginUrl = "https://auth.iam.tianv.com/acme-corp/login?redirect=https://app.iam.tianv.com/acme-corp/admin"
 */
export function buildTenantUrls(
	slug: string,
	portalOrigin?: string,
	adminOrigin?: string,
): TenantUrls {
	const portal = portalOrigin || (typeof window !== 'undefined' ? window.location.origin : '/');
	const admin = adminOrigin || portal;
	const adminPath = `${admin}/${slug}/admin`;
	const loginPath = `${portal}/${slug}/login`;

	return {
		loginUrl: `${loginPath}?redirect=${encodeURIComponent(adminPath)}`,
		adminUrl: adminPath,
	};
}
