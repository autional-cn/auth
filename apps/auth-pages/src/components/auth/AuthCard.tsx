'use client';

import React from 'react';
import { AuthHeader } from './AuthHeader';
import { Link, useParams } from 'react-router';
import { useI18n } from '@/lib/i18n';

interface AuthCardProps {
	/** 卡片内容 */
	children: React.ReactNode;
	/** 页面标题（可选，传入则自动渲染 AuthHeader） */
	title?: string;
	/** 副标题（可选） */
	subtitle?: string;
	/** Logo 图片 URL（可选） */
	logoUrl?: string;
	/** 隐藏底部法律链接（注册页等已有 checkbox 的页面） */
	hideFooter?: boolean;
	/** 最大宽度（默认 sm=24rem；dashboard 等用 md=28rem） */
	maxWidth?: 'sm' | 'md' | 'lg';
}

const MAX_WIDTH_CLASSES: Record<string, string> = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
};

/**
 * 统一认证卡片容器
 * 居中布局、统一阴影/圆角/宽度、顶部可选 Logo
 * 底部自动渲染租户品牌隐私政策/服务条款链接
 */
export function AuthCard({
	children,
	title,
	subtitle,
	logoUrl,
	hideFooter,
	maxWidth = 'sm',
}: AuthCardProps) {
	const { t } = useI18n();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const showFooter = !hideFooter;

	return (
		<div className="flex min-h-screen items-center justify-center px-4 py-8">
			<div
				className={`w-full ${MAX_WIDTH_CLASSES[maxWidth]} space-y-6 rounded-2xl bg-[var(--color-bg-surface)] p-8 shadow-lg`}
			>
				{(title || logoUrl) && (
					<AuthHeader title={title || ''} subtitle={subtitle} logoUrl={logoUrl} />
				)}
				{children}
				{showFooter && (
					<div className="flex justify-center gap-4 pt-4 text-xs text-muted-foreground">
						<Link to={tenantSlug ? `/${tenantSlug}/privacy` : '/privacy'} className="hover:underline">
							{t('auth.privacyPolicy')}
						</Link>
						<Link to={tenantSlug ? `/${tenantSlug}/terms` : '/terms'} className="hover:underline">
							{t('auth.termsOfService')}
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
