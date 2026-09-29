import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// 实现已并入 @autional-cn/shared/branding：被测的是 auth 的薄封装
// AuthBrandingInitializer，共享组件与共享 store 都走真实实现——断言直接读 store，
// 不去打桩 setBranding。理由：打桩拦不住「组件根本没接线」这类错，读状态可以。
// 而且走子路径而不是桶入口：桶入口会把整个应用层（api client / react-query / i18n…）
// 拖进这个测试，也为别处 20 个桶 mock 所不容。
vi.mock('@/hooks/use-tenant-auth-config', () => ({
	useTenantAuthConfigBySlug: vi.fn(),
}));

import { AuthBrandingInitializer } from '@/components/auth/AuthBrandingInitializer';
import { useTenantAuthConfigBySlug } from '@/hooks/use-tenant-auth-config';
import { useTenantBrandingStore } from '@autional-cn/shared/branding';

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: false } },
});

const branding = () => useTenantBrandingStore.getState().branding;

/**
 * Pre-populate the branding query cache so useQuery returns data immediately
 * without initiating a real fetch.
 */
function seedBrandingCache(slug: string, data: unknown) {
	queryClient.setQueryData(['tenant-branding', slug], data);
}

function renderWithRouter(path: string) {
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={[path]}>
				<AuthBrandingInitializer />
			</MemoryRouter>
		</QueryClientProvider>,
	);
}

describe('AuthBrandingInitializer', () => {
	beforeEach(() => {
		useTenantBrandingStore.setState({ branding: null });
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({ data: null } as never);
		queryClient.clear();
	});

	it('slug=Default → tenant-service branding wins over auth-config', async () => {
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({
			data: {
				tenantName: 'Default',
				tenantSlug: 'Default',
				branding: { primaryColor: '#1890ff', companyName: 'From Auth' },
			},
		} as never);
		// Pre-populate branding query with tenant-service data → higher priority
		seedBrandingCache('Default', {
			primaryColor: '#003153',
			companyName: 'From Tenant Svc',
			logoUrl: '',
			faviconUrl: '',
			customCss: '',
		});

		renderWithRouter('/Default/login');

		await waitFor(() => {
			expect(branding()?.primaryColor).toBe('#003153'); // tenant-service wins
		});
		expect(branding()?.companyName).toBe('From Tenant Svc');
	});

	it('无租户上下文（裸路由）→ 品牌清空', async () => {
		renderWithRouter('/login');

		await waitFor(() => {
			expect(branding()).toBeNull();
		});
	});

	it('keyword in segments → slug 仍正确解析', async () => {
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({
			data: { tenantName: 'Custom', tenantSlug: 'Custom', branding: { primaryColor: '#f00' } },
		} as never);
		seedBrandingCache('Custom', {
			primaryColor: '#f00',
			logoUrl: '',
			faviconUrl: '',
			customCss: '',
		});

		renderWithRouter('/Custom/mfa-challenge');

		await waitFor(() => {
			expect(branding()?.primaryColor).toBe('#f00');
		});
	});

	it('两个来源都没有品牌数据时不写 store（回落 tokens 缺省）', async () => {
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({
			data: { tenantName: 'Bare', tenantSlug: 'Bare', branding: null },
		} as never);

		renderWithRouter('/Bare/login');

		// 共享实现的语义：拿不到品牌就保持 store 为 null，由 useBranding 回落 tokens 缺省。
		// 旧实现会写入一个 primaryColor:'' 的空对象——视觉结果相同（都清掉注入的品牌变量），
		// 但「写了空对象」和「没写过」对下游是两个不同的状态，这里按新语义断言。
		await new Promise((r) => setTimeout(r, 60));
		expect(branding()).toBeNull();
	});

	// ── AC-011 不回归：primaryColorDark 预留字段 ──
	// 注意：seedBrandingCache 的数据直接进 query cache，不经过 extractBranding。
	// snake/camel 提取断言必须走 extractBranding 路径 → 用 useTenantAuthConfigBySlug mock
	// 提供 branding 且不 seed cache（query 无数据）→ fallback 走 extractBranding。

	it('primaryColorDark 缺失时不回归（tenant-service 数据不含该字段）', async () => {
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({
			data: {
				tenantName: 'Default',
				tenantSlug: 'Default',
				branding: { primaryColor: '#1890ff', companyName: 'From Auth' },
			},
		} as never);
		seedBrandingCache('Default', {
			primaryColor: '#003153',
			companyName: 'From Tenant Svc',
			logoUrl: '',
			faviconUrl: '',
			customCss: '',
		});

		renderWithRouter('/Default/login');

		await waitFor(() => {
			expect(branding()?.primaryColor).toBe('#003153');
		});
		// 实现语义: primaryColorDark: r.primary_color_dark || r.primaryColorDark || undefined
		expect(branding()?.primaryColorDark).toBeUndefined();
	});

	it('snake_case primary_color_dark 正确提取为 camelCase（extractBranding 路径）', async () => {
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({
			data: {
				tenantName: 'T',
				tenantSlug: 'T',
				branding: { primaryColor: '#003153', primary_color_dark: '#123456' },
			},
		} as never);

		renderWithRouter('/T/login');

		await waitFor(() => {
			expect(branding()?.primaryColor).toBe('#003153');
		});
		expect(branding()?.primaryColorDark).toBe('#123456');
	});

	it('camelCase primaryColorDark 正确提取（extractBranding 路径）', async () => {
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({
			data: {
				tenantName: 'C',
				tenantSlug: 'C',
				branding: { primaryColor: '#003153', primaryColorDark: '#654321' },
			},
		} as never);

		renderWithRouter('/C/login');

		await waitFor(() => {
			expect(branding()?.primaryColor).toBe('#003153');
		});
		expect(branding()?.primaryColorDark).toBe('#654321');
	});
});
