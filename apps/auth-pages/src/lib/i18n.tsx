import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '@/i18n/config';

type Lang = 'zh-CN' | 'en-US';

const defaultLang: Lang = 'zh-CN';

function syncHtmlLang(lng: string) {
	document.documentElement.lang = lng === 'en-US' ? 'en' : 'zh-CN';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const { i18n } = useTranslation();

	useEffect(() => {
		// 同步初始 lang
		syncHtmlLang(i18n.language);

		// 监听语言变化并同步 <html lang>
		const onLanguageChanged = (lng: string) => syncHtmlLang(lng);
		i18n.on('languageChanged', onLanguageChanged);

		// 从 localStorage 恢复
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('lang') as Lang | null;
			if (stored && stored !== i18n.language) {
				i18n.changeLanguage(stored);
			}
		}

		return () => {
			i18n.off('languageChanged', onLanguageChanged);
		};
	}, []);

	return <>{children}</>;
}

export function useI18n() {
	const { t, i18n } = useTranslation();

	return {
		lang: i18n.language as Lang,
		// 第二参数支持两种形式:
		//   - Record<string, unknown> 插值变量（如 { time: ... }）
		//   - string 默认文案（key 无翻译时的兜底，等价于 { defaultValue }）
		t: (key: string, options?: Record<string, unknown> | string) => {
			const isDefaultText = typeof options === 'string';
			const tOptions = isDefaultText ? { defaultValue: options } : options;
			const result = t(`flat.${key}`, tOptions);
			// flat 前缀未命中（返回了 key 本身或默认文案）→ 尝试无前缀 key
			if (result === `flat.${key}` || (isDefaultText && result === options)) {
				return t(key, tOptions);
			}
			return result;
		},
		setLang: (lang: Lang) => {
			i18n.changeLanguage(lang);
			if (typeof window !== 'undefined') {
				localStorage.setItem('lang', lang);
			}
		},
	};
}

export { defaultLang };
