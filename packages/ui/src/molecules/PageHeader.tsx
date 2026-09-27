import React from 'react';

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	children?: React.ReactNode;
}

export const PageHeader = React.memo(function PageHeader({
	title,
	subtitle,
	children,
}: PageHeaderProps) {
	return (
		<div className="text-center">
			<h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
				{title}
			</h1>
			{subtitle && (
				<p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-secondary)]">
					{subtitle}
				</p>
			)}
			{children}
		</div>
	);
});
