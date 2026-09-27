import { useEffect } from 'react';

export function usePageMeta(description: string) {
	useEffect(() => {
		let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
		const previous = meta?.content;
		if (!meta) {
			meta = document.createElement('meta');
			meta.name = 'description';
			document.head.appendChild(meta);
		}
		meta.content = description;
		return () => {
			if (meta && previous !== undefined) meta.content = previous;
		};
	}, [description]);
}
