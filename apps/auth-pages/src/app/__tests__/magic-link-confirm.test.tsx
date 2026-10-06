// ============================================================
// AUTH-26：magic-link 结果页 = 后端 302 流唯一落点——
//   ① 成功：fragment 携 token 对 → JWT 兜底建 user → loginWithTokens
//      → anchorSessionFromToken → 剥 fragment → 水合身份 → 按角色/租户落点
//   ② 失败：?error=<码> → 专属文案（未知码回落通用文案），不发会话
//   ③ 一次性消费：StrictMode 双执行不得复读空 fragment 翻成误报错
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StrictMode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MagicLinkConfirmPage from '../magic-link/confirm/page';

const { mockState } = vi.hoisted(() => ({
	mockState: {
		navigate: vi.fn(),
		searchParams: new URLSearchParams(),
		knownTenants: [] as Array<{ id?: string; name?: string }>,
		role: null as string | null,
		dashboardSlug: null as string | null,
		loginWithTokens: vi.fn(),
		decodeJwtPayload: vi.fn(),
		anchor: vi.fn(),
		loadAuthExtras: vi.fn(),
		updateUser: vi.fn(),
		authMe: vi.fn(),
	},
}));

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockState.navigate,
		useSearchParams: () => [mockState.searchParams, vi.fn()],
		useParams: () => ({}),
	};
});

vi.mock('@autional/shared', () => ({
	loginWithTokens: (...args: any[]) => mockState.loginWithTokens(...args),
	decodeJwtPayload: (...args: any[]) => mockState.decodeJwtPayload(...args),
	getCurrentRole: () => mockState.role,
	crossAppUrl: (url: string) => url,
	AuthService: { updateUser: (...args: any[]) => mockState.updateUser(...args) },
	ADMIN_CONSOLE_URL: () => 'https://admin.example.test',
	SECURITY_DASHBOARD_URL: () => 'https://security.example.test',
	usePublicTenantSlugs: () => ({ data: mockState.knownTenants, isSuccess: true }),
}));

vi.mock('@autional/shared/generated/api', () => ({
	authMe: (...args: any[]) => mockState.authMe(...args),
}));

vi.mock('@/lib/api', () => ({
	loadAuthExtras: (...args: any[]) => mockState.loadAuthExtras(...args),
}));

vi.mock('@/lib/anchor-session', () => ({
	anchorSessionFromToken: (...args: any[]) => mockState.anchor(...args),
}));

vi.mock('@/lib/dashboard-slug', () => ({
	getDashboardSlug: () => mockState.dashboardSlug,
}));

vi.mock('@/lib/i18n', () => ({
	useI18n: () => ({ t: (key: string) => key, lang: 'zh-CN', setLang: vi.fn() }),
	I18nProvider: ({ children }: any) => children,
	defaultLang: 'zh-CN',
}));

vi.mock('@autional/ui', () => ({
	Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
	ErrorState: ({ title, description, onRetry }: any) => (
		<div>
			<div data-testid="error-title">{title}</div>
			<div data-testid="error-desc">{description}</div>
			{onRetry && <button onClick={onRetry}>retry</button>}
		</div>
	),
}));

vi.mock('@/components/auth/AuthCard', () => ({
	AuthCard: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/auth/AuthHeader', () => ({
	AuthHeader: ({ title, subtitle }: any) => (
		<div>
			<div>{title}</div>
			<div>{subtitle}</div>
		</div>
	),
}));

beforeEach(() => {
	vi.clearAllMocks();
	mockState.searchParams = new URLSearchParams();
	mockState.knownTenants = [{ id: 't1', name: 'demo' }];
	mockState.role = null;
	mockState.dashboardSlug = null;
	mockState.decodeJwtPayload.mockReturnValue({ sub: 'u1', tenant_id: 't1' });
	mockState.loadAuthExtras.mockResolvedValue(undefined);
	mockState.authMe.mockResolvedValue(null);
	window.history.replaceState(null, '', '/magic-link/confirm');
});

describe('MagicLinkConfirmPage（AUTH-26 落点重设计）', () => {
	it('fragment 凭据 → 建会话+锚定+剥 fragment，身份水合后按租户落 dashboard', async () => {
		window.history.replaceState(
			null,
			'',
			'/magic-link/confirm#access_token=at-1&refresh_token=rt-1',
		);
		mockState.authMe.mockResolvedValue({
			id: 'u1',
			username: 'alice',
			email: 'alice@example.com',
		});

		render(<MagicLinkConfirmPage />);

		await waitFor(() => expect(mockState.loginWithTokens).toHaveBeenCalledTimes(1));
		expect(mockState.decodeJwtPayload).toHaveBeenCalledWith('at-1');
		// user 先由 JWT 兜底（id=sub），展示字段留空待 /auth/me 水合
		expect(mockState.loginWithTokens).toHaveBeenCalledWith(
			'at-1',
			'rt-1',
			expect.objectContaining({ id: 'u1' }),
		);
		// AUTH-53 约束⑤：会话建立即锚定（此处 slug 参数缺省 → 名单 id 解析）
		expect(mockState.anchor).toHaveBeenCalledWith(
			'at-1',
			expect.objectContaining({ slug: null }),
		);
		// 一次性剥离：历史/截图不再携带 token
		expect(window.location.hash).toBe('');

		// 展示身份异步水合（失败不阻断）
		await waitFor(() =>
			expect(mockState.updateUser).toHaveBeenCalledWith(
				expect.objectContaining({ id: 'u1', email: 'alice@example.com' }),
			),
		);
		// 角色非管理面 + 名单解析出 slug（marker 由 anchor 写入；此处无 marker）→ 裸 /dashboard 交路由解析
		await waitFor(() =>
			expect(mockState.navigate).toHaveBeenCalledWith('/dashboard', { replace: true }),
		);
		expect(screen.getByText('magicLink.success')).toBeTruthy();
	});

	it('StrictMode 双执行：凭据只消费一次，不复读空 fragment 翻成误报错', async () => {
		window.history.replaceState(
			null,
			'',
			'/magic-link/confirm#access_token=at-9&refresh_token=rt-9',
		);

		render(
			<StrictMode>
				<MagicLinkConfirmPage />
			</StrictMode>,
		);

		await waitFor(() => expect(mockState.loginWithTokens).toHaveBeenCalledTimes(1));
		// 成功态：副标题与成功横幅各含一次（mock t 回显键名）
		await waitFor(() => expect(screen.getAllByText('magicLink.success').length).toBeGreaterThan(0));
		expect(screen.queryByTestId('error-title')).toBeNull();
		expect(mockState.loginWithTokens).toHaveBeenCalledTimes(1);
	});

	it('?error=token_expired → 专属文案且不发会话', async () => {
		mockState.searchParams = new URLSearchParams('error=token_expired');

		render(<MagicLinkConfirmPage />);

		await waitFor(() =>
			expect(screen.getByTestId('error-title').textContent).toBe(
				'magicLink.errors.tokenExpired',
			),
		);
		expect(mockState.loginWithTokens).not.toHaveBeenCalled();
	});

	it('?error=未知码 → 回落通用「链接无效或已过期」文案', async () => {
		mockState.searchParams = new URLSearchParams('error=who_knows');

		render(<MagicLinkConfirmPage />);

		await waitFor(() =>
			expect(screen.getByTestId('error-title').textContent).toBe('magicLink.confirmError'),
		);
		expect(mockState.loginWithTokens).not.toHaveBeenCalled();
	});

	it('无 fragment 无 error（直访）→ 通用错误态，不发会话', async () => {
		render(<MagicLinkConfirmPage />);

		await waitFor(() =>
			expect(screen.getByTestId('error-title').textContent).toBe('magicLink.confirmError'),
		);
		expect(screen.getByTestId('error-desc').textContent).toBe('magicLink.confirmErrorDesc');
		expect(mockState.loginWithTokens).not.toHaveBeenCalled();
	});
});
