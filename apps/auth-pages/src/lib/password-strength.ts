import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

export type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';

export interface PasswordPolicy {
	minLength?: number;
	maxLength?: number;
	requireUpper?: boolean;
	requireLower?: boolean;
	requireDigit?: boolean;
	requireSpecial?: boolean;
	minStrength?: number;
}

export interface StrengthResult {
	level: StrengthLevel;
	score: number;
	/** Chinese label for the strength level */
	label: string;
	/** Improvement suggestions */
	suggestions: string[];
}

/**
 * Crack time display from zxcvbn, showing estimated time to crack
 * under various attack scenarios.
 */
export interface CrackTimesDisplay {
	onlineThrottling100PerHour: string;
	onlineNoThrottling10PerSecond: string;
	offlineSlowHashing1e4PerSecond: string;
	offlineFastHashing1e10PerSecond: string;
}

/**
 * Extended strength result from zxcvbn entropy-based analysis.
 * Includes crack time estimates and detailed feedback from the zxcvbn engine.
 */
export interface ZxcvbnStrengthResult extends StrengthResult {
	/** Raw zxcvbn score (0-4) */
	zxcvbnScore: number;
	/** Human-readable crack time estimates for different attack scenarios */
	crackTimesDisplay?: CrackTimesDisplay;
	/** Detailed feedback from zxcvbn */
	feedback?: {
		warning: string | null;
		suggestions: string[];
	};
	/** Log10 of estimated guesses needed to crack */
	guessesLog10?: number;
}

// ---------------------------------------------------------------------------
// zxcvbn-ts singleton initialisation
// ---------------------------------------------------------------------------

let zxcvbnReady = false;

function ensureZxcvbnReady(): boolean {
	if (zxcvbnReady) return true;
	try {
		zxcvbnOptions.setOptions({
			dictionary: {
				...zxcvbnCommonPackage.dictionary,
				...zxcvbnEnPackage.dictionary,
			},
			graphs: zxcvbnCommonPackage.adjacencyGraphs,
			translations: zxcvbnEnPackage.translations,
		});
		zxcvbnReady = true;
		return true;
	} catch (e) {
		if (import.meta.env.DEV) {
			console.warn(
				'[password-strength] zxcvbn initialization failed, falling back to rule-based checker:',
				e,
			);
		}
		return false;
	}
}

// ---------------------------------------------------------------------------
// zxcvbn entropy-based strength
// ---------------------------------------------------------------------------

/**
 * Calculate password strength using the zxcvbn-ts entropy-based checker.
 *
 * @param password  The password to evaluate.
 * @param userInputs  Optional array of user-specific strings (username, email,
 *                    etc.) that zxcvbn will treat as extra dictionary entries
 *                    so they are penalised when found in the password.
 * @returns A {@link ZxcvbnStrengthResult} with score, level, crack time
 *          estimates, and feedback. Falls back to the rule-based
 *          {@link calculateStrength} when zxcvbn is unavailable.
 */
export function calculateEntropyStrength(
	password: string,
	userInputs?: string[],
	t?: (key: string, options?: Record<string, any>) => string,
): ZxcvbnStrengthResult {
	if (!password) {
		return {
			level: 'weak',
			score: 0,
			label: '',
			suggestions: [],
			zxcvbnScore: 0,
		};
	}

	if (!ensureZxcvbnReady()) {
		const fallback = calculateStrength(password, undefined, t);
		return { ...fallback, zxcvbnScore: Math.round(fallback.score * 0.8) };
	}

	try {
		const result = zxcvbn(password, userInputs);

		const scoreMap: Record<number, number> = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 5 };
		const displayScore = scoreMap[result.score] ?? 0;

		const levels: StrengthLevel[] = [
			'weak',
			'fair',
			'good',
			'strong',
			'very-strong',
			'very-strong',
		];
		const level = levels[displayScore];

		const labels: Record<StrengthLevel, string> = {
			weak: t ? t('password.strength.weak') : '很弱',
			fair: t ? t('password.strength.fair') : '一般',
			good: t ? t('password.strength.good') : '良好',
			strong: t ? t('password.strength.strong') : '强',
			'very-strong': t ? t('password.strength.veryStrong') : '非常强',
		};

		return {
			level,
			score: displayScore,
			label: labels[level],
			suggestions: result.feedback.suggestions,
			zxcvbnScore: result.score,
			crackTimesDisplay: result.crackTimesDisplay,
			feedback: {
				warning: result.feedback.warning,
				suggestions: result.feedback.suggestions,
			},
			guessesLog10: result.guessesLog10,
		};
	} catch (e) {
		if (import.meta.env.DEV) {
			console.warn('[password-strength] zxcvbn check failed, falling back:', e);
		}
		const fallback = calculateStrength(password, undefined, t);
		return { ...fallback, zxcvbnScore: Math.round(fallback.score * 0.8) };
	}
}

// ---------------------------------------------------------------------------
// Rule-based strength (original, kept for backward compatibility)
// ---------------------------------------------------------------------------

/**
 * Calculate password strength with optional policy constraints.
 * Score range: 0-5. Mapping:
 *   0 => weak, 1 => fair, 2 => good, 3 => strong, 4-5 => very-strong
 */
export function calculateStrength(
	password: string,
	policy?: PasswordPolicy,
	t?: (key: string, options?: Record<string, any>) => string,
): StrengthResult {
	if (!password) {
		return { level: 'weak', score: 0, label: '', suggestions: [] };
	}

	const hasUpper = /[A-Z]/.test(password);
	const hasLower = /[a-z]/.test(password);
	const hasDigit = /\d/.test(password);
	const hasSpecial = /[^a-zA-Z0-9]/.test(password);

	const checks = {
		minLength: password.length >= (policy?.minLength || 8),
		uppercase: !policy?.requireUpper || hasUpper,
		lowercase: !policy?.requireLower || hasLower,
		digit: !policy?.requireDigit || hasDigit,
		special: !policy?.requireSpecial || hasSpecial,
		lengthBonus: password.length >= 12,
	};

	let score = 0;
	if (checks.minLength) score++;
	if (checks.lengthBonus) score++;
	if (checks.uppercase && hasUpper) score++;
	if (checks.lowercase && hasLower) score++;
	if (checks.digit) score++;
	if (checks.special) score++;

	const levels: StrengthLevel[] = ['weak', 'fair', 'good', 'strong', 'very-strong', 'very-strong'];
	const level = levels[Math.min(score, 5)];

	const labels: Record<StrengthLevel, string> = {
		weak: t ? t('password.strength.weak') : '很弱',
		fair: t ? t('password.strength.fair') : '一般',
		good: t ? t('password.strength.good') : '良好',
		strong: t ? t('password.strength.strong') : '强',
		'very-strong': t ? t('password.strength.veryStrong') : '非常强',
	};

	const suggestions: Record<StrengthLevel, string[]> = {
		weak: [
			t
				? t('password.strength.suggestionWeak')
				: '密码过于简单，请增加长度并使用大小写字母、数字和特殊字符',
		],
		fair: [
			t ? t('password.strength.suggestionFair') : '密码强度一般，建议添加特殊字符以增强安全性',
		],
		good: [t ? t('password.strength.suggestionGood') : '密码强度良好，可以进一步增加长度'],
		strong: [t ? t('password.strength.suggestionStrong') : '密码强度较高'],
		'very-strong': [t ? t('password.strength.suggestionVeryStrong') : '密码强度非常高'],
	};

	const policySuggestions: string[] = [];
	if (policy?.requireUpper && !hasUpper) {
		// ...
	}
	if (policy?.requireLower && !hasLower) {
		// ...
	}
	if (policy?.requireDigit && !hasDigit) {
		// ...
	}
	if (policy?.requireSpecial && !hasSpecial) {
		// ...
	}
	if ((policy?.minLength || 8) > password.length) {
		const min = policy?.minLength || 8;
		policySuggestions.push(
			t ? t('password.strength.minLength', { min }) : `密码长度至少 ${min} 个字符`,
		);
	}

	return {
		level,
		score,
		label: labels[level],
		suggestions: policySuggestions.length > 0 ? policySuggestions : suggestions[level],
	};
}

/**
 * Legacy function -- use calculateStrength instead.
 * Returns { level, score } without i18n labels or suggestions.
 */
export function getPasswordStrength(password: string): { level: StrengthLevel; score: number } {
	const result = calculateStrength(password);
	return { level: result.level, score: result.score };
}
