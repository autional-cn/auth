import React, { useCallback, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
	open: boolean;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	variant?: 'danger' | 'warning' | 'neutral';
	onConfirm: () => void;
	onCancel: () => void;
}

const variantStyles = {
	danger: {
		icon: 'bg-danger/10 text-danger',
		confirm: 'bg-danger text-white hover:bg-danger/90',
	},
	warning: {
		icon: 'bg-warning/10 text-warning',
		confirm: 'bg-warning text-white hover:bg-warning/90',
	},
	neutral: {
		icon: 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]',
		confirm: 'bg-[var(--color-brand)] text-white hover:opacity-90',
	},
};

export const ConfirmDialog = React.memo(function ConfirmDialog({
	open,
	title,
	description,
	confirmText = '确认',
	cancelText = '取消',
	variant = 'neutral',
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') onCancel();
		},
		[onCancel],
	);

	useEffect(() => {
		if (open) {
			document.addEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'hidden';
		}
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = '';
		};
	}, [open, handleKeyDown]);

	if (!open) return null;

	const style = variantStyles[variant];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
			<div className="relative w-full max-w-md rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 shadow-lg">
				<button
					onClick={onCancel}
					className="absolute right-4 top-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
					aria-label="关闭"
				>
					<X className="h-4 w-4" />
				</button>
				<div className="flex items-start gap-4">
					<div
						className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.icon}`}
					>
						<AlertTriangle className="h-5 w-5" />
					</div>
					<div>
						<h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
						<p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
					</div>
				</div>
				<div className="mt-6 flex justify-end gap-3">
					<button
						onClick={onCancel}
						className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-muted)]"
					>
						{cancelText}
					</button>
					<button
						onClick={onConfirm}
						className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${style.confirm}`}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
});
