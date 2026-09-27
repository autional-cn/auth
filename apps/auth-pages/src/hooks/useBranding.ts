import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useTenantStore } from '@/lib/tenant-store';
import { deriveDarkColor, deriveDarkHover, pickOnColor } from '@/lib/brand-color';

// 从路径中提取租户 slug（通用方案：第一个非路由关键字的段）
function extractSlugFromPath(path: string): string | null {
	const segments = path.split('/').filter(Boolean);
	if (segments.length < 2) return null;
	const first = segments[0];
	// 已知的非租户根路由（不是 tenant 前缀）
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
	return first;
}

function applyBrandingFromCache(slug: string) {
	try {
		// 先读新 key (page-init:tenant-branding:)，再读旧 key (tenant-branding:)
		const newKey = `page-init:tenant-branding:${slug}`;
		const legacyKey = `tenant-branding:${slug}`;
		const raw = localStorage.getItem(newKey) ?? localStorage.getItem(legacyKey);
		if (raw) {
			const branding = JSON.parse(raw);
			const data = branding?.data ?? branding; // 兼容 {data, _ts} 结构
			if (data?.primaryColor) {
				applyColors(data.primaryColor, data.primaryColorDark);
				return;
			}
		}
		// Fallback: auth-config cache may have branding
		const configRaw =
			localStorage.getItem(`page-init:auth-config:${slug}`) ??
			localStorage.getItem(`auth-config:${slug}`);
		if (configRaw) {
			const config = JSON.parse(configRaw);
			const b = config.data?.branding;
			if (b?.primaryColor) {
				applyColors(b.primaryColor, b.primaryColorDark);
				return;
			}
		}
		// No cache → reset to brand default
		applyColors('');
	} catch {
		/* ignore */
	}
}

function applyColors(color: string, darkOverride?: string) {
	const root = document.documentElement;
	const clear = () =>
		[
			'--color-brand-base',
			'--color-brand-hover-base',
			'--color-brand-dark',
			'--color-brand-dark-hover',
			'--color-on-brand-base',
			'--color-on-brand',
			'--color-on-brand-dark',
		].forEach((p) => root.style.removeProperty(p));
	if (!color) {
		clear();
		return;
	}
	const dark = darkOverride || deriveDarkColor(color);
	root.style.setProperty('--color-brand-base', color);
	root.style.setProperty('--color-brand-hover-base', color);
	root.style.setProperty('--color-brand-dark', dark);
	root.style.setProperty('--color-brand-dark-hover', deriveDarkHover(color));
	root.style.setProperty('--color-on-brand-base', pickOnColor(color));
	root.style.setProperty('--color-on-brand-dark', pickOnColor(dark));
}

// 同步执行: 在模块加载时立即设置缓存的品牌色（页面首次加载）
if (typeof window !== 'undefined') {
	const slug = extractSlugFromPath(window.location.pathname);
	if (slug) applyBrandingFromCache(slug);
}

export function useBranding() {
	const branding = useTenantStore((s) => s.branding);
	const location = useLocation();
	const styleRef = useRef<HTMLStyleElement | null>(null);

	// SPA 路由切换时: 同步从缓存取品牌色，避免异步导致的闪烁
	const prevSlugRef = useRef<string | null>(null);
	const currentSlug = extractSlugFromPath(location.pathname);

	// 路由变化时立即应用缓存品牌色
	if (currentSlug && currentSlug !== prevSlugRef.current) {
		prevSlugRef.current = currentSlug;
		applyBrandingFromCache(currentSlug);
	}

	useEffect(() => {
		if (!branding) return;

		// applyColors 内部已处理空串 → clear 全部注入变量（回落到 tokens.css 品牌默认）
		applyColors(branding.primaryColor, branding.primaryColorDark);

		if (branding.faviconUrl) {
			let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
			if (!favicon) {
				favicon = document.createElement('link');
				favicon.rel = 'icon';
				document.head.appendChild(favicon);
			}
			favicon.href = branding.faviconUrl;
		}

		if (branding.customCss) {
			if (!styleRef.current) {
				styleRef.current = document.createElement('style');
				styleRef.current.setAttribute('data-tenant-css', '');
				document.head.appendChild(styleRef.current);
			}
			styleRef.current.textContent = branding.customCss;
		}

		return () => {
			applyColors(''); // clear 全部注入变量，回落到品牌默认
			if (styleRef.current) {
				styleRef.current.textContent = '';
			}
		};
	}, [branding]);
}
