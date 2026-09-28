import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EntryRouter } from '@/components/EntryRouter';

// ============================================================
// 波 3：auth 入口路由（裸根 `/` 与 `/login`）三分支收口
// mock 面局部：react-router / @autional-cn/shared / generated/api
// extractSlugFromPath 走真实实现（importOriginal 保留），slug 名单校验走 mock API
// ============================================================

const {
	mockNavigate,
	mockSearchParams,
	mockParamsMap,
	mockReplace,
	mockFetch,
	mockSession,
} = vi.hoisted(() => {
	const params: Record<string, string | null> = { redirect: null };
	return {
		mockNavigate: vi.fn(),
		mockSearchParams: { get: vi.fn((key: string) => params[key] ?? null) },
		mockParamsMap: params,
		mockReplace: vi.fn(),
		mockFetch: vi.fn(),
		mockSession: {
			token: null as string | null,
			tenants: [] as Array<{ id: string; name: string; role: string }>,
			currentTenantId: null as string | null,
		},
	};
});

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useSearchParams: () => [mockSearchParams, vi.fn()],
	};
});

vi.mock('@autional-cn/shared', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional-cn/shared')>();
	return {
		...actual,
		getAccessToken: () => mockSession.token,
		isValidRedirect: (url: string) => {
			try {
				const origin = new URL(url).origin;
				return ['https://auth.autional.cn', 'https://admin.autional.cn', 'https://user.autional.cn'].includes(
					origin,
				);
			} catch {
				return false;
			}
		},
		getPortalUrl: (id: string, slug?: string) => {
			if (id === 'brand') return 'https://brand.autional.cn';
			return `https://${id}.autional.cn${slug ? '/' + slug : ''}`;
		},
		useTenants: () => mockSession.tenants,
		useCurrentTenantId: () => mockSession.currentTenantId,
	};
});

/**
 * 租户名单走 shared 的 usePublicTenantSlugs（真实实现，含 items→data→raw 响应契约解析），
 * 只打桩 fetch。这样「响应形状解析」本身也在被测范围内（波 3 复核发现：自写查询只认 items，
 * 且失败时 isSuccess 恒 false 会卡死加载态）。
 */
function stubTenantsFetch(payload: unknown, ok = true) {
	mockFetch.mockResolvedValue({
		ok,
		json: async () => payload,
	} as any);
}

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderEntry() {
	return render(
		<QueryClientProvider client={queryClient}>
			<EntryRouter />
		</QueryClientProvider>,
	);
}

const originalWindowLocation = window.location;

beforeEach(() => {
	vi.clearAllMocks();
	// 必须清：queryClient 是模块级单例，['public-tenants'] 缓存会跨用例泄漏
	// （不清则后续用例吃前一个用例的名单，失败路径用例永远测不到真实分支）
	queryClient.clear();
	mockParamsMap.redirect = null;
	mockSession.token = null;
	mockSession.tenants = [];
	mockSession.currentTenantId = null;
	sessionStorage.clear();
	vi.stubGlobal('fetch', mockFetch);
	stubTenantsFetch({
		code: 0,
		items: [
			{ id: 't1', name: 'demo' },
			{ id: 't2', name: 'acme' },
		],
	});
	// reapply.test.tsx 同款：先 delete 再重建（jsdom location 不可直接赋值）
	delete (window as any).location;
	(window as any).location = Object.defineProperties(
		{},
		{
			...Object.getOwnPropertyDescriptors(originalWindowLocation),
			origin: { get: () => 'https://auth.autional.cn' },
			replace: { get: () => mockReplace },
		},
	);
});

afterEach(() => {
	vi.unstubAllGlobals();
	if (window.location !== originalWindowLocation) {
		Object.defineProperty(window, 'location', { value: originalWindowLocation, writable: true });
	}
});

describe('EntryRouter', () => {
	it('E1 回程带租户段（真实 slug）→ 直达 /<slug>/login 并透传 redirect', async () => {
		mockParamsMap.redirect = 'https://admin.autional.cn/demo/';
		renderEntry();
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith(
				'/demo/login?redirect=' + encodeURIComponent('https://admin.autional.cn/demo/'),
				{ replace: true },
			);
		});
	});

	it('E2 回程带未知 slug → 不认，交棒 brand（原 redirect 原样带走）', async () => {
		mockParamsMap.redirect = 'https://admin.autional.cn/nosuch/';
		renderEntry();
		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith(
				'https://brand.autional.cn/?redirect=' + encodeURIComponent('https://admin.autional.cn/nosuch/'),
			);
		});
		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('E3 回程是门户裸根（无租户段）→ 交棒 brand（由 brand 注入 slug）', async () => {
		mockParamsMap.redirect = 'https://admin.autional.cn/';
		renderEntry();
		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith(
				'https://brand.autional.cn/?redirect=' + encodeURIComponent('https://admin.autional.cn/'),
			);
		});
	});

	it('E4 无 redirect + 有会话 → /<会话租户>/dashboard（不经过 brand）', async () => {
		mockSession.token = 'token-xyz';
		mockSession.tenants = [{ id: 't1', name: 'demo', role: 'owner' }];
		mockSession.currentTenantId = 't1';
		sessionStorage.setItem('auth_dashboard_slug', 'demo');
		renderEntry();
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/demo/dashboard', { replace: true });
		});
		expect(mockReplace).not.toHaveBeenCalled();
	});

	it('E5 无 redirect + 无会话 → brand 裸根', async () => {
		renderEntry();
		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith('https://brand.autional.cn/');
		});
	});

	it('E6 有 token 但解析不出会话租户 → brand 裸根', async () => {
		mockSession.token = 'token-xyz';
		renderEntry();
		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith('https://brand.autional.cn/');
		});
	});

	// ── 失败路径回归锁（波 3 复核发现：原自写查询在名单接口失败时 isSuccess 恒 false，
	//    ready 永不置真 → 入口页无限转圈，且无任何用例覆盖）──

	it('E7 名单接口 HTTP 失败 → 不卡加载，仍交棒 brand 并保留 redirect', async () => {
		mockParamsMap.redirect = 'https://admin.autional.cn/demo/';
		stubTenantsFetch({}, false);
		renderEntry();
		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith(
				'https://brand.autional.cn/?redirect=' +
					encodeURIComponent('https://admin.autional.cn/demo/'),
			);
		});
		// 证明走了真实名单查询（而非空转通过）
		expect(mockFetch).toHaveBeenCalled();
		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('E8 名单接口抛异常（网络断）→ 不卡加载，仍交棒 brand', async () => {
		mockParamsMap.redirect = 'https://admin.autional.cn/demo/';
		mockFetch.mockRejectedValue(new Error('network down'));
		renderEntry();
		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith(
				'https://brand.autional.cn/?redirect=' +
					encodeURIComponent('https://admin.autional.cn/demo/'),
			);
		});
		expect(mockFetch).toHaveBeenCalled();
		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('E9 响应契约兼容：名单在 data 字段（非 items）时仍能识别真实 slug', async () => {
		mockParamsMap.redirect = 'https://admin.autional.cn/demo/';
		stubTenantsFetch({ code: 0, data: [{ id: 't1', name: 'demo' }] });
		renderEntry();
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith(
				'/demo/login?redirect=' + encodeURIComponent('https://admin.autional.cn/demo/'),
				{ replace: true },
			);
		});
	});
});
