import { describe, it, expect } from 'vitest';
import { resolveEntryPlane } from '../entry-plane';

describe('resolveEntryPlane', () => {
	it('redirect 指向 admin 门户主机 → admin', () => {
		expect(resolveEntryPlane('https://admin.iam.tianv.com/dashboard', 'auth.iam.tianv.com')).toBe(
			'admin',
		);
	});

	it('redirect 指向 platform 门户主机 → platform', () => {
		expect(resolveEntryPlane('https://platform.iam.tianv.com/tenants', 'auth.iam.tianv.com')).toBe(
			'platform',
		);
	});

	it('redirect 指向非管理门户（user）→ 回落当前主机（auth）→ api', () => {
		expect(resolveEntryPlane('https://user.iam.tianv.com/dashboard', 'auth.iam.tianv.com')).toBe(
			'api',
		);
	});

	it('redirect 指向安全仪表盘主机 → admin（SOC 门户为 admin 受众）', () => {
		expect(
			resolveEntryPlane('https://security.iam.tianv.com/risk-dashboard', 'auth.iam.tianv.com'),
		).toBe('admin');
	});

	it('无 redirect、当前主机为安全仪表盘 → admin', () => {
		expect(resolveEntryPlane(null, 'security.iam.tianv.com')).toBe('admin');
	});

	it('无 redirect、当前主机为 admin 门户 → admin', () => {
		expect(resolveEntryPlane(null, 'admin.iam.tianv.com')).toBe('admin');
	});

	it('无 redirect、当前主机为 auth 门户 → api', () => {
		expect(resolveEntryPlane(null, 'auth.iam.tianv.com')).toBe('api');
	});

	it('redirect 为相对路径时按当前主机判定', () => {
		expect(resolveEntryPlane('/admin/dashboard', 'platform.iam.tianv.com')).toBe('platform');
		expect(resolveEntryPlane('/dashboard', 'auth.iam.tianv.com')).toBe('api');
	});

	it('redirect 非法时回落当前主机判定', () => {
		expect(resolveEntryPlane('http://[invalid', 'auth.iam.tianv.com')).toBe('api');
	});

	it('主机前缀大小写不敏感、带端口仍匹配', () => {
		expect(resolveEntryPlane('https://ADMIN.iam.tianv.com/', 'auth.iam.tianv.com')).toBe('admin');
		expect(resolveEntryPlane('https://admin.iam.tianv.com:8443/', 'auth.iam.tianv.com')).toBe(
			'admin',
		);
	});
});

// 冷启动链：同意页无会话 → `<slug>/login?redirect=<authorize URL>`（oauth-cold-start TASK-07）。
// authorize URL 宿主是 auth 门户 ⇒ 宿主判定为空，必须下钻内嵌目标（redirect_uri / state.redirect），
// 否则回程门户拿到的 token 平面恒为 api，admin/platform 受众端点全部 403 40000503（F-W5）。
describe('resolveEntryPlane（authorize URL 作为登录页 redirect）', () => {
	/** 复刻 initiateOAuthLogin 的 authorize URL 组装（oauth-login.ts）。 */
	function authorizeUrl(params: Record<string, string>): string {
		const qs = new URLSearchParams({ response_type: 'code', client_id: 'cid-1', ...params });
		return `https://auth.iam.tianv.com/oauth/api/v1/oauth/authorize?${qs}`;
	}

	it('redirect_uri 指向 admin 门户回调 → admin', () => {
		const url = authorizeUrl({
			redirect_uri: 'https://admin.iam.tianv.com/oauth/callback',
			state: JSON.stringify({ csrf: 'x', redirect: 'https://admin.iam.tianv.com/demo/dashboard' }),
		});
		expect(resolveEntryPlane(url, 'auth.iam.tianv.com')).toBe('admin');
	});

	it('redirect_uri 缺失时以 state.redirect（发起页 URL）判定 → platform', () => {
		const url = authorizeUrl({
			state: JSON.stringify({ csrf: 'x', redirect: 'https://platform.iam.tianv.com/tenants' }),
		});
		expect(resolveEntryPlane(url, 'auth.iam.tianv.com')).toBe('platform');
	});

	it('内嵌目标为安全仪表盘 → admin（SOC 门户与 admin 同平面）', () => {
		const url = authorizeUrl({ redirect_uri: 'https://security.iam.tianv.com/oauth/callback' });
		expect(resolveEntryPlane(url, 'auth.iam.tianv.com')).toBe('admin');
	});

	it('内嵌目标为 user 门户 / 第三方应用 → 回落 api', () => {
		expect(
			resolveEntryPlane(
				authorizeUrl({ redirect_uri: 'https://user.iam.tianv.com/oauth/callback' }),
				'auth.iam.tianv.com',
			),
		).toBe('api');
		expect(
			resolveEntryPlane(
				authorizeUrl({ redirect_uri: 'https://app.example.com/oauth/callback' }),
				'auth.iam.tianv.com',
			),
		).toBe('api');
	});

	it('state 非 JSON（旧式纯串）不抛错，按 redirect_uri 判定', () => {
		const url = authorizeUrl({
			redirect_uri: 'https://admin.iam.tianv.com/oauth/callback',
			state: 'plain-state',
		});
		expect(resolveEntryPlane(url, 'auth.iam.tianv.com')).toBe('admin');
	});

	it('非 authorize 路径的 redirect_uri 参数不参与判定（防普通深链伪造平面）', () => {
		expect(
			resolveEntryPlane(
				'https://user.iam.tianv.com/demo/?redirect_uri=https://admin.iam.tianv.com/',
				'auth.iam.tianv.com',
			),
		).toBe('api');
	});
});
