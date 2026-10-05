'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router';
import { Button } from '@autional-cn/ui';
import { loginWithTokens, extractApiError, decodeJwtPayload } from '@autional-cn/shared';
import { loadAuthExtras } from '@/lib/api';
import { exchangeCodeForToken } from '@/lib/api.generated';
import RedirectCountdown from '@/components/ui/RedirectCountdown';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';

type CallbackStatus = 'loading' | 'success' | 'error';

function OAuthCallbackContent() {
	const { t } = useI18n();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const location = useLocation();
	const code = searchParams.get('code') || '';
	const state = searchParams.get('state') || '';
	const errorParam = searchParams.get('error') || '';
	const errorDescription = searchParams.get('error_description') || '';

	// 从URL路径提取provider: /oauth/callback/github → github
	const pathProvider = (() => {
		const match = location.pathname.match(/\/oauth\/callback\/([^/?]+)/);
		return match ? match[1] : '';
	})();

	const [status, setStatus] = useState<CallbackStatus>('loading');
	const [message, setMessage] = useState('');

	useEffect(() => {
		const handleCallback = async () => {
			if (errorParam) {
				setStatus('error');
				setMessage(errorDescription || t('auth.oauth.errorOccurred'));
				return;
			}

			if (!code) {
				setStatus('error');
				setMessage(t('auth.oauth.missingCode'));
				return;
			}

			const oauthProvider = pathProvider;
			if (!oauthProvider) {
				setStatus('error');
				setMessage(t('auth.oauth.missingRedirect'));
				return;
			}

			try {
				const res = await exchangeCodeForToken(oauthProvider as any, { code, state } as any);
				const data = (res as any)?.data || res;
				if (data.requiresMfa) {
					sessionStorage.setItem(
						'mfa_pre_auth',
						JSON.stringify({
							challengeToken: data.challengeToken || '',
						}),
					);
					navigate('/mfa-challenge');
					return;
				}
				if (data.accessToken) {
					// 持久化 token：从 JWT 解码用户信息写入 store → persist → localStorage
					// （shared decodeJwtPayload：base64url 归一化解码，失败返回 null 交下方兜底）
					let user: { id: string; username: string; email: string; status: string } | null = null;
					const payload = decodeJwtPayload(data.accessToken);
					if (payload) {
						const custom = payload.custom as Record<string, unknown> | undefined;
						user = {
							id: (payload.sub || payload.user_id || '') as string,
							username: (custom?.username || payload.username || '') as string,
							email: (payload.email || '') as string,
							status: 'active',
						};
					}

					loginWithTokens(
						data.accessToken,
						data.refreshToken || '',
						(user || { id: '', username: '', email: '', status: 'active' }) as any,
					);

					// Fire-and-forget: 从 /auth/me 获取完整用户信息
					loadAuthExtras().catch(() => {});

					setStatus('success');
				}
			} catch (err) {
				setStatus('error');
				setMessage(extractApiError(err, t('oauth.callback.failed')).message);
			}
		};

		handleCallback();
	}, [code, state, pathProvider, errorParam, errorDescription, navigate]);

	const handleRetry = () => {
		window.location.reload();
	};

	return (
		<AuthCard>
			{status === 'loading' && (
				<>
					<div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-border-subtle)] border-t-[var(--color-brand)]" />
					<AuthHeader
						title={t('oauth.callback.processing')}
						subtitle={t('auth.oauth.processingHint')}
					/>
				</>
			)}

			{status === 'success' && (
				<div className="text-center">
					<RedirectCountdown
						title={t('oauth.callback.success')}
						subtitle={t('auth.common.redirectingIn')}
						continueLabel={t('auth.common.continue')}
						onContinue={() => navigate('/dashboard')}
					/>
				</div>
			)}

			{status === 'error' && (
				<div className="text-center space-y-6">
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
						❌
					</div>
					<AuthHeader
						title={t('oauth.callback.failed')}
						subtitle={message || t('auth.oauth.loginError')}
					/>
					<div className="flex gap-3">
						<Button variant="outline" fullWidth onClick={handleRetry}>
							{t('auth.oauth.retry')}
						</Button>
						<Button fullWidth onClick={() => navigate('/')}>
							{t('auth.common.backToLogin')}
						</Button>
					</div>
				</div>
			)}
		</AuthCard>
	);
}

export default function OAuthCallbackPage() {
	const { t } = useI18n();
	return (
		<Suspense
			fallback={
				<AuthCard>
					<AuthHeader title={t('oauth.callback.processing')} subtitle={t('common.loading')} />
				</AuthCard>
			}
		>
			<OAuthCallbackContent />
		</Suspense>
	);
}
