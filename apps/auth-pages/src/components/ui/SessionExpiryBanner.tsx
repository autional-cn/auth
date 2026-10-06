'use client';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSessionTimeout } from '@/hooks/use-session-timeout';
import { useI18n } from '@/lib/i18n';
import { AuthService, getAccessToken, useAccessToken } from '@autional/shared';

export function SessionExpiryBanner() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const token = useAccessToken();
	const [warning, setWarning] = useState(false);
	// 弹窗出现时刻的 token 基线：此后 token 一旦更新（任意来源续期成功：本按钮、
	// apiClient 预刷新、401 重试）即自动隐藏——弹窗与续期结果联动
	const warnedTokenRef = useRef<string | null>(null);

	// 唯一导航出口：error 页倒计时结束经入口路由落到 /<slug>/login?redirect=…，
	// 登录成功原路返回（F-W8b 修复②）
	const goToSessionExpired = () => {
		const target = typeof window !== 'undefined' ? window.location.href : '';
		navigate(
			target
				? `/error?type=session_expired&redirect=${encodeURIComponent(target)}`
				: '/error?type=session_expired',
		);
	};

	useSessionTimeout(
		// 仅静默续期失败时回调（hook 内部先自动续期，成功则无事发生）：
		// 弹窗出现 ≈ 确需用户处理，不再"已自动续上却仍提示手动续期"
		() => {
			warnedTokenRef.current = getAccessToken() ?? null;
			setWarning(true);
		},
		goToSessionExpired,
	);

	useEffect(() => {
		if (warning && token && token !== warnedTokenRef.current) {
			setWarning(false);
		}
	}, [warning, token]);

	if (!warning) return null;

	return (
		<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 shadow-lg max-w-sm w-full">
			<p className="text-sm font-medium text-amber-800">{t('dashboard.sessionExpiringTitle')}</p>
			<p className="text-xs text-amber-600 mt-1">{t('dashboard.sessionExpiringDesc')}</p>
			<div className="mt-2 flex gap-2">
				<button
					onClick={async () => {
						// 真续期链路（Identity/OAuth refresh）：成功即关（token 更新同步生效）；
						// 失败清会话并走唯一导航出口。旧实现走 bffRefresh（BFF cookie 链路，
						// 本站未启用且不更新 token store）＝点了只关弹窗、从未真正续期
						const newToken = await AuthService.refreshToken({ onFailure: 'clear' });
						setWarning(false);
						if (!newToken) goToSessionExpired();
					}}
					className="text-xs bg-amber-600 text-white px-3 py-1 rounded-xs hover:bg-amber-700"
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
