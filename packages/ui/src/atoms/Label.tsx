import * as React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
	({ children, className = '', required, ...props }, ref) => {
		const cls = `text-sm font-medium leading-none ${className}`;
		return (
			<label ref={ref} className={cls} {...props}>
				{children}
				{required && <span className="text-danger ml-0.5">*</span>}
			</label>
		);
	},
);
Label.displayName = 'Label';
