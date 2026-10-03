'use client';
import { useEffect, useRef } from 'react';
import { useAccessToken, AuthService, buildLoginUrl } from '@autional-cn/shared';

/**
 * onWarning：预警点（到期前 5 分钟）**静默续期失败**时回调——会话此刻仍有效，
 *   让消费方提示用户处理；续期成功则全程无感（token 更新自动重调度，不再触发预警）。
 * onExpired：到点续期仍失败时回调（消费方负责唯一导航出口）。
 */
export function useSessionTimeout(
	onWarning?: (minutesLeft: number) => void,
	onExpired?: () => void,
) {
	const tokenFromStore = useAccessToken();
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleExpired = () => {
		// 先尝试 refresh 延长会话；成功则不跳 error 页（静默延续），失败才触发过期跳转。
		// onFailure='clear'：失败只清理会话（不导航）—— 导航收敛到下方唯一出口，
		// 消除此前 onExpired 的 SPA 导航与整页跳转的双跳竞争（F-W8b 修复②）。
		AuthService.refreshToken({ onFailure: 'clear' }).then((newToken) => {
			if (newToken) {
				// refresh 成功：会话延续，不打断用户
				return;
			}
			if (onExpired) {
				// 消费方（如 SessionExpiryBanner → error 页）负责唯一导航出口
				onExpired();
				return;
			}
			if (typeof window !== 'undefined') {
				window.location.href = buildLoginUrl(window.location.href);
			}
		});
	};

	useEffect(() => {
		const token = tokenFromStore || AuthService.getAccessToken();
		if (!token) return;

		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			const exp = payload.exp * 1000;
			const now = Date.now();
			const timeLeft = exp - now;

			if (timeLeft <= 0) {
				// 过期时先尝试 refresh，失败再跳登录页
				handleExpired();
				return;
			}

			const WARNING_BEFORE = 5 * 60 * 1000;
			if (timeLeft > WARNING_BEFORE) {
				warningRef.current = setTimeout(() => {
					// 到预警点先静默续期（零副作用，会话此刻仍有效）：
					// 成功零打扰——token 更新触发本 effect 重调度到新到期时间；
					// 失败才回调 onWarning（提示用户处理），真正过期由下方 handleExpired 统一处置
					AuthService.refreshToken({ onFailure: 'none' }).then((newToken) => {
						if (!newToken) onWarning?.(5);
					});
				}, timeLeft - WARNING_BEFORE);
			}

			timerRef.current = setTimeout(() => {
				// 过期时先尝试 refresh，失败再跳登录页
				handleExpired();
			}, timeLeft);
		} catch {
			// 时间计算失败时保持默认超时行为
		}

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
			if (warningRef.current) clearTimeout(warningRef.current);
		};
	}, [tokenFromStore]);
}
