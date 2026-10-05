'use client';

import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Label } from '@autional-cn/ui';
import { useAuthStore, END_USER_PORTAL_URL, crossAppUrl, isValidRedirect } from '@autional-cn/shared';
import { authMePasswordPut, PublicAuthConfigByAuthConfig } from '@autional-cn/shared/generated/api';
import { checkPasswordBreached } from '@/lib/breach-check';
import { processPasswordForTransmission } from '@/lib/password-transmission';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { usePageTitle } from '@/hooks/use-page-title';
import { PasswordInput } from '@/components/form/PasswordInput';
import { type PasswordPolicy } from '@/hooks/use-tenant-auth-config';
import RedirectCountdown from '@/components/ui/RedirectCountdown';

function createPasswordSchema(
	policy: PasswordPolicy | undefined,
	t: (key: string, params?: Record<string, unknown>) => string,
) {
	const minLength = policy?.minLength || 8;
	const maxLength = policy?.maxLength || 128;
	let schema = z
		.string()
		.min(minLength, t('auth.password.minLength', { minLength }))
		.max(maxLength, t('auth.password.maxLength', { maxLength }));
	if (policy?.requireUpper) {
		schema = schema.regex(/[A-Z]/, t('auth.password.requireUpper'));
	}
	if (policy?.requireLower) {
		schema = schema.regex(/[a-z]/, t('auth.password.requireLower'));
	}
	if (policy?.requireDigit) {
		schema = schema.regex(/\d/, t('auth.password.requireDigit'));
	}
	if (policy?.requireSpecial) {
		schema = schema.regex(/[^a-zA-Z0-9]/, t('auth.password.requireSpecial'));
	}
	return schema;
}

function buildChangePasswordSchema(
	policy: PasswordPolicy | undefined,
	t: (key: string, params?: Record<string, unknown>) => string,
) {
	const passwordSchema = createPasswordSchema(policy, t);
	return z
		.object({
			oldPassword: z.string().min(1, t('auth.password.oldPasswordRequired')),
			newPassword: passwordSchema,
			confirmPassword: z.string().min(1, t('auth.password.confirmRequired')),
		})
		.refine((data) => data.newPassword === data.confirmPassword, {
			message: t('auth.password.mismatch'),
			path: ['confirmPassword'],
		});
}

type FormData = z.infer<ReturnType<typeof buildChangePasswordSchema>>;

interface PolicyRequirement {
	key: string;
	label: string;
	met: (password: string) => boolean;
}

function getPolicyRequirements(
	policy: PasswordPolicy | undefined,
	t: (key: string, params?: Record<string, unknown>) => string,
): PolicyRequirement[] {
	const items: PolicyRequirement[] = [];
	const minLen = policy?.minLength || 8;
	items.push({
		key: 'minLength',
		label: t('auth.password.minLengthReq', { minLen }),
		met: (p) => p.length >= minLen,
	});
	if (policy?.requireUpper) {
		items.push({
			key: 'upper',
			label: t('auth.password.upperReq'),
			met: (p) => /[A-Z]/.test(p),
		});
	}
	if (policy?.requireLower) {
		items.push({
			key: 'lower',
			label: t('auth.password.lowerReq'),
			met: (p) => /[a-z]/.test(p),
		});
	}
	if (policy?.requireDigit) {
		items.push({
			key: 'digit',
			label: t('auth.password.digitReq'),
			met: (p) => /\d/.test(p),
		});
	}
	if (policy?.requireSpecial) {
		items.push({
			key: 'special',
			label: t('auth.password.specialReq'),
			met: (p) => /[^a-zA-Z0-9]/.test(p),
		});
	}
	return items;
}

export default function ChangePasswordPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const { t } = useI18n();
	usePageTitle('changePassword.forceTitle');

	const mode = searchParams.get('mode'); // 'force' | null
	const token = searchParams.get('token') || '';
	const isForceMode = mode === 'force';

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	// Extract policy from query param or store (JSON encoded)
	const policyParam = searchParams.get('policy');
	const policy: PasswordPolicy | undefined = useMemo(() => {
		if (policyParam) {
			try {
				return JSON.parse(decodeURIComponent(policyParam));
			} catch {
				return undefined;
			}
		}
		return undefined;
	}, [policyParam]);

	const schema = useMemo(() => buildChangePasswordSchema(policy, t), [policy, t]);
	const requirements = useMemo(() => getPolicyRequirements(policy, t), [policy, t]);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	const newPassword = watch('newPassword');

	const onSubmit = async (data: FormData) => {
		setError('');

		// HIBP k-anonymity breach check — per NIST SP 800-63B §5.1.1.2
		try {
			const breachCheck = await checkPasswordBreached(data.newPassword);
			if (breachCheck.breached) {
				setError(
					`此密码已在 ${breachCheck.count} 次数据泄露中出现，极易被攻击者破解。请选择其他密码。`,
				);
				return;
			}
		} catch {
			// Breach check API unavailable — fail-open, strength already checked locally
		}

		setLoading(true);
		try {
			// 密码传输预处理 (遵循租户策略)
			const tenantId = useAuthStore.getState().currentTenantId || '';
			// 2026-08-17 安全修复：禁止硬编码 plain。
			// 后端恒返回 password_transmission（GetPasswordPolicy 有全局默认兜底）；
			// undefined/空串 = 契约错误必须抛错暴露，不能降级明文（hash/symmetric 租户会 61000104）。
			const authConfig = await PublicAuthConfigByAuthConfig(tenantId);
			const mode = authConfig?.passwordPolicy?.passwordTransmission;
			if (mode === undefined || mode === '' || mode === null) {
				throw new Error(
					'password transmission mode is missing from tenant auth-config (contract error)',
				);
			}
			const transmissionResult = await processPasswordForTransmission(
				data.newPassword,
				mode,
				tenantId,
				undefined,
			);
			// AUTH-19: 旧密码必须与新密码同款传输处理 —— 后端 changePasswordCore 把
			// old_password 原样交给 hashClient.Verify，hash 租户下裸明文必 401。
			const oldTransmissionResult = await processPasswordForTransmission(
				data.oldPassword,
				mode,
				tenantId,
				undefined,
			);

			const payload: Record<string, string> = {
				oldPassword: oldTransmissionResult.password,
				newPassword: transmissionResult.password,
				passwordTransmission: transmissionResult.passwordTransmission,
			};
			if (isForceMode && token) {
				payload.forceToken = token;
			}
			await authMePasswordPut(payload as any);

			setSuccess(true);
		} catch (err: any) {
			// 40800005 = ErrCodePasswordMismatch（旧密码校验失败）；401 另外涵盖令牌无效，不能混用。
			const errCode = Number(err?.response?.data?.code);
			const message =
				errCode === 40800005
					? t('auth.password.oldPasswordWrong') || '当前密码不正确'
					: err?.response?.data?.message || '修改密码失败，请稍后重试';
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		const redirect = searchParams.get('redirect');
		const redirectTarget =
			redirect && isValidRedirect(redirect)
				? redirect
				: (tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard');
		return (
			<RedirectCountdown
				title={
					isForceMode
						? t('auth.password.setSuccess') || '密码设置成功'
						: t('auth.password.changeSuccess') || '密码修改成功'
				}
				subtitle={t('auth.common.redirectingIn') || '{{seconds}} 秒后自动跳转...'}
				continueLabel={t('auth.common.continue') || '继续'}
				onContinue={() => {
					if (isForceMode && redirectTarget) {
						window.location.href = redirectTarget;
					} else if (isForceMode) {
						navigate('/dashboard');
					} else {
						navigate(tenantSlug ? `/${tenantSlug}/account` : '/account');
					}
				}}
			/>
		);
	}

	return (
		<AuthCard>
			{/* Force mode banner */}
			{isForceMode && (
				<div className="rounded-md bg-amber-50 p-4 text-sm text-amber-800">
					<p className="font-medium">{t('changePassword.forceBanner')}</p>
				</div>
			)}

			<AuthHeader
				title={'🔒 ' + t('changePassword.forceTitle')}
				subtitle={isForceMode ? t('changePassword.firstLogin') : t('changePassword.expiredTitle')}
			/>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{/* Old password */}
				<div className="space-y-2">
					<Label htmlFor="oldPassword">{t('auth.password.oldPassword')}</Label>
					<PasswordInput
						id="oldPassword"
						autoComplete="current-password"
						placeholder={t('auth.password.oldPasswordPlaceholder')}
						{...register('oldPassword')}
						error={errors.oldPassword?.message}
					/>
				</div>

				{/* New password */}
				<div className="space-y-2">
					<Label htmlFor="newPassword">{t('auth.password.newPassword')}</Label>
					<PasswordInput
						id="newPassword"
						autoComplete="new-password"
						placeholder={t('auth.password.newPasswordPlaceholder')}
						showStrength
						{...register('newPassword')}
						error={errors.newPassword?.message}
					/>
				</div>

				{/* Password policy requirements */}
				{requirements.length > 0 && newPassword && (
					<div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-3 text-xs space-y-1">
						<p className="font-medium text-[var(--color-text-secondary)] mb-1">
							{t('auth.password.requirementsTitle')}
						</p>
						{requirements.map((req) => {
							const satisfied = req.met(newPassword);
							return (
								<div key={req.key} className="flex items-center gap-2">
									<span
										className={
											satisfied ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'
										}
									>
										{satisfied ? (
											<svg
												className="h-3.5 w-3.5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2}
											>
												<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
											</svg>
										) : (
											<svg
												className="h-3.5 w-3.5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										)}
									</span>
									<span
										className={
											satisfied
												? 'text-[var(--color-success)]'
												: 'text-[var(--color-text-secondary)]'
										}
									>
										{req.label}
									</span>
								</div>
							);
						})}
					</div>
				)}

				{/* Confirm password */}
				<div className="space-y-2">
					<Label htmlFor="confirmPassword">{t('auth.password.confirmPassword')}</Label>
					<PasswordInput
						id="confirmPassword"
						autoComplete="new-password"
						placeholder={t('auth.password.confirmPasswordPlaceholder')}
						{...register('confirmPassword')}
						error={errors.confirmPassword?.message}
					/>
				</div>

				{error && (
					<div className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm text-danger">
						{error}
					</div>
				)}

				<Button type="submit" fullWidth isLoading={loading}>
					{isForceMode ? t('auth.password.setBtn') : t('auth.password.changeBtn')}
				</Button>
			</form>

			{!isForceMode && (
				<div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 text-sm text-[var(--color-text-secondary)] space-y-1">
					<p>{t('changePassword.accountCenter')}</p>
					<a
						href={crossAppUrl(`${END_USER_PORTAL_URL()}/security`)}
						className="text-[var(--color-brand)] hover:underline font-medium"
					>
						{t('changePassword.goToAccountCenter')} →
					</a>
				</div>
			)}

			{/* Navigation (hidden in force mode) */}
			{!isForceMode && (
				<div className="text-center text-sm">
					<Link to={tenantSlug ? `/${tenantSlug}/account` : '/account'} className="text-[var(--color-brand)] hover:underline">
						{t('auth.password.backToAccount')}
					</Link>
				</div>
			)}
		</AuthCard>
	);
}
