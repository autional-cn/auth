import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import OAuthCallbackPage from '../oauth/callback/page';

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

const mockExchangeCodeForToken = vi.fn();
vi.mock('@/lib/api.generated', () => ({
	exchangeCodeForToken: (...args: any[]) => mockExchangeCodeForToken(...args),
}));

vi.mock('@/lib/api', () => ({ loadAuthExtras: vi.fn().mockResolvedValue({}) }));
vi.mock('@/lib/anchor-session', () => ({ anchorSessionFromToken: vi.fn() }));

// extractApiError / decodeJwtPayload 取真实现（AUTH-46 i18n_key 透出 + JWT 解析是本次修复面）
vi.mock('@autional-cn/shared', async () => {
	const actual =
		await vi.importActual<typeof import('@autional-cn/shared')>('@autional-cn/shared');
	return {
		...actual,
		loginWithTokens: vi.fn(),
		usePublicTenantSlugs: () => ({ data: [] }),
	};
});

function renderCallback(url: string) {
	return render(
		<MemoryRouter initialEntries={[url]}>
			<Routes>
				<Route path="/oauth/callback/:provider" element={<OAuthCallbackPage />} />
			</Routes>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
});

// ============================================================
// AUTH-46③：回调页错误用户化 —— errorParam 码级映射 + catch 路径 i18n_key；
// 未知形态才回落描述原文（AUTH-47 不吞真实原因）。
// ============================================================

describe('OAuthCallbackPage AUTH-46③（错误用户化）', () => {
	it('errorParam 已知错误码 → 按码本地化（英文描述不落屏）', async () => {
		renderCallback(
			'/oauth/callback/github?error=access_denied&error_description=The+user+denied+the+request',
		);
		expect(await screen.findByText('oauth.error.accessDenied')).toBeInTheDocument();
		expect(screen.queryByText('The user denied the request')).toBeNull();
	});

	it('errorParam 未知错误码 → 回落描述原文（AUTH-47）', async () => {
		renderCallback(
			'/oauth/callback/github?error=vendor_specific&error_description=vendor+raw+detail',
		);
		expect(await screen.findByText('vendor raw detail')).toBeInTheDocument();
	});

	it('无 code 无 error → missingCode 提示', async () => {
		renderCallback('/oauth/callback/github');
		expect(await screen.findByText('auth.oauth.missingCode')).toBeInTheDocument();
	});

	it('catch 路径 i18n_key → 按本地化键渲染，原始英文不落屏', async () => {
		mockExchangeCodeForToken.mockRejectedValue({
			response: {
				data: {
					code: 'IDENTITY_400',
					message: 'raw english from backend',
					i18n_key: 'error.oauth_state_invalid',
				},
			},
		});
		renderCallback('/oauth/callback/github?code=auth-code&state=s1');
		expect(await screen.findByText('error.oauth_state_invalid')).toBeInTheDocument();
		expect(screen.queryByText('raw english from backend')).toBeNull();
	});

	it('catch 路径无 i18n_key → 回落归一化消息（title 键链）', async () => {
		mockExchangeCodeForToken.mockRejectedValue({
			response: { data: { title: 'problem title from backend' } },
		});
		renderCallback('/oauth/callback/github?code=auth-code&state=s1');
		expect(await screen.findByText('problem title from backend')).toBeInTheDocument();
	});
});
