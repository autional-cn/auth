'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseCountdownOptions {
	/** 倒计时总时长（秒），默认 60 */
	duration?: number;
	/** 倒计时归零时的回调 */
	onExpire?: () => void;
}

interface UseCountdownReturn {
	/** 当前剩余秒数 */
	seconds: number;
	/** 是否处于倒计时中 */
	isActive: boolean;
	/** 启动倒计时 */
	start: () => void;
	/** 重置倒计时 */
	reset: () => void;
}

/**
 * 通用倒计时 Hook
 * 用于验证码冷却、操作倒计时等场景
 */
export function useCountdown(options: UseCountdownOptions = {}): UseCountdownReturn {
	const { duration = 60, onExpire } = options;
	const [seconds, setSeconds] = useState(0);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const clearTimer = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	const start = useCallback(() => {
		clearTimer();
		setSeconds(duration);
		timerRef.current = setInterval(() => {
			setSeconds((prev) => {
				if (prev <= 1) {
					clearTimer();
					onExpire?.();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}, [duration, clearTimer, onExpire]);

	const reset = useCallback(() => {
		clearTimer();
		setSeconds(0);
	}, [clearTimer]);

	useEffect(() => {
		return () => clearTimer();
	}, [clearTimer]);

	return {
		seconds,
		isActive: seconds > 0,
		start,
		reset,
	};
}
