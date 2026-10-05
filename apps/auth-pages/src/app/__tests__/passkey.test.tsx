import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@autional-cn/shared', () => ({
	loginWithTokens: vi.fn(),
	extractApiError: vi.fn((_err: unknown, fallback: string) => ({ message: fallback })),
	crossAppUrl: (base: string, path?: string) => base + (path || ''),
	END_USER_PORTAL_URL: () => '/user',
	usePublicTenantSlugs: () => ({ data: [{ name: 'demo' }] }),
}));

vi.mock('@/hooks/use-tenant-slug', () => ({
	useEffectiveTenantSlug: () => 'demo',
	// AUTH-48/49：AuthCard 页脚法律链消费已解析 slug
	useResolvedTenantSlug: () => 'demo',
}));

vi.mock('@/lib/i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		lang: 'zh-CN',
	}),
}));

import PasskeyPage from '../passkey/page';

// AUTH-39：本页为指引页——不再内嵌第二套 WebAuthn 登录链（真实入口 = 登录页
// PasskeyLoginButton），所有链接文案与行为对齐。
function renderPasskey() {
	return render(
		<MemoryRouter initialEntries={['/passkey']}>
			<PasskeyPage />
		</MemoryRouter>,
	);
}

describe('PasskeyPage（指引页）', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders guidance title and subtitle', () => {
		renderPasskey();
		expect(screen.getByText('passkey.titleLogin')).toBeInTheDocument();
		expect(screen.getByText('passkey.guidanceSubtitle')).toBeInTheDocument();
	});

	it('renders what-is-passkey info section', () => {
		renderPasskey();
		expect(screen.getByText('passkey.whatIs')).toBeInTheDocument();
		expect(screen.getByText('passkey.description')).toBeInTheDocument();
	});

	it('links to tenant-scoped login page for passkey sign-in', () => {
		renderPasskey();
		const link = screen.getByText(/passkey\.goToLogin/).closest('a');
		expect(link).toHaveAttribute('href', '/demo/login');
		expect(screen.getByText('passkey.loginGuidance')).toBeInTheDocument();
	});

	it('links to account center for managing passkeys', () => {
		renderPasskey();
		const link = screen.getByText(/passkey\.goToAccountCenter/).closest('a');
		expect(link).toHaveAttribute('href', '/user/demo/security');
		expect(screen.getByText('passkey.registerMoved')).toBeInTheDocument();
	});

	it('「使用密码登录」按钮导航到登录页（文案-行为对齐）', () => {
		renderPasskey();
		const backBtn = screen.getByText('passkey.backLogin');
		fireEvent.click(backBtn);
		expect(mockNavigate).toHaveBeenCalledWith('/demo/login');
	});

	it('不再渲染 WebAuthn 登录发起按钮（无第二套登录链/无原始错误直渲）', () => {
		renderPasskey();
		expect(screen.queryByText('passkey.submitLogin')).not.toBeInTheDocument();
	});
});
