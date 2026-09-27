import React from 'react';

export interface PageContainerProps {
	children: React.ReactNode;
	className?: string;
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	padding?: boolean;
}

const maxWidthClasses: Record<string, string> = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	full: 'max-w-2xl',
};

export const PageContainer = React.memo(function PageContainer({
	children,
	className = '',
	maxWidth = 'sm',
	padding = true,
}: PageContainerProps) {
	return (
		<div
			className={`flex min-h-screen items-center justify-center px-4 ${padding ? 'py-8' : ''} ${className}`}
		>
			<div
				className={`w-full ${maxWidthClasses[maxWidth]} space-y-6 rounded-2xl bg-[var(--color-bg-surface)] p-8 shadow-lg`}
			>
				{children}
			</div>
		</div>
	);
});
