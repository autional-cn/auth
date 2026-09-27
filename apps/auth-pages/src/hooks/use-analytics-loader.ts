'use client';
import { useEffect } from 'react';

export function useAnalyticsLoader() {
	useEffect(() => {
		const CHECK_INTERVAL = 1000;

		const check = () => {
			try {
				const raw = localStorage.getItem('cookie-consent');
				if (!raw) return;
				const parsed = JSON.parse(raw);
				const state = (parsed as any).state || parsed;
				if (!state?.consented || !state?.preferences?.analytics) return;

				const scriptId = 'authms-analytics';
				if (document.getElementById(scriptId)) return;

				const url = import.meta.env.VITE_ANALYTICS_URL as string | undefined;
				if (!url) return;

				const script = document.createElement('script');
				script.id = scriptId;
				script.src = url;
				script.async = true;
				script.defer = true;
				document.head.appendChild(script);

				if (import.meta.env.DEV) {
					console.log('[analytics] loaded:', url);
				}
			} catch {
				/* ignore parse errors */
			}
		};

		const interval = setInterval(check, CHECK_INTERVAL);
		check();
		return () => clearInterval(interval);
	}, []);
}
