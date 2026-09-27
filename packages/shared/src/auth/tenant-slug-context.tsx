import { createContext, useContext } from 'react';

const TenantSlugContext = createContext<string | undefined>(undefined);

export const TenantSlugProvider = TenantSlugContext.Provider;

export function useTenantSlug(): string | undefined {
	return useContext(TenantSlugContext);
}
