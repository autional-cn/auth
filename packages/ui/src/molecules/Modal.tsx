import React, { useCallback, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	maxWidth?: 'sm' | 'md' | 'lg';
	className?: string;
}

const maxWidthClasses: Record<string, string> = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
};

export const Modal = React.memo(function Modal({
	open,
	onClose,
	title,
	children,
	footer,
	maxWidth = 'md',
	className = '',
}: ModalProps) {
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		},
		[onClose],
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

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div className="absolute inset-0" onClick={onClose} />
			<div
				className={`relative w-full ${maxWidthClasses[maxWidth]} rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] shadow-lg ${className}`}
			>
				{title && (
					<div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-4">
						<h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
						<button
							onClick={onClose}
							className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
							aria-label="关闭"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				)}
				{!title && (
					<button
						onClick={onClose}
						className="absolute right-4 top-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
						aria-label="关闭"
					>
						<X className="h-4 w-4" />
					</button>
				)}
				<div className="px-6 py-4">{children}</div>
				{footer && (
					<div className="flex justify-end gap-3 border-t border-[var(--color-border-subtle)] px-6 py-4">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
});
