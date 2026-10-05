'use client';

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@autional-cn/ui';
import { logout, useAuthStore } from '@autional-cn/shared';
import { createAccountDeletionSchema } from '@/lib/validators';
import type { AccountDeletionFormData } from '@/lib/validators';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useTenantAuthConfigBySlug } from '@/hooks/use-tenant-auth-config';
import { useEffectiveTenantSlug } from '@/hooks/use-tenant-slug';
import { userPortalUrl } from '@/lib/portal-links';
import {
	fetchPasswordTransmissionMode,
	processPasswordForTransmission,
} from '@/lib/password-transmission';
import { deleteAccount, reAuthenticate } from '@/lib/api.generated';

// 头名单点对齐后端 constant_cross.HeaderStepUpToken = "X-StepUp-Token"
const STEP_UP_HEADER = 'X-StepUp-Token';

// 业务错误码（identity）：61000104 = ErrPasswordMismatch（密码内容不匹配）；
// 40000502 = ErrInvalidPassword（兜底密码校验失败）；40800251 = ErrCodeStepUpRequired（HTTP 401）。
const ERR_PASSWORD_MISMATCH = 61000104;
const ERR_INVALID_PASSWORD = 40000502;
const ERR_STEP_UP_REQUIRED = 40800251;

export default function AccountDeletionPage() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const slug = useEffectiveTenantSlug();
	const schema = createAccountDeletionSchema(t);
	// AUTH-53 约束⑤：盐源权威值 = slug 配置的 tenantId（store 可能被跨租户残留污染）
	const { data: slugAuthConfig } = useTenantAuthConfigBySlug(tenantSlug || null);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<AccountDeletionFormData>({
		resolver: zodResolver(schema),
	});

	const passwordValue = watch('password');

	const onSubmit = async (_data: AccountDeletionFormData) => {
		setError('');
		setShowModal(true);
	};

	const confirmDelete = async () => {
		if (!passwordValue) {
			setError(t('deletion.passwordRequired'));
			setShowModal(false);
			return;
		}
		setLoading(true);
		setError('');
		try {
			// AUTH-42：删除端点由 RequireStepUp 中间件保护（identity sensitive 组），
			// 必须先经 re-authenticate 取单次 step-up token（防重放，一次一用），
			// 再携 X-StepUp-Token 调删除；两步密码均按租户传输模式预处理
			// （后端 VerifyPassword 原样校验，hash/symmetric 租户裸明文必 401）。
			const tenantId = slugAuthConfig?.tenantId || useAuthStore.getState().currentTenantId || '';
			const mode = await fetchPasswordTransmissionMode(tenantId);
			const transmission = await processPasswordForTransmission(
				passwordValue,
				mode,
				tenantId,
				undefined,
			);

			const reauth = await reAuthenticate({ password: transmission.password });
			const stepUpToken = reauth?.stepUpToken;
			if (!stepUpToken) {
				// 200 却无 step-up token = 服务端 step-up 密钥未配置（契约错误），fail-closed
				throw new Error('step-up token missing from re-authenticate response (contract error)');
			}

			await deleteAccount(
				{ password: transmission.password },
				{ headers: { [STEP_UP_HEADER]: stepUpToken } },
			);
			setSuccess(true);
			setShowModal(false);
			logout(tenantSlug ? `/${tenantSlug}/login?account_deleted=true` : '/login?account_deleted=true');
		} catch (err: any) {
			const errCode = Number(err?.response?.data?.code);
			if (errCode === ERR_STEP_UP_REQUIRED) {
				setError(t('deletion.reauthExpired'));
			} else if (errCode === ERR_PASSWORD_MISMATCH || errCode === ERR_INVALID_PASSWORD) {
				setError(t('auth.password.oldPasswordWrong'));
			} else {
				setError(err?.response?.data?.message || t('deletion.deleteGeneric'));
			}
			setShowModal(false);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<AuthCard>
				<AuthHeader title={t('deletion.success')} subtitle={t('deletion.successDesc')} />
				<Button fullWidth onClick={() => navigate(tenantSlug ? `/${tenantSlug}/login` : '/')}>
					{t('deletion.backHome')}
				</Button>
			</AuthCard>
		);
	}

	return (
		<>
			<AuthCard>
				<AuthHeader title={t('deletion.title')} subtitle={t('deletion.warning')} />

				<div className="rounded-md bg-[var(--color-danger)]/10 p-4 text-sm text-[var(--color-danger)]">
					<p className="font-semibold">{t('deletion.irreversible')}</p>
					<ul className="mt-2 list-inside list-disc space-y-1">
						<li>{t('deletion.itemProfile')}</li>
						<li>{t('deletion.itemHistory')}</li>
						<li>{t('deletion.itemNoLogin')}</li>
						<li>{t('deletion.itemGDPR')}</li>
					</ul>
				</div>

				<div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 text-sm text-[var(--color-text-secondary)] space-y-1">
					<p>{t('deletion.alsoInAccountCenter')}</p>
					<a
						href={userPortalUrl(slug, '/security')}
						className="text-[var(--color-brand)] hover:underline font-medium"
					>
						{t('deletion.goToAccountCenter')} →
					</a>
				</div>

				{error && (
					<div className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm text-danger">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="password">{t('deletion.password')}</Label>
						<Input
							id="password"
							type="password"
							autoComplete="current-password"
							placeholder={t('deletion.passwordPlaceholder')}
							{...register('password')}
							error={errors.password?.message}
						/>
					</div>
					<Button type="submit" variant="danger" fullWidth>
						{t('deletion.confirm')}
					</Button>
				</form>

				<div className="text-center text-sm">
					<button
						type="button"
						onClick={() => navigate(tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard')}
						className="text-[var(--color-brand)] hover:underline"
					>
						{t('deletion.cancel')}
					</button>
				</div>
			</AuthCard>

			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
					<div className="w-full max-w-sm rounded-lg bg-[var(--color-bg-surface)] p-6 shadow-lg">
						<h2 className="text-lg font-bold text-[var(--color-text-primary)]">
							{t('deletion.modalTitle')}
						</h2>
						<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
							{t('deletion.modalDesc')}
						</p>
						<div className="mt-6 flex gap-3">
							<Button
								variant="outline"
								fullWidth
								onClick={() => setShowModal(false)}
								disabled={loading}
							>
								{t('deletion.modalCancel')}
							</Button>
							<Button variant="danger" fullWidth isLoading={loading} onClick={confirmDelete}>
								{t('deletion.modalConfirm')}
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
