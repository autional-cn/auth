'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Captcha3DWidgetProps {
	apiBase?: string;
	onToken?: (token: string) => void;
	onError?: (error: string) => void;
}

type Step = 'challenge' | 'solving' | 'generating' | 'solved' | 'error';

function toBase36(n: number): string {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
	if (n === 0) return '0';
	let r = '';
	while (n > 0) {
		r = chars[n % 36] + r;
		n = Math.floor(n / 36);
	}
	return r;
}

async function sha256(s: string): Promise<string> {
	const buf = new TextEncoder().encode(s);
	const hash = await crypto.subtle.digest('SHA-256', buf);
	return Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

export function Captcha3DWidget({
	apiBase = '/bff/captcha3d/api/v1/captcha',
	onToken,
	onError,
}: Captcha3DWidgetProps) {
	const [step, setStep] = useState<Step>('challenge');
	const [gifSrc, setGifSrc] = useState<string>('');
	const [input, setInput] = useState('');
	const [message, setMessage] = useState('');
	const [poWAttempts, setPoWAttempts] = useState(0);
	const captchaIdRef = useRef<string>('');
	const [captchaId, setCaptchaId] = useState('');

	const run = useCallback(async () => {
		setStep('challenge');
		setMessage('获取挑战...');

		try {
			// Step 1: Get PoW challenge
			const cr = await fetch(`${apiBase}/challenge`, { method: 'POST' });
			if (!cr.ok) throw new Error(`challenge HTTP ${cr.status}`);
			const cd = (await cr.json()).data;
			const challenge = cd.data.challenge;
			const powId = cd.id;

			// Step 2: Solve PoW
			setStep('solving');
			setMessage('解算 PoW...');
			let nonce = 0;
			const start = Date.now();
			while (true) {
				const hash = await sha256(challenge + nonce);
				if (hash.startsWith('00')) break;
				nonce++;
				if (nonce % 10000 === 0) {
					setPoWAttempts(nonce);
					await new Promise((r) => setTimeout(r, 0));
				}
			}
			const powToken = 'pow_' + toBase36(nonce);

			// Step 3: Generate captcha
			setStep('generating');
			setMessage(`正在生成验证码... (PoW: ${((Date.now() - start) / 1000).toFixed(1)}s)`);
			const gr = await fetch(`${apiBase}/generate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					pow_id: powId,
					pow_token: powToken,
					noise: 1000,
					density: 9,
					shape: 'circle',
				}),
			});
			if (!gr.ok) throw new Error(`generate HTTP ${gr.status}`);
			const gd = await gr.json();
			if (gd.code !== 0) throw new Error(gd.message || 'generate failed');

			captchaIdRef.current = gd.data.captcha_id;
			setCaptchaId(gd.data.captcha_id);
			setGifSrc(`data:${gd.data.image_type};base64,${gd.data.image}`);
			setStep('solved');
			setMessage('请输入验证码中的 4 位字符');
		} catch (e: any) {
			setStep('error');
			setMessage(e.message || 'error');
			onError?.(e.message || 'error');
		}
	}, [apiBase, onError]);

	useEffect(() => {
		run();
	}, [run]);

	const handleSubmit = () => {
		if (input.trim().length === 4) {
			onToken?.(input.trim().toUpperCase());
		}
	};

	return (
		<div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
			{gifSrc && (
				<div
					style={{
						margin: '12px auto',
						maxWidth: 200,
						border: '1px solid rgba(255,255,255,0.1)',
						borderRadius: 4,
						overflow: 'hidden',
					}}
				>
					<img src={gifSrc} alt="captcha" style={{ width: '100%', display: 'block' }} />
				</div>
			)}

			{step === 'solved' && (
				<div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
					<input
						type="text"
						maxLength={4}
						value={input}
						onChange={(e) => setInput(e.target.value.toUpperCase())}
						onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
						placeholder="输入验证码"
						style={{
							width: 120,
							textAlign: 'center',
							letterSpacing: '0.3em',
							background: 'rgba(255,255,255,0.05)',
							border: 'none',
							borderBottom: '2px solid rgba(99,102,241,0.3)',
							color: '#fff',
							fontSize: 16,
							outline: 'none',
							fontFamily: 'monospace',
						}}
						autoFocus
					/>
					<button
						onClick={handleSubmit}
						style={{
							padding: '8px 16px',
							background: '#6366f1',
							color: '#fff',
							border: 'none',
							borderRadius: 6,
							cursor: 'pointer',
							fontFamily: 'monospace',
						}}
					>
						✓
					</button>
				</div>
			)}

			<div style={{ fontSize: 11, color: step === 'error' ? '#f87171' : '#888', marginTop: 8 }}>
				{message}
				{poWAttempts > 0 && step === 'solving' && ` (${poWAttempts} 次尝试)`}
			</div>

			{step === 'error' && (
				<button
					onClick={run}
					style={{
						marginTop: 8,
						padding: '6px 12px',
						background: 'rgba(255,255,255,0.1)',
						color: '#fff',
						border: '1px solid rgba(255,255,255,0.2)',
						borderRadius: 4,
						cursor: 'pointer',
						fontFamily: 'monospace',
						fontSize: 11,
					}}
				>
					重试
				</button>
			)}
		</div>
	);
}
