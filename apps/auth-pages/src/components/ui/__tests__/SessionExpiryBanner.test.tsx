import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { SessionExpiryBanner } from '../SessionExpiryBanner';

// ============================================================
// 会话过期弹窗回归锁：
// - 弹窗只在「预警点静默续期失败」时出现（成功全程无感，不再"狼来了"）
// - 「延长会话」走真续期链路（AuthService.refreshToken），
//   旧实现走未启用的 BFF cookie 链路＝点了只关弹窗、从未真正续期
// - 弹窗显示期间 token 更新（任意来源续期成功）自动隐藏
// ============================================================

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
		i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
	}),
	I18nextProvider: ({ children }: any) => children,
}));

const { mockNavigate, mockRefresh } = vi.hoisted(() => ({
	mockNavigate: vi.fn(),
	mockRefresh: vi.fn(),
}));

const session = vi.hoisted(() => ({ token: null as string | null }));

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@autional-cn/shared', () => ({
	AuthService: { refreshToken: mockRefresh },
	getAccessToken: () => session.token,
	useAccessToken: () => session.token,
	buildLoginUrl: (u: string) => u,
}));

/** JWT 三段形状 + payload.exp（useSessionTimeout 只解 exp） */
function makeToken(expiresInMs: number): string {
	const payload = { exp: Math.floor((Date.now() + expiresInMs) / 1000) };
	return `h.${btoa(JSON.stringify(payload))}.s`;
}

const TITLE = 'dashboard.sessionExpiringTitle';

beforeEach(() => {
	vi.clearAllMocks();
	session.token = null;
	vi.useFakeTimers();
	vi.setSystemTime(new Date('2026-10-03T08:00:00Z'));
});

afterEach(() => {
	vi.useRealTimers();
});

/** 推进到预警点（到期前 60 秒；10 分钟 token → 第 9 分钟处）并冲刷回调链的微任务 */
async function advanceToWarning() {
	await act(async () => {
		vi.advanceTimersByTime(9 * 60 * 1000);
	});
}

describe('SessionExpiryBanner', () => {
	it('B1 预警点静默续期成功 → 不出现弹窗（零打扰）', async () => {
		session.token = makeToken(10 * 60 * 1000);
		mockRefresh.mockResolvedValue('new-token');
		render(<SessionExpiryBanner />);

		await advanceToWarning();

		expect(mockRefresh).toHaveBeenCalledWith({ onFailure: 'none' });
		expect(screen.queryByText(TITLE)).toBeNull();
	});

	it('B2 预警点静默续期失败 → 弹窗出现（此时才真需要用户处理）', async () => {
		session.token = makeToken(10 * 60 * 1000);
		mockRefresh.mockResolvedValue(null);
		render(<SessionExpiryBanner />);

		await advanceToWarning();

		expect(mockRefresh).toHaveBeenCalledWith({ onFailure: 'none' });
		expect(screen.getByText(TITLE)).toBeInTheDocument();
	});

	it('B3 弹窗中点「延长会话」成功 → 真链路续期 + 弹窗关闭 + 不导航', async () => {
		session.token = makeToken(10 * 60 * 1000);
		mockRefresh.mockResolvedValueOnce(null); // 预警点自动续期失败
		render(<SessionExpiryBanner />);
		await advanceToWarning();
		expect(screen.getByText(TITLE)).toBeInTheDocument();

		mockRefresh.mockResolvedValue('new-token'); // 用户手动续期成功
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'dashboard.extendSession' }));
		});

		expect(mockRefresh).toHaveBeenCalledWith({ onFailure: 'clear' });
		expect(screen.queryByText(TITLE)).toBeNull();
		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('B4 弹窗中点「延长会话」失败 → 清会话并走唯一导航出口（error 页）', async () => {
		session.token = makeToken(10 * 60 * 1000);
		mockRefresh.mockResolvedValue(null);
		render(<SessionExpiryBanner />);
		await advanceToWarning();

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'dashboard.extendSession' }));
		});

		expect(mockRefresh).toHaveBeenCalledWith({ onFailure: 'clear' });
		expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/error?type=session_expired'));
	});

	it('B5 弹窗中点「忽略」→ 仅关闭，不导航、不追加续期调用', async () => {
		session.token = makeToken(10 * 60 * 1000);
		mockRefresh.mockResolvedValue(null);
		render(<SessionExpiryBanner />);
		await advanceToWarning();

		fireEvent.click(screen.getByRole('button', { name: 'dashboard.dismiss' }));

		expect(screen.queryByText(TITLE)).toBeNull();
		expect(mockNavigate).not.toHaveBeenCalled();
		expect(mockRefresh).toHaveBeenCalledTimes(1); // 仅预警点那一次（none）
	});

	it('B6 弹窗显示期间 token 更新（外部通道续期成功）→ 弹窗自动隐藏', async () => {
		session.token = makeToken(10 * 60 * 1000);
		mockRefresh.mockResolvedValue(null);
		const view = render(<SessionExpiryBanner />);
		await advanceToWarning();
		expect(screen.getByText(TITLE)).toBeInTheDocument();

		// 模拟 apiClient 预刷新/401 重试等其它通道续期成功：token 更新 → 重渲染
		session.token = makeToken(30 * 60 * 1000);
		await act(async () => {
			view.rerender(<SessionExpiryBanner />);
		});

		expect(screen.queryByText(TITLE)).toBeNull();
	});

	it('B7 到点续期仍失败 → 触发 error 页导航（原有出口不回归）', async () => {
		session.token = makeToken(10 * 60 * 1000);
		mockRefresh.mockResolvedValue(null);
		render(<SessionExpiryBanner />);

		await act(async () => {
			vi.advanceTimersByTime(10 * 60 * 1000);
		});

		expect(mockRefresh).toHaveBeenCalledWith({ onFailure: 'none' }); // 预警点
		expect(mockRefresh).toHaveBeenCalledWith({ onFailure: 'clear' }); // 到点
		expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('session_expired'));
	});

	it('B8 到点续期成功 → 静默延续，不导航', async () => {
		session.token = makeToken(10 * 60 * 1000);
		mockRefresh.mockResolvedValue('new-token');
		render(<SessionExpiryBanner />);

		await act(async () => {
			vi.advanceTimersByTime(10 * 60 * 1000);
		});

		expect(mockNavigate).not.toHaveBeenCalled();
	});

	// 回归锁（2026-10-03 线上缺陷：预警点 5 分钟 == AT 寿命 5 分钟 ⇒ 续期后毫秒级时钟差
	// 立即再触发一次静默刷新，每次续期双倍刷新/双倍 RT 轮换）：预警点必须严格早于
	// 「寿命 - 预警差」，此处锁 10 分钟 token 在 8 分钟处不动、9 分钟处（到期前 60 秒）才续期
	it('B9 预警点 = 到期前 60 秒：8 分钟处不续期，第 9 分钟才触发静默续期', async () => {
		session.token = makeToken(10 * 60 * 1000);
		mockRefresh.mockResolvedValue('new-token');
		render(<SessionExpiryBanner />);

		await act(async () => {
			vi.advanceTimersByTime(8 * 60 * 1000);
		});
		expect(mockRefresh).not.toHaveBeenCalled();

		await act(async () => {
			vi.advanceTimersByTime(60 * 1000);
		});
		expect(mockRefresh).toHaveBeenCalledWith({ onFailure: 'none' });
	});
});
