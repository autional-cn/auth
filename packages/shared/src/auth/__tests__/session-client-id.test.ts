// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ============================================================
// L6（D8）：刷新分流与登出吊销的 client_id 来源
//  - 会话内已解析值（localStorage `oauth_client_id`，OAuth 交棒时落库）优先
//  - env（__APP_CONFIG__.VITE_OAUTH_CLIENT_ID）兜底
//  - 两者皆无：保持旧行为（落 identity 腿）
// ============================================================

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));

vi.mock('axios', () => ({ default: { post: mockPost } }));
vi.mock('../../api/bff-client', () => ({ bffLogout: vi.fn(() => Promise.resolve()) }));

import { AuthService } from '../service';
import { useAuthStore } from '../store';
import { persistOAuthClientId } from '../oauth-client-id-store';

const OAUTH_REFRESH = '/oauth/api/v1/oauth/refresh';
const IDENTITY_REFRESH = '/identity/api/v1/auth/refresh';
const REVOKE = '/oauth/api/v1/oauth/revoke';

function callsTo(fragment: string) {
	return mockPost.mock.calls.filter((c) => String(c[0]).includes(fragment));
}

beforeEach(() => {
	vi.clearAllMocks();
	localStorage.clear();
	useAuthStore.setState({ accessToken: null, refreshToken: null, isAuthenticated: false });
	delete (window as any).__APP_CONFIG__;
	mockPost.mockResolvedValue({ data: { access_token: 'new-at', refresh_token: 'rt-new' } });
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('AuthService.refreshToken 分流', () => {
	it('opaque refresh token + 会话内 client_id → 走 OAuth 腿并带上该 client_id', async () => {
		persistOAuthClientId('cid-from-session');
		useAuthStore.setState({ refreshToken: 'rt-opaque-abc' });

		const at = await AuthService.refreshToken();

		expect(at).toBe('new-at');
		const oauthCalls = callsTo(OAUTH_REFRESH);
		expect(oauthCalls).toHaveLength(1);
		expect(oauthCalls[0][1]).toEqual({
			refresh_token: 'rt-opaque-abc',
			client_id: 'cid-from-session',
		});
		expect(callsTo(IDENTITY_REFRESH)).toHaveLength(0);
	});

	it('无会话值时 env 兜底（VITE_OAUTH_CLIENT_ID）', async () => {
		(window as any).__APP_CONFIG__ = { VITE_OAUTH_CLIENT_ID: 'cid-from-env' };
		useAuthStore.setState({ refreshToken: 'rt-opaque-abc' });

		await AuthService.refreshToken();

		expect(callsTo(OAUTH_REFRESH)[0][1]).toEqual({
			refresh_token: 'rt-opaque-abc',
			client_id: 'cid-from-env',
		});
	});

	it('两者皆无 → 落 identity 腿（形态与接线前一致）', async () => {
		useAuthStore.setState({ refreshToken: 'rt-opaque-abc' });

		await AuthService.refreshToken();

		expect(callsTo(IDENTITY_REFRESH)).toHaveLength(1);
		expect(callsTo(OAUTH_REFRESH)).toHaveLength(0);
	});

	it('JWT refresh token（三段式）恒走 identity 腿，即使会话内有 client_id', async () => {
		persistOAuthClientId('cid-from-session');
		useAuthStore.setState({ refreshToken: 'a.b.c' });

		await AuthService.refreshToken();

		expect(callsTo(IDENTITY_REFRESH)).toHaveLength(1);
		expect(callsTo(OAUTH_REFRESH)).toHaveLength(0);
	});

	it('刷新成功后新 token 落库（updateTokens 链路）', async () => {
		persistOAuthClientId('cid-from-session');
		useAuthStore.setState({ refreshToken: 'rt-opaque-abc' });

		await AuthService.refreshToken();

		expect(useAuthStore.getState().accessToken).toBe('new-at');
		expect(useAuthStore.getState().refreshToken).toBe('rt-new');
	});
});

describe('AuthService.logout 吊销', () => {
	it('access/refresh 两条吊销都带会话内 client_id', async () => {
		persistOAuthClientId('cid-from-session');
		useAuthStore.setState({ accessToken: 'at-1', refreshToken: 'rt-opaque-1' });

		await AuthService.logout();

		const revokes = callsTo(REVOKE);
		expect(revokes).toHaveLength(2);
		for (const call of revokes) {
			expect(String(call[1])).toContain('client_id=cid-from-session');
		}
		expect(String(revokes[0][1])).toContain('token_type_hint=access_token');
		expect(String(revokes[1][1])).toContain('token_type_hint=refresh_token');
	});

	it('登出清 token 但**不清** client_id（部署级取值，非用户私有数据）', async () => {
		persistOAuthClientId('cid-from-session');
		useAuthStore.setState({ accessToken: 'at-1', refreshToken: 'rt-opaque-1' });

		await AuthService.logout();

		expect(localStorage.getItem('oauth_client_id')).toBe('cid-from-session');
		expect(useAuthStore.getState().isAuthenticated).toBe(false);
	});
});
