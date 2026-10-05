'use client';

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Label } from '@autional-cn/ui';
import {
	loginWithTokens,
	decodeJwtPayload,
	extractApiError,
	usePublicTenantSlugs,
} from '@autional-cn/shared';
import { createMfaTOTPSchema, createMfaSMSSchema } from '@/lib/validators';
import type { MFATOTPFormData, MFASMSFormData } from '@/lib/validators';
import { verifyMFAChallenge } from '@/lib/api.generated';
import { anchorSessionFromToken } from '@/lib/anchor-session';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';

type CodeMethod = 'totp' | 'sms' | 'email' | 'backup';

// 登录页/mfa-setup 写入的挑战会话（oauth/callback 写入子集：无 email/phone/riskLevel）
interface PreAuthData {
	challengeToken: string;
	tenantId?: string;
	riskLevel?: string;
	requiredMfaMethods?: string[];
	email?: string;
	phone?: string;
}

const CODE_METHOD_ORDER: CodeMethod[] = ['totp', 'sms', 'email', 'backup'];

// identity 挑战错误码（610004xx）：403 无效/过期挑战令牌 → 回登录；400 验证码错误 → 留本页
const IDENTITY_ERR_MFA_CHALLENGE_REQUIRED = 61000403;
const IDENTITY_ERR_INVALID_MFA_CODE = 61000402;

// 展示用脱敏（仅渲染，不参与鉴权）
function maskContact(value: string): string {
	if (!value) return '';
	if (value.includes('@')) {
		const [local, domain] = value.split('@');
		return `${local.slice(0, 2)}***@${domain}`;
	}
	return value.replace(/^(\+?\d{3})\d+(\d{4})$/, '$1****$2');
}

/**
 * 可见验证方式 = requiredMfaMethods 中的可验证码方法（password 是基线、webauthn 无码面）；
 * 交集为空（如 MFAEnabled 用户在 normal/low 风险下 required=["password"]）→ 回落全部码方法。
 * 备用码与 TOTP 同腿验证（mfa 侧 ValidateTOTP 内含一次性消费回退），随 TOTP 一并展示。
 */
function deriveTabs(required?: string[]): CodeMethod[] {
	const policy = (required || []).filter(
		(m): m is 'totp' | 'sms' | 'email' => m === 'totp' || m === 'sms' || m === 'email',
	);
	const base: CodeMethod[] = policy.length > 0 ? policy : ['totp', 'sms', 'email'];
	const withBackup: CodeMethod[] = base.includes('totp') ? [...base, 'backup'] : base;
	return CODE_METHOD_ORDER.filter((m) => withBackup.includes(m));
}

type BackupFormData = { code: string };

export default function MFAChallengePage() {
	const { t, lang } = useI18n();
	const navigate = useNavigate();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const loginPath = tenantSlug ? `/${tenantSlug}/login` : '/';
	const dashboardPath = tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard';
	const { data: knownTenants } = usePublicTenantSlugs();

	const mfaTotpSchema = createMfaTOTPSchema(t);
	const mfaSmsSchema = createMfaSMSSchema(t);
	const backupSchema = useMemo(
		() =>
			z.object({
				code: z.string().length(8, t('validation.backupCodeLength')),
			}),
		[lang, t],
	);

	const [preAuth, setPreAuth] = useState<PreAuthData | null>(null);
	const [fatal, setFatal] = useState<'' | 'expired'>('');
	const [activeTab, setActiveTab] = useState<CodeMethod>('totp');
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	// AUTH-36：挂载即校验挑战会话（存在性 + 签名令牌未过期）；无效不渲染死表单
	useEffect(() => {
		const raw = sessionStorage.getItem('mfa_pre_auth');
		if (!raw) {
			navigate(loginPath, { replace: true });
			return;
		}
		let parsed: PreAuthData | null = null;
		try {
			parsed = JSON.parse(raw);
		} catch {
			parsed = null;
		}
		const payload = parsed?.challengeToken ? decodeJwtPayload(parsed.challengeToken) : null;
		const exp = typeof (payload as any)?.exp === 'number' ? (payload as any).exp : 0;
		if (!parsed?.challengeToken || !payload || exp <= 0 || exp * 1000 <= Date.now()) {
			sessionStorage.removeItem('mfa_pre_auth');
			setFatal('expired');
			return;
		}
		setPreAuth(parsed);
	}, [navigate, loginPath]);

	const tabs = useMemo(() => deriveTabs(preAuth?.requiredMfaMethods), [preAuth]);

	useEffect(() => {
		if (preAuth && !tabs.includes(activeTab)) {
			setActiveTab(tabs[0]);
		}
	}, [preAuth, tabs, activeTab]);

	const totpForm = useForm<MFATOTPFormData>({ resolver: zodResolver(mfaTotpSchema) });
	const smsForm = useForm<MFASMSFormData>({ resolver: zodResolver(mfaSmsSchema) });
	const emailForm = useForm<MFASMSFormData>({ resolver: zodResolver(mfaSmsSchema) });
	const backupForm = useForm<BackupFormData>({ resolver: zodResolver(backupSchema) });

	const handleSubmit = async (code: string, type: CodeMethod) => {
		if (!preAuth) return;
		setSubmitting(true);
		setError('');
		try {
			// 显式方法映射（AUTH-38：backup 不塌缩为 totp；identity 侧 totp/backup 同腿验证）
			const res: any = await verifyMFAChallenge({
				challengeToken: preAuth.challengeToken,
				code,
				mfaMethod: type,
			});
			loginWithTokens(res?.accessToken || '', res?.refreshToken || '', res?.user);
			// AUTH-53 约束⑤：会话建立即锚定租户（tenantId = 登录页写入的权威值；
			// oauth 挑战链无 tenantId → 由 JWT claim 兜底）
			anchorSessionFromToken(res?.accessToken || '', {
				slug: tenantSlug || null,
				tenantId: preAuth.tenantId || null,
				knownTenants,
			});
			sessionStorage.removeItem('mfa_pre_auth');
			navigate(dashboardPath);
		} catch (err) {
			const status = (err as any)?.response?.status;
			const numeric = Number((err as any)?.response?.data?.code);
			// 挑战令牌已失效（服务端复验口径）→ 清会话，引导重新登录
			if (status === 403 || numeric === IDENTITY_ERR_MFA_CHALLENGE_REQUIRED) {
				sessionStorage.removeItem('mfa_pre_auth');
				setPreAuth(null);
				setFatal('expired');
				return;
			}
			if (numeric === IDENTITY_ERR_INVALID_MFA_CODE) {
				setError(t('mfa.challenge.verifyFailed'));
				return;
			}
			if (status === 429) {
				setError(t('mfa.challenge.rateLimited'));
				return;
			}
			setError(extractApiError(err, t('mfa.challenge.verifyFailed')).message);
		} finally {
			setSubmitting(false);
		}
	};

	// 验证会话已过期（挂载预检或服务端 403 复验）——引导重新登录
	if (fatal === 'expired') {
		return (
			<AuthCard>
				<div className="text-center space-y-6">
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
						⏱️
					</div>
					<AuthHeader
						title={t('mfa.challenge.sessionExpiredTitle')}
						subtitle={t('mfa.challenge.sessionExpiredDesc')}
					/>
					<Button fullWidth onClick={() => navigate(loginPath, { replace: true })}>
						{t('mfa.challenge.sessionExpiredAction')}
					</Button>
				</div>
			</AuthCard>
		);
	}

	// 预检未完成（首帧/跳转中）——不渲染表单
	if (!preAuth) {
		return (
			<AuthCard>
				<div className="py-8 text-center text-sm text-[var(--color-text-secondary)]">
					{t('common.loading')}
				</div>
			</AuthCard>
		);
	}

	const tabLabel = (key: CodeMethod) =>
		key === 'totp'
			? t('mfa.challenge.tabTOTP')
			: key === 'sms'
				? t('mfa.challenge.tabSMS')
				: key === 'email'
					? t('mfa.challenge.tabEmail')
					: t('mfa.challenge.tabBackup');

	return (
		<AuthCard>
			<AuthHeader title={t('mfa.challenge.title')} subtitle={t('mfa.challenge.subtitle')} />

			{tabs.length > 1 && (
				<div className="flex rounded-md bg-[var(--color-bg-muted)] p-1">
					{tabs.map((key) => (
						<button
							key={key}
							type="button"
							onClick={() => {
								setActiveTab(key);
								setError('');
							}}
							className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
								activeTab === key
									? 'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-sm'
									: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
							}`}
						>
							{tabLabel(key)}
						</button>
					))}
				</div>
			)}

			{error && (
				<div className="rounded-md bg-danger/10 p-3 text-sm text-danger">
					{error}
				</div>
			)}

			{preAuth.riskLevel && (
				<div
					className={`rounded-md p-3 text-sm font-medium ${
						preAuth.riskLevel === 'low'
							? 'bg-brand/10 text-[var(--color-brand)]'
							: preAuth.riskLevel === 'medium'
								? 'bg-warning/10 text-[var(--color-warning)]'
								: 'bg-danger/10 text-[var(--color-danger)]'
					}`}
					data-testid="mfa-risk-level-banner"
				>
					{preAuth.riskLevel === 'low' && t('mfa.riskLevel.low')}
					{preAuth.riskLevel === 'medium' && t('mfa.riskLevel.medium')}
					{preAuth.riskLevel === 'high' && t('mfa.riskLevel.high')}
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
						<p className="text-xs text-[var(--color-text-secondary)]">
							{preAuth.phone
								? t('mfa.challenge.smsDelivered', { target: maskContact(preAuth.phone) })
								: t('mfa.challenge.smsDeliveredGeneric')}
						</p>
					</div>
					<Button type="submit" fullWidth isLoading={submitting}>
						{t('mfa.challenge.verify')}
					</Button>
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
						<p className="text-xs text-[var(--color-text-secondary)]">
							{preAuth.email
								? t('mfa.challenge.emailDelivered', { target: maskContact(preAuth.email) })
								: t('mfa.challenge.emailDeliveredGeneric')}
						</p>
					</div>
					<Button type="submit" fullWidth isLoading={submitting}>
						{t('mfa.challenge.verify')}
					</Button>
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
					<Button type="submit" fullWidth isLoading={submitting}>
						{t('mfa.challenge.verify')}
					</Button>
				</form>
			)}

			<div className="text-center text-sm">
				<Link to={loginPath} className="text-[var(--color-brand)] hover:underline">
					{t('mfa.challenge.backToLogin')}
				</Link>
			</div>
		</AuthCard>
	);
}
