export function normalizeViteBase(p: string | undefined): string {
	if (!p || p === '/') return '/';
	return p.replace(/\/$/, '') + '/';
}
