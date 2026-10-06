import { compliancePublicLegalDocuments } from '@autional/shared/generated/api';

export type LegalDocType = 'terms' | 'privacy';

/**
 * 取当前 published 法律文档的版本号（best-effort）。
 *
 * 同意记录指向的必须是用户实际读到的那一版，所以接口不可用时返回 undefined、
 * 由调用方如实留空 —— 绝不回落硬编码版本号：一条指向错误文本的同意记录
 * 会让合规审计看到"证据"，比缺少版本号更糟。
 */
export async function fetchLegalDocumentVersion(
	docType: LegalDocType,
	lang: string,
): Promise<string | undefined> {
	try {
		const doc = await compliancePublicLegalDocuments({ doc_type: docType, lang });
		const version = doc?.version;
		return typeof version === 'string' && version !== '' ? version : undefined;
	} catch {
		return undefined;
	}
}
