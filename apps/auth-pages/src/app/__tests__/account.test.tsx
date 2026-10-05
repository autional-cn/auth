import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AccountPage from '../account/page';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => (opts ? `${key} ${JSON.stringify(opts)}` : key),
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		Link: ({ to, children }: any) => <a href={to}>{children}</a>,
	};
});

vi.mock('@autional-cn/shared', () => ({
	END_USER_PORTAL_URL: () => 'http://user.example.com',
	crossAppUrl: (base: string, path?: string) => base + (path || ''),
}));

vi.mock('@/hooks/use-tenant-slug', () => ({
	useEffectiveTenantSlug: () => 'demo',
	// AUTH-48/49：AuthCard 页脚法律链消费已解析 slug
	useResolvedTenantSlug: () => 'demo',
}));

vi.mock('@/lib/i18n', () => ({
	useI18n: () => ({
		t: (key: string, opts?: any) => (opts ? `${key} ${JSON.stringify(opts)}` : key),
		lang: 'zh-CN',
		setLang: vi.fn(),
	}),
	I18nProvider: ({ children }: any) => children,
	defaultLang: 'zh-CN',
}));

vi.mock('@/hooks/use-page-title', () => ({
	usePageTitle: vi.fn(),
}));

vi.mock('lucide-react', () => ({
	UserCircle: () => null,
	ShieldCheck: () => null,
	Monitor: () => null,
	Bell: () => null,
	KeyRound: () => null,
	Settings: () => null,
	ShieldAlert: () => null,
	History: () => null,
	Link2: () => null,
	Phone: () => null,
	Lock: () => null,
	// AUTH-45②：注销账户卡图标
	UserX: () => null,
}));

const renderPage = () =>
	render(
		<MemoryRouter initialEntries={['/account']}>
			<AccountPage />
		</MemoryRouter>,
	);

describe('AccountPage', () => {
	it('renders title and subtitle', () => {
		renderPage();

		expect(screen.getByText('account.title')).toBeInTheDocument();
		expect(screen.getByText('account.subtitle')).toBeInTheDocument();
	});

	it('renders all 11 link labels', () => {
		renderPage();

		const linkLabels = [
			'account.profile',
			'account.security',
			'account.sessions',
			'account.notifPrefs',
			'account.changePassword',
			'account.loginHistory',
			'account.roleActivations',
			'account.linkedAccounts',
			'account.recoveryContacts',
			'account.privacyCenter',
			'account.deleteAccount',
		];

		for (const label of linkLabels) {
			expect(screen.getByText(label)).toBeInTheDocument();
		}
	});

	it('links point to correct URLs', () => {
		renderPage();

		const links = screen.getAllByRole('link');

		// 11 个账户导航链接（AUTH-45：+注销账户卡）+ AuthCard footer 恒显内链（/privacy + /terms）共 13
		// （AuthCard footer 内链化：register-internal-terms-privacy TASK-133~136, C2-1）
		expect(links).toHaveLength(13);

		// 文本锚定而非下标：AUTH-45 卡片增删不再脆断断言
		const profileLink = screen.getByText('account.profile').closest('a');
		expect(profileLink).toHaveAttribute('href', expect.stringContaining('/profile'));

		// AUTH-45②：注销账户卡落本仓 account-deletion（测试路由无租户段 → 裸链）
		const deleteLink = screen.getByText('account.deleteAccount').closest('a');
		expect(deleteLink).toHaveAttribute('href', '/account-deletion');

		const privacyLink = screen.getByText('account.privacyCenter').closest('a');
		expect(privacyLink).toHaveAttribute('href', '/privacy');
	});
});
