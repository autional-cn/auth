'use client';

import { useLayoutEffect, useRef } from 'react';
import { useTenantSlugFromUrl } from '../auth/slug-from-url';
import { deriveDarkColor, deriveDarkHover, pickOnColor } from './brand-color';
import { readCachedBranding } from './branding-cache';
import { useTenantBrandingStore } from './tenant-store';

/** 品牌注入的 7 个 CSS 变量（与 auth 站同口径，tokens.css 提供缺省值）。 */
const BRAND_VARS = [
	'--color-brand-base',
	'--color-brand-hover-base',
	'--color-brand-dark',
	'--color-brand-dark-hover',
	'--color-on-brand-base',
	'--color-on-brand',
	'--color-on-brand-dark',
];

export function applyBrandColors(color: string, darkOverride?: string): void {
	const root = document.documentElement;
	if (!color) {
		BRAND_VARS.forEach((v) => root.style.removeProperty(v));
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

/**
 * 把当前租户品牌落到 DOM（CSS 变量 / favicon / customCss）。
 * 需与 `<BrandingInitializer/>` 同时挂载：前者负责写 store，这里负责呈现。
 */
export function useBranding(): void {
	const branding = useTenantBrandingStore((s) => s.branding);
	const slug = useTenantSlugFromUrl();
	const styleRef = useRef<HTMLStyleElement | null>(null);
	const primedSlugRef = useRef<string | null>(null);

	// 首帧前用缓存上色，避免默认品牌色闪一下
	useLayoutEffect(() => {
		if (!slug || primedSlugRef.current === slug) return;
		primedSlugRef.current = slug;
		const cached = readCachedBranding(slug);
		applyBrandColors(cached?.primaryColor ?? '', cached?.primaryColorDark);
	}, [slug]);

	useLayoutEffect(() => {
		if (!branding) {
			applyBrandColors('');
			return;
		}

		applyBrandColors(branding.primaryColor, branding.primaryColorDark);

		if (branding.faviconUrl) {
			let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
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
			applyBrandColors('');
			if (styleRef.current) styleRef.current.textContent = '';
		};
	}, [branding]);
}
