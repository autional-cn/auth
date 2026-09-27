export function upsertMeta(
	attribute: string,
	value: string,
	attrName: 'name' | 'property' = 'name',
): () => void {
	const selector = `meta[${attrName}="${attribute}"]`;
	const el = document.querySelector<HTMLMetaElement>(selector);
	const previous = el?.content;

	if (el) {
		el.content = value;
	} else {
		const meta = document.createElement('meta');
		meta.setAttribute(attrName, attribute);
		meta.content = value;
		document.head.appendChild(meta);
		return () => {
			meta.remove();
		};
	}

	return () => {
		if (previous !== undefined) {
			el.content = previous;
		}
	};
}

export function upsertCanonical(href: string): () => void {
	let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
	const previous = link?.href;

	if (link) {
		link.href = href;
	} else {
		link = document.createElement('link');
		link.rel = 'canonical';
		link.href = href;
		document.head.appendChild(link);
		return () => {
			link!.remove();
		};
	}

	return () => {
		if (previous !== undefined && link) {
			link.href = previous;
		}
	};
}

export function upsertLink(
	rel: string,
	href: string,
	extraAttrs?: Record<string, string>,
): () => void {
	const selector = `link[rel="${rel}"]${extraAttrs?.hreflang ? `[hreflang="${extraAttrs.hreflang}"]` : ''}`;
	const existing = document.querySelector<HTMLLinkElement>(selector);
	const previous = existing?.href;

	if (existing) {
		existing.href = href;
		return () => {
			if (previous !== undefined) {
				existing.href = previous;
			}
		};
	} else {
		const link = document.createElement('link');
		link.rel = rel;
		link.href = href;
		if (extraAttrs) {
			Object.entries(extraAttrs).forEach(([k, v]) => link.setAttribute(k, v));
		}
		document.head.appendChild(link);
		return () => {
			link.remove();
		};
	}
}

export function injectJSONLD(schemas: object[]): () => void {
	schemas.forEach((schema, idx) => {
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.setAttribute('data-seo-jsonld', String(idx));
		script.textContent = JSON.stringify(schema);
		document.head.appendChild(script);
	});

	return () => {
		document.querySelectorAll('script[data-seo-jsonld]').forEach((el) => el.remove());
	};
}
