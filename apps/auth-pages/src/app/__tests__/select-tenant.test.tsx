import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import SelectTenantPage from '../select-tenant/page';

// ============================================================
// TASK-154: select-tenant 单测（15 用例 S1-S15，AC-005~012）
// mock 面严格局部：react-router / @/lib/i18n / use-page-title /
// @autional-cn/shared / @autional-cn/shared/generated/api（importOriginal spread）
// 真实渲染：AuthCard / Input / 租户卡片按钮
// ============================================================

// vi.hoisted：mockSearchParams 需同时服务 redirect 与 tenant 两个参数，
// 用 mockParamsMap 记录每个 key 的当前值，get 按 key 返回（reset-password L17-25 数组形态的按 key 扩展）
const {
	mockNavigate,
	mockSearchParams,
	mockParamsMap,
	mockClearAuth,
	mockTenantPublicTenants,
	mockPublicAuthConfig,
} = vi.hoisted(() => {
	const params: Record<string, string | null> = { redirect: null, tenant: null };
	return {
		mockNavigate: vi.fn(),
		mockSearchParams: {
			get: vi.fn((key: string) => params[key] ?? null),
		},
		mockParamsMap: params,
		mockClearAuth: vi.fn(),
		mockTenantPublicTenants: vi.fn(),
		mockPublicAuthConfig: vi.fn(),
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

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useSearchParams: () => [mockSearchParams, vi.fn()],
		Link: ({ to, children }: any) => <a href={to}>{children}</a>,
	};
});

vi.mock('@autional-cn/shared', () => ({
	useAuthStore: {
		getState: () => ({
			clearAuth: mockClearAuth,
		}),
	},
}));

vi.mock('@autional-cn/shared/generated/api', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional-cn/shared/generated/api')>();
	return {
		...actual,
		tenantPublicTenants: (...args: any[]) => mockTenantPublicTenants(...args),
		PublicAuthConfigByAuthConfig: (...args: any[]) => mockPublicAuthConfig(...args),
	};
});

function renderPage() {
	return render(
		<MemoryRouter initialEntries={['/']}>
			<SelectTenantPage />
		</MemoryRouter>,
	);
}

// S8 会临时重建 window.location（注入 reload mock），模块级保存原引用供 afterEach 恢复
const originalWindowLocation = window.location;

// 默认双租户数据（避免单租户自动跳转干扰搜索/选中用例）
const twoTenants = [
	{ id: 't1', name: 'acme', displayName: 'Acme Corp', slug: 'acme' },
	{ id: 't2', name: 'globex', displayName: 'Globex Corp', slug: 'globex' },
];

beforeEach(() => {
	vi.clearAllMocks();
	mockParamsMap.redirect = null;
	mockParamsMap.tenant = null;
	mockTenantPublicTenants.mockReset();
	mockTenantPublicTenants.mockResolvedValue({ items: [] });
	mockPublicAuthConfig.mockReset();
	mockPublicAuthConfig.mockResolvedValue({ enabled: true });
});

afterEach(() => {
	vi.restoreAllMocks();
	// S8 重建过 window.location 时恢复原引用（reapply.test.tsx L162 同款）
	if (window.location !== originalWindowLocation) {
		Object.defineProperty(window, 'location', {
			value: originalWindowLocation,
			writable: true,
		});
	}
});

describe('SelectTenantPage', () => {
	// ---------------- US-001 挂载与映射（AC-005） ----------------

	it('S1 挂载时先 clearAuth 再 tenantPublicTenants（调用序数组断言）', async () => {
		const order: string[] = [];
		mockClearAuth.mockImplementation(() => {
			order.push('clearAuth');
		});
		mockTenantPublicTenants.mockImplementation(() => {
			order.push('tenantPublicTenants');
			return Promise.resolve({ items: [] });
		});

		renderPage();

		await waitFor(() => {
			expect(mockTenantPublicTenants).toHaveBeenCalled();
		});
		expect(mockClearAuth).toHaveBeenCalledTimes(1);
		expect(order).toEqual(['clearAuth', 'tenantPublicTenants']);
	});

	it('S2 display_name 兜底 + displayName 空兜底 name + name 升序', async () => {
		mockTenantPublicTenants.mockResolvedValue({
			items: [
				{ id: 't2', name: 'Beta', displayName: '', slug: undefined },
				{ id: 't1', name: 'Alpha', display_name: 'AlphaCorp' },
			],
		});

		renderPage();

		// display_name（snake_case）兜底为 displayName
		await waitFor(() => {
			expect(screen.getByText('AlphaCorp')).toBeInTheDocument();
		});
		// displayName 空串 → 兜底 name 'Beta'（displayName 行 + name 行共 2 处）
		expect(screen.getAllByText('Beta')).toHaveLength(2);
		// slug 缺失 → 兜底 name（不直接渲染，由 S5/S13 跳转路径覆盖）
		expect(screen.getByText('Alpha')).toBeInTheDocument();
		// name 升序：Alpha 卡片在 Beta 卡片前
		const buttons = screen.getAllByRole('button');
		expect(buttons[0].textContent).toContain('AlphaCorp');
		expect(buttons[1].textContent).toContain('Beta');
	});

	it('S3 乱序输入按 name localeCompare 升序渲染', async () => {
		mockTenantPublicTenants.mockResolvedValue({
			items: [
				{ id: 'c', name: 'Charlie', displayName: 'CharlieCorp', slug: 'charlie' },
				{ id: 'a', name: 'Alpha', displayName: 'AlphaCorp', slug: 'alpha' },
				{ id: 'b', name: 'Beta', displayName: 'BetaCorp', slug: 'beta' },
			],
		});

		renderPage();

		await waitFor(() => {
			expect(screen.getAllByRole('button')).toHaveLength(3);
		});
		const buttons = screen.getAllByRole('button');
		expect(buttons[0].textContent).toContain('AlphaCorp');
		expect(buttons[1].textContent).toContain('BetaCorp');
		expect(buttons[2].textContent).toContain('CharlieCorp');
	});

	// ---------------- US-002 三态：loading / empty / error（AC-006/008/009） ----------------

	it('S4 loading 态渲染 skeleton 占位（1 圆 + 2 文本条 + 3 列表块）且无搜索框', async () => {
		let resolveTenants!: (v: { items: unknown[] }) => void;
		mockTenantPublicTenants.mockReturnValue(
			new Promise((res) => {
				resolveTenants = res;
			}),
		);

		const { container } = renderPage();

		// pending 中：1 圆 + 2 文本条 + 3 列表块 = 6 个 animate-pulse
		expect(container.querySelectorAll('.animate-pulse')).toHaveLength(6);
		// 3 个列表占位块（h-16）
		expect(container.querySelectorAll('[class*="h-16"]')).toHaveLength(3);
		// 无搜索框、无卡片、无标题
		expect(screen.queryByRole('textbox')).toBeNull();
		expect(screen.queryByText('selectTenant.title')).toBeNull();
		expect(screen.queryAllByRole('button')).toHaveLength(0);

		// resolve 后 skeleton 消失、搜索框出现
		await act(async () => {
			resolveTenants({
				items: [{ id: 't1', name: 'acme', displayName: 'Acme Corp', slug: 'acme' }],
			});
		});

		await waitFor(() => {
			expect(container.querySelectorAll('.animate-pulse')).toHaveLength(0);
			expect(
				screen.getByPlaceholderText('selectTenant.searchPlaceholder'),
			).toBeInTheDocument();
		});
	});

	it('S7 空列表渲染 selectTenant.empty 错误态', async () => {
		mockTenantPublicTenants.mockResolvedValue({ items: [] });

		renderPage();

		await waitFor(() => {
			expect(screen.getByText('selectTenant.empty')).toBeInTheDocument();
		});
		// 错误态无搜索框
		expect(screen.queryByRole('textbox')).toBeNull();
	});

	it('S8 API 失败渲染 selectTenant.loadError + retry 触发 window.location.reload', async () => {
		// jsdom 的 window.location.reload 不可写不可配置（vi.spyOn 抛 Cannot redefine property）。
		// 沿用 reapply.test.tsx L129-138 先例：delete 后重建 location 对象并注入 reload mock。
		// 单处使用 `as unknown as`（G2 契约允许，以通过 TS "delete 操作数必须可选" 校验）
		const originalLocation = window.location;
		const reloadMock = vi.fn();
		delete (window as unknown as { location: unknown }).location;
		(window as unknown as { location: unknown }).location = Object.defineProperties(
			{},
			{
				...Object.getOwnPropertyDescriptors(originalLocation),
				reload: { value: reloadMock, writable: true, enumerable: true, configurable: true },
			},
		);

		mockTenantPublicTenants.mockRejectedValue(new Error('network down'));

		renderPage();

		await waitFor(() => {
			expect(screen.getByText('selectTenant.loadError')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByText('selectTenant.retry'));
		expect(reloadMock).toHaveBeenCalledTimes(1);
	});

	// ---------------- US-003 跳转：单租户自动 / 选中（AC-007/011） ----------------

	it('S5 单租户自动 navigate 到 /{slug}/login（replace:true，slug 缺失兜底 name）', async () => {
		// 无 slug → 兜底 slug = name = 'acme'
		mockTenantPublicTenants.mockResolvedValue({
			items: [{ id: 't1', name: 'acme', displayName: 'Acme Corp' }],
		});

		renderPage();

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/acme/login', { replace: true });
		});
		// 单租户不渲染 empty 文案（B-07）
		expect(screen.queryByText('selectTenant.empty')).toBeNull();
	});

	it('S6 单租户 + redirect 参数跳转带 ?redirect=（与 encodeURIComponent 输出精确匹配）', async () => {
		mockParamsMap.redirect = '/dashboard';
		mockTenantPublicTenants.mockResolvedValue({
			items: [{ id: 't1', name: 'acme', displayName: 'Acme Corp', slug: 'acme' }],
		});

		renderPage();

		const expected = `/acme/login?redirect=${encodeURIComponent('/dashboard')}`;
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith(expected, { replace: true });
		});
	});

	it('S13 选中租户调用 PublicAuthConfigByAuthConfig(id) 后 navigate（resolve 路径）', async () => {
		mockTenantPublicTenants.mockResolvedValue({ items: twoTenants });

		renderPage();

		await waitFor(() => {
			expect(screen.getAllByRole('button')).toHaveLength(2);
		});

		fireEvent.click(screen.getByRole('button', { name: /Acme/ }));

		await waitFor(() => {
			expect(mockPublicAuthConfig).toHaveBeenCalledWith('t1');
			expect(mockNavigate).toHaveBeenCalledWith('/acme/login');
		});
	});

	it('S14 config pending 期间卡片禁用 + reject 仍 navigate（吞错）', async () => {
		let rejectConfig!: (e: unknown) => void;
		mockPublicAuthConfig.mockReturnValue(
			new Promise((_, rej) => {
				rejectConfig = rej;
			}),
		);
		mockTenantPublicTenants.mockResolvedValue({ items: twoTenants });

		const { container } = renderPage();

		await waitFor(() => {
			expect(screen.getAllByRole('button')).toHaveLength(2);
		});

		fireEvent.click(screen.getByRole('button', { name: /Acme/ }));

		// pending 期间两卡片全部禁用（互斥防重复提交）
		expect(container.querySelectorAll('button[disabled]')).toHaveLength(2);

		// config reject → 吞错仍跳转
		await act(async () => {
			rejectConfig(new Error('config failed'));
		});

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/acme/login');
		});
	});

	// ---------------- US-004 搜索与路由参数（AC-010/012） ----------------

	it('S9 搜索按 name 大小写不敏感过滤 + 计数 1 of 2 organizations', async () => {
		mockTenantPublicTenants.mockResolvedValue({ items: twoTenants });

		renderPage();

		await waitFor(() => {
			expect(screen.getAllByRole('button')).toHaveLength(2);
		});

		fireEvent.change(screen.getByPlaceholderText('selectTenant.searchPlaceholder'), {
			target: { value: 'acme' },
		});

		expect(screen.getAllByRole('button')).toHaveLength(1);
		expect(screen.getByText('Acme Corp')).toBeInTheDocument();
		expect(screen.getByText('1 of 2 organizations')).toBeInTheDocument();
	});

	it('S10 搜索按 displayName / slug 命中（各一条）', async () => {
		mockTenantPublicTenants.mockResolvedValue({
			items: [
				{ id: 't1', name: 'Zen Corp', displayName: 'Acme Display', slug: 'zen' },
				{ id: 't2', name: 'Gamma Corp', displayName: 'Gamma Display', slug: 'acme-gamma' },
			],
		});

		renderPage();

		await waitFor(() => {
			expect(screen.getAllByRole('button')).toHaveLength(2);
		});

		fireEvent.change(screen.getByPlaceholderText('selectTenant.searchPlaceholder'), {
			target: { value: 'acme' },
		});

		// t1 由 displayName 命中，t2 由 slug 命中
		expect(screen.getByText('Acme Display')).toBeInTheDocument();
		expect(screen.getByText('Gamma Display')).toBeInTheDocument();
		expect(screen.getAllByRole('button')).toHaveLength(2);
	});

	it('S11 搜索无匹配渲染 selectTenant.noMatch + 计数 0 of 2 organizations', async () => {
		mockTenantPublicTenants.mockResolvedValue({ items: twoTenants });

		renderPage();

		await waitFor(() => {
			expect(screen.getAllByRole('button')).toHaveLength(2);
		});

		fireEvent.change(screen.getByPlaceholderText('selectTenant.searchPlaceholder'), {
			target: { value: 'zzz' },
		});

		expect(screen.getByText('selectTenant.noMatch')).toBeInTheDocument();
		expect(screen.getByText('0 of 2 organizations')).toBeInTheDocument();
	});

	it('S12 清空搜索恢复全量卡片 + 非搜索计数（源码拼接 i18n key）', async () => {
		mockTenantPublicTenants.mockResolvedValue({ items: twoTenants });

		renderPage();

		await waitFor(() => {
			expect(screen.getAllByRole('button')).toHaveLength(2);
		});

		const input = screen.getByPlaceholderText('selectTenant.searchPlaceholder');
		fireEvent.change(input, { target: { value: 'acme' } });
		expect(screen.getAllByRole('button')).toHaveLength(1);

		fireEvent.change(input, { target: { value: '' } });

		expect(screen.getAllByRole('button')).toHaveLength(2);
		// 源码: `${tenants.length} ${t('selectTenant.organizationCount') || 'organizations available'}`
		// t(k)=k 模式 → '2 selectTenant.organizationCount'（非 design 文档的 '2 organizations available'，以源码实际行为为准）
		expect(screen.getByText('2 selectTenant.organizationCount')).toBeInTheDocument();
	});

	it('S15 searchParams.tenant 初始搜索词 + unmount 竞态无 act 警告', async () => {
		mockParamsMap.tenant = 'acme';
		mockParamsMap.redirect = '/dashboard';

		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		// 阶段 1：pending 期间页面为 loading 态（无搜索框），resolve 后渲染搜索框并断言初始查询词
		let resolveFirst!: (v: { items: unknown[] }) => void;
		mockTenantPublicTenants.mockReturnValue(
			new Promise((res) => {
				resolveFirst = res;
			}),
		);

		const { unmount } = renderPage();
		await act(async () => {
			resolveFirst({ items: twoTenants });
		});

		const input = screen.getByPlaceholderText(
			'selectTenant.searchPlaceholder',
		) as HTMLInputElement;
		expect(input.value).toBe('acme');
		unmount();

		// 阶段 2：pending 时 unmount → resolve → cancelled 短路，无卸载后 setState / act 警告
		let resolveSecond!: (v: { items: unknown[] }) => void;
		mockTenantPublicTenants.mockReturnValue(
			new Promise((res) => {
				resolveSecond = res;
			}),
		);

		const { unmount: unmount2 } = renderPage();
		unmount2();
		await act(async () => {
			resolveSecond({ items: [] });
		});

		expect(errorSpy).not.toHaveBeenCalled();
		errorSpy.mockRestore();
	});
});
