import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import VerifyIdentityPage from '../verify-identity/page';

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

const mockApiClientPost = vi.fn();
vi.mock('@autional-cn/shared', () => ({
	apiClient: {
		post: (...args: any[]) => mockApiClientPost(...args),
	},
	loginWithTokens: vi.fn(),
	getAccessToken: () => null,
}));

const mockAuthMeConsentPost = vi.fn();
const mockCompliancePublicLegalDocuments = vi.fn();
const mockVerificationOcrPost = vi.fn();
const mockVerificationVerifyPost = vi.fn();
vi.mock('@autional-cn/shared/generated/api', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional-cn/shared/generated/api')>();
	return {
		...actual,
		authMeConsentPost: (...args: any[]) => mockAuthMeConsentPost(...args),
		compliancePublicLegalDocuments: (...args: any[]) => mockCompliancePublicLegalDocuments(...args),
		verificationOcrPost: (...args: any[]) => mockVerificationOcrPost(...args),
		verificationVerifyPost: (...args: any[]) => mockVerificationVerifyPost(...args),
	};
});

beforeAll(() => {
	(URL as any).createObjectURL = vi.fn(() => 'blob:mock-url');
	(URL as any).revokeObjectURL = vi.fn();

	(window as any).FileReader = class {
		result = '';
		onload: (() => void) | null = null;
		onerror: (() => void) | null = null;
		readAsDataURL(_file: File) {
			this.result = 'data:image/jpeg;base64,mockbase64data';
			this.onload?.();
		}
	};
});

const mockOcrResult = {
	name: '张三',
	idNumber: '110101199001011234',
	dateOfBirth: '1990-01-01',
	gender: 'M',
	confidence: 0.95,
};

const mockVerificationResultApproved = {
	status: 'approved' as const,
	verifiedAt: '2025-06-01T10:00:00Z',
	message: '身份验证通过',
};

const mockVerificationResultRejected = {
	status: 'rejected' as const,
	verifiedAt: '2025-06-01T10:00:00Z',
	message: '身份信息不匹配',
};

const mockVerificationResultPending = {
	status: 'pending' as const,
	verifiedAt: '2025-06-01T10:00:00Z',
	message: '审核中',
};

function renderVerifyIdentity() {
	return render(
		<MemoryRouter initialEntries={['/verify-identity']}>
			<VerifyIdentityPage />
		</MemoryRouter>,
	);
}

function createImageFile(name: string, sizeMb: number = 0.1): File {
	const sizeBytes = sizeMb * 1024 * 1024;
	const content = new Uint8Array(sizeBytes);
	return new File([content], name, { type: 'image/jpeg' });
}

function setupOcrAndVerifyMocks(verificationResult?: any) {
	mockVerificationOcrPost.mockReset();
	mockVerificationOcrPost.mockResolvedValueOnce({ data: mockOcrResult });
	if (verificationResult) {
		mockVerificationVerifyPost.mockReset();
		mockVerificationVerifyPost.mockResolvedValueOnce({ data: verificationResult });
	}
}

beforeEach(() => {
	vi.clearAllMocks();
	mockVerificationOcrPost.mockResolvedValue({ data: mockOcrResult });
	mockAuthMeConsentPost.mockResolvedValue({ code: 1 });
	mockCompliancePublicLegalDocuments.mockResolvedValue({ version: 'v2' });
});

describe('VerifyIdentityPage - Step 1 Upload', () => {
	it('renders upload step with title and guide text', () => {
		renderVerifyIdentity();
		expect(screen.getByText('auth.verifyIdentity.title')).toBeInTheDocument();
		expect(screen.getByText(/flat\.auth\.verifyIdentity\.uploadGuide/)).toBeInTheDocument();
	});

	it('renders front and back ID card upload areas with placeholder text', () => {
		renderVerifyIdentity();
		expect(screen.getByText('auth.verifyIdentity.uploadFront')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.uploadBack')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.uploadFrontPlaceholder')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.uploadBackPlaceholder')).toBeInTheDocument();
	});

	it('renders two hidden file inputs accepting images', () => {
		renderVerifyIdentity();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		expect(fileInputs).toHaveLength(2);
		fileInputs.forEach((input) => {
			expect((input as HTMLInputElement).accept).toBe('image/jpeg,image/png,image/webp');
		});
	});

	it('renders upload tips section', () => {
		renderVerifyIdentity();
		expect(screen.getByText('auth.verifyIdentity.uploadTipsTitle')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.uploadTip1')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.uploadTip2')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.uploadTip3')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.uploadTip4')).toBeInTheDocument();
	});

	it('renders step indicator with step numbers 1-4', () => {
		renderVerifyIdentity();
		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
		expect(screen.getByText('4')).toBeInTheDocument();
	});

	it('disables submit button until both images are selected', () => {
		renderVerifyIdentity();
		const submitButton = screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' });
		expect(submitButton).toBeDisabled();
	});
});

describe('VerifyIdentityPage - Image Validation', () => {
	it('shows toast warning for non-image file types', async () => {
		renderVerifyIdentity();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		const textFile = new File(['not an image'], 'document.pdf', { type: 'application/pdf' });

		fireEvent.change(fileInputs[0], { target: { files: [textFile] } });

		await waitFor(() => {
			expect(screen.getByText('auth.verifyIdentity.uploadErrorImageType')).toBeInTheDocument();
		});
	});

	it('rejects files larger than 10MB on front input', () => {
		renderVerifyIdentity();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		const largeFile = createImageFile('large.jpg', 11);

		fireEvent.change(fileInputs[0], { target: { files: [largeFile] } });

		expect(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' })).toBeDisabled();
	});

	it('rejects files larger than 10MB on back input', () => {
		renderVerifyIdentity();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		const largeFile = createImageFile('large.jpg', 11);

		fireEvent.change(fileInputs[1], { target: { files: [largeFile] } });

		expect(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' })).toBeDisabled();
	});

	it('accepts files within 10MB limit', () => {
		renderVerifyIdentity();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		const smallFile = createImageFile('small.jpg', 0.5);

		fireEvent.change(fileInputs[0], { target: { files: [smallFile] } });
		fireEvent.change(fileInputs[1], { target: { files: [smallFile] } });

		expect(
			screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' }),
		).not.toBeDisabled();
	});
});

describe('VerifyIdentityPage - Step 2 OCR Confirm', () => {
	async function advanceToConfirmStep() {
		renderVerifyIdentity();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		const smallFile = createImageFile('id.jpg', 0.5);

		fireEvent.change(fileInputs[0], { target: { files: [smallFile] } });
		fireEvent.change(fileInputs[1], { target: { files: [smallFile] } });

		const nextButton = screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' });
		fireEvent.click(nextButton);

		await waitFor(() => {
			expect(screen.getByText('auth.verifyIdentity.confirmEditHint')).toBeInTheDocument();
		});
	}

	it('advances to confirm step after OCR succeeds', async () => {
		await advanceToConfirmStep();
		expect(screen.getByText('auth.verifyIdentity.confirmName')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.confirmIdNumber')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.confirmDob')).toBeInTheDocument();
	});

	it('pre-fills OCR extracted data into form fields', async () => {
		await advanceToConfirmStep();

		const nameInput = screen.getByPlaceholderText('auth.verifyIdentity.confirmNamePlaceholder');
		const idNumberInput = screen.getByPlaceholderText(
			'auth.verifyIdentity.confirmIdNumberPlaceholder',
		);

		expect(nameInput).toHaveValue('张三');
		expect(idNumberInput).toHaveValue('110101199001011234');
	});

	it('displays OCR confidence percentage', async () => {
		await advanceToConfirmStep();
		expect(screen.getByText('auth.verifyIdentity.ocrConfidence')).toBeInTheDocument();
		expect(screen.getByText('95%')).toBeInTheDocument();
	});

	it('shows gender extracted from OCR', async () => {
		await advanceToConfirmStep();
		expect(screen.getByText(/auth\.verifyIdentity\.confirmGender/)).toBeInTheDocument();
		expect(screen.getByText(/auth\.verifyIdentity\.genderMale/)).toBeInTheDocument();
	});

	it('validates required name field', async () => {
		await advanceToConfirmStep();

		const nameInput = screen.getByPlaceholderText('auth.verifyIdentity.confirmNamePlaceholder');
		fireEvent.change(nameInput, { target: { value: '' } });

		const confirmButton = screen.getByRole('button', { name: 'auth.verifyIdentity.confirmEdit' });
		fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(screen.getByText('validation.nameRequired')).toBeInTheDocument();
		});
	});

	it('validates ID number format - too short', async () => {
		await advanceToConfirmStep();

		const idInput = screen.getByPlaceholderText('auth.verifyIdentity.confirmIdNumberPlaceholder');
		fireEvent.change(idInput, { target: { value: '123' } });

		const confirmButton = screen.getByRole('button', { name: 'auth.verifyIdentity.confirmEdit' });
		fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(screen.getByText('validation.idNumberInvalid')).toBeInTheDocument();
		});
	});

	it('validates ID number format - invalid date month', async () => {
		await advanceToConfirmStep();

		const idInput = screen.getByPlaceholderText('auth.verifyIdentity.confirmIdNumberPlaceholder');
		fireEvent.change(idInput, { target: { value: '110101199013011234' } });

		const confirmButton = screen.getByRole('button', { name: 'auth.verifyIdentity.confirmEdit' });
		fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(screen.getByText('validation.idNumberInvalid')).toBeInTheDocument();
		});
	});

	it('accepts valid 18-digit Chinese ID number and advances', async () => {
		await advanceToConfirmStep();

		const idInput = screen.getByPlaceholderText('auth.verifyIdentity.confirmIdNumberPlaceholder');
		fireEvent.change(idInput, { target: { value: '110101199001011234' } });

		const confirmButton = screen.getByRole('button', { name: 'auth.verifyIdentity.confirmEdit' });
		fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(screen.getByText('auth.verifyIdentity.consentTitle')).toBeInTheDocument();
		});
	});

	it('displays OCR error when API call fails', async () => {
		mockVerificationOcrPost.mockReset();
		mockVerificationOcrPost.mockRejectedValue({
			response: { data: { message: 'OCR识别失败' } },
		});

		renderVerifyIdentity();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		const smallFile = createImageFile('id.jpg', 0.5);

		fireEvent.change(fileInputs[0], { target: { files: [smallFile] } });
		fireEvent.change(fileInputs[1], { target: { files: [smallFile] } });

		const nextButton = screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' });
		fireEvent.click(nextButton);

		await waitFor(() => {
			expect(screen.getAllByText('OCR识别失败').length).toBeGreaterThanOrEqual(1);
		});
	});
});

describe('VerifyIdentityPage - Step 3 GDPR Consent', () => {
	async function advanceToConsentStep() {
		renderVerifyIdentity();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		const smallFile = createImageFile('id.jpg', 0.5);

		fireEvent.change(fileInputs[0], { target: { files: [smallFile] } });
		fireEvent.change(fileInputs[1], { target: { files: [smallFile] } });

		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' }));
		await waitFor(() => {
			expect(screen.getByText('auth.verifyIdentity.confirmEditHint')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.confirmEdit' }));
		await waitFor(() => {
			expect(screen.getByText('auth.verifyIdentity.consentTitle')).toBeInTheDocument();
		});
	}

	it('renders GDPR consent title and PIP notes', async () => {
		await advanceToConsentStep();
		expect(screen.getByText('auth.verifyIdentity.consentTitle')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.consentPipNote')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.consentPipNote2')).toBeInTheDocument();
	});

	it('shows three consent checkboxes with labels', async () => {
		await advanceToConsentStep();

		const checkboxes = document.querySelectorAll('input[type="checkbox"]');
		expect(checkboxes).toHaveLength(3);

		expect(screen.getByText(/auth\.verifyIdentity\.consentPiiTitle/)).toBeInTheDocument();
		expect(screen.getByText(/auth\.verifyIdentity\.consentThirdPartyTitle/)).toBeInTheDocument();
		expect(screen.getByText(/auth\.verifyIdentity\.consentFaceTitle/)).toBeInTheDocument();
	});

	it('disables continue button when no consent is checked', async () => {
		await advanceToConsentStep();
		const continueButton = screen.getByRole('button', {
			name: 'auth.verifyIdentity.consentContinue',
		});
		expect(continueButton).toBeDisabled();
	});

	it('enables continue button after all consents are checked', async () => {
		await advanceToConsentStep();
		const checkboxes = document.querySelectorAll('input[type="checkbox"]');

		fireEvent.click(checkboxes[0]);
		fireEvent.click(checkboxes[1]);
		fireEvent.click(checkboxes[2]);

		const continueButton = screen.getByRole('button', {
			name: 'auth.verifyIdentity.consentContinue',
		});
		expect(continueButton).not.toBeDisabled();
	});

	it('submits GDPR consent to API and advances to verify step', async () => {
		mockAuthMeConsentPost.mockResolvedValue({ code: 1 });

		await advanceToConsentStep();
		const checkboxes = document.querySelectorAll('input[type="checkbox"]');

		fireEvent.click(checkboxes[0]);
		fireEvent.click(checkboxes[1]);
		fireEvent.click(checkboxes[2]);

		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.consentContinue' }));

		await waitFor(() => {
			expect(mockAuthMeConsentPost).toHaveBeenCalledTimes(3);
		});
		expect(mockAuthMeConsentPost.mock.calls.map((c) => c[0].scope)).toEqual([
			'identity_verification_pii',
			'identity_verification_third_party',
			'identity_verification_face',
		]);
	});

	it('stamps the consent with the version published by the API', async () => {
		mockCompliancePublicLegalDocuments.mockResolvedValue({ version: 'v9' });

		await advanceToConsentStep();
		const checkboxes = document.querySelectorAll('input[type="checkbox"]');
		fireEvent.click(checkboxes[0]);
		fireEvent.click(checkboxes[1]);
		fireEvent.click(checkboxes[2]);

		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.consentContinue' }));

		await waitFor(() => {
			expect(mockAuthMeConsentPost).toHaveBeenCalledTimes(3);
		});
		for (const call of mockAuthMeConsentPost.mock.calls) {
			expect(call[0].metadata).toEqual({ version: 'v9' });
		}
		expect(mockCompliancePublicLegalDocuments).toHaveBeenCalledWith({
			doc_type: 'privacy',
			lang: 'zh-CN',
		});
	});

	it('omits the version instead of guessing when the legal-document API fails', async () => {
		mockCompliancePublicLegalDocuments.mockRejectedValue(new Error('502'));

		await advanceToConsentStep();
		const checkboxes = document.querySelectorAll('input[type="checkbox"]');
		fireEvent.click(checkboxes[0]);
		fireEvent.click(checkboxes[1]);
		fireEvent.click(checkboxes[2]);

		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.consentContinue' }));

		await waitFor(() => {
			expect(mockAuthMeConsentPost).toHaveBeenCalledTimes(3);
		});
		for (const call of mockAuthMeConsentPost.mock.calls) {
			expect(call[0].metadata).toBeUndefined();
		}
	});
});

describe('VerifyIdentityPage - Step 4 Verification', () => {
	async function advanceToVerifyStep() {
		mockAuthMeConsentPost.mockResolvedValue({ code: 1 });

		renderVerifyIdentity();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		const smallFile = createImageFile('id.jpg', 0.5);

		fireEvent.change(fileInputs[0], { target: { files: [smallFile] } });
		fireEvent.change(fileInputs[1], { target: { files: [smallFile] } });
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' }));

		await waitFor(() => {
			expect(screen.getByText('auth.verifyIdentity.confirmEditHint')).toBeInTheDocument();
		});
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.confirmEdit' }));

		await waitFor(() => {
			expect(screen.getByText('auth.verifyIdentity.consentTitle')).toBeInTheDocument();
		});

		const checkboxes = document.querySelectorAll('input[type="checkbox"]');
		fireEvent.click(checkboxes[0]);
		fireEvent.click(checkboxes[1]);
		fireEvent.click(checkboxes[2]);
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.consentContinue' }));

		await waitFor(() => {
			expect(screen.getByText('auth.verifyIdentity.verifySummary')).toBeInTheDocument();
		});
	}

	it('shows verification summary with masked ID number', async () => {
		await advanceToVerifyStep();

		expect(screen.getByText('auth.verifyIdentity.verifySummaryName')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.verifySummaryIdNumber')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.verifySummaryDob')).toBeInTheDocument();

		expect(screen.getByText('张三')).toBeInTheDocument();
		expect(screen.getByText(/110101\*{6}1234/)).toBeInTheDocument();
		expect(screen.getByText('1990-01-01')).toBeInTheDocument();
	});

	it('shows submit button for verification', async () => {
		await advanceToVerifyStep();
		expect(
			screen.getByRole('button', { name: 'auth.verifyIdentity.verifySubmit' }),
		).toBeInTheDocument();
	});
});

describe('VerifyIdentityPage - Step 5 Result', () => {
	async function advanceToResultStep(statusData: any) {
		setupOcrAndVerifyMocks(statusData);
		mockAuthMeConsentPost.mockResolvedValue({ code: 1 });

		renderVerifyIdentity();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		const smallFile = createImageFile('id.jpg', 0.5);

		fireEvent.change(fileInputs[0], { target: { files: [smallFile] } });
		fireEvent.change(fileInputs[1], { target: { files: [smallFile] } });
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' }));

		await waitFor(() => {
			expect(screen.getByText('auth.verifyIdentity.confirmEditHint')).toBeInTheDocument();
		});
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.confirmEdit' }));

		await waitFor(() => {
			expect(screen.getByText('auth.verifyIdentity.consentTitle')).toBeInTheDocument();
		});

		const checkboxes = document.querySelectorAll('input[type="checkbox"]');
		fireEvent.click(checkboxes[0]);
		fireEvent.click(checkboxes[1]);
		fireEvent.click(checkboxes[2]);
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.consentContinue' }));

		await waitFor(() => {
			expect(screen.getByText('auth.verifyIdentity.verifySummary')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.verifySubmit' }));

		await waitFor(() => {
			expect(
				screen.getByText(/auth\.verifyIdentity\.verify(Success|Rejected|Pending)/),
			).toBeInTheDocument();
		});
	}

	it('shows approved result with success message', async () => {
		await advanceToResultStep(mockVerificationResultApproved);

		expect(screen.getByText('auth.verifyIdentity.verifySuccess')).toBeInTheDocument();
		expect(screen.getByText('身份验证通过')).toBeInTheDocument();
	});

	it('shows rejected result with retry button', async () => {
		await advanceToResultStep(mockVerificationResultRejected);

		expect(screen.getByText('auth.verifyIdentity.verifyRejected')).toBeInTheDocument();
		expect(screen.getByText('身份信息不匹配')).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: 'auth.verifyIdentity.verifyRetry' }),
		).toBeInTheDocument();
	});

	it('shows pending result with wait message', async () => {
		await advanceToResultStep(mockVerificationResultPending);

		expect(screen.getByText('auth.verifyIdentity.verifyPending')).toBeInTheDocument();
		expect(screen.getByText('审核中')).toBeInTheDocument();
	});

	it('shows verification timestamp', async () => {
		await advanceToResultStep(mockVerificationResultApproved);
		expect(screen.getByText(/auth\.verifyIdentity\.verifyTime/)).toBeInTheDocument();
	});

	it('shows back to home link', async () => {
		await advanceToResultStep(mockVerificationResultApproved);
		expect(screen.getByText('auth.verifyIdentity.backHome')).toBeInTheDocument();
	});
});

describe('VerifyIdentityPage - Navigation', () => {
	it('shows cancel button on upload step', () => {
		renderVerifyIdentity();
		const cancelButtons = screen.getAllByRole('button', {
			name: 'auth.verifyIdentity.verifyCancel',
		});
		expect(cancelButtons.length).toBeGreaterThan(0);
	});

	it('shows back and cancel buttons after advancing to confirm step', async () => {
		renderVerifyIdentity();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		const smallFile = createImageFile('id.jpg', 0.5);

		fireEvent.change(fileInputs[0], { target: { files: [smallFile] } });
		fireEvent.change(fileInputs[1], { target: { files: [smallFile] } });
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' }));

		await waitFor(() => {
			expect(screen.getByText('auth.verifyIdentity.confirmEditHint')).toBeInTheDocument();
		});

		expect(
			screen.getByRole('button', { name: 'auth.verifyIdentity.verifyBack' }),
		).toBeInTheDocument();
		const cancelButtons = screen.getAllByRole('button', {
			name: 'auth.verifyIdentity.verifyCancel',
		});
		expect(cancelButtons.length).toBeGreaterThan(0);
	});
});
