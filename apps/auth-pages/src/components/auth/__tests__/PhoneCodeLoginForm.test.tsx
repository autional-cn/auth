import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import React from 'react';

// AUTH-53⑤（独立验证 P2 扩展）：手机验证码登录/注册自动登录建立会话后必须调用
// anchorSessionFromToken 锚定租户——与 EmailCode/passkey 同缺陷类。

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
	loginWithTokens: vi.fn(),
}));

vi.mock('@autional/shared/generated/api', () => ({
	authLoginPhoneCodePost: vi.fn(),
	authRegisterPhoneCodePost: vi.fn(),
	authSendSmsCodePost: vi.fn(),
}));

vi.mock('@/hooks/use-countdown', () => ({
	useCountdown: () => ({ seconds: 60, isActive: false, start: vi.fn(), reset: vi.fn() }),
}));

vi.mock('@autional/ui', async () => {
	const ReactMod = await import('react');
	return {
		Button: ({ children, onClick, isLoading, variant, fullWidth, disabled, ...rest }: any) =>
			ReactMod.createElement('button', { onClick, disabled, ...rest }, children),
		Input: (props: any) => ReactMod.createElement('input', props),
		Label: ({ children, ...rest }: any) => ReactMod.createElement('label', rest, children),
	};
});

import PhoneCodeLoginForm from '@/components/auth/PhoneCodeLoginForm';
import { anchorSessionFromToken } from '@/lib/anchor-session';
import { loginWithTokens } from '@autional/shared';
import {
	authLoginPhoneCodePost,
	authSendSmsCodePost,
} from '@autional/shared/generated/api';

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(authSendSmsCodePost).mockResolvedValue({} as any);
	vi.mocked(authLoginPhoneCodePost).mockResolvedValue({
		accessToken: 'at-1',
		refreshToken: 'rt-1',
		user: { id: 'u-1' },
	} as any);
});

function renderForm() {
	return render(
		<MemoryRouter initialEntries={['/demo/login']}>
			<Routes>
				<Route
					path=":tenantSlug/login"
					element={<PhoneCodeLoginForm tenantId="tenant-1" onBack={() => {}} />}
				/>
			</Routes>
		</MemoryRouter>,
	);
}

describe('PhoneCodeLoginForm - AUTH-53⑤ 会话锚定', () => {
	it('手机验证码登录成功后锚定租户（slug 取路由、tenantId 取 prop）', async () => {
		renderForm();

		fireEvent.change(screen.getByPlaceholderText('+86 13800000000'), {
			target: { value: '+86 13800000000' },
		});
		fireEvent.click(screen.getByRole('button', { name: 'auth.phoneCode.sendCode' }));

		const codeInput = await screen.findByPlaceholderText('000000');
		fireEvent.change(codeInput, { target: { value: '123456' } });
		fireEvent.click(screen.getByRole('button', { name: 'auth.phoneCode.login' }));

		await waitFor(() => {
			expect(vi.mocked(anchorSessionFromToken)).toHaveBeenCalledWith('at-1', {
				slug: 'demo',
				tenantId: 'tenant-1',
			});
		});
		expect(vi.mocked(loginWithTokens)).toHaveBeenCalledWith('at-1', 'rt-1', { id: 'u-1' });
	});
});
