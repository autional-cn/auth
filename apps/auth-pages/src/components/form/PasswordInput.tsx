'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Input, type InputProps } from '@autional-cn/ui';
import { useI18n } from '@/lib/i18n';
import {
	calculateStrength,
	type StrengthResult,
	type PasswordPolicy,
} from '@/lib/password-strength';
import { isLocallyBreached } from '@/lib/local-blacklist';
import { checkHIBP } from '@/lib/check-hibp';

/** 判断字符串是否包含非ASCII字符（中文、emoji、特殊符号等） */
function hasNonAscii(s: string): boolean {
	return /[^\x20-\x7E]/.test(s);
}

type BreachStatus = 'idle' | 'local_breached' | 'checking_hibp' | 'hibp_breached' | 'safe';

interface BreachInfo {
	status: BreachStatus;
	count: number;
}

interface PasswordInputProps extends InputProps {
	/** 是否显示密码强度条 */
	showStrength?: boolean;
	/** Optional external strength result (overrides internal calculation) */
	strength?: StrengthResult;
	/** Password policy for strength calculation */
	policy?: PasswordPolicy;
	/** 是否启用泄露密码检查（本地黑名单 + HIBP） */
	showBreachCheck?: boolean;
}

function getStrengthBarColor(level: string): string {
	switch (level) {
		case 'weak':
			return 'bg-[var(--color-danger)]';
		case 'fair':
		case 'good':
			return 'bg-[var(--color-warning)]';
		case 'strong':
		case 'very-strong':
			return 'bg-[var(--color-success)]';
		default:
			return 'bg-[var(--color-bg-muted)]';
	}
}

function getStrengthTextColor(level: string): string {
	switch (level) {
		case 'weak':
			return 'text-danger-text';
		case 'fair':
		case 'good':
			return 'text-warning-text';
		case 'strong':
		case 'very-strong':
			return 'text-success-text';
		default:
			return 'text-[var(--color-text-secondary)]';
	}
}

function getStrengthWidth(score: number): string {
	return `${Math.min(Math.max(score * 20, 0), 100)}%`;
}

function getBreachMessage(
	t: (key: string, options?: Record<string, unknown>) => string,
	status: BreachStatus,
	count: number,
): string | null {
	switch (status) {
		case 'local_breached':
			return t('password.locallyBreached');
		case 'hibp_breached':
			return t('password.hibpBreached', { count: count.toLocaleString() });
		case 'checking_hibp':
			return t('password.checkingBreach');
		case 'safe':
			return t('password.notBreached');
		default:
			return null;
	}
}

function getBreachColor(status: BreachStatus): string {
	switch (status) {
		case 'local_breached':
		case 'hibp_breached':
			return 'text-danger-text';
		case 'checking_hibp':
			return 'text-[var(--color-text-muted)]';
		case 'safe':
			return 'text-success-text';
		default:
			return '';
	}
}

/**
 * 密码输入框组件
 * 带显示/隐藏切换，可选密码强度条（支持外部传入或策略感知），
 * 可选泄露密码检查（本地黑名单 O(1) + HIBP API）。
 * 继承自 @autional-cn/ui 的 Input，保持统一样式
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
	(
		{ showStrength, strength: externalStrength, policy, showBreachCheck, className = '', ...props },
		ref,
	) => {
		const { t } = useI18n();
		const [visible, setVisible] = useState(false);
		const [breachInfo, setBreachInfo] = useState<BreachInfo>({ status: 'idle', count: 0 });
		const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
		const value = (props.value as string) || '';

		const strength = useMemo<StrengthResult>(() => {
			if (externalStrength) return externalStrength;
			return calculateStrength(value, policy);
		}, [externalStrength, value, policy, t]);

		const runBreachCheck = useCallback(async (pwd: string) => {
			if (!pwd || pwd.length < 6) {
				setBreachInfo({ status: 'idle', count: 0 });
				return;
			}

			// 第一步：本地黑名单检查（O(1) Set 查询）
			if (isLocallyBreached(pwd)) {
				setBreachInfo({ status: 'local_breached', count: 0 });
				return;
			}

			// 第二步：HIBP API 检查
			setBreachInfo({ status: 'checking_hibp', count: 0 });
			try {
				const count = await checkHIBP(pwd);
				setBreachInfo({
					status: count > 0 ? 'hibp_breached' : 'safe',
					count,
				});
			} catch {
				setBreachInfo({ status: 'safe', count: 0 });
			}
		}, []);

		useEffect(() => {
			if (!showBreachCheck) {
				setBreachInfo({ status: 'idle', count: 0 });
				return;
			}

			// 防抖：密码停止输入 500ms 后再检查
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
			debounceRef.current = setTimeout(() => {
				runBreachCheck(value);
			}, 500);

			return () => {
				if (debounceRef.current) {
					clearTimeout(debounceRef.current);
				}
			};
		}, [value, showBreachCheck, runBreachCheck]);

		const breachMessage = showBreachCheck
			? getBreachMessage(t, breachInfo.status, breachInfo.count)
			: null;
		const showUnicodeHint = value.length > 0 && hasNonAscii(value);

		return (
			<div className="space-y-1">
				<div className="relative">
					<Input
						ref={ref}
						type={visible ? 'text' : 'password'}
						className={`pr-10 ${className}`}
						{...props}
					/>
					<button
						type="button"
						onClick={() => setVisible((v) => !v)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus:outline-none"
						tabIndex={-1}
						aria-label={visible ? t('password.hide') : t('password.show')}
					>
						{visible ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
								<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
								<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
								<line x1="2" x2="22" y1="2" y2="22" />
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
								<circle cx="12" cy="12" r="3" />
							</svg>
						)}
					</button>
				</div>
				{showStrength && value.length > 0 && (
					<div className="space-y-1 pt-1">
						<div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
							<div
								className={`transition-all duration-300 ${getStrengthBarColor(strength.level)}`}
								style={{ width: getStrengthWidth(strength.score) }}
							/>
						</div>
						<p className={`text-xs ${getStrengthTextColor(strength.level)}`}>
							{t('password.strengthLabel')}
							{strength.label}
						</p>
					</div>
				)}
				{breachMessage && (
					<p className={`text-xs ${getBreachColor(breachInfo.status)}`}>{breachMessage}</p>
				)}
				{showUnicodeHint && (
					<p className="text-xs text-[var(--color-text-secondary)]">{t('password.unicodeHint')}</p>
				)}
			</div>
		);
	},
);
PasswordInput.displayName = 'PasswordInput';
