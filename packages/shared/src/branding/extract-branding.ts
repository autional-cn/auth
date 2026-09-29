import type { Branding } from './types';

/** 从 public tenant 接口响应里取 branding 段（兼容 snake_case / camelCase，且兼容已解包的对象）。 */
export function extractBranding(raw: unknown): Branding | null {
	if (!raw || typeof raw !== 'object') return null;
	const record = raw as Record<string, unknown>;
	const source = (record.branding ?? record) as Record<string, string | undefined>;
	if (!source || typeof source !== 'object') return null;

	const logoUrl = source.logo_url || source.logoUrl || '';
	const primaryColor = source.primary_color || source.primaryColor || '';
	if (!logoUrl && !primaryColor) return null;

	return {
		primaryColor,
		primaryColorDark: source.primary_color_dark || source.primaryColorDark || undefined,
		logoUrl,
		faviconUrl: source.favicon_url || source.faviconUrl || '',
		customCss: source.custom_css || source.customCss || '',
		secondaryColor: source.secondary_color || source.secondaryColor || undefined,
		companyName: source.company_name || source.companyName || undefined,
		loginPageTitle: source.login_page_title || source.loginPageTitle || undefined,
		loginPageDescription: source.login_page_description || source.loginPageDescription || undefined,
		privacyPolicyUrl: source.privacy_policy_url || source.privacyPolicyUrl || undefined,
		termsOfServiceUrl: source.terms_of_service_url || source.termsOfServiceUrl || undefined,
	};
}
