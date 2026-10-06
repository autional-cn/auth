import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

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

let mockUser: { id: string } | null = { id: 'test-user-id' };
vi.mock('@autional/shared', () => ({
	useAuthStore: (selector?: any) => {
		const state = { user: mockUser };
		return selector ? selector(state) : state;
	},
	useAuth: () => ({ user: mockUser }),
	END_USER_PORTAL_URL: () => 'http://localhost:13004',
	crossAppUrl: (url: string) => url,
	loginWithTokens: vi.fn(),
	getAccessToken: () => null,
	extractApiError: (err: any, fallback: string) => ({
		code: err?.response?.data?.code ?? 'UNKNOWN',
		message: err?.response?.data?.message ?? err?.message ?? fallback,
	}),
}));

const mockEnableMFA = vi.fn();
const mockVerifyTOTPMFA = vi.fn();
const mockSendMFASMS = vi.fn();
const mockVerifyMFASMS = vi.fn();
const mockSendMFAEmail = vi.fn();
const mockVerifyMFAEmail = vi.fn();
const mockGetMFAStatus = vi.fn();
const mockDisableMFA = vi.fn();
const mockDisableMFASMS = vi.fn();
const mockDisableMFAEmail = vi.fn();

vi.mock('@/lib/api.generated', () => ({
	enableMFA: (...args: any[]) => mockEnableMFA(...args),
	verifyTOTPMFA: (...args: any[]) => mockVerifyTOTPMFA(...args),
	sendMFASMS: (...args: any[]) => mockSendMFASMS(...args),
	verifyMFASMS: (...args: any[]) => mockVerifyMFASMS(...args),
	sendMFAEmail: (...args: any[]) => mockSendMFAEmail(...args),
	verifyMFAEmail: (...args: any[]) => mockVerifyMFAEmail(...args),
	getMFAStatus: (...args: any[]) => mockGetMFAStatus(...args),
	disableMFA: (...args: any[]) => mockDisableMFA(...args),
	disableMFASMS: (...args: any[]) => mockDisableMFASMS(...args),
	disableMFAEmail: (...args: any[]) => mockDisableMFAEmail(...args),
}));

vi.mock('@/lib/i18n', () => ({
	useI18n: () => ({
		t: (key: string, opts?: Record<string, unknown>) =>
			opts ? `${key} ${JSON.stringify(opts)}` : key,
		lang: 'zh-CN',
	}),
}));

import MFASetupPage from '../mfa-setup/page';

function renderMFASetup() {
	return render(
		<MemoryRouter initialEntries={['/mfa-setup']}>
			<MFASetupPage />
		</MemoryRouter>,
	);
}

const STATUS_DISABLED = { totpEnabled: false, smsEnabled: false, emailEnabled: false };
const ENABLE_RESPONSE = {
	secret: 'JBSWY3DPEHPK3PXP',
	qrCode: 'data:image/png;base64,testqr',
	qrCodeUrl: 'otpauth://totp/Autional:user@example.com?secret=JBSWY3DPEHPK3PXP',
	backupCodes: ['CODE001', 'CODE002', 'CODE003', 'CODE004'],
};

beforeEach(() => {
	vi.clearAllMocks();
	mockGetMFAStatus.mockResolvedValue({ ...STATUS_DISABLED, smsPhone: '', emailAddress: '' });
});

describe('MFASetupPage', () => {
	describe('when MFA is not enabled', () => {
		it('renders MFA setup wizard with three method options', async () => {
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupTitle')).toBeInTheDocument();
			});

			expect(screen.getByText('auth.mfa.setupAuthApp')).toBeInTheDocument();
			expect(screen.getByText('auth.mfa.setupSms')).toBeInTheDocument();
			expect(screen.getByText('auth.mfa.setupEmail')).toBeInTheDocument();
			expect(screen.getAllByText('auth.mfa.setupSubtitleStep1')).toHaveLength(1);
		});

		it('enrolls via enable (deviceName param) and renders qrCode/secret keys (AUTH-31)', async () => {
			mockEnableMFA.mockResolvedValue({ ...ENABLE_RESPONSE });

			const user = userEvent.setup();
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupTitle')).toBeInTheDocument();
			});

			await user.click(screen.getByText('auth.mfa.setupAuthApp'));

			await waitFor(() => {
				expect(mockEnableMFA).toHaveBeenCalledWith({ deviceName: 'Autional Auth' });
				expect(screen.getByText('auth.mfa.setupStep2Title')).toBeInTheDocument();
			});

			const img = screen.getByAltText('MFA QR Code') as HTMLImageElement;
			expect(img.src).toBe('data:image/png;base64,testqr');
			expect(screen.getByText('JBSWY3DPEHPK3PXP')).toBeInTheDocument();
		});

		it('activates via totp/verify and shows backup codes from the enable response (AUTH-32)', async () => {
			mockEnableMFA.mockResolvedValue({ ...ENABLE_RESPONSE });
			mockVerifyTOTPMFA.mockResolvedValue({ valid: true });

			const user = userEvent.setup();
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupTitle')).toBeInTheDocument();
			});

			await user.click(screen.getByText('auth.mfa.setupAuthApp'));

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupStep2Title')).toBeInTheDocument();
			});

			const codeInput = screen.getByPlaceholderText('auth.mfa.codePlaceholder');
			await user.type(codeInput, '123456');
			await user.click(screen.getByRole('button', { name: 'auth.mfa.setupVerifyAndEnable' }));

			await waitFor(() => {
				// 唯一启用口：totp/verify（不再是幽灵 enableMFA({code,type})）
				expect(mockVerifyTOTPMFA).toHaveBeenCalledWith({ code: '123456' });
			});

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupStep3Title')).toBeInTheDocument();
				expect(screen.getByText('CODE001')).toBeInTheDocument();
				expect(screen.getByText('CODE004')).toBeInTheDocument();
			});
		});

		it('shows error when totp/verify rejects with invalid-code code', async () => {
			mockEnableMFA.mockResolvedValue({ ...ENABLE_RESPONSE });
			mockVerifyTOTPMFA.mockRejectedValue({
				response: { status: 400, data: { code: 61040013, message: 'invalid MFA code' } },
			});

			const user = userEvent.setup();
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupTitle')).toBeInTheDocument();
			});

			await user.click(screen.getByText('auth.mfa.setupAuthApp'));

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupStep2Title')).toBeInTheDocument();
			});

			await user.type(screen.getByPlaceholderText('auth.mfa.codePlaceholder'), '000000');
			await user.click(screen.getByRole('button', { name: 'auth.mfa.setupVerifyAndEnable' }));

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.errorInvalidCode')).toBeInTheDocument();
			});
		});

		it('refetches status and switches to disable view on enable 409', async () => {
			mockEnableMFA.mockRejectedValue({
				response: { status: 409, data: { code: 61040010, message: 'TOTP already enabled' } },
			});
			mockGetMFAStatus
				.mockResolvedValueOnce({ ...STATUS_DISABLED, smsPhone: '', emailAddress: '' })
				.mockResolvedValueOnce({
					totpEnabled: true,
					smsEnabled: false,
					emailEnabled: false,
					smsPhone: '',
					emailAddress: '',
				});

			const user = userEvent.setup();
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupTitle')).toBeInTheDocument();
			});

			await user.click(screen.getByText('auth.mfa.setupAuthApp'));

			await waitFor(() => {
				expect(mockGetMFAStatus).toHaveBeenCalledTimes(2);
				expect(screen.getByText('auth.mfa.enabledStatus')).toBeInTheDocument();
				expect(screen.getByText('auth.mfa.errorAlreadyEnabled')).toBeInTheDocument();
			});
		});

		it('self-activates SMS via verify and stops on valid=false (no ghost enable)', async () => {
			mockSendMFASMS.mockResolvedValue({ sent: true });
			mockVerifyMFASMS.mockResolvedValue({ valid: false });

			const user = userEvent.setup();
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupTitle')).toBeInTheDocument();
			});

			await user.click(screen.getByText('auth.mfa.setupSms'));

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupStep2Title')).toBeInTheDocument();
			});

			await user.type(screen.getByPlaceholderText('auth.mfa.phonePlaceholder'), '13800138000');
			await user.click(screen.getByRole('button', { name: 'auth.mfa.getCode' }));

			await waitFor(() => {
				expect(mockSendMFASMS).toHaveBeenCalledWith({ phone: '13800138000' });
			});

			await user.type(screen.getByPlaceholderText('auth.mfa.codePlaceholder'), '123456');
			await user.click(screen.getByRole('button', { name: 'auth.mfa.enableSubmit' }));

			await waitFor(() => {
				expect(mockVerifyMFASMS).toHaveBeenCalledWith({ phone: '13800138000', code: '123456' });
				// valid=false → 留在 step2 报错，且不得调用幽灵 enableMFA
				expect(screen.getByText('auth.mfa.errorVerifyCodeFailed')).toBeInTheDocument();
				expect(screen.getByText('auth.mfa.setupStep2Title')).toBeInTheDocument();
			});
		});

		it('shows account center link at bottom', async () => {
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupTitle')).toBeInTheDocument();
			});

			expect(screen.getByText('mfa.accountCenter')).toBeInTheDocument();
			expect(
				screen.getByText((content) => content.startsWith('mfa.goToAccountCenter')),
			).toBeInTheDocument();
		});
	});

	describe('when MFA is already enabled', () => {
		beforeEach(() => {
			mockGetMFAStatus.mockResolvedValue({
				totpEnabled: true,
				smsEnabled: false,
				emailEnabled: false,
				smsPhone: '',
				emailAddress: '',
			});
		});

		it('shows MFA enabled status with code-based disable option (AUTH-33)', async () => {
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.enabledStatus')).toBeInTheDocument();
			});

			expect(screen.getByText('auth.mfa.enabledDesc')).toBeInTheDocument();
			expect(screen.getByText('auth.mfa.disableLabel')).toBeInTheDocument();
			expect(screen.getByText('auth.mfa.disableBtn')).toBeInTheDocument();
			// 无密码输入面
			expect(screen.queryByPlaceholderText('auth.mfa.disablePlaceholder')).not.toBeInTheDocument();
		});

		it('disables TOTP by verification code (not password)', async () => {
			mockDisableMFA.mockResolvedValue({ disabled: true });

			const user = userEvent.setup();
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.enabledStatus')).toBeInTheDocument();
			});

			await user.type(screen.getByPlaceholderText('auth.mfa.codePlaceholder'), '123456');
			await user.click(screen.getByRole('button', { name: 'auth.mfa.disableBtn' }));

			await waitFor(() => {
				expect(mockDisableMFA).toHaveBeenCalledWith({ code: '123456' });
			});
		});

		it('sends and verifies a code to disable SMS MFA', async () => {
			mockGetMFAStatus.mockResolvedValue({
				totpEnabled: false,
				smsEnabled: true,
				emailEnabled: false,
				smsPhone: '13800138000',
				emailAddress: '',
			});
			mockSendMFASMS.mockResolvedValue({ sent: true });
			mockDisableMFASMS.mockResolvedValue({ disabled: true });

			const user = userEvent.setup();
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.enabledStatus')).toBeInTheDocument();
			});

			await user.click(screen.getByRole('button', { name: 'auth.mfa.sendCode' }));

			await waitFor(() => {
				expect(mockSendMFASMS).toHaveBeenCalledWith({
					phone: '13800138000',
					purpose: 'disable',
				});
			});

			await user.type(screen.getByPlaceholderText('auth.mfa.codePlaceholder'), '654321');
			await user.click(screen.getByRole('button', { name: 'auth.mfa.disableBtn' }));

			await waitFor(() => {
				expect(mockDisableMFASMS).toHaveBeenCalledWith({ code: '654321' });
			});
		});

		it('shows invalid-code error when disable rejects with 61040013', async () => {
			mockDisableMFA.mockRejectedValue({
				response: { status: 400, data: { code: 61040013, message: 'invalid MFA code' } },
			});

			const user = userEvent.setup();
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.enabledStatus')).toBeInTheDocument();
			});

			await user.type(screen.getByPlaceholderText('auth.mfa.codePlaceholder'), '999999');
			await user.click(screen.getByRole('button', { name: 'auth.mfa.disableBtn' }));

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.errorInvalidCode')).toBeInTheDocument();
			});
		});
	});

	describe('when user has no ID', () => {
		it('shows setup wizard without calling getMFAStatus', async () => {
			const prevUser = mockUser;
			mockUser = null;
			mockGetMFAStatus.mockClear();

			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupTitle')).toBeInTheDocument();
			});

			expect(mockGetMFAStatus).not.toHaveBeenCalled();

			mockUser = prevUser;
		});
	});
});
