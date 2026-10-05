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
} from 'lucide-react';

// AUTH-41：用户门户深链必须带租户 slug（裸链 404），path 为门户内路径。
const links = [
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
		path: '/security',
		labelKey: 'account.changePassword',
		descKey: 'account.changePasswordDesc',
		icon: KeyRound,
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
	];

	usePageTitle('account.title');

	return (
		<AuthCard maxWidth="lg" title={t('account.title')} subtitle={t('account.subtitle')}>
			<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] divide-y divide-[var(--color-border-subtle)]">
				{links.map((link) => (
					<a
						key={link.path}
						href={userPortalUrl(slug, link.path)}
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
