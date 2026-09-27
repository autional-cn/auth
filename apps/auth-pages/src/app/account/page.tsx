import { END_USER_PORTAL_URL } from '@autional-cn/shared';
import { useParams } from 'react-router';
import { useI18n } from '@/lib/i18n';
import { usePageTitle } from '@/hooks/use-page-title';
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

const userPortalOrigin = (() => {
	return END_USER_PORTAL_URL();
})();

const links = [
	{
		href: `${userPortalOrigin}/profile`,
		labelKey: 'account.profile',
		descKey: 'account.profileDesc',
		icon: UserCircle,
	},
	{
		href: `${userPortalOrigin}/security`,
		labelKey: 'account.security',
		descKey: 'account.securityDesc',
		icon: ShieldCheck,
	},
	{
		href: `${userPortalOrigin}/session/api/v1/sessions`,
		labelKey: 'account.sessions',
		descKey: 'account.sessionsDesc',
		icon: Monitor,
	},
	{
		href: `${userPortalOrigin}/notification/api/v1/notifications/preferences`,
		labelKey: 'account.notifPrefs',
		descKey: 'account.notifPrefsDesc',
		icon: Bell,
	},
	{
		href: `${userPortalOrigin}/security`,
		labelKey: 'account.changePassword',
		descKey: 'account.changePasswordDesc',
		icon: KeyRound,
	},
	{
		href: `${userPortalOrigin}/security/login-history`,
		labelKey: 'account.loginHistory',
		descKey: 'account.loginHistoryDesc',
		icon: History,
	},
	{
		href: `${userPortalOrigin}/security/role-activations`,
		labelKey: 'account.roleActivations',
		descKey: 'account.roleActivationsDesc',
		icon: ShieldAlert,
	},
	{
		href: `${userPortalOrigin}/security/linked-accounts`,
		labelKey: 'account.linkedAccounts',
		descKey: 'account.linkedAccountsDesc',
		icon: Link2,
	},
	{
		href: `${userPortalOrigin}/security/recovery-contacts`,
		labelKey: 'account.recoveryContacts',
		descKey: 'account.recoveryContactsDesc',
		icon: Phone,
	},
];

export default function AccountPage() {
	const { t } = useI18n();

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
						key={link.href}
						href={link.href}
						className="flex items-start gap-4 p-4 hover:bg-[var(--color-bg-muted)] transition-colors group"
					>
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--color-bg-muted)] group-hover:bg-[var(--color-brand-soft)]/20 transition-colors">
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
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--color-bg-muted)] group-hover:bg-[var(--color-brand-soft)]/20 transition-colors">
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
