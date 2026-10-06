import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import RecoverAccountPage from '../recover-account/page';
import type { ReactNode } from 'react';

/**
 * recover-account 单测 — AUTH-20/21 修复后契约（旧 verify 步已废除）
 *
 * 新契约（2026-10-05 W2）:
 * - request: authRecoverAccountPost({ identity }) → 200 恒进 reset 步（反枚举一致响应）
 *   响应 maskedTo 存在 → 显示「已发送至 {target}」；缺失 → 通用兜底文案（codeSentGeneric）
 * - reset:   authRecoverAccountResetPost({ identity, code, newPassword, passwordTransmission })
 *   （不再有独立 verify 步 / recovery_token 透传；模式经 PublicAuthConfigBySlugByBySlug 取）
 *
 * mock 面:
 * - @/lib/i18n       整模块 mock（t:(k,opts)=>k/JSON）
 * - @/hooks/use-page-title 空 mock
 * - react-router     importOriginal spread + Link 透传 <a href>；useParams 可控 mockParams
 * - @autional/shared/generated/api  importOriginal spread + 覆盖 authRecoverAccountPost /
 *   authRecoverAccountResetPost / PublicAuthConfigBySlugByBySlug
 * - @autional/shared          processPasswordForTransmission（恒等价 plain 透传）
 * - @autional/shared/branding useTenantBrandingStore（branding: null）
 * - @/lib/check-hibp 防御性 mock（PasswordInput 内部 HIBP，零出网）
 */

const {
	mockRecoverRequestPost,
	mockRecoverResetPost,
	mockPublicAuthConfigBySlug,
	mockCheckHIBP,
	mockParams,
} = vi.hoisted(() => ({
	mockRecoverRequestPost: vi.fn(),
	mockRecoverResetPost: vi.fn(),
	mockPublicAuthConfigBySlug: vi.fn(),
	mockCheckHIBP: vi.fn(() => Promise.resolve(0)),
	mockParams: {} as { tenantSlug?: string },
}));

vi.mock('react-router', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react-router')>();
	return {
		...actual,
		useParams: () => mockParams,
		Link: ({ to, children }: { to: string; children: ReactNode }) => <a href={to}>{children}</a>,
	};
});

vi.mock('@/lib/i18n', () => ({
	useI18n: () => ({
		t: (key: string, opts?: Record<string, unknown>) =>
			opts ? `${key} ${JSON.stringify(opts)}` : key,
		lang: 'zh-CN',
		setLang: vi.fn(),
	}),
	I18nProvider: ({ children }: { children: ReactNode }) => children,
	defaultLang: 'zh-CN',
}));

vi.mock('@/hooks/use-page-title', () => ({
	usePageTitle: vi.fn(),
}));

vi.mock('@autional/shared/generated/api', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional/shared/generated/api')>();
	return {
		...actual,
		authRecoverAccountPost: (data: unknown) => mockRecoverRequestPost(data),
		authRecoverAccountResetPost: (data: unknown) => mockRecoverResetPost(data),
		PublicAuthConfigBySlugByBySlug: (slug: string) => mockPublicAuthConfigBySlug(slug),
	};
});

vi.mock('@autional/shared', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional/shared')>();
	return {
		...actual,
		processPasswordForTransmission: async (password: string, mode?: string) => ({
			password,
			passwordTransmission: mode || 'plain',
		}),
	};
});

vi.mock('@autional/shared/branding', () => ({
	useTenantBrandingStore: (selector: (state: { branding: null }) => unknown) =>
		selector({ branding: null }),
}));

vi.mock('@/lib/check-hibp', () => ({
	checkHIBP: (..._args: unknown[]) => mockCheckHIBP(),
}));

// ---------------------------------------------------------------------------
// render / 推进辅助
// ---------------------------------------------------------------------------
function renderPage() {
	return render(
		<MemoryRouter initialEntries={['/recover-account']}>
			<RecoverAccountPage />
		</MemoryRouter>,
	);
}

/** 经 request 步推进到 reset 步（maskedTo 由后端回填） */
async function goToReset(
	user: ReturnType<typeof userEvent.setup>,
	identity = 'user@x.com',
	maskedTo = 'u***r@x.com',
) {
	mockRecoverRequestPost.mockResolvedValue({ maskedTo });
	renderPage();
	await user.type(screen.getByPlaceholderText('user@example.com / 13800138000'), identity);
	await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }));
	await screen.findByPlaceholderText('000000');
}

/** 经 goToReset + reset 步推进到 success 步（强密码 'NewSecurePass123!'） */
async function goToSuccess(user: ReturnType<typeof userEvent.setup>) {
	await goToReset(user);
	mockRecoverResetPost.mockResolvedValue({});
	await user.type(screen.getByPlaceholderText('000000'), '123456');
	await user.type(
		screen.getByLabelText('auth.recoverAccount.newPasswordLabel'),
		'NewSecurePass123!',
	);
	await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.resetPassword' }));
	await screen.findByText('auth.recoverAccount.success');
}

beforeEach(() => {
	vi.clearAllMocks();
	delete mockParams.tenantSlug;
	mockPublicAuthConfigBySlug.mockResolvedValue({
		passwordPolicy: { passwordTransmission: 'plain' },
		tenantId: 't-acme',
	});
});

// ---------------------------------------------------------------------------
// request 步
// ---------------------------------------------------------------------------
describe('recover-account: request 步骤', () => {
	it('初始渲染 request 步 — identity 表单 + sendCode 按钮，无 code/密码输入', () => {
		renderPage();
		expect(screen.getByPlaceholderText('user@example.com / 13800138000')).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }),
		).toBeInTheDocument();
		expect(screen.queryByPlaceholderText('000000')).not.toBeInTheDocument();
		expect(screen.queryByLabelText('auth.recoverAccount.newPasswordLabel')).not.toBeInTheDocument();
		expect(mockRecoverRequestPost).not.toHaveBeenCalled();
		expect(mockRecoverResetPost).not.toHaveBeenCalled();
	});

	it('空 identity 提交不发请求', async () => {
		const user = userEvent.setup();
		renderPage();
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }));
		expect(mockRecoverRequestPost).not.toHaveBeenCalled();
	});

	it('request 成功（含 maskedTo）→ 进入 reset 步，payload 为 trim 后 identity，横幅含脱敏目标', async () => {
		const user = userEvent.setup();
		mockRecoverRequestPost.mockResolvedValue({ maskedTo: 'u***r@x.com' });
		renderPage();
		await user.type(
			screen.getByPlaceholderText('user@example.com / 13800138000'),
			'  user@x.com  ',
		);
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }));
		await screen.findByPlaceholderText('000000');
		expect(mockRecoverRequestPost).toHaveBeenCalledTimes(1);
		expect(mockRecoverRequestPost).toHaveBeenCalledWith({ identity: 'user@x.com' });
		// maskedTo 经 i18n 插值进 codeSent（t mock 把 opts 序列化在 key 后）
		expect(screen.getByText(/auth\.recoverAccount\.codeSent .*u\*\*\*r@x\.com/)).toBeInTheDocument();
	});

	it('反枚举：响应无 maskedTo 仍进 reset 步并显示通用文案（不泄露存在性）', async () => {
		const user = userEvent.setup();
		mockRecoverRequestPost.mockResolvedValue({});
		renderPage();
		await user.type(screen.getByPlaceholderText('user@example.com / 13800138000'), 'nobody@x.com');
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }));
		await screen.findByPlaceholderText('000000');
		expect(screen.getByText('auth.recoverAccount.codeSentGeneric')).toBeInTheDocument();
		// codeSent（带 maskedTo 插值，t mock 序列化后为 "…codeSent {…}"）必须缺席；
		// 注意 \s 边界 —— 否则 codeSentGeneric 也命中 codeSent 前缀
		expect(screen.queryByText(/auth\.recoverAccount\.codeSent\s/)).not.toBeInTheDocument();
	});

	it('request 失败优先显示后端 response.data.message', async () => {
		const user = userEvent.setup();
		mockRecoverRequestPost.mockRejectedValue({
			response: { data: { message: '请求过于频繁' } },
		});
		renderPage();
		await user.type(screen.getByPlaceholderText('user@example.com / 13800138000'), 'user@x.com');
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }));
		await waitFor(() => {
			expect(screen.getByText('请求过于频繁')).toBeInTheDocument();
		});
		expect(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' })).toBeEnabled();
	});

	it('request 失败无 message → i18n 兜底 requestFailed key', async () => {
		const user = userEvent.setup();
		mockRecoverRequestPost.mockRejectedValue({});
		renderPage();
		await user.type(screen.getByPlaceholderText('user@example.com / 13800138000'), 'user@x.com');
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }));
		await waitFor(() => {
			expect(screen.getByText('auth.recoverAccount.requestFailed')).toBeInTheDocument();
		});
	});
});

// ---------------------------------------------------------------------------
// reset 步
// ---------------------------------------------------------------------------
describe('recover-account: reset 步骤', () => {
	it('reset 步 code 输入 maxLength=6 + PasswordInput showStrength 生效', async () => {
		const user = userEvent.setup();
		await goToReset(user);
		const codeInput = screen.getByPlaceholderText('000000');
		expect(codeInput).toHaveAttribute('maxLength', '6');
		expect(screen.queryByText(/password\.strengthLabel/)).not.toBeInTheDocument();
		await user.type(
			screen.getByLabelText('auth.recoverAccount.newPasswordLabel'),
			'NewSecurePass123!',
		);
		expect(screen.getByText(/password\.strengthLabel/)).toBeInTheDocument();
		expect(mockCheckHIBP).not.toHaveBeenCalled();
	});

	it('密码 <8 字符或空 code 提交不发请求', async () => {
		const user = userEvent.setup();
		await goToReset(user);
		await user.type(screen.getByLabelText('auth.recoverAccount.newPasswordLabel'), 'abc');
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.resetPassword' }));
		expect(mockRecoverResetPost).not.toHaveBeenCalled();
	});

	it('reset 成功 → success 步，payload 透传 identity + code + newPassword + passwordTransmission', async () => {
		const user = userEvent.setup();
		mockParams.tenantSlug = 'acme';
		await goToSuccess(user);
		expect(mockRecoverResetPost).toHaveBeenCalledTimes(1);
		expect(mockRecoverResetPost).toHaveBeenCalledWith({
			identity: 'user@x.com',
			code: '123456',
			newPassword: 'NewSecurePass123!',
			passwordTransmission: 'plain',
		});
	});

	it('无 tenantSlug → reset 提交阻断（无法确定传输模式，报错且不发请求）', async () => {
		const user = userEvent.setup();
		await goToReset(user);
		await user.type(screen.getByPlaceholderText('000000'), '123456');
		await user.type(
			screen.getByLabelText('auth.recoverAccount.newPasswordLabel'),
			'NewSecurePass123!',
		);
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.resetPassword' }));
		await waitFor(() => {
			expect(screen.getByText('auth.recoverAccount.resetFailed')).toBeInTheDocument();
		});
		expect(mockRecoverResetPost).not.toHaveBeenCalled();
	});

	it('reset 失败两级错误兜底 — 后端 message 优先 / 无 message i18n 兜底', async () => {
		const user = userEvent.setup();
		mockParams.tenantSlug = 'acme';

		// 场景 A：response.data.message 优先
		await goToReset(user);
		mockRecoverResetPost.mockRejectedValue({
			response: { data: { message: '验证码错误或已过期' } },
		});
		await user.type(screen.getByPlaceholderText('000000'), '000000');
		await user.type(
			screen.getByLabelText('auth.recoverAccount.newPasswordLabel'),
			'NewSecurePass123!',
		);
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.resetPassword' }));
		await waitFor(() => {
			expect(screen.getByText('验证码错误或已过期')).toBeInTheDocument();
		});
		expect(screen.queryByText('auth.recoverAccount.resetFailed')).not.toBeInTheDocument();

		// 场景 B：无 message → resetFailed key 兜底
		cleanup();
		await goToReset(user);
		mockRecoverResetPost.mockRejectedValue({});
		await user.type(screen.getByPlaceholderText('000000'), '000000');
		await user.type(
			screen.getByLabelText('auth.recoverAccount.newPasswordLabel'),
			'NewSecurePass123!',
		);
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.resetPassword' }));
		await waitFor(() => {
			expect(screen.getByText('auth.recoverAccount.resetFailed')).toBeInTheDocument();
		});
	});
});

// ---------------------------------------------------------------------------
// success 步与出口链接（tenantSlug 感知）
// ---------------------------------------------------------------------------
describe('recover-account: success 步与出口链接', () => {
	it('success 步 backToLogin 链接带 tenantSlug → href=/acme/login', async () => {
		const user = userEvent.setup();
		mockParams.tenantSlug = 'acme';
		await goToSuccess(user);
		const backToLogin = screen.getByRole('link', { name: 'auth.recoverAccount.backToLogin' });
		expect(backToLogin).toHaveAttribute('href', '/acme/login');
	});

	it('底部 back 链接 href 随 tenantSlug 变化（有 slug → /acme/login；无 → /login）', () => {
		mockParams.tenantSlug = 'acme';
		renderPage();
		expect(screen.getByRole('link', { name: 'auth.recoverAccount.back' })).toHaveAttribute(
			'href',
			'/acme/login',
		);

		cleanup();
		delete mockParams.tenantSlug;
		renderPage();
		expect(screen.getByRole('link', { name: 'auth.recoverAccount.back' })).toHaveAttribute(
			'href',
			'/login',
		);
	});
});

// ---------------------------------------------------------------------------
// 完整串联
// ---------------------------------------------------------------------------
describe('recover-account: 完整串联', () => {
	it('request→reset→success 三步流转，每步 API pending 时按钮 loading', async () => {
		const user = userEvent.setup();
		mockParams.tenantSlug = 'acme';
		let resolveRequest!: (v: unknown) => void;
		let resolveReset!: (v: unknown) => void;

		// ---- request 步：pending 序列 ----
		mockRecoverRequestPost.mockReturnValue(
			new Promise((resolve) => {
				resolveRequest = resolve;
			}),
		);
		renderPage();
		await user.type(screen.getByPlaceholderText('user@example.com / 13800138000'), 'user@x.com');
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }));
		const sendBtn = screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' });
		expect(sendBtn).toBeDisabled();
		expect(screen.queryByText('auth.recoverAccount.requestFailed')).not.toBeInTheDocument();

		await act(async () => {
			resolveRequest({ maskedTo: 'u***r@x.com' });
		});
		await screen.findByPlaceholderText('000000');

		// ---- reset 步：pending 序列 ----
		mockRecoverResetPost.mockReturnValue(
			new Promise((resolve) => {
				resolveReset = resolve;
			}),
		);
		await user.type(screen.getByPlaceholderText('000000'), '123456');
		await user.type(
			screen.getByLabelText('auth.recoverAccount.newPasswordLabel'),
			'NewSecurePass123!',
		);
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.resetPassword' }));
		expect(
			screen.getByRole('button', { name: 'auth.recoverAccount.resetPassword' }),
		).toBeDisabled();
		expect(screen.queryByText('auth.recoverAccount.resetFailed')).not.toBeInTheDocument();

		await act(async () => {
			resolveReset({});
		});
		await screen.findByText('auth.recoverAccount.success');

		// ---- 全链路 API 调用参数断言 ----
		expect(mockRecoverRequestPost).toHaveBeenCalledWith({ identity: 'user@x.com' });
		expect(mockRecoverResetPost).toHaveBeenCalledWith({
			identity: 'user@x.com',
			code: '123456',
			newPassword: 'NewSecurePass123!',
			passwordTransmission: 'plain',
		});
	});
});
