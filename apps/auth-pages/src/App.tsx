import { Routes, Route, Navigate, useSearchParams } from 'react-router';
import {
	useAuthStore,
	RequireAuth,
	AUTH_PAGES_URL,
	useLogout,
	OAuthCallbackPage as OAuthLoginCallbackPage,
} from '@autional-cn/shared';
import { useEffect, lazy, Suspense } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
import { ThemeProvider, ThemeToggle, LanguageSwitcher, ErrorBoundary } from '@autional-cn/ui';
import { useBranding } from '@/hooks/useBranding';
import { BrandingInitializer } from '@/components/auth/BrandingInitializer';
import { AuthCard } from '@/components/auth/AuthCard';

// Pages — route-level code splitting via React.lazy
const LoginPage = lazy(() => import('./app/page'));
const RegisterPage = lazy(() => import('./app/register/page'));
const ChangePasswordPage = lazy(() => import('./app/change-password/page'));
const ForgotPasswordPage = lazy(() => import('./app/forgot-password/page'));
const ResetPasswordPage = lazy(() => import('./app/reset-password/page'));
const VerifyEmailPage = lazy(() => import('./app/verify-email/page'));
const VerifyPhonePage = lazy(() => import('./app/verify-phone/page'));
const MFAChallengePage = lazy(() => import('./app/mfa-challenge/page'));
const MFASetupPage = lazy(() => import('./app/mfa-setup/page'));
const OAuthAuthorizePage = lazy(() => import('./app/oauth/authorize/page'));
const OAuthCallbackPage = lazy(() => import('./app/oauth/callback/page'));
const SSOInitiatePage = lazy(() => import('./app/sso/initiate/page'));
const PasskeyPage = lazy(() => import('./app/passkey/page'));
const ErrorPage = lazy(() => import('./app/error/page'));
const AccountDeletionPage = lazy(() => import('./app/account-deletion/page'));
const AccountPage = lazy(() => import('./app/account/page'));
const DashboardPage = lazy(() => import('./app/dashboard/page'));
const ReapplyPage = lazy(() => import('./app/reapply/page'));
const RecoverAccountPage = lazy(() => import('./app/recover-account/page'));
const MagicLinkConfirmPage = lazy(() => import('./app/magic-link/confirm/page'));
const SelectTenantPage = lazy(() => import('./app/select-tenant/page'));
const VerifyIdentityPage = lazy(() => import('./app/verify-identity/page'));
const TermsPage = lazy(() => import('./app/terms/page'));
const PrivacyPage = lazy(() => import('./app/privacy/page'));
// CookieConsentBanner — 已隐藏 (2026-07-29)
// 隐藏原因:
//   1. 应用零 cookie 使用 — 整个项目无 document.cookie 调用
//   2. analytics 开关有 UI 但无实际追踪代码消费该值
//   3. 存储使用 Zustand persist → localStorage，非 cookie
//   4. 条文中文字样误导用户（"Cookie 偏好"），实际不涉及任何 cookie
// 保留依据:
//   - 如需将来接入 cookie 合规（如 Google Analytics），取消注释即可恢复
//   - i18n 翻译键（cookie.*）和组件文件均保留，恢复时零改动
//   - Zustand store + 已存用户的 consent 数据不受影响
// import { CookieConsentBanner } from '@/components/ui/CookieConsentBanner';
import { SessionExpiryBanner } from '@/components/ui/SessionExpiryBanner';
import { useAnalyticsLoader } from '@/hooks/use-analytics-loader';

function AnalyticsInit() {
	useAnalyticsLoader();
	return null;
}

function LogoutHandler() {
	const handleLogout = useLogout();
	useEffect(() => {
		handleLogout();
	}, [handleLogout]);
	return null;
}

function NotFoundPage() {
	const { t } = useI18n();
	return (
		<AuthCard>
			<div className="text-center space-y-4">
				<h1 className="text-6xl font-bold text-[var(--color-text-muted)]">404</h1>
				<p className="text-lg text-[var(--color-text-secondary)]">{t('notFound.404')}</p>
				<a href="/" className="text-sm text-[var(--color-brand)] hover:underline">
					{t('notFound.back')}
				</a>
			</div>
		</AuthCard>
	);
}

function RedirectToSelectTenant() {
	const [searchParams] = useSearchParams();
	const qs = searchParams.toString();
	const to = '/' + (qs ? '?' + qs : '');
	return <Navigate to={to} replace />;
}

function DashboardSlugRedirect() {
	const slug = sessionStorage.getItem('auth_dashboard_slug');
	const to = slug ? `/${slug}/dashboard` : '/';
	return (
		<RequireAuth>
			<Navigate to={to} replace />
		</RequireAuth>
	);
}

function SkipLink() {
	const { t } = useI18n();
	return (
		<a
			href="#main-content"
			className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
		>
			{t('auth.common.skipToMain')}
		</a>
	);
}

function AppHeader() {
	const { lang, setLang } = useI18n();
	return (
		<>
			<LanguageSwitcher
				currentLang={lang}
				onToggle={(next) => setLang(next as 'zh-CN' | 'en-US')}
				className="fixed top-3 right-3 z-50 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700"
			/>
			<ThemeToggle className="fixed top-3 right-16 z-50 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700" />
			<SkipLink />
		</>
	);
}

function AppContent() {
	useBranding();
	return null;
}

export default function App() {
	return (
		<I18nProvider>
			<ThemeProvider storageKey="authms-auth-pages-theme">
				<AppContent />
				<BrandingInitializer />
				<AppHeader />
				{/* CookieConsentBanner 已隐藏 — 见 import 注释 */}
				<AnalyticsInit />
				<SessionExpiryBanner />
				<ErrorBoundary devMode={import.meta.env.DEV}>
					<Suspense
						fallback={
							<div className="flex min-h-screen items-center justify-center">
								<div className="text-neutral-500">Loading…</div>
							</div>
						}
					>
						<div id="main-content">
							<Routes>
								{/* OAuth callback for dev-mode login on localhost */}
								<Route path="/oauth/callback" element={<OAuthLoginCallbackPage />} />
								<Route path="/oauth/api/v1/oauth/authorize" element={<OAuthAuthorizePage />} />
								<Route
									path="/oauth/api/v1/oauth/callback/:provider"
									element={<OAuthCallbackPage />}
								/>
								{/* Home */}
								<Route path="/" element={<SelectTenantPage />} />
								<Route path="/login" element={<RedirectToSelectTenant />} />
								{/* Token-based routes (no slug needed) */}
								<Route path="/reset-password" element={<ResetPasswordPage />} />
								<Route path="/magic-link/confirm" element={<MagicLinkConfirmPage />} />
								<Route path="/reapply" element={<ReapplyPage />} />
								<Route path="/verify-phone" element={<VerifyPhonePage />} />
								<Route path="/sso/initiate" element={<SSOInitiatePage />} />
								<Route path="/error" element={<ErrorPage />} />
								<Route path="/logout" element={<LogoutHandler />} />
								<Route path="/terms" element={<TermsPage />} />
								<Route path="/privacy" element={<PrivacyPage />} />

								{/* Protected routes */}
								<Route path="/mfa-challenge" element={<MFAChallengePage />} />
								<Route path="/mfa" element={<Navigate to="/mfa-challenge" replace />} />
								<Route path="/:tenantSlug/mfa-challenge" element={<MFAChallengePage />} />
								<Route
									path="/:tenantSlug/mfa"
									element={<Navigate to="../mfa-challenge" replace />}
								/>
								<Route
									path="/:tenantSlug/dashboard"
									element={
										<RequireAuth>
											<DashboardPage />
										</RequireAuth>
									}
								/>
								<Route path="/dashboard" element={<DashboardSlugRedirect />} />
								<Route
									path="/mfa-setup"
									element={
										<RequireAuth>
											<MFASetupPage />
										</RequireAuth>
									}
								/>
								<Route
									path="/:tenantSlug/mfa-setup"
									element={
										<RequireAuth>
											<MFASetupPage />
										</RequireAuth>
									}
								/>
								<Route
									path="/passkey"
									element={
										<RequireAuth>
											<PasskeyPage />
										</RequireAuth>
									}
								/>
								<Route
									path="/:tenantSlug/passkey"
									element={
										<RequireAuth>
											<PasskeyPage />
										</RequireAuth>
									}
								/>
								<Route
									path="/account-deletion"
									element={
										<RequireAuth>
											<AccountDeletionPage />
										</RequireAuth>
									}
								/>
								<Route
									path="/:tenantSlug/account-deletion"
									element={
										<RequireAuth>
											<AccountDeletionPage />
										</RequireAuth>
									}
								/>
								<Route
									path="/account"
									element={
										<RequireAuth>
											<AccountPage />
										</RequireAuth>
									}
								/>
								<Route
									path="/:tenantSlug/account"
									element={
										<RequireAuth>
											<AccountPage />
										</RequireAuth>
									}
								/>
								<Route
									path="/verify-identity"
									element={
										<RequireAuth>
											<VerifyIdentityPage />
										</RequireAuth>
									}
								/>
								<Route
									path="/:tenantSlug/verify-identity"
									element={
										<RequireAuth>
											<VerifyIdentityPage />
										</RequireAuth>
									}
								/>

								{/* Tenant-scoped routes — after static routes to avoid capturing slugs */}
								<Route path="/:tenantSlug/login" element={<LoginPage />} />
								<Route path="/:tenantSlug/register" element={<RegisterPage />} />
								<Route path="/:tenantSlug/reapply" element={<ReapplyPage />} />
								<Route path="/:tenantSlug/forgot-password" element={<ForgotPasswordPage />} />
								<Route path="/:tenantSlug/recover-account" element={<RecoverAccountPage />} />
								<Route path="/:tenantSlug/change-password" element={<ChangePasswordPage />} />
								<Route path="/:tenantSlug/magic-link/confirm" element={<MagicLinkConfirmPage />} />
								<Route path="/:tenantSlug/verify-email" element={<VerifyEmailPage />} />
								<Route path="/:tenantSlug/terms" element={<TermsPage />} />
								<Route path="/:tenantSlug/privacy" element={<PrivacyPage />} />

								{/* 404 */}
								<Route path="*" element={<NotFoundPage />} />
							</Routes>
						</div>
					</Suspense>
				</ErrorBoundary>
			</ThemeProvider>
		</I18nProvider>
	);
}
