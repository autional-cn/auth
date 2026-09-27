'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@autional-cn/ui';
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
		formState: { errors },
	} = useForm<VerifyPhoneFormData>({
		resolver: zodResolver(schema),
	});

	const phoneValue = watch('phone');

	useEffect(() => {
		if (countdown <= 0) return;
		const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
		return () => clearTimeout(timer);
	}, [countdown]);

	const handleSendCode = useCallback(async () => {
		if (!phoneValue || countdown > 0) return;
		setSending(true);
		setError('');
		try {
			await sendSmsCode({ phone: phoneValue });
			setCountdown(COOLDOWN_SECONDS);
		} catch (err: any) {
			setError(err.response?.data?.message || t('auth.verifyPhone.errorSendFailed'));
		} finally {
			setSending(false);
		}
	}, [phoneValue, countdown, t]);

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
			setError(err.response?.data?.message || t('auth.verifyPhone.errorVerifyFailed'));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<AuthCard>
			<AuthHeader title={t('auth.verifyPhone.title')} subtitle={t('auth.verifyPhone.subtitle')} />

			{success ? (
				<div className="space-y-4">
					<div className="rounded-md bg-[var(--color-success)]/10 p-4 text-center text-sm text-success">
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
						<div className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm text-danger">
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
					className="text-[var(--color-brand)] hover:underline"
				>
					{t('auth.common.backToLogin')}
				</Link>
			</div>
		</AuthCard>
	);
}
