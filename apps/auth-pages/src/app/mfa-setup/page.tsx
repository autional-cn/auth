'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@autional-cn/ui';
import {
	setupMFA,
	enableMFA,
	regenerateBackupCodes,
	sendMFASMS,
	verifyMFASMS,
	sendMFAEmail,
	verifyMFAEmail,
	getMFAStatus,
	disableMFA,
} from '@/lib/api.generated';
import { useAuth, END_USER_PORTAL_URL, crossAppUrl } from '@autional-cn/shared';
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

type MFAMethod = 'totp' | 'sms' | 'email';
type Step = 1 | 2 | 3;

const COOLDOWN_SECONDS = 60;

export default function MFASetupPage() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const totpSetupSchema = createMfaTOTPSetupSchema(t);
	const phoneSetupSchema = createMfaPhoneSetupSchema(t);
	const emailSetupSchema = createMfaEmailSetupSchema(t);
	const [step, setStep] = useState<Step>(1);
	const [method, setMethod] = useState<MFAMethod>('totp');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	// MFA status & disable
	const [mfaEnabled, setMfaEnabled] = useState<boolean | null>(null);
	const [mfaCheckDone, setMfaCheckDone] = useState(false);
	const [disablePassword, setDisablePassword] = useState('');
	const [disableLoading, setDisableLoading] = useState(false);

	const { user } = useAuth();

	// 页面加载时检查 MFA 状态
	useEffect(() => {
		const userId = user?.id;
		if (!userId) {
			setMfaCheckDone(true);
			return;
		}
		getMFAStatus(userId)
			.then((res: any) => {
				const data = res?.data || res;
				const enabled = !!(data?.totpEnabled || data?.smsEnabled || data?.emailEnabled);
				setMfaEnabled(enabled);
			})
			.catch(() => setMfaEnabled(false))
			.finally(() => setMfaCheckDone(true));
	}, [user]);

	// TOTP state
	const [qrUrl, setQrUrl] = useState('');
	const [secret, setSecret] = useState('');

	// SMS/Email shared state
	const [countdown, setCountdown] = useState(0);
	const [contactValue, setContactValue] = useState('');
	const [codeSent, setCodeSent] = useState(false);

	// Backup codes
	const [backupCodes, setBackupCodes] = useState<string[]>([]);
	const [saved, setSaved] = useState(false);

	const totpForm = useForm<MFATOTPSetupFormData>({
		resolver: zodResolver(totpSetupSchema),
	});

	const phoneForm = useForm<MFAPhoneSetupFormData>({
		resolver: zodResolver(phoneSetupSchema),
	});

	const emailForm = useForm<MFAEmailSetupFormData>({
		resolver: zodResolver(emailSetupSchema),
	});

	useEffect(() => {
		if (countdown <= 0) return;
		const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
		return () => clearTimeout(timer);
	}, [countdown]);

	const startTOTPSetup = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await setupMFA({ accountName: 'Autional' });
			const data = res.data;
			setQrUrl(data?.qr_url || '');
			setSecret(data?.secret || '');
			setStep(2);
		} catch (err: any) {
			setError(err.response?.data?.message || t('auth.mfa.errorGetSetupFailed'));
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
					setLoading(false);
					return;
				}
				await sendMFASMS({ phone });
				setContactValue(phone);
			} else {
				const email = emailForm.getValues('email');
				if (!email) {
					setError(t('auth.mfa.errorEmailRequired'));
					setLoading(false);
					return;
				}
				await sendMFAEmail({ email });
				setContactValue(email);
			}
			setCodeSent(true);
			setCountdown(COOLDOWN_SECONDS);
		} catch (err: any) {
			setError(err.response?.data?.message || t('auth.mfa.errorCodeSendFailed'));
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyAndEnable = async (code: string) => {
		setLoading(true);
		setError('');
		try {
			if (method === 'totp') {
				await enableMFA({ code, type: 'totp' });
			} else if (method === 'sms') {
				await verifyMFASMS({ phone: contactValue, code });
				await enableMFA({ code, type: 'sms' });
			} else {
				await verifyMFAEmail({ email: contactValue, code });
				await enableMFA({ code, type: 'email' });
			}
			const res = await regenerateBackupCodes({ password: '' });
			setBackupCodes(res.data?.codes || []);
			setStep(3);
		} catch (err: any) {
			setError(err.response?.data?.message || t('auth.mfa.errorVerifyCodeFailed'));
		} finally {
			setLoading(false);
		}
	};

	const handleDisableMFA = async () => {
		if (!disablePassword) return;
		setDisableLoading(true);
		setError('');
		try {
			const userId = user?.id;
			if (!userId) throw new Error('No user ID');
			await disableMFA({ code: disablePassword, userId });
			setMfaEnabled(false);
			setDisablePassword('');
			setStep(1);
		} catch (err: any) {
			setError(err.response?.data?.message || t('auth.mfa.errorDisableFailed'));
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
					{qrUrl && (
						<div className="flex justify-center">
							<img
								src={qrUrl}
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

	const renderStep3 = () => (
		<div className="space-y-4">
			<div className="rounded-md bg-[var(--color-success)]/10 p-4 text-center text-sm text-success">
				{t('auth.mfa.enabled')}
			</div>
			<p className="text-sm text-[var(--color-text-secondary)]">{t('auth.mfa.saveCodesHint')}</p>
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
			<Button
				fullWidth
				disabled={!saved}
				onClick={() => navigate(tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard')}
			>
				{t('auth.mfa.done')}
			</Button>
		</div>
	);

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

	// MFA 已启用 — 显示禁用流程
	if (mfaEnabled) {
		return (
			<AuthCard>
				<AuthHeader title={t('auth.mfa.setupTitle')} subtitle={t('auth.mfa.enabledDesc')} />

				{error && (
					<div className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm text-danger">
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
					<div className="space-y-2">
						<Label htmlFor="disable-password">{t('auth.mfa.disableLabel')}</Label>
						<Input
							id="disable-password"
							type="password"
							placeholder={t('auth.mfa.disablePlaceholder')}
							value={disablePassword}
							onChange={(e) => setDisablePassword(e.target.value)}
							autoComplete="current-password"
						/>
					</div>
					<Button
						type="button"
						variant="outline"
						fullWidth
						disabled={!disablePassword || disableLoading}
						isLoading={disableLoading}
						onClick={handleDisableMFA}
						className="!border-[var(--color-danger)]/30 !text-[var(--color-danger)] hover:!bg-[var(--color-danger)]/10"
					>
						{t('auth.mfa.disableBtn')}
					</Button>
				</div>

				<div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 text-sm text-[var(--color-text-secondary)] space-y-1">
					<p>{t('mfa.accountCenter')}</p>
					<a
						href={crossAppUrl(`${END_USER_PORTAL_URL()}/security`)}
						className="text-[var(--color-brand)] hover:underline font-medium"
					>
						{t('mfa.goToAccountCenter')} →
					</a>
				</div>

				<div className="text-center text-sm">
					<button
						type="button"
						onClick={() => navigate(tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard')}
						className="text-[var(--color-brand)] hover:underline"
					>
						{t('auth.mfa.back')}
					</button>
				</div>
			</AuthCard>
		);
	}

	// MFA 未启用 — 显示设置流程
	return (
		<AuthCard>
			<AuthHeader
				title={
					step === 1
						? t('auth.mfa.setupTitle')
						: step === 2
							? t('auth.mfa.setupStep2Title')
							: t('auth.mfa.setupStep3Title')
				}
				subtitle={
					step === 1
						? t('auth.mfa.setupSubtitleStep1')
						: step === 2
							? t('auth.mfa.setupSubtitleStep2')
							: t('auth.mfa.setupSubtitleStep3')
				}
			/>

			{error && (
				<div className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm text-danger">
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
						className="text-[var(--color-brand)] hover:underline"
					>
						{t('auth.mfa.back')}
					</button>
				</div>
			)}

			<div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 text-sm text-[var(--color-text-secondary)] space-y-1">
				<p>{t('mfa.accountCenter')}</p>
				<a
					href={crossAppUrl(`${END_USER_PORTAL_URL()}/security`)}
					className="text-[var(--color-brand)] hover:underline font-medium"
				>
					{t('mfa.goToAccountCenter')} →
				</a>
			</div>
		</AuthCard>
	);
}
