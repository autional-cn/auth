// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, cleanup, waitFor } from '@testing-library/react';

// ============================================================
// F-W6 判别依据：按 slug 拉取公开 auth-config 的三态
//  - ok（2xx）
//  - unknown-slug（**HTTP 404**，租户确定性不存在）→ 门户侧闸门判死
//  - error（网络/5xx/解析失败）→ 必须 fail-open（not-found，仍走登录漏斗）
// 契约来源：identity public_handler.go GetTenantAuthConfigBySlug ——
//  租户不存在 → 404 ErrCodeNotFound；已知租户未配 client → 200（client 空）。
// ============================================================

import {
	useOAuthClientIdFromUrl,
	fetchOAuthClientIdBySlug,
} from '../oauth-client-from-slug';

function setPath(path: string) {
	window.history.pushState({}, '', path);
}

function stubFetch(ok: boolean, status: number, body?: unknown) {
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue({
			ok,
			status,
			json: async () => body,
		}),
	);
}

beforeEach(() => {
	setPath('/acme');
	delete (window as any).__APP_CONFIG__;
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

describe('useOAuthClientIdFromUrl（三态判别）', () => {
	it('HTTP 404 → unknown-slug（确定性不存在，带 slug）', async () => {
		stubFetch(false, 404);
		const { result } = renderHook(() => useOAuthClientIdFromUrl());

		await waitFor(() => expect(result.current.status).toBe('unknown-slug'));
		expect(result.current).toMatchObject({ status: 'unknown-slug', slug: 'acme' });
		expect(fetch).toHaveBeenCalledWith(expect.stringContaining('by-slug/acme'));
	});

	it('HTTP 500 → not-found（fail-open，不得判死；回归锁）', async () => {
		stubFetch(false, 500);
		const { result } = renderHook(() => useOAuthClientIdFromUrl());

		await waitFor(() => expect(result.current.status).toBe('not-found'));
	});

	it('网络异常 → not-found（fail-open）', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
		const { result } = renderHook(() => useOAuthClientIdFromUrl());

		await waitFor(() => expect(result.current.status).toBe('not-found'));
	});

	it('200 + data.oauthClientId（camel）→ resolved', async () => {
		stubFetch(true, 200, { data: { oauthClientId: 'cid-1', tenantId: 't1' } });
		const { result } = renderHook(() => useOAuthClientIdFromUrl());

		await waitFor(() => expect(result.current.status).toBe('resolved'));
		expect(result.current).toMatchObject({
			status: 'resolved',
			slug: 'acme',
			clientId: 'cid-1',
			config: { tenantId: 't1' },
		});
	});

	it('200 + 扁平 oauth_client_id（snake）→ resolved', async () => {
		stubFetch(true, 200, { oauth_client_id: 'cid-snake' });
		const { result } = renderHook(() => useOAuthClientIdFromUrl());

		await waitFor(() => expect(result.current.status).toBe('resolved'));
		expect(result.current).toMatchObject({ status: 'resolved', clientId: 'cid-snake' });
	});

	it('200 但无 client（已知租户未配）→ not-found（不误判 unknown-slug）', async () => {
		stubFetch(true, 200, { data: { tenantId: 't1' } });
		const { result } = renderHook(() => useOAuthClientIdFromUrl());

		await waitFor(() => expect(result.current.status).toBe('not-found'));
	});

	it('根路径无 slug → not-found 且不发请求', async () => {
		setPath('/');
		stubFetch(true, 200, { data: { oauthClientId: 'cid-1' } });
		const { result } = renderHook(() => useOAuthClientIdFromUrl());

		await waitFor(() => expect(result.current.status).toBe('not-found'));
		expect(fetch).not.toHaveBeenCalled();
	});

	it('env 固定 client（admin-console 旁路）→ not-found 且不发请求', async () => {
		setPath('/users');
		(window as any).__APP_CONFIG__ = { VITE_OAUTH_CLIENT_ID: 'cid-env' };
		stubFetch(true, 200, { data: { oauthClientId: 'cid-1' } });
		const { result } = renderHook(() => useOAuthClientIdFromUrl());

		await waitFor(() => expect(result.current.status).toBe('not-found'));
		expect(fetch).not.toHaveBeenCalled();
	});
});

describe('fetchOAuthClientIdBySlug（非 hook 版本，登录页回源）', () => {
	it('200 + client → 返回 clientId', async () => {
		stubFetch(true, 200, { data: { oauthClientId: 'cid-1' } });
		await expect(fetchOAuthClientIdBySlug('acme')).resolves.toBe('cid-1');
	});

	it('404 → null', async () => {
		stubFetch(false, 404);
		await expect(fetchOAuthClientIdBySlug('acme')).resolves.toBeNull();
	});

	it('网络异常 → null', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
		await expect(fetchOAuthClientIdBySlug('acme')).resolves.toBeNull();
	});
});
