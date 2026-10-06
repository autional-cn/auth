import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '@/App';

// ============================================================
// 裸 /<slug>（brand 落地目标）index 路由的租户白名单守卫 —— 接线回归锁
//
// 背景：/:tenantSlug index 路由此前裸奔（无守卫），任何单段路径都会被贪婪
// 渲染成 dashboard。守卫组件 TenantIndexGuard 一直在 shared 包里，但 App.tsx
// 从未挂载 ⇒ 本测试锁的是「App.tsx 真的把守卫接上了」，而非守卫自身逻辑。
//
// mock 面只覆盖与守卫无关的重型/网络件：
//   - RequireAuth → 哨兵（真实实现含未登录跳转 + 懒加载整页 dashboard）
//   - generated/api、认证配置 hook → 避免 axios/XHR 噪声
// TenantIndexGuard 走真实实现（含 fetch 响应契约解析 —— 被测物本体）。
// ============================================================

const { mockFetch } = vi.hoisted(() => ({ mockFetch: vi.fn() }));

vi.mock('@autional/shared', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional/shared')>();
	return {
		...actual,
		// 守卫放行后的落点哨兵：只证明「到达 /:tenantSlug/dashboard 路由」，不渲染真实页面
		RequireAuth: () => <div data-testid="auth-gate" />,
		useLogout: () => vi.fn(),
		OAuthCallbackPage: () => null,
	};
});

vi.mock('@autional/shared/generated/api', () => ({
	tenantPublicTenantsByTenants: vi.fn(() => Promise.resolve(null)),
}));

vi.mock('@/hooks/use-tenant-auth-config', () => ({
	useTenantAuthConfigBySlug: () => ({ data: null }),
}));

// I18nProvider 直连 react-i18next 实例（setup.ts 只桩了 @/i18n/config，无实例时其
// effect 会 `i18n.on` 崩）；本测试与文案无关，桩掉即可
vi.mock('@/lib/i18n', () => ({
	I18nProvider: ({ children }: any) => children,
	useI18n: () => ({ lang: 'zh-CN', t: (key: string) => key, setLang: vi.fn() }),
	defaultLang: 'zh-CN',
}));

/**
 * 名单响应打桩。真实 hook 的解析顺序是 items → data → 原始对象，
 * 故此处只认「data 字段」的用例见 G4（响应契约本身也在被测范围内）。
 */
function stubTenants(payload: unknown, ok = true) {
	mockFetch.mockResolvedValue({
		ok,
		json: async () => payload,
	} as any);
}

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const originalWindowLocation = window.location;

/** TenantIndexGuard 的 slug 取自 window.location.pathname（非路由参数），须与 MemoryRouter 同步驱动 */
function setWindowPath(pathname: string) {
	delete (window as any).location;
	(window as any).location = Object.defineProperties(
		{},
		{
			...Object.getOwnPropertyDescriptors(originalWindowLocation),
			pathname: { get: () => pathname },
		},
	);
}

function renderApp(pathname: string) {
	setWindowPath(pathname);
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={[pathname]}>
				<App />
			</MemoryRouter>
		</QueryClientProvider>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	// queryClient 是模块级单例，['public-tenants'] 缓存会跨用例泄漏
	// （不清则后续用例吃前一个用例的名单，「白名单为空」类用例永远测不到真实分支）
	queryClient.clear();
	vi.stubGlobal('fetch', mockFetch);
	vi.stubGlobal(
		'matchMedia',
		vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	);
	stubTenants({
		code: 0,
		items: [
			{ id: 't1', name: 'demo' },
			{ id: 't2', name: 'acme' },
		],
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
	if (window.location !== originalWindowLocation) {
		Object.defineProperty(window, 'location', { value: originalWindowLocation, writable: true });
	}
});

describe('App /:tenantSlug index 守卫接线', () => {
	it('G1 未知单段 slug + 名单非空 → 渲染 404，不落入 dashboard', async () => {
		renderApp('/nosuchtenant');
		// 去掉守卫时该路径会 Navigate 到 dashboard 落成 auth-gate，本断言即失败
		expect(await screen.findByText('404')).toBeInTheDocument();
		expect(screen.queryByTestId('auth-gate')).not.toBeInTheDocument();
		expect(mockFetch).toHaveBeenCalled();
	});

	it('G2 名单内 slug → 放行到 /:tenantSlug/dashboard', async () => {
		renderApp('/demo');
		expect(await screen.findByTestId('auth-gate')).toBeInTheDocument();
		expect(screen.queryByText('404')).not.toBeInTheDocument();
	});

	it('G3 名单接口网络挂（白名单为空）→ 放行，不整站 404（与其余门户同口径）', async () => {
		mockFetch.mockRejectedValue(new Error('network down'));
		renderApp('/anytenant');
		expect(await screen.findByTestId('auth-gate')).toBeInTheDocument();
		expect(mockFetch).toHaveBeenCalled();
	});

	it('G4 响应契约：名单在 data 字段（非 items）时白名单仍生效 → 未知 slug 仍 404', async () => {
		stubTenants({ code: 0, data: [{ id: 't1', name: 'demo' }] });
		renderApp('/nosuchtenant');
		expect(await screen.findByText('404')).toBeInTheDocument();
		expect(screen.queryByTestId('auth-gate')).not.toBeInTheDocument();
	});
});
