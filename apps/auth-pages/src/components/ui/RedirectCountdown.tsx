'use client';

import { useEffect } from 'react';
import { Button } from '@autional-cn/ui';
import { useCountdown } from '@/hooks/use-countdown';

interface RedirectCountdownProps {
	/** Countdown duration in seconds (default 3) */
	duration?: number;
	/** Title displayed above countdown */
	title: string;
	/** Subtitle with {seconds} placeholder */
	subtitle?: string;
	/** Continue button label */
	continueLabel?: string;
	/** Called when countdown expires or user clicks Continue */
	onContinue: () => void;
}

/**
 * Standardized redirect countdown component.
 * Shows a success/transition message with a live countdown and manual "Continue" button.
 *
 * Used across all auth-pages redirect sites:
 *   - Login success → dashboard
 *   - Password change success → dashboard
 *   - Password reset success → login
 *   - OAuth callback success → dashboard
 *   - Passkey login success → dashboard
 *   - QR login success → dashboard
 *   - Session expired → login
 */
export default function RedirectCountdown({
	duration = 3,
	title,
	subtitle = 'Redirecting in {{seconds}}s...',
	continueLabel = 'Continue',
	onContinue,
}: RedirectCountdownProps) {
	const { seconds, isActive, start } = useCountdown({ duration, onExpire: onContinue });

	useEffect(() => {
		start();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const displaySubtitle = subtitle.replace(/\{\{seconds\}\}/g, String(seconds));

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<div className="w-full max-w-sm space-y-6 text-center">
				{/* Success Icon */}
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
					<svg
						className="h-8 w-8 text-[var(--color-success)]"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				</div>

				{/* Title */}
				<h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{title}</h1>

				{/* Countdown */}
				<p className="text-sm text-[var(--color-text-secondary)]">{displaySubtitle}</p>

				{/* Manual Continue Button */}
				<Button onClick={onContinue} fullWidth>
					{continueLabel}
				</Button>
			</div>
		</div>
	);
}
