'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { Button } from '@autional/ui';
import { loginWithTokens } from '@autional/shared';
import { loadAuthExtras } from '@/lib/api';
import { anchorSessionFromToken } from '@/lib/anchor-session';
import { authQrLoginInitiatePost, authQrLoginStatus } from '@autional/shared/generated/api';
import { getPostLoginTarget } from '@/lib/post-login-redirect';
import { useI18n } from '@/lib/i18n';
import { useCountdown } from '@/hooks/use-countdown';
import QRCode from 'qrcode';

export default function QRLoginPanel() {
	const { t } = useI18n();
	const { tenantSlug } = useParams();
	const [searchParams] = useSearchParams();
	const redirect = searchParams.get('redirect');
	const [loading, setLoading] = useState(false);
	const [qrCode, setQrCode] = useState('');
	const [sessionToken, setSessionToken] = useState('');
	const [numberMatching, setNumberMatching] = useState('');
	const [status, setStatus] = useState<'init' | 'pending' | 'success' | 'error'>('init');
	const [error, setError] = useState('');
	const { seconds, start: startCountdown, reset: resetCountdown } = useCountdown({ duration: 300 });
	const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const initiateQR = async () => {
		setLoading(true);
		setError('');
		try {
			const data = await authQrLoginInitiatePost();
			// 拦截器已解包信封并转 camelCase（AUTH-17 同族）
			const token = data?.sessionToken || '';
			const nm = data?.numberMatching || '';

			setSessionToken(token);
			setNumberMatching(nm);
			const url = `authms://login?token=${encodeURIComponent(token)}&nm=${encodeURIComponent(nm)}`;
			setQrCode(await QRCode.toDataURL(url, { width: 200, margin: 1 }));
			setStatus('pending');
			startCountdown(); // 300s QR code validity
			startPolling(token);
		} catch (err: any) {
			setError(err.message || t('qrLogin.initError'));
		} finally {
			setLoading(false);
		}
	};

	const startPolling = (token: string) => {
		if (pollRef.current) clearInterval(pollRef.current);
		pollRef.current = setInterval(async () => {
			try {
				const data = await authQrLoginStatus({ token });
				const st = data?.status || '';

				if (st === 'confirmed' && data?.accessToken) {
					loginWithTokens(data.accessToken, data.refreshToken || '', null as any);
					// AUTH-53⑤：会话建立即锚定（QR 扫码登录；无 tenantId prop，JWT claim 兜底）
					anchorSessionFromToken(data.accessToken || '', {
						slug: tenantSlug || null,
						tenantId: null,
					});
					await loadAuthExtras().catch(() => {});
					setStatus('success');
					if (pollRef.current) clearInterval(pollRef.current);
					setTimeout(() => {
						window.location.href = getPostLoginTarget({ tenantSlug, redirect });
					}, 500);
				} else if (st === 'cancelled') {
					setStatus('error');
					setError(t('qrLogin.cancelled'));
					if (pollRef.current) clearInterval(pollRef.current);
				} else if (st === 'expired') {
					setStatus('error');
					setError(t('qrLogin.expired'));
					if (pollRef.current) clearInterval(pollRef.current);
				}
			} catch {
				// 静默忽略轮询错误
			}
		}, 2000);
	};

	useEffect(() => {
		return () => {
			if (pollRef.current) clearInterval(pollRef.current);
		};
	}, []);

	// QR code expired: countdown reached 0
	useEffect(() => {
		if (seconds <= 0 && status === 'pending') {
			setStatus('error');
			setError(t('qrLogin.expired'));
			if (pollRef.current) clearInterval(pollRef.current);
		}
	}, [seconds, status, t]);

	return (
		<div className="space-y-4">
			{status === 'init' && (
				<div className="text-center space-y-4">
					<p className="text-sm text-[var(--color-text-secondary)]">{t('qrLogin.instruction')}</p>
					<Button fullWidth onClick={initiateQR} isLoading={loading}>
						{t('qrLogin.getCode')}
					</Button>
				</div>
			)}

			{status === 'pending' && (
				<div className="text-center space-y-4">
					<div className="rounded-lg border border-brand/30 bg-[var(--color-bg-surface)] p-4">
						<img src={qrCode} alt="登录二维码" className="mx-auto h-48 w-48" />
						<p className="mt-2 text-xs text-[var(--color-text-muted)]">
							{t('qrLogin.countdown', { countdown: seconds })}
						</p>
					</div>
					{numberMatching && (
						<div className="rounded-lg border border-brand/30 bg-brand/10 p-3">
							<p className="text-xs text-[var(--color-text-secondary)] mb-1">
								{t('qrLogin.matchNumber')}
							</p>
							<span className="text-2xl font-bold tracking-widest text-brand-text">
								{numberMatching}
							</span>
						</div>
					)}
					<p className="text-sm text-[var(--color-text-secondary)]">{t('qrLogin.steps')}</p>
					<Button
						variant="outline"
						fullWidth
						onClick={() => {
							setStatus('init');
							if (pollRef.current) clearInterval(pollRef.current);
							resetCountdown();
						}}
					>
						{t('qrLogin.cancel')}
					</Button>
				</div>
			)}

			{status === 'success' && (
				<div className="rounded-lg border border-success/30 bg-success/10 p-6 text-center">
					<p className="text-success-text font-medium">{t('qrLogin.success')}</p>
				</div>
			)}

			{error && (
				<div className="rounded-md bg-danger/10 p-3 text-sm text-danger-text text-center">
					{error}
					{status === 'error' && (
						<Button
							fullWidth
							className="mt-2"
							onClick={() => {
								setStatus('init');
								setError('');
							}}
						>
							{t('qrLogin.retry')}
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
