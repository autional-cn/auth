'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSessionTimeout } from '@/hooks/use-session-timeout';
import { useI18n } from '@/lib/i18n';
import { bffRefresh } from '@autional-cn/shared';

export function SessionExpiryBanner() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const [warning, setWarning] = useState(false);

	useSessionTimeout(
		() => setWarning(true),
		() => {
			// 回程目标 = 当前页（登录完成后应回到这里）。error 页倒计时结束经入口路由
			// 落到 /<slug>/login?redirect=…，登录成功原路返回（F-W8b 修复②）。
			const target = typeof window !== 'undefined' ? window.location.href : '';
			navigate(
				target
					? `/error?type=session_expired&redirect=${encodeURIComponent(target)}`
					: '/error?type=session_expired',
			);
		},
	);

	if (!warning) return null;

	return (
		<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 shadow-lg max-w-sm w-full">
			<p className="text-sm font-medium text-amber-800">{t('dashboard.sessionExpiringTitle')}</p>
			<p className="text-xs text-amber-600 mt-1">{t('dashboard.sessionExpiringDesc')}</p>
			<div className="mt-2 flex gap-2">
				<button
					onClick={async () => {
						try {
							await bffRefresh();
						} catch {
							// bffRefresh 失败不阻塞：保持当前会话提示
						}
						setWarning(false);
					}}
					className="text-xs bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700"
				>
					{t('dashboard.extendSession')}
				</button>
				<button
					onClick={() => setWarning(false)}
					className="text-xs text-amber-600 px-3 py-1 hover:underline"
				>
					{t('dashboard.dismiss')}
				</button>
			</div>
		</div>
	);
}
