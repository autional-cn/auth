import { create } from 'zustand';

interface Tenant {
	tenantId: string;
	tenantName: string;
	role: 'owner' | 'admin' | 'member';
	logoUrl?: string;
}

export interface Branding {
	primaryColor: string;
	primaryColorDark?: string; // ← 新增，仅类型透传，store 不校验字段
	logoUrl: string;
	faviconUrl: string;
	customCss: string;
	secondaryColor?: string;
	companyName?: string;
	loginPageTitle?: string;
	loginPageDescription?: string;
	privacyPolicyUrl?: string;
	termsOfServiceUrl?: string;
}

interface TenantState {
	currentTenantId: string | null;
	tenants: Tenant[];
	branding: Branding | null;

	setCurrentTenant: (tenantId: string) => void;
	setTenants: (tenants: Tenant[]) => void;
	setBranding: (branding: Branding | null) => void;
	reset: () => void;
}

/** 非租户首段（auth-pages 自身的静态路由）—— 首段命中则当前路径无租户上下文 */
const NON_TENANT = new Set([
	'oauth',
	'login',
	'register',
	'forgot-password',
	'reset-password',
	'terms',
	'privacy',
	'error',
	'logout',
	'passkey',
	'reapply',
	'mfa',
	'account',
	'dashboard',
	'magic-link',
	'verify-email',
	'verify-phone',
	'mfa-challenge',
	'mfa-setup',
	'change-password',
	'recover-account',
	'account-deletion',
	'verify-identity',
	'sso',
]);

/**
 * 从 auth-pages 自身路径解析租户 slug（`/{slug}/{route}` 形状，至少两段）。
 * 与品牌预热同口径 —— 裸 `/{slug}` 视为无上下文（该路径会立即转向 dashboard）。
 */
export function tenantSlugFromPath(pathname: string): string | undefined {
	const segments = pathname.split('/').filter(Boolean);
	if (segments.length < 2) return undefined;
	const first = segments[0];
	if (NON_TENANT.has(first)) return undefined;
	return first;
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

// 同步从 localStorage 读取缓存的品牌配置 → 在 React 首次渲染前初始化 store
function loadInitialBranding(): Branding | null {
	try {
		const slug = tenantSlugFromPath(window.location.pathname);
		if (!slug) return null;

		// 优先用 tenant-branding cache（先读新 key，再读旧 key）
		const newBrandKey = 'page-init:tenant-branding:' + slug;
		const legacyBrandKey = 'tenant-branding:' + slug;
		const raw = localStorage.getItem(newBrandKey) ?? localStorage.getItem(legacyBrandKey);
		if (raw) {
			const parsed = JSON.parse(raw);
			return (parsed?.data ?? parsed) as Branding;
		}

		// 回退到 auth-config cache
		const newConfigKey = 'page-init:auth-config:' + slug;
		const legacyConfigKey = 'auth-config:' + slug;
		const configRaw = localStorage.getItem(newConfigKey) ?? localStorage.getItem(legacyConfigKey);
		if (configRaw) {
			const config = JSON.parse(configRaw);
			const b = config.data?.branding;
			if (b) {
				return {
					primaryColor: b.primaryColor || b.primary_color || '',
					primaryColorDark: b.primaryColorDark || b.primary_color_dark || undefined,
					logoUrl: b.logoUrl || b.logo_url || '',
					faviconUrl: b.faviconUrl || b.favicon_url || '',
					customCss: b.customCss || b.custom_css || '',
					secondaryColor: b.secondaryColor || b.secondary_color,
					companyName: b.companyName || b.company_name,
					loginPageTitle: b.loginPageTitle || b.login_page_title,
					loginPageDescription: b.loginPageDescription || b.login_page_description,
					privacyPolicyUrl: b.privacyPolicyUrl || b.privacy_policy_url,
					termsOfServiceUrl: b.termsOfServiceUrl || b.terms_of_service_url,
				};
			}
		}
		return null;
	} catch {
		return null;
	}
}

const initialBranding = typeof window !== 'undefined' ? loadInitialBranding() : null;

export const useTenantStore = create<TenantState>((set) => ({
	currentTenantId: null,
	tenants: [],
	branding: initialBranding,

	setCurrentTenant: (tenantId) => set({ currentTenantId: tenantId }),
	setTenants: (tenants) => set({ tenants }),
	setBranding: (branding) => set({ branding }),
	reset: () => set({ currentTenantId: null, tenants: [], branding: null }),
}));
