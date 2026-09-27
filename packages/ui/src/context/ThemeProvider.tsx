import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
	theme: Theme;
	toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
	theme: 'light',
	toggle: () => {},
});

interface ThemeProviderProps {
	children: React.ReactNode;
	storageKey?: string;
}

export function ThemeProvider({ children, storageKey = 'authms-theme' }: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem(storageKey) as Theme;
			if (saved === 'dark' || saved === 'light') return saved;
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
		}
		return 'light';
	});

	useEffect(() => {
		const root = document.documentElement;
		if (theme === 'dark') {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
		root.setAttribute('data-theme', theme);
	}, [theme]);

	const toggle = useCallback(() => {
		setTheme((prev) => {
			const next = prev === 'dark' ? 'light' : 'dark';
			localStorage.setItem(storageKey, next);
			return next;
		});
	}, [storageKey]);

	return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	return useContext(ThemeContext);
}
