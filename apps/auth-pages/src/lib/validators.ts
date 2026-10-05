import { z } from 'zod';

export type TFunction = (key: string, options?: Record<string, any>) => string;

export interface PasswordPolicy {
	minLength?: number;
	maxLength?: number;
	requireUpper?: boolean;
	requireLower?: boolean;
	requireDigit?: boolean;
	requireSpecial?: boolean;
	minStrength?: number;
}

export function createPasswordSchema(t: TFunction, policy?: PasswordPolicy) {
	const minLength = policy?.minLength || 8;
	const maxLength = policy?.maxLength || 128;
	let schema = z
		.string()
		.min(minLength, t('validation.passwordMinLength', { min: minLength }))
		.max(maxLength, t('validation.passwordMaxLength', { max: maxLength }));

	if (policy?.requireUpper) {
		schema = schema.regex(/[A-Z]/, t('validation.passwordUppercase'));
	}
	if (policy?.requireLower) {
		schema = schema.regex(/[a-z]/, t('validation.passwordLowercase'));
	}
	if (policy?.requireDigit) {
		schema = schema.regex(/\d/, t('validation.passwordDigit'));
	}
	if (policy?.requireSpecial) {
		schema = schema.regex(/[^a-zA-Z0-9]/, t('validation.passwordSpecial'));
	}
	return schema;
}

export function createRegisterSchema(t: TFunction, policy?: PasswordPolicy, mode?: string) {
	let schema = z.object({
		username: z
			.string()
			.min(3, t('validation.usernameMinLength', { min: 3 }))
			.max(32, t('validation.usernameMaxLength', { max: 32 }))
			.regex(/^[a-zA-Z0-9_]+$/, t('validation.usernamePattern')),
		email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
		password: createPasswordSchema(t, policy),
		confirmPassword: z.string().min(1, t('validation.confirmPassword')),
		agreeTerms: z.literal(true, {
			errorMap: () => ({ message: t('validation.agreeTerms') }),
		}),
	});

	if (mode === 'approval_required') {
		schema = schema.extend({
			reason: z.string().optional(),
		});
	}

	if (mode === 'invitation_only') {
		schema = schema.extend({
			invitation_code: z.string().min(1, t('validation.invitationCodeRequired')),
		});
	}

	return schema.refine((data) => data.password === data.confirmPassword, {
		message: t('validation.passwordsMatch'),
		path: ['confirmPassword'],
	});
}

export const loginSchema = z.object({
	identity: z.string().min(1, '请输入用户名、邮箱或手机号').max(128, '身份标识最多128个字符'),
	password: z.string().min(1, '请输入密码'),
	tenantId: z.string().optional(),
});

export const registerSchema = z
	.object({
		username: z
			.string()
			.min(3, '用户名至少3个字符')
			.max(32, '用户名最多32个字符')
			.regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
		email: z.string().min(1, '请输入邮箱').email('请输入有效的邮箱地址'),
		password: z.string().min(8, '密码至少8个字符'),
		confirmPassword: z.string().min(1, '请确认密码'),
		agreeTerms: z.literal(true, {
			errorMap: () => ({ message: '请同意服务条款' }),
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: '两次输入的密码不一致',
		path: ['confirmPassword'],
	});

export const forgotPasswordSchema = z.object({
	email: z.string().min(1, '请输入邮箱').email('请输入有效的邮箱地址'),
	identity: z
		.string()
		.min(1, '请输入邮箱或手机号')
		.refine(
			(v) => v.includes('@') || v.startsWith('+') || /^\d+$/.test(v),
			'请输入有效的邮箱或手机号（手机号以+开头）',
		)
		.optional(),
});

export const resetPasswordSchema = z
	.object({
		password: z.string().min(8, '密码至少8个字符'),
		confirmPassword: z.string().min(1, '请确认密码'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: '两次输入的密码不一致',
		path: ['confirmPassword'],
	});

export const verifyPhoneSchema = z.object({
	phone: z.string().min(1, '请输入手机号'),
	code: z.string().length(6, '验证码为6位数字'),
});

export const mfaTOTPSchema = z.object({
	code: z.string().length(6, '验证码为6位数字'),
});

export const mfaSMSSchema = z.object({
	code: z.string().length(6, '验证码为6位数字'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type VerifyPhoneFormData = z.infer<typeof verifyPhoneSchema>;
export type MFATOTPFormData = z.infer<typeof mfaTOTPSchema>;
export type MFASMSFormData = z.infer<typeof mfaSMSSchema>;

export const mfaTOTPSetupSchema = z.object({
	code: z.string().length(6, '验证码为6位数字'),
});

export const mfaPhoneSetupSchema = z.object({
	phone: z.string().min(1, '请输入手机号'),
	code: z.string().length(6, '验证码为6位数字'),
});

export const mfaEmailSetupSchema = z.object({
	email: z.string().min(1, '请输入邮箱').email('请输入有效的邮箱地址'),
	code: z.string().length(6, '验证码为6位数字'),
});

export const accountDeletionSchema = z.object({
	password: z.string().min(1, '请输入密码'),
});

export type MFATOTPSetupFormData = z.infer<typeof mfaTOTPSetupSchema>;
export type MFAPhoneSetupFormData = z.infer<typeof mfaPhoneSetupSchema>;
export type MFAEmailSetupFormData = z.infer<typeof mfaEmailSetupSchema>;
export type AccountDeletionFormData = z.infer<typeof accountDeletionSchema>;
export type ReapplyFormData = z.infer<ReturnType<typeof createReapplySchema>>;

export function createLoginSchema(t: TFunction) {
	return z.object({
		identity: z
			.string()
			.min(1, t('validation.identityRequired'))
			.max(128, t('validation.identityMaxLength')),
		password: z.string().min(1, t('validation.passwordRequired')),
		tenantId: z.string().optional(),
	});
}

export function createForgotPasswordSchema(t: TFunction) {
	return z.object({
		email: z.string().optional(),
		identity: z
			.string()
			.min(1, t('validation.identityRequired'))
			.refine(
				(v) => v.includes('@') || v.startsWith('+') || /^\d+$/.test(v),
				t('validation.identityInvalid'),
			),
	});
}

export function createResetPasswordSchema(t: TFunction) {
	return z
		.object({
			password: z.string().min(8, t('validation.passwordMinLength', { min: 8 })),
			confirmPassword: z.string().min(1, t('validation.confirmPassword')),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t('validation.passwordsMatch'),
			path: ['confirmPassword'],
		});
}

// 与 identity validatePhone 同口径：+ 开头、纯数字、总长 8-15（+ 后 7-14 位）。
// 前端先行门控（AUTH-27/28）：格式错不出去、不发请求，服务端 400 兜底不可达。
export const PHONE_E164_PATTERN = /^\+[0-9]{7,14}$/;

export function createVerifyPhoneSchema(t: TFunction) {
	return z.object({
		phone: z
			.string()
			.min(1, t('validation.phoneRequired'))
			.regex(PHONE_E164_PATTERN, t('validation.phoneInvalid')),
		code: z.string().length(6, t('validation.codeLength')),
	});
}

export function createMfaTOTPSchema(t: TFunction) {
	return z.object({
		code: z.string().length(6, t('validation.codeLength')),
	});
}

export function createMfaSMSSchema(t: TFunction) {
	return z.object({
		code: z.string().length(6, t('validation.codeLength')),
	});
}

export function createMfaTOTPSetupSchema(t: TFunction) {
	return z.object({
		code: z.string().length(6, t('validation.codeLength')),
	});
}

export function createMfaPhoneSetupSchema(t: TFunction) {
	return z.object({
		phone: z.string().min(1, t('validation.phoneRequired')),
		code: z.string().length(6, t('validation.codeLength')),
	});
}

export function createMfaEmailSetupSchema(t: TFunction) {
	return z.object({
		email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
		code: z.string().length(6, t('validation.codeLength')),
	});
}

export function createAccountDeletionSchema(t: TFunction) {
	return z.object({
		password: z.string().min(1, t('validation.passwordRequired')),
	});
}

export function createReapplySchema(t: TFunction) {
	return z.object({
		email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
		reason: z
			.string()
			.min(10, t('validation.reapplyReasonMinLength', { min: 10 }))
			.max(500, t('validation.reapplyReasonMaxLength', { max: 500 })),
	});
}

export function createVerifyIdentityConfirmSchema(t: TFunction) {
	return z.object({
		name: z
			.string()
			.min(1, t('validation.nameRequired'))
			.max(50, t('validation.nameMaxLength', { max: 50 })),
		idNumber: z
			.string()
			.min(1, t('validation.idNumberRequired'))
			.regex(
				/^[1-9]\d{5}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
				t('validation.idNumberInvalid'),
			),
	});
}
