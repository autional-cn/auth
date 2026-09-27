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

/** 由登录页 redirect 参数目标（或当前主机）推导入口平面，无法判定时缺省 api。 */
export function resolveEntryPlane(redirect: string | null, currentHostname: string): EntryPlane {
	if (redirect) {
		try {
			const url = new URL(redirect, `https://${currentHostname || 'localhost'}`);
			const fromTarget = planeFromHostname(url.hostname);
			if (fromTarget) return fromTarget;
		} catch {
			// redirect 非法时回落当前主机判定
		}
	}
	return planeFromHostname(currentHostname) ?? 'api';
}
