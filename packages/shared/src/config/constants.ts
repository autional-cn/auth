// Build-time domain constants (used by Astro SSG for SEO meta tags).
// For runtime resolution, use getRootDomain() + getPortalUrl() from ./index.
// Override via SITE_DOMAIN env var for multi-environment builds.

function getEnv(key: string, fallback: string): string {
	try {
		const val = (import.meta as any).env?.[key];
		if (val) return val;
	} catch {
		/* SSR may not have import.meta */
	}
	return fallback;
}

export const SITE_DOMAIN = getEnv('SITE_DOMAIN', 'iam.tianv.com');
export const SITE_EMAIL = getEnv('SITE_EMAIL', 'support@autional.net');
export const SITE_BASE_URL = `https://${SITE_DOMAIN}`;
export const AUTH_DOMAIN = `auth.${SITE_DOMAIN}`;
export const USER_DOMAIN = `user.${SITE_DOMAIN}`;
export const APP_DOMAIN = `app.${SITE_DOMAIN}`;
export const AUTHENTICATOR_DOMAIN = `authenticator.${SITE_DOMAIN}`;
export const AUTH_BASE_URL = `https://${AUTH_DOMAIN}`;
export const USER_BASE_URL = `https://${USER_DOMAIN}`;
export const APP_BASE_URL = `https://${APP_DOMAIN}`;
export const AUTHENTICATOR_BASE_URL = `https://${AUTHENTICATOR_DOMAIN}`;
export const DEFAULT_OG_IMAGE = `${SITE_BASE_URL}/og-image.svg`;
export const DEFAULT_LOGO = `${SITE_BASE_URL}/logo.png`;
