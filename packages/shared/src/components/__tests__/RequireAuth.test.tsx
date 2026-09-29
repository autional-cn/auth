// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';

// ============================================================
// L6（D9 / ADR-04）：RequireAuth 的未登录出口
//  - 能解析出 OAuth client → 起 PKCE（initiateOAuthLogin）
//  - 不能解析 → 跳 auth 登录页，且**必须**带 from_requireauth=1
//    （与 service.ts onUnauthorized 同口径：auth 侧先做会话复检，避免重登一次）
// ============================================================

const { mockState } = vi.hoisted(() => ({
	mockState: {
		machineStatus: 'unauthenticated' as string,
		tenantRoute: {
			slug: null as string | null,
			tenantId: null as string | null,
			oauthClientId: null as string | null,
			loading: false,
			notFound: true,
			unknownSlug: false,
		},
		token: null as string | null,
		replace: vi.fn(),
		initiate: vi.fn(),
		setBootstrapLock: vi.fn(),
	},
}));

vi.mock('../../auth/auth-machine', () => ({
	useAuthMachine: () => ({ status: mockState.machineStatus }),
}));

vi.mock('../../auth/tenant-route-middleware', async (importOriginal) => ({
	...(await importOriginal<typeof import('../../auth/tenant-route-middleware')>()),
	useTenantRoute: () => mockState.tenantRoute,
}));

vi.mock('../../auth/oauth-login', () => ({
	initiateOAuthLogin: (...args: any[]) => mockState.initiate(...args),
}));

vi.mock('../../auth/service', () => ({
	AuthService: {
		getAccessToken: () => mockState.token,
		getCurrentRole: () => null,
		getPermissions: () => [],
	},
	setBootstrapLock: (...args: any[]) => mockState.setBootstrapLock(...args),
}));

import { RequireAuth } from '../RequireAuth';
import { getPortalUrl } from '../../config';

const originalWindowLocation = window.location;

beforeEach(() => {
	vi.clearAllMocks();
	mockState.machineStatus = 'unauthenticated';
	mockState.tenantRoute = {
		slug: null,
		tenantId: null,
		oauthClientId: null,
		loading: false,
		notFound: true,
		unknownSlug: false,
	};
	mockState.token = null;
	delete (window as any).__APP_CONFIG__;

	delete (window as any).location;
	(window as any).location = Object.defineProperties(
		{},
		{
			...Object.getOwnPropertyDescriptors(originalWindowLocation),
			replace: { get: () => mockState.replace },
		},
	);
});

afterEach(() => {
	if (window.location !== originalWindowLocation) {
		Object.defineProperty(window, 'location', { value: originalWindowLocation, writable: true });
	}
	// vitest globals 未开启 ⇒ RTL 不会自动 cleanup，手动清理防跨用例 DOM 污染
	cleanup();
});

describe('RequireAuth 未登录出口', () => {
	it('无可用 client_id → 跳 auth 登录页并带 from_requireauth=1', async () => {
		render(
			<RequireAuth>
				<div>protected</div>
			</RequireAuth>,
		);

		await waitFor(() => {
			expect(mockState.replace).toHaveBeenCalled();
		});
		const url = String(mockState.replace.mock.calls[0][0]);
		expect(url).toContain('from_requireauth=1');
		expect(url).toContain('redirect=');
		expect(url.startsWith(getPortalUrl('auth'))).toBe(true);
		expect(mockState.initiate).not.toHaveBeenCalled();
	});

	it('slug 解析出 client_id → 发起 PKCE，不做登录页跳转', async () => {
		mockState.tenantRoute = {
			slug: 'demo',
			tenantId: 't1',
			oauthClientId: 'cid-from-slug',
			loading: false,
			notFound: false,
			unknownSlug: false,
		};

		render(
			<RequireAuth>
				<div>protected</div>
			</RequireAuth>,
		);

		await waitFor(() => {
			expect(mockState.initiate).toHaveBeenCalledWith('cid-from-slug');
		});
		expect(mockState.replace).not.toHaveBeenCalled();
	});

	it('env 兜底 client_id（__APP_CONFIG__）→ 同样发起 PKCE', async () => {
		(window as any).__APP_CONFIG__ = { VITE_OAUTH_CLIENT_ID: 'cid-from-env' };

		render(
			<RequireAuth>
				<div>protected</div>
			</RequireAuth>,
		);

		await waitFor(() => {
			expect(mockState.initiate).toHaveBeenCalledWith('cid-from-env');
		});
		expect(mockState.replace).not.toHaveBeenCalled();
	});

	it('无 token + env client_id → 上 bootstrap 锁（抑制 401 抢跑）', async () => {
		(window as any).__APP_CONFIG__ = { VITE_OAUTH_CLIENT_ID: 'cid-from-env' };

		render(
			<RequireAuth>
				<div>protected</div>
			</RequireAuth>,
		);

		await waitFor(() => {
			expect(mockState.setBootstrapLock).toHaveBeenCalledWith(true);
		});
	});
});

// ============================================================
// F-W6 闸门（verification-W5-patch §6）：未知 slug 死链 × auth 域有会话
// 曾构成无限整页往返（门户 → buildLoginUrl → auth 回跳 redirect → 门户 → …）。
// 修法：by-slug 确定性 404（unknownSlug）且本站未配 env client → 本地 404，不弹跳。
// 约束：网络错误/5xx 不置 unknownSlug（fail-open 仍走漏斗）；env client 站点不触发。
// ============================================================
describe('RequireAuth F-W6 确定性 404 闸门', () => {
	it('unknownSlug + 无 env client → 不发弹跳、渲染注入的 404', async () => {
		mockState.tenantRoute = {
			slug: null,
			tenantId: null,
			oauthClientId: null,
			loading: false,
			notFound: true,
			unknownSlug: true,
		};

		render(
			<RequireAuth notFound={<div data-testid="tenant-404">no such tenant</div>}>
				<div>protected</div>
			</RequireAuth>,
		);

		await waitFor(() => expect(screen.getByTestId('tenant-404')).toBeInTheDocument());
		expect(mockState.replace).not.toHaveBeenCalled();
		expect(mockState.initiate).not.toHaveBeenCalled();
		expect(screen.queryByText('protected')).toBeNull();
	});

	it('unknownSlug + 无 notFound 注入 → 渲染内置极简 404（不空白）', async () => {
		mockState.tenantRoute = {
			slug: null,
			tenantId: null,
			oauthClientId: null,
			loading: false,
			notFound: true,
			unknownSlug: true,
		};

		render(
			<RequireAuth>
				<div>protected</div>
			</RequireAuth>,
		);

		await waitFor(() => expect(screen.getByText('404')).toBeInTheDocument());
		expect(mockState.replace).not.toHaveBeenCalled();
	});

	it('unknownSlug + env client（admin-console 旁路）→ 闸门不生效，仍走 PKCE', async () => {
		(window as any).__APP_CONFIG__ = { VITE_OAUTH_CLIENT_ID: 'cid-from-env' };
		mockState.tenantRoute = {
			slug: null,
			tenantId: null,
			oauthClientId: null,
			loading: false,
			notFound: true,
			unknownSlug: true,
		};

		render(
			<RequireAuth notFound={<div data-testid="tenant-404">no such tenant</div>}>
				<div>protected</div>
			</RequireAuth>,
		);

		await waitFor(() => expect(mockState.initiate).toHaveBeenCalledWith('cid-from-env'));
		expect(screen.queryByTestId('tenant-404')).toBeNull();
		expect(mockState.replace).not.toHaveBeenCalled();
	});

	it('非 unknownSlug（网络错误 fail-open）→ 维持原漏斗（回归锁）', async () => {
		// 默认 tenantRoute: notFound=true, unknownSlug=false —— 即 by-slug 网络错误场景
		render(
			<RequireAuth notFound={<div data-testid="tenant-404">no such tenant</div>}>
				<div>protected</div>
			</RequireAuth>,
		);

		await waitFor(() => expect(mockState.replace).toHaveBeenCalled());
		const url = String(mockState.replace.mock.calls[0][0]);
		expect(url).toContain('from_requireauth=1');
		expect(screen.queryByTestId('tenant-404')).toBeNull();
	});
});
