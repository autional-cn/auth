export interface SiteSEOConfig {
	siteName?: string;
	baseUrl?: string;
	defaultOgImage?: string;
	hreflang?: boolean;
	hreflangLanguages?: string[];
	hreflangXDefault?: string;
}

export interface SEOConfig {
	title: string;
	description: string;
	ogImage?: string;
	canonical?: string;
	type?: 'website' | 'article';
	publishedTime?: string;
	author?: string;
	jsonld?: object[];
}

export interface BlogPostSchema {
	title: string;
	excerpt: string;
	date: string;
	author?: string;
	image?: string;
	slug: string;
	tags?: string[];
}
