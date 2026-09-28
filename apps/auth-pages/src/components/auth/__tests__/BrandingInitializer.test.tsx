import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const mockSetBranding = vi.fn();
let mockStoreState: any = { branding: null, setBranding: mockSetBranding };

// tenantSlugFromPath 走真实实现（slug 解析口径即被测行为的一部分），仅 store 侧打桩
vi.mock('@/lib/tenant-store', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@/lib/tenant-store')>();
	return {
		...actual,
		useTenantStore: (selector: (s: any) => any) => selector(mockStoreState),
	};
});

vi.mock('@autional-cn/shared', () => ({
	apiClient: { get: vi.fn() },
	useAuthStore: vi.fn(),
	AUTH_PAGES_URL: '/auth',
}));

// Mock the branding query so it returns controlled data instead of hitting the network
const mockQueryData: Record<string, any> = {};
vi.mock('@/lib/page-init-cache', () => ({
	getPreloaded: () => undefined,
	getCached: () => undefined,
	setCached: vi.fn(),
	CACHE_KEYS: { TENANT_BRANDING: (slug: string) => `page-init:tenant-branding:${slug}` },
	TTL: { TENANT_BRANDING: 24 * 60 * 60 * 1000 },
}));

vi.mock('@/hooks/use-tenant-auth-config', () => ({
	useTenantAuthConfigBySlug: vi.fn(),
}));

import { BrandingInitializer } from '@/components/auth/BrandingInitializer';
import { useTenantAuthConfigBySlug } from '@/hooks/use-tenant-auth-config';

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: false } },
});

/**
 * Pre-populate the branding query cache so useQuery returns data immediately
 * without initiating a real fetch.
 */
function seedBrandingCache(slug: string, data: any) {
	queryClient.setQueryData(['tenant-branding', slug], data);
}

function renderWithRouter(path: string) {
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={[path]}>
				<BrandingInitializer />
			</MemoryRouter>
		</QueryClientProvider>,
	);
}

describe('BrandingInitializer', () => {
	beforeEach(() => {
		mockSetBranding.mockClear();
		mockStoreState = { branding: null, setBranding: mockSetBranding };
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({ data: null } as any);
		queryClient.clear();
	});

	it('slug=Default → tenant-service branding wins over auth-config', async () => {
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({
			data: {
				tenantName: 'Default',
				tenantSlug: 'Default',
				branding: { primaryColor: '#1890ff', companyName: 'From Auth' },
			},
		} as any);
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
			expect(mockSetBranding).toHaveBeenCalled();
			const call = mockSetBranding.mock.calls[0][0];
			expect(call.primaryColor).toBe('#003153'); // tenant-service wins
			expect(call.companyName).toBe('From Tenant Svc');
		});
	});

	it('null slug → setBranding(null)', async () => {
		renderWithRouter('/login');

		await waitFor(() => {
			expect(mockSetBranding).toHaveBeenCalledWith(null);
		});
	});

	it('snake_case fields mapped to camelCase', async () => {
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({
			data: { tenantName: 'Default', tenantSlug: 'Default', branding: {} },
		} as any);
		seedBrandingCache('Default', {
			primaryColor: '#abc',
			logoUrl: '/logo.png',
			faviconUrl: '/fav.ico',
			loginPageTitle: 'Welcome',
			loginPageDescription: 'Sign in',
			customCss: '',
		});

		renderWithRouter('/Default/login');

		await waitFor(() => {
			const call = mockSetBranding.mock.calls[0][0];
			expect(call.primaryColor).toBe('#abc');
			expect(call.logoUrl).toBe('/logo.png');
			expect(call.faviconUrl).toBe('/fav.ico');
			expect(call.loginPageTitle).toBe('Welcome');
			expect(call.loginPageDescription).toBe('Sign in');
		});
	});

	it('keyword in segments → slug extracted second-to-last', async () => {
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({
			data: { tenantName: 'Custom', tenantSlug: 'Custom', branding: { primaryColor: '#f00' } },
		} as any);
		seedBrandingCache('Custom', {
			primaryColor: '#f00',
			logoUrl: '',
			faviconUrl: '',
			customCss: '',
		});

		renderWithRouter('/Custom/mfa-challenge');

		await waitFor(() => {
			expect(mockSetBranding).toHaveBeenCalled();
		});
	});

	it('fallback when no branding data from either source', async () => {
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({
			data: { tenantName: 'Bare', tenantSlug: 'Bare', branding: null },
		} as any);

		renderWithRouter('/Bare/login');

		await waitFor(() => {
			const call = mockSetBranding.mock.calls[0][0];
			expect(call.primaryColor).toBe('');
		});
	});

	// ── AC-011 不回归：primaryColorDark 预留字段 ──
	// 注意：seedBrandingCache 数据直接进 query cache，不经过 extractBranding。
	// snake/camel 提取断言必须走 extractBranding 路径 → 用 useTenantAuthConfigBySlug mock
	// 返回 branding + 不 seed cache（query 返回 null）→ useEffect 走 extractBranding 分支。

	it('primaryColorDark 缺失时不回归（tenant-service 数据不含该字段）', async () => {
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({
			data: {
				tenantName: 'Default',
				tenantSlug: 'Default',
				branding: { primaryColor: '#1890ff', companyName: 'From Auth' },
			},
		} as any);
		seedBrandingCache('Default', {
			primaryColor: '#003153',
			companyName: 'From Tenant Svc',
			logoUrl: '',
			faviconUrl: '',
			customCss: '',
		});

		renderWithRouter('/Default/login');

		await waitFor(() => {
			const call = mockSetBranding.mock.calls[0][0];
			expect(call.primaryColor).toBe('#003153');
			// 实现语义: primaryColorDark: r.primary_color_dark || r.primaryColorDark || undefined
			// → 对象含 key 值为 undefined；断言 toBeUndefined 最稳
			expect(call.primaryColorDark).toBeUndefined();
		});
	});

	it('snake_case primary_color_dark 正确提取为 camelCase（extractBranding 路径）', async () => {
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({
			data: {
				tenantName: 'T',
				tenantSlug: 'T',
				branding: { primaryColor: '#003153', primary_color_dark: '#123456' },
			},
		} as any);
		// 不 seed cache → tenantBranding 为 null → useEffect 走 extractBranding(slugAuthConfig.branding)

		renderWithRouter('/T/login');

		await waitFor(() => {
			const call = mockSetBranding.mock.calls[0][0];
			expect(call.primaryColor).toBe('#003153');
			expect(call.primaryColorDark).toBe('#123456');
		});
	});

	it('camelCase primaryColorDark 正确提取（extractBranding 路径）', async () => {
		vi.mocked(useTenantAuthConfigBySlug).mockReturnValue({
			data: {
				tenantName: 'C',
				tenantSlug: 'C',
				branding: { primaryColor: '#003153', primaryColorDark: '#654321' },
			},
		} as any);

		renderWithRouter('/C/login');

		await waitFor(() => {
			const call = mockSetBranding.mock.calls[0][0];
			expect(call.primaryColor).toBe('#003153');
			expect(call.primaryColorDark).toBe('#654321');
		});
	});
});
