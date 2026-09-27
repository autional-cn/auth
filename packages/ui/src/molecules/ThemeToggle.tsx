import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';

interface ThemeToggleProps {
	className?: string;
	iconSize?: number;
	labelLight?: string;
	labelDark?: string;
}

export function ThemeToggle({
	className = '',
	iconSize = 18,
	labelLight,
	labelDark,
}: ThemeToggleProps) {
	const { theme, toggle } = useTheme();
	const isDark = theme === 'dark';
	const label = isDark ? labelLight || '切换到浅色模式' : labelDark || '切换到深色模式';

	return (
		<button
			onClick={toggle}
			className={`rounded-md transition-colors ${className}`}
			title={label}
			aria-label={label}
		>
			{isDark ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
		</button>
	);
}
