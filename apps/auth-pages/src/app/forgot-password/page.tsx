'use client';

import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@autional/ui';
import { authForgotPasswordPost } from '@autional/shared/generated/api';
import { createForgotPasswordSchema } from '@/lib/validators';
import type { ForgotPasswordFormData } from '@/lib/validators';
import { useCountdown } from '@/hooks/use-countdown';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { CountdownButton } from '@/components/form/CountdownButton';
import { Input } from '@autional/ui';
import { useI18n } from '@/lib/i18n';
import { usePageTitle } from '@/hooks/use-page-title';
import { Mail, Smartphone } from 'lucide-react';

type RecoveryChannel = 'email' | 'phone';

export default function ForgotPasswordPage() {
	const { t } = useI18n();
	usePageTitle('forgot.title');
	const { tenantSlug: slugParam } = useParams();
	const tenantSlug = slugParam || '';
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [channel, setChannel] = useState<RecoveryChannel>('email');
	const { seconds, isActive, start } = useCountdown({ duration: 60 });

	const schema = createForgotPasswordSchema(t);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ForgotPasswordFormData>({ resolver: zodResolver(schema) });

	const sendReset = async (identity: string) => {
		if (isActive || loading) return;
		setLoading(true);

		try {
			await authForgotPasswordPost({ identity });
		} catch {
			// 统一提示，不暴露具体错误
		} finally {
			setLoading(false);
			setSubmitted(true);
			start();
		}
	};

	const onSubmit = async (data: ForgotPasswordFormData) => {
		const identity = data.identity || data.email || '';
		sessionStorage.setItem('reset_password_identity', identity);
		await sendReset(identity);
	};

	// AUTH-52 ④：「重新发送」= 真重发——以留存身份再次请求 + 重启冷却。此前点击仅
	// setSubmitted(false) 复位表单、零网络请求（文案-行为错配）。身份留存缺失
	// （存储被清/隐私模式）时回退表单由用户重新填写。
	const onResend = async () => {
		const identity = sessionStorage.getItem('reset_password_identity') || '';
		if (!identity) {
			setSubmitted(false);
			return;
		}
		await sendReset(identity);
	};

	const switchChannel = (newChannel: RecoveryChannel) => {
		setChannel(newChannel);
		reset();
	};

	return (
		<AuthCard>
			<AuthHeader
				title={t('forgot.title')}
				subtitle={channel === 'email' ? t('forgot.subtitleEmail') : t('forgot.subtitlePhone')}
			/>

			{submitted ? (
				<div className="space-y-4">
					<div className="rounded-md bg-success/10 p-4 text-center text-sm text-success-text">
						{channel === 'email' ? t('forgot.sentHintEmail') : t('forgot.sentHintPhone')}
					</div>
					<CountdownButton seconds={seconds} fullWidth isLoading={loading} onClick={onResend}>
						{t('forgot.resend')}
					</CountdownButton>
				</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Channel toggle */}
					<div className="flex rounded-lg bg-[var(--color-bg-muted)] p-1">
						<button
							type="button"
							className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
								channel === 'email'
									? 'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-sm'
									: 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
							}`}
							onClick={() => switchChannel('email')}
						>
							<Mail className="h-4 w-4" />
							{t('forgot.tabEmail')}
						</button>
						<button
							type="button"
							className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
								channel === 'phone'
									? 'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-sm'
									: 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
							}`}
							onClick={() => switchChannel('phone')}
						>
							<Smartphone className="h-4 w-4" />
							{t('forgot.tabPhone')}
						</button>
					</div>

					{channel === 'email' ? (
						<div className="space-y-2">
							<Label htmlFor="identity">{t('verify.email')}</Label>
							<Input
								id="identity"
								type="email"
								placeholder="email@example.com"
								{...register('identity')}
								error={errors.identity?.message}
							/>
						</div>
					) : (
						<div className="space-y-2">
							<Label htmlFor="identity">{t('forgot.phoneLabel')}</Label>
							<Input
								id="identity"
								type="tel"
								placeholder="+8613800138000"
								{...register('identity')}
								error={errors.identity?.message}
							/>
						</div>
					)}

					<CountdownButton
						seconds={seconds}
						fullWidth
						isLoading={loading}
						onClick={handleSubmit(onSubmit)}
					>
						{t('forgot.submit')}
					</CountdownButton>
				</form>
			)}

			<div className="text-center text-sm mt-2">
				<Link
					to={tenantSlug ? `/${tenantSlug}/recover-account` : '/recover-account'}
					className="text-brand-text hover:underline"
				>
					{t('forgot.recoverAccountHint')}
				</Link>
			</div>

			<div className="text-center text-sm">
				<Link to={tenantSlug ? `/${tenantSlug}/login` : '/login'} className="text-brand-text hover:underline">
					{t('forgot.back')}
				</Link>
			</div>
		</AuthCard>
	);
}
