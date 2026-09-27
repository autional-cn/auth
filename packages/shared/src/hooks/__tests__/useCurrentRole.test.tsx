// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useAuthStore } from '../../auth/store';
import { useCurrentRole } from '../useCurrentRole';

const TENANTS = [
	{ id: 'tenant-a', name: 'Tenant A', role: 'admin' },
	{ id: 'tenant-b', name: 'Tenant B', role: 'member' },
];

/** 重置 store + localStorage，避免跨用例污染（AC-002 约定） */
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

describe('useCurrentRole (AC-002 响应式，zustand selector 订阅 store 本身)', () => {
	beforeEach(() => {
		resetAuthStore();
	});

	afterEach(() => {
		cleanup();
		resetAuthStore();
	});

	it('初始空 store → null', () => {
		const { result } = renderHook(() => useCurrentRole());
		expect(result.current).toBeNull();
	});

	it('渲染后直写 store（setState）→ re-render + 新值', () => {
		const { result } = renderHook(() => useCurrentRole());
		expect(result.current).toBeNull();

		act(() => {
			useAuthStore.setState({ tenants: TENANTS, currentTenantId: 'tenant-a' });
		});
		expect(result.current).toBe('admin');

		act(() => {
			useAuthStore.setState({ currentTenantId: 'tenant-b' });
		});
		expect(result.current).toBe('member');
	});

	it('updateTenants / updateCurrentTenant action 后重渲染新值', () => {
		const { result } = renderHook(() => useCurrentRole());
		expect(result.current).toBeNull();

		act(() => {
			useAuthStore.getState().setTenants(TENANTS);
		});
		expect(result.current).toBeNull(); // 有租户但未选 → 不猜测

		act(() => {
			useAuthStore.getState().setCurrentTenant('tenant-b');
		});
		expect(result.current).toBe('member');

		act(() => {
			useAuthStore.getState().switchTenant('tenant-a');
		});
		expect(result.current).toBe('admin');
	});

	it('logout 清空（tenants [] / currentTenantId null）→ null', () => {
		const { result } = renderHook(() => useCurrentRole());

		act(() => {
			useAuthStore.setState({ tenants: TENANTS, currentTenantId: 'tenant-a' });
		});
		expect(result.current).toBe('admin');

		act(() => {
			useAuthStore.getState().clearAuth();
		});
		expect(result.current).toBeNull();
	});

	it('selector 原语稳定：无关字段变更不触发 re-render（Object.is 比较）', () => {
		let renderCount = 0;
		const { result } = renderHook(() => {
			renderCount++;
			return useCurrentRole();
		});

		act(() => {
			useAuthStore.setState({ tenants: TENANTS, currentTenantId: 'tenant-a' });
		});
		expect(result.current).toBe('admin');
		const afterRoleSet = renderCount;

		// 无关字段变更（permissions）→ selector 结果相同 → 不 re-render
		act(() => {
			useAuthStore.setState({ permissions: ['tenant:user:read'] });
		});
		expect(result.current).toBe('admin');
		expect(renderCount).toBe(afterRoleSet);

		// 相同 role、不同数组引用 → 返回值仍是 string 原语 → 不 re-render
		act(() => {
			useAuthStore.setState({
				tenants: [
					{ id: 'tenant-a', name: 'Tenant A', role: 'admin' },
					{ id: 'tenant-b', name: 'Tenant B', role: 'member' },
				],
			});
		});
		expect(result.current).toBe('admin');
		expect(renderCount).toBe(afterRoleSet);
	});
});
