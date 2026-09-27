import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ForgotPasswordPage from '../forgot-password/page';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => (opts ? `${key} ${JSON.stringify(opts)}` : key),
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		Link: ({ to, children }: any) => <a href={to}>{children}</a>,
	};
});

const mockAuthForgotPasswordPost = vi.fn();

vi.mock('@autional-cn/shared/generated/api', () => ({
	authForgotPasswordPost: (...args: any[]) => mockAuthForgotPasswordPost(...args),
}));

function renderForgotPassword() {
	return render(
		<MemoryRouter initialEntries={['/forgot-password']}>
			<ForgotPasswordPage />
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
});

describe('ForgotPasswordPage', () => {
	it('renders forgot password form with email input', () => {
		renderForgotPassword();
		expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'forgot.submit' })).toBeInTheDocument();
	});

	it('shows success message on submit', async () => {
		mockAuthForgotPasswordPost.mockResolvedValue({});
		renderForgotPassword();
		fireEvent.change(screen.getByPlaceholderText('email@example.com'), {
			target: { value: 'test@example.com' },
		});
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'forgot.submit' }));
		});
		expect(await screen.findByText('forgot.sentHintEmail')).toBeInTheDocument();
	});

	it('shows success even when server responds with error (anti-enumeration)', async () => {
		mockAuthForgotPasswordPost.mockRejectedValue({
			isAxiosError: true,
			response: { data: { message: 'User not found' } },
		});
		renderForgotPassword();
		fireEvent.change(screen.getByPlaceholderText('email@example.com'), {
			target: { value: 'unknown@example.com' },
		});
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'forgot.submit' }));
		});
		expect(await screen.findByText('forgot.sentHintEmail')).toBeInTheDocument();
	});

	it('shows countdown resend button after success', async () => {
		mockAuthForgotPasswordPost.mockResolvedValue({});
		renderForgotPassword();
		fireEvent.change(screen.getByPlaceholderText('email@example.com'), {
			target: { value: 'test@example.com' },
		});
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'forgot.submit' }));
		});
		expect(await screen.findByText(/重新发送（/)).toBeInTheDocument();
	});

	it('shows validation error for empty email', async () => {
		renderForgotPassword();
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'forgot.submit' }));
		});
		expect(screen.getByText('validation.identityRequired')).toBeInTheDocument();
	});
});
