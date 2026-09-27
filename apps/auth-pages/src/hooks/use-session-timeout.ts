'use client';
import { useEffect, useRef } from 'react';
import { useAccessToken, AuthService, buildLoginUrl } from '@autional-cn/shared';

export function useSessionTimeout(
	onWarning?: (minutesLeft: number) => void,
	onExpired?: () => void,
) {
	const tokenFromStore = useAccessToken();
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleExpired = () => {
		// 先尝试 refresh 延长会话；成功则不跳 error 页（静默延续），失败才触发过期跳转
		AuthService.refreshToken().then((newToken) => {
			if (newToken) {
				// refresh 成功：会话延续，不打断用户
				return;
			}
			onExpired?.();
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
					onWarning?.(5);
					AuthService.refreshToken();
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
