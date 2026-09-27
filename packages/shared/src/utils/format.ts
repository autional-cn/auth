let localeGetter: (() => string) | null = null;

export function setLocaleGetter(fn: () => string) {
	localeGetter = fn;
}

function getLocale(): string {
	if (localeGetter) return localeGetter();
	return 'zh-CN';
}

export function formatTime(iso: string | undefined | null, locale?: string): string {
	if (!iso) return '--';
	try {
		const d = new Date(iso);
		if (isNaN(d.getTime())) return iso;
		return d.toLocaleString(locale || getLocale(), {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});
	} catch {
		return iso;
	}
}

export function formatDate(iso: string | undefined | null, locale?: string): string {
	if (!iso) return '--';
	try {
		const d = new Date(iso);
		if (isNaN(d.getTime())) return iso;
		return d.toLocaleDateString(locale || getLocale(), {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
	} catch {
		return iso;
	}
}

export function formatRelativeTime(iso: string | undefined | null, locale?: string): string {
	if (!iso) return '--';
	try {
		const d = new Date(iso);
		if (isNaN(d.getTime())) return iso;
		const now = Date.now();
		const diff = now - d.getTime();
		const mins = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return formatDate(iso, locale);
	} catch {
		return iso;
	}
}
