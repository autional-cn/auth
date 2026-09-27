import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Locale files use dot-separated keys at root level (e.g. "login.title", "auth.login.passwordTab").
// Both formats coexist: legacy keys from the original nested structure have "auth." prefix;
// newer keys from the flat migration omit it.
// The default keySeparator '.' is used so i18next traverses the nested object paths correctly.
// IMPORTANT: When adding new locale keys, prefer the dot-separated nested format
// (e.g. { "login": { "title": "..." } } over { "login.title": "..." }).
// Both work, but nested is more maintainable.
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			'zh-CN': { translation: zhCN },
			'en-US': { translation: enUS },
		},
		fallbackLng: 'zh-CN',
		// keySeparator: false means dots in keys are treated as literal characters,
		// not path separators. Required because locale files contain flat keys like
		// "auth.login.passwordTab" alongside nested keys like { login: { title: "..." } }.
		// Both formats coexist due to the mixed migration from nested to flat structure.
		// DO NOT REMOVE this setting without also restructuring ALL locale files and
		// ALL component t() calls to use consistent key format.
		keySeparator: false,
		interpolation: { escapeValue: false },
		detection: {
			order: ['querystring', 'localStorage', 'navigator'],
			caches: ['localStorage'],
			lookupQuerystring: 'lang',
		},
	});

export default i18n;
