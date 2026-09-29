import { create } from 'zustand';
import type { Branding } from './types';

interface TenantBrandingState {
	branding: Branding | null;
	setBranding: (branding: Branding | null) => void;
}

/** 品牌 store —— `BrandingInitializer` 写入，`useBranding` 消费并落到 CSS 变量。 */
export const useTenantBrandingStore = create<TenantBrandingState>((set) => ({
	branding: null,
	setBranding: (branding) => set({ branding }),
}));
