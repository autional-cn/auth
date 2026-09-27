import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore, getCurrentRole } from '../store';

// 注：node 测试环境下 zustand persist 中间件会打印一条无害的 storage 降级警告
// （"Unable to update item 'authms-auth-v1'"），这是 store.ts 既有 persist 的
// 标准降级行为，不影响被测的 getCurrentRole 派生逻辑。

const TENANTS = [
	{ id: 'tenant-a', name: 'Tenant A', role: 'admin' },
	{ id: 'tenant-b', name: 'Tenant B', role: 'member' },
];

/** 重置 store 到初始状态，避免跨用例污染（AC-002 约定） */
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
}

describe('getCurrentRole (AC-001 四态派生，userinfo-first)', () => {
	beforeEach(() => {
		resetAuthStore();
	});

	it('① tenants 空 → null', () => {
		useAuthStore.setState({ tenants: [], currentTenantId: 'tenant-a' });
		expect(getCurrentRole()).toBeNull();
	});

	it('② currentTenantId null → null（不猜测）', () => {
		useAuthStore.setState({ tenants: TENANTS, currentTenantId: null });
		expect(getCurrentRole()).toBeNull();
	});

	it('③ 命中 → tenants.find(t => t.id === currentTenantId).role', () => {
		useAuthStore.setState({ tenants: TENANTS, currentTenantId: 'tenant-a' });
		expect(getCurrentRole()).toBe('admin');

		useAuthStore.setState({ currentTenantId: 'tenant-b' });
		expect(getCurrentRole()).toBe('member');
	});

	it('④ 租户切换后重查返回新角色（switchTenant）', () => {
		useAuthStore.setState({ tenants: TENANTS, currentTenantId: 'tenant-a' });
		expect(getCurrentRole()).toBe('admin');

		useAuthStore.getState().switchTenant('tenant-b');
		expect(getCurrentRole()).toBe('member');
	});

	it('currentTenantId 指向不存在的租户 → null（不猜测）', () => {
		useAuthStore.setState({ tenants: TENANTS, currentTenantId: 'tenant-ghost' });
		expect(getCurrentRole()).toBeNull();
	});
});
