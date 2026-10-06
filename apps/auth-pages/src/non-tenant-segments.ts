/**
 * 本站点的**业务路由首段**——它们不是租户 slug。
 *
 * 为什么必须显式声明：extractSlugFromPath 只能靠 URL 形状判断首段是不是租户，
 * 而「这个首段是不是本站点自己的路由」是**应用知识**，通用层无从得知。名单缺席时，
 * /settings 会被判成租户 settings、/incidents 会被判成租户 incidents，于是发出一次
 * 毫无意义的品牌查询（还可能套上错误的品牌）。
 *
 * 名单由 App.tsx 的路由表机械派生：取每条 <Route path> 的首段，跳过通配 * 与参数 :param，
 * 并跳过通用层 RESERVED_SEGMENTS 已覆盖的基础设施段（oauth / bff / api / assets …）。
 * ui 仓库的 scripts/check-non-tenant.mjs 会逐站比对这份名单与路由表——
 * 改了路由却不同步这里，闸门会失败。
 *
 * 由 main.tsx 以副作用方式 import，保证在首次渲染前完成注册。
 */
import { registerNonTenantSegments } from '@autional/shared';

export const NON_TENANT_SEGMENTS = [
	'account',
	'account-deletion',
	'dashboard',
	'error',
	'login',
	'logout',
	'magic-link',
	'mfa',
	'mfa-challenge',
	'mfa-setup',
	'passkey',
	'privacy',
	'reapply',
	'reset-password',
	'sso',
	'terms',
	'verify-email',
	'verify-identity',
	'verify-phone',
] as const;

registerNonTenantSegments(NON_TENANT_SEGMENTS);
