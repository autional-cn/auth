// ============================================================
// AUTH-27/28：verify-phone 外部直链页
//   ① 格式门控：非国际格式（无 +）不发请求，内联字段错误
//   ② 错误分流：后端 i18n_key → 本地化；键未登记 → 429 限流文案 / 通用文案，
//      不直出服务端英文（此前只读 data.message 恒落通用故障措辞——确定性输入错误被
//      表述为暂时故障）
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import VerifyPhonePage from '../verify-phone/page';

// 模拟真实 i18next：已登记键返回键名（供断言）；未登记键回落 defaultValue（字符串形态）；
// 对象形态无 defaultValue 时给 "key {json}"（既有 countdown 断言口径）。
const KNOWN_KEYS = new Set([
	'error.invalid_verification_code',
	'error.phone_invalid_format',
	'error.otp.too_many_attempts',
	'error.verification_code_expired',
	'error.verification_code_not_found',
	'error.otp.not_found',
	'error.otp.already_used',
]);

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => {
			if (KNOWN_KEYS.has(key)) return key;
			if (typeof opts === 'string') return opts;
			if (opts && typeof opts === 'object' && 'defaultValue' in opts) return opts.defaultValue;
			return opts ? `${key} ${JSON.stringify(opts)}` : key;
		},
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

const PLACEHOLDER = 'auth.verifyPhone.phonePlaceholder';
const VALID_PHONE = '+8613800138000';

beforeEach(() => {
	vi.clearAllMocks();
	mockSendSmsCode.mockReset();
	mockVerifyPhone.mockReset();
});

describe('VerifyPhonePage', () => {
	it('renders phone input and disabled send button', () => {
		renderVerifyPhone();

		expect(screen.getByPlaceholderText(PLACEHOLDER)).toBeInTheDocument();
		expect(screen.getByPlaceholderText('auth.verifyPhone.codePlaceholder')).toBeInTheDocument();

		const sendButton = screen.getByRole('button', { name: 'auth.verifyPhone.getCode' });
		expect(sendButton).toBeDisabled();

		expect(screen.getByRole('button', { name: 'auth.verifyPhone.submit' })).toBeInTheDocument();
	});

	it('enables send button when phone entered, triggers cooldown on click', async () => {
		vi.useFakeTimers();
		mockSendSmsCode.mockResolvedValue({});
		renderVerifyPhone();

		const phoneInput = screen.getByPlaceholderText(PLACEHOLDER);
		fireEvent.change(phoneInput, { target: { value: VALID_PHONE } });

		const sendButton = screen.getByRole('button', { name: 'auth.verifyPhone.getCode' });
		expect(sendButton).not.toBeDisabled();

		await act(async () => {
			fireEvent.click(sendButton);
		});

		await act(() => vi.advanceTimersByTime(0));

		expect(mockSendSmsCode).toHaveBeenCalledWith({ phone: VALID_PHONE });
		expect(screen.getByText('flat.auth.verifyPhone.countdown {"seconds":60}')).toBeInTheDocument();

		vi.useRealTimers();
	});

	it('AUTH-27：非国际格式手机号不发请求，内联格式错误提示', async () => {
		renderVerifyPhone();

		fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), {
			target: { value: '13800138000' },
		});

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'auth.verifyPhone.getCode' }));
		});

		await waitFor(() => {
			expect(screen.getByText('validation.phoneInvalid')).toBeInTheDocument();
		});
		expect(mockSendSmsCode).not.toHaveBeenCalled();
	});

	it('AUTH-27：非国际格式手机号不可提交（同一 schema 门控）', async () => {
		renderVerifyPhone();

		fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), {
			target: { value: '123' },
		});
		fireEvent.change(screen.getByPlaceholderText('auth.verifyPhone.codePlaceholder'), {
			target: { value: '654321' },
		});

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'auth.verifyPhone.submit' }));
		});

		await waitFor(() => {
			expect(screen.getByText('validation.phoneInvalid')).toBeInTheDocument();
		});
		expect(mockVerifyPhone).not.toHaveBeenCalled();
	});

	it('AUTH-28：验证码语义错误（i18n_key）→ 本地化文案，不吞成通用故障', async () => {
		mockVerifyPhone.mockRejectedValue({
			response: {
				status: 400,
				data: {
					code: 61001101,
					title: 'invalid verification code',
					i18n_key: 'error.invalid_verification_code',
				},
			},
		});
		renderVerifyPhone();

		fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), {
			target: { value: VALID_PHONE },
		});
		fireEvent.change(screen.getByPlaceholderText('auth.verifyPhone.codePlaceholder'), {
			target: { value: '000000' },
		});

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'auth.verifyPhone.submit' }));
		});

		await waitFor(() => {
			expect(screen.getByText('error.invalid_verification_code')).toBeInTheDocument();
		});
		expect(screen.queryByText('auth.verifyPhone.errorVerifyFailed')).toBeNull();
	});

	it('AUTH-28：未登记 i18n_key（自动 error.<码>）不直出英文 → 通用文案兜底', async () => {
		mockVerifyPhone.mockRejectedValue({
			response: {
				status: 500,
				data: { code: 10000002, title: 'internal server error', i18n_key: 'error.10000002' },
			},
		});
		renderVerifyPhone();

		fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), {
			target: { value: VALID_PHONE },
		});
		fireEvent.change(screen.getByPlaceholderText('auth.verifyPhone.codePlaceholder'), {
			target: { value: '000000' },
		});

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'auth.verifyPhone.submit' }));
		});

		await waitFor(() => {
			expect(screen.getByText('auth.verifyPhone.errorVerifyFailed')).toBeInTheDocument();
		});
		expect(screen.queryByText('internal server error')).toBeNull();
	});

	it('AUTH-28：发送限流（429）→ 限流文案', async () => {
		mockSendSmsCode.mockRejectedValue({
			response: { status: 429, data: { code: 10000429, title: 'rate limit exceeded' } },
		});
		renderVerifyPhone();

		fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), {
			target: { value: VALID_PHONE },
		});

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'auth.verifyPhone.getCode' }));
		});

		await waitFor(() => {
			expect(screen.getByText('auth.verifyPhone.rateLimited')).toBeInTheDocument();
		});
	});

	it('shows Zod error on invalid code submission', async () => {
		renderVerifyPhone();

		fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), {
			target: { value: VALID_PHONE },
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

		fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), {
			target: { value: VALID_PHONE },
		});
		fireEvent.change(screen.getByPlaceholderText('auth.verifyPhone.codePlaceholder'), {
			target: { value: '654321' },
		});

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'auth.verifyPhone.submit' }));
		});

		await act(() => vi.advanceTimersByTime(0));

		expect(mockVerifyPhone).toHaveBeenCalledWith({ phone: VALID_PHONE, code: '654321' });
		expect(screen.getByText('auth.verifyPhone.success')).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(2500);
		});

		expect(mockNavigate).toHaveBeenCalledWith('/');
		vi.useRealTimers();
	});
});
