import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ErrorPage from '../error/page';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => (opts ? `${key} ${JSON.stringify(opts)}` : key),
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

const mockNavigate = vi.fn();
let mockSearchParamsType = '';

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useSearchParams: () => [{ get: (_k: string) => mockSearchParamsType }, vi.fn()],
		Link: ({ to, children }: any) => <a href={to}>{children}</a>,
	};
});

function renderError() {
	return render(
		<MemoryRouter initialEntries={['/error?type=generic']}>
			<ErrorPage />
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockSearchParamsType = '';
});

describe('ErrorPage', () => {
	it('renders session_expired description and auto-redirects after countdown', async () => {
		vi.useFakeTimers();
		mockSearchParamsType = 'session_expired';
		renderError();

		expect(screen.getByText('auth.error.sessionExpired')).toBeInTheDocument();
		expect(screen.getByText('auth.error.sessionExpiredDesc')).toBeInTheDocument();
		expect(screen.getByText('auth.error.autoRedirect {"seconds":5}')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'auth.error.relogin' })).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(100);
		});

		for (let i = 0; i < 6; i++) {
			act(() => {
				vi.advanceTimersByTime(1000);
			});
		}

		expect(mockNavigate).toHaveBeenCalledWith('/');

		vi.useRealTimers();
	});

	it('renders unauthorized messages', () => {
		mockSearchParamsType = 'unauthorized';
		renderError();

		expect(screen.getByText('auth.error.unauthorized')).toBeInTheDocument();
		expect(screen.getByText('auth.error.unauthorizedDesc')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'auth.error.backHome' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'auth.error.back' })).toBeInTheDocument();
	});

	it('renders ip_restricted error', () => {
		mockSearchParamsType = 'ip_restricted';
		renderError();

		expect(screen.getByText('auth.error.ipRestricted')).toBeInTheDocument();
		expect(screen.getByText('auth.error.ipRestrictedDesc')).toBeInTheDocument();
	});

	it('renders account_locked error', () => {
		mockSearchParamsType = 'account_locked';
		renderError();

		expect(screen.getByText('auth.error.accountLocked')).toBeInTheDocument();
		expect(screen.getByText('auth.error.accountLockedDesc')).toBeInTheDocument();
	});

	it('renders oauth_failed error', () => {
		mockSearchParamsType = 'oauth_failed';
		renderError();

		expect(screen.getByText('auth.error.oauthFailed')).toBeInTheDocument();
		expect(screen.getByText('auth.error.oauthFailedDesc')).toBeInTheDocument();
	});

	it('renders generic error with back button when no type param', () => {
		mockSearchParamsType = '';
		renderError();

		expect(screen.getByText('auth.error.genericError')).toBeInTheDocument();
		expect(screen.getByText('auth.error.genericErrorDesc')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'auth.error.refreshPage' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'auth.error.back' })).toBeInTheDocument();
	});
});
