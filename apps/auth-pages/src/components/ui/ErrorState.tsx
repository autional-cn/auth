'use client';

import React from 'react';
import { Button } from '@autional-cn/ui';

interface ErrorStateProps {
	/** 错误标题 */
	title: string;
	/** 错误描述 */
	description?: string;
	/** 操作按钮 */
	action?: {
		label: string;
		onClick: () => void;
	};
}

/**
 * 错误状态展示组件
 * 插图占位 + 文案 + 操作按钮，用于页面错误、链接失效等场景
 */
export function ErrorState({ title, description, action }: ErrorStateProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
			{/* 插图占位 —— 使用简约的错误图标 */}
			<div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-danger)]/10">
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
					className="text-[var(--color-danger)]"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="15" x2="9" y1="9" y2="15" />
					<line x1="9" x2="15" y1="9" y2="15" />
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
