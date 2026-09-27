export function SkeletonCard({ className = '' }: { className?: string }) {
	return (
		<div
			className={`animate-pulse rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4 ${className}`}
		>
			<div className="flex items-center gap-3">
				<div className="h-8 w-8 rounded bg-[var(--color-bg-muted)]" />
				<div className="h-4 w-1/2 rounded bg-[var(--color-bg-muted)]" />
			</div>
		</div>
	);
}
