// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ============================================================
// F-W5b 回归锁：useBootstrap 无会话时必须 'idle'，不得 'loading'
//  —— platform-console LayoutWrapper 以 bootstrap==='loading' 挡 Outlet，
//     而 RequireAuth（唯一登录交棒点）在 Outlet 内 ⇒ 无会话冷启动永停 Spin。
// ============================================================

const { mockQueries } = vi.hoisted(() => ({
	mockQueries: {
		perms: { data: undefined as unknown, isError: false },
		tenants: { data: undefined as unknown, isError: false },
	},
}));

vi.mock('../../auth/auth-queries', () => ({
	usePermissionsQuery: () => mockQueries.perms,
	useTenantsQuery: () => mockQueries.tenants,
}));

import { useBootstrap } from '../useBootstrap';
import { useAuthStore } from '../../auth/store';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function wrapper({ children }: { children: React.ReactNode }) {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function resetAuthStore(): void {
	useAuthStore.setState({
		user: null,
		accessToken: null,
		refreshToken: null,
		tenants: [],
		currentTenantId: null,
		permissions: [],
		isAuthenticated: false,
	});
	window.localStorage.clear();
}

describe('useBootstrap（F-W5b 无会话语义）', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetAuthStore();
		mockQueries.perms = { data: undefined, isError: false };
		mockQueries.tenants = { data: undefined, isError: false };
	});

	afterEach(() => {
		cleanup();
		resetAuthStore();
	});

	it('无 token → idle（回归锁：返回 loading 会让 Layout 消费者永停 Spin）', () => {
		const { result } = renderHook(() => useBootstrap(), { wrapper });
		expect(result.current).toBe('idle');
		expect(result.current).not.toBe('loading');
	});

	it('无 token 且 store 残留数据 → 仍 idle（登出/切换租户后的残态不得冒充 ready）', () => {
		useAuthStore.setState({
			accessToken: null,
			permissions: ['user.read'],
			tenants: [{ id: 't1', name: 'demo', role: 'member' }],
		});
		const { result } = renderHook(() => useBootstrap(), { wrapper });
		expect(result.current).toBe('idle');
	});

	it('有 token + store 已缓存权限与租户 → ready', () => {
		useAuthStore.setState({
			accessToken: 'token-xyz',
			permissions: ['user.read'],
			tenants: [{ id: 't1', name: 'demo', role: 'member' }],
		});
		const { result } = renderHook(() => useBootstrap(), { wrapper });
		expect(result.current).toBe('ready');
	});

	it('有 token 但查询尚未到达 → loading（保持既有等待语义）', () => {
		useAuthStore.setState({ accessToken: 'token-xyz' });
		const { result } = renderHook(() => useBootstrap(), { wrapper });
		expect(result.current).toBe('loading');
	});
});
