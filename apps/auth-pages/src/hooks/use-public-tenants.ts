import { useQuery } from '@tanstack/react-query';
import { tenantPublicTenants } from '@autional/shared/generated/api';
import { extractList } from '@autional/shared';

export interface TenantOption {
	id: string;
	name: string;
	display_name?: string;
	displayName?: string;
	slug?: string;
}

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6h
const CACHE_KEY = 'public-tenants';

function getCachedData(): TenantOption[] | null {
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const entry = JSON.parse(raw);
		return entry.data;
	} catch {
		return null;
	}
}

function setCachedData(tenants: TenantOption[]): void {
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify({ data: tenants, _ts: Date.now() }));
	} catch {
		/* storage full */
	}
}

// Preload: sync read at module load
let preloaded: TenantOption[] | null = null;
if (typeof window !== 'undefined') {
	preloaded = getCachedData();
}

export function usePublicTenants() {
	const cached = getCachedData() ?? preloaded ?? null;

	return useQuery<TenantOption[]>({
		queryKey: [CACHE_KEY],
		queryFn: async () => {
			const res = await tenantPublicTenants();
			const items: TenantOption[] = extractList(res);
			setCachedData(items);
			return items;
		},
		staleTime: CACHE_TTL,
		gcTime: CACHE_TTL * 2,
		placeholderData: cached ?? undefined,
	});
}
