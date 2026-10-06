import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TermsPage from '../terms/page';
import { compliancePublicLegalDocuments } from '@autional/shared/generated/api';

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

// AUTH-48/49：返回链按「已解析租户」拼链；默认不可解析（→ '/' 绝对链），
// 租户路由用例显式放行
const mockResolvedSlug = vi.fn(() => undefined as string | undefined);
vi.mock('@/hooks/use-tenant-slug', () => ({
	useResolvedTenantSlug: () => mockResolvedSlug(),
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

vi.mock('@autional/shared/generated/api', async () => {
	const actual = await vi.importActual('@autional/shared/generated/api');
	return {
		...actual,
		compliancePublicLegalDocuments: vi.fn(),
	};
});

const mockedGet = vi.mocked(compliancePublicLegalDocuments);

// retryDelay: 0 —— 页面自身设了 retry: 1（尽快给错误态），默认退避会让测试等满 1s
const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: false, retryDelay: 0 } },
});

beforeEach(() => {
	queryClient.clear();
	mockedGet.mockReset();
	// 基线 = 一份正常的已发布文档；各用例再按需 mockResolvedValueOnce / mockRejectedValue 偏离
	mockedGet.mockResolvedValue(serverDoc);
	mockResolvedSlug.mockReturnValue(undefined);
});

const renderPage = () =>
	render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={['/terms']}>
				<TermsPage />
			</MemoryRouter>
		</QueryClientProvider>,
	);

// 键名用 camelCase：真实响应经 api client 拦截器 unwrap + camelCase 转换后
// 才是页面读到的形态（content/effectiveAt），这里必须与之一致。
const serverDoc = {
	id: 'doc-1',
	docType: 'terms',
	version: 'v2',
	title: '服务端服务条款',
	lang: 'zh-CN',
	content: JSON.stringify([
		{ title: '服务端标题一', body: ['服务端段落甲', '服务端段落乙'] },
		{ title: '服务端标题二', body: '单字符串正文' },
	]),
	effectiveAt: '2026-09-29T00:00:00Z',
	updatedAt: null,
	status: 'published',
};

describe('TermsPage', () => {
	it('renders the heading and an error state when the published document has unusable content', async () => {
		// 行在但 content 不可解析（坏 seed）→ 必须错误态，而不是一张空白卡片
		mockedGet.mockResolvedValueOnce({ ...serverDoc, content: 'not-json' });

		renderPage();

		expect(screen.getByText('terms.title')).toBeInTheDocument();
		expect(await screen.findByText('terms.loadFailed')).toBeInTheDocument();
		expect(screen.getByText('common.loadFailedDesc')).toBeInTheDocument();
		expect(screen.getByText('common.retry')).toBeInTheDocument();
	});

	it('renders server sections when API succeeds', async () => {
		renderPage();

		expect(await screen.findByText('服务端标题一')).toBeInTheDocument();
		expect(screen.getByText('服务端段落甲')).toBeInTheDocument();
		expect(screen.getByText('服务端段落乙')).toBeInTheDocument();
		expect(screen.getByText('服务端标题二')).toBeInTheDocument();
		expect(screen.getByText('单字符串正文')).toBeInTheDocument();
		// lastUpdated 取 effectiveAt 的日期前缀（不因时区偏移跳日）
		expect(
			screen.getByText(
				(text) => text.startsWith('terms.lastUpdated') && text.includes('2026-09-29'),
			),
		).toBeInTheDocument();
		expect(mockedGet).toHaveBeenCalledWith({ doc_type: 'terms', lang: 'zh-CN' });
	});

	it('shows an error state and no legal text at all when API fails', async () => {
		mockedGet.mockRejectedValue(new Error('network down'));

		renderPage();

		expect(await screen.findByText('terms.loadFailed')).toBeInTheDocument();
		expect(screen.getByText('common.loadFailedDesc')).toBeInTheDocument();
		// 架构断言：接口不可用时绝不回落本地文案 —— 页面不得出现任何法律正文。
		// 读到一份可能非权威的文本（而同意记录指向另一版本）是合规风险。
		expect(document.body.textContent).not.toContain('terms.sections.');
		expect(document.body.textContent).not.toContain('服务端标题');
	});

	it('refetches and renders the document when the retry action is clicked', async () => {
		mockedGet.mockRejectedValue(new Error('network down'));

		renderPage();

		const retry = await screen.findByText('common.retry');
		mockedGet.mockResolvedValueOnce(serverDoc);

		fireEvent.click(retry);

		expect(await screen.findByText('服务端标题一')).toBeInTheDocument();
		expect(screen.queryByText('terms.loadFailed')).toBeNull();
	});

	it('renders back link to home', () => {
		renderPage();

		const backLink = screen.getByText('terms.backToSignIn');
		expect(backLink).toBeInTheDocument();
		expect(backLink.closest('a')).toHaveAttribute('href', '/');
	});

	it('keeps tenant slug in back-to-signin link when accessed under /:tenantSlug/terms', () => {
		mockResolvedSlug.mockReturnValue('acme-corp');
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
