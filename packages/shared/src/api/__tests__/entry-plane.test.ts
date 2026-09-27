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
