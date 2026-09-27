import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
	size?: 'sm' | 'md' | 'lg';
	isLoading?: boolean;
	fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = 'primary',
			size = 'md',
			isLoading,
			fullWidth,
			children,
			className = '',
			disabled,
			...props
		},
		ref,
	) => {
		const base =
			'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

		const variants: Record<string, string> = {
			primary: 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)]',
			secondary: 'bg-[var(--color-bg-muted)] text-[var(--color-text-primary)] hover:opacity-80',
			outline:
				'border border-[var(--color-border-subtle)] bg-transparent hover:bg-[var(--color-bg-muted)] text-[var(--color-text-primary)]',
			ghost: 'bg-transparent hover:bg-[var(--color-bg-muted)] text-[var(--color-text-primary)]',
			danger: 'bg-[var(--color-danger)] text-white hover:opacity-80',
		};

		const sizes: Record<string, string> = {
			sm: 'h-8 px-3 text-xs',
			md: 'h-10 px-4 text-sm',
			lg: 'h-12 px-6 text-base',
		};

		const width = fullWidth ? 'w-full' : '';
		const cls = `${base} ${variants[variant]} ${sizes[size]} ${width} ${className}`;

		return (
			<button ref={ref} className={cls} disabled={disabled || isLoading} {...props}>
				{isLoading && (
					<svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						/>
					</svg>
				)}
				{children}
			</button>
		);
	},
);
Button.displayName = 'Button';
