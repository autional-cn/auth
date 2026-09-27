import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
const mockApiClientPost = vi.fn();
const mockAuthMeDeleteAccountPost = vi.fn();
vi.mock('@autional-cn/shared', () => ({
	apiClient: {
		post: (...args: any[]) => (mockApiClientPost as any)(...args),
	},
	logout: (...args: any[]) => mockLogout(...args),
	END_USER_PORTAL_URL: () => '/user',
	crossAppUrl: (path: string) => path,
	loginWithTokens: vi.fn(),
	getAccessToken: () => null,
}));

vi.mock('@autional-cn/shared/generated/api', () => ({
	authMeDeleteAccountPost: (...args: any[]) => mockAuthMeDeleteAccountPost(...args),
}));

function renderAccountDeletion() {
	return render(
		<MemoryRouter initialEntries={['/account-deletion']}>
			<AccountDeletionPage />
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockAuthMeDeleteAccountPost.mockResolvedValue({ data: { code: 1, message: 'ok' } });
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

	it('renders account center link pointing to end user portal security page', () => {
		renderAccountDeletion();
		const accountLink = screen.getByText(/deletion\.goToAccountCenter/).closest('a');
		expect(accountLink).toBeInTheDocument();
		expect(accountLink).toHaveAttribute('href', '/user/security');
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

describe('AccountDeletionPage - Successful Deletion', () => {
	it('calls API to delete account on modal confirm', async () => {
		mockAuthMeDeleteAccountPost.mockResolvedValue({ data: { code: 1, message: 'ok' } });

		renderAccountDeletion();

		const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
		fireEvent.change(passwordInput, { target: { value: 'MyPassword123' } });
		fireEvent.click(screen.getByRole('button', { name: 'deletion.confirm' }));

		await waitFor(() => {
			expect(screen.getByText('deletion.modalTitle')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'deletion.modalConfirm' }));

		await waitFor(() => {
			expect(mockAuthMeDeleteAccountPost).toHaveBeenCalledWith({ password: 'MyPassword123' });
		});
	});

	it('calls logout with account_deleted redirect after successful deletion', async () => {
		mockAuthMeDeleteAccountPost.mockResolvedValue({ data: { code: 1, message: 'ok' } });

		renderAccountDeletion();

		const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
		fireEvent.change(passwordInput, { target: { value: 'MyPassword123' } });
		fireEvent.click(screen.getByRole('button', { name: 'deletion.confirm' }));

		await waitFor(() => {
			expect(screen.getByText('deletion.modalTitle')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'deletion.modalConfirm' }));

		await waitFor(() => {
			expect(mockLogout).toHaveBeenCalledWith('/login?account_deleted=true');
		});
	});

	it('displays success screen after deletion', async () => {
		mockAuthMeDeleteAccountPost.mockResolvedValue({ data: { code: 1, message: 'ok' } });

		renderAccountDeletion();

		const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
		fireEvent.change(passwordInput, { target: { value: 'MyPassword123' } });
		fireEvent.click(screen.getByRole('button', { name: 'deletion.confirm' }));

		await waitFor(() => {
			expect(screen.getByText('deletion.modalTitle')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'deletion.modalConfirm' }));

		await waitFor(() => {
			expect(screen.getByText('deletion.success')).toBeInTheDocument();
		});
		expect(screen.getByText('deletion.successDesc')).toBeInTheDocument();
	});

	it('shows back to home button on success screen', async () => {
		mockAuthMeDeleteAccountPost.mockResolvedValue({ data: { code: 1, message: 'ok' } });

		renderAccountDeletion();

		const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
		fireEvent.change(passwordInput, { target: { value: 'MyPassword123' } });
		fireEvent.click(screen.getByRole('button', { name: 'deletion.confirm' }));

		await waitFor(() => {
			expect(screen.getByText('deletion.modalTitle')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'deletion.modalConfirm' }));

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'deletion.backHome' })).toBeInTheDocument();
		});
	});

	it('navigates to home when back home button is clicked on success screen', async () => {
		mockAuthMeDeleteAccountPost.mockResolvedValue({ data: { code: 1, message: 'ok' } });

		renderAccountDeletion();

		const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
		fireEvent.change(passwordInput, { target: { value: 'MyPassword123' } });
		fireEvent.click(screen.getByRole('button', { name: 'deletion.confirm' }));

		await waitFor(() => {
			expect(screen.getByText('deletion.modalTitle')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'deletion.modalConfirm' }));

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'deletion.backHome' })).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'deletion.backHome' }));
		expect(mockNavigate).toHaveBeenCalledWith('/');
	});
});

describe('AccountDeletionPage - API Error Handling', () => {
	it('shows error message when deletion API fails', async () => {
		mockAuthMeDeleteAccountPost.mockRejectedValue({
			response: { data: { message: '密码错误，无法删除账户' } },
		});

		renderAccountDeletion();

		const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
		fireEvent.change(passwordInput, { target: { value: 'WrongPassword' } });
		fireEvent.click(screen.getByRole('button', { name: 'deletion.confirm' }));

		await waitFor(() => {
			expect(screen.getByText('deletion.modalTitle')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'deletion.modalConfirm' }));

		await waitFor(() => {
			expect(screen.getByText('密码错误，无法删除账户')).toBeInTheDocument();
		});
	});

	it('closes modal after API error', async () => {
		mockAuthMeDeleteAccountPost.mockRejectedValue({
			response: { data: { message: '服务器错误' } },
		});

		renderAccountDeletion();

		const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
		fireEvent.change(passwordInput, { target: { value: 'MyPassword123' } });
		fireEvent.click(screen.getByRole('button', { name: 'deletion.confirm' }));

		await waitFor(() => {
			expect(screen.getByText('deletion.modalTitle')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'deletion.modalConfirm' }));

		await waitFor(() => {
			expect(screen.queryByText('deletion.modalTitle')).toBeNull();
		});
		expect(screen.getByText('deletion.title')).toBeInTheDocument();
	});

	it('shows fallback error message when API response has no message', async () => {
		mockAuthMeDeleteAccountPost.mockRejectedValue({
			response: {},
		});

		renderAccountDeletion();

		const passwordInput = screen.getByPlaceholderText('deletion.passwordPlaceholder');
		fireEvent.change(passwordInput, { target: { value: 'MyPassword123' } });
		fireEvent.click(screen.getByRole('button', { name: 'deletion.confirm' }));

		await waitFor(() => {
			expect(screen.getByText('deletion.modalTitle')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'deletion.modalConfirm' }));

		await waitFor(() => {
			expect(screen.getByText('deletion.deleteFailed')).toBeInTheDocument();
		});
	});
});

describe('AccountDeletionPage - Navigation', () => {
	it('navigates to dashboard when cancel link is clicked', () => {
		renderAccountDeletion();

		const cancelLink = screen.getByText('deletion.cancel');
		fireEvent.click(cancelLink);

		expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
	});
});
