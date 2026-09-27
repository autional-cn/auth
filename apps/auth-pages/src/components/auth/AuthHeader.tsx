'use client';

import React from 'react';

interface AuthHeaderProps {
	/** 页面标题 */
	title: string;
	/** 副标题（可选） */
	subtitle?: string;
	/** Logo 图片 URL（可选） */
	logoUrl?: string;
}

/**
 * 认证页面头部组件
 * 展示 Logo + 标题 + 副标题，用于登录/注册等认证流程页
 */
export function AuthHeader({ title, subtitle, logoUrl }: AuthHeaderProps) {
	return (
		<div className="text-center">
			{logoUrl && (
				<div className="mb-4 flex justify-center">
					<img src={logoUrl} alt="标志" className="h-12 w-auto object-contain" />
				</div>
			)}
			<h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
				{title}
			</h1>
			{subtitle && <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>}
		</div>
	);
}
