import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import React from 'react';

// AUTH-53 约束⑤（独立验证 F1 回归锁）：passkey 两登录路径（条件 UI 自动填充 /
// 手动按钮）建立会话后必须调用 anchorSessionFromToken 锚定租户——缺失时从
// 「他租户会话残留」上下文发起的 passkey 新会话会被跨租户守卫误清。

vi.mock('@/lib/i18n', () => ({
	useI18n: () => ({ t: (key: string) => key, lang: 'zh-CN', setLang: vi.fn() }),
}));

vi.mock('@/lib/anchor-session', () => ({
	anchorSessionFromToken: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
	loadAuthExtras: vi.fn(async () => {}),
}));

vi.mock('@/lib/post-login-redirect', () => ({
	getPostLoginTarget: vi.fn(() => '/demo/dashboard'),
}));

vi.mock('@autional/shared', () => ({
	apiClient: {},
	loginWithTokens: vi.fn(),
}));

vi.mock('@autional/shared/generated/api', () => ({
	authWebauthnAuthenticateBeginPost: vi.fn(),
	authWebauthnAuthenticateCompletePost: vi.fn(),
}));

vi.mock('@autional/ui', async () => {
	const ReactMod = await import('react');
	return {
		Button: ({ children, onClick, isLoading, variant, fullWidth, ...rest }: any) =>
			ReactMod.createElement('button', { onClick, ...rest }, children),
	};
});

vi.mock('lucide-react', () => ({ Fingerprint: () => null }));

vi.mock('@/components/auth/CredentialManagementGate', () => ({
	CredentialManagementGate: () => null,
}));

import { PasskeyLoginButton } from '@/components/auth/PasskeyLoginButton';
import { anchorSessionFromToken } from '@/lib/anchor-session';
import { loginWithTokens } from '@autional/shared';
import {
	authWebauthnAuthenticateBeginPost,
	authWebauthnAuthenticateCompletePost,
} from '@autional/shared/generated/api';

const token = (n = 8) => new Uint8Array(n).buffer;

function makeCredential() {
	return {
		id: 'cred-1',
		rawId: token(),
		type: 'public-key',
		response: {
			clientDataJSON: token(),
			authenticatorData: token(),
			signature: token(),
			userHandle: null,
		},
	};
}

function renderButton() {
	return render(
		<MemoryRouter initialEntries={['/demo/login']}>
			<Routes>
				<Route
					path=":tenantSlug/login"
					element={<PasskeyLoginButton email="u@example.com" tenantId="tenant-1" />}
				/>
			</Routes>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();

	Object.defineProperty(window, 'PublicKeyCredential', {
		value: Object.assign(function () {}, {
			isConditionalMediationAvailable: vi.fn(async () => false),
		}),
		configurable: true,
	});
	Object.defineProperty(navigator, 'credentials', {
		value: { get: vi.fn(async () => makeCredential()) },
		configurable: true,
	});

	vi.mocked(authWebauthnAuthenticateBeginPost).mockResolvedValue({
		publicKey: { challenge: 'Y2hhbGxlbmdl', allowCredentials: [] },
	} as any);
	vi.mocked(authWebauthnAuthenticateCompletePost).mockResolvedValue({
		accessToken: 'at-1',
		refreshToken: 'rt-1',
		user: { id: 'u-1' },
	} as any);
});

describe('PasskeyLoginButton - AUTH-53⑤ 会话锚定', () => {
	it('手动按钮路径：登录成功后锚定租户（slug 取路由、tenantId 取 prop）', async () => {
		renderButton();

		fireEvent.click(screen.getByTestId('passkey-submit-button'));

		await waitFor(() => {
			expect(vi.mocked(anchorSessionFromToken)).toHaveBeenCalledWith('at-1', {
				slug: 'demo',
				tenantId: 'tenant-1',
			});
		});
		expect(vi.mocked(loginWithTokens)).toHaveBeenCalledWith('at-1', 'rt-1', { id: 'u-1' });
	});

	it('条件 UI 自动填充路径：登录成功后同样锚定租户', async () => {
		(window.PublicKeyCredential as any).isConditionalMediationAvailable = vi.fn(
			async () => true,
		);

		renderButton();

		await waitFor(() => {
			expect(vi.mocked(anchorSessionFromToken)).toHaveBeenCalledWith('at-1', {
				slug: 'demo',
				tenantId: 'tenant-1',
			});
		});
	});
});
