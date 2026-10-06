import { END_USER_PORTAL_URL, crossAppUrl } from '@autional/shared';

/**
 * 用户门户（账户中心）深链（AUTH-41）：必须带租户 slug —— 裸链
 * `user.<域名>/security` 无租户上下文，用户门户侧一律 404。
 * slug 解析失败时保守回落到裸链（由用户门户自身做最终兜底），能解析就带。
 */
export function userPortalUrl(slug: string | undefined, path: string): string {
	return crossAppUrl(END_USER_PORTAL_URL(), slug ? `/${slug}${path}` : path);
}
