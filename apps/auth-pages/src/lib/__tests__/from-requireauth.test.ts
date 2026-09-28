import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================================================
// L6③（D8/D9 / ADR-04）：`from_requireauth` 分支的 client_id 解析
//  - 预载缓存（page-init 命名空间 + legacy auth-config:）优先，零请求
//  - 未命中 → 实时回源 `fetchOAuthClientIdBySlug`（与门户侧 RequireAuth 同接口）
//  - 仍无 → null（调用方据此停住 + 停机提示，不发 PKCE、不弹跳）
// ============================================================

const { mockGetPreloaded, mockGetCached, mockFetchBySlug } = vi.hoisted(() => ({
	mockGetPreloaded: vi.fn(),
	mockGetCached: vi.fn(),
	mockFetchBySlug: vi.fn(),
}));

vi.mock('../page-init-cache', async (importOriginal) => ({
	...(await importOriginal<typeof import('../page-init-cache')>()),
	getPreloaded: (...args: any[]) => mockGetPreloaded(...args),
	getCached: (...args: any[]) => mockGetCached(...args),
}));

vi.mock('@autional-cn/shared', () => ({
	fetchOAuthClientIdBySlug: (...args: any[]) => mockFetchBySlug(...args),
}));

import { resolveClientIdForRequireAuth } from '../from-requireauth';

const KEY = 'page-init:auth-config:demo';
const LEGACY_KEY = 'auth-config:demo';

beforeEach(() => {
	vi.clearAllMocks();
	mockGetPreloaded.mockReturnValue(undefined);
	mockGetCached.mockReturnValue(null);
	mockFetchBySlug.mockResolvedValue(null);
});

describe('resolveClientIdForRequireAuth', () => {
	it('预载缓存命中（page-init 键）→ 直接返回，零回源', async () => {
		mockGetPreloaded.mockImplementation((key: string) =>
			key === KEY ? { oauthClientId: 'cid-preloaded' } : undefined,
		);

		expect(await resolveClientIdForRequireAuth('demo')).toBe('cid-preloaded');
		expect(mockGetPreloaded.mock.calls[0][0]).toBe(KEY);
		expect(mockFetchBySlug).not.toHaveBeenCalled();
	});

	it('legacy 键（auth-config:<slug>）预载命中 → 同样零回源', async () => {
		mockGetPreloaded.mockImplementation((key: string) =>
			key === LEGACY_KEY ? { oauth_client_id: 'cid-legacy' } : undefined,
		);

		expect(await resolveClientIdForRequireAuth('demo')).toBe('cid-legacy');
		expect(mockFetchBySlug).not.toHaveBeenCalled();
	});

	it('预载未命中但 getCached 命中 → 用缓存值，不回源', async () => {
		mockGetCached.mockImplementation((key: string) =>
			key === KEY ? { oauthClientId: 'cid-cached' } : null,
		);

		expect(await resolveClientIdForRequireAuth('demo')).toBe('cid-cached');
		expect(mockFetchBySlug).not.toHaveBeenCalled();
	});

	it('缓存里无 client 字段（如仅有 clientName）→ 仍回源，不用半截缓存', async () => {
		mockGetCached.mockImplementation((key: string) => (key === KEY ? { clientName: 'App' } : null));
		mockFetchBySlug.mockResolvedValue('cid-from-slug');

		expect(await resolveClientIdForRequireAuth('demo')).toBe('cid-from-slug');
		expect(mockFetchBySlug).toHaveBeenCalledWith('demo');
	});

	it('两处缓存皆空 → 实时回源 by-slug', async () => {
		mockFetchBySlug.mockResolvedValue('cid-from-slug');

		expect(await resolveClientIdForRequireAuth('demo')).toBe('cid-from-slug');
		expect(mockFetchBySlug).toHaveBeenCalledTimes(1);
		expect(mockFetchBySlug).toHaveBeenCalledWith('demo');
	});

	it('回源仍无（404 / 未回填）→ null（调用方停住 + 提示）', async () => {
		mockFetchBySlug.mockResolvedValue(null);

		expect(await resolveClientIdForRequireAuth('demo')).toBeNull();
	});
});
