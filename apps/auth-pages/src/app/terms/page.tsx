'use client';

import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { compliancePublicLegalDocuments } from '@autional-cn/shared/generated/api';
import type { PublicLegalDocument } from '@autional-cn/shared/generated/types';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useI18n } from '@/lib/i18n';
import { usePageTitle } from '@/hooks/use-page-title';

const SECTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

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

/** 解析服务端 content JSON → sections；失败/非数组/无有效节 → null（触发 i18n fallback，不白屏） */
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

/** 取 YYYY-MM-DD 日期前缀（不做 Date 转换，避免时区偏移导致日期跳变 — AC-011 视觉不变） */
function formatLegalDate(dateStr: string): string {
	const match = /^\d{4}-\d{2}-\d{2}/.exec(dateStr);
	return match ? match[0] : dateStr;
}

export default function TermsPage() {
	const { t, lang } = useI18n();
	usePageTitle('terms.title');

	const { tenantSlug: slugParam } = useParams();
	const tenantSlug = slugParam || null;

	// API 优先读取服务端条款（AC-009）；失败 → 返回 null 触发 i18n fallback，不抛错不白屏
	const { data } = useQuery({
		queryKey: ['public-legal-document', 'terms', lang],
		queryFn: async (): Promise<PublicLegalDocument | null> => {
			try {
				return await compliancePublicLegalDocuments({ doc_type: 'terms', lang });
			} catch {
				return null;
			}
		},
		staleTime: 5 * 60 * 1000,
	});

	// API 命中且有有效 sections → 渲染服务端内容；否则回退 i18n SECTIONS 1-9（fallback 存活）
	const serverSections = useMemo(() => parseLegalDocumentSections(data?.content), [data]);

	// lastUpdated（AC-011）: API 命中 → 取 effective_at（缺省 updated_at）替换 i18n 模板中的日期；
	// API 失败/无数据 → 保留 i18n 原文（日期不跳变）
	const i18nLastUpdated = t('terms.lastUpdated');
	const effectiveAt = data?.effectiveAt || data?.updatedAt;
	const lastUpdated =
		serverSections && effectiveAt
			? i18nLastUpdated.replace(/\d{4}-\d{2}-\d{2}/, formatLegalDate(effectiveAt))
			: i18nLastUpdated;

	return (
		<AuthCard>
			<AuthHeader title={t('terms.title')} subtitle={lastUpdated} />

			<div className="space-y-6">
				{serverSections ? (
					serverSections.map((section, index) => (
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
					))
				) : (
					SECTIONS.map((num) => (
						<section key={num}>
							<h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
								{t(`terms.sections.${num}.title`)}
							</h2>
							<p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
								{t(`terms.sections.${num}.body`)}
							</p>
						</section>
					))
				)}
			</div>

			<div className="pt-4 text-center text-sm">
				<Link to={tenantSlug ? `/${tenantSlug}/login` : '/'} className="text-[var(--color-brand)] hover:underline">
					{t('terms.backToSignIn')}
				</Link>
			</div>
		</AuthCard>
	);
}
