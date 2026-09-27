import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
	title?: string;
	description?: string;
	icon?: React.ReactNode;
}

export const EmptyState = React.memo(function EmptyState({
	title = '暂无数据',
	description = '当前没有可显示的内容。',
	icon,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] px-4 py-12 text-center">
			<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]">
				{icon ?? <Inbox className="h-6 w-6" />}
			</div>
			<h3 className="mt-4 text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
			<p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
		</div>
	);
});
