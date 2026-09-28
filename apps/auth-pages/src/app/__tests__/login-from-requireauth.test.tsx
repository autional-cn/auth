import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ============================================================
// L6③ / ADR-04 页面级：`from_requireauth=1` 回程分支
//  - 有会话且 client_id 可解析 → 直接起 PKCE（不重登）
//  - 有会话但回源仍无（存量租户未回填）→ 停住 + 停机提示，不弹跳、不循环
// ============================================================

const { mockState } = vi.hoisted(() => ({
	mockState: {
		token: null as string | null,
		clientId: null as string | null,
		initiated: [] as string[],
	},
}));

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => (opts ? `${key} ${JSON.stringify(opts)}` : key),
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
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
	loginWithTokens: vi.fn(),
	getAccessToken: () => mockState.token,
	initiateOAuthLogin: (clientId: string) => {
		mockState.initiated.push(clientId);
	},
	fetchOAuthClientIdBySlug: () => Promise.resolve(mockState.clientId),
	extractSlugFromPath: (pathname: string) => pathname.split('/').filter(Boolean)[0] ?? null,
	useAuthStore: {
		getState: () => ({
			setAuth: vi.fn(),
			setCurrentTenant: vi.fn(),
			setPermissions: vi.fn(),
			setTenants: vi.fn(),
		}),
	},
	apiClient: { get: vi.fn(() => Promise.resolve({ data: { items: [] } })) },
	isValidRedirect: () => false,
	isSameDomainOAuth: () => false,
	resolveEffectiveClientId: () => null,
	processPasswordForTransmission: async (password: string, mode?: string) => ({
		password,
		passwordTransmission: mode || 'plain',
	}),
	getPortalUrl: () => 'https://auth.autional.cn',
	getRootDomain: () => 'autional.cn',
}));

vi.mock('@autional-cn/shared/generated/api', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional-cn/shared/generated/api')>();
	return {
		...actual,
		authLoginPost: vi.fn(),
		authCaptchaChallenge: vi.fn(),
		authMe: vi.fn(() => Promise.resolve({})),
		authOauthProviders: vi.fn(() => Promise.resolve({ providers: [] })),
	};
});

vi.mock('@/lib/api', () => ({ loadAuthExtras: vi.fn(() => Promise.resolve()) }));

vi.mock('@/hooks/useAuthPageInit', () => ({
	useAuthPageInit: () => ({
		authConfig: { data: { tenantId: 't-test' }, isLoading: false, isError: false },
		publicTenants: { data: [], isLoading: false, isError: false },
		oauthProviders: { data: [], isLoading: false, isError: false },
		branding: { data: null, isLoading: false, isError: false },
		isLoading: false,
		isError: false,
	}),
}));

vi.mock('@/hooks/use-tenant-auth-config', () => ({
	useTenantAuthConfig: () => ({ data: { tenantId: 't-test' }, isLoading: false }),
}));

import LoginPage from '../page';

const REDIRECT = 'https://user.autional.cn/acme-corp/';
const ENTRY = `/acme-corp/login?from_requireauth=1&redirect=${encodeURIComponent(REDIRECT)}`;

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderPage() {
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={[ENTRY]}>
				<LoginPage />
			</MemoryRouter>
		</QueryClientProvider>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockState.token = 'session-token';
	mockState.clientId = null;
	mockState.initiated = [];
});

describe('登录页 from_requireauth 回程分支', () => {
	it('会话内可解析 client_id → 直接起 PKCE，不呈现登录表单', async () => {
		mockState.clientId = 'cid-acme';

		renderPage();

		await waitFor(() => {
			expect(mockState.initiated).toEqual(['cid-acme']);
		});
		expect(screen.queryByText('login.error.tenantNotConfigured')).toBeNull();
		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('回源仍无 client_id → 停住 + 停机提示，不弹跳、不循环', async () => {
		mockState.clientId = null;

		renderPage();

		await waitFor(() => {
			expect(screen.getByText('login.error.tenantNotConfigured')).toBeInTheDocument();
		});
		expect(mockState.initiated).toEqual([]);
		expect(mockNavigate).not.toHaveBeenCalled();
	});
});
