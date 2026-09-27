'use client';

import { useI18n } from '@/lib/i18n';
import { Clock } from 'lucide-react';

export interface PendingApprovalBannerProps {
	tenantName: string;
	status: string;
}

/**
 * 待审批横幅组件
 *
 * 当用户的租户成员状态为 pending 时显示，
 * 提示用户其加入申请正在等待管理员审批。
 */
export function PendingApprovalBanner({ tenantName, status }: PendingApprovalBannerProps) {
	const { t } = useI18n();

	if (status !== 'pending') {
		return null;
	}

	return (
		<div className="rounded-lg border border-amber-200 bg-amber-50 p-4" role="alert">
			<div className="flex items-start gap-3">
				<div className="flex-shrink-0 mt-0.5">
					<Clock className="h-5 w-5 text-amber-500" />
				</div>
				<div className="flex-1">
					<h4 className="text-sm font-semibold text-amber-800">
						{t('membership.pendingTitle') || '加入申请已提交'}
					</h4>
					<p className="mt-1 text-sm text-amber-700">
						{t('membership.pendingDescription', { tenant: tenantName }) ||
							`您在「${tenantName}」的加入申请正在等待管理员审批，请耐心等待。`}
					</p>
				</div>
			</div>
		</div>
	);
}
