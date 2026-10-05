'use client';

import React from 'react';
import { Button } from '@autional-cn/ui';

interface SuccessStateProps {
	/** 成功标题 */
	title: string;
	/** 成功描述 */
	description?: string;
	/** 操作按钮 */
	action?: {
		label: string;
		onClick: () => void;
	};
}

/**
 * 成功状态展示组件
 * 绿色勾选 + 文案 + 操作按钮，用于验证成功、操作完成等场景
 */
export function SuccessState({ title, description, action }: SuccessStateProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
			{/* 绿色勾选图标 */}
			<div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-[var(--color-success)]"
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
					<polyline points="22 4 12 14.01 9 11.01" />
				</svg>
			</div>

			<div className="space-y-1">
				<h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
				{description && <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>}
			</div>

			{action && (
				<Button onClick={action.onClick} variant="outline">
					{action.label}
				</Button>
			)}
		</div>
	);
}
