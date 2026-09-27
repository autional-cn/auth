/**
 * 统一的登出 Hook
 * 所有 portal 必须使用此 hook 处理登出，确保清理逻辑一致
 * 委托给 AuthService.logout() 统一实现
 */

import { useCallback } from 'react';
import { buildLoginUrl } from '../auth/roles';

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

			// buildLoginUrl 统一处理登录页跳转与租户 slug 保留：
			// - returnUrl 同属 auth 域且首段非保留路由 → {base}/{slug}/login（保留租户 slug）
			// - 跨域（portal 域如 app.iam.tianv.com/admin）→ {base}?redirect=<portal-url>
			//   （origin 不同不会误判为租户 slug，与 RequireAuth 未授权跳转语义一致）
			// - 登录/登出页本身 → {base}（避免嵌套 redirect）
			window.location.href = buildLoginUrl(currentUrl);
		};
		performLogout();
	}, []);
}
