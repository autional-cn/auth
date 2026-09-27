import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore, getCurrentRole } from '../store';

// 注：node 测试环境下 zustand persist 中间件会打印一条无害的 storage 降级警告
// （"Unable to update item 'authms-auth-v1'"），这是 store.ts 既有 persist 的
// 标准降级行为，不影响被测的 getCurrentRole 派生逻辑。

const TENANTS = [
	{ id: 'tenant-a', name: 'Tenant A', role: 'admin' },
	{ id: 'tenant-b', name: 'Tenant B', role: 'member' },
];

/**
 * 构造最小 JWT（base64url header.payload.signature）。
 * 仅用于测试「前端不再读取 token 载荷」——getCurrentRole 只读 store，
 * 因此 signature 内容无关紧要。
 */
function buildJwt(payload: Record<string, unknown>): string {
	const enc = (obj: unknown) =>
		btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	return `${enc({ alg: 'none', typ: 'JWT' })}.${enc(payload)}.test-signature`;
}

/** 重置 store 到初始状态，避免跨用例污染 */
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

describe('AC-007 密码/OAuth 双路径行为一致（userinfo-first，角色来自 store）', () => {
	beforeEach(() => {
		resetAuthStore();
	});

	it('密码场景：token 带 custom.role 但前端不读 → 返回 store 角色', () => {
		// 密码登录 token 载荷带 custom.role（旧解析来源），但前端已不再读取
		const passwordToken = buildJwt({
			sub: 'user-1',
			custom: { role: 'super_admin', username: 'pw-user' },
		});

		// 角色真正来源：loadAuthExtras 写入的 store
		useAuthStore.setState({
			accessToken: passwordToken,
			tenants: TENANTS,
			currentTenantId: 'tenant-a',
		});

		// 若前端仍解析 token 会得到 super_admin；正确行为是返回 store 角色 admin
		expect(getCurrentRole()).toBe('admin');
	});

	it('OAuth 场景：token 无 role + 相同 store → 结果与密码场景一致', () => {
		// OAuth/挂载路径 token 载荷无 role（旧解析无角色来源）
		const oauthToken = buildJwt({ sub: 'user-1' });

		useAuthStore.setState({
			accessToken: oauthToken,
			tenants: TENANTS,
			currentTenantId: 'tenant-a',
		});

		expect(getCurrentRole()).toBe('admin');
	});

	it('双路径矩阵：两场景结果相等（store 预填充为唯一角色来源）', () => {
		const passwordToken = buildJwt({
			sub: 'user-1',
			custom: { role: 'super_admin', username: 'pw-user' },
		});
		const oauthToken = buildJwt({ sub: 'user-1' });

		// 相同 store 预填充
		useAuthStore.setState({
			accessToken: passwordToken,
			tenants: TENANTS,
			currentTenantId: 'tenant-a',
		});
		const roleFromPassword = getCurrentRole();

		useAuthStore.setState({
			accessToken: oauthToken,
			tenants: TENANTS,
			currentTenantId: 'tenant-a',
		});
		const roleFromOAuth = getCurrentRole();

		expect(roleFromPassword).toBe(roleFromOAuth);
		expect(roleFromPassword).toBe('admin');
		expect(roleFromOAuth).toBe('admin');
	});

	it('token 携带不同 custom.role 时 store 角色仍胜出（证明零 token 载荷读取）', () => {
		const adminToken = buildJwt({
			sub: 'user-1',
			custom: { role: 'super_admin' },
		});
		const memberToken = buildJwt({
			sub: 'user-1',
			custom: { role: 'member' },
		});

		useAuthStore.setState({
			accessToken: adminToken,
			tenants: TENANTS,
			currentTenantId: 'tenant-a',
		});
		expect(getCurrentRole()).toBe('admin'); // store 角色，非 token 的 super_admin

		useAuthStore.setState({
			accessToken: memberToken,
			tenants: TENANTS,
			currentTenantId: 'tenant-a',
		});
		expect(getCurrentRole()).toBe('admin'); // token role 变化不影响 store 派生
	});
});
