import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import VerifyPhonePage from '../verify-phone/page';

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

const mockSendSmsCode = vi.fn();
const mockVerifyPhone = vi.fn();

vi.mock('@/lib/api.generated', () => ({
	sendSmsCode: (...args: any[]) => mockSendSmsCode(...args),
	verifyPhone: (...args: any[]) => mockVerifyPhone(...args),
}));

function renderVerifyPhone() {
	return render(
		<MemoryRouter initialEntries={['/verify-phone']}>
			<VerifyPhonePage />
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockSendSmsCode.mockReset();
	mockVerifyPhone.mockReset();
});

describe('VerifyPhonePage', () => {
	it('renders phone input and disabled send button', () => {
		renderVerifyPhone();

		expect(screen.getByPlaceholderText('auth.verifyPhone.phonePlaceholder')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('auth.verifyPhone.codePlaceholder')).toBeInTheDocument();

		const sendButton = screen.getByRole('button', { name: 'auth.verifyPhone.getCode' });
		expect(sendButton).toBeDisabled();

		expect(screen.getByRole('button', { name: 'auth.verifyPhone.submit' })).toBeInTheDocument();
	});

	it('enables send button when phone entered, triggers cooldown on click', async () => {
		vi.useFakeTimers();
		mockSendSmsCode.mockResolvedValue({});
		renderVerifyPhone();

		const phoneInput = screen.getByPlaceholderText('auth.verifyPhone.phonePlaceholder');
		fireEvent.change(phoneInput, { target: { value: '13800138000' } });

		const sendButton = screen.getByRole('button', { name: 'auth.verifyPhone.getCode' });
		expect(sendButton).not.toBeDisabled();

		await act(async () => {
			fireEvent.click(sendButton);
		});

		await act(() => vi.advanceTimersByTime(0));

		expect(mockSendSmsCode).toHaveBeenCalledWith({ phone: '13800138000' });
		expect(screen.getByText('flat.auth.verifyPhone.countdown {"seconds":60}')).toBeInTheDocument();

		vi.useRealTimers();
	});

	it('shows Zod error on invalid code submission', async () => {
		renderVerifyPhone();

		fireEvent.change(screen.getByPlaceholderText('auth.verifyPhone.phonePlaceholder'), {
			target: { value: '13800138000' },
		});
		fireEvent.change(screen.getByPlaceholderText('auth.verifyPhone.codePlaceholder'), {
			target: { value: '12' },
		});

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'auth.verifyPhone.submit' }));
		});

		await waitFor(() => {
			expect(screen.getByText('validation.codeLength')).toBeInTheDocument();
		});
	});

	it('shows success and auto-redirects on valid submission', async () => {
		vi.useFakeTimers();
		mockVerifyPhone.mockResolvedValue({});
		renderVerifyPhone();

		fireEvent.change(screen.getByPlaceholderText('auth.verifyPhone.phonePlaceholder'), {
			target: { value: '13800138000' },
		});
		fireEvent.change(screen.getByPlaceholderText('auth.verifyPhone.codePlaceholder'), {
			target: { value: '654321' },
		});

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'auth.verifyPhone.submit' }));
		});

		await act(() => vi.advanceTimersByTime(0));

		expect(mockVerifyPhone).toHaveBeenCalledWith({ phone: '13800138000', code: '654321' });
		expect(screen.getByText('auth.verifyPhone.success')).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(2500);
		});

		expect(mockNavigate).toHaveBeenCalledWith('/');
		vi.useRealTimers();
	});
});
