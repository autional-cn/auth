'use client';

// AUTH-29：实名认证页全链修复——
//   ① 进页预检（/verification/me/detail）：终态（verified/verified_minor/rejected）直接短路，
//      不再让已认证用户重复走上传流程；
//   ② 上传 OCR 409（61180002 real_name_exists）分流：重查详情展示已有认证，
//      不再误报「OCR 识别失败」（与图片无关、换图恒同错）；
//   ③ 步骤 2-5 契约对齐（OCR 响应键名 / consent 双轨 / verify 的 method+verification_id）：
//      修复前请求体键错位（name/id_number/date_of_birth）致流程不可执行；
//   ④ 结果步按后端真值状态渲染（verified/verified_minor/ocr_completed/rejected），
//      移除 ?status= 查询覆盖；
//   ⑤ 删除 DOB/gender 僵尸字段（不可预填、不发送，GDPR 数据最小化）。

import { useState, Suspense, useCallback, useRef, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Label, showToast, ToastProvider, StatusBadge } from '@autional-cn/ui';
import { extractApiError } from '@autional-cn/shared';
import { useI18n } from '@/lib/i18n';
import { createVerifyIdentityConfirmSchema } from '@/lib/validators';
import {
	authMeConsentPost,
	verificationConsentPost,
	verificationMeDetail,
	verificationOcrPost,
	verificationVerifyPost,
} from '@autional-cn/shared/generated/api';
import { fetchLegalDocumentVersion } from '@/lib/legal-document';
import { AuthCard } from '@/components/auth/AuthCard';

type Step = 'upload' | 'confirm' | 'consent' | 'verify' | 'result';

interface OCRResult {
	name: string;
	idNumber: string;
	confidence: number;
}

// 后端真值状态（verification/me/detail + verify 响应共用）
interface VerificationResult {
	status: string;
	verifiedAt?: string | null;
	rejectedReason?: string;
	retryCount?: number;
	maxRetries?: number;
}

type Precheck = 'checking' | 'clear' | 'verified' | 'rejected';

const MAX_IMAGE_SIZE_MB = 10;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;

type ConsentKey = 'pii_collection' | 'third_party_transfer' | 'face_collection';

const STEP_ORDER: Step[] = ['upload', 'confirm', 'consent', 'verify', 'result'];

const VERIFIED_STATUSES = ['verified', 'verified_minor'];

function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve((reader.result as string).split(',')[1]);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

function VerifyIdentityContent() {
	const { t, lang } = useI18n();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();

	const confirmSchema = useMemo(() => createVerifyIdentityConfirmSchema(t), [lang, t]);
	type ConfirmFormData = z.infer<typeof confirmSchema>;

	const [step, setStep] = useState<Step>('upload');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// AUTH-29：预检门——checking 期间渲染 loading；verified/rejected 短路面板
	const [precheck, setPrecheck] = useState<Precheck>('checking');
	const [existing, setExisting] = useState<VerificationResult | null>(null);
	const [verificationId, setVerificationId] = useState('');

	const [frontImage, setFrontImage] = useState<File | null>(null);
	const [backImage, setBackImage] = useState<File | null>(null);
	const [frontPreview, setFrontPreview] = useState<string>('');
	const [backPreview, setBackPreview] = useState<string>('');

	const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
	const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

	const [consents, setConsents] = useState<Record<string, boolean>>({
		pii_collection: false,
		third_party_transfer: false,
		face_collection: false,
	});
	const [consentSubmitting, setConsentSubmitting] = useState(false);

	const frontInputRef = useRef<HTMLInputElement>(null);
	const backInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		return () => {
			URL.revokeObjectURL(frontPreview);
			URL.revokeObjectURL(backPreview);
		};
	}, [frontPreview, backPreview]);

	// AUTH-29：进页预检——已有终态记录直接短路（跳过整个上传流程）；
	// 404（无记录）/非终态（进行中，后端允许重走）/网络失败一律放行，预检失败不拦路
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await verificationMeDetail();
				const detail = ((res as any)?.data || res) as VerificationResult;
				if (cancelled) return;
				if (detail?.status && VERIFIED_STATUSES.includes(detail.status)) {
					setExisting(detail);
					setPrecheck('verified');
				} else if (detail?.status === 'rejected') {
					setExisting(detail);
					setPrecheck('rejected');
				} else {
					setPrecheck('clear');
				}
			} catch {
				if (!cancelled) setPrecheck('clear');
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	// AUTH-28 同款三级分流：i18n_key 已登记 → 本地化；429 → 限流文案；否则通用兜底。
	// 不直出服务端英文（extractApiError 的 message 链含 title/detail）
	const resolveErrorMessage = useCallback(
		(err: unknown, fallbackKey: string): string => {
			const { i18nKey } = extractApiError(err, '');
			const localized = i18nKey ? t(i18nKey, '') : '';
			if (localized) return localized;
			if ((err as any)?.response?.status === 429) return t('auth.verifyIdentity.rateLimited');
			return t(fallbackKey);
		},
		[t],
	);

	// AUTH-29：409 分流——重查详情短路展示已有认证；重查失败回落「已有认证记录」文案
	// （不再把确定性冲突表述为 OCR 故障）
	const showExistingOrFallback = useCallback(async () => {
		try {
			const res = await verificationMeDetail();
			const detail = ((res as any)?.data || res) as VerificationResult;
			if (detail?.status && VERIFIED_STATUSES.includes(detail.status)) {
				setExisting(detail);
				setPrecheck('verified');
				return;
			}
			if (detail?.status === 'rejected') {
				setExisting(detail);
				setPrecheck('rejected');
				return;
			}
		} catch {
			// fallthrough 到兜底文案
		}
		const msg = t('error.verification.real_name_exists');
		setError(msg);
		showToast(msg, 'error');
	}, [t]);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<ConfirmFormData>({
		resolver: zodResolver(confirmSchema),
	});

	const consentItems = useMemo(
		() => [
			{
				key: 'pii_collection' as const,
				label: t('auth.verifyIdentity.consentPiiTitle'),
				desc: t('auth.verifyIdentity.consentPii'),
			},
			{
				key: 'third_party_transfer' as const,
				label: t('auth.verifyIdentity.consentThirdPartyTitle'),
				desc: t('auth.verifyIdentity.consentThirdParty'),
			},
			{
				key: 'face_collection' as const,
				label: t('auth.verifyIdentity.consentFaceTitle'),
				desc: t('auth.verifyIdentity.consentFace'),
			},
		],
		[t],
	);

	const handleImageSelect = useCallback(
		(
			side: 'front' | 'back',
			setFile: (f: File | null) => void,
			setPreview: (s: string) => void,
			currentPreview: string,
		) =>
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const file = e.target.files?.[0];
				if (!file) return;

				if (!file.type.startsWith('image/')) {
					showToast(t('auth.verifyIdentity.uploadErrorImageType'), 'warning');
					return;
				}

				if (file.size > MAX_IMAGE_SIZE) {
					showToast(
						t('auth.verifyIdentity.uploadErrorSize', { size: MAX_IMAGE_SIZE_MB }),
						'warning',
					);
					return;
				}

				setFile(file);
				if (currentPreview) {
					URL.revokeObjectURL(currentPreview);
				}
				const url = URL.createObjectURL(file);
				setPreview(url);
			},
		[t],
	);

	const clearImage = useCallback(
		(
			setFile: (f: File | null) => void,
			setPreview: (s: string) => void,
			inputRef: React.RefObject<HTMLInputElement | null>,
			currentPreview: string,
		) => {
			setFile(null);
			URL.revokeObjectURL(currentPreview);
			setPreview('');
			if (inputRef.current) {
				inputRef.current.value = '';
			}
		},
		[],
	);

	const handleUploadNext = async () => {
		if (!frontImage || !backImage) {
			showToast(t('auth.verifyIdentity.uploadErrorMissing'), 'warning');
			return;
		}

		setLoading(true);
		setError('');
		try {
			const [frontBase64, backBase64] = await Promise.all([
				fileToBase64(frontImage),
				fileToBase64(backImage),
			]);

			const res = await verificationOcrPost({
				frontImage: frontBase64,
				backImage: backBase64,
			});
			const data = ((res as any)?.data || res) as {
				verificationId?: string;
				ocrName?: string;
				ocrIdNumber?: string;
				ocrConfidence?: number;
			};

			// AUTH-29：verification_id 是后续 consent/verify 的必需句柄，此前被丢弃
			setVerificationId(data.verificationId || '');
			setOcrResult({
				name: data.ocrName || '',
				idNumber: data.ocrIdNumber || '',
				confidence: data.ocrConfidence ?? 0,
			});
			setValue('name', data.ocrName || '');
			setValue('idNumber', data.ocrIdNumber || '');

			setStep('confirm');
		} catch (err: any) {
			const { code, i18nKey } = extractApiError(err, '');
			// AUTH-29：终态已存在（61180002）分流——与图片无关，不再归因 OCR 失败
			if (Number(code) === 61180002 || i18nKey === 'error.verification.real_name_exists') {
				await showExistingOrFallback();
			} else {
				const msg = resolveErrorMessage(err, 'auth.verifyIdentity.uploadErrorOcr');
				setError(msg);
				showToast(msg, 'error');
			}
		} finally {
			setLoading(false);
		}
	};

	const handleConfirmNext = (data: ConfirmFormData) => {
		setOcrResult((prev) => (prev ? { ...prev, name: data.name, idNumber: data.idNumber } : null));
		setStep('consent');
	};

	const allConsentsChecked = Object.values(consents).every(Boolean);

	const handleConsentNext = async () => {
		if (!allConsentsChecked) {
			showToast(t('auth.verifyIdentity.consentRequired'), 'warning');
			return;
		}
		setConsentSubmitting(true);
		try {
			const consentScopes = [
				{ key: 'pii_collection', scope: 'identity_verification_pii' },
				{ key: 'third_party_transfer', scope: 'identity_verification_third_party' },
				{ key: 'face_collection', scope: 'identity_verification_face' },
			];
			// 版本取接口真值（= 用户在 /privacy 读到的那一版）；取不到则不带 version
			const version = await fetchLegalDocumentVersion('privacy', lang);
			// identity 侧同意留痕（审计/合规面，保留）
			await Promise.all(
				consentScopes
					.filter((p) => consents[p.key])
					.map((p) =>
						authMeConsentPost({
							scope: p.scope,
							granted: true,
							metadata: version ? { version } : undefined,
						}),
					),
			);
			// AUTH-29：verification 服务侧同意记录——SubmitVerification 强制 consent 存在
			// （仅写 identity 侧不满足核验门，会 61180009）；生成器 GrantConsentRequest 为
			// identity 形状（fieldKeys），本服务契约为 consent_items → 调用点 cast（生成器
			// 同名碰撞，已登记 OPEN-ITEMS）
			if (!verificationId) throw new Error('missing verification_id');
			await verificationConsentPost(
				{
					consentItems: consentScopes.filter((p) => consents[p.key]).map((p) => p.key),
				} as any,
				{ verification_id: verificationId },
			);
		} catch (err: any) {
			showToast(resolveErrorMessage(err, 'auth.verifyIdentity.consentSaveError'), 'error');
			setConsentSubmitting(false);
			return;
		}
		setConsentSubmitting(false);
		setStep('verify');
	};

	const handleSubmitVerification = async () => {
		if (!ocrResult || !verificationId) return;

		setLoading(true);
		setError('');
		try {
			const res = await verificationVerifyPost(
				{
					method: 'two_element',
					confirmedName: ocrResult.name,
					confirmedIdNumber: ocrResult.idNumber,
				},
				{ verification_id: verificationId },
			);
			const data = ((res as any)?.data || res) as VerificationResult;
			setVerificationResult(data);

			// AUTH-29：失败态（ocr_completed/rejected）响应无 rejected_reason——补拉详情取真因
			if (data?.status === 'ocr_completed' || data?.status === 'rejected') {
				try {
					const detailRes = await verificationMeDetail();
					const detail = ((detailRes as any)?.data || detailRes) as VerificationResult;
					if (detail?.rejectedReason) {
						setVerificationResult((prev) =>
							prev ? { ...prev, rejectedReason: detail.rejectedReason } : prev,
						);
					}
				} catch {
					// 原因属增强信息，取不到不拦结果面
				}
			}

			setStep('result');
		} catch (err: any) {
			const msg = resolveErrorMessage(err, 'auth.verifyIdentity.verifyErrorSubmit');
			setError(msg);
			showToast(msg, 'error');
		} finally {
			setLoading(false);
		}
	};

	const stepIndex = STEP_ORDER.indexOf(step);

	const handlePrev = () => {
		setError('');
		if (stepIndex > 0) {
			setStep(STEP_ORDER[stepIndex - 1]);
		}
	};

	const handleCancel = () => {
		setFrontImage(null);
		setBackImage(null);
		setFrontPreview('');
		setBackPreview('');
		setOcrResult(null);
		setVerificationResult(null);
		setVerificationId('');
		setConsents({
			pii_collection: false,
			third_party_transfer: false,
			face_collection: false,
		});
		setError('');
		setStep('upload');
	};

	// 可重试失败（ocr_completed）：回验证步重新提交；终态 rejected 无此按钮
	const handleRetry = () => {
		setError('');
		setVerificationResult(null);
		setStep('verify');
	};

	const toggleConsent = (key: string) => {
		setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const renderStepIndicator = () => (
		<div className="flex items-center justify-center gap-1">
			{(['upload', 'confirm', 'consent', 'verify'] as Step[]).map((s, idx) => {
				const currentIdx = STEP_ORDER.indexOf(step);
				const isActive = idx === currentIdx;
				const isDone = idx < currentIdx;
				return (
					<div key={s} className="flex items-center gap-1">
						<div
							className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
								isDone
									? 'bg-success/10 text-success-text'
									: isActive
										? 'bg-[var(--color-brand)] text-[var(--color-on-brand)]'
										: 'bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]'
							}`}
						>
							{isDone ? '✓' : idx + 1}
						</div>
						{idx < 3 && (
							<div
								className={`h-0.5 w-6 rounded ${isDone ? 'bg-success/50' : 'bg-[var(--color-border-subtle)]'}`}
							/>
						)}
					</div>
				);
			})}
		</div>
	);

	const renderUpload = () => (
		<div className="space-y-5">
			<p className="text-sm text-[var(--color-text-secondary)]">
				{t('auth.verifyIdentity.uploadGuide', { maxSize: MAX_IMAGE_SIZE_MB })}
			</p>

			<div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-3 text-xs text-[var(--color-text-secondary)]">
				<p className="font-medium mb-1">{t('auth.verifyIdentity.uploadTipsTitle')}</p>
				<ul className="list-inside list-disc space-y-0.5">
					<li>{t('auth.verifyIdentity.uploadTip1')}</li>
					<li>{t('auth.verifyIdentity.uploadTip2')}</li>
					<li>{t('auth.verifyIdentity.uploadTip3')}</li>
					<li>{t('auth.verifyIdentity.uploadTip4')}</li>
				</ul>
			</div>

			<div className="grid gap-4">
				<div className="space-y-2">
					<Label>{t('auth.verifyIdentity.uploadFront')}</Label>
					<div
						onClick={() => frontInputRef.current?.click()}
						className={`group relative flex aspect-[3/2] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
							frontPreview
								? 'border-transparent'
								: 'border-[var(--color-border-subtle)] hover:border-[var(--color-brand)]'
						}`}
					>
						{frontPreview ? (
							<>
								<img
									src={frontPreview}
									alt={t('auth.verifyIdentity.uploadFront')}
									className="h-full w-full rounded-lg object-contain bg-[var(--color-bg-muted)]"
								/>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										clearImage(setFrontImage, setFrontPreview, frontInputRef, frontPreview);
									}}
									className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
								>
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M18 6 6 18M6 6l12 12" />
									</svg>
								</button>
							</>
						) : (
							<div className="text-center">
								<div className="text-3xl text-[var(--color-text-muted)]">📷</div>
								<p className="mt-1 text-sm text-[var(--color-text-muted)]">
									{t('auth.verifyIdentity.uploadFrontPlaceholder')}
								</p>
							</div>
						)}
					</div>
					<input
						ref={frontInputRef}
						type="file"
						accept="image/jpeg,image/png,image/webp"
						onChange={handleImageSelect('front', setFrontImage, setFrontPreview, frontPreview)}
						className="hidden"
					/>
				</div>

				<div className="space-y-2">
					<Label>{t('auth.verifyIdentity.uploadBack')}</Label>
					<div
						onClick={() => backInputRef.current?.click()}
						className={`group relative flex aspect-[3/2] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
							backPreview
								? 'border-transparent'
								: 'border-[var(--color-border-subtle)] hover:border-[var(--color-brand)]'
						}`}
					>
						{backPreview ? (
							<>
								<img
									src={backPreview}
									alt={t('auth.verifyIdentity.uploadBack')}
									className="h-full w-full rounded-lg object-contain bg-[var(--color-bg-muted)]"
								/>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										clearImage(setBackImage, setBackPreview, backInputRef, backPreview);
									}}
									className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
								>
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M18 6 6 18M6 6l12 12" />
									</svg>
								</button>
							</>
						) : (
							<div className="text-center">
								<div className="text-3xl text-[var(--color-text-muted)]">📷</div>
								<p className="mt-1 text-sm text-[var(--color-text-muted)]">
									{t('auth.verifyIdentity.uploadBackPlaceholder')}
								</p>
							</div>
						)}
					</div>
					<input
						ref={backInputRef}
						type="file"
						accept="image/jpeg,image/png,image/webp"
						onChange={handleImageSelect('back', setBackImage, setBackPreview, backPreview)}
						className="hidden"
					/>
				</div>
			</div>

			{error && (
				<div className="rounded-md bg-danger/10 p-3 text-sm text-danger-text">
					{error}
				</div>
			)}

			<Button
				fullWidth
				isLoading={loading}
				onClick={handleUploadNext}
				disabled={!frontImage || !backImage}
			>
				{loading
					? t('auth.verifyIdentity.uploadProcessing')
					: t('auth.verifyIdentity.uploadSubmit')}
			</Button>
		</div>
	);

	const renderConfirm = () => (
		<div className="space-y-5">
			<p className="text-sm text-[var(--color-text-secondary)]">
				{t('auth.verifyIdentity.confirmEditHint')}
			</p>

			{ocrResult && (
				<div className="flex items-center gap-2 rounded-md bg-[var(--color-bg-muted)] p-3 text-xs text-[var(--color-text-secondary)]">
					<span>{t('auth.verifyIdentity.ocrConfidence')}</span>
					<StatusBadge
						variant={
							ocrResult.confidence >= 0.9
								? 'success'
								: ocrResult.confidence >= 0.7
									? 'warning'
									: 'danger'
						}
					>
						{Math.round(ocrResult.confidence * 100)}%
					</StatusBadge>
				</div>
			)}

			<form onSubmit={handleSubmit(handleConfirmNext)} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">{t('auth.verifyIdentity.confirmName')}</Label>
					<Input
						id="name"
						placeholder={t('auth.verifyIdentity.confirmNamePlaceholder')}
						{...register('name')}
						error={errors.name?.message}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="idNumber">{t('auth.verifyIdentity.confirmIdNumber')}</Label>
					<Input
						id="idNumber"
						placeholder={t('auth.verifyIdentity.confirmIdNumberPlaceholder')}
						inputMode="numeric"
						maxLength={18}
						{...register('idNumber')}
						error={errors.idNumber?.message}
					/>
				</div>

				<Button type="submit" fullWidth>
					{t('auth.verifyIdentity.confirmEdit')}
				</Button>
			</form>
		</div>
	);

	const renderConsent = () => (
		<div className="space-y-5">
			<div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-4 space-y-3">
				<h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
					{t('auth.verifyIdentity.consentTitle')}
				</h3>
				<div className="space-y-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
					<p>{t('auth.verifyIdentity.consentPipNote')}</p>
					<p>{t('auth.verifyIdentity.consentPipNote2')}</p>
				</div>
			</div>

			<div className="space-y-3">
				{consentItems.map(({ key, label, desc }) => (
					<label
						key={key}
						className="flex items-start gap-3 rounded-md border border-[var(--color-border-subtle)] p-3 cursor-pointer transition-colors hover:bg-[var(--color-bg-muted)]"
					>
						<input
							type="checkbox"
							checked={consents[key]}
							onChange={() => toggleConsent(key)}
							className="mt-0.5 h-4 w-4 rounded border-[var(--color-border-subtle)] text-[var(--color-brand)] focus:ring-[var(--color-brand)]"
						/>
						<div>
							<p className="text-sm font-medium text-[var(--color-text-primary)]">
								{t('auth.verifyIdentity.consentAgreeLabel')}
								{label}
							</p>
							<p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{desc}</p>
						</div>
					</label>
				))}
			</div>

			<Button
				fullWidth
				disabled={!allConsentsChecked || consentSubmitting}
				isLoading={consentSubmitting}
				onClick={handleConsentNext}
			>
				{t('auth.verifyIdentity.consentContinue')}
			</Button>
		</div>
	);

	const renderVerify = () => (
		<div className="space-y-5">
			<p className="text-sm text-[var(--color-text-secondary)]">
				{t('auth.verifyIdentity.verifySummary')}
			</p>

			{ocrResult && (
				<div className="rounded-md border border-[var(--color-border-subtle)] p-4 space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-sm text-[var(--color-text-secondary)]">
							{t('auth.verifyIdentity.verifySummaryName')}
						</span>
						<span className="text-sm font-medium text-[var(--color-text-primary)]">
							{ocrResult.name}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-[var(--color-text-secondary)]">
							{t('auth.verifyIdentity.verifySummaryIdNumber')}
						</span>
						<span className="text-sm font-medium text-[var(--color-text-primary)]">
							{ocrResult.idNumber.replace(/^(.{6})(?:\d+)(.{4})$/, '$1******$2')}
						</span>
					</div>
				</div>
			)}

			{error && (
				<div className="rounded-md bg-danger/10 p-3 text-sm text-danger-text">
					{error}
				</div>
			)}

			<Button fullWidth isLoading={loading} disabled={!verificationId} onClick={handleSubmitVerification}>
				{loading
					? t('auth.verifyIdentity.verifyProcessing')
					: t('auth.verifyIdentity.verifySubmit')}
			</Button>
		</div>
	);

	const renderResult = () => {
		const status = verificationResult?.status || '';
		const isVerified = VERIFIED_STATUSES.includes(status);
		const isTerminalRejected = status === 'rejected';
		const isRetryable = status === 'ocr_completed';
		const isFailed = isTerminalRejected || isRetryable;
		const reason = verificationResult?.rejectedReason;

		return (
			<div className="space-y-5">
				{verificationResult && (
					<>
						<div
							className={`rounded-md p-6 text-center ${
								isVerified
									? 'bg-success/10'
									: isTerminalRejected
										? 'bg-danger/10'
										: 'bg-warning/10'
							}`}
						>
							<div className="text-4xl mb-3">
								{isVerified ? '✅' : isTerminalRejected ? '❌' : isRetryable ? '⚠️' : '⏳'}
							</div>
							<h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
								{isVerified
									? t('auth.verifyIdentity.verifySuccess')
									: isFailed
										? t('auth.verifyIdentity.verifyRejected')
										: t('auth.verifyIdentity.verifyPending')}
							</h3>
							<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
								{isVerified
									? t('auth.verifyIdentity.verifySuccessDesc')
									: isFailed
										? reason || t('auth.verifyIdentity.verifyRejectedDesc')
										: t('auth.verifyIdentity.verifyPendingDesc')}
							</p>
							{isTerminalRejected && (
								<p className="mt-2 text-xs text-[var(--color-text-secondary)]">
									{t('auth.verifyIdentity.verifyRetryExhausted')}
								</p>
							)}
							{isVerified && verificationResult.verifiedAt && (
								<p className="mt-3 text-xs text-[var(--color-text-secondary)]">
									{t('auth.verifyIdentity.verifyTime')}
									{new Date(verificationResult.verifiedAt).toLocaleString()}
								</p>
							)}
						</div>

						{isRetryable && (
							<Button variant="outline" fullWidth onClick={handleRetry}>
								{t('auth.verifyIdentity.verifyRetry')}
							</Button>
						)}
					</>
				)}

				<div className="text-center">
					<Link
						to={tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard'}
						className="text-sm text-brand-text hover:underline"
					>
						{t('auth.verifyIdentity.backHome')}
					</Link>
				</div>
			</div>
		);
	};

	// AUTH-29：预检短路面板（进页预检 / 上传 409 分流共用）
	const renderExisting = () => {
		const isVerified = precheck === 'verified';
		return (
			<div className="space-y-5">
				<div
					className={`rounded-md p-6 text-center ${
						isVerified ? 'bg-success/10' : 'bg-danger/10'
					}`}
				>
					<div className="text-4xl mb-3">{isVerified ? '✅' : '❌'}</div>
					<h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
						{isVerified
							? t('auth.verifyIdentity.alreadyVerifiedTitle')
							: t('auth.verifyIdentity.alreadyRejectedTitle')}
					</h3>
					<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
						{isVerified
							? t('auth.verifyIdentity.alreadyVerifiedDesc')
							: t('auth.verifyIdentity.alreadyRejectedDesc')}
					</p>
					{!isVerified && existing?.rejectedReason && (
						<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
							{existing.rejectedReason}
						</p>
					)}
					{isVerified && existing?.verifiedAt && (
						<p className="mt-3 text-xs text-[var(--color-text-secondary)]">
							{t('auth.verifyIdentity.verifyTime')}
							{new Date(existing.verifiedAt).toLocaleString()}
						</p>
					)}
				</div>

				<div className="text-center">
					<Link
						to={tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard'}
						className="text-sm text-brand-text hover:underline"
					>
						{t('auth.verifyIdentity.backHome')}
					</Link>
				</div>
			</div>
		);
	};

	const renderStepContent = () => {
		switch (step) {
			case 'upload':
				return renderUpload();
			case 'confirm':
				return renderConfirm();
			case 'consent':
				return renderConsent();
			case 'verify':
				return renderVerify();
			case 'result':
				return renderResult();
			default:
				return null;
		}
	};

	const stepSubtitle = {
		upload: t('auth.verifyIdentity.stepUpload'),
		confirm: t('auth.verifyIdentity.stepConfirm'),
		consent: t('auth.verifyIdentity.stepConsent'),
		verify: t('auth.verifyIdentity.stepVerify'),
		result: t('auth.verifyIdentity.stepResult'),
	}[step];

	return (
		<ToastProvider>
			<AuthCard maxWidth="md">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
						{t('auth.verifyIdentity.title')}
					</h1>
					{precheck === 'clear' && (
						<p className="mt-2 text-sm text-[var(--color-text-secondary)]">{stepSubtitle}</p>
					)}
				</div>

				{precheck === 'checking' ? (
					<div className="flex justify-center py-10">
						<div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-border-subtle)] border-t-[var(--color-brand)]" />
					</div>
				) : precheck === 'verified' || precheck === 'rejected' ? (
					renderExisting()
				) : (
					<>
						{step !== 'result' && renderStepIndicator()}

						{renderStepContent()}

						{step !== 'upload' && step !== 'result' && (
							<div className="flex gap-3">
								<Button variant="outline" fullWidth onClick={handlePrev}>
									{t('auth.verifyIdentity.verifyBack')}
								</Button>
								<Button variant="outline" fullWidth onClick={handleCancel}>
									{t('auth.verifyIdentity.verifyCancel')}
								</Button>
							</div>
						)}

						{step === 'upload' && (
							<div className="text-center">
								<Button variant="ghost" onClick={handleCancel}>
									{t('auth.verifyIdentity.verifyCancel')}
								</Button>
							</div>
						)}
					</>
				)}
			</AuthCard>
		</ToastProvider>
	);
}

export default function VerifyIdentityPage() {
	const { t } = useI18n();
	return (
		<Suspense
			fallback={
				<AuthCard maxWidth="md">
					<div className="text-center space-y-6">
						<div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-border-subtle)] border-t-[var(--color-brand)]" />
						<h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
							{t('auth.verifyIdentity.title')}
						</h1>
						<p className="text-sm text-[var(--color-text-secondary)]">
							{t('common.loading') || 'Loading…'}
						</p>
					</div>
				</AuthCard>
			}
		>
			<VerifyIdentityContent />
		</Suspense>
	);
}
