// Auto-generated from swagger.json annotations
// DO NOT EDIT — run `python scripts/generate_api_ts.py` to regenerate
// Generated: 2026-08-22 19:20:02

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

// ============================================================
// Query Hooks (GET endpoints)
// ============================================================

// --- audit-service ---

/** 获取告警列表 */
export function useAdminAuditAlerts(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditAlerts(params),
  });
}

/** 获取告警详情 */
export function useAdminAuditAlertsByAlerts(alertId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + alertId] as const,
    queryFn: () => api.adminAuditAlertsByAlerts(alertId),
  });
}

/** 获取审计异常列表 */
export function useAdminAuditAnomalies(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditAnomalies(params),
  });
}

/** 获取异常详情 */
export function useAdminAuditAnomaliesByAnomalies(anomalyId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + anomalyId] as const,
    queryFn: () => api.adminAuditAnomaliesByAnomalies(anomalyId),
  });
}

/** 获取关联异常 */
export function useAdminAuditAnomaliesRelatedByAnomalies(anomalyId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + anomalyId] as const,
    queryFn: () => api.adminAuditAnomaliesRelatedByAnomalies(anomalyId),
  });
}

/** 获取异常事件时间线 */
export function useAdminAuditAnomaliesTimelineByAnomalies(anomalyId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + anomalyId] as const,
    queryFn: () => api.adminAuditAnomaliesTimelineByAnomalies(anomalyId),
  });
}

/** 获取归档状态 */
export function useAdminAuditArchiveStatus() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.adminAuditArchiveStatus(),
  });
}

/** 查询计费事件审计日志 */
export function useAdminAuditBilling_events(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditBillingEvents(params),
  });
}

/** 列表查询AI决策 */
export function useAdminAuditComplianceAi_decisions() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.adminAuditComplianceAiDecisions(),
  });
}

/** 查询AI决策详情 */
export function useAdminAuditComplianceAi_decisionsByAiDecisions(aiDecisionId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + aiDecisionId] as const,
    queryFn: () => api.adminAuditComplianceAiDecisionsByAiDecisions(aiDecisionId),
  });
}

/** 列表查询违规通知 */
export function useAdminAuditComplianceBreaches() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.adminAuditComplianceBreaches(),
  });
}

/** 查询违规通知详情 */
export function useAdminAuditComplianceBreachesByBreaches(breachId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + breachId] as const,
    queryFn: () => api.adminAuditComplianceBreachesByBreaches(breachId),
  });
}

/** 列表查询清理记录 */
export function useAdminAuditComplianceCleanup_records() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.adminAuditComplianceCleanupRecords(),
  });
}

/** 查询清理记录详情 */
export function useAdminAuditComplianceCleanup_recordsByCleanupRecords(cleanupRecordId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + cleanupRecordId] as const,
    queryFn: () => api.adminAuditComplianceCleanupRecordsByCleanupRecords(cleanupRecordId),
  });
}

/** 列表查询跨境传输 */
export function useAdminAuditComplianceCross_border() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.adminAuditComplianceCrossBorder(),
  });
}

/** 查询跨境传输详情 */
export function useAdminAuditComplianceCross_borderByCrossBorder(crossBorderTransferId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + crossBorderTransferId] as const,
    queryFn: () => api.adminAuditComplianceCrossBorderByCrossBorder(crossBorderTransferId),
  });
}

/** 列表查询数据分类 */
export function useAdminAuditComplianceData_classifications() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.adminAuditComplianceDataClassifications(),
  });
}

/** 查询数据分类详情 */
export function useAdminAuditComplianceData_classificationsByDataClassifications(dataClassificationId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + dataClassificationId] as const,
    queryFn: () => api.adminAuditComplianceDataClassificationsByDataClassifications(dataClassificationId),
  });
}

/** 列表查询 PIA */
export function useAdminAuditCompliancePias() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.adminAuditCompliancePias(),
  });
}

/** 查询 PIA 详情 */
export function useAdminAuditCompliancePiasByPias(piaId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + piaId] as const,
    queryFn: () => api.adminAuditCompliancePiasByPias(piaId),
  });
}

/** 查询角色操作映射 */
export function useAdminAuditComplianceRole_actions() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.adminAuditComplianceRoleActions(),
  });
}

/** 查询SoD规则 */
export function useAdminAuditComplianceSod_rules() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.adminAuditComplianceSodRules(),
  });
}

/** 列出导出任务 */
export function useAdminAudit_exportJobs(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditExportJobs(params),
  });
}

/** 下载导出文件 */
export function useAdminAudit_exportDownloadByExport(jobId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + jobId] as const,
    queryFn: () => api.adminAuditExportDownloadByExport(jobId),
  });
}

/** 获取导出任务状态 */
export function useAdminAudit_exportStatusByExport(jobId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + jobId] as const,
    queryFn: () => api.adminAuditExportStatusByExport(jobId),
  });
}

/** 获取哈希链信息 */
export function useAdminAuditHashchainByHashchain(tenantId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminAuditHashchainByHashchain(tenantId),
  });
}

/** 按日期范围验证哈希链 */
export function useAdminAuditHashchainVerify_by_dateByHashchain(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.adminAuditHashchainVerifyByDateByHashchain(tenantId, params),
  });
}

/** 获取安全事件列表 */
export function useAdminAuditIncidents(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditIncidents(params),
  });
}

/** 获取安全事件详情 */
export function useAdminAuditIncidentsByIncidents(incidentId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + incidentId] as const,
    queryFn: () => api.adminAuditIncidentsByIncidents(incidentId),
  });
}

/** 查询审计日志 */
export function useAdminAuditLogs(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditLogs(params),
  });
}

/** 根据ID获取审计日志 */
export function useAdminAuditLogsByLogs(auditLogId: string) {
  return useQuery({
    queryKey: ['audit-service', 'by_' + auditLogId] as const,
    queryFn: () => api.adminAuditLogsByLogs(auditLogId),
  });
}

/** 获取指定审计日志条目的 Merkle Proof */
export function useAdminAuditMerkle_proof(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditMerkleProof(params),
  });
}

/** 获取租户审计日志的 Merkle Root */
export function useAdminAuditMerkle_root(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditMerkleRoot(params),
  });
}

/** 查询支付事件审计日志 */
export function useAdminAuditPayment_events(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditPaymentEvents(params),
  });
}

/** 获取合规审计报告 */
export function useAdminAuditReportsCompliance(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditReportsCompliance(params),
  });
}

/** 获取安全审计报告 */
export function useAdminAuditReportsSecurity(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditReportsSecurity(params),
  });
}

/** 获取租户审计日志保留策略 */
export function useAdminAuditRetention_policy(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditRetentionPolicy(params),
  });
}

/** 查询服务错误日志 */
export function useAdminAuditServer_logs(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditServerLogs(params),
  });
}

/** 获取已记录日志的服务列表 */
export function useAdminAuditServer_logsServices() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.adminAuditServerLogsServices(),
  });
}

/** 列出 SIEM 连接器 */
export function useAdminAuditSiemConnectors(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditSiemConnectors(params),
  });
}

/** 获取审计统计 */
export function useAdminAuditStats() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.adminAuditStats(),
  });
}

/** 实时审计事件流 */
export function useAdminAuditStream(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditStream(params),
  });
}

/** 获取租户异常检测配置 */
export function useAdminAuditTenant_config() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.adminAuditTenantConfig(),
  });
}

/** 查询最近一次自动哈希链验证结果 */
export function useAdminAuditVerifications() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.adminAuditVerifications(),
  });
}

/** 查询钱包事件审计日志 */
export function useAdminAuditWallet_events(params?: any) {
  return useQuery({
    queryKey: ['audit-service', params] as const,
    queryFn: () => api.adminAuditWalletEvents(params),
  });
}

/** 获取公开哈希链 */
export function useAudit_publicHashchain() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.auditPublicHashchain(),
  });
}

/** 获取公开日志摘要 */
export function useAudit_publicLogs_summary() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.auditPublicLogsSummary(),
  });
}

/** 获取公开审计统计 */
export function useAudit_publicStats() {
  return useQuery({
    queryKey: ['audit-service'] as const,
    queryFn: () => api.auditPublicStats(),
  });
}

// --- billing-service ---

/** 获取红字发票详情 */
export function useAdminBillingCredit_noteByCreditNote(number: string) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + number] as const,
    queryFn: () => api.adminBillingCreditNoteByCreditNote(number),
  });
}

/** 信用票据列表 */
export function useAdminBillingCredit_notes(params?: any) {
  return useQuery({
    queryKey: ['billing-service', params] as const,
    queryFn: () => api.adminBillingCreditNotes(params),
  });
}

/** 获取催缴配置 */
export function useAdminBillingDunning_settingsByDunningSettings(tenantId: string) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminBillingDunningSettingsByDunningSettings(tenantId),
  });
}

/** 获取功能开关列表 */
export function useAdminBillingFeature_gates() {
  return useQuery({
    queryKey: ['billing-service'] as const,
    queryFn: () => api.adminBillingFeatureGates(),
  });
}

/** 查询租户功能开关覆盖 */
export function useAdminBillingFeature_gatesOverrides() {
  return useQuery({
    queryKey: ['billing-service'] as const,
    queryFn: () => api.adminBillingFeatureGatesOverrides(),
  });
}

/** 验证计费事件账本完整性 */
export function useAdminBillingIntegrityByIntegrity(subscriptionId: string) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + subscriptionId] as const,
    queryFn: () => api.adminBillingIntegrityByIntegrity(subscriptionId),
  });
}

/** 计量计费记录 */
export function useAdminBillingMetered_usageByMeteredUsage(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.adminBillingMeteredUsageByMeteredUsage(tenantId, params),
  });
}

/** 支付网关列表 */
export function useAdminBillingPayment_gateways(params?: any) {
  return useQuery({
    queryKey: ['billing-service', params] as const,
    queryFn: () => api.adminBillingPaymentGateways(params),
  });
}

/** 获取支付网关详情 */
export function useAdminBillingPayment_gatewaysByPaymentGateways(gatewayId: string) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + gatewayId] as const,
    queryFn: () => api.adminBillingPaymentGatewaysByPaymentGateways(gatewayId),
  });
}

/** 获取套餐定价列表 */
export function useAdminBillingPlans() {
  return useQuery({
    queryKey: ['billing-service'] as const,
    queryFn: () => api.adminBillingPlans(),
  });
}

/** 获取退款审批状态 */
export function useAdminBillingRefund_approvalByRefundApproval(approvalId: string) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + approvalId] as const,
    queryFn: () => api.adminBillingRefundApprovalByRefundApproval(approvalId),
  });
}

/** 查询退款审批列表 */
export function useAdminBillingRefund_approvals(params?: any) {
  return useQuery({
    queryKey: ['billing-service', params] as const,
    queryFn: () => api.adminBillingRefundApprovals(params),
  });
}

/** 收入递延报表 */
export function useAdminBillingRevenue_amortization(params?: any) {
  return useQuery({
    queryKey: ['billing-service', params] as const,
    queryFn: () => api.adminBillingRevenueAmortization(params),
  });
}

/** 列出应用定价列表 */
export function useAdminBillingSubscriptionAppsBySubscription(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.adminBillingSubscriptionAppsBySubscription(tenantId, params),
  });
}

/** 获取应用定价 */
export function useAdminBillingSubscriptionAppsPricingBySubscriptionByApps(tenantId: string, appId: string) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, 'by_' + appId] as const,
    queryFn: () => api.adminBillingSubscriptionAppsPricingBySubscriptionByApps(tenantId, appId),
  });
}

/** 订阅列表 */
export function useAdminBillingSubscriptions(params?: any) {
  return useQuery({
    queryKey: ['billing-service', params] as const,
    queryFn: () => api.adminBillingSubscriptions(params),
  });
}

/** 税务导出 */
export function useAdminBillingTax_export(params?: any) {
  return useQuery({
    queryKey: ['billing-service', params] as const,
    queryFn: () => api.adminBillingTaxExport(params),
  });
}

/** 税务导出列表 */
export function useAdminBillingTax_exports(params?: any) {
  return useQuery({
    queryKey: ['billing-service', params] as const,
    queryFn: () => api.adminBillingTaxExports(params),
  });
}

/** 列出用量告警 */
export function useBillingAlerts(params?: any) {
  return useQuery({
    queryKey: ['billing-service', params] as const,
    queryFn: () => api.billingAlerts(params),
  });
}

/** 获取用量告警详情 */
export function useBillingAlertsByAlerts(alertId: string) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + alertId] as const,
    queryFn: () => api.billingAlertsByAlerts(alertId),
  });
}

/** 查询钱包余额 */
export function useBillingBalance() {
  return useQuery({
    queryKey: ['billing-service'] as const,
    queryFn: () => api.billingBalance(),
  });
}

/** 查询租户信用余额 */
export function useBillingCredit_balanceByCreditBalance(tenantId: string) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId] as const,
    queryFn: () => api.billingCreditBalanceByCreditBalance(tenantId),
  });
}

/** 查询信用交易记录 */
export function useBillingCredit_transactionsByCreditTransactions(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.billingCreditTransactionsByCreditTransactions(tenantId, params),
  });
}

/** 获取当前租户功能开关 */
export function useBillingFeature_gates() {
  return useQuery({
    queryKey: ['billing-service'] as const,
    queryFn: () => api.billingFeatureGates(),
  });
}

/** 获取发票详情 */
export function useBillingInvoiceByInvoice(invoiceNumber: string) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + invoiceNumber] as const,
    queryFn: () => api.billingInvoiceByInvoice(invoiceNumber),
  });
}

/** 导出发票 */
export function useBillingInvoice_exportByInvoice(invoiceNumber: string, params?: any) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + invoiceNumber, params] as const,
    queryFn: () => api.billingInvoiceExportByInvoice(invoiceNumber, params),
  });
}

/** 下载发票PDF */
export function useBillingInvoicePdfByInvoice(invoiceNumber: string) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + invoiceNumber] as const,
    queryFn: () => api.billingInvoicePdfByInvoice(invoiceNumber),
  });
}

/** 获取公开套餐列表 */
export function useBillingPlans() {
  return useQuery({
    queryKey: ['billing-service'] as const,
    queryFn: () => api.billingPlans(),
  });
}

/** 获取计费记录 */
export function useBillingRecordsByRecords(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.billingRecordsByRecords(tenantId, params),
  });
}

/** 按应用获取计费记录 */
export function useBillingRecordsAppsByRecordsByApps(tenantId: string, appId: string, params?: any) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, 'by_' + appId, params] as const,
    queryFn: () => api.billingRecordsAppsByRecordsByApps(tenantId, appId, params),
  });
}

/** 高级搜索计费记录 */
export function useBillingRecordsSearchByRecords(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.billingRecordsSearchByRecords(tenantId, params),
  });
}

/** 获取租户统计 */
export function useBillingStatisticsByStatistics(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.billingStatisticsByStatistics(tenantId, params),
  });
}

/** 按应用获取租户统计 */
export function useBillingStatisticsAppsByStatisticsByApps(tenantId: string, appId: string) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, 'by_' + appId] as const,
    queryFn: () => api.billingStatisticsAppsByStatisticsByApps(tenantId, appId),
  });
}

/** 获取订阅信息 */
export function useBillingSubscriptionBySubscription(tenantId: string) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId] as const,
    queryFn: () => api.billingSubscriptionBySubscription(tenantId),
  });
}

/** 获取使用统计 */
export function useBillingUsageByUsage(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.billingUsageByUsage(tenantId, params),
  });
}

/** 按应用获取使用统计 */
export function useBillingUsageAppsByUsageByApps(tenantId: string, appId: string, params?: any) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, 'by_' + appId, params] as const,
    queryFn: () => api.billingUsageAppsByUsageByApps(tenantId, appId, params),
  });
}

/** 按应用获取当前使用量 */
export function useBillingUsageAppsCurrentByUsageByApps(tenantId: string, appId: string) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, 'by_' + appId] as const,
    queryFn: () => api.billingUsageAppsCurrentByUsageByApps(tenantId, appId),
  });
}

/** 获取当前使用量 */
export function useBillingUsageCurrentByUsage(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.billingUsageCurrentByUsage(tenantId, params),
  });
}

/** 获取端点用量TopN排行 */
export function useBillingUsageEndpointsByUsage(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.billingUsageEndpointsByUsage(tenantId, params),
  });
}

/** 获取用量时间序列 */
export function useBillingUsageTimelineByUsage(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['billing-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.billingUsageTimelineByUsage(tenantId, params),
  });
}

// --- communication-service ---

/** 管理员查询任意用户的通信日志 */
export function useAdminCommunicationLogs(params?: any) {
  return useQuery({
    queryKey: ['communication-service', params] as const,
    queryFn: () => api.adminCommunicationLogs(params),
  });
}

/** 获取平台级通信仪表盘（跨租户） */
export function useAdminCommunicationPlatform_stats() {
  return useQuery({
    queryKey: ['communication-service'] as const,
    queryFn: () => api.adminCommunicationPlatformStats(),
  });
}

/** 管理员查看限流配置 */
export function useAdminCommunicationRate_limits(params?: any) {
  return useQuery({
    queryKey: ['communication-service', params] as const,
    queryFn: () => api.adminCommunicationRateLimits(params),
  });
}

/** 查询模板版本历史 */
export function useAdminCommunicationTemplatesVersionsByTemplates(templateId: string) {
  return useQuery({
    queryKey: ['communication-service', 'by_' + templateId] as const,
    queryFn: () => api.adminCommunicationTemplatesVersionsByTemplates(templateId),
  });
}

/** 获取通信投递仪表盘 */
export function useCommunicationDashboard(params?: any) {
  return useQuery({
    queryKey: ['communication-service', params] as const,
    queryFn: () => api.communicationDashboard(params),
  });
}

/** 渠道连通性检查 */
export function useCommunicationHealthByHealth(channel: string) {
  return useQuery({
    queryKey: ['communication-service', 'by_' + channel] as const,
    queryFn: () => api.communicationHealthByHealth(channel),
  });
}

/** 分页查询发送日志 */
export function useCommunicationLogs(params?: any) {
  return useQuery({
    queryKey: ['communication-service', params] as const,
    queryFn: () => api.communicationLogs(params),
  });
}

/** 查询服务商配置列表 */
export function useCommunicationProviders(params?: any) {
  return useQuery({
    queryKey: ['communication-service', params] as const,
    queryFn: () => api.communicationProviders(params),
  });
}

/** 获取服务商配置详情 */
export function useCommunicationProvidersByProviders(providerId: string) {
  return useQuery({
    queryKey: ['communication-service', 'by_' + providerId] as const,
    queryFn: () => api.communicationProvidersByProviders(providerId),
  });
}

/** 查询推送令牌列表 */
export function useCommunicationPush_tokens(params?: any) {
  return useQuery({
    queryKey: ['communication-service', params] as const,
    queryFn: () => api.communicationPushTokens(params),
  });
}

/** 查询各渠道速率限制 */
export function useCommunicationRate_limits(params?: any) {
  return useQuery({
    queryKey: ['communication-service', params] as const,
    queryFn: () => api.communicationRateLimits(params),
  });
}

/** 获取模板使用统计（近30天） */
export function useCommunicationTemplate_stats(params?: any) {
  return useQuery({
    queryKey: ['communication-service', params] as const,
    queryFn: () => api.communicationTemplateStats(params),
  });
}

/** 获取模板列表 */
export function useCommunicationTemplates(params?: any) {
  return useQuery({
    queryKey: ['communication-service', params] as const,
    queryFn: () => api.communicationTemplates(params),
  });
}

/** 获取可用模板列表（含平台默认模板） */
export function useCommunicationTemplatesAvailable(params?: any) {
  return useQuery({
    queryKey: ['communication-service', params] as const,
    queryFn: () => api.communicationTemplatesAvailable(params),
  });
}

/** 获取模板详情 */
export function useCommunicationTemplatesByTemplates(templateId: string) {
  return useQuery({
    queryKey: ['communication-service', 'by_' + templateId] as const,
    queryFn: () => api.communicationTemplatesByTemplates(templateId),
  });
}

// --- compliance-service ---

/** 查询AI决策记录列表 */
export function useAdminComplianceAi_decisions(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceAiDecisions(params),
  });
}

/** 获取AI决策详情 */
export function useAdminComplianceAi_decisionsByAiDecisions(decisionId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + decisionId] as const,
    queryFn: () => api.adminComplianceAiDecisionsByAiDecisions(decisionId),
  });
}

/** 查询审计发现问题列表 */
export function useAdminComplianceAudit_findings(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceAuditFindings(params),
  });
}

/** 获取审计发现详情 */
export function useAdminComplianceAudit_findingsByAuditFindings(auditFindingId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + auditFindingId] as const,
    queryFn: () => api.adminComplianceAuditFindingsByAuditFindings(auditFindingId),
  });
}

/** 查询数据泄露通知列表 */
export function useAdminComplianceBreach_notifications(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceBreachNotifications(params),
  });
}

/** 获取数据泄露通知详情 */
export function useAdminComplianceBreach_notificationsByBreachNotifications(breachNotificationId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + breachNotificationId] as const,
    queryFn: () => api.adminComplianceBreachNotificationsByBreachNotifications(breachNotificationId),
  });
}

/** 查询合规认证列表 */
export function useAdminComplianceCertifications(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceCertifications(params),
  });
}

/** 获取合规认证详情 */
export function useAdminComplianceCertificationsByCertifications(certificationId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + certificationId] as const,
    queryFn: () => api.adminComplianceCertificationsByCertifications(certificationId),
  });
}

/** 查询数据清理历史记录 */
export function useAdminComplianceCleanup_records(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceCleanupRecords(params),
  });
}

/** 查询跨境数据传输列表 */
export function useAdminComplianceCross_border_transfers(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceCrossBorderTransfers(params),
  });
}

/** 获取跨境数据传输详情 */
export function useAdminComplianceCross_border_transfersByCrossBorderTransfers(crossBorderTransferId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + crossBorderTransferId] as const,
    queryFn: () => api.adminComplianceCrossBorderTransfersByCrossBorderTransfers(crossBorderTransferId),
  });
}

/** 查询数据分类列表 */
export function useAdminComplianceData_classifications(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceDataClassifications(params),
  });
}

/** 获取数据分类分级详情 */
export function useAdminComplianceData_classificationsByDataClassifications(dataClassificationId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + dataClassificationId] as const,
    queryFn: () => api.adminComplianceDataClassificationsByDataClassifications(dataClassificationId),
  });
}

/** 查询等级保护控制项列表 */
export function useAdminComplianceDengbaoControls(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceDengbaoControls(params),
  });
}

/** 获取删除权请求详情 */
export function useAdminComplianceErasure_requestsByErasureRequests(erasureId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + erasureId] as const,
    queryFn: () => api.adminComplianceErasureRequestsByErasureRequests(erasureId),
  });
}

/** 查询合规证据列表 */
export function useAdminComplianceEvidence(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceEvidence(params),
  });
}

/** 获取合规证据详情 */
export function useAdminComplianceEvidenceByEvidence(evidenceId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + evidenceId] as const,
    queryFn: () => api.adminComplianceEvidenceByEvidence(evidenceId),
  });
}

/** 查询同意记录列表 */
export function useAdminComplianceGdprConsent(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceGdprConsent(params),
  });
}

/** 获取同意记录详情 */
export function useAdminComplianceGdprConsentByConsent(consentId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + consentId] as const,
    queryFn: () => api.adminComplianceGdprConsentByConsent(consentId),
  });
}

/** 查询DSAR列表 */
export function useAdminComplianceGdprDsar(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceGdprDsar(params),
  });
}

/** 获取DSAR详情 */
export function useAdminComplianceGdprDsarByDsar(dsarId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + dsarId] as const,
    queryFn: () => api.adminComplianceGdprDsarByDsar(dsarId),
  });
}

/** 查询删除权请求列表 */
export function useAdminComplianceGdprRight_to_erasure(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceGdprRightToErasure(params),
  });
}

/** 获取删除权请求详情 */
export function useAdminComplianceGdprRight_to_erasureByRightToErasure(erasureId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + erasureId] as const,
    queryFn: () => api.adminComplianceGdprRightToErasureByRightToErasure(erasureId),
  });
}

/** 查询HIPAA控制项列表 */
export function useAdminComplianceHipaaControls(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceHipaaControls(params),
  });
}

/** 查询ISO27001控制项列表 */
export function useAdminComplianceIso27001Controls(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceIso27001Controls(params),
  });
}

/** 获取ISO27001控制项详情 */
export function useAdminComplianceIso27001ControlsByControls(controlId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + controlId] as const,
    queryFn: () => api.adminComplianceIso27001ControlsByControls(controlId),
  });
}

/** 查询协议文档列表 */
export function useAdminComplianceLegal_documents(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceLegalDocuments(params),
  });
}

/** 获取协议文档详情 */
export function useAdminComplianceLegal_documentsByLegalDocuments(legalDocumentId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + legalDocumentId] as const,
    queryFn: () => api.adminComplianceLegalDocumentsByLegalDocuments(legalDocumentId),
  });
}

/** 查询PCI DSS控制项列表 */
export function useAdminCompliancePcidssControls(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminCompliancePcidssControls(params),
  });
}

/** 查询渗透测试报告列表 */
export function useAdminCompliancePenetration_test_reports(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminCompliancePenetrationTestReports(params),
  });
}

/** 查询PIPL控制项列表 */
export function useAdminCompliancePiplControls(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminCompliancePiplControls(params),
  });
}

/** 查询隐私影响评估列表 */
export function useAdminCompliancePrivacy_impact(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminCompliancePrivacyImpact(params),
  });
}

/** 获取隐私影响评估详情 */
export function useAdminCompliancePrivacy_impactByPrivacyImpact(privacyImpactId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + privacyImpactId] as const,
    queryFn: () => api.adminCompliancePrivacyImpactByPrivacyImpact(privacyImpactId),
  });
}

/** 查询PSD2控制项列表 */
export function useAdminCompliancePsd2Controls(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminCompliancePsd2Controls(params),
  });
}

/** 查询法规动态监控列表 */
export function useAdminComplianceRegulatory_watch(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceRegulatoryWatch(params),
  });
}

/** 查询保留策略列表 */
export function useAdminComplianceRetention_policies(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceRetentionPolicies(params),
  });
}

/** 查询合规评分历史 */
export function useAdminComplianceScore_history() {
  return useQuery({
    queryKey: ['compliance-service'] as const,
    queryFn: () => api.adminComplianceScoreHistory(),
  });
}

/** 执行职责分离检查 */
export function useAdminComplianceSod_checks() {
  return useQuery({
    queryKey: ['compliance-service'] as const,
    queryFn: () => api.adminComplianceSodChecks(),
  });
}

/** 查询职责分离规则列表 */
export function useAdminComplianceSod_rules(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceSodRules(params),
  });
}

/** 查询SOX ITGC控制项列表 */
export function useAdminComplianceSoxItgc(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceSoxItgc(params),
  });
}

/** 获取SOX ITGC控制项详情 */
export function useAdminComplianceSoxItgcByItgc(itgcId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + itgcId] as const,
    queryFn: () => api.adminComplianceSoxItgcByItgc(itgcId),
  });
}

/** 列出所有合规标准 */
export function useAdminComplianceStandards() {
  return useQuery({
    queryKey: ['compliance-service'] as const,
    queryFn: () => api.adminComplianceStandards(),
  });
}

/** 获取合规标准详情 */
export function useAdminComplianceStandardsByStandards(standardId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + standardId] as const,
    queryFn: () => api.adminComplianceStandardsByStandards(standardId),
  });
}

/** 列出合规标准控制项 */
export function useAdminComplianceStandardsControlsByStandards(standardId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + standardId] as const,
    queryFn: () => api.adminComplianceStandardsControlsByStandards(standardId),
  });
}

/** 查询子处理商列表 */
export function useAdminComplianceSubprocessors(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceSubprocessors(params),
  });
}

/** 获取子处理商详情 */
export function useAdminComplianceSubprocessorsBySubprocessors(subprocessorId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + subprocessorId] as const,
    queryFn: () => api.adminComplianceSubprocessorsBySubprocessors(subprocessorId),
  });
}

/** 查询合规参数覆盖列表 */
export function useAdminComplianceTenantsSelfOverrides() {
  return useQuery({
    queryKey: ['compliance-service'] as const,
    queryFn: () => api.adminComplianceTenantsSelfOverrides(),
  });
}

/** Get resolved policy for current tenant */
export function useAdminComplianceTenantsSelfPolicy() {
  return useQuery({
    queryKey: ['compliance-service'] as const,
    queryFn: () => api.adminComplianceTenantsSelfPolicy(),
  });
}

/** Get compliance score for current tenant */
export function useAdminComplianceTenantsSelfScore() {
  return useQuery({
    queryKey: ['compliance-service'] as const,
    queryFn: () => api.adminComplianceTenantsSelfScore(),
  });
}

/** 获取解析后的合规策略 */
export function useAdminComplianceTenantsPolicyByTenants(tid: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + tid] as const,
    queryFn: () => api.adminComplianceTenantsPolicyByTenants(tid),
  });
}

/** 获取合规评分 */
export function useAdminComplianceTenantsScoreByTenants(tid: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + tid] as const,
    queryFn: () => api.adminComplianceTenantsScoreByTenants(tid),
  });
}

/** 查询供应商风险评估列表 */
export function useAdminComplianceVendor_risk_assessment(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.adminComplianceVendorRiskAssessment(params),
  });
}

/** 查询我的DSAR列表 */
export function useComplianceGdprDsarMe(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.complianceGdprDsarMe(params),
  });
}

/** 获取DSAR状态 */
export function useComplianceGdprDsarStatusByDsar(dsarId: string) {
  return useQuery({
    queryKey: ['compliance-service', 'by_' + dsarId] as const,
    queryFn: () => api.complianceGdprDsarStatusByDsar(dsarId),
  });
}

/** 获取当前隐私政策 */
export function useCompliancePrivacyPolicy() {
  return useQuery({
    queryKey: ['compliance-service'] as const,
    queryFn: () => api.compliancePrivacyPolicy(),
  });
}

/** 获取隐私政策版本历史 */
export function useCompliancePrivacyPolicyVersions(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePrivacyPolicyVersions(params),
  });
}

/** 获取数据保留策略公示 */
export function useCompliancePrivacyRetention(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePrivacyRetention(params),
  });
}

/** 获取合规配置信息 */
export function useComplianceProfile() {
  return useQuery({
    queryKey: ['compliance-service'] as const,
    queryFn: () => api.complianceProfile(),
  });
}

/** 获取公开审计发现 */
export function useCompliance_publicAudit_findings(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicAuditFindings(params),
  });
}

/** 获取公开泄露通知 */
export function useCompliance_publicBreach_notifications(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicBreachNotifications(params),
  });
}

/** 获取公开合规认证列表 */
export function useCompliance_publicCertifications(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicCertifications(params),
  });
}

/** 获取公开跨境数据传输 */
export function useCompliance_publicCross_border_transfers(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicCrossBorderTransfers(params),
  });
}

/** 获取公开数据分类 */
export function useCompliance_publicData_classifications(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicDataClassifications(params),
  });
}

/** 获取公开等级保护控制项 */
export function useCompliance_publicDengbaoControls(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicDengbaoControls(params),
  });
}

/** 公开查询合规证据 */
export function useCompliance_publicEvidence(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicEvidence(params),
  });
}

/** 获取公开HIPAA控制项 */
export function useCompliance_publicHipaaControls(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicHipaaControls(params),
  });
}

/** 获取公开ISO27001控制项 */
export function useCompliance_publicIso27001Controls(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicIso27001Controls(params),
  });
}

/** 获取公开协议文档（terms/privacy） */
export function useCompliance_publicLegal_documents(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicLegalDocuments(params),
  });
}

/** 获取公开PCI DSS控制项 */
export function useCompliance_publicPcidssControls(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicPcidssControls(params),
  });
}

/** 获取公开渗透测试报告 */
export function useCompliance_publicPenetration_test_reports(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicPenetrationTestReports(params),
  });
}

/** 获取公开PIPL控制项 */
export function useCompliance_publicPiplControls(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicPiplControls(params),
  });
}

/** 获取公开隐私影响评估 */
export function useCompliance_publicPrivacy_impact(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicPrivacyImpact(params),
  });
}

/** 获取公开PSD2控制项 */
export function useCompliance_publicPsd2Controls(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicPsd2Controls(params),
  });
}

/** 获取公开监管监控 */
export function useCompliance_publicRegulatory_watch(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicRegulatoryWatch(params),
  });
}

/** 获取公开安全评分 */
export function useCompliance_publicSecurity_score() {
  return useQuery({
    queryKey: ['compliance-service'] as const,
    queryFn: () => api.compliancePublicSecurityScore(),
  });
}

/** 获取公开合规状态 */
export function useCompliance_publicStatus() {
  return useQuery({
    queryKey: ['compliance-service'] as const,
    queryFn: () => api.compliancePublicStatus(),
  });
}

/** 获取公开子处理商清单 */
export function useCompliance_publicSubprocessors(params?: any) {
  return useQuery({
    queryKey: ['compliance-service', params] as const,
    queryFn: () => api.compliancePublicSubprocessors(params),
  });
}

/** 获取合规状态概览 */
export function useComplianceStatus() {
  return useQuery({
    queryKey: ['compliance-service'] as const,
    queryFn: () => api.complianceStatus(),
  });
}

// --- gateway-service ---

/** 获取环境变量 */
export function useAdminEnv_vars() {
  return useQuery({
    queryKey: ['gateway-service'] as const,
    queryFn: () => api.adminEnvVars(),
  });
}

/** 获取功能开关矩阵 */
export function useAdminFeature_flags() {
  return useQuery({
    queryKey: ['gateway-service'] as const,
    queryFn: () => api.adminFeatureFlags(),
  });
}

/** 获取健康检查运行时信息 */
export function useAdminHealthRuntime() {
  return useQuery({
    queryKey: ['gateway-service'] as const,
    queryFn: () => api.adminHealthRuntime(),
  });
}

/** 获取基础设施凭证清单 */
export function useAdminInfra_credentials() {
  return useQuery({
    queryKey: ['gateway-service'] as const,
    queryFn: () => api.adminInfraCredentials(),
  });
}

/** 获取限流状态 */
export function useAdminRate_limits() {
  return useQuery({
    queryKey: ['gateway-service'] as const,
    queryFn: () => api.adminRateLimits(),
  });
}

/** 获取调度器状态 */
export function useAdminSchedulers() {
  return useQuery({
    queryKey: ['gateway-service'] as const,
    queryFn: () => api.adminSchedulers(),
  });
}

/** 获取系统运行时聚合信息 */
export function useAdminSystemRuntime() {
  return useQuery({
    queryKey: ['gateway-service'] as const,
    queryFn: () => api.adminSystemRuntime(),
  });
}

/** 获取服务依赖拓扑 */
export function useAdminTopology() {
  return useQuery({
    queryKey: ['gateway-service'] as const,
    queryFn: () => api.adminTopology(),
  });
}

/** 日志查询 */
export function useDeveloperLogs(params?: any) {
  return useQuery({
    queryKey: ['gateway-service', params] as const,
    queryFn: () => api.developerLogs(params),
  });
}

/** 服务状态页面 */
export function useDeveloperStatus() {
  return useQuery({
    queryKey: ['gateway-service'] as const,
    queryFn: () => api.developerStatus(),
  });
}

/** 追踪操作列表 */
export function useDeveloperTracesOperations(params?: any) {
  return useQuery({
    queryKey: ['gateway-service', params] as const,
    queryFn: () => api.developerTracesOperations(params),
  });
}

/** 追踪搜索 */
export function useDeveloperTracesSearch(params?: any) {
  return useQuery({
    queryKey: ['gateway-service', params] as const,
    queryFn: () => api.developerTracesSearch(params),
  });
}

/** 追踪服务列表 */
export function useDeveloperTracesServices() {
  return useQuery({
    queryKey: ['gateway-service'] as const,
    queryFn: () => api.developerTracesServices(),
  });
}

/** 获取单条 Trace */
export function useDeveloperTracesByTraces(traceID: string) {
  return useQuery({
    queryKey: ['gateway-service', 'by_' + traceID] as const,
    queryFn: () => api.developerTracesByTraces(traceID),
  });
}

/** 单服务 OpenAPI 规范 */
export function useDocsSpecsBySpecs(service: string) {
  return useQuery({
    queryKey: ['gateway-service', 'by_' + service] as const,
    queryFn: () => api.docsSpecsBySpecs(service),
  });
}

/** 指定服务文档页面 */
export function useDocsByDocs(service: string) {
  return useQuery({
    queryKey: ['gateway-service', 'by_' + service] as const,
    queryFn: () => api.docsByDocs(service),
  });
}

/** 获取 SDK 示例列表 */
export function useSdkExamples() {
  return useQuery({
    queryKey: ['gateway-service'] as const,
    queryFn: () => api.sdkExamples(),
  });
}

/** 获取 SDK 版本列表 */
export function useSdkVersions() {
  return useQuery({
    queryKey: ['gateway-service'] as const,
    queryFn: () => api.sdkVersions(),
  });
}

/** 获取 SDK 变更日志 */
export function useSdkChangelogBySdk(language: string) {
  return useQuery({
    queryKey: ['gateway-service', 'by_' + language] as const,
    queryFn: () => api.sdkChangelogBySdk(language),
  });
}

/** 全局搜索 */
export function useSearch(params?: any) {
  return useQuery({
    queryKey: ['gateway-service', params] as const,
    queryFn: () => api.search(params),
  });
}

// --- identity-service ---

/** 查询ABAC策略列表 */
export function useAdminAbac_policies(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.adminAbacPolicies(params),
  });
}

/** 获取ABAC策略详情 */
export function useAdminAbac_policiesByAbacPolicies(policyId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + policyId] as const,
    queryFn: () => api.adminAbacPoliciesByAbacPolicies(policyId),
  });
}

/** List Agents */
export function useAdminAgents(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.adminAgents(params),
  });
}

/** Get Agent */
export function useAdminAgentsByAgents(agentId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + agentId] as const,
    queryFn: () => api.adminAgentsByAgents(agentId),
  });
}

/** Get Agent Activity */
export function useAdminAgentsActivityByAgents(agentId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + agentId] as const,
    queryFn: () => api.adminAgentsActivityByAgents(agentId),
  });
}

/** List Agent Credentials */
export function useAdminAgentsCredentialsByAgents(agentId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + agentId] as const,
    queryFn: () => api.adminAgentsCredentialsByAgents(agentId),
  });
}

/** Get Agent Credential */
export function useAdminAgentsCredentialsByAgentsByCredentials(agentId: string, credId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + agentId, 'by_' + credId] as const,
    queryFn: () => api.adminAgentsCredentialsByAgentsByCredentials(agentId, credId),
  });
}

/** Get Agent Permissions */
export function useAdminAgentsPermissionsByAgents(agentId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + agentId] as const,
    queryFn: () => api.adminAgentsPermissionsByAgents(agentId),
  });
}

/** 管理员查询 API Key 列表 */
export function useAdminAuthApi_keys(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.adminAuthApiKeys(params),
  });
}

/** 安全异常检测 */
export function useAdminAuthApi_keysAnomalies() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.adminAuthApiKeysAnomalies(),
  });
}

/** 获取即将过期的 API Key */
export function useAdminAuthApi_keysExpiring(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.adminAuthApiKeysExpiring(params),
  });
}

/** 管理员 API Key 统计 */
export function useAdminAuthApi_keysStats() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.adminAuthApiKeysStats(),
  });
}

/** 儿童同意记录列表 */
export function useAdminConsents(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.adminConsents(params),
  });
}

/** 列出身份提供商 */
export function useAdminIdentity_providers(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.adminIdentityProviders(params),
  });
}

/** 获取身份提供商详情 */
export function useAdminIdentity_providersByIdentityProviders(providerId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + providerId] as const,
    queryFn: () => api.adminIdentityProvidersByIdentityProviders(providerId),
  });
}

/** 获取属性映射 */
export function useAdminIdentity_providersAttribute_mappingByIdentityProviders(providerId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + providerId] as const,
    queryFn: () => api.adminIdentityProvidersAttributeMappingByIdentityProviders(providerId),
  });
}

/** 列出证书 */
export function useAdminIdentity_providersCertificatesByIdentityProviders(providerId: string, params?: any) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + providerId, params] as const,
    queryFn: () => api.adminIdentityProvidersCertificatesByIdentityProviders(providerId, params),
  });
}

/** 获取JIT配置 */
export function useAdminIdentity_providersJit_configByIdentityProviders(providerId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + providerId] as const,
    queryFn: () => api.adminIdentityProvidersJitConfigByIdentityProviders(providerId),
  });
}

/** 获取提供商统计 */
export function useAdminIdentity_providersStatsByIdentityProviders(providerId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + providerId] as const,
    queryFn: () => api.adminIdentityProvidersStatsByIdentityProviders(providerId),
  });
}

/** 获取提供商关联用户 */
export function useAdminIdentity_providersUsersByIdentityProviders(providerId: string, params?: any) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + providerId, params] as const,
    queryFn: () => api.adminIdentityProvidersUsersByIdentityProviders(providerId, params),
  });
}

/** List Devices */
export function useAdminIots(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.adminIots(params),
  });
}

/** Get Device */
export function useAdminIotsByIots(iotId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + iotId] as const,
    queryFn: () => api.adminIotsByIots(iotId),
  });
}

/** LDAP directory health check */
export function useAdminLdapHealth() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.adminLdapHealth(),
  });
}

/** Get LDAP group-role mapping */
export function useAdminLdapGroup_role_mappingByLdap(name: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + name] as const,
    queryFn: () => api.adminLdapGroupRoleMappingByLdap(name),
  });
}

/** 列出双人复核记录 */
export function useAdminMaker_checker(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.adminMakerChecker(params),
  });
}

/** 获取NHI策略 */
export function useAdminPoliciesNhi() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.adminPoliciesNhi(),
  });
}

/** List Robots */
export function useAdminRobots(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.adminRobots(params),
  });
}

/** Get Robot */
export function useAdminRobotsByRobots(robotId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + robotId] as const,
    queryFn: () => api.adminRobotsByRobots(robotId),
  });
}

/** 查询角色激活记录 */
export function useAdminRole_activations(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.adminRoleActivations(params),
  });
}

/** 获取认证配置 */
export function useAdminSecurityAuth_config() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.adminSecurityAuthConfig(),
  });
}

/** 获取密码策略 */
export function useAdminSecurityPassword_policy() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.adminSecurityPasswordPolicy(),
  });
}

/** 获取密码统计 */
export function useAdminSecurityPassword_stats() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.adminSecurityPasswordStats(),
  });
}

/** 获取风险配置 */
export function useAdminSecurityRisk_config() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.adminSecurityRiskConfig(),
  });
}

/** 风险仪表盘 */
export function useAdminSecurityRisk_dashboard() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.adminSecurityRiskDashboard(),
  });
}

/** 风险事件列表 */
export function useAdminSecurityRisk_events(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.adminSecurityRiskEvents(params),
  });
}

/** 风险事件聚合 */
export function useAdminSecurityRisk_eventsAggregation(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.adminSecurityRiskEventsAggregation(params),
  });
}

/** 查询用户列表 */
export function useAdminUsers(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.adminUsers(params),
  });
}

/** 获取用户详情 */
export function useAdminUsersByUsers(userId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + userId] as const,
    queryFn: () => api.adminUsersByUsers(userId),
  });
}

/** 管理员查询用户设备列表 */
export function useAdminUsersDevicesByUsers(userId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + userId] as const,
    queryFn: () => api.adminUsersDevicesByUsers(userId),
  });
}

/** 获取用户身份列表 */
export function useAdminUsersIdentitiesByUsers(userId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + userId] as const,
    queryFn: () => api.adminUsersIdentitiesByUsers(userId),
  });
}

/** 获取登录历史 */
export function useAdminUsersLogin_historiesByUsers(userId: string, params?: any) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + userId, params] as const,
    queryFn: () => api.adminUsersLoginHistoriesByUsers(userId, params),
  });
}

/** 管理员查看用户OAuth连接 */
export function useAdminUsersOauth_connectionsByUsers(userId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + userId] as const,
    queryFn: () => api.adminUsersOauthConnectionsByUsers(userId),
  });
}

/** 管理员查询用户Passkey凭证 */
export function useAdminUsersPasskeysByUsers(userId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + userId] as const,
    queryFn: () => api.adminUsersPasskeysByUsers(userId),
  });
}

/** 获取用户密码状态 */
export function useAdminUsersPassword_statusByUsers(userId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + userId] as const,
    queryFn: () => api.adminUsersPasswordStatusByUsers(userId),
  });
}

/** 获取安全状态 */
export function useAdminUsersSecurity_statusByUsers(userId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + userId] as const,
    queryFn: () => api.adminUsersSecurityStatusByUsers(userId),
  });
}

/** 查询 API Key 列表 */
export function useAuthApi_keys(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.authApiKeys(params),
  });
}

/** 获取 API Key 详情 */
export function useAuthApi_keysByApiKeys(apiKeyId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + apiKeyId] as const,
    queryFn: () => api.authApiKeysByApiKeys(apiKeyId),
  });
}

/** 获取 API Key 审计日志 */
export function useAuthApi_keysAudit_logsByApiKeys(apiKeyId: string, params?: any) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + apiKeyId, params] as const,
    queryFn: () => api.authApiKeysAuditLogsByApiKeys(apiKeyId, params),
  });
}

/** 获取 API Key 使用统计 */
export function useAuthApi_keysUsageByApiKeys(apiKeyId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + apiKeyId] as const,
    queryFn: () => api.authApiKeysUsageByApiKeys(apiKeyId),
  });
}

/** 获取 API Key 使用统计 */
export function useAuthApi_keysUsage_statsByApiKeys(apiKeyId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + apiKeyId] as const,
    queryFn: () => api.authApiKeysUsageStatsByApiKeys(apiKeyId),
  });
}

/** 获取CAPTCHA挑战 */
export function useAuthCaptchaChallenge(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.authCaptchaChallenge(params),
  });
}

/** 魔法链接回调 (GET→POST 双步跳转) */
export function useAuthMagic_linkCallback(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.authMagicLinkCallback(params),
  });
}

/** 验证魔法链接 */
export function useAuthMagic_linkConfirm(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.authMagicLinkConfirm(params),
  });
}

/** 获取当前登录用户信息 */
export function useAuthMe() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMe(),
  });
}

/** 获取我的审计日志 */
export function useAuthMeAudit_logs(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.authMeAuditLogs(params),
  });
}

export function useAuthMeAuthenticatorBackup() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMeAuthenticatorBackup(),
  });
}

export function useAuthMeAuthenticatorDevices() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMeAuthenticatorDevices(),
  });
}

/** 获取儿童隐私同意状态 */
export function useAuthMeChildren_consent() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMeChildrenConsent(),
  });
}

/** 获取同意历史记录 */
export function useAuthMeConsent_history() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMeConsentHistory(),
  });
}

/** 获取我的设备列表 */
export function useAuthMeDevices() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMeDevices(),
  });
}

/** 检查邮箱验证状态 */
export function useAuthMeEmail_verification_status() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMeEmailVerificationStatus(),
  });
}

/** 获取我的租户成员状态 */
export function useAuthMeMemberships() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMeMemberships(),
  });
}

/** 获取当前用户权限 */
export function useAuthMePermissions() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMePermissions(),
  });
}

/** 检查手机号验证状态 */
export function useAuthMePhone_verification_status() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMePhoneVerificationStatus(),
  });
}

/** 获取恢复联系人列表 */
export function useAuthMeRecovery_contacts() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMeRecoveryContacts(),
  });
}

/** 查询我的角色激活 */
export function useAuthMeRole_activations() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMeRoleActivations(),
  });
}

/** 获取SAML关联账户列表 */
export function useAuthMeSaml_links() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMeSamlLinks(),
  });
}

/** 获取安全事件列表 */
export function useAuthMeSecurity_events(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.authMeSecurityEvents(params),
  });
}

/** 获取我的会话列表 */
export function useAuthMeSessions(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.authMeSessions(params),
  });
}

/** 获取当前用户租户 */
export function useAuthMeTenants() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMeTenants(),
  });
}

/** 查询验证跟踪状态 */
export function useAuthMeVerificationByVerification(trackingId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + trackingId] as const,
    queryFn: () => api.authMeVerificationByVerification(trackingId),
  });
}

/** 获取已注册的Passkey列表 */
export function useAuthMeWebauthn_credentials() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authMeWebauthnCredentials(),
  });
}

/** 获取用户OAuth账号列表 */
export function useAuthOauthAccounts() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authOauthAccounts(),
  });
}

/** 获取OAuth提供商列表 */
export function useAuthOauthProviders() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authOauthProviders(),
  });
}

/** 获取OAuth提供者健康状态 */
export function useAuthOauthProvidersHealth() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authOauthProvidersHealth(),
  });
}

/** 获取OAuth绑定统计 */
export function useAuthOauthStats() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authOauthStats(),
  });
}

/** 发起OAuth登录 */
export function useAuthOauthByOauth(provider: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + provider] as const,
    queryFn: () => api.authOauthByOauth(provider),
  });
}

/** OAuth回调 */
export function useAuthOauthCallbackByOauth(provider: string, params?: any) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + provider, params] as const,
    queryFn: () => api.authOauthCallbackByOauth(provider, params),
  });
}

/** OIDC会话状态iframe */
export function useAuthOidcSession_iframe() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.authOidcSessionIframe(),
  });
}

/** 查询二维码登录状态 */
export function useAuthQr_loginStatus(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.authQrLoginStatus(params),
  });
}

/** 检查邮箱是否可用 */
export function useAuthRegisterCheck_email(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.authRegisterCheckEmail(params),
  });
}

/** 检查用户名是否可用 */
export function useAuthRegisterCheck_username(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.authRegisterCheckUsername(params),
  });
}

/** 获取用户设备列表 */
export function useDevices() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.devices(),
  });
}

/** List User Devices */
export function useIots(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.iots(params),
  });
}

/** List Family Members */
export function useIotsFamily_accessByIots(iotId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + iotId] as const,
    queryFn: () => api.iotsFamilyAccessByIots(iotId),
  });
}

/** 根据域名获取租户认证配置（公开） */
export function use_publicAuth_configBy_domainByByDomain(domain: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + domain] as const,
    queryFn: () => api.PublicAuthConfigByDomainByByDomain(domain),
  });
}

/** 根据租户标识获取认证配置（公开） */
export function use_publicAuth_configBy_slugByBySlug(slug: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + slug] as const,
    queryFn: () => api.PublicAuthConfigBySlugByBySlug(slug),
  });
}

/** 获取租户认证配置（公开） */
export function use_publicAuth_configByAuthConfig(tenantId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + tenantId] as const,
    queryFn: () => api.PublicAuthConfigByAuthConfig(tenantId),
  });
}

/** ECDH 密钥交换 */
export function use_publicKey_exchange() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.PublicKeyExchange(),
  });
}

/** 发现公开可加入的租户 */
export function use_publicTenantsDiscover() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.PublicTenantsDiscover(),
  });
}

/** 列出SCIM组 */
export function useScimGroups(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.scimGroups(params),
  });
}

/** 获取SCIM组 */
export function useScimGroupsByGroups(groupId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + groupId] as const,
    queryFn: () => api.scimGroupsByGroups(groupId),
  });
}

/** SCIM资源类型 */
export function useScimResourceTypes() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.scimResourcetypes(),
  });
}

/** SCIM Schemas */
export function useScimSchemas() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.scimSchemas(),
  });
}

/** SCIM服务提供商配置 */
export function useScimServiceProviderConfig() {
  return useQuery({
    queryKey: ['identity-service'] as const,
    queryFn: () => api.scimServiceproviderconfig(),
  });
}

/** 列出SCIM用户 */
export function useScimUsers(params?: any) {
  return useQuery({
    queryKey: ['identity-service', params] as const,
    queryFn: () => api.scimUsers(params),
  });
}

/** 获取SCIM用户 */
export function useScimUsersByUsers(userId: string) {
  return useQuery({
    queryKey: ['identity-service', 'by_' + userId] as const,
    queryFn: () => api.scimUsersByUsers(userId),
  });
}

// --- mfa-service ---

/** 管理端列出所有备用码配置 */
export function useAdminMfaBackup_codes() {
  return useQuery({
    queryKey: ['mfa-service'] as const,
    queryFn: () => api.adminMfaBackupCodes(),
  });
}

/** 管理端获取用户备用码数量 */
export function useAdminMfaBackup_codesByBackupCodes(userId: string) {
  return useQuery({
    queryKey: ['mfa-service', 'by_' + userId] as const,
    queryFn: () => api.adminMfaBackupCodesByBackupCodes(userId),
  });
}

/** 获取MFA配置审计日志 */
export function useAdminMfaConfig_audit_logs(params?: any) {
  return useQuery({
    queryKey: ['mfa-service', params] as const,
    queryFn: () => api.adminMfaConfigAuditLogs(params),
  });
}

/** 列出IP白名单 */
export function useAdminMfaIp_whitelist() {
  return useQuery({
    queryKey: ['mfa-service'] as const,
    queryFn: () => api.adminMfaIpWhitelist(),
  });
}

/** 获取IP白名单 */
export function useAdminMfaIp_whitelistByIpWhitelist(ipWhitelistId: string) {
  return useQuery({
    queryKey: ['mfa-service', 'by_' + ipWhitelistId] as const,
    queryFn: () => api.adminMfaIpWhitelistByIpWhitelist(ipWhitelistId),
  });
}

/** 管理端查看推送挑战列表 */
export function useAdminMfaPushChallenges(params?: any) {
  return useQuery({
    queryKey: ['mfa-service', params] as const,
    queryFn: () => api.adminMfaPushChallenges(params),
  });
}

/** 获取Push MFA挑战统计 */
export function useAdminMfaPushStats() {
  return useQuery({
    queryKey: ['mfa-service'] as const,
    queryFn: () => api.adminMfaPushStats(),
  });
}

/** 列出所有风险策略 */
export function useAdminMfaRisk_policies() {
  return useQuery({
    queryKey: ['mfa-service'] as const,
    queryFn: () => api.adminMfaRiskPolicies(),
  });
}

/** 获取MFA风险策略 */
export function useAdminMfaRisk_policy() {
  return useQuery({
    queryKey: ['mfa-service'] as const,
    queryFn: () => api.adminMfaRiskPolicy(),
  });
}

/** 管理端获取用户TOTP状态 */
export function useAdminMfaTotpByTotp(userId: string) {
  return useQuery({
    queryKey: ['mfa-service', 'by_' + userId] as const,
    queryFn: () => api.adminMfaTotpByTotp(userId),
  });
}

/** 查看备用码 */
export function useMfaBackup_codes() {
  return useQuery({
    queryKey: ['mfa-service'] as const,
    queryFn: () => api.mfaBackupCodes(),
  });
}

/** 查看备用码数量 */
export function useMfaBackup_codesCount() {
  return useQuery({
    queryKey: ['mfa-service'] as const,
    queryFn: () => api.mfaBackupCodesCount(),
  });
}

/** 列出同步设备 */
export function useMfaDevicesSync() {
  return useQuery({
    queryKey: ['mfa-service'] as const,
    queryFn: () => api.mfaDevicesSync(),
  });
}

/** 列出MFA方法 */
export function useMfaMethods(params?: any) {
  return useQuery({
    queryKey: ['mfa-service', params] as const,
    queryFn: () => api.mfaMethods(params),
  });
}

/** 获取Push挑战状态 */
export function useMfaPushChallengeByChallenge(credentialId: string) {
  return useQuery({
    queryKey: ['mfa-service', 'by_' + credentialId] as const,
    queryFn: () => api.mfaPushChallengeByChallenge(credentialId),
  });
}

/** 获取Push MFA挑战历史 */
export function useMfaPushHistory(params?: any) {
  return useQuery({
    queryKey: ['mfa-service', params] as const,
    queryFn: () => api.mfaPushHistory(params),
  });
}

/** 获取用户MFA状态 */
export function useMfaStatusByStatus(userId: string) {
  return useQuery({
    queryKey: ['mfa-service', 'by_' + userId] as const,
    queryFn: () => api.mfaStatusByStatus(userId),
  });
}

/** 列出TOTP设备 */
export function useMfaTotpDevices(params?: any) {
  return useQuery({
    queryKey: ['mfa-service', params] as const,
    queryFn: () => api.mfaTotpDevices(params),
  });
}

/** 获取TOTP设备详情 */
export function useMfaTotpDevicesByDevices(deviceId: string) {
  return useQuery({
    queryKey: ['mfa-service', 'by_' + deviceId] as const,
    queryFn: () => api.mfaTotpDevicesByDevices(deviceId),
  });
}

/** 列出受信设备 */
export function useMfaTrusted_devices() {
  return useQuery({
    queryKey: ['mfa-service'] as const,
    queryFn: () => api.mfaTrustedDevices(),
  });
}

/** 检查设备是否受信 */
export function useMfaTrusted_devicesCheck(params?: any) {
  return useQuery({
    queryKey: ['mfa-service', params] as const,
    queryFn: () => api.mfaTrustedDevicesCheck(params),
  });
}

/** 获取受信设备详情 */
export function useMfaTrusted_devicesByTrustedDevices(trustedDeviceId: string) {
  return useQuery({
    queryKey: ['mfa-service', 'by_' + trustedDeviceId] as const,
    queryFn: () => api.mfaTrustedDevicesByTrustedDevices(trustedDeviceId),
  });
}

/** 列出WebAuthn凭证 */
export function useMfaWebauthnCredentials(params?: any) {
  return useQuery({
    queryKey: ['mfa-service', params] as const,
    queryFn: () => api.mfaWebauthnCredentials(params),
  });
}

/** 获取WebAuthn凭证详情 */
export function useMfaWebauthnCredentialsByCredentials(webauthnCredentialId: string) {
  return useQuery({
    queryKey: ['mfa-service', 'by_' + webauthnCredentialId] as const,
    queryFn: () => api.mfaWebauthnCredentialsByCredentials(webauthnCredentialId),
  });
}

// --- notification-service ---

/** 管理员查看指定用户通知列表 */
export function useAdminNotifications(params?: any) {
  return useQuery({
    queryKey: ['notification-service', params] as const,
    queryFn: () => api.adminNotifications(params),
  });
}

/** 获取平台级通知统计 */
export function useAdminNotificationsPlatform_stats() {
  return useQuery({
    queryKey: ['notification-service'] as const,
    queryFn: () => api.adminNotificationsPlatformStats(),
  });
}

/** 列出公告 */
export function useAnnouncements(params?: any) {
  return useQuery({
    queryKey: ['notification-service', params] as const,
    queryFn: () => api.announcements(params),
  });
}

/** 获取公告详情 */
export function useAnnouncementsByAnnouncements(announcementId: string) {
  return useQuery({
    queryKey: ['notification-service', 'by_' + announcementId] as const,
    queryFn: () => api.announcementsByAnnouncements(announcementId),
  });
}

/** 获取公告统计 */
export function useAnnouncementsStatsByAnnouncements(announcementId: string) {
  return useQuery({
    queryKey: ['notification-service', 'by_' + announcementId] as const,
    queryFn: () => api.announcementsStatsByAnnouncements(announcementId),
  });
}

/** 获取通知列表 */
export function useNotifications(params?: any) {
  return useQuery({
    queryKey: ['notification-service', params] as const,
    queryFn: () => api.notifications(params),
  });
}

/** 列出事件映射 */
export function useNotificationsEvent_mappings() {
  return useQuery({
    queryKey: ['notification-service'] as const,
    queryFn: () => api.notificationsEventMappings(),
  });
}

/** 获取事件映射 */
export function useNotificationsEvent_mappingsByEventMappings(announcementId: string) {
  return useQuery({
    queryKey: ['notification-service', 'by_' + announcementId] as const,
    queryFn: () => api.notificationsEventMappingsByEventMappings(announcementId),
  });
}

/** 列出全局变量 */
export function useNotificationsGlobal_variables() {
  return useQuery({
    queryKey: ['notification-service'] as const,
    queryFn: () => api.notificationsGlobalVariables(),
  });
}

/** 获取全局变量 */
export function useNotificationsGlobal_variablesByGlobalVariables(announcementId: string) {
  return useQuery({
    queryKey: ['notification-service', 'by_' + announcementId] as const,
    queryFn: () => api.notificationsGlobalVariablesByGlobalVariables(announcementId),
  });
}

/** 获取通知偏好设置 */
export function useNotificationsPreferencesByPreferences(userId: string) {
  return useQuery({
    queryKey: ['notification-service', 'by_' + userId] as const,
    queryFn: () => api.notificationsPreferencesByPreferences(userId),
  });
}

/** 确认安全公告订阅 */
export function useNotifications_publicSecurity_confirm(params?: any) {
  return useQuery({
    queryKey: ['notification-service', params] as const,
    queryFn: () => api.notificationsPublicSecurityConfirm(params),
  });
}

/** 获取通知已读/未读报告 */
export function useNotificationsRead_report() {
  return useQuery({
    queryKey: ['notification-service'] as const,
    queryFn: () => api.notificationsReadReport(),
  });
}

/** 获取通知统计 */
export function useNotificationsStats() {
  return useQuery({
    queryKey: ['notification-service'] as const,
    queryFn: () => api.notificationsStats(),
  });
}

/** SSE实时通知流 */
export function useNotificationsStream(params?: any) {
  return useQuery({
    queryKey: ['notification-service', params] as const,
    queryFn: () => api.notificationsStream(params),
  });
}

/** 列出通知模板 */
export function useNotificationsTemplates(params?: any) {
  return useQuery({
    queryKey: ['notification-service', params] as const,
    queryFn: () => api.notificationsTemplates(params),
  });
}

/** 列出可用模板 */
export function useNotificationsTemplatesAvailable() {
  return useQuery({
    queryKey: ['notification-service'] as const,
    queryFn: () => api.notificationsTemplatesAvailable(),
  });
}

/** 获取通知模板 */
export function useNotificationsTemplatesByTemplates(announcementId: string) {
  return useQuery({
    queryKey: ['notification-service', 'by_' + announcementId] as const,
    queryFn: () => api.notificationsTemplatesByTemplates(announcementId),
  });
}

/** 获取通知趋势 */
export function useNotificationsTrend(params?: any) {
  return useQuery({
    queryKey: ['notification-service', params] as const,
    queryFn: () => api.notificationsTrend(params),
  });
}

/** 获取未读通知列表 */
export function useNotificationsUnread() {
  return useQuery({
    queryKey: ['notification-service'] as const,
    queryFn: () => api.notificationsUnread(),
  });
}

/** 获取未读通知数量 */
export function useNotificationsUnread_count() {
  return useQuery({
    queryKey: ['notification-service'] as const,
    queryFn: () => api.notificationsUnreadCount(),
  });
}

/** 获取通知详情 */
export function useNotificationsByNotifications(notificationId: string) {
  return useQuery({
    queryKey: ['notification-service', 'by_' + notificationId] as const,
    queryFn: () => api.notificationsByNotifications(notificationId),
  });
}

/** 列出推送订阅 */
export function usePushSubscriptions() {
  return useQuery({
    queryKey: ['notification-service'] as const,
    queryFn: () => api.pushSubscriptions(),
  });
}

/** 获取推送订阅详情 */
export function usePushSubscriptionsBySubscriptions(subscriptionId: string) {
  return useQuery({
    queryKey: ['notification-service', 'by_' + subscriptionId] as const,
    queryFn: () => api.pushSubscriptionsBySubscriptions(subscriptionId),
  });
}

/** 获取 VAPID 公钥 */
export function usePushVapid_public_key() {
  return useQuery({
    queryKey: ['notification-service'] as const,
    queryFn: () => api.pushVapidPublicKey(),
  });
}

// --- oauth-service ---

/** 列出 OAuth 客户端 */
export function useAdminOauthClients(params?: any) {
  return useQuery({
    queryKey: ['oauth-service', params] as const,
    queryFn: () => api.adminOauthClients(params),
  });
}

/** 按 Application 查询 OAuth 客户端 */
export function useAdminOauthClientsBy_applicationByByApplication(appId: string) {
  return useQuery({
    queryKey: ['oauth-service', 'by_' + appId] as const,
    queryFn: () => api.adminOauthClientsByApplicationByByApplication(appId),
  });
}

/** Portal 访问统计 */
export function useAdminOauthClientsPortal_stats() {
  return useQuery({
    queryKey: ['oauth-service'] as const,
    queryFn: () => api.adminOauthClientsPortalStats(),
  });
}

/** 获取 OAuth 客户端详情 */
export function useAdminOauthClientsByClients(clientId: string) {
  return useQuery({
    queryKey: ['oauth-service', 'by_' + clientId] as const,
    queryFn: () => api.adminOauthClientsByClients(clientId),
  });
}

/** 获取 OAuth 客户端审计日志 */
export function useAdminOauthClientsAudit_logsByClients(clientId: string, params?: any) {
  return useQuery({
    queryKey: ['oauth-service', 'by_' + clientId, params] as const,
    queryFn: () => api.adminOauthClientsAuditLogsByClients(clientId, params),
  });
}

/** 列出 OAuth 客户端所有密钥 */
export function useAdminOauthClientsSecretsByClients(clientId: string) {
  return useQuery({
    queryKey: ['oauth-service', 'by_' + clientId] as const,
    queryFn: () => api.adminOauthClientsSecretsByClients(clientId),
  });
}

/** 获取 OAuth 客户端统计数据 */
export function useAdminOauthClientsStatsByClients(clientId: string) {
  return useQuery({
    queryKey: ['oauth-service', 'by_' + clientId] as const,
    queryFn: () => api.adminOauthClientsStatsByClients(clientId),
  });
}

/** 列出 OAuth 客户端活跃令牌 */
export function useAdminOauthClientsTokensByClients(clientId: string, params?: any) {
  return useQuery({
    queryKey: ['oauth-service', 'by_' + clientId, params] as const,
    queryFn: () => api.adminOauthClientsTokensByClients(clientId, params),
  });
}

/** 列出设备授权会话 */
export function useAdminOauthDevices(params?: any) {
  return useQuery({
    queryKey: ['oauth-service', params] as const,
    queryFn: () => api.adminOauthDevices(params),
  });
}

/** 列出OAuth提供商 */
export function useAdminOauthProviders() {
  return useQuery({
    queryKey: ['oauth-service'] as const,
    queryFn: () => api.adminOauthProviders(),
  });
}

/** OAuth 2.0 授权端点 */
export function useOauthAuthorize(params?: any) {
  return useQuery({
    queryKey: ['oauth-service', params] as const,
    queryFn: () => api.oauthAuthorize(params),
  });
}

/** 获取客户端公开信息 */
export function useOauthClientByClient(clientId: string) {
  return useQuery({
    queryKey: ['oauth-service', 'by_' + clientId] as const,
    queryFn: () => api.oauthClientByClient(clientId),
  });
}

/** 获取 OAuth 连接列表 */
export function useOauthConnectionsByConnections(userId: string) {
  return useQuery({
    queryKey: ['oauth-service', 'by_' + userId] as const,
    queryFn: () => api.oauthConnectionsByConnections(userId),
  });
}

/** 检查用户授权状态 */
export function useOauthConsentCheck(params?: any) {
  return useQuery({
    queryKey: ['oauth-service', params] as const,
    queryFn: () => api.oauthConsentCheck(params),
  });
}

/** 获取授权同意列表 */
export function useOauthConsents() {
  return useQuery({
    queryKey: ['oauth-service'] as const,
    queryFn: () => api.oauthConsents(),
  });
}

/** 获取 DPoP Nonce */
export function useOauthDpopNonce() {
  return useQuery({
    queryKey: ['oauth-service'] as const,
    queryFn: () => api.oauthDpopNonce(),
  });
}

/** RP-Initiated Logout */
export function useOauthLogout(params?: any) {
  return useQuery({
    queryKey: ['oauth-service', params] as const,
    queryFn: () => api.oauthLogout(params),
  });
}

/** 获取 OAuth 提供商列表 */
export function useOauthProviders() {
  return useQuery({
    queryKey: ['oauth-service'] as const,
    queryFn: () => api.oauthProviders(),
  });
}

/** 读取客户端注册 */
export function useOauthRegisterByRegister(clientId: string) {
  return useQuery({
    queryKey: ['oauth-service', 'by_' + clientId] as const,
    queryFn: () => api.oauthRegisterByRegister(clientId),
  });
}

/** 获取OAuth客户端风险评估 */
export function useOauthRisk_assessment(params?: any) {
  return useQuery({
    queryKey: ['oauth-service', params] as const,
    queryFn: () => api.oauthRiskAssessment(params),
  });
}

/** 获取用户信息 */
export function useOauthUserinfo() {
  return useQuery({
    queryKey: ['oauth-service'] as const,
    queryFn: () => api.oauthUserinfo(),
  });
}

/** 获取 OAuth 授权 URL */
export function useOauthAuthorizeByOauth(provider: string, params?: any) {
  return useQuery({
    queryKey: ['oauth-service', 'by_' + provider, params] as const,
    queryFn: () => api.oauthAuthorizeByOauth(provider, params),
  });
}

/** OAuth 授权回调 */
export function useOauthCallbackByOauth(provider: string, params?: any) {
  return useQuery({
    queryKey: ['oauth-service', 'by_' + provider, params] as const,
    queryFn: () => api.oauthCallbackByOauth(provider, params),
  });
}

// --- pay-service ---

/** 验证支付事件账本完整性 */
export function useAdminPayIntegrityByIntegrity(payId: string) {
  return useQuery({
    queryKey: ['pay-service', 'by_' + payId] as const,
    queryFn: () => api.adminPayIntegrityByIntegrity(payId),
  });
}

/** 查询支付渠道列表 */
export function useAdminPaymentsChannels() {
  return useQuery({
    queryKey: ['pay-service'] as const,
    queryFn: () => api.adminPaymentsChannels(),
  });
}

/** 查询支付渠道详情 */
export function useAdminPaymentsChannelsByChannels(channelId: string) {
  return useQuery({
    queryKey: ['pay-service', 'by_' + channelId] as const,
    queryFn: () => api.adminPaymentsChannelsByChannels(channelId),
  });
}

/** 查询对账历史 */
export function useAdminPaymentsReconciliationHistory(params?: any) {
  return useQuery({
    queryKey: ['pay-service', params] as const,
    queryFn: () => api.adminPaymentsReconciliationHistory(params),
  });
}

/** 查询Webhook记录 */
export function useAdminPaymentsWebhooks(params?: any) {
  return useQuery({
    queryKey: ['pay-service', params] as const,
    queryFn: () => api.adminPaymentsWebhooks(params),
  });
}

/** 查询支付列表 */
export function usePayments(params?: any) {
  return useQuery({
    queryKey: ['pay-service', params] as const,
    queryFn: () => api.payments(params),
  });
}

/** 支付网关返回回调 */
export function usePaymentsReturnByReturn(channel: string, params?: any) {
  return useQuery({
    queryKey: ['pay-service', 'by_' + channel, params] as const,
    queryFn: () => api.paymentsReturnByReturn(channel, params),
  });
}

/** 查询支付详情 */
export function usePaymentsByPayments(paymentId: string) {
  return useQuery({
    queryKey: ['pay-service', 'by_' + paymentId] as const,
    queryFn: () => api.paymentsByPayments(paymentId),
  });
}

/** 获取支付回执 */
export function usePaymentsReceiptByPayments(paymentId: string) {
  return useQuery({
    queryKey: ['pay-service', 'by_' + paymentId] as const,
    queryFn: () => api.paymentsReceiptByPayments(paymentId),
  });
}

/** 查询退款详情 */
export function usePaymentsRefundByPayments(paymentId: string) {
  return useQuery({
    queryKey: ['pay-service', 'by_' + paymentId] as const,
    queryFn: () => api.paymentsRefundByPayments(paymentId),
  });
}

/** 查询支付退款列表 */
export function usePaymentsRefundsByPayments(paymentId: string) {
  return useQuery({
    queryKey: ['pay-service', 'by_' + paymentId] as const,
    queryFn: () => api.paymentsRefundsByPayments(paymentId),
  });
}

/** 查询退款详情 */
export function useRefundsByRefunds(refundId: string) {
  return useQuery({
    queryKey: ['pay-service', 'by_' + refundId] as const,
    queryFn: () => api.refundsByRefunds(refundId),
  });
}

// --- point-service ---

/** 获取积分规则列表 */
export function useAdminPoint_rules(params?: any) {
  return useQuery({
    queryKey: ['point-service', params] as const,
    queryFn: () => api.adminPointRules(params),
  });
}

/** 获取单个积分规则详情 */
export function useAdminPoint_rulesByPointRules(ruleId: string) {
  return useQuery({
    queryKey: ['point-service', 'by_' + ruleId] as const,
    queryFn: () => api.adminPointRulesByPointRules(ruleId),
  });
}

/** 验证积分账户事件链完整性 */
export function useAdminPointIntegrityByIntegrity(accountId: string) {
  return useQuery({
    queryKey: ['point-service', 'by_' + accountId] as const,
    queryFn: () => api.adminPointIntegrityByIntegrity(accountId),
  });
}

/** 查询积分账户列表 */
export function useAdminPoints(params?: any) {
  return useQuery({
    queryKey: ['point-service', params] as const,
    queryFn: () => api.adminPoints(params),
  });
}

/** 获取租户积分配置 */
export function useAdminPointsConfig() {
  return useQuery({
    queryKey: ['point-service'] as const,
    queryFn: () => api.adminPointsConfig(),
  });
}

/** 管理员租户级积分统计 */
export function useAdminPointsStats() {
  return useQuery({
    queryKey: ['point-service'] as const,
    queryFn: () => api.adminPointsStats(),
  });
}

/** 管理员查询交易记录 */
export function useAdminPointsTransactions(params?: any) {
  return useQuery({
    queryKey: ['point-service', params] as const,
    queryFn: () => api.adminPointsTransactions(params),
  });
}

/** 获取积分账户详情 */
export function usePointsByPoints(userId: string) {
  return useQuery({
    queryKey: ['point-service', 'by_' + userId] as const,
    queryFn: () => api.pointsByPoints(userId),
  });
}

/** 查询即将过期积分 */
export function usePointsExpiringByPoints(userId: string, params?: any) {
  return useQuery({
    queryKey: ['point-service', 'by_' + userId, params] as const,
    queryFn: () => api.pointsExpiringByPoints(userId, params),
  });
}

/** 积分账户风险评分 */
export function usePointsRisk_scoreByPoints(userId: string) {
  return useQuery({
    queryKey: ['point-service', 'by_' + userId] as const,
    queryFn: () => api.pointsRiskScoreByPoints(userId),
  });
}

/** 积分统计 */
export function usePointsStatsByPoints(userId: string) {
  return useQuery({
    queryKey: ['point-service', 'by_' + userId] as const,
    queryFn: () => api.pointsStatsByPoints(userId),
  });
}

/** 查询交易记录 */
export function usePointsTransactionsByPoints(userId: string, params?: any) {
  return useQuery({
    queryKey: ['point-service', 'by_' + userId, params] as const,
    queryFn: () => api.pointsTransactionsByPoints(userId, params),
  });
}

/** 获取单笔交易详情 */
export function usePointsTransactionsByPointsByTransactions(userId: string, txId: string) {
  return useQuery({
    queryKey: ['point-service', 'by_' + userId, 'by_' + txId] as const,
    queryFn: () => api.pointsTransactionsByPointsByTransactions(userId, txId),
  });
}

/** 积分现金价值 */
export function usePointsValueByPoints(userId: string) {
  return useQuery({
    queryKey: ['point-service', 'by_' + userId] as const,
    queryFn: () => api.pointsValueByPoints(userId),
  });
}

// --- profile-service ---

/** 搜索用户资料 */
export function useAdminProfiles(params?: any) {
  return useQuery({
    queryKey: ['profile-service', params] as const,
    queryFn: () => api.adminProfiles(params),
  });
}

/** 查询待审批列表 */
export function useAdminProfilesApproval_requests() {
  return useQuery({
    queryKey: ['profile-service'] as const,
    queryFn: () => api.adminProfilesApprovalRequests(),
  });
}

/** 列出字段模板 */
export function useAdminProfilesField_schemas() {
  return useQuery({
    queryKey: ['profile-service'] as const,
    queryFn: () => api.adminProfilesFieldSchemas(),
  });
}

/** 获取租户资料策略 */
export function useAdminProfilesPolicy() {
  return useQuery({
    queryKey: ['profile-service'] as const,
    queryFn: () => api.adminProfilesPolicy(),
  });
}

/** 获取资料统计 */
export function useAdminProfilesStats() {
  return useQuery({
    queryKey: ['profile-service'] as const,
    queryFn: () => api.adminProfilesStats(),
  });
}

/** 获取 Webhook 配置 */
export function useAdminProfilesWebhook() {
  return useQuery({
    queryKey: ['profile-service'] as const,
    queryFn: () => api.adminProfilesWebhook(),
  });
}

/** 导出用户资料 */
export function useAdminProfiles_exportByProfiles(userId: string, params?: any) {
  return useQuery({
    queryKey: ['profile-service', 'by_' + userId, params] as const,
    queryFn: () => api.adminProfilesExportByProfiles(userId, params),
  });
}

/** 获取资料版本历史 */
export function useAdminProfilesVersionsByProfiles(userId: string) {
  return useQuery({
    queryKey: ['profile-service', 'by_' + userId] as const,
    queryFn: () => api.adminProfilesVersionsByProfiles(userId),
  });
}

/** 快捷获取当前用户头像 */
export function useProfileAvatar() {
  return useQuery({
    queryKey: ['profile-service'] as const,
    queryFn: () => api.profileAvatar(),
  });
}

/** 用户资料列表 */
export function useProfiles(params?: any) {
  return useQuery({
    queryKey: ['profile-service', params] as const,
    queryFn: () => api.profiles(params),
  });
}

/** 获取用户资料 */
export function useProfilesByProfiles(userId: string) {
  return useQuery({
    queryKey: ['profile-service', 'by_' + userId] as const,
    queryFn: () => api.profilesByProfiles(userId),
  });
}

/** 获取资料完成度 */
export function useProfilesCompletenessByProfiles(userId: string) {
  return useQuery({
    queryKey: ['profile-service', 'by_' + userId] as const,
    queryFn: () => api.profilesCompletenessByProfiles(userId),
  });
}

/** 查询用户同意记录 */
export function useProfilesConsentsByProfiles(userId: string) {
  return useQuery({
    queryKey: ['profile-service', 'by_' + userId] as const,
    queryFn: () => api.profilesConsentsByProfiles(userId),
  });
}

/** 自助导出用户资料 */
export function useProfiles_exportByProfiles(userId: string, params?: any) {
  return useQuery({
    queryKey: ['profile-service', 'by_' + userId, params] as const,
    queryFn: () => api.profilesExportByProfiles(userId, params),
  });
}

/** 获取自定义字段 */
export function useProfilesFieldsByProfiles(userId: string) {
  return useQuery({
    queryKey: ['profile-service', 'by_' + userId] as const,
    queryFn: () => api.profilesFieldsByProfiles(userId),
  });
}

/** 获取用户偏好设置 */
export function useProfilesPreferencesByProfiles(userId: string) {
  return useQuery({
    queryKey: ['profile-service', 'by_' + userId] as const,
    queryFn: () => api.profilesPreferencesByProfiles(userId),
  });
}

/** 获取隐私设置 */
export function useProfilesPrivacyByProfiles(userId: string) {
  return useQuery({
    queryKey: ['profile-service', 'by_' + userId] as const,
    queryFn: () => api.profilesPrivacyByProfiles(userId),
  });
}

/** 获取隐私影响评估 */
export function useProfilesPrivacy_impactByProfiles(userId: string) {
  return useQuery({
    queryKey: ['profile-service', 'by_' + userId] as const,
    queryFn: () => api.profilesPrivacyImpactByProfiles(userId),
  });
}

/** 获取公开资料 */
export function useProfiles_publicByProfiles(userId: string) {
  return useQuery({
    queryKey: ['profile-service', 'by_' + userId] as const,
    queryFn: () => api.profilesPublicByProfiles(userId),
  });
}

// --- rbac-service ---

/** 列出审批请求 */
export function useAdminApproval_requests(params?: any) {
  return useQuery({
    queryKey: ['rbac-service', params] as const,
    queryFn: () => api.adminApprovalRequests(params),
  });
}

/** 查询权限列表 */
export function useAdminPermissions(params?: any) {
  return useQuery({
    queryKey: ['rbac-service', params] as const,
    queryFn: () => api.adminPermissions(params),
  });
}

/** 获取权限详情 */
export function useAdminPermissionsByPermissions(permissionId: string) {
  return useQuery({
    queryKey: ['rbac-service', 'by_' + permissionId] as const,
    queryFn: () => api.adminPermissionsByPermissions(permissionId),
  });
}

/** 获取权限的角色列表 */
export function useAdminPermissionsRolesByPermissions(permissionId: string) {
  return useQuery({
    queryKey: ['rbac-service', 'by_' + permissionId] as const,
    queryFn: () => api.adminPermissionsRolesByPermissions(permissionId),
  });
}

/** 获取权限的用户列表 */
export function useAdminPermissionsUsersByPermissions(permissionId: string) {
  return useQuery({
    queryKey: ['rbac-service', 'by_' + permissionId] as const,
    queryFn: () => api.adminPermissionsUsersByPermissions(permissionId),
  });
}

/** 查询角色列表 */
export function useAdminRoles(params?: any) {
  return useQuery({
    queryKey: ['rbac-service', params] as const,
    queryFn: () => api.adminRoles(params),
  });
}

/** 列出职责分离冲突对 */
export function useAdminRolesConflict_pairs() {
  return useQuery({
    queryKey: ['rbac-service'] as const,
    queryFn: () => api.adminRolesConflictPairs(),
  });
}

/** 列出默认角色 */
export function useAdminRolesDefaults() {
  return useQuery({
    queryKey: ['rbac-service'] as const,
    queryFn: () => api.adminRolesDefaults(),
  });
}

/** 获取角色详情 */
export function useAdminRolesByRoles(roleId: string) {
  return useQuery({
    queryKey: ['rbac-service', 'by_' + roleId] as const,
    queryFn: () => api.adminRolesByRoles(roleId),
  });
}

/** 获取子角色列表 */
export function useAdminRolesChildrenByRoles(roleId: string) {
  return useQuery({
    queryKey: ['rbac-service', 'by_' + roleId] as const,
    queryFn: () => api.adminRolesChildrenByRoles(roleId),
  });
}

/** 获取角色有效权限 */
export function useAdminRolesEffective_permissionsByRoles(roleId: string) {
  return useQuery({
    queryKey: ['rbac-service', 'by_' + roleId] as const,
    queryFn: () => api.adminRolesEffectivePermissionsByRoles(roleId),
  });
}

/** 获取祖先角色链 */
export function useAdminRolesParentsByRoles(roleId: string) {
  return useQuery({
    queryKey: ['rbac-service', 'by_' + roleId] as const,
    queryFn: () => api.adminRolesParentsByRoles(roleId),
  });
}

/** 获取角色直接分配的权限 */
export function useAdminRolesPermissionsByRoles(roleId: string) {
  return useQuery({
    queryKey: ['rbac-service', 'by_' + roleId] as const,
    queryFn: () => api.adminRolesPermissionsByRoles(roleId),
  });
}

/** 获取角色的用户列表 */
export function useAdminRolesUsersByRoles(roleId: string) {
  return useQuery({
    queryKey: ['rbac-service', 'by_' + roleId] as const,
    queryFn: () => api.adminRolesUsersByRoles(roleId),
  });
}

/** 获取用户有效权限列表 */
export function useAdminUsersPermissionsByUsers(userId: string) {
  return useQuery({
    queryKey: ['rbac-service', 'by_' + userId] as const,
    queryFn: () => api.adminUsersPermissionsByUsers(userId),
  });
}

/** 获取用户角色列表 */
export function useAdminUsersRolesByUsers(userId: string) {
  return useQuery({
    queryKey: ['rbac-service', 'by_' + userId] as const,
    queryFn: () => api.adminUsersRolesByUsers(userId),
  });
}

// --- saml-service ---

/** 列出SAML IdP */
export function useAdminSamlProviders(params?: any) {
  return useQuery({
    queryKey: ['saml-service', params] as const,
    queryFn: () => api.adminSamlProviders(params),
  });
}

/** 获取SAML IdP详情 */
export function useAdminSamlProvidersByProviders(providerId: string) {
  return useQuery({
    queryKey: ['saml-service', 'by_' + providerId] as const,
    queryFn: () => api.adminSamlProvidersByProviders(providerId),
  });
}

/** 查询SAML会话列表（管理端） */
export function useAdminSamlSessions(params?: any) {
  return useQuery({
    queryKey: ['saml-service', params] as const,
    queryFn: () => api.adminSamlSessions(params),
  });
}

/** 查询用户SAML绑定列表（管理端） */
export function useAdminSamlUser_links(params?: any) {
  return useQuery({
    queryKey: ['saml-service', params] as const,
    queryFn: () => api.adminSamlUserLinks(params),
  });
}

/** SP-initiated SSO */
export function useSamlLoginBySaml(providerId: string) {
  return useQuery({
    queryKey: ['saml-service', 'by_' + providerId] as const,
    queryFn: () => api.samlLoginBySaml(providerId),
  });
}

/** 获取SP元数据 */
export function useSamlMetadataBySaml(providerId: string) {
  return useQuery({
    queryKey: ['saml-service', 'by_' + providerId] as const,
    queryFn: () => api.samlMetadataBySaml(providerId),
  });
}

/** 单点登出 */
export function useSamlSloBySaml(providerId: string) {
  return useQuery({
    queryKey: ['saml-service', 'by_' + providerId] as const,
    queryFn: () => api.samlSloBySaml(providerId),
  });
}

/** SP发起的SAML单点登出 */
export function useSamlSloSpBySaml(providerId: string, params?: any) {
  return useQuery({
    queryKey: ['saml-service', 'by_' + providerId, params] as const,
    queryFn: () => api.samlSloSpBySaml(providerId, params),
  });
}

// --- secret-service ---

/** 列出密钥 */
export function useAdminSecrets(params?: any) {
  return useQuery({
    queryKey: ['secret-service', params] as const,
    queryFn: () => api.adminSecrets(params),
  });
}

/** 获取密钥详情 */
export function useAdminSecretsDetail(params?: any) {
  return useQuery({
    queryKey: ['secret-service', params] as const,
    queryFn: () => api.adminSecretsDetail(params),
  });
}

/** 获取加密密钥列表 */
export function useAdminSecretsEncryption_keys() {
  return useQuery({
    queryKey: ['secret-service'] as const,
    queryFn: () => api.adminSecretsEncryptionKeys(),
  });
}

/** 列出 JWT 密钥 */
export function useAdminSecretsJwtKeys() {
  return useQuery({
    queryKey: ['secret-service'] as const,
    queryFn: () => api.adminSecretsJwtKeys(),
  });
}

/** 获取密钥策略 */
export function useAdminSecretsPolicy() {
  return useQuery({
    queryKey: ['secret-service'] as const,
    queryFn: () => api.adminSecretsPolicy(),
  });
}

/** 列出密钥版本 */
export function useAdminSecretsVersions(params?: any) {
  return useQuery({
    queryKey: ['secret-service', params] as const,
    queryFn: () => api.adminSecretsVersions(params),
  });
}

/** 获取 JWT 验证公钥 */
export function useSecret_publicJwtPublic_key() {
  return useQuery({
    queryKey: ['secret-service'] as const,
    queryFn: () => api.secretPublicJwtPublicKey(),
  });
}

/** 获取密码传输公钥 */
export function useSecret_publicTransmissionPublic_key() {
  return useQuery({
    queryKey: ['secret-service'] as const,
    queryFn: () => api.secretPublicTransmissionPublicKey(),
  });
}

// --- session-service ---

/** 获取设备风险评分 */
export function useAdminDevicesRiskByDevices(deviceId: string) {
  return useQuery({
    queryKey: ['session-service', 'by_' + deviceId] as const,
    queryFn: () => api.adminDevicesRiskByDevices(deviceId),
  });
}

/** 管理员查询会话列表 */
export function useAdminSessions(params?: any) {
  return useQuery({
    queryKey: ['session-service', params] as const,
    queryFn: () => api.adminSessions(params),
  });
}

/** 获取活跃会话数量 */
export function useAdminSessionsActive_count() {
  return useQuery({
    queryKey: ['session-service'] as const,
    queryFn: () => api.adminSessionsActiveCount(),
  });
}

/** 获取会话设备指纹 */
export function useAdminSessionsDevice_fingerprint(params?: any) {
  return useQuery({
    queryKey: ['session-service', params] as const,
    queryFn: () => api.adminSessionsDeviceFingerprint(params),
  });
}

/** 获取会话风险评分 */
export function useAdminSessionsRisk_score(params?: any) {
  return useQuery({
    queryKey: ['session-service', params] as const,
    queryFn: () => api.adminSessionsRiskScore(params),
  });
}

/** 获取会话统计 */
export function useAdminSessionsStats() {
  return useQuery({
    queryKey: ['session-service'] as const,
    queryFn: () => api.adminSessionsStats(),
  });
}

/** 查询令牌列表 */
export function useAdminTokens(params?: any) {
  return useQuery({
    queryKey: ['session-service', params] as const,
    queryFn: () => api.adminTokens(params),
  });
}

/** 查询黑名单令牌列表 */
export function useAdminTokensBlacklist(params?: any) {
  return useQuery({
    queryKey: ['session-service', params] as const,
    queryFn: () => api.adminTokensBlacklist(params),
  });
}

/** 获取租户级JWT配置 */
export function useAdminTokensConfig() {
  return useQuery({
    queryKey: ['session-service'] as const,
    queryFn: () => api.adminTokensConfig(),
  });
}

/** 获取令牌详情 */
export function useAdminTokensByTokens(deviceId: string) {
  return useQuery({
    queryKey: ['session-service', 'by_' + deviceId] as const,
    queryFn: () => api.adminTokensByTokens(deviceId),
  });
}

/** Admin list trusted devices */
export function useAdminTrusted_devices(params?: any) {
  return useQuery({
    queryKey: ['session-service', params] as const,
    queryFn: () => api.adminTrustedDevices(params),
  });
}

/** 查询用户会话列表 */
export function useSessions(params?: any) {
  return useQuery({
    queryKey: ['session-service', params] as const,
    queryFn: () => api.sessions(params),
  });
}

/** 查询用户会话列表 */
export function useSessionsUserSessionsByUser(userId: string, params?: any) {
  return useQuery({
    queryKey: ['session-service', 'by_' + userId, params] as const,
    queryFn: () => api.sessionsUserSessionsByUser(userId, params),
  });
}

/** 获取会话详情 */
export function useSessionsBySessions(sessionId: string) {
  return useQuery({
    queryKey: ['session-service', 'by_' + sessionId] as const,
    queryFn: () => api.sessionsBySessions(sessionId),
  });
}

/** 检查令牌黑名单状态 */
export function useTokensBlacklistCheck(params?: any) {
  return useQuery({
    queryKey: ['session-service', params] as const,
    queryFn: () => api.tokensBlacklistCheck(params),
  });
}

/** List my trusted devices */
export function useTrusted_devices() {
  return useQuery({
    queryKey: ['session-service'] as const,
    queryFn: () => api.trustedDevices(),
  });
}

// --- status-service ---

/** SVG服务状态徽章 */
export function useStatusBadgeByBadge(service: string) {
  return useQuery({
    queryKey: ['status-service', 'by_' + service] as const,
    queryFn: () => api.statusBadgeByBadge(service),
  });
}

/** 查询事件列表 */
export function useStatusIncidents(params?: any) {
  return useQuery({
    queryKey: ['status-service', params] as const,
    queryFn: () => api.statusIncidents(params),
  });
}

/** 查询事件详情 */
export function useStatusIncidentsByIncidents(incidentId: string) {
  return useQuery({
    queryKey: ['status-service', 'by_' + incidentId] as const,
    queryFn: () => api.statusIncidentsByIncidents(incidentId),
  });
}

/** 机器可读系统状态 */
export function useStatusJson() {
  return useQuery({
    queryKey: ['status-service'] as const,
    queryFn: () => api.statusJson(),
  });
}

/** 查询计划维护列表 */
export function useStatusMaintenances(params?: any) {
  return useQuery({
    queryKey: ['status-service', params] as const,
    queryFn: () => api.statusMaintenances(params),
  });
}

/** 查询维护详情 */
export function useStatusMaintenancesByMaintenances(maintenanceId: string) {
  return useQuery({
    queryKey: ['status-service', 'by_' + maintenanceId] as const,
    queryFn: () => api.statusMaintenancesByMaintenances(maintenanceId),
  });
}

/** 查询服务延迟趋势 */
export function useStatusMetricsLatency(params?: any) {
  return useQuery({
    queryKey: ['status-service', params] as const,
    queryFn: () => api.statusMetricsLatency(params),
  });
}

/** 查询服务可用率趋势 */
export function useStatusMetricsUptime(params?: any) {
  return useQuery({
    queryKey: ['status-service', params] as const,
    queryFn: () => api.statusMetricsUptime(params),
  });
}

/** 系统状态概览 */
export function useStatusOverview() {
  return useQuery({
    queryKey: ['status-service'] as const,
    queryFn: () => api.statusOverview(),
  });
}

/** RSS事件与维护订阅源 */
export function useStatusRss() {
  return useQuery({
    queryKey: ['status-service'] as const,
    queryFn: () => api.statusRss(),
  });
}

/** 获取服务目录 */
export function useStatusServices() {
  return useQuery({
    queryKey: ['status-service'] as const,
    queryFn: () => api.statusServices(),
  });
}

/** 查询订阅者列表 */
export function useStatusSubscriptions(params?: any) {
  return useQuery({
    queryKey: ['status-service', params] as const,
    queryFn: () => api.statusSubscriptions(params),
  });
}

/** 查询订阅通知偏好 */
export function useStatusSubscriptionsPreferences(params?: any) {
  return useQuery({
    queryKey: ['status-service', params] as const,
    queryFn: () => api.statusSubscriptionsPreferences(params),
  });
}

// --- storage-service ---

/** 管理员获取存储桶列表 */
export function useAdminStorageBuckets(params?: any) {
  return useQuery({
    queryKey: ['storage-service', params] as const,
    queryFn: () => api.adminStorageBuckets(params),
  });
}

/** 管理员获取存储桶详情 */
export function useAdminStorageBucketsByBuckets(name: string) {
  return useQuery({
    queryKey: ['storage-service', 'by_' + name] as const,
    queryFn: () => api.adminStorageBucketsByBuckets(name),
  });
}

/** 管理员获取数据保留策略 */
export function useAdminStorageData_retention_policy() {
  return useQuery({
    queryKey: ['storage-service'] as const,
    queryFn: () => api.adminStorageDataRetentionPolicy(),
  });
}

/** 管理员查询存储加密状态 */
export function useAdminStorageEncryption_status() {
  return useQuery({
    queryKey: ['storage-service'] as const,
    queryFn: () => api.adminStorageEncryptionStatus(),
  });
}

/** 管理员获取存储配额 */
export function useAdminStorageQuota() {
  return useQuery({
    queryKey: ['storage-service'] as const,
    queryFn: () => api.adminStorageQuota(),
  });
}

/** 管理员存储统计 */
export function useAdminStorageStats() {
  return useQuery({
    queryKey: ['storage-service'] as const,
    queryFn: () => api.adminStorageStats(),
  });
}

/** 获取文件列表 */
export function useFiles(params?: any) {
  return useQuery({
    queryKey: ['storage-service', params] as const,
    queryFn: () => api.files(params),
  });
}

/** 通过分享链接下载 */
export function useFilesSharedByShared(token: string) {
  return useQuery({
    queryKey: ['storage-service', 'by_' + token] as const,
    queryFn: () => api.filesSharedByShared(token),
  });
}

/** 下载文件 */
export function useFilesDownloadByFiles(fileId: string) {
  return useQuery({
    queryKey: ['storage-service', 'by_' + fileId] as const,
    queryFn: () => api.filesDownloadByFiles(fileId),
  });
}

/** 获取文件元数据 */
export function useFilesMetadataByFiles(fileId: string) {
  return useQuery({
    queryKey: ['storage-service', 'by_' + fileId] as const,
    queryFn: () => api.filesMetadataByFiles(fileId),
  });
}

/** 生成预签名URL */
export function useFilesPresigned_urlByFiles(fileId: string, params?: any) {
  return useQuery({
    queryKey: ['storage-service', 'by_' + fileId, params] as const,
    queryFn: () => api.filesPresignedUrlByFiles(fileId, params),
  });
}

/** 文件预览 */
export function useFilesPreviewByFiles(fileId: string, params?: any) {
  return useQuery({
    queryKey: ['storage-service', 'by_' + fileId, params] as const,
    queryFn: () => api.filesPreviewByFiles(fileId, params),
  });
}

/** 查看分享详情 */
export function useFilesShareByFiles(fileId: string) {
  return useQuery({
    queryKey: ['storage-service', 'by_' + fileId] as const,
    queryFn: () => api.filesShareByFiles(fileId),
  });
}

/** 生成缩略图 */
export function useFilesThumbnailByFiles(fileId: string, params?: any) {
  return useQuery({
    queryKey: ['storage-service', 'by_' + fileId, params] as const,
    queryFn: () => api.filesThumbnailByFiles(fileId, params),
  });
}

/** 获取文件版本列表 */
export function useFilesVersionsByFiles(fileId: string) {
  return useQuery({
    queryKey: ['storage-service', 'by_' + fileId] as const,
    queryFn: () => api.filesVersionsByFiles(fileId),
  });
}

/** 获取文件夹内容 */
export function useFoldersContentsByFolders(folderId: string) {
  return useQuery({
    queryKey: ['storage-service', 'by_' + folderId] as const,
    queryFn: () => api.foldersContentsByFolders(folderId),
  });
}

/** 列出分享 */
export function useShares(params?: any) {
  return useQuery({
    queryKey: ['storage-service', params] as const,
    queryFn: () => api.shares(params),
  });
}

/** 获取文件夹内容 */
export function useStorageFoldersByFolders(folderId: string) {
  return useQuery({
    queryKey: ['storage-service', 'by_' + folderId] as const,
    queryFn: () => api.storageFoldersByFolders(folderId),
  });
}

/** 公开：获取存储加密状态 */
export function useStorage_publicEncryption_status() {
  return useQuery({
    queryKey: ['storage-service'] as const,
    queryFn: () => api.storagePublicEncryptionStatus(),
  });
}

/** 公开：获取合规报告列表 */
export function useStorage_publicReports(params?: any) {
  return useQuery({
    queryKey: ['storage-service', params] as const,
    queryFn: () => api.storagePublicReports(params),
  });
}

/** 公开：下载合规报告 */
export function useStorage_publicReportsDownloadByReports(reportId: string) {
  return useQuery({
    queryKey: ['storage-service', 'by_' + reportId] as const,
    queryFn: () => api.storagePublicReportsDownloadByReports(reportId),
  });
}

/** 获取存储配额 */
export function useStorageQuota() {
  return useQuery({
    queryKey: ['storage-service'] as const,
    queryFn: () => api.storageQuota(),
  });
}

/** 获取回收站列表 */
export function useStorageTrash(params?: any) {
  return useQuery({
    queryKey: ['storage-service', params] as const,
    queryFn: () => api.storageTrash(params),
  });
}

/** 存储使用趋势 */
export function useStorageTrends(params?: any) {
  return useQuery({
    queryKey: ['storage-service', params] as const,
    queryFn: () => api.storageTrends(params),
  });
}

// --- tenant-service ---

/** 查询租户列表 */
export function useAdminTenants(params?: any) {
  return useQuery({
    queryKey: ['tenant-service', params] as const,
    queryFn: () => api.adminTenants(params),
  });
}

/** 获取全部租户统计 */
export function useAdminTenantsStats() {
  return useQuery({
    queryKey: ['tenant-service'] as const,
    queryFn: () => api.adminTenantsStats(),
  });
}

/** 获取租户详情 */
export function useAdminTenantsByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsByTenants(tenantId),
  });
}

/** 列出租户 API Keys */
export function useAdminTenantsApi_keysByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsApiKeysByTenants(tenantId),
  });
}

/** 列出应用类型 */
export function useAdminTenantsApp_typesByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsAppTypesByTenants(tenantId),
  });
}

/** 列出应用 */
export function useAdminTenantsApplicationsByTenants(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.adminTenantsApplicationsByTenants(tenantId, params),
  });
}

/** 获取应用详情 */
export function useAdminTenantsApplicationsByTenantsByApplications(tenantId: string, appId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId, 'by_' + appId] as const,
    queryFn: () => api.adminTenantsApplicationsByTenantsByApplications(tenantId, appId),
  });
}

/** 列出应用成员 */
export function useAdminTenantsApplicationsMembersByTenantsByApplications(tenantId: string, appId: string, params?: any) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId, 'by_' + appId, params] as const,
    queryFn: () => api.adminTenantsApplicationsMembersByTenantsByApplications(tenantId, appId, params),
  });
}

/** 列出应用默认角色 */
export function useAdminTenantsApplicationsRolesByTenantsByApplications(tenantId: string, appId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId, 'by_' + appId] as const,
    queryFn: () => api.adminTenantsApplicationsRolesByTenantsByApplications(tenantId, appId),
  });
}

/** 获取应用默认角色 */
export function useAdminTenantsApplicationsRolesByTenantsByApplicationsByRoles(tenantId: string, appId: string, roleId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId, 'by_' + appId, 'by_' + roleId] as const,
    queryFn: () => api.adminTenantsApplicationsRolesByTenantsByApplicationsByRoles(tenantId, appId, roleId),
  });
}

/** 获取认证策略 */
export function useAdminTenantsAuth_policyByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsAuthPolicyByTenants(tenantId),
  });
}

/** 获取品牌配置 */
export function useAdminTenantsBrandingByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsBrandingByTenants(tenantId),
  });
}

/** 查询租户数据分类分级 */
export function useAdminTenantsData_classificationByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsDataClassificationByTenants(tenantId),
  });
}

/** 获取部门列表 */
export function useAdminTenantsDepartmentsByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsDepartmentsByTenants(tenantId),
  });
}

/** 获取域名列表 */
export function useAdminTenantsDomainsByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsDomainsByTenants(tenantId),
  });
}

/** 获取邀请配置 */
export function useAdminTenantsInvitation_configByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsInvitationConfigByTenants(tenantId),
  });
}

/** 获取邀请列表 */
export function useAdminTenantsInvitationsByTenants(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.adminTenantsInvitationsByTenants(tenantId, params),
  });
}

/** 获取成员列表 */
export function useAdminTenantsMembersByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsMembersByTenants(tenantId),
  });
}

/** 列出待审批成员 */
export function useAdminTenantsMembersPendingByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsMembersPendingByTenants(tenantId),
  });
}

/** 获取未成年人保护配置 */
export function useAdminTenantsMinors_protectionByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsMinorsProtectionByTenants(tenantId),
  });
}

/** 获取组织架构图 */
export function useAdminTenantsOrg_chartByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsOrgChartByTenants(tenantId),
  });
}

/** 获取资源配额 */
export function useAdminTenantsQuotaByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsQuotaByTenants(tenantId),
  });
}

/** 获取安全策略 */
export function useAdminTenantsSecurity_policyByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsSecurityPolicyByTenants(tenantId),
  });
}

/** 获取租户统计概览 */
export function useAdminTenantsStatisticsByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsStatisticsByTenants(tenantId),
  });
}

/** 列出 Webhook */
export function useAdminTenantsWebhooksByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminTenantsWebhooksByTenants(tenantId),
  });
}

/** 获取 Webhook 详情 */
export function useAdminTenantsWebhooksByTenantsByWebhooks(tenantId: string, hookId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId, 'by_' + hookId] as const,
    queryFn: () => api.adminTenantsWebhooksByTenantsByWebhooks(tenantId, hookId),
  });
}

/** 列出 Webhook 投递记录 */
export function useAdminTenantsWebhooksDeliveriesByTenantsByWebhooks(tenantId: string, hookId: string, params?: any) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId, 'by_' + hookId, params] as const,
    queryFn: () => api.adminTenantsWebhooksDeliveriesByTenantsByWebhooks(tenantId, hookId, params),
  });
}

/** 获取投递详情 */
export function useAdminTenantsWebhooksDeliveriesByTenantsByWebhooksByDeliveries(tenantId: string, hookId: string, deliveryId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId, 'by_' + hookId, 'by_' + deliveryId] as const,
    queryFn: () => api.adminTenantsWebhooksDeliveriesByTenantsByWebhooksByDeliveries(tenantId, hookId, deliveryId),
  });
}

/** 获取 Webhook 投递统计 */
export function useAdminTenantsWebhooksStatsByTenantsByWebhooks(tenantId: string, hookId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + tenantId, 'by_' + hookId] as const,
    queryFn: () => api.adminTenantsWebhooksStatsByTenantsByWebhooks(tenantId, hookId),
  });
}

/** 列出可用事件类型 */
export function useAdminWebhooksEvent_types() {
  return useQuery({
    queryKey: ['tenant-service'] as const,
    queryFn: () => api.adminWebhooksEventTypes(),
  });
}

/** 获取事件 Schema */
export function useAdminWebhooksEvent_typesSchemaByEventTypes(event: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + event] as const,
    queryFn: () => api.adminWebhooksEventTypesSchemaByEventTypes(event),
  });
}

/** 公开租户列表 */
export function useTenant_publicTenants() {
  return useQuery({
    queryKey: ['tenant-service'] as const,
    queryFn: () => api.tenantPublicTenants(),
  });
}

/** 公开租户详情 */
export function useTenant_publicTenantsByTenants(slug: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + slug] as const,
    queryFn: () => api.tenantPublicTenantsByTenants(slug),
  });
}

/** 获取用户可访问的应用列表 */
export function useUsersApplicationsByUsers(userId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + userId] as const,
    queryFn: () => api.usersApplicationsByUsers(userId),
  });
}

/** 获取用户所属租户列表 */
export function useUsersTenantsByUsers(userId: string) {
  return useQuery({
    queryKey: ['tenant-service', 'by_' + userId] as const,
    queryFn: () => api.usersTenantsByUsers(userId),
  });
}

// --- verification-service ---

/** 查询认证列表 */
export function useAdminVerifications(params?: any) {
  return useQuery({
    queryKey: ['verification-service', params] as const,
    queryFn: () => api.adminVerifications(params),
  });
}

/** 导出认证记录 */
export function useAdminVerifications_export(params?: any) {
  return useQuery({
    queryKey: ['verification-service', params] as const,
    queryFn: () => api.adminVerificationsExport(params),
  });
}

/** 管理员查询监护关系 */
export function useAdminVerificationsGuardians(params?: any) {
  return useQuery({
    queryKey: ['verification-service', params] as const,
    queryFn: () => api.adminVerificationsGuardians(params),
  });
}

/** 列出提供方配置 */
export function useAdminVerificationsProviders(params?: any) {
  return useQuery({
    queryKey: ['verification-service', params] as const,
    queryFn: () => api.adminVerificationsProviders(params),
  });
}

/** 获取提供方配置详情 */
export function useAdminVerificationsProvidersByProviders(providerConfigId: string) {
  return useQuery({
    queryKey: ['verification-service', 'by_' + providerConfigId] as const,
    queryFn: () => api.adminVerificationsProvidersByProviders(providerConfigId),
  });
}

/** 获取认证统计 */
export function useAdminVerificationsStats() {
  return useQuery({
    queryKey: ['verification-service'] as const,
    queryFn: () => api.adminVerificationsStats(),
  });
}

/** 获取认证详情 */
export function useAdminVerificationsByVerifications(verificationId: string) {
  return useQuery({
    queryKey: ['verification-service', 'by_' + verificationId] as const,
    queryFn: () => api.adminVerificationsByVerifications(verificationId),
  });
}

/** 获取我的被监护人列表 */
export function useVerificationGuardiansMinors() {
  return useQuery({
    queryKey: ['verification-service'] as const,
    queryFn: () => api.verificationGuardiansMinors(),
  });
}

/** 获取我的认证状态 */
export function useVerificationMe() {
  return useQuery({
    queryKey: ['verification-service'] as const,
    queryFn: () => api.verificationMe(),
  });
}

/** 获取我的认证详情 */
export function useVerificationMeDetail() {
  return useQuery({
    queryKey: ['verification-service'] as const,
    queryFn: () => api.verificationMeDetail(),
  });
}

/** 获取未成年用户的监护人列表 */
export function useVerificationMinorsGuardians(params?: any) {
  return useQuery({
    queryKey: ['verification-service', params] as const,
    queryFn: () => api.verificationMinorsGuardians(params),
  });
}

// --- wallet-service ---

/** 钱包列表 */
export function useAdminWallets(params?: any) {
  return useQuery({
    queryKey: ['wallet-service', params] as const,
    queryFn: () => api.adminWallets(params),
  });
}

/** 优惠券列表 */
export function useAdminWalletsCoupons() {
  return useQuery({
    queryKey: ['wallet-service'] as const,
    queryFn: () => api.adminWalletsCoupons(),
  });
}

/** 优惠券使用记录 */
export function useAdminWalletsCouponsUsagesByCoupons(couponId: string, params?: any) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + couponId, params] as const,
    queryFn: () => api.adminWalletsCouponsUsagesByCoupons(couponId, params),
  });
}

/** 反欺诈规则 */
export function useAdminWalletsFraud_rules() {
  return useQuery({
    queryKey: ['wallet-service'] as const,
    queryFn: () => api.adminWalletsFraudRules(),
  });
}

/** 对账 */
export function useAdminWalletsReconciliation(params?: any) {
  return useQuery({
    queryKey: ['wallet-service', params] as const,
    queryFn: () => api.adminWalletsReconciliation(params),
  });
}

/** 钱包快照列表 */
export function useAdminWalletsSnapshots(params?: any) {
  return useQuery({
    queryKey: ['wallet-service', params] as const,
    queryFn: () => api.adminWalletsSnapshots(params),
  });
}

/** 查询钱包策略 */
export function useAdminWalletsTenantsAppsPolicyByTenantsByApps(tenantId: string, appId: string) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + tenantId, 'by_' + appId] as const,
    queryFn: () => api.adminWalletsTenantsAppsPolicyByTenantsByApps(tenantId, appId),
  });
}

/** 应用钱包总览 */
export function useAdminWalletsTenantsAppsSummaryByTenantsByApps(tenantId: string, appId: string) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + tenantId, 'by_' + appId] as const,
    queryFn: () => api.adminWalletsTenantsAppsSummaryByTenantsByApps(tenantId, appId),
  });
}

/** 争议列表 */
export function useAdminWalletsTenantsDisputesByTenants(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.adminWalletsTenantsDisputesByTenants(tenantId, params),
  });
}

/** 租户级统计 */
export function useAdminWalletsTenantsStatsByTenants(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.adminWalletsTenantsStatsByTenants(tenantId, params),
  });
}

/** 租户钱包总览 */
export function useAdminWalletsTenantsSummaryByTenants(tenantId: string) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + tenantId] as const,
    queryFn: () => api.adminWalletsTenantsSummaryByTenants(tenantId),
  });
}

/** 租户级交易流水 */
export function useAdminWalletsTenantsTransactionsByTenants(tenantId: string, params?: any) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + tenantId, params] as const,
    queryFn: () => api.adminWalletsTenantsTransactionsByTenants(tenantId, params),
  });
}

/** webhook回调记录列表 */
export function useAdminWalletsWebhook_payloads(params?: any) {
  return useQuery({
    queryKey: ['wallet-service', params] as const,
    queryFn: () => api.adminWalletsWebhookPayloads(params),
  });
}

/** webhook回调记录详情 */
export function useAdminWalletsWebhook_payloadsByWebhookPayloads(webhookPayloadId: string) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + webhookPayloadId] as const,
    queryFn: () => api.adminWalletsWebhookPayloadsByWebhookPayloads(webhookPayloadId),
  });
}

/** 提现申请列表 */
export function useAdminWalletsWithdrawals(params?: any) {
  return useQuery({
    queryKey: ['wallet-service', params] as const,
    queryFn: () => api.adminWalletsWithdrawals(params),
  });
}

/** 验证钱包完整性 */
export function useAdminWalletsIntegrityByWallets(walletId: string) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + walletId] as const,
    queryFn: () => api.adminWalletsIntegrityByWallets(walletId),
  });
}

/** 查询兑换率 */
export function useExchange_rates(params?: any) {
  return useQuery({
    queryKey: ['wallet-service', params] as const,
    queryFn: () => api.exchangeRates(params),
  });
}

/** 钱包列表 */
export function useWallets(params?: any) {
  return useQuery({
    queryKey: ['wallet-service', params] as const,
    queryFn: () => api.wallets(params),
  });
}

/** 优惠券列表 */
export function useWalletsCoupons() {
  return useQuery({
    queryKey: ['wallet-service'] as const,
    queryFn: () => api.walletsCoupons(),
  });
}

/** 钱包快照 */
export function useWalletsSnapshot(params?: any) {
  return useQuery({
    queryKey: ['wallet-service', params] as const,
    queryFn: () => api.walletsSnapshot(params),
  });
}

/** 获取钱包详情 */
export function useWalletsByWallets(userId: string) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + userId] as const,
    queryFn: () => api.walletsByWallets(userId),
  });
}

/** 查询余额 */
export function useWalletsBalanceByWallets(userId: string) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + userId] as const,
    queryFn: () => api.walletsBalanceByWallets(userId),
  });
}

/** 余额变动历史 */
export function useWalletsBalance_historyByWallets(userId: string, params?: any) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + userId, params] as const,
    queryFn: () => api.walletsBalanceHistoryByWallets(userId, params),
  });
}

/** 用户优惠券 */
export function useWalletsCouponsByWallets(userId: string) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + userId] as const,
    queryFn: () => api.walletsCouponsByWallets(userId),
  });
}

/** 争议列表 */
export function useWalletsDisputesByWallets(userId: string, params?: any) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + userId, params] as const,
    queryFn: () => api.walletsDisputesByWallets(userId, params),
  });
}

/** 冻结记录 */
export function useWalletsFreezesByWallets(userId: string, params?: any) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + userId, params] as const,
    queryFn: () => api.walletsFreezesByWallets(userId, params),
  });
}

/** 钱包统计 */
export function useWalletsStatsByWallets(userId: string, params?: any) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + userId, params] as const,
    queryFn: () => api.walletsStatsByWallets(userId, params),
  });
}

/** 交易记录 */
export function useWalletsTransactionsByWallets(userId: string, params?: any) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + userId, params] as const,
    queryFn: () => api.walletsTransactionsByWallets(userId, params),
  });
}

/** 提现申请列表 */
export function useWalletsWithdrawalsByWallets(userId: string, params?: any) {
  return useQuery({
    queryKey: ['wallet-service', 'by_' + userId, params] as const,
    queryFn: () => api.walletsWithdrawalsByWallets(userId, params),
  });
}

// ============================================================
// Mutation Hooks (POST/PUT/DELETE/PATCH)
// ============================================================

// --- audit-service ---

/** 分配告警处理人 */
export function usePostAdminAuditAlertsAssignByAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ alertId, data }: { alertId: string, data: any }) => api.adminAuditAlertsAssignByAlertsPost(alertId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 更新告警状态 */
export function usePutAdminAuditAlertsStatusByAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ alertId, data }: { alertId: string, data: any }) => api.adminAuditAlertsStatusByAlertsPut(alertId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 触发异常检测 */
export function usePostAdminAuditAnomaliesDetect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditAnomaliesDetectPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 分配异常分析师 */
export function usePostAdminAuditAnomaliesAssignByAnomalies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ anomalyId, data }: { anomalyId: string, data: any }) => api.adminAuditAnomaliesAssignByAnomaliesPost(anomalyId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 添加异常调查评论 */
export function usePostAdminAuditAnomaliesCommentByAnomalies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ anomalyId, data }: { anomalyId: string, data: any }) => api.adminAuditAnomaliesCommentByAnomaliesPost(anomalyId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 关联异常到案件 */
export function usePostAdminAuditAnomaliesLinkByAnomalies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ anomalyId, data }: { anomalyId: string, data: any }) => api.adminAuditAnomaliesLinkByAnomaliesPost(anomalyId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 更新异常状态 */
export function usePutAdminAuditAnomaliesStatusByAnomalies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ anomalyId, data }: { anomalyId: string, data: any }) => api.adminAuditAnomaliesStatusByAnomaliesPut(anomalyId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 归档审计日志 */
export function usePostAdminAuditArchive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditArchivePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 记录AI决策 */
export function usePostAdminAuditComplianceAi_decisions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditComplianceAiDecisionsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 创建违规通知 */
export function usePostAdminAuditComplianceBreaches() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditComplianceBreachesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 创建清理记录 */
export function usePostAdminAuditComplianceCleanup_records() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditComplianceCleanupRecordsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 创建跨境传输记录 */
export function usePostAdminAuditComplianceCross_border() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditComplianceCrossBorderPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 创建数据分类 */
export function usePostAdminAuditComplianceData_classifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditComplianceDataClassificationsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 创建 PIA */
export function usePostAdminAuditCompliancePias() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditCompliancePiasPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 导出审计日志 */
export function usePostAdminAudit_export() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditExportPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 创建安全事件 */
export function usePostAdminAuditIncidents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditIncidentsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 添加安全事件评论 */
export function usePostAdminAuditIncidentsCommentByIncidents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ incidentId, data }: { incidentId: string, data: any }) => api.adminAuditIncidentsCommentByIncidentsPost(incidentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 更新安全事件状态 */
export function usePutAdminAuditIncidentsStatusByIncidents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ incidentId, data }: { incidentId: string, data: any }) => api.adminAuditIncidentsStatusByIncidentsPut(incidentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 批量获取多个审计日志条目的 Merkle Proof */
export function usePostAdminAuditMerkle_proofs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditMerkleProofsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 保存或更新租户审计日志保留策略 */
export function usePutAdminAuditRetention_policy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditRetentionPolicyPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 创建 SIEM 连接器 */
export function usePostAdminAuditSiemConnectors() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditSiemConnectorsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 删除 SIEM 连接器 */
export function useDeleteAdminAuditSiemConnectorsByConnectors() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (connectorId: string) => api.adminAuditSiemConnectorsByConnectorsDelete(connectorId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 更新 SIEM 连接器 */
export function usePutAdminAuditSiemConnectorsByConnectors() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ connectorId, data }: { connectorId: string, data: any }) => api.adminAuditSiemConnectorsByConnectorsPut(connectorId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 测试 SIEM 连接器 */
export function usePostAdminAuditSiemConnectorsTestByConnectors() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (connectorId: string) => api.adminAuditSiemConnectorsTestByConnectorsPost(connectorId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 更新租户异常检测配置 */
export function usePutAdminAuditTenant_config() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditTenantConfigPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

/** 验证哈希链完整性 */
export function usePostAdminAuditVerifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuditVerificationsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-service'] });
    },
  });
}

// --- billing-service ---

/** 删除红字发票 */
export function useDeleteAdminBillingCredit_noteByCreditNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (number: string) => api.adminBillingCreditNoteByCreditNoteDelete(number),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 作废红字发票 */
export function usePutAdminBillingCredit_noteByCreditNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (number: string) => api.adminBillingCreditNoteByCreditNotePut(number),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 删除催缴配置 */
export function useDeleteAdminBillingDunning_settingsByDunningSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tenantId: string) => api.adminBillingDunningSettingsByDunningSettingsDelete(tenantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 配置催缴策略 */
export function usePutAdminBillingDunning_settingsByDunningSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminBillingDunningSettingsByDunningSettingsPut(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 创建或更新功能开关覆盖 */
export function usePutAdminBillingFeature_gatesOverrides() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminBillingFeatureGatesOverridesPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 创建红字发票 */
export function usePostAdminBillingInvoiceCredit_noteByInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceNumber, data }: { invoiceNumber: string, data: any }) => api.adminBillingInvoiceCreditNoteByInvoicePost(invoiceNumber, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 创建支付网关 */
export function usePostAdminBillingPayment_gateways() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminBillingPaymentGatewaysPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 删除支付网关 */
export function useDeleteAdminBillingPayment_gatewaysByPaymentGateways() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (gatewayId: string) => api.adminBillingPaymentGatewaysByPaymentGatewaysDelete(gatewayId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 更新支付网关 */
export function usePutAdminBillingPayment_gatewaysByPaymentGateways() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ gatewayId, data }: { gatewayId: string, data: any }) => api.adminBillingPaymentGatewaysByPaymentGatewaysPut(gatewayId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 创建套餐定价 */
export function usePostAdminBillingPlans() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminBillingPlansPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 删除套餐定价 */
export function useDeleteAdminBillingPlansByPlans() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => api.adminBillingPlansByPlansDelete(planId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 更新套餐定价 */
export function usePutAdminBillingPlansByPlans() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, data }: { planId: string, data: any }) => api.adminBillingPlansByPlansPut(planId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 更新套餐功能开关 */
export function usePatchAdminBillingPlansFeature_gatesByPlans() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, data }: { planId: string, data: any }) => api.adminBillingPlansFeatureGatesByPlansPatch(planId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 作废计费记录 */
export function useDeleteAdminBillingRecordsByRecords() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (recordId: string) => api.adminBillingRecordsByRecordsDelete(recordId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 提交退款审批 */
export function usePostAdminBillingRefund_approval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminBillingRefundApprovalPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 删除退款审批 */
export function useDeleteAdminBillingRefund_approvalByRefundApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (approvalId: string) => api.adminBillingRefundApprovalByRefundApprovalDelete(approvalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 审批通过退款 */
export function usePostAdminBillingRefund_approvalApproveByRefundApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (approvalId: string) => api.adminBillingRefundApprovalApproveByRefundApprovalPost(approvalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 执行退款审批 */
export function usePostAdminBillingRefund_approvalExecuteByRefundApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ approvalId, data }: { approvalId: string, data: any }) => api.adminBillingRefundApprovalExecuteByRefundApprovalPost(approvalId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 拒绝退款审批 */
export function usePostAdminBillingRefund_approvalRejectByRefundApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (approvalId: string) => api.adminBillingRefundApprovalRejectByRefundApprovalPost(approvalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 取消订阅 */
export function useDeleteAdminBillingSubscriptionBySubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tenantId: string) => api.adminBillingSubscriptionBySubscriptionDelete(tenantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 更新订阅配置 */
export function usePutAdminBillingSubscriptionBySubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminBillingSubscriptionBySubscriptionPut(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 删除应用定价 */
export function useDeleteAdminBillingSubscriptionAppsPricingBySubscriptionByApps() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId }: { tenantId: string, appId: string }) => api.adminBillingSubscriptionAppsPricingBySubscriptionByAppsDelete(tenantId, appId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 配置应用定价 */
export function usePostAdminBillingSubscriptionAppsPricingBySubscriptionByApps() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId, data }: { tenantId: string, appId: string, data: any }) => api.adminBillingSubscriptionAppsPricingBySubscriptionByAppsPost(tenantId, appId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 取消试用期 */
export function usePostAdminBillingSubscriptionCancel_trialBySubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tenantId: string) => api.adminBillingSubscriptionCancelTrialBySubscriptionPost(tenantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 变更套餐 */
export function usePostAdminBillingSubscriptionChange_planBySubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminBillingSubscriptionChangePlanBySubscriptionPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 延长试用期 */
export function usePostAdminBillingSubscriptionExtend_trialBySubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminBillingSubscriptionExtendTrialBySubscriptionPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 回滚套餐 */
export function usePostAdminBillingSubscriptionRollback_planBySubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tenantId: string) => api.adminBillingSubscriptionRollbackPlanBySubscriptionPost(tenantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 更新使用统计 */
export function usePutAdminBillingUsage_statsByUsageStatsByUsageId() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, usageId, data }: { tenantId: string, usageId: string, data: any }) => api.adminBillingUsageStatsByUsageStatsByUsageIdPut(tenantId, usageId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 创建用量告警 */
export function usePostBillingAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.billingAlertsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 删除用量告警 */
export function useDeleteBillingAlertsByAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (alertId: string) => api.billingAlertsByAlertsDelete(alertId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 更新用量告警 */
export function usePutBillingAlertsByAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ alertId, data }: { alertId: string, data: any }) => api.billingAlertsByAlertsPut(alertId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 预览套餐变更按比例费用 */
export function usePostBillingProrationsCalculateByCalculate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.billingProrationsCalculateByCalculatePost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

/** 订阅服务 */
export function usePostBillingSubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.billingSubscribePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-service'] });
    },
  });
}

// --- communication-service ---

/** 创建服务商配置 */
export function usePostAdminCommunicationProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminCommunicationProvidersPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 删除服务商配置 */
export function useDeleteAdminCommunicationProvidersByProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (providerId: string) => api.adminCommunicationProvidersByProvidersDelete(providerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 更新服务商配置 */
export function usePutAdminCommunicationProvidersByProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: string, data: any }) => api.adminCommunicationProvidersByProvidersPut(providerId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 重发失败消息 */
export function usePostAdminCommunicationResendByResend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (messageId: string) => api.adminCommunicationResendByResendPost(messageId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 创建消息模板 */
export function usePostAdminCommunicationTemplates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminCommunicationTemplatesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 删除（停用）模板 */
export function useDeleteAdminCommunicationTemplatesByTemplates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) => api.adminCommunicationTemplatesByTemplatesDelete(templateId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 更新消息模板 */
export function usePutAdminCommunicationTemplatesByTemplates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: string, data: any }) => api.adminCommunicationTemplatesByTemplatesPut(templateId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 将模板复制到其他语言环境 */
export function usePostAdminCommunicationTemplatesClone_to_localeByTemplates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: string, data: any }) => api.adminCommunicationTemplatesCloneToLocaleByTemplatesPost(templateId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 预览模板渲染效果 */
export function usePostAdminCommunicationTemplatesPreviewByTemplates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: string, data: any }) => api.adminCommunicationTemplatesPreviewByTemplatesPost(templateId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 批量发送消息 */
export function usePostCommunicationBulk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.communicationBulkPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 处理短信/邮件/推送服务商回调 */
export function usePostCommunicationCallbackByCallback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ provider, data }: { provider: string, data: any }) => api.communicationCallbackByCallbackPost(provider, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 发送邮件 */
export function usePostCommunicationEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.communicationEmailPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 发送推送通知 */
export function usePostCommunicationPush() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.communicationPushPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 注册设备推送令牌 */
export function usePostCommunicationPush_tokens() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.communicationPushTokensPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 注销推送令牌 */
export function useDeleteCommunicationPush_tokensByPushTokens() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pushTokenId: string) => api.communicationPushTokensByPushTokensDelete(pushTokenId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 更新推送令牌激活状态 */
export function usePutCommunicationPush_tokensByPushTokens() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pushTokenId, data }: { pushTokenId: string, data: any }) => api.communicationPushTokensByPushTokensPut(pushTokenId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 取消定时发送消息 */
export function useDeleteCommunicationScheduledByScheduled() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ messageId, data }: { messageId: string, data: any }) => api.communicationScheduledByScheduledDelete(messageId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

/** 发送短信 */
export function usePostCommunicationSms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.communicationSmsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communication-service'] });
    },
  });
}

// --- compliance-service ---

/** 记录AI自动决策 */
export function usePostAdminComplianceAi_decisions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceAiDecisionsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除AI决策记录 */
export function useDeleteAdminComplianceAi_decisionsByAiDecisions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (decisionId: string) => api.adminComplianceAiDecisionsByAiDecisionsDelete(decisionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新AI决策记录 */
export function usePutAdminComplianceAi_decisionsByAiDecisions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ decisionId, data }: { decisionId: string, data: any }) => api.adminComplianceAiDecisionsByAiDecisionsPut(decisionId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 人工审核AI决策 */
export function usePostAdminComplianceAi_decisionsReviewByAiDecisions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ decisionId, data }: { decisionId: string, data: any }) => api.adminComplianceAiDecisionsReviewByAiDecisionsPost(decisionId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建审计发现记录 */
export function usePostAdminComplianceAudit_findings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceAuditFindingsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除审计发现记录 */
export function useDeleteAdminComplianceAudit_findingsByAuditFindings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (auditFindingId: string) => api.adminComplianceAuditFindingsByAuditFindingsDelete(auditFindingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新审计发现状态 */
export function usePutAdminComplianceAudit_findingsByAuditFindings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ auditFindingId, data }: { auditFindingId: string, data: any }) => api.adminComplianceAuditFindingsByAuditFindingsPut(auditFindingId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建数据泄露通知 */
export function usePostAdminComplianceBreach_notifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceBreachNotificationsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除数据泄露通知 */
export function useDeleteAdminComplianceBreach_notificationsByBreachNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (breachNotificationId: string) => api.adminComplianceBreachNotificationsByBreachNotificationsDelete(breachNotificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新数据泄露通知 */
export function usePutAdminComplianceBreach_notificationsByBreachNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ breachNotificationId, data }: { breachNotificationId: string, data: any }) => api.adminComplianceBreachNotificationsByBreachNotificationsPut(breachNotificationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建合规认证记录 */
export function usePostAdminComplianceCertifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceCertificationsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除合规认证记录 */
export function useDeleteAdminComplianceCertificationsByCertifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (certificationId: string) => api.adminComplianceCertificationsByCertificationsDelete(certificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新合规认证信息 */
export function usePutAdminComplianceCertificationsByCertifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ certificationId, data }: { certificationId: string, data: any }) => api.adminComplianceCertificationsByCertificationsPut(certificationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建数据清理记录 */
export function usePostAdminComplianceCleanup_records() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceCleanupRecordsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建跨境数据传输记录 */
export function usePostAdminComplianceCross_border_transfers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceCrossBorderTransfersPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除跨境数据传输记录 */
export function useDeleteAdminComplianceCross_border_transfersByCrossBorderTransfers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (crossBorderTransferId: string) => api.adminComplianceCrossBorderTransfersByCrossBorderTransfersDelete(crossBorderTransferId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新跨境数据传输记录 */
export function usePutAdminComplianceCross_border_transfersByCrossBorderTransfers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ crossBorderTransferId, data }: { crossBorderTransferId: string, data: any }) => api.adminComplianceCrossBorderTransfersByCrossBorderTransfersPut(crossBorderTransferId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建数据分类规则 */
export function usePostAdminComplianceData_classifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceDataClassificationsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除数据分类规则 */
export function useDeleteAdminComplianceData_classificationsByDataClassifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dataClassificationId: string) => api.adminComplianceDataClassificationsByDataClassificationsDelete(dataClassificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新数据分类规则 */
export function usePutAdminComplianceData_classificationsByDataClassifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dataClassificationId, data }: { dataClassificationId: string, data: any }) => api.adminComplianceDataClassificationsByDataClassificationsPut(dataClassificationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建等级保护控制项 */
export function usePostAdminComplianceDengbaoControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceDengbaoControlsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除等级保护控制项 */
export function useDeleteAdminComplianceDengbaoControlsByControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (controlId: string) => api.adminComplianceDengbaoControlsByControlsDelete(controlId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新等级保护控制项 */
export function usePutAdminComplianceDengbaoControlsByControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ controlId, data }: { controlId: string, data: any }) => api.adminComplianceDengbaoControlsByControlsPut(controlId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 上传合规证据 */
export function usePostAdminComplianceEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceEvidencePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除合规证据 */
export function useDeleteAdminComplianceEvidenceByEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (evidenceId: string) => api.adminComplianceEvidenceByEvidenceDelete(evidenceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新合规证据 */
export function usePutAdminComplianceEvidenceByEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ evidenceId, data }: { evidenceId: string, data: any }) => api.adminComplianceEvidenceByEvidencePut(evidenceId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 撤销数据处理同意 */
export function useDeleteAdminComplianceGdprConsent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceGdprConsentDelete(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建同意记录 */
export function usePostAdminComplianceGdprConsent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceGdprConsentPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建DSAR */
export function usePostAdminComplianceGdprDsar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceGdprDsarPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除DSAR */
export function useDeleteAdminComplianceGdprDsarByDsar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dsarId: string) => api.adminComplianceGdprDsarByDsarDelete(dsarId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新DSAR */
export function usePutAdminComplianceGdprDsarByDsar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dsarId, data }: { dsarId: string, data: any }) => api.adminComplianceGdprDsarByDsarPut(dsarId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建数据删除权请求 */
export function usePostAdminComplianceGdprRight_to_erasure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceGdprRightToErasurePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新删除权请求状态 */
export function usePutAdminComplianceGdprRight_to_erasureByRightToErasure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ erasureId, data }: { erasureId: string, data: any }) => api.adminComplianceGdprRightToErasureByRightToErasurePut(erasureId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 执行数据擦除 */
export function usePostAdminComplianceGdprRight_to_erasureExecuteByRightToErasure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (erasureId: string) => api.adminComplianceGdprRightToErasureExecuteByRightToErasurePost(erasureId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建HIPAA控制项 */
export function usePostAdminComplianceHipaaControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceHipaaControlsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除HIPAA控制项 */
export function useDeleteAdminComplianceHipaaControlsByControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (controlId: string) => api.adminComplianceHipaaControlsByControlsDelete(controlId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新HIPAA控制项 */
export function usePutAdminComplianceHipaaControlsByControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ controlId, data }: { controlId: string, data: any }) => api.adminComplianceHipaaControlsByControlsPut(controlId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建ISO27001控制项 */
export function usePostAdminComplianceIso27001Controls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceIso27001ControlsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除ISO27001控制项 */
export function useDeleteAdminComplianceIso27001ControlsByControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (controlId: string) => api.adminComplianceIso27001ControlsByControlsDelete(controlId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新ISO27001控制项 */
export function usePutAdminComplianceIso27001ControlsByControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ controlId, data }: { controlId: string, data: any }) => api.adminComplianceIso27001ControlsByControlsPut(controlId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建协议文档 */
export function usePostAdminComplianceLegal_documents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceLegalDocumentsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新协议文档 */
export function usePutAdminComplianceLegal_documentsByLegalDocuments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ legalDocumentId, data }: { legalDocumentId: string, data: any }) => api.adminComplianceLegalDocumentsByLegalDocumentsPut(legalDocumentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 归档协议文档 */
export function usePostAdminComplianceLegal_documentsArchiveByLegalDocuments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (legalDocumentId: string) => api.adminComplianceLegalDocumentsArchiveByLegalDocumentsPost(legalDocumentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 发布协议文档 */
export function usePostAdminComplianceLegal_documentsPublishByLegalDocuments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (legalDocumentId: string) => api.adminComplianceLegalDocumentsPublishByLegalDocumentsPost(legalDocumentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建PCI DSS控制项 */
export function usePostAdminCompliancePcidssControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminCompliancePcidssControlsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除PCI DSS控制项 */
export function useDeleteAdminCompliancePcidssControlsByControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (controlId: string) => api.adminCompliancePcidssControlsByControlsDelete(controlId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新PCI DSS控制项 */
export function usePutAdminCompliancePcidssControlsByControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ controlId, data }: { controlId: string, data: any }) => api.adminCompliancePcidssControlsByControlsPut(controlId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建渗透测试报告 */
export function usePostAdminCompliancePenetration_test_reports() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminCompliancePenetrationTestReportsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除渗透测试报告 */
export function useDeleteAdminCompliancePenetration_test_reportsByPenetrationTestReports() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (penetrationTestReportId: string) => api.adminCompliancePenetrationTestReportsByPenetrationTestReportsDelete(penetrationTestReportId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新渗透测试报告 */
export function usePutAdminCompliancePenetration_test_reportsByPenetrationTestReports() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ penetrationTestReportId, data }: { penetrationTestReportId: string, data: any }) => api.adminCompliancePenetrationTestReportsByPenetrationTestReportsPut(penetrationTestReportId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建PIPL控制项 */
export function usePostAdminCompliancePiplControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminCompliancePiplControlsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除PIPL控制项 */
export function useDeleteAdminCompliancePiplControlsByControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (controlId: string) => api.adminCompliancePiplControlsByControlsDelete(controlId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新PIPL控制项 */
export function usePutAdminCompliancePiplControlsByControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ controlId, data }: { controlId: string, data: any }) => api.adminCompliancePiplControlsByControlsPut(controlId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建隐私影响评估 */
export function usePostAdminCompliancePrivacy_impact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminCompliancePrivacyImpactPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除隐私影响评估 */
export function useDeleteAdminCompliancePrivacy_impactByPrivacyImpact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (privacyImpactId: string) => api.adminCompliancePrivacyImpactByPrivacyImpactDelete(privacyImpactId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新隐私影响评估 */
export function usePutAdminCompliancePrivacy_impactByPrivacyImpact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ privacyImpactId, data }: { privacyImpactId: string, data: any }) => api.adminCompliancePrivacyImpactByPrivacyImpactPut(privacyImpactId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建/更新隐私政策 */
export function usePostAdminCompliancePrivacy_policies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminCompliancePrivacyPoliciesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建或更新合规配置 */
export function usePutAdminComplianceProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceProfilePut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建或更新合规配置档 */
export function usePostAdminComplianceProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceProfilesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建PSD2控制项 */
export function usePostAdminCompliancePsd2Controls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminCompliancePsd2ControlsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除PSD2控制项 */
export function useDeleteAdminCompliancePsd2ControlsByControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (controlId: string) => api.adminCompliancePsd2ControlsByControlsDelete(controlId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新PSD2控制项 */
export function usePutAdminCompliancePsd2ControlsByControls() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ controlId, data }: { controlId: string, data: any }) => api.adminCompliancePsd2ControlsByControlsPut(controlId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建法规动态监控项 */
export function usePostAdminComplianceRegulatory_watch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceRegulatoryWatchPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除法规动态监控项 */
export function useDeleteAdminComplianceRegulatory_watchByRegulatoryWatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (regulatoryWatchId: string) => api.adminComplianceRegulatoryWatchByRegulatoryWatchDelete(regulatoryWatchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新法规动态监控项 */
export function usePutAdminComplianceRegulatory_watchByRegulatoryWatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ regulatoryWatchId, data }: { regulatoryWatchId: string, data: any }) => api.adminComplianceRegulatoryWatchByRegulatoryWatchPut(regulatoryWatchId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建数据保留策略 */
export function usePostAdminComplianceRetention_policies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceRetentionPoliciesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除数据保留策略 */
export function useDeleteAdminComplianceRetention_policiesByRetentionPolicies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (retentionPolicyId: string) => api.adminComplianceRetentionPoliciesByRetentionPoliciesDelete(retentionPolicyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新数据保留策略 */
export function usePutAdminComplianceRetention_policiesByRetentionPolicies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ retentionPolicyId, data }: { retentionPolicyId: string, data: any }) => api.adminComplianceRetentionPoliciesByRetentionPoliciesPut(retentionPolicyId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建职责分离规则 */
export function usePostAdminComplianceSod_rules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceSodRulesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除职责分离规则 */
export function useDeleteAdminComplianceSod_rulesBySodRules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sodRuleId: string) => api.adminComplianceSodRulesBySodRulesDelete(sodRuleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新职责分离规则 */
export function usePutAdminComplianceSod_rulesBySodRules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sodRuleId, data }: { sodRuleId: string, data: any }) => api.adminComplianceSodRulesBySodRulesPut(sodRuleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建SOX ITGC控制项 */
export function usePostAdminComplianceSoxItgc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceSoxItgcPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除SOX ITGC控制项 */
export function useDeleteAdminComplianceSoxItgcByItgc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itgcId: string) => api.adminComplianceSoxItgcByItgcDelete(itgcId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新SOX ITGC控制项 */
export function usePutAdminComplianceSoxItgcByItgc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itgcId, data }: { itgcId: string, data: any }) => api.adminComplianceSoxItgcByItgcPut(itgcId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 重载合规标准文件 */
export function usePostAdminComplianceStandardsReload() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.adminComplianceStandardsReloadPost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建子处理商记录 */
export function usePostAdminComplianceSubprocessors() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceSubprocessorsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除子处理商记录 */
export function useDeleteAdminComplianceSubprocessorsBySubprocessors() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (subprocessorId: string) => api.adminComplianceSubprocessorsBySubprocessorsDelete(subprocessorId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新子处理商信息 */
export function usePutAdminComplianceSubprocessorsBySubprocessors() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ subprocessorId, data }: { subprocessorId: string, data: any }) => api.adminComplianceSubprocessorsBySubprocessorsPut(subprocessorId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** Run gap analysis for current tenant */
export function usePostAdminComplianceTenantsSelfGap_analysis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.adminComplianceTenantsSelfGapAnalysisPost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建合规参数覆盖 */
export function usePostAdminComplianceTenantsSelfOverrides() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceTenantsSelfOverridesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除合规参数覆盖 */
export function useDeleteAdminComplianceTenantsSelfOverridesByOverrides() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (param: string) => api.adminComplianceTenantsSelfOverridesByOverridesDelete(param),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** Get readiness report for current tenant */
export function usePostAdminComplianceTenantsSelfReadinessByReadiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ readinessId, data }: { readinessId: string, data: any }) => api.adminComplianceTenantsSelfReadinessByReadinessPost(readinessId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** Update compliance standards for current tenant */
export function usePutAdminComplianceTenantsSelfStandards() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceTenantsSelfStandardsPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 运行合规差距分析 */
export function usePostAdminComplianceTenantsGap_analysisByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tid, data }: { tid: string, data: any }) => api.adminComplianceTenantsGapAnalysisByTenantsPost(tid, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 获取认证就绪报告 */
export function usePostAdminComplianceTenantsReadinessByTenantsByReadiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tid, readinessId, data }: { tid: string, readinessId: string, data: any }) => api.adminComplianceTenantsReadinessByTenantsByReadinessPost(tid, readinessId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新租户选中的合规标准 */
export function usePutAdminComplianceTenantsStandardsByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tid, data }: { tid: string, data: any }) => api.adminComplianceTenantsStandardsByTenantsPut(tid, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 创建供应商风险评估 */
export function usePostAdminComplianceVendor_risk_assessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminComplianceVendorRiskAssessmentPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 删除供应商风险评估 */
export function useDeleteAdminComplianceVendor_risk_assessmentByVendorRiskAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vendorRiskAssessmentId: string) => api.adminComplianceVendorRiskAssessmentByVendorRiskAssessmentDelete(vendorRiskAssessmentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 更新供应商风险评估 */
export function usePutAdminComplianceVendor_risk_assessmentByVendorRiskAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ vendorRiskAssessmentId, data }: { vendorRiskAssessmentId: string, data: any }) => api.adminComplianceVendorRiskAssessmentByVendorRiskAssessmentPut(vendorRiskAssessmentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

/** 提交我的DSAR */
export function usePostComplianceGdprDsarMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.complianceGdprDsarMePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-service'] });
    },
  });
}

// --- identity-service ---

/** 创建ABAC策略 */
export function usePostAdminAbac_policies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAbacPoliciesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 删除ABAC策略 */
export function useDeleteAdminAbac_policiesByAbacPolicies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (policyId: string) => api.adminAbacPoliciesByAbacPoliciesDelete(policyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新ABAC策略 */
export function usePutAdminAbac_policiesByAbacPolicies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ policyId, data }: { policyId: string, data: any }) => api.adminAbacPoliciesByAbacPoliciesPut(policyId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Create Agent */
export function usePostAdminAgents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAgentsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Revoke Agent */
export function useDeleteAdminAgentsByAgents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (agentId: string) => api.adminAgentsByAgentsDelete(agentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Update Agent */
export function usePutAdminAgentsByAgents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, data }: { agentId: string, data: any }) => api.adminAgentsByAgentsPut(agentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Create Agent Credential */
export function usePostAdminAgentsCredentialsByAgents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, data }: { agentId: string, data: any }) => api.adminAgentsCredentialsByAgentsPost(agentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Revoke Agent Credential */
export function useDeleteAdminAgentsCredentialsByAgentsByCredentials() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, credId }: { agentId: string, credId: string }) => api.adminAgentsCredentialsByAgentsByCredentialsDelete(agentId, credId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Rotate Agent Credential */
export function usePostAdminAgentsCredentialsRotateByAgentsByCredentials() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, credId }: { agentId: string, credId: string }) => api.adminAgentsCredentialsRotateByAgentsByCredentialsPost(agentId, credId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 批量吊销 API Key */
export function usePostAdminAuthApi_keysBatch_revoke() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAuthApiKeysBatchRevokePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 清理旧审计日志 */
export function usePostAdminAuthApi_keysCleanup_audit_logs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => api.adminAuthApiKeysCleanupAuditLogsPost(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 管理员强制吊销 API Key */
export function useDeleteAdminAuthApi_keysForceByApiKeys() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (apiKeyId: string) => api.adminAuthApiKeysForceByApiKeysDelete(apiKeyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 创建身份提供商 */
export function usePostAdminIdentity_providers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminIdentityProvidersPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 导入OIDC Discovery */
export function usePostAdminIdentity_providersImport_oidc_discovery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminIdentityProvidersImportOidcDiscoveryPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 导入SAML Metadata */
export function usePostAdminIdentity_providersImport_saml_metadata() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminIdentityProvidersImportSamlMetadataPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 删除身份提供商 */
export function useDeleteAdminIdentity_providersByIdentityProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (providerId: string) => api.adminIdentityProvidersByIdentityProvidersDelete(providerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新身份提供商 */
export function usePutAdminIdentity_providersByIdentityProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: string, data: any }) => api.adminIdentityProvidersByIdentityProvidersPut(providerId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 启用身份提供商 */
export function usePostAdminIdentity_providersActivateByIdentityProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (providerId: string) => api.adminIdentityProvidersActivateByIdentityProvidersPost(providerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新属性映射 */
export function usePutAdminIdentity_providersAttribute_mappingByIdentityProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: string, data: any }) => api.adminIdentityProvidersAttributeMappingByIdentityProvidersPut(providerId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 上传证书 */
export function usePostAdminIdentity_providersCertificatesByIdentityProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: string, data: any }) => api.adminIdentityProvidersCertificatesByIdentityProvidersPost(providerId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 删除证书 */
export function useDeleteAdminIdentity_providersCertificatesByIdentityProvidersByCertificates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, certId }: { providerId: string, certId: string }) => api.adminIdentityProvidersCertificatesByIdentityProvidersByCertificatesDelete(providerId, certId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 证书轮转 */
export function usePostAdminIdentity_providersCertificatesRotateByIdentityProvidersByCertificates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, certId, data }: { providerId: string, certId: string, data: any }) => api.adminIdentityProvidersCertificatesRotateByIdentityProvidersByCertificatesPost(providerId, certId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 停用身份提供商 */
export function usePostAdminIdentity_providersDeactivateByIdentityProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (providerId: string) => api.adminIdentityProvidersDeactivateByIdentityProvidersPost(providerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新JIT配置 */
export function usePutAdminIdentity_providersJit_configByIdentityProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: string, data: any }) => api.adminIdentityProvidersJitConfigByIdentityProvidersPut(providerId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 测试身份提供商连接 */
export function usePostAdminIdentity_providersTestByIdentityProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (providerId: string) => api.adminIdentityProvidersTestByIdentityProvidersPost(providerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 管理员模拟用户登录 */
export function usePostAdminImpersonate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminImpersonatePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Create Device */
export function usePostAdminIots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminIotsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Revoke Device */
export function useDeleteAdminIotsByIots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (iotId: string) => api.adminIotsByIotsDelete(iotId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Test LDAP directory connection */
export function usePostAdminLdapTest_connection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminLdapTestConnectionPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Update LDAP group-role mapping */
export function usePutAdminLdapGroup_role_mappingByLdap() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, data }: { name: string, data: any }) => api.adminLdapGroupRoleMappingByLdapPut(name, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 删除双人复核记录 */
export function useDeleteAdminMaker_checkerByMakerChecker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (recordId: string) => api.adminMakerCheckerByMakerCheckerDelete(recordId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新NHI策略 */
export function usePutAdminPoliciesNhi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminPoliciesNhiPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Create Robot */
export function usePostAdminRobots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminRobotsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Delete Robot */
export function useDeleteAdminRobotsByRobots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (robotId: string) => api.adminRobotsByRobotsDelete(robotId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Update Robot */
export function usePutAdminRobotsByRobots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ robotId, data }: { robotId: string, data: any }) => api.adminRobotsByRobotsPut(robotId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Commission Robot */
export function usePostAdminRobotsCommissionByRobots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (robotId: string) => api.adminRobotsCommissionByRobotsPost(robotId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Decommission Robot */
export function usePostAdminRobotsDecommissionByRobots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (robotId: string) => api.adminRobotsDecommissionByRobotsPost(robotId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Issue Intent Token */
export function usePostAdminRobotsIntentByRobots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ robotId, data }: { robotId: string, data: any }) => api.adminRobotsIntentByRobotsPost(robotId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Revoke Intent Token */
export function usePostAdminRobotsIntentRevokeByRobots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ robotId, data }: { robotId: string, data: any }) => api.adminRobotsIntentRevokeByRobotsPost(robotId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 批准角色激活 */
export function usePostAdminRole_activationsApproveByRoleActivations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (roleActivationId: string) => api.adminRoleActivationsApproveByRoleActivationsPost(roleActivationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 撤销角色激活 */
export function usePostAdminRole_activationsRevokeByRoleActivations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleActivationId, data }: { roleActivationId: string, data: any }) => api.adminRoleActivationsRevokeByRoleActivationsPost(roleActivationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新认证配置 */
export function usePutAdminSecurityAuth_config() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminSecurityAuthConfigPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新密码策略 */
export function usePutAdminSecurityPassword_policy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminSecurityPasswordPolicyPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新风险配置 */
export function usePutAdminSecurityRisk_config() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminSecurityRiskConfigPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 重置风险配置 */
export function usePostAdminSecurityRisk_configReset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.adminSecurityRiskConfigResetPost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 创建用户 */
export function usePostAdminUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminUsersPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 批量创建用户 */
export function usePostAdminUsersBatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminUsersBatchPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 批量更新用户状态 */
export function usePostAdminUsersBatchStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminUsersBatchStatusPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 合并用户 */
export function usePostAdminUsersMerge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminUsersMergePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 删除用户 */
export function useDeleteAdminUsersByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, params }: { userId: string, params: any }) => api.adminUsersByUsersDelete(userId, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新用户信息 */
export function usePutAdminUsersByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminUsersByUsersPut(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 解锁账户 */
export function usePostAdminUsersAccount_unlocksByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminUsersAccountUnlocksByUsersPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 拒绝儿童同意 */
export function usePostAdminUsersChildren_consentDenyByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.adminUsersChildrenConsentDenyByUsersPost(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 验证儿童同意 */
export function usePostAdminUsersChildren_consentVerifyByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.adminUsersChildrenConsentVerifyByUsersPost(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 添加用户身份 */
export function usePostAdminUsersIdentitiesByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminUsersIdentitiesByUsersPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 移除用户身份 */
export function useDeleteAdminUsersIdentitiesByUsersByIdentities() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, identityId }: { userId: string, identityId: string }) => api.adminUsersIdentitiesByUsersByIdentitiesDelete(userId, identityId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 设置主身份 */
export function usePutAdminUsersIdentitiesSet_primaryByUsersByIdentities() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, identityId }: { userId: string, identityId: string }) => api.adminUsersIdentitiesSetPrimaryByUsersByIdentitiesPut(userId, identityId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 验证用户身份 */
export function usePostAdminUsersIdentitiesVerificationsByUsersByIdentities() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, identityId }: { userId: string, identityId: string }) => api.adminUsersIdentitiesVerificationsByUsersByIdentitiesPost(userId, identityId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 管理员模拟用户 */
export function usePostAdminUsersImpersonateByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminUsersImpersonateByUsersPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 管理员撤销用户Passkey凭证 */
export function useDeleteAdminUsersPasskeysByUsersByPasskeys() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, credentialId }: { userId: string, credentialId: string }) => api.adminUsersPasskeysByUsersByPasskeysDelete(userId, credentialId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 修改密码 */
export function usePutAdminUsersPasswordByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminUsersPasswordByUsersPut(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 重置密码 */
export function usePostAdminUsersPassword_resetsByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminUsersPasswordResetsByUsersPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新用户状态 */
export function usePutAdminUsersStatusByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminUsersStatusByUsersPut(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 匿名认证 */
export function usePostAuthAnonymous() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authAnonymousPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 创建 API Key */
export function usePostAuthApi_keys() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authApiKeysPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 吊销 API Key */
export function useDeleteAuthApi_keysByApiKeys() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (apiKeyId: string) => api.authApiKeysByApiKeysDelete(apiKeyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 添加 IP 限制 */
export function usePostAuthApi_keysIp_restrictionsByApiKeys() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ apiKeyId, data }: { apiKeyId: string, data: any }) => api.authApiKeysIpRestrictionsByApiKeysPost(apiKeyId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 删除 IP 限制 */
export function useDeleteAuthApi_keysIp_restrictionsByApiKeysByIpRestrictions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ apiKeyId, restrictionId }: { apiKeyId: string, restrictionId: string }) => api.authApiKeysIpRestrictionsByApiKeysByIpRestrictionsDelete(apiKeyId, restrictionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 轮换 API Key */
export function usePostAuthApi_keysRotateByApiKeys() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (apiKeyId: string) => api.authApiKeysRotateByApiKeysPost(apiKeyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新 API Key 权限范围 */
export function usePutAuthApi_keysScopesByApiKeys() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ apiKeyId, data }: { apiKeyId: string, data: any }) => api.authApiKeysScopesByApiKeysPut(apiKeyId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 启用/禁用 API Key */
export function usePutAuthApi_keysStatusByApiKeys() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ apiKeyId, data }: { apiKeyId: string, data: any }) => api.authApiKeysStatusByApiKeysPut(apiKeyId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 检查用户权限 */
export function usePostAuthCheck_permission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authCheckPermissionPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 检查用户角色 */
export function usePostAuthCheck_role() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authCheckRolePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 忘记密码 */
export function usePostAuthForgot_password() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authForgotPasswordPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 生成一次性票据 */
export function usePostAuthGenerate_ticket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authGenerateTicketPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** ID Token登录 */
export function usePostAuthId_tokenSignin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authIdTokenSigninPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** LDAP directory authentication */
export function usePostAuthLdapLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authLdapLoginPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 用户登录 */
export function usePostAuthLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authLoginPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 邮箱验证码登录 */
export function usePostAuthLoginEmail_code() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authLoginEmailCodePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 手机验证码登录 */
export function usePostAuthLoginPhone_code() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authLoginPhoneCodePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 退出登录 */
export function usePostAuthLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.authLogoutPost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 发送魔法链接 */
export function usePostAuthMagic_link() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMagicLinkPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 魔法链接回调 (GET→POST 双步跳转) */
export function usePostAuthMagic_linkCallback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => api.authMagicLinkCallbackPost(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 请求发送魔法链接 */
export function usePostAuthMagic_linkRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMagicLinkRequestPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 停用当前账户 */
export function useDeleteAuthMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMeDelete(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新当前用户信息 */
export function usePutAuthMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMePut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

export function usePostAuthMeAuthenticatorBackup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMeAuthenticatorBackupPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

export function useDeleteAuthMeAuthenticatorBackupByBackup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (backupId: string) => api.authMeAuthenticatorBackupByBackupDelete(backupId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 移除认证器设备 */
export function useDeleteAuthMeAuthenticatorDevicesByDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => api.authMeAuthenticatorDevicesByDevicesDelete(deviceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 撤销用户同意 */
export function useDeleteAuthMeConsent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => api.authMeConsentDelete(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 记录用户同意 */
export function usePostAuthMeConsent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMeConsentPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 永久删除账户 (GDPR 被遗忘权/账户删除) */
export function usePostAuthMeDelete_account() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.authMeDeleteAccountPost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 移除设备 */
export function useDeleteAuthMeDevicesByDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => api.authMeDevicesByDevicesDelete(deviceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 信任/取消信任设备 */
export function usePutAuthMeDevicesTrustByDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ deviceId, data }: { deviceId: string, data: any }) => api.authMeDevicesTrustByDevicesPut(deviceId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 变更邮箱地址 */
export function usePostAuthMeEmailChange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMeEmailChangePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 取消邮箱变更 */
export function usePostAuthMeEmailChangeCancel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.authMeEmailChangeCancelPost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 验证邮箱变更 */
export function usePostAuthMeEmailVerify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMeEmailVerifyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 导出我的数据 (GDPR DSAR) */
export function usePostAuthMeExport_data() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.authMeExportDataPost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 修改当前用户密码 */
export function usePutAuthMePassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMePasswordPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 检查密码强度 */
export function usePostAuthMePassword_strength() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMePasswordStrengthPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 变更手机号 */
export function usePostAuthMePhoneChange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMePhoneChangePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 取消手机号变更 */
export function usePostAuthMePhoneChangeCancel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.authMePhoneChangeCancelPost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 验证手机号变更 */
export function usePostAuthMePhoneVerify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMePhoneVerifyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 重新认证（step-up） */
export function usePostAuthMeReauthenticate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMeReauthenticatePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 添加恢复联系人 */
export function usePostAuthMeRecovery_contacts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMeRecoveryContactsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 移除恢复联系人 */
export function useDeleteAuthMeRecovery_contactsByRecoveryContacts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contactId: string) => api.authMeRecoveryContactsByRecoveryContactsDelete(contactId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 请求角色激活 */
export function usePostAuthMeRole_activations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMeRoleActivationsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 解绑SAML关联账户 */
export function useDeleteAuthMeSaml_linksBySamlLinks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (linkId: string) => api.authMeSamlLinksBySamlLinksDelete(linkId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 关闭安全事件提醒 */
export function usePostAuthMeSecurity_eventsDismissBySecurityEvents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string, data: any }) => api.authMeSecurityEventsDismissBySecurityEventsPost(eventId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 登出所有会话 */
export function useDeleteAuthMeSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.authMeSessionsDelete(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 登出指定会话 */
export function useDeleteAuthMeSessionsBySessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => api.authMeSessionsBySessionsDelete(sessionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 结束模拟会话 */
export function usePostAuthMeStop_impersonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.authMeStopImpersonationPost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 切换当前租户 */
export function usePostAuthMeSwitch_tenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMeSwitchTenantPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 删除Passkey */
export function useDeleteAuthMeWebauthn_credentialsByWebauthnCredentials() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (credentialId: string) => api.authMeWebauthnCredentialsByWebauthnCredentialsDelete(credentialId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 验证MFA挑战 */
export function usePostAuthMfaVerify_challenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authMfaVerifyChallengePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 绑定OAuth账号 */
export function usePostAuthOauthBind() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authOauthBindPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 解绑OAuth账号 */
export function usePostAuthOauthUnbind() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authOauthUnbindPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** OIDC后通道登出 */
export function usePostAuthOidcBackchannel_logout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authOidcBackchannelLogoutPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** RP发起登出 */
export function usePostAuthOidcLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => api.authOidcLogoutPost(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 取消二维码登录 */
export function usePostAuthQr_loginCancel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authQrLoginCancelPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 确认二维码登录 */
export function usePostAuthQr_loginConfirm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authQrLoginConfirmPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 发起二维码登录 */
export function usePostAuthQr_loginInitiate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.authQrLoginInitiatePost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 扫描二维码登录 */
export function usePostAuthQr_loginScan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authQrLoginScanPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 重新认证（step-up） */
export function usePostAuthRe_authenticate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authReAuthenticatePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 通过恢复联系人初始化账户恢复 */
export function usePostAuthRecover_account() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authRecoverAccountPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 通过恢复码重置密码 */
export function usePostAuthRecover_accountReset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authRecoverAccountResetPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 完成账户恢复 */
export function usePostAuthRecoveryComplete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authRecoveryCompletePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 发起账户恢复 */
export function usePostAuthRecoveryRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authRecoveryRequestPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 验证账户恢复码 */
export function usePostAuthRecoveryVerify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authRecoveryVerifyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 刷新访问令牌 */
export function usePostAuthRefresh() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authRefreshPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 用户注册 */
export function usePostAuthRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authRegisterPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 检查邮箱是否可用 */
export function usePostAuthRegisterCheck_email() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, params }: { data: any, params: any }) => api.authRegisterCheckEmailPost(data, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 检查用户名是否可用 */
export function usePostAuthRegisterCheck_username() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, params }: { data: any, params: any }) => api.authRegisterCheckUsernamePost(data, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 邮箱验证码注册 */
export function usePostAuthRegisterEmail_code() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authRegisterEmailCodePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 邀请注册 */
export function usePostAuthRegisterInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authRegisterInvitationPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** OAuth补充注册 */
export function usePostAuthRegisterOauth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authRegisterOauthPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 手机验证码注册 */
export function usePostAuthRegisterPhone_code() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authRegisterPhoneCodePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 重新申请注册 */
export function usePostAuthRegisterReapply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authRegisterReapplyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 重新发送短信验证码 */
export function usePostAuthResend_sms_code() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authResendSmsCodePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 重新发送邮箱验证邮件 */
export function usePostAuthResend_verification_email() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authResendVerificationEmailPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 重置密码 */
export function usePostAuthReset_password() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authResetPasswordPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 发送短信验证码 */
export function usePostAuthSend_sms_code() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authSendSmsCodePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 发送邮箱验证邮件 */
export function usePostAuthSend_verification_email() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authSendVerificationEmailPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 企业SSO回调 */
export function usePostAuthSsoCallback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authSsoCallbackPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 启动企业SSO登录 */
export function usePostAuthSsoInitiate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authSsoInitiatePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 票据签名登录 */
export function usePostAuthTicketSignin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authTicketSigninPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 验证邮箱地址 */
export function usePostAuthVerify_email() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authVerifyEmailPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 验证手机号 */
export function usePostAuthVerify_phone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authVerifyPhonePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 验证重置验证码 */
export function usePostAuthVerify_reset_code() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authVerifyResetCodePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 验证Web3钱包签名 */
export function usePostAuthWeb3Verify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authWeb3VerifyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 开始Passkey公开认证 */
export function usePostAuthWebauthnAuthenticateBegin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authWebauthnAuthenticateBeginPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 完成Passkey公开认证 */
export function usePostAuthWebauthnAuthenticateComplete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authWebauthnAuthenticateCompletePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 开始Passkey登录 */
export function usePostAuthWebauthnLoginBegin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authWebauthnLoginBeginPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 完成Passkey登录 */
export function usePostAuthWebauthnLoginComplete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authWebauthnLoginCompletePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 开始Passkey注册 */
export function usePostAuthWebauthnRegisterBegin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authWebauthnRegisterBeginPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 完成Passkey注册 */
export function usePostAuthWebauthnRegisterComplete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authWebauthnRegisterCompletePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 移除所有设备 */
export function useDeleteDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => api.devicesDelete(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 移除设备 */
export function useDeleteDevicesByDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => api.devicesByDevicesDelete(deviceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 信任/取消信任设备 */
export function usePutDevicesTrustByDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ deviceId, data }: { deviceId: string, data: any }) => api.devicesTrustByDevicesPut(deviceId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Pair Device */
export function usePostIotsPair() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.iotsPairPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Unpair Device */
export function useDeleteIotsByIots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (iotId: string) => api.iotsByIotsDelete(iotId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Add Family Member */
export function usePostIotsFamily_accessByIots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ iotId, data }: { iotId: string, data: any }) => api.iotsFamilyAccessByIotsPost(iotId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Remove Family Member */
export function useDeleteIotsFamily_accessByIotsByFamilyAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ iotId, memberId }: { iotId: string, memberId: string }) => api.iotsFamilyAccessByIotsByFamilyAccessDelete(iotId, memberId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** Transfer Device */
export function usePostIotsTransferByIots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ iotId, data }: { iotId: string, data: any }) => api.iotsTransferByIotsPost(iotId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 检查密码强度（公开） */
export function usePost_publicPassword_strength() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.PublicPasswordStrengthPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 创建SCIM组 */
export function usePostScimGroups() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.scimGroupsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 删除SCIM组 */
export function useDeleteScimGroupsByGroups() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => api.scimGroupsByGroupsDelete(groupId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 部分更新SCIM组 */
export function usePatchScimGroupsByGroups() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string, data: any }) => api.scimGroupsByGroupsPatch(groupId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新SCIM组 */
export function usePutScimGroupsByGroups() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string, data: any }) => api.scimGroupsByGroupsPut(groupId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 创建SCIM用户 */
export function usePostScimUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.scimUsersPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 删除SCIM用户 */
export function useDeleteScimUsersByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.scimUsersByUsersDelete(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 部分更新SCIM用户 */
export function usePatchScimUsersByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.scimUsersByUsersPatch(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

/** 更新SCIM用户 */
export function usePutScimUsersByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.scimUsersByUsersPut(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['identity-service'] });
    },
  });
}

// --- mfa-service ---

/** 创建IP白名单 */
export function usePostAdminMfaIp_whitelist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminMfaIpWhitelistPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 删除IP白名单 */
export function useDeleteAdminMfaIp_whitelistByIpWhitelist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ipWhitelistId: string) => api.adminMfaIpWhitelistByIpWhitelistDelete(ipWhitelistId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 更新IP白名单 */
export function usePutAdminMfaIp_whitelistByIpWhitelist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ipWhitelistId, data }: { ipWhitelistId: string, data: any }) => api.adminMfaIpWhitelistByIpWhitelistPut(ipWhitelistId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 管理员重置用户MFA */
export function useDeleteAdminMfaResetByReset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.adminMfaResetByResetDelete(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 评估风险策略 */
export function usePostAdminMfaRisk_policiesEvaluate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminMfaRiskPoliciesEvaluatePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 删除指定等级的风险策略 */
export function useDeleteAdminMfaRisk_policiesByRiskPolicies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (level: string) => api.adminMfaRiskPoliciesByRiskPoliciesDelete(level),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 更新指定等级的风险策略 */
export function usePutAdminMfaRisk_policiesByRiskPolicies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ level, data }: { level: string, data: any }) => api.adminMfaRiskPoliciesByRiskPoliciesPut(level, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 更新MFA风险策略 */
export function usePutAdminMfaRisk_policy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminMfaRiskPolicyPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 生成备用恢复码 */
export function usePostMfaBackup_codesGenerate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaBackupCodesGeneratePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 独立备用码验证 */
export function usePostMfaBackup_codesVerify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaBackupCodesVerifyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 创建通用MFA挑战 */
export function usePostMfaChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaChallengePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 设置主认证方式 */
export function usePostMfaCredentialsPrimaryByCredentials() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ credentialId, data }: { credentialId: string, data: any }) => api.mfaCredentialsPrimaryByCredentialsPost(credentialId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 同步设备数据 */
export function usePostMfaDevicesSync() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaDevicesSyncPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 禁用邮箱 MFA */
export function usePostMfaEmailDisable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaEmailDisablePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** Email MFA注册 */
export function usePutMfaEmailEnroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaEmailEnrollPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 发送邮箱验证码 */
export function usePostMfaEmailSend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaEmailSendPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 验证邮箱验证 */
export function usePostMfaEmailVerify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaEmailVerifyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 删除MFA方法 */
export function useDeleteMfaMethodsByMethods() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ methodType, params }: { methodType: string, params: any }) => api.mfaMethodsByMethodsDelete(methodType, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 批准Push MFA挑战 */
export function usePostMfaPushApprove() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaPushApprovePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 创建Push MFA挑战 */
export function usePostMfaPushChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaPushChallengePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 拒绝Push MFA挑战 */
export function usePostMfaPushDeny() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaPushDenyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 禁用短信 MFA */
export function usePostMfaSmsDisable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaSmsDisablePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** SMS MFA注册 */
export function usePutMfaSmsEnroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaSmsEnrollPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 发送短信验证码 */
export function usePostMfaSmsSend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaSmsSendPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 验证短信验证 */
export function usePostMfaSmsVerify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaSmsVerifyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** MFA步进认证 */
export function usePostMfaStep_up() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaStepUpPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 注册TOTP设备 */
export function usePostMfaTotpDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaTotpDevicesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 撤销TOTP设备 */
export function useDeleteMfaTotpDevicesByDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ deviceId, data }: { deviceId: string, data: any }) => api.mfaTotpDevicesByDevicesDelete(deviceId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 禁用TOTP设备 */
export function usePostMfaTotpDevicesDisableByDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => api.mfaTotpDevicesDisableByDevicesPost(deviceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 启用TOTP设备 */
export function usePostMfaTotpDevicesEnableByDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => api.mfaTotpDevicesEnableByDevicesPost(deviceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 禁用TOTP */
export function usePostMfaTotpDisable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaTotpDisablePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 启用TOTP多因素认证 */
export function usePostMfaTotpEnable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaTotpEnablePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 启用TOTP多因素认证 */
export function usePostMfaTotpSetup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaTotpSetupPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 验证TOTP码（登录时） */
export function usePostMfaTotpValidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaTotpValidatePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 验证并启用TOTP */
export function usePostMfaTotpVerify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaTotpVerifyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 撤销所有受信设备 */
export function useDeleteMfaTrusted_devices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.mfaTrustedDevicesDelete(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 记住受信设备 */
export function usePostMfaTrusted_devices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaTrustedDevicesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 清理过期受信设备 */
export function usePostMfaTrusted_devicesCleanup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.mfaTrustedDevicesCleanupPost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 撤销受信设备 */
export function useDeleteMfaTrusted_devicesByTrustedDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (trustedDeviceId: string) => api.mfaTrustedDevicesByTrustedDevicesDelete(trustedDeviceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 开始WebAuthn凭证注册 */
export function usePostMfaWebauthnCredentialsRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaWebauthnCredentialsRegisterPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 完成WebAuthn凭证注册 */
export function usePostMfaWebauthnCredentialsRegisterVerify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.mfaWebauthnCredentialsRegisterVerifyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 删除WebAuthn凭证 */
export function useDeleteMfaWebauthnCredentialsByCredentials() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (webauthnCredentialId: string) => api.mfaWebauthnCredentialsByCredentialsDelete(webauthnCredentialId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

/** 重命名WebAuthn凭证 */
export function usePutMfaWebauthnCredentialsByCredentials() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ webauthnCredentialId, data }: { webauthnCredentialId: string, data: any }) => api.mfaWebauthnCredentialsByCredentialsPut(webauthnCredentialId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mfa-service'] });
    },
  });
}

// --- notification-service ---

/** 创建公告 */
export function usePostAdminAnnouncements() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminAnnouncementsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 删除公告 */
export function useDeleteAdminAnnouncementsByAnnouncements() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (announcementId: string) => api.adminAnnouncementsByAnnouncementsDelete(announcementId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 更新公告 */
export function usePutAdminAnnouncementsByAnnouncements() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ announcementId, data }: { announcementId: string, data: any }) => api.adminAnnouncementsByAnnouncementsPut(announcementId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 发布公告 */
export function usePostAdminAnnouncementsPublishByAnnouncements() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (announcementId: string) => api.adminAnnouncementsPublishByAnnouncementsPost(announcementId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 撤回公告 */
export function usePostAdminAnnouncementsUnpublishByAnnouncements() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (announcementId: string) => api.adminAnnouncementsUnpublishByAnnouncementsPost(announcementId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 广播通知 */
export function usePostAdminNotificationsBroadcast() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminNotificationsBroadcastPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 创建事件映射 */
export function usePostAdminNotificationsEvent_mappings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminNotificationsEventMappingsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 删除事件映射 */
export function useDeleteAdminNotificationsEvent_mappingsByEventMappings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (announcementId: string) => api.adminNotificationsEventMappingsByEventMappingsDelete(announcementId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 更新事件映射 */
export function usePutAdminNotificationsEvent_mappingsByEventMappings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ announcementId, data }: { announcementId: string, data: any }) => api.adminNotificationsEventMappingsByEventMappingsPut(announcementId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 创建全局变量 */
export function usePostAdminNotificationsGlobal_variables() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminNotificationsGlobalVariablesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 删除全局变量 */
export function useDeleteAdminNotificationsGlobal_variablesByGlobalVariables() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (announcementId: string) => api.adminNotificationsGlobalVariablesByGlobalVariablesDelete(announcementId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 更新全局变量 */
export function usePutAdminNotificationsGlobal_variablesByGlobalVariables() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ announcementId, data }: { announcementId: string, data: any }) => api.adminNotificationsGlobalVariablesByGlobalVariablesPut(announcementId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 管理员覆盖用户通知偏好 */
export function usePutAdminNotificationsPreferencesByPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminNotificationsPreferencesByPreferencesPut(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 创建通知模板 */
export function usePostAdminNotificationsTemplates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminNotificationsTemplatesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 删除通知模板 */
export function useDeleteAdminNotificationsTemplatesByTemplates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (announcementId: string) => api.adminNotificationsTemplatesByTemplatesDelete(announcementId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 更新通知模板 */
export function usePutAdminNotificationsTemplatesByTemplates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ announcementId, data }: { announcementId: string, data: any }) => api.adminNotificationsTemplatesByTemplatesPut(announcementId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 跨 locale 复制模板 */
export function usePostAdminNotificationsTemplatesClone_to_localeByTemplates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ announcementId, data }: { announcementId: string, data: any }) => api.adminNotificationsTemplatesCloneToLocaleByTemplatesPost(announcementId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 发送通知 */
export function usePostNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.notificationsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 更新通知偏好设置 */
export function usePutNotificationsPreferencesByPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.notificationsPreferencesByPreferencesPut(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 订阅安全公告 */
export function usePostNotifications_publicSecurity_subscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.notificationsPublicSecuritySubscribePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 退订安全公告 */
export function usePostNotifications_publicSecurity_unsubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.notificationsPublicSecurityUnsubscribePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 标记全部通知已读 */
export function usePutNotificationsRead_all() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.notificationsReadAllPut(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 发送通知（兼容端点） */
export function usePostNotificationsSend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.notificationsSendPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 批量发送通知 */
export function usePostNotificationsSend_batch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.notificationsSendBatchPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 使用模板发送通知 */
export function usePostNotificationsSend_from_template() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.notificationsSendFromTemplatePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 发送测试通知 */
export function usePostNotificationsTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.notificationsTestPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 删除通知 */
export function useDeleteNotificationsByNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ notificationId, data }: { notificationId: string, data: any }) => api.notificationsByNotificationsDelete(notificationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 标记通知已读 */
export function usePutNotificationsReadByNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => api.notificationsReadByNotificationsPut(notificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 标记通知未读 */
export function usePutNotificationsUnreadByNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => api.notificationsUnreadByNotificationsPut(notificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 删除推送订阅 */
export function useDeletePushSubscriptions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => api.pushSubscriptionsDelete(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

/** 注册 Web Push 推送订阅 */
export function usePostPushSubscriptions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.pushSubscriptionsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-service'] });
    },
  });
}

// --- oauth-service ---

/** 创建 OAuth 客户端 */
export function usePostAdminOauthClients() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminOauthClientsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 删除 OAuth 客户端 */
export function useDeleteAdminOauthClientsByClients() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (clientId: string) => api.adminOauthClientsByClientsDelete(clientId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 更新 OAuth 客户端配置 */
export function usePutAdminOauthClientsByClients() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string, data: any }) => api.adminOauthClientsByClientsPut(clientId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 克隆 OAuth 客户端 */
export function usePostAdminOauthClientsCloneByClients() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (clientId: string) => api.adminOauthClientsCloneByClientsPost(clientId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 轮换 OAuth 客户端密钥 */
export function usePostAdminOauthClientsRotate_secretByClients() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (clientId: string) => api.adminOauthClientsRotateSecretByClientsPost(clientId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 创建 OAuth 客户端密钥 */
export function usePostAdminOauthClientsSecretsByClients() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (clientId: string) => api.adminOauthClientsSecretsByClientsPost(clientId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 删除 OAuth 客户端密钥 */
export function useDeleteAdminOauthClientsSecretsByClientsBySecrets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, secretId }: { clientId: string, secretId: string }) => api.adminOauthClientsSecretsByClientsBySecretsDelete(clientId, secretId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 停用 OAuth 客户端密钥 */
export function usePutAdminOauthClientsSecretsDeactivateByClientsBySecrets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, secretId }: { clientId: string, secretId: string }) => api.adminOauthClientsSecretsDeactivateByClientsBySecretsPut(clientId, secretId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 撤销 OAuth 客户端所有令牌 */
export function useDeleteAdminOauthClientsTokensByClients() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, params }: { clientId: string, params: any }) => api.adminOauthClientsTokensByClientsDelete(clientId, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 撤销设备授权 */
export function useDeleteAdminOauthDevicesByDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deviceCode: string) => api.adminOauthDevicesByDevicesDelete(deviceCode),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 创建OAuth提供商 */
export function usePostAdminOauthProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminOauthProvidersPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 删除OAuth提供商 */
export function useDeleteAdminOauthProvidersByProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.adminOauthProvidersByProvidersDelete(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 更新OAuth提供商 */
export function usePutAdminOauthProvidersByProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, data }: { name: string, data: any }) => api.adminOauthProvidersByProvidersPut(name, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 启停OAuth提供商 */
export function usePutAdminOauthProvidersToggleByProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, data }: { name: string, data: any }) => api.adminOauthProvidersToggleByProvidersPut(name, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 批量撤销用户令牌 */
export function useDeleteAdminOauthTokensUserByUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.adminOauthTokensUserByUserDelete(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** OAuth 2.0 授权端点（POST） */
export function usePostOauthAuthorize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.oauthAuthorizePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 绑定 OAuth 账号 */
export function usePostOauthBind() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.oauthBindPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 撤销授权同意 */
export function useDeleteOauthConsentsByConsents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.oauthConsentsByConsentsDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 设备授权请求 */
export function usePostOauthDeviceAuthorize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.oauthDeviceAuthorizePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 设备授权验证（用户侧） */
export function usePostOauthDeviceVerify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.oauthDeviceVerifyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** RP-Initiated Logout */
export function usePostOauthLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => api.oauthLogoutPost(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 推送授权请求（PAR） */
export function usePostOauthPushed_authorization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.oauthPushedAuthorizationPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 刷新访问令牌 */
export function usePostOauthRefresh() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.oauthRefreshPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 动态客户端注册 */
export function usePostOauthRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.oauthRegisterPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 删除客户端注册 */
export function useDeleteOauthRegisterByRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (clientId: string) => api.oauthRegisterByRegisterDelete(clientId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 更新客户端注册 */
export function usePutOauthRegisterByRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string, data: any }) => api.oauthRegisterByRegisterPut(clientId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 撤销令牌 */
export function usePostOauthRevoke() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.oauthRevokePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** OAuth 2.0 令牌端点 */
export function usePostOauthToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.oauthTokenPost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 令牌交换（Token Exchange） */
export function usePostOauthToken_exchange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.oauthTokenExchangePost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

/** 解绑 OAuth 账号 */
export function useDeleteOauthUnbindByUnbind() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (connectionId: string) => api.oauthUnbindByUnbindDelete(connectionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oauth-service'] });
    },
  });
}

// --- pay-service ---

/** 创建支付渠道 */
export function usePostAdminPaymentsChannels() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminPaymentsChannelsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pay-service'] });
    },
  });
}

/** 删除支付渠道 */
export function useDeleteAdminPaymentsChannelsByChannels() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (channelId: string) => api.adminPaymentsChannelsByChannelsDelete(channelId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pay-service'] });
    },
  });
}

/** 更新支付渠道 */
export function usePutAdminPaymentsChannelsByChannels() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ channelId, data }: { channelId: string, data: any }) => api.adminPaymentsChannelsByChannelsPut(channelId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pay-service'] });
    },
  });
}

/** 执行对账 */
export function usePostAdminPaymentsReconciliation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => api.adminPaymentsReconciliationPost(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pay-service'] });
    },
  });
}

/** 删除对账记录 */
export function useDeleteAdminPaymentsReconciliationByReconciliation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reconciliationId: string) => api.adminPaymentsReconciliationByReconciliationDelete(reconciliationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pay-service'] });
    },
  });
}

/** 删除Webhook记录 */
export function useDeleteAdminPaymentsWebhooksByWebhooks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (webhookId: string) => api.adminPaymentsWebhooksByWebhooksDelete(webhookId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pay-service'] });
    },
  });
}

/** 创建支付订单 */
export function usePostPayments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.paymentsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pay-service'] });
    },
  });
}

/** 创建退款 */
export function usePostPaymentsRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.paymentsRefundPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pay-service'] });
    },
  });
}

/** 取消支付 */
export function useDeletePaymentsByPayments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => api.paymentsByPaymentsDelete(paymentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pay-service'] });
    },
  });
}

/** 生成发票 */
export function usePostPaymentsInvoiceByPayments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => api.paymentsInvoiceByPaymentsPost(paymentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pay-service'] });
    },
  });
}

/** 接收支付网关回调 */
export function usePostWebhooksPaymentByPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (channel: string) => api.webhooksPaymentByPaymentPost(channel),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pay-service'] });
    },
  });
}

// --- point-service ---

/** 创建积分规则 */
export function usePostAdminPoint_rules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminPointRulesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 规则试算 */
export function usePostAdminPoint_rulesTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminPointRulesTestPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 删除积分规则 */
export function useDeleteAdminPoint_rulesByPointRules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: string) => api.adminPointRulesByPointRulesDelete(ruleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 更新积分规则 */
export function usePutAdminPoint_rulesByPointRules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ruleId, data }: { ruleId: string, data: any }) => api.adminPointRulesByPointRulesPut(ruleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 创建积分账户 */
export function usePostAdminPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminPointsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 应用积分规则 */
export function usePostAdminPointsApply_rule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminPointsApplyRulePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 批量发放积分 */
export function usePostAdminPointsBatch_earn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminPointsBatchEarnPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 删除租户积分配置 */
export function useDeleteAdminPointsConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.adminPointsConfigDelete(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 更新租户积分配置 */
export function usePutAdminPointsConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminPointsConfigPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 删除积分账户 */
export function useDeleteAdminPointsByPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.adminPointsByPointsDelete(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 调整积分 */
export function usePostAdminPointsAdjustByPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminPointsAdjustByPointsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 处理积分过期 */
export function usePostAdminPointsExpireByPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminPointsExpireByPointsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 冻结积分 */
export function usePostAdminPointsFreezeByPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminPointsFreezeByPointsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 更新积分账户状态 */
export function usePutAdminPointsStatusByPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminPointsStatusByPointsPut(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 解冻积分 */
export function usePostAdminPointsUnfreezeByPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminPointsUnfreezeByPointsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 确认扣除冻结积分 */
export function usePostPointsConfirm_deductionByPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.pointsConfirmDeductionByPointsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 获得积分 */
export function usePostPointsEarnByPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.pointsEarnByPointsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 积分兑换 */
export function usePostPointsExchangeByPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.pointsExchangeByPointsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 退回积分 */
export function usePostPointsRefundByPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.pointsRefundByPointsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 消费积分 */
export function usePostPointsSpendByPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.pointsSpendByPointsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

/** 积分转账 */
export function usePostPointsTransferByPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.pointsTransferByPointsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['point-service'] });
    },
  });
}

// --- profile-service ---

/** 创建审批请求 */
export function usePostAdminProfilesApproval_requests() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminProfilesApprovalRequestsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 删除审批请求 */
export function useDeleteAdminProfilesApproval_requestsByApprovalRequests() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => api.adminProfilesApprovalRequestsByApprovalRequestsDelete(requestId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 批准审批请求 */
export function usePostAdminProfilesApproval_requestsApproveByApprovalRequests() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => api.adminProfilesApprovalRequestsApproveByApprovalRequestsPost(requestId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 拒绝审批请求 */
export function usePostAdminProfilesApproval_requestsRejectByApprovalRequests() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string, data: any }) => api.adminProfilesApprovalRequestsRejectByApprovalRequestsPost(requestId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 批量归档用户资料 */
export function usePostAdminProfilesBatch_archive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminProfilesBatchArchivePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 批量删除用户资料 */
export function usePostAdminProfilesBatch_delete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminProfilesBatchDeletePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 批量导出用户资料 */
export function usePostAdminProfilesBatch_export() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminProfilesBatchExportPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 创建字段模板 */
export function usePostAdminProfilesField_schemas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminProfilesFieldSchemasPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 删除字段模板 */
export function useDeleteAdminProfilesField_schemasByFieldSchemas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fieldKey: string) => api.adminProfilesFieldSchemasByFieldSchemasDelete(fieldKey),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 更新字段模板 */
export function usePutAdminProfilesField_schemasByFieldSchemas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fieldKey, data }: { fieldKey: string, data: any }) => api.adminProfilesFieldSchemasByFieldSchemasPut(fieldKey, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 删除租户资料策略 */
export function useDeleteAdminProfilesPolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.adminProfilesPolicyDelete(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 创建租户资料策略 */
export function usePostAdminProfilesPolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminProfilesPolicyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 更新租户资料策略 */
export function usePutAdminProfilesPolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminProfilesPolicyPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 删除资料版本记录 */
export function useDeleteAdminProfilesVersionsByVersions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (versionId: string) => api.adminProfilesVersionsByVersionsDelete(versionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 删除 Webhook 配置 */
export function useDeleteAdminProfilesWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.adminProfilesWebhookDelete(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 创建 Webhook 配置 */
export function usePostAdminProfilesWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminProfilesWebhookPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 更新 Webhook 配置 */
export function usePutAdminProfilesWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminProfilesWebhookPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 归档用户资料 */
export function usePostAdminProfilesArchiveByProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminProfilesArchiveByProfilesPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 删除用户资料 */
export function useDeleteProfilesByProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.profilesByProfilesDelete(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 创建或更新用户资料 */
export function usePutProfilesByProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.profilesByProfilesPut(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 更新用户头像 */
export function usePutProfilesAvatarByProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.profilesAvatarByProfilesPut(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 上传用户头像 */
export function usePostProfilesAvatarUploadByProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.profilesAvatarUploadByProfilesPost(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 授予数据收集同意 */
export function usePostProfilesConsentsByProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.profilesConsentsByProfilesPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 撤销数据收集同意 */
export function useDeleteProfilesConsentsByProfilesByConsents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, fieldKey }: { userId: string, fieldKey: string }) => api.profilesConsentsByProfilesByConsentsDelete(userId, fieldKey),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 更新自定义字段 */
export function usePutProfilesFieldsByProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.profilesFieldsByProfilesPut(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 更新用户偏好设置 */
export function usePutProfilesPreferencesByProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.profilesPreferencesByProfilesPut(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 更新隐私设置 */
export function usePutProfilesPrivacyByProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.profilesPrivacyByProfilesPut(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 删除用户标签 */
export function useDeleteProfilesTagsByProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.profilesTagsByProfilesDelete(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 设置用户标签 */
export function usePostProfilesTagsByProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.profilesTagsByProfilesPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

/** 创建资料版本快照 */
export function usePostProfilesVersionsByProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.profilesVersionsByProfilesPost(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-service'] });
    },
  });
}

// --- rbac-service ---

/** 批准审批请求 */
export function usePostAdminApproval_requestsApproveByApprovalRequests() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string, data: any }) => api.adminApprovalRequestsApproveByApprovalRequestsPost(requestId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 拒绝审批请求 */
export function usePostAdminApproval_requestsRejectByApprovalRequests() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string, data: any }) => api.adminApprovalRequestsRejectByApprovalRequestsPost(requestId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 创建权限 */
export function usePostAdminPermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminPermissionsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 权限模拟/试算 */
export function usePostAdminPermissionsSimulate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminPermissionsSimulatePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 删除权限 */
export function useDeleteAdminPermissionsByPermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (permissionId: string) => api.adminPermissionsByPermissionsDelete(permissionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 更新权限信息 */
export function usePutAdminPermissionsByPermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ permissionId, data }: { permissionId: string, data: any }) => api.adminPermissionsByPermissionsPut(permissionId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 创建角色 */
export function usePostAdminRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminRolesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 批量撤销权限 */
export function useDeleteAdminRolesBatchPermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminRolesBatchPermissionsDelete(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 批量分配权限 */
export function usePostAdminRolesBatchPermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminRolesBatchPermissionsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 创建职责分离（SoD）冲突对 */
export function usePostAdminRolesConflict_pairs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminRolesConflictPairsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 删除职责分离冲突对 */
export function useDeleteAdminRolesConflict_pairsByConflictPairs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pairId: string) => api.adminRolesConflictPairsByConflictPairsDelete(pairId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 添加租户默认角色 */
export function usePostAdminRolesDefaults() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminRolesDefaultsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 移除默认角色 */
export function useDeleteAdminRolesDefaultsByDefaults() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (roleId: string) => api.adminRolesDefaultsByDefaultsDelete(roleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 删除角色 */
export function useDeleteAdminRolesByRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (roleId: string) => api.adminRolesByRolesDelete(roleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 更新角色信息 */
export function usePutAdminRolesByRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string, data: any }) => api.adminRolesByRolesPut(roleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 请求角色变更审批 */
export function usePostAdminRolesApproval_requestsByRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string, data: any }) => api.adminRolesApprovalRequestsByRolesPost(roleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 添加子角色 */
export function usePostAdminRolesChildrenByRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string, data: any }) => api.adminRolesChildrenByRolesPost(roleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 移除子角色 */
export function useDeleteAdminRolesChildrenByRolesByChildren() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, childId }: { roleId: string, childId: string }) => api.adminRolesChildrenByRolesByChildrenDelete(roleId, childId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 克隆角色 */
export function usePostAdminRolesCloneByRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string, data: any }) => api.adminRolesCloneByRolesPost(roleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 撤销角色权限 */
export function useDeleteAdminRolesPermissionsByRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string, data: any }) => api.adminRolesPermissionsByRolesDelete(roleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 为角色分配权限 */
export function usePostAdminRolesPermissionsByRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string, data: any }) => api.adminRolesPermissionsByRolesPost(roleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 批量移除角色 */
export function useDeleteAdminUsersBatchRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminUsersBatchRolesDelete(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 批量分配角色 */
export function usePostAdminUsersBatchRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminUsersBatchRolesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 撤销用户直赋权限 */
export function useDeleteAdminUsersPermissionsByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminUsersPermissionsByUsersDelete(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 为用户直赋权限 */
export function usePostAdminUsersPermissionsByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminUsersPermissionsByUsersPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 移除用户角色 */
export function useDeleteAdminUsersRolesByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminUsersRolesByUsersDelete(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 为用户分配角色 */
export function usePostAdminUsersRolesByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminUsersRolesByUsersPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 验证用户角色冲突 */
export function usePostAdminUsersRolesValidateByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.adminUsersRolesValidateByUsersPost(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 检查用户权限（用户侧） */
export function usePostRbacAuthCheck_permission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authCheckPermissionPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

/** 检查用户角色（用户侧） */
export function usePostRbacAuthCheck_role() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.authCheckRolePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rbac-service'] });
    },
  });
}

// --- saml-service ---

/** 注册SAML IdP */
export function usePostAdminSamlProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminSamlProvidersPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['saml-service'] });
    },
  });
}

/** 删除SAML IdP */
export function useDeleteAdminSamlProvidersByProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (providerId: string) => api.adminSamlProvidersByProvidersDelete(providerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['saml-service'] });
    },
  });
}

/** 更新SAML IdP */
export function usePutAdminSamlProvidersByProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: string, data: any }) => api.adminSamlProvidersByProvidersPut(providerId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['saml-service'] });
    },
  });
}

/** 更新属性映射 */
export function usePutAdminSamlProvidersAttribute_mappingByProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: string, data: any }) => api.adminSamlProvidersAttributeMappingByProvidersPut(providerId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['saml-service'] });
    },
  });
}

/** 删除用户SAML绑定（管理端） */
export function useDeleteAdminSamlUser_linksByUserLinks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userLinkId: string) => api.adminSamlUserLinksByUserLinksDelete(userLinkId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['saml-service'] });
    },
  });
}

/** 断言消费服务 */
export function usePostSamlAcsBySaml() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (providerId: string) => api.samlAcsBySamlPost(providerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['saml-service'] });
    },
  });
}

// --- secret-service ---

/** 创建密钥 */
export function usePostAdminSecrets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminSecretsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secret-service'] });
    },
  });
}

/** 批量删除密钥 */
export function usePostAdminSecretsBatch_delete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminSecretsBatchDeletePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secret-service'] });
    },
  });
}

/** 批量吊销密钥 */
export function usePostAdminSecretsBatch_revoke() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminSecretsBatchRevokePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secret-service'] });
    },
  });
}

/** 删除密钥 */
export function useDeleteAdminSecretsItemKeyByKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => api.adminSecretsItemKeyByKeyDelete(key),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secret-service'] });
    },
  });
}

/** 删除密钥策略 */
export function useDeleteAdminSecretsPolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.adminSecretsPolicyDelete(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secret-service'] });
    },
  });
}

/** 更新密钥策略 */
export function usePutAdminSecretsPolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminSecretsPolicyPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secret-service'] });
    },
  });
}

/** 吊销密钥 */
export function usePostAdminSecretsRevoke() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => api.adminSecretsRevokePost(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secret-service'] });
    },
  });
}

/** 轮换密钥 */
export function usePostAdminSecretsRotate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, params }: { data: any, params: any }) => api.adminSecretsRotatePost(data, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secret-service'] });
    },
  });
}

/** 更新密钥元数据 */
export function usePostAdminSecretsUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, params }: { data: any, params: any }) => api.adminSecretsUpdatePost(data, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secret-service'] });
    },
  });
}

/** 获取版本密钥值 */
export function usePostAdminSecretsVersionsValue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, params }: { data: any, params: any }) => api.adminSecretsVersionsValuePost(data, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secret-service'] });
    },
  });
}

// --- session-service ---

/** 批量撤销会话 */
export function useDeleteAdminSessionsBulk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminSessionsBulkDelete(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 清理过期会话 */
export function useDeleteAdminSessionsExpired() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.adminSessionsExpiredDelete(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 撤销用户所有会话 */
export function useDeleteAdminSessionsUserByUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminSessionsUserByUserDelete(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 删除黑名单令牌 */
export function useDeleteAdminTokensBlacklistByBlacklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => api.adminTokensBlacklistByBlacklistDelete(deviceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 重置租户级JWT配置 */
export function useDeleteAdminTokensConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.adminTokensConfigDelete(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 更新租户级JWT配置 */
export function usePutAdminTokensConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminTokensConfigPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 令牌交换 */
export function usePostAdminTokensExchange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminTokensExchangePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 令牌自省 */
export function usePostAdminTokensIntrospect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminTokensIntrospectPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 撤销所有令牌 */
export function usePostAdminTokensRevoke_all() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminTokensRevokeAllPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** Admin revoke trusted device */
export function useDeleteAdminTrusted_devicesByTrustedDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => api.adminTrustedDevicesByTrustedDevicesDelete(deviceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 创建会话 */
export function usePostSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.sessionsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 刷新令牌 */
export function usePostSessionsRefresh() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.sessionsRefreshPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 旋转访问令牌 */
export function usePostSessionsRotate_access() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.sessionsRotateAccessPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 撤销会话 */
export function useDeleteSessionsBySessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string, data: any }) => api.sessionsBySessionsDelete(sessionId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 更新会话活动时间 */
export function usePostSessionsActivityBySessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => api.sessionsActivityBySessionsPost(sessionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 升级会话MFA验证状态 */
export function usePostSessionsUpgrade_mfaBySessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => api.sessionsUpgradeMfaBySessionsPost(sessionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 验证会话有效性 */
export function usePostSessionsValidateBySessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => api.sessionsValidateBySessionsPost(sessionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** 将令牌加入黑名单 */
export function usePostTokensBlacklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.tokensBlacklistPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** Trust device */
export function usePostTrusted_devices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.trustedDevicesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

/** Revoke my trusted device */
export function useDeleteTrusted_devicesByTrustedDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => api.trustedDevicesByTrustedDevicesDelete(deviceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-service'] });
    },
  });
}

// --- status-service ---

/** 创建事件 */
export function usePostStatusIncidents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.statusIncidentsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['status-service'] });
    },
  });
}

/** 删除事件 */
export function useDeleteStatusIncidentsByIncidents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (incidentId: string) => api.statusIncidentsByIncidentsDelete(incidentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['status-service'] });
    },
  });
}

/** 更新事件 */
export function usePutStatusIncidentsByIncidents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ incidentId, data }: { incidentId: string, data: any }) => api.statusIncidentsByIncidentsPut(incidentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['status-service'] });
    },
  });
}

/** 添加事件进展更新 */
export function usePostStatusIncidentsUpdatesByIncidents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ incidentId, data }: { incidentId: string, data: any }) => api.statusIncidentsUpdatesByIncidentsPost(incidentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['status-service'] });
    },
  });
}

/** 创建维护预告 */
export function usePostStatusMaintenances() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.statusMaintenancesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['status-service'] });
    },
  });
}

/** 删除维护预告 */
export function useDeleteStatusMaintenancesByMaintenances() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (maintenanceId: string) => api.statusMaintenancesByMaintenancesDelete(maintenanceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['status-service'] });
    },
  });
}

/** 更新维护预告 */
export function usePutStatusMaintenancesByMaintenances() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ maintenanceId, data }: { maintenanceId: string, data: any }) => api.statusMaintenancesByMaintenancesPut(maintenanceId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['status-service'] });
    },
  });
}

/** 取消订阅 */
export function useDeleteStatusSubscriptions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.statusSubscriptionsDelete(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['status-service'] });
    },
  });
}

/** 订阅状态通知 */
export function usePostStatusSubscriptions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.statusSubscriptionsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['status-service'] });
    },
  });
}

/** 更新订阅通知偏好 */
export function usePutStatusSubscriptionsPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.statusSubscriptionsPreferencesPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['status-service'] });
    },
  });
}

/** 验证订阅邮箱 */
export function usePostStatusSubscriptionsVerify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => api.statusSubscriptionsVerifyPost(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['status-service'] });
    },
  });
}

// --- storage-service ---

/** 管理员创建存储桶 */
export function usePostAdminStorageBuckets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminStorageBucketsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 管理员删除存储桶 */
export function useDeleteAdminStorageBucketsByBuckets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.adminStorageBucketsByBucketsDelete(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 管理员更新存储桶 */
export function usePutAdminStorageBucketsByBuckets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, data }: { name: string, data: any }) => api.adminStorageBucketsByBucketsPut(name, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 管理员清理过期pending上传 */
export function usePostAdminStorageClean_stale_uploads() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => api.adminStorageCleanStaleUploadsPost(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 管理员配置数据保留策略 */
export function usePostAdminStorageData_retention_policy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminStorageDataRetentionPolicyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 管理员更新存储配额 */
export function usePutAdminStorageQuota() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminStorageQuotaPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 上传文件 */
export function usePostFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.filesPost(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 批量下载（ZIP打包） */
export function usePostFilesBatch_download() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.filesBatchDownloadPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 批量删除（旧版兼容） */
export function usePostFilesBulk_deletions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.filesBulkDeletionsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 批量上传准备 */
export function usePostFilesBulk_uploads() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.filesBulkUploadsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 初始化分片上传 */
export function usePostFilesMultipartInit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.filesMultipartInitPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 中止分片上传 */
export function useDeleteFilesMultipartByMultipart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => api.filesMultipartByMultipartDelete(fileId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 完成分片上传 */
export function usePostFilesMultipartCompleteByMultipart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => api.filesMultipartCompleteByMultipartPost(fileId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 获取上传预签名URL */
export function usePostFilesUpload_url() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.filesUploadUrlPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 删除文件 */
export function useDeleteFilesByFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => api.filesByFilesDelete(fileId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 更新文件 */
export function usePatchFilesByFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, data }: { fileId: string, data: any }) => api.filesByFilesPatch(fileId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 复制文件 */
export function usePostFilesCopyByFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, data }: { fileId: string, data: any }) => api.filesCopyByFilesPost(fileId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 移动文件 */
export function usePostFilesMoveByFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, data }: { fileId: string, data: any }) => api.filesMoveByFilesPost(fileId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 取消分享链接 */
export function useDeleteFilesShareByFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, params }: { fileId: string, params: any }) => api.filesShareByFilesDelete(fileId, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 创建分享链接 */
export function usePostFilesShareByFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, data }: { fileId: string, data: any }) => api.filesShareByFilesPost(fileId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 上传完成确认 */
export function usePostFilesUpload_completeByFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => api.filesUploadCompleteByFilesPost(fileId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 恢复文件版本 */
export function usePostFilesVersionsRestoreByFilesByVersions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, versionId }: { fileId: string, versionId: string }) => api.filesVersionsRestoreByFilesByVersionsPost(fileId, versionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 更新文件可见性 */
export function usePatchFilesVisibilityByFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, data }: { fileId: string, data: any }) => api.filesVisibilityByFilesPatch(fileId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 添加水印 */
export function usePostFilesWatermarkByFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, data }: { fileId: string, data: any }) => api.filesWatermarkByFilesPost(fileId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 创建文件夹 */
export function usePostFolders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.foldersPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 批量删除文件/文件夹 */
export function usePostStorageBatch_delete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.storageBatchDeletePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 批量移动文件/文件夹 */
export function usePostStorageBatch_move() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.storageBatchMovePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** Storage API 创建文件夹 */
export function usePostStorageFolders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.storageFoldersPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 删除文件夹 */
export function useDeleteStorageFoldersByFolders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (folderId: string) => api.storageFoldersByFoldersDelete(folderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 更新文件夹 */
export function usePatchStorageFoldersByFolders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ folderId, data }: { folderId: string, data: any }) => api.storageFoldersByFoldersPatch(folderId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 清空回收站 */
export function useDeleteStorageTrash() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.storageTrashDelete(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 从回收站永久删除 */
export function useDeleteStorageTrashByTrash() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (trashId: string) => api.storageTrashByTrashDelete(trashId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

/** 从回收站恢复文件 */
export function usePostStorageTrashRestoreByTrash() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (trashId: string) => api.storageTrashRestoreByTrashPost(trashId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage-service'] });
    },
  });
}

// --- tenant-service ---

/** 创建租户 */
export function usePostAdminTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminTenantsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 删除租户 */
export function useDeleteAdminTenantsByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tenantId: string) => api.adminTenantsByTenantsDelete(tenantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新租户信息 */
export function usePutAdminTenantsByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsByTenantsPut(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 激活租户 */
export function usePostAdminTenantsActivateByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tenantId: string) => api.adminTenantsActivateByTenantsPost(tenantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 创建租户 API Key */
export function usePostAdminTenantsApi_keysByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsApiKeysByTenantsPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 吊销租户 API Key */
export function useDeleteAdminTenantsApi_keysByTenantsByApiKeys() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, keyId }: { tenantId: string, keyId: string }) => api.adminTenantsApiKeysByTenantsByApiKeysDelete(tenantId, keyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 轮换租户 API Key */
export function usePostAdminTenantsApi_keysRotateByTenantsByApiKeys() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, keyId }: { tenantId: string, keyId: string }) => api.adminTenantsApiKeysRotateByTenantsByApiKeysPost(tenantId, keyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 创建自定义应用类型 */
export function usePostAdminTenantsApp_typesByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsAppTypesByTenantsPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 删除应用类型 */
export function useDeleteAdminTenantsApp_typesByTenantsByAppTypes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, typeId }: { tenantId: string, typeId: string }) => api.adminTenantsAppTypesByTenantsByAppTypesDelete(tenantId, typeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新应用类型 */
export function usePutAdminTenantsApp_typesByTenantsByAppTypes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, typeId, data }: { tenantId: string, typeId: string, data: any }) => api.adminTenantsAppTypesByTenantsByAppTypesPut(tenantId, typeId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 创建应用 */
export function usePostAdminTenantsApplicationsByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsApplicationsByTenantsPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 删除应用 */
export function useDeleteAdminTenantsApplicationsByTenantsByApplications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId, params }: { tenantId: string, appId: string, params: any }) => api.adminTenantsApplicationsByTenantsByApplicationsDelete(tenantId, appId, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新应用 */
export function usePutAdminTenantsApplicationsByTenantsByApplications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId, data }: { tenantId: string, appId: string, data: any }) => api.adminTenantsApplicationsByTenantsByApplicationsPut(tenantId, appId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 激活应用 */
export function usePostAdminTenantsApplicationsActivateByTenantsByApplications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId }: { tenantId: string, appId: string }) => api.adminTenantsApplicationsActivateByTenantsByApplicationsPost(tenantId, appId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 分配用户应用角色 */
export function usePostAdminTenantsApplicationsMembersByTenantsByApplications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId, data }: { tenantId: string, appId: string, data: any }) => api.adminTenantsApplicationsMembersByTenantsByApplicationsPost(tenantId, appId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 撤销用户应用角色 */
export function useDeleteAdminTenantsApplicationsMembersByTenantsByApplicationsByMembers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId, roleId }: { tenantId: string, appId: string, roleId: string }) => api.adminTenantsApplicationsMembersByTenantsByApplicationsByMembersDelete(tenantId, appId, roleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新用户应用角色 */
export function usePutAdminTenantsApplicationsMembersByTenantsByApplicationsByMembers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId, roleId, data }: { tenantId: string, appId: string, roleId: string, data: any }) => api.adminTenantsApplicationsMembersByTenantsByApplicationsByMembersPut(tenantId, appId, roleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 创建应用默认角色 */
export function usePostAdminTenantsApplicationsRolesByTenantsByApplications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId, data }: { tenantId: string, appId: string, data: any }) => api.adminTenantsApplicationsRolesByTenantsByApplicationsPost(tenantId, appId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 删除应用默认角色 */
export function useDeleteAdminTenantsApplicationsRolesByTenantsByApplicationsByRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId, roleId }: { tenantId: string, appId: string, roleId: string }) => api.adminTenantsApplicationsRolesByTenantsByApplicationsByRolesDelete(tenantId, appId, roleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新应用默认角色 */
export function usePutAdminTenantsApplicationsRolesByTenantsByApplicationsByRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId, roleId, data }: { tenantId: string, appId: string, roleId: string, data: any }) => api.adminTenantsApplicationsRolesByTenantsByApplicationsByRolesPut(tenantId, appId, roleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 暂停应用 */
export function usePostAdminTenantsApplicationsSuspendByTenantsByApplications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId, data }: { tenantId: string, appId: string, data: any }) => api.adminTenantsApplicationsSuspendByTenantsByApplicationsPost(tenantId, appId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新认证策略 */
export function usePutAdminTenantsAuth_policyByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsAuthPolicyByTenantsPut(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新品牌配置 */
export function usePutAdminTenantsBrandingByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsBrandingByTenantsPut(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新租户数据分类分级 */
export function usePostAdminTenantsData_classificationByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsDataClassificationByTenantsPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 创建部门 */
export function usePostAdminTenantsDepartmentsByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsDepartmentsByTenantsPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 删除部门 */
export function useDeleteAdminTenantsDepartmentsByTenantsByDepartments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, deptId }: { tenantId: string, deptId: string }) => api.adminTenantsDepartmentsByTenantsByDepartmentsDelete(tenantId, deptId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新部门 */
export function usePutAdminTenantsDepartmentsByTenantsByDepartments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, deptId, data }: { tenantId: string, deptId: string, data: any }) => api.adminTenantsDepartmentsByTenantsByDepartmentsPut(tenantId, deptId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 添加域名 */
export function usePostAdminTenantsDomainsByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsDomainsByTenantsPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 删除域名 */
export function useDeleteAdminTenantsDomainsByTenantsByDomains() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, domain }: { tenantId: string, domain: string }) => api.adminTenantsDomainsByTenantsByDomainsDelete(tenantId, domain),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新邀请配置 */
export function usePutAdminTenantsInvitation_configByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsInvitationConfigByTenantsPut(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 删除邀请 */
export function useDeleteAdminTenantsInvitationsByTenantsByInvitations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, inviteId }: { tenantId: string, inviteId: string }) => api.adminTenantsInvitationsByTenantsByInvitationsDelete(tenantId, inviteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 重新发送邀请 */
export function usePostAdminTenantsInvitationsResendByTenantsByInvitations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, inviteId }: { tenantId: string, inviteId: string }) => api.adminTenantsInvitationsResendByTenantsByInvitationsPost(tenantId, inviteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 撤销邀请 */
export function usePostAdminTenantsInvitationsRevokeByTenantsByInvitations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, inviteId }: { tenantId: string, inviteId: string }) => api.adminTenantsInvitationsRevokeByTenantsByInvitationsPost(tenantId, inviteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 添加成员 */
export function usePostAdminTenantsMembersByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsMembersByTenantsPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 批量审批成员 */
export function usePostAdminTenantsMembersBatch_approveByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsMembersBatchApproveByTenantsPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 批量导入成员 */
export function usePostAdminTenantsMembersBulk_importByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsMembersBulkImportByTenantsPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 邀请成员 */
export function usePostAdminTenantsMembersInviteByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsMembersInviteByTenantsPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 移除成员 */
export function useDeleteAdminTenantsMembersByTenantsByMembers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, memberId }: { tenantId: string, memberId: string }) => api.adminTenantsMembersByTenantsByMembersDelete(tenantId, memberId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新成员信息 */
export function usePutAdminTenantsMembersByTenantsByMembers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, memberId, data }: { tenantId: string, memberId: string, data: any }) => api.adminTenantsMembersByTenantsByMembersPut(tenantId, memberId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 通过成员审批 */
export function usePostAdminTenantsMembersApproveByTenantsByMembers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, memberId, data }: { tenantId: string, memberId: string, data: any }) => api.adminTenantsMembersApproveByTenantsByMembersPost(tenantId, memberId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 拒绝成员审批 */
export function usePostAdminTenantsMembersRejectByTenantsByMembers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, memberId, data }: { tenantId: string, memberId: string, data: any }) => api.adminTenantsMembersRejectByTenantsByMembersPost(tenantId, memberId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新未成年人保护配置 */
export function usePutAdminTenantsMinors_protectionByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsMinorsProtectionByTenantsPut(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新组织架构图 */
export function usePostAdminTenantsOrg_chartByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsOrgChartByTenantsPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新资源配额 */
export function usePutAdminTenantsQuotaByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsQuotaByTenantsPut(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新安全策略 */
export function usePutAdminTenantsSecurity_policyByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsSecurityPolicyByTenantsPut(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 暂停租户 */
export function usePostAdminTenantsSuspendByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tenantId: string) => api.adminTenantsSuspendByTenantsPost(tenantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 创建 Webhook */
export function usePostAdminTenantsWebhooksByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string, data: any }) => api.adminTenantsWebhooksByTenantsPost(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 删除 Webhook */
export function useDeleteAdminTenantsWebhooksByTenantsByWebhooks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, hookId }: { tenantId: string, hookId: string }) => api.adminTenantsWebhooksByTenantsByWebhooksDelete(tenantId, hookId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 更新 Webhook */
export function usePutAdminTenantsWebhooksByTenantsByWebhooks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, hookId, data }: { tenantId: string, hookId: string, data: any }) => api.adminTenantsWebhooksByTenantsByWebhooksPut(tenantId, hookId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 重试投递 */
export function usePostAdminTenantsWebhooksDeliveriesRetryByTenantsByWebhooksByDeliveries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, hookId, deliveryId }: { tenantId: string, hookId: string, deliveryId: string }) => api.adminTenantsWebhooksDeliveriesRetryByTenantsByWebhooksByDeliveriesPost(tenantId, hookId, deliveryId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 轮换签名密钥 */
export function usePostAdminTenantsWebhooksRotate_secretByTenantsByWebhooks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, hookId }: { tenantId: string, hookId: string }) => api.adminTenantsWebhooksRotateSecretByTenantsByWebhooksPost(tenantId, hookId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 测试 Webhook */
export function usePostAdminTenantsWebhooksTestByTenantsByWebhooks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, hookId }: { tenantId: string, hookId: string }) => api.adminTenantsWebhooksTestByTenantsByWebhooksPost(tenantId, hookId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 接受邀请 */
export function usePostInvitationsAcceptByInvitations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ token, data }: { token: string, data: any }) => api.invitationsAcceptByInvitationsPost(token, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 公开注册试用租户 */
export function usePostTenant_publicTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.tenantPublicTenantsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

/** 删除试用租户 */
export function useDeleteTenant_publicTenantsByTenants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => api.tenantPublicTenantsByTenantsDelete(slug),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-service'] });
    },
  });
}

// --- verification-service ---

/** 管理员解除监护关系 */
export function useDeleteAdminVerificationsGuardians() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminVerificationsGuardiansDelete(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 创建提供方配置 */
export function usePostAdminVerificationsProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminVerificationsProvidersPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 删除提供方配置 */
export function useDeleteAdminVerificationsProvidersByProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (providerConfigId: string) => api.adminVerificationsProvidersByProvidersDelete(providerConfigId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 更新提供方配置 */
export function usePutAdminVerificationsProvidersByProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ providerConfigId, data }: { providerConfigId: string, data: any }) => api.adminVerificationsProvidersByProvidersPut(providerConfigId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 转入人工审核 */
export function usePostAdminVerificationsManual_reviewByVerifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ verificationId, data }: { verificationId: string, data: any }) => api.adminVerificationsManualReviewByVerificationsPost(verificationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 人工覆盖认证状态 */
export function usePostAdminVerificationsOverrideByVerifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ verificationId, data }: { verificationId: string, data: any }) => api.adminVerificationsOverrideByVerificationsPost(verificationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 重置重试计数 */
export function usePostAdminVerificationsResetByVerifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (verificationId: string) => api.adminVerificationsResetByVerificationsPost(verificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 解决人工审核 */
export function usePostAdminVerificationsResolve_reviewByVerifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ verificationId, data }: { verificationId: string, data: any }) => api.adminVerificationsResolveReviewByVerificationsPost(verificationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 授权同意 */
export function usePostVerificationConsent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, params }: { data: any, params: any }) => api.verificationConsentPost(data, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 解除监护关系 */
export function useDeleteVerificationGuardians() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.verificationGuardiansDelete(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 创建监护关系 */
export function usePostVerificationGuardians() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.verificationGuardiansPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 更新监护关系 */
export function usePutVerificationGuardiansByGuardians() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ guardianId, data }: { guardianId: string, data: any }) => api.verificationGuardiansByGuardiansPut(guardianId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 监护人授权同意 */
export function usePostVerificationGuardiansConsentByGuardians() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ guardianId, data }: { guardianId: string, data: any }) => api.verificationGuardiansConsentByGuardiansPost(guardianId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 监护人身份验证 */
export function usePostVerificationGuardiansVerifyByGuardians() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (guardianId: string) => api.verificationGuardiansVerifyByGuardiansPost(guardianId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 开始活体检测 */
export function usePostVerificationLivenessBegin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.verificationLivenessBeginPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 完成活体检测 */
export function usePostVerificationLivenessVerify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.verificationLivenessVerifyPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 设置未成年人保护配置 */
export function usePutVerificationMinorsProtection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.verificationMinorsProtectionPut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 提交OCR识别 */
export function usePostVerificationOcr() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.verificationOcrPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

/** 提交身份核验 */
export function usePostVerificationVerify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, params }: { data: any, params: any }) => api.verificationVerifyPost(data, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['verification-service'] });
    },
  });
}

// --- wallet-service ---

/** 创建钱包 */
export function usePostAdminWallets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminWalletsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 批量冻结 */
export function usePostAdminWalletsBatch_freeze() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminWalletsBatchFreezePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 批量解冻 */
export function usePostAdminWalletsBatch_unfreeze() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminWalletsBatchUnfreezePost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 创建优惠券 */
export function usePostAdminWalletsCoupons() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminWalletsCouponsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 删除优惠券 */
export function useDeleteAdminWalletsCouponsByCoupons() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (couponId: string) => api.adminWalletsCouponsByCouponsDelete(couponId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 更新优惠券 */
export function usePutAdminWalletsCouponsByCoupons() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ couponId, data }: { couponId: string, data: any }) => api.adminWalletsCouponsByCouponsPut(couponId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 更新反欺诈规则 */
export function usePostAdminWalletsFraud_rules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.adminWalletsFraudRulesPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 删除反欺诈规则 */
export function useDeleteAdminWalletsFraud_rulesByFraudRules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fraudRuleId: string) => api.adminWalletsFraudRulesByFraudRulesDelete(fraudRuleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 删除冻结记录 */
export function useDeleteAdminWalletsFreeze_recordsByFreezeRecords() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (freezeRecordId: string) => api.adminWalletsFreezeRecordsByFreezeRecordsDelete(freezeRecordId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 删除钱包策略 */
export function useDeleteAdminWalletsTenantsAppsPolicyByTenantsByApps() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId }: { tenantId: string, appId: string }) => api.adminWalletsTenantsAppsPolicyByTenantsByAppsDelete(tenantId, appId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 更新钱包策略 */
export function usePutAdminWalletsTenantsAppsPolicyByTenantsByApps() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, appId, data }: { tenantId: string, appId: string, data: any }) => api.adminWalletsTenantsAppsPolicyByTenantsByAppsPut(tenantId, appId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 争议处理 */
export function usePostAdminWalletsTenantsDisputesResolveByTenantsByDisputes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, disputeId, data }: { tenantId: string, disputeId: string, data: any }) => api.adminWalletsTenantsDisputesResolveByTenantsByDisputesPost(tenantId, disputeId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 手动调账 */
export function usePostAdminWalletsUsersAdjustByUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.adminWalletsUsersAdjustByUsersPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 审批提现 */
export function usePostAdminWalletsWithdrawalsApproveByWithdrawals() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ withdrawalId, data }: { withdrawalId: string, data: any }) => api.adminWalletsWithdrawalsApproveByWithdrawalsPost(withdrawalId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 拒绝提现 */
export function usePostAdminWalletsWithdrawalsRejectByWithdrawals() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ withdrawalId, data }: { withdrawalId: string, data: any }) => api.adminWalletsWithdrawalsRejectByWithdrawalsPost(withdrawalId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 删除钱包 */
export function useDeleteAdminWalletsByWallets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (walletId: string) => api.adminWalletsByWalletsDelete(walletId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 更新钱包 */
export function usePutAdminWalletsByWallets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ walletId, data }: { walletId: string, data: any }) => api.adminWalletsByWalletsPut(walletId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 执行兑换 */
export function usePostExchange_ratesConvert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.exchangeRatesConvertPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 创建钱包 */
export function usePostWallets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.walletsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 创建优惠券 */
export function usePostWalletsCoupons() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.walletsCouponsPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 余额快照 */
export function usePostWalletsSnapshot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.walletsSnapshotPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 取消交易 */
export function usePostWalletsTransactionsCancelByTransactions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ transactionId, data }: { transactionId: string, data: any }) => api.walletsTransactionsCancelByTransactionsPost(transactionId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 交易争议 */
export function usePostWalletsTransactionsDisputeByTransactions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ transactionId, data }: { transactionId: string, data: any }) => api.walletsTransactionsDisputeByTransactionsPost(transactionId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 钱包转账 */
export function usePostWalletsTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.walletsTransferPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 兑换优惠券 */
export function usePostWalletsCouponsRedeemByWalletsByCoupons() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, code, params }: { userId: string, code: string, params: any }) => api.walletsCouponsRedeemByWalletsByCouponsPost(userId, code, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 钱包充值 */
export function usePostWalletsDepositByWallets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.walletsDepositByWalletsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 冻结资金 */
export function usePostWalletsFreezeByWallets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.walletsFreezeByWalletsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 钱包退款 */
export function usePostWalletsRefundByWallets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.walletsRefundByWalletsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 解冻资金 */
export function usePostWalletsUnfreezeByWallets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.walletsUnfreezeByWalletsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 钱包提现 */
export function usePostWalletsWithdrawByWallets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.walletsWithdrawByWalletsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}

/** 申请提现 */
export function usePostWalletsWithdrawRequestByWallets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) => api.walletsWithdrawRequestByWalletsPost(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet-service'] });
    },
  });
}
