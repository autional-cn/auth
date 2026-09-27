import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrivacyPage from '../privacy/page';
import { compliancePublicLegalDocuments } from '@autional-cn/shared/generated/api';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => {
			if (opts?.returnObjects) {
				return [`${key}.p1`, `${key}.p2`];
			}
			return key;
		},
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
		t: (key: string, opts?: any) => {
			if (opts?.returnObjects) {
				return [`${key}.p1`, `${key}.p2`];
			}
			return key;
		},
		lang: 'zh-CN',
		setLang: vi.fn(),
	}),
	I18nProvider: ({ children }: any) => children,
	defaultLang: 'zh-CN',
}));

vi.mock('@/hooks/use-page-title', () => ({
	usePageTitle: vi.fn(),
}));

vi.mock('@autional-cn/shared/generated/api', async () => {
	const actual = await vi.importActual('@autional-cn/shared/generated/api');
	return {
		...actual,
		compliancePublicLegalDocuments: vi.fn(),
	};
});

const mockedGet = vi.mocked(compliancePublicLegalDocuments);

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

beforeEach(() => {
	queryClient.clear();
	mockedGet.mockReset();
});

const renderPage = () =>
	render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={['/privacy']}>
				<PrivacyPage />
			</MemoryRouter>
		</QueryClientProvider>,
	);

describe('PrivacyPage', () => {
	it('renders title and all 10 section headings (i18n fallback)', () => {
		renderPage();

		expect(screen.getByText('privacy.title')).toBeInTheDocument();
		expect(screen.getByText('privacy.lastUpdated')).toBeInTheDocument();

		for (let i = 1; i <= 10; i++) {
			expect(screen.getByText(`privacy.sections.section${i}.title`)).toBeInTheDocument();
		}
	});

	it('renders back link to login', () => {
		renderPage();

		const backLink = screen.getByText('privacy.backToLogin');
		expect(backLink).toBeInTheDocument();
		expect(backLink.closest('a')).toHaveAttribute('href', '/');
	});

	it('renders server sections when API succeeds (Array.isArray branch)', async () => {
		mockedGet.mockResolvedValueOnce({
			id: 'doc-1',
			doc_type: 'privacy',
			version: 'v1',
			title: '服务端隐私政策',
			lang: 'zh-CN',
			content: JSON.stringify([
				{ title: '服务端标题一', body: ['服务端段落甲', '服务端段落乙'] },
				{ title: '服务端标题二', body: '单字符串正文' },
			]),
			effective_at: '2026-06-09T00:00:00Z',
			updated_at: null,
			status: 'published',
		});

		renderPage();

		// 数组形态：逐条渲染
		expect(await screen.findByText('服务端标题一')).toBeInTheDocument();
		expect(screen.getByText('服务端段落甲')).toBeInTheDocument();
		expect(screen.getByText('服务端段落乙')).toBeInTheDocument();
		// 字符串形态：直接渲染
		expect(screen.getByText('服务端标题二')).toBeInTheDocument();
		expect(screen.getByText('单字符串正文')).toBeInTheDocument();
		// lastUpdated 保留 i18n 文案模板（mock t 返回 key，模板无日期则原样）
		expect(screen.getByText('privacy.lastUpdated')).toBeInTheDocument();
	});

	it('falls back to i18n sections when API fails', async () => {
		mockedGet.mockRejectedValueOnce(new Error('network down'));

		renderPage();

		expect(await screen.findByText('privacy.sections.section1.title')).toBeInTheDocument();
		expect(screen.getByText('privacy.sections.section10.title')).toBeInTheDocument();
		expect(screen.getByText('privacy.lastUpdated')).toBeInTheDocument();
	});

	it('keeps tenant slug in back-to-login link when accessed under /:tenantSlug/privacy', () => {
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter initialEntries={['/acme-corp/privacy']}>
					<Routes>
						<Route path="/:tenantSlug/privacy" element={<PrivacyPage />} />
					</Routes>
				</MemoryRouter>
			</QueryClientProvider>,
		);

		const backLink = screen.getByText('privacy.backToLogin');
		expect(backLink.closest('a')).toHaveAttribute('href', '/acme-corp/login');
	});
});
