import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ReapplyPage from '../reapply/page';

const { mockApiClientPost, mockAuthRegisterReapplyPost } = vi.hoisted(() => ({
	mockApiClientPost: vi.fn(),
	mockAuthRegisterReapplyPost: vi.fn(),
}));

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

vi.mock('@autional/shared', () => ({
	apiClient: {
		post: (...args: any[]) => mockApiClientPost(...args),
	},
}));

vi.mock('@autional/shared/generated/api', () => ({
	authRegisterReapplyPost: (...args: any[]) => mockAuthRegisterReapplyPost(...args),
}));

vi.mock('@/lib/i18n', () => ({
	useI18n: () => ({
		t: (key: string, opts?: any) => (opts ? `${key} ${JSON.stringify(opts)}` : key),
		lang: 'zh-CN',
		setLang: vi.fn(),
	}),
	I18nProvider: ({ children }: any) => children,
	defaultLang: 'zh-CN',
}));

vi.mock('@/hooks/use-page-title', () => ({
	usePageTitle: vi.fn(),
}));

vi.mock('@autional/ui', () => ({
	Button: ({ children, type, fullWidth, isLoading, ...props }: any) => (
		<button type={type || 'submit'} data-testid="submit-btn" disabled={isLoading} {...props}>
			{children}
		</button>
	),
	Input: ({ id, placeholder, error, disabled, ...props }: any) => (
		<div>
			<input
				id={id}
				placeholder={placeholder}
				disabled={disabled}
				data-testid={`input-${id}`}
				{...props}
			/>
			{error && <p className="text-xs text-danger">{error}</p>}
		</div>
	),
	Label: ({ htmlFor, children }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));

vi.mock('@/components/auth/AuthCard', () => ({
	AuthCard: ({ children, title, subtitle }: any) => (
		<div data-testid="auth-card">
			{title && <h1>{title}</h1>}
			{subtitle && <p>{subtitle}</p>}
			{children}
		</div>
	),
}));

const renderPage = (searchParams?: string) =>
	render(
		<MemoryRouter initialEntries={[searchParams ? `/reapply${searchParams}` : '/reapply']}>
			<ReapplyPage />
		</MemoryRouter>,
	);

beforeEach(() => {
	vi.clearAllMocks();
});

describe('ReapplyPage', () => {
	it('renders form with disabled email field when email param is provided', () => {
		renderPage('?email=test@example.com');

		expect(screen.getByText('auth.reapply.title')).toBeInTheDocument();
		expect(screen.getByText('auth.reapply.subtitle')).toBeInTheDocument();

		const emailInput = screen.getByTestId('input-email');
		expect(emailInput).toBeDisabled();
	});

	it('renders form with enabled email field when no email param', () => {
		renderPage();

		const emailInput = screen.getByTestId('input-email');
		expect(emailInput).not.toBeDisabled();
	});

	it('shows zod validation error for reason too short (min 10)', async () => {
		renderPage('?email=test@example.com');

		const reasonField = screen.getByPlaceholderText('auth.reapply.reasonPlaceholder');
		fireEvent.change(reasonField, { target: { value: 'Short' } });

		await act(async () => {
			fireEvent.click(screen.getByTestId('submit-btn'));
		});

		await waitFor(() => {
			expect(screen.getByText('validation.reapplyReasonMinLength {"min":10}')).toBeInTheDocument();
		});
	});

	it('submits API and redirects on success', async () => {
		mockAuthRegisterReapplyPost.mockResolvedValue({ code: 1 });

		const hrefSetter = vi.fn();
		const originalLocation = window.location;
		delete (window as any).location;
		(window as any).location = Object.defineProperties(
			{},
			{
				...Object.getOwnPropertyDescriptors(originalLocation),
				href: {
					get: () => 'http://localhost:3000/reapply',
					set: hrefSetter,
				},
			},
		);

		renderPage('?email=test@example.com');

		const reasonField = screen.getByPlaceholderText('auth.reapply.reasonPlaceholder');
		fireEvent.change(reasonField, {
			target: { value: 'This is a valid reason for reapplying to the service' },
		});

		await act(async () => {
			fireEvent.click(screen.getByTestId('submit-btn'));
		});

		expect(mockAuthRegisterReapplyPost).toHaveBeenCalledWith(
			expect.objectContaining({
				email: 'test@example.com',
				reason: 'This is a valid reason for reapplying to the service',
			}),
		);
		expect(hrefSetter).toHaveBeenCalledWith('/dashboard');

		Object.defineProperty(window, 'location', {
			value: originalLocation,
			writable: true,
		});
	});

	it('displays error message on API failure', async () => {
		mockAuthRegisterReapplyPost.mockRejectedValue({
			response: { data: { message: '申请已被拒绝，当前无法重新申请' } },
		});

		renderPage('?email=test@example.com');

		const reasonField = screen.getByPlaceholderText('auth.reapply.reasonPlaceholder');
		fireEvent.change(reasonField, {
			target: { value: 'This is a valid reason for reapplying to the service' },
		});

		await act(async () => {
			fireEvent.click(screen.getByTestId('submit-btn'));
		});

		expect(screen.getByText('申请已被拒绝，当前无法重新申请')).toBeInTheDocument();
	});

	it('shows rejected notice banner', () => {
		renderPage();

		expect(screen.getByText('auth.reapply.rejected')).toBeInTheDocument();
		expect(screen.getByText('auth.reapply.rejectedDesc')).toBeInTheDocument();
	});
});
