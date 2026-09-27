'use client';

import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useI18n } from '@/lib/i18n';
import { usePageTitle } from '@/hooks/use-page-title';
import { compliancePublicLegalDocuments } from '@autional-cn/shared/generated/api';

interface Section {
	title: string;
	body: string[];
}

export default function PrivacyPage() {
	const { t, lang } = useI18n();

	usePageTitle('privacy.title');

	const { tenantSlug: slugParam } = useParams();
	const tenantSlug = slugParam || null;

	const sections: Section[] = [
		{
			title: t('privacy.sections.section1.title'),
			body: t('privacy.sections.section1.body', { returnObjects: true }) as unknown as string[],
		},
		{
			title: t('privacy.sections.section2.title'),
			body: t('privacy.sections.section2.body', { returnObjects: true }) as unknown as string[],
		},
		{
			title: t('privacy.sections.section3.title'),
			body: t('privacy.sections.section3.body', { returnObjects: true }) as unknown as string[],
		},
		{
			title: t('privacy.sections.section4.title'),
			body: t('privacy.sections.section4.body', { returnObjects: true }) as unknown as string[],
		},
		{
			title: t('privacy.sections.section5.title'),
			body: t('privacy.sections.section5.body', { returnObjects: true }) as unknown as string[],
		},
		{
			title: t('privacy.sections.section6.title'),
			body: t('privacy.sections.section6.body', { returnObjects: true }) as unknown as string[],
		},
		{
			title: t('privacy.sections.section7.title'),
			body: t('privacy.sections.section7.body', { returnObjects: true }) as unknown as string[],
		},
		{
			title: t('privacy.sections.section8.title'),
			body: t('privacy.sections.section8.body', { returnObjects: true }) as unknown as string[],
		},
		{
			title: t('privacy.sections.section9.title'),
			body: t('privacy.sections.section9.body', { returnObjects: true }) as unknown as string[],
		},
		{
			title: t('privacy.sections.section10.title'),
			body: t('privacy.sections.section10.body', { returnObjects: true }) as unknown as string[],
		},
	];

	// AC-010 API 优先：doc_type='privacy'，lang=当前 locale；失败回落 i18n fallback（不抛错不白屏）
	const { data: doc } = useQuery({
		queryKey: ['public-legal-document', 'privacy', lang],
		queryFn: async () => {
			try {
				return await compliancePublicLegalDocuments({ doc_type: 'privacy', lang });
			} catch {
				return undefined; // fallback
			}
		},
		staleTime: 5 * 60 * 1000,
	});

	// content 为 JSON string → [{title, body}]（D-03: body string | string[] 双形态，Array.isArray 守卫）
	const serverSections = useMemo<Section[] | undefined>(() => {
		if (!doc?.content) return undefined;
		try {
			const parsed: unknown = JSON.parse(doc.content);
			return Array.isArray(parsed) ? (parsed as Section[]) : undefined;
		} catch {
			return undefined; // 非法 JSON → fallback
		}
	}, [doc]);

	// AC-011 lastUpdated：API 命中取 effectiveAt（缺省 updatedAt）格式化；失败保留 i18n 原文
	const lastUpdatedLabel = useMemo(() => {
		const dateStr = doc?.effectiveAt ?? doc?.updatedAt;
		if (!dateStr) return t('privacy.lastUpdated');
		const formatted = dateStr.slice(0, 10); // YYYY-MM-DD，与 i18n 日期格式一致
		// 保留 i18n 文案模板，仅替换日期（locale 键含硬编码日期，此处动态覆盖）
		return t('privacy.lastUpdated').replace(/\d{4}-\d{2}-\d{2}/, formatted);
	}, [doc, t]);

	return (
		<AuthCard>
			<AuthHeader title={t('privacy.title')} subtitle={lastUpdatedLabel} />

			<div className="space-y-6">
				{serverSections && serverSections.length > 0 ? (
					serverSections.map((section, i) => (
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
					))
				) : (
					sections.map((section, i) => (
						<section key={i} className="space-y-2">
							<h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
								{section.title}
							</h2>
							{section.body.map((paragraph, j) => (
								<p key={j} className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
									{paragraph}
								</p>
							))}
						</section>
					))
				)}
			</div>

			<div className="pt-4 text-center text-sm">
				<Link to={tenantSlug ? `/${tenantSlug}/login` : '/'} className="text-[var(--color-brand)] hover:underline">
					{t('privacy.backToLogin')}
				</Link>
			</div>
		</AuthCard>
	);
}
