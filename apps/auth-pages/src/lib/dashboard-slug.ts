/**
 * 看板租户 slug 标记（AUTH-53）。
 *
 * 记录「本会话最近一次成功建立的是哪个租户的会话」，供两条链路消费：
 * - 登录页守卫：会话租户与 URL 租户不一致时拦截（防跨租户会话静默串门）；
 * - DashboardSlugRedirect / pickSessionSlug：无 URL 上下文时决定落点。
 *
 * ⚠ 必须用 localStorage 而非 sessionStorage：会话（shared useAuthStore 的
 * partialize）跨 tab 持久，而 sessionStorage 是 tab 级——新 tab 里标记为 null，
 * 守卫被短路放行，正是 AUTH-53 的根因之一。标记与会话同生命周期（跨 tab），
 * 登出/会话取消时同步清除。
 */
const KEY = 'auth_dashboard_slug';

export function getDashboardSlug(): string | null {
	try {
		return localStorage.getItem(KEY);
	} catch {
		return null;
	}
}

export function setDashboardSlug(slug: string): void {
	try {
		localStorage.setItem(KEY, slug);
	} catch {
		// localStorage 不可用（隐私模式等）— 标记缺失退化为 marker 回落分支
	}
}

export function clearDashboardSlug(): void {
	try {
		localStorage.removeItem(KEY);
	} catch {
		// 同上
	}
}
