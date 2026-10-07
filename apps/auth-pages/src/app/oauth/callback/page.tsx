'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router';
import { Button } from '@autional/ui';
import {
	loginWithTokens,
	extractApiError,
	decodeJwtPayload,
	usePublicTenantSlugs,
} from '@autional/shared';
import { loadAuthExtras } from '@/lib/api';
import { anchorSessionFromToken } from '@/lib/anchor-session';
import { exchangeCodeForToken } from '@/lib/api.generated';
import { oauthErrorText } from '@/lib/oauth-error-text';
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
	const { data: knownTenants } = usePublicTenantSlugs();

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
				// AUTH-46③：error 码/描述 → 本地化（未知码回落描述原文，不直出英文裸句）
				setMessage(
					oauthErrorText(t, {
						code: errorParam,
						description: errorDescription,
						fallback: t('auth.oauth.errorOccurred'),
					}),
				);
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
					// 挑战页数据面：riskLevel/requiredMfaMethods 驱动可见验证方式与风险横幅
					// （OAuth 响应无 user 明细 → 挑战页投递提示走通用文案）
					sessionStorage.setItem(
						'mfa_pre_auth',
						JSON.stringify({
							challengeToken: data.challengeToken || '',
							riskLevel: data.riskLevel || '',
							requiredMfaMethods: data.requiredMfaMethods || [],
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

					// AUTH-53 约束⑤：会话建立即锚定租户（JWT tenant_id + 名单解析 slug），
					// 防从旧租户上下文发起的 OAuth 新会话被跨租户守卫误清
					anchorSessionFromToken(data.accessToken, { knownTenants });

					// Fire-and-forget: 从 /auth/me 获取完整用户信息
					loadAuthExtras().catch(() => {});

					setStatus('success');
				}
			} catch (err) {
				setStatus('error');
				// AUTH-46③：错误体带 i18n_key 时按本地化键渲染；无键回落归一化消息
				const e = extractApiError(err, t('oauth.callback.failed'));
				setMessage(e.i18nKey ? t(e.i18nKey, e.message) : e.message);
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
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft text-3xl">
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
