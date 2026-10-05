'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router';
import { useAuth, extractList } from '@autional-cn/shared';
import { authMeSessions, authMeMemberships, authMePut } from '@autional-cn/shared/generated/api';
import { getMe } from '@/lib/api';
import { AuthCard } from '@/components/auth/AuthCard';
import {
	getAccessToken,
	useLogout,
	usePortalCatalog,
	getCurrentTenantId,
	usePublicTenantSlugs,
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
import { userPortalUrl } from '@/lib/portal-links';
import { useEffectiveTenantSlug } from '@/hooks/use-tenant-slug';

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

const PORTAL_LABELS: Record<string, string> = {
	admin: 'dashboard.adminConsole',
	security: 'dashboard.securityDashboard',
	user: 'dashboard.userPortal',
	authenticator: 'dashboard.authenticatorApp',
	status: 'dashboard.statusPage',
	trust: 'dashboard.trustCenter',
	platform: 'dashboard.platformConsole',
	developer: 'dashboard.developerPortal',
};

// /auth/me/sessions payload 经拦截器 camel 化后的行形状（见 identity dto.SessionResponse）
interface SessionInfo {
	deviceType?: string;
	userAgent?: string;
	ip?: string;
	isCurrentSession?: boolean;
	lastActiveAt?: string;
}

export default function DashboardPage() {
	const navigate = useNavigate();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();
	// AUTH-41：跨门户深链（账户中心 /security、/sessions）必须带生效租户 slug
	const slug = useEffectiveTenantSlug();
	const { user } = useAuth();
	const accessToken = getAccessToken();
	const { t } = useI18n();
	// 门户显示名按 code 走 i18n（中文界面本地化）；未收录的 code 回落 API 原名
	const portalLabel = (code: string, fallback: string) => {
		const key = PORTAL_LABELS[code];
		return key ? t(key) : fallback;
	};
	usePageTitle('dashboard.title');
	const [loading, setLoading] = useState(true);
	const [meError, setMeError] = useState(false);
	const [meData, setMeData] = useState<any>(null);
	const [memberships, setMemberships] = useState<MembershipInfo[]>([]);
	const [pendingMembers, setPendingMembers] = useState<MembershipInfo[]>([]);
	const [sessions, setSessions] = useState<SessionInfo[]>([]);

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

	// 从 meData/user metadata 加载 Portal 偏好（/auth/me 的 metadata 经拦截器 camel 化，
	// 存储键 portal_preferences → portalPreferences；值为保存时的 JSON 字符串）
	useEffect(() => {
		const remote = meData?.metadata?.portalPreferences ?? user?.metadata?.portalPreferences;
		if (remote) {
			try {
				const parsed = typeof remote === 'string' ? JSON.parse(remote) : remote;
				setPrefs({ show_all: true, visible: [], default: '', ...parsed });
			} catch {
				/* ignore */
			}
		} else if (meData?.tenantType || user?.tenant_type) {
			// 无用户偏好时，根据租户类型使用默认模板
			setPrefs(getDefaultPrefsByTenantType(meData?.tenantType || user?.tenant_type));
		}
	}, [meData, user]);

	// 保存 Portal 偏好到远程（经 shared 客户端：拦截器注入鉴权/租户头并把书面 camel 键
	// 转 snake 落库——存储键 portal_preferences；读取侧经拦截器还原为 portalPreferences）
	const savePrefs = useCallback(async (newPrefs: typeof prefs) => {
		setPrefs(newPrefs);
		setShowPrefs(false);
		try {
			await authMePut({ metadata: { portalPreferences: JSON.stringify(newPrefs) } });
		} catch {
			/* background save */
		}
	}, []);

	// 获取系统 Portal 列表（shared usePortalCatalog：self 端点 + 容错口径内置）
	const sessionTenantId = user?.tenant_id || getCurrentTenantId();
	// 平台租户不再特判隐藏（U94 移除）：2026-10-03 线上实测 self 端点对 platform 会话
	// 200 可用，当时"platform 平面会话 403"的前提已不复现；拉取失败/空列表时磁贴区
	// （allPortals.length > 0 条件）自然不渲染，无需按租户特判。
	const { portals: catalogPortals, allPortals: catalogAllPortals } = usePortalCatalog({
		tenantId: sessionTenantId,
		slug: tenantSlug,
	});

	// 账户数据装载：/auth/me 失败 → meError 非阻塞错误态 + 重试按钮复用本函数；
	// 会话/成员卡失败仅隐藏对应卡片，不阻塞页面主体（AUTH-43/44）
	const loadAccountData = useCallback(async () => {
		setLoading(true);
		try {
			const res = await getMe();
			setMeData(res);
			setMeError(false);
		} catch {
			setMeError(true);
		}
		try {
			// /auth/me/sessions：自作用域端点，payload = {items: [...]}（拦截器已 camel 化）
			const sessRes = await authMeSessions();
			setSessions(extractList<SessionInfo>(sessRes));
		} catch {
			/* 会话卡隐藏即可 */
		}
		try {
			// /auth/me/memberships：payload 为数组（NewDataResponse）
			const memRes = await authMeMemberships();
			const items = extractList<MembershipInfo>(memRes);
			setMemberships(items);
			setPendingMembers(items.filter((m) => m.status === 'pending'));
		} catch {
			/* 成员卡隐藏即可 */
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		const token = accessToken || getAccessToken();
		if (!token || token === 'undefined' || token === 'null') {
			if (!user) {
				navigate('/');
				return;
			}
		}

		loadAccountData();
	}, [accessToken, navigate, loadAccountData]);

	const handleLogout = useLogout();

	// 确保这些计算在早返回之前执行，保证 Hook 调用顺序一致
	const displayUser = meData || user;

	// 动态 Portal 列表（usePortalCatalog 已内置排除 auth/landing、order 排序与 URL 拼装）
	const allPortals = useMemo(() => {
		// 用户可见性偏好过滤
		if (prefs.show_all || !prefs.visible?.length) return catalogPortals;
		return catalogPortals.filter((p) => prefs.visible.includes(p.code));
	}, [catalogPortals, prefs]);

	// U93：URL 段 slug 必须与会话租户一致 —— 多标签/残留会话下 URL 可能指向另一租户，
	// 本页磁贴按 URL slug 拼链、数据却按会话租户取，混用会导出错租户的入口。
	// 会话租户 → slug 唯一权威 = 公开租户名单 id→name（name 即 slug；E10 教训：会话
	// tenants[].name 是展示名，不能当 slug）。名单未就绪/查不到 → fail-open 不拦截。
	const { data: knownTenants } = usePublicTenantSlugs();
	const sessionSlug = useMemo(() => {
		const match = (knownTenants ?? []).find((t) => !!t.id && t.id === sessionTenantId);
		return match?.name || match?.slug || undefined;
	}, [knownTenants, sessionTenantId]);
	const slugMismatch = !!tenantSlug && !!sessionSlug && tenantSlug !== sessionSlug;

	useEffect(() => {
		if (!slugMismatch || !sessionSlug) return;
		// 非登录意图场景：不清会话（区别于登录页「切换品牌」语义），改落会话租户自己的仪表盘
		navigate(`/${sessionSlug}/dashboard`, { replace: true });
	}, [slugMismatch, sessionSlug, navigate]);

	// 不一致期间同样停在加载态，避免按错 slug 拼出的磁贴闪一帧
	if (loading || slugMismatch) {
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
						<PendingApprovalBanner key={m.tenantId} tenantName={m.tenantName} status={m.status} />
					))}
				</div>
			)}

			<div className="space-y-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-brand-text">{t('dashboard.title')}</h1>
					<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
						{t('dashboard.loggedIn')}
					</p>
				</div>

				{meError && (
					<div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] px-4 py-3">
						<span className="text-sm text-[var(--color-text-secondary)]">
							{t('dashboard.accountLoadFailed', '账户信息加载失败，可重试')}
						</span>
						<button
							onClick={loadAccountData}
							className="shrink-0 text-sm font-medium text-brand-text transition-all duration-200 hover:underline decoration-2 underline-offset-4"
						>
							{t('dashboard.retry', '重试')}
						</button>
					</div>
				)}

				<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-6 space-y-4">
					<div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
						<span className="whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
							{t('dashboard.userId')}
						</span>
						<span className="break-all text-sm font-medium max-sm:text-xs">{displayUser?.id || '-'}</span>
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
								className={`text-sm font-medium ${displayUser?.mfaEnabled ? 'text-success-text' : 'text-[var(--color-text-muted)]'}`}
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
								className={`text-sm font-medium ${displayUser?.mfaEnabled ? 'text-success-text' : 'text-[var(--color-text-muted)]'}`}
							>
								{displayUser?.mfaEnabled ? t('dashboard.mfaEnabled') : t('dashboard.mfaDisabled')}
							</span>
						</div>
						<div className="flex flex-wrap gap-x-4 gap-y-1">
							<a
								href={userPortalUrl(slug, '/security')}
								className="inline-block text-sm text-brand-text transition-all duration-200 hover:underline decoration-2 underline-offset-4 font-medium"
							>
								{t('dashboard.manageSecurity')} →
							</a>
							<Link
								to={slug ? `/${slug}/account` : '/account'}
								className="inline-block text-sm text-brand-text transition-all duration-200 hover:underline decoration-2 underline-offset-4 font-medium"
							>
								{t('dashboard.accountHub', '账户与安全')} →
							</Link>
						</div>
					</div>
				)}

				{sessions.length > 0 && (
					<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-6 space-y-3">
						<h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
							{t('dashboard.activeSessions')}
						</h3>
						{sessions.slice(0, 3).map((s, i: number) => (
							<div
								key={i}
								className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]"
							>
								<span>
									{s.deviceType ||
										s.userAgent?.substring(0, 30) ||
										t('dashboard.unknownDevice')}
								</span>
								<span className={s.isCurrentSession ? 'text-success-text font-medium' : ''}>
									{s.isCurrentSession ? t('dashboard.currentSession') : s.lastActiveAt || ''}
								</span>
							</div>
						))}
						<a
							href={userPortalUrl(slug, '/sessions')}
							className="text-xs text-brand-text transition-all duration-200 hover:underline decoration-2 underline-offset-4 block mt-2"
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
								catalogAllPortals.map((app) => (
									<label
										key={app.code}
										className="flex items-center justify-between text-sm pl-4"
									>
										<span>{portalLabel(app.code, app.name)}</span>
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
									{catalogAllPortals.map((app) => (
										<option key={app.code} value={app.code}>
											{portalLabel(app.code, app.name)}
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

					{allPortals.length > 0 && (
						<div className="grid grid-cols-2 gap-3">
							{allPortals.map((p) => {
								const PortalIcon = PORTAL_ICONS[p.code] ?? Globe;
								return (
									<a
										key={p.url}
										href={p.url}
										className="group flex min-h-[96px] flex-col items-center justify-center gap-2.5 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 text-center transition-colors duration-150 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-surface)]"
									>
										<span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-bg-surface)] text-[var(--color-brand)] transition-colors duration-150 group-hover:bg-[var(--color-bg-muted)]">
											<PortalIcon className="h-6 w-6" aria-hidden="true" />
										</span>
										<span className="text-sm font-medium leading-tight text-[var(--color-text-primary)]">
											{portalLabel(p.code, p.name)}
										</span>
									</a>
								);
							})}
						</div>
					)}

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
