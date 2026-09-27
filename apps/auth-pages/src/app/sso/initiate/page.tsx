'use client';

import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button, Input, Label } from '@autional-cn/ui';
import { initiateSSO } from '@/lib/api.generated';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useTenantAuthConfigBySlug } from '@/hooks/use-tenant-auth-config';

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
	const { tenantSlug: slugParam } = useParams();
	const tenantSlug = slugParam || null;
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

	const handleProviderClick = async (provider: string) => {
		setLoading(true);
		setError('');
		try {
			const res = await initiateSSO({ provider });
			const redirectUrl = res.data?.authUrl || res.data?.auth_url;
			if (redirectUrl) {
				window.location.href = redirectUrl;
			} else {
				setError('未获取到 SSO 跳转地址');
			}
		} catch (err: any) {
			setError(err.response?.data?.message || 'SSO 发起失败，请稍后重试');
		} finally {
			setLoading(false);
		}
	};

	const handleDomainSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!domain.trim()) return;
		setLoading(true);
		setError('');
		try {
			const res = await initiateSSO({ provider: domain.trim() });
			const redirectUrl = res.data?.authUrl || res.data?.auth_url;
			if (redirectUrl) {
				window.location.href = redirectUrl;
			} else {
				setError('未获取到 SSO 跳转地址');
			}
		} catch (err: any) {
			setError(err.response?.data?.message || 'SSO 发起失败，请稍后重试');
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthCard>
			<AuthHeader title={t('sso.title')} subtitle={t('sso.subtitle')} />

			{error && (
				<div className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm text-danger">
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
						或
					</span>
				</div>
			</div>

			<form onSubmit={handleDomainSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="domain">{t('sso.domain')}</Label>
					<Input
						id="domain"
						placeholder="例如：company.com"
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
