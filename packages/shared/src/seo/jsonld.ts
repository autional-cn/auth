import type { BlogPostSchema } from './types';

export function getArticleSchema(post: BlogPostSchema, baseBlogUrl: string) {
	const article: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		datePublished: post.date,
		url: `${baseBlogUrl}/${post.slug}`,
	};

	if (post.author) {
		article.author = {
			'@type': 'Person',
			name: post.author,
		};
	}

	if (post.image) {
		article.image = post.image;
	}

	if (post.tags && post.tags.length > 0) {
		article.keywords = post.tags.join(', ');
	}

	return article;
}
