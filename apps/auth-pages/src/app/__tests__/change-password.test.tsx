import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import ChangePasswordPage from '../change-password/page';

const { mockApiClientPut, mockCheckBreached, mockAuthMePasswordPut } = vi.hoisted(() => ({
	mockApiClientPut: vi.fn(() => Promise.resolve({ data: {} })),
	mockCheckBreached: vi.fn(() => Promise.resolve({ breached: false })),
	mockAuthMePasswordPut: vi.fn(() => Promise.resolve({ code: 1 })),
}));

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => (opts ? `${key} ${JSON.stringify(opts)}` : key),
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

const mockNavigate = vi.fn();
let searchParams: URLSearchParams;
const mockUseSearchParams = vi.fn();

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useSearchParams: () => mockUseSearchParams(),
		Link: ({ to, children }: any) => <a href={to}>{children}</a>,
	};
});

vi.mock('@autional/shared', () => ({
	apiClient: {
		put: vi.fn().mockImplementation((...args: any[]) => (mockApiClientPut as any)(...args)),
		get: vi.fn(() => Promise.resolve({ data: { items: [] } })),
		post: vi.fn(),
	},
	useAuthStore: {
		getState: () => ({ currentTenantId: 'tid' }),
		subscribe: vi.fn(),
	},
	END_USER_PORTAL_URL: () => 'http://user.example.com',
	crossAppUrl: (url: string) => url,
	getAccessToken: vi.fn(() => null),
	isValidRedirect: vi.fn(() => false),
	processPasswordForTransmission: async (password: string, mode?: string) => ({
		password,
		passwordTransmission: mode || 'plain',
	}),
}));

vi.mock('@autional/shared/generated/api', () => ({
	authMePasswordPut: (...args: any[]) => (mockAuthMePasswordPut as any)(...args),
	PublicAuthConfigByAuthConfig: vi.fn(() =>
		Promise.resolve({ passwordPolicy: { passwordTransmission: 'plain' } }),
	),
}));

vi.mock('@/lib/api', () => ({
	loadAuthExtras: vi.fn(() => Promise.resolve()),
}));

vi.mock('@/hooks/use-tenant-auth-config', () => ({
	useTenantAuthConfigBySlug: () => ({ data: { tenantId: 'tid' } }),
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

vi.mock('@/lib/breach-check', () => ({
	checkPasswordBreached: vi
		.fn()
		.mockImplementation((...args: any[]) => (mockCheckBreached as any)(...args)),
}));

vi.mock('@autional/ui', () => ({
	Button: ({ children, isLoading, ...props }: any) => (
		<button disabled={isLoading} {...props}>
			{children}
		</button>
	),
	Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

vi.mock('@/components/form/PasswordInput', () => ({
	PasswordInput: ({ error, showStrength, ...props }: any) => (
		<div>
			<input type="password" {...props} />
			{error && <span className="input-error">{error}</span>}
		</div>
	),
}));

vi.mock('@/hooks/use-page-title', () => ({
	usePageTitle: vi.fn(),
}));

const renderPage = () =>
	render(
		<MemoryRouter initialEntries={['/change-password']}>
			<ChangePasswordPage />
		</MemoryRouter>,
	);

beforeEach(() => {
	vi.clearAllMocks();
	searchParams = new URLSearchParams();
	mockUseSearchParams.mockReturnValue([searchParams, vi.fn()]);
	mockApiClientPut.mockResolvedValue({ data: {} });
	mockCheckBreached.mockResolvedValue({ breached: false });
});

describe('ChangePasswordPage', () => {
	it('渲染强制修改密码模式，显示策略清单和提示横幅', async () => {
		searchParams = new URLSearchParams(
			'mode=force&policy=' +
				encodeURIComponent(
					JSON.stringify({ requireUpper: true, requireLower: true, requireDigit: true }),
				),
		);
		mockUseSearchParams.mockReturnValue([searchParams, vi.fn()]);

		renderPage();

		expect(screen.getByText('changePassword.forceBanner')).toBeInTheDocument();
		expect(screen.getByText(/changePassword\.forceTitle/)).toBeInTheDocument();
		expect(screen.getByText('changePassword.forceSubtitle')).toBeInTheDocument();

		const user = userEvent.setup();
		await user.type(screen.getByPlaceholderText('auth.password.newPasswordPlaceholder'), 'Hello');

		await waitFor(() => {
			expect(screen.getByText('auth.password.requirementsTitle')).toBeInTheDocument();
			expect(screen.getByText('auth.password.upperReq')).toBeInTheDocument();
			expect(screen.getByText('auth.password.lowerReq')).toBeInTheDocument();
			expect(screen.getByText('auth.password.digitReq')).toBeInTheDocument();
		});
	});

	// AUTH-22 回归锁：force 模式凭据 = 会话 JWT（登录期已建），载荷不得再携
	// force_token 死字段（identity 不签发也不校验；旧实现把查询串透传）。
	it('AUTH-22: force 模式提交载荷不含 force_token', async () => {
		searchParams = new URLSearchParams('mode=force');
		mockUseSearchParams.mockReturnValue([searchParams, vi.fn()]);

		const user = userEvent.setup();
		renderPage();

		await user.type(
			screen.getByPlaceholderText('auth.password.oldPasswordPlaceholder'),
			'OldPass1',
		);
		await user.type(
			screen.getByPlaceholderText('auth.password.newPasswordPlaceholder'),
			'NewStr0ng!',
		);
		await user.type(
			screen.getByPlaceholderText('auth.password.confirmPasswordPlaceholder'),
			'NewStr0ng!',
		);
		await user.click(screen.getByRole('button', { name: 'auth.password.setBtn' }));

		await waitFor(() => {
			expect(mockAuthMePasswordPut).toHaveBeenCalledTimes(1);
		});
		const payload = (mockAuthMePasswordPut as any).mock.calls[0][0] as Record<string, unknown>;
		expect(Object.keys(payload).sort()).toEqual([
			'newPassword',
			'oldPassword',
			'passwordTransmission',
		]);
	});

	it('渲染过期密码模式，显示账户中心链接', () => {
		searchParams = new URLSearchParams();
		mockUseSearchParams.mockReturnValue([searchParams, vi.fn()]);

		renderPage();

		expect(screen.queryByText('changePassword.forceBanner')).not.toBeInTheDocument();
		expect(screen.getByText('changePassword.subtitle')).toBeInTheDocument();
		expect(screen.getByText('auth.password.backToAccount')).toBeInTheDocument();
		expect(screen.getByText('changePassword.accountCenter')).toBeInTheDocument();
		expect(screen.getByText('changePassword.goToAccountCenter →')).toBeInTheDocument();
	});

	it('根据策略要求验证密码，不符合要求时显示 Zod 校验错误', async () => {
		searchParams = new URLSearchParams(
			'policy=' + encodeURIComponent(JSON.stringify({ requireUpper: true })),
		);
		mockUseSearchParams.mockReturnValue([searchParams, vi.fn()]);

		const user = userEvent.setup();
		renderPage();

		await user.type(
			screen.getByPlaceholderText('auth.password.oldPasswordPlaceholder'),
			'OldPass1',
		);
		await user.type(
			screen.getByPlaceholderText('auth.password.newPasswordPlaceholder'),
			'nouppercase1',
		);
		await user.type(
			screen.getByPlaceholderText('auth.password.confirmPasswordPlaceholder'),
			'nouppercase1',
		);
		await user.click(screen.getByRole('button', { name: 'auth.password.changeBtn' }));

		await waitFor(() => {
			expect(screen.getByText('auth.password.requireUpper')).toBeInTheDocument();
		});
	});

	it('密码修改成功后显示成功消息', async () => {
		mockAuthMePasswordPut.mockResolvedValue({ code: 1 });

		searchParams = new URLSearchParams();
		mockUseSearchParams.mockReturnValue([searchParams, vi.fn()]);

		const user = userEvent.setup();
		renderPage();

		await user.type(
			screen.getByPlaceholderText('auth.password.oldPasswordPlaceholder'),
			'OldPass1',
		);
		await user.type(
			screen.getByPlaceholderText('auth.password.newPasswordPlaceholder'),
			'NewStr0ng!',
		);
		await user.type(
			screen.getByPlaceholderText('auth.password.confirmPasswordPlaceholder'),
			'NewStr0ng!',
		);
		await user.click(screen.getByRole('button', { name: 'auth.password.changeBtn' }));

		await waitFor(() => {
			expect(screen.getByText('auth.password.changeSuccess')).toBeInTheDocument();
			expect(screen.getByText('auth.common.redirectingIn')).toBeInTheDocument();
		});
	});

	it('API 失败时显示错误消息', async () => {
		mockAuthMePasswordPut.mockRejectedValue({
			response: { data: { message: '原密码不正确' } },
		});

		searchParams = new URLSearchParams();
		mockUseSearchParams.mockReturnValue([searchParams, vi.fn()]);

		const user = userEvent.setup();
		renderPage();

		await user.type(
			screen.getByPlaceholderText('auth.password.oldPasswordPlaceholder'),
			'OldPass1',
		);
		await user.type(
			screen.getByPlaceholderText('auth.password.newPasswordPlaceholder'),
			'NewStr0ng!',
		);
		await user.type(
			screen.getByPlaceholderText('auth.password.confirmPasswordPlaceholder'),
			'NewStr0ng!',
		);
		await user.click(screen.getByRole('button', { name: 'auth.password.changeBtn' }));

		await waitFor(() => {
			expect(screen.getByText('原密码不正确')).toBeInTheDocument();
		});
	});

	// AUTH-19 回归锁（W2 独立验证 GAP 收口）：旧密码错须匹配 identity 61000104
	//（ErrCodePasswordMismatch）；此前按 40800005（他服务码）比对必然落空、专属文案不可达。
	it('AUTH-19: 旧密码错误（61000104）显示专属文案而非原始 message', async () => {
		mockAuthMePasswordPut.mockRejectedValue({
			response: { data: { code: 61000104, message: 'password mismatch' } },
		});

		searchParams = new URLSearchParams();
		mockUseSearchParams.mockReturnValue([searchParams, vi.fn()]);

		const user = userEvent.setup();
		renderPage();

		await user.type(
			screen.getByPlaceholderText('auth.password.oldPasswordPlaceholder'),
			'OldPass1',
		);
		await user.type(
			screen.getByPlaceholderText('auth.password.newPasswordPlaceholder'),
			'NewStr0ng!',
		);
		await user.type(
			screen.getByPlaceholderText('auth.password.confirmPasswordPlaceholder'),
			'NewStr0ng!',
		);
		await user.click(screen.getByRole('button', { name: 'auth.password.changeBtn' }));

		await waitFor(() => {
			expect(screen.getByText('auth.password.oldPasswordWrong')).toBeInTheDocument();
		});
		expect(screen.queryByText('password mismatch')).not.toBeInTheDocument();
	});
});
