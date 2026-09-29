/**
 * TenantIndexGuard — 租户 slug 白名单守卫（TASK-425，AC-010）
 *
 * 从 end-user-portal App.tsx L65-111 抽取泛化，供 4 个租户门户复用
 * （不复制 4 份，违反 DRY）。
 *
 * - usePublicTenantSlugs: 调公开 tenants API（无认证端点），staleTime 5m 缓存，
 *   retry 1，任何失败返回空数组（放行语义由 TenantIndexGuard 处理）。
 * - TenantIndexGuard: index 路由守卫（P0-2），防止未知路径被贪婪渲染为
 *   Dashboard/首页。404 页由各 portal 通过 notFound prop 注入
 *   （shared 组件不能 import 具体 app 的 not-found/page）。
 *
 * ⚠️ 依赖约束: shared 包 dependencies 无 @autional-cn/ui，禁止 import @autional-cn/ui
 * （会引入未声明依赖/循环依赖）。loading 默认值用内联 div 骨架，
 * 样式用 CSS 变量 var(--color-*)，在 .dark 下自动反转（AGENTS.md 设计规范）。
 * ⚠️ useTenantSlugFromUrl 内部相对导入（'../auth/slug-from-url'），
 * 不要从包名 '@autional-cn/shared' 导入自身。
 */

'use client';

import { type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTenantSlugFromUrl } from '../auth/slug-from-url';

/** 公开租户信息（public tenants API 返回项） */
export interface PublicTenantInfo {
	name?: string;
	slug?: string;
	id?: string;
}

/**
 * 公开租户列表（无认证端点，用于校验 URL slug 有效性）。
 * 从 end-user-portal App.tsx 原样抽取。
 * - staleTime 5m（plan §5 资源列：public tenants API 有缓存）
 * - retry 1；失败返回 []（白名单空数组放行，避免 API 挂掉时全站 404）
 *
 * ⚠️ 响应契约：tenant-service ListPublicTenants 返回 dto_base.ListResponse
 * （`{code, message, items, total, pagination, timestamp}`，items 才是数组）。
 * 解析顺序：items → data（旧兼容）→ 原始对象，均非数组则返回 []。
 */
export function usePublicTenantSlugs() {
	return useQuery<Array<PublicTenantInfo>>({
		queryKey: ['public-tenants'],
		queryFn: async () => {
			try {
				const res = await fetch('/bff/tenant/api/v1/tenant/public/tenants');
				if (!res.ok) return [];
				const json = await res.json();
				const list = json?.items ?? json?.data ?? json ?? [];
				return Array.isArray(list) ? list : [];
			} catch {
				return [];
			}
		},
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});
}

export interface TenantIndexGuardProps {
	/** 白名单校验通过后渲染的 index 内容（各 portal 的 Dashboard/首页） */
	children?: ReactNode;
	/** 白名单校验失败渲染的 404 页（各 portal 注入自己的 NotFoundPage） */
	notFound?: ReactNode;
	/** loading 占位（缺省渲染内联简单骨架，不依赖 @autional-cn/ui） */
	loading?: ReactNode;
}

/**
 * 默认 loading 占位 — 内联骨架（零依赖）。
 * 不使用 @autional-cn/ui（shared 包无该依赖，避免未声明依赖/循环依赖）；
 * 样式用 CSS 变量 var(--color-*)，在 .dark 下自动反转。
 */
function DefaultLoadingSkeleton() {
	return (
		<>
			<style>{`@keyframes authms-guard-spin { to { transform: rotate(360deg); } }`}</style>
			<div
				role="status"
				aria-live="polite"
				aria-label={typeof document !== 'undefined' && (document.documentElement.lang || '').toLowerCase().startsWith('zh') ? '加载中' : 'Loading'}
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '40vh',
					width: '100%',
				}}
			>
				<div
					style={{
						width: '2rem',
						height: '2rem',
						borderRadius: '9999px',
						border: '3px solid var(--color-border-subtle)',
						borderTopColor: 'var(--color-brand)',
						animation: 'authms-guard-spin 0.8s linear infinite',
					}}
				/>
			</div>
		</>
	);
}

/**
 * index 路由守卫（P0-2）：防止未知路径被贪婪渲染为 Dashboard/首页。
 * 逻辑与 end-user-portal 现状一致（L94-111）：
 * - URL 多段（如 /acme-corp/xyz）：basename 已剥离 slug，内部单段必为未知路由段 → notFound
 * - URL 单段（如 /not-found）：校验 slug 是否在公开租户列表 → 无效 → notFound
 * - URL 单段且 slug 有效（如 /acme-corp）→ children
 * - 白名单为空数组时放行（public tenants API 挂掉时退化为不拦截，与 end-user 现状一致）
 */
export function TenantIndexGuard({ children, notFound, loading }: TenantIndexGuardProps) {
	const { data: tenants, isLoading } = usePublicTenantSlugs();
	const slug = useTenantSlugFromUrl();

	if (typeof window !== 'undefined') {
		const fullSegs = window.location.pathname.split('/').filter(Boolean);
		if (fullSegs.length > 1) return <>{notFound}</>;
	}

	if (isLoading && !tenants) return <>{loading ?? <DefaultLoadingSkeleton />}</>;

	if (slug && tenants && tenants.length > 0 && !tenants.some((t) => (t.name || t.slug) === slug)) {
		return <>{notFound}</>;
	}

	return <>{children}</>;
}
