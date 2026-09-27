'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useParams, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Label } from '@autional-cn/ui';
import { authVerifyEmailPost, authResendVerificationEmailPost } from '@autional-cn/shared/generated/api';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';

type ResendFormData = { email: string };

type VerifyStatus = 'verifying' | 'success' | 'already-verified' | 'error';

function VerifyEmailContent() {
	const { t } = useI18n();
	const [searchParams] = useSearchParams();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const token = searchParams.get('token') || '';

	const [status, setStatus] = useState<VerifyStatus>('verifying');
	const [message, setMessage] = useState('');
	const [resending, setResending] = useState(false);
	const [resendSuccess, setResendSuccess] = useState(false);

	const resendSchema = useMemo(
		() =>
			z.object({
				email: z
					.string()
					.min(1, t('auth.verifyEmail.emailPlaceholder'))
					.email(t('auth.verifyEmail.failed')),
			}),
		[t],
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResendFormData>({
		resolver: zodResolver(resendSchema),
	});

	useEffect(() => {
		if (!token) {
			setStatus('error');
			setMessage(t('auth.verifyEmail.invalidToken'));
			return;
		}

		authVerifyEmailPost({ code: token, email: '' })
			.then(() => {
				setStatus('success');
			})
			.catch((err: any) => {
				const msg = err.response?.data?.message || t('auth.verifyEmail.failed');
				setMessage(msg);
				if (msg.includes('已验证') || msg.includes('already verified')) {
					setStatus('already-verified');
				} else {
					setStatus('error');
				}
			});
	}, [token, t]);

	const onResend = async (data: ResendFormData) => {
		setResending(true);
		setResendSuccess(false);
		try {
			await authResendVerificationEmailPost({ email: data.email });
			setResendSuccess(true);
		} catch (err: any) {
			setMessage(err.response?.data?.message || t('auth.verifyEmail.sendFailed'));
		} finally {
			setResending(false);
		}
	};

	const renderContent = () => {
		if (status === 'verifying') {
			return (
				<div className="py-8 text-center text-sm text-[var(--color-text-secondary)]">
					{t('auth.verifyEmail.verifying')}
				</div>
			);
		}

		if (status === 'success') {
			return (
				<div className="space-y-6">
					<div className="rounded-md bg-[var(--color-success)]/10 p-4 text-center text-sm text-success">
						{t('auth.verifyEmail.successMessage')}
					</div>
					<Link to={tenantSlug ? `/${tenantSlug}/login` : '/'}>
						<Button fullWidth>{t('auth.common.goToLogin')}</Button>
					</Link>
				</div>
			);
		}

		if (status === 'already-verified') {
			return (
				<div className="space-y-6">
					<div className="rounded-md bg-[var(--color-success)]/10 p-4 text-center text-sm text-success">
						{t('auth.verifyEmail.alreadyVerified')}
					</div>
					<Link to={tenantSlug ? `/${tenantSlug}/login` : '/'}>
						<Button fullWidth>{t('auth.common.goToLogin')}</Button>
					</Link>
				</div>
			);
		}

		// error
		return (
			<div className="space-y-6">
				<div className="rounded-md bg-[var(--color-danger)]/10 p-4 text-center text-sm text-danger">
					{message || t('auth.verifyEmail.expiredOrInvalid')}
				</div>

				{resendSuccess ? (
					<div className="rounded-md bg-[var(--color-success)]/10 p-4 text-center text-sm text-success">
						{t('auth.verifyEmail.resendSuccess')}
					</div>
				) : (
					<form onSubmit={handleSubmit(onResend)} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">{t('auth.verifyEmail.registeredEmail')}</Label>
							<Input
								id="email"
								type="email"
								placeholder={t('auth.verifyEmail.emailPlaceholder')}
								{...register('email')}
								error={errors.email?.message}
							/>
						</div>
						<Button type="submit" fullWidth isLoading={resending}>
							{t('auth.verifyEmail.resend')}
						</Button>
					</form>
				)}
			</div>
		);
	};

	return (
		<AuthCard>
			<AuthHeader
				title={t('auth.verifyEmail.title')}
				subtitle={
					status === 'verifying' ? t('auth.verifyEmail.processing') : t('auth.verifyEmail.result')
				}
			/>

			{renderContent()}

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

export default function VerifyEmailPage() {
	const { t } = useI18n();
	return (
		<Suspense
			fallback={
				<AuthCard>
					<AuthHeader title={t('auth.verifyEmail.title')} subtitle={t('auth.common.loading')} />
				</AuthCard>
			}
		>
			<VerifyEmailContent />
		</Suspense>
	);
}
