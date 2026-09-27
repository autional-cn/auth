// API
export { apiClient, createApiClient } from './api/client';
export {
	setTraceParentProvider,
	getTraceParentHeader,
	resetSessionTraceId,
	enableOtelBridge,
} from './api/trace';
export { bffLogin, bffRefresh, bffLogout, isBFFAvailable } from './api/bff-client';

// Auth
export {
	useAuthStore,
	getAccessToken,
	getRefreshToken,
	getCurrentTenantId,
	getCurrentRole,
	loginWithTokens,
	logout,
	isTokenExpired,
	refreshAccessToken,
} from './auth/store';
export { AuthService } from './auth/service';
export { generatePKCE, generateCodeChallenge } from './auth/pkce';
export type { PKCEPair } from './auth/pkce';
export { initiateOAuthLogin, handleOAuthCallback, isOAuthEnabled } from './auth/oauth-login';
export { buildLoginUrl } from './auth/roles';

// Types
export type {
	User,
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	Tenant,
	TenantMember,
	Role,
	Permission,
	Application,
	AuditLog,
	Session,
	Department,
	ListResponse,
	PageRequest,
	ApiError,
	ApiResponse,
} from './types';

// Hooks
export {
	useAuth,
	useAuthActions,
	useIsAuthenticated,
	useUser,
	useUserId,
	useAccessToken,
	useAuthPermissions,
	useCurrentTenantId,
	useTenants,
} from './hooks/useAuth';
export type { AuthSnapshot, AuthActions } from './hooks/useAuth';
export { usePermission } from './hooks/usePermission';
export type { PermissionResult } from './hooks/usePermission';
export { useLogout } from './hooks/useLogout';
export { useBootstrap } from './hooks/useBootstrap';
export type { BootstrapState } from './hooks/useBootstrap';
export { useSodMode, useIsAuditRestricted } from './hooks/useSodMode';
export type { SodMode } from './hooks/useSodMode';
export { useCurrentRole } from './hooks/useCurrentRole';

// Constants
export { API as API_PATHS } from './constants/api-paths';

// Config
export {
	getAUTH_PAGES_URL as AUTH_PAGES_URL,
	getAUTH_PAGES_URL,
	getADMIN_CONSOLE_URL as ADMIN_CONSOLE_URL,
	getADMIN_CONSOLE_URL,
	getDEVELOPER_PORTAL_URL as DEVELOPER_PORTAL_URL,
	getDEVELOPER_PORTAL_URL,
	getEND_USER_PORTAL_URL as END_USER_PORTAL_URL,
	getEND_USER_PORTAL_URL,
	getSECURITY_DASHBOARD_URL as SECURITY_DASHBOARD_URL,
	getSECURITY_DASHBOARD_URL,
	getSTATUS_PAGE_URL as STATUS_PAGE_URL,
	getSTATUS_PAGE_URL,
	getLANDING_SITE_URL as LANDING_SITE_URL,
	getLANDING_SITE_URL,
	getAUTHENTICATOR_APP_URL as AUTHENTICATOR_APP_URL,
	getAUTHENTICATOR_APP_URL,
	getTRUST_CENTER_URL as TRUST_CENTER_URL,
	getTRUST_CENTER_URL,
	getPLATFORM_CONSOLE_URL as PLATFORM_CONSOLE_URL,
	getPLATFORM_CONSOLE_URL,
	API_BASE_URL,
	BASE_PATH,
	ROUTER_BASENAME,
	getRouterBasename,
	VITE_BASE,
	appPath,
	navigateTo,
	crossAppUrl,
	isValidRedirect,
	// Portal URL resolver (VITE_PORTAL_CONFIG driven)
	getRootDomain,
	getPortalUrl,
	getAppPortalSlugs,
} from './config';
export {
	SITE_DOMAIN,
	SITE_EMAIL,
	SITE_BASE_URL,
	AUTH_DOMAIN,
	USER_DOMAIN,
	APP_DOMAIN,
	AUTHENTICATOR_DOMAIN,
	AUTH_BASE_URL,
	USER_BASE_URL,
	APP_BASE_URL,
	AUTHENTICATOR_BASE_URL,
	DEFAULT_OG_IMAGE,
	DEFAULT_LOGO,
} from './config/constants';

// SEO
export * from './seo';

// Components
export { RequireAuth } from './components/RequireAuth';
export { OAuthCallbackPage } from './components/OAuthCallbackPage';
export { TenantSlugProvider, useTenantSlug } from './auth/tenant-slug-context';
export { useTenantSlugFromUrl, extractSlugFromPath } from './auth/slug-from-url';
export { useOAuthClientIdFromUrl } from './auth/oauth-client-from-slug';
export {
	useTenantRoute,
	resolveEffectiveClientId,
	isSameDomainOAuth,
} from './auth/tenant-route-middleware';
export {
	usePermissionsQuery,
	useTenantsQuery,
	useMeQuery,
	AUTH_DATA_STALE_TIME,
} from './auth/auth-queries';
export { authQueryKeys } from './auth/auth-queries';
export type { TenantRouteResult } from './auth/tenant-route-middleware';
export {
	AdminGuard,
	UserMgmtGuard,
	SecurityGuard,
	SecurityAdminGuard,
	AuditorGuard,
	PlatformGuard,
	AuthGuard,
} from './components/PortalGuard';
export { AuditStatsOnly } from './components/AuditStatsOnly';
export { TenantIndexGuard, usePublicTenantSlugs } from './components/TenantIndexGuard';
export type { TenantIndexGuardProps } from './components/TenantIndexGuard';
export { buildTenantUrls } from './auth/build-tenant-urls';
export { resolvePortalBasename } from './config/resolve-basename';

// Generated (from @autional-cn/api-generated npm package)
export * as GeneratedApi from '@autional-cn/api-generated';
export * as GeneratedTypes from '@autional-cn/api-generated/types';
export * as ApiGenerated from '@autional-cn/api-generated';
export * as ApiTypes from '@autional-cn/api-generated/types';

// Lib
export { getVapidPublicKey, subscribeBrowserPush, unsubscribeBrowserPush } from './lib/push';

// Utils
export { urlBase64ToUint8Array } from './utils/browser';
export { camelCaseKeys, snakeCaseKeys } from './utils/case';
export { extractApiErrorMessage, extractApiError, createHandleApiError } from './utils/error';
export {
	extractList,
	extractItem,
	extractPagination,
	extractListResult,
	fetchList,
	fetchItem,
	fetchListResult,
} from './utils/response';
export { formatTime, formatDate, formatRelativeTime, setLocaleGetter } from './utils/format';
export { normalizeViteBase } from './utils/vite';
export {
	processPasswordForTransmission,
	hashPasswordForTransmission,
} from './utils/password-transmission';
export type { TransmissionResult } from './utils/password-transmission';
export type { ExtractedApiError } from './utils/error';
export type { PaginationInfo, ListResult } from './utils/response';
// force rebuild 1781616516
