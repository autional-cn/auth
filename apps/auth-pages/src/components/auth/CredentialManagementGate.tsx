'use client';

import { useEffect, useCallback, useState } from 'react';

interface CredentialManagementGateProps {
	onAutoFill?: (email: string) => void;
}

/**
 * Credential Management API gate — auto-fills saved credentials via browser PasswordCredential API.
 *
 * Supported in Chrome 51+, Edge 79+. Falls back silently if not supported.
 * Runs alongside Passkey WebAuthn conditional mediation for complementary auto-fill.
 */
export function CredentialManagementGate({ onAutoFill }: CredentialManagementGateProps) {
	const [autoFilled, setAutoFilled] = useState(false);

	const supportsCM = (): boolean => {
		try {
			return (
				typeof window !== 'undefined' &&
				typeof (window as any).PasswordCredential === 'function' &&
				typeof navigator.credentials !== 'undefined'
			);
		} catch {
			return false;
		}
	};

	const requestPasswordCredential = useCallback(async () => {
		if (!supportsCM()) return;
		try {
			const cred: any = await (navigator.credentials as any).get({
				password: true,
				mediation: 'optional',
			});
			if (cred && cred.type === 'password') {
				setAutoFilled(true);
				const email = cred.id || '';
				onAutoFill?.(email);
				if (cred.password) {
					const pwInput = document.querySelector<HTMLInputElement>('input[type="password"]');
					if (pwInput && !pwInput.value) {
						pwInput.value = cred.password;
						pwInput.dispatchEvent(new Event('input', { bubbles: true }));
					}
				}
			}
		} catch {
			// Credential Management API not available or user declined
		}
	}, [onAutoFill]);

	useEffect(() => {
		if (!autoFilled) {
			requestPasswordCredential();
		}
	}, [autoFilled, requestPasswordCredential]);

	return null;
}
