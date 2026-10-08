'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

declare global {
	interface Window {
		turnstile?: {
			render: (container: string | HTMLElement, options: TurnstileOptions) => string;
			reset: (widgetId: string) => void;
			remove: (widgetId: string) => void;
			getResponse: (widgetId: string) => string | undefined;
		};
	}
}

interface TurnstileOptions {
	sitekey: string;
	theme?: 'auto' | 'light' | 'dark';
	size?: 'normal' | 'flexible' | 'compact';
	appearance?: 'always' | 'execute' | 'interaction-only';
	action?: string;
	callback?: (token: string) => void;
	'error-callback'?: (errorCode: string) => void;
	'expired-callback'?: () => void;
}

interface TurnstileWidgetProps {
	siteKey: string;
	action?: string;
	theme?: 'auto' | 'light' | 'dark';
	onToken?: (token: string) => void;
	onError?: (errorCode: string) => void;
}

export function TurnstileWidget({
	siteKey,
	action,
	theme,
	onToken,
	onError,
}: TurnstileWidgetProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const widgetIdRef = useRef<string>('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadScript = useCallback(() => {
		if (window.turnstile) {
			setLoading(false);
			return;
		}

		const script = document.createElement('script');
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
		script.async = true;
		script.defer = true;
		script.onload = () => setLoading(false);
		script.onerror = () => {
			setError('Failed to load Turnstile');
			setLoading(false);
		};
		document.head.appendChild(script);
	}, []);

	useEffect(() => {
		loadScript();

		const checkInterval = setInterval(() => {
			if (window.turnstile && containerRef.current && !widgetIdRef.current) {
				widgetIdRef.current = window.turnstile.render(containerRef.current, {
					sitekey: siteKey,
					theme: theme || 'auto',
					action: action || 'login',
					callback: (token: string) => {
						onToken?.(token);
					},
					'error-callback': (errorCode: string) => {
						setError(`Turnstile error: ${errorCode}`);
						onError?.(errorCode);
					},
					'expired-callback': () => {
						if (widgetIdRef.current) {
							window.turnstile?.reset(widgetIdRef.current);
						}
					},
				});
				clearInterval(checkInterval);
			}
		}, 100);

		return () => {
			clearInterval(checkInterval);
			if (widgetIdRef.current && window.turnstile) {
				window.turnstile.remove(widgetIdRef.current);
				widgetIdRef.current = '';
			}
		};
	}, [siteKey, action, theme, loadScript, onToken, onError]);

	if (error) {
		return <div className="text-sm text-danger-text">{error}</div>;
	}

	return (
		<div className="flex justify-center">
			{loading && <div className="text-sm text-[var(--color-text-muted)]">Loading verification...</div>}
			<div ref={containerRef} />
		</div>
	);
}

export function getTurnstileToken(): string | undefined {
	if (!window.turnstile) return undefined;
	return undefined;
}

export function resetTurnstile(widgetId: string) {
	window.turnstile?.reset(widgetId);
}
