'use client';

import { useState, Suspense, useCallback, useRef, useEffect, useMemo } from 'react';
import { useSearchParams, useParams, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Label, showToast, ToastProvider, StatusBadge } from '@autional-cn/ui';
import { useI18n } from '@/lib/i18n';
import { createVerifyIdentityConfirmSchema } from '@/lib/validators';
import {
	adminComplianceGdprConsentPost,
	verificationOcrPost,
	verificationVerifyPost,
} from '@autional-cn/shared/generated/api';
import { AuthCard } from '@/components/auth/AuthCard';

type Step = 'upload' | 'confirm' | 'consent' | 'verify' | 'result';

interface OCRResult {
	name: string;
	idNumber: string;
	dateOfBirth: string;
	gender: string;
	confidence: number;
}

interface VerificationResult {
	status: 'pending' | 'approved' | 'rejected' | 'need_review';
	verifiedAt: string;
	message: string;
}

const MAX_IMAGE_SIZE_MB = 10;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;

type ConsentKey = 'pii_collection' | 'third_party_transfer' | 'face_collection';

const STEP_ORDER: Step[] = ['upload', 'confirm', 'consent', 'verify', 'result'];

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
	const [searchParams] = useSearchParams();
	const { tenantSlug } = useParams<{ tenantSlug?: string }>();

	const confirmSchema = useMemo(() => createVerifyIdentityConfirmSchema(t), [lang, t]);
	type ConfirmFormData = z.infer<typeof confirmSchema>;

	const [step, setStep] = useState<Step>('upload');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

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
				front_image: frontBase64,
				back_image: backBase64,
			} as any);

			const data: OCRResult = (res as any)?.data || res;
			setOcrResult(data);

			setValue('name', data.name || '');
			setValue('idNumber', data.idNumber || '');
			setValue('dateOfBirth', data.dateOfBirth || '');

			setStep('confirm');
		} catch (err: any) {
			const msg = err.response?.data?.message || t('auth.verifyIdentity.uploadErrorOcr');
			setError(msg);
			showToast(msg, 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleConfirmNext = (data: ConfirmFormData) => {
		setOcrResult((prev) =>
			prev
				? { ...prev, name: data.name, idNumber: data.idNumber, dateOfBirth: data.dateOfBirth }
				: null,
		);
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
			const consentPurposes = [
				{ key: 'pii_collection', purpose: 'identity_verification_pii', method: 'explicit' },
				{
					key: 'third_party_transfer',
					purpose: 'identity_verification_third_party',
					method: 'explicit',
				},
				{ key: 'face_collection', purpose: 'identity_verification_face', method: 'explicit' },
			];
			await Promise.all(
				consentPurposes
					.filter((p) => consents[p.key])
					.map((p) =>
						adminComplianceGdprConsentPost({
							purpose: p.purpose,
							consentMethod: p.method,
							granted: true,
							policyVersion: 'v1',
						} as any),
					),
			);
		} catch {
			showToast(t('auth.verifyIdentity.consentSaveError'), 'error');
			setConsentSubmitting(false);
			return;
		}
		setConsentSubmitting(false);
		setStep('verify');
	};

	const handleSubmitVerification = async () => {
		if (!ocrResult) return;

		setLoading(true);
		setError('');
		try {
			const res = await verificationVerifyPost({
				name: ocrResult.name,
				id_number: ocrResult.idNumber,
				date_of_birth: ocrResult.dateOfBirth,
			} as any);

			const data: VerificationResult = (res as any)?.data || res;
			setVerificationResult(data);

			const newStatus = searchParams.get('status') || data.status;
			setVerificationResult((prev) =>
				prev ? { ...prev, status: newStatus as VerificationResult['status'] } : prev,
			);

			setStep('result');
		} catch (err: any) {
			const msg = err.response?.data?.message || t('auth.verifyIdentity.verifyErrorSubmit');
			setError(msg);
			showToast(msg, 'error');
			setStep('verify');
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
		setConsents({
			pii_collection: false,
			third_party_transfer: false,
			face_collection: false,
		});
		setError('');
		setStep('upload');
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
									? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
									: isActive
										? 'bg-[var(--color-brand)] text-[var(--color-on-brand)]'
										: 'bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]'
							}`}
						>
							{isDone ? '✓' : idx + 1}
						</div>
						{idx < 3 && (
							<div
								className={`h-0.5 w-6 rounded ${isDone ? 'bg-[var(--color-success)]/50' : 'bg-[var(--color-border-subtle)]'}`}
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
				<div className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm text-danger">
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

				<div className="space-y-2">
					<Label htmlFor="dateOfBirth">{t('auth.verifyIdentity.confirmDob')}</Label>
					<Input
						id="dateOfBirth"
						type="date"
						{...register('dateOfBirth')}
						error={errors.dateOfBirth?.message}
					/>
				</div>

				{ocrResult?.gender && (
					<div className="rounded-md bg-[var(--color-bg-muted)] p-3 text-sm text-[var(--color-text-secondary)]">
						{t('auth.verifyIdentity.confirmGender')}
						{ocrResult.gender === 'M'
							? t('auth.verifyIdentity.genderMale')
							: ocrResult.gender === 'F'
								? t('auth.verifyIdentity.genderFemale')
								: ocrResult.gender}
					</div>
				)}

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
					<div className="flex items-center justify-between">
						<span className="text-sm text-[var(--color-text-secondary)]">
							{t('auth.verifyIdentity.verifySummaryDob')}
						</span>
						<span className="text-sm font-medium text-[var(--color-text-primary)]">
							{ocrResult.dateOfBirth}
						</span>
					</div>
				</div>
			)}

			{error && (
				<div className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm text-danger">
					{error}
				</div>
			)}

			<Button fullWidth isLoading={loading} onClick={handleSubmitVerification}>
				{loading
					? t('auth.verifyIdentity.verifyProcessing')
					: t('auth.verifyIdentity.verifySubmit')}
			</Button>
		</div>
	);

	const renderResult = () => (
		<div className="space-y-5">
			{verificationResult && (
				<>
					<div
						className={`rounded-md p-6 text-center ${
							verificationResult.status === 'approved'
								? 'bg-[var(--color-success)]/10'
								: verificationResult.status === 'rejected'
									? 'bg-[var(--color-danger)]/10'
									: 'bg-[var(--color-warning)]/10'
						}`}
					>
						<div className="text-4xl mb-3">
							{verificationResult.status === 'approved'
								? '✅'
								: verificationResult.status === 'rejected'
									? '❌'
									: '⏳'}
						</div>
						<h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
							{verificationResult.status === 'approved'
								? t('auth.verifyIdentity.verifySuccess')
								: verificationResult.status === 'rejected'
									? t('auth.verifyIdentity.verifyRejected')
									: t('auth.verifyIdentity.verifyPending')}
						</h3>
						<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
							{verificationResult.message ||
								(verificationResult.status === 'approved'
									? t('auth.verifyIdentity.verifySuccessDesc')
									: verificationResult.status === 'rejected'
										? t('auth.verifyIdentity.verifyRejectedDesc')
										: t('auth.verifyIdentity.verifyPendingDesc'))}
						</p>
						{verificationResult.verifiedAt && (
							<p className="mt-3 text-xs text-[var(--color-text-secondary)]">
								{t('auth.verifyIdentity.verifyTime')}
								{new Date(verificationResult.verifiedAt).toLocaleString()}
							</p>
						)}
					</div>

					{verificationResult.status === 'rejected' && (
						<Button variant="outline" fullWidth onClick={handleCancel}>
							{t('auth.verifyIdentity.verifyRetry')}
						</Button>
					)}
				</>
			)}

			<div className="text-center">
				<Link
					to={tenantSlug ? `/${tenantSlug}/dashboard` : '/dashboard'}
					className="text-sm text-[var(--color-brand)] hover:underline"
				>
					{t('auth.verifyIdentity.backHome')}
				</Link>
			</div>
		</div>
	);

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

	return (
		<ToastProvider>
			<AuthCard maxWidth="md">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
						{t('auth.verifyIdentity.title')}
					</h1>
					<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
						{step === 'upload' && t('auth.verifyIdentity.stepUpload')}
						{step === 'confirm' && t('auth.verifyIdentity.stepConfirm')}
						{step === 'consent' && t('auth.verifyIdentity.stepConsent')}
						{step === 'verify' && t('auth.verifyIdentity.stepVerify')}
						{step === 'result' && t('auth.verifyIdentity.stepResult')}
					</p>
				</div>

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
