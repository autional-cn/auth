import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
	title?: string;
	message?: string;
	retryLabel?: string;
	devMode?: boolean;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		if (this.props.devMode) {
			console.error('[ErrorBoundary] caught:', error, errorInfo);
		}
	}

	render() {
		const { children, fallback, title, message, retryLabel, devMode } = this.props;

		if (this.state.hasError) {
			if (fallback) return fallback;

			if (devMode) {
				return (
					<div
						className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center"
						role="alert"
					>
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
							<AlertTriangle size={32} className="text-rose-600" />
						</div>
						<h2 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
							Dev Error Boundary
						</h2>
						<p className="mt-2 max-w-lg text-sm text-neutral-500 dark:text-neutral-400">
							{this.state.error?.message || 'Unknown error'}
						</p>
						{this.state.error?.stack && (
							<pre className="mt-4 max-h-60 max-w-2xl overflow-auto rounded bg-neutral-100 p-3 text-left text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
								{this.state.error.stack}
							</pre>
						)}
						<button
							onClick={() => window.location.reload()}
							className="mt-6 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
						>
							Reload
						</button>
					</div>
				);
			}

			return (
				<div
					className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center"
					role="alert"
				>
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
						<AlertTriangle size={32} className="text-rose-600" />
					</div>
					<h2 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
						{title || 'Something went wrong'}
					</h2>
					<p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
						{message || 'An unexpected error occurred. Please try refreshing the page.'}
					</p>
					<button
						onClick={() => window.location.reload()}
						className="mt-6 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
					>
						{retryLabel || 'Reload Page'}
					</button>
				</div>
			);
		}

		return children;
	}
}
