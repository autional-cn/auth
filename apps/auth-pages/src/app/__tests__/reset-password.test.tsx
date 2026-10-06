import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import ResetPasswordPage from '../reset-password/page';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => (opts ? `${key} ${JSON.stringify(opts)}` : key),
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

const mockNavigate = vi.fn();
let mockSearchParamsToken = '';

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useSearchParams: () => [{ get: (_k: string) => mockSearchParamsToken }, vi.fn()],
		Link: ({ to, children }: any) => <a href={to}>{children}</a>,
	};
});

const mockAuthVerifyResetCodePost = vi.fn();
const mockAuthResetPasswordPost = vi.fn();

vi.mock('@autional/shared/generated/api', () => ({
	authVerifyResetCodePost: (...args: any[]) => mockAuthVerifyResetCodePost(...args),
	authResetPasswordPost: (...args: any[]) => mockAuthResetPasswordPost(...args),
	PublicAuthConfigByAuthConfig: vi.fn(() =>
		Promise.resolve({ passwordPolicy: { passwordTransmission: 'plain' } }),
	),
}));

const mockCheckPasswordBreached = vi.fn();

vi.mock('@/lib/breach-check', () => ({
	checkPasswordBreached: (...args: any[]) => mockCheckPasswordBreached(...args),
}));

function renderResetPassword() {
	return render(
		<MemoryRouter initialEntries={['/reset-password']}>
			<ResetPasswordPage />
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockSearchParamsToken = '';
	mockAuthVerifyResetCodePost.mockReset();
	mockAuthResetPasswordPost.mockReset();
	mockCheckPasswordBreached.mockReset();
});

describe('ResetPasswordPage', () => {
	it('shows ErrorState with retry link when no token', async () => {
		mockSearchParamsToken = '';
		renderResetPassword();

		await waitFor(() => {
			expect(screen.getByText('auth.resetPassword.invalidToken')).toBeInTheDocument();
		});
		expect(screen.getByText('auth.resetPassword.invalidTokenDesc')).toBeInTheDocument();
	});

	it('shows verifying loading state when token present', () => {
		mockAuthVerifyResetCodePost.mockReturnValue(new Promise(() => {}));
		mockSearchParamsToken = 'valid-reset-token';
		renderResetPassword();

		expect(screen.getByText('auth.resetPassword.verifying')).toBeInTheDocument();
		expect(mockAuthVerifyResetCodePost).toHaveBeenCalledWith({
			code: 'valid-reset-token',
			identity: '',
		});
	});

	it('shows password form when token is valid', async () => {
		mockAuthVerifyResetCodePost.mockResolvedValue({});
		mockCheckPasswordBreached.mockResolvedValue({ breached: false });
		mockSearchParamsToken = 'valid-reset-token';
		renderResetPassword();

		await waitFor(() => {
			expect(screen.getByText('auth.resetPassword.title')).toBeInTheDocument();
		});

		expect(
			screen.getByPlaceholderText('auth.resetPassword.passwordPlaceholder'),
		).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText('auth.resetPassword.confirmPasswordPlaceholder'),
		).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'auth.resetPassword.submit' })).toBeInTheDocument();
	});

	it('shows Zod error when passwords mismatch', async () => {
		mockAuthVerifyResetCodePost.mockResolvedValue({});
		mockCheckPasswordBreached.mockResolvedValue({ breached: false });
		mockSearchParamsToken = 'valid-reset-token';
		const user = userEvent.setup();
		renderResetPassword();

		await waitFor(() => {
			expect(
				screen.getByPlaceholderText('auth.resetPassword.passwordPlaceholder'),
			).toBeInTheDocument();
		});

		await user.type(
			screen.getByPlaceholderText('auth.resetPassword.passwordPlaceholder'),
			'NewPass123!',
		);
		await user.type(
			screen.getByPlaceholderText('auth.resetPassword.confirmPasswordPlaceholder'),
			'Different456!',
		);

		await user.click(screen.getByRole('button', { name: 'auth.resetPassword.submit' }));

		await waitFor(() => {
			expect(screen.getByText('validation.passwordsMatch')).toBeInTheDocument();
		});
	});

	it('shows success message on successful password reset', async () => {
		vi.useFakeTimers();
		// 2026-08-17 契约：VerifyResetCode 返回 tenantId，提交时据此取密码传输模式
		mockAuthVerifyResetCodePost.mockResolvedValue({ tenantId: 't-acme' });
		mockCheckPasswordBreached.mockResolvedValue({ breached: false });
		mockAuthResetPasswordPost.mockResolvedValue({});
		mockSearchParamsToken = 'valid-reset-token';
		renderResetPassword();

		await act(() => vi.advanceTimersByTime(100));

		expect(
			screen.getByPlaceholderText('auth.resetPassword.passwordPlaceholder'),
		).toBeInTheDocument();

		fireEvent.change(screen.getByPlaceholderText('auth.resetPassword.passwordPlaceholder'), {
			target: { value: 'NewPass123!' },
		});
		fireEvent.change(screen.getByPlaceholderText('auth.resetPassword.confirmPasswordPlaceholder'), {
			target: { value: 'NewPass123!' },
		});

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'auth.resetPassword.submit' }));
		});

		await act(() => vi.advanceTimersByTime(100));

		expect(mockAuthResetPasswordPost).toHaveBeenCalledWith({
			code: 'valid-reset-token',
			identity: '',
			newPassword: 'NewPass123!',
			password_transmission: 'plain',
		});
		expect(screen.getByText('auth.resetPassword.success')).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(3000);
		});

		expect(mockNavigate).toHaveBeenCalledWith('/');
		vi.useRealTimers();
	});
});
