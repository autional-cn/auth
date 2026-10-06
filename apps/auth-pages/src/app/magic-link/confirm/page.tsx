'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router';
import { Button, ErrorState } from '@autional/ui';
import { authMe } from '@autional/shared/generated/api';
import {
	loginWithTokens,
	decodeJwtPayload,
	getCurrentRole,
	crossAppUrl,
	AuthService,
	ADMIN_CONSOLE_URL,
	SECURITY_DASHBOARD_URL,
	usePublicTenantSlugs,
	type User,
} from '@autional/shared';
import { loadAuthExtras } from '@/lib/api';
import { anchorSessionFromToken } from '@/lib/anchor-session';
import { getDashboardSlug } from '@/lib/dashboard-slug';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useI18n } from '@/lib/i18n';

type ConfirmStatus = 'verifying' | 'success' | 'error';

// 后端失败出口的 error 码（identity magic_link_handler.go 全集）→ 文案键。
// 未知码一律落通用「链接无效或已过期」，不把原始码暴露给用户。
const ERROR_MESSAGE_KEYS: Record<string, string> = {
	rate_limited: 'magicLink.errors.rateLimited',
	invalid_token: 'magicLink.errors.invalidToken',
	service_unavailable: 'magicLink.errors.serviceUnavailable',
	token_used: 'magicLink.errors.tokenUsed',
	token_expired: 'magicLink.errors.tokenExpired',
	magic_link_disabled: 'magicLink.errors.disabled',
	policy_check_failed: 'magicLink.errors.policyFailed',
	registration_restricted: 'magicLink.errors.registrationRestricted',
	user_creation_failed: 'magicLink.errors.userCreationFailed',
	account_locked: 'magicLink.errors.accountLocked',
	token_generation_failed: 'magicLink.errors.tokenGenerationFailed',
};

/**
 * 魔法链接结果页 —— 后端 302 流的唯一落点（AUTH-26）：
 *   成功：`#access_token=…&refresh_token=…`（fragment 不入服务端日志/Referer）
 *   失败：`?error=<码>`（经 ERROR_MESSAGE_KEYS 映射文案）
 * 页面职责 = 消费凭据建会话（与 OAuth 回调同法：JWT 兜底解析 user，/auth/me 异步补齐），
 * 随后按角色/租户定落点。旧实现自行 XHR 回调端点解析 JSON，与浏览器 302 流架构错配，
 * 恒落 error 态（且邮件链接从不指向本页，属孤儿路由）。
 */
function MagicLinkConfirmContent() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const { data: knownTenants } = usePublicTenantSlugs();

	const [status, setStatus] = useState<ConfirmStatus>('verifying');
	const [message, setMessage] = useState('');
	const [userEmail, setUserEmail] = useState('');

	const errorCode = searchParams.get('error') || '';
	const consumedRef = useRef(false);

	useEffect(() => {
		// 一次性消费：StrictMode 双执行下，复跑会读到已剥离的空 fragment，
		// 把成功态翻转成误报错。
		if (consumedRef.current) return;
		consumedRef.current = true;

		const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
		const fragment = new URLSearchParams(hash);
		const accessToken = fragment.get('access_token') || '';
		const refreshToken = fragment.get('refresh_token') || '';

		if (!accessToken) {
			setStatus('error');
			setMessage(
				errorCode && ERROR_MESSAGE_KEYS[errorCode]
					? t(ERROR_MESSAGE_KEYS[errorCode])
					: t('magicLink.confirmError'),
			);
			return;
		}

		// 凭据已读入内存，立即从地址栏剥离（历史/截图/书签不再携带 token）
		window.history.replaceState(null, '', window.location.pathname + window.location.search);

		// user 先由 JWT 载荷兜底（sub/tenant_id 必有；custom/顶层可能含 username），
		// 与 oauth-login 的「/auth/me 失败时兜底 JWT」同口径；展示身份随后异步水合。
		const payload = decodeJwtPayload(accessToken) as Record<string, any> | null;
		const user = {
			id: (payload?.sub as string) || '',
			username: (payload?.custom?.username || payload?.username || '') as string,
			email: (payload?.email || '') as string,
			status: 'active',
		} as User;
		loginWithTokens(accessToken, refreshToken, user);

		// AUTH-53 约束⑤：会话建立即锚定租户（JWT id + slug 参数/名单解析）
		anchorSessionFromToken(accessToken, { slug: tenantSlug || null, knownTenants });

		setStatus('success');

		// 展示身份水合（失败不阻断；消费方按 displayName→username→email 链回落）
		authMe()
			.then((me: any) => {
				if (me && (me.id || me.username || me.email)) {
					AuthService.updateUser(me as Partial<User>);
					if (me.email) setUserEmail(me.email as string);
				}
			})
			.catch(() => {});

		loadAuthExtras().finally(() => {
			const role = getCurrentRole();
			if (role === 'super_admin' || role === 'admin') {
				window.location.href = crossAppUrl(ADMIN_CONSOLE_URL());
			} else if (role === 'security_admin') {
				window.location.href = crossAppUrl(SECURITY_DASHBOARD_URL());
			} else {
				const slug = tenantSlug || getDashboardSlug();
				navigate(slug ? `/${slug}/dashboard` : '/dashboard', { replace: true });
			}
		});
	}, []);

	if (status === 'verifying') {
		return (
			<AuthCard>
				<AuthHeader title={t('magicLink.confirmTitle')} subtitle={t('magicLink.verifying')} />
				<div className="py-8 text-center text-sm text-neutral-500">{t('magicLink.verifying')}</div>
			</AuthCard>
		);
	}

	if (status === 'success') {
		const redirectLabel = userEmail
			? t('magicLink.successMessage').replace('{{email}}', userEmail)
			: t('magicLink.success');

		return (
			<AuthCard>
				<AuthHeader title={t('magicLink.confirmTitle')} subtitle={t('magicLink.success')} />
				<div className="space-y-6">
					<div className="rounded-md bg-success/10 p-4 text-center text-sm text-success-text">
						{redirectLabel}
					</div>
					<Button
						fullWidth
						onClick={() => {
							const slug = tenantSlug || getDashboardSlug();
							navigate(slug ? `/${slug}/dashboard` : '/dashboard', { replace: true });
						}}
					>
						{t('auth.common.continue')}
					</Button>
				</div>
			</AuthCard>
		);
	}

	return (
		<AuthCard>
			<AuthHeader title={t('magicLink.confirmTitle')} subtitle={t('magicLink.confirmSubtitle')} />
			<div className="space-y-6">
				<ErrorState
					title={message || t('magicLink.confirmError')}
					description={t('magicLink.confirmErrorDesc')}
					onRetry={() => navigate('/')}
				/>
			</div>
		</AuthCard>
	);
}

export default function MagicLinkConfirmPage() {
	const { t } = useI18n();

	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center px-4">
					<div className="w-full max-w-sm space-y-6 text-center">
						<h1 className="text-2xl font-bold">{t('magicLink.confirmTitle')}</h1>
						<p className="text-sm text-neutral-500">{t('auth.common.loading')}</p>
					</div>
				</div>
			}
		>
			<MagicLinkConfirmContent />
		</Suspense>
	);
}
