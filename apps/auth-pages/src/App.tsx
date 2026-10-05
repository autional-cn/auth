import { Routes, Route, Navigate } from 'react-router';
import { useAuthStore, RequireAuth, TenantIndexGuard, useLogout, OAuthCallbackPage as OAuthLoginCallbackPage, useBranding } from '@autional-cn/shared';
import { useEffect, lazy, Suspense } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
import { clearDashboardSlug, getDashboardSlug } from '@/lib/dashboard-slug';
import { ThemeProvider, ThemeToggle, LanguageSwitcher, ErrorBoundary } from '@autional-cn/ui';
import { AuthBrandingInitializer } from '@/components/auth/AuthBrandingInitializer';
import { AuthCard } from '@/components/auth/AuthCard';
import { EntryRouter } from '@/components/EntryRouter';
import { TenantIndexRedirect } from '@/components/TenantIndexRedirect';
import { TenantSwitchChip } from '@/components/TenantSwitchChip';

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
	// AUTH-40：裸 /logout 无 URL 租户段，用登录期锚定的 slug 标记补回租户上下文，
	// 与 dashboard 内嵌登出统一落点（可解析租户 → /<slug>/login；否则 brand 裸根）。
	const markerSlug = getDashboardSlug();
	const handleLogout = useLogout(
		markerSlug ? { returnUrl: `/${markerSlug}/dashboard` } : undefined,
	);
	useEffect(() => {
		handleLogout();
		// 登出即清跨 tab 的看板 slug 标记（AUTH-53 卫生：不留陈旧租户上下文）
		clearDashboardSlug();
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
				<a href="/" className="text-sm text-brand-text hover:underline">
					{t('notFound.back')}
				</a>
			</div>
		</AuthCard>
	);
}

function DashboardSlugRedirect() {
	const slug = getDashboardSlug();
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
	const chromeButtonClass =
		'rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700';
	return (
		<>
			{/* AUTH-11：SkipLink 须为 DOM 首停点（fixed 浮层按钮此前排在它前面） */}
			<SkipLink />
			{/* 右对齐浮层：chip 在左，主题/语言钉在右侧（新增 chip 不挪动既有按钮） */}
			<div className="fixed top-3 right-3 z-50 flex items-center gap-2">
				<TenantSwitchChip className={chromeButtonClass} />
				<ThemeToggle className={chromeButtonClass} />
				<LanguageSwitcher
					currentLang={lang}
					onToggle={(next) => setLang(next as 'zh-CN' | 'en-US')}
					className={chromeButtonClass}
				/>
			</div>
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
			<ThemeProvider storageKey="autional-auth-pages-theme">
				<AppContent />
				<AuthBrandingInitializer />
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
								{/* 入口：裸根 / 与 /login 统一由 EntryRouter 三分支收口（选品牌一律交棒 brand 站） */}
								<Route path="/" element={<EntryRouter />} />
								<Route path="/login" element={<EntryRouter />} />
								{/* Token-based routes (no slug needed) */}
								<Route path="/reset-password" element={<ResetPasswordPage />} />
								<Route path="/verify-email" element={<VerifyEmailPage />} />
								<Route path="/magic-link/confirm" element={<MagicLinkConfirmPage />} />
								<Route path="/reapply" element={<ReapplyPage />} />
								{/* AUTH-27：无应用内导航入口，定位为外部直链页（账户手机验证场景）；
								    租户上下文深链走下方 /:tenantSlug/verify-phone（与 verify-email 对称） */}
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
								{/* 裸 /<slug>（brand 落地目标）：先过租户白名单守卫，防未知 slug 被贪婪
								    渲染成 dashboard；白名单为空（名单接口挂）时放行，与其余门户同口径。
								    携 redirect 时 search 整串透传给登录页（U88，见 TenantIndexRedirect） */}
								<Route
									path="/:tenantSlug"
									element={
										<TenantIndexGuard notFound={<NotFoundPage />}>
											<TenantIndexRedirect />
										</TenantIndexGuard>
									}
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
								{/* AUTH-22：改密页调 authProtected 的 /auth/me/password，必须持会话；
								    匿名深链此前可直渲染表单（force 流程已改为登录期建会话后进入） */}
								<Route
									path="/:tenantSlug/change-password"
									element={
										<RequireAuth>
											<ChangePasswordPage />
										</RequireAuth>
									}
								/>
								<Route path="/:tenantSlug/magic-link/confirm" element={<MagicLinkConfirmPage />} />
								<Route path="/:tenantSlug/verify-email" element={<VerifyEmailPage />} />
								{/* AUTH-27：租户上下文手机验证深链（与 verify-email 对称，成功/返回落租户登录页） */}
								<Route path="/:tenantSlug/verify-phone" element={<VerifyPhonePage />} />
								{/* AUTH-50①：租户化 SSO 入口——useParams 取 slug 不再依赖裸链 */}
								<Route path="/:tenantSlug/sso/initiate" element={<SSOInitiatePage />} />
								{/* AUTH-48/49：脏 slug 不得把条款/隐私页租户化（未命中白名单 → 404 兜底） */}
								<Route
									path="/:tenantSlug/terms"
									element={
										<TenantIndexGuard notFound={<NotFoundPage />}>
											<TermsPage />
										</TenantIndexGuard>
									}
								/>
								<Route
									path="/:tenantSlug/privacy"
									element={
										<TenantIndexGuard notFound={<NotFoundPage />}>
											<PrivacyPage />
										</TenantIndexGuard>
									}
								/>

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
