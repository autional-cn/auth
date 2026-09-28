'use client';

import { useEffect, useState } from 'react';
import type { PublicAuthConfigResponse } from '../generated/types';
import { extractSlugFromPath } from './slug-from-url';

/**
 * Resolve OAuth client ID from URL slug.
 * Fetches public auth-config by slug and extracts oauthClientId.
 *
 * Returns:
 *   - { status: 'loading' } while fetching
 *   - { status: 'resolved', slug, clientId, config } on success
 *   - { status: 'not-found' } if no slug in URL or no oauth client configured
 */
export type SlugResolution =
	| { status: 'loading' }
	| { status: 'resolved'; slug: string; clientId: string; config: PublicAuthConfigResponse }
	| { status: 'not-found' };

/**
 * 拉取公开 auth-config（原始响应，snake/camel 混合未归一）；失败/非 2xx 返回 null。
 * 用 raw fetch 绕过 apiClient 401 拦截器 —— 公开配置必须在 RequireAuth 跳转前解析完成。
 */
async function fetchPublicAuthConfig(slug: string): Promise<Record<string, any> | null> {
	try {
		const res = await fetch(
			`/bff/identity/api/v1/public/auth-config/by-slug/${encodeURIComponent(slug)}`,
		);
		if (!res.ok) return null;
		const json: any = await res.json();
		return (json?.data || json || {}) as Record<string, any>;
	} catch {
		return null;
	}
}

/**
 * 按 slug 实时解析 OAuth client_id（非 hook 版本）。
 * 供登录页 from_requireauth 分支缓存未命中时回源（TASK-09 / ADR-04）。
 */
export async function fetchOAuthClientIdBySlug(slug: string): Promise<string | null> {
	const data = await fetchPublicAuthConfig(slug);
	if (!data) return null;
	return data.oauthClientId || data.oauth_client_id || null;
}

export function useOAuthClientIdFromUrl(): SlugResolution {
	const [resolution, setResolution] = useState<SlugResolution>({ status: 'loading' });

	useEffect(() => {
		if (typeof window === 'undefined') {
			setResolution({ status: 'not-found' });
			return;
		}

		// 如果不在浏览器环境，直接跳过
		if (typeof window === 'undefined') {
			setResolution({ status: 'not-found' });
			return;
		}

		const slug = extractSlugFromPath(window.location.pathname);
		if (!slug) {
			setResolution({ status: 'not-found' });
			return;
		}

		// 若当前应用已通过 VITE_OAUTH_CLIENT_ID 固定了 OAuth client（如 admin-console），
		// 无需再按 URL slug 解析——避免把 /users、/roles 等应用路径误当租户 slug 发起 404 请求。
		const cfg = (window as any).__APP_CONFIG__;
		if (cfg?.VITE_OAUTH_CLIENT_ID) {
			setResolution({ status: 'not-found' });
			return;
		}

		let cancelled = false;
		void fetchPublicAuthConfig(slug).then((data) => {
			if (cancelled) return;
			// Raw fetch doesn't camelCase keys — handle both snake_case and camelCase
			const clientId = data?.oauthClientId || data?.oauth_client_id;
			if (clientId) {
				setResolution({
					status: 'resolved',
					slug,
					clientId,
					config: data as PublicAuthConfigResponse,
				});
			} else {
				setResolution({ status: 'not-found' });
			}
		});

		return () => {
			cancelled = true;
		};
	}, []);

	return resolution;
}
