'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router';
import { Button } from '@autional-cn/ui';
import {
	loginWithTokens,
	extractApiError,
	usePublicTenantSlugs,
} from '@autional-cn/shared';
import { loadAuthExtras } from '@/lib/api';
import { anchorSessionFromToken } from '@/lib/anchor-session';
import { beginPasskeyLogin, completePasskeyLogin } from '@/lib/api.generated';
import RedirectCountdown from '@/components/ui/RedirectCountdown';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { userPortalUrl } from '@/lib/portal-links';
import { useEffectiveTenantSlug } from '@/hooks/use-tenant-slug';

function bufferToBase64url(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let str = '';
	for (let i = 0; i < bytes.length; i++) {
		str += String.fromCharCode(bytes[i]);
	}
	return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
	let b64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
	while (b64.length % 4) b64 += '=';
	const raw = atob(b64);
	const bytes = new Uint8Array(raw.length);
	for (let i = 0; i < raw.length; i++) {
		bytes[i] = raw.charCodeAt(i);
	}
	return bytes.buffer;
}

function prepareCredentialRequestOptions(
	options: Record<string, unknown>,
): PublicKeyCredentialRequestOptions {
	const result: Record<string, unknown> = { ...options };
	if (typeof result.challenge === 'string') {
		result.challenge = base64urlToBuffer(result.challenge as string).slice(0);
	}
	if (Array.isArray(result.allowCredentials)) {
		result.allowCredentials = (result.allowCredentials as Record<string, unknown>[]).map((c) => ({
			...c,
			id: typeof c.id === 'string' ? base64urlToBuffer(c.id as string).slice(0) : c.id,
		}));
	}
	return result as unknown as PublicKeyCredentialRequestOptions;
}

function isWebAuthnSupported(): boolean {
	if (typeof window === 'undefined') return false;
	return (
		window.PublicKeyCredential !== undefined && typeof window.PublicKeyCredential === 'function'
	);
}

function PasskeyContent() {
	const { t } = useI18n();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const mode = (searchParams.get('mode') as 'login' | 'register') || 'login';
	const { data: knownTenants } = usePublicTenantSlugs();
	// AUTH-41：跨门户深链（账户中心 /security）必须带生效租户 slug，裸链会 404
	const slug = useEffectiveTenantSlug();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const supported = isWebAuthnSupported();

	const handleLogin = async () => {
		if (!supported) {
			setError(t('passkey.browserUnsupported'));
			return;
		}
		setLoading(true);
		setError('');
		try {
			const optionsRes = await beginPasskeyLogin({} as any);
			const rawData = (optionsRes as any)?.data || optionsRes;
			const options = rawData.response || rawData;
			const assertion = (await navigator.credentials.get({
				publicKey: prepareCredentialRequestOptions(options),
			})) as PublicKeyCredential & { response: AuthenticatorAssertionResponse };
			if (!assertion) throw new Error(t('passkey.noCredentialReceived'));
			const loginRes = await completePasskeyLogin({
				id: assertion.id,
				rawId: bufferToBase64url(assertion.rawId),
				type: assertion.type,
				response: {
					clientDataJSON: bufferToBase64url(assertion.response.clientDataJSON),
					authenticatorData: bufferToBase64url(assertion.response.authenticatorData),
					signature: bufferToBase64url(assertion.response.signature),
					userHandle: assertion.response.userHandle
						? bufferToBase64url(assertion.response.userHandle)
						: undefined,
				},
			});
			const data = (loginRes as any)?.data || loginRes;
			if (data.accessToken) {
				loginWithTokens(data.accessToken, data.refreshToken, data.user);
				// AUTH-53 约束⑤：会话建立即锚定租户（JWT id + slug 参数/名单解析）
				anchorSessionFromToken(data.accessToken, {
					slug: tenantSlug || null,
					knownTenants,
				});
				loadAuthExtras();
			}
			setSuccess(true);
		} catch (err) {
			setError(extractApiError(err, t('passkey.loginFailed')).message);
		} finally {
			setLoading(false);
		}
	};

	const isRegisterRedirect = mode === 'register';

	return (
		<AuthCard>
			{isRegisterRedirect ? (
				<>
					<div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700 space-y-2">
						<p className="font-medium">{t('passkey.registerMoved')}</p>
						<a
							href={userPortalUrl(slug, '/security')}
							className="inline-block text-[var(--color-brand)] hover:underline font-medium"
						>
							{t('passkey.goToAccountCenter')} →
						</a>
					</div>
					<div className="text-center text-sm">
						<button
							type="button"
							onClick={() => navigate(tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard')}
							className="text-[var(--color-brand)] hover:underline"
						>
							{t('passkey.backLogin')}
						</button>
					</div>
				</>
			) : (
				<>
					<AuthHeader
						title={t('passkey.titleLogin')}
						subtitle={t('passkey.subtitleLogin')}
						logoUrl={undefined}
					/>

					{!supported && (
						<div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-700">
							{t('passkey.unsupported')}
						</div>
					)}

					{error && (
						<div className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm text-danger">
							{error}
						</div>
					)}

					{success ? (
						<RedirectCountdown
							title={t('passkey.successLogin')}
							subtitle={t('auth.common.redirectingIn')}
							continueLabel={t('auth.common.continue')}
							onContinue={() => navigate(tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard')}
						/>
					) : (
						<Button fullWidth isLoading={loading} onClick={handleLogin} disabled={!supported}>
							{t('passkey.submitLogin')}
						</Button>
					)}

					<div className="space-y-2 rounded-md bg-[var(--color-bg-muted)] p-4 text-xs text-[var(--color-text-secondary)]">
						<p className="font-medium text-[var(--color-text-primary)]">{t('passkey.whatIs')}</p>
						<p>{t('passkey.description')}</p>
					</div>

					<div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 text-sm text-[var(--color-text-secondary)] space-y-1">
						<p>{t('passkey.registerMoved')}</p>
						<a
							href={userPortalUrl(slug, '/security')}
							className="text-[var(--color-brand)] hover:underline font-medium"
						>
							{t('passkey.goToAccountCenter')} →
						</a>
					</div>

					<div className="text-center text-sm">
						<button
							type="button"
							onClick={() => navigate(tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard')}
							className="text-[var(--color-brand)] hover:underline"
						>
							{t('passkey.backLogin')}
						</button>
					</div>
				</>
			)}
		</AuthCard>
	);
}

export default function PasskeyPage() {
	const { t } = useI18n();
	return (
		<Suspense
			fallback={
				<AuthCard>
					<AuthHeader title="Passkey" subtitle={t('common.loading')} />
				</AuthCard>
			}
		>
			<PasskeyContent />
		</Suspense>
	);
}
