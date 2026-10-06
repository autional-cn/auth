'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@autional/ui';
import { extractApiError } from '@autional/shared';
import { createVerifyPhoneSchema } from '@/lib/validators';
import type { VerifyPhoneFormData } from '@/lib/validators';
import { sendSmsCode, verifyPhone } from '@/lib/api.generated';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';

const COOLDOWN_SECONDS = 60;

export default function VerifyPhonePage() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const schema = createVerifyPhoneSchema(t);
	const [countdown, setCountdown] = useState(0);
	const [sending, setSending] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		trigger,
		formState: { errors },
	} = useForm<VerifyPhoneFormData>({
		resolver: zodResolver(schema),
	});

	const phoneValue = watch('phone');

	// AUTH-28：错误分流（不再只读 data.message——RFC7807 无此字段，服务端语义被吞）。
	// 后端 Problem 契约带 i18n_key（如 error.phone_invalid_format / error.invalid_verification_code /
	// error.otp.too_many_attempts）时按本地化键渲染；键未登记（含自动 error.<码>）不直出
	// 服务端英文——429 走限流文案，余者落通用文案。
	const resolveErrorMessage = useCallback(
		(err: unknown, fallbackKey: string): string => {
			const { i18nKey } = extractApiError(err, '');
			const localized = i18nKey ? t(i18nKey, '') : '';
			if (localized) return localized;
			if ((err as any)?.response?.status === 429) return t('auth.verifyPhone.rateLimited');
			return t(fallbackKey);
		},
		[t],
	);

	useEffect(() => {
		if (countdown <= 0) return;
		const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
		return () => clearTimeout(timer);
	}, [countdown]);

	const handleSendCode = useCallback(async () => {
		if (countdown > 0 || sending) return;
		// AUTH-27：格式门控先行——无效手机号不发请求，错误以内联字段提示呈现
		if (!(await trigger('phone'))) return;
		setSending(true);
		setError('');
		try {
			await sendSmsCode({ phone: phoneValue });
			setCountdown(COOLDOWN_SECONDS);
		} catch (err: any) {
			setError(resolveErrorMessage(err, 'auth.verifyPhone.errorSendFailed'));
		} finally {
			setSending(false);
		}
	}, [phoneValue, countdown, sending, trigger, resolveErrorMessage]);

	const onSubmit = async (_data: VerifyPhoneFormData) => {
		setSubmitting(true);
		setError('');
		try {
			await verifyPhone({ phone: _data.phone, code: _data.code });
			setSuccess(true);
			setTimeout(() => {
				navigate(tenantSlug ? `/${tenantSlug}/login` : '/');
			}, 2000);
		} catch (err: any) {
			setError(resolveErrorMessage(err, 'auth.verifyPhone.errorVerifyFailed'));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<AuthCard>
			<AuthHeader title={t('auth.verifyPhone.title')} subtitle={t('auth.verifyPhone.subtitle')} />

			{success ? (
				<div className="space-y-4">
					<div className="rounded-md bg-success/10 p-4 text-center text-sm text-success-text">
						{t('auth.verifyPhone.success')}
					</div>
					<Link to={tenantSlug ? `/${tenantSlug}/login` : '/'}>
						<Button fullWidth variant="outline">
							{t('auth.common.goToLogin')}
						</Button>
					</Link>
				</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="phone">{t('auth.verifyPhone.phoneLabel')}</Label>
						<div className="flex gap-2">
							<Input
								id="phone"
								type="tel"
								placeholder={t('auth.verifyPhone.phonePlaceholder')}
								className="flex-1"
								{...register('phone')}
								error={errors.phone?.message}
							/>
							<Button
								type="button"
								variant="outline"
								disabled={!phoneValue || countdown > 0 || sending}
								onClick={handleSendCode}
								isLoading={sending}
							>
								{countdown > 0
									? t('auth.verifyPhone.countdown', { seconds: countdown })
									: t('auth.verifyPhone.getCode')}
							</Button>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="code">{t('auth.verifyPhone.codeLabel')}</Label>
						<Input
							id="code"
							type="text"
							inputMode="numeric"
							maxLength={6}
							placeholder={t('auth.verifyPhone.codePlaceholder')}
							{...register('code')}
							error={errors.code?.message}
						/>
					</div>

					{error && (
						<div className="rounded-md bg-danger/10 p-3 text-sm text-danger-text">
							{error}
						</div>
					)}

					<Button type="submit" fullWidth isLoading={submitting}>
						{t('auth.verifyPhone.submit')}
					</Button>
				</form>
			)}

			<div className="text-center text-sm">
				<Link
					to={tenantSlug ? `/${tenantSlug}/login` : '/'}
					className="text-brand-text hover:underline"
				>
					{t('auth.common.backToLogin')}
				</Link>
			</div>
		</AuthCard>
	);
}
