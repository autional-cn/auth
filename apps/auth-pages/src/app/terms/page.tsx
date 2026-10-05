'use client';

import { useMemo } from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ErrorState } from '@autional-cn/ui';
import { compliancePublicLegalDocuments } from '@autional-cn/shared/generated/api';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useI18n } from '@/lib/i18n';
import { usePageTitle } from '@/hooks/use-page-title';
import { useResolvedTenantSlug } from '@/hooks/use-tenant-slug';

/** 服务端条款 content 中的一个 section（title + 字符串或段落数组 body） */
type LegalDocumentSection = { title: string; body: string | string[] };

/** 类型守卫：校验未知对象是否为合法 LegalDocumentSection（title=string，body=string|string[]） */
function isLegalDocumentSection(value: unknown): value is LegalDocumentSection {
	if (typeof value !== 'object' || value === null) return false;
	const section = value as { title?: unknown; body?: unknown };
	return (
		typeof section.title === 'string' &&
		(typeof section.body === 'string' || Array.isArray(section.body))
	);
}

/** 解析服务端 content JSON → sections；非法 JSON / 非数组 / 无有效节 → null（按不可用处理） */
function parseLegalDocumentSections(content: string | undefined): LegalDocumentSection[] | null {
	if (!content) return null;
	try {
		const parsed: unknown = JSON.parse(content);
		if (!Array.isArray(parsed)) return null;
		const sections = parsed.filter(isLegalDocumentSection);
		return sections.length > 0 ? sections : null;
	} catch {
		return null;
	}
}

/** 取 YYYY-MM-DD 日期前缀（不做 Date 转换，避免时区偏移导致日期跳变） */
function formatLegalDate(dateStr: string): string {
	const match = /^\d{4}-\d{2}-\d{2}/.exec(dateStr);
	return match ? match[0] : dateStr;
}

export default function TermsPage() {
	const { t, lang } = useI18n();
	usePageTitle('terms.title');

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
		queryKey: ['public-legal-document', 'terms', lang],
		queryFn: () => compliancePublicLegalDocuments({ doc_type: 'terms', lang }),
		staleTime: 5 * 60 * 1000,
		// 法律页宁可尽快给出错误态 + 重试，也不让用户对着转圈等默认的 3 次退避重试
		retry: 1,
	});

	const serverSections = useMemo(() => parseLegalDocumentSections(doc?.content), [doc]);

	// lastUpdated 取 effectiveAt（缺省 updatedAt）；取不到则不显示副标题
	const lastUpdatedLabel = useMemo(() => {
		const dateStr = doc?.effectiveAt ?? doc?.updatedAt;
		if (!dateStr) return undefined;
		return t('terms.lastUpdated', { date: formatLegalDate(dateStr) });
	}, [doc, t]);

	return (
		<AuthCard>
			<AuthHeader title={t('terms.title')} subtitle={lastUpdatedLabel} />

			{isLoading ? (
				<p className="py-8 text-center text-sm text-[var(--color-text-secondary)]">
					{t('common.loading')}
				</p>
			) : serverSections ? (
				<div className="space-y-6">
					{serverSections.map((section, index) => (
						<section key={index}>
							<h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
								{section.title}
							</h2>
							{typeof section.body === 'string' ? (
								<p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
									{section.body}
								</p>
							) : (
								<div className="mt-2 space-y-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
									{section.body.map((paragraph, i) => (
										<p key={i}>{paragraph}</p>
									))}
								</div>
							)}
						</section>
					))}
				</div>
			) : (
				<ErrorState
					title={t('terms.loadFailed')}
					description={t('common.loadFailedDesc')}
					action={{ label: t('common.retry'), onClick: () => void refetch() }}
				/>
			)}

			<div className="pt-4 text-center text-sm">
				<Link to={tenantSlug ? `/${tenantSlug}/login` : '/'} className="text-brand-text hover:underline">
					{t('terms.backToSignIn')}
				</Link>
			</div>
		</AuthCard>
	);
}
