import { Loader2 } from 'lucide-react';

export interface LoadingScreenProps {
	message?: string;
	fullScreen?: boolean;
	className?: string;
}

export function LoadingScreen({
	message = '加载中...',
	fullScreen = false,
	className = '',
}: LoadingScreenProps) {
	const content = (
		<div className="flex flex-col items-center justify-center gap-3">
			<Loader2 size={fullScreen ? 32 : 24} className="animate-spin text-[var(--color-brand)]" />
			<p className="text-sm text-[var(--color-text-secondary)]">{message}</p>
		</div>
	);

	if (fullScreen) {
		return (
			<div className={`flex min-h-screen items-center justify-center px-4 ${className}`}>
				{content}
			</div>
		);
	}

	return <div className={`flex h-40 items-center justify-center ${className}`}>{content}</div>;
}
