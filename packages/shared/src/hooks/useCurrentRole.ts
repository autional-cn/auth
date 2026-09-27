'use client';

import { useAuthStore } from '../auth/store';

/**
 * 响应式当前角色 hook。
 * 用 zustand selector 订阅 store 本身 —— loadAuthExtras 直写 store action
 * 不发 AuthService 事件，仅订阅事件会在密码登录路径漏刷新（ADR-002）。
 * selector 返回 string 原语 → Object.is 比较引用稳定，不会无限重渲染。
 * 前端角色仅用于 UX 呈现；安全判断由后端 rbac-backed 授权强制（AC-008）。
 */
export function useCurrentRole(): string | null {
	return useAuthStore((s) => {
		if (!s.tenants || s.tenants.length === 0) return null;
		if (!s.currentTenantId) return null;
		return s.tenants.find((t) => t.id === s.currentTenantId)?.role ?? null;
	});
}
