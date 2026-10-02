import { describe, it, expect, beforeEach, vi } from 'vitest';
import { bumpRequireAuthLoop } from '../requireauth-loop-guard';

const TARGET = 'https://admin.autional.cn/acme-corp/';

describe('bumpRequireAuthLoop', () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	it('同目标窗口内前 3 次放行，第 4 次触发（滑动窗口）', () => {
		expect(bumpRequireAuthLoop(TARGET, 1000)).toBe(false);
		expect(bumpRequireAuthLoop(TARGET, 2000)).toBe(false);
		expect(bumpRequireAuthLoop(TARGET, 3000)).toBe(false);
		expect(bumpRequireAuthLoop(TARGET, 4000)).toBe(true);
	});

	it('触发后计数清除：下一次同目标重新放行', () => {
		bumpRequireAuthLoop(TARGET, 1000);
		bumpRequireAuthLoop(TARGET, 2000);
		bumpRequireAuthLoop(TARGET, 3000);
		expect(bumpRequireAuthLoop(TARGET, 4000)).toBe(true);
		expect(bumpRequireAuthLoop(TARGET, 5000)).toBe(false);
		expect(bumpRequireAuthLoop(TARGET, 6000)).toBe(false);
	});

	it('不同目标不互相计数（单槽：新目标从 1 起）', () => {
		bumpRequireAuthLoop(TARGET, 1000);
		bumpRequireAuthLoop(TARGET, 2000);
		bumpRequireAuthLoop(TARGET, 3000);
		expect(bumpRequireAuthLoop('https://user.autional.cn/acme-corp/', 4000)).toBe(false);
		// 单槽被新目标覆盖 → 旧目标也重新从 1 起
		expect(bumpRequireAuthLoop(TARGET, 5000)).toBe(false);
	});

	it('超出窗口后重新计数（ts 随每次触达滑动刷新）', () => {
		bumpRequireAuthLoop(TARGET, 1000);
		bumpRequireAuthLoop(TARGET, 2000);
		bumpRequireAuthLoop(TARGET, 3000);
		// 距上次触达 > 60s → 视为新一轮
		expect(bumpRequireAuthLoop(TARGET, 3000 + 60_001)).toBe(false);
	});

	it('记录损坏（非 JSON）→ 当作新一轮处理', () => {
		sessionStorage.setItem('reqauth_loop_guard', 'not-json');
		expect(bumpRequireAuthLoop(TARGET, 1000)).toBe(false);
		expect(bumpRequireAuthLoop(TARGET, 2000)).toBe(false);
	});

	it('sessionStorage 不可用 → 不设防（返回 false），不抛异常', () => {
		const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('denied');
		});
		expect(bumpRequireAuthLoop(TARGET, 1000)).toBe(false);
		spy.mockRestore();
	});
});
