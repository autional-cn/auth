import React from 'react';

interface ToggleProps {
	checked: boolean;
	onChange: () => void;
	disabled?: boolean;
	size?: 'sm' | 'md';
	className?: string;
}

const sizeClasses: Record<string, { track: string; circle: string; translate: string }> = {
	md: { track: 'h-6 w-11', circle: 'h-5 w-5', translate: 'translate-x-5' },
	sm: { track: 'h-5 w-9', circle: 'h-4 w-4', translate: 'translate-x-4' },
};

export const Toggle = React.memo(function Toggle({
	checked,
	onChange,
	disabled = false,
	size = 'md',
	className = '',
}: ToggleProps) {
	const s = sizeClasses[size];

	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			disabled={disabled}
			onClick={onChange}
			className={`relative inline-flex shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
				checked ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-600'
			} ${s.track} ${className}`}
		>
			<span
				className={`inline-block rounded-full bg-white shadow-sm transition-transform ${
					checked ? s.translate : 'translate-x-0.5'
				} ${s.circle}`}
			/>
		</button>
	);
});
