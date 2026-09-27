import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

const BASE_TITLE = 'Autional';

export function usePageTitle(i18nKey?: string, fallback?: string) {
	const { t } = useI18n();

	useEffect(() => {
		const title = i18nKey ? t(i18nKey) : fallback;
		document.title = title ? `${BASE_TITLE} — ${title}` : BASE_TITLE;

		return () => {
			document.title = BASE_TITLE;
		};
	}, [i18nKey, fallback, t]);
}
