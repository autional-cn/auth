'use client';

import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Input, Label } from '@autional/ui';
import { apiClient } from '@autional/shared';
import { PublicAuthConfigByAuthConfig } from '@autional/shared/generated/api';
import { useI18n } from '@/lib/i18n';
import { ChevronDown } from 'lucide-react';
import type { TenantOption } from '@/hooks/use-public-tenants';

export type { TenantOption } from '@/hooks/use-public-tenants';

export interface TenantSelectorProps {
	value: string;
	tenants: TenantOption[];
	loading: boolean;
	onChange: (tenantId: string) => void;
	onAuthConfigLoaded?: (config: any) => void;
	variant?: 'login' | 'register';
}

/**
 * 租户选择器组件
 *
 * - 单租户：只读展示卡片
 * - 多租户：select 下拉
 * - 零租户：手动输入 ID
 * - 切换时自动获取 auth-config 并更新 URL 至 /auth/{slug}/{variant}
 */
export function TenantSelector({
	value,
	tenants,
	loading,
	onChange,
	onAuthConfigLoaded,
	variant = 'login',
}: TenantSelectorProps) {
	const { t } = useI18n();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [localLoading, setLocalLoading] = useState(false);
	const [manualId, setManualId] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleChange = useCallback(
		async (tenantId: string, slug?: string) => {
			onChange(tenantId);
			setError(null);
			setLocalLoading(true);
			try {
				const config = await PublicAuthConfigByAuthConfig(tenantId);
				onAuthConfigLoaded?.(config);
				if (slug) {
					const redirect = searchParams.get('redirect');
					const to = redirect
						? `/${slug}/${variant}?redirect=${encodeURIComponent(redirect)}`
						: `/${slug}/${variant}`;
					navigate(to, { replace: true });
				}
			} catch (err: any) {
				// fallback: if auth-config fetch fails, still call back with null
				onAuthConfigLoaded?.(null);
				// allow manual ID input to proceed
				if (tenants.length === 0) {
					onChange(manualId || tenantId);
				}
			} finally {
				setLocalLoading(false);
			}
		},
		[onChange, onAuthConfigLoaded, navigate, variant, tenants.length, manualId],
	);

	// Loading skeleton
	if (loading || localLoading) {
		return (
			<div className="space-y-2">
				<Label htmlFor="tenantId">{t('login.tenant')}</Label>
				<div className="h-10 animate-pulse rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)]" />
			</div>
		);
	}

	// Zero tenants — manual input fallback
	if (tenants.length === 0) {
		return (
			<div className="space-y-2">
				<Label htmlFor="tenantId">{t('tenant.selectorLabel')}</Label>
				<Input
					id="tenantId"
					placeholder={t('tenant.noTenant')}
					value={manualId}
					onChange={(e) => {
						const id = e.target.value;
						setManualId(id);
						onChange(id);
					}}
				/>
				{error && <p className="text-xs text-danger-text">{error}</p>}
			</div>
		);
	}

	// Single tenant — display-only card
	if (tenants.length === 1) {
		return (
			<div className="space-y-2">
				<Label>{t('login.tenant')}</Label>
				<div className="flex h-10 items-center rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] px-3 text-sm text-[var(--color-text-primary)]">
					<span className="font-medium">{tenants[0].display_name || tenants[0].name}</span>
					<span className="ml-2 text-xs text-[var(--color-text-muted)]">({tenants[0].id})</span>
				</div>
			</div>
		);
	}

	// Multiple tenants — select dropdown
	return (
		<div className="space-y-2">
			<Label htmlFor="tenantId">{t('tenant.selectorLabel')}</Label>
			<div className="relative">
				<select
					id="tenantId"
					value={value}
					onChange={(e) => {
						const selected = tenants.find((t) => t.id === e.target.value);
						if (selected) {
							handleChange(selected.id, selected.slug || selected.name);
						}
					}}
					className="w-full h-10 appearance-none rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 pr-8 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
				>
					<option value="">{t('tenant.selectTenant')}</option>
					{tenants.map((t) => (
						<option key={t.id} value={t.id}>
							{t.display_name || t.name}
						</option>
					))}
				</select>
				<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
			</div>
			{error && <p className="text-xs text-danger-text">{error}</p>}
		</div>
	);
}
