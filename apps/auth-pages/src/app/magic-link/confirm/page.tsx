'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router';
import { Button } from '@autional-cn/ui';
import { authMagicLinkCallbackPost } from '@autional-cn/shared/generated/api';
import {
	loginWithTokens,
	isValidRedirect,
	getCurrentRole,
	crossAppUrl,
	ADMIN_CONSOLE_URL,
	SECURITY_DASHBOARD_URL,
} from '@autional-cn/shared';
import { loadAuthExtras } from '@/lib/api';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { ErrorState } from '@autional-cn/ui';
import { useI18n } from '@/lib/i18n';

type ConfirmStatus = 'verifying' | 'success' | 'error';

function MagicLinkConfirmContent() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const token = searchParams.get('token') || '';
	const redirectUrl = searchParams.get('redirect') || '';

	const [status, setStatus] = useState<ConfirmStatus>('verifying');
	const [message, setMessage] = useState('');
	const [userEmail, setUserEmail] = useState('');

	useEffect(() => {
		if (!token) {
			setStatus('error');
			setMessage(t('magicLink.confirmError'));
			return;
		}

		authMagicLinkCallbackPost({ token })
			.then((res: any) => {
				const data = res?.data ?? res;
				const accessToken = data?.accessToken ?? data?.access_token ?? '';
				const refreshToken = data?.refreshToken ?? data?.refresh_token ?? '';
				const user = data?.user ?? null;

				if (!accessToken) {
					setStatus('error');
					setMessage(t('magicLink.confirmError'));
					return;
				}

				loginWithTokens(accessToken, refreshToken, user);

				if (user?.email) {
					setUserEmail(user.email);
				}

				setStatus('success');

				loadAuthExtras().finally(() => {
					const resolvedRedirect = redirectUrl && isValidRedirect(redirectUrl) ? redirectUrl : null;

					if (resolvedRedirect) {
						window.location.href = resolvedRedirect;
					} else {
						const role = getCurrentRole();
						if (role === 'super_admin' || role === 'admin') {
							window.location.href = crossAppUrl(ADMIN_CONSOLE_URL());
						} else if (role === 'security_admin') {
							window.location.href = crossAppUrl(SECURITY_DASHBOARD_URL());
						} else {
							const slug = tenantSlug || sessionStorage.getItem('auth_dashboard_slug');
							navigate(slug ? `/${slug}/dashboard` : '/dashboard', { replace: true });
						}
					}
				});
			})
			.catch((err: any) => {
				setStatus('error');
				setMessage(err?.response?.data?.message || t('magicLink.confirmError'));
			});
	}, [token]);

	if (status === 'verifying') {
		return (
			<AuthCard>
				<AuthHeader title={t('magicLink.confirmTitle')} subtitle={t('magicLink.verifying')} />
				<div className="py-8 text-center text-sm text-neutral-500">{t('magicLink.verifying')}</div>
			</AuthCard>
		);
	}

	if (status === 'success') {
		const redirectLabel = userEmail
			? t('magicLink.successMessage').replace('{{email}}', userEmail)
			: t('magicLink.success');

		return (
			<AuthCard>
				<AuthHeader title={t('magicLink.confirmTitle')} subtitle={t('magicLink.success')} />
				<div className="space-y-6">
					<div className="rounded-md bg-[var(--color-success)]/10 p-4 text-center text-sm text-[var(--color-success)]">
						{redirectLabel}
					</div>
					<Button
						fullWidth
						onClick={() => {
							const slug = tenantSlug || sessionStorage.getItem('auth_dashboard_slug');
							navigate(slug ? `/${slug}/dashboard` : '/dashboard', { replace: true });
						}}
					>
						{t('auth.common.continue')}
					</Button>
				</div>
			</AuthCard>
		);
	}

	return (
		<AuthCard>
			<AuthHeader title={t('magicLink.confirmTitle')} subtitle={t('magicLink.confirmSubtitle')} />
			<div className="space-y-6">
				<ErrorState
					title={message || t('magicLink.confirmError')}
					description={t('magicLink.confirmErrorDesc')}
					onRetry={() => navigate('/')}
				/>
			</div>
		</AuthCard>
	);
}

export default function MagicLinkConfirmPage() {
	const { t } = useI18n();

	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center px-4">
					<div className="w-full max-w-sm space-y-6 text-center">
						<h1 className="text-2xl font-bold">{t('magicLink.confirmTitle')}</h1>
						<p className="text-sm text-neutral-500">{t('auth.common.loading')}</p>
					</div>
				</div>
			}
		>
			<MagicLinkConfirmContent />
		</Suspense>
	);
}
