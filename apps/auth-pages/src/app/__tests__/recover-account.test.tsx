import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import RecoverAccountPage from '../recover-account/page';
import type { ReactNode } from 'react';
import type {
	RequestAccountRecoveryRequest,
	VerifyAccountRecoveryRequest,
	CompleteAccountRecoveryRequest,
} from '@autional-cn/shared/generated/types';

/**
 * TASK-155 recover-account 单测（17 用例 R1-R17）
 *
 * 契约来源: butler/plan/auth-portal-test-coverage/plan.md（AC-013~017）+ butler/memory/design.md §10.2
 * 被测页面 recover-account/page.tsx 只读不改（G3）。
 *
 * mock 面（严格局部，ADR-002/003/005）:
 * - @/lib/i18n          整模块 mock（dashboard 先例，t:(k)=>k）— 不 mock react-i18next
 * - @/hooks/use-page-title 空 mock
 * - react-router        importOriginal spread + Link 透传 <a href>；useParams 用可控 mockParams
 *                       （默认 {}，等价 MemoryRouter 无 Route 的真实行为；R14/R16 置 tenantSlug）
 * - @autional-cn/shared/generated/api  importOriginal spread + 覆盖 3 个 authRecovery*Post
 *                       + PublicAuthConfigBySlugByBySlug（2026-08-17 契约：reset 步据 slug 取传输模式）
 * - @/lib/tenant-store  整模块 mock（ADR-003 — 模块顶层 L108 localStorage 副作用）
 * - @/lib/check-hibp    防御性 mock（ADR-002 — PasswordInput 内部 crypto.subtle+fetch，零出网）
 *
 * 渲染树: AuthCard / AuthHeader / Button / Input / Label / PasswordInput 全部真实渲染；
 * PasswordInput 内部 zxcvbn 强度（纯函数）+ 本地黑名单（纯 Set 查询）真实执行，jsdom 安全。
 *
 * R16 静态确认（不渲染 App）: App.tsx L274 仅注册 `<Route path="/:tenantSlug/recover-account" />`，
 * 无无参 `/recover-account` 路由 → 页面实际仅在 tenant slug 路径下可达；测试用可控 useParams
 * 模拟两态（有 slug / 无 slug），链接 href 断言覆盖 `/{slug}/login` 与 `/login` 两种出口。
 */

// ---------------------------------------------------------------------------
// hoisted mocks（vi.mock factory 可引用；beforeEach vi.clearAllMocks 保留实现）
// ---------------------------------------------------------------------------
const {
	mockRecoveryRequestPost,
	mockRecoveryVerifyPost,
	mockRecoveryCompletePost,
	mockPublicAuthConfigBySlug,
	mockCheckHIBP,
	mockParams,
} = vi.hoisted(() => ({
	mockRecoveryRequestPost: vi.fn(),
	mockRecoveryVerifyPost: vi.fn(),
	mockRecoveryCompletePost: vi.fn(),
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

vi.mock('@autional-cn/shared/generated/api', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@autional-cn/shared/generated/api')>();
	return {
		...actual,
		authRecoveryRequestPost: (data: RequestAccountRecoveryRequest) => mockRecoveryRequestPost(data),
		authRecoveryVerifyPost: (data: VerifyAccountRecoveryRequest) => mockRecoveryVerifyPost(data),
		authRecoveryCompletePost: (data: CompleteAccountRecoveryRequest) =>
			mockRecoveryCompletePost(data),
		// 2026-08-17 契约：reset 提交前按 slug 取租户 auth-config 决定密码传输模式
		PublicAuthConfigBySlugByBySlug: (slug: string) => mockPublicAuthConfigBySlug(slug),
	};
});

vi.mock('@/lib/tenant-store', () => ({
	// ADR-003: 整模块 mock，规避模块顶层 localStorage 副作用；branding: null → logoUrl undefined
	useTenantStore: (selector: (state: { branding: null }) => unknown) =>
		selector({ branding: null }),
}));

vi.mock('@/lib/check-hibp', () => ({
	// 保留 rest 参数声明以匹配组件内调用形态；mockCheckHIBP 为零参 vi.fn(() => Promise.resolve(0))，
	// 不能把 unknown[] spread 进零参函数（TS2556），参数在此丢弃——语义不变：checkHIBP 恒 resolve 0。
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

/** 经 R3 前置序列推进到 verify 步（recovery_token: 'tok_1' 由页面状态保存） */
async function goToVerify(user: ReturnType<typeof userEvent.setup>, identity = 'user@x.com') {
	mockRecoveryRequestPost.mockResolvedValue({ recovery_token: 'tok_1' });
	renderPage();
	await user.type(screen.getByPlaceholderText('user@example.com / 13800138000'), identity);
	await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }));
	await screen.findByPlaceholderText('000000');
}

/** 经 goToVerify + verify 步推进到 reset 步（code '123456'） */
async function goToReset(user: ReturnType<typeof userEvent.setup>) {
	await goToVerify(user);
	mockRecoveryVerifyPost.mockResolvedValue({});
	await user.type(screen.getByPlaceholderText('000000'), '123456');
	await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.verifyCode' }));
	await screen.findByLabelText('auth.recoverAccount.newPasswordLabel');
}

/** 经 goToReset + reset 步推进到 success 步（强密码 'NewSecurePass123!'） */
async function goToSuccess(user: ReturnType<typeof userEvent.setup>) {
	await goToReset(user);
	mockRecoveryCompletePost.mockResolvedValue({});
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
// R1-R5  US-005 → AC-013  request 步骤
// ---------------------------------------------------------------------------
describe('recover-account: request 步骤（R1-R5）', () => {
	it('R1: 初始渲染 request 步 — identity 表单 + sendCode 按钮，无 code/密码输入', () => {
		renderPage();
		expect(screen.getByPlaceholderText('user@example.com / 13800138000')).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }),
		).toBeInTheDocument();
		expect(screen.queryByPlaceholderText('000000')).not.toBeInTheDocument();
		expect(screen.queryByLabelText('auth.recoverAccount.newPasswordLabel')).not.toBeInTheDocument();
		expect(mockRecoveryRequestPost).not.toHaveBeenCalled();
		expect(mockRecoveryVerifyPost).not.toHaveBeenCalled();
		expect(mockRecoveryCompletePost).not.toHaveBeenCalled();
	});

	it('R2: 空 identity 提交不发请求（G10 guard）', async () => {
		const user = userEvent.setup();
		renderPage();
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }));
		expect(mockRecoveryRequestPost).not.toHaveBeenCalled();
	});

	it('R3: request 成功（含 recovery_token）→ 进入 verify 步，payload 为 trim 后 identity', async () => {
		const user = userEvent.setup();
		mockRecoveryRequestPost.mockResolvedValue({ recovery_token: 'tok_1' });
		renderPage();
		// 前后带空白 → 断言 trim 生效
		await user.type(
			screen.getByPlaceholderText('user@example.com / 13800138000'),
			'  user@x.com  ',
		);
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }));
		await screen.findByPlaceholderText('000000');
		expect(mockRecoveryRequestPost).toHaveBeenCalledTimes(1);
		expect(mockRecoveryRequestPost).toHaveBeenCalledWith({
			identity: 'user@x.com',
			method: 'backup_email',
		});
	});

	it('R4: request 失败优先显示后端 response.data.message', async () => {
		const user = userEvent.setup();
		mockRecoveryRequestPost.mockRejectedValue({
			response: { data: { message: '账号不存在' } },
		});
		renderPage();
		await user.type(screen.getByPlaceholderText('user@example.com / 13800138000'), 'user@x.com');
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }));
		await waitFor(() => {
			expect(screen.getByText('账号不存在')).toBeInTheDocument();
		});
		// loading 与错误互斥：错误出现后按钮恢复可用
		expect(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' })).toBeEnabled();
	});

	it('R5: request 失败无 message → i18n 兜底 requestFailed key', async () => {
		const user = userEvent.setup();
		mockRecoveryRequestPost.mockRejectedValue({});
		renderPage();
		await user.type(screen.getByPlaceholderText('user@example.com / 13800138000'), 'user@x.com');
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }));
		await waitFor(() => {
			expect(screen.getByText('auth.recoverAccount.requestFailed')).toBeInTheDocument();
		});
	});
});

// ---------------------------------------------------------------------------
// R6-R9  US-006 → AC-014  verify 步骤
// ---------------------------------------------------------------------------
describe('recover-account: verify 步骤（R6-R9）', () => {
	it('R6: verify 步 code 输入 maxLength=6', async () => {
		const user = userEvent.setup();
		await goToVerify(user);
		const codeInput = screen.getByPlaceholderText('000000');
		expect(codeInput).toHaveAttribute('maxLength', '6');
		expect(
			screen.getByRole('button', { name: 'auth.recoverAccount.verifyCode' }),
		).toBeInTheDocument();
	});

	it('R7: 空 code 提交不发请求（G10 guard）', async () => {
		const user = userEvent.setup();
		await goToVerify(user);
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.verifyCode' }));
		expect(mockRecoveryVerifyPost).not.toHaveBeenCalled();
	});

	it('R8: verify 成功 → 进入 reset 步，recovery_token 透传（R3 前置序列推进）', async () => {
		const user = userEvent.setup();
		await goToReset(user);
		expect(mockRecoveryVerifyPost).toHaveBeenCalledTimes(1);
		expect(mockRecoveryVerifyPost).toHaveBeenCalledWith({
			recovery_token: 'tok_1',
			code: '123456',
		});
	});

	it('R9: verify 失败两级错误兜底 — 后端 message 优先 / 无 message i18n 兜底', async () => {
		const user = userEvent.setup();

		// 场景 A：response.data.message 优先
		await goToVerify(user);
		mockRecoveryVerifyPost.mockRejectedValue({ response: { data: { message: '验证码错误' } } });
		await user.type(screen.getByPlaceholderText('000000'), '000000');
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.verifyCode' }));
		await waitFor(() => {
			expect(screen.getByText('验证码错误')).toBeInTheDocument();
		});
		expect(screen.queryByText('auth.recoverAccount.verifyFailed')).not.toBeInTheDocument();

		// 场景 B：无 message → verifyFailed key 兜底（重新渲染新流程）
		cleanup();
		await goToVerify(user);
		mockRecoveryVerifyPost.mockRejectedValue({});
		await user.type(screen.getByPlaceholderText('000000'), '000000');
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.verifyCode' }));
		await waitFor(() => {
			expect(screen.getByText('auth.recoverAccount.verifyFailed')).toBeInTheDocument();
		});
	});
});

// ---------------------------------------------------------------------------
// R10-R13  US-007 → AC-015  reset 步骤
// ---------------------------------------------------------------------------
describe('recover-account: reset 步骤（R10-R13）', () => {
	it('R10: reset 步 PasswordInput showStrength 生效 — ≥8 字符强度条出现（ADR-003 真实渲染）', async () => {
		const user = userEvent.setup();
		await goToReset(user);
		// 输入前：无强度条
		expect(screen.queryByText(/password\.strengthLabel/)).not.toBeInTheDocument();
		await user.type(
			screen.getByLabelText('auth.recoverAccount.newPasswordLabel'),
			'NewSecurePass123!',
		);
		// showStrength + value>0 → 强度条 label 渲染（t(key)=key 模式）
		expect(screen.getByText(/password\.strengthLabel/)).toBeInTheDocument();
		// checkHIBP 未被触发（showBreachCheck 未传，effect 短路；防御性 mock 兜底零出网）
		expect(mockCheckHIBP).not.toHaveBeenCalled();
	});

	it('R11: 密码 <8 字符提交不发请求（G10 guard）', async () => {
		const user = userEvent.setup();
		await goToReset(user);
		await user.type(screen.getByLabelText('auth.recoverAccount.newPasswordLabel'), 'abc');
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.resetPassword' }));
		expect(mockRecoveryCompletePost).not.toHaveBeenCalled();
	});

	it('R12: reset 成功 → success 步，payload 透传 recovery_token + code + new_password + password_transmission', async () => {
		const user = userEvent.setup();
		mockParams.tenantSlug = 'acme';
		await goToSuccess(user);
		expect(mockRecoveryCompletePost).toHaveBeenCalledTimes(1);
		expect(mockRecoveryCompletePost).toHaveBeenCalledWith({
			recovery_token: 'tok_1',
			code: '123456',
			new_password: 'NewSecurePass123!',
			password_transmission: 'plain',
		});
	});

	it('R13: reset 失败两级错误兜底 — 后端 message 优先 / 无 message i18n 兜底', async () => {
		const user = userEvent.setup();
		mockParams.tenantSlug = 'acme';

		// 场景 A：response.data.message 优先
		await goToReset(user);
		mockRecoveryCompletePost.mockRejectedValue({
			response: { data: { message: '恢复令牌已过期' } },
		});
		await user.type(
			screen.getByLabelText('auth.recoverAccount.newPasswordLabel'),
			'NewSecurePass123!',
		);
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.resetPassword' }));
		await waitFor(() => {
			expect(screen.getByText('恢复令牌已过期')).toBeInTheDocument();
		});
		expect(screen.queryByText('auth.recoverAccount.resetFailed')).not.toBeInTheDocument();

		// 场景 B：无 message → resetFailed key 兜底
		cleanup();
		await goToReset(user);
		mockRecoveryCompletePost.mockRejectedValue({});
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
// R14-R16  US-008 → AC-016  success / 出口链接（tenantSlug 感知）
// ---------------------------------------------------------------------------
describe('recover-account: success 步与出口链接（R14-R16）', () => {
	it('R14: success 步 backToLogin 链接带 tenantSlug → href=/acme/login', async () => {
		const user = userEvent.setup();
		mockParams.tenantSlug = 'acme';
		await goToSuccess(user);
		const backToLogin = screen.getByRole('link', { name: 'auth.recoverAccount.backToLogin' });
		expect(backToLogin).toHaveAttribute('href', '/acme/login');
	});

	it('R15: 无 tenantSlug → reset 提交阻断（无法确定传输模式，报错且不发请求）', async () => {
		const user = userEvent.setup();
		await goToReset(user);
		await user.type(
			screen.getByLabelText('auth.recoverAccount.newPasswordLabel'),
			'NewSecurePass123!',
		);
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.resetPassword' }));
		await waitFor(() => {
			expect(screen.getByText('auth.recoverAccount.resetFailed')).toBeInTheDocument();
		});
		expect(mockRecoveryCompletePost).not.toHaveBeenCalled();
	});

	it('R16: 底部 back 链接 href 随 tenantSlug 变化（有 slug → /acme/login；无 → /login）', () => {
		// 静态确认（不渲染 App）: App.tsx L274 仅注册 `/:tenantSlug/recover-account`，
		// 无无参 `/recover-account` 路由 —— 页面实际仅在 tenant slug 路径下可达，
		// 测试以可控 useParams 两态模拟，断言底部 back 出口链接随 slug 切换。
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
// R17  US-009 → AC-017  完整四步 happy path + 每步 loading
// ---------------------------------------------------------------------------
describe('recover-account: 完整串联（R17）', () => {
	it('R17: request→verify→reset→success 四步流转，每步 API pending 时按钮 loading，token 全程透传', async () => {
		const user = userEvent.setup();
		mockParams.tenantSlug = 'acme';
		let resolveRequest!: (v: unknown) => void;
		let resolveVerify!: (v: unknown) => void;
		let resolveComplete!: (v: unknown) => void;

		// ---- request 步：pending 序列 ----
		mockRecoveryRequestPost.mockReturnValue(
			new Promise((resolve) => {
				resolveRequest = resolve;
			}),
		);
		renderPage();
		await user.type(screen.getByPlaceholderText('user@example.com / 13800138000'), 'user@x.com');
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' }));

		// loading：按钮禁用（spinner）
		const sendBtn = screen.getByRole('button', { name: 'auth.recoverAccount.sendCode' });
		expect(sendBtn).toBeDisabled();
		// loading 与错误互斥：pending 期间无错误文案
		expect(screen.queryByText('auth.recoverAccount.requestFailed')).not.toBeInTheDocument();

		// 推进到 verify
		await act(async () => {
			resolveRequest({ recovery_token: 'tok_1' });
		});
		await screen.findByPlaceholderText('000000');

		// ---- verify 步：pending 序列 ----
		mockRecoveryVerifyPost.mockReturnValue(
			new Promise((resolve) => {
				resolveVerify = resolve;
			}),
		);
		await user.type(screen.getByPlaceholderText('000000'), '123456');
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.verifyCode' }));
		expect(screen.getByRole('button', { name: 'auth.recoverAccount.verifyCode' })).toBeDisabled();
		expect(screen.queryByText('auth.recoverAccount.verifyFailed')).not.toBeInTheDocument();

		// 推进到 reset
		await act(async () => {
			resolveVerify({});
		});
		await screen.findByLabelText('auth.recoverAccount.newPasswordLabel');

		// ---- reset 步：pending 序列 ----
		mockRecoveryCompletePost.mockReturnValue(
			new Promise((resolve) => {
				resolveComplete = resolve;
			}),
		);
		await user.type(
			screen.getByLabelText('auth.recoverAccount.newPasswordLabel'),
			'NewSecurePass123!',
		);
		await user.click(screen.getByRole('button', { name: 'auth.recoverAccount.resetPassword' }));
		expect(
			screen.getByRole('button', { name: 'auth.recoverAccount.resetPassword' }),
		).toBeDisabled();
		expect(screen.queryByText('auth.recoverAccount.resetFailed')).not.toBeInTheDocument();

		// 推进到 success
		await act(async () => {
			resolveComplete({});
		});
		await screen.findByText('auth.recoverAccount.success');

		// ---- 全链路 API 调用参数断言（token 透传） ----
		expect(mockRecoveryRequestPost).toHaveBeenCalledWith({
			identity: 'user@x.com',
			method: 'backup_email',
		});
		expect(mockRecoveryVerifyPost).toHaveBeenCalledWith({
			recovery_token: 'tok_1',
			code: '123456',
		});
		expect(mockRecoveryCompletePost).toHaveBeenCalledWith({
			recovery_token: 'tok_1',
			code: '123456',
			new_password: 'NewSecurePass123!',
			password_transmission: 'plain',
		});
	});
});
