'use client';
import { useEffect, useRef } from 'react';
import { useAccessToken, AuthService, buildLoginUrl, decodeJwtPayload } from '@autional-cn/shared';

/**
 * onWarning：预警点（到期前 60 秒）**静默续期失败**时回调——会话此刻仍有效，
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
			// shared decodeJwtPayload（base64url 归一化 + 填充）：裸 atob 对含 -/_ 的
			// 载荷抛 InvalidCharacterError → 曾整链落 catch（不调度任何定时器）。
			const payload = decodeJwtPayload(token);
			if (!payload) return;
			const exp = (payload.exp as number) * 1000;
			const now = Date.now();
			const timeLeft = exp - now;

			if (timeLeft <= 0) {
				// 过期时先尝试 refresh，失败再跳登录页
				handleExpired();
				return;
			}

			// 预警点必须显著小于 AT 寿命（线上 5 分钟）：旧值同为 5 分钟时，
			// 续期后的新 token 剩余寿命≈预警点，毫秒级时钟差使预警定时器立即再次触发——
			// 每次续期双倍刷新 + RT 双倍轮换（2026-10-03 线上实证）；60 秒 = 到期前静默续期 + 留 60 秒预警带
			const WARNING_BEFORE = 60 * 1000;
			if (timeLeft > WARNING_BEFORE) {
				warningRef.current = setTimeout(() => {
					// 到预警点先静默续期（零副作用，会话此刻仍有效）：
					// 成功零打扰——token 更新触发本 effect 重调度到新到期时间；
					// 失败才回调 onWarning（提示用户处理），真正过期由下方 handleExpired 统一处置
					AuthService.refreshToken({ onFailure: 'none' }).then((newToken) => {
						if (!newToken) onWarning?.(1);
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
