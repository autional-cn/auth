'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useI18n } from '@/lib/i18n';
import { usePageTitle } from '@/hooks/use-page-title';
import { tenantPublicTenants, PublicAuthConfigByAuthConfig } from '@autional-cn/shared/generated/api';
import { useAuthStore } from '@autional-cn/shared';
import { AlertCircle, Search } from 'lucide-react';
import { Input } from '@autional-cn/ui';
import { AuthCard } from '@/components/auth/AuthCard';

interface TenantItem {
	id: string;
	name: string;
	displayName: string;
	slug?: string;
}

export default function SelectTenantPage() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirect = searchParams.get('redirect');
	const initialQuery = searchParams.get('tenant') || '';

	usePageTitle('selectTenant.title');

	const [tenants, setTenants] = useState<TenantItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>('');
	const [navigatingId, setNavigatingId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState(initialQuery);

	const filteredTenants = useMemo(() => {
		if (!searchQuery.trim()) return tenants;
		const q = searchQuery.toLowerCase().trim();
		return tenants.filter(
			(t) =>
				t.name.toLowerCase().includes(q) ||
				t.displayName.toLowerCase().includes(q) ||
				(t.slug && t.slug.toLowerCase().includes(q)),
		);
	}, [tenants, searchQuery]);

	useEffect(() => {
		useAuthStore.getState().clearAuth();
		let cancelled = false;
		async function fetchTenants() {
			try {
				const data = await tenantPublicTenants();
				if (cancelled) return;
				const items: TenantItem[] = (data?.items ?? [])
					.map((item: any) => ({
						id: item.id,
						name: item.name,
						displayName: item.displayName || item.display_name || item.name,
						slug: item.slug || item.name,
					}))
					.sort((a: TenantItem, b: TenantItem) => a.name.localeCompare(b.name));
				setTenants(items);

				if (items.length === 1) {
					const slug = items[0].slug || items[0].name;
					const to = redirect
						? `/${slug}/login?redirect=${encodeURIComponent(redirect)}`
						: `/${slug}/login`;
					navigate(to, { replace: true });
					return;
				}
				if (items.length === 0) {
					setError(t('selectTenant.empty') || 'No organizations available');
				}
			} catch {
				if (!cancelled) {
					setError(t('selectTenant.loadError') || 'Failed to load organizations');
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		fetchTenants();
		return () => {
			cancelled = true;
		};
	}, []);

	const handleSelect = useCallback(
		async (tenant: TenantItem) => {
			setNavigatingId(tenant.id);
			try {
				await PublicAuthConfigByAuthConfig(tenant.id);
			} catch {
				// proceed even if config fails — the login page will handle it
			}
			const slug = tenant.slug || tenant.name;
			const to = redirect
				? `/${slug}/login?redirect=${encodeURIComponent(redirect)}`
				: `/${slug}/login`;
			navigate(to);
		},
		[navigate, redirect],
	);

	if (loading) {
		return (
			<AuthCard maxWidth="md">
				<div className="text-center space-y-6">
					<div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-[var(--color-bg-muted)]" />
					<div className="space-y-2">
						<div className="mx-auto h-5 w-48 animate-pulse rounded bg-[var(--color-bg-muted)]" />
						<div className="mx-auto h-4 w-64 animate-pulse rounded bg-[var(--color-bg-muted)]" />
					</div>
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div key={i} className="h-16 animate-pulse rounded-lg bg-[var(--color-bg-muted)]" />
						))}
					</div>
				</div>
			</AuthCard>
		);
	}

	if (error) {
		return (
			<AuthCard maxWidth="md">
				<div className="text-center space-y-4">
					<AlertCircle className="mx-auto h-12 w-12 text-[var(--color-warning)]" />
					<p className="text-sm text-[var(--color-text-secondary)]">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="text-sm text-[var(--color-brand)] hover:underline"
					>
						{t('selectTenant.retry') || 'Retry'}
					</button>
				</div>
			</AuthCard>
		);
	}

	return (
		<AuthCard
			maxWidth="md"
			title={t('selectTenant.title') || 'Select Organization'}
			subtitle={t('selectTenant.subtitle') || 'Choose your organization to continue'}
		>
			{/* Search Bar */}
			<div className="relative max-w-md mx-auto">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
				<Input
					type="text"
					placeholder={t('selectTenant.searchPlaceholder') || 'Search organizations...'}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="pl-10"
				/>
			</div>

			{/* Results */}
			{filteredTenants.length === 0 && !loading && (
				<div className="text-center py-8">
					<p className="text-[var(--color-text-secondary)]">
						{searchQuery.trim()
							? t('selectTenant.noMatch') || 'No organizations match your search'
							: t('selectTenant.empty') || 'No organizations available'}
					</p>
				</div>
			)}

			{filteredTenants.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
					{filteredTenants.map((tenant) => (
						<button
							key={tenant.id}
							onClick={() => handleSelect(tenant)}
							disabled={navigatingId !== null}
							className="group flex flex-col items-center justify-center rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] px-3 py-4 text-center transition-all hover:border-[var(--color-brand)] hover:shadow-sm disabled:opacity-50"
						>
							<p className="font-medium text-sm text-[var(--color-text-primary)] truncate w-full">
								{tenant.displayName}
							</p>
							<p className="text-xs text-[var(--color-text-muted)] truncate w-full">
								{tenant.name}
							</p>
						</button>
					))}
				</div>
			)}

			<p className="text-center text-xs text-[var(--color-text-muted)]">
				{searchQuery.trim()
					? `${filteredTenants.length} of ${tenants.length} organizations`
					: `${tenants.length} ${t('selectTenant.organizationCount') || 'organizations available'}`}
			</p>
		</AuthCard>
	);
}
