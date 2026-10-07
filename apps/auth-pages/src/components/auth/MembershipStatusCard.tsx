'use client';

import { useI18n } from '@/lib/i18n';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export interface MembershipInfo {
	tenantId: string;
	tenantName: string;
	role?: string;
	status: string;
	joinedAt?: string;
}

export interface MembershipStatusCardProps {
	memberships: MembershipInfo[];
	loading?: boolean;
}

const statusConfig: Record<
	string,
	{ icon: typeof CheckCircle; className: string; labelKey: string }
> = {
	active: { icon: CheckCircle, className: 'text-success-text', labelKey: 'membership.statusActive' },
	pending: { icon: Clock, className: 'text-amber-600', labelKey: 'membership.statusPending' },
	disabled: { icon: XCircle, className: 'text-danger-text', labelKey: 'membership.statusDisabled' },
};

const defaultStatusConfig = {
	icon: Clock,
	className: 'text-[var(--color-text-muted)]',
	labelKey: 'membership.statusUnknown',
};

/**
 * 成员状态卡片组件
 *
 * 展示当前用户在各租户下的成员身份状态，
 * 支持 active / pending / disabled 三种状态。
 */
export function MembershipStatusCard({ memberships, loading = false }: MembershipStatusCardProps) {
	const { t } = useI18n();

	if (loading) {
		return (
			<div className="space-y-3 rounded-lg border border-neutral-200 p-4">
				<div className="h-5 w-32 animate-pulse rounded-xs bg-neutral-200" />
				{[1, 2, 3].map((i) => (
					<div key={i} className="h-14 animate-pulse rounded-md bg-neutral-100" />
				))}
			</div>
		);
	}

	if (!memberships || memberships.length === 0) {
		return null;
	}

	return (
		<div className="rounded-lg border border-neutral-200 p-4">
			<h3 className="mb-3 text-sm font-semibold text-neutral-800">
				{t('membership.title') || '我的租户成员状态'}
			</h3>
			<div className="space-y-2">
				{memberships.map((m) => {
					const cfg = statusConfig[m.status] || defaultStatusConfig;
					const Icon = cfg.icon;
					return (
						<div
							key={m.tenantId}
							className="flex items-center justify-between rounded-md border border-neutral-100 bg-white px-3 py-2.5"
						>
							<div className="flex items-center gap-2.5">
								<Icon className={`h-4 w-4 ${cfg.className}`} />
								<div>
									<p className="text-sm font-medium text-neutral-800">
										{m.tenantName || m.tenantId}
									</p>
									{m.role && <p className="text-xs text-neutral-500">{m.role}</p>}
								</div>
							</div>
							<span
								className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
									m.status === 'active'
										? 'bg-success-soft text-success-text'
										: m.status === 'pending'
											? 'bg-amber-50 text-amber-700'
											: 'bg-danger-soft text-danger-text'
								}`}
							>
								{t(cfg.labelKey) || m.status}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
