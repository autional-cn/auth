'use client';

import React from 'react';
import { Button, type ButtonProps } from '@autional-cn/ui';

interface CountdownButtonProps extends Omit<ButtonProps, 'onClick'> {
	/** 冷却时长（秒），默认 60 */
	duration?: number;
	/** 当前剩余秒数（由 useCountdown 提供） */
	seconds: number;
	/** 点击回调 */
	onClick?: () => void;
	/** 按钮文案 */
	children: React.ReactNode;
	/** 冷却中的文案模板，{s} 会被替换为剩余秒数 */
	cooldownText?: (seconds: number) => React.ReactNode;
}

/**
 * 带冷却倒计时的按钮
 * 配合 useCountdown Hook 使用，用于"获取验证码"等场景
 */
export function CountdownButton({
	duration = 60,
	seconds,
	onClick,
	children,
	cooldownText,
	disabled,
	...rest
}: CountdownButtonProps) {
	const isCooldown = seconds > 0;

	const defaultCooldownText = (s: number) => `重新发送（${s}秒）`;
	const renderCooldown = cooldownText || defaultCooldownText;

	return (
		<Button type="button" onClick={onClick} disabled={isCooldown || disabled} {...rest}>
			{isCooldown ? renderCooldown(seconds) : children}
		</Button>
	);
}
