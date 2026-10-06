'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Mail } from 'lucide-react';
import { Button, Input, Label } from '@autional/ui';
import { authMagicLinkRequestPost } from '@autional/shared/generated/api';

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
		// 与邮箱/短信验证码子表单同口径：即点即验，空输入给原因，不做静默禁用
		if (!email.trim()) {
			setError(t('magicLink.emailRequired') || '请输入邮箱');
			return;
		}

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
			<div className="space-y-4">
				<div className="rounded-lg bg-brand/10 p-6 text-center">
					<Mail className="mx-auto h-8 w-8 text-brand-text" />
					<p className="mt-3 text-sm font-medium text-brand-text">{t(config.sentTitleKey)}</p>
					<p className="mt-2 text-xs text-brand-text">{t(config.checkEmailKey)}</p>
				</div>
				{onBack && (
					<Button variant="outline" onClick={onBack} fullWidth>
						{t('magicLink.back')}
					</Button>
				)}
			</div>
		);
	}

	const titleKey = mode === 'register' ? 'register.magicLinkTitle' : 'magicLink.title';
	const subtitleKey = mode === 'register' ? 'register.magicLinkSubtitle' : 'magicLink.subtitle';

	return (
		<form onSubmit={handleSubmit} noValidate className="space-y-4">
			<div className="text-center">
				<p className="text-sm font-medium text-[var(--color-text-primary)]">{t(titleKey)}</p>
				<p className="mt-1 text-xs text-[var(--color-text-secondary)]">{t(subtitleKey)}</p>
			</div>

			<div className="space-y-2">
				<Label htmlFor="magic-link-email">{t('magicLink.email')}</Label>
				<Input
					id="magic-link-email"
					type="email"
					placeholder="user@example.com"
					autoComplete="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>

			<div className="flex gap-2">
				{onBack && (
					<Button type="button" variant="outline" onClick={onBack} fullWidth>
						{t('magicLink.back')}
					</Button>
				)}
				<Button type="submit" disabled={loading} isLoading={loading} fullWidth>
					{loading ? t('magicLink.sending') : t('magicLink.send')}
				</Button>
			</div>

			{error && <p className="text-sm text-danger-text">{error}</p>}
		</form>
	);
}
