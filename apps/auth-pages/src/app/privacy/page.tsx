'use client';

import { useMemo } from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ErrorState } from '@autional-cn/ui';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useI18n } from '@/lib/i18n';
import { usePageTitle } from '@/hooks/use-page-title';
import { useResolvedTenantSlug } from '@/hooks/use-tenant-slug';
import { compliancePublicLegalDocuments } from '@autional-cn/shared/generated/api';

/**
 * 服务端隐私政策的一节。
 * body 双形态：privacy 为 string[]，terms 为 string（D-03 归一化约定）。
 */
interface Section {
	title: string;
	body: string[] | string;
}

/** 取 YYYY-MM-DD 前缀（不做 Date 转换，避免时区偏移导致日期跳变） */
function formatLegalDate(dateStr: string): string {
	const match = /^\d{4}-\d{2}-\d{2}/.exec(dateStr);
	return match ? match[0] : dateStr;
}

export default function PrivacyPage() {
	const { t, lang } = useI18n();

	usePageTitle('privacy.title');

	// AUTH-48/49：返回链按「已解析租户」拼链 —— 脏 slug 解析为 undefined → 回落 '/'，
	// 不再把未知 slug 递归带进登录路由
	const tenantSlug = useResolvedTenantSlug();

	// 法律正文的唯一来源 = compliance 公共接口；本页不内置正文副本。
	// 接口不可用时显示错误态而非回落本地文案：用户读到的文本必须与其同意记录
	// 指向的版本一致，展示一份可能非权威的文本是合规风险。
	// 正文事实源 = shared/service-compliance/db/seeds/legal_documents.go
	const {
		data: doc,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['public-legal-document', 'privacy', lang],
		queryFn: () => compliancePublicLegalDocuments({ doc_type: 'privacy', lang }),
		staleTime: 5 * 60 * 1000,
		// 法律页宁可尽快给出错误态 + 重试，也不让用户对着转圈等默认的 3 次退避重试
		retry: 1,
	});

	// content 为 JSON string → [{title, body}]；非法 JSON / 非数组 → undefined（按不可用处理）
	const serverSections = useMemo<Section[] | undefined>(() => {
		if (!doc?.content) return undefined;
		try {
			const parsed: unknown = JSON.parse(doc.content);
			return Array.isArray(parsed) ? (parsed as Section[]) : undefined;
		} catch {
			return undefined;
		}
	}, [doc]);

	// lastUpdated 取 effectiveAt（缺省 updatedAt）；取不到则不显示副标题
	const lastUpdatedLabel = useMemo(() => {
		const dateStr = doc?.effectiveAt ?? doc?.updatedAt;
		if (!dateStr) return undefined;
		return t('privacy.lastUpdated', { date: formatLegalDate(dateStr) });
	}, [doc, t]);

	const hasContent = !!serverSections?.length;

	return (
		<AuthCard>
			<AuthHeader title={t('privacy.title')} subtitle={lastUpdatedLabel} />

			{isLoading ? (
				<p className="py-8 text-center text-sm text-[var(--color-text-secondary)]">
					{t('common.loading')}
				</p>
			) : hasContent ? (
				<div className="space-y-6">
					{serverSections.map((section, i) => (
						<section key={i} className="space-y-2">
							<h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
								{section.title}
							</h2>
							{Array.isArray(section.body) ? (
								// 数组形态：逐条渲染（privacy 10 节）
								<ul className="list-none space-y-2 pl-0">
									{section.body.map((item) => (
										<li
											key={item}
											className="text-sm leading-relaxed text-[var(--color-text-secondary)]"
										>
											{item}
										</li>
									))}
								</ul>
							) : (
								// 字符串形态：直接渲染（terms 兼容，未来 doc_type 扩展）
								<p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
									{section.body}
								</p>
							)}
						</section>
					))}
				</div>
			) : (
				<ErrorState
					title={t('privacy.loadFailed')}
					description={t('common.loadFailedDesc')}
					action={{ label: t('common.retry'), onClick: () => void refetch() }}
				/>
			)}

			<div className="pt-4 text-center text-sm">
				<Link to={tenantSlug ? `/${tenantSlug}/login` : '/'} className="text-brand-text hover:underline">
					{t('privacy.backToLogin')}
				</Link>
			</div>
		</AuthCard>
	);
}
