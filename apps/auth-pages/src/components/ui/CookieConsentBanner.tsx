'use client';

// ⚠️ 当前未引用 — 已从 App.tsx 隐藏 (2026-07-29)
//
// 隐藏原因:
//   1. 应用零 cookie 使用 — 整个项目无 document.cookie 调用
//   2. analytics 开关有 UI 但无实际追踪代码消费
//   3. 存储使用 Zustand persist → localStorage，非 cookie
//   4. 条文中文字样误导（"Cookie 偏好"），实际不涉及任何 cookie
//
// 保留不删的原因:
//   - 作为 cookie 合规 UI 的标准实现，后续如需接入直接取消 App.tsx 注释即可
//   - 完整的 i18n 翻译键（zh-CN/en-US）已存在，恢复时无需重新翻译
//   - Zustand persist store 定义完整，localStorage 数据兼容
//
// 如需恢复:
//   1. App.tsx: 取消 import { CookieConsentBanner } ... 的注释
//   2. App.tsx: 取消 {/* CookieConsentBanner ... */} 的注释
//   3. 构建部署即可

import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Button } from '@autional/ui';
import { useI18n } from '@/lib/i18n';
import { X } from 'lucide-react';

interface CookieConsent {
	analytics: boolean;
}

interface CookieConsentState {
	consented: boolean;
	preferences: CookieConsent;
	setConsent: (prefs: CookieConsent) => void;
}

export const useCookieStore = create<CookieConsentState>()(
	persist(
		(set) => ({
			consented: false,
			preferences: { analytics: false },
			setConsent: (prefs) => set({ consented: true, preferences: prefs }),
		}),
		{ name: 'cookie-consent' },
	),
);

export function CookieConsentBanner() {
	const { t } = useI18n();
	const [mounted, setMounted] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const consented = useCookieStore((s) => s.consented);
	const setConsent = useCookieStore((s) => s.setConsent);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted || consented) return null;

	return (
		<>
			<div className="fixed bottom-0 left-0 z-50 w-full border-t border-neutral-200 bg-white px-4 py-4 shadow-lg dark:border-neutral-700 dark:bg-neutral-900 sm:px-6">
				<div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-start gap-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mt-0.5 shrink-0 text-neutral-500"
						>
							<path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
							<path d="M9 21h6" />
							<path d="M11 18h2" />
						</svg>
						<div>
							<div
								className="text-sm font-semibold text-neutral-900 dark:text-white"
								role="heading"
								aria-level={2}
							>
								{t('cookie.title')}
							</div>
							<p className="mt-1 text-sm text-neutral-500">{t('cookie.description')}</p>
						</div>
					</div>

					<div className="flex items-center gap-2 sm:shrink-0">
						<Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
							{t('cookie.settings')}
						</Button>
						<Button variant="primary" size="sm" onClick={() => setConsent({ analytics: true })}>
							{t('cookie.acceptAll')}
						</Button>
						<button
							onClick={() => setConsent({ analytics: false })}
							className="ml-1 rounded-xs p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
							aria-label={t('cookie.close') ?? 'Close'}
						>
							<X size={18} />
						</button>
					</div>
				</div>
			</div>

			{settingsOpen && (
				<CookieSettingsPanel
					t={t}
					onSave={(prefs) => {
						setConsent(prefs);
						setSettingsOpen(false);
					}}
					onClose={() => setSettingsOpen(false)}
				/>
			)}
		</>
	);
}

function CookieSettingsPanel({
	t,
	onSave,
	onClose,
}: {
	t: (key: string) => string;
	onSave: (prefs: CookieConsent) => void;
	onClose: () => void;
}) {
	const [analytics, setAnalytics] = useState(false);
	const [hasInteracted, setHasInteracted] = useState(false);

	return (
		<div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center">
			<div className="relative w-full max-w-md rounded-t-xl bg-white p-6 shadow-xl dark:bg-neutral-900 sm:rounded-xl">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
						{t('cookie.title')}
					</h3>
					<button
						onClick={onClose}
						className="rounded-xs p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
					>
						<X size={20} />
					</button>
				</div>

				<div className="mt-6 space-y-5">
					<div className="flex items-center justify-between">
						<div className="flex-1 pr-4">
							<p className="text-sm font-medium text-neutral-900 dark:text-white">
								{t('cookie.necessary')}
							</p>
							<p className="mt-0.5 text-xs text-neutral-500">{t('cookie.necessaryDesc')}</p>
						</div>
						<label className="relative inline-flex cursor-not-allowed items-center">
							<input
								id="cookie-necessary"
								name="cookie_necessary"
								type="checkbox"
								checked
								disabled
								className="peer sr-only"
							/>
							<div className="h-5 w-9 rounded-full bg-[var(--color-brand)] opacity-60 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition" />
						</label>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex-1 pr-4">
							<p className="text-sm font-medium text-neutral-900 dark:text-white">
								{t('cookie.analytics')}
							</p>
							<p className="mt-0.5 text-xs text-neutral-500">{t('cookie.analyticsDesc')}</p>
						</div>
						<button
							type="button"
							role="switch"
							aria-checked={analytics}
							onClick={() => {
								setAnalytics(!analytics);
								setHasInteracted(true);
							}}
							className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
								analytics ? 'bg-[var(--color-brand)]' : 'bg-neutral-300 dark:bg-neutral-600'
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
									analytics ? 'translate-x-[18px]' : 'translate-x-[2px]'
								}`}
							/>
						</button>
					</div>
				</div>

				<div className="mt-6 flex justify-end gap-2">
					<Button variant="ghost" size="sm" onClick={onClose}>
						{t('cookie.cancel') ?? 'Cancel'}
					</Button>
					<Button variant="primary" size="sm" onClick={() => onSave({ analytics })}>
						{t('cookie.save')}
					</Button>
				</div>
			</div>
		</div>
	);
}
