import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

const mockT = (key: string, options?: Record<string, unknown>) => {
	if (options) {
		return `${key} ${JSON.stringify(options)}`;
	}
	return key;
};

vi.mock('@/i18n/config', () => ({
	default: {
		t: mockT,
		language: 'zh-CN',
		changeLanguage: vi.fn(),
		use: vi.fn().mockReturnThis(),
		init: vi.fn(),
	},
}));

// AUTH-48/49：AuthCard 页脚、跨门户深链等 chrome 依赖租户 slug 解析（内部走
// react-query，无 Provider 会抛错）。未显式 mock 的测试文件统一用安全默认：
// 不可解析 → undefined（绝对/裸链）；需要特定 slug 的用例在各文件内 vi.mock 覆盖。
vi.mock('@/hooks/use-tenant-slug', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@/hooks/use-tenant-slug')>();
	return {
		...actual,
		useResolvedTenantSlug: () => undefined,
		useEffectiveTenantSlug: () => undefined,
		useEffectiveTenantSlugFromPath: () => undefined,
	};
});
