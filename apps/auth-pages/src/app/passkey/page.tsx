'use client';

import { useNavigate } from 'react-router';
import { useI18n } from '@/lib/i18n';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { userPortalUrl } from '@/lib/portal-links';
import { useEffectiveTenantSlug } from '@/hooks/use-tenant-slug';

/**
 * AUTH-39：本页原为孤儿重复实现（第二套 WebAuthn 登录链 + 服务端原始英文错误直渲 +
 * 「返回登录」按钮实际导航 dashboard）。真实 Passkey 登录入口 = 登录页内嵌
 * PasskeyLoginButton；注册/管理入口 = 账户中心。本页收敛为指引页，不再直渲任何
 * 服务端原始错误。
 */
export default function PasskeyPage() {
	const { t } = useI18n();
	const navigate = useNavigate();
	// AUTH-41：跨门户深链（登录页/账户中心）必须带生效租户 slug，裸链会错位
	const slug = useEffectiveTenantSlug();
	const loginPath = slug ? `/${slug}/login` : '/login';

	return (
		<AuthCard>
			<AuthHeader
				title={t('passkey.titleLogin')}
				subtitle={t('passkey.guidanceSubtitle')}
				logoUrl={undefined}
			/>

			<div className="space-y-2 rounded-md bg-[var(--color-bg-muted)] p-4 text-xs text-[var(--color-text-secondary)]">
				<p className="font-medium text-[var(--color-text-primary)]">{t('passkey.whatIs')}</p>
				<p>{t('passkey.description')}</p>
			</div>

			<div className="space-y-1 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 text-sm text-[var(--color-text-secondary)]">
				<p>{t('passkey.loginGuidance')}</p>
				<a href={loginPath} className="font-medium text-[var(--color-brand)] hover:underline">
					{t('passkey.goToLogin')} →
				</a>
			</div>

			<div className="space-y-1 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 text-sm text-[var(--color-text-secondary)]">
				<p>{t('passkey.registerMoved')}</p>
				<a
					href={userPortalUrl(slug, '/security')}
					className="font-medium text-[var(--color-brand)] hover:underline"
				>
					{t('passkey.goToAccountCenter')} →
				</a>
			</div>

			<div className="text-center text-sm">
				<button
					type="button"
					onClick={() => navigate(loginPath)}
					className="text-[var(--color-brand)] hover:underline"
				>
					{t('passkey.backLogin')}
				</button>
			</div>
		</AuthCard>
	);
}
