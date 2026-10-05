'use client';

import { useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { Button, Input, Label } from '@autional-cn/ui';
import {
	authLoginEmailCodePost,
	authRegisterEmailCodePost,
	authSendVerificationEmailPost,
} from '@autional-cn/shared/generated/api';
import { loginWithTokens } from '@autional-cn/shared';
import { loadAuthExtras } from '@/lib/api';
import { getPostLoginTarget } from '@/lib/post-login-redirect';
import { useI18n } from '@/lib/i18n';
import { useCountdown } from '@/hooks/use-countdown';
import type { AuthConfig } from '@/hooks/use-tenant-auth-config';

interface Props {
	tenantId?: string;
	authConfig?: AuthConfig | null;
	onBack: () => void;
	mode?: 'login' | 'register';
	// P0-05: Captcha fields to pass through to login API
	captchaToken?: string;
	captchaProvider?: string;
	captchaChallengeId?: string;
}

export default function EmailCodeLoginForm({
	tenantId,
	authConfig,
	onBack,
	mode = 'login',
	captchaToken,
	captchaProvider,
	captchaChallengeId,
}: Props) {
	const { t } = useI18n();
	const { tenantSlug } = useParams();
	const [searchParams] = useSearchParams();
	const redirect = searchParams.get('redirect');
	const [email, setEmail] = useState('');
	const [code, setCode] = useState('');
	const [step, setStep] = useState<'email' | 'code'>('email');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [sent, setSent] = useState(false);
	const { seconds, isActive, start: startCountdown } = useCountdown({ duration: 60 });

	const handleSendCode = async () => {
		if (!email.trim()) {
			setError(t('auth.emailCode.emailRequired') || '请输入邮箱');
			return;
		}
		setLoading(true);
		setError('');
		try {
			await authSendVerificationEmailPost({ email: email.trim() });
			setSent(true);
			setStep('code');
			startCountdown();
		} catch (err: any) {
			setError(err?.response?.data?.message || t('auth.emailCode.sendFailed') || '发送验证码失败');
		} finally {
			setLoading(false);
		}
	};

	const handleLogin = async () => {
		if (!code.trim() || code.length < 4) {
			setError(t('auth.emailCode.codeRequired') || '请输入验证码');
			return;
		}
		setLoading(true);
		setError('');
		try {
			let res: any;

			if (mode === 'register') {
				const registerPayload: Record<string, unknown> = {
					email: email.trim(),
					code: code.trim(),
					tenantId,
				};
				// P0-05: Include captcha fields if provided
				if (captchaToken) {
					registerPayload.captchaToken = captchaToken;
					registerPayload.captchaProvider = captchaProvider;
					registerPayload.captchaChallengeId = captchaChallengeId;
				}
				res = await authRegisterEmailCodePost(registerPayload as any);
			} else {
				const loginPayload: Record<string, unknown> = {
					email: email.trim(),
					code: code.trim(),
					registerIfNew: true,
					tenantId,
				};
				// P0-05: Include captcha fields if provided
				if (captchaToken) {
					loginPayload.captchaToken = captchaToken;
					loginPayload.captchaProvider = captchaProvider;
					loginPayload.captchaChallengeId = captchaChallengeId;
				}
				res = await authLoginEmailCodePost(loginPayload as any);
			}

			// 拦截器已解包信封并转 camelCase（{code,data:{access_token..}} → {accessToken..}）
			const accessToken = res?.accessToken || res?.data?.accessToken;
			const refreshToken = res?.refreshToken || res?.data?.refreshToken;
			const user = res?.user || res?.data?.user;

			if (accessToken && user) {
				loginWithTokens(accessToken, refreshToken || '', user);
				await loadAuthExtras();
				window.location.href = getPostLoginTarget({ tenantSlug, redirect });
			} else {
				setError(
					mode === 'register'
						? t('auth.emailCode.registerFailed') || '注册失败'
						: t('auth.emailCode.loginFailed') || '登录失败',
				);
			}
		} catch (err: any) {
			setError(
				err?.response?.data?.message ||
					(mode === 'register'
						? t('auth.emailCode.registerFailed') || '注册失败'
						: t('auth.emailCode.verifyFailed') || '验证码错误'),
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4" data-testid="email-code-form">
			{step === 'email' ? (
				<>
					<p className="text-sm text-[var(--color-text-secondary)]">
						{t('auth.emailCode.description') || '输入邮箱获取一次性登录验证码'}
					</p>
					<div className="space-y-2">
						<Label htmlFor="email-code-input">{t('auth.emailCode.emailLabel') || '邮箱'}</Label>
						<Input
							id="email-code-input"
							type="email"
							placeholder="user@example.com"
							autoComplete="email"
							aria-label={t('auth.emailCode.emailLabel') || '邮箱'}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" onClick={onBack} fullWidth>
							{t('auth.emailCode.back') || '返回'}
						</Button>
						<Button onClick={handleSendCode} disabled={loading} fullWidth isLoading={loading}>
							{t('auth.emailCode.sendCode') || '发送验证码'}
						</Button>
					</div>
				</>
			) : (
				<>
					{sent && (
						<p className="text-sm text-[var(--color-success)]">
							{(t('auth.emailCode.sentTo') || '验证码已发送至').replace('{email}', email)}
						</p>
					)}
					<div className="space-y-2">
						<Label htmlFor="code-input">{t('auth.emailCode.codeLabel') || '验证码'}</Label>
						<Input
							id="code-input"
							type="text"
							inputMode="numeric"
							maxLength={6}
							autoComplete="one-time-code"
							placeholder="000000"
							value={code}
							onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
						/>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" onClick={handleSendCode} disabled={isActive} fullWidth>
							{isActive
								? (t('auth.emailCode.resendIn') || '重新发送({s}s)').replace('{s}', String(seconds))
								: t('auth.emailCode.resend') || '重新发送'}
						</Button>
						<Button
							onClick={handleLogin}
							disabled={loading || code.length < 4}
							fullWidth
							isLoading={loading}
						>
							{mode === 'register'
								? t('auth.emailCode.register') || '注册'
								: t('auth.emailCode.login') || '登录'}
						</Button>
					</div>
				</>
			)}
			{error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
		</div>
	);
}
