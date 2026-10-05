'use client';

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button, Input, Label } from '@autional-cn/ui';
import { extractApiError } from '@autional-cn/shared';
import { initiateSSO } from '@/lib/api.generated';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useTenantAuthConfigBySlug } from '@/hooks/use-tenant-auth-config';
import { useEffectiveTenantSlug } from '@/hooks/use-tenant-slug';

const PRESET_PROVIDERS = [
	{ key: 'okta', name: 'Okta', icon: '🔵' },
	{ key: 'azuread', name: 'Azure AD', icon: '🔷' },
	{ key: 'onelogin', name: 'OneLogin', icon: '🟢' },
	{ key: 'google_workspace', name: 'Google Workspace', icon: '🔴' },
];

const PROVIDER_ICONS: Record<string, string> = {
	okta: '🔵',
	azuread: '🔷',
	onelogin: '🟢',
	google_workspace: '🔴',
};

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

export default function SSOInitiatePage() {
	return (
		<QueryClientProvider client={queryClient}>
			<SSOInitiateContent />
		</QueryClientProvider>
	);
}

function SSOInitiateContent() {
	const { t } = useI18n();
	const navigate = useNavigate();
	// AUTH-50①：生效租户 slug（param 名单校验 + 会话回落），裸链/深链均不再空上下文
	const tenantSlug = useEffectiveTenantSlug() || null;
	const { data: authConfig } = useTenantAuthConfigBySlug(tenantSlug || null);
	const [domain, setDomain] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const providers = useMemo(() => {
		if (authConfig?.ssoProviders && authConfig.ssoProviders.length > 0) {
			return authConfig.ssoProviders.map((p) => ({
				key: p.id,
				name: p.name,
				icon: PROVIDER_ICONS[p.id] || '🔗',
			}));
		}
		return PRESET_PROVIDERS;
	}, [authConfig?.ssoProviders]);

	// AUTH-50③：错误体 i18n_key → 本地化；未知键回落归一化消息，不直出英文/框架文本
	const startSSO = async (provider: string) => {
		setLoading(true);
		setError('');
		try {
			// AUTH-50②：拦截器已 unwrap 信封并 camelCase——payload 直给（res.authUrl）
			const res = await initiateSSO({ provider });
			const redirectUrl = res?.authUrl;
			if (redirectUrl) {
				window.location.href = redirectUrl;
			} else {
				setError(t('sso.noRedirectUrl'));
			}
		} catch (err: any) {
			const e = extractApiError(err, t('sso.initiateFailed'));
			setError(e.i18nKey ? t(e.i18nKey, e.message) : e.message);
		} finally {
			setLoading(false);
		}
	};

	const handleProviderClick = (provider: string) => {
		void startSSO(provider);
	};

	const handleDomainSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const provider = domain.trim();
		if (!provider) return;
		void startSSO(provider);
	};

	return (
		<AuthCard>
			<AuthHeader title={t('sso.title')} subtitle={t('sso.subtitle')} />

			{error && (
				<div className="rounded-md bg-danger/10 p-3 text-sm text-danger">
					{error}
				</div>
			)}

			<div className="grid grid-cols-2 gap-3">
				{providers.map((p) => (
					<button
						key={p.key}
						type="button"
						onClick={() => handleProviderClick(p.key)}
						disabled={loading}
						className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] p-4 transition-colors hover:bg-[var(--color-bg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] disabled:opacity-50"
					>
						<span className="text-2xl">{p.icon}</span>
						<span className="text-xs font-medium">{p.name}</span>
					</button>
				))}
			</div>

			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t border-[var(--color-border-subtle)]" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-[var(--color-bg-surface)] px-2 text-[var(--color-text-muted)]">
						{t('sso.or')}
					</span>
				</div>
			</div>

			<form onSubmit={handleDomainSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="domain">{t('sso.domain')}</Label>
					<Input
						id="domain"
						placeholder={t('sso.domainPlaceholder')}
						value={domain}
						onChange={(e) => setDomain(e.target.value)}
						disabled={loading}
					/>
				</div>
				<Button type="submit" fullWidth isLoading={loading}>
					{t('sso.continue')}
				</Button>
			</form>

			<div className="text-center text-sm">
				<button
					type="button"
					onClick={() => navigate('/')}
					className="text-[var(--color-brand)] hover:underline"
				>
					{t('sso.back')}
				</button>
			</div>
		</AuthCard>
	);
}
