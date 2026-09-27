import React from 'react';

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
	variant?: StatusVariant;
	children: React.ReactNode;
	className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
	success: 'bg-success/10 text-success',
	warning: 'bg-warning/10 text-warning',
	danger: 'bg-danger/10 text-danger',
	info: 'bg-info/10 text-info',
	neutral: 'bg-neutral-100 text-neutral-600 dark:bg-slate-800 dark:text-neutral-400',
};

export const StatusBadge = React.memo(function StatusBadge({
	variant = 'neutral',
	children,
	className = '',
}: StatusBadgeProps) {
	return (
		<span
			className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
		>
			{children}
		</span>
	);
});
