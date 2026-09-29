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
 *   - { status: 'not-found' } if no slug in URL, env client pinned, or no oauth client configured
 *   - { status: 'unknown-slug', slug } if by-slug is a deterministic HTTP 404 (slug 不存在)
 */
export type SlugResolution =
	| { status: 'loading' }
	| { status: 'resolved'; slug: string; clientId: string; config: PublicAuthConfigResponse }
	| { status: 'not-found' }
	| { status: 'unknown-slug'; slug: string };

/**
 * 公开 auth-config 拉取三态（F-W6 门户侧闸门的判别依据）：
 * - ok：HTTP 2xx，data 为解包后的配置体；
 * - unknown-slug：**HTTP 404** —— identity 按「租户不存在」返回
 *   （public_handler.go GetTenantAuthConfigBySlug：GetTenantBySlug 失败/空 → ErrCodeNotFound）。
 *   已知租户但未配 OAuth client 时返回 200（client 字段为空）⇒ 不走本态。
 * - error：网络错误 / 非 404 非 2xx / 解析失败 —— 必须 fail-open，不得据此判死。
 */
type PublicAuthConfigFetch =
	| { kind: 'ok'; data: Record<string, any> }
	| { kind: 'unknown-slug' }
	| { kind: 'error' };

/**
 * 拉取公开 auth-config（原始响应，snake/camel 混合未归一）。
 * 用 raw fetch 绕过 apiClient 401 拦截器 —— 公开配置必须在 RequireAuth 跳转前解析完成。
 */
async function fetchPublicAuthConfig(slug: string): Promise<PublicAuthConfigFetch> {
	try {
		const res = await fetch(
			`/bff/identity/api/v1/public/auth-config/by-slug/${encodeURIComponent(slug)}`,
		);
		if (res.status === 404) return { kind: 'unknown-slug' };
		if (!res.ok) return { kind: 'error' };
		const json: any = await res.json();
		return { kind: 'ok', data: (json?.data || json || {}) as Record<string, any> };
	} catch {
		return { kind: 'error' };
	}
}

/**
 * 按 slug 实时解析 OAuth client_id（非 hook 版本）。
 * 供登录页 from_requireauth 分支缓存未命中时回源（TASK-09 / ADR-04）。
 * 404（未知 slug）与网络错误统一返回 null —— 调用方只关心「能不能拿到 client」。
 */
export async function fetchOAuthClientIdBySlug(slug: string): Promise<string | null> {
	const fetched = await fetchPublicAuthConfig(slug);
	if (fetched.kind !== 'ok') return null;
	return fetched.data.oauthClientId || fetched.data.oauth_client_id || null;
}

export function useOAuthClientIdFromUrl(): SlugResolution {
	const [resolution, setResolution] = useState<SlugResolution>({ status: 'loading' });

	useEffect(() => {
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
		void fetchPublicAuthConfig(slug).then((fetched) => {
			if (cancelled) return;
			if (fetched.kind === 'unknown-slug') {
				setResolution({ status: 'unknown-slug', slug });
				return;
			}
			if (fetched.kind !== 'ok') {
				setResolution({ status: 'not-found' });
				return;
			}
			// Raw fetch doesn't camelCase keys — handle both snake_case and camelCase
			const clientId = fetched.data.oauthClientId || fetched.data.oauth_client_id;
			if (clientId) {
				setResolution({
					status: 'resolved',
					slug,
					clientId,
					config: fetched.data as PublicAuthConfigResponse,
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
