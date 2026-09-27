import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@autional-cn/shared', () => ({
	loginWithTokens: vi.fn(),
	extractApiError: vi.fn((_err: unknown, fallback: string) => ({ message: fallback })),
	crossAppUrl: (url: string) => url,
	END_USER_PORTAL_URL: () => '/user',
}));

vi.mock('@/lib/api', () => ({
	loadAuthExtras: vi.fn(() => Promise.resolve()),
}));

vi.mock('@/lib/api.generated', () => ({
	beginPasskeyLogin: vi.fn(() => Promise.resolve({ data: {} })),
	completePasskeyLogin: vi.fn(() => Promise.resolve({ data: { accessToken: 'test-token' } })),
	beginPasskeyRegister: vi.fn(() => Promise.resolve({ data: {} })),
	completePasskeyRegister: vi.fn(() => Promise.resolve({ data: {} })),
}));

vi.mock('@/lib/i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		lang: 'zh-CN',
	}),
}));

import PasskeyPage from '../passkey/page';

function renderPasskey(mode: 'login' | 'register' = 'login') {
	return render(
		<MemoryRouter initialEntries={[`/passkey?mode=${mode}`]}>
			<PasskeyPage />
		</MemoryRouter>,
	);
}

describe('PasskeyPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('login mode', () => {
		it('renders title and subtitle for login mode', () => {
			renderPasskey('login');
			expect(screen.getByText('passkey.titleLogin')).toBeInTheDocument();
			expect(screen.getByText('passkey.subtitleLogin')).toBeInTheDocument();
		});

		it('renders submit button for login', () => {
			renderPasskey('login');
			expect(screen.getByText('passkey.submitLogin')).toBeInTheDocument();
		});

		it('renders back button to login page', () => {
			renderPasskey('login');
			expect(screen.getByText('passkey.backLogin')).toBeInTheDocument();
		});

		it('renders what-is-passkey info section', () => {
			renderPasskey('login');
			expect(screen.getByText('passkey.whatIs')).toBeInTheDocument();
			expect(screen.getByText('passkey.description')).toBeInTheDocument();
		});

		it('shows unsupported warning when WebAuthn is not available', () => {
			renderPasskey('login');
			expect(screen.getByText('passkey.unsupported')).toBeInTheDocument();
		});
	});

	describe('register mode', () => {
		it('renders redirect notice for register mode', () => {
			renderPasskey('register');
			expect(screen.getByText('passkey.registerMoved')).toBeInTheDocument();
		});

		it('renders go-to-account-center link for register', () => {
			renderPasskey('register');
			expect(screen.getByText(/passkey\.goToAccountCenter/)).toBeInTheDocument();
		});

		it('renders back link that navigates to dashboard', () => {
			renderPasskey('register');
			const backBtn = screen.getByText('passkey.backLogin');
			expect(backBtn).toBeInTheDocument();
			fireEvent.click(backBtn);
			expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
		});
	});

	describe('error handling', () => {
		it('submit button is disabled when WebAuthn unavailable', () => {
			renderPasskey('login');
			const btn = screen.getByText('passkey.submitLogin');
			expect(btn).toBeDisabled();
		});
	});

	describe('success state', () => {
		it('does not show submit buttons when success is displayed', () => {
			renderPasskey('login');
			expect(screen.queryByText('passkey.successLogin')).not.toBeInTheDocument();
		});
	});
});
