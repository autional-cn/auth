import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RegisterPage from '../register/page';

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
vi.mock('@autional-cn/shared', () => ({
	loginWithTokens: (...args: any[]) => mockLoginWithTokens(...args),
	bffLogin: vi.fn(() => Promise.resolve({ code: 1, message: 'BFF unavailable' })),
	isBFFAvailable: () => false,
	useAuthStore: {
		getState: () => ({
			setAuth: vi.fn(),
			setCurrentTenant: vi.fn(),
			setPermissions: vi.fn(),
			setTenants: vi.fn(),
			setUser: vi.fn(),
		}),
	},
	getAccessToken: () => null,
	processPasswordForTransmission: async (password: string, mode?: string) => ({
		password,
		passwordTransmission: mode || 'plain',
	}),
}));

const mockAuthRegisterPost = vi.fn();
const mockAuthRegisterCheckUsername = vi.fn();
const mockAuthRegisterCheckEmail = vi.fn();
const mockAuthLoginPost = vi.fn();
const mockAuthMeConsentPost = vi.fn();
const mockCompliancePublicLegalDocuments = vi.fn();

vi.mock('@autional-cn/shared/generated/api', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional-cn/shared/generated/api')>();
	return {
		...actual,
		authRegisterPost: (...args: any[]) => mockAuthRegisterPost(...args),
		authRegisterCheckUsernamePost: (...args: any[]) => mockAuthRegisterCheckUsername(...args),
		authRegisterCheckEmailPost: (...args: any[]) => mockAuthRegisterCheckEmail(...args),
		authLoginPost: (...args: any[]) => mockAuthLoginPost(...args),
		authMeConsentPost: (...args: any[]) => mockAuthMeConsentPost(...args),
		compliancePublicLegalDocuments: (...args: any[]) => mockCompliancePublicLegalDocuments(...args),
	};
});

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderRegister() {
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={['/register']}>
				<RegisterPage />
			</MemoryRouter>
		</QueryClientProvider>,
	);
}

vi.mock('@/lib/api', () => ({
	loadAuthExtras: vi.fn(() => Promise.resolve()),
}));

vi.mock('@/lib/breach-check', () => ({
	checkPasswordBreached: vi.fn(() => Promise.resolve({ breached: false })),
}));

beforeEach(() => {
	vi.clearAllMocks();
	mockAuthRegisterCheckUsername.mockResolvedValue({ available: true });
	mockAuthRegisterCheckEmail.mockResolvedValue({ available: true });
});

describe('RegisterPage', () => {
	it('renders registration form fields', () => {
		renderRegister();
		expect(screen.getByPlaceholderText('请输入用户名')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('请输入邮箱地址')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('至少8个字符')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('再次输入密码')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'register.submit' })).toBeInTheDocument();
	});

	it('shows validation error for short password', async () => {
		renderRegister();
		fireEvent.change(screen.getByPlaceholderText('至少8个字符'), { target: { value: 'short' } });
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'register.submit' }));
		});
		expect(
			await screen.findByText('flat.validation.passwordMinLength {"min":8}'),
		).toBeInTheDocument();
	});

	it('shows username availability checking indicator', async () => {
		mockAuthRegisterCheckUsername.mockImplementation(
			() => new Promise((resolve) => setTimeout(() => resolve({ available: true }), 100)),
		);
		renderRegister();
		fireEvent.change(screen.getByPlaceholderText('请输入用户名'), {
			target: { value: 'testuser' },
		});
		await waitFor(() => {
			expect(screen.getByText('检查中...')).toBeInTheDocument();
		});
	});

	it('shows username taken indicator', async () => {
		mockAuthRegisterCheckUsername.mockResolvedValue({ available: false });
		renderRegister();
		fireEvent.change(screen.getByPlaceholderText('请输入用户名'), {
			target: { value: 'takenuser' },
		});
		await waitFor(() => {
			expect(screen.getByText(/该用户名已被占用/)).toBeInTheDocument();
		});
	});

	it('shows API error on registration failure', async () => {
		mockAuthRegisterPost.mockRejectedValue({
			response: { data: { message: '邮箱已被注册' } },
		});
		const user = userEvent.setup();
		renderRegister();
		await user.type(screen.getByPlaceholderText('请输入用户名'), 'newuser');
		await user.type(screen.getByPlaceholderText('请输入邮箱地址'), 'new@example.com');
		await user.type(screen.getByPlaceholderText('至少8个字符'), 'Str0ngPass!');
		await user.type(screen.getByPlaceholderText('再次输入密码'), 'Str0ngPass!');
		await user.click(screen.getByRole('checkbox'));

		await user.click(screen.getByRole('button', { name: 'register.submit' }));

		expect(await screen.findByText('邮箱已被注册')).toBeInTheDocument();
	});

	it('records terms consent with the version published by the API', async () => {
		mockAuthRegisterPost.mockResolvedValue({});
		mockAuthLoginPost.mockResolvedValue({
			accessToken: 'mock-access-token',
			refreshToken: 'mock-refresh-token',
			user: { id: 'user_01', username: 'newuser', email: 'new@example.com' },
		});
		mockAuthMeConsentPost.mockResolvedValue({});
		mockCompliancePublicLegalDocuments.mockResolvedValue({ version: 'v2' });
		const user = userEvent.setup();
		renderRegister();
		await user.type(screen.getByPlaceholderText('请输入用户名'), 'newuser');
		await user.type(screen.getByPlaceholderText('请输入邮箱地址'), 'new@example.com');
		await user.type(screen.getByPlaceholderText('至少8个字符'), 'Str0ngPass!');
		await user.type(screen.getByPlaceholderText('再次输入密码'), 'Str0ngPass!');
		await user.click(screen.getByRole('checkbox'));

		await user.click(screen.getByRole('button', { name: 'register.submit' }));

		await waitFor(() => {
			expect(mockAuthRegisterPost).toHaveBeenCalled();
		});
		await waitFor(() => {
			expect(mockAuthMeConsentPost).toHaveBeenCalledWith({
				scope: 'terms',
				granted: true,
				metadata: { version: 'v2' },
			});
		});
		expect(mockCompliancePublicLegalDocuments).toHaveBeenCalledWith({
			doc_type: 'terms',
			lang: 'zh-CN',
		});
	});

	it('omits the consent version instead of guessing when the legal-document API fails', async () => {
		mockAuthRegisterPost.mockResolvedValue({});
		mockAuthLoginPost.mockResolvedValue({
			accessToken: 'mock-access-token',
			refreshToken: 'mock-refresh-token',
			user: { id: 'user_01', username: 'newuser', email: 'new@example.com' },
		});
		mockAuthMeConsentPost.mockResolvedValue({});
		mockCompliancePublicLegalDocuments.mockRejectedValue(new Error('502'));
		const user = userEvent.setup();
		renderRegister();
		await user.type(screen.getByPlaceholderText('请输入用户名'), 'newuser');
		await user.type(screen.getByPlaceholderText('请输入邮箱地址'), 'new@example.com');
		await user.type(screen.getByPlaceholderText('至少8个字符'), 'Str0ngPass!');
		await user.type(screen.getByPlaceholderText('再次输入密码'), 'Str0ngPass!');
		await user.click(screen.getByRole('checkbox'));

		await user.click(screen.getByRole('button', { name: 'register.submit' }));

		await waitFor(() => {
			expect(mockAuthMeConsentPost).toHaveBeenCalled();
		});
		// 取不到版本就如实留空 —— 记一个猜的版本会让审计看到指向错误文本的"证据"
		const payload = mockAuthMeConsentPost.mock.calls[0][0];
		expect(payload.scope).toBe('terms');
		expect(payload.metadata).toBeUndefined();
	});

	it('keeps tenant slug in login link when accessed under /:tenantSlug/register', () => {
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter initialEntries={['/acme-corp/register']}>
					<Routes>
						<Route path="/:tenantSlug/register" element={<RegisterPage />} />
					</Routes>
				</MemoryRouter>
			</QueryClientProvider>,
		);

		const loginLink = screen.getByText('register.login').closest('a');
		expect(loginLink).toHaveAttribute('href', '/acme-corp/login');
	});
});
