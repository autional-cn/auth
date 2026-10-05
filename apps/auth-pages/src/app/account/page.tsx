import { useParams } from 'react-router';
import { useI18n } from '@/lib/i18n';
import { usePageTitle } from '@/hooks/use-page-title';
import { useEffectiveTenantSlug } from '@/hooks/use-tenant-slug';
import { userPortalUrl } from '@/lib/portal-links';
import { AuthCard } from '@/components/auth/AuthCard';
import {
	UserCircle,
	ShieldCheck,
	Monitor,
	Bell,
	KeyRound,
	ShieldAlert,
	History,
	Link2,
	Phone,
	Lock,
	UserX,
	type LucideIcon,
} from 'lucide-react';

type AccountLink = {
	path: string;
	labelKey: string;
	descKey: string;
	icon: LucideIcon;
	/** true = 本仓页面（auth-pages 路由）；未设 = 用户门户深链（AUTH-45①） */
	local?: boolean;
};

// AUTH-41：用户门户深链必须带租户 slug（裸链 404），path 为门户内路径。
const links: AccountLink[] = [
	{
		path: '/profile',
		labelKey: 'account.profile',
		descKey: 'account.profileDesc',
		icon: UserCircle,
	},
	{
		path: '/security',
		labelKey: 'account.security',
		descKey: 'account.securityDesc',
		icon: ShieldCheck,
	},
	{
		path: '/sessions',
		labelKey: 'account.sessions',
		descKey: 'account.sessionsDesc',
		icon: Monitor,
	},
	{
		path: '/notifications/preferences',
		labelKey: 'account.notifPrefs',
		descKey: 'account.notifPrefsDesc',
		icon: Bell,
	},
	{
		// AUTH-45①：改密表单在本仓（user 门户 /security 单页无法深链定位到改密），
		// 卡片指回 auth-pages 的 /<slug>/change-password
		path: '/change-password',
		labelKey: 'account.changePassword',
		descKey: 'account.changePasswordDesc',
		icon: KeyRound,
		local: true,
	},
	{
		path: '/security/login-history',
		labelKey: 'account.loginHistory',
		descKey: 'account.loginHistoryDesc',
		icon: History,
	},
	{
		path: '/security/role-activations',
		labelKey: 'account.roleActivations',
		descKey: 'account.roleActivationsDesc',
		icon: ShieldAlert,
	},
	{
		path: '/security/linked-accounts',
		labelKey: 'account.linkedAccounts',
		descKey: 'account.linkedAccountsDesc',
		icon: Link2,
	},
	{
		path: '/security/recovery-contacts',
		labelKey: 'account.recoveryContacts',
		descKey: 'account.recoveryContactsDesc',
		icon: Phone,
	},
];

export default function AccountPage() {
	const { t } = useI18n();
	const slug = useEffectiveTenantSlug();

	const { tenantSlug } = useParams();
	const privacyLinks = [
		{
			href: tenantSlug ? `/${tenantSlug}/privacy` : '/privacy',
			labelKey: 'account.privacyCenter',
			descKey: 'account.privacyCenterDesc',
			icon: Lock,
		},
		{
			// AUTH-45②：注销账户入口（本仓 account-deletion，RequireAuth 保护）
			href: tenantSlug ? `/${tenantSlug}/account-deletion` : '/account-deletion',
			labelKey: 'account.deleteAccount',
			descKey: 'account.deleteAccountDesc',
			icon: UserX,
		},
	];

	usePageTitle('account.title');

	return (
		<AuthCard maxWidth="lg" title={t('account.title')} subtitle={t('account.subtitle')}>
			<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] divide-y divide-[var(--color-border-subtle)]">
				{links.map((link) => (
					<a
						key={link.path}
						href={
							link.local
								? slug
									? `/${slug}${link.path}`
									: userPortalUrl(slug, '/security')
								: userPortalUrl(slug, link.path)
						}
						className="flex items-start gap-4 p-4 hover:bg-[var(--color-bg-muted)] transition-colors group"
					>
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--color-bg-muted)] group-hover:bg-brand-soft/20 transition-colors">
							<link.icon
								size={20}
								className="text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)] transition-colors"
							/>
						</div>
						<div>
							<p className="text-sm font-medium text-[var(--color-text-primary)]">
								{t(link.labelKey)}
							</p>
							<p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{t(link.descKey)}</p>
						</div>
					</a>
				))}
			</div>

			<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] divide-y divide-[var(--color-border-subtle)]">
				{privacyLinks.map((link) => (
					<a
						key={link.href}
						href={link.href}
						className="flex items-start gap-4 p-4 hover:bg-[var(--color-bg-muted)] transition-colors group"
					>
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--color-bg-muted)] group-hover:bg-brand-soft/20 transition-colors">
							<link.icon
								size={20}
								className="text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)] transition-colors"
							/>
						</div>
						<div>
							<p className="text-sm font-medium text-[var(--color-text-primary)]">
								{t(link.labelKey)}
							</p>
							<p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{t(link.descKey)}</p>
						</div>
					</a>
				))}
			</div>
		</AuthCard>
	);
}
