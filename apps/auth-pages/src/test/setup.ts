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
