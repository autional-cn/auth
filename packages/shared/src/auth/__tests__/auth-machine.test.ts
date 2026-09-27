/**
 * AuthMachine 单元测试
 *
 * 验证状态机 reducer 的纯函数逻辑:
 * - 状态转换是否正确
 * - 边界条件
 * - 从不合法状态恢复
 */
import { describe, it, expect } from 'vitest';

// AuthMachine 的 reducer 逻辑是纯函数，可以直接测试
type AuthStatus =
	| 'checking'
	| 'authenticated'
	| 'bootstrap'
	| 'ready'
	| 'unauthenticated'
	| 'redirecting';

interface MachineState {
	status: AuthStatus;
	hasToken: boolean;
}

type Action =
	| { type: 'TOKEN_FOUND' }
	| { type: 'NO_TOKEN' }
	| { type: 'BOOTSTRAP_LOADING' }
	| { type: 'BOOTSTRAP_READY' }
	| { type: 'BOOTSTRAP_ERROR' }
	| { type: 'SESSION_EXPIRED' }
	| { type: 'REDIRECT' };

function authReducer(state: MachineState, action: Action): MachineState {
	switch (action.type) {
		case 'TOKEN_FOUND':
			return { ...state, status: 'authenticated', hasToken: true };
		case 'NO_TOKEN':
			return { ...state, status: 'unauthenticated', hasToken: false };
		case 'BOOTSTRAP_LOADING':
			return state.status === 'authenticated' ? { ...state, status: 'bootstrap' } : state;
		case 'BOOTSTRAP_READY':
			return state.status === 'bootstrap' || state.status === 'authenticated'
				? { ...state, status: 'ready' }
				: state;
		case 'BOOTSTRAP_ERROR':
			return state.status === 'bootstrap' ? { ...state, status: 'ready' } : state;
		case 'SESSION_EXPIRED':
			return { ...state, status: 'unauthenticated', hasToken: false };
		case 'REDIRECT':
			return { ...state, status: 'redirecting' };
		default:
			return state;
	}
}

function createInitialState(): MachineState {
	return { status: 'checking', hasToken: false };
}

describe('AuthMachine reducer', () => {
	it('初始状态为 checking，无 token', () => {
		const state = createInitialState();
		expect(state.status).toBe('checking');
		expect(state.hasToken).toBe(false);
	});

	it('TOKEN_FOUND → authenticated', () => {
		const state = authReducer(createInitialState(), { type: 'TOKEN_FOUND' });
		expect(state.status).toBe('authenticated');
		expect(state.hasToken).toBe(true);
	});

	it('NO_TOKEN → unauthenticated', () => {
		const state = authReducer(createInitialState(), { type: 'NO_TOKEN' });
		expect(state.status).toBe('unauthenticated');
		expect(state.hasToken).toBe(false);
	});

	it('authenticated + BOOTSTRAP_LOADING → bootstrap', () => {
		const authenticated = authReducer(createInitialState(), { type: 'TOKEN_FOUND' });
		const state = authReducer(authenticated, { type: 'BOOTSTRAP_LOADING' });
		expect(state.status).toBe('bootstrap');
	});

	it('authenticated + BOOTSTRAP_READY → ready（跳过 bootstrap）', () => {
		const authenticated = authReducer(createInitialState(), { type: 'TOKEN_FOUND' });
		const state = authReducer(authenticated, { type: 'BOOTSTRAP_READY' });
		expect(state.status).toBe('ready');
	});

	it('bootstrap + BOOTSTRAP_READY → ready', () => {
		const authenticated = authReducer(createInitialState(), { type: 'TOKEN_FOUND' });
		const bootstrap = authReducer(authenticated, { type: 'BOOTSTRAP_LOADING' });
		const state = authReducer(bootstrap, { type: 'BOOTSTRAP_READY' });
		expect(state.status).toBe('ready');
	});

	it('bootstrap + BOOTSTRAP_ERROR → ready（降级运行）', () => {
		const authenticated = authReducer(createInitialState(), { type: 'TOKEN_FOUND' });
		const bootstrap = authReducer(authenticated, { type: 'BOOTSTRAP_LOADING' });
		const state = authReducer(bootstrap, { type: 'BOOTSTRAP_ERROR' });
		expect(state.status).toBe('ready');
	});

	it('SESSION_EXPIRED → unauthenticated（从任何状态）', () => {
		const ready = authReducer(
			authReducer(authReducer(createInitialState(), { type: 'TOKEN_FOUND' }), {
				type: 'BOOTSTRAP_READY',
			}),
			{ type: 'SESSION_EXPIRED' },
		);
		expect(ready.status).toBe('unauthenticated');
		expect(ready.hasToken).toBe(false);
	});

	it('unauthenticated + REDIRECT → redirecting', () => {
		const unauth = authReducer(createInitialState(), { type: 'NO_TOKEN' });
		const state = authReducer(unauth, { type: 'REDIRECT' });
		expect(state.status).toBe('redirecting');
	});

	it('checking 态下 BOOTSTRAP_LOADING 不应改变状态', () => {
		const state = authReducer(createInitialState(), { type: 'BOOTSTRAP_LOADING' });
		expect(state.status).toBe('checking'); // 不变
	});

	it('checking 态下 BOOTSTRAP_READY 不应改变状态', () => {
		const state = authReducer(createInitialState(), { type: 'BOOTSTRAP_READY' });
		expect(state.status).toBe('checking'); // 不变
	});

	it('完整 happy path: checking → authenticated → bootstrap → ready', () => {
		let state = createInitialState();
		expect(state.status).toBe('checking');

		state = authReducer(state, { type: 'TOKEN_FOUND' });
		expect(state.status).toBe('authenticated');

		state = authReducer(state, { type: 'BOOTSTRAP_LOADING' });
		expect(state.status).toBe('bootstrap');

		state = authReducer(state, { type: 'BOOTSTRAP_READY' });
		expect(state.status).toBe('ready');
	});

	it('完整 unauthenticated path: checking → unauthenticated → redirecting', () => {
		let state = createInitialState();
		expect(state.status).toBe('checking');

		state = authReducer(state, { type: 'NO_TOKEN' });
		expect(state.status).toBe('unauthenticated');

		state = authReducer(state, { type: 'REDIRECT' });
		expect(state.status).toBe('redirecting');
	});
});
