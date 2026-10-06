'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Label, Input } from '@autional/ui';
import {
	authRegisterPost,
	authRegisterCheckUsernamePost,
	authRegisterCheckEmailPost,
	authLoginPost,
	authMeConsentPost,
	tenantPublicTenants,
	authCaptchaChallenge,
} from '@autional/shared/generated/api';
import { checkPasswordBreached } from '@/lib/breach-check';
import { fetchLegalDocumentVersion } from '@/lib/legal-document';
import { loadAuthExtras } from '@/lib/api';
import { loginWithTokens, bffLogin, isBFFAvailable, useAuthStore, navigateTo } from '@autional/shared';
import { anchorSessionFromToken } from '@/lib/anchor-session';
import { processPasswordForTransmission } from '@/lib/password-transmission';
import { createRegisterSchema } from '@/lib/validators';
import { useI18n } from '@/lib/i18n';
import { usePageTitle } from '@/hooks/use-page-title';
import { useTenantStore } from '@/lib/tenant-store';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { PasswordInput } from '@/components/form/PasswordInput';
import { TenantSelector, type TenantOption } from '@/components/auth/TenantSelector';
import { useTenantAuthConfig, useTenantAuthConfigBySlug } from '@/hooks/use-tenant-auth-config';
import { PasskeyRegisterButton } from '@/components/auth/PasskeyRegisterButton';
import { TurnstileWidget } from '@/components/auth/TurnstileWidget';
import { Captcha3DWidget } from '@/components/captcha/Captcha3DWidget';
import { solveProofOfWork } from '@/lib/silent-challenge';
import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import EmailCodeLoginForm from '@/components/auth/EmailCodeLoginForm';
import PhoneCodeLoginForm from '@/components/auth/PhoneCodeLoginForm';
import { type PasswordPolicy } from '@/hooks/use-tenant-auth-config';
import { Lock, Mail, Smartphone, Inbox } from 'lucide-react';
import { useTenantBrandingStore } from '@autional/shared/branding';

type CheckStatus = 'idle' | 'checking' | 'available' | 'taken';

interface PolicyRequirement {
	key: string;
	label: string;
	met: (password: string) => boolean;
}

function getPolicyRequirements(
	policy: PasswordPolicy | undefined,
	t: (key: string, params?: Record<string, unknown>) => string,
): PolicyRequirement[] {
	const items: PolicyRequirement[] = [];
	const minLen = policy?.minLength || 8;
	items.push({
		key: 'minLength',
		label: t('auth.password.minLengthReq', { minLen }),
		met: (p) => p.length >= minLen,
	});
	if (policy?.requireUpper) {
		items.push({
			key: 'upper',
			label: t('auth.password.upperReq'),
			met: (p) => /[A-Z]/.test(p),
		});
	}
	if (policy?.requireLower) {
		items.push({
			key: 'lower',
			label: t('auth.password.lowerReq'),
			met: (p) => /[a-z]/.test(p),
		});
	}
	if (policy?.requireDigit) {
		items.push({
			key: 'digit',
			label: t('auth.password.digitReq'),
			met: (p) => /\d/.test(p),
		});
	}
	if (policy?.requireSpecial) {
		items.push({
			key: 'special',
			label: t('auth.password.specialReq'),
			met: (p) => /[^a-zA-Z0-9]/.test(p),
		});
	}
	return items;
}

function PolicyChecklist({
	password,
	policy,
}: {
	password: string;
	policy: PasswordPolicy | undefined;
}) {
	const { t } = useI18n();
	const requirements = useMemo(() => getPolicyRequirements(policy, t), [policy, t]);

	if (requirements.length === 0 || !password) return null;

	return (
		<div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs space-y-1">
			<p className="font-medium text-neutral-600 mb-1">{t('auth.password.requirementsTitle')}</p>
			{requirements.map((req) => {
				const satisfied = req.met(password);
				return (
					<div key={req.key} className="flex items-center gap-2 transition-all duration-300">
						<span
							className={`transition-all duration-300 ${satisfied ? 'text-success-text' : 'text-neutral-400'}`}
						>
							{satisfied ? (
								<svg
									className="h-3.5 w-3.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							) : (
								<svg
									className="h-3.5 w-3.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							)}
						</span>
						<span
							className={`transition-all duration-300 ${satisfied ? 'text-success-text line-through opacity-60' : 'text-neutral-500'}`}
						>
							{req.label}
						</span>
					</div>
				);
			})}
		</div>
	);
}

export default function RegisterPage() {
	const { t, lang } = useI18n();
	const { tenantSlug: slugParam } = useParams();
	const tenantSlug = slugParam || null;
	usePageTitle('register.title');
	const branding = useTenantBrandingStore((s) => s.branding);
	const logoUrl = branding?.logoUrl;
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [registerMethod, setRegisterMethod] = useState<
		'password' | 'magic_link' | 'email_code' | 'phone_code'
	>('password');

	const [usernameStatus, setUsernameStatus] = useState<CheckStatus>('idle');
	const [emailStatus, setEmailStatus] = useState<CheckStatus>('idle');
	const [registrationSuccess, setRegistrationSuccess] = useState(false);
	// 注册成功后的 Passkey 登记需要原口令重认证（begin 端点 password 必填）
	const [registeredPassword, setRegisteredPassword] = useState('');
	const [rateLimitStep, setRateLimitStep] = useState(0);
	const turnstileTokenRef = useRef<string>('');

	const usernameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const emailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const prevTenantIdRef = useRef(''); // AUTH-04: 上次选中的租户 id（检测真实切换以清字段）

	// Tenant loading
	const [tenants, setTenants] = useState<TenantOption[]>([]);
	const [tenantsLoading, setTenantsLoading] = useState(true);
	const [selectedTenantId, setSelectedTenantId] = useState<string>('');

	const DEFAULT_TENANTS: TenantOption[] = [
		{
			id: '01KS1SZ6ME7MZ394GEY87NQDB7',
			name: 'acme-corp',
			display_name: 'Acme Corporation',
		},
	];

	// Load auth config by slug when present
	const { data: slugAuthConfig, isLoading: slugConfigLoading } = useTenantAuthConfigBySlug(
		tenantSlug || null,
	);

	const slugConfigFailed = useMemo(() => {
		return !!tenantSlug && !slugConfigLoading && !slugAuthConfig?.tenantId;
	}, [tenantSlug, slugConfigLoading, slugAuthConfig]);

	// Load tenants (when no tenantSlug, or slug config failed)
	useEffect(() => {
		if (tenantSlug && !slugConfigFailed) {
			setTenantsLoading(false);
			return;
		}
		const fetchTenants = async () => {
			try {
				const data = await tenantPublicTenants();
				const items: TenantOption[] = data?.items ?? [];
				if (items.length === 0) {
					setTenants(DEFAULT_TENANTS);
				} else {
					setTenants(items);
				}
			} catch {
				setTenants(DEFAULT_TENANTS);
			}
		};
		fetchTenants().finally(() => setTenantsLoading(false));
	}, [tenantSlug, slugConfigFailed]);

	// Auth config from inline tenant selection
	const [inlineConfigId, setInlineConfigId] = useState<string | null>(null);
	const { data: inlineAuthConfig } = useTenantAuthConfig(inlineConfigId);

	// Resolved config：slug 配置优先；未知 slug（探测失败）时回落手动选择的租户配置
	const authConfig = slugAuthConfig || inlineAuthConfig;

	// Resolved membership mode
	const membershipMode = authConfig?.membershipApproval;

	// Build dynamic schema
	const registerSchema = useMemo(
		() => createRegisterSchema(t, authConfig?.passwordPolicy, membershipMode),
		[lang, authConfig?.passwordPolicy, membershipMode],
	);

	type FormData = z.infer<typeof registerSchema>;

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<FormData>({ resolver: zodResolver(registerSchema) });

	const watchedUsername = watch('username');
	const watchedEmail = watch('email');
	const watchedAgreeTerms = watch('agreeTerms');
	const watchedPassword = watch('password');

	// Auto-set tenantId when slug path
	useEffect(() => {
		if (slugAuthConfig?.tenantId) {
			setSelectedTenantId(slugAuthConfig.tenantId);
		}
	}, [slugAuthConfig]);

	useEffect(() => {
		if (usernameTimer.current) clearTimeout(usernameTimer.current);
		if (!watchedUsername || watchedUsername.length < 3) {
			setUsernameStatus('idle');
			return;
		}
		setUsernameStatus('checking');
		usernameTimer.current = setTimeout(async () => {
			try {
				// POST 变体：GET 变体只读第二参 params，传 data 会被忽略 → 后端 400（AUTH-14）
				const res = await authRegisterCheckUsernamePost({ username: watchedUsername });
				setUsernameStatus(res.available ? 'available' : 'taken');
			} catch {
				setUsernameStatus('idle');
			}
		}, 500);
		return () => {
			if (usernameTimer.current) clearTimeout(usernameTimer.current);
		};
	}, [watchedUsername]);

	useEffect(() => {
		if (emailTimer.current) clearTimeout(emailTimer.current);
		if (!watchedEmail || !/^\S+@\S+\.\S+$/.test(watchedEmail)) {
			setEmailStatus('idle');
			return;
		}
		setEmailStatus('checking');
		emailTimer.current = setTimeout(async () => {
			try {
				const res = await authRegisterCheckEmailPost({ email: watchedEmail });
				setEmailStatus(res.available ? 'available' : 'taken');
			} catch {
				setEmailStatus('idle');
			}
		}, 500);
		return () => {
			if (emailTimer.current) clearTimeout(emailTimer.current);
		};
	}, [watchedEmail]);

	const onSubmit = async (data: FormData) => {
		setError('');

		let captchaToken: string | undefined;
		let captchaProvider: string | undefined;
		let captchaChallengeId: string | undefined;

		if (rateLimitStep >= 1) {
			const useTurnstile = !!import.meta.env.VITE_TURNSTILE_SITE_KEY;
			if (useTurnstile) {
				captchaToken = turnstileTokenRef.current;
				captchaProvider = 'turnstile';
				turnstileTokenRef.current = '';
				if (!captchaToken) {
					setError(t('login.error.captchaRequired'));
					return;
				}
			} else {
				try {
					const challenge = (await authCaptchaChallenge({
						provider: 'pow',
					})) as {
						id: string;
						type: string;
						data: { challenge: string; difficulty: number };
						expires_at: string;
					};
					if (challenge?.data?.challenge) {
						captchaToken = await solveProofOfWork(
							challenge.data.challenge,
							challenge.data.difficulty || 4,
						);
						captchaProvider = 'pow';
						captchaChallengeId = challenge.id;
					}
				} catch {
					setError(t('login.error.captchaUnavailable'));
					setLoading(false);
					return;
				}
			}
		}

		setRateLimitStep(0);

		try {
			const breachCheck = await checkPasswordBreached(data.password);
			if (breachCheck.breached) {
				setError(
					`此密码已在 ${breachCheck.count} 次数据泄露中出现，极易被攻击者破解。请选择其他密码。`,
				);
				return;
			}
		} catch {
			// 密码泄露检查失败时不阻塞注册流程
		}

		setLoading(true);
		try {
			// 密码传输预处理
			const transmissionMode = authConfig?.passwordPolicy?.passwordTransmission;
			const tenantIdForTransmission = authConfig?.tenantId || '';
			const serverNonce = (authConfig as any)?.transmissionNonce;
			const publicKey = (authConfig as any)?.transmissionPublicKey;
			const serverData = transmissionMode === 'asymmetric' ? publicKey : serverNonce;

			let transmissionResult;
			try {
				transmissionResult = await processPasswordForTransmission(
					data.password,
					transmissionMode,
					tenantIdForTransmission,
					serverData,
				);
			} catch (e) {
				setError('密码传输预处理失败');
				setLoading(false);
				return;
			}

			const payload: Record<string, any> = {
				username: data.username,
				email: data.email,
				password: transmissionResult.password,
				passwordTransmission: transmissionResult.passwordTransmission,
			};

			if (selectedTenantId) {
				payload.tenantId = selectedTenantId;
			}

			if ((data as any).invitation_code) {
				payload.invitationCode = (data as any).invitation_code;
			}

			if ((data as any).reason) {
				payload.reason = (data as any).reason;
			}

			if (captchaToken) {
				payload.captchaToken = captchaToken;
				payload.captchaProvider = captchaProvider;
				payload.captchaChallengeId = captchaChallengeId;
			}

			await authRegisterPost(payload);

			// 自动登录 = best-effort：注册已成功，登录失败绝不能把结果改写为「注册失败」（AUTH-13）。
			// 密码必须用与注册相同的传输处理结果 —— 裸明文在 hash 租户必 401。
			let sessionEstablished = false;
			let establishedToken = '';
			try {
				if (isBFFAvailable()) {
					const bffRes = await bffLogin(
						data.username,
						data.password,
						selectedTenantId || undefined,
					);
					if (bffRes.code === 0 && bffRes.data?.user) {
						useAuthStore.getState().setAuth('', '', bffRes.data.user as any);
						sessionEstablished = true;
					}
				} else {
					const loginData: Record<string, unknown> = {
						identity: data.username,
						password: transmissionResult.password,
						passwordTransmission: transmissionResult.passwordTransmission,
						tenantId: selectedTenantId || undefined,
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
					const loginRes = await authLoginPost(loginData as any);
					if (loginRes.accessToken) {
						loginWithTokens(loginRes.accessToken, loginRes.refreshToken, loginRes.user);
						sessionEstablished = true;
						establishedToken = loginRes.accessToken;
					}
				}
			} catch {
				// 静默：不弹错误、不阻断注册成功流程；用户可随后手动登录
			}

			// AUTH-53 约束⑤ / U384：自动登录建成会话后必须锚定租户（store 租户 id +
			// slug 标记）——否则残留的旧租户上下文让后续请求按错租户发出（注册后 403×4 实锤）
			if (sessionEstablished) {
				anchorSessionFromToken(establishedToken, {
					slug: slugAuthConfig?.tenantId ? tenantSlug : null,
					tenantId: selectedTenantId || slugAuthConfig?.tenantId || null,
					knownTenants: tenants,
				});
			}

			// 合规闭环：注册成功后记录用户对条款的同意（best-effort，失败不阻塞注册）
			// POST /auth/me/consent 需认证 — 此时 BFF cookie 或 accessToken 已就绪
			if (watchedAgreeTerms) {
				// 版本取接口真值（= 用户在 /terms 读到的那一版）；取不到则不带 version
				void fetchLegalDocumentVersion('terms', lang).then((version) =>
					authMeConsentPost({
						scope: 'terms',
						granted: true,
						metadata: version ? { version } : undefined,
					}).catch(() => {
						// consent 记录失败静默处理，不阻塞注册成功流程
					}),
				);
			}

			await loadAuthExtras().catch(() => {});
			setRegisteredPassword(data.password);
			setRegistrationSuccess(true);
		} catch (err: any) {
			const status = err?.response?.status;
			const message = err?.response?.data?.message;
			// 409 = 账号已存在（ErrCodeUserAlreadyExists 61000102）→ 给「去登录」指路，而非笼统失败
			setError(status === 409 ? message || t('auth.register.conflict') : message || '注册失败，请稍后重试');
			const step = parseInt(err?.response?.headers?.['x-ratelimit-step'] || '0', 10);
			if (step >= 1) {
				setRateLimitStep(step);
			}
		} finally {
			setLoading(false);
		}
	};

	// Auto-redirect to dashboard after successful registration if user doesn't interact
	useEffect(() => {
		if (!registrationSuccess) return;
		const dashUrl = tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard';
		const timer = setTimeout(() => {
			window.location.href = dashUrl;
		}, 12000);
		return () => clearTimeout(timer);
	}, [registrationSuccess]);

	function renderUsernameHint() {
		if (errors.username) return null;
		switch (usernameStatus) {
			case 'checking':
				return <p className="mt-1 text-xs text-[var(--color-text-secondary)]">检查中...</p>;
			case 'available':
				return <p className="mt-1 text-xs text-success-text">✅ 该用户名可用</p>;
			case 'taken':
				return <p className="mt-1 text-xs text-danger-text">❌ 该用户名已被占用</p>;
			default:
				return null;
		}
	}

	function renderEmailHint() {
		if (errors.email) return null;
		switch (emailStatus) {
			case 'checking':
				return <p className="mt-1 text-xs text-[var(--color-text-secondary)]">检查中...</p>;
			case 'available':
				return <p className="mt-1 text-xs text-success-text">该邮箱可用</p>;
			case 'taken':
				return <p className="mt-1 text-xs text-danger-text">该邮箱已被注册</p>;
			default:
				return null;
		}
	}

	const handleTenantChange = useCallback(
		(tenantId: string) => {
			// AUTH-04/H5：实际切换租户时清空已填字段（同值重选不动），防前租户输入残留
			if (tenantId !== prevTenantIdRef.current) {
				prevTenantIdRef.current = tenantId;
				setValue('username', '');
				setValue('email', '');
				setValue('password', '');
			}
			setSelectedTenantId(tenantId);
			if (tenantId) {
				setInlineConfigId(tenantId);
			}
		},
		[setValue],
	);

	const handleAuthConfigLoaded = useCallback((config: any) => {
		if (config) {
			setInlineConfigId(null);
		}
	}, []);

	if (registrationSuccess) {
		return (
			<AuthCard logoUrl={logoUrl} hideFooter>
				<AuthHeader title={t('register.success')} subtitle={t('register.successSubtitle')} />

				{authConfig?.passkeyEnabled !== false && (
					<PasskeyRegisterButton
						password={registeredPassword}
						tenantId={authConfig?.tenantId || selectedTenantId || undefined}
						onSkip={() =>
							(window.location.href = tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard')
						}
					/>
				)}
			</AuthCard>
		);
	}

	return (
		<AuthCard logoUrl={logoUrl} hideFooter>
			<AuthHeader title={t('register.title')} subtitle={t('register.subtitle')} />

			{/* Tab bar */}
			<div className="mb-4 grid grid-cols-4 gap-1 rounded-lg bg-[var(--color-bg-muted)] p-1">
				{[
					{ key: 'password', icon: Lock, label: t('auth.register.passwordTab') },
					{ key: 'magic_link', icon: Mail, label: t('auth.register.magicLinkTab') },
					{ key: 'email_code', icon: Inbox, label: t('auth.register.emailCodeTab') },
					{ key: 'phone_code', icon: Smartphone, label: t('auth.register.phoneCodeTab') },
				].map(({ key, icon: Icon, label }) => (
					<button
						key={key}
						type="button"
						onClick={() => setRegisterMethod(key as typeof registerMethod)}
						className={`flex flex-col items-center gap-0.5 rounded-md px-1 py-2 text-xs font-medium transition-all duration-200 ${
							registerMethod === key
								? 'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-sm'
								: 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
						}`}
					>
						<Icon className="h-5 w-5" />
						<span className="leading-tight">{label}</span>
					</button>
				))}
			</div>

			{registerMethod === 'magic_link' &&
				(tenantSlug && slugConfigLoading ? (
					<div className="space-y-4">
						<div className="h-10 animate-pulse rounded-md bg-neutral-200" />
						<div className="h-10 animate-pulse rounded-md bg-neutral-200" />
					</div>
				) : (
					<MagicLinkForm
						mode="register"
						tenantId={slugAuthConfig?.tenantId || selectedTenantId}
						onBack={() => setRegisterMethod('password')}
					/>
				))}

			{registerMethod === 'email_code' && (
				<EmailCodeLoginForm
					mode="register"
					tenantId={slugAuthConfig?.tenantId || selectedTenantId}
					onBack={() => setRegisterMethod('password')}
				/>
			)}

			{registerMethod === 'phone_code' && (
				<PhoneCodeLoginForm
					mode="register"
					tenantId={slugAuthConfig?.tenantId || selectedTenantId}
					onBack={() => setRegisterMethod('password')}
				/>
			)}

			{registerMethod === 'password' && (
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Tenant selector (no slug, or slug config failed) */}
					{(!tenantSlug || slugConfigFailed) && (
						<>
							{slugConfigFailed && (
								<div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
									{t('login.tenantNotFound') || '未找到该组织的配置，请手动选择租户'}
								</div>
							)}
							<TenantSelector
								value={selectedTenantId}
								tenants={tenants}
								loading={tenantsLoading || slugConfigLoading}
								onChange={handleTenantChange}
								onAuthConfigLoaded={handleAuthConfigLoaded}
								variant="register"
							/>
						</>
					)}

					{/* Tenant info card for valid slug path */}
					{tenantSlug && !slugConfigFailed && (
						<div className="flex items-center rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
							<span className="font-medium">{slugAuthConfig?.tenantName || tenantSlug}</span>
						</div>
					)}

					{/* Membership mode notice */}
					{membershipMode && (
						<div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
							{membershipMode === 'approval_required' && <p>{t('register.approvalNotice')}</p>}
							{membershipMode === 'invitation_only' && <p>{t('register.invitationOnly')}</p>}
							{membershipMode === 'open' && <p>{t('auth.register.openRegistration')}</p>}
						</div>
					)}

					{/* Invitation code field (invitation_only mode) */}
					{membershipMode === 'invitation_only' && (
						<div className="space-y-2">
							<Label htmlFor="invitationCode">{t('auth.register.invitationCode')}</Label>
							<Input
								id="invitationCode"
								placeholder={t('auth.register.invitationCodePlaceholder')}
								{...register('invitation_code' as any)}
								error={(errors as any).invitation_code?.message}
							/>
						</div>
					)}

					{/* Application reason field (approval_required mode) */}
					{membershipMode === 'approval_required' && (
						<div className="space-y-2">
							<Label htmlFor="reason">{t('register.applicationReason')}</Label>
							<textarea
								id="reason"
								rows={3}
								placeholder="请说明注册原因（选填）"
								className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
								{...register('reason' as any)}
							/>
							{(errors as any).reason?.message && (
								<p className="text-xs text-danger-text">{(errors as any).reason.message}</p>
							)}
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="username">{t('register.username')}</Label>
						<Input
							id="username"
							placeholder="请输入用户名"
							{...register('username')}
							error={errors.username?.message}
						/>
						{renderUsernameHint()}
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">{t('register.email')}</Label>
						<Input
							id="email"
							type="email"
							placeholder="请输入邮箱地址"
							{...register('email')}
							error={errors.email?.message}
						/>
						{renderEmailHint()}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">{t('register.password')}</Label>
						<PasswordInput
							id="password"
							autoComplete="new-password"
							placeholder="至少8个字符"
							showStrength
							showBreachCheck={authConfig?.breachCheckEnabled ?? false}
							policy={authConfig?.passwordPolicy}
							{...register('password')}
							error={errors.password?.message}
						/>
						<PolicyChecklist password={watchedPassword} policy={authConfig?.passwordPolicy} />
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">{t('register.confirmPassword')}</Label>
						<PasswordInput
							id="confirmPassword"
							autoComplete="new-password"
							placeholder="再次输入密码"
							{...register('confirmPassword')}
							error={errors.confirmPassword?.message}
						/>
					</div>

					<div className="space-y-2">
						<label className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer">
							<input
								id="agreeTerms"
								name="agreeTerms"
								type="checkbox"
								className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-[var(--color-brand)] focus:ring-[var(--color-brand)] transition-all duration-200 checked:scale-110"
								checked={watchedAgreeTerms || false}
								onChange={(e) =>
									setValue('agreeTerms' as any, e.target.checked as true, { shouldValidate: true })
								}
							/>
							<span>
								{t('register.agreeTerms')}
								<Link
									to={tenantSlug ? `/${tenantSlug}/terms` : '/terms'}
									className="text-brand-text transition-all duration-200 hover:underline decoration-2 underline-offset-4"
									target="_blank"
									rel="noopener"
								>
									{t('register.termsOfService')}
								</Link>
								{t('register.and')}
								<Link
									to={tenantSlug ? `/${tenantSlug}/privacy` : '/privacy'}
									className="text-brand-text transition-all duration-200 hover:underline decoration-2 underline-offset-4"
									target="_blank"
									rel="noopener"
								>
									{t('register.privacyPolicy')}
								</Link>
							</span>
						</label>
						{errors.agreeTerms && (
							<p className="text-xs text-danger-text">{errors.agreeTerms.message}</p>
						)}
					</div>

					{error && (
						<div className="rounded-md bg-danger/10 p-3 text-sm text-danger-text">
							{error}
						</div>
					)}

					{rateLimitStep >= 1 && (
						<div className="space-y-3">
							{authConfig?.captchaProvider === 'captcha3d' ? (
								<Captcha3DWidget
									apiBase="/bff/captcha3d/api/v1/captcha"
									onToken={(token: string) => {
										turnstileTokenRef.current = token;
									}}
								/>
							) : import.meta.env.VITE_TURNSTILE_SITE_KEY ? (
								<TurnstileWidget
									siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
									action="register"
									onToken={(token: string) => {
										turnstileTokenRef.current = token;
									}}
								/>
							) : (
								<div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 text-center">
									{t('login.captchaRequired')}
								</div>
							)}
						</div>
					)}

					<Button
						type="submit"
						fullWidth
						isLoading={loading}
						disabled={slugConfigFailed && !selectedTenantId}
					>
						{slugConfigFailed && !selectedTenantId
							? t('login.selectTenantFirst') || '请先选择租户'
							: t('register.submit')}
					</Button>
				</form>
			)}

			<div className="text-center text-sm">
				{t('register.hasAccount')}{' '}
				<Link
					to={tenantSlug ? `/${tenantSlug}/login` : '/login'}
					className="text-brand-text transition-all duration-200 hover:underline decoration-2 underline-offset-4"
				>
					{t('register.login')}
				</Link>
			</div>
		</AuthCard>
	);
}
