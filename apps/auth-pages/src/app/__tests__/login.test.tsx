import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from '../page';

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

const mockLoginWithTokens = vi.fn();
const mockGetAccessToken = vi.fn(() => null);

vi.mock('@autional-cn/shared', () => ({
	loginWithTokens: (...args: any[]) => mockLoginWithTokens(...args),
	getAccessToken: () => mockGetAccessToken(),
	bffLogin: vi.fn(() => Promise.resolve({ code: 1, message: 'BFF unavailable' })),
	isBFFAvailable: () => false,
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
	processPasswordForTransmission: async (password: string, mode?: string) => ({
		password,
		passwordTransmission: mode || 'plain',
	}),
}));

const mockAuthLoginPost = vi.fn();
const mockAuthOauthProviders = vi.fn((_opts?: any) => Promise.resolve({ providers: [] }));

vi.mock('@autional-cn/shared/generated/api', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional-cn/shared/generated/api')>();
	return {
		...actual,
		authLoginPost: (...args: any[]) => mockAuthLoginPost(...args),
		authOauthProviders: (...args: any[]) => mockAuthOauthProviders(...args),
	};
});

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderLogin() {
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={['/acme-corp/login']}>
				<LoginPage />
			</MemoryRouter>
		</QueryClientProvider>,
	);
}

vi.mock('@/lib/api', () => ({
	loadAuthExtras: vi.fn(() => Promise.resolve()),
}));

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

beforeEach(() => {
	vi.clearAllMocks();
	mockGetAccessToken.mockReturnValue(null);
});

describe('LoginPage', () => {
	it('renders identity input, password input, and login button', () => {
		renderLogin();
		expect(screen.getByPlaceholderText('auth.login.identityPlaceholder')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('auth.login.passwordPlaceholder')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'login.submit' })).toBeInTheDocument();
	});

	it('shows validation error when submitting empty form', async () => {
		renderLogin();
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'login.submit' }));
		});
		expect(screen.getByText('validation.identityRequired')).toBeInTheDocument();
	});

	it('shows error message on API failure', async () => {
		mockAuthLoginPost.mockRejectedValue({
			response: { data: { code: '40000001', message: '用户名或密码错误' } },
		});
		const user = userEvent.setup();
		renderLogin();
		await user.type(screen.getByPlaceholderText('auth.login.identityPlaceholder'), 'testuser');
		await user.type(screen.getByPlaceholderText('auth.login.passwordPlaceholder'), 'wrongpass');
		await user.click(screen.getByRole('button', { name: 'login.submit' }));

		await waitFor(() => {
			expect(screen.getByText('login.error.credentials')).toBeInTheDocument();
		});
	});

	it('navigates on successful login', async () => {
		mockAuthLoginPost.mockResolvedValue({
			accessToken: 'token-abc',
			refreshToken: 'refresh-abc',
			user: { id: '1', username: 'test', email: 'test@example.com' },
			riskAssessment: {},
		});
		const user = userEvent.setup();
		renderLogin();
		await user.type(screen.getByPlaceholderText('auth.login.identityPlaceholder'), 'testuser');
		await user.type(screen.getByPlaceholderText('auth.login.passwordPlaceholder'), 'pass123');
		await user.click(screen.getByRole('button', { name: 'login.submit' }));

		await waitFor(() => {
			expect(mockLoginWithTokens).toHaveBeenCalled();
		});
		expect(screen.queryByText('login.error.credentials')).toBeNull();
	});
});
