/**
 * AuditStatsOnly — 审计统计摘要组件
 *
 * 在 strict sod_mode 下，admin 角色仅能看到聚合统计卡片，
 * 不能看到审计日志明细行、全文检索、导出等功能。
 *
 * 不使用 antd 依赖（shared 包不直接依赖 antd），
 * 使用纯 Tailwind CSS + HTML 实现轻量提示卡片。
 *
 * @see document/architecture/decisions/007-security-dashboard-audit.md §2.2
 */

'use client';

import React from 'react';

interface AuditStatsOnlyProps {
	title?: string;
	description?: string;
	children?: React.ReactNode;
}

/**
 * 审计受限提示组件。
 * 在 strict 模式下替换完整审计页面内容。
 *
 * 可选的 children 用于放置自定义的统计卡片内容。
 */
export function AuditStatsOnly({ title, description, children }: AuditStatsOnlyProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
			<div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-8">
				<div className="flex flex-col items-center text-center space-y-4">
					{/* Lock icon via inline SVG (no external dependency) */}
					<svg
						className="w-12 h-12 text-gray-400 dark:text-gray-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
					<h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 !mb-1">
						{title || '统计摘要'}
					</h4>
					<p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
						{description ||
							'在当前模式下，您只能查看审计统计摘要。如需查看完整审计日志，请联系您的安全管理员或使用 security-dashboard 的审计员账号登录。'}
					</p>
					{children && (
						<div className="w-full mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
							{children}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
