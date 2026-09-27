'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Input, Label } from '@autional-cn/ui';
import { useI18n } from '@/lib/i18n';
import { PublicAuthConfigByAuthConfig } from '@autional-cn/shared/generated/api';

interface TenantMatch {
	tenant_id: string;
	tenant_name: string;
	display_name: string;
	slug?: string;
	login_methods?: string[];
	oauth_providers?: string[];
}

export default function IdentifierFirstInput({ onBack }: { onBack: () => void }) {
	const { t } = useI18n();
	const navigate = useNavigate();
	const [identifier, setIdentifier] = useState('');
	const [matches, setMatches] = useState<TenantMatch[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleDiscover = async () => {
		const trimmed = identifier.trim();
		if (!trimmed) {
			setError(t('auth.identifierFirst.emailRequired') || '请输入邮箱或用户名');
			return;
		}
		setLoading(true);
		setError('');
		try {
			const res = await PublicAuthConfigByAuthConfig({ identifier: trimmed } as any);
			const data = (res as any)?.data || res;
			setMatches(data?.matches || []);
		} catch {
			setError(t('auth.identifierFirst.discoverFailed') || '查询失败，请稍后重试');
		} finally {
			setLoading(false);
		}
	};

	const handleSelectTenant = (match: TenantMatch) => {
		const slug = match.slug || match.tenant_name;
		navigate(`/${slug}/login`);
	};

	// Step 1: Identifier input
	if (matches === null) {
		return (
			<div className="space-y-4">
				<p className="text-sm text-[var(--color-text-secondary)]">
					{t('auth.identifierFirst.description') || '输入您的邮箱，系统将自动识别您所在的组织'}
				</p>
				<div className="space-y-2">
					<Label htmlFor="identifier-first-input">
						{t('auth.identifierFirst.emailLabel') || '邮箱'}
					</Label>
					<Input
						id="identifier-first-input"
						type="email"
						autoComplete="email"
						placeholder="user@company.com"
						value={identifier}
						onChange={(e) => setIdentifier(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleDiscover()}
					/>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={onBack} fullWidth>
						{t('auth.emailCode.back') || '返回'}
					</Button>
					<Button
						onClick={handleDiscover}
						disabled={loading || !identifier.trim()}
						fullWidth
						isLoading={loading}
					>
						{t('auth.identifierFirst.continue') || '继续'}
					</Button>
				</div>
				{error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
			</div>
		);
	}

	// Step 2: Show matches
	if (matches.length === 0) {
		return (
			<div className="space-y-4 text-center">
				<p className="text-sm text-[var(--color-text-secondary)]">
					{t('auth.identifierFirst.noMatch') || '未找到匹配的组织，请确认邮箱或联系管理员'}
				</p>
				<Button variant="outline" onClick={() => setMatches(null)} fullWidth>
					{t('auth.emailCode.back') || '返回'}
				</Button>
			</div>
		);
	}

	// Single match: auto-redirect
	if (matches.length === 1) {
		const match = matches[0];
		const slug = match.slug || match.tenant_name;
		return (
			<div className="space-y-4 text-center">
				<div className="rounded-lg border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 p-4">
					<p className="font-medium text-[var(--color-success)]">
						{match.display_name || match.tenant_name}
					</p>
					<p className="text-xs text-[var(--color-success)] mt-1">{match.tenant_name}</p>
				</div>
				<Button onClick={() => navigate(`/${slug}/login`)} fullWidth>
					{(t('auth.identifierFirst.continueTo') || '继续前往 {name}').replace(
						'{name}',
						match.display_name || match.tenant_name,
					)}
				</Button>
				<button
					type="button"
					onClick={() => setMatches(null)}
					className="text-xs text-[var(--color-text-muted)] hover:underline"
				>
					{t('auth.identifierFirst.notYou') || '不是这个组织？'}
				</button>
			</div>
		);
	}

	// Multiple matches
	return (
		<div className="space-y-3">
			<p className="text-sm text-[var(--color-text-secondary)]">
				{t('auth.identifierFirst.selectOrg') || '找到以下匹配的组织，请选择一个'}
			</p>
			{matches.map((match) => (
				<button
					key={match.tenant_id}
					type="button"
					onClick={() => handleSelectTenant(match)}
					className="w-full rounded-lg border border-[var(--color-border-subtle)] p-3 text-left hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)]/10 transition-colors"
				>
					<p className="font-medium text-[var(--color-text-primary)]">
						{match.display_name || match.tenant_name}
					</p>
					<p className="text-xs text-[var(--color-text-muted)]">{match.tenant_name}</p>
				</button>
			))}
			<button
				type="button"
				onClick={() => setMatches(null)}
				className="w-full text-xs text-[var(--color-text-muted)] hover:underline pt-2"
			>
				{t('auth.identifierFirst.back') || '返回重新输入'}
			</button>
		</div>
	);
}
