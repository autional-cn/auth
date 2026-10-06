import {
	getCurrentRole,
	isValidRedirect,
	crossAppUrl,
	ADMIN_CONSOLE_URL,
	SECURITY_DASHBOARD_URL,
	getPortalUrl,
} from '@autional/shared';

export function getPostLoginTarget(opts: {
	tenantSlug?: string | null;
	redirect?: string | null;
	// 响应经 shared 拦截器 camel 化：metadata.portal_preferences → portalPreferences
	user?: { metadata?: { portalPreferences?: { default?: string } } } | null;
}): string {
	if (opts.redirect && isValidRedirect(opts.redirect)) {
		return opts.redirect;
	}

	// 1. 用户偏好的默认 Portal
	const prefs = opts.user?.metadata?.portalPreferences;
	if (prefs?.default) {
		const portalUrl = getPortalUrl(prefs.default, opts.tenantSlug || undefined);
		if (portalUrl) return portalUrl;
	}

	// 2. 角色路由（现有逻辑）
	const role = getCurrentRole();
	if (role === 'super_admin' || role === 'admin') {
		return crossAppUrl(ADMIN_CONSOLE_URL());
	}
	if (role === 'security_admin') {
		return crossAppUrl(SECURITY_DASHBOARD_URL());
	}
	return `/${opts.tenantSlug || ''}/dashboard`.replace('//', '/');
}
