/**
 * 按入口登录：登录请求的入口平面声明（GATEWAY-ENTRY-ISOLATION-DESIGN §4.4）。
 * 值域 api|admin|platform（identity entry_plane.go 契约）；仅登录端点消费，
 * refresh/challenge 由服务端从 claim 继承，无需前端声明。
 */

export type EntryPlane = 'api' | 'admin' | 'platform';

export const ENTRY_PLANE_HEADER = 'X-Entry-Plane';

function planeFromHostname(hostname: string): EntryPlane | null {
	const h = hostname.toLowerCase();
	if (h === 'admin' || h.startsWith('admin.')) return 'admin';
	// security.<root>（安全仪表盘/SOC 门户）API 面为 admin 受众（风险看板等 admin 路由），
	// 与 admin 门户同平面（GATEWAY-ENTRY-ISOLATION-DESIGN §3.2/§4.4）。
	if (h === 'security' || h.startsWith('security.')) return 'admin';
	if (h === 'platform' || h.startsWith('platform.')) return 'platform';
	return null;
}

/**
 * 授权流下钻：同意页冷启动时（无会话），登录页的 redirect 参数是 authorize URL 本身
 * （`<slug>/login?redirect=<authorize URL>`，oauth-cold-start/TASK-07），其宿主是 auth
 * 门户 ⇒ 宿主判定为空。发起门户嵌在其查询参数里：`redirect_uri`（发起方回调，宿主即
 * 门户）或 `state.redirect`（发起页 URL，见 oauth-login state 载荷）。不下钻则回程
 * 门户拿到的 token 平面恒为 api，admin/platform 受众端点全部 403 40000503（F-W5）。
 */
function planeFromAuthorizeRequest(url: URL): EntryPlane | null {
	if (!url.pathname.includes('/oauth/authorize')) return null;
	const candidates: Array<string | null> = [url.searchParams.get('redirect_uri')];
	try {
		const state = JSON.parse(url.searchParams.get('state') || '');
		if (state && typeof state.redirect === 'string') candidates.push(state.redirect);
	} catch {
		// state 非 JSON（旧式纯串）→ 唯一候选 redirect_uri
	}
	for (const candidate of candidates) {
		if (!candidate) continue;
		try {
			const plane = planeFromHostname(new URL(candidate, url.origin).hostname);
			if (plane) return plane;
		} catch {
			// 单个候选非法不阻断后续候选
		}
	}
	return null;
}

/** 由登录页 redirect 参数目标（或当前主机）推导入口平面，无法判定时缺省 api。 */
export function resolveEntryPlane(redirect: string | null, currentHostname: string): EntryPlane {
	if (redirect) {
		try {
			const url = new URL(redirect, `https://${currentHostname || 'localhost'}`);
			const fromTarget = planeFromHostname(url.hostname) ?? planeFromAuthorizeRequest(url);
			if (fromTarget) return fromTarget;
		} catch {
			// redirect 非法时回落当前主机判定
		}
	}
	return planeFromHostname(currentHostname) ?? 'api';
}
