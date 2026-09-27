import { useEffect } from 'react';

const DEFAULT_SITE_NAME = 'Autional';

export function usePageTitle(title: string, siteName?: string) {
	const name = siteName || DEFAULT_SITE_NAME;
	useEffect(() => {
		const previous = document.title;
		document.title = title ? `${title} — ${name}` : name;
		return () => {
			document.title = previous;
		};
	}, [title, name]);
}
