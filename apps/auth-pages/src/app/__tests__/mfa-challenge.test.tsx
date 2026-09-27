import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import MFAChallengePage from '../mfa-challenge/page';

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

const mockSendMFASMS = vi.fn((_opts?: any) => Promise.resolve());
const mockSendMFAEmail = vi.fn((_opts?: any) => Promise.resolve());
const mockValidateTOTP = vi.fn((_opts?: any) => Promise.resolve());

vi.mock('@/lib/api.generated', () => ({
	sendMFASMS: (...args: any[]) => mockSendMFASMS(...args),
	sendMFAEmail: (...args: any[]) => mockSendMFAEmail(...args),
	validateTOTP: (...args: any[]) => mockValidateTOTP(...args),
	verifyMFASMS: vi.fn((_opts?: any) => Promise.resolve()),
	verifyMFAEmail: vi.fn((_opts?: any) => Promise.resolve()),
}));

function renderMFAChallenge() {
	return render(
		<MemoryRouter initialEntries={['/mfa-challenge']}>
			<MFAChallengePage />
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
});

describe('MFAChallengePage', () => {
	it('renders MFA challenge with TOTP/SMS/Email tabs', () => {
		renderMFAChallenge();
		const totpButtons = screen.getAllByRole('button', { name: 'mfa.challenge.tabTOTP' });
		expect(totpButtons.length).toBeGreaterThan(0);
		expect(screen.getByRole('button', { name: 'mfa.challenge.tabSMS' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'mfa.challenge.tabEmail' })).toBeInTheDocument();
	});

	it('shows code input by default', () => {
		renderMFAChallenge();
		expect(screen.getByPlaceholderText('mfa.challenge.codePlaceholder')).toBeInTheDocument();
	});

	it('switches to SMS tab and shows SMS form fields', async () => {
		const user = userEvent.setup();
		renderMFAChallenge();
		await user.click(screen.getByRole('button', { name: 'mfa.challenge.tabSMS' }));
		const labels = screen.getAllByText('mfa.challenge.smsLabel');
		expect(labels.length).toBeGreaterThan(0);
	});

	it('switches to Email tab and shows Email form fields', async () => {
		const user = userEvent.setup();
		renderMFAChallenge();
		await user.click(screen.getByRole('button', { name: 'mfa.challenge.tabEmail' }));
		const labels = screen.getAllByText('mfa.challenge.emailLabel');
		expect(labels.length).toBeGreaterThan(0);
	});

	it('navigates to /dashboard after successful verification', async () => {
		mockValidateTOTP.mockResolvedValue(undefined);
		const user = userEvent.setup();
		renderMFAChallenge();
		await user.type(screen.getByPlaceholderText('mfa.challenge.codePlaceholder'), '123456');
		const submitButton = screen.getByRole('button', { name: 'mfa.challenge.verify' });
		await user.click(submitButton);

		await waitFor(
			() => {
				expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
			},
			{ timeout: 3_000 },
		);
	});
});
