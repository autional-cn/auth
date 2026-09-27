'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AuthCard } from '@/components/auth/AuthCard';

type ErrorType =
	| 'session_expired'
	| 'unauthorized'
	| 'ip_restricted'
	| 'account_locked'
	| 'oauth_failed'
	| 'generic';

const AUTO_REDIRECT_SECONDS = 5;

const ERROR_TITLE: Record<ErrorType, string> = {
	session_expired: 'auth.error.sessionExpired',
	unauthorized: 'auth.error.unauthorized',
	ip_restricted: 'auth.error.ipRestricted',
	account_locked: 'auth.error.accountLocked',
	oauth_failed: 'auth.error.oauthFailed',
	generic: 'auth.error.genericError',
};

const ERROR_DESC: Record<ErrorType, string> = {
	session_expired: 'auth.error.sessionExpiredDesc',
	unauthorized: 'auth.error.unauthorizedDesc',
	ip_restricted: 'auth.error.ipRestrictedDesc',
	account_locked: 'auth.error.accountLockedDesc',
	oauth_failed: 'auth.error.oauthFailedDesc',
	generic: 'auth.error.genericErrorDesc',
};

export default function ErrorPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const rawType = searchParams.get('type');
	const type: ErrorType =
		rawType === 'session_expired' ||
		rawType === 'unauthorized' ||
		rawType === 'ip_restricted' ||
		rawType === 'account_locked' ||
		rawType === 'oauth_failed'
			? rawType
			: 'generic';

	const [seconds, setSeconds] = useState(AUTO_REDIRECT_SECONDS);

	// session_expired: 5 秒倒计时后自动返回登录页
	useEffect(() => {
		if (type !== 'session_expired') return;
		const timer = setInterval(() => {
			setSeconds((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(timer);
	}, [type]);

	useEffect(() => {
		if (type === 'session_expired' && seconds <= 0) {
			navigate('/');
		}
	}, [seconds, type, navigate]);

	const handleBack = () => {
		navigate('/');
	};

	return (
		<AuthCard title={t(ERROR_TITLE[type])} subtitle={t(ERROR_DESC[type])}>
			<div className="space-y-4">
				{type === 'session_expired' && (
					<>
						<p className="text-center text-sm text-[var(--color-text-secondary)]">
							{t('auth.error.autoRedirect', { seconds: Math.max(seconds, 0) })}
						</p>
						<button
							type="button"
							onClick={() => navigate('/')}
							className="w-full rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-[var(--color-on-brand)] hover:opacity-90 transition-opacity"
						>
							{t('auth.error.relogin')}
						</button>
					</>
				)}

				{type === 'unauthorized' && (
					<>
						<button
							type="button"
							onClick={() => navigate('/')}
							className="w-full rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-[var(--color-on-brand)] hover:opacity-90 transition-opacity"
						>
							{t('auth.error.backHome')}
						</button>
						<button
							type="button"
							onClick={handleBack}
							className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
						>
							{t('auth.error.back')}
						</button>
					</>
				)}

				{type === 'ip_restricted' && (
					<>
						<button
							type="button"
							onClick={() => navigate('/')}
							className="w-full rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-[var(--color-on-brand)] hover:opacity-90 transition-opacity"
						>
							{t('auth.error.backHome')}
						</button>
						<button
							type="button"
							onClick={handleBack}
							className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
						>
							{t('auth.error.back')}
						</button>
					</>
				)}

				{type === 'account_locked' && (
					<button
						type="button"
						onClick={() => navigate('/')}
						className="w-full rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-[var(--color-on-brand)] hover:opacity-90 transition-opacity"
					>
						{t('auth.error.backHome')}
					</button>
				)}

				{type === 'oauth_failed' && (
					<button
						type="button"
						onClick={() => navigate('/')}
						className="w-full rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-[var(--color-on-brand)] hover:opacity-90 transition-opacity"
					>
						{t('auth.error.backHome')}
					</button>
				)}

				{type === 'generic' && (
					<>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="w-full rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-[var(--color-on-brand)] hover:opacity-90 transition-opacity"
						>
							{t('auth.error.refreshPage')}
						</button>
						<button
							type="button"
							onClick={handleBack}
							className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
						>
							{t('auth.error.back')}
						</button>
					</>
				)}
			</div>
		</AuthCard>
	);
}
