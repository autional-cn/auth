import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import React from 'react';

// AUTH-53⑤（独立验证 P2 扩展）：QR 扫码登录确认后建立会话必须调用
// anchorSessionFromToken 锚定租户（slug 取路由；tenantId 走 JWT claim 兜底）。

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
	authQrLoginInitiatePost: vi.fn(),
	authQrLoginStatus: vi.fn(),
}));

vi.mock('@/hooks/use-countdown', () => ({
	useCountdown: () => ({ seconds: 300, isActive: true, start: vi.fn(), reset: vi.fn() }),
}));

vi.mock('qrcode', () => ({
	default: { toDataURL: vi.fn(async () => 'data:image/png;base64,x') },
}));

vi.mock('@autional/ui', async () => {
	const ReactMod = await import('react');
	return {
		Button: ({ children, onClick, isLoading, variant, fullWidth, disabled, ...rest }: any) =>
			ReactMod.createElement('button', { onClick, disabled, ...rest }, children),
	};
});

import QRLoginPanel from '@/components/auth/QRLoginPanel';
import { anchorSessionFromToken } from '@/lib/anchor-session';
import { loginWithTokens } from '@autional/shared';
import {
	authQrLoginInitiatePost,
	authQrLoginStatus,
} from '@autional/shared/generated/api';

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(authQrLoginInitiatePost).mockResolvedValue({
		sessionToken: 'tok-1',
		numberMatching: '42',
	} as any);
	vi.mocked(authQrLoginStatus).mockResolvedValue({
		status: 'confirmed',
		accessToken: 'at-1',
		refreshToken: 'rt-1',
	} as any);
});

describe('QRLoginPanel - AUTH-53⑤ 会话锚定', () => {
	it('扫码确认后锚定租户（slug 取路由、tenantId 为 null 走 claim 兜底）', async () => {
		render(
			<MemoryRouter initialEntries={['/demo/login']}>
				<Routes>
					<Route path=":tenantSlug/login" element={<QRLoginPanel />} />
				</Routes>
			</MemoryRouter>,
		);

		fireEvent.click(screen.getByRole('button', { name: 'qrLogin.getCode' }));

		// 轮询周期 2s——等待确认分支建立会话并锚定（real timers，超时上限 8s）
		await waitFor(
			() => {
				expect(vi.mocked(anchorSessionFromToken)).toHaveBeenCalledWith('at-1', {
					slug: 'demo',
					tenantId: null,
				});
			},
			{ timeout: 8000 },
		);
		expect(vi.mocked(loginWithTokens)).toHaveBeenCalledWith('at-1', 'rt-1', null);
	}, 10000);
});
