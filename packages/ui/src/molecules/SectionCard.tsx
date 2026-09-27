import React from 'react';

interface SectionCardProps {
	title?: string;
	children: React.ReactNode;
	className?: string;
	padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
	none: '',
	sm: 'p-4',
	md: 'p-6',
	lg: 'p-8',
};

export const SectionCard = React.memo(function SectionCard({
	title,
	children,
	className = '',
	padding = 'md',
}: SectionCardProps) {
	return (
		<div
			className={`rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] shadow-sm ${paddingMap[padding]} ${className}`}
		>
			{title && (
				<h2 className="mb-4 text-xl font-bold text-[var(--color-text-primary)]">{title}</h2>
			)}
			{children}
		</div>
	);
});
