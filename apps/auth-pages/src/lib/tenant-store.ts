import { create } from 'zustand';
import { extractSlugFromPath } from '@autional-cn/shared/slug-from-url';
import { useTenantBrandingStore } from '@autional-cn/shared/branding';

interface Tenant {
	tenantId: string;
	tenantName: string;
	role: 'owner' | 'admin' | 'member';
	logoUrl?: string;
}

interface TenantState {
	currentTenantId: string | null;
	tenants: Tenant[];

	setCurrentTenant: (tenantId: string) => void;
	setTenants: (tenants: Tenant[]) => void;
	reset: () => void;
}

/**
 * 从 auth-pages 自身路径解析租户 slug（`/{slug}/{route}` 形状，至少两段）。
 *
 * 「首段是不是本站点自己的路由」交给共享层的注册表判定——名单见
 * apps/auth-pages/src/non-tenant-segments.ts（由 App.tsx 路由表机械派生，
 * ui 仓库的 check-non-tenant 闸门守着不漂移）。这里此前另存了一份 24 项白名单，
 * 与共享层各写一份、必然慢慢对不上，已删除。
 *
 * 比共享层更严的一点：裸 `/{slug}` 视为无上下文（该路径会立即转向 dashboard），
 * 所以先做段数判断，再交给共享层。
 */
export function tenantSlugFromPath(pathname: string): string | undefined {
	const segments = pathname.split('/').filter(Boolean);
	if (segments.length < 2) return undefined;
	return extractSlugFromPath(pathname);
}

/**
 * 会话所属租户 slug —— 唯一权威来源是**公开租户名单**（id ↔ slug）。
 *
 * ⚠ 不得改用 identity `/auth/me/tenants` 的 `name`：该字段是**展示名**
 * （`auth_handler.go` GetMyTenants 显式优先 DisplayName），demo 租户实测为
 * "Demo Tenant"。当 slug 用会拼出 `/Demo%20Tenant/dashboard`，连带
 * branding / auth-config 全部 404。
 */
export function pickSessionSlug(
	knownTenants: Array<{ id?: string; name?: string; slug?: string }> | undefined,
	currentTenantId: string | null,
): string | undefined {
	const list = knownTenants ?? [];
	if (currentTenantId) {
		const match = list.find((t) => t.id === currentTenantId);
		const slug = match?.name || match?.slug;
		if (slug) return slug;
	}
	// 名单里查不到（含名单为空＝接口挂）时回落登录时写入的 slug 标记；
	// 名单非空而标记不在其中 ⇒ 视为陈旧标记，丢弃
	try {
		const marker = sessionStorage.getItem('auth_dashboard_slug') ?? undefined;
		if (!marker) return undefined;
		return list.length === 0 || list.some((t) => (t.name || t.slug) === marker)
			? marker
			: undefined;
	} catch {
		return undefined;
	}
}

/**
 * 会话/租户 store。**品牌不在这里**——品牌归 `useTenantBrandingStore`（共享层），
 * 由 <BrandingInitializer/> 写入、`useBranding` 消费。此前这里另有一份 branding 分片
 * 与一套 module 级 localStorage 预读，与共享层重复，已删除；reset 时一并清共享 store，
 * 避免登出后仍套着上一个租户的品牌色。
 */
export const useTenantStore = create<TenantState>((set) => ({
	currentTenantId: null,
	tenants: [],

	setCurrentTenant: (tenantId) => set({ currentTenantId: tenantId }),
	setTenants: (tenants) => set({ tenants }),
	reset: () => {
		useTenantBrandingStore.getState().setBranding(null);
		set({ currentTenantId: null, tenants: [] });
	},
}));
