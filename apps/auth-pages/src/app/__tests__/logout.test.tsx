import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => (opts ? `${key} ${JSON.stringify(opts)}` : key),
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

const mockNavigate = vi.fn();
const mockClearAuth = vi.fn();

let mockAccessToken: string | null = 'token-xyz';

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
		Link: ({ to, children }: any) => <a href={to}>{children}</a>,
	};
});

const mockLogout = vi.fn();
vi.mock('@autional-cn/shared', () => ({
	useAuthStore: (selector?: any) => {
		const state = {
			user: mockAccessToken ? { id: '1', username: 'test', email: 'test@example.com' } : null,
			accessToken: mockAccessToken,
			refreshToken: 'refresh-xyz',
			clearAuth: mockClearAuth,
		};
		if (typeof selector === 'function') return selector(state);
		return state;
	},
	useAuth: () => ({
		user: mockAccessToken ? { id: '1', username: 'test', email: 'test@example.com' } : null,
	}),
	usePermission: () => ({ allowed: true }),
	useLogout: () => mockLogout,
	useCurrentRole: () => 'admin',
	// U93：dashboard 挂载即读公开租户名单做 slug↔会话校验；本套件测登出/渲染，空名单即 fail-open
	usePublicTenantSlugs: () => ({ data: [], isSuccess: true }),
	apiClient: {
		get: vi.fn(() => Promise.resolve({ data: { items: [] } })),
	},
	crossAppUrl: (url: string) => url,
	getAccessToken: () => mockAccessToken,
	getCurrentTenantId: () => 'tenant-1',
	ADMIN_CONSOLE_URL: () => '/admin',
	AUTH_PAGES_URL: () => '/auth',
	AUTHENTICATOR_APP_URL: () => '/authenticator',
	DEVELOPER_PORTAL_URL: () => '/developer',
	END_USER_PORTAL_URL: () => '/user',
	SECURITY_DASHBOARD_URL: () => '/security',
}));

vi.mock('@autional-cn/shared/generated/api', () => ({
	sessionsUserSessionsByUser: vi.fn(() => Promise.resolve({ data: { items: [] } })),
	authMeMemberships: vi.fn(() => Promise.resolve({ items: [] })),
}));

vi.mock('@/lib/api', () => ({
	getMe: vi.fn(() =>
		Promise.resolve({ id: '1', username: 'test', email: 'test@example.com', status: 'active' }),
	),
}));

import DashboardPage from '../dashboard/page';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderDashboard() {
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={['/dashboard']}>
				<DashboardPage />
			</MemoryRouter>
		</QueryClientProvider>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockAccessToken = 'token-xyz';
	const store: Record<string, string> = { access_token: 'token-xyz', refresh_token: 'refresh-xyz' };
	Object.defineProperty(window, 'localStorage', {
		value: {
			getItem: vi.fn((key: string) => store[key] || null),
			setItem: vi.fn(),
			removeItem: vi.fn((key: string) => {
				delete store[key];
			}),
			clear: vi.fn(),
			get length() {
				return Object.keys(store).length;
			},
			key: vi.fn((i: number) => Object.keys(store)[i] || null),
		},
		configurable: true,
		writable: true,
	});
});

describe('Logout / Dashboard', () => {
	it('displays user info after loading', async () => {
		renderDashboard();
		expect(await screen.findByText('dashboard.title', {}, { timeout: 3_000 })).toBeInTheDocument();
	});

	it('redirects to login when no token exists', async () => {
		mockAccessToken = null;
		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: vi.fn(() => null),
				setItem: vi.fn(),
				removeItem: vi.fn(),
				clear: vi.fn(),
				get length() {
					return 0;
				},
				key: vi.fn(() => null),
			},
			configurable: true,
			writable: true,
		});

		renderDashboard();
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/');
		});
	});
});
