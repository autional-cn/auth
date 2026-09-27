/**
 * useSodMode — 租户 SoD 模式 Hook
 *
 * 通过 tenant-service API 读取当前租户的 sod_mode 配置，
 * 决定 `admin` 角色对审计功能的可见性。
 *
 * 模式:
 *   'single' — 小客户模式（默认）: admin 可看 L1 统计 + L2 操作反馈
 *   'strict' — 大客户/受监管: admin 仅看 L1 统计摘要
 *
 * API: GET /api/v1/admin/tenants/{tenantSlug}/sod-config
 *       PUT /api/v1/admin/tenants/{tenantSlug}/sod-config
 *
 * @see document/architecture/decisions/007-security-dashboard-audit.md §2.3
 */

'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { extractItem } from '../utils/response';
import { useTenantSlug } from '../auth/tenant-slug-context';
import { useCurrentRole } from './useCurrentRole';

export type SodMode = 'single' | 'strict';

interface SodConfigResponse {
	tenant_id: string;
	sod_mode: SodMode;
	updated_at: string;
}

/**
 * 返回当前用户的 sod_mode。
 * 从 tenant-service 的 /api/v1/admin/tenants/{slug}/sod-config 读取。
 * 失败或未配置时默认返回 'single'。
 */
export function useSodMode(): SodMode {
	const tenantSlug = useTenantSlug();

	const { data: config } = useQuery<SodConfigResponse | null>({
		queryKey: ['sod-config', tenantSlug],
		queryFn: () => fetchSodConfig(tenantSlug),
		staleTime: 5 * 60 * 1000, // 5 min cache
		retry: 1,
		enabled: !!tenantSlug,
	});

	return config?.sod_mode ?? 'single';
}

async function fetchSodConfig(slug: string | undefined): Promise<SodConfigResponse | null> {
	if (!slug) return null;
	try {
		const res = await apiClient.get(`/api/v1/admin/tenants/${slug}/sod-config`);
		return extractItem<SodConfigResponse>(res.data);
	} catch {
		return null; // 默认 single
	}
}

/**
 * 判断当前用户在 strict 模式下是否被限制查看审计详情。
 */
export function useIsAuditRestricted(): boolean {
	const sodMode = useSodMode();
	const role = useCurrentRole();

	return useMemo(() => {
		return sodMode === 'strict' && role === 'admin';
	}, [sodMode, role]);
}
