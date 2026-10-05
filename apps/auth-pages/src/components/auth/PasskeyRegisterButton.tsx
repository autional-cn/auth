'use client';

import { useState } from 'react';
import { Button } from '@autional-cn/ui';
import { Fingerprint } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { extractApiError } from '@autional-cn/shared';
import { beginPasskeyRegister, completePasskeyRegister } from '@/lib/api.generated';
import { preparePasswordForTenant } from '@/lib/password-transmission';

function base64urlToBuffer(base64url: string): ArrayBuffer {
	const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
	const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
	const bytes = Uint8Array.from(atob(base64 + pad), (c) => c.charCodeAt(0));
	return bytes.buffer;
}

function bufferToBase64url(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	const base64 = btoa(String.fromCharCode(...bytes));
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

interface PasskeyRegisterButtonProps {
	onSkip: () => void;
	onSuccess?: () => void;
	/** 注册时用户输入的原始口令（begin 端点 password 必填，校验用户身份） */
	password: string;
	/** 租户权威 id（密码传输模式解析用，与注册/登录同一口径） */
	tenantId?: string;
}

export function PasskeyRegisterButton({
	onSkip,
	onSuccess,
	password,
	tenantId,
}: PasskeyRegisterButtonProps) {
	const { t } = useI18n();
	const [loading, setLoading] = useState(false);
	const [registered, setRegistered] = useState(false);
	const [error, setError] = useState('');

	const isSupported =
		typeof window !== 'undefined' && typeof window.PublicKeyCredential !== 'undefined';

	const handleRegister = async () => {
		if (!isSupported) return;
		setLoading(true);
		setError('');

		try {
			// U385/AUTH-39：begin 端点 password 必填（后端据此经 VerifyPassword 校验身份）。
			// hash 租户下裸明文必败 —— 必须按租户传输模式预处理（与注册/自动登录同一形态）。
			const transmission = await preparePasswordForTenant(tenantId || '', password);
			// 1. Request registration options from server
			const optionsRes = await beginPasskeyRegister({
				userName: '',
				password: transmission.password,
			});
			const data = (optionsRes as any)?.data || optionsRes;
			const options = data.response || data;

			// 2. Convert to WebAuthn credential creation options
			const publicKey: PublicKeyCredentialCreationOptions = {
				challenge: base64urlToBuffer(options.challenge),
				rp: options.rp,
				user: {
					...options.user,
					id: base64urlToBuffer(options.user.id),
				},
				pubKeyCredParams: options.pubKeyCredParams,
				attestation: options.attestation || 'none',
				authenticatorSelection: options.authenticatorSelection || {
					residentKey: 'preferred',
					userVerification: 'preferred',
				},
				timeout: options.timeout || 60000,
			};

			// 3. Prompt user with browser native Passkey creation dialog
			const credential = await navigator.credentials.create({ publicKey });
			if (!credential) throw new Error('No credential returned');

			const cred = credential as PublicKeyCredential;
			const attestation = cred.response as AuthenticatorAttestationResponse;

			// 4. Send signed attestation to server
			await completePasskeyRegister({
				id: cred.id,
				rawId: bufferToBase64url(cred.rawId),
				type: cred.type,
				response: {
					clientDataJSON: bufferToBase64url(attestation.clientDataJSON),
					attestationObject: bufferToBase64url(attestation.attestationObject),
				},
			});

			setRegistered(true);
			onSuccess?.();
		} catch (err: any) {
			if (err.name === 'NotAllowedError' || err.name === 'AbortError') {
				// User cancelled the browser prompt — silent handling
				setError('');
			} else {
				// AUTH-39：错误体带 i18n_key 时按本地化键渲染，避免原始英文直渲
				const apiErr = extractApiError(err, t('passkey.registerFailed'));
				setError(apiErr.i18nKey ? t(apiErr.i18nKey, apiErr.message) : apiErr.message);
			}
		} finally {
			setLoading(false);
		}
	};

	if (!isSupported) {
		return (
			<div className="rounded-md bg-amber-50 p-4 text-center">
				<p className="text-xs text-amber-700">{t('passkey.unsupported')}</p>
			</div>
		);
	}

	if (registered) {
		return (
			<div className="space-y-4">
				<div className="rounded-md bg-success/10 p-6 text-center">
					<Fingerprint className="mx-auto h-8 w-8 text-success-text" />
					<p className="mt-2 text-sm font-medium text-success-text">
						{t('passkey.successRegister')}
					</p>
					<p className="mt-1 text-xs text-success-text">{t('passkey.available')}</p>
				</div>
				<Button fullWidth onClick={onSkip}>
					{t('register.goToDashboard')}
				</Button>
			</div>
		);
	}

	return (
		<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4">
			<div className="flex items-start gap-3">
				<Fingerprint className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brand)]" />
				<div className="min-w-0 flex-1">
					<p className="text-sm font-medium text-[var(--color-text-primary)]">
						{t('passkey.optIn')}
					</p>
					<p className="mt-1 text-xs text-[var(--color-text-secondary)]">
						{t('passkey.optInDesc')}
					</p>
				</div>
			</div>

			{error && (
				<div className="mt-3 rounded-md bg-danger/10 p-2 text-xs text-danger-text">
					{error}
				</div>
			)}

			<div className="mt-3 flex gap-2">
				<Button fullWidth onClick={handleRegister} isLoading={loading}>
					{t('passkey.submitRegister')}
				</Button>
				<Button variant="outline" onClick={onSkip} disabled={loading}>
					{t('passkey.skip')}
				</Button>
			</div>
		</div>
	);
}
