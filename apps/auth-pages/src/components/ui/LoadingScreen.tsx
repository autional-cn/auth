'use client';

import React from 'react';

interface LoadingScreenProps {
	/** 加载提示文案 */
	message?: string;
}

/**
 * 全屏 Loading 组件
 * 居中展示 spinner + 文案，用于页面初始化、回调处理等场景
 */
export function LoadingScreen({ message = '正在加载…' }: LoadingScreenProps) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4">
			<div className="flex flex-col items-center gap-4">
				{/* Spinner */}
				<div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-border-subtle)] border-t-[var(--color-brand)]" />
				<p className="text-sm text-[var(--color-text-secondary)]">{message}</p>
			</div>
		</div>
	);
}
