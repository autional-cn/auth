/**
 * 同意页冷启动（TASK-07 / ADR-04）。
 *
 * 无会话直接打开 authorize URL 时，client_id 已在 URL 里 ⇒ 可反查
 * client → tenant_id → 公开租户名单 → slug，直接落到 `<slug>/login?redirect=<authorize URL>`，
 * **短路 brand 环节**（brand 只在「门户裸根、无租户上下文」时才需要）。
 *
 * 解析失败（client 未配置 / 租户未回填 / 网络失败）由调用方回退旧交棒链，不在此抛错。
 */

/** `<slug>/login?redirect=<authorize URL>` —— 与 EntryRouter 的回程组装同形 */
export function buildTenantLoginUrl(slug: string, authorizeUrl: string): string {
	return `/${slug}/login?redirect=${encodeURIComponent(authorizeUrl)}`;
}

/**
 * client_id → 租户 slug。
 *
 * 两步走：`/oauth/client/{id}`（公开端点，含 tenantId）→ 公开租户名单
 * （`name` 即 slug，见 tenant-service `GetByName`）。任一步失败返回 null。
 */
export async function fetchTenantSlugByClientId(clientId: string): Promise<string | null> {
	try {
		const clientRes = await fetch(
			`/bff/oauth/api/v1/oauth/client/${encodeURIComponent(clientId)}`,
		);
		if (!clientRes.ok) return null;
		const clientJson: any = await clientRes.json();
		const client = clientJson?.data ?? clientJson;
		const tenantId = client?.tenantId || client?.tenant_id;
		if (!tenantId) return null;

		const tenantsRes = await fetch('/bff/tenant/api/v1/tenant/public/tenants');
		if (!tenantsRes.ok) return null;
		const tenantsJson: any = await tenantsRes.json();
		// 响应契约与 usePublicTenantSlugs 同源：items → data → 原始
		const list = tenantsJson?.items ?? tenantsJson?.data ?? tenantsJson ?? [];
		if (!Array.isArray(list)) return null;
		const hit = list.find((t: any) => t?.id === tenantId);
		return hit?.name || hit?.slug || null;
	} catch {
		return null;
	}
}
