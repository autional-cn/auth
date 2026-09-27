/**
 * Shared error handling utilities
 * Framework-agnostic: works with any UI notification system
 */

export interface ExtractedApiError {
	code: number | string;
	message: string;
}

export function extractApiErrorMessage(err: unknown, defaultMsg: string): string {
	return extractApiError(err, defaultMsg).message;
}

export function extractApiError(err: unknown, defaultMsg: string): ExtractedApiError {
	return {
		code: (err as any)?.response?.data?.code || 'UNKNOWN',
		message: (err as any)?.response?.data?.message || (err as any)?.message || defaultMsg,
	};
}

export function createHandleApiError(notify: (msg: string) => void) {
	return (err: unknown, defaultMsg: string): void => {
		notify(extractApiErrorMessage(err, defaultMsg));
	};
}
