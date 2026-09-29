import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ROUTER_BASENAME } from '@autional-cn/shared';
import App from './App';
import './non-tenant-segments';
import './app/globals.css';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { retry: 1, staleTime: 30000 },
	},
});

const root = document.getElementById('root');
if (root) {
	createRoot(root).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter basename={ROUTER_BASENAME}>
					<App />
				</BrowserRouter>
			</QueryClientProvider>
		</StrictMode>,
	);
}
