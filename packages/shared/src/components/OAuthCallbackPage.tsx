import { useEffect, useState } from 'react';
import { handleOAuthCallback } from '../auth/oauth-login';

export function OAuthCallbackPage() {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		handleOAuthCallback().catch((e) => {
			setError(e.message);
			setLoading(false);
		});
	}, []);

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center bg-neutral-50">
				<div className="flex flex-col items-center gap-3">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
					<p className="text-sm text-neutral-500">Signing in...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen items-center justify-center bg-neutral-50">
			<div className="max-w-sm rounded-lg border border-red-200 bg-red-50 p-6 text-center">
				<p className="text-sm font-medium text-red-700">Login failed</p>
				<p className="mt-1 text-xs text-red-600">{error}</p>
				<a href="/" className="mt-4 inline-block text-sm text-blue-600 underline">
					Try again
				</a>
			</div>
		</div>
	);
}
