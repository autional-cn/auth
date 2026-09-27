import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
	className?: string;
	labelEn?: string;
	labelZh?: string;
	showIcon?: boolean;
	currentLang?: string;
	onToggle?: (nextLang: string) => void;
}

export function LanguageSwitcher({
	className = '',
	labelEn,
	labelZh,
	showIcon = false,
	currentLang,
	onToggle,
}: LanguageSwitcherProps) {
	const { i18n } = useTranslation();
	const lang = currentLang ?? i18n.language;

	const toggle = () => {
		const next = lang === 'zh-CN' ? 'en-US' : 'zh-CN';
		if (onToggle) {
			onToggle(next);
		} else {
			i18n.changeLanguage(next);
		}
	};

	return (
		<button type="button" onClick={toggle} className={`text-xs transition-colors ${className}`}>
			{showIcon && <Globe className="h-3.5 w-3.5 shrink-0" />}
			{lang === 'zh-CN' ? labelEn || 'EN' : labelZh || '中文'}
		</button>
	);
}
