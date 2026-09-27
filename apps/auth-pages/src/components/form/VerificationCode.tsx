'use client';

import React, { useRef, useState, useCallback } from 'react';

interface VerificationCodeProps {
	/** 验证码长度，默认 6 */
	length?: number;
	/** 输入完成回调 */
	onComplete?: (code: string) => void;
	/** 是否禁用 */
	disabled?: boolean;
}

/**
 * 验证码输入组件
 * 6 个独立输入框，自动聚焦跳转、支持粘贴
 * 用于手机验证、MFA 等场景
 */
export function VerificationCode({ length = 6, onComplete, disabled }: VerificationCodeProps) {
	const [values, setValues] = useState<string[]>(Array(length).fill(''));
	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

	const setItemRef = useCallback(
		(index: number) => (el: HTMLInputElement | null) => {
			inputsRef.current[index] = el;
		},
		[],
	);

	const focusInput = useCallback((index: number) => {
		const input = inputsRef.current[index];
		if (input) {
			input.focus();
			input.select();
		}
	}, []);

	const handleChange = useCallback(
		(index: number, rawValue: string) => {
			if (disabled) return;

			// 只取最后一位数字/字母
			const char = rawValue.slice(-1);
			if (!/^\d$/.test(char)) return;

			const newValues = [...values];
			newValues[index] = char;
			setValues(newValues);

			const code = newValues.join('');
			if (code.length === length) {
				onComplete?.(code);
			} else if (index < length - 1) {
				focusInput(index + 1);
			}
		},
		[disabled, values, length, onComplete, focusInput],
	);

	const handleKeyDown = useCallback(
		(index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
			if (disabled) return;

			if (e.key === 'Backspace') {
				e.preventDefault();
				const newValues = [...values];
				if (newValues[index]) {
					newValues[index] = '';
					setValues(newValues);
				} else if (index > 0) {
					newValues[index - 1] = '';
					setValues(newValues);
					focusInput(index - 1);
				}
			} else if (e.key === 'ArrowLeft' && index > 0) {
				e.preventDefault();
				focusInput(index - 1);
			} else if (e.key === 'ArrowRight' && index < length - 1) {
				e.preventDefault();
				focusInput(index + 1);
			}
		},
		[disabled, values, length, focusInput],
	);

	const handlePaste = useCallback(
		(e: React.ClipboardEvent<HTMLInputElement>) => {
			if (disabled) return;
			e.preventDefault();
			const raw = e.clipboardData.getData('text');
			const pasted = raw.replace(/[^0-9]/g, '').substring(0, length);
			if (!pasted) return;

			const newValues = Array(length).fill('');
			for (let i = 0; i < pasted.length; i++) {
				newValues[i] = pasted[i];
			}
			setValues(newValues);

			const code = newValues.join('');
			if (code.length === length) {
				onComplete?.(code);
			} else {
				focusInput(Math.min(pasted.length, length - 1));
			}
		},
		[disabled, length, onComplete, focusInput],
	);

	return (
		<div className="flex items-center justify-center gap-2">
			{values.map((val, idx) => (
				<input
					key={idx}
					id={`verification-code-${idx}`}
					name={`verification_code_${idx}`}
					ref={setItemRef(idx)}
					type="text"
					inputMode="numeric"
					maxLength={1}
					value={val}
					disabled={disabled}
					onChange={(e) => handleChange(idx, e.target.value)}
					onKeyDown={(e) => handleKeyDown(idx, e)}
					onPaste={handlePaste}
					className="h-12 w-12 rounded-lg border border-[var(--color-border)] text-center text-xl font-semibold text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[var(--color-bg-surface)]"
					aria-label={`验证码第 ${idx + 1} 位`}
				/>
			))}
		</div>
	);
}
