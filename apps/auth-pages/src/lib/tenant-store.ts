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

// 同步从 localStorage 读取缓存的品牌配置 → 在 React 首次渲染前初始化 store
function loadInitialBranding(): Branding | null {
	try {
		const path = window.location.pathname;
		const segments = path.split('/').filter(Boolean);
		if (segments.length < 2) return null;
		const first = segments[0];
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
		if (NON_TENANT.has(first)) return null;
		const slug = first;

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
