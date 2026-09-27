import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorStateProps {
	title?: string;
	description?: string;
	message?: string;
	onRetry?: () => void;
	action?: { label: string; onClick: () => void };
	className?: string;
}

export function ErrorState({
	title,
	description,
	message,
	onRetry,
	action,
	className = '',
}: ErrorStateProps) {
	const displayTitle = title || '加载失败';
	const displayMessage = description || message || '请稍后重试';

	return (
		<div
			className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-danger/20 bg-danger/5 px-4 py-8 text-center ${className}`}
		>
			<div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10">
				<AlertTriangle className="h-7 w-7 text-danger" />
			</div>
			<div>
				<p className="text-sm font-medium text-[var(--color-text-primary)]">{displayTitle}</p>
				<p className="mt-1 text-xs text-[var(--color-text-secondary)]">{displayMessage}</p>
			</div>
			{action ? (
				<button
					onClick={action.onClick}
					className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-1.5 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-bg-muted)]"
				>
					{action.label}
				</button>
			) : onRetry ? (
				<button
					onClick={onRetry}
					className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-danger)]/30 bg-[var(--color-bg-surface)] px-3 py-1.5 text-xs text-[var(--color-danger)] hover:bg-[var(--color-danger)]/5"
				>
					<RefreshCw className="h-3.5 w-3.5" />
					重试
				</button>
			) : null}
		</div>
	);
}
