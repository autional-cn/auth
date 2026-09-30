import { Navigate, useLocation } from 'react-router';

/**
 * 裸 /<slug>（brand 落地目标）index 跳转：携 `redirect` 时改走 `/<slug>/login`，
 * 且 search **整串**透传（U88）——此前 `<Navigate to="dashboard">` 丢弃 search，
 * 让「门户会话过期 → auth → brand（withSlug 补 slug、保留查询串）」三级嵌套回程
 * 在登录成功后的最后一跳断链（落 auth 仪表盘，目标门户 URL 丢失）。
 *
 * 登录页是 redirect 的唯一消费者，两条既有分支均可收敛：
 *  - 带 `from_requireauth=1` + 有会话 → PKCE 回目标门户（跨域 SSO 正路）
 *  - 不带（或 PKCE 条件不满足）有会话 → `checkAndRedirect` 整页跳 Z；
 *    无会话 → 登录成功后经 `getPostLoginTarget` 回 Z
 * 无 redirect（含空串）时维持 dashboard 落点，原语义不变。
 */
export function TenantIndexRedirect() {
	const { search } = useLocation();
	const redirect = new URLSearchParams(search).get('redirect');
	return <Navigate to={redirect ? `login${search}` : 'dashboard'} replace />;
}

export default TenantIndexRedirect;
