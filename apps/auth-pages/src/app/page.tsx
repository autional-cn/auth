'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Label } from '@autional-cn/ui';
import { authLoginPost, authCaptchaChallenge, authMe } from '@autional-cn/shared/generated/api';
import { loadAuthExtras } from '@/lib/api';
import { loginWithTokens, useAuthStore, getAccessToken, isValidRedirect, initiateOAuthLogin, extractSlugFromPath, getPortalUrl, getRootDomain } from '@autional-cn/shared';
import { createLoginSchema } from '@/lib/validators';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import QRLoginPanel from '@/components/auth/QRLoginPanel';
import EmailCodeLoginForm from '@/components/auth/EmailCodeLoginForm';
import PhoneCodeLoginForm from '@/components/auth/PhoneCodeLoginForm';
import IdentifierFirstInput from '@/components/auth/IdentifierFirstInput';
import { type TenantOption } from '@/hooks/usePublicTenants';
import { useTenantAuthConfig } from '@/hooks/use-tenant-auth-config';
import { useAuthPageInit } from '@/hooks/useAuthPageInit';
import { resolveClientIdForRequireAuth } from '@/lib/from-requireauth';
import { bumpRequireAuthLoop } from '@/lib/requireauth-loop-guard';
import { TenantSelector } from '@/components/auth/TenantSelector';
const DEBUG_TAG = '[captcha]';
function debug(...args: unknown[]) {
	console.debug(DEBUG_TAG, Date.now(), ...args);
}

import { computeDeviceFingerprint, isDeviceFingerprintEnabled } from '@/lib/device-fingerprint';
import { solveProofOfWork } from '@/lib/silent-challenge';
import { processPasswordForTransmission } from '@/lib/password-transmission';
import { TurnstileWidget } from '@/components/auth/TurnstileWidget';
import { CheckCircle2, Lock, QrCode, Mail, Fingerprint, Smartphone, Inbox } from 'lucide-react';
import { initiateOAuth } from '@/lib/api.generated';
import { useI18n } from '@/lib/i18n';
import { usePageTitle } from '@/hooks/use-page-title';
import { useTenantStore } from '@/lib/tenant-store';
import { PasskeyLoginButton } from '@/components/auth/PasskeyLoginButton';
import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { PasswordInput } from '@/components/form/PasswordInput';
import { useTenantBrandingStore } from '@autional-cn/shared/branding';

const ERROR_CODE_MAP: Record<string, string> = {
	'40000001': 'login.error.credentials',
	'40000002': 'login.error.locked',
	'40000003': 'login.error.disabled',
	'40000005': 'login.error.unverified',
	'40000006': 'login.error.rateLimit',
	'40800505': 'login.error.captchaRequired',
	'40800506': 'login.error.invalidCaptcha',
};

function getErrorMessage(err: any, t: (k: string) => string): string {
	const status = err?.response?.status as number | undefined;
	const data = err?.response?.data;
	const code =
		typeof data === 'object' && data !== null ? (data.code as string | undefined) : undefined;
	const message =
		typeof data === 'object' && data !== null ? (data.message as string | undefined) : undefined;

	if (!status && !err?.response) {
		return t('login.error.network');
	}
	if (status && status >= 500) {
		return t('login.error.serviceUnavailable');
	}
	if (status === 404) {
		return t('login.error.serviceNotFound');
	}
	if (code && ERROR_CODE_MAP[code]) {
		return t(ERROR_CODE_MAP[code]);
	}
	return message || t('login.error.credentials');
}

const ADMIN_PATH_SEGMENTS = ['admin', 'developer', 'security', 'status', 'trust', 'platform'];

export function isAdminRedirect(redirect: string | null): boolean {
	if (!redirect) return false;
	let pathname: string;
	try {
		pathname = new URL(redirect).pathname;
	} catch {
		pathname = redirect;
	}
	if (ADMIN_PATH_SEGMENTS.some((s) => pathname === '/' + s || pathname.startsWith('/' + s + '/')))
		return true;
	const segments = pathname.split('/').filter(Boolean);
	if (segments.length >= 2 && ADMIN_PATH_SEGMENTS.includes(segments[1])) return true;
	return false;
}

interface OAuthProviderItem {
	type: string;
	name: string;
}

export default function LoginPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { tenantSlug: slugParam } = useParams();
	const tenantSlug = slugParam || null;
	const { t } = useI18n();
	const schema = useMemo(
		() =>
			createLoginSchema(t).extend({
				rememberMe: z.boolean().optional().default(false),
			}),
		[t],
	);
	type FormData = z.infer<typeof schema>;
	const [autoRedirectChecking, setAutoRedirectChecking] = useState(true);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [loginMethod, setLoginMethod] = useState<
		'password' | 'qr' | 'magic_link' | 'passkey' | 'email_code' | 'phone_code' | 'identifier_first'
	>('password');
	const [tenantsLoading, setTenantsLoading] = useState(true);
	const [tenants, setTenants] = useState<TenantOption[]>([]);
	const [passwordExpiryBanner, setPasswordExpiryBanner] = useState<string | null>(null);
	const [newDeviceBanner, setNewDeviceBanner] = useState(false);
	const [rateLimitStep, setRateLimitStep] = useState(0);
	const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);
	const turnstileTokenRef = useRef<string>('');
	const [captchaChallenge, setCaptchaChallenge] = useState<any>(null);
	const captchaTokenRef = useRef<string>('');
	const captchaProviderRef = useRef<string>('pow');
	const captchaChallengeIdRef = useRef<string>('');
	const captchaExpireAtRef = useRef<number>(0);
	// P0-01: Progress tracking for PoW solving (ref avoids re-render storms)
	const captchaProgressRef = useRef({ current: 0, max: 1 });
	const [captchaProgressText, setCaptchaProgressText] = useState('');
	// P1-09: Track consecutive local failures for captcha progressive warm-up
	const localFailureRef = useRef(0);
	type CaptchaStatus = 'idle' | 'fetching' | 'solving' | 'solved' | 'expired' | 'error';
	const [captchaStatus, setCaptchaStatus] = useState<CaptchaStatus>('idle');
	const accountDeleted = searchParams.get('account_deleted') === 'true';

	usePageTitle('login.title');

	// ── Unified page init: merges auth-config, tenants, OAuth providers, branding ──
	const pageInit = useAuthPageInit(tenantSlug || null);
	const slugAuthConfig = pageInit.authConfig.data;
	const slugConfigLoading = pageInit.authConfig.isLoading;
	const availableOAuthProviders = pageInit.oauthProviders.data;
	const oauthLoading = pageInit.oauthProviders.isLoading;
	const publicTenants = pageInit.publicTenants.data;

	const slugConfigFailed = useMemo(() => {
		return !!tenantSlug && !slugConfigLoading && !slugAuthConfig?.tenantId;
	}, [tenantSlug, slugConfigLoading, slugAuthConfig]);

	// When tenant-slug is present, auto-select tenant after config loads
	useEffect(() => {
		const tid = slugAuthConfig?.tenantId;
		if (tid) {
			useAuthStore.getState().setCurrentTenant(tid);
		}
	}, [slugAuthConfig]);

	// Auth config from TenantSelector selection (for non-slug path)
	const [inlineAuthConfigId, setInlineAuthConfigId] = useState<string | null>(null);
	const { data: inlineAuthConfig } = useTenantAuthConfig(inlineAuthConfigId);

	// Resolved auth config: slug path takes precedence
	const authConfig = tenantSlug ? slugAuthConfig : inlineAuthConfig;

	// Determine login methods from auth config
	const loginMethods = useMemo<string[]>(() => {
		let methods: string[];
		if (authConfig?.loginMethods && authConfig.loginMethods.length > 0) {
			methods = authConfig.loginMethods;
		} else {
			// Default: show all methods
			methods = ['password', 'qr', 'magic_link', 'passkey', 'email_code', 'phone_code'];
		}
		// Filter methods that are disabled in tenant config
		if (authConfig?.magicLinkEnabled === false) {
			methods = methods.filter((m) => m !== 'magic_link');
		}
		if (authConfig?.passkeyEnabled === false) {
			methods = methods.filter((m) => m !== 'passkey');
		}
		return methods;
	}, [authConfig]);

	// Filter active login method based on available methods
	useEffect(() => {
		if (!loginMethods.includes(loginMethod)) {
			setLoginMethod((loginMethods[0] as typeof loginMethod) || 'password');
		}
	}, [loginMethods, loginMethod]);

	// Determine OAuth providers from auth config (filter available providers)
	const oauthProviders = useMemo<OAuthProviderItem[]>(() => {
		const configProviders = authConfig?.oauthProviders;
		if (configProviders && configProviders.length > 0) {
			// Filter available providers against config
			const enabledTypes = new Set(
				configProviders.map((p: any) => (typeof p === 'string' ? p : p.type)),
			);
			return availableOAuthProviders.filter((p) => enabledTypes.has(p.type));
		}
		// No config: show all available
		return availableOAuthProviders;
	}, [authConfig, availableOAuthProviders]);

	useEffect(() => {
		const fromRequireAuth = searchParams.get('from_requireauth') === '1';
		if (fromRequireAuth) {
			// Cross-domain OAuth PKCE: user is at auth with an existing session,
			// redirect came from another portal via RequireAuth.
			// Check token, then auto-initiate OAuth PKCE for the requesting portal.
			(async () => {
				const token = getAccessToken();
				if (!token || token === 'undefined' || token === 'null') {
					setAutoRedirectChecking(false);
					return;
				}
				const redirect = searchParams.get('redirect');
				if (!redirect) {
					setAutoRedirectChecking(false);
					return;
				}
				// Extract tenant slug from the redirect URL
				try {
					const redirectUrl = new URL(redirect);
					const slug = extractSlugFromPath(redirectUrl.pathname);
					if (!slug) {
						setAutoRedirectChecking(false);
						return;
					}
					// 回跳目标必须是可信来源（EntryRouter 透传原始串，未再校验）：
					// 不可信目标不起握手 —— 防开放重定向，也防目标不可达的重复往返
					if (!isValidRedirect(redirect)) {
						setAutoRedirectChecking(false);
						return;
					}
					// 缓存优先、未命中实时回源 by-slug（ADR-04；实现见 lib/from-requireauth）
					const clientId = await resolveClientIdForRequireAuth(slug);
					if (!clientId) {
						// 回源仍无（存量租户未回填）→ 停住不弹跳，并给出停机提示
						setError(t('login.error.tenantNotConfigured'));
						setAutoRedirectChecking(false);
						return;
					}
					// 限次断路器：同一目标窗口内多次回到本分支 = 目标站点始终承接不了
					// 会话（未配置/暂时故障），继续往返只是 JS 跳转循环 → 停住报错
					if (bumpRequireAuthLoop(redirect)) {
						setError(t('login.error.ssoLoopStopped'));
						setAutoRedirectChecking(false);
						return;
					}
					// 以回程目标为 state.redirect 起 PKCE：授权成功后直达目标站点，
					// 由目标站点用自己的 client 完成会话建立（修复 target 缺省 = 回跳自身）
					initiateOAuthLogin(clientId, redirect);
				} catch {
					setAutoRedirectChecking(false);
				}
			})();
			return;
		}
		const checkAndRedirect = async () => {
			const token = getAccessToken();
			if (!token || token === 'undefined' || token === 'null') {
				setAutoRedirectChecking(false);
				return;
			}
			try {
				await authMe();
				// 切换品牌：本 tab 上次登录的租户 ≠ 当前 URL 租户 → 清旧会话，停在本租户登录态
				// （唯一选择器已移交 brand 站，这里的旧兜底路径必须显式承接）
				//
				// 标记 `auth_dashboard_slug` 由登录成功时按 URL slug 写入，是**同步可用**的
				// slug 来源；不能改用 `/auth/me/tenants` 的 `name`（那是展示名，会让同租户
				// 访问自己登录页也误判为切换 → 静默清会话）
				let lastSlug: string | null = null;
				try {
					lastSlug = sessionStorage.getItem('auth_dashboard_slug');
				} catch {
					lastSlug = null;
				}
				if (lastSlug && lastSlug !== tenantSlug) {
					useAuthStore.getState().clearAuth();
					setAutoRedirectChecking(false);
					return;
				}
				const redirect = searchParams.get('redirect');
				if (redirect && isValidRedirect(redirect)) {
					window.location.href = redirect;
				} else {
					navigate(`/${tenantSlug}/dashboard`, { replace: true });
				}
			} catch (err: any) {
				if (err?.response?.status === 401) {
					useAuthStore.getState().clearAuth();
				}
				setAutoRedirectChecking(false);
			}
		};
		checkAndRedirect();
	}, []);

	// 公开租户列表（仅在无 tenantSlug 时自动选择）
	const prevPublicRef = useRef<TenantOption[] | null>(null);
	useEffect(() => {
		if (publicTenants.length === 0) return;
		if (prevPublicRef.current === publicTenants) return;
		prevPublicRef.current = publicTenants;
		setTenants(publicTenants);
		setTenantsLoading(false);
		// 有 tenantSlug 时不自动选择（slug 路径自带租户信息）
		if (tenantSlug && !slugConfigFailed) return;
		if (publicTenants.length === 0) {
			setLoginMethod('identifier_first');
		} else if (publicTenants.length === 1) {
			useAuthStore.getState().setCurrentTenant(publicTenants[0].id);
			setInlineAuthConfigId(publicTenants[0].id);
		} else {
			useAuthStore.getState().setCurrentTenant(publicTenants[0].id);
		}
	}, [publicTenants, tenantSlug, slugConfigFailed]);

	useEffect(() => {
		debug('useEffect: rateLimitStep=', rateLimitStep);
		if (rateLimitStep < 1) {
			debug('useEffect: step<1, clearing captcha');
			setCaptchaChallenge(null);
			setCaptchaStatus('idle');
			captchaTokenRef.current = '';
			return;
		}
		const provider = authConfig?.captchaProvider || 'pow';
		const cancelled = { current: false };

		debug('useEffect: fetching challenge, provider=', provider);
		setCaptchaStatus('fetching');
		captchaTokenRef.current = '';

		const targetDiff = Math.min(rateLimitStep * 2 + 2, 8);
		authCaptchaChallenge({
			provider: provider as 'pow' | 'turnstile' | 'captcha3d',
		})
			.then((res: any) => {
				if (cancelled.current) {
					debug('useEffect: cancelled after challenge');
					return;
				}
				debug('useEffect: challenge received, type=', res?.type, 'id=', res?.id);
				setCaptchaChallenge(res);

				if (res?.type === 'turnstile' || res?.type === 'captcha3d') {
					debug('useEffect: turnstile/captcha3d, waiting for widget');
					setCaptchaStatus('solving');
					return;
				}

				if (res?.data?.challenge) {
					const diff = res.data.difficulty || targetDiff;
					debug('useEffect: PoW solving, difficulty=', diff);
					setCaptchaStatus('solving');
					const challenge = res.data.challenge;
					captchaExpireAtRef.current = Date.now() + 5 * 60 * 1000;
					solveProofOfWork(challenge, diff, (current, max) => {
						captchaProgressRef.current = { current, max };
					})
						.then((token) => {
							if (cancelled.current) {
								debug('solveProofOfWork: cancelled');
								return;
							}
							debug('solveProofOfWork: solved, token=', token.substring(0, 20));
							captchaTokenRef.current = token;
							captchaProviderRef.current = 'pow';
							captchaChallengeIdRef.current = res.id;
							setCaptchaStatus('solved');
						})
						.catch((e) => {
							if (cancelled.current) return;
							debug('solveProofOfWork: FAILED', e);
							setCaptchaStatus('error');
						});
				}
			})
			.catch((e) => {
				if (cancelled.current) return;
				debug('useEffect: challenge fetch FAILED', e);
				setCaptchaChallenge(null);
				setCaptchaStatus('error');
			});

		return () => {
			cancelled.current = true;
		};
	}, [rateLimitStep, captchaRefreshKey, authConfig]);

	// P0-01: Progress bar text update - timer reads ref to avoid re-render storms
	useEffect(() => {
		if (captchaStatus !== 'solving') {
			setCaptchaProgressText('');
			return;
		}
		const interval = setInterval(() => {
			const { current, max } = captchaProgressRef.current;
			const pct = Math.min(Math.round((current / max) * 100), 99);
			setCaptchaProgressText(`安全检测中... ${pct}%`);
		}, 200);
		return () => clearInterval(interval);
	}, [captchaStatus]);

	// P1-01: Auto-retry captcha when expired (500ms delay)
	useEffect(() => {
		if (captchaStatus !== 'expired') return;
		const timer = setTimeout(() => {
			setCaptchaRefreshKey((k) => k + 1);
		}, 500);
		return () => clearTimeout(timer);
	}, [captchaStatus]);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { rememberMe: false, tenantId: tenantSlug ? '' : '' },
	});

	// Sync form tenantId from slug config
	useEffect(() => {
		const tid = slugAuthConfig?.tenantId;
		if (tid) {
			setValue('tenantId', tid);
		}
	}, [slugAuthConfig, setValue]);

	// When tenants loaded and single, set form value
	useEffect(() => {
		if (!tenantSlug && tenants.length === 1) {
			setValue('tenantId', tenants[0].id);
		}
	}, [tenants, setValue, tenantSlug]);

	const rememberMe = watch('rememberMe');

	const handleOAuthLogin = useCallback(async (provider: string) => {
		try {
			const res = await initiateOAuth(provider);
			const authUrl = res?.data?.auth_url || res?.auth_url;
			if (authUrl) {
				window.location.href = authUrl;
			}
		} catch {
			setError(`Failed to initiate ${provider} login`);
		}
	}, []);

	const onSubmit = async (data: FormData) => {
		debug('onSubmit: START, captchaStatus=', captchaStatus, 'rateLimitStep=', rateLimitStep);

		// P0: 等待租户认证配置加载完成后再提交，防止 transmissionMode=undefined→plain→401
		if (slugConfigLoading) {
			setError(t('login.error.configLoading'));
			setLoading(false);
			return;
		}

		setLoading(true);
		setError('');
		setPasswordExpiryBanner(null);

		let captchaToken: string | undefined;
		let captchaProvider: string | undefined;
		let captchaChallengeId: string | undefined;

		if (rateLimitStep >= 1 && captchaChallenge) {
			debug('onSubmit: captcha required, checking status=', captchaStatus);
			if (captchaChallenge.type === 'turnstile' || captchaChallenge.type === 'captcha3d') {
				captchaToken = turnstileTokenRef.current;
				captchaProvider = captchaChallenge.type;
				captchaChallengeId = captchaChallenge.id;
				turnstileTokenRef.current = '';
				if (!captchaToken) {
					setLoading(false);
					return;
				}
			} else if (captchaChallenge.data?.challenge) {
				if (captchaStatus === 'solved' && captchaTokenRef.current) {
					if (Date.now() >= captchaExpireAtRef.current) {
						debug('onSubmit: token expired');
						setCaptchaStatus('expired');
						setLoading(false);
						return;
					}
					debug('onSubmit: taking captcha token');
					captchaToken = captchaTokenRef.current;
					captchaProvider = captchaProviderRef.current;
					captchaChallengeId = captchaChallengeIdRef.current;
					captchaTokenRef.current = '';
					// P3-02: Keep solved status visible for 1.5s
					setTimeout(() => setCaptchaStatus('idle'), 1500);
				} else if (captchaStatus === 'solving' || captchaStatus === 'fetching') {
					debug('onSubmit: captcha not ready, returning');
					setLoading(false);
					return;
				} else {
					debug('onSubmit: captcha unexpected status=', captchaStatus);
					setLoading(false);
					return;
				}
			}
		}

		debug('onSubmit: POST login, hasCaptcha=', !!captchaToken);
		try {
			if (data.tenantId) {
				useAuthStore.getState().setCurrentTenant(data.tenantId);
			}

			// Pre-compute device fingerprint for login request header + post-login mismatch detection
			let deviceFP: string | undefined;
			if (authConfig && isDeviceFingerprintEnabled(authConfig)) {
				deviceFP = await computeDeviceFingerprint();
			}

			let loginResult: any = null;

			const redirect = searchParams.get('redirect');

			// 密码传输预处? 根据租户配置决定模式
			const transmissionMode =
				inlineAuthConfig?.passwordPolicy?.passwordTransmission ||
				slugAuthConfig?.passwordPolicy?.passwordTransmission;
			const tenantIdForTransmission = data.tenantId || slugAuthConfig?.tenantId || '';
			const serverNonce =
				inlineAuthConfig?.transmissionNonce || (slugAuthConfig as any)?.transmissionNonce;
			const publicKey =
				inlineAuthConfig?.transmissionPublicKey || (slugAuthConfig as any)?.transmissionPublicKey;

			// asymmetric 模式使用 publicKey 替代 serverNonce
			const serverData = transmissionMode === 'asymmetric' ? publicKey : serverNonce;

			let transmissionResult;
			try {
				transmissionResult = await processPasswordForTransmission(
					data.password,
					transmissionMode,
					tenantIdForTransmission,
					serverData,
				);
			} catch {
				setError(t('login.error.transmissionFailed'));
				setLoading(false);
				return;
			}

			const loginData: Record<string, unknown> = {
				identity: data.identity,
				password: transmissionResult.password,
				tenantId: data.tenantId || undefined,
				passwordTransmission: transmissionResult.passwordTransmission,
			};
			if (transmissionResult.clientNonce) {
				loginData.clientNonce = transmissionResult.clientNonce;
			}
			if (transmissionResult.keyExchangeId) {
				loginData.keyExchangeId = transmissionResult.keyExchangeId;
			}
			if (transmissionResult.clientPubKey) {
				loginData.clientPubKey = transmissionResult.clientPubKey;
			}
			if (captchaToken) {
				loginData.captchaToken = captchaToken;
				loginData.captchaProvider = captchaProvider;
				loginData.captchaChallengeId = captchaChallengeId;
			}
			const res = await authLoginPost(loginData as any);
			loginResult = res;

			// Check must_change_password (force password change)
			const mustChange = loginResult.mustChangePassword || loginResult.data?.must_change_password;
			if (mustChange) {
				const forceToken = loginResult.forceToken || loginResult.data?.force_token || '';
				navigate(
					`/${tenantSlug}/change-password?mode=force&token=${encodeURIComponent(forceToken)}`,
				);
				return;
			}

			// Check password expiry warning
			const pwWarn = loginResult.passwordWarning || loginResult.data?.password_warning;
			if (pwWarn === 'expired_grace') {
				const daysLeft =
					loginResult.passwordExpiresInDays || loginResult.data?.password_expires_in || 7;
				setPasswordExpiryBanner(
					t('login.passwordExpiredGrace').replace('{{days}}', String(daysLeft)),
				);
			}

			if (
				('requiresMfa' in loginResult && loginResult.requiresMfa) ||
				loginResult.data?.requires_mfa
			) {
				const ct = loginResult.challengeToken || loginResult.data?.challenge_token || '';
				sessionStorage.setItem(
					'mfa_pre_auth',
					JSON.stringify({
						challengeToken: ct,
						tenantId: data.tenantId || '',
					}),
				);
				navigate(`/${tenantSlug}/mfa-challenge`);
				return;
			}
			if ('requiresEmailVerification' in loginResult && loginResult.requiresEmailVerification) {
				navigate(`/${tenantSlug}/verify-email`);
				return;
			}

			loginWithTokens(
				loginResult.accessToken || loginResult.data?.accessToken,
				loginResult.refreshToken || loginResult.data?.refreshToken,
				loginResult.user || loginResult.data?.user,
			);

			// Device fingerprint mismatch detection (R4 audit)
			if (deviceFP) {
				const lastFp = localStorage.getItem('device_fingerprint');
				if (lastFp && lastFp !== deviceFP) {
					if (import.meta.env.DEV) {
						console.warn(
							'[AUDIT] device.fingerprint.mismatch detected - possible account takeover',
						);
					}
					setNewDeviceBanner(true);
				}
				localStorage.setItem('device_fingerprint', deviceFP);
			}

			await loadAuthExtras();

			// P1-09: Reset local failure counter on successful login
			localFailureRef.current = 0;

			if (tenantSlug) {
				sessionStorage.setItem('auth_dashboard_slug', tenantSlug);
			}

			if (data.rememberMe) {
				localStorage.setItem('remember_me', 'true');
			} else {
				localStorage.removeItem('remember_me');
			}

			const oauthClientId = authConfig?.oauthClientId || (authConfig as any)?.oauth_client_id;

			const at = loginResult.accessToken || loginResult.data?.accessToken;

			if (redirect && isValidRedirect(redirect)) {
				// 注入租户 slug 到重定向 URL（如 /admin/ ?/acme-corp/admin/
				let finalRedirect = redirect;
				try {
					const url = new URL(redirect);
					// slug 注入目标域名：从当前域名剥离已知 portal 前缀得到根
					const _hostParts = window.location.hostname.split('.');
					const _knownPrefixes = [
						'auth',
						'admin',
						'security',
						'user',
						'status',
						'trust',
						'platform',
						'authenticator',
					];
					const slugRoot =
						_hostParts.length >= 3 && _knownPrefixes.includes(_hostParts[0])
							? _hostParts.slice(1).join('.')
							: getRootDomain(window.location.hostname);
					const slugDomains = ['app.' + slugRoot];
					const slugPaths = [
						'/admin/',
						'/developer/',
						'/security/',
						'/status/',
						'/trust/',
						'/platform/',
					];
					if (
						slugDomains.includes(url.hostname) &&
						tenantSlug &&
						!url.pathname.includes(`/${tenantSlug}/`)
					) {
						const needsSlug = slugPaths.some(
							(p) => url.pathname === p || url.pathname.startsWith(p),
						);
						if (needsSlug) {
							url.pathname = `/${tenantSlug}${url.pathname}`;
							finalRedirect = url.toString();
						}
					}
				} catch {
					/* ignore invalid URL */
				}
				window.location.href = finalRedirect;
			} else {
				const at = loginResult.accessToken || loginResult.data?.accessToken;
				// 偏好驱动的默认跳转
				const prefs = loginResult.user?.metadata?.portal_preferences;
				if (prefs?.default) {
					const portalUrl = getPortalUrl(prefs.default, tenantSlug || undefined);
					if (portalUrl) {
						window.location.href = portalUrl;
						return;
					}
				}

				// 统一使用同域 SPA 内导航，避免跨域 Zustand store 不可见导致重定向循环
				navigate(`/${tenantSlug}/dashboard`, { replace: true });
			}
		} catch (err: any) {
			const errCode = err?.response?.data?.code;
			// P2-01: 使用 X-RateLimit-Active 替代模糊后的 X-RateLimit-Step
			const step = err?.response?.headers?.['x-ratelimit-active'] === 'true' ? 1 : 0;
			debug('onSubmit: LOGIN FAILED code=', errCode, 'step=', step);
			// P1-09: Increment local failure counter for 400-series errors
			if (typeof errCode === 'string' && errCode.startsWith('400')) {
				localFailureRef.current += 1;
			}
			// 错误横幅只显示登录错误（密码错、账号锁定等?
			// captcha 相关错误(40800505/40800506)?captcha 区域自己展示
			if (errCode !== 40800505 && errCode !== 40800506) {
				setError(getErrorMessage(err, t));
			}
			setRateLimitStep(step >= 1 ? step : 0);
			setCaptchaRefreshKey((k) => k + 1);
		} finally {
			debug('onSubmit: DONE loading=false');
			setLoading(false);
		}
	};

	const handleTenantChange = useCallback(
		(tenantId: string) => {
			setValue('tenantId', tenantId);
			if (tenantId) {
				setInlineAuthConfigId(tenantId);
			}
		},
		[setValue],
	);

	const logoUrl = useTenantBrandingStore((s) => s.branding?.logoUrl);
	const brandingTitle = useTenantBrandingStore((s) => s.branding?.loginPageTitle);
	const brandingDesc = useTenantBrandingStore((s) => s.branding?.loginPageDescription);

	const handleAuthConfigLoaded = useCallback((config: any) => {
		if (config) {
			setInlineAuthConfigId(null); // Config already loaded via callback
		}
	}, []);

	// Determine if we should show the tenant selector
	const showTenantSelector = !tenantSlug || slugConfigFailed;

	// Whether a tenant must be selected before allowing login
	const tenantRequired = !tenantSlug || slugConfigFailed;
	const tenantSelected = !tenantRequired || !!watch('tenantId');

	if (autoRedirectChecking) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-brand)]" />
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center px-4 py-8">
			<div className="w-full max-w-sm space-y-6 rounded-2xl bg-[var(--color-bg-surface)] p-8 shadow-lg">
				<div className="text-center">
					{logoUrl && (
						<div className="mb-4 flex justify-center">
							<img src={logoUrl} alt="租户标志" className="h-12 w-auto object-contain" />
						</div>
					)}
					<h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
						{brandingTitle || t('login.title')}
					</h1>
					<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
						{brandingDesc || t('login.subtitle')}
					</p>
				</div>

				{accountDeleted && (
					<div className="rounded-md bg-[var(--color-success)]/10 p-4 flex items-center gap-3">
						<CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--color-success)]" />
						<div>
							<p className="text-sm font-medium text-[var(--color-success)]">
								{t('auth.login.accountDeleted')}
							</p>
							<p className="text-xs text-[var(--color-success)] mt-0.5">
								{t('auth.login.gdprNotice')}
							</p>
						</div>
					</div>
				)}

				{/* Password expiry banner */}
				{passwordExpiryBanner && (
					<div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 flex items-center justify-between animate-[slideInDown_300ms_ease-out]">
						<span>{passwordExpiryBanner}</span>
						<Link
							to={tenantSlug ? `/${tenantSlug}/change-password` : '/'}
							className="ml-2 shrink-0 font-medium text-amber-700 underline hover:text-amber-900"
						>
							{t('login.passwordExpiring')}
						</Link>
					</div>
				)}

				{newDeviceBanner && (
					<div className="rounded-md border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10 p-4 space-y-2 animate-[slideInDown_300ms_ease-out_100ms]">
						<p className="text-sm font-medium text-[var(--color-brand)]">
							{t('login.newDeviceTitle')}
						</p>
						<p className="text-xs text-[var(--color-brand)]">{t('login.newDeviceDesc')}</p>
					</div>
				)}

				{/* Tenant selector (no slug, or slug config failed) */}
				{showTenantSelector && (
					<>
						{slugConfigFailed && (
							<div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
								{t('login.tenantNotFound') || '未找到该组织的配置，请手动选择租户'}
							</div>
						)}
						<TenantSelector
							value={watch('tenantId') || ''}
							tenants={tenants}
							loading={tenantsLoading || slugConfigLoading}
							onChange={handleTenantChange}
							onAuthConfigLoaded={handleAuthConfigLoaded}
							variant="login"
						/>
					</>
				)}

				{/* Compliance profile badge */}
				{authConfig?.complianceProfile?.standards &&
					authConfig.complianceProfile.standards.length > 0 && (
						<div className="flex items-center gap-2 rounded-md border border-green-100 bg-[var(--color-success)]/10 px-3 py-2 text-xs text-[var(--color-success)] animate-[fadeIn_300ms_ease-out]">
							<svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
							<span>{authConfig.complianceProfile.standards.join(', ')}</span>
						</div>
					)}

				{/* Login method tabs */}
				{loginMethods.length > 1 && (
					<div className="flex rounded-md bg-[var(--color-bg-muted)] p-1">
						{[
							{ key: 'password', icon: Lock, label: t('auth.login.passwordTab') },
							{ key: 'qr', icon: QrCode, label: t('auth.login.qrTab') },
							{ key: 'magic_link', icon: Mail, label: t('magicLink.title') },
							{ key: 'passkey', icon: Fingerprint, label: t('passkey.submitLogin') },
							{
								key: 'email_code',
								icon: Inbox,
								label: t('auth.login.emailCodeTab') || '邮箱验证码登录',
							},
							{
								key: 'phone_code',
								icon: Smartphone,
								label: t('auth.login.phoneCodeTab') || '短信验证码登录',
							},
						]
							.filter((m) => loginMethods.includes(m.key))
							.map(({ key, icon: Icon, label }) => (
								<button
									key={key}
									type="button"
									onClick={() => setLoginMethod(key as typeof loginMethod)}
									className={`flex flex-1 flex-col items-center gap-0.5 rounded-md px-1 py-2 text-xs font-medium transition-all duration-200 ${
										loginMethod === key
											? 'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-sm'
											: 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-surface)]/50 hover:text-[var(--color-text-secondary)]'
									}`}
								>
									<Icon className="h-5 w-5" />
									<span className="leading-tight">{label}</span>
								</button>
							))}
					</div>
				)}

				{/* Always show QR panel when qr is the only method OR selected */}
				{loginMethod === 'qr' && loginMethods.includes('qr') && <QRLoginPanel />}

				{loginMethod === 'magic_link' &&
					loginMethods.includes('magic_link') &&
					(tenantSlug && slugConfigLoading ? (
						<div className="space-y-4">
							<div className="h-10 animate-pulse rounded-md bg-[var(--color-bg-muted)]" />
							<div className="h-10 animate-pulse rounded-md bg-[var(--color-bg-muted)]" />
						</div>
					) : (
						<MagicLinkForm
							tenantId={slugAuthConfig?.tenantId || watch('tenantId')}
							onBack={() => setLoginMethod('password')}
						/>
					))}

				{loginMethod === 'passkey' && loginMethods.includes('passkey') && (
					<PasskeyLoginButton tenantId={slugAuthConfig?.tenantId || watch('tenantId')} />
				)}

				{loginMethod === 'email_code' && loginMethods.includes('email_code') && (
					<EmailCodeLoginForm
						tenantId={slugAuthConfig?.tenantId || watch('tenantId')}
						authConfig={authConfig}
						onBack={() => setLoginMethod('password')}
						// P0-05: Pass captcha values for API calls
						captchaToken={captchaTokenRef.current || undefined}
						captchaProvider={captchaProviderRef.current || undefined}
						captchaChallengeId={captchaChallengeIdRef.current || undefined}
					/>
				)}

				{loginMethod === 'phone_code' && loginMethods.includes('phone_code') && (
					<PhoneCodeLoginForm
						tenantId={slugAuthConfig?.tenantId || watch('tenantId')}
						authConfig={authConfig}
						onBack={() => setLoginMethod('password')}
						// P0-05: Pass captcha values for API calls
						captchaToken={captchaTokenRef.current || undefined}
						captchaProvider={captchaProviderRef.current || undefined}
						captchaChallengeId={captchaChallengeIdRef.current || undefined}
					/>
				)}

				{loginMethod === 'identifier_first' && (
					<IdentifierFirstInput onBack={() => setLoginMethod('password')} />
				)}

				{/* Identifier-First entry link */}
				{!tenantSlug && loginMethod === 'password' && (
					<button
						type="button"
						onClick={() => setLoginMethod('identifier_first')}
						className="w-full text-center text-xs text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-all duration-200"
					>
						{t('auth.login.identifierFirst') || '通过邮箱查找组织'}
					</button>
				)}

				{/* Password form */}
				{loginMethod === 'password' && loginMethods.includes('password') && (
					<>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="identity">{t('login.identity')}</Label>
								<Input
									id="identity"
									placeholder={t('auth.login.identityPlaceholder')}
									autoComplete="username webauthn"
									{...register('identity')}
									error={errors.identity?.message}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">{t('login.password')}</Label>
								<PasswordInput
									id="password"
									autoComplete="current-password"
									placeholder={t('auth.login.passwordPlaceholder')}
									{...register('password')}
									error={errors.password?.message}
								/>
							</div>

							<div className="flex items-center justify-between">
								<label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer">
									<input
										type="checkbox"
										className="h-4 w-4 rounded border-[var(--color-border-subtle)] text-[var(--color-brand)] focus:ring-[var(--color-brand)] transition-all duration-200 checked:scale-110"
										{...register('rememberMe')}
										checked={rememberMe}
									/>
									{t('login.remember')}
								</label>
								<Link
									to={tenantSlug ? `/${tenantSlug}/forgot-password` : '/'}
									className="text-sm text-[var(--color-brand)] transition-all duration-200 hover:underline decoration-2 underline-offset-4"
								>
									{t('login.forgot')}
								</Link>
							</div>

							{error && (
								<div className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm text-danger animate-[slideInRight_300ms_ease-out]">
									{error}
								</div>
							)}

							{/* P1-09: Warm-up warning for consecutive failures */}
							{rateLimitStep === 0 && localFailureRef.current >= 3 && (
								<div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
									🟡 安全提示：您已连?{localFailureRef.current} 次登录失败。再失败 1
									次将启用人机验证
								</div>
							)}

							{/* CAPTCHA challenge */}
							{/* P3-03: Suppress panel in silent-only mode (silentChallengeEnabled && !captchaEnabled) */}
							{rateLimitStep >= 1 &&
								captchaStatus !== 'idle' &&
								!(authConfig?.silentChallengeEnabled && !authConfig?.captchaEnabled) && (
									<div
										// P3-04: Accessibility attributes for live region
										role="status"
										aria-live="polite"
										// P3-01: min-h prevents layout jump, transition smooths state changes
										className={`rounded-md border p-3 text-sm text-center min-h-[58px] transition-all duration-200 ease ${
											captchaStatus === 'solved'
												? 'border-[var(--color-success)]/20 bg-[var(--color-success)]/10 text-[var(--color-success)]'
												: captchaStatus === 'expired' || captchaStatus === 'error'
													? 'border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10 text-[var(--color-danger)]'
													: 'border-amber-200 bg-amber-50 text-amber-700'
										}`}
									>
										{captchaStatus === 'solved' ? (
											'安全检测通过'
										) : captchaStatus === 'expired' ? (
											// P1-01: Improved expired message
											'安全验证已过期，正在重新获取...'
										) : captchaStatus === 'error' ? (
											// P1-02: Error state with retry button
											<div className="flex flex-col items-center gap-2">
												<span>验证服务暂不可用</span>
												<button
													type="button"
													onClick={() => setCaptchaRefreshKey((k) => k + 1)}
													className="text-xs underline hover:no-underline"
												>
													重试安全验证
												</button>
											</div>
										) : captchaStatus === 'fetching' ? (
											'正在获取安全验证...'
										) : captchaStatus === 'solving' ? (
											// P0-01: Show progress bar + percentage
											<div className="flex flex-col items-center gap-2">
												<span>{captchaProgressText || '正在进行安全检?..'}</span>
												<progress
													className="w-full h-1.5 rounded"
													value={captchaProgressRef.current.current}
													max={captchaProgressRef.current.max || 1}
												/>
											</div>
										) : (
											'需要安全验证'
										)}
									</div>
								)}

							<Button
								type="submit"
								fullWidth
								isLoading={loading}
								className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
								disabled={!tenantSelected || (rateLimitStep >= 1 && captchaStatus !== 'solved')}
							>
								{!tenantSelected
									? t('login.selectTenantFirst') || '请先选择租户'
									: t('login.submit')}
							</Button>
						</form>
					</>
				)}

				{/* OAuth section - always show when providers available */}
				{oauthProviders.length > 0 && (
					<>
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-[var(--color-border)]" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-[var(--color-bg-primary)] px-2 text-[var(--color-text-secondary)]">
									{t('login.or')}
								</span>
							</div>
						</div>

						{oauthLoading ? (
							<div className="grid grid-cols-2 gap-3">
								<SkeletonCard />
								<SkeletonCard />
								<SkeletonCard />
							</div>
						) : (
							<div className="grid grid-cols-2 gap-3">
								{oauthProviders.map((provider) => (
									<Button
										key={provider.type}
										variant="outline"
										onClick={() => handleOAuthLogin(provider.type)}
										className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-brand"
									>
										{provider.type === 'google' && (
											<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
												<path
													d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
													fill="#4285F4"
												/>
												<path
													d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
													fill="#34A853"
												/>
												<path
													d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
													fill="#FBBC05"
												/>
												<path
													d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
													fill="#EA4335"
												/>
											</svg>
										)}
										{provider.type === 'github' && (
											<svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
											</svg>
										)}
										{provider.name}
									</Button>
								))}
							</div>
						)}
					</>
				)}

				{/* Passkey login - always show */}
				<PasskeyLoginButton tenantId={watch('tenantId')} />

				<div className="text-center text-sm">
					{t('login.noAccount')}{' '}
					<Link
						to={tenantSlug ? `/${tenantSlug}/register` : '/'}
						className="text-[var(--color-brand)] transition-all duration-200 hover:underline decoration-2 underline-offset-4"
					>
						{t('login.register')}
					</Link>
				</div>
			</div>
		</div>
	);
}
