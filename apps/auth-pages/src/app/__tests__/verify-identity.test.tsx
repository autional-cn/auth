// ============================================================
// AUTH-29：verify-identity 实名认证全链
//   ① 进页预检：终态（verified/verified_minor/rejected）短路直显，404/非终态/失败放行
//   ② 上传 409 分流：real_name_exists 重查详情，不再误报「OCR 识别失败」
//   ③ 契约对齐：OCR 读 ocr_name/ocr_id_number/verification_id；consent 双轨
//      （identity authMeConsentPost + verification consent_items）；verify 携
//      method=two_element + verification_id query
//   ④ 结果步按后端真值状态渲染（verified/verified_minor/ocr_completed/rejected）
//   ⑤ DOB/gender 僵尸字段移除回归锁
// 模拟真实 i18next：已登记键返回键名（供断言）；未登记键回落 defaultValue（字符串形态）。
// ============================================================
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import VerifyIdentityPage from '../verify-identity/page';

// 已登记 error.* 键（locale 真实存在的键）→ 键名直出；未登记键（如 error.<数字码>）
// 走 defaultValue 探针返回空串 → 页面回落通用文案
const KNOWN_KEYS = new Set([
	'error.verification.real_name_exists',
	'error.verification.real_name_not_found',
	'error.verification.invalid_state',
	'error.verification.max_retries',
	'error.verification.retry_cooldown',
	'error.verification.ocr_unavailable',
	'error.verification.ocr_low_confidence',
	'error.verification.consent_required',
	'error.verification.invalid_id',
	'error.verification.provider_error',
]);

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => {
			if (KNOWN_KEYS.has(key)) return key;
			if (typeof opts === 'string') return opts;
			if (opts && typeof opts === 'object' && 'defaultValue' in opts) return opts.defaultValue;
			return opts ? `${key} ${JSON.stringify(opts)}` : key;
		},
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		Link: ({ to, children }: any) => <a href={to}>{children}</a>,
	};
});

const mockAuthMeConsentPost = vi.fn();
const mockCompliancePublicLegalDocuments = vi.fn();
const mockVerificationConsentPost = vi.fn();
const mockVerificationMeDetail = vi.fn();
const mockVerificationOcrPost = vi.fn();
const mockVerificationVerifyPost = vi.fn();
vi.mock('@autional/shared/generated/api', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional/shared/generated/api')>();
	return {
		...actual,
		authMeConsentPost: (...args: any[]) => mockAuthMeConsentPost(...args),
		compliancePublicLegalDocuments: (...args: any[]) => mockCompliancePublicLegalDocuments(...args),
		verificationConsentPost: (...args: any[]) => mockVerificationConsentPost(...args),
		verificationMeDetail: (...args: any[]) => mockVerificationMeDetail(...args),
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

const VALID_ID = '110101199001011234';
const mockOcrResult = {
	verificationId: 'v-100',
	status: 'ocr_completed',
	ocrName: '张三',
	ocrIdNumber: VALID_ID,
	ocrConfidence: 0.95,
};

beforeEach(() => {
	vi.clearAllMocks();
	mockAuthMeConsentPost.mockReset();
	mockCompliancePublicLegalDocuments.mockReset();
	mockVerificationConsentPost.mockReset();
	mockVerificationMeDetail.mockReset();
	mockVerificationOcrPost.mockReset();
	mockVerificationVerifyPost.mockReset();

	// 预检默认 404（无记录）→ 放行上传流程；需要短路/409 的测试自行覆写
	mockVerificationMeDetail.mockRejectedValue({
		response: { status: 404, data: { code: 61180001, title: 'verification record not found' } },
	});
	mockVerificationOcrPost.mockResolvedValue({ data: mockOcrResult });
	mockVerificationVerifyPost.mockResolvedValue({
		data: { status: 'verified', verifiedAt: '2025-06-01T10:00:00Z' },
	});
	mockAuthMeConsentPost.mockResolvedValue({});
	mockVerificationConsentPost.mockResolvedValue({});
	mockCompliancePublicLegalDocuments.mockResolvedValue({ version: 'v2' });
});

function renderPage() {
	return render(
		<MemoryRouter initialEntries={['/verify-identity']}>
			<VerifyIdentityPage />
		</MemoryRouter>,
	);
}

// 预检门控后上传 UI 才出现——所有非短路用例先过此辅助
async function renderReady() {
	renderPage();
	await screen.findByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' });
}

function createImageFile(name = 'id.jpg', sizeMb = 0.5): File {
	const sizeBytes = sizeMb * 1024 * 1024;
	const content = new Uint8Array(sizeBytes);
	return new File([content], name, { type: 'image/jpeg' });
}

function selectBothImages() {
	const fileInputs = document.querySelectorAll('input[type="file"]');
	const file = createImageFile();
	fireEvent.change(fileInputs[0], { target: { files: [file] } });
	fireEvent.change(fileInputs[1], { target: { files: [file] } });
}

async function advanceToConfirm() {
	await renderReady();
	selectBothImages();
	fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' }));
	await screen.findByText('auth.verifyIdentity.confirmEditHint');
}

async function advanceToConsent() {
	await advanceToConfirm();
	fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.confirmEdit' }));
	await screen.findByText('auth.verifyIdentity.consentTitle');
}

function checkAllConsents() {
	document.querySelectorAll('input[type="checkbox"]').forEach((cb) => fireEvent.click(cb));
}

async function advanceToVerify() {
	await advanceToConsent();
	checkAllConsents();
	fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.consentContinue' }));
	await screen.findByText('auth.verifyIdentity.verifySummary');
}

describe('VerifyIdentityPage - 上传步', () => {
	it('渲染上传步：标题/引导/正反面/提示/步骤指示器 1-4/提交禁用', async () => {
		await renderReady();

		expect(screen.getByText('auth.verifyIdentity.title')).toBeInTheDocument();
		expect(screen.getByText(/flat\.auth\.verifyIdentity\.uploadGuide/)).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.uploadFront')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.uploadBack')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.uploadFrontPlaceholder')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.uploadBackPlaceholder')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.uploadTipsTitle')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.uploadTip1')).toBeInTheDocument();

		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
		expect(screen.getByText('4')).toBeInTheDocument();

		const fileInputs = document.querySelectorAll('input[type="file"]');
		expect(fileInputs).toHaveLength(2);
		fileInputs.forEach((input) => {
			expect((input as HTMLInputElement).accept).toBe('image/jpeg,image/png,image/webp');
		});

		expect(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' })).toBeDisabled();
	});

	it('非图片文件 → 警告 toast，不选入', async () => {
		await renderReady();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		const textFile = new File(['not an image'], 'document.pdf', { type: 'application/pdf' });

		fireEvent.change(fileInputs[0], { target: { files: [textFile] } });

		await waitFor(() => {
			expect(screen.getByText('auth.verifyIdentity.uploadErrorImageType')).toBeInTheDocument();
		});
		expect(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' })).toBeDisabled();
	});

	it('超过 10MB 的图片被拒（正反面同规则）', async () => {
		await renderReady();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		const largeFile = createImageFile('large.jpg', 11);

		fireEvent.change(fileInputs[0], { target: { files: [largeFile] } });
		fireEvent.change(fileInputs[1], { target: { files: [largeFile] } });

		expect(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' })).toBeDisabled();
	});

	it('正反面选齐后可提交', async () => {
		await renderReady();
		selectBothImages();

		expect(
			screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' }),
		).not.toBeDisabled();
	});
});

describe('VerifyIdentityPage - 进页预检（AUTH-29）', () => {
	it('预检 404（无记录）→ 放行上传流程', async () => {
		await renderReady();
		expect(mockVerificationMeDetail).toHaveBeenCalledTimes(1);
		expect(screen.getByText('auth.verifyIdentity.uploadTipsTitle')).toBeInTheDocument();
	});

	it('预检失败（网络错误）不拦路 → 放行上传流程', async () => {
		mockVerificationMeDetail.mockRejectedValue(new Error('network down'));
		await renderReady();
		expect(screen.getByText('auth.verifyIdentity.uploadTipsTitle')).toBeInTheDocument();
	});

	it('预检非终态（ocr_completed）→ 放行上传流程', async () => {
		mockVerificationMeDetail.mockReset();
		mockVerificationMeDetail.mockResolvedValue({ data: { status: 'ocr_completed' } });
		await renderReady();
		expect(screen.getByText('auth.verifyIdentity.uploadTipsTitle')).toBeInTheDocument();
	});

	it('预检 verified → 短路面板（不再渲染上传 UI）', async () => {
		mockVerificationMeDetail.mockReset();
		mockVerificationMeDetail.mockResolvedValue({
			data: { status: 'verified', verifiedAt: '2025-06-01T10:00:00Z' },
		});
		renderPage();

		await screen.findByText('auth.verifyIdentity.alreadyVerifiedTitle');
		expect(screen.getByText('auth.verifyIdentity.alreadyVerifiedDesc')).toBeInTheDocument();
		expect(screen.getByText(/auth\.verifyIdentity\.verifyTime/)).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.backHome')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' })).toBeNull();
	});

	it('预检 verified_minor → 同样短路', async () => {
		mockVerificationMeDetail.mockReset();
		mockVerificationMeDetail.mockResolvedValue({ data: { status: 'verified_minor' } });
		renderPage();

		await screen.findByText('auth.verifyIdentity.alreadyVerifiedTitle');
	});

	it('预检 rejected → 短路面板并展示拒绝原因', async () => {
		mockVerificationMeDetail.mockReset();
		mockVerificationMeDetail.mockResolvedValue({
			data: { status: 'rejected', rejectedReason: '证件信息与姓名不匹配' },
		});
		renderPage();

		await screen.findByText('auth.verifyIdentity.alreadyRejectedTitle');
		expect(screen.getByText('auth.verifyIdentity.alreadyRejectedDesc')).toBeInTheDocument();
		expect(screen.getByText('证件信息与姓名不匹配')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' })).toBeNull();
	});
});

describe('VerifyIdentityPage - 上传 409 分流（AUTH-29）', () => {
	it('409 real_name_exists + 重查 verified → 短路面板，不再报 OCR 失败', async () => {
		await renderReady();
		mockVerificationMeDetail.mockReset();
		mockVerificationMeDetail.mockResolvedValue({
			data: { status: 'verified', verifiedAt: '2025-06-01T10:00:00Z' },
		});
		mockVerificationOcrPost.mockReset();
		mockVerificationOcrPost.mockRejectedValue({
			response: {
				status: 409,
				data: {
					code: 61180002,
					title: 'verification already exists for this user',
					i18n_key: 'error.verification.real_name_exists',
				},
			},
		});

		selectBothImages();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' }));

		await screen.findByText('auth.verifyIdentity.alreadyVerifiedTitle');
		expect(screen.queryByText('auth.verifyIdentity.uploadErrorOcr')).toBeNull();
	});

	it('409 + 重查失败 → 回落「已有认证记录」文案，不误报 OCR 故障', async () => {
		await renderReady();
		mockVerificationMeDetail.mockReset();
		mockVerificationMeDetail.mockRejectedValue(new Error('detail down'));
		mockVerificationOcrPost.mockReset();
		mockVerificationOcrPost.mockRejectedValue({
			response: {
				status: 409,
				data: { code: 61180002, title: 'verification already exists for this user' },
			},
		});

		selectBothImages();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' }));

		// 错误框 + toast 双处渲染 → findAllByText
		expect((await screen.findAllByText('error.verification.real_name_exists')).length).toBeGreaterThanOrEqual(1);
		expect(screen.queryByText('auth.verifyIdentity.uploadErrorOcr')).toBeNull();
		// 仍在传步，可换号处理
		expect(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' })).toBeInTheDocument();
	});

	it('OCR 已登记 i18n_key → 本地化文案', async () => {
		await renderReady();
		mockVerificationOcrPost.mockReset();
		mockVerificationOcrPost.mockRejectedValue({
			response: {
				status: 422,
				data: {
					code: 61180007,
					title: 'OCR confidence too low',
					i18n_key: 'error.verification.ocr_low_confidence',
				},
			},
		});

		selectBothImages();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' }));

		expect((await screen.findAllByText('error.verification.ocr_low_confidence')).length).toBeGreaterThanOrEqual(1);
	});

	it('OCR 未登记键（自动 error.<码>）不直出服务端英文 → 通用文案兜底', async () => {
		await renderReady();
		mockVerificationOcrPost.mockReset();
		mockVerificationOcrPost.mockRejectedValue({
			response: {
				status: 500,
				data: { code: 10000002, title: 'internal server error', i18n_key: 'error.10000002' },
			},
		});

		selectBothImages();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' }));

		expect((await screen.findAllByText('auth.verifyIdentity.uploadErrorOcr')).length).toBeGreaterThanOrEqual(1);
		expect(screen.queryByText('internal server error')).toBeNull();
	});

	it('OCR 429 → 限流文案', async () => {
		await renderReady();
		mockVerificationOcrPost.mockReset();
		mockVerificationOcrPost.mockRejectedValue({
			response: { status: 429, data: { code: 10000429, title: 'rate limit exceeded' } },
		});

		selectBothImages();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.uploadSubmit' }));

		expect((await screen.findAllByText('auth.verifyIdentity.rateLimited')).length).toBeGreaterThanOrEqual(1);
	});
});

describe('VerifyIdentityPage - 确认步（OCR 契约对齐）', () => {
	it('OCR 响应按 ocr_name/ocr_id_number 读键并预填表单', async () => {
		await advanceToConfirm();

		expect(mockVerificationOcrPost).toHaveBeenCalledWith({
			frontImage: 'mockbase64data',
			backImage: 'mockbase64data',
		});
		expect(screen.getByPlaceholderText('auth.verifyIdentity.confirmNamePlaceholder')).toHaveValue(
			'张三',
		);
		expect(
			screen.getByPlaceholderText('auth.verifyIdentity.confirmIdNumberPlaceholder'),
		).toHaveValue(VALID_ID);
		expect(screen.getByText('95%')).toBeInTheDocument();
	});

	it('DOB/gender 僵尸字段已移除（回归锁）', async () => {
		await advanceToConfirm();

		expect(screen.queryByText('auth.verifyIdentity.confirmDob')).toBeNull();
		expect(screen.queryByText('auth.verifyIdentity.confirmGender')).toBeNull();
		expect(document.querySelector('#dateOfBirth')).toBeNull();
	});

	it('必填与格式校验', async () => {
		await advanceToConfirm();

		fireEvent.change(screen.getByPlaceholderText('auth.verifyIdentity.confirmNamePlaceholder'), {
			target: { value: '' },
		});
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.confirmEdit' }));
		await screen.findByText('validation.nameRequired');

		fireEvent.change(screen.getByPlaceholderText('auth.verifyIdentity.confirmNamePlaceholder'), {
			target: { value: '张三' },
		});
		fireEvent.change(
			screen.getByPlaceholderText('auth.verifyIdentity.confirmIdNumberPlaceholder'),
			{ target: { value: '110101199013011234' } },
		);
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.confirmEdit' }));
		await screen.findByText('validation.idNumberInvalid');
	});
});

describe('VerifyIdentityPage - 同意步（双轨核验门）', () => {
	it('三个同意项；未勾满不可继续', async () => {
		await advanceToConsent();

		expect(screen.getByText('auth.verifyIdentity.consentPipNote')).toBeInTheDocument();
		const checkboxes = document.querySelectorAll('input[type="checkbox"]');
		expect(checkboxes).toHaveLength(3);
		expect(
			screen.getByRole('button', { name: 'auth.verifyIdentity.consentContinue' }),
		).toBeDisabled();
	});

	it('勾满后提交：identity 侧 ×3（带版本）+ verification 侧 consent_items', async () => {
		await advanceToConsent();
		checkAllConsents();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.consentContinue' }));

		await screen.findByText('auth.verifyIdentity.verifySummary');

		expect(mockAuthMeConsentPost).toHaveBeenCalledTimes(3);
		expect(mockAuthMeConsentPost.mock.calls.map((c) => c[0].scope)).toEqual([
			'identity_verification_pii',
			'identity_verification_third_party',
			'identity_verification_face',
		]);
		for (const call of mockAuthMeConsentPost.mock.calls) {
			expect(call[0].metadata).toEqual({ version: 'v2' });
		}
		expect(mockCompliancePublicLegalDocuments).toHaveBeenCalledWith({
			doc_type: 'privacy',
			lang: 'zh-CN',
		});

		// AUTH-29：verification 服务侧核验门（SubmitVerification 强制 consent 存在）
		expect(mockVerificationConsentPost).toHaveBeenCalledWith(
			{ consentItems: ['pii_collection', 'third_party_transfer', 'face_collection'] },
			{ verification_id: 'v-100' },
		);
	});

	it('法律文档版本取不到时不带 version，仍可推进', async () => {
		mockCompliancePublicLegalDocuments.mockReset();
		mockCompliancePublicLegalDocuments.mockRejectedValue(new Error('502'));

		await advanceToConsent();
		checkAllConsents();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.consentContinue' }));

		await screen.findByText('auth.verifyIdentity.verifySummary');
		for (const call of mockAuthMeConsentPost.mock.calls) {
			expect(call[0].metadata).toBeUndefined();
		}
	});

	it('verification 侧同意失败 → 停留同意步并提示', async () => {
		mockVerificationConsentPost.mockReset();
		mockVerificationConsentPost.mockRejectedValue(new Error('boom'));

		await advanceToConsent();
		checkAllConsents();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.consentContinue' }));

		await screen.findByText('auth.verifyIdentity.consentSaveError');
		expect(screen.queryByText('auth.verifyIdentity.verifySummary')).toBeNull();
	});
});

describe('VerifyIdentityPage - 验证步（契约对齐）', () => {
	it('摘要掩码展示；DOB 行已移除', async () => {
		await advanceToVerify();

		expect(screen.getByText('auth.verifyIdentity.verifySummaryName')).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.verifySummaryIdNumber')).toBeInTheDocument();
		expect(screen.queryByText('auth.verifyIdentity.verifySummaryDob')).toBeNull();

		expect(screen.getByText('张三')).toBeInTheDocument();
		expect(screen.getByText(/110101\*{6}1234/)).toBeInTheDocument();
	});

	it('提交核验：method=two_element + confirmed 字段 + verification_id query', async () => {
		await advanceToVerify();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.verifySubmit' }));

		await screen.findByText('auth.verifyIdentity.verifySuccess');

		expect(mockVerificationVerifyPost).toHaveBeenCalledWith(
			{ method: 'two_element', confirmedName: '张三', confirmedIdNumber: VALID_ID },
			{ verification_id: 'v-100' },
		);
	});

	it('verified → 成功面板 + 时间戳', async () => {
		await advanceToVerify();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.verifySubmit' }));

		await screen.findByText('auth.verifyIdentity.verifySuccess');
		expect(screen.getByText('auth.verifyIdentity.verifySuccessDesc')).toBeInTheDocument();
		expect(screen.getByText(/auth\.verifyIdentity\.verifyTime/)).toBeInTheDocument();
		expect(screen.getByText('auth.verifyIdentity.backHome')).toBeInTheDocument();
	});

	it('verified_minor → 同样按成功渲染', async () => {
		mockVerificationVerifyPost.mockReset();
		mockVerificationVerifyPost.mockResolvedValue({
			data: { status: 'verified_minor', verifiedAt: '2025-06-01T10:00:00Z' },
		});

		await advanceToVerify();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.verifySubmit' }));

		await screen.findByText('auth.verifyIdentity.verifySuccess');
	});

	it('ocr_completed（可重试）→ 补拉详情展示原因 + 重试按钮回验证步', async () => {
		mockVerificationVerifyPost.mockReset();
		mockVerificationVerifyPost.mockResolvedValue({ data: { status: 'ocr_completed', retryCount: 1, maxRetries: 3 } });
		mockVerificationMeDetail.mockReset();
		mockVerificationMeDetail.mockResolvedValue({
			data: { status: 'ocr_completed', rejectedReason: '证件信息与姓名不匹配' },
		});

		await advanceToVerify();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.verifySubmit' }));

		await screen.findByText('auth.verifyIdentity.verifyRejected');
		expect(screen.getByText('证件信息与姓名不匹配')).toBeInTheDocument();
		expect(screen.queryByText('auth.verifyIdentity.verifyRetryExhausted')).toBeNull();

		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.verifyRetry' }));
		await screen.findByText('auth.verifyIdentity.verifySummary');
	});

	it('rejected（终态）→ 重试耗尽提示，无重试按钮', async () => {
		mockVerificationVerifyPost.mockReset();
		mockVerificationVerifyPost.mockResolvedValue({ data: { status: 'rejected', retryCount: 3, maxRetries: 3 } });

		await advanceToVerify();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.verifySubmit' }));

		await screen.findByText('auth.verifyIdentity.verifyRejected');
		expect(screen.getByText('auth.verifyIdentity.verifyRetryExhausted')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'auth.verifyIdentity.verifyRetry' })).toBeNull();
	});

	it('pending → 处理中面板', async () => {
		mockVerificationVerifyPost.mockReset();
		mockVerificationVerifyPost.mockResolvedValue({ data: { status: 'pending' } });

		await advanceToVerify();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.verifySubmit' }));

		await screen.findByText('auth.verifyIdentity.verifyPending');
	});

	it('已登记 i18n_key 错误 → 本地化文案，停留验证步', async () => {
		mockVerificationVerifyPost.mockReset();
		mockVerificationVerifyPost.mockRejectedValue({
			response: {
				status: 409,
				data: {
					code: 61180005,
					title: 'retry cooldown active, please wait 24 hours',
					i18n_key: 'error.verification.retry_cooldown',
				},
			},
		});

		await advanceToVerify();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.verifySubmit' }));

		expect((await screen.findAllByText('error.verification.retry_cooldown')).length).toBeGreaterThanOrEqual(1);
		expect(screen.queryByText('auth.verifyIdentity.verifyErrorSubmit')).toBeNull();
		expect(screen.getByText('auth.verifyIdentity.verifySummary')).toBeInTheDocument();
	});

	it('未登记错误 → 通用文案兜底，不直出英文', async () => {
		mockVerificationVerifyPost.mockReset();
		mockVerificationVerifyPost.mockRejectedValue({
			response: {
				status: 500,
				data: { code: 10000002, title: 'internal server error', i18n_key: 'error.10000002' },
			},
		});

		await advanceToVerify();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.verifySubmit' }));

		expect((await screen.findAllByText('auth.verifyIdentity.verifyErrorSubmit')).length).toBeGreaterThanOrEqual(1);
		expect(screen.queryByText('internal server error')).toBeNull();
	});

	it('验证 429 → 限流文案', async () => {
		mockVerificationVerifyPost.mockReset();
		mockVerificationVerifyPost.mockRejectedValue({
			response: { status: 429, data: { code: 10000429, title: 'rate limit exceeded' } },
		});

		await advanceToVerify();
		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.verifySubmit' }));

		expect((await screen.findAllByText('auth.verifyIdentity.rateLimited')).length).toBeGreaterThanOrEqual(1);
	});
});

describe('VerifyIdentityPage - 导航', () => {
	it('上传步有取消按钮', async () => {
		await renderReady();
		expect(
			screen.getAllByRole('button', { name: 'auth.verifyIdentity.verifyCancel' }).length,
		).toBeGreaterThan(0);
	});

	it('验证步返回回到同意步', async () => {
		await advanceToVerify();
		expect(
			screen.getByRole('button', { name: 'auth.verifyIdentity.verifyBack' }),
		).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: 'auth.verifyIdentity.verifyBack' }));
		await screen.findByText('auth.verifyIdentity.consentTitle');
	});
});
