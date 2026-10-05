'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { Button, Input, Label } from '@autional-cn/ui';
import {
	authLoginPhoneCodePost,
	authRegisterPhoneCodePost,
	authSendSmsCodePost,
} from '@autional-cn/shared/generated/api';
import { loginWithTokens } from '@autional-cn/shared';
import { loadAuthExtras } from '@/lib/api';
import { anchorSessionFromToken } from '@/lib/anchor-session';
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

export default function PhoneCodeLoginForm({
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
	const [phone, setPhone] = useState('+86 ');
	const [code, setCode] = useState('');
	const [step, setStep] = useState<'phone' | 'code'>('phone');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [sent, setSent] = useState(false);
	const { seconds, isActive, start: startCountdown } = useCountdown({ duration: 60 });

	const normalizedPhone = phone.replace(/\s+/g, '');

	const handleSendCode = async () => {
		const p = normalizedPhone;
		if (!p || p.length < 8) {
			setError(t('auth.phoneCode.phoneRequired') || '请输入手机号');
			return;
		}
		setLoading(true);
		setError('');
		try {
			await authSendSmsCodePost({ phone: p });
			setSent(true);
			setStep('code');
			startCountdown();
		} catch (err: any) {
			setError(err?.response?.data?.message || t('auth.phoneCode.sendFailed') || '发送验证码失败');
		} finally {
			setLoading(false);
		}
	};

	const handleLogin = async () => {
		if (!code.trim() || code.length < 4) {
			setError(t('auth.phoneCode.codeRequired') || '请输入验证码');
			return;
		}
		setLoading(true);
		setError('');
		try {
			let res: any;

			if (mode === 'register') {
				const registerPayload: Record<string, unknown> = {
					phone: normalizedPhone,
					code: code.trim(),
					tenantId,
				};
				// P0-05: Include captcha fields if provided
				if (captchaToken) {
					registerPayload.captchaToken = captchaToken;
					registerPayload.captchaProvider = captchaProvider;
					registerPayload.captchaChallengeId = captchaChallengeId;
				}
				res = await authRegisterPhoneCodePost(registerPayload as any);
			} else {
				const loginPayload: Record<string, unknown> = {
					phone: normalizedPhone,
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
				res = await authLoginPhoneCodePost(loginPayload as any);
			}

			// 拦截器已解包信封并转 camelCase（{code,data:{access_token..}} → {accessToken..}）
			const accessToken = res?.accessToken || res?.data?.accessToken;
			const refreshToken = res?.refreshToken || res?.data?.refreshToken;
			const user = res?.user || res?.data?.user;

			if (accessToken && user) {
				loginWithTokens(accessToken, refreshToken || '', user);
				// AUTH-53⑤：会话建立即锚定（手机验证码登录/注册自动登录，与其余入口同法）
				anchorSessionFromToken(accessToken, {
					slug: tenantSlug || null,
					tenantId: tenantId || null,
				});
				await loadAuthExtras();
				window.location.href = getPostLoginTarget({ tenantSlug, redirect });
			} else {
				setError(
					mode === 'register'
						? t('auth.phoneCode.registerFailed') || '注册失败'
						: t('auth.phoneCode.loginFailed') || '登录失败',
				);
			}
		} catch (err: any) {
			setError(
				err?.response?.data?.message ||
					(mode === 'register'
						? t('auth.phoneCode.registerFailed') || '注册失败'
						: t('auth.phoneCode.verifyFailed') || '验证码错误'),
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4" data-testid="phone-code-form">
			{step === 'phone' ? (
				<>
					<p className="text-sm text-[var(--color-text-secondary)]">
						{t('auth.phoneCode.description') || '输入手机号获取一次性登录验证码'}
					</p>
					<div className="space-y-2">
						<Label htmlFor="phone-code-input">{t('auth.phoneCode.phoneLabel') || '手机号'}</Label>
						<Input
							id="phone-code-input"
							type="tel"
							placeholder="+86 13800000000"
							autoComplete="tel"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
						/>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" onClick={onBack} fullWidth>
							{t('auth.phoneCode.back') || '返回'}
						</Button>
						<Button onClick={handleSendCode} disabled={loading} fullWidth isLoading={loading}>
							{t('auth.phoneCode.sendCode') || '发送验证码'}
						</Button>
					</div>
				</>
			) : (
				<>
					{sent && (
						<p className="text-sm text-success-text">
							{(t('auth.phoneCode.sentTo') || '验证码已发送至').replace('{phone}', normalizedPhone)}
						</p>
					)}
					<div className="space-y-2">
						<Label htmlFor="phone-code-digit-input">
							{t('auth.phoneCode.codeLabel') || '验证码'}
						</Label>
						<Input
							id="phone-code-digit-input"
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
								? (t('auth.phoneCode.resendIn') || '重新发送({s}s)').replace('{s}', String(seconds))
								: t('auth.phoneCode.resend') || '重新发送'}
						</Button>
						<Button
							onClick={handleLogin}
							disabled={loading || code.length < 4}
							fullWidth
							isLoading={loading}
						>
							{mode === 'register'
								? t('auth.phoneCode.register') || '注册'
								: t('auth.phoneCode.login') || '登录'}
						</Button>
					</div>
				</>
			)}
			{error && <p className="text-sm text-danger-text">{error}</p>}
		</div>
	);
}
