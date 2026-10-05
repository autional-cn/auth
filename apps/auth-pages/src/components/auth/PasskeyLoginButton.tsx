'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { Button } from '@autional-cn/ui';
import { Fingerprint } from 'lucide-react';
import { apiClient, loginWithTokens } from '@autional-cn/shared';
import {
	authWebauthnAuthenticateBeginPost,
	authWebauthnAuthenticateCompletePost,
} from '@autional-cn/shared/generated/api';
import { loadAuthExtras } from '@/lib/api';
import { getPostLoginTarget } from '@/lib/post-login-redirect';
import { useI18n } from '@/lib/i18n';
import { CredentialManagementGate } from './CredentialManagementGate';

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

interface PasskeyLoginButtonProps {
	email?: string;
	tenantId?: string;
}

/**
 * PasskeyLoginButton — WebAuthn Conditional UI + Credential Management integration.
 *
 * On mount, this component starts two parallel credential auto-fill mechanisms:
 *   1. WebAuthn Conditional Mediation — `PublicKeyCredential.isConditionalMediationAvailable()`
 *      followed by `navigator.credentials.get({publicKey, mediation:'conditional'})`.
 *      When a passkey is available, the browser shows a native selector.
 *   2. Credential Management API — `navigator.credentials.get({password:true, mediation:'optional'})`
 *      for standard password autofill. The `CredentialManagementGate` component handles this.
 *
 * Both run silently (no UI visible unless credentials are found) via mediation:'conditional'/'optional'.
 * NotAllowedError/AbortError on both paths are silently ignored — the user can use the regular
 * login button as fallback.
 * Note: the identity input must have name="username" and autoComplete="username webauthn"
 * for the browser to show passkey autofill options alongside saved passwords.
 */
export function PasskeyLoginButton({ email, tenantId }: PasskeyLoginButtonProps) {
	const { t } = useI18n();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [autoFillEmail, setAutoFillEmail] = useState('');
	const { tenantSlug } = useParams();
	const [searchParams] = useSearchParams();
	const redirect = searchParams.get('redirect');

	const isSupported =
		typeof window !== 'undefined' && typeof window.PublicKeyCredential !== 'undefined';

	// === 条件UI (Conditional Mediation): 页面加载时自动启动Passkey自动填充 ===
	const conditionalStarted = useRef(false);
	useEffect(() => {
		if (!isSupported) return;
		if (conditionalStarted.current) return;
		conditionalStarted.current = true;

		let cancelled = false;

		(async () => {
			try {
				// 检查浏览器是否支持条件UI
				const available = await PublicKeyCredential.isConditionalMediationAvailable();
				if (!available || cancelled) return;

				// 1. 从服务端获取认证挑战(空email表示条件UI模式)
				const beginData = await authWebauthnAuthenticateBeginPost({
					mediation: 'conditional',
					tenantId: tenantId || undefined,
				});
				// 后端返回 go-webauthn CredentialAssertion（{publicKey:{...}}，经 NewDataResponse 解包后亦然）
				const options = (beginData as any)?.publicKey ?? (beginData as any)?.response ?? beginData;

				// 2. 构建WebAuthn请求选项
				const publicKey: PublicKeyCredentialRequestOptions = {
					challenge: base64urlToBuffer(options.challenge),
					rpId: options.rpId || window.location.hostname,
					userVerification: options.userVerification || 'preferred',
					timeout: options.timeout || 60000,
					// 条件UI使用空allowCredentials, 浏览器自动匹配
					allowCredentials:
						options.allowCredentials?.map((cred: any) => ({
							id: base64urlToBuffer(cred.id),
							type: 'public-key' as const,
							transports: cred.transports as AuthenticatorTransport[],
						})) || [],
				};

				// 3. 启动条件UI (非阻塞 — 浏览器在有可用Passkey时自动弹出选择器)
				const credential = await navigator.credentials.get({
					publicKey,
					mediation: 'conditional',
				});
				if (cancelled || !credential) return;

				// 4. 用户选择了Passkey → 自动完成认证
				const cred = credential as PublicKeyCredential;
				const assertion = cred.response as AuthenticatorAssertionResponse;

				const completeData = await authWebauthnAuthenticateCompletePost({
					credential: {
						id: cred.id,
						rawId: bufferToBase64url(cred.rawId),
						type: cred.type,
						response: {
							clientDataJSON: bufferToBase64url(assertion.clientDataJSON),
							authenticatorData: bufferToBase64url(assertion.authenticatorData),
							signature: bufferToBase64url(assertion.signature),
							userHandle: assertion.userHandle ? bufferToBase64url(assertion.userHandle) : null,
						},
					},
				} as any);

				loginWithTokens(completeData.accessToken, completeData.refreshToken, completeData.user);
				await loadAuthExtras();
				window.location.href = getPostLoginTarget({
					tenantSlug,
					redirect,
					user: completeData.user,
				});
			} catch (err: any) {
				// NotAllowedError/AbortError = 用户取消 — 静默忽略, 常规登录按钮仍然可用
				if (err.name === 'NotAllowedError' || err.name === 'AbortError') return;
				// 其他错误静默失败, 不阻塞用户通过常规方式登录
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [isSupported, tenantId]);

	const handleCredentialAutoFill = (filledEmail: string) => {
		setAutoFillEmail(filledEmail);
		const input = document.querySelector<HTMLInputElement>(
			'input[type="email"], input[aria-label="email"]',
		);
		if (input && !input.value) {
			(input as HTMLInputElement).value = filledEmail;
			input.dispatchEvent(new Event('input', { bubbles: true }));
		}
	};

	const handlePasskeyLogin = async () => {
		if (!isSupported) return;
		setLoading(true);
		setError('');

		try {
			// 1. Request authentication options from server
			const beginData = await authWebauthnAuthenticateBeginPost({
				email: email || undefined,
				tenantId: tenantId || undefined,
				mediation: email ? undefined : 'conditional',
			});
			const options = (beginData as any)?.publicKey ?? (beginData as any)?.response ?? beginData;

			// 2. Convert server response to WebAuthn request options
			const publicKey: PublicKeyCredentialRequestOptions = {
				challenge: base64urlToBuffer(options.challenge),
				allowCredentials: options.allowCredentials?.map((cred: any) => ({
					id: base64urlToBuffer(cred.id),
					type: 'public-key' as const,
					transports: cred.transports as AuthenticatorTransport[],
				})),
				userVerification: options.userVerification || 'preferred',
				timeout: options.timeout || 60000,
				rpId: options.rpId || window.location.hostname,
			};

			// 3. Prompt user with browser native Passkey dialog
			const credential = await navigator.credentials.get({ publicKey });
			if (!credential) throw new Error('No credential returned');

			const cred = credential as PublicKeyCredential;
			const assertion = cred.response as AuthenticatorAssertionResponse;

			// 4. Send signed assertion to server (后端契约: 顶层 credential 包裹)
			const data = await authWebauthnAuthenticateCompletePost({
				credential: {
					id: cred.id,
					rawId: bufferToBase64url(cred.rawId),
					type: cred.type,
					response: {
						clientDataJSON: bufferToBase64url(assertion.clientDataJSON),
						authenticatorData: bufferToBase64url(assertion.authenticatorData),
						signature: bufferToBase64url(assertion.signature),
						userHandle: assertion.userHandle ? bufferToBase64url(assertion.userHandle) : null,
					},
				},
			} as any);

			// 5. Complete login
			loginWithTokens(data.accessToken, data.refreshToken, data.user);
			await loadAuthExtras().catch(() => {});
			window.location.href = getPostLoginTarget({ tenantSlug, redirect, user: data.user });
		} catch (err: any) {
			if (err.name === 'NotAllowedError' || err.name === 'AbortError') {
				// User cancelled the browser prompt — silent handling
				setError('');
			} else {
				setError(err?.response?.data?.message || err?.message || t('passkey.loginFailed'));
			}
		} finally {
			setLoading(false);
		}
	};

	if (!isSupported) return null;

	return (
		<div data-testid="passkey-login-button">
			<CredentialManagementGate onAutoFill={handleCredentialAutoFill} />
			<Button
				variant="outline"
				fullWidth
				onClick={handlePasskeyLogin}
				isLoading={loading}
				data-testid="passkey-submit-button"
			>
				<Fingerprint className="mr-2 h-4 w-4" />
				{t('passkey.submitLogin')}
			</Button>
			{error && (
				<p className="mt-2 text-center text-xs text-danger" data-testid="passkey-error">
					{error}
				</p>
			)}
		</div>
	);
}
// force HMR refresh
