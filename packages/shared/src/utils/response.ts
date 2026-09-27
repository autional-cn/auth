/**
 * Standardized API response unwrapping utilities.
 * Replaces ad-hoc `res?.data?.items ?? res?.data ?? []` patterns across all apps.
 */

export interface PaginationInfo {
	page: number;
	pageSize: number;
	total: number;
}

export interface ListResult<T> {
	items: T[];
	pagination: PaginationInfo;
}

export function extractList<T = Record<string, any>>(res: unknown): T[] {
	if (!res) return [];
	if (Array.isArray(res)) return res as T[];
	const r = res as Record<string, unknown>;
	const dataObj = r.data as Record<string, unknown> | undefined;
	const items = r.items ?? dataObj?.items ?? r.data ?? [];
	return Array.isArray(items) ? (items as T[]) : [];
}

export function extractItem<T = Record<string, any>>(res: unknown): T | null {
	if (!res) return null;
	const r = res as Record<string, unknown>;
	return (r.data ?? r ?? null) as T | null;
}

export function extractPagination(res: unknown): PaginationInfo {
	const r = res as Record<string, unknown>;
	const pagination = r.pagination as Record<string, unknown> | undefined;
	return {
		page: (pagination?.page ?? r.page ?? 1) as number,
		pageSize: (pagination?.pageSize ?? r.pageSize ?? 10) as number,
		total: (r.total ?? 0) as number,
	};
}

export function extractListResult<T>(res: unknown): ListResult<T> {
	return {
		items: extractList<T>(res),
		pagination: extractPagination(res),
	};
}

export async function fetchList<T = any>(apiCall: Promise<unknown>): Promise<T[]> {
	const res = await apiCall;
	return extractList<T>(res);
}

export async function fetchItem<T = any>(apiCall: Promise<unknown>): Promise<T | null> {
	const res = await apiCall;
	return extractItem<T>(res);
}

export async function fetchListResult<T = any>(apiCall: Promise<unknown>): Promise<ListResult<T>> {
	const res = await apiCall;
	return extractListResult<T>(res);
}
