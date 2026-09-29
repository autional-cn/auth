/**
 * 统一的登出 Hook
 * 所有 portal 必须使用此 hook 处理登出，确保清理逻辑一致
 * 委托给 AuthService.logout() 统一实现
 */

import { useCallback } from 'react';
import { buildLogoutUrl } from '../auth/roles';

/**
 * 统一的登出 Hook
 * 委托 AuthService.logout() 执行清理（清除内存状态、localStorage、cookie、token 吊销），
 * 然后跳转到登录页。
 */
export function useLogout() {
	return useCallback(() => {
		const performLogout = async () => {
			// 在 clearAuth/跳转前捕获当前 URL，避免时序竞争：
			// AuthService.logout() 的 clearAuth 会触发 store 变化，
			// 页面可能因此先导航到 '/'，导致后续读到的 window.location.href 丢失租户 slug
			const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

			// AuthService.logout() 统一处理：clearAuth + LS 清理 + cookie 清理 + token 吊销
			const { AuthService } = await import('../auth/service');
			await AuthService.logout();

			// buildLogoutUrl = auth 域裸根 + `logout=1` 登出意图标记：入口路由据此先
			// 终结会话再落 brand，而不是把带会话的回程当普通深链直送登录页（会静默重登）。
			window.location.href = buildLogoutUrl(currentUrl);
		};
		performLogout();
	}, []);
}
