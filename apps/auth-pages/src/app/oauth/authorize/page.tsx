'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@autional/ui';
import { getAccessToken, apiClient, extractItem, decodeJwtPayload } from '@autional/shared';
import { getOAuthClient } from '@/lib/api.generated';
import { PublicAuthConfigByAuthConfig } from '@autional/shared/generated/api';
import { buildTenantLoginUrl, fetchTenantSlugByClientId } from '@/lib/oauth-cold-start';
import { oauthErrorText } from '@/lib/oauth-error-text';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';

function scopeToI18nKey(scope: string): string {
	const camel = scope.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
	return `auth.oauth.scope${camel.charAt(0).toUpperCase() + camel.slice(1)}`;
}

/**
 * 错误体归一化（U85）：`error` / `error_description` 在不同生产者手里可能是
 * 字符串（OAuth 规范），也可能是对象 —— 如 Vercel 平台错误的
 * `{"error":{"code":"…","message":"…"}}`。对象直接进 state 会被 JSX 当 child
 * 渲染触发 React #31 整页崩溃（502 窗口线上实证）。
 */
function pickErrorText(...candidates: unknown[]): string | null {
	for (const candidate of candidates) {
		const text = flattenError(candidate, 0);
		if (text) return text;
	}
	return null;
}

function flattenError(value: unknown, depth: number): string | null {
	if (typeof value === 'string') return value || null;
	if (!value || typeof value !== 'object' || depth >= 3) return null;
	const o = value as Record<string, unknown>;
	return (
		flattenError(o.message, depth + 1) ??
		flattenError(o.error_description, depth + 1) ??
		flattenError(o.error, depth + 1)
	);
}

function OAuthAuthorizeContent() {
	const { t } = useI18n();
	const [searchParams] = useSearchParams();
	const clientId = searchParams.get('client_id') || '';
	const redirectUri = searchParams.get('redirect_uri') || '';
	const scope = searchParams.get('scope') || '';
	const state = searchParams.get('state') || '';
	const codeChallenge = searchParams.get('code_challenge') || '';
	const codeChallengeMethod = searchParams.get('code_challenge_method') || 'S256';

	const [clientName, setClientName] = useState('');
	const [clientLogo, setClientLogo] = useState('');
	const [tenantBranding, setTenantBranding] = useState<{ name: string; logo: string } | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [userId, setUserId] = useState('');
	const [tenantId, setTenantId] = useState('');
	// AUTH-03：会话未确认（无 token 时 redirectToLogin 的异步 slug 解析在途）不渲染
	// 同意界面——原实现先渲染完整表单 ~0.5s 再跳走，未登录用户看到同意页闪烁。
	const [sessionState, setSessionState] = useState<'checking' | 'ready'>('checking');

	// 无会话时的出口：`<slug>/login?redirect=<本 authorize URL>`（TASK-07，短路 brand）。
	// slug 解析失败回退旧交棒链（由 EntryRouter 决定落点），不白屏。
	const redirectToLogin = async (): Promise<void> => {
		const authorizeUrl = window.location.pathname + window.location.search;
		const slug = clientId ? await fetchTenantSlugByClientId(clientId) : null;
		if (slug) {
			window.location.replace(buildTenantLoginUrl(slug, authorizeUrl));
			return;
		}
		window.location.replace(`/?redirect=${encodeURIComponent(authorizeUrl)}`);
	};

	useEffect(() => {
		const token = getAccessToken();
		if (!token || token === 'undefined' || token === 'null') {
			// 保持 sessionState='checking'：重定向完成前只渲染加载卡片（AUTH-03）
			void redirectToLogin();
			return;
		}
		const payload = decodeJwtPayload(token);
		if (payload) {
			setUserId((payload.user_id || payload.sub || '') as string);
			setTenantId((payload.tenant_id || payload.tenantId || '') as string);
		}
		setSessionState('ready');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!clientId) return;
		getOAuthClient(clientId)
			.then((res: any) => {
				// getOAuthClient 返回 res.data（api.generated 已 unwrap + apiClient camelCase 转换），
				// 但部分调用方可能直接传 axios response → 兼容两种形状
				const d = res?.data ?? res;
				// apiClient interceptor 将后端 client_name (snake_case) 转成 clientName (camelCase)
				setClientName(d?.clientName || d?.client_name || t('oauth.authorize.unknownApp'));
				setClientLogo(d?.logoUri || d?.logo_uri || '');
				const tenantID = d?.tenantId || d?.tenant_id;
				if (tenantID) {
					PublicAuthConfigByAuthConfig(tenantID)
						.then((configRes: any) => {
							const dd = configRes?.data ?? configRes;
							setTenantBranding({
								name: dd?.displayName || dd?.tenantName || dd?.display_name || dd?.tenant_name || '',
								logo: dd?.branding?.logoUrl || dd?.branding?.logo_url || '',
							});
						})
						.catch(() => {});
				}
			})
			.catch(() => {
				setClientName(t('oauth.authorize.unknownApp'));
			});
	}, [clientId]);

	// 同意提交：带 Bearer 的 fetch（TASK-15 前端半）。
	// 公开客户端的同意提交必须绑定会话 —— 表单裸 POST 不带凭据，会被服务端按
	// login_required 拒绝（W1 后端半）；fetch 提交由 oauth 服务 OptionalAuth 解析
	// Bearer 得到 user_id，与 body 断言交叉校验。Accept: application/json 时服务端回
	// 200 {redirect_to}（fetch 读不到 302 的 Location），前端整页跳转。
	const submitConsent = async (): Promise<void> => {
		// AUTH-46①：缺参预校验——client_id/redirect_uri 缺失时不再发起注定失败的 POST
		// （此前打到后端收 Gin binding 原文并落屏）
		if (!clientId || !redirectUri) {
			setError(t('oauth.authorize.missingParams'));
			return;
		}
		const token = getAccessToken();
		if (!token || token === 'undefined' || token === 'null') {
			await redirectToLogin(); // 会话中途失效 → 回登录页（redirect 指回本页）
			return;
		}
		setLoading(true);
		setError('');
		const fallback = t('oauth.authorize.authorizeFailed', '授权失败，请稍后重试');
		try {
			const body = new URLSearchParams({
				client_id: clientId,
				user_id: userId,
				tenant_id: tenantId,
				redirect_uri: redirectUri,
				scope,
				state,
				approved: 'true',
				response_type: 'code',
				code_challenge: codeChallenge,
				code_challenge_method: codeChallengeMethod,
			});
			const res = await fetch('/bff/oauth/api/v1/oauth/authorize', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: body.toString(),
			});
			const payload: any = await res.json().catch(() => null);

			// AUTH-47：服务端错误路径已按 Accept 协商回 JSON（oauth 3949cd1）；若仍收到 302
			// （旧版本/中间层），fetch 跟随重定向后真实错误只存在于 res.url 查询串——
			// 此前 payload=null 一律误报「授权响应异常」，真实原因（如缺 PKCE）被整条吞掉
			if (res.redirected && res.url) {
				try {
					const q = new URL(res.url).searchParams;
					const redirectErr = q.get('error');
					if (redirectErr) {
						setError(
							oauthErrorText(t, {
								code: redirectErr,
								description: q.get('error_description'),
								fallback,
							}),
						);
						setLoading(false);
						return;
					}
				} catch {
					/* res.url 不可解析 → 落通用分支 */
				}
			}

			if (!res.ok) {
				// 错误体归一化（U85）：error/error_description 可能是对象（Vercel 平台错误），
				// 对象直接进 JSX 会触发 React #31 整页崩溃——先经 pickErrorText 取字符串。
				// AUTH-46①：已知错误码 → 本地化（Gin binding 原文经码级映射被吸收，不再落屏）。
				const code = typeof payload?.error === 'string' ? payload.error : '';
				const description = pickErrorText(
					payload?.error_description,
					typeof payload?.error === 'object' ? payload.error : null,
					code ? null : payload?.message,
				);
				setError(oauthErrorText(t, { code, description, fallback }));
				setLoading(false);
				return;
			}
			const target = payload?.redirect_to || payload?.data?.redirect_to;
			if (!target) {
				setError(t('oauth.authorize.invalidResponse', '授权响应异常，未获取到跳转地址'));
				setLoading(false);
				return;
			}
			window.location.href = target;
		} catch {
			setError(fallback);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!clientId || !userId) return;
		const token = getAccessToken();
		if (!token) return;
		apiClient
			.get(`/oauth/api/v1/oauth/consent/check?client_id=${encodeURIComponent(clientId)}`) // @generated-api-exempt (new endpoint, co-committed with handler)
			.then((res: any) => {
				// interceptor 后 res.data 为 camelCase；兼容嵌套与 snake_case
				const d = extractItem<{ hasConsent?: boolean; has_consent?: boolean }>(res?.data);
				if (d?.hasConsent || d?.has_consent) {
					void submitConsent();
				}
			})
			.catch(() => {
				/* proceed to manual consent */
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientId, userId]);

	const scopes = scope.split(' ').filter(Boolean);

	// AUTH-03：会话未确认前不渲染同意界面（含表单/权限清单），仅加载卡片；
	// 无会话时 redirectToLogin 已在途，用户不会看到「同意→跳登录」的闪烁。
	if (sessionState !== 'ready') {
		return (
			<AuthCard>
				<AuthHeader title={t('auth.oauth.authorizeTitle')} subtitle={t('common.loading')} />
			</AuthCard>
		);
	}

	const handleDeny = () => {
		if (!redirectUri) {
			setError(t('auth.oauth.missingRedirect'));
			return;
		}
		const url = new URL(redirectUri);
		url.searchParams.set('error', 'access_denied');
		if (state) url.searchParams.set('state', state);
		window.location.href = url.toString();
	};

	return (
		<AuthCard>
			<div className="text-center">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-muted)] text-2xl">
					{clientLogo ? (
						<img
							src={clientLogo}
							alt={clientName}
							className="h-10 w-10 rounded-full object-cover"
						/>
					) : (
						'\uD83D\uDD10'
					)}
				</div>
				<AuthHeader
					title={t('auth.oauth.authorizeTitle')}
					subtitle={t('auth.oauth.requestAccess', { clientName })}
				/>
				{tenantBranding && (
					<div className="mt-3 flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
						{tenantBranding.logo ? (
							<img
								src={tenantBranding.logo}
								alt={tenantBranding.name}
								className="h-5 w-5 rounded-full object-cover"
							/>
						) : (
							<span className="text-lg">{'\uD83C\uDFE2'}</span>
						)}
						<span>{t('auth.oauth.underTenant', { tenant: tenantBranding.name })}</span>
					</div>
				)}
			</div>

			{error && (
				<div className="rounded-md bg-danger/10 p-3 text-sm text-danger-text">
					{error}
				</div>
			)}

			<div className="rounded-lg border border-[var(--color-border-subtle)] p-4">
				<p className="mb-3 text-sm font-medium text-[var(--color-text-primary)]">
					{t('auth.oauth.requestedPermissions')}
				</p>
				<ul className="space-y-2">
					{scopes.length === 0 && (
						<li className="text-sm text-[var(--color-text-secondary)]">
							{t('auth.oauth.basicPermission')}
						</li>
					)}
					{scopes.map((s) => (
						<li
							key={s}
							className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]"
						>
							<span className="text-success-text">&#x2713;</span>
							{t(scopeToI18nKey(s))}
						</li>
					))}
				</ul>
			</div>

			<form
				method="POST"
				action="/bff/oauth/api/v1/oauth/authorize"
				onSubmit={(e) => {
					e.preventDefault();
					void submitConsent();
				}}
			>
				<input type="hidden" name="client_id" value={clientId} />
				<input type="hidden" name="user_id" value={userId} />
				<input type="hidden" name="tenant_id" value={tenantId} />
				<input type="hidden" name="redirect_uri" value={redirectUri} />
				<input type="hidden" name="scope" value={scope} />
				<input type="hidden" name="state" value={state} />
				<input type="hidden" name="approved" value="true" />
				<input type="hidden" name="response_type" value="code" />
				<input type="hidden" name="code_challenge" value={codeChallenge} />
				<input type="hidden" name="code_challenge_method" value={codeChallengeMethod} />

				<div className="space-y-3">
					<Button type="submit" fullWidth isLoading={loading}>
						{t('auth.oauth.approve')}
					</Button>
					<Button type="button" variant="outline" fullWidth onClick={handleDeny} disabled={loading}>
						{t('auth.oauth.deny')}
					</Button>
				</div>
			</form>

			<p className="text-center text-xs text-[var(--color-text-muted)]">
				{t('auth.oauth.agreeNotice')}
			</p>
		</AuthCard>
	);
}

export default function OAuthAuthorizePage() {
	const { t } = useI18n();
	return (
		<Suspense
			fallback={
				<AuthCard>
					<AuthHeader title={t('auth.oauth.authorizeTitle')} subtitle={t('common.loading')} />
				</AuthCard>
			}
		>
			<OAuthAuthorizeContent />
		</Suspense>
	);
}
