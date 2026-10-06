'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@autional/ui';
import { extractApiError, useAuth } from '@autional/shared';
import {
	enableMFA,
	verifyTOTPMFA,
	sendMFASMS,
	verifyMFASMS,
	sendMFAEmail,
	verifyMFAEmail,
	getMFAStatus,
	disableMFA,
	disableMFASMS,
	disableMFAEmail,
} from '@/lib/api.generated';
import {
	createMfaTOTPSetupSchema,
	createMfaPhoneSetupSchema,
	createMfaEmailSetupSchema,
} from '@/lib/validators';
import type {
	MFATOTPSetupFormData,
	MFAPhoneSetupFormData,
	MFAEmailSetupFormData,
} from '@/lib/validators';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { userPortalUrl } from '@/lib/portal-links';
import { useEffectiveTenantSlug } from '@/hooks/use-tenant-slug';

type MFAMethod = 'totp' | 'sms' | 'email';
type Step = 1 | 2 | 3;

const COOLDOWN_SECONDS = 60;
// 注册设备名（otpauth label 后缀；请求键 device_name 由 client 层 camel→snake 承担）
const TOTP_DEVICE_NAME = 'Autional Auth';

// mfa-service 错误码（errors.go 6104xxxx）
const MFA_ERR_ALREADY_ENABLED = 61040010;
const MFA_ERR_INVALID_CODE = 61040013;

interface MFAStatusData {
	totpEnabled: boolean;
	smsEnabled: boolean;
	emailEnabled: boolean;
	smsPhone: string;
	emailAddress: string;
}

export default function MFASetupPage() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	// AUTH-41：跨门户深链（账户中心 /security）必须带生效租户 slug，裸链会 404
	const slug = useEffectiveTenantSlug();
	const totpSetupSchema = createMfaTOTPSetupSchema(t);
	const phoneSetupSchema = createMfaPhoneSetupSchema(t);
	const emailSetupSchema = createMfaEmailSetupSchema(t);
	const totpForm = useForm<MFATOTPSetupFormData>({ resolver: zodResolver(totpSetupSchema) });
	const phoneForm = useForm<MFAPhoneSetupFormData>({ resolver: zodResolver(phoneSetupSchema) });
	const emailForm = useForm<MFAEmailSetupFormData>({ resolver: zodResolver(emailSetupSchema) });
	const [step, setStep] = useState<Step>(1);
	const [method, setMethod] = useState<MFAMethod>('totp');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	// MFA 状态单一来源：/mfa/status（含解密后的联系方式，用于禁用面发码）
	const [status, setStatus] = useState<MFAStatusData | null>(null);
	const [mfaCheckDone, setMfaCheckDone] = useState(false);

	// TOTP 注册产物：enable 一次生成（secret/QR/备用码），step3 回显备用码
	const [qrCode, setQrCode] = useState('');
	const [secret, setSecret] = useState('');
	const [backupCodes, setBackupCodes] = useState<string[]>([]);
	const [saved, setSaved] = useState(false);

	// SMS/Email 注册
	const [countdown, setCountdown] = useState(0);
	const [contactValue, setContactValue] = useState('');
	const [codeSent, setCodeSent] = useState(false);

	// 禁用（按已启用方法逐个禁用；TOTP 需动态码/备用码，SMS/Email 先发码再验码）
	const [disableMethod, setDisableMethod] = useState<MFAMethod>('totp');
	const [disableCode, setDisableCode] = useState('');
	const [disableSent, setDisableSent] = useState(false);
	const [disableCountdown, setDisableCountdown] = useState(0);
	const [disableLoading, setDisableLoading] = useState(false);

	const { user } = useAuth();

	const enabledMethods: MFAMethod[] = status
		? ([
				...(status.totpEnabled ? (['totp'] as const) : []),
				...(status.smsEnabled ? (['sms'] as const) : []),
				...(status.emailEnabled ? (['email'] as const) : []),
			] as MFAMethod[])
		: [];

	const loadStatus = async (userId: string) => {
		setError('');
		try {
			const res: any = await getMFAStatus(userId);
			setStatus({
				totpEnabled: !!res?.totpEnabled,
				smsEnabled: !!res?.smsEnabled,
				emailEnabled: !!res?.emailEnabled,
				smsPhone: typeof res?.smsPhone === 'string' ? res.smsPhone : '',
				emailAddress: typeof res?.emailAddress === 'string' ? res.emailAddress : '',
			});
		} catch {
			setStatus(null);
		} finally {
			setMfaCheckDone(true);
		}
	};

	useEffect(() => {
		const userId = user?.id;
		if (!userId) {
			setMfaCheckDone(true);
			return;
		}
		loadStatus(userId);
	}, [user?.id]);

	useEffect(() => {
		if (countdown <= 0) return;
		const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
		return () => clearTimeout(timer);
	}, [countdown]);

	useEffect(() => {
		if (disableCountdown <= 0) return;
		const timer = setTimeout(() => setDisableCountdown((prev) => prev - 1), 1000);
		return () => clearTimeout(timer);
	}, [disableCountdown]);

	// 错误按服务端 code 分流（AUTH-33：禁用/验证失败不再笼统归因于密码）
	const mfaErrorText = (err: unknown, fallback: string): string => {
		const { code, message } = extractApiError(err, fallback);
		const numeric = Number(code);
		if (numeric === MFA_ERR_INVALID_CODE) return t('auth.mfa.errorInvalidCode');
		if (numeric === MFA_ERR_ALREADY_ENABLED) return t('auth.mfa.errorAlreadyEnabled');
		if ((err as any)?.response?.status === 429) return t('auth.mfa.errorRateLimited');
		return message;
	};

	const startTOTPSetup = async () => {
		setLoading(true);
		setError('');
		try {
			// 唯一注册口：enable 生成 secret/QR/备用码（落库 Enabled=false），verify 才置 Enabled=true（AUTH-32）
			const res: any = await enableMFA({ deviceName: TOTP_DEVICE_NAME });
			setSecret(typeof res?.secret === 'string' ? res.secret : '');
			setQrCode(typeof res?.qrCode === 'string' ? res.qrCode : '');
			setBackupCodes(Array.isArray(res?.backupCodes) ? res.backupCodes : []);
			setSaved(false);
			setStep(2);
		} catch (err) {
			// 409 已启用（状态不同步/并发注册）：刷新状态切回禁用面
			if (Number(extractApiError(err, '').code) === MFA_ERR_ALREADY_ENABLED && user?.id) {
				await loadStatus(user.id);
			}
			setError(mfaErrorText(err, t('auth.mfa.errorGetSetupFailed')));
		} finally {
			setLoading(false);
		}
	};

	const handleMethodSelect = (m: MFAMethod) => {
		setMethod(m);
		setError('');
		if (m === 'totp') {
			startTOTPSetup();
		} else {
			setStep(2);
		}
	};

	const handleSendCode = async () => {
		if (countdown > 0) return;
		setLoading(true);
		setError('');
		try {
			if (method === 'sms') {
				const phone = phoneForm.getValues('phone');
				if (!phone) {
					setError(t('auth.mfa.errorPhoneRequired'));
					return;
				}
				await sendMFASMS({ phone });
				setContactValue(phone);
			} else {
				const email = emailForm.getValues('email');
				if (!email) {
					setError(t('auth.mfa.errorEmailRequired'));
					return;
				}
				await sendMFAEmail({ email });
				setContactValue(email);
			}
			setCodeSent(true);
			setCountdown(COOLDOWN_SECONDS);
		} catch (err) {
			setError(mfaErrorText(err, t('auth.mfa.errorCodeSendFailed')));
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyAndEnable = async (code: string) => {
		setLoading(true);
		setError('');
		try {
			if (method === 'totp') {
				// 真校验 + 唯一启用口（AUTH-32）：verify 置 Enabled/Verified=true
				const res: any = await verifyTOTPMFA({ code });
				if (!res?.valid) {
					setError(t('auth.mfa.errorVerifyCodeFailed'));
					return;
				}
			} else if (method === 'sms') {
				// 自激活：verify 校验并置 Enabled=true（无效/过期/重放 → 200 {valid:false}，必须判 valid）
				const res: any = await verifyMFASMS({ phone: contactValue, code });
				if (!res?.valid) {
					setError(t('auth.mfa.errorVerifyCodeFailed'));
					return;
				}
				setBackupCodes([]);
			} else {
				const res: any = await verifyMFAEmail({ email: contactValue, code });
				if (!res?.valid) {
					setError(t('auth.mfa.errorVerifyCodeFailed'));
					return;
				}
				setBackupCodes([]);
			}
			setSaved(false);
			setStep(3);
		} catch (err) {
			setError(mfaErrorText(err, t('auth.mfa.errorVerifyCodeFailed')));
		} finally {
			setLoading(false);
		}
	};

	const handleSendDisableCode = async (target: MFAMethod) => {
		if (disableCountdown > 0) return;
		setDisableLoading(true);
		setError('');
		try {
			if (target === 'sms') {
				if (!status?.smsPhone) {
					setError(t('auth.mfa.errorPhoneRequired'));
					return;
				}
				await sendMFASMS({ phone: status.smsPhone, purpose: 'disable' });
			} else {
				if (!status?.emailAddress) {
					setError(t('auth.mfa.errorEmailRequired'));
					return;
				}
				await sendMFAEmail({ email: status.emailAddress, purpose: 'disable' });
			}
			setDisableSent(true);
			setDisableCountdown(COOLDOWN_SECONDS);
		} catch (err) {
			setError(mfaErrorText(err, t('auth.mfa.errorCodeSendFailed')));
		} finally {
			setDisableLoading(false);
		}
	};

	const handleDisableMFA = async (target: MFAMethod) => {
		if (!disableCode || !user?.id) return;
		setDisableLoading(true);
		setError('');
		try {
			if (target === 'totp') await disableMFA({ code: disableCode });
			else if (target === 'sms') await disableMFASMS({ code: disableCode });
			else await disableMFAEmail({ code: disableCode });
			setDisableCode('');
			setDisableSent(false);
			await loadStatus(user.id);
		} catch (err) {
			setError(mfaErrorText(err, t('auth.mfa.errorDisableFailed')));
		} finally {
			setDisableLoading(false);
		}
	};

	const handleCopyCodes = async () => {
		try {
			await navigator.clipboard.writeText(backupCodes.join('\n'));
			setSaved(true);
		} catch {
			setSaved(true);
		}
	};

	const renderStep1 = () => (
		<div className="space-y-4">
			<div className="grid gap-3">
				<button
					type="button"
					onClick={() => handleMethodSelect('totp')}
					disabled={loading}
					className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-4 text-left transition-colors hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
				>
					<span className="text-2xl">📱</span>
					<div>
						<p className="font-medium text-[var(--color-text-primary)]">
							{t('auth.mfa.setupAuthApp')}
						</p>
						<p className="text-xs text-[var(--color-text-secondary)]">
							{t('auth.mfa.setupAuthAppDesc')}
						</p>
					</div>
				</button>
				<button
					type="button"
					onClick={() => handleMethodSelect('sms')}
					disabled={loading}
					className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-4 text-left transition-colors hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
				>
					<span className="text-2xl">💬</span>
					<div>
						<p className="font-medium text-[var(--color-text-primary)]">{t('auth.mfa.setupSms')}</p>
						<p className="text-xs text-[var(--color-text-secondary)]">
							{t('auth.mfa.setupSmsDesc')}
						</p>
					</div>
				</button>
				<button
					type="button"
					onClick={() => handleMethodSelect('email')}
					disabled={loading}
					className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-4 text-left transition-colors hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
				>
					<span className="text-2xl">📧</span>
					<div>
						<p className="font-medium text-[var(--color-text-primary)]">
							{t('auth.mfa.setupEmail')}
						</p>
						<p className="text-xs text-[var(--color-text-secondary)]">
							{t('auth.mfa.setupEmailDesc')}
						</p>
					</div>
				</button>
			</div>
			{loading && (
				<div className="py-2 text-center text-sm text-[var(--color-text-secondary)]">
					{t('auth.common.loading')}
				</div>
			)}
		</div>
	);

	const renderStep2 = () => {
		if (method === 'totp') {
			return (
				<div className="space-y-4">
					<p className="text-sm text-[var(--color-text-secondary)]">{t('auth.mfa.setupScanQR')}</p>
					{qrCode && (
						<div className="flex justify-center">
							<img
								src={qrCode}
								alt="MFA QR Code"
								className="h-40 w-40 rounded-md border border-[var(--color-border)]"
							/>
						</div>
					)}
					{secret && (
						<div className="rounded-md bg-[var(--color-bg-secondary)] p-3 text-center">
							<p className="text-xs text-[var(--color-text-secondary)]">
								{t('auth.mfa.setupManualKey')}
							</p>
							<p className="mt-1 select-all font-mono text-sm font-semibold tracking-wider">
								{secret}
							</p>
						</div>
					)}
					<form
						onSubmit={totpForm.handleSubmit((data) => handleVerifyAndEnable(data.code))}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="totp-code">{t('auth.mfa.setupVerifyCodeLabel')}</Label>
							<Input
								id="totp-code"
								type="text"
								inputMode="numeric"
								maxLength={6}
								placeholder={t('auth.mfa.codePlaceholder')}
								autoFocus
								{...totpForm.register('code')}
								error={totpForm.formState.errors.code?.message}
							/>
						</div>
						<Button type="submit" fullWidth isLoading={loading}>
							{t('auth.mfa.setupVerifyAndEnable')}
						</Button>
					</form>
				</div>
			);
		}

		if (method === 'sms') {
			return (
				<div className="space-y-4">
					<form
						onSubmit={phoneForm.handleSubmit((data) => handleVerifyAndEnable(data.code))}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="phone">{t('auth.mfa.phoneLabel')}</Label>
							<div className="flex gap-2">
								<Input
									id="phone"
									type="tel"
									placeholder={t('auth.mfa.phonePlaceholder')}
									{...phoneForm.register('phone')}
									error={phoneForm.formState.errors.phone?.message}
									disabled={codeSent}
								/>
								<Button
									type="button"
									variant="outline"
									onClick={handleSendCode}
									isLoading={loading && !phoneForm.formState.isSubmitting}
									disabled={countdown > 0 || loading}
								>
									{countdown > 0
										? t('auth.mfa.countdown', { seconds: countdown })
										: t('auth.mfa.getCode')}
								</Button>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="sms-code">{t('auth.mfa.codeLabel')}</Label>
							<Input
								id="sms-code"
								type="text"
								inputMode="numeric"
								maxLength={6}
								placeholder={t('auth.mfa.codePlaceholder')}
								autoFocus
								{...phoneForm.register('code')}
								error={phoneForm.formState.errors.code?.message}
							/>
						</div>
						<Button type="submit" fullWidth isLoading={loading}>
							{t('auth.mfa.enableSubmit')}
						</Button>
					</form>
				</div>
			);
		}

		// email
		return (
			<div className="space-y-4">
				<form
					onSubmit={emailForm.handleSubmit((data) => handleVerifyAndEnable(data.code))}
					className="space-y-4"
				>
					<div className="space-y-2">
						<Label htmlFor="email">{t('auth.mfa.emailLabel')}</Label>
						<div className="flex gap-2">
							<Input
								id="email"
								type="email"
								placeholder={t('auth.mfa.emailPlaceholder')}
								{...emailForm.register('email')}
								error={emailForm.formState.errors.email?.message}
								disabled={codeSent}
							/>
							<Button
								type="button"
								variant="outline"
								onClick={handleSendCode}
								isLoading={loading && !emailForm.formState.isSubmitting}
								disabled={countdown > 0 || loading}
							>
								{countdown > 0
									? t('auth.mfa.countdown', { seconds: countdown })
									: t('auth.mfa.getCode')}
							</Button>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email-code">{t('auth.mfa.codeLabel')}</Label>
						<Input
							id="email-code"
							type="text"
							inputMode="numeric"
							maxLength={6}
							placeholder={t('auth.mfa.codePlaceholder')}
							autoFocus
							{...emailForm.register('code')}
							error={emailForm.formState.errors.code?.message}
						/>
					</div>
					<Button type="submit" fullWidth isLoading={loading}>
						{t('auth.mfa.enableSubmit')}
					</Button>
				</form>
			</div>
		);
	};

	const renderStep3 = () => {
		const hasCodes = backupCodes.length > 0;
		return (
			<div className="space-y-4">
				<div className="rounded-md bg-success/10 p-4 text-center text-sm text-success-text">
					{t('auth.mfa.enabled')}
				</div>
				{hasCodes && (
					<>
						<p className="text-sm text-[var(--color-text-secondary)]">
							{t('auth.mfa.saveCodesHint')}
						</p>
						<div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
							<div className="grid grid-cols-2 gap-2">
								{backupCodes.map((code, idx) => (
									<p key={idx} className="font-mono text-sm text-[var(--color-text-primary)]">
										{code}
									</p>
								))}
							</div>
						</div>
						<Button variant="outline" fullWidth onClick={handleCopyCodes}>
							{saved ? t('auth.mfa.copied') : t('auth.mfa.copyCodes')}
						</Button>
						<div className="flex items-start gap-2">
							<input
								type="checkbox"
								id="saved-check"
								className="mt-0.5 h-4 w-4 rounded border-[var(--color-border-subtle)]"
								checked={saved}
								onChange={(e) => setSaved(e.target.checked)}
							/>
							<label htmlFor="saved-check" className="text-xs text-[var(--color-text-secondary)]">
								{t('auth.mfa.savedSafely')}
							</label>
						</div>
					</>
				)}
				<Button
					fullWidth
					disabled={hasCodes && !saved}
					onClick={() => navigate(tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard')}
				>
					{t('auth.mfa.done')}
				</Button>
			</div>
		);
	};

	// 页面加载中 — 等待 MFA 状态检查
	if (!mfaCheckDone) {
		return (
			<AuthCard>
				<div className="py-8 text-center text-sm text-[var(--color-text-secondary)]">
					{t('auth.common.loading')}
				</div>
			</AuthCard>
		);
	}

	// MFA 已启用 — 按已启用方法逐个禁用（AUTH-33：验证码关；TOTP 动态码/备用码，SMS/Email 发码验证）
	if (status && enabledMethods.length > 0) {
		const target = enabledMethods.includes(disableMethod) ? disableMethod : enabledMethods[0];
		const targetLabel =
			target === 'totp'
				? t('auth.mfa.totp')
				: target === 'sms'
					? t('auth.mfa.sms')
					: t('auth.mfa.email');
		const codeLabel =
			target === 'totp'
				? t('auth.mfa.disableLabel')
				: target === 'sms'
					? t('auth.mfa.smsCodeLabel')
					: t('auth.mfa.emailCodeLabel');
		const contact = target === 'sms' ? status.smsPhone : target === 'email' ? status.emailAddress : '';
		return (
			<AuthCard>
				<AuthHeader title={t('auth.mfa.setupTitle')} subtitle={t('auth.mfa.enabledDesc')} />

				{error && (
					<div className="rounded-md bg-danger/10 p-3 text-sm text-danger-text">
						{error}
					</div>
				)}

				<div className="rounded-md border border-[var(--color-border)] p-4 space-y-4">
					<div className="flex items-center gap-3">
						<span className="inline-block h-3 w-3 rounded-full bg-[var(--color-success)]" />
						<span className="text-sm font-medium text-[var(--color-text-primary)]">
							{t('auth.mfa.enabledStatus')}
						</span>
					</div>

					{enabledMethods.length > 1 && (
						<div className="flex rounded-md bg-[var(--color-bg-muted)] p-1">
							{enabledMethods.map((m) => (
								<button
									key={m}
									type="button"
									onClick={() => {
										setDisableMethod(m);
										setDisableCode('');
										setDisableSent(false);
										setError('');
									}}
									className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
										target === m
											? 'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-sm'
											: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
									}`}
								>
									{m === 'totp'
										? t('auth.mfa.totp')
										: m === 'sms'
											? t('auth.mfa.sms')
											: t('auth.mfa.email')}
								</button>
							))}
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="disable-code">{codeLabel}</Label>
						{target !== 'totp' && (
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => handleSendDisableCode(target)}
									disabled={disableCountdown > 0 || disableLoading}
								>
									{disableCountdown > 0
										? t('auth.mfa.countdown', { seconds: disableCountdown })
										: t('auth.mfa.sendCode')}
								</Button>
								{disableSent && (
									<span className="text-xs text-[var(--color-text-secondary)]">
										{t('auth.mfa.disableSentHint', { target: contact || targetLabel })}
									</span>
								)}
							</div>
						)}
						<Input
							id="disable-code"
							type="text"
							inputMode="numeric"
							maxLength={target === 'totp' ? 8 : 6}
							placeholder={t('auth.mfa.codePlaceholder')}
							value={disableCode}
							onChange={(e) => setDisableCode(e.target.value)}
						/>
					</div>

					<Button
						type="button"
						variant="outline"
						fullWidth
						disabled={
							!disableCode || disableLoading || (target !== 'totp' && !disableSent)
						}
						isLoading={disableLoading}
						onClick={() => handleDisableMFA(target)}
						className="!border-danger/30 !text-danger-text hover:!bg-danger/10"
					>
						{t('auth.mfa.disableBtn')}
					</Button>
				</div>

				<div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 text-sm text-[var(--color-text-secondary)] space-y-1">
					<p>{t('mfa.accountCenter')}</p>
					<a
						href={userPortalUrl(slug, '/security')}
						className="text-brand-text hover:underline font-medium"
					>
						{t('mfa.goToAccountCenter')} →
					</a>
				</div>

				<div className="text-center text-sm">
					<button
						type="button"
						onClick={() => navigate(tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard')}
						className="text-brand-text hover:underline"
					>
						{t('auth.mfa.back')}
					</button>
				</div>
			</AuthCard>
		);
	}

	// MFA 未启用 — 显示设置流程
	const hasCodes = backupCodes.length > 0;
	return (
		<AuthCard>
			<AuthHeader
				title={
					step === 1
						? t('auth.mfa.setupTitle')
						: step === 2
							? t('auth.mfa.setupStep2Title')
							: hasCodes
								? t('auth.mfa.setupStep3Title')
								: t('auth.mfa.enabledStatus')
				}
				subtitle={
					step === 1
						? t('auth.mfa.setupSubtitleStep1')
						: step === 2
							? t('auth.mfa.setupSubtitleStep2')
							: hasCodes
								? t('auth.mfa.setupSubtitleStep3')
								: t('auth.mfa.enabledDesc')
				}
			/>

			{error && (
				<div className="rounded-md bg-danger/10 p-3 text-sm text-danger-text">
					{error}
				</div>
			)}

			{step === 1 && renderStep1()}
			{step === 2 && renderStep2()}
			{step === 3 && renderStep3()}

			{step !== 3 && (
				<div className="text-center text-sm">
					<button
						type="button"
						onClick={() => navigate(tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard')}
						className="text-brand-text hover:underline"
					>
						{t('auth.mfa.back')}
					</button>
				</div>
			)}

			<div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 text-sm text-[var(--color-text-secondary)] space-y-1">
				<p>{t('mfa.accountCenter')}</p>
				<a
					href={userPortalUrl(slug, '/security')}
					className="text-brand-text hover:underline font-medium"
				>
					{t('mfa.goToAccountCenter')} →
				</a>
			</div>
		</AuthCard>
	);
}
