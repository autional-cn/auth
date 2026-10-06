'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label } from '@autional/ui';
import { authRegisterReapplyPost } from '@autional/shared/generated/api';
import { AuthCard } from '@/components/auth/AuthCard';
import { useI18n } from '@/lib/i18n';
import { usePageTitle } from '@/hooks/use-page-title';
import { createReapplySchema } from '@/lib/validators';
import type { ReapplyFormData } from '@/lib/validators';

export default function ReapplyPage() {
	const { t, lang } = useI18n();
	usePageTitle('reapply.title', t('auth.reapply.title'));
	const [searchParams] = useSearchParams();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const emailParam = searchParams.get('email') || '';
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const schema = useMemo(() => createReapplySchema(t), [lang, t]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ReapplyFormData>({
		resolver: zodResolver(schema),
		defaultValues: { email: emailParam, reason: '' },
	});

	const onSubmit = async (data: ReapplyFormData) => {
		setLoading(true);
		setError('');
		try {
			await authRegisterReapplyPost(data as any);
			window.location.href = tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard';
		} catch (err: any) {
			setError(err.response?.data?.message || t('auth.reapply.error'));
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthCard title={t('auth.reapply.title')} subtitle={t('auth.reapply.subtitle')}>
			{error && (
				<div className="mb-4 rounded-md bg-danger/10 p-3 text-sm text-danger-text">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="rounded-md border border-amber-100 bg-amber-50 p-3 text-xs text-amber-800">
					<p className="mb-1 font-medium">{t('auth.reapply.rejected')}</p>
					<p>{t('auth.reapply.rejectedDesc')}</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">{t('auth.reapply.email')}</Label>
					<Input
						id="email"
						type="email"
						placeholder={t('auth.reapply.emailPlaceholder')}
						{...register('email')}
						error={errors.email?.message}
						disabled={!!emailParam}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="reason">{t('auth.reapply.reason')}</Label>
					<textarea
						id="reason"
						rows={4}
						placeholder={t('auth.reapply.reasonPlaceholder')}
						className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
						{...register('reason')}
					/>
					{errors.reason?.message && <p className="text-xs text-danger-text">{errors.reason.message}</p>}
				</div>

				<Button type="submit" fullWidth isLoading={loading}>
					{t('auth.reapply.submit')}
				</Button>
			</form>
		</AuthCard>
	);
}
