import { PublicAuthConfigByAuthConfig } from '@autional/shared/generated/api';
import { processPasswordForTransmission as processPassword } from '@autional/shared';

export { processPasswordForTransmission, hashPasswordForTransmission } from '@autional/shared';
export type { TransmissionResult } from '@autional/shared';

/**
 * 解析租户密码传输模式（契约单点：change-password / account-deletion / 登录共用）。
 *
 * 2026-08-17 安全口径：禁止硬编码 plain。后端恒返回 password_transmission
 * （GetPasswordPolicy 有全局默认兜底）；undefined/空串 = 契约错误必须抛错暴露，
 * 不能降级明文（hash/symmetric 租户会 61000104）。
 *
 * 需要密码原样交给后端 Verify 的场景（改密旧密码、重认证、删号），必须用**同一
 * 租户权威 id**解析模式并按返回模式预处理，否则 hash 租户下裸明文必败（AUTH-19/42）。
 */
export async function fetchPasswordTransmissionMode(tenantId: string): Promise<string> {
	const authConfig = await PublicAuthConfigByAuthConfig(tenantId);
	const mode = authConfig?.passwordPolicy?.passwordTransmission;
	if (mode === undefined || mode === '' || mode === null) {
		throw new Error(
			'password transmission mode is missing from tenant auth-config (contract error)',
		);
	}
	return mode;
}

/**
 * 按租户传输策略预处理密码（模式解析 + 处理一步到位）。
 * old/new/reauth 密码统一走本函数，确保与后端 VerifyPassword 期望的形态一致。
 */
export async function preparePasswordForTenant(tenantId: string, password: string) {
	const mode = await fetchPasswordTransmissionMode(tenantId);
	return processPassword(password, mode, tenantId, undefined);
}
