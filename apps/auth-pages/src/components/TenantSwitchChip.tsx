'use client';

import { useSearchParams } from 'react-router';
import { ArrowLeftRight } from 'lucide-react';
import { getPortalUrl, isValidRedirect } from '@autional-cn/shared';
import { useI18n } from '@/lib/i18n';
import { useEffectiveTenantSlugFromPath } from '@/hooks/use-tenant-slug';
import { useTenantBrandingStore } from '@autional-cn/shared/branding';

/**
 * 顶部 chrome 的「切换组织」出口（与主题/语言同排），仅在租户段页面渲染。
 * 点击整页交棒 brand 站重新选品牌 —— 与 EntryRouter 第 3 分支同一出口。
 *
 * 回程只保留 origin：换品牌后租户已变，原路径的 slug 段不再适用，
 * 交回门户裸根由 brand 的 withSlug 注入新 slug。
 */
export function TenantSwitchChip({ className }: { className?: string }) {
	const { t } = useI18n();
	const [searchParams] = useSearchParams();
	const companyName = useTenantBrandingStore((s) => s.branding?.companyName);

	// AUTH-48/49：脏 slug（名单外）解析为 undefined → 不渲染切换出口
	const slug = useEffectiveTenantSlugFromPath();
	const brand = getPortalUrl('brand');
	if (!slug || !brand) return null;

	const raw = searchParams.get('redirect');
	let portalRoot: string | undefined;
	if (raw && isValidRedirect(raw)) {
		try {
			portalRoot = new URL(raw).origin + '/';
		} catch {
			portalRoot = undefined;
		}
	}
	const href = portalRoot ? `${brand}/?redirect=${encodeURIComponent(portalRoot)}` : `${brand}/`;
	const label = t('tenant.switchOrganization') || '切换组织';

	return (
		<a
			href={href}
			aria-label={label}
			title={label}
			className={`${className ?? ''} flex max-w-40 items-center gap-1 text-xs`}
		>
			<ArrowLeftRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
			<span className="truncate">{companyName || slug}</span>
		</a>
	);
}

export default TenantSwitchChip;
