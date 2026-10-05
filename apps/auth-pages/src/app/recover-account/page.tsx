'use client';

import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { Button, Input, Label } from '@autional-cn/ui';
import {
	authRecoverAccountPost,
	authRecoverAccountResetPost,
	PublicAuthConfigBySlugByBySlug,
} from '@autional-cn/shared/generated/api';
import { processPasswordForTransmission } from '@autional-cn/shared';
import { useI18n } from '@/lib/i18n';
import { usePageTitle } from '@/hooks/use-page-title';
import { PasswordInput } from '@/components/form/PasswordInput';
import { useTenantBrandingStore } from '@autional-cn/shared/branding';

export default function RecoverAccountPage() {
	const { t } = useI18n();
	usePageTitle('auth.recoverAccount.title');
	const logoUrl = useTenantBrandingStore((s) => s.branding?.logoUrl);

	const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
	const [identity, setIdentity] = useState('');
	const [maskedTarget, setMaskedTarget] = useState('');
	const [code, setCode] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const { tenantSlug: slugParam } = useParams();
	const tenantSlug = slugParam || null;

	const handleRequestRecovery = async () => {
		if (!identity.trim()) return;
		setLoading(true);
		setError('');
		try {
			const res = await authRecoverAccountPost({ identity: identity.trim() });
			// 反枚举一致响应：账号是否存在都进入验证步（提示统一，不泄露账号存在性）
			setMaskedTarget(res?.maskedTo || '');
			setStep('reset');
		} catch (err: any) {
			setError(err?.response?.data?.message || t('auth.recoverAccount.requestFailed'));
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async () => {
		if (!code.trim() || !newPassword || newPassword.length < 8) return;
		setLoading(true);
		setError('');
		try {
			// 2026-08-17 修复：必须根据租户配置决定密码传输模式。
			// tenantSlug 缺失 = 无法确定模式，不能静默发明文（hash 租户会 61000104）。
			if (!tenantSlug) {
				throw new Error('recover-account tenant context missing, cannot determine password transmission mode');
			}
			const authConfig = await PublicAuthConfigBySlugByBySlug(tenantSlug);
			const mode = authConfig?.passwordPolicy?.passwordTransmission;
			if (mode === undefined || mode === '' || mode === null) {
				throw new Error(
					'password transmission mode is missing from tenant auth-config (contract error)',
				);
			}
			const tenantId = (authConfig as any)?.tenantId || (authConfig as any)?.tenant_id || '';
			if (!tenantId) {
				throw new Error('tenant id missing from auth-config, cannot hash password');
			}
			const transmissionResult = await processPasswordForTransmission(
				newPassword,
				mode,
				tenantId,
				undefined,
			);
			await authRecoverAccountResetPost({
				identity: identity.trim(),
				code: code.trim(),
				newPassword: transmissionResult.password,
				passwordTransmission: transmissionResult.passwordTransmission,
			});
			setStep('success');
		} catch (err: any) {
			setError(err?.response?.data?.message || t('auth.recoverAccount.resetFailed'));
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthCard logoUrl={logoUrl}>
			<AuthHeader
				title={t('auth.recoverAccount.title')}
				subtitle={t('auth.recoverAccount.subtitle')}
			/>

			{step === 'request' && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleRequestRecovery();
					}}
					className="space-y-4"
				>
					<div className="space-y-2">
						<Label htmlFor="identity">{t('auth.recoverAccount.identityLabel')}</Label>
						<Input
							id="identity"
							type="text"
							placeholder="user@example.com / 13800138000"
							value={identity}
							onChange={(e) => setIdentity(e.target.value)}
						/>
					</div>
					{error && (
						<div className="rounded-md bg-danger/10 p-3 text-sm text-[var(--color-danger)]">
							{error}
						</div>
					)}
					<Button type="submit" fullWidth isLoading={loading}>
						{t('auth.recoverAccount.sendCode')}
					</Button>
				</form>
			)}

			{step === 'reset' && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleResetPassword();
					}}
					className="space-y-4"
				>
					<div className="rounded-md bg-[var(--color-bg-muted)] p-3 text-sm text-[var(--color-text-secondary)]">
						{maskedTarget
							? t('auth.recoverAccount.codeSent', { target: maskedTarget })
							: t('auth.recoverAccount.codeSentGeneric')}
					</div>
					<div className="space-y-2">
						<Label htmlFor="code">{t('auth.recoverAccount.codeLabel')}</Label>
						<Input
							id="code"
							type="text"
							placeholder="000000"
							maxLength={6}
							value={code}
							onChange={(e) => setCode(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="newPassword">{t('auth.recoverAccount.newPasswordLabel')}</Label>
						<PasswordInput
							id="newPassword"
							showStrength
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</div>
					{error && (
						<div className="rounded-md bg-danger/10 p-3 text-sm text-[var(--color-danger)]">
							{error}
						</div>
					)}
					<Button type="submit" fullWidth isLoading={loading}>
						{t('auth.recoverAccount.resetPassword')}
					</Button>
				</form>
			)}

			{step === 'success' && (
				<div className="space-y-4 text-center">
					<div className="rounded-lg bg-success/10 p-6">
						<p className="text-sm font-medium text-[var(--color-success)]">
							{t('auth.recoverAccount.success')}
						</p>
					</div>
					<Link
						to={tenantSlug ? `/${tenantSlug}/login` : '/login'}
						className="inline-flex items-center text-sm text-[var(--color-brand)] hover:underline"
					>
						{t('auth.recoverAccount.backToLogin')}
					</Link>
				</div>
			)}

			<div className="text-center text-sm mt-4">
				<Link to={tenantSlug ? `/${tenantSlug}/login` : '/login'} className="text-[var(--color-brand)] hover:underline">
					{t('auth.recoverAccount.back')}
				</Link>
			</div>
		</AuthCard>
	);
}
