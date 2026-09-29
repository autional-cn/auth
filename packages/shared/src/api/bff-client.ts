/**
 * BFF (Backend-For-Frontend) Auth Client
 * 使用 httpOnly session cookie 替代 localStorage token，消除 XSS 令牌窃取风险。
 *
 * BFF 统一路由后：所有 API 通过 /bff/identity/api/v1/auth/* 访问。
 */

const BFF_LOGIN = '/bff/identity/api/v1/auth/login';
const BFF_REFRESH = '/bff/identity/api/v1/auth/refresh';
const BFF_LOGOUT = '/bff/identity/api/v1/auth/logout';

interface BFFLoginResult {
	code: number;
	message: string;
	data?: {
		user?: { id: string; username?: string; email?: string };
		expires_in?: number;
		requires_mfa?: boolean;
		mfa_check_reason?: string;
		challenge_token?: string;
		must_change_password?: boolean;
		password_warning?: string;
		password_expires_in?: number;
	};
}

export async function bffLogin(
	identity: string,
	password: string,
	tenantId?: string,
): Promise<BFFLoginResult> {
	const headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (tenantId) {
		headers['X-Tenant-ID'] = tenantId;
	}
	const resp = await fetch(BFF_LOGIN, {
		method: 'POST',
		headers,
		body: JSON.stringify({ identity, password, ...(tenantId ? { tenant_id: tenantId } : {}) }),
	});
	if (!resp.ok) {
		return { code: resp.status, message: `BFF unavailable (HTTP ${resp.status})` };
	}
	try {
		return await resp.json();
	} catch {
		return { code: -1, message: 'BFF returned invalid response' };
	}
}

export async function bffRefresh(): Promise<BFFLoginResult> {
	const resp = await fetch(BFF_REFRESH, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});
	if (!resp.ok) {
		return { code: resp.status, message: `BFF unavailable (HTTP ${resp.status})` };
	}
	try {
		return await resp.json();
	} catch {
		return { code: -1, message: 'BFF returned invalid response' };
	}
}

export async function bffLogout(): Promise<void> {
	// BFF cookie 模式未启用时此调用无凭据可依（identity logout 必 401），不发起无意义请求。
	// 导航归调用方（useLogout / useAuthActions.logout 自身跳转），此处只做会话吊销。
	if (!isBFFAvailable()) return;
	await fetch(BFF_LOGOUT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});
}

/**
 * BFF 是否可用。
 * 默认基于 __APP_CONFIG__ 中的 VITE_BFF_ENABLED 环境变量。
 * 也可以在调用前通过 isBFFAvailable.override 设置（用于测试或动态切换）。
 */
export function isBFFAvailable(): boolean {
	if (typeof window !== 'undefined') {
		const cfg = (window as any).__APP_CONFIG__;
		if (cfg?.VITE_BFF_ENABLED === 'true') return true;
		if (cfg?.VITE_BFF_ENABLED === 'false') return false;
	}
	// Static override (for testing or dynamic switching)
	if (isBFFAvailable._override !== undefined) return isBFFAvailable._override;
	// Default: false (auth-pages opt-in via env var)
	return false;
}

// Allow runtime override (e.g. for testing or feature-flag driven toggling)
isBFFAvailable._override = undefined as boolean | undefined;
