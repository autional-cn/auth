import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '@/App';

// ============================================================
// U88：裸 /<slug>（brand 落地目标）携 search 时不得丢弃 —— 三级嵌套回程链
// （门户会话过期 → auth → brand withSlug 补 slug 并保留查询串 → 登录成功整页跳
// `/<slug>/?redirect=Z`）最后一跳的接线回归锁。
//
// mock 面与 tenant-index-guard.test.tsx 同构（TenantIndexGuard 走真实实现），另将
// 懒加载登录页替为落点探针：只锁「index 把 search 整串转发给 /<slug>/login」这一
// 决策，不拖入登录页子树（登录页对 redirect 的两条既有分支由 login*.test.tsx 覆盖）。
// ============================================================

const { mockFetch } = vi.hoisted(() => ({ mockFetch: vi.fn() }));

vi.mock('@autional/shared', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional/shared')>();
	return {
		...actual,
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

// 登录页（App 内 React.lazy('./app/page')）→ 落点探针：把实际收到的路由位置写进
// data-*，断言 search 整串（含 from_requireauth / rt 兄弟参数）原样抵达
vi.mock('@/app/page', async () => {
	const { useLocation } = await import('react-router');
	return {
		default: () => {
			const location = useLocation();
			return (
				<div
					data-testid="login-probe"
					data-pathname={location.pathname}
					data-search={location.search}
				/>
			);
		},
	};
});

/**
 * 名单响应打桩（TenantIndexGuard 走真实实现，含响应契约解析）。
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

function renderApp(entry: string, windowPathname: string) {
	setWindowPath(windowPathname);
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={[entry]}>
				<App />
			</MemoryRouter>
		</QueryClientProvider>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	// queryClient 是模块级单例，['public-tenants'] 缓存会跨用例泄漏
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

/** 实况取样的嵌套目标（platform 控制台，2026-09-30T06:28:35Z 走查） */
const NESTED = 'https://platform.autional.cn/demo/?cb=fix1verify';

describe('App /:tenantSlug index 携 redirect 透传（U88）', () => {
	it('R1 redirect + from_requireauth + rt → 落 /<slug>/login，search 整串原样保留', async () => {
		const search = new URLSearchParams({
			redirect: NESTED,
			from_requireauth: '1',
			rt: 'platform.session-expired.munq4yvo',
		}).toString();
		renderApp(`/demo/?${search}`, '/demo');
		const probe = await screen.findByTestId('login-probe');
		expect(probe.getAttribute('data-pathname')).toBe('/demo/login');
		const forwarded = new URLSearchParams(probe.getAttribute('data-search') ?? '');
		expect(forwarded.get('redirect')).toBe(NESTED);
		expect(forwarded.get('from_requireauth')).toBe('1');
		expect(forwarded.get('rt')).toBe('platform.session-expired.munq4yvo');
	});

	it('R2 仅 redirect（无 from_requireauth）→ 同样透传（登录页按会话二分处置）', async () => {
		const search = new URLSearchParams({ redirect: NESTED }).toString();
		renderApp(`/demo/?${search}`, '/demo');
		const probe = await screen.findByTestId('login-probe');
		expect(probe.getAttribute('data-pathname')).toBe('/demo/login');
		expect(new URLSearchParams(probe.getAttribute('data-search') ?? '').get('redirect')).toBe(
			NESTED,
		);
	});

	it('R3 无 search → 维持 dashboard 落点（原语义不回归）', async () => {
		renderApp('/demo/', '/demo');
		expect(await screen.findByTestId('auth-gate')).toBeInTheDocument();
		expect(screen.queryByTestId('login-probe')).not.toBeInTheDocument();
	});

	it('R4 redirect 为空串 → 无回程可透传，仍落 dashboard', async () => {
		renderApp('/demo/?redirect=', '/demo');
		expect(await screen.findByTestId('auth-gate')).toBeInTheDocument();
		expect(screen.queryByTestId('login-probe')).not.toBeInTheDocument();
	});
});
