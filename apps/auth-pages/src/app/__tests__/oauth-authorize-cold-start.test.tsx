import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Suspense } from 'react';

// ============================================================
// L7 + TASK-15 前端半：同意页冷启动与会话化提交
//  - 无会话 → 直达 <slug>/login?redirect=<本页>（不奔 brand）
//  - slug 解析失败 → 回退旧交棒链（/?redirect=…），不白屏
//  - 有会话 → 同意提交带 Bearer + Accept: application/json，按 redirect_to 整页跳转
// ============================================================

const { mockState, mockFetch, mockReplace, mockGetOAuthClient, mockApiGet } = vi.hoisted(() => ({
	mockState: { token: null as string | null },
	mockFetch: vi.fn(),
	mockReplace: vi.fn(),
	mockGetOAuthClient: vi.fn(),
	mockApiGet: vi.fn(),
}));

vi.mock('@autional-cn/shared', async () => {
	// decodeJwtPayload 取真实现（授权页据它解析 claim）：白名单 mock 其余键保持隔离
	const actual = await vi.importActual<typeof import('@autional-cn/shared')>('@autional-cn/shared');
	return {
		decodeJwtPayload: actual.decodeJwtPayload,
		getAccessToken: () => mockState.token,
		apiClient: { get: (...args: any[]) => mockApiGet(...args), post: vi.fn() },
		extractItem: (payload: any) => payload?.data ?? payload,
	};
});

vi.mock('@autional-cn/shared/generated/api', () => ({
	PublicAuthConfigByAuthConfig: vi.fn(() => Promise.resolve({ data: {} })),
}));

vi.mock('@/lib/api.generated', () => ({
	getOAuthClient: (...args: any[]) => mockGetOAuthClient(...args),
}));

vi.mock('@/lib/i18n', () => ({
	useI18n: () => ({
		t: (key: string, opts?: Record<string, unknown>) =>
			opts ? `${key} ${JSON.stringify(opts)}` : key,
		lang: 'zh-CN',
	}),
}));

import OAuthAuthorizePage from '../oauth/authorize/page';

const AUTHORIZE_PATH = '/oauth/api/v1/oauth/authorize';
const AUTHORIZE_QUERY =
	'?client_id=client-1&redirect_uri=https%3A%2F%2Fuser.autional.cn%2Fdemo%2F&scope=openid&state=st-1';
const AUTHORIZE_URL = AUTHORIZE_PATH + AUTHORIZE_QUERY;

/** 三段式 JWT（仅需可被 atob 解析出 payload，不校验签名） */
const SESSION_TOKEN = `h.${btoa(JSON.stringify({ sub: 'u1', tenant_id: 't1' }))}.s`;

let locationMock: Record<string, any>;

function renderPage() {
	return render(
		<MemoryRouter initialEntries={[`/oauth/authorize${AUTHORIZE_QUERY}`]}>
			<Suspense fallback={<div>Loading</div>}>
				<OAuthAuthorizePage />
			</Suspense>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockState.token = null;
	mockGetOAuthClient.mockResolvedValue({ data: { clientName: 'Test App', logoUri: '' } });
	mockApiGet.mockResolvedValue({ data: { hasConsent: false } });

	vi.stubGlobal('fetch', mockFetch);
	mockFetch.mockImplementation((url: string) => {
		const u = String(url);
		if (u.includes('/oauth/client/')) {
			return Promise.resolve({ ok: true, json: async () => ({ data: { tenantId: 't1' } }) });
		}
		if (u.includes('/tenant/public/tenants')) {
			return Promise.resolve({ ok: true, json: async () => ({ items: [{ id: 't1', name: 'demo' }] }) });
		}
		return Promise.resolve({ ok: false, json: async () => ({}) });
	});

	// jsdom location 不可直接赋值：先 delete 再重建（同 entry-router.test.tsx）
	delete (window as any).location;
	locationMock = {
		origin: 'https://auth.autional.cn',
		pathname: AUTHORIZE_PATH,
		search: AUTHORIZE_QUERY,
		href: '',
		replace: mockReplace,
	};
	(window as any).location = locationMock;
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('同意页冷启动（无会话）', () => {
	it('解析出租户 slug → 直达 <slug>/login?redirect=<本页>，不经过 brand', async () => {
		renderPage();

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith(
				'/demo/login?redirect=' + encodeURIComponent(AUTHORIZE_URL),
			);
		});
		const targets = mockReplace.mock.calls.map((c) => String(c[0]));
		expect(targets.some((t) => t.includes('brand'))).toBe(false);
	});

	it('slug 解析失败 → 回退旧交棒链（/?redirect=…），不白屏', async () => {
		mockFetch.mockRejectedValue(new Error('network down'));
		renderPage();

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith(
				'/?redirect=' + encodeURIComponent(AUTHORIZE_URL),
			);
		});
	});
});

describe('同意提交（有会话）', () => {
	beforeEach(() => {
		mockState.token = SESSION_TOKEN;
	});

	it('提交带 Bearer + Accept: application/json，按 redirect_to 整页跳转', async () => {
		const user = userEvent.setup();
		const landing = 'https://user.autional.cn/demo/?code=abc&state=st-1';
		mockFetch.mockImplementation((url: string, init?: any) => {
			if (String(url).includes('/bff/oauth/api/v1/oauth/authorize')) {
				return Promise.resolve({ ok: true, json: async () => ({ redirect_to: landing }) });
			}
			return Promise.resolve({ ok: false, json: async () => ({}) });
		});

		renderPage();
		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'auth.oauth.approve' })).toBeInTheDocument();
		});

		await user.click(screen.getByRole('button', { name: 'auth.oauth.approve' }));

		await waitFor(() => {
			expect(locationMock.href).toBe(landing);
		});

		const postCall = mockFetch.mock.calls.find(
			(c) => String(c[0]).includes('/bff/oauth/api/v1/oauth/authorize') && c[1]?.method === 'POST',
		);
		expect(postCall).toBeTruthy();
		expect((postCall![1] as any).headers.Authorization).toBe(`Bearer ${SESSION_TOKEN}`);
		expect((postCall![1] as any).headers.Accept).toBe('application/json');
		expect(String((postCall![1] as any).body)).toContain('approved=true');
		expect(mockReplace).not.toHaveBeenCalled();
	});

	it('服务端拒绝 → 呈现 error_description，不跳转', async () => {
		const user = userEvent.setup();
		mockFetch.mockImplementation((url: string, init?: any) => {
			if (String(url).includes('/bff/oauth/api/v1/oauth/authorize')) {
				return Promise.resolve({
					ok: false,
					json: async () => ({ error: 'login_required', error_description: '会话已失效' }),
				});
			}
			return Promise.resolve({ ok: false, json: async () => ({}) });
		});

		renderPage();
		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'auth.oauth.approve' })).toBeInTheDocument();
		});

		await user.click(screen.getByRole('button', { name: 'auth.oauth.approve' }));

		await waitFor(() => {
			expect(screen.getByText('会话已失效')).toBeInTheDocument();
		});
		expect(locationMock.href).toBe('');
	});
});
