import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from '../dashboard/page';

const {
	mockHandleLogout,
	mockApiClientGet,
	mockGetMe,
	mockAuthMeMemberships,
	mockSessionsUserSessionsByUserId,
} = vi.hoisted(() => ({
	mockHandleLogout: vi.fn(),
	mockApiClientGet: vi.fn(() => Promise.resolve({ data: { items: [] } })),
	mockGetMe: vi.fn(),
	mockAuthMeMemberships: vi.fn(() => Promise.resolve({ items: [] })),
	mockSessionsUserSessionsByUserId: vi.fn(() => Promise.resolve({ items: [] })),
}));

const state = vi.hoisted(() => ({
	user: {
		id: 'user_123',
		username: 'testuser',
		email: 'test@example.com',
		status: 'active',
		mfaEnabled: true,
		lastLoginAt: '2026-06-09T08:00:00Z',
		lastLoginIp: '192.168.1.1',
		tenant_id: 'tenant-1',
	} as Record<string, any>,
	accessToken: 'fake-token',
	role: 'user' as string,
}));

// 模拟系统 Portal 列表（system-apps 接口返回，名称使用 i18n key 以便断言）
const mockSystemApps = vi.hoisted(() => [
	{
		code: 'admin',
		name: 'dashboard.adminConsole',
		order: 1,
		config: { portal: { allowed_roles: ['admin', 'super_admin'] } },
	},
	{
		code: 'security',
		name: 'dashboard.securityDashboard',
		order: 2,
		config: { portal: { allowed_roles: ['security_admin', 'super_admin'] } },
	},
	{ code: 'user', name: 'dashboard.userPortal', order: 3, config: {} },
	{ code: 'developer', name: 'dashboard.developerPortal', order: 4, config: {} },
]);

const mockFetch = vi.hoisted(() =>
	vi.fn(() =>
		Promise.resolve({ ok: true, json: () => Promise.resolve({ code: 0, data: mockSystemApps }) }),
	),
);

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => (opts ? `${key} ${JSON.stringify(opts)}` : key),
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

// 直接 mock useQuery：绕过真实 React Query 管线，返回模拟的 system-apps 数据
vi.mock('@tanstack/react-query', () => ({
	QueryClient: class {
		clear = vi.fn();
		defaultOptions = {};
	},
	QueryClientProvider: ({ children }: any) => children,
	useQuery: ({ queryKey }: any) =>
		queryKey?.[0] === 'system-portals'
			? { data: mockSystemApps, isLoading: false }
			: { data: undefined, isLoading: false },
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
		Link: ({ to, children }: any) => <a href={to}>{children}</a>,
	};
});

vi.mock('@autional-cn/shared', () => ({
	useAuthStore: Object.assign(
		vi.fn(() => ({ user: state.user, accessToken: state.accessToken })),
		{ getState: vi.fn(() => ({ user: state.user, accessToken: state.accessToken })) },
	),
	useAuth: () => ({ user: state.user, isAuthenticated: true }),
	apiClient: {
		get: vi.fn().mockImplementation((...args: any[]) => (mockApiClientGet as any)(...args)),
	},
	getAccessToken: vi.fn(() => state.accessToken),
	useLogout: () => mockHandleLogout,
	useCurrentRole: () => state.role,
	ADMIN_CONSOLE_URL: () => 'http://admin.example.com',
	DEVELOPER_PORTAL_URL: () => 'http://dev.example.com',
	END_USER_PORTAL_URL: () => 'http://user.example.com',
	SECURITY_DASHBOARD_URL: () => 'http://security.example.com',
	AUTHENTICATOR_APP_URL: () => 'http://authenticator.example.com',
	getPortalUrl: (code: string) => `http://${code}.example.com`,
	crossAppUrl: (url: string) => url,
}));

vi.mock('@autional-cn/shared/generated/api', () => ({
	authMeMemberships: (...args: any[]) => (mockAuthMeMemberships as any)(...args),
	sessionsUserSessionsByUser: (...args: any[]) =>
		(mockSessionsUserSessionsByUserId as any)(...args),
}));

vi.mock('@/lib/api', () => ({
	loadAuthExtras: vi.fn(() => Promise.resolve()),
	getMe: (...args: any[]) => mockGetMe(...args),
}));

vi.mock('@/lib/i18n', () => ({
	useI18n: () => ({
		t: (key: string, opts?: any) => (opts ? `${key} ${JSON.stringify(opts)}` : key),
		lang: 'zh-CN',
		setLang: vi.fn(),
	}),
	I18nProvider: ({ children }: any) => children,
	defaultLang: 'zh-CN',
}));

vi.mock('@/hooks/use-page-title', () => ({
	usePageTitle: vi.fn(),
}));

vi.mock('@/components/auth/PendingApprovalBanner', () => ({
	PendingApprovalBanner: ({ tenantName, status }: any) => (
		<div data-testid="pending-banner">
			{tenantName} - {status}
		</div>
	),
}));

vi.mock('@/components/auth/MembershipStatusCard', () => ({
	MembershipStatusCard: ({ memberships }: any) => (
		<div data-testid="membership-card">{memberships.length} 个成员身份</div>
	),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderPage = () =>
	render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={['/dashboard']}>
				<DashboardPage />
			</MemoryRouter>
		</QueryClientProvider>,
	);

beforeEach(() => {
	vi.clearAllMocks();
	state.user = {
		id: 'user_123',
		username: 'testuser',
		email: 'test@example.com',
		status: 'active',
		mfaEnabled: true,
		lastLoginAt: '2026-06-09T08:00:00Z',
		lastLoginIp: '192.168.1.1',
		tenant_id: 'tenant-1',
	};
	state.accessToken = 'fake-token';
	state.role = 'user';
	mockGetMe.mockResolvedValue(state.user);
	mockApiClientGet.mockResolvedValue({ data: { items: [] } });
	mockFetch.mockResolvedValue({
		ok: true,
		json: () => Promise.resolve({ code: 0, data: mockSystemApps }),
	});
	globalThis.fetch = mockFetch as any;
	queryClient.clear();
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('DashboardPage', () => {
	it('渲染用户信息（用户名、邮箱、ID、状态）', async () => {
		renderPage();

		await waitFor(() => {
			expect(screen.getByText('dashboard.userId')).toBeInTheDocument();
		});

		expect(screen.getByText('user_123')).toBeInTheDocument();
		expect(screen.getByText('testuser')).toBeInTheDocument();
		expect(screen.getByText('test@example.com')).toBeInTheDocument();
		expect(screen.getByText('active')).toBeInTheDocument();
	});

	it('根据 super_admin 角色显示管理员专属 Portal 链接', async () => {
		state.role = 'super_admin';
		renderPage();

		await waitFor(() => {
			expect(screen.getByText('dashboard.adminConsole')).toBeInTheDocument();
		});

		expect(screen.getByText('dashboard.securityDashboard')).toBeInTheDocument();
		expect(screen.getByText('dashboard.userPortal')).toBeInTheDocument();
		expect(screen.getByText('dashboard.developerPortal')).toBeInTheDocument();
	});

	it('普通用户不显示管理员 Portal 链接', async () => {
		state.role = 'user';
		renderPage();

		await waitFor(() => {
			expect(screen.getByText('dashboard.loggedIn')).toBeInTheDocument();
		});

		expect(screen.queryByText('dashboard.adminConsole')).not.toBeInTheDocument();
		expect(screen.queryByText('dashboard.securityDashboard')).not.toBeInTheDocument();
		expect(screen.getByText('dashboard.userPortal')).toBeInTheDocument();
		expect(screen.getByText('dashboard.developerPortal')).toBeInTheDocument();
	});

	it('显示安全概览卡片', async () => {
		renderPage();

		await waitFor(() => {
			expect(screen.getByText('dashboard.securityOverview')).toBeInTheDocument();
		});

		const mfaLabels = screen.getAllByText('dashboard.mfaEnabled');
		expect(mfaLabels).toHaveLength(2);
		expect(screen.getByText('dashboard.manageSecurity →')).toBeInTheDocument();
	});

	it('处理加载状态', () => {
		mockGetMe.mockImplementation(() => new Promise(() => {}));
		mockApiClientGet.mockImplementation(() => new Promise(() => {}));

		renderPage();

		expect(screen.getByText('dashboard.loading')).toBeInTheDocument();
	});

	it('有待审批的成员时显示待审批横幅', async () => {
		mockAuthMeMemberships.mockResolvedValue({
			items: [
				{ tenant_id: 't1', tenant_name: 'Acme Corp', status: 'pending' },
				{ tenant_id: 't2', tenant_name: 'Beta Inc', status: 'active' },
			],
		} as any);

		renderPage();

		await waitFor(() => {
			expect(screen.getByTestId('pending-banner')).toBeInTheDocument();
		});

		expect(screen.getByText('Acme Corp - pending')).toBeInTheDocument();
		expect(screen.getByTestId('membership-card')).toBeInTheDocument();
	});

	it('登出按钮渲染并触发登出', async () => {
		renderPage();

		await waitFor(() => {
			expect(screen.getByText('dashboard.logout')).toBeInTheDocument();
		});

		const user = userEvent.setup();
		await user.click(screen.getByText('dashboard.logout'));

		expect(mockHandleLogout).toHaveBeenCalled();
	});
});
