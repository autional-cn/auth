'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@autional-cn/ui';
import { getAccessToken, loginWithTokens, apiClient, extractItem } from '@autional-cn/shared';
import { getOAuthClient } from '@/lib/api.generated';
import { PublicAuthConfigByAuthConfig } from '@autional-cn/shared/generated/api';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';

function scopeToI18nKey(scope: string): string {
	const camel = scope.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
	return `auth.oauth.scope${camel.charAt(0).toUpperCase() + camel.slice(1)}`;
}

function OAuthAuthorizeContent() {
	const { t } = useI18n();
	const [searchParams] = useSearchParams();
	const clientId = searchParams.get('client_id') || '';
	const redirectUri = searchParams.get('redirect_uri') || '';
	const scope = searchParams.get('scope') || '';
	const state = searchParams.get('state') || '';
	const codeChallenge = searchParams.get('code_challenge') || '';
	const codeChallengeMethod = searchParams.get('code_challenge_method') || 'S256';

	const [clientName, setClientName] = useState('');
	const [clientLogo, setClientLogo] = useState('');
	const [tenantBranding, setTenantBranding] = useState<{ name: string; logo: string } | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [userId, setUserId] = useState('');
	const [tenantId, setTenantId] = useState('');
	const formRef = useRef<HTMLFormElement>(null);
	useEffect(() => {
		const token = getAccessToken();
		if (!token) {
			const bt = localStorage.getItem('__oauth_bridge_token');
			if (bt) {
				localStorage.removeItem('__oauth_bridge_token');
				try {
					const payload = JSON.parse(atob(bt.split('.')[1]));
					const user = {
						id: (payload.sub || payload.user_id) as string,
						username: ((payload as any).custom?.username || (payload as any).username) as string,
						email: (payload.email as string) || '',
						status: 'active',
					} as any;
					loginWithTokens(bt, null, user);
					try {
						const p2 = JSON.parse(atob(bt.split('.')[1]));
						setUserId(p2.user_id || p2.sub || '');
						setTenantId(p2.tenant_id || (p2 as any).tenantId || '');
					} catch {
						/* ignore */
					}
					return;
				} catch {
					/* invalid bridge token */
				}
			}
			const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
			window.location.href = `/?redirect=${returnUrl}`;
			return;
		}
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			setUserId(payload.user_id || payload.sub || '');
			setTenantId(payload.tenant_id || (payload as any).tenantId || '');
		} catch {
			/* ignore */
		}
	}, []);

	useEffect(() => {
		if (!clientId) return;
		getOAuthClient(clientId)
			.then((res: any) => {
				// getOAuthClient 返回 res.data（api.generated 已 unwrap + apiClient camelCase 转换），
				// 但部分调用方可能直接传 axios response → 兼容两种形状
				const d = res?.data ?? res;
				// apiClient interceptor 将后端 client_name (snake_case) 转成 clientName (camelCase)
				setClientName(d?.clientName || d?.client_name || t('oauth.authorize.unknownApp'));
				setClientLogo(d?.logoUri || d?.logo_uri || '');
				const tenantID = d?.tenantId || d?.tenant_id;
				if (tenantID) {
					PublicAuthConfigByAuthConfig(tenantID)
						.then((configRes: any) => {
							const dd = configRes?.data ?? configRes;
							setTenantBranding({
								name: dd?.displayName || dd?.tenantName || dd?.display_name || dd?.tenant_name || '',
								logo: dd?.branding?.logoUrl || dd?.branding?.logo_url || '',
							});
						})
						.catch(() => {});
				}
			})
			.catch(() => {
				setClientName(t('oauth.authorize.unknownApp'));
			});
	}, [clientId]);

	useEffect(() => {
		if (!clientId || !userId) return;
		const token = getAccessToken();
		if (!token) return;
		apiClient
			.get(`/oauth/api/v1/oauth/consent/check?client_id=${encodeURIComponent(clientId)}`) // @generated-api-exempt (new endpoint, co-committed with handler)
			.then((res: any) => {
				// interceptor 后 res.data 为 camelCase；兼容嵌套与 snake_case
				const d = extractItem<{ hasConsent?: boolean; has_consent?: boolean }>(res?.data);
				if (d?.hasConsent || d?.has_consent) {
					setLoading(true);
					formRef.current?.submit();
				}
			})
			.catch(() => {
				/* proceed to manual consent */
			});
	}, [clientId, userId]);

	const scopes = scope.split(' ').filter(Boolean);

	const handleDeny = () => {
		if (!redirectUri) {
			setError(t('auth.oauth.missingRedirect'));
			return;
		}
		const url = new URL(redirectUri);
		url.searchParams.set('error', 'access_denied');
		if (state) url.searchParams.set('state', state);
		window.location.href = url.toString();
	};

	return (
		<AuthCard>
			<div className="text-center">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-muted)] text-2xl">
					{clientLogo ? (
						<img
							src={clientLogo}
							alt={clientName}
							className="h-10 w-10 rounded-full object-cover"
						/>
					) : (
						'\uD83D\uDD10'
					)}
				</div>
				<AuthHeader
					title={t('auth.oauth.authorizeTitle')}
					subtitle={t('auth.oauth.requestAccess', { clientName })}
				/>
				{tenantBranding && (
					<div className="mt-3 flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
						{tenantBranding.logo ? (
							<img
								src={tenantBranding.logo}
								alt={tenantBranding.name}
								className="h-5 w-5 rounded-full object-cover"
							/>
						) : (
							<span className="text-lg">{'\uD83C\uDFE2'}</span>
						)}
						<span>{t('auth.oauth.underTenant', { tenant: tenantBranding.name })}</span>
					</div>
				)}
			</div>

			{error && (
				<div className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm text-danger">
					{error}
				</div>
			)}

			<div className="rounded-lg border border-[var(--color-border-subtle)] p-4">
				<p className="mb-3 text-sm font-medium text-[var(--color-text-primary)]">
					{t('auth.oauth.requestedPermissions')}
				</p>
				<ul className="space-y-2">
					{scopes.length === 0 && (
						<li className="text-sm text-[var(--color-text-secondary)]">
							{t('auth.oauth.basicPermission')}
						</li>
					)}
					{scopes.map((s) => (
						<li
							key={s}
							className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]"
						>
							<span className="text-[var(--color-success)]">&#x2713;</span>
							{t(scopeToI18nKey(s))}
						</li>
					))}
				</ul>
			</div>

			<form
				ref={formRef}
				method="POST"
				action="/bff/oauth/api/v1/oauth/authorize"
				onSubmit={() => setLoading(true)}
			>
				<input type="hidden" name="client_id" value={clientId} />
				<input type="hidden" name="user_id" value={userId} />
				<input type="hidden" name="tenant_id" value={tenantId} />
				<input type="hidden" name="redirect_uri" value={redirectUri} />
				<input type="hidden" name="scope" value={scope} />
				<input type="hidden" name="state" value={state} />
				<input type="hidden" name="approved" value="true" />
				<input type="hidden" name="response_type" value="code" />
				<input type="hidden" name="code_challenge" value={codeChallenge} />
				<input type="hidden" name="code_challenge_method" value={codeChallengeMethod} />

				<div className="space-y-3">
					<Button type="submit" fullWidth isLoading={loading}>
						{t('auth.oauth.approve')}
					</Button>
					<Button type="button" variant="outline" fullWidth onClick={handleDeny} disabled={loading}>
						{t('auth.oauth.deny')}
					</Button>
				</div>
			</form>

			<p className="text-center text-xs text-[var(--color-text-muted)]">
				{t('auth.oauth.agreeNotice')}
			</p>
		</AuthCard>
	);
}

export default function OAuthAuthorizePage() {
	const { t } = useI18n();
	return (
		<Suspense
			fallback={
				<AuthCard>
					<AuthHeader title={t('auth.oauth.authorizeTitle')} subtitle={t('common.loading')} />
				</AuthCard>
			}
		>
			<OAuthAuthorizeContent />
		</Suspense>
	);
}
