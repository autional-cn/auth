import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildTenantLoginUrl, fetchTenantSlugByClientId } from '@/lib/oauth-cold-start';

// L7：同意页冷启动解析链（TASK-07 / ADR-04）
// client_id → tenant_id（/oauth/client/{id}）→ 公开租户名单 → slug；
// 任一步失败返回 null，由调用方回退旧交棒链（不抛错、不白屏）。

const mockFetch = vi.fn();

function jsonResponse(payload: unknown, ok = true, status = 200) {
	return { ok, status, json: async () => payload } as any;
}

beforeEach(() => {
	vi.clearAllMocks();
	vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('buildTenantLoginUrl', () => {
	it('组装 <slug>/login?redirect=<authorize URL>（与 EntryRouter 回程同形）', () => {
		const authorizeUrl = '/oauth/api/v1/oauth/authorize?client_id=c1&state=st';
		expect(buildTenantLoginUrl('demo', authorizeUrl)).toBe(
			'/demo/login?redirect=' + encodeURIComponent(authorizeUrl),
		);
	});
});

describe('fetchTenantSlugByClientId', () => {
	it('client → tenantId → 公开名单 → slug（items 契约）', async () => {
		mockFetch
			.mockResolvedValueOnce(jsonResponse({ data: { tenantId: 't1' } }))
			.mockResolvedValueOnce(jsonResponse({ items: [{ id: 't1', name: 'demo' }] }));

		expect(await fetchTenantSlugByClientId('client-1')).toBe('demo');
		expect(String(mockFetch.mock.calls[0][0])).toContain('/oauth/client/client-1');
		expect(String(mockFetch.mock.calls[1][0])).toContain('/tenant/public/tenants');
	});

	it('兼容 snake_case tenant_id / data 字段名单 / slug 名（响应契约三态）', async () => {
		mockFetch
			.mockResolvedValueOnce(jsonResponse({ tenant_id: 't2' }))
			.mockResolvedValueOnce(jsonResponse({ data: [{ id: 't2', slug: 'acme' }] }));

		expect(await fetchTenantSlugByClientId('client-2')).toBe('acme');
	});

	it('client 端点非 2xx → null', async () => {
		mockFetch.mockResolvedValueOnce(jsonResponse({}, false, 404));
		expect(await fetchTenantSlugByClientId('client-x')).toBeNull();
	});

	it('client 无 tenantId → null（不再打名单）', async () => {
		mockFetch.mockResolvedValueOnce(jsonResponse({ data: { clientName: 'App' } }));
		expect(await fetchTenantSlugByClientId('client-x')).toBeNull();
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});

	it('名单端点非 2xx → null（回退旧链，不抛错）', async () => {
		mockFetch
			.mockResolvedValueOnce(jsonResponse({ data: { tenantId: 't1' } }))
			.mockResolvedValueOnce(jsonResponse({}, false, 500));
		expect(await fetchTenantSlugByClientId('client-x')).toBeNull();
	});

	it('名单里没有该 tenantId → null', async () => {
		mockFetch
			.mockResolvedValueOnce(jsonResponse({ data: { tenantId: 't9' } }))
			.mockResolvedValueOnce(jsonResponse({ items: [{ id: 't1', name: 'demo' }] }));
		expect(await fetchTenantSlugByClientId('client-x')).toBeNull();
	});

	it('网络异常 → null（不白屏）', async () => {
		mockFetch.mockRejectedValueOnce(new Error('network down'));
		expect(await fetchTenantSlugByClientId('client-x')).toBeNull();
	});

	it('名单响应非数组 → null', async () => {
		mockFetch
			.mockResolvedValueOnce(jsonResponse({ data: { tenantId: 't1' } }))
			.mockResolvedValueOnce(jsonResponse({ code: 0, message: 'ok' }));
		expect(await fetchTenantSlugByClientId('client-x')).toBeNull();
	});
});
