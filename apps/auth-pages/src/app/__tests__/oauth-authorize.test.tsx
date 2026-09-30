import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Suspense } from 'react';

const { mockGeneratePKCE, mockGetOAuthClient, mockAuthorizeOAuth } = vi.hoisted(() => ({
	mockGeneratePKCE: vi.fn(() =>
		Promise.resolve({ verifier: 'test-verifier', challenge: 'test-challenge' }),
	),
	mockGetOAuthClient: vi.fn(),
	mockAuthorizeOAuth: vi.fn(),
}));

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

vi.mock('@autional-cn/shared', () => ({
	getAccessToken: vi.fn(() => 'mock-token'),
	loginWithTokens: vi.fn(),
	apiClient: { get: vi.fn(), post: vi.fn() },
	generatePKCE: () => mockGeneratePKCE(),
}));

vi.mock('@autional-cn/shared/generated/api', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional-cn/shared/generated/api')>();
	return {
		...actual,
		PublicAuthConfigByAuthConfig: vi.fn(() => Promise.resolve({ data: {} })),
	};
});

vi.mock('@/lib/api.generated', () => ({
	getOAuthClient: (...args: any[]) => mockGetOAuthClient(...args),
	authorizeOAuth: (...args: any[]) => mockAuthorizeOAuth(...args),
}));

vi.mock('@/lib/i18n', () => ({
	useI18n: () => ({
		t: (key: string, opts?: Record<string, unknown>) =>
			opts ? `${key} ${JSON.stringify(opts)}` : key,
		lang: 'zh-CN',
	}),
}));

import OAuthAuthorizePage from '../oauth/authorize/page';

const DEFAULT_PARAMS =
	'/oauth/authorize?client_id=test-client&redirect_uri=https://example.com/callback&scope=openid+profile&state=random-state';

function renderOAuthAuthorize(url = DEFAULT_PARAMS) {
	return render(
		<MemoryRouter initialEntries={[url]}>
			<Suspense fallback={<div>Loading</div>}>
				<OAuthAuthorizePage />
			</Suspense>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockGetOAuthClient.mockResolvedValue({
		data: { client_name: 'Test App', logo_url: '' },
	});
	mockAuthorizeOAuth.mockResolvedValue({
		data: { redirect_url: 'https://example.com/callback?code=auth-code&state=random-state' },
	});
});

describe('OAuthAuthorizePage', () => {
	it('renders the authorize page with scope list from URL params', async () => {
		renderOAuthAuthorize();

		await waitFor(() => {
			expect(screen.getByText('auth.oauth.authorizeTitle')).toBeInTheDocument();
		});

		expect(screen.getByText('auth.oauth.requestedPermissions')).toBeInTheDocument();
		expect(screen.getByText('auth.oauth.scopeOpenid')).toBeInTheDocument();
		expect(screen.getByText('auth.oauth.scopeProfile')).toBeInTheDocument();
	});

	it('shows app client name from API response', async () => {
		mockGetOAuthClient.mockResolvedValue({
			data: { client_name: 'My OAuth App', logo_url: '' },
		});

		renderOAuthAuthorize();

		await waitFor(() => {
			expect(
				screen.getByText('auth.oauth.requestAccess {"clientName":"My OAuth App"}'),
			).toBeInTheDocument();
		});
	});

	it('shows unknownApp fallback when API fails', async () => {
		mockGetOAuthClient.mockRejectedValue(new Error('Network error'));

		renderOAuthAuthorize();

		await waitFor(() => {
			expect(
				screen.getByText('auth.oauth.requestAccess {"clientName":"oauth.authorize.unknownApp"}'),
			).toBeInTheDocument();
		});
	});

	it('submit form has hidden inputs with correct values', async () => {
		renderOAuthAuthorize();

		await waitFor(() => {
			expect(screen.getByText('auth.oauth.authorizeTitle')).toBeInTheDocument();
		});

		const form = document.querySelector('form');
		expect(form).toBeTruthy();
		expect(form?.getAttribute('action')).toBe('/bff/oauth/api/v1/oauth/authorize');
		expect(form?.getAttribute('method')).toBe('POST');

		const inputs = form?.querySelectorAll('input[type="hidden"]');
		const inputMap: Record<string, string> = {};
		inputs?.forEach((i: Element) => {
			const inp = i as HTMLInputElement;
			inputMap[inp.name] = inp.value;
		});
		expect(inputMap.client_id).toBe('test-client');
		expect(inputMap.redirect_uri).toBe('https://example.com/callback');
		expect(inputMap.scope).toBe('openid profile');
		expect(inputMap.state).toBe('random-state');
	});

	it('deny button does not submit the form', async () => {
		const user = userEvent.setup();
		renderOAuthAuthorize();

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'auth.oauth.deny' })).toBeInTheDocument();
		});

		await user.click(screen.getByRole('button', { name: 'auth.oauth.deny' }));

		expect(mockAuthorizeOAuth).not.toHaveBeenCalled();
	});

	it('shows error when deny is clicked without redirect_uri', async () => {
		const user = userEvent.setup();
		renderOAuthAuthorize('/oauth/authorize?client_id=test-client&scope=openid');

		await waitFor(() => {
			expect(screen.getByText('auth.oauth.authorizeTitle')).toBeInTheDocument();
		});

		await user.click(screen.getByRole('button', { name: 'auth.oauth.deny' }));

		await waitFor(() => {
			expect(screen.getByText('auth.oauth.missingRedirect')).toBeInTheDocument();
		});
	});

	it('approve button submits form with correct action', async () => {
		const user = userEvent.setup();
		renderOAuthAuthorize();

		await waitFor(() => {
			expect(screen.getByText('auth.oauth.authorizeTitle')).toBeInTheDocument();
		});

		const approveBtn = screen.getByRole('button', { name: 'auth.oauth.approve' });
		expect(approveBtn).toBeInTheDocument();
		expect(approveBtn.closest('form')).toBeTruthy();
	});

	it('renders agree notice text', async () => {
		renderOAuthAuthorize();

		await waitFor(() => {
			expect(screen.getByText('auth.oauth.agreeNotice')).toBeInTheDocument();
		});
	});

	it('renders basic permission placeholder when no scopes', async () => {
		renderOAuthAuthorize(
			'/oauth/authorize?client_id=test-client&redirect_uri=https://example.com/callback&scope=',
		);

		await waitFor(() => {
			expect(screen.getByText('auth.oauth.basicPermission')).toBeInTheDocument();
		});
		expect(screen.queryByText(/✓/)).toBeNull();
	});
});

// ============================================================
// U85：授权提交失败的错误体归一化 —— 错误对象（非字符串）直接进 JSX 会触发
// React #31 整页崩溃（2026-09-30 线上 502 窗口实证：`{error:{code,message}}`
// 形态被当 React child 渲染）。错误态一律先取 message 字符串再入 state。
// ============================================================

describe('OAuthAuthorizePage 授权失败错误态（U85）', () => {
	function stubAuthorizeFetch(
		body: unknown,
		ok = false,
		status = 502,
		jsonImpl?: () => Promise<any>,
	) {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok,
				status,
				json: jsonImpl ?? (async () => body),
			}),
		);
	}

	async function clickApprove() {
		const user = userEvent.setup();
		renderOAuthAuthorize();
		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'auth.oauth.approve' })).toBeInTheDocument();
		});
		await user.click(screen.getByRole('button', { name: 'auth.oauth.approve' }));
	}

	it('U85-1 平台错误对象 {error:{code,message}} → 渲染 message 字符串（非整页崩溃）', async () => {
		stubAuthorizeFetch({ error: { code: 'DEPLOYMENT_NOT_FOUND', message: '平台边缘错误 E1' } });
		await clickApprove();
		expect(await screen.findByText('平台边缘错误 E1')).toBeInTheDocument();
	});

	it('U85-2 平台错误信封 {code,message} → 渲染 message', async () => {
		stubAuthorizeFetch({ code: 40000503, message: '服务端消息 M2' });
		await clickApprove();
		expect(await screen.findByText('服务端消息 M2')).toBeInTheDocument();
	});

	it('U85-3 响应体非 JSON（Vercel HTML 错误页）→ i18n 兜底文案，不崩', async () => {
		stubAuthorizeFetch(null, false, 502, async () => {
			throw new Error('not json');
		});
		await clickApprove();
		expect(await screen.findByText(/oauth\.authorize\.authorizeFailed/)).toBeInTheDocument();
	});

	it('U85-4 OAuth 规范字符串 error_description → 原样展示（原行为不回归）', async () => {
		stubAuthorizeFetch({ error: 'invalid_request', error_description: 'invalid client' });
		await clickApprove();
		expect(await screen.findByText('invalid client')).toBeInTheDocument();
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});
