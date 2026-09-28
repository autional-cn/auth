// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';

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
