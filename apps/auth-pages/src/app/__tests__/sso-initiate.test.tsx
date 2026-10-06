import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import SSOInitiatePage from '../sso/initiate/page';

// setup.ts 全局把 slug hooks 桩为 undefined（chrome 安全默认）；本文件测的正是
// AUTH-50① 的真实解析（useParams + 名单校验），覆盖回真实实现。
vi.mock('@/hooks/use-tenant-slug', async (importOriginal) =>
	await importOriginal<typeof import('@/hooks/use-tenant-slug')>(),
);

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

vi.mock('@/lib/i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		lang: 'zh-CN',
	}),
}));

// AUTH-50①：生效 slug 经 useEffectiveTenantSlug（useParams + 公开名单 + 会话回落）解析——
// 不再 mock react-router 的 useParams（mock 会绕过真实路由，脏 slug/无 param 全测不出）。
vi.mock('@autional/shared', async () => {
	const actual =
		await vi.importActual<typeof import('@autional/shared')>('@autional/shared');
	return {
		...actual,
		usePublicTenantSlugs: () => ({ data: [{ name: 'my-org' }, { name: 'custom' }] }),
		useAuthStore: (selector: any) => selector({ currentTenantId: null }),
	};
});

const mockInitiateSSO = vi.fn();
vi.mock('@/lib/api.generated', () => ({
	initiateSSO: (...args: any[]) => mockInitiateSSO(...args),
}));

const mockUseTenantAuthConfigBySlug = vi.fn(() => ({ data: null, isLoading: false }));

vi.mock('@/hooks/use-tenant-auth-config', () => ({
	useTenantAuthConfigBySlug: (...args: any[]) =>
		(mockUseTenantAuthConfigBySlug as any)(...args),
	useTenantAuthConfig: () => ({ data: null, isLoading: false }),
}));

function renderSSO(route = '/my-org/sso/initiate') {
	return render(
		<MemoryRouter initialEntries={[route]}>
			<Routes>
				<Route path="/:tenantSlug/sso/initiate" element={<SSOInitiatePage />} />
				<Route path="/sso/initiate" element={<SSOInitiatePage />} />
			</Routes>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockUseTenantAuthConfigBySlug.mockReturnValue({ data: null, isLoading: false });
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('SSOInitiatePage', () => {
	it('renders preset provider buttons', () => {
		renderSSO();
		expect(screen.getByText('Okta')).toBeInTheDocument();
		expect(screen.getByText('Azure AD')).toBeInTheDocument();
		expect(screen.getByText('OneLogin')).toBeInTheDocument();
		expect(screen.getByText('Google Workspace')).toBeInTheDocument();
	});

	it('AUTH-50① 真实路由 slug 传给 authConfig hook', () => {
		renderSSO('/my-org/sso/initiate');
		expect(mockUseTenantAuthConfigBySlug).toHaveBeenCalledWith('my-org');
	});

	it('AUTH-50① 脏 slug（不在公开名单）→ null 上下文，不当作有效租户', () => {
		renderSSO('/dirty-slug/sso/initiate');
		expect(mockUseTenantAuthConfigBySlug).toHaveBeenCalledWith(null);
	});

	it('AUTH-50④ 硬编码文案已入 i18n（「或」→ sso.or / placeholder → sso.domainPlaceholder）', () => {
		renderSSO();
		expect(screen.getByText('sso.or')).toBeInTheDocument();
		expect(screen.queryByText('或')).toBeNull();
		expect(screen.getByPlaceholderText('sso.domainPlaceholder')).toBeInTheDocument();
	});

	it('AUTH-50② provider click → initiateSSO；payload 直给 authUrl → 整页跳转', async () => {
		mockInitiateSSO.mockResolvedValue({ authUrl: 'https://okta.example.com/sso' });

		const hrefSetter = vi.fn();
		const originalLocation = window.location;
		delete (window as any).location;
		(window as any).location = Object.defineProperties(
			{},
			{
				...Object.getOwnPropertyDescriptors(originalLocation),
				href: { get: () => 'http://localhost/my-org/sso/initiate', set: hrefSetter },
			},
		);
		try {
			const user = userEvent.setup();
			renderSSO();
			await user.click(screen.getByText('Okta'));

			await waitFor(() => {
				expect(mockInitiateSSO).toHaveBeenCalledWith({ provider: 'okta' });
				expect(hrefSetter).toHaveBeenCalledWith('https://okta.example.com/sso');
			});
			expect(screen.queryByText('sso.noRedirectUrl')).toBeNull();
		} finally {
			Object.defineProperty(window, 'location', { value: originalLocation, writable: true });
		}
	});

	it('AUTH-50② 响应缺 authUrl → 本地化提示（不直出硬编码中文）', async () => {
		mockInitiateSSO.mockResolvedValue({});
		const user = userEvent.setup();
		renderSSO();
		await user.click(screen.getByText('Okta'));

		expect(await screen.findByText('sso.noRedirectUrl')).toBeInTheDocument();
	});

	it('AUTH-50③ 错误体带 i18n_key → 按本地化键渲染，原始英文不落屏', async () => {
		mockInitiateSSO.mockRejectedValue({
			response: {
				data: {
					code: 'SSO_001',
					message: 'raw provider english message',
					i18n_key: 'error.sso_provider_not_configured',
				},
			},
		});
		const user = userEvent.setup();
		renderSSO();
		await user.click(screen.getByText('Okta'));

		expect(await screen.findByText('error.sso_provider_not_configured')).toBeInTheDocument();
		expect(screen.queryByText('raw provider english message')).toBeNull();
	});

	it('AUTH-50③ 无 i18n_key → 回落归一化消息（键链 message→title→detail）', async () => {
		mockInitiateSSO.mockRejectedValue({
			response: { data: { title: 'problem title fallback' } },
		});
		const user = userEvent.setup();
		renderSSO();
		await user.click(screen.getByText('Okta'));

		expect(await screen.findByText('problem title fallback')).toBeInTheDocument();
	});

	it('submits domain and calls initiateSSO', async () => {
		mockInitiateSSO.mockResolvedValue({});
		const user = userEvent.setup();
		renderSSO();
		await user.type(screen.getByPlaceholderText('sso.domainPlaceholder'), 'myorg.com');
		await user.click(screen.getByRole('button', { name: 'sso.continue' }));

		await waitFor(() => {
			expect(mockInitiateSSO).toHaveBeenCalledWith({ provider: 'myorg.com' });
		});
	});

	it('does not call initiateSSO for empty domain', async () => {
		const user = userEvent.setup();
		renderSSO();
		await user.click(screen.getByRole('button', { name: 'sso.continue' }));
		expect(mockInitiateSSO).not.toHaveBeenCalled();
	});

	it('renders dynamic providers when tenant config has ssoProviders', () => {
		mockUseTenantAuthConfigBySlug.mockReturnValue({
			data: {
				ssoProviders: [
					{ id: 'okta', name: 'My Org Okta' },
					{ id: 'azuread', name: 'Company Azure AD' },
				],
				tenantId: 't1',
				tenantSlug: 'my-org',
				tenantName: 'My Org',
			} as any,
			isLoading: false,
		});
		renderSSO('/my-org/sso/initiate');
		expect(screen.getByText('My Org Okta')).toBeInTheDocument();
		expect(screen.getByText('Company Azure AD')).toBeInTheDocument();
		expect(screen.queryByText('OneLogin')).not.toBeInTheDocument();
	});

	it('renders unknown provider with fallback icon', () => {
		mockUseTenantAuthConfigBySlug.mockReturnValue({
			data: {
				ssoProviders: [{ id: 'custom_idp', name: 'Custom IDP' }],
				tenantId: 't1',
				tenantSlug: 'custom',
				tenantName: 'Custom',
			} as any,
			isLoading: false,
		});
		renderSSO('/custom/sso/initiate');
		expect(screen.getByText('Custom IDP')).toBeInTheDocument();
		expect(screen.getByText('🔗')).toBeInTheDocument();
	});
});
