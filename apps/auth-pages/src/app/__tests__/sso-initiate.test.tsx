import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SSOInitiatePage from '../sso/initiate/page';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

let mockParams: Record<string, string> = {};

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useParams: () => mockParams,
		Link: ({ to, children }: any) => <a href={to}>{children}</a>,
	};
});

vi.mock('@autional-cn/shared', () => ({
	apiClient: { get: vi.fn(() => Promise.resolve({ data: {} })) },
}));

const mockInitiateSSO = vi.fn();
vi.mock('@autional-cn/shared/generated/api', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional-cn/shared/generated/api')>();
	return {
		...actual,
		authSsoInitiatePost: (...args: any[]) => mockInitiateSSO(...args),
	};
});

const mockUseTenantAuthConfigBySlug = vi.fn(() => ({ data: null, isLoading: false }));

vi.mock('@/hooks/use-tenant-auth-config', () => ({
	useTenantAuthConfigBySlug: vi
		.fn()
		.mockImplementation((...args: any[]) => (mockUseTenantAuthConfigBySlug as any)(...args)),
	useTenantAuthConfig: () => ({ data: null, isLoading: false }),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderSSO(route = '/sso/initiate') {
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={[route]}>
				<SSOInitiatePage />
			</MemoryRouter>
		</QueryClientProvider>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockParams = {};
	mockUseTenantAuthConfigBySlug.mockReturnValue({ data: null, isLoading: false });
});

describe('SSOInitiatePage', () => {
	it('renders provider buttons', () => {
		renderSSO();
		expect(screen.getByText('Okta')).toBeInTheDocument();
		expect(screen.getByText('Azure AD')).toBeInTheDocument();
		expect(screen.getByText('OneLogin')).toBeInTheDocument();
		expect(screen.getByText('Google Workspace')).toBeInTheDocument();
	});

	it('calls initiateSSO with provider on button click', async () => {
		mockInitiateSSO.mockResolvedValue({ data: { authUrl: 'https://okta.com/sso' } });
		const user = userEvent.setup();
		renderSSO();
		await user.click(screen.getByText('Okta'));

		await waitFor(() => {
			expect(mockInitiateSSO).toHaveBeenCalledWith({ provider: 'okta' });
		});
	});

	it('submits domain and calls initiateSSO', async () => {
		mockInitiateSSO.mockResolvedValue({ data: { authUrl: 'https://idp.example.com/sso' } });
		const user = userEvent.setup();
		renderSSO();
		await user.type(screen.getByPlaceholderText('例如：company.com'), 'myorg.com');
		await user.click(screen.getByRole('button', { name: 'sso.continue' }));

		await waitFor(() => {
			expect(mockInitiateSSO).toHaveBeenCalledWith({ provider: 'myorg.com' });
		});
	});

	it('does not call initiateSSO for empty domain', async () => {
		const user = userEvent.setup();
		renderSSO();
		await user.click(screen.getByRole('button', { name: 'sso.continue' }));
		expect(mockInitiateSSO).not.toHaveBeenCalled();
	});

	it('renders dynamic providers when tenant config has sso_providers', async () => {
		mockParams = { tenantSlug: 'my-org' };
		mockUseTenantAuthConfigBySlug.mockReturnValue({
			data: {
				ssoProviders: [
					{ id: 'okta', name: 'My Org Okta' },
					{ id: 'azuread', name: 'Company Azure AD' },
				],
				tenantId: 't1',
				tenantSlug: 'my-org',
				tenantName: 'My Org',
			} as any,
			isLoading: false,
		});
		renderSSO('/sso/initiate/my-org');
		expect(screen.getByText('My Org Okta')).toBeInTheDocument();
		expect(screen.getByText('Company Azure AD')).toBeInTheDocument();
		expect(screen.queryByText('OneLogin')).not.toBeInTheDocument();
	});

	it('renders unknown provider with fallback icon', async () => {
		mockParams = { tenantSlug: 'custom' };
		mockUseTenantAuthConfigBySlug.mockReturnValue({
			data: {
				ssoProviders: [{ id: 'custom_idp', name: 'Custom IDP' }],
				tenantId: 't1',
				tenantSlug: 'custom',
				tenantName: 'Custom',
			} as any,
			isLoading: false,
		});
		renderSSO('/sso/initiate/custom');
		expect(screen.getByText('Custom IDP')).toBeInTheDocument();
		expect(screen.getByText('🔗')).toBeInTheDocument();
	});
});
