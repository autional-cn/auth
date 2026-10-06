import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AccountDeletionPage from '../account-deletion/page';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => (opts ? `${key} ${JSON.stringify(opts)}` : key),
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
		Link: ({ to, children }: any) => <a href={to}>{children}</a>,
	};
});

const mockLogout = vi.fn();
const mockReAuthenticate = vi.fn();
const mockDeleteAccount = vi.fn();
const mockFetchMode = vi.fn();
const mockProcessPassword = vi.fn();

vi.mock('@autional/shared', () => ({
	logout: (...args: any[]) => mockLogout(...args),
	useAuthStore: { getState: () => ({ currentTenantId: 'tenant-1' }) },
	END_USER_PORTAL_URL: () => '/user',
	crossAppUrl: (base: string, path?: string) => base + (path || ''),
}));

vi.mock('@/hooks/use-tenant-slug', () => ({
	useEffectiveTenantSlug: () => 'demo',
	// AUTH-48/49：AuthCard 页脚法律链消费已解析 slug
	useResolvedTenantSlug: () => 'demo',
}));

vi.mock('@/hooks/use-tenant-auth-config', () => ({
	useTenantAuthConfigBySlug: () => ({ data: { tenantId: 'tenant-1' } }),
}));

vi.mock('@/lib/password-transmission', () => ({
	fetchPasswordTransmissionMode: (...args: any[]) => mockFetchMode(...args),
	processPasswordForTransmission: (...args: any[]) => mockProcessPassword(...args),
}));

vi.mock('@/lib/api.generated', () => ({
	reAuthenticate: (...args: any[]) => mockReAuthenticate(...args),
	deleteAccount: (...args: any[]) => mockDeleteAccount(...args),
}));

function renderAccountDeletion() {
	return render(
		<MemoryRouter initialEntries={['/account-deletion']}>
			<AccountDeletionPage />
		</MemoryRouter>,
	);
}

async function openModalAndConfirm(password = 'MyPassword123') {
	const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
	fireEvent.change(passwordInput, { target: { value: password } });
	fireEvent.click(screen.getByRole('button', { name: 'deletion.confirm' }));
	await waitFor(() => {
		expect(screen.getByText('deletion.modalTitle')).toBeInTheDocument();
	});
	fireEvent.click(screen.getByRole('button', { name: 'deletion.modalConfirm' }));
}

beforeEach(() => {
	vi.clearAllMocks();
	mockFetchMode.mockResolvedValue('plain');
	mockProcessPassword.mockImplementation(async (password: string) => ({ password }));
	mockReAuthenticate.mockResolvedValue({ stepUpToken: 'step-up-token-1' });
	mockDeleteAccount.mockResolvedValue({ message: 'ok' });
});

describe('AccountDeletionPage - Rendering', () => {
	it('renders the page title', () => {
		renderAccountDeletion();
		expect(screen.getByText('deletion.title')).toBeInTheDocument();
	});

	it('renders the warning description text', () => {
		renderAccountDeletion();
		expect(screen.getByText('deletion.warning')).toBeInTheDocument();
	});

	it('renders a password input field', () => {
		renderAccountDeletion();
		const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
		expect(passwordInput).toBeInTheDocument();
		expect(passwordInput).toHaveAttribute('type', 'password');
	});

	it('renders a danger-styled delete confirmation button', () => {
		renderAccountDeletion();
		const deleteButton = screen.getByRole('button', { name: 'deletion.confirm' });
		expect(deleteButton).toBeInTheDocument();
	});

	it('renders a cancel link', () => {
		renderAccountDeletion();
		expect(screen.getByText('deletion.cancel')).toBeInTheDocument();
	});
});

describe('AccountDeletionPage - GDPR Warning', () => {
	it('renders irreversible deletion warning header', () => {
		renderAccountDeletion();
		expect(screen.getByText('deletion.irreversible')).toBeInTheDocument();
	});

	it('lists GDPR-related consequences of deletion', () => {
		renderAccountDeletion();
		expect(screen.getByText('deletion.itemProfile')).toBeInTheDocument();
		expect(screen.getByText('deletion.itemHistory')).toBeInTheDocument();
		expect(screen.getByText('deletion.itemNoLogin')).toBeInTheDocument();
		expect(screen.getByText('deletion.itemGDPR')).toBeInTheDocument();
	});
});

describe('AccountDeletionPage - Account Center Notice', () => {
	it('shows account center notice paragraph', () => {
		renderAccountDeletion();
		expect(screen.getByText('deletion.alsoInAccountCenter')).toBeInTheDocument();
	});

	it('renders account center link with go-to text', () => {
		renderAccountDeletion();
		expect(screen.getByText(/deletion\.goToAccountCenter/)).toBeInTheDocument();
	});

	it('renders account center link with tenant slug in deep link', () => {
		renderAccountDeletion();
		const accountLink = screen.getByText(/deletion\.goToAccountCenter/).closest('a');
		expect(accountLink).toBeInTheDocument();
		expect(accountLink).toHaveAttribute('href', '/user/demo/security');
	});
});

describe('AccountDeletionPage - Validation', () => {
	it('shows validation error when password is empty on submit', async () => {
		renderAccountDeletion();

		const deleteButton = screen.getByRole('button', { name: 'deletion.confirm' });
		fireEvent.click(deleteButton);

		await waitFor(() => {
			expect(screen.getByText('validation.passwordRequired')).toBeInTheDocument();
		});
	});

	it('does not show confirmation modal when validation fails', async () => {
		renderAccountDeletion();

		const deleteButton = screen.getByRole('button', { name: 'deletion.confirm' });
		fireEvent.click(deleteButton);

		await waitFor(() => {
			expect(screen.getByText('validation.passwordRequired')).toBeInTheDocument();
		});
		expect(screen.queryByText('deletion.modalTitle')).toBeNull();
	});
});

describe('AccountDeletionPage - Confirmation Modal', () => {
	it('opens confirmation modal when form is submitted with a password', async () => {
		renderAccountDeletion();

		const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
		fireEvent.change(passwordInput, { target: { value: 'MyPassword123' } });

		const deleteButton = screen.getByRole('button', { name: 'deletion.confirm' });
		fireEvent.click(deleteButton);

		await waitFor(() => {
			expect(screen.getByText('deletion.modalTitle')).toBeInTheDocument();
		});
	});

	it('shows descriptive warning text in the modal', async () => {
		renderAccountDeletion();

		const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
		fireEvent.change(passwordInput, { target: { value: 'MyPassword123' } });

		fireEvent.click(screen.getByRole('button', { name: 'deletion.confirm' }));

		await waitFor(() => {
			expect(screen.getByText('deletion.modalTitle')).toBeInTheDocument();
			expect(screen.getByText('deletion.modalDesc')).toBeInTheDocument();
		});
	});

	it('renders cancel and confirm buttons in the modal', async () => {
		renderAccountDeletion();

		const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
		fireEvent.change(passwordInput, { target: { value: 'MyPassword123' } });

		fireEvent.click(screen.getByRole('button', { name: 'deletion.confirm' }));

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'deletion.modalCancel' })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'deletion.modalConfirm' })).toBeInTheDocument();
		});
	});

	it('closes modal when cancel is clicked', async () => {
		renderAccountDeletion();

		const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
		fireEvent.change(passwordInput, { target: { value: 'MyPassword123' } });
		fireEvent.click(screen.getByRole('button', { name: 'deletion.confirm' }));

		await waitFor(() => {
			expect(screen.getByText('deletion.modalTitle')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'deletion.modalCancel' }));

		await waitFor(() => {
			expect(screen.queryByText('deletion.modalTitle')).toBeNull();
			expect(screen.getByText('deletion.title')).toBeInTheDocument();
		});
	});
});

describe('AccountDeletionPage - Step-up Flow (AUTH-42)', () => {
	it('pre-processes password by tenant transmission mode before both calls', async () => {
		mockFetchMode.mockResolvedValue('hash');
		mockProcessPassword.mockImplementation(async (password: string) => ({
			password: `hashed:${password}`,
		}));

		renderAccountDeletion();
		await openModalAndConfirm('MyPassword123');

		await waitFor(() => {
			expect(mockFetchMode).toHaveBeenCalledWith('tenant-1');
			expect(mockProcessPassword).toHaveBeenCalledWith(
				'MyPassword123',
				'hash',
				'tenant-1',
				undefined,
			);
		});
	});

	it('re-authenticates then deletes with single-use step-up token header', async () => {
		renderAccountDeletion();
		await openModalAndConfirm('MyPassword123');

		await waitFor(() => {
			expect(mockReAuthenticate).toHaveBeenCalledWith({ password: 'MyPassword123' });
			expect(mockDeleteAccount).toHaveBeenCalledWith(
				{ password: 'MyPassword123' },
				{ headers: { 'X-StepUp-Token': 'step-up-token-1' } },
			);
		});
	});

	it('fails closed when re-authenticate returns no step-up token', async () => {
		mockReAuthenticate.mockResolvedValue({ message: 'ok' });

		renderAccountDeletion();
		await openModalAndConfirm('MyPassword123');

		await waitFor(() => {
			expect(screen.getByText('deletion.deleteGeneric')).toBeInTheDocument();
		});
		expect(mockDeleteAccount).not.toHaveBeenCalled();
	});
});

describe('AccountDeletionPage - Successful Deletion', () => {
	it('calls logout with account_deleted redirect after successful deletion', async () => {
		renderAccountDeletion();
		await openModalAndConfirm('MyPassword123');

		await waitFor(() => {
			expect(mockLogout).toHaveBeenCalledWith('/login?account_deleted=true');
		});
	});

	it('displays success screen after deletion', async () => {
		renderAccountDeletion();
		await openModalAndConfirm('MyPassword123');

		await waitFor(() => {
			expect(screen.getByText('deletion.success')).toBeInTheDocument();
		});
		expect(screen.getByText('deletion.successDesc')).toBeInTheDocument();
	});

	it('shows back to home button on success screen', async () => {
		renderAccountDeletion();
		await openModalAndConfirm('MyPassword123');

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'deletion.backHome' })).toBeInTheDocument();
		});
	});

	it('navigates to home when back home button is clicked on success screen', async () => {
		renderAccountDeletion();
		await openModalAndConfirm('MyPassword123');

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'deletion.backHome' })).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'deletion.backHome' }));
		expect(mockNavigate).toHaveBeenCalledWith('/');
	});
});

describe('AccountDeletionPage - API Error Handling', () => {
	it('shows error message when deletion API fails', async () => {
		mockDeleteAccount.mockRejectedValue({
			response: { data: { message: '密码错误，无法删除账户' } },
		});

		renderAccountDeletion();
		await openModalAndConfirm('WrongPassword');

		await waitFor(() => {
			expect(screen.getByText('密码错误，无法删除账户')).toBeInTheDocument();
		});
	});

	it('closes modal after API error', async () => {
		mockReAuthenticate.mockRejectedValue({
			response: { data: { message: '服务器错误' } },
		});

		renderAccountDeletion();
		await openModalAndConfirm('MyPassword123');

		await waitFor(() => {
			expect(screen.queryByText('deletion.modalTitle')).toBeNull();
		});
		expect(screen.getByText('deletion.title')).toBeInTheDocument();
	});

	it('maps step-up required code (40800251) to reauth-expired message', async () => {
		mockDeleteAccount.mockRejectedValue({ response: { data: { code: 40800251 } } });

		renderAccountDeletion();
		await openModalAndConfirm('MyPassword123');

		await waitFor(() => {
			expect(screen.getByText('deletion.reauthExpired')).toBeInTheDocument();
		});
	});

	it('maps password mismatch codes (61000104 / 40000502) to wrong-password message', async () => {
		mockReAuthenticate.mockRejectedValue({ response: { data: { code: 61000104 } } });

		renderAccountDeletion();
		await openModalAndConfirm('WrongPassword');

		await waitFor(() => {
			expect(screen.getByText('auth.password.oldPasswordWrong')).toBeInTheDocument();
		});
	});

	it('shows fallback error message when API response has no message or code', async () => {
		mockDeleteAccount.mockRejectedValue({ response: {} });

		renderAccountDeletion();
		await openModalAndConfirm('MyPassword123');

		await waitFor(() => {
			expect(screen.getByText('deletion.deleteGeneric')).toBeInTheDocument();
		});
	});
});

describe('AccountDeletionPage - Navigation', () => {
	// AUTH-45③：取消回跳改落 account（原落 dashboard；测试路由无租户段 → 裸链）
	it('navigates to account page when cancel link is clicked', () => {
		renderAccountDeletion();

		const cancelLink = screen.getByText('deletion.cancel');
		fireEvent.click(cancelLink);

		expect(mockNavigate).toHaveBeenCalledWith('/account');
	});
});
