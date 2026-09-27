import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TermsPage from '../terms/page';

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

vi.mock('@/components/auth/AuthCard', () => ({
	AuthCard: ({ children, title, subtitle }: any) => (
		<div data-testid="auth-card">
			{title && <h1>{title}</h1>}
			{subtitle && <p>{subtitle}</p>}
			{children}
		</div>
	),
}));

vi.mock('@/components/auth/AuthHeader', () => ({
	AuthHeader: ({ title, subtitle }: any) => (
		<div data-testid="auth-header">
			<h1>{title}</h1>
			{subtitle && <p>{subtitle}</p>}
		</div>
	),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderPage = () =>
	render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={['/terms']}>
				<TermsPage />
			</MemoryRouter>
		</QueryClientProvider>,
	);

describe('TermsPage', () => {
	it('renders title and all 9 section headings', () => {
		renderPage();

		expect(screen.getByText('terms.title')).toBeInTheDocument();
		expect(screen.getByText('terms.lastUpdated')).toBeInTheDocument();

		for (let i = 1; i <= 9; i++) {
			expect(screen.getByText(`terms.sections.${i}.title`)).toBeInTheDocument();
		}
	});

	it('renders back link to home', () => {
		renderPage();

		const backLink = screen.getByText('terms.backToSignIn');
		expect(backLink).toBeInTheDocument();
		expect(backLink.closest('a')).toHaveAttribute('href', '/');
	});

	it('keeps tenant slug in back-to-signin link when accessed under /:tenantSlug/terms', () => {
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter initialEntries={['/acme-corp/terms']}>
					<Routes>
						<Route path="/:tenantSlug/terms" element={<TermsPage />} />
					</Routes>
				</MemoryRouter>
			</QueryClientProvider>,
		);

		const backLink = screen.getByText('terms.backToSignIn');
		expect(backLink.closest('a')).toHaveAttribute('href', '/acme-corp/login');
	});
});
