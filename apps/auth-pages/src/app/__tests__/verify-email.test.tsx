import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import VerifyEmailPage from '../verify-email/page';

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

const mockAuthVerifyEmailPost = vi.fn();
const mockAuthResendVerificationEmailPost = vi.fn();

vi.mock('@autional-cn/shared/generated/api', () => ({
	authVerifyEmailPost: (...args: any[]) => mockAuthVerifyEmailPost(...args),
	authResendVerificationEmailPost: (...args: any[]) => mockAuthResendVerificationEmailPost(...args),
}));

function renderVerifyEmail() {
	return render(
		<MemoryRouter initialEntries={['/verify-email']}>
			<VerifyEmailPage />
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockSearchParamsToken = '';
	mockAuthVerifyEmailPost.mockReset();
	mockAuthResendVerificationEmailPost.mockReset();
});

describe('VerifyEmailPage', () => {
	it('shows error and resend form when no token', () => {
		mockSearchParamsToken = '';
		renderVerifyEmail();

		expect(screen.getByText('auth.verifyEmail.invalidToken')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('auth.verifyEmail.emailPlaceholder')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'auth.verifyEmail.resend' })).toBeInTheDocument();
	});

	it('shows verifying state when token present and auto-verifying', async () => {
		let resolveVerify: (value: unknown) => void;
		mockAuthVerifyEmailPost.mockReturnValue(
			new Promise((resolve) => {
				resolveVerify = resolve;
			}),
		);
		mockSearchParamsToken = 'valid-token';
		renderVerifyEmail();

		expect(screen.getByText('auth.verifyEmail.verifying')).toBeInTheDocument();
		expect(mockAuthVerifyEmailPost).toHaveBeenCalledWith({ code: 'valid-token', email: '' });

		await act(async () => {
			resolveVerify({});
		});
	});

	it('shows success state when token is valid', async () => {
		mockAuthVerifyEmailPost.mockResolvedValue({});
		mockSearchParamsToken = 'valid-token';
		renderVerifyEmail();

		await waitFor(() => {
			expect(screen.getByText('auth.verifyEmail.successMessage')).toBeInTheDocument();
		});
		expect(screen.getByRole('button', { name: 'auth.common.goToLogin' })).toBeInTheDocument();
	});

	it('shows error and resend form when token is invalid (not already-verified)', async () => {
		mockAuthVerifyEmailPost.mockRejectedValue({
			response: { data: { message: 'expired token' } },
		});
		mockSearchParamsToken = 'bad-token';
		renderVerifyEmail();

		await waitFor(() => {
			expect(screen.getByPlaceholderText('auth.verifyEmail.emailPlaceholder')).toBeInTheDocument();
		});
		expect(screen.getByRole('button', { name: 'auth.verifyEmail.resend' })).toBeInTheDocument();
	});

	it('submits resend form and triggers API call', async () => {
		mockSearchParamsToken = '';
		mockAuthResendVerificationEmailPost.mockResolvedValue({});
		const user = userEvent.setup();
		renderVerifyEmail();

		await user.type(
			screen.getByPlaceholderText('auth.verifyEmail.emailPlaceholder'),
			'test@example.com',
		);
		await user.click(screen.getByRole('button', { name: 'auth.verifyEmail.resend' }));

		await waitFor(() => {
			expect(mockAuthResendVerificationEmailPost).toHaveBeenCalledWith({
				email: 'test@example.com',
			});
		});
		expect(screen.getByText('auth.verifyEmail.resendSuccess')).toBeInTheDocument();
	});
});
