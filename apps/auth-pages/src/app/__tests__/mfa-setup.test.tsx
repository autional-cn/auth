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
vi.mock('@autional-cn/shared', () => ({
	useAuthStore: (selector?: any) => {
		const state = { user: mockUser };
		return selector ? selector(state) : state;
	},
	useAuth: () => ({ user: mockUser }),
	END_USER_PORTAL_URL: () => 'http://localhost:13004',
	crossAppUrl: (url: string) => url,
	loginWithTokens: vi.fn(),
	getAccessToken: () => null,
}));

const mockSetupMFA = vi.fn();
const mockEnableMFA = vi.fn();
const mockRegenerateBackupCodes = vi.fn();
const mockSendMFASMS = vi.fn();
const mockVerifyMFASMS = vi.fn();
const mockSendMFAEmail = vi.fn();
const mockVerifyMFAEmail = vi.fn();
const mockGetMFAStatus = vi.fn();
const mockDisableMFA = vi.fn();

vi.mock('@/lib/api.generated', () => ({
	setupMFA: (...args: any[]) => mockSetupMFA(...args),
	enableMFA: (...args: any[]) => mockEnableMFA(...args),
	regenerateBackupCodes: (...args: any[]) => mockRegenerateBackupCodes(...args),
	sendMFASMS: (...args: any[]) => mockSendMFASMS(...args),
	verifyMFASMS: (...args: any[]) => mockVerifyMFASMS(...args),
	sendMFAEmail: (...args: any[]) => mockSendMFAEmail(...args),
	verifyMFAEmail: (...args: any[]) => mockVerifyMFAEmail(...args),
	getMFAStatus: (...args: any[]) => mockGetMFAStatus(...args),
	disableMFA: (...args: any[]) => mockDisableMFA(...args),
	validateTOTP: vi.fn((_opts?: any) => Promise.resolve()),
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

beforeEach(() => {
	vi.clearAllMocks();
	mockGetMFAStatus.mockResolvedValue({
		data: { totpEnabled: false, smsEnabled: false, emailEnabled: false },
	});
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

		it('shows TOTP QR code and secret after clicking authenticator option', async () => {
			mockSetupMFA.mockResolvedValue({
				data: { qr_url: 'data:image/png;base64,testqr', secret: 'JBSWY3DPEHPK3PXP' },
			});

			const user = userEvent.setup();
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupTitle')).toBeInTheDocument();
			});

			await user.click(screen.getByText('auth.mfa.setupAuthApp'));

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupStep2Title')).toBeInTheDocument();
				expect(screen.getByAltText('MFA QR Code')).toBeInTheDocument();
				expect(screen.getByText('JBSWY3DPEHPK3PXP')).toBeInTheDocument();
				expect(screen.getByText('auth.mfa.setupVerifyAndEnable')).toBeInTheDocument();
			});
		});

		it('shows SMS setup form after clicking SMS option', async () => {
			const user = userEvent.setup();
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupTitle')).toBeInTheDocument();
			});

			await user.click(screen.getByText('auth.mfa.setupSms'));

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupStep2Title')).toBeInTheDocument();
				expect(screen.getByText('auth.mfa.phoneLabel')).toBeInTheDocument();
			});

			expect(screen.getByPlaceholderText('auth.mfa.phonePlaceholder')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'auth.mfa.getCode' })).toBeInTheDocument();
		});

		it('shows Email setup form after clicking Email option', async () => {
			const user = userEvent.setup();
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupTitle')).toBeInTheDocument();
			});

			await user.click(screen.getByText('auth.mfa.setupEmail'));

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupStep2Title')).toBeInTheDocument();
				expect(screen.getByText('auth.mfa.emailLabel')).toBeInTheDocument();
			});

			expect(screen.getByPlaceholderText('auth.mfa.emailPlaceholder')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'auth.mfa.getCode' })).toBeInTheDocument();
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

		it('shows back button in setup flow', async () => {
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupTitle')).toBeInTheDocument();
			});

			expect(screen.getByText('auth.mfa.back')).toBeInTheDocument();
		});

		it('enables MFA via TOTP and shows backup codes on success', async () => {
			mockSetupMFA.mockResolvedValue({
				data: { qr_url: 'data:image/png;base64,testqr', secret: 'JBSWY3DPEHPK3PXP' },
			});
			mockEnableMFA.mockResolvedValue({ data: {} });
			mockRegenerateBackupCodes.mockResolvedValue({
				data: { codes: ['CODE001', 'CODE002', 'CODE003', 'CODE004'] },
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

			const codeInput = screen.getByPlaceholderText('auth.mfa.codePlaceholder');
			await user.type(codeInput, '123456');
			await user.click(screen.getByRole('button', { name: 'auth.mfa.setupVerifyAndEnable' }));

			await waitFor(() => {
				expect(mockEnableMFA).toHaveBeenCalledWith({ code: '123456', type: 'totp' });
				expect(mockRegenerateBackupCodes).toHaveBeenCalled();
			});

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupStep3Title')).toBeInTheDocument();
				expect(screen.getByText('CODE001')).toBeInTheDocument();
				expect(screen.getByText('CODE002')).toBeInTheDocument();
				expect(screen.getByText('CODE003')).toBeInTheDocument();
				expect(screen.getByText('CODE004')).toBeInTheDocument();
			});
		});

		it('shows error when TOTP verification fails', async () => {
			mockSetupMFA.mockResolvedValue({
				data: { qr_url: 'data:image/png;base64,testqr', secret: 'JBSWY3DPEHPK3PXP' },
			});
			mockEnableMFA.mockRejectedValue({
				response: { data: { message: 'Invalid verification code' } },
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

			const codeInput = screen.getByPlaceholderText('auth.mfa.codePlaceholder');
			await user.type(codeInput, '000000');
			await user.click(screen.getByRole('button', { name: 'auth.mfa.setupVerifyAndEnable' }));

			await waitFor(() => {
				expect(screen.getByText('Invalid verification code')).toBeInTheDocument();
			});
		});
	});

	describe('when MFA is already enabled', () => {
		beforeEach(() => {
			mockGetMFAStatus.mockResolvedValue({
				data: { totpEnabled: true, smsEnabled: false, emailEnabled: false },
			});
		});

		it('shows MFA enabled status with disable option', async () => {
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.enabledStatus')).toBeInTheDocument();
			});

			expect(screen.getByText('auth.mfa.enabledDesc')).toBeInTheDocument();
			expect(screen.getByText('auth.mfa.disableLabel')).toBeInTheDocument();
			expect(screen.getByText('auth.mfa.disableBtn')).toBeInTheDocument();
		});

		it('shows account center link when MFA is enabled', async () => {
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('mfa.accountCenter')).toBeInTheDocument();
				expect(
					screen.getByText((content) => content.startsWith('mfa.goToAccountCenter')),
				).toBeInTheDocument();
			});
		});

		it('disables MFA when password is provided', async () => {
			const user = userEvent.setup();
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.enabledStatus')).toBeInTheDocument();
			});

			await user.type(
				screen.getByPlaceholderText('auth.mfa.disablePlaceholder'),
				'current-password',
			);
			await user.click(screen.getByRole('button', { name: 'auth.mfa.disableBtn' }));

			await waitFor(() => {
				expect(mockDisableMFA).toHaveBeenCalledWith({
					code: 'current-password',
					userId: 'test-user-id',
				});
			});
		});

		it('shows error when disable MFA fails', async () => {
			mockDisableMFA.mockRejectedValue({
				response: { data: { message: 'Invalid password' } },
			});

			const user = userEvent.setup();
			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.enabledStatus')).toBeInTheDocument();
			});

			await user.type(screen.getByPlaceholderText('auth.mfa.disablePlaceholder'), 'wrong-password');
			await user.click(screen.getByRole('button', { name: 'auth.mfa.disableBtn' }));

			await waitFor(() => {
				expect(screen.getByText('Invalid password')).toBeInTheDocument();
			});
		});
	});

	describe('when user has no ID', () => {
		it('shows setup wizard without calling getMFAStatus', async () => {
			const prevUser = mockUser;
			mockUser = null;
			mockGetMFAStatus.mockClear();
			mockGetMFAStatus.mockResolvedValue({
				data: { totpEnabled: false, smsEnabled: false, emailEnabled: false },
			});

			renderMFASetup();

			await waitFor(() => {
				expect(screen.getByText('auth.mfa.setupTitle')).toBeInTheDocument();
			});

			expect(mockGetMFAStatus).not.toHaveBeenCalled();

			mockUser = prevUser;
		});
	});
});
