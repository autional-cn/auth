import { useEffect } from 'react';
import type { SEOConfig, SiteSEOConfig } from './types';
import { upsertMeta, upsertCanonical, upsertLink, injectJSONLD } from './dom-utils';
import { SITE_BASE_URL, DEFAULT_OG_IMAGE } from '../config/constants';

const DEFAULTS: Required<SiteSEOConfig> = {
	siteName: 'Autional',
	baseUrl: SITE_BASE_URL,
	defaultOgImage: DEFAULT_OG_IMAGE,
	hreflang: false,
	hreflangLanguages: ['zh', 'en'],
	hreflangXDefault: `${SITE_BASE_URL}/zh/`,
};

export function useSEO(config: SEOConfig, siteConfig?: SiteSEOConfig) {
	const s = { ...DEFAULTS, ...siteConfig };
	const { title, description, ogImage, canonical, type, publishedTime, author, jsonld } = {
		ogImage: s.defaultOgImage,
		type: 'website' as const,
		...config,
	};

	useEffect(() => {
		const pageTitle = title ? `${title} — ${s.siteName}` : s.siteName;
		const prevTitle = document.title;
		document.title = pageTitle;

		const cleanups: (() => void)[] = [];

		if (s.hreflang) {
			try {
				const currentPath = window.location.pathname;
				const pathMatch = currentPath.match(/^\/(zh|en)(\/.*)?$/);
				if (pathMatch) {
					const pagePath = pathMatch[2] || '/';
					for (const lang of s.hreflangLanguages) {
						const url = `${s.baseUrl}/${lang}${pagePath === '/' ? '' : pagePath}`;
						cleanups.push(upsertLink('alternate', url, { hreflang: lang }));
					}
					cleanups.push(upsertLink('alternate', s.hreflangXDefault, { hreflang: 'x-default' }));
				}
			} catch {
				/* SSR-safe */
			}
		}

		cleanups.push(upsertMeta('description', description));
		cleanups.push(upsertMeta('og:title', pageTitle, 'property'));
		cleanups.push(upsertMeta('og:description', description, 'property'));
		cleanups.push(upsertMeta('og:image', ogImage, 'property'));
		cleanups.push(upsertMeta('og:type', type, 'property'));
		cleanups.push(upsertMeta('og:url', canonical || window.location.href, 'property'));
		cleanups.push(upsertMeta('twitter:card', 'summary_large_image'));
		cleanups.push(upsertMeta('twitter:title', pageTitle));
		cleanups.push(upsertMeta('twitter:description', description));
		cleanups.push(upsertMeta('twitter:image', ogImage));

		if (type === 'article' && publishedTime) {
			cleanups.push(upsertMeta('article:published_time', publishedTime, 'property'));
		}
		if (type === 'article' && author) {
			cleanups.push(upsertMeta('article:author', author, 'property'));
		}

		if (canonical) {
			cleanups.push(upsertCanonical(canonical));
		}

		let cleanupJSONLD: (() => void) | undefined;
		if (jsonld && jsonld.length > 0) {
			cleanupJSONLD = injectJSONLD(jsonld);
		}

		return () => {
			document.title = prevTitle;
			cleanups.forEach((fn) => fn());
			cleanupJSONLD?.();
		};
	}, [title, description, ogImage, canonical, type, publishedTime, author, JSON.stringify(jsonld)]);
}
