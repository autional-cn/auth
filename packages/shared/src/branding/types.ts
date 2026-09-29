/** 租户公开品牌契约（与 tenant-service `GET /tenant/public/tenants/{slug}` 的 branding 段一致）。 */
export interface Branding {
	primaryColor: string;
	primaryColorDark?: string;
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
