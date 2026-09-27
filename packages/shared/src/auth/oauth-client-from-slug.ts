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
		// Use raw fetch to bypass apiClient 401 interceptor — public auth config
		// must resolve BEFORE RequireAuth redirects, otherwise OAuth PKCE never starts.
		fetch(`/bff/identity/api/v1/public/auth-config/by-slug/${slug}`)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json();
			})
			.then((json: any) => {
				if (cancelled) return;
				const data = json?.data || json || {};
				// Raw fetch doesn't camelCase keys — handle both snake_case and camelCase
				const clientId = data.oauthClientId || data.oauth_client_id;
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
			})
			.catch(() => {
				if (!cancelled) setResolution({ status: 'not-found' });
			});

		return () => {
			cancelled = true;
		};
	}, []);

	return resolution;
}
