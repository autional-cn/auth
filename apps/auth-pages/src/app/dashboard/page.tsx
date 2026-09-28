'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth, extractItem, extractList } from '@autional-cn/shared';
import { sessionsUserSessionsByUser, authMeMemberships } from '@autional-cn/shared/generated/api';
import { getMe } from '@/lib/api';
import { AuthCard } from '@/components/auth/AuthCard';
import {
	getAccessToken,
	useLogout,
	crossAppUrl,
	getPortalUrl,
	useCurrentRole,
	getRootDomain,
	getCurrentTenantId,
	API_BASE_URL,
	END_USER_PORTAL_URL,
} from '@autional-cn/shared';
import {
	Shield,
	LogIn,
	ShieldAlert,
	User,
	KeyRound,
	Activity,
	ShieldCheck,
	Settings,
	Code2,
	Globe,
} from 'lucide-react';
import { PendingApprovalBanner } from '@/components/auth/PendingApprovalBanner';
import { MembershipStatusCard, type MembershipInfo } from '@/components/auth/MembershipStatusCard';
import { useI18n } from '@/lib/i18n';
import { usePageTitle } from '@/hooks/use-page-title';

const PORTAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
	admin: Shield,
	auth: LogIn,
	security: ShieldAlert,
	user: User,
	authenticator: KeyRound,
	status: Activity,
	trust: ShieldCheck,
	platform: Settings,
	developer: Code2,
	landing: Globe,
};

interface PortalEntry {
	label: string;
	url: string;
	code: string;
	icon?: string;
}

export default function DashboardPage() {
	const navigate = useNavigate();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	const { user } = useAuth();
	const accessToken = getAccessToken();
	const role = useCurrentRole();
	const { t } = useI18n();
	usePageTitle('dashboard.title');
	const [loading, setLoading] = useState(true);
	const [meData, setMeData] = useState<any>(null);
	const [memberships, setMemberships] = useState<MembershipInfo[]>([]);
	const [pendingMembers, setPendingMembers] = useState<MembershipInfo[]>([]);
	const [sessions, setSessions] = useState<any[]>([]);

	// 获取系统 Portal 列表
	const [showPrefs, setShowPrefs] = useState(false);
	// Portal 偏好（默认 show_all=true）
	const [prefs, setPrefs] = useState<{ show_all: boolean; visible: string[]; default: string }>({
		show_all: true,
		visible: [],
		default: '',
	});

	// 根据租户类型返回默认 Portal 可见性模板
	const getDefaultPrefsByTenantType = (tenantType?: string) => {
		switch (tenantType) {
			case 'enterprise':
			case 'platform':
				return { show_all: true as const, visible: [] as string[], default: 'admin' };
			case 'consumer':
				return {
					show_all: false as const,
					visible: ['user', 'authenticator'] as string[],
					default: 'user',
				};
			case 'compliance':
				return {
					show_all: true as const,
					visible: ['admin', 'security', 'user'] as string[],
					default: 'security',
				};
			default:
				return { show_all: true as const, visible: [] as string[], default: '' };
		}
	};

	// 从 meData/user metadata 加载 Portal 偏好
	useEffect(() => {
		const remote = meData?.metadata?.portal_preferences || user?.metadata?.portal_preferences;
		if (remote) {
			try {
				const parsed = typeof remote === 'string' ? JSON.parse(remote) : remote;
				setPrefs({ show_all: true, visible: [], default: '', ...parsed });
			} catch {
				/* ignore */
			}
		} else if (meData?.tenant_type || user?.tenant_type) {
			// 无用户偏好时，根据租户类型使用默认模板
			setPrefs(getDefaultPrefsByTenantType(meData?.tenant_type || user?.tenant_type));
		}
	}, [meData, user]);

	// 保存 Portal 偏好到远程
	const savePrefs = useCallback(async (newPrefs: typeof prefs) => {
		setPrefs(newPrefs);
		setShowPrefs(false);
		const token = getAccessToken();
		if (!token) return;
		try {
			await fetch(`${API_BASE_URL}/identity/api/v1/auth/me`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({
					metadata: { portal_preferences: JSON.stringify(newPrefs) },
				}),
			});
		} catch {
			/* background save */
		}
	}, []);

	// 获取系统 Portal 列表（使用 @tanstack/react-query）
	const qTenantId = meData?.tenant_id || user?.tenant_id || getCurrentTenantId();
	const qToken = getAccessToken();
	const { data: systemApps = [], isLoading: appsLoading } = useQuery({
		queryKey: ['system-portals', qTenantId],
		queryFn: async () => {
			const res = await fetch(
				`${API_BASE_URL}/tenant/api/v1/tenants/${qTenantId}/applications?type=portal&is_platform=true&status=active`,
				{ headers: { Authorization: `Bearer ${qToken}` } },
			).then((r) => r.json());
			if (res.code !== 0) return [];
			// tenant-service 分页响应为 { items: [...] }，非 { data: [...] }
			if (Array.isArray(res.data)) return res.data;
			if (Array.isArray(res.items)) return res.items;
			return [];
		},
		enabled: !!qTenantId && !!qToken,
		staleTime: 60000,
	});

	useEffect(() => {
		const token = accessToken || getAccessToken();
		if (!token || token === 'undefined' || token === 'null') {
			if (!user) {
				navigate('/');
				return;
			}
		}

		getMe()
			.then((res) => {
				setMeData(res);
				const userId = res.id || user?.id;
				if (userId) {
					sessionsUserSessionsByUser(userId)
						.then((sessRes: any) => {
							const sess = extractItem<{ sessions?: unknown[]; items?: unknown[] }>(
								sessRes.data,
							);
							setSessions((sess?.sessions as unknown[]) || extractList(sessRes.data) || []);
						})
						.catch(() => {
							// 静默失败
						});
				}
			})
			.catch(() => {
				// 静默失败
			});

		authMeMemberships()
			.then((res) => {
				const items: MembershipInfo[] = (res as any)?.items ?? [];
				setMemberships(items);
				const pending = items.filter((m) => m.status === 'pending');
				if (pending.length > 0) {
					setPendingMembers(pending);
				}
			})
			.catch(() => {
				// 静默失败
			})
			.finally(() => {
				setLoading(false);
			});
	}, [accessToken, navigate]);

	const handleLogout = useLogout();

	// 确保这些计算在早返回之前执行，保证 Hook 调用顺序一致
	const displayUser = meData || user;

	// 动态 Portal 列表（替换原有的硬编码入口）
	const allPortals: PortalEntry[] = useMemo(() => {
		if (!systemApps || systemApps.length === 0) return [];

		let visible = systemApps.filter((app: any) => {
			// 排除不需要在 Dashboard 展示的 Portal
			if (app.code === 'auth' || app.code === 'landing') return false;
			// 角色过滤
			const allowedRoles = app.config?.portal?.allowed_roles;
			return !allowedRoles || allowedRoles.includes(role);
		});

		// 用户可见性偏好过滤
		if (!prefs.show_all && prefs.visible?.length > 0) {
			visible = visible.filter((a: any) => prefs.visible.includes(a.code));
		}

		// 按 order 字段排序
		visible.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

		return visible.map((app: any) => ({
			label: app.name,
			// 门户入口一律带租户段：第二参是 slug，不是 tenant_id（ULID）
			url: getPortalUrl(app.code, tenantSlug || undefined),
			code: app.code,
			icon: app.icon_url,
		}));
	}, [systemApps, meData, user, accessToken, prefs, role, tenantSlug]);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-[var(--color-text-secondary)]">{t('dashboard.loading')}</div>
			</div>
		);
	}

	return (
		<AuthCard maxWidth="md">
			{pendingMembers.length > 0 && (
				<div className="space-y-3">
					{pendingMembers.map((m) => (
						<PendingApprovalBanner key={m.tenant_id} tenantName={m.tenant_name} status={m.status} />
					))}
				</div>
			)}

			<div className="space-y-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-[var(--color-brand)]">{t('dashboard.title')}</h1>
					<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
						{t('dashboard.loggedIn')}
					</p>
				</div>

				<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-6 space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm text-[var(--color-text-secondary)]">
							{t('dashboard.userId')}
						</span>
						<span className="text-sm font-medium">{displayUser?.id || '-'}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-[var(--color-text-secondary)]">
							{t('dashboard.username')}
						</span>
						<span className="text-sm font-medium">{displayUser?.username || '-'}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-[var(--color-text-secondary)]">
							{t('dashboard.email')}
						</span>
						<span className="text-sm font-medium">{displayUser?.email || '-'}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-[var(--color-text-secondary)]">
							{t('dashboard.status')}
						</span>
						<span className="text-sm font-medium">{displayUser?.status || 'active'}</span>
					</div>
					{displayUser?.mfaEnabled !== undefined && (
						<div className="flex items-center justify-between">
							<span className="text-sm text-[var(--color-text-secondary)]">MFA</span>
							<span
								className={`text-sm font-medium ${displayUser?.mfaEnabled ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}`}
							>
								{displayUser?.mfaEnabled ? t('dashboard.mfaEnabled') : t('dashboard.mfaDisabled')}
							</span>
						</div>
					)}
				</div>

				{displayUser?.mfaEnabled !== undefined && (
					<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-6 space-y-4">
						<h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
							{t('dashboard.securityOverview')}
						</h2>
						<div className="flex items-center justify-between">
							<span className="text-sm text-[var(--color-text-secondary)]">MFA</span>
							<span
								className={`text-sm font-medium ${displayUser?.mfaEnabled ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}`}
							>
								{displayUser?.mfaEnabled ? t('dashboard.mfaEnabled') : t('dashboard.mfaDisabled')}
							</span>
						</div>
						<a
							href={crossAppUrl(END_USER_PORTAL_URL(), '/security')}
							className="inline-block text-sm text-[var(--color-brand)] transition-all duration-200 hover:underline decoration-2 underline-offset-4 font-medium"
						>
							{t('dashboard.manageSecurity')} →
						</a>
					</div>
				)}

				{sessions.length > 0 && (
					<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-6 space-y-3">
						<h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
							{t('dashboard.activeSessions')}
						</h3>
						{sessions.slice(0, 3).map((s: any, i: number) => (
							<div
								key={i}
								className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]"
							>
								<span>
									{s.device || s.user_agent?.substring(0, 30) || t('dashboard.unknownDevice')}
								</span>
								<span className={s.is_current ? 'text-[var(--color-success)] font-medium' : ''}>
									{s.is_current ? t('dashboard.currentSession') : s.last_active_at || ''}
								</span>
							</div>
						))}
						<a
							href={crossAppUrl(END_USER_PORTAL_URL(), '/session/api/v1/sessions')}
							className="text-xs text-[var(--color-brand)] transition-all duration-200 hover:underline decoration-2 underline-offset-4 block mt-2"
						>
							{t('dashboard.viewAllSessions')}
						</a>
					</div>
				)}

				{displayUser?.lastLoginAt && (
					<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 space-y-2">
						<p className="text-sm font-medium text-[var(--color-text-primary)]">
							{t('dashboard.lastLogin')}
						</p>
						<div className="flex items-center justify-between">
							<span className="text-xs text-[var(--color-text-secondary)]">
								{t('dashboard.lastLoginTime', {
									time: new Date(displayUser.lastLoginAt).toLocaleString(),
								})}
							</span>
						</div>
						{displayUser?.lastLoginIp && (
							<div className="flex items-center justify-between">
								<span className="text-xs text-[var(--color-text-secondary)]">IP</span>
								<span className="text-xs font-medium">{displayUser.lastLoginIp}</span>
							</div>
						)}
					</div>
				)}

				{!displayUser?.lastLoginAt && (
					<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4">
						<p className="text-sm font-medium text-[var(--color-text-primary)]">
							{t('dashboard.lastLogin')}
						</p>
						<p className="mt-1 text-xs text-[var(--color-text-muted)]">
							{t('dashboard.lastLoginUnknown')}
						</p>
					</div>
				)}

				<div className="space-y-4">
					{/* Portal 配置按钮 */}
					<button
						onClick={() => setShowPrefs(!showPrefs)}
						className="w-full rounded-md border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] px-4 py-2 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] transition-colors"
					>
						{showPrefs
							? t('dashboard.hidePrefs', '收起配置')
							: t('dashboard.showPrefs', '配置 Portal 显示')}
					</button>

					{/* Portal 偏好面板 */}
					{showPrefs && (
						<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 space-y-3">
							<label className="flex items-center justify-between text-sm">
								<span>{t('dashboard.showAllPortals', '显示全部 Portal')}</span>
								<input
									type="checkbox"
									checked={prefs.show_all}
									onChange={(e) => setPrefs({ ...prefs, show_all: e.target.checked })}
									className="h-4 w-4"
								/>
							</label>

							{!prefs.show_all &&
								systemApps
									.filter((a: any) => a.code !== 'auth' && a.code !== 'landing')
									.map((app: any) => (
										<label
											key={app.code}
											className="flex items-center justify-between text-sm pl-4"
										>
											<span>{app.name}</span>
											<input
												type="checkbox"
												checked={prefs.visible.includes(app.code)}
												onChange={(e) => {
													const next = e.target.checked
														? [...prefs.visible, app.code]
														: prefs.visible.filter((c: string) => c !== app.code);
													setPrefs({ ...prefs, visible: next });
												}}
												className="h-4 w-4"
											/>
										</label>
									))}

							<div className="flex items-center justify-between text-sm pt-2 border-t border-[var(--color-border-subtle)]">
								<span>{t('dashboard.defaultPortal', '默认跳转')}</span>
								<select
									value={prefs.default}
									onChange={(e) => setPrefs({ ...prefs, default: e.target.value })}
									className="text-xs border border-[var(--color-border-subtle)] rounded px-2 py-1"
								>
									<option value="">{t('dashboard.roleDefault', '角色决定')}</option>
									{systemApps
										.filter((a: any) => a.code !== 'auth' && a.code !== 'landing')
										.map((app: any) => (
											<option key={app.code} value={app.code}>
												{app.name}
											</option>
										))}
								</select>
							</div>

							<button
								onClick={() => savePrefs(prefs)}
								className="w-full rounded-md bg-[var(--color-brand)] px-4 py-2 text-xs text-[var(--color-on-brand)] hover:opacity-90 transition-opacity"
							>
								{t('dashboard.savePrefs', '保存配置')}
							</button>
						</div>
					)}

					{allPortals.map((p) => {
						const PortalIcon = PORTAL_ICONS[p.code];
						return (
							<a key={p.url} href={p.url}>
								<button className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-muted)] transition-colors flex items-center gap-3">
									{PortalIcon && <PortalIcon className="h-5 w-5 text-[var(--color-text-muted)]" />}
									{p.label}
								</button>
							</a>
						);
					})}

					<button
						onClick={handleLogout}
						className="mt-4 w-full rounded-md bg-[var(--color-brand)] px-4 py-3 text-sm font-medium text-[var(--color-on-brand)] hover:opacity-90 transition-colors"
					>
						{t('dashboard.logout')}
					</button>
				</div>

				{memberships.length > 0 && <MembershipStatusCard memberships={memberships} />}
			</div>
		</AuthCard>
	);
}
