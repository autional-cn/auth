/**
 * `from_requireauth=1` 分支限次断路器。
 *
 * 同一回跳目标在窗口内多次回到本分支，说明「握手每轮都成功、但目标站点始终
 * 承接不了会话」（目标未配置 client / 解析暂时故障）——继续往返只是浏览器
 * 不可见的 JS 跳转循环。超过尝试上限即返回 true，调用方停住并报错。
 * 触发后计数即清除：用户后续再试（或故障恢复后重试）重新从第 1 次开始。
 */

const SK_KEY = 'reqauth_loop_guard';
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 3;

interface LoopGuardRecord {
	key: string;
	n: number;
	ts: number;
}

export function bumpRequireAuthLoop(target: string, now: number = Date.now()): boolean {
	try {
		const raw = sessionStorage.getItem(SK_KEY);
		let rec: LoopGuardRecord | null = null;
		if (raw) {
			try {
				rec = JSON.parse(raw) as LoopGuardRecord;
			} catch {
				rec = null;
			}
		}
		if (
			rec &&
			rec.key === target &&
			typeof rec.n === 'number' &&
			typeof rec.ts === 'number' &&
			now - rec.ts <= WINDOW_MS
		) {
			if (rec.n >= MAX_ATTEMPTS) {
				sessionStorage.removeItem(SK_KEY);
				return true;
			}
			sessionStorage.setItem(SK_KEY, JSON.stringify({ key: target, n: rec.n + 1, ts: now }));
			return false;
		}
		sessionStorage.setItem(SK_KEY, JSON.stringify({ key: target, n: 1, ts: now }));
		return false;
	} catch {
		// sessionStorage 不可用（隐私模式/配额异常）：不设防，保持既有行为
		return false;
	}
}
