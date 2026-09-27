import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className = '', error, ...props }, ref) => {
		const base =
			'flex h-10 w-full rounded-md border bg-[var(--color-bg-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
		const border = error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-subtle)]';
		const cls = `${base} ${border} ${className}`;

		return (
			<div className="w-full">
				<input ref={ref} className={cls} {...props} />
				{error && <p className="mt-1 text-xs text-[var(--color-danger)]">{error}</p>}
			</div>
		);
	},
);
Input.displayName = 'Input';
