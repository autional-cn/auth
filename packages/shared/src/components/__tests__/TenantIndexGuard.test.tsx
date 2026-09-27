// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { TenantIndexGuard, usePublicTenantSlugs } from '../TenantIndexGuard';

function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: { retry: false, gcTime: Infinity },
		},
	});
}

function wrapper(children: ReactNode) {
	return <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>;
}

/** mock fetch 返回 items 数组的 ListResponse */
function stubFetch(items: unknown[], ok = true, status = 200) {
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue({
			ok,
			status,
			json: async () => ({ code: 0, message: 'success', items, total: items.length }),
		}),
	);
}

function stubFetchData(items: unknown[]) {
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ code: 0, message: 'success', data: items }),
		}),
	);
}

function stubFetchReject() {
	vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
}

function stubFetchNonOk() {
	vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
}

function stubFetchBadShape() {
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ foo: 'bar' }),
		}),
	);
}

function setPath(path: string) {
	window.history.pushState({}, '', path);
}

describe('usePublicTenantSlugs（响应契约解析）', () => {
	beforeEach(() => {
		setPath('/acme-corp');
	});

	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
	});

	it('ListResponse 用 items 字段 → 返回租户数组（修复回归）', async () => {
		stubFetch([
			{ id: '1', name: 'acme-corp' },
			{ id: '2', name: 'beta-inc' },
		]);
		let result: unknown[] | undefined;
		function Harness() {
			const q = usePublicTenantSlugs();
			result = q.data;
			return null;
		}
		render(wrapper(<Harness />));
		await waitFor(() =>
			expect(result).toEqual([
				{ id: '1', name: 'acme-corp' },
				{ id: '2', name: 'beta-inc' },
			]),
		);
	});

	it('旧 data 字段兼容 → 返回租户数组', async () => {
		stubFetchData([{ id: '1', name: 'acme-corp' }]);
		let result: unknown[] | undefined;
		function Harness() {
			const q = usePublicTenantSlugs();
			result = q.data;
			return null;
		}
		render(wrapper(<Harness />));
		await waitFor(() => expect(result).toEqual([{ id: '1', name: 'acme-corp' }]));
	});

	it('API 非 200 → 返回空数组（放行语义）', async () => {
		stubFetchNonOk();
		let result: unknown[] | undefined;
		function Harness() {
			const q = usePublicTenantSlugs();
			result = q.data;
			return null;
		}
		render(wrapper(<Harness />));
		await waitFor(() => expect(result).toEqual([]));
	});

	it('网络异常 → 返回空数组', async () => {
		stubFetchReject();
		let result: unknown[] | undefined;
		function Harness() {
			const q = usePublicTenantSlugs();
			result = q.data;
			return null;
		}
		render(wrapper(<Harness />));
		await waitFor(() => expect(result).toEqual([]));
	});

	it('响应无 items/data 且非数组 → 返回空数组', async () => {
		stubFetchBadShape();
		let result: unknown[] | undefined;
		function Harness() {
			const q = usePublicTenantSlugs();
			result = q.data;
			return null;
		}
		render(wrapper(<Harness />));
		await waitFor(() => expect(result).toEqual([]));
	});
});

describe('TenantIndexGuard（P0-2 slug 白名单守卫）', () => {
	const children = <div data-testid="children">Home</div>;
	const notFound = <div data-testid="notfound">404</div>;

	beforeEach(() => {
		setPath('/acme-corp');
	});

	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
	});

	it('slug 在白名单 → 渲染 children', async () => {
		stubFetch([{ id: '1', name: 'acme-corp' }]);
		render(wrapper(<TenantIndexGuard notFound={notFound}>{children}</TenantIndexGuard>));
		await waitFor(() => expect(screen.getByTestId('children')).toBeInTheDocument());
		expect(screen.queryByTestId('notfound')).toBeNull();
	});

	it('slug 不在白名单 → 渲染 notFound（修复回归：无效 slug 此前错误渲染首页）', async () => {
		stubFetch([{ id: '1', name: 'acme-corp' }]);
		setPath('/nonexistent-tenant');
		render(wrapper(<TenantIndexGuard notFound={notFound}>{children}</TenantIndexGuard>));
		await waitFor(() => expect(screen.getByTestId('notfound')).toBeInTheDocument());
		expect(screen.queryByTestId('children')).toBeNull();
	});

	it('白名单为空数组 → 放行渲染 children（API 挂掉时退化为不拦截）', async () => {
		stubFetch([]);
		setPath('/any-slug');
		render(wrapper(<TenantIndexGuard notFound={notFound}>{children}</TenantIndexGuard>));
		await waitFor(() => expect(screen.getByTestId('children')).toBeInTheDocument());
	});

	it('URL 多段路径 → 直接 notFound（basename 已剥离 slug，内部必为未知段）', () => {
		setPath('/acme-corp/xyz');
		render(wrapper(<TenantIndexGuard notFound={notFound}>{children}</TenantIndexGuard>));
		expect(screen.getByTestId('notfound')).toBeInTheDocument();
		expect(screen.queryByTestId('children')).toBeNull();
	});

	it('加载中 → 渲染 loading 占位', async () => {
		let resolveFetch: (v: unknown) => void;
		const pending = new Promise((res) => {
			resolveFetch = res;
		});
		vi.stubGlobal('fetch', vi.fn().mockReturnValue(pending));
		setPath('/acme-corp');
		const loading = <div data-testid="loading">Loading...</div>;
		render(
			wrapper(
				<TenantIndexGuard notFound={notFound} loading={loading}>
					{children}
				</TenantIndexGuard>,
			),
		);
		expect(screen.getByTestId('loading')).toBeInTheDocument();
		await resolveFetch!({
			ok: true,
			status: 200,
			json: async () => ({ code: 0, items: [{ id: '1', name: 'acme-corp' }] }),
		});
		await waitFor(() => expect(screen.getByTestId('children')).toBeInTheDocument());
	});

	it('空 slug（根路径 /）→ 渲染 children', async () => {
		stubFetch([{ id: '1', name: 'acme-corp' }]);
		setPath('/');
		render(wrapper(<TenantIndexGuard notFound={notFound}>{children}</TenantIndexGuard>));
		await waitFor(() => expect(screen.getByTestId('children')).toBeInTheDocument());
	});
});
