'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Label } from '@autional-cn/ui';
import { useAuth, loginWithTokens } from '@autional-cn/shared';
import { createMfaTOTPSchema, createMfaSMSSchema } from '@/lib/validators';
import type { MFATOTPFormData, MFASMSFormData } from '@/lib/validators';
import {
	validateTOTP,
	verifyMFASMS,
	verifyMFAEmail,
	verifyMFA,
	sendMFASMS,
	sendMFAEmail,
	mfaPushChallengePost,
	mfaPushChallengeByChallenge,
	verifyMFAChallenge,
} from '@/lib/api.generated';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';

type MFATab = 'totp' | 'sms' | 'email' | 'backup' | 'push';

function useCountdown(initialSeconds = 60) {
	const [countdown, setCountdown] = useState(0);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const start = () => {
		setCountdown(initialSeconds);
		timerRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					if (timerRef.current) clearInterval(timerRef.current);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);

	return { countdown, start };
}

type BackupFormData = { code: string };

function TrustDeviceCheckbox({
	trustDevice,
	setTrustDevice,
	t,
}: {
	trustDevice: boolean;
	setTrustDevice: (v: boolean) => void;
	t: (key: string, params?: Record<string, unknown>) => string;
}) {
	return (
		<label className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer">
			<input
				type="checkbox"
				className="mt-0.5 h-4 w-4 rounded border-[var(--color-border-subtle)] text-[var(--color-brand)] focus:ring-[var(--color-brand)]"
				checked={trustDevice}
				onChange={(e) => setTrustDevice(e.target.checked)}
			/>
			<div>
				<span className="font-medium text-[var(--color-text-primary)]">{t('mfa.trustDevice')}</span>
				<p className="text-xs text-[var(--color-text-secondary)]">{t('mfa.trustDeviceDesc')}</p>
			</div>
		</label>
	);
}

export default function MFAChallengePage() {
	const { t, lang } = useI18n();
	const navigate = useNavigate();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const mfaTotpSchema = createMfaTOTPSchema(t);
	const mfaSmsSchema = createMfaSMSSchema(t);
	const backupSchema = useMemo(
		() =>
			z.object({
				code: z.string().length(8, t('validation.backupCodeLength')),
			}),
		[lang, t],
	);
	const [activeTab, setActiveTab] = useState<MFATab>('totp');
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [sendSuccess, setSendSuccess] = useState('');
	const [trustDevice, setTrustDevice] = useState(false);
	const smsCountdown = useCountdown();
	const emailCountdown = useCountdown();
	const pushCountdown = useCountdown(120);

	const { user } = useAuth();

	const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | null>(null);

	useEffect(() => {
		const preAuth = sessionStorage.getItem('mfa_pre_auth');
		if (!user?.id && !preAuth) {
			navigate('/', { replace: true });
		}
		if (preAuth) {
			try {
				const parsed = JSON.parse(preAuth);
				if (parsed.riskLevel) {
					setRiskLevel(parsed.riskLevel);
				}
			} catch {
				/* ignore parse errors */
			}
		}
	}, [user, navigate]);

	const [pushChallengeId, setPushChallengeId] = useState('');
	const [pushNumberMatching, setPushNumberMatching] = useState('');
	const [pushStatus, setPushStatus] = useState<
		'idle' | 'pending' | 'approved' | 'denied' | 'expired'
	>('idle');
	const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const totpForm = useForm<MFATOTPFormData>({ resolver: zodResolver(mfaTotpSchema) });
	const smsForm = useForm<MFASMSFormData>({ resolver: zodResolver(mfaSmsSchema) });
	const emailForm = useForm<MFASMSFormData>({ resolver: zodResolver(mfaSmsSchema) });
	const backupForm = useForm<BackupFormData>({ resolver: zodResolver(backupSchema) });

	const handleSendSMS = async () => {
		try {
			setError('');
			setSendSuccess('');
			await sendMFASMS({ phone: (user as any)?.phone || '' });
			setSendSuccess(t('mfa.challenge.smsSent'));
			smsCountdown.start();
		} catch (err: any) {
			setError(err.response?.data?.message || t('mfa.challenge.smsSendFailed'));
		}
	};

	const handleSendEmail = async () => {
		try {
			setError('');
			setSendSuccess('');
			await sendMFAEmail({ email: (user as any)?.email || '' });
			setSendSuccess(t('mfa.challenge.emailSent'));
			emailCountdown.start();
		} catch (err: any) {
			setError(err.response?.data?.message || t('mfa.challenge.emailSendFailed'));
		}
	};

	const handlePushChallenge = async () => {
		try {
			setError('');
			setPushStatus('pending');
			const res = await mfaPushChallengePost({
				user_id: (user as any)?.id || '',
				login_context: navigator.userAgent,
			});
			const data = (res as any)?.data || res;
			setPushChallengeId(data?.challenge_id || data?.challengeId || '');
			setPushNumberMatching(data?.number_matching || data?.numberMatching || '');
			pushCountdown.start();
			startPushPolling(data?.challenge_id || data?.challengeId || '');
		} catch (err: any) {
			setError(err.response?.data?.message || t('mfa.challenge.pushChallengeFailed'));
			setPushStatus('idle');
		}
	};

	const startPushPolling = (challengeId: string) => {
		if (pollRef.current) clearInterval(pollRef.current);
		pollRef.current = setInterval(async () => {
			try {
				const res = await mfaPushChallengeByChallenge(challengeId);
				const data = (res as any)?.data || res;
				const status: string = data?.status || '';
				if (status === 'approved') {
					setPushStatus('approved');
					if (pollRef.current) clearInterval(pollRef.current);
					navigate(tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard');
				} else if (status === 'denied') {
					setPushStatus('denied');
					if (pollRef.current) clearInterval(pollRef.current);
					setError(t('mfa.challenge.pushDenied'));
				} else if (status === 'expired') {
					setPushStatus('expired');
					if (pollRef.current) clearInterval(pollRef.current);
					setError(t('mfa.challenge.pushExpired'));
				}
			} catch {
				// 静默忽略轮询错误
			}
		}, 2000);
	};

	useEffect(() => {
		return () => {
			if (pollRef.current) clearInterval(pollRef.current);
		};
	}, []);

	const handleSubmit = async (code: string, type: MFATab) => {
		setSubmitting(true);
		setError('');
		try {
			const preAuth = sessionStorage.getItem('mfa_pre_auth');
			if (preAuth) {
				const { challengeToken } = JSON.parse(preAuth);
				const mfaMethod = type === 'sms' ? 'sms' : type === 'email' ? 'email' : 'totp';
				const res = await verifyMFAChallenge({
					challengeToken,
					code,
					mfa_method: mfaMethod,
					trust_device: trustDevice,
				});
				const data = (res as any)?.data || res;
				loginWithTokens(data.accessToken, data.refreshToken, data.user);
				sessionStorage.removeItem('mfa_pre_auth');
				navigate(tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard');
				return;
			}
			if (type === 'totp') await validateTOTP({ code, trust_device: trustDevice });
			else if (type === 'sms')
				await verifyMFASMS({ phone: (user as any)?.phone || '', code, trust_device: trustDevice });
			else if (type === 'email')
				await verifyMFAEmail({
					email: (user as any)?.email || '',
					code,
					trust_device: trustDevice,
				});
			else if (type === 'backup')
				await verifyMFA({ code, userId: (user as any)?.id || '', trust_device: trustDevice });
			navigate(tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard');
		} catch (err: any) {
			setError(err.response?.data?.message || t('mfa.challenge.verifyFailed'));
		} finally {
			setSubmitting(false);
		}
	};

	const tabs: { key: MFATab; label: string }[] = [
		{ key: 'totp', label: t('mfa.challenge.tabTOTP') },
		{ key: 'sms', label: t('mfa.challenge.tabSMS') },
		{ key: 'email', label: t('mfa.challenge.tabEmail') },
		{ key: 'backup', label: t('mfa.challenge.tabBackup') },
		{ key: 'push', label: t('mfa.challenge.tabPush') },
	];

	return (
		<AuthCard>
			<AuthHeader title={t('mfa.challenge.title')} subtitle={t('mfa.challenge.subtitle')} />

			<div className="flex rounded-md bg-[var(--color-bg-muted)] p-1">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						type="button"
						onClick={() => {
							setActiveTab(tab.key);
							setError('');
						}}
						className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
							activeTab === tab.key
								? 'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-sm'
								: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			{error && (
				<div className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm text-danger">
					{error}
				</div>
			)}

			{riskLevel && (
				<div
					className={`rounded-md p-3 text-sm font-medium ${
						riskLevel === 'low'
							? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]'
							: riskLevel === 'medium'
								? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]'
								: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'
					}`}
					data-testid="mfa-risk-level-banner"
				>
					{riskLevel === 'low' && t('mfa.riskLevel.low')}
					{riskLevel === 'medium' && t('mfa.riskLevel.medium')}
					{riskLevel === 'high' && t('mfa.riskLevel.high')}
				</div>
			)}

			{sendSuccess && (
				<div className="rounded-md bg-[var(--color-success)]/10 p-3 text-sm text-[var(--color-success)]">
					{sendSuccess}
				</div>
			)}

			{activeTab === 'totp' && (
				<form
					onSubmit={totpForm.handleSubmit((data) => handleSubmit(data.code, 'totp'))}
					className="space-y-4"
				>
					<div className="space-y-2">
						<Label htmlFor="totp-code">{t('mfa.challenge.totpLabel')}</Label>
						<Input
							id="totp-code"
							type="text"
							inputMode="numeric"
							maxLength={6}
							placeholder={t('mfa.challenge.codePlaceholder')}
							autoFocus
							{...totpForm.register('code')}
							error={totpForm.formState.errors.code?.message}
						/>
						<p className="text-xs text-[var(--color-text-secondary)]">
							{t('mfa.challenge.totpHelp')}
						</p>
					</div>
					<TrustDeviceCheckbox trustDevice={trustDevice} setTrustDevice={setTrustDevice} t={t} />
					<Button type="submit" fullWidth isLoading={submitting}>
						{t('mfa.challenge.verify')}
					</Button>
				</form>
			)}

			{activeTab === 'sms' && (
				<form
					onSubmit={smsForm.handleSubmit((data) => handleSubmit(data.code, 'sms'))}
					className="space-y-4"
				>
					<div className="space-y-2">
						<Label htmlFor="sms-code">{t('mfa.challenge.smsLabel')}</Label>
						<Input
							id="sms-code"
							type="text"
							inputMode="numeric"
							maxLength={6}
							placeholder={t('mfa.challenge.codePlaceholder')}
							autoFocus
							{...smsForm.register('code')}
							error={smsForm.formState.errors.code?.message}
						/>
					</div>
					<TrustDeviceCheckbox trustDevice={trustDevice} setTrustDevice={setTrustDevice} t={t} />
					<div className="flex gap-2">
						<Button type="submit" fullWidth isLoading={submitting}>
							{t('mfa.challenge.verify')}
						</Button>
						<Button
							type="button"
							variant="outline"
							disabled={smsCountdown.countdown > 0}
							onClick={handleSendSMS}
						>
							{smsCountdown.countdown > 0
								? `${t('mfa.challenge.retry')} (${smsCountdown.countdown}s)`
								: t('mfa.challenge.getCode')}
						</Button>
					</div>
				</form>
			)}

			{activeTab === 'email' && (
				<form
					onSubmit={emailForm.handleSubmit((data) => handleSubmit(data.code, 'email'))}
					className="space-y-4"
				>
					<div className="space-y-2">
						<Label htmlFor="email-code">{t('mfa.challenge.emailLabel')}</Label>
						<Input
							id="email-code"
							type="text"
							inputMode="numeric"
							maxLength={6}
							placeholder={t('mfa.challenge.codePlaceholder')}
							autoFocus
							{...emailForm.register('code')}
							error={emailForm.formState.errors.code?.message}
						/>
					</div>
					<TrustDeviceCheckbox trustDevice={trustDevice} setTrustDevice={setTrustDevice} t={t} />
					<div className="flex gap-2">
						<Button type="submit" fullWidth isLoading={submitting}>
							{t('mfa.challenge.verify')}
						</Button>
						<Button
							type="button"
							variant="outline"
							disabled={emailCountdown.countdown > 0}
							onClick={handleSendEmail}
						>
							{emailCountdown.countdown > 0
								? `${t('mfa.challenge.retry')} (${emailCountdown.countdown}s)`
								: t('mfa.challenge.sendCode')}
						</Button>
					</div>
				</form>
			)}

			{activeTab === 'backup' && (
				<form
					onSubmit={backupForm.handleSubmit((data) => handleSubmit(data.code, 'backup'))}
					className="space-y-4"
				>
					<div className="space-y-2">
						<Label htmlFor="backup-code">{t('mfa.challenge.backupLabel')}</Label>
						<Input
							id="backup-code"
							type="text"
							maxLength={8}
							placeholder={t('mfa.challenge.backupPlaceholder')}
							autoFocus
							{...backupForm.register('code')}
							error={backupForm.formState.errors.code?.message}
						/>
						<p className="text-xs text-[var(--color-text-secondary)]">
							{t('mfa.challenge.backupHelp')}
						</p>
					</div>
					<TrustDeviceCheckbox trustDevice={trustDevice} setTrustDevice={setTrustDevice} t={t} />
					<Button type="submit" fullWidth isLoading={submitting}>
						{t('mfa.challenge.verify')}
					</Button>
				</form>
			)}

			{activeTab === 'push' && (
				<div className="space-y-4">
					{pushStatus === 'idle' && (
						<>
							<p className="text-sm text-[var(--color-text-secondary)]">
								{t('mfa.challenge.pushDesc')}
							</p>
							<Button type="button" fullWidth onClick={handlePushChallenge}>
								{t('mfa.challenge.sendPush')}
							</Button>
						</>
					)}
					{pushStatus === 'pending' && (
						<div className="space-y-4 text-center">
							<div className="rounded-lg border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10 p-6">
								<p className="text-sm text-[var(--color-brand)]">
									{t('mfa.challenge.pushPendingDesc')}
								</p>
								{pushNumberMatching && (
									<div className="mt-4">
										<p className="text-xs text-[var(--color-text-secondary)] mb-1">
											{t('mfa.challenge.pushNumberLabel')}
										</p>
										<span className="text-3xl font-bold tracking-widest text-[var(--color-brand)]">
											{pushNumberMatching}
										</span>
									</div>
								)}
								<div className="mt-4 flex items-center justify-center gap-2">
									<div className="h-3 w-3 animate-pulse rounded-full bg-[var(--color-brand)]" />
									<span className="text-xs text-[var(--color-brand)]">
										{t('mfa.challenge.pushWaiting')} ({pushCountdown.countdown}s)
									</span>
								</div>
							</div>
							<Button
								type="button"
								variant="outline"
								fullWidth
								onClick={() => {
									setPushStatus('idle');
									if (pollRef.current) clearInterval(pollRef.current);
								}}
							>
								{t('mfa.challenge.cancel')}
							</Button>
						</div>
					)}
					{pushStatus === 'approved' && (
						<div className="rounded-lg border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 p-6 text-center">
							<p className="text-[var(--color-success)] font-medium">
								{t('mfa.challenge.pushApproved')}
							</p>
						</div>
					)}
					{pushStatus === 'denied' && (
						<div className="space-y-4">
							<div className="rounded-lg border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10 p-6 text-center">
								<p className="text-[var(--color-danger)]">{t('mfa.challenge.pushDenied')}</p>
							</div>
							<Button type="button" fullWidth onClick={handlePushChallenge}>
								{t('mfa.challenge.retry')}
							</Button>
						</div>
					)}
					{pushStatus === 'expired' && (
						<div className="space-y-4">
							<p className="text-sm text-[var(--color-text-secondary)] text-center">
								{t('mfa.challenge.pushExpiredTitle')}
							</p>
							<Button type="button" fullWidth onClick={handlePushChallenge}>
								{t('mfa.challenge.retry')}
							</Button>
						</div>
					)}
				</div>
			)}

			<div className="text-center text-sm">
				<Link to={tenantSlug ? `/${tenantSlug}/login` : '/'} className="text-[var(--color-brand)] hover:underline">
					{t('mfa.challenge.backToLogin')}
				</Link>
			</div>
		</AuthCard>
	);
}
