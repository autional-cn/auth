'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Mail, ArrowLeft } from 'lucide-react';
import { authMagicLinkRequestPost } from '@autional-cn/shared/generated/api';

interface MagicLinkFormProps {
	tenantId?: string;
	onBack?: () => void;
	mode?: 'login' | 'register';
}

const MODE_CONFIG = {
	login: {
		sentTitleKey: 'magicLink.sent',
		checkEmailKey: 'magicLink.checkEmail',
	},
	register: {
		sentTitleKey: 'register.magicLinkSent',
		checkEmailKey: 'register.magicLinkCheckEmail',
	},
} as const;

export function MagicLinkForm({ tenantId, onBack, mode = 'login' }: MagicLinkFormProps) {
	const { t } = useI18n();
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const [error, setError] = useState('');

	const config = MODE_CONFIG[mode];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) return;

		setLoading(true);
		setError('');

		try {
			await authMagicLinkRequestPost({
				email: email.trim(),
				...(tenantId ? { tenant_id: tenantId } : {}),
			});
			setSent(true);
		} catch (err: any) {
			const status = err?.response?.status;
			if (status === 429) {
				setError(t('magicLink.rateLimited'));
			} else {
				setError(t('magicLink.error'));
			}
		} finally {
			setLoading(false);
		}
	};

	if (sent) {
		return (
			<div className="space-y-4 text-center">
				<div className="rounded-lg bg-[var(--color-brand)]/10 p-6">
					<Mail className="mx-auto h-8 w-8 text-[var(--color-brand)]" />
					<p className="mt-3 text-sm font-medium text-[var(--color-brand)]">
						{t(config.sentTitleKey)}
					</p>
					<p className="mt-2 text-xs text-[var(--color-brand)]">{t(config.checkEmailKey)}</p>
				</div>
				{onBack && (
					<button
						onClick={onBack}
						className="inline-flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						{t('magicLink.back')}
					</button>
				)}
			</div>
		);
	}

	const titleKey = mode === 'register' ? 'register.magicLinkTitle' : 'magicLink.title';
	const subtitleKey = mode === 'register' ? 'register.magicLinkSubtitle' : 'magicLink.subtitle';

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="text-center">
				<p className="text-sm font-medium text-[var(--color-text-primary)]">{t(titleKey)}</p>
				<p className="mt-1 text-xs text-[var(--color-text-secondary)]">{t(subtitleKey)}</p>
			</div>

			<div className="space-y-2">
				<label
					htmlFor="magic-link-email"
					className="block text-sm font-medium text-[var(--color-text-primary)]"
				>
					{t('magicLink.email')}
				</label>
				<input
					id="magic-link-email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder={t('magicLink.emailPlaceholder')}
					autoFocus
					className="w-full rounded-md border border-[var(--color-border-subtle)] px-3 py-2 text-sm placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
					required
				/>
			</div>

			{error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

			<button
				type="submit"
				disabled={loading || !email.trim()}
				className="w-full rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-[var(--color-on-brand)] hover:bg-[var(--color-brand-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? t('magicLink.sending') : t('magicLink.send')}
			</button>

			{onBack && (
				<button
					type="button"
					onClick={onBack}
					className="inline-flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					{t('magicLink.back')}
				</button>
			)}
		</form>
	);
}
