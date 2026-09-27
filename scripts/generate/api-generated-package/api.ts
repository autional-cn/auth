// Auto-generated from swagger.json annotations
// DO NOT EDIT — run `python scripts/generate_api_ts.py` to regenerate
// Generated: 2026-06-28 03:14:03

// @ts-nocheck — auto-generated; validated by check-generated-api.py
import type * as Types from './types';
import { apiClient as api } from '@autional-cn/shared';

// ============================================================
// Audit Service
// ============================================================

/**
 * 获取告警列表
 * 分页查询告警记录，支持按类型、严重程度、状态、租户筛选。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditAlerts(params?: {
  type?: string;  // 告警类型
  severity?: string;  // 严重程度: low/medium/high/critical
  status?: string;  // 状态: open/acknowledged/escalated/resolved/dismissed
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/alerts`, { params });
  return res.data;
}

/**
 * 获取告警详情
 * 根据告警ID获取完整告警信息。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditAlertsByAlerts(alertId: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/alerts/${alertId}`);
  return res.data;
}

/**
 * 分配告警处理人
 * 将告警分配给指定处理人。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditAlertsAssignByAlertsPost(alertId: string, data: AssignAlertRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/alerts/${alertId}/assign`, data);
  return res.data;
}

/**
 * 更新告警状态
 * 更新告警状态（acknowledge/resolve/dismiss/escalate），状态转移受工作流约束。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditAlertsStatusByAlertsPut(alertId: string, data: UpdateAlertStatusRequest) {
  const res = await api.put(`/audit/api/v1/admin/audit/alerts/${alertId}/status`, data);
  return res.data;
}

/**
 * 获取审计异常列表
 * 分页查询审计异常检测记录，支持按类型、严重程度、状态筛选。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditAnomalies(params?: {
  type?: string;  // 异常类型
  severity?: string;  // 严重程度: low/medium/high/critical
  status?: string;  // 状态: open/investigating/resolved/false_positive
  tenant_id?: string;  // 租户ID
  time_range?: string;  // 时间范围: 1h/24h/7d/30d
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/anomalies`, { params });
  return res.data;
}

/**
 * 触发异常检测
 * 手动触发异常检测扫描，检测指定时间范围内的异常行为。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditAnomaliesDetectPost(data: Record<string, unknown>) {
  const res = await api.post(`/audit/api/v1/admin/audit/anomalies/detect`, data);
  return res.data;
}

/**
 * 获取异常详情
 * 根据 ID 获取单条审计异常的完整信息，包含关联日志、用户信息、时间线摘要。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditAnomaliesByAnomalies(anomalyId: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/anomalies/${anomalyId}`);
  return res.data;
}

/**
 * 分配异常分析师
 * 将异常分配给指定的安全分析师进行后续调查。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditAnomaliesAssignByAnomaliesPost(anomalyId: string, data: AssignAnomalyRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/assign`, data);
  return res.data;
}

/**
 * 添加异常调查评论
 * 为异常记录添加调查评论/备注，记录分析师的分析过程。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditAnomaliesCommentByAnomaliesPost(anomalyId: string, data: AddAnomalyCommentRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/comment`, data);
  return res.data;
}

/**
 * 关联异常到案件
 * 将审计异常关联到指定的安全案件/工单。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditAnomaliesLinkByAnomaliesPost(anomalyId: string, data: LinkAnomalyRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/link`, data);
  return res.data;
}

/**
 * 获取关联异常
 * 获取与指定异常相关的其他异常（同一用户 7 天内的异常记录）。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditAnomaliesRelatedByAnomalies(anomalyId: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/related`);
  return res.data;
}

/**
 * 更新异常状态
 * 更新审计异常状态 (open/acknowledged/investigating/resolved/dismissed)，支持同步分配分析师。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditAnomaliesStatusByAnomaliesPut(anomalyId: string, data: UpdateAnomalyStatusRequest) {
  const res = await api.put(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/status`, data);
  return res.data;
}

/**
 * 获取异常事件时间线
 * 获取异常关联的用户/会话/设备事件时间线（±24h 窗口内按时间排列的审计日志）。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditAnomaliesTimelineByAnomalies(anomalyId: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/timeline`);
  return res.data;
}

/**
 * 归档审计日志
 * 将指定时间之前的审计日志归档以释放存储空间，支持自动归档策略配置。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditArchivePost(data: Record<string, unknown>) {
  const res = await api.post(`/audit/api/v1/admin/audit/archive`, data);
  return res.data;
}

/**
 * 获取归档状态
 * 查看当前归档任务的状态和进度。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditArchiveStatus() {
  const res = await api.get(`/audit/api/v1/admin/audit/archive/status`);
  return res.data;
}

/**
 * 查询计费事件审计日志
 * 按租户和事件类型查询计费相关的审计日志。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditBillingEvents(params?: {
  tenant_id?: string;  // 租户ID
  event_type?: string;  // 事件类型，如 billing.subscription_created
  start_time?: number;  // 开始时间戳
  end_time?: number;  // 结束时间戳
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/billing-events`, { params });
  return res.data;
}

/**
 * 列表查询AI决策
 * 分页查询当前租户的所有AI决策审计记录，包含模型名称、决策ID和审查状态。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditComplianceAiDecisions() {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/ai-decisions`);
  return res.data;
}

/**
 * 记录AI决策
 * 创建新的AI决策审计记录，记录AI模型名称、决策类型、输入和输出数据。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditComplianceAiDecisionsPost(data: RecordAIDecisionRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/compliance/ai-decisions`, data);
  return res.data;
}

/**
 * 查询AI决策详情
 * 根据记录ID获取单条AI决策审计记录的详细信息。参考：ISO 27001:2022 Annex A.12.4、PCI DSS v4.0 Req 10。
 */
export async function adminAuditComplianceAiDecisionsByAiDecisions(id: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/ai-decisions/${id}`);
  return res.data;
}

/**
 * 列表查询违规通知
 * 分页查询当前租户的所有数据泄露通知记录，包含违规标题、严重程度和受影响用户数。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditComplianceBreaches() {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/breaches`);
  return res.data;
}

/**
 * 创建违规通知
 * 创建新的数据泄露通知记录，记录违规标题、严重程度和受影响用户数。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditComplianceBreachesPost(data: CreateBreachNotificationRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/compliance/breaches`, data);
  return res.data;
}

/**
 * 查询违规通知详情
 * 根据记录ID获取单条数据泄露通知的详细信息。参考：ISO 27001:2022 Annex A.12.4、PCI DSS v4.0 Req 10。
 */
export async function adminAuditComplianceBreachesByBreaches(id: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/breaches/${id}`);
  return res.data;
}

/**
 * 列表查询清理记录
 * 分页查询当前租户的所有数据清理记录，查看记录类型、清理数量和清理周期。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditComplianceCleanupRecords() {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/cleanup-records`);
  return res.data;
}

/**
 * 创建清理记录
 * 创建新的数据清理记录，记录清理类型、清理数量和清理周期。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditComplianceCleanupRecordsPost(data: CreateCleanupRecordRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/compliance/cleanup-records`, data);
  return res.data;
}

/**
 * 查询清理记录详情
 * 根据记录ID获取单条数据清理记录的详细信息。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditComplianceCleanupRecordsByCleanupRecords(connectorId: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/cleanup-records/${connectorId}`);
  return res.data;
}

/**
 * 列表查询跨境传输
 * 分页查询当前租户的所有跨境数据传输记录，查看数据类型、来源国、目标国和处理目的。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditComplianceCrossBorder() {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/cross-border`);
  return res.data;
}

/**
 * 创建跨境传输记录
 * 创建新的跨境数据传输记录，指定数据类型、来源国、目标国、处理目的及安全保护措施。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditComplianceCrossBorderPost(data: CreateCrossBorderTransferRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/compliance/cross-border`, data);
  return res.data;
}

/**
 * 查询跨境传输详情
 * 根据记录ID获取单条跨境数据传输记录的详细信息。参考：ISO 27001:2022 Annex A.12.4、PCI DSS v4.0 Req 10。
 */
export async function adminAuditComplianceCrossBorderByCrossBorder(id: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/cross-border/${id}`);
  return res.data;
}

/**
 * 列表查询数据分类
 * 分页查询当前租户的所有数据分类分级记录，查看数据集名称、分级层级和描述。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditComplianceDataClassifications() {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/data-classifications`);
  return res.data;
}

/**
 * 创建数据分类
 * 创建新的数据分类分级记录，定义数据集名称、分级层级（如公开/内部/机密）和描述。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditComplianceDataClassificationsPost(data: CreateDataClassificationRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/compliance/data-classifications`, data);
  return res.data;
}

/**
 * 查询数据分类详情
 * 根据记录ID获取单条数据分类分级的详细信息。参考：ISO 27001:2022 Annex A.12.4、PCI DSS v4.0 Req 10。
 */
export async function adminAuditComplianceDataClassificationsByDataClassifications(id: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/data-classifications/${id}`);
  return res.data;
}

/**
 * 列表查询 PIA
 * 分页查询当前租户的所有隐私影响评估（PIA）记录，返回评估名称、描述、数据类型、处理目的及风险等级。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditCompliancePias() {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/pias`);
  return res.data;
}

/**
 * 创建 PIA
 * 创建新的隐私影响评估记录，填写评估名称、涉及数据类型、处理目的和风险等级。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditCompliancePiasPost(data: CreatePIARequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/compliance/pias`, data);
  return res.data;
}

/**
 * 查询 PIA 详情
 * 根据记录ID获取单条隐私影响评估（PIA）的详细信息。参考：ISO 27001:2022 Annex A.12.4、PCI DSS v4.0 Req 10。
 */
export async function adminAuditCompliancePiasByPias(id: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/pias/${id}`);
  return res.data;
}

/**
 * 查询角色操作映射
 * 查询全局角色操作权限映射表，返回各角色对应的允许操作列表。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditComplianceRoleActions() {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/role-actions`);
  return res.data;
}

/**
 * 查询SoD规则
 * 查询当前租户的所有职责分离规则，用于防止利益冲突和权限滥用。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditComplianceSodRules() {
  const res = await api.get(`/audit/api/v1/admin/audit/compliance/sod-rules`);
  return res.data;
}

/**
 * 导出审计日志
 * 创建审计日志导出任务，支持 CSV 和 JSON 格式。异步模式：创建任务后返回 pending 状态的 job_id，通过 /export/{job_id}/status 查询进度，完成后通过 /export/{job_id}/download 获取下载链接。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditExportPost(data: ExportJobRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/export`, data);
  return res.data;
}

/**
 * 列出导出任务
 * 分页查询租户的审计日志导出任务。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditExportJobs(params?: {
  tenant_id?: string;  // 租户ID
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/export/jobs`, { params });
  return res.data;
}

/**
 * 下载导出文件
 * 下载指定导出任务的文件内容。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditExportDownloadByExport(jobId: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/export/${jobId}/download`);
  return res.data;
}

/**
 * 获取导出任务状态
 * 查询指定导出任务的当前状态。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditExportStatusByExport(jobId: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/export/${jobId}/status`);
  return res.data;
}

/**
 * 获取哈希链信息
 * 获取指定租户的审计日志哈希链的详细信息，用于防篡改完整性验证。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditHashchainByHashchain(tenantId: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/hashchain/${tenantId}`);
  return res.data;
}

/**
 * 按日期范围验证哈希链
 * 对指定租户在日期范围内的审计日志哈希链进行完整性验证。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditHashchainVerifyByDateByHashchain(tenantId: string, params?: {
  start_date?: string;  // 开始日期(YYYY-MM-DD)
  end_date?: string;  // 结束日期(YYYY-MM-DD)
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/hashchain/${tenantId}/verify-by-date`, { params });
  return res.data;
}

/**
 * 获取安全事件列表
 * 分页查询安全事件记录，支持按状态、严重程度、关键词筛选。参考：NIST SP 800-61 Rev.2 (Incident Handling)。
 */
export async function adminAuditIncidents(params?: {
  status?: string;  // 状态筛选: open/investigating/contained/resolved/closed
  severity?: string;  // 严重程度: low/medium/high/critical
  search?: string;  // 关键词搜索
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/incidents`, { params });
  return res.data;
}

/**
 * 创建安全事件
 * 创建一个新的安全事件 (Incident)。参考：NIST SP 800-61 Rev.2 (Incident Handling)、ISO 27001:2022 Annex A.5.24-5.26。
 */
export async function adminAuditIncidentsPost(data: CreateIncidentRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/incidents`, data);
  return res.data;
}

/**
 * 获取安全事件详情
 * 根据事件ID获取完整事件信息。参考：NIST SP 800-61 Rev.2 (Incident Handling)。
 */
export async function adminAuditIncidentsByIncidents(incidentId: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/incidents/${incidentId}`);
  return res.data;
}

/**
 * 添加安全事件评论
 * 为安全事件添加调查评论。参考：NIST SP 800-61 Rev.2 (Incident Handling)。
 */
export async function adminAuditIncidentsCommentByIncidentsPost(incidentId: string, data: AddIncidentCommentRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/incidents/${incidentId}/comment`, data);
  return res.data;
}

/**
 * 更新安全事件状态
 * 更新安全事件状态，支持工作流状态转移（如 open→investigating→contained→resolved→closed）。参考：NIST SP 800-61 Rev.2 (Incident Handling)。
 */
export async function adminAuditIncidentsStatusByIncidentsPut(incidentId: string, data: UpdateIncidentStatusRequest) {
  const res = await api.put(`/audit/api/v1/admin/audit/incidents/${incidentId}/status`, data);
  return res.data;
}

/**
 * 查询审计日志
 * 按租户、用户、操作类型、时间范围等条件查询审计日志。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditLogs(params?: {
  tenant_id?: string;  // 租户ID
  user_id?: string;  // 用户ID
  action?: string;  // 操作类型
  resource_type?: string;  // 资源类型
  start_time?: number;  // 开始时间戳
  end_time?: number;  // 结束时间戳
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/logs`, { params });
  return res.data;
}

/**
 * 根据ID获取审计日志
 * 根据日志ID获取单条审计日志详情，支持租户隔离。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditLogsByLogs(alertId: string) {
  const res = await api.get(`/audit/api/v1/admin/audit/logs/${alertId}`);
  return res.data;
}

/**
 * 获取指定审计日志条目的 Merkle Proof
 * 为指定审计日志条目生成 Merkle Proof 路径，第三方可通过 Proof 独立验证该条目是否被篡改。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditMerkleProof(params?: {
  tenant_id: string;  // 租户ID
  entry_id: string;  // 审计日志条目ID
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/merkle-proof`, { params });
  return res.data;
}

/**
 * 批量获取多个审计日志条目的 Merkle Proof
 * 一次查询多个审计日志条目的 Merkle Proof，复用同一棵 Merkle Tree 减少重复查询。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditMerkleProofsPost(data: MerkleProofsRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/merkle-proofs`, data);
  return res.data;
}

/**
 * 获取租户审计日志的 Merkle Root
 * 计算指定租户在日期范围内的审计日志 Merkle Root，用于 SOC2/ISO27001 完整性鉴证。不指定日期范围时计算该租户全部日志的 Root。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditMerkleRoot(params?: {
  tenant_id: string;  // 租户ID
  start?: string;  // 开始日期 (YYYY-MM-DD)
  end?: string;  // 结束日期 (YYYY-MM-DD)
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/merkle-root`, { params });
  return res.data;
}

/**
 * 查询支付事件审计日志
 * 按租户和事件类型查询支付相关的审计日志。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditPaymentEvents(params?: {
  tenant_id?: string;  // 租户ID
  event_type?: string;  // 事件类型，如 payment.succeeded
  start_time?: number;  // 开始时间戳
  end_time?: number;  // 结束时间戳
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/payment-events`, { params });
  return res.data;
}

/**
 * 获取合规审计报告
 * 生成并返回指定租户、周期和合规标准的审计报告。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditReportsCompliance(params?: {
  standard?: string;  // 合规标准: GDPR/SOX/ISO27001
  period?: string;  // 报告周期: 7d/30d/90d
  tenant_id?: string;  // 租户ID
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/reports/compliance`, { params });
  return res.data;
}

/**
 * 获取安全审计报告
 * 生成并返回指定租户和周期的安全审计报告。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditReportsSecurity(params?: {
  period?: string;  // 报告周期: 7d/30d/90d
  tenant_id?: string;  // 租户ID
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/reports/security`, { params });
  return res.data;
}

/**
 * 获取租户审计日志保留策略
 * 返回指定租户的审计日志保留策略配置；若租户未配置，返回系统默认值（90天/minio/audit-archive）。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditRetentionPolicy(params?: {
  tenant_id?: string;  // 租户ID（为空时尝试从JWT上下文获取）
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/retention-policy`, { params });
  return res.data;
}

/**
 * 保存或更新租户审计日志保留策略
 * 为指定租户设置审计日志保留天数、自动归档开关及归档目标。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditRetentionPolicyPut(data: RetentionPolicyRequest) {
  const res = await api.put(`/audit/api/v1/admin/audit/retention-policy`, data);
  return res.data;
}

/**
 * 查询服务错误日志
 * 按服务/级别/关键词/时间范围查询服务运行时错误日志，结果按租户隔离。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditServerLogs(params?: {
  service?: string;  // 服务名筛选
  level?: string;  // 级别筛选: error/warn
  keyword?: string;  // 关键词搜索
  start_time?: number;  // 开始时间戳
  end_time?: number;  // 结束时间戳
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/server-logs`, { params });
  return res.data;
}

/**
 * 获取已记录日志的服务列表
 * 返回所有在 error_logs 集合中有记录的服务名称列表。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditServerLogsServices() {
  const res = await api.get(`/audit/api/v1/admin/audit/server-logs/services`);
  return res.data;
}

/**
 * 列出 SIEM 连接器
 * 获取租户的所有 SIEM 连接器配置。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditSiemConnectors(params?: {
  tenant_id?: string;  // 租户ID
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/siem/connectors`, { params });
  return res.data;
}

/**
 * 创建 SIEM 连接器
 * 创建新的 SIEM 连接器配置。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditSiemConnectorsPost(data: SIEMConnectorRequest) {
  const res = await api.post(`/audit/api/v1/admin/audit/siem/connectors`, data);
  return res.data;
}

/**
 * 删除 SIEM 连接器
 * 删除指定 SIEM 连接器。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditSiemConnectorsByConnectorsDelete(anomalyId: string) {
  await api.delete(`/audit/api/v1/admin/audit/siem/connectors/${anomalyId}`);
}

/**
 * 更新 SIEM 连接器
 * 更新指定 SIEM 连接器配置。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditSiemConnectorsByConnectorsPut(anomalyId: string, data: SIEMConnectorRequest) {
  const res = await api.put(`/audit/api/v1/admin/audit/siem/connectors/${anomalyId}`, data);
  return res.data;
}

/**
 * 测试 SIEM 连接器
 * 测试指定 SIEM 连接器的连通性。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditSiemConnectorsTestByConnectorsPost(anomalyId: string) {
  const res = await api.post(`/audit/api/v1/admin/audit/siem/connectors/${anomalyId}/test`);
  return res.data;
}

/**
 * 获取审计统计
 * 获取审计日志的统计信息，包括各操作类型的分布、趋势等。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditStats() {
  const res = await api.get(`/audit/api/v1/admin/audit/stats`);
  return res.data;
}

/**
 * 实时审计事件流
 * Server-Sent Events 实时推送审计日志、异常和告警。按租户过滤，支持重连。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditStream(params?: {
  tenant_id?: string;  // 租户ID
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/stream`, { params });
  return res.data;
}

/**
 * 获取租户异常检测配置
 * 获取指定租户的异常检测配置（阈值、启用的检测器等）。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditTenantConfig() {
  const res = await api.get(`/audit/api/v1/admin/audit/tenant-config`);
  return res.data;
}

/**
 * 更新租户异常检测配置
 * 创建或更新指定租户的异常检测配置（阈值、启用的检测器等）。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditTenantConfigPut(data: AuditTenantConfig) {
  const res = await api.put(`/audit/api/v1/admin/audit/tenant-config`, data);
  return res.data;
}

/**
 * 查询最近一次自动哈希链验证结果
 * 返回后台定时验证器对各租户哈希链的最新验证结果，用于自动化防篡改监控。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditVerifications() {
  const res = await api.get(`/audit/api/v1/admin/audit/verifications`);
  return res.data;
}

/**
 * 验证哈希链完整性
 * 验证指定租户的审计日志哈希链是否完整未被篡改，支持防篡改鉴证。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditVerificationsPost(data: Record<string, unknown>) {
  const res = await api.post(`/audit/api/v1/admin/audit/verifications`, data);
  return res.data;
}

/**
 * 查询钱包事件审计日志
 * 按租户和事件类型查询钱包相关的审计日志。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function adminAuditWalletEvents(params?: {
  tenant_id?: string;  // 租户ID
  event_type?: string;  // 事件类型，如 wallet.deposited
  start_time?: number;  // 开始时间戳
  end_time?: number;  // 结束时间戳
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/audit/api/v1/admin/audit/wallet-events`, { params });
  return res.data;
}

/**
 * 获取公开哈希链
 * Trust Center: 获取审计日志哈希链公开摘要（哈希值截断保留前16位），用于公开的完整性鉴证。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function auditPublicHashchain() {
  const res = await api.get(`/audit/api/v1/audit/public/hashchain`);
  return res.data;
}

/**
 * 获取公开日志摘要
 * Trust Center: 获取审计日志公开摘要，包含总日志数、最近活动和模块数量。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function auditPublicLogsSummary() {
  const res = await api.get(`/audit/api/v1/audit/public/logs-summary`);
  return res.data;
}

/**
 * 获取公开审计统计
 * Trust Center: 获取审计日志公开统计（脱敏，不含租户ID和精细操作分类）。参考：ISO 27001:2022 Annex A.12.4 (Event Logging)、PCI DSS v4.0 Req 10 (Log & Monitor)。
 */
export async function auditPublicStats() {
  const res = await api.get(`/audit/api/v1/audit/public/stats`);
  return res.data;
}

// ============================================================
// Billing Service
// ============================================================

/**
 * 删除红字发票
 * 物理删除一张红字发票记录
 */
export async function adminBillingCreditNoteByCreditNoteDelete(number: string) {
  await api.delete(`/billing/api/v1/admin/billing/credit-note/${number}`);
}

/**
 * 获取红字发票详情
 * 根据红字发票编号查询详情，含金额、原因、关联发票和状态
 */
export async function adminBillingCreditNoteByCreditNote(number: string) {
  const res = await api.get(`/billing/api/v1/admin/billing/credit-note/${number}`);
  return res.data;
}

/**
 * 作废红字发票
 * 作废一张红字发票，使其不再生效。参考：GAAP/IFRS (Double-Entry Accounting Principles)。
 */
export async function adminBillingCreditNoteByCreditNotePut(number: string) {
  const res = await api.put(`/billing/api/v1/admin/billing/credit-note/${number}`);
  return res.data;
}

/**
 * 信用票据列表
 * 分页查询所有信用票据（红字发票），按创建时间倒序排列
 */
export async function adminBillingCreditNotes(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/billing/api/v1/admin/billing/credit-notes`, { params });
  return res.data;
}

/**
 * 删除催缴配置
 * 删除指定租户的失败支付催缴策略配置，恢复默认行为
 */
export async function adminBillingDunningSettingsByDunningSettingsDelete(tenantId: string) {
  await api.delete(`/billing/api/v1/admin/billing/dunning-settings/${tenantId}`);
}

/**
 * 获取催缴配置
 * 获取租户的失败支付催缴策略配置，包括重试排程、宽限期天数、自动取消天数和邮件模板
 */
export async function adminBillingDunningSettingsByDunningSettings(tenantId: string) {
  const res = await api.get(`/billing/api/v1/admin/billing/dunning-settings/${tenantId}`);
  return res.data;
}

/**
 * 配置催缴策略
 * 创建或更新租户的失败支付催缴策略，包括：重试排程、宽限期天数、自动取消天数和邮件模板。支持 upsert——已有配置时更新，无配置时创建。
 */
export async function adminBillingDunningSettingsByDunningSettingsPut(tenantId: string, data: DunningSettingsRequest) {
  const res = await api.put(`/billing/api/v1/admin/billing/dunning-settings/${tenantId}`, data);
  return res.data;
}

/**
 * 获取功能开关列表
 * 根据当前租户订阅的套餐返回已启用的 FeatureGates（功能开关）列表，用于前端根据功能开关渲染 UI。两层判定：套餐权益 + 租户覆盖。
 */
export async function adminBillingFeatureGates() {
  const res = await api.get(`/billing/api/v1/admin/billing/feature-gates`);
  return res.data;
}

/**
 * 查询租户功能开关覆盖
 * 获取当前租户的所有 FeatureGate 覆盖配置。覆盖允许按租户级别开启/关闭功能开关，优先级高于套餐默认权益。
 */
export async function adminBillingFeatureGatesOverrides() {
  const res = await api.get(`/billing/api/v1/admin/billing/feature-gates/overrides`);
  return res.data;
}

/**
 * 创建或更新功能开关覆盖
 * 按租户级别创建或更新功能开关覆盖（upsert）。覆盖优先于套餐默认权益，可用于按需开启/关闭特定功能。请求体含 gate_key 和 enabled 布尔值。
 */
export async function adminBillingFeatureGatesOverridesPut(data: OverrideRequest) {
  const res = await api.put(`/billing/api/v1/admin/billing/feature-gates/overrides`, data);
  return res.data;
}

/**
 * 验证计费事件账本完整性
 * 逐条重算计费事件哈希链，验证账本完整性。发现篡改时返回断裂位置。
 */
export async function adminBillingIntegrityByIntegrity(subscriptionId: string) {
  const res = await api.get(`/billing/api/v1/admin/billing/integrity/${subscriptionId}`);
  return res.data;
}

/**
 * 创建红字发票
 * 对已有发票开具红字冲销发票，用于退款、折扣等负向金额调整。参考：GAAP/IFRS (Double-Entry Accounting Principles)。
 */
export async function adminBillingInvoiceCreditNoteByInvoicePost(invoiceNumber: string, data: CreditNoteRequest) {
  const res = await api.post(`/billing/api/v1/admin/billing/invoice/${invoiceNumber}/credit-note`, data);
  return res.data;
}

/**
 * 计量计费记录
 * 查询指定租户的计量计费使用记录，包含各资源类型的包含量、超额量和超额费用。支持按应用和时间范围过滤。
 */
export async function adminBillingMeteredUsageByMeteredUsage(tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
  start?: string;  // 开始日期 (YYYY-MM-DD)
  end?: string;  // 结束日期 (YYYY-MM-DD)
}) {
  const res = await api.get(`/billing/api/v1/admin/billing/metered-usage/${tenantId}`, { params });
  return res.data;
}

/**
 * 支付网关列表
 * 分页查询支付网关列表，支持按名称或代码模糊搜索
 */
export async function adminBillingPaymentGateways(params?: {
  name_or_code?: string;  // 名称或代码模糊搜索
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/billing/api/v1/admin/billing/payment-gateways`, { params });
  return res.data;
}

/**
 * 创建支付网关
 * 配置一个新的支付渠道（支付宝、微信支付、Stripe 等），包含网关名称、代码和 JSON 配置
 */
export async function adminBillingPaymentGatewaysPost(data: CreatePaymentGatewayRequest) {
  const res = await api.post(`/billing/api/v1/admin/billing/payment-gateways`, data);
  return res.data;
}

/**
 * 删除支付网关
 * 删除一个支付网关配置
 */
export async function adminBillingPaymentGatewaysByPaymentGatewaysDelete(planId: string) {
  await api.delete(`/billing/api/v1/admin/billing/payment-gateways/${planId}`);
}

/**
 * 获取支付网关详情
 * 根据ID查询支付网关的配置详情，含名称、代码、状态和 JSON 配置
 */
export async function adminBillingPaymentGatewaysByPaymentGateways(planId: string) {
  const res = await api.get(`/billing/api/v1/admin/billing/payment-gateways/${planId}`);
  return res.data;
}

/**
 * 更新支付网关
 * 修改支付网关的名称、JSON 配置或激活状态。支持部分更新。
 */
export async function adminBillingPaymentGatewaysByPaymentGatewaysPut(planId: string, data: UpdatePaymentGatewayRequest) {
  const res = await api.put(`/billing/api/v1/admin/billing/payment-gateways/${planId}`, data);
  return res.data;
}

/**
 * 获取套餐定价列表
 * 查询所有套餐定价方案的详情，包括名称、价格、计费周期和包含的功能特性
 */
export async function adminBillingPlans() {
  const res = await api.get(`/billing/api/v1/admin/billing/plans`);
  return res.data;
}

/**
 * 创建套餐定价
 * 新建一个套餐定价方案（free/basic/pro/enterprise/platform），定义名称、描述、月/年价格、币种和功能特性（最大用户数、存储、带宽、API调用、MFA/SSO、审计日志保留天数、支持级别）
 */
export async function adminBillingPlansPost(data: CreatePlanRequest) {
  const res = await api.post(`/billing/api/v1/admin/billing/plans`, data);
  return res.data;
}

/**
 * 删除套餐定价
 * 移除一个不再使用的套餐定价方案。已有租户订阅该套餐时不阻止删除，仅移除套餐定义。
 */
export async function adminBillingPlansByPlansDelete(planId: string) {
  await api.delete(`/billing/api/v1/admin/billing/plans/${planId}`);
}

/**
 * 更新套餐定价
 * 更新已有套餐定价方案的名称、描述、月/年价格、状态。支持部分更新，未传递的字段保持原值。
 */
export async function adminBillingPlansByPlansPut(planId: string, data: UpdatePlanRequest) {
  const res = await api.put(`/billing/api/v1/admin/billing/plans/${planId}`, data);
  return res.data;
}

/**
 * 更新套餐功能开关
 * 更新指定套餐的 FeatureGates（功能开关）列表，支持按 key 开启/关闭功能。自动同步 MFA 和 SSO 布尔字段到套餐特性中。
 */
export async function adminBillingPlansFeatureGatesByPlansPatch(planId: string, data: Record<string, unknown>) {
  const res = await api.patch(`/billing/api/v1/admin/billing/plans/${planId}/feature-gates`, data);
  return res.data;
}

/**
 * 作废计费记录
 * 作废一条计费记录，标记为 void 状态。参考：GAAP/IFRS (Double-Entry Accounting Principles)。
 */
export async function adminBillingRecordsByRecordsDelete(planId: string) {
  await api.delete(`/billing/api/v1/admin/billing/records/${planId}`);
}

/**
 * 提交退款审批
 * 发起退款审批流程，记录退款金额、原因和关联交易。审批通过后由管理员执行实际退款操作。
 */
export async function adminBillingRefundApprovalPost(data: RefundApprovalRequest) {
  const res = await api.post(`/billing/api/v1/admin/billing/refund-approval`, data);
  return res.data;
}

/**
 * 删除退款审批
 * 删除一条退款审批记录。已完成或已拒绝的审批不可删除。
 */
export async function adminBillingRefundApprovalByRefundApprovalDelete(planId: string) {
  await api.delete(`/billing/api/v1/admin/billing/refund-approval/${planId}`);
}

/**
 * 获取退款审批状态
 * 查询退款审批的当前处理状态和审批进度（pending/approved/rejected/executed/completed）
 */
export async function adminBillingRefundApprovalByRefundApproval(planId: string) {
  const res = await api.get(`/billing/api/v1/admin/billing/refund-approval/${planId}`);
  return res.data;
}

/**
 * 审批通过退款
 * 审批通过退款申请，将状态从 pending 变更为 approved。只有 approved 状态的退款才能执行。
 */
export async function adminBillingRefundApprovalApproveByRefundApprovalPost(planId: string) {
  const res = await api.post(`/billing/api/v1/admin/billing/refund-approval/${planId}/approve`);
  return res.data;
}

/**
 * 执行退款审批
 * 对已批准的退款审批执行实际退款操作，调用 wallet-service 完成扣款/退款交易
 */
export async function adminBillingRefundApprovalExecuteByRefundApprovalPost(planId: string, data: ExecuteRefundRequest) {
  const res = await api.post(`/billing/api/v1/admin/billing/refund-approval/${planId}/execute`, data);
  return res.data;
}

/**
 * 拒绝退款审批
 * 拒绝退款申请，将状态从 pending 变更为 rejected。rejected 状态的退款不可再次审批或执行。
 */
export async function adminBillingRefundApprovalRejectByRefundApprovalPost(planId: string) {
  const res = await api.post(`/billing/api/v1/admin/billing/refund-approval/${planId}/reject`);
  return res.data;
}

/**
 * 查询退款审批列表
 * 分页查询退款审批记录列表，支持按状态过滤（pending/approved/rejected/executed/completed）
 */
export async function adminBillingRefundApprovals(params?: {
  status?: string;  // 审批状态 (pending/approved/rejected/executed/completed)
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/billing/api/v1/admin/billing/refund-approvals`, { params });
  return res.data;
}

/**
 * 收入递延报表
 * 查询收入的递延情况和按时间分摊的报表（Revenue Amortization）。遵循 GAAP/IFRS 收入确认原则，按会计期间分摊已递延收入。
 */
export async function adminBillingRevenueAmortization(params?: {
  start_date?: string;  // 开始日期 (YYYY-MM-DD)
  end_date?: string;  // 结束日期 (YYYY-MM-DD)
}) {
  const res = await api.get(`/billing/api/v1/admin/billing/revenue-amortization`, { params });
  return res.data;
}

/**
 * 取消订阅
 * 取消指定租户的当前订阅，状态变更为 cancelled。取消后租户在订阅周期结束后失去套餐功能。
 */
export async function adminBillingSubscriptionBySubscriptionDelete(tenantId: string) {
  await api.delete(`/billing/api/v1/admin/billing/subscription/${tenantId}`);
}

/**
 * 更新订阅配置
 * 修改指定租户的订阅配置，支持变更套餐（plan）和自动续费（auto_renew）设置。套餐变更时按比例计算费用。
 */
export async function adminBillingSubscriptionBySubscriptionPut(tenantId: string, data: UpdateSubscriptionRequestDTO) {
  const res = await api.put(`/billing/api/v1/admin/billing/subscription/${tenantId}`, data);
  return res.data;
}

/**
 * 列出应用定价列表
 * 列出租户下所有应用的独立定价配置，每个应用可具有不同的资源定价策略
 */
export async function adminBillingSubscriptionAppsBySubscription(tenantId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/billing/api/v1/admin/billing/subscription/${tenantId}/apps`, { params });
  return res.data;
}

/**
 * 删除应用定价
 * 删除指定租户应用的独立资源定价配置，删除后该应用恢复使用租户默认套餐定价
 */
export async function adminBillingSubscriptionAppsPricingBySubscriptionByAppsDelete(tenantId: string, appId: string) {
  await api.delete(`/billing/api/v1/admin/billing/subscription/${tenantId}/apps/${appId}/pricing`);
}

/**
 * 获取应用定价
 * 查询租户指定应用的资源定价配置详情，包含各资源类型的定价策略
 */
export async function adminBillingSubscriptionAppsPricingBySubscriptionByApps(tenantId: string, appId: string) {
  const res = await api.get(`/billing/api/v1/admin/billing/subscription/${tenantId}/apps/${appId}/pricing`);
  return res.data;
}

/**
 * 配置应用定价
 * 为租户的某个应用单独配置资源定价方案（每个资源类型独立定价），覆盖默认套餐定价。支持设置包含单位数、单价和超额单价。
 */
export async function adminBillingSubscriptionAppsPricingBySubscriptionByAppsPost(tenantId: string, appId: string, data: ConfigureAppPricingRequest) {
  const res = await api.post(`/billing/api/v1/admin/billing/subscription/${tenantId}/apps/${appId}/pricing`, data);
  return res.data;
}

/**
 * 取消试用期
 * 立即终止指定租户当前订阅的免费试用期，状态变更为 active（转为正式计费）
 */
export async function adminBillingSubscriptionCancelTrialBySubscriptionPost(tenantId: string) {
  const res = await api.post(`/billing/api/v1/admin/billing/subscription/${tenantId}/cancel-trial`);
  return res.data;
}

/**
 * 变更套餐
 * 将指定租户当前订阅切换到另一个套餐（升级或降级），自动计算按比例（proration）费用。差额为正时产生应收账单，为负时计入信用余额。
 */
export async function adminBillingSubscriptionChangePlanBySubscriptionPost(tenantId: string, data: PlanChangeRequest) {
  const res = await api.post(`/billing/api/v1/admin/billing/subscription/${tenantId}/change-plan`, data);
  return res.data;
}

/**
 * 延长试用期
 * 延长指定租户当前订阅的免费试用期限（以天为单位），成功后发送试用到期提醒通知
 */
export async function adminBillingSubscriptionExtendTrialBySubscriptionPost(tenantId: string, data: ExtendTrialRequest) {
  const res = await api.post(`/billing/api/v1/admin/billing/subscription/${tenantId}/extend-trial`, data);
  return res.data;
}

/**
 * 回滚套餐
 * 将变更套餐操作回滚到原来的套餐。退还因套餐变更收取的按比例（proration）费用至信用余额。
 */
export async function adminBillingSubscriptionRollbackPlanBySubscriptionPost(tenantId: string) {
  const res = await api.post(`/billing/api/v1/admin/billing/subscription/${tenantId}/rollback-plan`);
  return res.data;
}

/**
 * 订阅列表
 * 分页查询所有订阅，按创建时间倒序排列
 */
export async function adminBillingSubscriptions(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/billing/api/v1/admin/billing/subscriptions`, { params });
  return res.data;
}

/**
 * 税务导出
 * 导出指定时间段内的税务相关数据，用于税务申报和审计。支持按 tax_period 或 start_date/end_date 指定范围，默认导出 CSV 格式。
 */
export async function adminBillingTaxExport(params?: {
  tax_period?: string;  // 税务周期
  start_date?: string;  // 开始日期 (YYYY-MM-DD)
  end_date?: string;  // 结束日期 (YYYY-MM-DD)
  format?: string;  // 导出格式 (csv/json)
}) {
  const res = await api.get(`/billing/api/v1/admin/billing/tax-export`, { params });
  return res.data;
}

/**
 * 税务导出列表
 * 查询已生成的税务导出记录列表，支持按税务周期过滤
 */
export async function adminBillingTaxExports(params?: {
  period?: string;  // 税务周期
}) {
  const res = await api.get(`/billing/api/v1/admin/billing/tax-exports`, { params });
  return res.data;
}

/**
 * 更新使用统计
 * 管理员手动修正指定租户的使用统计数据（用于异常数据修正）
 */
export async function adminBillingUsageStatsByUsageStatsByPlanIdPut(tenantId: string, planId: string, data: Record<string, unknown>) {
  const res = await api.put(`/billing/api/v1/admin/billing/usage-stats/${tenantId}/${planId}`, data);
  return res.data;
}

/**
 * 列出用量告警
 * 分页查询已配置的用量告警规则列表，支持按应用ID、资源类型和状态过滤
 */
export async function billingAlerts(params?: {
  app_id?: string;  // 应用ID（可选）
  resource_type?: string;  // 资源类型（可选）
  status?: string;  // 告警状态（active/silenced/triggered）
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/billing/api/v1/billing/alerts`, { params });
  return res.data;
}

/**
 * 创建用量告警
 * 创建一条用量告警规则（如：当月API调用量超过 80% 时通过指定渠道发送通知）。支持按资源类型设定阈值百分比和多渠道通知。
 */
export async function billingAlertsPost(data: CreateUsageAlertRequest) {
  const res = await api.post(`/billing/api/v1/billing/alerts`, data);
  return res.data;
}

/**
 * 获取用量告警详情
 * 根据告警ID获取单条用量告警的完整详情
 */
export async function billingAlertsByAlerts(id: string) {
  const res = await api.get(`/billing/api/v1/billing/alerts/${id}`);
  return res.data;
}

/**
 * 删除用量告警
 * 移除一条不再需要的用量告警规则，返回 204 无内容表示删除成功
 */
export async function billingAlertsByAlertsDelete(planId: string) {
  await api.delete(`/billing/api/v1/billing/alerts/${planId}`);
}

/**
 * 更新用量告警
 * 修改已有用量告警规则的阈值、通知渠道或状态。支持部分更新，未传递的字段保持原值。
 */
export async function billingAlertsByAlertsPut(planId: string, data: UpdateUsageAlertRequest) {
  const res = await api.put(`/billing/api/v1/billing/alerts/${planId}`, data);
  return res.data;
}

/**
 * 查询钱包余额
 * 查询当前用户的钱包余额信息（通过 wallet-service），含可用余额、币种和冻结金额
 */
export async function billingBalance() {
  const res = await api.get(`/billing/api/v1/billing/balance`);
  return res.data;
}

/**
 * 查询租户信用余额
 * 获取租户的信用余额，来源于退款、按比例降价、促销额度等。信用余额可用于抵扣后续账单。
 */
export async function billingCreditBalanceByCreditBalance(tenantId: string) {
  const res = await api.get(`/billing/api/v1/billing/credit-balance/${tenantId}`);
  return res.data;
}

/**
 * 查询信用交易记录
 * 分页查询租户的信用交易明细（复式记账，仅 INSERT，不可修改删除）。支持按交易来源过滤。参考：GAAP/IFRS (Double-Entry Accounting Principles)。
 */
export async function billingCreditTransactionsByCreditTransactions(tenantId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  source?: string;  // 交易来源 (proration/refund/promo/manual_adjust)
}) {
  const res = await api.get(`/billing/api/v1/billing/credit-transactions/${tenantId}`, { params });
  return res.data;
}

/**
 * 获取当前租户功能开关
 * 获取当前认证用户的租户功能开关列表，合并套餐权益与租户级别覆盖
 */
export async function billingFeatureGates() {
  const res = await api.get(`/billing/api/v1/billing/feature-gates`);
  return res.data;
}

/**
 * 获取发票详情
 * 根据发票编号查询发票的详细信息，包括金额、币种、行项目、税额、支付状态等
 */
export async function billingInvoiceByInvoice(invoiceNumber: string) {
  const res = await api.get(`/billing/api/v1/billing/invoice/${invoiceNumber}`);
  return res.data;
}

/**
 * 导出发票
 * 导出指定发票的详细信息，支持 JSON/CSV 两种格式
 */
export async function billingInvoiceExportByInvoice(invoiceNumber: string, params?: {
  format?: string;  // 导出格式 (json/csv)
}) {
  const res = await api.get(`/billing/api/v1/billing/invoice/${invoiceNumber}/export`, { params });
  return res.data;
}

/**
 * 下载发票PDF
 * 生成并下载指定发票的PDF文件，包含公司信息、发票号、日期、租户ID、行项目明细和金额汇总
 */
export async function billingInvoicePdfByInvoice(invoiceNumber: string) {
  const res = await api.get(`/billing/api/v1/billing/invoice/${invoiceNumber}/pdf`);
  return res.data;
}

/**
 * 获取公开套餐列表
 * 公开接口（无需认证）：获取所有已发布的套餐定价列表，用于 Developer Portal 定价页。含套餐名称、描述、月/年价格、功能特性和配额。
 */
export async function billingPlans() {
  const res = await api.get(`/billing/api/v1/billing/plans`);
  return res.data;
}

/**
 * 预览套餐变更按比例费用
 * 在正式变更套餐前预览将产生的按比例（proration）金额，返回预估费用和剩余计费天数，不执行实际变更
 */
export async function billingProrationsCalculateByCalculatePost(tenantId: string, data: ProrationCalculateRequest) {
  const res = await api.post(`/billing/api/v1/billing/prorations/calculate/${tenantId}`, data);
  return res.data;
}

/**
 * 获取计费记录
 * 按租户维度分页查询计费记录，可选 app_id 过滤。默认按时间倒序排列，含发票编号、金额、币种、状态等字段。
 */
export async function billingRecordsByRecords(tenantId: string, params?: {
  app_id?: string;  // 应用ID
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/billing/api/v1/billing/records/${tenantId}`, { params });
  return res.data;
}

/**
 * 按应用获取计费记录
 * 按应用维度分页查询指定租户的计费记录，适用于多应用租户的独立计费查询
 */
export async function billingRecordsAppsByRecordsByApps(tenantId: string, appId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/billing/api/v1/billing/records/${tenantId}/apps/${appId}`, { params });
  return res.data;
}

/**
 * 高级搜索计费记录
 * 支持多条件组合搜索计费记录，筛选条件包括：状态、日期范围、金额范围、关键词搜索。结果分页返回。
 */
export async function billingRecordsSearchByRecords(tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
  status?: string;  // 计费状态 (paid/failed/refunded/pending)
  date_from?: string;  // 开始日期 (YYYY-MM-DD)
  date_to?: string;  // 结束日期 (YYYY-MM-DD)
  min_amount?: number;  // 最低金额
  max_amount?: number;  // 最高金额
  search?: string;  // 关键词搜索
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/billing/api/v1/billing/records/${tenantId}/search`, { params });
  return res.data;
}

/**
 * 获取租户统计
 * 查询租户的综合计费统计，包括活跃用户数、资源使用量等汇总指标。可选按 app_id 过滤。
 */
export async function billingStatisticsByStatistics(tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
}) {
  const res = await api.get(`/billing/api/v1/billing/statistics/${tenantId}`, { params });
  return res.data;
}

/**
 * 按应用获取租户统计
 * 按应用维度查询租户的计费和用量综合统计，含活跃用户数和资源使用概览
 */
export async function billingStatisticsAppsByStatisticsByApps(tenantId: string, appId: string) {
  const res = await api.get(`/billing/api/v1/billing/statistics/${tenantId}/apps/${appId}`);
  return res.data;
}

/**
 * 订阅服务
 * 为当前租户创建订阅，绑定套餐（free/basic/pro/enterprise/platform）和计费周期（monthly/yearly）。支持设定自动续费和试用天数。
 */
export async function billingSubscribePost(data: SubscribeRequestDTO) {
  const res = await api.post(`/billing/api/v1/billing/subscribe`, data);
  return res.data;
}

/**
 * 获取订阅信息
 * 查询租户当前的订阅详情，包括套餐、状态、计费周期、有效期和试用结束日期
 */
export async function billingSubscriptionBySubscription(tenantId: string) {
  const res = await api.get(`/billing/api/v1/billing/subscription/${tenantId}`);
  return res.data;
}

/**
 * 获取使用统计
 * 查询指定租户的资源使用量统计数据（用户数、存储量、API调用次数）。默认查询近 30 天数据，可通过 start_date/end_date 指定范围。
 */
export async function billingUsageByUsage(tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
  start_date?: string;  // 开始日期 (YYYY-MM-DD)
  end_date?: string;  // 结束日期 (YYYY-MM-DD)
}) {
  const res = await api.get(`/billing/api/v1/billing/usage/${tenantId}`, { params });
  return res.data;
}

/**
 * 按应用获取使用统计
 * 按应用维度查询资源使用量统计（用户数、存储量、API调用次数）。默认查询近 30 天数据。
 */
export async function billingUsageAppsByUsageByApps(tenantId: string, appId: string, params?: {
  start_date?: string;  // 开始日期 (YYYY-MM-DD)
  end_date?: string;  // 结束日期 (YYYY-MM-DD)
}) {
  const res = await api.get(`/billing/api/v1/billing/usage/${tenantId}/apps/${appId}`, { params });
  return res.data;
}

/**
 * 按应用获取当前使用量
 * 按应用维度查询当前计费周期内的资源使用量，用于多应用租户的独立用量监控
 */
export async function billingUsageAppsCurrentByUsageByApps(tenantId: string, appId: string) {
  const res = await api.get(`/billing/api/v1/billing/usage/${tenantId}/apps/${appId}/current`);
  return res.data;
}

/**
 * 获取当前使用量
 * 查询当前计费周期内的已使用资源量（用户数、存储、API调用），用于实时用量监控
 */
export async function billingUsageCurrentByUsage(tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
}) {
  const res = await api.get(`/billing/api/v1/billing/usage/${tenantId}/current`, { params });
  return res.data;
}

/**
 * 获取端点用量TopN排行
 * 查询API端点调用次数TopN排行，含请求数、错误数和平均延迟，用于分析热点接口
 */
export async function billingUsageEndpointsByUsage(tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
  limit?: number;  // 返回条数
  days?: number;  // 统计天数
}) {
  const res = await api.get(`/billing/api/v1/billing/usage/${tenantId}/endpoints`, { params });
  return res.data;
}

/**
 * 获取用量时间序列
 * 查询指定天数内的用量变化时间序列数据，按日返回用户数、API调用量、存储和带宽使用量，用于趋势分析图表
 */
export async function billingUsageTimelineByUsage(tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
  days?: number;  // 统计天数
}) {
  const res = await api.get(`/billing/api/v1/billing/usage/${tenantId}/timeline`, { params });
  return res.data;
}

// ============================================================
// Communication Service
// ============================================================

/**
 * 管理员查询任意用户的通信日志
 * 管理员可按用户ID查询任意用户的通信日志，支持分页和渠道、状态筛选。与普通用户GetLogs接口不同，此接口不受用户隔离限制。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function adminCommunicationLogs(params?: {
  user_id?: string;  // 目标用户ID（不传返回全部用户的日志）
  channel?: string;  // 发送渠道筛选：sms/email/push
  status?: string;  // 发送状态筛选：pending/sent/failed/delivered
  page?: number;  // 页码，从1开始（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/communication/api/v1/admin/communication/logs`, { params });
  return res.data;
}

/**
 * 获取平台级通信仪表盘（跨租户）
 * 返回跨所有租户的通信服务汇总统计，包括总发送量、投递成功率、按渠道和状态的分布。仅限超级管理员访问。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function adminCommunicationPlatformStats() {
  const res = await api.get(`/communication/api/v1/admin/communication/platform-stats`);
  return res.data;
}

/**
 * 创建服务商配置
 * 为当前租户创建短信/邮件/推送服务商的连接配置。支持阿里云、腾讯云、AWS SNS/SES、SendGrid、FCM等主流服务商。配置内容（API密钥等）以加密方式存储，响应中自动脱敏。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function adminCommunicationProvidersPost(data: CreateProviderConfigRequest) {
  const res = await api.post(`/communication/api/v1/admin/communication/providers`, data);
  return res.data;
}

/**
 * 删除服务商配置
 * 删除指定的服务商配置记录。删除后该渠道将回退使用默认服务商或提示未配置。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function adminCommunicationProvidersByProvidersDelete(templateId: string) {
  await api.delete(`/communication/api/v1/admin/communication/providers/${templateId}`);
}

/**
 * 更新服务商配置
 * 更新指定服务商配置的凭据、激活状态和优先级。支持部分更新（仅传需要修改的字段）。配置凭据以加密方式存储。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function adminCommunicationProvidersByProvidersPut(templateId: string, data: UpdateProviderConfigRequest) {
  const res = await api.put(`/communication/api/v1/admin/communication/providers/${templateId}`, data);
  return res.data;
}

/**
 * 管理员查看限流配置
 * 返回当前系统中各渠道（sms/email/push）的速率限制配置，包括每分钟/每小时最大发送量和当前服务商。管理员可查看系统默认值和租户级别覆盖。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function adminCommunicationRateLimits(params?: {
  channel?: string;  // 渠道筛选：sms/email/push（不传返回全部）
}) {
  const res = await api.get(`/communication/api/v1/admin/communication/rate-limits`, { params });
  return res.data;
}

/**
 * 重发失败消息
 * 将处于failed或cancelled状态的消息重新加入发送队列进行重试。仅支持sms和email渠道（推送不支持重发）。重发后会创建新的发送记录并通过对应服务商重新投递。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function adminCommunicationResendByResendPost(templateId: string) {
  const res = await api.post(`/communication/api/v1/admin/communication/resend/${templateId}`);
  return res.data;
}

/**
 * 创建消息模板
 * 为当前租户创建消息发送模板。支持短信、邮件、推送三种渠道，模板内容可使用 {{变量}} 或 Go template 语法定义变量占位符（如 {{code}}），后续发送时由传入的变量值替换。模板支持多语言（locale）。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function adminCommunicationTemplatesPost(data: CreateTemplateRequest) {
  const res = await api.post(`/communication/api/v1/admin/communication/templates`, data);
  return res.data;
}

/**
 * 删除（停用）模板
 * 软删除消息模板（将is_active设置为false）。如存在待发送消息（pending状态）引用该模板，则拒绝删除以保证投递可追踪。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function adminCommunicationTemplatesByTemplatesDelete(templateId: string) {
  await api.delete(`/communication/api/v1/admin/communication/templates/${templateId}`);
}

/**
 * 更新消息模板
 * 更新指定模板的名称、内容、变量列表等字段。更新后自动递增模板版本号，旧版本保留在版本历史中。支持修改模板的激活状态。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function adminCommunicationTemplatesByTemplatesPut(templateId: string, data: UpdateTemplateRequest) {
  const res = await api.put(`/communication/api/v1/admin/communication/templates/${templateId}`, data);
  return res.data;
}

/**
 * 将模板复制到其他语言环境
 * 将源模板的所有字段（名称、内容、变量等）复制一份到目标语言区域（locale），保持相同的模板编码（code）。用于快速创建多语言模板。如果目标locale已存在同名模板，返回409冲突。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function adminCommunicationTemplatesCloneToLocaleByTemplatesPost(templateId: string, data: CloneTemplateToLocaleRequest) {
  const res = await api.post(`/communication/api/v1/admin/communication/templates/${templateId}/clone-to-locale`, data);
  return res.data;
}

/**
 * 预览模板渲染效果
 * 使用提供的变量值渲染指定模板，返回渲染后的主题、内容和纯文本版本，用于发送前预览确认。支持 simple 和 go-template 两种模板格式。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function adminCommunicationTemplatesPreviewByTemplatesPost(templateId: string, data: Record<string, unknown>) {
  const res = await api.post(`/communication/api/v1/admin/communication/templates/${templateId}/preview`, data);
  return res.data;
}

/**
 * 查询模板版本历史
 * 根据模板ID获取该模板的所有历史版本记录。每次更新模板会递增版本号并保存快照，用于变更追溯和版本回退参考。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function adminCommunicationTemplatesVersionsByTemplates(templateId: string) {
  const res = await api.get(`/communication/api/v1/admin/communication/templates/${templateId}/versions`);
  return res.data;
}

/**
 * 批量发送消息
 * 向多个接收方批量发送短信或邮件。支持模板变量替换，逐条记录发送状态，适用于营销通知、系统公告等批量通信场景。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationBulkPost(data: BulkSendRequest) {
  const res = await api.post(`/communication/api/v1/communication/bulk`, data);
  return res.data;
}

/**
 * 处理短信/邮件/推送服务商回调
 * 接收并处理各短信、邮件、推送服务商（阿里云、腾讯云、AWS SNS/SES、SendGrid、Mailgun、FCM、APNs、JPush等）的投递状态回调通知，自动更新对应消息的发送状态。回调为公开端点，由各服务商直接调用。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationCallbackByCallbackPost(provider: string, data: Record<string, unknown>) {
  const res = await api.post(`/communication/api/v1/communication/callback/${provider}`, data);
  return res.data;
}

/**
 * 获取通信投递仪表盘
 * 获取当前租户的通信服务各渠道投递统计数据，包括总发送量、成功投递数、失败数、投递成功率，以及按渠道和状态的分布统计。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationDashboard(params?: {
  days?: number;  // 统计天数范围（默认30天）
}) {
  const res = await api.get(`/communication/api/v1/communication/dashboard`, { params });
  return res.data;
}

/**
 * 发送邮件
 * 向指定邮箱地址发送邮件。支持模板（需预定义模板）或直接发送HTML/纯文本内容，支持CC抄送和BCC密送，自动记录到发送日志。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationEmailPost(data: EmailRequest) {
  const res = await api.post(`/communication/api/v1/communication/email`, data);
  return res.data;
}

/**
 * 渠道连通性检查
 * 检查指定通信渠道（sms/email/push）的服务商配置和连通性状态。用于运维监控，验证服务商API端点是否可达、配置是否有效。公开端点，无需认证。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationHealthByHealth(channel: string) {
  const res = await api.get(`/communication/api/v1/communication/health/${channel}`);
  return res.data;
}

/**
 * 分页查询发送日志
 * 分页查询当前租户的消息发送记录。按当前登录用户隔离数据（仅返回本人的发送记录），支持按渠道（sms/email/push）和发送状态（pending/sent/failed/delivered）筛选。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationLogs(params?: {
  user_id?: string;  // 用户ID（按当前登录用户自动过滤）
  channel?: string;  // 发送渠道筛选：sms/email/push
  status?: string;  // 发送状态筛选：pending/sent/failed/delivered
  page?: number;  // 页码，从1开始（默认1）
  page_size?: number;  // 每页条数（默认20，最大100）
}) {
  const res = await api.get(`/communication/api/v1/communication/logs`, { params });
  return res.data;
}

/**
 * 查询服务商配置列表
 * 分页查询当前租户的服务商配置列表。支持按渠道（sms/email/push）和激活状态筛选。配置凭据在响应中自动脱敏（显示为***REDACTED***）。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationProviders(params?: {
  channel?: string;  // 渠道筛选：sms/email/push
  is_active?: boolean;  // 激活状态筛选：true/false
  page?: number;  // 页码，从1开始（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/communication/api/v1/communication/providers`, { params });
  return res.data;
}

/**
 * 获取服务商配置详情
 * 根据配置ID获取单个服务商配置的详细信息。配置凭据在响应中自动脱敏。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationProvidersByProviders(templateId: string) {
  const res = await api.get(`/communication/api/v1/communication/providers/${templateId}`);
  return res.data;
}

/**
 * 发送推送通知
 * 向指定用户的所有激活设备发送推送通知。支持按平台（iOS/Android/Web/Desktop）筛选目标设备，自动记录每个Token的发送成功/失败情况。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationPushPost(data: PushRequest) {
  const res = await api.post(`/communication/api/v1/communication/push`, data);
  return res.data;
}

/**
 * 查询推送令牌列表
 * 分页查询当前租户下当前登录用户的设备推送令牌。支持按平台类型（ios/android/web/desktop）筛选，返回令牌ID、平台、设备ID、激活状态和创建时间。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationPushTokens(params?: {
  user_id?: string;  // 用户ID（自动从JWT获取当前用户）
  platform?: string;  // 平台筛选：ios/android/web/desktop
  page?: number;  // 页码，从1开始（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/communication/api/v1/communication/push-tokens`, { params });
  return res.data;
}

/**
 * 注册设备推送令牌
 * 为当前租户下的指定用户注册设备推送令牌（iOS APNs / Android FCM / Web Push / Desktop），用于后续推送通知发送。相同Token重复注册会自动停用旧记录，确保每个Token在库中唯一且最新。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationPushTokensPost(data: CreatePushTokenRequest) {
  const res = await api.post(`/communication/api/v1/communication/push-tokens`, data);
  return res.data;
}

/**
 * 注销推送令牌
 * 停用指定的设备推送令牌（将is_active设置为false）。注销后该令牌不再接收推送通知，用户下次打开应用需重新注册。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationPushTokensByPushTokensDelete(templateId: string) {
  await api.delete(`/communication/api/v1/communication/push-tokens/${templateId}`);
}

/**
 * 更新推送令牌激活状态
 * 更新指定推送令牌的激活状态（is_active）。停用后该令牌不再接收推送，重新激活后恢复。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationPushTokensByPushTokensPut(templateId: string, data: UpdatePushTokenRequest) {
  const res = await api.put(`/communication/api/v1/communication/push-tokens/${templateId}`, data);
  return res.data;
}

/**
 * 查询各渠道速率限制
 * 基于当前配置的服务商返回短信、邮件、推送等渠道的速率限制配置（每分钟/每小时最大发送量），用于客户端发送前的流量控制参考。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationRateLimits(params?: {
  channel?: string;  // 渠道筛选：sms/email/push（不传返回全部）
}) {
  const res = await api.get(`/communication/api/v1/communication/rate-limits`, { params });
  return res.data;
}

/**
 * 取消定时发送消息
 * 取消指定ID且处于scheduled状态的消息定时发送任务。已发送或已失败的消息无法取消。取消后消息状态变更为cancelled。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationScheduledByScheduledDelete(templateId: string, data: CancelScheduledRequest) {
  await api.delete(`/communication/api/v1/communication/scheduled/${templateId}`, { data });
}

/**
 * 发送短信
 * 向指定手机号码发送短信。支持模板发送（需预定义模板）或直接发送内容，自动记录到发送日志。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationSmsPost(data: SMSRequest) {
  const res = await api.post(`/communication/api/v1/communication/sms`, data);
  return res.data;
}

/**
 * 获取模板使用统计（近30天）
 * 返回当前租户各模板在最近30天内的发送量、成功投递数和失败数统计，用于模板效果分析。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationTemplateStats(params?: {
  channel?: string;  // 渠道筛选：sms/email/push
}) {
  const res = await api.get(`/communication/api/v1/communication/template-stats`, { params });
  return res.data;
}

/**
 * 获取模板列表
 * 分页查询当前租户的消息模板列表。支持按发送渠道（sms/email/push）、激活状态、关键词（模板名称/编码）进行筛选。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationTemplates(params?: {
  channel?: string;  // 渠道筛选：sms/email/push
  is_active?: boolean;  // 是否激活筛选：true/false
  keyword?: string;  // 关键词搜索（匹配模板名称或编码）
  page?: number;  // 页码，从1开始（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/communication/api/v1/communication/templates`, { params });
  return res.data;
}

/**
 * 获取可用模板列表（含平台默认模板）
 * 返回平台默认模板和租户自定义模板的聚合列表，每个模板标注来源（platform/tenant）和是否被租户自定义覆盖。用于前端模板选择器展示。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationTemplatesAvailable(params?: {
  locale?: string;  // 语言区域：zh-CN/en-US（默认zh-CN）
}) {
  const res = await api.get(`/communication/api/v1/communication/templates/available`, { params });
  return res.data;
}

/**
 * 获取模板详情
 * 根据模板ID获取消息模板的完整信息，包含渲染示例（使用示例变量值展示模板渲染后的实际效果）。参考：ePrivacy Directive 2002/58/EC、CAN-SPAM Act。
 */
export async function communicationTemplatesByTemplates(templateId: string) {
  const res = await api.get(`/communication/api/v1/communication/templates/${templateId}`);
  return res.data;
}

// ============================================================
// Compliance Service
// ============================================================

/**
 * 查询AI决策记录列表
 * 查询所有AI决策的记录（GDPR第22条合规）
 */
export async function adminComplianceAiDecisions(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/ai-decisions`, { params });
  return res.data;
}

/**
 * 记录AI自动决策
 * 记录一条AI自动决策的结果和依据
 */
export async function adminComplianceAiDecisionsPost(data: AIDecisionRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/ai-decisions`, data);
  return res.data;
}

/**
 * 删除AI决策记录
 * 删除指定的AI决策记录
 */
export async function adminComplianceAiDecisionsByAiDecisionsDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/ai-decisions/${decisionId}`);
}

/**
 * 更新AI决策记录
 * 更新指定AI自动化决策记录的字段信息
 */
export async function adminComplianceAiDecisionsByAiDecisionsPut(decisionId: string, data: UpdateAIDecisionRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/ai-decisions/${decisionId}`, data);
  return res.data;
}

/**
 * 人工审核AI决策
 * 对AI决策进行人工审核
 */
export async function adminComplianceAiDecisionsReviewByAiDecisionsPost(decisionId: string, data: ReviewAIDecisionRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/ai-decisions/${decisionId}/review`, data);
  return res.data;
}

/**
 * 获取AI决策详情
 * 根据ID获取AI决策记录的详细信息
 */
export async function adminComplianceAiDecisionsByAiDecisions(id: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/ai-decisions/${id}`);
  return res.data;
}

/**
 * 查询审计发现问题列表
 * 分页查询所有审计发现问题
 */
export async function adminComplianceAuditFindings(params?: {
  severity?: string;  // severity filter
  status?: string;  // status filter
  control_type?: string;  // control type filter
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/audit-findings`, { params });
  return res.data;
}

/**
 * 创建审计发现记录
 * 创建一条审计发现问题，记录风险等级和整改计划
 */
export async function adminComplianceAuditFindingsPost(data: CreateAuditFindingRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/audit-findings`, data);
  return res.data;
}

/**
 * 删除审计发现记录
 * 删除指定的审计发现记录
 */
export async function adminComplianceAuditFindingsByAuditFindingsDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/audit-findings/${decisionId}`);
}

/**
 * 获取审计发现详情
 * 根据ID获取审计发现问题及整改进展
 */
export async function adminComplianceAuditFindingsByAuditFindings(decisionId: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/audit-findings/${decisionId}`);
  return res.data;
}

/**
 * 更新审计发现状态
 * 更新审计发现的状态、整改进度或处理人
 */
export async function adminComplianceAuditFindingsByAuditFindingsPut(decisionId: string, data: UpdateAuditFindingRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/audit-findings/${decisionId}`, data);
  return res.data;
}

/**
 * 查询数据泄露通知列表
 * 分页查询所有数据泄露通知记录
 */
export async function adminComplianceBreachNotifications(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/breach-notifications`, { params });
  return res.data;
}

/**
 * 创建数据泄露通知
 * 创建一条数据泄露通知记录（用于跟踪和合规报告）
 */
export async function adminComplianceBreachNotificationsPost(data: BreachNotificationRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/breach-notifications`, data);
  return res.data;
}

/**
 * 删除数据泄露通知
 * 删除指定的数据泄露通知记录
 */
export async function adminComplianceBreachNotificationsByBreachNotificationsDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/breach-notifications/${decisionId}`);
}

/**
 * 更新数据泄露通知
 * 更新数据泄露通知的处理状态
 */
export async function adminComplianceBreachNotificationsByBreachNotificationsPut(decisionId: string, data: UpdateBreachNotificationRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/breach-notifications/${decisionId}`, data);
  return res.data;
}

/**
 * 获取数据泄露通知详情
 * 根据ID获取数据泄露通知的详细信息
 */
export async function adminComplianceBreachNotificationsByBreachNotifications(id: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/breach-notifications/${id}`);
  return res.data;
}

/**
 * 查询合规认证列表
 * 获取合规认证列表
 */
export async function adminComplianceCertifications(params?: {
  framework?: string;  // 认证框架筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/certifications`, { params });
  return res.data;
}

/**
 * 创建合规认证记录
 * 创建新的合规认证记录
 */
export async function adminComplianceCertificationsPost(data: CreateCertificationRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/certifications`, data);
  return res.data;
}

/**
 * 删除合规认证记录
 * 删除指定的合规认证记录
 */
export async function adminComplianceCertificationsByCertificationsDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/certifications/${decisionId}`);
}

/**
 * 获取合规认证详情
 * 获取指定的合规认证详情
 */
export async function adminComplianceCertificationsByCertifications(decisionId: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/certifications/${decisionId}`);
  return res.data;
}

/**
 * 更新合规认证信息
 * 更新指定合规认证记录的证书URL、审计日期、审计机构、下次审计日期或认证状态，用于追踪认证生命周期
 */
export async function adminComplianceCertificationsByCertificationsPut(decisionId: string, data: UpdateComplianceCertificationRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/certifications/${decisionId}`, data);
  return res.data;
}

/**
 * 创建数据清理记录
 * 创建一条数据清理（过期数据删除）的历史记录
 */
export async function adminComplianceCleanupRecordsPost(data: CreateCleanupRecordRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/cleanup-records`, data);
  return res.data;
}

/**
 * 查询跨境数据传输列表
 * 分页查询所有跨境数据传输记录
 */
export async function adminComplianceCrossBorderTransfers(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/cross-border-transfers`, { params });
  return res.data;
}

/**
 * 创建跨境数据传输记录
 * 创建一条跨境数据传输记录（GDPR第五章合规）
 */
export async function adminComplianceCrossBorderTransfersPost(data: CreateCrossBorderTransferRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/cross-border-transfers`, data);
  return res.data;
}

/**
 * 删除跨境数据传输记录
 * 删除指定的跨境数据传输记录
 */
export async function adminComplianceCrossBorderTransfersByCrossBorderTransfersDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/cross-border-transfers/${decisionId}`);
}

/**
 * 更新跨境数据传输记录
 * 更新跨境数据传输记录的信息
 */
export async function adminComplianceCrossBorderTransfersByCrossBorderTransfersPut(decisionId: string, data: UpdateCrossBorderTransferRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/cross-border-transfers/${decisionId}`, data);
  return res.data;
}

/**
 * 获取跨境数据传输详情
 * 根据ID获取跨境数据传输的详细信息
 */
export async function adminComplianceCrossBorderTransfersByCrossBorderTransfers(id: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/cross-border-transfers/${id}`);
  return res.data;
}

/**
 * 查询数据分类列表
 * 分页查询所有数据分类分级的配置
 */
export async function adminComplianceDataClassifications(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/data-classifications`, { params });
  return res.data;
}

/**
 * 创建数据分类规则
 * 创建一条数据分类规则（如：PII / 敏感 / 内部）
 */
export async function adminComplianceDataClassificationsPost(data: DataClassificationRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/data-classifications`, data);
  return res.data;
}

/**
 * 删除数据分类规则
 * 删除指定的数据分类规则
 */
export async function adminComplianceDataClassificationsByDataClassificationsDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/data-classifications/${decisionId}`);
}

/**
 * 更新数据分类规则
 * 更新指定数据分类规则的分类级别、描述或保留要求，支持按分类级别（等级+等保+ISO）联动
 */
export async function adminComplianceDataClassificationsByDataClassificationsPut(decisionId: string, data: UpdateDataClassificationRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/data-classifications/${decisionId}`, data);
  return res.data;
}

/**
 * 获取数据分类分级详情
 * 根据ID获取数据分类分级的详细信息
 */
export async function adminComplianceDataClassificationsByDataClassifications(id: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/data-classifications/${id}`);
  return res.data;
}

/**
 * 查询等级保护控制项列表
 * 分页查询所有等级保护(Dengbao)安全控制项
 */
export async function adminComplianceDengbaoControls(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/dengbao/controls`, { params });
  return res.data;
}

/**
 * 创建等级保护控制项
 * 创建一条等级保护(Dengbao)安全控制项的记录
 */
export async function adminComplianceDengbaoControlsPost(data: CreateDengbaoControlRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/dengbao/controls`, data);
  return res.data;
}

/**
 * 删除等级保护控制项
 * 删除指定等级保护(Dengbao)安全控制项的记录
 */
export async function adminComplianceDengbaoControlsByControlsDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/dengbao/controls/${decisionId}`);
}

/**
 * 更新等级保护控制项
 * 更新指定等级保护(Dengbao)安全控制项的状态和证据
 */
export async function adminComplianceDengbaoControlsByControlsPut(decisionId: string, data: UpdateDengbaoControlRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/dengbao/controls/${decisionId}`, data);
  return res.data;
}

/**
 * 查询合规证据列表
 * 分页查询所有合规证据文件
 */
export async function adminComplianceEvidence(params?: {
  control_type?: string;  // control type
  control_id?: string;  // control ID
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/evidence`, { params });
  return res.data;
}

/**
 * 上传合规证据
 * 上传一条合规证据（如审计文档、截图等）
 */
export async function adminComplianceEvidencePost(data: CreateEvidenceRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/evidence`, data);
  return res.data;
}

/**
 * 删除合规证据
 * 删除指定的合规证据文件
 */
export async function adminComplianceEvidenceByEvidenceDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/evidence/${decisionId}`);
}

/**
 * 获取合规证据详情
 * 根据ID获取合规证据的详细信息
 */
export async function adminComplianceEvidenceByEvidence(decisionId: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/evidence/${decisionId}`);
  return res.data;
}

/**
 * 更新合规证据
 * 更新指定合规证据的字段信息
 */
export async function adminComplianceEvidenceByEvidencePut(decisionId: string, data: UpdateEvidenceRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/evidence/${decisionId}`, data);
  return res.data;
}

/**
 * 撤销数据处理同意
 * 撤销用户对特定处理目的的数据处理同意
 */
export async function adminComplianceGdprConsentDelete(data: RevokeConsentRequest) {
  await api.delete(`/compliance/api/v1/admin/compliance/gdpr/consent`, { data });
}

/**
 * 查询同意记录列表
 * 分页查询所有用户同意的记录，支持按目的和用户过滤
 */
export async function adminComplianceGdprConsent(params?: {
  user_id?: string;  // user ID
  service?: string;  // service filter
  purpose?: string;  // purpose filter
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/gdpr/consent`, { params });
  return res.data;
}

/**
 * 创建同意记录
 * 为指定用户创建一条数据处理同意记录
 */
export async function adminComplianceGdprConsentPost(data: CreateConsentRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/gdpr/consent`, data);
  return res.data;
}

/**
 * 获取同意记录详情
 * 根据ID获取单个用户同意记录的详细信息
 */
export async function adminComplianceGdprConsentByConsent(decisionId: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/gdpr/consent/${decisionId}`);
  return res.data;
}

/**
 * 查询DSAR列表
 * 分页查询所有数据主体访问请求（DSAR），支持状态过滤
 */
export async function adminComplianceGdprDsar(params?: {
  status?: string;  // status filter
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/gdpr/dsar`, { params });
  return res.data;
}

/**
 * 创建DSAR
 * 创建一个新的数据主体访问请求
 */
export async function adminComplianceGdprDsarPost(data: CreateDSARRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/gdpr/dsar`, data);
  return res.data;
}

/**
 * 删除DSAR
 * 删除指定的数据主体访问请求记录
 */
export async function adminComplianceGdprDsarByDsarDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/gdpr/dsar/${decisionId}`);
}

/**
 * 获取DSAR详情
 * 根据ID获取数据主体访问请求的详细信息
 */
export async function adminComplianceGdprDsarByDsar(decisionId: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/gdpr/dsar/${decisionId}`);
  return res.data;
}

/**
 * 更新DSAR
 * 更新数据主体访问请求的处理状态或响应内容
 */
export async function adminComplianceGdprDsarByDsarPut(decisionId: string, data: UpdateDSARRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/gdpr/dsar/${decisionId}`, data);
  return res.data;
}

/**
 * 查询删除权请求列表
 * 分页查询所有数据删除权请求
 */
export async function adminComplianceGdprRightToErasure(params?: {
  status?: string;  // status filter
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure`, { params });
  return res.data;
}

/**
 * 创建数据删除权请求
 * 创建一个新的数据删除权请求（GDPR第17条）
 */
export async function adminComplianceGdprRightToErasurePost(data: CreateErasureRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure`, data);
  return res.data;
}

/**
 * 获取删除权请求详情
 * 根据ID获取删除权请求的详细信息
 */
export async function adminComplianceGdprRightToErasureByRightToErasure(decisionId: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure/${decisionId}`);
  return res.data;
}

/**
 * 更新删除权请求状态
 * 更新删除权请求的处理状态
 */
export async function adminComplianceGdprRightToErasureByRightToErasurePut(decisionId: string, data: UpdateErasureRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure/${decisionId}`, data);
  return res.data;
}

/**
 * 执行数据擦除
 * 执行删除权请求，实际删除对应的用户数据
 */
export async function adminComplianceGdprRightToErasureExecuteByRightToErasurePost(decisionId: string) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure/${decisionId}/execute`);
  return res.data;
}

/**
 * 查询HIPAA控制项列表
 * 分页查询所有HIPAA安全控制项
 */
export async function adminComplianceHipaaControls(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/hipaa/controls`, { params });
  return res.data;
}

/**
 * 创建HIPAA控制项
 * 创建一条HIPAA安全控制项的记录
 */
export async function adminComplianceHipaaControlsPost(data: CreateHIPAAControlRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/hipaa/controls`, data);
  return res.data;
}

/**
 * 删除HIPAA控制项
 * 删除指定HIPAA安全控制项的记录
 */
export async function adminComplianceHipaaControlsByControlsDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/hipaa/controls/${decisionId}`);
}

/**
 * 更新HIPAA控制项
 * 更新指定HIPAA安全控制项的状态和证据
 */
export async function adminComplianceHipaaControlsByControlsPut(decisionId: string, data: UpdateHIPAAControlRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/hipaa/controls/${decisionId}`, data);
  return res.data;
}

/**
 * 查询ISO27001控制项列表
 * 分页查询所有ISO27001安全控制项
 */
export async function adminComplianceIso27001Controls(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/iso27001/controls`, { params });
  return res.data;
}

/**
 * 创建ISO27001控制项
 * 创建一条ISO27001安全控制项的记录
 */
export async function adminComplianceIso27001ControlsPost(data: CreateISO27001ControlRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/iso27001/controls`, data);
  return res.data;
}

/**
 * 删除ISO27001控制项
 * 删除指定ISO27001安全控制项的记录
 */
export async function adminComplianceIso27001ControlsByControlsDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/iso27001/controls/${decisionId}`);
}

/**
 * 更新ISO27001控制项
 * 更新指定ISO27001安全控制项的状态和证据
 */
export async function adminComplianceIso27001ControlsByControlsPut(decisionId: string, data: UpdateISO27001ControlRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/iso27001/controls/${decisionId}`, data);
  return res.data;
}

/**
 * 获取ISO27001控制项详情
 * 根据ID获取ISO27001安全控制项的详细信息
 */
export async function adminComplianceIso27001ControlsByControls(id: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/iso27001/controls/${id}`);
  return res.data;
}

/**
 * 查询PCI DSS控制项列表
 * 分页查询所有PCI DSS安全控制项
 */
export async function adminCompliancePcidssControls(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/pcidss/controls`, { params });
  return res.data;
}

/**
 * 创建PCI DSS控制项
 * 创建一条PCI DSS安全控制项的记录
 */
export async function adminCompliancePcidssControlsPost(data: CreatePCIDSSControlRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/pcidss/controls`, data);
  return res.data;
}

/**
 * 删除PCI DSS控制项
 * 删除指定PCI DSS安全控制项的记录
 */
export async function adminCompliancePcidssControlsByControlsDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/pcidss/controls/${decisionId}`);
}

/**
 * 更新PCI DSS控制项
 * 更新指定PCI DSS安全控制项的状态和证据
 */
export async function adminCompliancePcidssControlsByControlsPut(decisionId: string, data: UpdatePCIDSSControlRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/pcidss/controls/${decisionId}`, data);
  return res.data;
}

/**
 * 查询渗透测试报告列表
 * 分页查询所有渗透测试报告的记录
 */
export async function adminCompliancePenetrationTestReports(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/penetration-test-reports`, { params });
  return res.data;
}

/**
 * 创建渗透测试报告
 * 创建一份渗透测试报告的记录
 */
export async function adminCompliancePenetrationTestReportsPost(data: CreatePenTestReportRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/penetration-test-reports`, data);
  return res.data;
}

/**
 * 删除渗透测试报告
 * 删除指定的渗透测试报告记录
 */
export async function adminCompliancePenetrationTestReportsByPenetrationTestReportsDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/penetration-test-reports/${decisionId}`);
}

/**
 * 更新渗透测试报告
 * 更新渗透测试报告的信息
 */
export async function adminCompliancePenetrationTestReportsByPenetrationTestReportsPut(decisionId: string, data: UpdatePenTestReportRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/penetration-test-reports/${decisionId}`, data);
  return res.data;
}

/**
 * 查询PIPL控制项列表
 * 分页查询所有个人信息保护法(PIPL)安全控制项
 */
export async function adminCompliancePiplControls(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/pipl/controls`, { params });
  return res.data;
}

/**
 * 创建PIPL控制项
 * 创建一条个人信息保护法(PIPL)安全控制项的记录
 */
export async function adminCompliancePiplControlsPost(data: CreatePIPLControlRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/pipl/controls`, data);
  return res.data;
}

/**
 * 删除PIPL控制项
 * 删除指定PIPL安全控制项的记录
 */
export async function adminCompliancePiplControlsByControlsDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/pipl/controls/${decisionId}`);
}

/**
 * 更新PIPL控制项
 * 更新指定PIPL安全控制项的状态和证据
 */
export async function adminCompliancePiplControlsByControlsPut(decisionId: string, data: UpdatePIPLControlRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/pipl/controls/${decisionId}`, data);
  return res.data;
}

/**
 * 查询隐私影响评估列表
 * 分页查询所有隐私影响评估记录
 */
export async function adminCompliancePrivacyImpact(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/privacy-impact`, { params });
  return res.data;
}

/**
 * 创建隐私影响评估
 * 创建一条隐私影响评估（如新功能上线前的隐私风险评估）
 */
export async function adminCompliancePrivacyImpactPost(data: PIARequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/privacy-impact`, data);
  return res.data;
}

/**
 * 删除隐私影响评估
 * 删除指定的隐私影响评估记录
 */
export async function adminCompliancePrivacyImpactByPrivacyImpactDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/privacy-impact/${decisionId}`);
}

/**
 * 更新隐私影响评估
 * 更新隐私影响评估的内容或状态
 */
export async function adminCompliancePrivacyImpactByPrivacyImpactPut(decisionId: string, data: UpdatePIARequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/privacy-impact/${decisionId}`, data);
  return res.data;
}

/**
 * 获取隐私影响评估详情
 * 根据ID获取隐私影响评估的详细信息
 */
export async function adminCompliancePrivacyImpactByPrivacyImpact(id: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/privacy-impact/${id}`);
  return res.data;
}

/**
 * 创建/更新隐私政策
 * Admin：管理隐私政策版本。如版本号已存在则更新，否则创建新版本
 */
export async function adminCompliancePrivacyPoliciesPost(data: UpsertPrivacyPolicyRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/privacy-policies`, data);
  return res.data;
}

/**
 * 创建或更新合规配置
 * 创建或更新租户的合规配置
 */
export async function adminComplianceProfilePut(data: UpsertComplianceProfileRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/profile`, data);
  return res.data;
}

/**
 * 查询PSD2控制项列表
 * 分页查询所有PSD2安全控制项
 */
export async function adminCompliancePsd2Controls(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/psd2/controls`, { params });
  return res.data;
}

/**
 * 创建PSD2控制项
 * 创建一条PSD2安全控制项的记录
 */
export async function adminCompliancePsd2ControlsPost(data: CreatePSD2ControlRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/psd2/controls`, data);
  return res.data;
}

/**
 * 删除PSD2控制项
 * 删除指定PSD2安全控制项的记录
 */
export async function adminCompliancePsd2ControlsByControlsDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/psd2/controls/${decisionId}`);
}

/**
 * 更新PSD2控制项
 * 更新指定PSD2安全控制项的状态和证据
 */
export async function adminCompliancePsd2ControlsByControlsPut(decisionId: string, data: UpdatePSD2ControlRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/psd2/controls/${decisionId}`, data);
  return res.data;
}

/**
 * 查询法规动态监控列表
 * 分页查询所有法规动态监控项
 */
export async function adminComplianceRegulatoryWatch(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/regulatory-watch`, { params });
  return res.data;
}

/**
 * 创建法规动态监控项
 * 创建一条法规动态更新的监控记录
 */
export async function adminComplianceRegulatoryWatchPost(data: CreateRegulatoryWatchItemRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/regulatory-watch`, data);
  return res.data;
}

/**
 * 删除法规动态监控项
 * 删除指定的法规动态监控记录
 */
export async function adminComplianceRegulatoryWatchByRegulatoryWatchDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/regulatory-watch/${decisionId}`);
}

/**
 * 更新法规动态监控项
 * 更新法规动态监控项的信息
 */
export async function adminComplianceRegulatoryWatchByRegulatoryWatchPut(decisionId: string, data: UpdateRegulatoryWatchItemRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/regulatory-watch/${decisionId}`, data);
  return res.data;
}

/**
 * 查询保留策略列表
 * 分页查询所有数据保留策略配置
 */
export async function adminComplianceRetentionPolicies(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/retention-policies`, { params });
  return res.data;
}

/**
 * 创建数据保留策略
 * 创建一条数据保留策略（数据类型、保留期限、法律依据）
 */
export async function adminComplianceRetentionPoliciesPost(data: CreateRetentionPolicyRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/retention-policies`, data);
  return res.data;
}

/**
 * 删除数据保留策略
 * 删除指定的数据保留策略
 */
export async function adminComplianceRetentionPoliciesByRetentionPoliciesDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/retention-policies/${decisionId}`);
}

/**
 * 更新数据保留策略
 * 更新数据保留策略的参数
 */
export async function adminComplianceRetentionPoliciesByRetentionPoliciesPut(decisionId: string, data: UpdateRetentionPolicyRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/retention-policies/${decisionId}`, data);
  return res.data;
}

/**
 * 执行职责分离检查
 * 执行职责分离检查，检测角色冲突
 */
export async function adminComplianceSodChecks() {
  const res = await api.get(`/compliance/api/v1/admin/compliance/sod-checks`);
  return res.data;
}

/**
 * 查询职责分离规则列表
 * 分页查询所有职责分离规则
 */
export async function adminComplianceSodRules(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/sod-rules`, { params });
  return res.data;
}

/**
 * 创建职责分离规则
 * 创建一条职责分离规则（定义互斥的角色组合）
 */
export async function adminComplianceSodRulesPost(data: CreateSoDRuleRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/sod-rules`, data);
  return res.data;
}

/**
 * 删除职责分离规则
 * 删除指定的职责分离规则
 */
export async function adminComplianceSodRulesBySodRulesDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/sod-rules/${decisionId}`);
}

/**
 * 更新职责分离规则
 * 更新指定职责分离规则的名称、角色组或启用状态，启用后将阻止同时拥有互斥角色的用户分配
 */
export async function adminComplianceSodRulesBySodRulesPut(decisionId: string, data: UpdateSoDRuleRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/sod-rules/${decisionId}`, data);
  return res.data;
}

/**
 * 查询SOX ITGC控制项列表
 * 分页查询所有SOX IT一般控制项的记录
 */
export async function adminComplianceSoxItgc(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/sox/itgc`, { params });
  return res.data;
}

/**
 * 创建SOX ITGC控制项
 * 创建一条SOX ITGC控制项的新记录
 */
export async function adminComplianceSoxItgcPost(data: CreateSOXITGCControlRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/sox/itgc`, data);
  return res.data;
}

/**
 * 删除SOX ITGC控制项
 * 删除指定SOX ITGC控制项
 */
export async function adminComplianceSoxItgcByItgcDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/sox/itgc/${decisionId}`);
}

/**
 * 更新SOX ITGC控制项
 * 更新SOX ITGC控制项的状态、测试结果等
 */
export async function adminComplianceSoxItgcByItgcPut(decisionId: string, data: UpdateSOXITGCControlRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/sox/itgc/${decisionId}`, data);
  return res.data;
}

/**
 * 获取SOX ITGC控制项详情
 * 根据ID获取SOX ITGC控制项的详细信息
 */
export async function adminComplianceSoxItgcByItgc(id: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/sox/itgc/${id}`);
  return res.data;
}

/**
 * 列出所有合规标准
 * 返回系统支持的所有合规标准列表（GDPR、ISO27001、SOC2、HIPAA、PCI-DSS等），包含名称、版本、类别和描述
 */
export async function adminComplianceStandards() {
  const res = await api.get(`/compliance/api/v1/admin/compliance/standards`);
  return res.data;
}

/**
 * 重载合规标准文件
 * 从文件系统重新加载所有合规标准定义文件，更新内存缓存
 */
export async function adminComplianceStandardsReloadPost() {
  const res = await api.post(`/compliance/api/v1/admin/compliance/standards/reload`);
  return res.data;
}

/**
 * 获取合规标准详情
 * 根据标准ID获取合规标准的完整信息，包含所有控制项列表及每项的要求、参数、运算符和目标值
 */
export async function adminComplianceStandardsByStandards(decisionId: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/standards/${decisionId}`);
  return res.data;
}

/**
 * 列出合规标准控制项
 * 列出指定合规标准的所有控制项，每项包含要求描述、参数、运算符、目标值和严重级别
 */
export async function adminComplianceStandardsControlsByStandards(decisionId: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/standards/${decisionId}/controls`);
  return res.data;
}

/**
 * 查询子处理商列表
 * GDPR第28条合规：列出所有子处理商信息
 */
export async function adminComplianceSubprocessors(params?: {
  category?: string;  // category filter
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/subprocessors`, { params });
  return res.data;
}

/**
 * 创建子处理商记录
 * 添加一个新的子处理商记录（GDPR第28条合规）
 */
export async function adminComplianceSubprocessorsPost(data: CreateSubProcessorRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/subprocessors`, data);
  return res.data;
}

/**
 * 删除子处理商记录
 * 删除指定的子处理商记录
 */
export async function adminComplianceSubprocessorsBySubprocessorsDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/subprocessors/${decisionId}`);
}

/**
 * 获取子处理商详情
 * 获取子处理商的详细信息
 */
export async function adminComplianceSubprocessorsBySubprocessors(decisionId: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/subprocessors/${decisionId}`);
  return res.data;
}

/**
 * 更新子处理商信息
 * 更新子处理商的信息
 */
export async function adminComplianceSubprocessorsBySubprocessorsPut(decisionId: string, data: UpdateSubProcessorRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/subprocessors/${decisionId}`, data);
  return res.data;
}

/**
 * Run gap analysis for current tenant
 * Runs compliance gap analysis against the calling tenant (tenant_id derived from JWT context)
 */
export async function adminComplianceTenantsSelfGapAnalysisPost() {
  const res = await api.post(`/compliance/api/v1/admin/compliance/tenants/self/gap-analysis`);
  return res.data;
}

/**
 * 查询合规参数覆盖列表
 * 查询当前租户的所有合规参数覆盖配置
 */
export async function adminComplianceTenantsSelfOverrides() {
  const res = await api.get(`/compliance/api/v1/admin/compliance/tenants/self/overrides`);
  return res.data;
}

/**
 * 创建合规参数覆盖
 * 为当前租户创建一个合规参数覆盖配置
 */
export async function adminComplianceTenantsSelfOverridesPost(data: OverrideRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/tenants/self/overrides`, data);
  return res.data;
}

/**
 * 删除合规参数覆盖
 * 删除指定参数的合规覆盖配置
 */
export async function adminComplianceTenantsSelfOverridesByOverridesDelete(param: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/tenants/self/overrides/${param}`);
}

/**
 * Get resolved policy for current tenant
 * Returns the resolved compliance policy for the calling tenant (tenant_id derived from JWT context)
 */
export async function adminComplianceTenantsSelfPolicy() {
  const res = await api.get(`/compliance/api/v1/admin/compliance/tenants/self/policy`);
  return res.data;
}

/**
 * Get readiness report for current tenant
 * Returns compliance readiness report against a standard for the calling tenant
 */
export async function adminComplianceTenantsSelfReadinessByReadinessPost(decisionId: string, data: CurrentConfigRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/tenants/self/readiness/${decisionId}`, data);
  return res.data;
}

/**
 * Get compliance score for current tenant
 * Returns the security compliance score for the calling tenant (tenant_id derived from JWT context)
 */
export async function adminComplianceTenantsSelfScore() {
  const res = await api.get(`/compliance/api/v1/admin/compliance/tenants/self/score`);
  return res.data;
}

/**
 * Update compliance standards for current tenant
 * Updates the compliance standards configuration for the calling tenant (tenant_id derived from JWT context)
 */
export async function adminComplianceTenantsSelfStandardsPut(data: TenantStandardsRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/tenants/self/standards`, data);
  return res.data;
}

/**
 * 运行合规差距分析
 * 对比租户当前配置与解析后的合规策略参数，计算合规差距和评分
 */
export async function adminComplianceTenantsGapAnalysisByTenantsPost(tid: string, data: CurrentConfigRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/tenants/${tid}/gap-analysis`, data);
  return res.data;
}

/**
 * 获取解析后的合规策略
 * 根据租户选中的合规标准，解析并返回合并后的合规检查参数策略
 */
export async function adminComplianceTenantsPolicyByTenants(tid: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/tenants/${tid}/policy`);
  return res.data;
}

/**
 * 获取认证就绪报告
 * 针对指定合规标准，评估租户当前配置的认证就绪程度，返回未通过控制项和整改建议
 */
export async function adminComplianceTenantsReadinessByTenantsByReadinessPost(tid: string, decisionId: string, data: CurrentConfigRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/tenants/${tid}/readiness/${decisionId}`, data);
  return res.data;
}

/**
 * 获取合规评分
 * 根据租户合规状态计算安全评分（0-100），返回综合评分和等级
 */
export async function adminComplianceTenantsScoreByTenants(tid: string) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/tenants/${tid}/score`);
  return res.data;
}

/**
 * 更新租户选中的合规标准
 * 更新租户启用的合规框架标准列表，触发标准控制项自动初始化及策略合并
 */
export async function adminComplianceTenantsStandardsByTenantsPut(tid: string, data: TenantStandardsRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/tenants/${tid}/standards`, data);
  return res.data;
}

/**
 * 查询供应商风险评估列表
 * 分页查询所有供应商安全风险评估记录
 */
export async function adminComplianceVendorRiskAssessment(params?: {
  vendor_name?: string;  // vendor name filter
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}) {
  const res = await api.get(`/compliance/api/v1/admin/compliance/vendor-risk-assessment`, { params });
  return res.data;
}

/**
 * 创建供应商风险评估
 * 为指定供应商创建安全风险评估
 */
export async function adminComplianceVendorRiskAssessmentPost(data: VendorRiskAssessmentRequest) {
  const res = await api.post(`/compliance/api/v1/admin/compliance/vendor-risk-assessment`, data);
  return res.data;
}

/**
 * 删除供应商风险评估
 * 删除指定的供应商风险评估记录
 */
export async function adminComplianceVendorRiskAssessmentByVendorRiskAssessmentDelete(decisionId: string) {
  await api.delete(`/compliance/api/v1/admin/compliance/vendor-risk-assessment/${decisionId}`);
}

/**
 * 更新供应商风险评估
 * 更新供应商风险评估的结果和风险等级
 */
export async function adminComplianceVendorRiskAssessmentByVendorRiskAssessmentPut(decisionId: string, data: UpdateVendorRiskAssessmentRequest) {
  const res = await api.put(`/compliance/api/v1/admin/compliance/vendor-risk-assessment/${decisionId}`, data);
  return res.data;
}

/**
 * 查询数据清理历史记录
 * 查询数据清理（过期数据删除）的历史记录
 */
export async function complianceCleanupRecords(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}) {
  const res = await api.get(`/compliance/api/v1/compliance/cleanup-records`, { params });
  return res.data;
}

/**
 * 查询我的DSAR列表
 * 用户查看自己提交的所有数据主体访问请求历史
 */
export async function complianceGdprDsarMe(params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}) {
  const res = await api.get(`/compliance/api/v1/compliance/gdpr/dsar/me`, { params });
  return res.data;
}

/**
 * 提交我的DSAR
 * 用户自助提交数据主体访问请求，user_id 从 JWT 令牌自动提取
 */
export async function complianceGdprDsarMePost(data: CreateMyDSARRequest) {
  const res = await api.post(`/compliance/api/v1/compliance/gdpr/dsar/me`, data);
  return res.data;
}

/**
 * 获取DSAR状态
 * 用户查看自己某个数据主体访问请求的当前状态
 */
export async function complianceGdprDsarStatusByDsar(decisionId: string) {
  const res = await api.get(`/compliance/api/v1/compliance/gdpr/dsar/${decisionId}/status`);
  return res.data;
}

/**
 * 获取当前隐私政策
 * 公开端点：获取当前生效的隐私政策版本
 */
export async function compliancePrivacyPolicy() {
  const res = await api.get(`/compliance/api/v1/compliance/privacy/policy`);
  return res.data;
}

/**
 * 获取隐私政策版本历史
 * 公开端点：获取隐私政策所有版本历史记录
 */
export async function compliancePrivacyPolicyVersions(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/privacy/policy/versions`, { params });
  return res.data;
}

/**
 * 获取数据保留策略公示
 * 公开端点：获取当前租户的数据保留策略公示信息
 */
export async function compliancePrivacyRetention(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/privacy/retention`, { params });
  return res.data;
}

/**
 * 获取合规配置信息
 * 获取当前租户的合规配置信息（DPO、保留策略、已启用框架等）
 */
export async function complianceProfile() {
  const res = await api.get(`/compliance/api/v1/compliance/profile`);
  return res.data;
}

/**
 * 获取公开审计发现
 * Trust Center: 获取审计发现列表（脱敏，仅返回high/critical级别）
 */
export async function compliancePublicAuditFindings(params?: {
  severity?: string;  // 严重级别筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/audit-findings`, { params });
  return res.data;
}

/**
 * 获取公开泄露通知
 * Trust Center: 获取数据泄露通知（脱敏，无认证，仅公开已审核的通知）
 */
export async function compliancePublicBreachNotifications(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/breach-notifications`, { params });
  return res.data;
}

/**
 * 获取公开合规认证列表
 * 获取所有公开的SOC2/ISO等合规认证信息（无需认证）。Trust Center 使用。
 */
export async function compliancePublicCertifications(params?: {
  framework?: string;  // 认证框架筛选 (SOC2 Type II, ISO 27001)
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/certifications`, { params });
  return res.data;
}

/**
 * 获取公开跨境数据传输
 * Trust Center: 获取跨境数据传输信息（无认证）
 */
export async function compliancePublicCrossBorderTransfers(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/cross-border-transfers`, { params });
  return res.data;
}

/**
 * 获取公开数据分类
 * Trust Center: 获取数据分类信息（无认证）
 */
export async function compliancePublicDataClassifications(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/data-classifications`, { params });
  return res.data;
}

/**
 * 获取公开等级保护控制项
 * Trust Center: 获取等级保护(Dengbao)控制项列表（无认证，摘要级别）
 */
export async function compliancePublicDengbaoControls(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/dengbao/controls`, { params });
  return res.data;
}

/**
 * 获取公开合规证据
 * Trust Center: 获取合规证据文件列表摘要（无认证，P2，不含具体文件URL）
 */
export async function compliancePublicEvidence(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/evidence`, { params });
  return res.data;
}

/**
 * 获取公开HIPAA控制项
 * Trust Center: 获取HIPAA控制项列表（无认证，摘要级别）
 */
export async function compliancePublicHipaaControls(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/hipaa/controls`, { params });
  return res.data;
}

/**
 * 获取公开ISO27001控制项
 * Trust Center: 获取ISO27001控制项列表（无认证，摘要级别）
 */
export async function compliancePublicIso27001Controls(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/iso27001/controls`, { params });
  return res.data;
}

/**
 * 获取公开PCI DSS控制项
 * Trust Center: 获取PCI DSS控制项列表（无认证，摘要级别）
 */
export async function compliancePublicPcidssControls(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/pcidss/controls`, { params });
  return res.data;
}

/**
 * 获取公开渗透测试报告
 * Trust Center: 获取渗透测试报告摘要（无认证，仅返回摘要级别）
 */
export async function compliancePublicPenetrationTestReports(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/penetration-test-reports`, { params });
  return res.data;
}

/**
 * 获取公开PIPL控制项
 * Trust Center: 获取个人信息保护法(PIPL)控制项列表（无认证，摘要级别）
 */
export async function compliancePublicPiplControls(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/pipl/controls`, { params });
  return res.data;
}

/**
 * 获取公开隐私影响评估
 * Trust Center: 获取隐私影响评估摘要列表（无认证）
 */
export async function compliancePublicPrivacyImpact(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/privacy-impact`, { params });
  return res.data;
}

/**
 * 获取公开PSD2控制项
 * Trust Center: 获取PSD2控制项列表（无认证，摘要级别）
 */
export async function compliancePublicPsd2Controls(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/psd2/controls`, { params });
  return res.data;
}

/**
 * 获取公开监管监控
 * Trust Center: 获取法规变更跟踪信息（无认证，P2）
 */
export async function compliancePublicRegulatoryWatch(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/regulatory-watch`, { params });
  return res.data;
}

/**
 * 获取公开安全评分
 * Trust Center: 计算并返回安全评分（无认证）
 */
export async function compliancePublicSecurityScore() {
  const res = await api.get(`/compliance/api/v1/compliance/public/security-score`);
  return res.data;
}

/**
 * 获取公开合规状态
 * Trust Center: 获取系统级合规状态概览（无认证）
 */
export async function compliancePublicStatus() {
  const res = await api.get(`/compliance/api/v1/compliance/public/status`);
  return res.data;
}

/**
 * 获取公开子处理商清单
 * Trust Center: GDPR Art.28要求的子处理商公示清单（无认证）
 */
export async function compliancePublicSubprocessors(params?: {
  category?: string;  // 类别筛选: infrastructure/service_provider/third_party
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/compliance/api/v1/compliance/public/subprocessors`, { params });
  return res.data;
}

/**
 * 获取合规状态概览
 * 获取当前租户的整体合规状态概览（框架覆盖、违规数量等）
 */
export async function complianceStatus() {
  const res = await api.get(`/compliance/api/v1/compliance/status`);
  return res.data;
}

// ============================================================
// Gateway Service
// ============================================================

/**
 * 获取环境变量
 * 返回 .env/.env.local 中加载的所有环境变量，敏感变量值自动脱敏（仅限 super_admin 访问）
 */
export async function bffGatewayAdminEnvVars() {
  const res = await api.get(`/gateway/api/v1/bff/gateway/admin/env-vars`);
  return res.data;
}

/**
 * 获取功能开关矩阵
 * 返回所有微服务的功能开关状态矩阵，包括启用/禁用汇总统计
 */
export async function bffGatewayAdminFeatureFlags() {
  const res = await api.get(`/gateway/api/v1/bff/gateway/admin/feature-flags`);
  return res.data;
}

/**
 * 获取健康检查运行时信息
 * 返回网关服务自身及所有上游微服务的 TCP 健康检查结果，含服务名、状态、延迟
 */
export async function bffGatewayAdminHealthRuntime() {
  const res = await api.get(`/gateway/api/v1/bff/gateway/admin/health/runtime`);
  return res.data;
}

/**
 * 获取基础设施凭证清单
 * 返回所有基础设施凭证的名称、环境变量键、所属容器和消费者服务清单（不含实际值）
 */
export async function bffGatewayAdminInfraCredentials() {
  const res = await api.get(`/gateway/api/v1/bff/gateway/admin/infra-credentials`);
  return res.data;
}

/**
 * 获取限流状态
 * 返回当前网关限流 provider 的可用状态和配置信息
 */
export async function bffGatewayAdminRateLimits() {
  const res = await api.get(`/gateway/api/v1/bff/gateway/admin/rate-limits`);
  return res.data;
}

/**
 * 获取调度器状态
 * 聚合所有微服务的后台调度器运行状态（名称、间隔、启用状态），通过各服务 internal API 收集
 */
export async function bffGatewayAdminSchedulers() {
  const res = await api.get(`/gateway/api/v1/bff/gateway/admin/schedulers`);
  return res.data;
}

/**
 * 获取系统运行时聚合信息
 * 返回网关自身运行状态（启动时间、版本号）及所有微服务的元数据列表（名称、端口、分类、gRPC 端口）
 */
export async function bffGatewayAdminSystemRuntime() {
  const res = await api.get(`/gateway/api/v1/bff/gateway/admin/system/runtime`);
  return res.data;
}

/**
 * 获取服务依赖拓扑
 * 返回所有微服务的端口和依赖关系映射，包括网关自身和上游服务的拓扑结构
 */
export async function bffGatewayAdminTopology() {
  const res = await api.get(`/gateway/api/v1/bff/gateway/admin/topology`);
  return res.data;
}

/**
 * 日志查询
 * 按级别、服务、关键词、时间范围查询租户日志（Elasticsearch 代理，自动注入租户隔离过滤），支持分页
 */
export async function developerLogs(params?: {
  level?: string;  // 日志级别（DEBUG, INFO, WARN, ERROR）
  service?: string;  // 服务名称
  keyword?: string;  // 搜索关键词
  start_time?: string;  // 起始时间（RFC3339 格式）
  end_time?: string;  // 结束时间（RFC3339 格式）
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/gateway/api/v1/developer/logs`, { params });
  return res.data;
}

/**
 * 服务状态页面
 * 返回所有上游微服务的 TCP 健康检查结果（healthy/unhealthy），缓存 30 秒，含网关自身运行时间和各服务延迟
 */
export async function developerStatus() {
  const res = await api.get(`/gateway/api/v1/developer/status`);
  return res.data;
}

/**
 * 追踪操作列表
 * 返回指定服务在 Jaeger 中的 Span 操作名称列表
 */
export async function developerTracesOperations(params?: {
  service: string;  // 服务名称
}) {
  const res = await api.get(`/gateway/api/v1/developer/traces/operations`, { params });
  return res.data;
}

/**
 * 追踪搜索
 * 按服务、操作、时间范围搜索 Jaeger Trace，自动注入租户隔离过滤
 */
export async function developerTracesSearch(params?: {
  service?: string;  // 服务名称
  operation?: string;  // 操作名称
  limit?: number;  // 返回条数
  start_time?: string;  // 起始时间（RFC3339 格式）
  end_time?: string;  // 结束时间（RFC3339 格式）
}) {
  const res = await api.get(`/gateway/api/v1/developer/traces/search`, { params });
  return res.data;
}

/**
 * 追踪服务列表
 * 返回 Jaeger 中已注册的微服务列表
 */
export async function developerTracesServices() {
  const res = await api.get(`/gateway/api/v1/developer/traces/services`);
  return res.data;
}

/**
 * 获取单条 Trace
 * 根据 traceID 获取完整 Trace 详情，自动验证租户归属，防止跨租户数据泄露
 */
export async function developerTracesByTraces(traceID: string) {
  const res = await api.get(`/gateway/api/v1/developer/traces/${traceID}`);
  return res.data;
}

/**
 * 单服务 OpenAPI 规范
 * 返回单个微服务的 OpenAPI JSON 规范（含网关前缀路径），可直接导入 Swagger UI 或 Postman
 */
export async function docsSpecsBySpecs(service: string) {
  const res = await api.get(`/gateway/api/v1/docs/specs/${service}`);
  return res.data;
}

/**
 * 指定服务文档页面
 * 返回指定微服务的 Scalar UI 交互式文档页面，仅加载该服务的 OpenAPI 规范
 */
export async function docsByDocs(service: string) {
  const res = await api.get(`/gateway/api/v1/docs/${service}`);
  return res.data;
}

/**
 * 获取 SDK 示例列表
 * 返回所有语言的 SDK 代码示例索引（含示例 ID、标题、语言、分类、摘要和关联端点）
 */
export async function sdkExamples() {
  const res = await api.get(`/gateway/api/v1/sdk/examples`);
  return res.data;
}

/**
 * 获取 SDK 版本列表
 * 返回所有支持的 SDK 语言及其可选版本号
 */
export async function sdkVersions() {
  const res = await api.get(`/gateway/api/v1/sdk/versions`);
  return res.data;
}

/**
 * 获取 SDK 变更日志
 * 返回指定语言 SDK 的版本变更日志列表（按版本倒序）
 */
export async function sdkChangelogBySdk(language: string) {
  const res = await api.get(`/gateway/api/v1/sdk/${language}/changelog`);
  return res.data;
}

/**
 * 全局搜索
 * 跨 OpenAPI 规范与 SDK 示例资源进行模糊搜索，支持精确匹配和 Levenshtein 模糊回退
 */
export async function search(params?: {
  q?: string;  // 搜索关键词
  type?: string;  // 搜索类型（api: API 端点, sdk: SDK 示例）
}) {
  const res = await api.get(`/gateway/api/v1/search`, { params });
  return res.data;
}

// ============================================================
// Identity Service
// ============================================================

/**
 * 查询ABAC策略列表
 * 查询租户的ABAC条件策略列表，支持分页
 */
export async function adminAbacPolicies(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/identity/api/v1/admin/abac-policies`, { params });
  return res.data;
}

/**
 * 创建ABAC策略
 * 创建新的ABAC条件策略
 */
export async function adminAbacPoliciesPost(data: CreateABACPolicyRequest) {
  const res = await api.post(`/identity/api/v1/admin/abac-policies`, data);
  return res.data;
}

/**
 * 删除ABAC策略
 * 删除指定的ABAC条件策略
 */
export async function adminAbacPoliciesByAbacPoliciesDelete(id: string) {
  await api.delete(`/identity/api/v1/admin/abac-policies/${id}`);
}

/**
 * 获取ABAC策略详情
 * 根据策略ID获取ABAC策略详情
 */
export async function adminAbacPoliciesByAbacPolicies(id: string) {
  const res = await api.get(`/identity/api/v1/admin/abac-policies/${id}`);
  return res.data;
}

/**
 * 更新ABAC策略
 * 更新指定ABAC策略的配置
 */
export async function adminAbacPoliciesByAbacPoliciesPut(id: string, data: UpdateABACPolicyRequest) {
  const res = await api.put(`/identity/api/v1/admin/abac-policies/${id}`, data);
  return res.data;
}

/**
 * List Agents
 * 查询 Non-Human Identity (NHI) Agent 列表，支持按状态和工作负载子类型过滤
 */
export async function adminAgents(params?: {
  tenant_id: string;  // 租户ID
  status?: string;  // 状态过滤
  workload_subtype?: string;  // 工作负载子类型
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/identity/api/v1/admin/agents`, { params });
  return res.data;
}

/**
 * Create Agent
 * 创建一个新的 Non-Human Identity (NHI) Agent
 */
export async function adminAgentsPost(data: CreateAgentRequest) {
  const res = await api.post(`/identity/api/v1/admin/agents`, data);
  return res.data;
}

/**
 * Revoke Agent
 * 撤销指定的 Non-Human Identity (NHI) Agent（软删除，状态变为 revoked）
 */
export async function adminAgentsByAgentsDelete(id: string) {
  await api.delete(`/identity/api/v1/admin/agents/${id}`);
}

/**
 * Get Agent
 * 获取指定 Non-Human Identity (NHI) Agent 的详细信息
 */
export async function adminAgentsByAgents(id: string) {
  const res = await api.get(`/identity/api/v1/admin/agents/${id}`);
  return res.data;
}

/**
 * Update Agent
 * 更新指定 Non-Human Identity (NHI) Agent 的配置
 */
export async function adminAgentsByAgentsPut(id: string, data: UpdateAgentRequest) {
  const res = await api.put(`/identity/api/v1/admin/agents/${id}`, data);
  return res.data;
}

/**
 * List Agent Credentials
 * 查询指定 Agent 的所有 API 密钥凭证
 */
export async function adminAgentsCredentialsByAgents(id: string) {
  const res = await api.get(`/identity/api/v1/admin/agents/${id}/credentials`);
  return res.data;
}

/**
 * Create Agent Credential
 * 为指定 Agent 生成新的 API 密钥凭证。返回的 api_key 仅展示一次，请妥善保管。
 */
export async function adminAgentsCredentialsByAgentsPost(id: string, data: CreateAgentCredentialRequest) {
  const res = await api.post(`/identity/api/v1/admin/agents/${id}/credentials`, data);
  return res.data;
}

/**
 * Revoke Agent Credential
 * 撤销指定 Agent 的 API 密钥凭证
 */
export async function adminAgentsCredentialsByAgentsByCredentialsDelete(id: string, credId: string) {
  await api.delete(`/identity/api/v1/admin/agents/${id}/credentials/${credId}`);
}

/**
 * Get Agent Credential
 * 获取指定 Agent 的单个凭证详情（不含 api_key）
 */
export async function adminAgentsCredentialsByAgentsByCredentials(id: string, credId: string) {
  const res = await api.get(`/identity/api/v1/admin/agents/${id}/credentials/${credId}`);
  return res.data;
}

/**
 * Rotate Agent Credential
 * 轮换指定 Agent 的 API 密钥凭证：撤销旧凭证并颁发新凭证。返回的 api_key 仅展示一次。
 */
export async function adminAgentsCredentialsRotateByAgentsByCredentialsPost(id: string, credId: string) {
  const res = await api.post(`/identity/api/v1/admin/agents/${id}/credentials/${credId}/rotate`);
  return res.data;
}

/**
 * 获取租户认证策略列表
 * 分页获取所有租户的认证策略
 */
export async function adminAuthPolicies(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/identity/api/v1/admin/auth-policies`, { params });
  return res.data;
}

/**
 * 删除租户认证策略
 * 删除指定租户的认证策略配置，删除后将使用系统默认策略
 */
export async function adminAuthPoliciesByAuthPoliciesDelete(tenantId: string) {
  await api.delete(`/identity/api/v1/admin/auth-policies/${tenantId}`);
}

/**
 * 获取租户认证策略
 * 获取指定租户的认证策略配置
 */
export async function adminAuthPoliciesByAuthPolicies(tenantId: string) {
  const res = await api.get(`/identity/api/v1/admin/auth-policies/${tenantId}`);
  return res.data;
}

/**
 * 更新租户认证策略
 * 创建或更新指定租户的认证策略（部分更新，未设置的字段保持默认值）
 */
export async function adminAuthPoliciesByAuthPoliciesPut(tenantId: string, data: TenantAuthPolicyRequest) {
  const res = await api.put(`/identity/api/v1/admin/auth-policies/${tenantId}`, data);
  return res.data;
}

/**
 * 管理员查询 API Key 列表
 * 管理员查看租户下所有 API Key（不限制所属用户）
 */
export async function adminAuthApiKeys(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  status?: string;  // 状态筛选: active/inactive/revoked
  environment?: string;  // 环境筛选: live/test
  search?: string;  // 搜索名称或前缀
}) {
  const res = await api.get(`/identity/api/v1/admin/auth/api-keys`, { params });
  return res.data;
}

/**
 * 安全异常检测
 * 扫描审计日志检测异常模式：高失败率、多IP调用等
 */
export async function adminAuthApiKeysAnomalies() {
  const res = await api.get(`/identity/api/v1/admin/auth/api-keys/anomalies`);
  return res.data;
}

/**
 * 批量吊销 API Key
 * 一次吊销多个 API Key（软删除，保留审计记录）
 */
export async function adminAuthApiKeysBatchRevokePost(data: BatchRevokeRequest) {
  const res = await api.post(`/identity/api/v1/admin/auth/api-keys/batch-revoke`, data);
  return res.data;
}

/**
 * 清理旧审计日志
 * 删除超过指定天数的 API Key 审计日志（内部管理）
 */
export async function adminAuthApiKeysCleanupAuditLogsPost(params?: {
  days?: number;  // 保留天数
}) {
  const res = await api.post(`/identity/api/v1/admin/auth/api-keys/cleanup-audit-logs`, undefined, { params });
  return res.data;
}

/**
 * 获取即将过期的 API Key
 * 查询租户下将在 N 天内过期的活跃 API Key
 */
export async function adminAuthApiKeysExpiring(params?: {
  days?: number;  // 过期天数范围
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/identity/api/v1/admin/auth/api-keys/expiring`, { params });
  return res.data;
}

/**
 * 管理员 API Key 统计
 * 获取租户下 API Key 的汇总统计（总量/活跃/已吊销）
 */
export async function adminAuthApiKeysStats() {
  const res = await api.get(`/identity/api/v1/admin/auth/api-keys/stats`);
  return res.data;
}

/**
 * 管理员强制吊销 API Key
 * 管理员强制吊销任意 API Key，记录操作者信息
 */
export async function adminAuthApiKeysForceByApiKeysDelete(id: string) {
  await api.delete(`/identity/api/v1/admin/auth/api-keys/${id}/force`);
}

/**
 * 查询委托授权列表
 * 查询委托授权列表，可按受托者和委托者筛选
 */
export async function adminDelegationGrants(params?: {
  delegator_id?: string;  // 委托者ID
  delegatee_id?: string;  // 受托者ID
}) {
  const res = await api.get(`/identity/api/v1/admin/delegation-grants`, { params });
  return res.data;
}

/**
 * 创建委托授权
 * 创建一个委托授权，允许委托者将操作权限委托给受托者
 */
export async function adminDelegationGrantsPost(data: CreateDelegationGrantRequest) {
  const res = await api.post(`/identity/api/v1/admin/delegation-grants`, data);
  return res.data;
}

/**
 * 撤销委托授权
 * 撤销一个委托授权（软删除）
 */
export async function adminDelegationGrantsByDelegationGrantsDelete(id: string) {
  await api.delete(`/identity/api/v1/admin/delegation-grants/${id}`);
}

/**
 * 查询委托授权详情
 * 根据ID查询委托授权详情
 */
export async function adminDelegationGrantsByDelegationGrants(id: string) {
  const res = await api.get(`/identity/api/v1/admin/delegation-grants/${id}`);
  return res.data;
}

/**
 * 列出身份提供商
 * 分页查询身份提供商列表，支持按类型和状态过滤
 */
export async function adminIdentityProviders(params?: {
  type?: string;  // 提供商类型过滤
  status?: string;  // 状态过滤: active/inactive
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/identity/api/v1/admin/identity-providers`, { params });
  return res.data;
}

/**
 * 创建身份提供商
 * 创建新的身份提供商（OAuth/OIDC/SAML/Social）
 */
export async function adminIdentityProvidersPost(data: CreateIDPRequest) {
  const res = await api.post(`/identity/api/v1/admin/identity-providers`, data);
  return res.data;
}

/**
 * 导入OIDC Discovery
 * 从OIDC discovery URL导入身份提供商配置
 */
export async function adminIdentityProvidersImportOidcDiscoveryPost(data: ImportOIDCDiscoveryRequest) {
  const res = await api.post(`/identity/api/v1/admin/identity-providers/import-oidc-discovery`, data);
  return res.data;
}

/**
 * 导入SAML Metadata
 * 从SAML metadata URL导入身份提供商配置
 */
export async function adminIdentityProvidersImportSamlMetadataPost(data: ImportSAMLMetadataRequest) {
  const res = await api.post(`/identity/api/v1/admin/identity-providers/import-saml-metadata`, data);
  return res.data;
}

/**
 * 删除身份提供商
 * 删除指定的身份提供商
 */
export async function adminIdentityProvidersByIdentityProvidersDelete(id: string) {
  await api.delete(`/identity/api/v1/admin/identity-providers/${id}`);
}

/**
 * 获取身份提供商详情
 * 获取指定身份提供商的详细配置
 */
export async function adminIdentityProvidersByIdentityProviders(id: string) {
  const res = await api.get(`/identity/api/v1/admin/identity-providers/${id}`);
  return res.data;
}

/**
 * 更新身份提供商
 * 更新身份提供商的配置信息
 */
export async function adminIdentityProvidersByIdentityProvidersPut(id: string, data: UpdateIDPRequest) {
  const res = await api.put(`/identity/api/v1/admin/identity-providers/${id}`, data);
  return res.data;
}

/**
 * 启用身份提供商
 * 将指定身份提供商状态设置为 active
 */
export async function adminIdentityProvidersActivateByIdentityProvidersPost(id: string) {
  const res = await api.post(`/identity/api/v1/admin/identity-providers/${id}/activate`);
  return res.data;
}

/**
 * 获取属性映射
 * 获取身份提供商的属性映射配置
 */
export async function adminIdentityProvidersAttributeMappingByIdentityProviders(id: string) {
  const res = await api.get(`/identity/api/v1/admin/identity-providers/${id}/attribute-mapping`);
  return res.data;
}

/**
 * 更新属性映射
 * 更新身份提供商的属性映射配置
 */
export async function adminIdentityProvidersAttributeMappingByIdentityProvidersPut(id: string, data: UpdateAttributeMappingRequest) {
  const res = await api.put(`/identity/api/v1/admin/identity-providers/${id}/attribute-mapping`, data);
  return res.data;
}

/**
 * 列出证书
 * 分页列出指定身份提供商的证书
 */
export async function adminIdentityProvidersCertificatesByIdentityProviders(id: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/identity/api/v1/admin/identity-providers/${id}/certificates`, { params });
  return res.data;
}

/**
 * 上传证书
 * 为身份提供商上传签名/加密证书
 */
export async function adminIdentityProvidersCertificatesByIdentityProvidersPost(id: string, data: CreateCertificateRequest) {
  const res = await api.post(`/identity/api/v1/admin/identity-providers/${id}/certificates`, data);
  return res.data;
}

/**
 * 删除证书
 * 吊销并删除指定证书
 */
export async function adminIdentityProvidersCertificatesByIdentityProvidersByCertificatesDelete(id: string, certId: string) {
  await api.delete(`/identity/api/v1/admin/identity-providers/${id}/certificates/${certId}`);
}

/**
 * 证书轮转
 * 吊销旧证书并上传新证书
 */
export async function adminIdentityProvidersCertificatesRotateByIdentityProvidersByCertificatesPost(id: string, certId: string, data: RotateCertificateRequest) {
  const res = await api.post(`/identity/api/v1/admin/identity-providers/${id}/certificates/${certId}/rotate`, data);
  return res.data;
}

/**
 * 停用身份提供商
 * 将指定身份提供商状态设置为 inactive
 */
export async function adminIdentityProvidersDeactivateByIdentityProvidersPost(id: string) {
  const res = await api.post(`/identity/api/v1/admin/identity-providers/${id}/deactivate`);
  return res.data;
}

/**
 * 获取JIT配置
 * 获取身份提供商的JIT（Just-In-Time）配置
 */
export async function adminIdentityProvidersJitConfigByIdentityProviders(id: string) {
  const res = await api.get(`/identity/api/v1/admin/identity-providers/${id}/jit-config`);
  return res.data;
}

/**
 * 更新JIT配置
 * 更新身份提供商的JIT（Just-In-Time）配置
 */
export async function adminIdentityProvidersJitConfigByIdentityProvidersPut(id: string, data: UpdateJITConfigRequest) {
  const res = await api.put(`/identity/api/v1/admin/identity-providers/${id}/jit-config`, data);
  return res.data;
}

/**
 * 获取提供商统计
 * 获取身份提供商的使用统计数据（用户数、登录次数、最后登录时间）
 */
export async function adminIdentityProvidersStatsByIdentityProviders(id: string) {
  const res = await api.get(`/identity/api/v1/admin/identity-providers/${id}/stats`);
  return res.data;
}

/**
 * 测试身份提供商连接
 * 测试指定身份提供商的连接配置是否有效
 */
export async function adminIdentityProvidersTestByIdentityProvidersPost(id: string) {
  const res = await api.post(`/identity/api/v1/admin/identity-providers/${id}/test`);
  return res.data;
}

/**
 * 获取提供商关联用户
 * 分页查询通过指定身份提供商登录的用户列表
 */
export async function adminIdentityProvidersUsersByIdentityProviders(id: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/identity/api/v1/admin/identity-providers/${id}/users`, { params });
  return res.data;
}

/**
 * 管理员模拟用户登录
 * 管理员直接以目标用户身份登录，返回access_token/refresh_token，需要super_admin角色
 */
export async function adminImpersonatePost(data: AdminImpersonateRequest) {
  const res = await api.post(`/identity/api/v1/admin/impersonate`, data);
  return res.data;
}

/**
 * List Devices
 * 查询 Non-Human Identity (NHI) IoT Device 列表，支持按状态和工作负载子类型过滤
 */
export async function adminIots(params?: {
  status?: string;  // 状态过滤
  workload_subtype?: string;  // 工作负载子类型
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/identity/api/v1/admin/iots`, { params });
  return res.data;
}

/**
 * Create Device
 * 创建一个新的 Non-Human Identity (NHI) IoT Device
 */
export async function adminIotsPost(data: CreateDeviceRequest) {
  const res = await api.post(`/identity/api/v1/admin/iots`, data);
  return res.data;
}

/**
 * Revoke Device
 * 撤销指定的 Non-Human Identity (NHI) IoT Device（软删除，状态变为 revoked）
 */
export async function adminIotsByIotsDelete(id: string) {
  await api.delete(`/identity/api/v1/admin/iots/${id}`);
}

/**
 * Get Device
 * 获取指定 Non-Human Identity (NHI) IoT Device 的详细信息
 */
export async function adminIotsByIots(id: string) {
  const res = await api.get(`/identity/api/v1/admin/iots/${id}`);
  return res.data;
}

/**
 * LDAP directory health check
 * Get health status of all registered LDAP directories
 */
export async function adminLdapHealth() {
  const res = await api.get(`/identity/api/v1/admin/ldap/health`);
  return res.data;
}

/**
 * Test LDAP directory connection
 * Test connection to a specific LDAP/AD directory
 */
export async function adminLdapTestConnectionPost(data: LdapTestConnectionRequest) {
  const res = await api.post(`/identity/api/v1/admin/ldap/test-connection`, data);
  return res.data;
}

/**
 * Get LDAP group-role mapping
 */
export async function adminLdapGroupRoleMappingByLdap(name: string) {
  const res = await api.get(`/identity/api/v1/admin/ldap/${name}/group-role-mapping`);
  return res.data;
}

/**
 * Update LDAP group-role mapping
 */
export async function adminLdapGroupRoleMappingByLdapPut(name: string, data: LdapGroupRoleMappingRequest) {
  const res = await api.put(`/identity/api/v1/admin/ldap/${name}/group-role-mapping`, data);
  return res.data;
}

/**
 * 列出双人复核记录
 * 分页查询双人复核记录，支持按状态过滤
 */
export async function adminMakerChecker(params?: {
  status?: "recorded" | "approved" | "rejected" | "expired";  // 状态过滤
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/identity/api/v1/admin/maker-checker`, { params });
  return res.data;
}

/**
 * 删除双人复核记录
 * 根据记录ID删除指定的双人复核记录（Maker-Checker）
 */
export async function adminMakerCheckerByMakerCheckerDelete(id: string) {
  await api.delete(`/identity/api/v1/admin/maker-checker/${id}`);
}

/**
 * 获取NHI策略
 * 获取当前租户的NHI（非人类身份）策略配置，包括Agent/Robot/Device限制和默认值
 */
export async function adminPoliciesNhi() {
  const res = await api.get(`/identity/api/v1/admin/policies/nhi`);
  return res.data;
}

/**
 * 更新NHI策略
 * 更新当前租户的NHI（非人类身份）策略配置
 */
export async function adminPoliciesNhiPut(data: NHIPolicyRequest) {
  const res = await api.put(`/identity/api/v1/admin/policies/nhi`, data);
  return res.data;
}

/**
 * 检查关系权限
 * 基于关系型访问控制模型，检查指定主体对目标对象的关系是否存在
 */
export async function adminRelationshipsCheckPost(data: RebacCheckRequest) {
  const res = await api.post(`/identity/api/v1/admin/relationships/check`, data);
  return res.data;
}

/**
 * 展开关系树
 * 展开指定对象的关系树，返回所有相关的用户主体和用户集合
 */
export async function adminRelationshipsExpand(params?: {
  object_type: string;  // 对象类型
  object_id: string;  // 对象ID
  relation: string;  // 关系名称
}) {
  const res = await api.get(`/identity/api/v1/admin/relationships/expand`, { params });
  return res.data;
}

/**
 * List Robots
 * Query Non-Human Identity (NHI) Robot list
 */
export async function adminRobots(params?: {
  status?: string;  // Status filter
  workload_subtype?: string;  // Workload subtype filter
  page?: number;  // Page number
  page_size?: number;  // Page size
}) {
  const res = await api.get(`/identity/api/v1/admin/robots`, { params });
  return res.data;
}

/**
 * Create Robot
 * Create a new Non-Human Identity (NHI) Robot
 */
export async function adminRobotsPost(data: CreateRobotRequest) {
  const res = await api.post(`/identity/api/v1/admin/robots`, data);
  return res.data;
}

/**
 * Delete Robot
 */
export async function adminRobotsByRobotsDelete(id: string) {
  await api.delete(`/identity/api/v1/admin/robots/${id}`);
}

/**
 * Get Robot
 */
export async function adminRobotsByRobots(id: string) {
  const res = await api.get(`/identity/api/v1/admin/robots/${id}`);
  return res.data;
}

/**
 * Update Robot
 */
export async function adminRobotsByRobotsPut(id: string, data: UpdateRobotRequest) {
  const res = await api.put(`/identity/api/v1/admin/robots/${id}`, data);
  return res.data;
}

/**
 * Commission Robot
 */
export async function adminRobotsCommissionByRobotsPost(id: string) {
  const res = await api.post(`/identity/api/v1/admin/robots/${id}/commission`);
  return res.data;
}

/**
 * Decommission Robot
 */
export async function adminRobotsDecommissionByRobotsPost(id: string) {
  const res = await api.post(`/identity/api/v1/admin/robots/${id}/decommission`);
  return res.data;
}

/**
 * Issue Intent Token
 */
export async function adminRobotsIntentByRobotsPost(id: string, data: IssueIntentTokenRequest) {
  const res = await api.post(`/identity/api/v1/admin/robots/${id}/intent`, data);
  return res.data;
}

/**
 * Revoke Intent Token
 */
export async function adminRobotsIntentRevokeByRobotsPost(id: string, data: RevokeIntentTokenRequest) {
  const res = await api.post(`/identity/api/v1/admin/robots/${id}/intent/revoke`, data);
  return res.data;
}

/**
 * 查询角色激活记录
 * 管理员分页查询所有角色激活记录，支持按状态过滤
 */
export async function adminRoleActivations(params?: {
  status?: string;  // 激活状态过滤
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/identity/api/v1/admin/role-activations`, { params });
  return res.data;
}

/**
 * 批准角色激活
 * 管理员批准待处理的角色激活请求
 */
export async function adminRoleActivationsApproveByRoleActivationsPost(id: string) {
  const res = await api.post(`/identity/api/v1/admin/role-activations/${id}/approve`);
  return res.data;
}

/**
 * 撤销角色激活
 * 管理员撤销正在生效的角色激活，立即移除用户的提权权限
 */
export async function adminRoleActivationsRevokeByRoleActivationsPost(id: string, data: RevokeActivationRequest) {
  const res = await api.post(`/identity/api/v1/admin/role-activations/${id}/revoke`, data);
  return res.data;
}

/**
 * 获取认证配置
 * 获取当前认证安全配置，包含密码策略和登录安全设置
 */
export async function adminSecurityAuthConfig() {
  const res = await api.get(`/identity/api/v1/admin/security/auth-config`);
  return res.data;
}

/**
 * 更新认证配置
 * 运行时更新认证安全配置，包含密码策略和登录安全设置
 */
export async function adminSecurityAuthConfigPut(data: UpdateAuthConfigRequest) {
  const res = await api.put(`/identity/api/v1/admin/security/auth-config`, data);
  return res.data;
}

/**
 * 获取密码策略
 * 获取当前的密码策略配置
 */
export async function adminSecurityPasswordPolicy() {
  const res = await api.get(`/identity/api/v1/admin/security/password-policy`);
  return res.data;
}

/**
 * 更新密码策略
 * 运行时更新密码策略配置，支持多租户差异化设置
 */
export async function adminSecurityPasswordPolicyPut(data: UpdatePasswordPolicyRequest) {
  const res = await api.put(`/identity/api/v1/admin/security/password-policy`, data);
  return res.data;
}

/**
 * 获取密码统计
 * 返回当前租户的密码统计信息，包括总数、活跃、过期、24小时变更和重置数
 */
export async function adminSecurityPasswordStats() {
  const res = await api.get(`/identity/api/v1/admin/security/password-stats`);
  return res.data;
}

/**
 * 获取风险配置
 * 获取当前租户的自适应风险评分配置（阈值/信号权重/学习期）
 */
export async function adminSecurityRiskConfig() {
  const res = await api.get(`/identity/api/v1/admin/security/risk-config`);
  return res.data;
}

/**
 * 更新风险配置
 * 更新租户的自适应风险评分阈值和信号权重
 */
export async function adminSecurityRiskConfigPut(data: RiskConfigRequest) {
  const res = await api.put(`/identity/api/v1/admin/security/risk-config`, data);
  return res.data;
}

/**
 * 重置风险配置
 * 删除自定义配置，恢复系统默认值
 */
export async function adminSecurityRiskConfigResetPost() {
  const res = await api.post(`/identity/api/v1/admin/security/risk-config/reset`);
  return res.data;
}

/**
 * 风险仪表盘
 * 获取租户风险全景：今日事件/评分分布/事件类型TopN/高风险用户Top5/7日趋势
 */
export async function adminSecurityRiskDashboard() {
  const res = await api.get(`/identity/api/v1/admin/security/risk-dashboard`);
  return res.data;
}

/**
 * 风险事件列表
 */
export async function adminSecurityRiskEvents(params?: {
  event_type?: string;  // 事件类型
  user_id?: string;  // 用户ID
  min_score?: number;  // 最低风险分数
  start_date?: string;  // 开始日期 (RFC3339)
  end_date?: string;  // 结束日期 (RFC3339)
}) {
  const res = await api.get(`/identity/api/v1/admin/security/risk-events`, { params });
  return res.data;
}

/**
 * 风险事件聚合
 */
export async function adminSecurityRiskEventsAggregation(params?: {
  start_date?: string;  // 开始日期 (RFC3339)
  end_date?: string;  // 结束日期 (RFC3339)
}) {
  const res = await api.get(`/identity/api/v1/admin/security/risk-events/aggregation`, { params });
  return res.data;
}

/**
 * 查询用户列表
 * 获取租户下的用户列表，支持按状态和关键字搜索
 */
export async function adminUsers(params?: {
  status?: string;  // 用户状态
  search?: string;  // 搜索关键字
  page?: number;  // 页码
  limit?: number;  // 每页数量
}) {
  const res = await api.get(`/identity/api/v1/admin/users`, { params });
  return res.data;
}

/**
 * 创建用户
 * 创建新用户账号并返回用户信息
 */
export async function adminUsersPost(data: HTTPUserCreateRequest) {
  const res = await api.post(`/identity/api/v1/admin/users`, data);
  return res.data;
}

/**
 * 批量创建用户
 * 批量创建多个用户，单个失败不影响其他用户
 */
export async function adminUsersBatchPost(data: BatchCreateUserRequest) {
  const res = await api.post(`/identity/api/v1/admin/users/batch`, data);
  return res.data;
}

/**
 * 批量更新用户状态
 * 批量更新多个用户的状态
 */
export async function adminUsersBatchStatusPost(data: BatchUpdateUserStatusRequest) {
  const res = await api.post(`/identity/api/v1/admin/users/batch/status`, data);
  return res.data;
}

/**
 * 合并用户
 * 将两个用户合并为一个，保留主账户，合并从账户的身份、角色和关联数据
 */
export async function adminUsersMergePost(data: MergeUsersRequest) {
  const res = await api.post(`/identity/api/v1/admin/users/merge`, data);
  return res.data;
}

/**
 * 删除用户
 * 根据用户ID删除用户，支持永久删除
 */
export async function adminUsersByUsersDelete(userId: string, params?: {
  permanent?: boolean;  // 是否永久删除
}) {
  await api.delete(`/identity/api/v1/admin/users/${userId}`, { params });
}

/**
 * 获取用户详情
 * 根据用户ID获取用户详细信息和身份列表
 */
export async function adminUsersByUsers(userId: string) {
  const res = await api.get(`/identity/api/v1/admin/users/${userId}`);
  return res.data;
}

/**
 * 更新用户信息
 * 更新指定用户的状态、MFA设置和元数据
 */
export async function adminUsersByUsersPut(userId: string, data: UserUpdateRequest) {
  const res = await api.put(`/identity/api/v1/admin/users/${userId}`, data);
  return res.data;
}

/**
 * 解锁账户
 * 解锁指定用户的账户
 */
export async function adminUsersAccountUnlocksByUsersPost(userId: string, data: UnlockAccountRequest) {
  const res = await api.post(`/identity/api/v1/admin/users/${userId}/account-unlocks`, data);
  return res.data;
}

/**
 * 拒绝儿童同意
 * 管理员拒绝家长/儿童同意，标记未成年人账户为拒绝状态
 */
export async function adminUsersChildrenConsentDenyByUsersPost(userId: string) {
  const res = await api.post(`/identity/api/v1/admin/users/${userId}/children-consent/deny`);
  return res.data;
}

/**
 * 验证儿童同意
 * 管理员验证家长/儿童同意，完成未成年人账户的激活
 */
export async function adminUsersChildrenConsentVerifyByUsersPost(userId: string) {
  const res = await api.post(`/identity/api/v1/admin/users/${userId}/children-consent/verify`);
  return res.data;
}

/**
 * 获取用户身份列表
 * 获取指定用户的所有登录身份列表
 */
export async function adminUsersIdentitiesByUsers(userId: string) {
  const res = await api.get(`/identity/api/v1/admin/users/${userId}/identities`);
  return res.data;
}

/**
 * 添加用户身份
 * 为指定用户添加新的登录身份（如邮箱、手机号、第三方账号）
 */
export async function adminUsersIdentitiesByUsersPost(userId: string, data: AddIdentityRequest) {
  const res = await api.post(`/identity/api/v1/admin/users/${userId}/identities`, data);
  return res.data;
}

/**
 * 移除用户身份
 * 移除指定用户的某个登录身份
 */
export async function adminUsersIdentitiesByUsersByIdentitiesDelete(userId: string, identityId: string) {
  await api.delete(`/identity/api/v1/admin/users/${userId}/identities/${identityId}`);
}

/**
 * 设置主身份
 * 将指定用户的某个身份设为主登录身份
 */
export async function adminUsersIdentitiesSetPrimaryByUsersByIdentitiesPut(userId: string, identityId: string) {
  const res = await api.put(`/identity/api/v1/admin/users/${userId}/identities/${identityId}/set-primary`);
  return res.data;
}

/**
 * 验证用户身份
 * 验证指定用户的某个身份（如发送验证码到邮箱/手机）
 */
export async function adminUsersIdentitiesVerificationsByUsersByIdentitiesPost(userId: string, identityId: string) {
  const res = await api.post(`/identity/api/v1/admin/users/${userId}/identities/${identityId}/verifications`);
  return res.data;
}

/**
 * 管理员模拟用户
 * 管理员获取目标用户的JWT（模拟会话），需要super_admin角色
 */
export async function adminUsersImpersonateByUsersPost(userId: string, data: ImpersonateRequest) {
  const res = await api.post(`/identity/api/v1/admin/users/${userId}/impersonate`, data);
  return res.data;
}

/**
 * 获取登录历史
 * 获取指定用户的登录历史记录列表
 */
export async function adminUsersLoginHistoriesByUsers(userId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/identity/api/v1/admin/users/${userId}/login-histories`, { params });
  return res.data;
}

/**
 * 管理员查看用户OAuth连接
 * 管理员查看指定用户绑定的所有第三方OAuth连接列表
 */
export async function adminUsersOauthConnectionsByUsers(userId: string) {
  const res = await api.get(`/identity/api/v1/admin/users/${userId}/oauth-connections`);
  return res.data;
}

/**
 * 修改密码
 * 管理员为指定用户修改/重置密码
 */
export async function adminUsersPasswordByUsersPut(userId: string, data: HTTPChangePasswordRequest) {
  const res = await api.put(`/identity/api/v1/admin/users/${userId}/password`, data);
  return res.data;
}

/**
 * 重置密码
 * 管理员触发指定用户的密码重置流程
 */
export async function adminUsersPasswordResetsByUsersPost(userId: string, data: HTTPResetPasswordRequest) {
  const res = await api.post(`/identity/api/v1/admin/users/${userId}/password-resets`, data);
  return res.data;
}

/**
 * 获取用户密码状态
 * 查看用户的密码生命周期状态，包括是否需强制修改、密码年龄、过期时间等
 */
export async function adminUsersPasswordStatusByUsers(userId: string) {
  const res = await api.get(`/identity/api/v1/admin/users/${userId}/password-status`);
  return res.data;
}

/**
 * 获取安全状态
 * 获取用户安全状态信息
 */
export async function adminUsersSecurityStatusByUsers(userId: string) {
  const res = await api.get(`/identity/api/v1/admin/users/${userId}/security-status`);
  return res.data;
}

/**
 * 更新用户状态
 * 管理员更新指定用户的状态（如启用、禁用、锁定等）
 */
export async function adminUsersStatusByUsersPut(userId: string) {
  const res = await api.put(`/identity/api/v1/admin/users/${userId}/status`);
  return res.data;
}

/**
 * 匿名认证
 * 创建临时匿名会话并返回受限JWT令牌（anonymous角色，无刷新令牌），用于浏览公开内容或低风险操作。匿名用户ID以anon_前缀标识。
 */
export async function authAnonymousPost(data: AnonymousSigninRequest) {
  const res = await api.post(`/identity/api/v1/auth/anonymous`, data);
  return res.data;
}

/**
 * 查询 API Key 列表
 * 查询当前用户的 API Key 列表，绝不返回原文或哈希
 */
export async function authApiKeys(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  status?: string;  // 状态筛选: active/inactive/revoked
  environment?: string;  // 环境筛选: live/test
  search?: string;  // 搜索名称或前缀
}) {
  const res = await api.get(`/identity/api/v1/auth/api-keys`, { params });
  return res.data;
}

/**
 * 创建 API Key
 * 创建新的 API Key，返回原始 Key 仅一次
 */
export async function authApiKeysPost(data: CreateApiKeyRequest) {
  const res = await api.post(`/identity/api/v1/auth/api-keys`, data);
  return res.data;
}

/**
 * 吊销 API Key
 * 软删除 API Key（保留审计记录）
 */
export async function authApiKeysByApiKeysDelete(id: string) {
  await api.delete(`/identity/api/v1/auth/api-keys/${id}`);
}

/**
 * 获取 API Key 详情
 * 根据 ID 获取 API Key 详情，绝不返回原文
 */
export async function authApiKeysByApiKeys(id: string) {
  const res = await api.get(`/identity/api/v1/auth/api-keys/${id}`);
  return res.data;
}

/**
 * 获取 API Key 审计日志
 * 获取指定 API Key 的审计日志记录（验证成功/失败记录）
 */
export async function authApiKeysAuditLogsByApiKeys(id: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/identity/api/v1/auth/api-keys/${id}/audit-logs`, { params });
  return res.data;
}

/**
 * 添加 IP 限制
 * 为 API Key 添加 IP/CIDR 限制
 */
export async function authApiKeysIpRestrictionsByApiKeysPost(id: string, data: AddIPRestrictionRequest) {
  const res = await api.post(`/identity/api/v1/auth/api-keys/${id}/ip-restrictions`, data);
  return res.data;
}

/**
 * 删除 IP 限制
 * 从 API Key 中删除指定的 IP/CIDR 限制
 */
export async function authApiKeysIpRestrictionsByApiKeysByIpRestrictionsDelete(id: string, restrictionId: string) {
  await api.delete(`/identity/api/v1/auth/api-keys/${id}/ip-restrictions/${restrictionId}`);
}

/**
 * 轮换 API Key
 * 创建新 Key 并标记旧 Key 为 inactive（24h 宽限期），返回新 Key 仅一次
 */
export async function authApiKeysRotateByApiKeysPost(id: string) {
  const res = await api.post(`/identity/api/v1/auth/api-keys/${id}/rotate`);
  return res.data;
}

/**
 * 更新 API Key 权限范围
 * 更新 API Key 的 scope 列表
 */
export async function authApiKeysScopesByApiKeysPut(id: string, data: UpdateApiKeyScopesRequest) {
  const res = await api.put(`/identity/api/v1/auth/api-keys/${id}/scopes`, data);
  return res.data;
}

/**
 * 启用/禁用 API Key
 * 切换 API Key 状态（active ↔ inactive）
 */
export async function authApiKeysStatusByApiKeysPut(id: string, data: UpdateApiKeyStatusRequest) {
  const res = await api.put(`/identity/api/v1/auth/api-keys/${id}/status`, data);
  return res.data;
}

/**
 * 获取 API Key 使用统计
 * 获取指定 API Key 的使用统计信息
 */
export async function authApiKeysUsageByApiKeys(id: string) {
  const res = await api.get(`/identity/api/v1/auth/api-keys/${id}/usage`);
  return res.data;
}

/**
 * 获取 API Key 使用统计
 * 获取指定 API Key 的 30 天每日调用统计
 */
export async function authApiKeysUsageStatsByApiKeys(id: string) {
  const res = await api.get(`/identity/api/v1/auth/api-keys/${id}/usage-stats`);
  return res.data;
}

/**
 * 获取CAPTCHA挑战
 * 获取PoW或Turnstile CAPTCHA挑战，用于登录等需要人机验证的场景。返回挑战ID和数据，前端求解后随登录请求提交。用于防止自动化攻击和暴力破解。
 */
export async function authCaptchaChallenge(params?: {
  provider?: "pow" | "turnstile";  // CAPTCHA提供商
}) {
  const res = await api.get(`/identity/api/v1/auth/captcha/challenge`, { params });
  return res.data;
}

/**
 * 忘记密码
 * 用户忘记密码时，通过邮箱或手机号发送密码重置验证码，支持邮箱和短信两种方式。参考：NIST SP 800-63B §5.1.1.2、OWASP ASVS V2.1。
 */
export async function authForgotPasswordPost(data: ForgotPasswordRequest) {
  const res = await api.post(`/identity/api/v1/auth/forgot-password`, data);
  return res.data;
}

/**
 * 生成一次性票据
 * 为指定用户生成一次性登录票据（5分钟有效，一次性使用），用于SSO跳转或管理员代登录场景。需要JWT认证，由管理员或系统调用。
 */
export async function authGenerateTicketPost(data: GenerateTicketInput) {
  const res = await api.post(`/identity/api/v1/auth/generate-ticket`, data);
  return res.data;
}

/**
 * ID Token登录
 * 使用外部OIDC Provider签发的ID Token进行跨系统SSO登录，验证id_token后返回本地JWT令牌
 */
export async function authIdTokenSigninPost(data: Record<string, unknown>) {
  const res = await api.post(`/identity/api/v1/auth/id-token/signin`, data);
  return res.data;
}

/**
 * LDAP directory authentication
 * Authenticate user against configured LDAP/AD directory
 */
export async function authLdapLoginPost(data: LdapLoginRequest) {
  const res = await api.post(`/identity/api/v1/auth/ldap/login`, data);
  return res.data;
}

/**
 * 用户登录
 * 使用用户名、邮箱或手机号加密码进行登录，支持渐进式延迟反暴力破解、CAPTCHA人机验证和风险评估。登录成功后返回JWT令牌。参考：NIST SP 800-63B §5.1.1.2、OWASP ASVS V2.1。
 */
export async function authLoginPost(data: LoginRequest) {
  const res = await api.post(`/identity/api/v1/auth/login`, data);
  return res.data;
}

/**
 * 邮箱验证码登录
 * 使用邮箱验证码进行免密登录，支持自动注册
 */
export async function authLoginEmailCodePost(data: LoginByEmailCodeRequest) {
  const res = await api.post(`/identity/api/v1/auth/login/email-code`, data);
  return res.data;
}

/**
 * 手机验证码登录
 * 使用手机验证码进行免密登录，支持自动注册
 */
export async function authLoginPhoneCodePost(data: LoginByPhoneCodeRequest) {
  const res = await api.post(`/identity/api/v1/auth/login/phone-code`, data);
  return res.data;
}

/**
 * 发送魔法链接
 * 接收邮箱，生成一次性 magic link token 并发送到用户邮箱（dev模式打印到日志）
 */
export async function authMagicLinkPost(data: MagicLinkRequest) {
  const res = await api.post(`/identity/api/v1/auth/magic-link`, data);
  return res.data;
}

/**
 * 魔法链接回调 (GET→POST 双步跳转)
 * GET: 渲染中转HTML页面 (无泄露), POST: 验证token生成JWT
 */
export async function authMagicLinkCallback(params?: {
  token?: string;  // 魔法链接令牌 (GET)
}) {
  const res = await api.get(`/identity/api/v1/auth/magic-link/callback`, { params });
  return res.data;
}

/**
 * 魔法链接回调 (GET→POST 双步跳转)
 * GET: 渲染中转HTML页面 (无泄露), POST: 验证token生成JWT
 */
export async function authMagicLinkCallbackPost(params?: {
  token?: string;  // 魔法链接令牌 (GET)
}) {
  const res = await api.post(`/identity/api/v1/auth/magic-link/callback`, undefined, { params });
  return res.data;
}

/**
 * 验证魔法链接
 * 验证 token 有效性，返回 JWT 令牌和用户信息
 */
export async function authMagicLinkConfirm(params?: {
  token: string;  // 魔法链接令牌
}) {
  const res = await api.get(`/identity/api/v1/auth/magic-link/confirm`, { params });
  return res.data;
}

/**
 * 请求发送魔法链接
 * 验证邮箱并发送包含魔法链接的邮件。无论邮箱是否注册均返回成功（防枚举）。
 */
export async function authMagicLinkRequestPost(data: RequestMagicLinkRequest) {
  const res = await api.post(`/identity/api/v1/auth/magic-link/request`, data);
  return res.data;
}

/**
 * 停用当前账户
 * 停用当前登录用户的账户，需提供密码验证。账户将被软删除，数据保留可恢复。
 */
export async function authMeDelete(data: DeactivateAccountRequest) {
  await api.delete(`/identity/api/v1/auth/me`, { data });
}

/**
 * 获取当前登录用户信息
 * 返回当前认证用户的ID、用户名、邮箱、手机号及账户状态，支持从JWT直接解析用户身份。参考：RFC 7519 (JWT)、OWASP ASVS V2.1。
 */
export async function authMe() {
  const res = await api.get(`/identity/api/v1/auth/me`);
  return res.data;
}

/**
 * 更新当前用户信息
 * 更新当前认证用户的基本资料，支持修改用户名和MFA启用状态。参考：GDPR Art 16 (Right to Rectification)、OWASP ASVS V2.1。
 */
export async function authMePut(data: UpdateUserAuthRequest) {
  const res = await api.put(`/identity/api/v1/auth/me`, data);
  return res.data;
}

/**
 * 获取我的审计日志
 * 分页查询当前用户的操作审计日志，支持按时间范围和操作类型筛选
 */
export async function authMeAuditLogs(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  start_date?: string;  // 开始日期
  end_date?: string;  // 结束日期
  action?: string;  // 操作类型
}) {
  const res = await api.get(`/identity/api/v1/auth/me/audit-logs`, { params });
  return res.data;
}

/**
 * 获取用户最新的认证器加密备份数据
 */
export async function authMeAuthenticatorBackup() {
  const res = await api.get(`/identity/api/v1/auth/me/authenticator/backup`);
  return res.data;
}

/**
 * 上传前端PBKDF2+AES-GCM加密的认证器备份，服务端仅存储密文无法解密。每个用户最多保存3个历史版本（LRU淘汰）
 */
export async function authMeAuthenticatorBackupPost(data: AuthenticatorBackupUploadRequest) {
  const res = await api.post(`/identity/api/v1/auth/me/authenticator/backup`, data);
  return res.data;
}

/**
 * 删除指定版本的认证器加密备份
 */
export async function authMeAuthenticatorBackupByBackupDelete(id: string) {
  await api.delete(`/identity/api/v1/auth/me/authenticator/backup/${id}`);
}

export async function authMeAuthenticatorDevices() {
  const res = await api.get(`/identity/api/v1/auth/me/authenticator/devices`);
  return res.data;
}

/**
 * 移除认证器设备
 * 移除指定的认证器设备（清理关联的Push订阅和TOTP设备）
 */
export async function authMeAuthenticatorDevicesByDevicesDelete(id: string) {
  await api.delete(`/identity/api/v1/auth/me/authenticator/devices/${id}`);
}

/**
 * 获取儿童隐私同意状态
 * 获取关联儿童账户的隐私同意状态，用于COPPA/GDPR合规
 */
export async function authMeChildrenConsent() {
  const res = await api.get(`/identity/api/v1/auth/me/children-consent`);
  return res.data;
}

/**
 * 撤销用户同意
 * 撤销用户对特定隐私范围的同意授权，满足GDPR要求
 */
export async function authMeConsentDelete(params?: {
  scope?: string;  // request body
}) {
  await api.delete(`/identity/api/v1/auth/me/consent`, { params });
}

/**
 * 记录用户同意
 * 记录用户对特定隐私范围的同意授权，用于GDPR合规
 */
export async function authMeConsentPost(data: ConsentRequest) {
  const res = await api.post(`/identity/api/v1/auth/me/consent`, data);
  return res.data;
}

/**
 * 获取同意历史记录
 * 获取用户的同意授权历史记录，用于GDPR合规审计
 */
export async function authMeConsentHistory() {
  const res = await api.get(`/identity/api/v1/auth/me/consent-history`);
  return res.data;
}

/**
 * 永久删除账户 (GDPR 被遗忘权/账户删除)
 * 依据GDPR第17条，永久删除用户账户数据，需密码验证，不可恢复
 */
export async function authMeDeleteAccountPost() {
  const res = await api.post(`/identity/api/v1/auth/me/delete-account`);
  return res.data;
}

/**
 * 获取我的设备列表
 * 获取当前用户关联的所有设备列表
 */
export async function authMeDevices() {
  const res = await api.get(`/identity/api/v1/auth/me/devices`);
  return res.data;
}

/**
 * 移除设备
 * 移除指定设备，取消该设备的信任状态
 */
export async function authMeDevicesByDevicesDelete(deviceId: string) {
  await api.delete(`/identity/api/v1/auth/me/devices/${deviceId}`);
}

/**
 * 信任/取消信任设备
 * 设置或取消设备的信任状态，信任设备可跳过重复的MFA验证
 */
export async function authMeDevicesTrustByDevicesPut(deviceId: string, data: SelfTrustDeviceRequest) {
  const res = await api.put(`/identity/api/v1/auth/me/devices/${deviceId}/trust`, data);
  return res.data;
}

/**
 * 检查邮箱验证状态
 * 获取当前登录用户的邮箱验证状态
 */
export async function authMeEmailVerificationStatus() {
  const res = await api.get(`/identity/api/v1/auth/me/email-verification-status`);
  return res.data;
}

/**
 * 变更邮箱地址
 * 变更当前用户的邮箱地址，需验证当前密码、新邮箱以及发送验证码
 */
export async function authMeEmailChangePost(data: ChangeEmailRequest) {
  const res = await api.post(`/identity/api/v1/auth/me/email/change`, data);
  return res.data;
}

/**
 * 验证邮箱变更
 * 验证邮箱变更的验证码，验证成功后更新主邮箱
 */
export async function authMeEmailVerifyPost(data: VerifyChangeRequest) {
  const res = await api.post(`/identity/api/v1/auth/me/email/verify`, data);
  return res.data;
}

/**
 * 导出我的数据 (GDPR DSAR)
 * 依据GDPR第15/20条，导出用户全部个人数据，包含身份、设备、会话、钱包、审计等跨服务数据
 */
export async function authMeExportDataPost() {
  const res = await api.post(`/identity/api/v1/auth/me/export-data`);
  return res.data;
}

/**
 * 获取我的租户成员状态
 * 返回当前用户在所有租户下的成员身份状态（包括 pending/disabled）
 */
export async function authMeMemberships() {
  const res = await api.get(`/identity/api/v1/auth/me/memberships`);
  return res.data;
}

/**
 * 修改当前用户密码
 * 验证旧密码后设置新密码，修改成功后自动撤销所有会话以确保账户安全。参考：NIST SP 800-63B §5.1.1.2、OWASP ASVS V2.1。
 */
export async function authMePasswordPut(data: HTTPChangePasswordRequest) {
  const res = await api.put(`/identity/api/v1/auth/me/password`, data);
  return res.data;
}

/**
 * 检查密码强度
 * 使用当前租户的密码策略检查密码强度
 */
export async function authMePasswordStrengthPost(data: SelfServicePasswordStrengthRequest) {
  const res = await api.post(`/identity/api/v1/auth/me/password-strength`, data);
  return res.data;
}

/**
 * 获取当前用户权限
 * 返回当前用户在租户下的所有权限代码列表，包括角色继承权限、层级权限和直赋权限的聚合结果。参考：NIST SP 800-53 AC-6、OWASP ASVS V1.2。
 */
export async function authMePermissions() {
  const res = await api.get(`/identity/api/v1/auth/me/permissions`);
  return res.data;
}

/**
 * 检查手机号验证状态
 * 获取当前登录用户的手机号验证状态
 */
export async function authMePhoneVerificationStatus() {
  const res = await api.get(`/identity/api/v1/auth/me/phone-verification-status`);
  return res.data;
}

/**
 * 变更手机号
 * 变更当前用户的手机号，需要验证新手机号和当前密码
 */
export async function authMePhoneChangePost(data: ChangePhoneRequest) {
  const res = await api.post(`/identity/api/v1/auth/me/phone/change`, data);
  return res.data;
}

/**
 * 验证手机号变更
 * 验证手机号变更的验证码，验证成功后更新主手机号
 */
export async function authMePhoneVerifyPost(data: VerifyChangeRequest) {
  const res = await api.post(`/identity/api/v1/auth/me/phone/verify`, data);
  return res.data;
}

/**
 * 获取恢复联系人列表
 * 获取用户设置的恢复联系方式（recovery email/phone），数据存储在用户Metadata中
 */
export async function authMeRecoveryContacts() {
  const res = await api.get(`/identity/api/v1/auth/me/recovery-contacts`);
  return res.data;
}

/**
 * 添加恢复联系人
 * 添加新的recovery email/phone作为账户恢复联系方式
 */
export async function authMeRecoveryContactsPost(data: AddRecoveryContactRequest) {
  const res = await api.post(`/identity/api/v1/auth/me/recovery-contacts`, data);
  return res.data;
}

/**
 * 移除恢复联系人
 * 移除指定的恢复联系方式
 */
export async function authMeRecoveryContactsByRecoveryContactsDelete(contactId: string) {
  await api.delete(`/identity/api/v1/auth/me/recovery-contacts/${contactId}`);
}

/**
 * 查询我的角色激活
 * 返回当前用户的所有角色激活记录
 */
export async function authMeRoleActivations() {
  const res = await api.get(`/identity/api/v1/auth/me/role-activations`);
  return res.data;
}

/**
 * 请求角色激活
 * 用户提交角色激活请求（即时提权JIT），提供角色ID、理由和有效时长
 */
export async function authMeRoleActivationsPost(data: RequestActivationRequest) {
  const res = await api.post(`/identity/api/v1/auth/me/role-activations`, data);
  return res.data;
}

/**
 * 获取SAML关联账户列表
 * 获取当前用户绑定的所有SAML/SSO身份提供商账户
 */
export async function authMeSamlLinks() {
  const res = await api.get(`/identity/api/v1/auth/me/saml-links`);
  return res.data;
}

/**
 * 解绑SAML关联账户
 * 解绑指定的SAML/SSO身份提供商账户关联
 */
export async function authMeSamlLinksBySamlLinksDelete(id: string) {
  await api.delete(`/identity/api/v1/auth/me/saml-links/${id}`);
}

/**
 * 获取安全事件列表
 * 分页获取用户的安全相关事件（异常登录、密码变更、MFA变更等）
自动过滤已dismiss的事件
 */
export async function authMeSecurityEvents(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/identity/api/v1/auth/me/security-events`, { params });
  return res.data;
}

/**
 * 关闭安全事件提醒
 * 标记安全事件为已关闭（dismissed=true），事件将从列表中消失
 */
export async function authMeSecurityEventsDismissBySecurityEventsPost(eventId: string, data: SecurityEventDismissRequest) {
  const res = await api.post(`/identity/api/v1/auth/me/security-events/${eventId}/dismiss`, data);
  return res.data;
}

/**
 * 登出所有会话
 * 登出当前用户的所有会话，调用 deviceService.RemoveAllDevices 清除所有设备记录
 */
export async function authMeSessionsDelete() {
  await api.delete(`/identity/api/v1/auth/me/sessions`);
}

/**
 * 获取我的会话列表
 * 获取当前用户的所有活跃会话，优先从 session-service 获取，包含AMR/IP/GeoIP等安全上下文信息
若sessionClient不可用则降级到deviceService设备记录查询
 */
export async function authMeSessions(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/identity/api/v1/auth/me/sessions`, { params });
  return res.data;
}

/**
 * 登出指定会话
 * 登出指定会话ID，如果设备记录存在则同时清除
 */
export async function authMeSessionsBySessionsDelete(sessionId: string) {
  await api.delete(`/identity/api/v1/auth/me/sessions/${sessionId}`);
}

/**
 * 结束模拟会话
 * 当前模拟会话中，停止模拟并返回管理员的JWT
 */
export async function authMeStopImpersonationPost() {
  const res = await api.post(`/identity/api/v1/auth/me/stop-impersonation`);
  return res.data;
}

/**
 * 切换当前租户
 * 验证用户在新租户下的成员资格，检查跨租户切换策略，验证通过后签发新JWT令牌（含新租户的角色和权限）。参考：NIST SP 800-53 AC-2、OWASP ASVS V1.2。
 */
export async function authMeSwitchTenantPost(data: SwitchTenantRequest) {
  const res = await api.post(`/identity/api/v1/auth/me/switch-tenant`, data);
  return res.data;
}

/**
 * 获取当前用户租户
 * 返回当前用户有权限访问的所有租户列表，包含租户ID、名称、显示名称和用户在各租户的角色。支持通过租户服务获取租户显示名称。
 */
export async function authMeTenants() {
  const res = await api.get(`/identity/api/v1/auth/me/tenants`);
  return res.data;
}

/**
 * 获取已注册的Passkey列表
 * 获取当前用户已注册的所有WebAuthn凭证
 */
export async function authMeWebauthnCredentials() {
  const res = await api.get(`/identity/api/v1/auth/me/webauthn-credentials`);
  return res.data;
}

/**
 * 删除Passkey
 * 删除指定的WebAuthn凭证
 */
export async function authMeWebauthnCredentialsByWebauthnCredentialsDelete(id: string) {
  await api.delete(`/identity/api/v1/auth/me/webauthn-credentials/${id}`);
}

/**
 * 验证MFA挑战
 * 使用challenge_token和MFA验证码（TOTP/SMS/Email）完成多因素认证，验证成功后返回真实JWT令牌，替换临时的挑战令牌。参考：RFC 6238 (TOTP)、RFC 4226 (HOTP)、NIST SP 800-63B §5.1、OWASP ASVS V2.8。
 */
export async function authMfaVerifyChallengePost(data: VerifyMFAChallengeRequest) {
  const res = await api.post(`/identity/api/v1/auth/mfa/verify-challenge`, data);
  return res.data;
}

/**
 * 获取用户OAuth账号列表
 * 获取当前用户绑定的所有第三方OAuth账号
 */
export async function authOauthAccounts() {
  const res = await api.get(`/identity/api/v1/auth/oauth/accounts`);
  return res.data;
}

/**
 * 绑定OAuth账号
 * 为当前用户绑定第三方OAuth账号
 */
export async function authOauthBindPost(data: BindOAuthRequest) {
  const res = await api.post(`/identity/api/v1/auth/oauth/bind`, data);
  return res.data;
}

/**
 * 获取OAuth提供商列表
 * 获取系统支持的所有OAuth登录提供者列表
 */
export async function authOauthProviders() {
  const res = await api.get(`/identity/api/v1/auth/oauth/providers`);
  return res.data;
}

/**
 * 解绑OAuth账号
 * 解绑当前用户绑定的第三方OAuth账号
 */
export async function authOauthUnbindPost(data: UnbindOAuthRequest) {
  const res = await api.post(`/identity/api/v1/auth/oauth/unbind`, data);
  return res.data;
}

/**
 * 发起OAuth登录
 * 发起OAuth授权流程，重定向到第三方授权页面
 */
export async function authOauthByOauth(provider: string) {
  const res = await api.get(`/identity/api/v1/auth/oauth/${provider}`);
  return res.data;
}

/**
 * OAuth回调
 * 处理OAuth授权回调，获取用户信息并创建会话
 */
export async function authOauthCallbackByOauth(provider: string, params?: {
  code: string;  // 鎺堟潈鐮?
  state: string;  // 状态参数
}) {
  const res = await api.get(`/identity/api/v1/auth/oauth/${provider}/callback`, { params });
  return res.data;
}

/**
 * OIDC后通道登出
 * 处理OpenID Connect Backchannel Logout 1.0规范的后通道登出请求。接收OP发送的logout_token，验证后撤销对应用户的所有会话。
 */
export async function authOidcBackchannelLogoutPost(data: BackchannelLogoutRequest) {
  const res = await api.post(`/identity/api/v1/auth/oidc/backchannel-logout`, data);
  return res.data;
}

/**
 * RP发起登出
 * 处理OpenID Connect RP-Initiated Logout 1.0规范的登出请求。根据id_token_hint重定向到OP的end_session_endpoint或post_logout_redirect_uri，同时撤销当前用户的会话。
 */
export async function authOidcLogoutPost(params?: {
  id_token_hint?: string;  // ID Token提示
  post_logout_redirect_uri?: string;  // 登出后重定向URI
  state?: string;  // 状态参数
}) {
  const res = await api.post(`/identity/api/v1/auth/oidc/logout`, undefined, { params });
  return res.data;
}

/**
 * OIDC会话状态iframe
 * 返回OpenID Connect Session Management 1.0规范的不可见iframe，用于第三方cookie的会话状态追踪。
 */
export async function authOidcSessionIframe() {
  const res = await api.get(`/identity/api/v1/auth/oidc/session-iframe`);
  return res.data;
}

/**
 * 取消二维码登录
 * 取消正在进行的二维码登录会话
 */
export async function authQrLoginCancelPost(data: QrLoginCancelRequest) {
  const res = await api.post(`/identity/api/v1/auth/qr-login/cancel`, data);
  return res.data;
}

/**
 * 确认二维码登录
 * 已登录用户在移动端确认登录请求，完成二维码登录流程
 */
export async function authQrLoginConfirmPost(data: QrLoginConfirmRequest) {
  const res = await api.post(`/identity/api/v1/auth/qr-login/confirm`, data);
  return res.data;
}

/**
 * 发起二维码登录
 * 生成一个新的二维码登录会话，返回会话令牌和数字匹配码供用户扫描
 */
export async function authQrLoginInitiatePost() {
  const res = await api.post(`/identity/api/v1/auth/qr-login/initiate`);
  return res.data;
}

/**
 * 扫描二维码登录
 * 已登录用户扫描二维码，将会话状态更新为已扫描，同时可附件设备信息
 */
export async function authQrLoginScanPost(data: QrLoginScanRequest) {
  const res = await api.post(`/identity/api/v1/auth/qr-login/scan`, data);
  return res.data;
}

/**
 * 查询二维码登录状态
 * 轮询二维码登录会话的当前状态，确认完成后返回access_token和refresh_token
 */
export async function authQrLoginStatus(params?: {
  token: string;  // 会话令牌
}) {
  const res = await api.get(`/identity/api/v1/auth/qr-login/status`, { params });
  return res.data;
}

/**
 * 重新认证（Step-up）
 * 高风险操作前的重新认证，通过密码验证提升当前会话的安全级别
返回step_up_token，有效期5分钟，可用于后续高安全操作的身份令牌传递
 */
export async function authReAuthenticatePost(data: ReAuthenticateRequest) {
  const res = await api.post(`/identity/api/v1/auth/re-authenticate`, data);
  return res.data;
}

/**
 * 通过恢复联系人初始化账户恢复
 * 当用户无法访问主身份（邮箱或手机）时，通过预先设置的恢复联系人来验证身份并发起密码重置流程。参考：NIST SP 800-63B §5.1.1.2、OWASP ASVS V2.3。
 */
export async function authRecoverAccountPost(data: RecoverAccountRequest) {
  const res = await api.post(`/identity/api/v1/auth/recover-account`, data);
  return res.data;
}

/**
 * 通过恢复码重置密码
 * 使用账户恢复验证码验证通过后，设置新密码，完成账户恢复和密码重置。参考：NIST SP 800-63B §5.1.1.2。
 */
export async function authRecoverAccountResetPost(data: RecoverAccountResetRequest) {
  const res = await api.post(`/identity/api/v1/auth/recover-account/reset`, data);
  return res.data;
}

/**
 * 完成账户恢复
 * 验证恢复码和恢复令牌后设置新密码，自动撤销所有会话以确保账户安全，并发送密码变更通知。参考：NIST SP 800-63B §5.1.1.2、OWASP ASVS V2.1。
 */
export async function authRecoveryCompletePost(data: CompleteAccountRecoveryRequest) {
  const res = await api.post(`/identity/api/v1/auth/recovery/complete`, data);
  return res.data;
}

/**
 * 发起账户恢复
 * 通过邮箱或手机号发起账户恢复流程，生成恢复令牌并向受信任联系人发送验证码，支持将恢复码发送至备用邮箱或手机。参考：NIST SP 800-63B §5.1.1.2、OWASP ASVS V2.3。
 */
export async function authRecoveryRequestPost(data: RequestAccountRecoveryRequest) {
  const res = await api.post(`/identity/api/v1/auth/recovery/request`, data);
  return res.data;
}

/**
 * 验证账户恢复码
 * 验证从受信任联系人收到的恢复码，验证成功后返回确认，允许用户进入密码重置步骤。参考：NIST SP 800-63B §5.1.1.2、OWASP ASVS V2.3。
 */
export async function authRecoveryVerifyPost(data: VerifyAccountRecoveryRequest) {
  const res = await api.post(`/identity/api/v1/auth/recovery/verify`, data);
  return res.data;
}

/**
 * 刷新访问令牌
 * 使用刷新令牌获取新的访问令牌和刷新令牌对，支持复用攻击检测与自动撤销。参考：RFC 6749 §1.5、RFC 7519 (JWT)。
 */
export async function authRefreshPost(data: RefreshTokenRequest) {
  const res = await api.post(`/identity/api/v1/auth/refresh`, data);
  return res.data;
}

/**
 * 用户注册
 * 使用用户名、邮箱、手机号和密码创建账户，支持开放注册、邀请注册和审批三种成员加入方式。创建成功后自动发送欢迎通知。参考：OWASP ASVS V2.2。
 */
export async function authRegisterPost(data: RegisterRequest) {
  const res = await api.post(`/identity/api/v1/auth/register`, data);
  return res.data;
}

/**
 * 检查邮箱是否可用
 * 在用户注册前校验邮箱是否已被注册，防止重复注册与临时邮箱滥用。支持GET和POST两种请求方式。参考：OWASP ASVS V2.2。
 */
export async function authRegisterCheckEmail(data: CheckEmailRequest, params?: {
  email?: string;  // 邮箱地址（GET方式）
}) {
  const res = await api.get(`/identity/api/v1/auth/register/check-email`, { params });
  return res.data;
}

/**
 * 检查邮箱是否可用
 * 在用户注册前校验邮箱是否已被注册，防止重复注册与临时邮箱滥用。支持GET和POST两种请求方式。参考：OWASP ASVS V2.2。
 */
export async function authRegisterCheckEmailPost(data: CheckEmailRequest, params?: {
  email?: string;  // 邮箱地址（GET方式）
}) {
  const res = await api.post(`/identity/api/v1/auth/register/check-email`, data, { params });
  return res.data;
}

/**
 * 检查用户名是否可用
 * 在用户注册前校验用户名是否已被占用，防止批量注册和冲突。支持GET和POST两种请求方式。参考：OWASP ASVS V2.2。
 */
export async function authRegisterCheckUsername(data: CheckUsernameRequest, params?: {
  username?: string;  // 用户名（GET方式）
}) {
  const res = await api.get(`/identity/api/v1/auth/register/check-username`, { params });
  return res.data;
}

/**
 * 检查用户名是否可用
 * 在用户注册前校验用户名是否已被占用，防止批量注册和冲突。支持GET和POST两种请求方式。参考：OWASP ASVS V2.2。
 */
export async function authRegisterCheckUsernamePost(data: CheckUsernameRequest, params?: {
  username?: string;  // 用户名（GET方式）
}) {
  const res = await api.post(`/identity/api/v1/auth/register/check-username`, data, { params });
  return res.data;
}

/**
 * 邮箱验证码注册
 * 使用邮箱验证码完成无密码注册并自动登录，创建密码豁免用户。注册前需先调用发送验证码接口获取验证码。参考：OWASP ASVS V2.2。
 */
export async function authRegisterEmailCodePost(data: RegisterByEmailCodeRequest) {
  const res = await api.post(`/identity/api/v1/auth/register/email-code`, data);
  return res.data;
}

/**
 * 邀请注册
 * 通过有效的租户邀请码完成注册，邀请码由租户管理员生成。注册成功后自动接受邀请并加入租户，返回JWT令牌。参考：OWASP ASVS V2.2。
 */
export async function authRegisterInvitationPost(data: RegisterByInvitationRequest) {
  const res = await api.post(`/identity/api/v1/auth/register/invitation`, data);
  return res.data;
}

/**
 * OAuth补充注册
 * 使用OAuth回调生成的pending_token完成注册，创建用户并自动绑定OAuth连接和提供商信息，返回JWT令牌。注册后的审批流程由租户的成员资格策略控制。参考：RFC 6749 §4.1、OWASP ASVS V2.2。
 */
export async function authRegisterOauthPost(data: RegisterByOAuthRequest) {
  const res = await api.post(`/identity/api/v1/auth/register/oauth`, data);
  return res.data;
}

/**
 * 手机验证码注册
 * 使用手机短信验证码完成无密码注册并自动登录，创建密码豁免用户。注册前需先调用发送短信验证码接口获取验证码。参考：OWASP ASVS V2.2。
 */
export async function authRegisterPhoneCodePost(data: RegisterByPhoneCodeRequest) {
  const res = await api.post(`/identity/api/v1/auth/register/phone-code`, data);
  return res.data;
}

/**
 * 重新申请注册
 * 被拒绝注册后重新提交申请，将disabled成员重新置为pending状态供管理员再次审批。参考：OWASP ASVS V2.2。
 */
export async function authRegisterReapplyPost(data: ReapplyRegistrationRequest) {
  const res = await api.post(`/identity/api/v1/auth/register/reapply`, data);
  return res.data;
}

/**
 * 重新发送短信验证码
 * 重新向用户手机发送短信验证码
 */
export async function authResendSmsCodePost(data: ResendSMSCodeRequest) {
  const res = await api.post(`/identity/api/v1/auth/resend-sms-code`, data);
  return res.data;
}

/**
 * 重新发送邮箱验证邮件
 * 重新向用户邮箱发送验证链接或验证码
 */
export async function authResendVerificationEmailPost(data: ResendVerificationEmailRequest) {
  const res = await api.post(`/identity/api/v1/auth/resend-verification-email`, data);
  return res.data;
}

/**
 * 重置密码
 * 使用验证码验证通过后设置新密码，支持邮箱和短信两种验证方式。参考：NIST SP 800-63B §5.1.1.2、OWASP ASVS V2.1。
 */
export async function authResetPasswordPost(data: ResetPasswordRequest) {
  const res = await api.post(`/identity/api/v1/auth/reset-password`, data);
  return res.data;
}

/**
 * 发送登录验证码
 * 向指定邮箱或手机号发送一次性登录验证码，用于无密码登录流程。支持 rate limiting 和 per-target 限流。
 */
export async function authSendLoginCodePost(data: SendLoginCodeRequest) {
  const res = await api.post(`/identity/api/v1/auth/send-login-code`, data);
  return res.data;
}

/**
 * 发送短信验证码
 * 向用户手机发送短信验证码，用于手机验证或登录
 */
export async function authSendSmsCodePost(data: SendSMSCodeRequest) {
  const res = await api.post(`/identity/api/v1/auth/send-sms-code`, data);
  return res.data;
}

/**
 * 发送邮箱验证邮件
 * 向指定邮箱发送验证码邮件
 */
export async function authSendVerificationEmailPost(data: SendVerificationEmailRequest) {
  const res = await api.post(`/identity/api/v1/auth/send-verification-email`, data);
  return res.data;
}

/**
 * 企业SSO回调
 * 接收企业身份提供商的回调信息，验证state并交换本地访问令牌
 */
export async function authSsoCallbackPost(data: SSOCallbackRequest) {
  const res = await api.post(`/identity/api/v1/auth/sso/callback`, data);
  return res.data;
}

/**
 * 启动企业SSO登录
 * 根据指定的SSO提供商（SAML或OIDC）生成授权URL与state参数，通过PKCE和CSRF state保护，引导用户跳转至企业身份提供商进行认证。参考：SAML 2.0 Core §3.4、OpenID Connect Core 1.0 §3、RFC 7636 (PKCE)。
 */
export async function authSsoInitiatePost(data: SSOInitiateRequest) {
  const res = await api.post(`/identity/api/v1/auth/sso/initiate`, data);
  return res.data;
}

/**
 * 票据签名登录
 * 使用后台生成的一次性票据完成登录，票据验证成功后立即失效（一次性使用），返回JWT令牌。适用于跨系统SSO和管理员代登录场景。参考：RFC 6749 §1.5。
 */
export async function authTicketSigninPost(data: TicketSigninRequest) {
  const res = await api.post(`/identity/api/v1/auth/ticket/signin`, data);
  return res.data;
}

/**
 * 验证邮箱地址
 * 验证用户提交的邮箱验证码
 */
export async function authVerifyEmailPost(data: VerifyEmailRequest) {
  const res = await api.post(`/identity/api/v1/auth/verify-email`, data);
  return res.data;
}

/**
 * 验证手机号
 * 验证用户提交的手机号验证码
 */
export async function authVerifyPhonePost(data: VerifyPhoneRequest) {
  const res = await api.post(`/identity/api/v1/auth/verify-phone`, data);
  return res.data;
}

/**
 * 验证重置验证码
 * 验证用户提交的重置密码验证码是否有效，验证通过后允许进入密码重置步骤。参考：OWASP ASVS V2.3。
 */
export async function authVerifyResetCodePost(data: VerifyResetCodeRequest) {
  const res = await api.post(`/identity/api/v1/auth/verify-reset-code`, data);
  return res.data;
}

/**
 * 验证Web3钱包签名
 * 验证Ethereum/Solana等Web3钱包的数字签名，无需认证
 */
export async function authWeb3VerifyPost(data: Web3VerifyRequest) {
  const res = await api.post(`/identity/api/v1/auth/web3/verify`, data);
  return res.data;
}

/**
 * 开始Passkey公开认证
 * 根据邮箱查找用户，生成Passkey登录挑战（无需JWT）
 */
export async function authWebauthnAuthenticateBeginPost(data: PasskeyAuthBeginRequest) {
  const res = await api.post(`/identity/api/v1/auth/webauthn/authenticate/begin`, data);
  return res.data;
}

/**
 * 完成Passkey公开认证
 * 验证Passkey认证响应并返回JWT令牌（无需JWT）
 */
export async function authWebauthnAuthenticateCompletePost(data: PasskeyAuthenticateCompleteRequest) {
  const res = await api.post(`/identity/api/v1/auth/webauthn/authenticate/complete`, data);
  return res.data;
}

/**
 * 开始Passkey登录
 * 生成登录挑战，返回给前端调用 navigator.credentials.get()
 */
export async function authWebauthnLoginBeginPost(data: BeginLoginRequest) {
  const res = await api.post(`/identity/api/v1/auth/webauthn/login/begin`, data);
  return res.data;
}

/**
 * 完成Passkey登录
 * 验证客户端返回的认证签名
 */
export async function authWebauthnLoginCompletePost(data: CompleteLoginRequest) {
  const res = await api.post(`/identity/api/v1/auth/webauthn/login/complete`, data);
  return res.data;
}

/**
 * 开始Passkey注册
 * 生成注册挑战和凭证创建选项，返回给前端调用 navigator.credentials.create()
 */
export async function authWebauthnRegisterBeginPost(data: BeginRegistrationRequest) {
  const res = await api.post(`/identity/api/v1/auth/webauthn/register/begin`, data);
  return res.data;
}

/**
 * 完成Passkey注册
 * 验证客户端创建的凭证并保存公钥, 返回恢复码
 */
export async function authWebauthnRegisterCompletePost(data: CompleteRegistrationRequest) {
  const res = await api.post(`/identity/api/v1/auth/webauthn/register/complete`, data);
  return res.data;
}

/**
 * 移除所有设备
 * 移除用户的所有设备（当前设备可选保留）
 */
export async function devicesDelete(params?: {
  except_current?: boolean;  // 是否排除当前设备
}) {
  await api.delete(`/identity/api/v1/devices`, { params });
}

/**
 * 获取用户设备列表
 * 获取当前用户的所有登录设备列表
 */
export async function devices() {
  const res = await api.get(`/identity/api/v1/devices`);
  return res.data;
}

/**
 * 移除设备
 * 移除指定的登录设备
 */
export async function devicesByDevicesDelete(id: string) {
  await api.delete(`/identity/api/v1/devices/${id}`);
}

/**
 * 信任/取消信任设备
 * 设置设备的信任状态
 */
export async function devicesTrustByDevicesPut(id: string, data: TrustDeviceRequest) {
  const res = await api.put(`/identity/api/v1/devices/${id}/trust`, data);
  return res.data;
}

/**
 * List User Devices
 * 查询当前租户下的 Non-Human Identity (NHI) IoT Device 列表
 */
export async function iots(params?: {
  status?: string;  // 状态过滤
  workload_subtype?: string;  // 工作负载子类型
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/identity/api/v1/iots`, { params });
  return res.data;
}

/**
 * Pair Device
 * 通过 user_code 配对 Non-Human Identity (NHI) IoT Device
 */
export async function iotsPairPost(data: PairDeviceRequest) {
  const res = await api.post(`/identity/api/v1/iots/pair`, data);
  return res.data;
}

/**
 * Unpair Device
 * 取消配对指定的 Non-Human Identity (NHI) IoT Device
 */
export async function iotsByIotsDelete(id: string) {
  await api.delete(`/identity/api/v1/iots/${id}`);
}

/**
 * Transfer Device
 * 将指定的 Non-Human Identity (NHI) IoT Device 转移给新的所有者
 */
export async function iotsTransferByIotsPost(id: string, data: TransferDeviceRequest) {
  const res = await api.post(`/identity/api/v1/iots/${id}/transfer`, data);
  return res.data;
}

/**
 * 根据域名获取租户认证配置（公开）
 * 根据域名（如example.com）查询对应租户的公开认证配置，包括密码策略、可用的OAuth和SSO提供商、登录方式等。无需认证。
 */
export async function PublicAuthConfigByDomainByByDomain(domain: string) {
  const res = await api.get(`/identity/api/v1/public/auth-config/by-domain/${domain}`);
  return res.data;
}

/**
 * 根据租户标识获取认证配置（公开）
 * 根据租户名称/slug获取公开的认证配置，无需认证
 */
export async function PublicAuthConfigBySlugByBySlug(slug: string) {
  const res = await api.get(`/identity/api/v1/public/auth-config/by-slug/${slug}`);
  return res.data;
}

/**
 * 获取租户认证配置（公开）
 * 根据租户ID获取公开的认证配置（密码策略、租户信息），无需认证
 */
export async function PublicAuthConfigByAuthConfig(tenantId: string) {
  const res = await api.get(`/identity/api/v1/public/auth-config/${tenantId}`);
  return res.data;
}

/**
 * ECDH 密钥交换
 * 生成临时 ECDH P-256 密钥对，返回服务端公钥和交换 ID。客户端用此公钥完成 ECDH → 派生 AES-256-GCM 会话密钥加密密码。
 */
export async function PublicKeyExchange() {
  const res = await api.get(`/identity/api/v1/public/key-exchange`);
  return res.data;
}

/**
 * 检查密码强度（公开）
 * 使用系统默认密码策略检查密码强度，无需认证
 */
export async function PublicPasswordStrengthPost(data: CheckPublicPasswordStrengthRequest) {
  const res = await api.post(`/identity/api/v1/public/password-strength`, data);
  return res.data;
}

/**
 * 发现公开可加入的租户
 * 列出可公开发现和加入的租户列表，包含租户ID、名称、显示名称和成员加入方式。用于注册页面展示可选租户。无需认证。
 */
export async function PublicTenantsDiscover() {
  const res = await api.get(`/identity/api/v1/public/tenants/discover`);
  return res.data;
}

/**
 * 列出SCIM组
 * SCIM 2.0组列表
 */
export async function scimGroups(params?: {
  startIndex?: number;  // 起始索引
  count?: number;  // 每页数量
}) {
  const res = await api.get(`/identity/api/v1/scim/Groups`, { params });
  return res.data;
}

/**
 * 创建SCIM组
 * SCIM 2.0创建组
 */
export async function scimGroupsPost(data: SCIMGroup) {
  const res = await api.post(`/identity/api/v1/scim/Groups`, data);
  return res.data;
}

/**
 * 删除SCIM组
 * SCIM 2.0删除组
 */
export async function scimGroupsByGroupsDelete(id: string) {
  await api.delete(`/identity/api/v1/scim/Groups/${id}`);
}

/**
 * 获取SCIM组
 * SCIM 2.0获取指定组
 */
export async function scimGroupsByGroups(id: string) {
  const res = await api.get(`/identity/api/v1/scim/Groups/${id}`);
  return res.data;
}

/**
 * 部分更新SCIM组
 * SCIM 2.0 PATCH组
 */
export async function scimGroupsByGroupsPatch(id: string, data: SCIMPatchOperation[]) {
  const res = await api.patch(`/identity/api/v1/scim/Groups/${id}`, data);
  return res.data;
}

/**
 * 更新SCIM组
 * SCIM 2.0全量更新组
 */
export async function scimGroupsByGroupsPut(id: string, data: SCIMGroup) {
  const res = await api.put(`/identity/api/v1/scim/Groups/${id}`, data);
  return res.data;
}

/**
 * SCIM资源类型
 * 获取SCIM资源类型列表（RFC 7644）
 */
export async function scimResourcetypes() {
  const res = await api.get(`/identity/api/v1/scim/ResourceTypes`);
  return res.data;
}

/**
 * SCIM Schemas
 * 获取SCIM Schema定义（RFC 7644）
 */
export async function scimSchemas() {
  const res = await api.get(`/identity/api/v1/scim/Schemas`);
  return res.data;
}

/**
 * SCIM服务提供商配置
 * 获取SCIM服务提供商能力配置（RFC 7644）
 */
export async function scimServiceproviderconfig() {
  const res = await api.get(`/identity/api/v1/scim/ServiceProviderConfig`);
  return res.data;
}

/**
 * 列出SCIM用户
 * SCIM 2.0用户列表（支持过滤、分页）
 */
export async function scimUsers(params?: {
  startIndex?: number;  // 起始索引
  count?: number;  // 每页数量
  filter?: string;  // 过滤器
}) {
  const res = await api.get(`/identity/api/v1/scim/Users`, { params });
  return res.data;
}

/**
 * 创建SCIM用户
 * SCIM 2.0创建用户
 */
export async function scimUsersPost(data: SCIMUser) {
  const res = await api.post(`/identity/api/v1/scim/Users`, data);
  return res.data;
}

/**
 * 删除SCIM用户
 * SCIM 2.0删除用户
 */
export async function scimUsersByUsersDelete(id: string) {
  await api.delete(`/identity/api/v1/scim/Users/${id}`);
}

/**
 * 获取SCIM用户
 * SCIM 2.0获取指定用户
 */
export async function scimUsersByUsers(id: string) {
  const res = await api.get(`/identity/api/v1/scim/Users/${id}`);
  return res.data;
}

/**
 * 部分更新SCIM用户
 * SCIM 2.0 PATCH用户
 */
export async function scimUsersByUsersPatch(id: string, data: SCIMPatchOperation[]) {
  const res = await api.patch(`/identity/api/v1/scim/Users/${id}`, data);
  return res.data;
}

/**
 * 更新SCIM用户
 * SCIM 2.0全量更新用户
 */
export async function scimUsersByUsersPut(id: string, data: SCIMUser) {
  const res = await api.put(`/identity/api/v1/scim/Users/${id}`, data);
  return res.data;
}

// ============================================================
// Mfa Service
// ============================================================

/**
 * 管理端列出所有备用码配置
 * 管理员查看租户下所有已配置TOTP备用恢复码的用户列表。参考：OWASP ASVS V2.8.3。
 */
export async function adminMfaBackupCodes() {
  const res = await api.get(`/mfa/api/v1/admin/mfa/backup-codes`);
  return res.data;
}

/**
 * 管理端获取用户备用码数量
 * 管理员查看指定用户的备用恢复码数量。参考：OWASP ASVS V2.8.3。
 */
export async function adminMfaBackupCodesByBackupCodes(userId: string) {
  const res = await api.get(`/mfa/api/v1/admin/mfa/backup-codes/${userId}`);
  return res.data;
}

/**
 * 获取MFA配置审计日志
 * 查询MFA配置变更的审计日志，支持按操作类型、目标类型、操作者、日期范围筛选。需要管理员权限。
 */
export async function adminMfaConfigAuditLogs(params?: {
  action?: string;  // 操作类型过滤
  target_type?: string;  // 目标类型过滤
  operator_id?: string;  // 操作者ID过滤
  start_date?: string;  // 开始日期（YYYY-MM-DD）
  end_date?: string;  // 结束日期（YYYY-MM-DD）
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/mfa/api/v1/admin/mfa/config-audit-logs`, { params });
  return res.data;
}

/**
 * 列出IP白名单
 * 查询租户配置的所有IP白名单规则。需要管理员权限。
 */
export async function adminMfaIpWhitelist() {
  const res = await api.get(`/mfa/api/v1/admin/mfa/ip-whitelist`);
  return res.data;
}

/**
 * 创建IP白名单
 * 为租户添加一个IP白名单规则（CIDR格式），用于自适应MFA风险评分的IP信任检查。参考：NIST SP 800-63B §5.2 (Risk-based Authentication)。需要管理员权限。
 */
export async function adminMfaIpWhitelistPost(data: CreateIPWhitelistRequest) {
  const res = await api.post(`/mfa/api/v1/admin/mfa/ip-whitelist`, data);
  return res.data;
}

/**
 * 删除IP白名单
 * 删除指定的IP白名单规则。需要管理员权限。
 */
export async function adminMfaIpWhitelistByIpWhitelistDelete(credentialId: string) {
  await api.delete(`/mfa/api/v1/admin/mfa/ip-whitelist/${credentialId}`);
}

/**
 * 获取IP白名单
 * 根据ID查询指定的IP白名单规则。需要管理员权限。
 */
export async function adminMfaIpWhitelistByIpWhitelist(credentialId: string) {
  const res = await api.get(`/mfa/api/v1/admin/mfa/ip-whitelist/${credentialId}`);
  return res.data;
}

/**
 * 更新IP白名单
 * 更新指定IP白名单规则的标签、CIDR或启用状态。需要管理员权限。
 */
export async function adminMfaIpWhitelistByIpWhitelistPut(credentialId: string, data: UpdateIPWhitelistRequest) {
  const res = await api.put(`/mfa/api/v1/admin/mfa/ip-whitelist/${credentialId}`, data);
  return res.data;
}

/**
 * 管理端查看推送挑战列表
 * 分页查询推送MFA挑战列表，支持按状态和用户过滤。参考：NIST SP 800-63B §5.1.7、OWASP ASVS V2.8。需要管理员权限。
 */
export async function adminMfaPushChallenges(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  status?: string;  // 状态过滤（pending/approved/denied/expired）
  user_id?: string;  // 用户ID过滤
}) {
  const res = await api.get(`/mfa/api/v1/admin/mfa/push/challenges`, { params });
  return res.data;
}

/**
 * 获取Push MFA挑战统计
 * 查询指定租户的推送挑战按状态统计（pending/approved/denied/expired）。参考：NIST SP 800-63B §5.1.7、OWASP ASVS V2.8。需要管理员权限。
 */
export async function adminMfaPushStats() {
  const res = await api.get(`/mfa/api/v1/admin/mfa/push/stats`);
  return res.data;
}

/**
 * 管理员重置用户MFA
 * 管理员强制重置指定用户的所有MFA配置（TOTP设备、MFA配置），用户下次登录需重新设置。需要管理员权限。
 */
export async function adminMfaResetByResetDelete(userId: string) {
  await api.delete(`/mfa/api/v1/admin/mfa/reset/${userId}`);
}

/**
 * 列出所有风险策略
 * 获取租户配置的所有风险等级策略列表。参考：NIST SP 800-63B §5.2 (Risk-based Authentication)。需要管理员权限。
 */
export async function adminMfaRiskPolicies() {
  const res = await api.get(`/mfa/api/v1/admin/mfa/risk-policies`);
  return res.data;
}

/**
 * 评估风险策略
 * 传入用户上下文（user_id、IP、设备指纹），返回评估的风险等级和要求的MFA方法。参考：NIST SP 800-63B §5.2 (Risk-based Authentication)。需要管理员权限。
 */
export async function adminMfaRiskPoliciesEvaluatePost(data: EvaluateRiskPolicyRequest) {
  const res = await api.post(`/mfa/api/v1/admin/mfa/risk-policies/evaluate`, data);
  return res.data;
}

/**
 * 删除指定等级的风险策略
 * 删除租户指定风险等级的自定义策略，恢复默认值。参考：NIST SP 800-63B §5.2 (Risk-based Authentication)。需要管理员权限。
 */
export async function adminMfaRiskPoliciesByRiskPoliciesDelete(level: string) {
  await api.delete(`/mfa/api/v1/admin/mfa/risk-policies/${level}`);
}

/**
 * 更新指定等级的风险策略
 * 更新租户指定风险等级的MFA因子要求。参考：NIST SP 800-63B §5.2 (Risk-based Authentication)。需要管理员权限。
 */
export async function adminMfaRiskPoliciesByRiskPoliciesPut(level: string, data: UpdateRiskPolicyByLevelRequest) {
  const res = await api.put(`/mfa/api/v1/admin/mfa/risk-policies/${level}`, data);
  return res.data;
}

/**
 * 获取MFA风险策略
 * 查询基于风险评分的自适应MFA策略配置，从数据库读取租户配置的策略。参考：NIST SP 800-63B §5.2 (Risk-based Authentication)。需要管理员权限。
 */
export async function adminMfaRiskPolicy() {
  const res = await api.get(`/mfa/api/v1/admin/mfa/risk-policy`);
  return res.data;
}

/**
 * 更新MFA风险策略
 * 全量更新租户的低/中/高风险等级的MFA因子要求。参考：NIST SP 800-63B §5.2 (Risk-based Authentication)。需要管理员权限。
 */
export async function adminMfaRiskPolicyPut(data: UpdateRiskPolicyRequest) {
  const res = await api.put(`/mfa/api/v1/admin/mfa/risk-policy`, data);
  return res.data;
}

/**
 * 管理端获取用户TOTP状态
 * 管理员查看指定用户的TOTP设备列表。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function adminMfaTotpByTotp(userId: string) {
  const res = await api.get(`/mfa/api/v1/admin/mfa/totp/${userId}`);
  return res.data;
}

/**
 * 查看备用码
 * 解密并返回当前用户的全部备用恢复码，需step-up认证。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaBackupCodes() {
  const res = await api.get(`/mfa/api/v1/mfa/backup-codes`);
  return res.data;
}

/**
 * 查看备用码数量
 * 返回当前用户备用恢复码的数量和是否为即将用尽的状态。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaBackupCodesCount() {
  const res = await api.get(`/mfa/api/v1/mfa/backup-codes/count`);
  return res.data;
}

/**
 * 生成备用恢复码
 * 为用户生成10个备用恢复码，用于TOTP不可用时进行身份验证。恢复码仅显示一次，请妥善保存。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaBackupCodesGeneratePost(data: GenerateBackupCodesRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/backup-codes/generate`, data);
  return res.data;
}

/**
 * 独立备用码验证
 * 验证备用恢复码，返回验证结果和剩余备用码数量，用于前端独立处理备用码登录流程。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaBackupCodesVerifyPost(data: BackupCodeVerifyRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/backup-codes/verify`, data);
  return res.data;
}

/**
 * 创建通用MFA挑战
 * 为指定用户创建一次性的MFA挑战码，支持短信、邮件、TOTP、推送等多种验证方式，用于登录或敏感操作前的二次认证。参考：NIST SP 800-63B §5.1.7 (Verifier Impersonation Resistance)、OWASP ASVS V2.8。
 */
export async function mfaChallengePost(data: MFAChallengeRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/challenge`, data);
  return res.data;
}

/**
 * 设置主认证方式
 * 将指定的MFA凭证设为该用户的主认证方式，同时取消其他凭证的主认证状态。参考：OWASP ASVS V2.8。
 */
export async function mfaCredentialsPrimaryByCredentialsPost(credentialId: string, data: SetPrimaryCredentialRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/credentials/${credentialId}/primary`, data);
  return res.data;
}

/**
 * 列出同步设备
 * 列出用户所有的设备同步记录，返回解密后的TOTP设备数据。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaDevicesSync() {
  const res = await api.get(`/mfa/api/v1/mfa/devices/sync`);
  return res.data;
}

/**
 * 同步设备数据
 * 上传设备TOTP配置数据，加密存储并返回同步令牌。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaDevicesSyncPost(data: DeviceSyncRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/devices/sync`, data);
  return res.data;
}

/**
 * 禁用邮箱 MFA
 * 验证邮箱验证码后禁用Email MFA认证。参考：OWASP ASVS V2.8。
 */
export async function mfaEmailDisablePost(data: EmailDisableRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/email/disable`, data);
  return res.data;
}

/**
 * Email MFA注册
 * 为用户注册邮箱MFA认证方式。参考：OWASP ASVS V2.8。
 */
export async function mfaEmailEnrollPut(data: EmailEnrollRequest) {
  const res = await api.put(`/mfa/api/v1/mfa/email/enroll`, data);
  return res.data;
}

/**
 * 发送邮箱验证码
 * 向用户邮箱发送验证码，用于邮箱MFA认证。生产环境不返回验证码明文。参考：OWASP ASVS V2.8。
 */
export async function mfaEmailSendPost(data: EmailSendRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/email/send`, data);
  return res.data;
}

/**
 * 验证邮箱验证
 * 验证用户提交的邮箱验证码，判断其有效性。使用限流保护。参考：OWASP ASVS V2.8。
 */
export async function mfaEmailVerifyPost(data: EmailVerifyRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/email/verify`, data);
  return res.data;
}

/**
 * 列出MFA方法
 * 列出用户所有已配置的MFA方法（TOTP/SMS/Email/WebAuthn）。参考：OWASP ASVS V2.8。
 */
export async function mfaMethods(params?: {
  user_id: string;  // 用户ID
}) {
  const res = await api.get(`/mfa/api/v1/mfa/methods`, { params });
  return res.data;
}

/**
 * 删除MFA方法
 * 删除指定类型的MFA认证方式。参考：OWASP ASVS V2.8。
 */
export async function mfaMethodsByMethodsDelete(methodType: string, params?: {
  user_id: string;  // 用户ID
}) {
  await api.delete(`/mfa/api/v1/mfa/methods/${methodType}`, { params });
}

/**
 * 批准Push MFA挑战
 * 用户通过设备批准Push MFA挑战，完成身份验证。支持 Number Matching 验证。参考：NIST SP 800-63B §5.1.7 (Verifier Impersonation Resistance)、OWASP ASVS V2.8。
 */
export async function mfaPushApprovePost(data: PushApproveRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/push/approve`, data);
  return res.data;
}

/**
 * 创建Push MFA挑战
 * 创建Push MFA挑战，通过notification-service推送批准请求到用户设备，包含 Number Matching 防钓鱼保护。参考：NIST SP 800-63B §5.1.7 (Verifier Impersonation Resistance)、OWASP ASVS V2.8。
 */
export async function mfaPushChallengePost(data: PushChallengeRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/push/challenge`, data);
  return res.data;
}

/**
 * 获取Push挑战状态
 * 根据挑战ID查询单条Push MFA挑战的当前状态，用于登录页面轮询。参考：NIST SP 800-63B §5.1.7 (Verifier Impersonation Resistance)、OWASP ASVS V2.8。
 */
export async function mfaPushChallengeByChallenge(credentialId: string) {
  const res = await api.get(`/mfa/api/v1/mfa/push/challenge/${credentialId}`);
  return res.data;
}

/**
 * 拒绝Push MFA挑战
 * 用户通过设备拒绝Push MFA挑战。参考：NIST SP 800-63B §5.1.7 (Verifier Impersonation Resistance)、OWASP ASVS V2.8。
 */
export async function mfaPushDenyPost(data: PushDenyRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/push/deny`, data);
  return res.data;
}

/**
 * 获取Push MFA挑战历史
 * 分页查询用户的Push MFA挑战历史记录。参考：NIST SP 800-63B §5.1.7、OWASP ASVS V2.8。
 */
export async function mfaPushHistory(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  status?: string;  // 状态过滤（pending/approved/denied/expired）
}) {
  const res = await api.get(`/mfa/api/v1/mfa/push/history`, { params });
  return res.data;
}

/**
 * 禁用短信 MFA
 * 验证短信验证码后禁用SMS MFA认证。参考：OWASP ASVS V2.8。
 */
export async function mfaSmsDisablePost(data: SMSDisableRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/sms/disable`, data);
  return res.data;
}

/**
 * SMS MFA注册
 * 为用户注册短信MFA认证方式。参考：OWASP ASVS V2.8。
 */
export async function mfaSmsEnrollPut(data: SMSEnrollRequest) {
  const res = await api.put(`/mfa/api/v1/mfa/sms/enroll`, data);
  return res.data;
}

/**
 * 发送短信验证码
 * 向用户手机发送短信验证码，用于短信MFA认证。生产环境不返回验证码明文。参考：OWASP ASVS V2.8。
 */
export async function mfaSmsSendPost(data: SMSSendRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/sms/send`, data);
  return res.data;
}

/**
 * 验证短信验证
 * 验证用户输入的短信验证码，完成短信MFA认证。使用限流保护。参考：OWASP ASVS V2.8。
 */
export async function mfaSmsVerifyPost(data: SMSVerifyRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/sms/verify`, data);
  return res.data;
}

/**
 * 获取用户MFA状态
 * 查询用户已启用的MFA方式和状态。参考：OWASP ASVS V2.8。
 */
export async function mfaStatusByStatus(userId: string) {
  const res = await api.get(`/mfa/api/v1/mfa/status/${userId}`);
  return res.data;
}

/**
 * MFA步进认证
 * 对已登录用户的敏感操作进行二次MFA认证验证，支持TOTP、短信、邮箱三种方式。使用限流保护。参考：NIST SP 800-63B §5.1.7、OWASP ASVS V2.8。
 */
export async function mfaStepUpPost(data: StepUpRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/step-up`, data);
  return res.data;
}

/**
 * 列出TOTP设备
 * 列出用户的所有TOTP设备，支持多设备管理。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaTotpDevices(params?: {
  user_id: string;  // 用户ID
}) {
  const res = await api.get(`/mfa/api/v1/mfa/totp/devices`, { params });
  return res.data;
}

/**
 * 注册TOTP设备
 * 为用户注册一个新的TOTP设备，生成独立的密钥和二维码，支持多设备管理。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaTotpDevicesPost(data: TOTPDeviceRegisterRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/totp/devices`, data);
  return res.data;
}

/**
 * 撤销TOTP设备
 * 撤销指定的TOTP设备，需要提供当前TOTP验证码进行验证。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaTotpDevicesByDevicesDelete(deviceId: string, data: TOTPDeviceRevokeRequest) {
  await api.delete(`/mfa/api/v1/mfa/totp/devices/${deviceId}`, { data });
}

/**
 * 获取TOTP设备详情
 * 根据ID获取指定TOTP设备的详细信息。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaTotpDevicesByDevices(deviceId: string) {
  const res = await api.get(`/mfa/api/v1/mfa/totp/devices/${deviceId}`);
  return res.data;
}

/**
 * 禁用TOTP设备
 * 禁用指定的TOTP设备，切换Enabled状态为false。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaTotpDevicesDisableByDevicesPost(deviceId: string) {
  const res = await api.post(`/mfa/api/v1/mfa/totp/devices/${deviceId}/disable`);
  return res.data;
}

/**
 * 启用TOTP设备
 * 启用指定的TOTP设备，切换Enabled状态为true，无需重新注册。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaTotpDevicesEnableByDevicesPost(deviceId: string) {
  const res = await api.post(`/mfa/api/v1/mfa/totp/devices/${deviceId}/enable`);
  return res.data;
}

/**
 * 禁用TOTP
 * 禁用用户的TOTP多因素认证，需要提供当前TOTP码或备用码进行验证。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaTotpDisablePost(data: TOTPDisableRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/totp/disable`, data);
  return res.data;
}

/**
 * 启用TOTP多因素认证
 * 为用户启用基于时间的一次性密码(TOTP)认证，生成密钥和二维码，返回备用恢复码。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaTotpEnablePost(data: TOTPEnableRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/totp/enable`, data);
  return res.data;
}

/**
 * 启用TOTP多因素认证
 * 为用户启用基于时间的一次性密码(TOTP)认证，生成密钥和二维码，返回备用恢复码。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaTotpSetupPost(data: TOTPEnableRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/totp/setup`, data);
  return res.data;
}

/**
 * 验证TOTP码（登录时）
 * 用户登录时验证TOTP动态码，支持备用恢复码。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaTotpValidatePost(data: TOTPValidateRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/totp/validate`, data);
  return res.data;
}

/**
 * 验证并启用TOTP
 * 验证用户提交的TOTP验证码，验证通过后启用TOTP多因素认证。使用限流保护（checkRateLimit）。参考：RFC 6238 (TOTP)、OWASP ASVS V2.8.3。
 */
export async function mfaTotpVerifyPost(data: TOTPVerifyRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/totp/verify`, data);
  return res.data;
}

/**
 * 撤销所有受信设备
 * 撤销用户所有受信设备，所有设备后续需重新MFA验证。参考：NIST SP 800-63B §5.1、OWASP ASVS V2.8。
 */
export async function mfaTrustedDevicesDelete() {
  await api.delete(`/mfa/api/v1/mfa/trusted-devices`);
}

/**
 * 列出受信设备
 * 列出用户所有受信设备。参考：NIST SP 800-63B §5.1、OWASP ASVS V2.8。
 */
export async function mfaTrustedDevices() {
  const res = await api.get(`/mfa/api/v1/mfa/trusted-devices`);
  return res.data;
}

/**
 * 记住受信设备
 * 将当前设备标记为受信设备，30天内免MFA验证。参考：NIST SP 800-63B §5.1 (Verifier Impersonation Resistance)、OWASP ASVS V2.8。
 */
export async function mfaTrustedDevicesPost(data: TrustDeviceRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/trusted-devices`, data);
  return res.data;
}

/**
 * 检查设备是否受信
 * 通过设备指纹检查设备是否在受信列表中。参考：NIST SP 800-63B §5.1、OWASP ASVS V2.8。
 */
export async function mfaTrustedDevicesCheck(params?: {
  user_id: string;  // 用户ID
  fingerprint: string;  // 设备指纹
}) {
  const res = await api.get(`/mfa/api/v1/mfa/trusted-devices/check`, { params });
  return res.data;
}

/**
 * 清理过期受信设备
 * 清理所有已过期的受信设备记录。参考：NIST SP 800-63B §5.1、OWASP ASVS V2.8。
 */
export async function mfaTrustedDevicesCleanupPost() {
  const res = await api.post(`/mfa/api/v1/mfa/trusted-devices/cleanup`);
  return res.data;
}

/**
 * 撤销受信设备
 * 撤销指定受信设备，该设备后续需重新MFA验证。参考：NIST SP 800-63B §5.1、OWASP ASVS V2.8。
 */
export async function mfaTrustedDevicesByTrustedDevicesDelete(credentialId: string) {
  await api.delete(`/mfa/api/v1/mfa/trusted-devices/${credentialId}`);
}

/**
 * 获取受信设备详情
 * 根据ID获取指定受信设备的详细信息。参考：NIST SP 800-63B §5.1、OWASP ASVS V2.8。
 */
export async function mfaTrustedDevicesByTrustedDevices(credentialId: string) {
  const res = await api.get(`/mfa/api/v1/mfa/trusted-devices/${credentialId}`);
  return res.data;
}

/**
 * 列出WebAuthn凭证
 * 列出用户所有已注册的WebAuthn/通行密钥凭证，包含名称和最后使用时间。参考：W3C WebAuthn Level 2、FIDO2 CTAP 2.1。
 */
export async function mfaWebauthnCredentials(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/mfa/api/v1/mfa/webauthn/credentials`, { params });
  return res.data;
}

/**
 * 开始WebAuthn凭证注册
 * 生成 WebAuthn credential creation options (challenge, rp, user, pubKeyCredParams)
 */
export async function mfaWebauthnCredentialsRegisterPost(data: BeginWebAuthnRegistrationRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/webauthn/credentials/register`, data);
  return res.data;
}

/**
 * 完成WebAuthn凭证注册
 * 验证 attestation 响应并存储凭证。需要先调用 /mfa/webauthn/credentials/register 获取 creation options。
 */
export async function mfaWebauthnCredentialsRegisterVerifyPost(data: FinishWebAuthnRegistrationRequest) {
  const res = await api.post(`/mfa/api/v1/mfa/webauthn/credentials/register/verify`, data);
  return res.data;
}

/**
 * 删除WebAuthn凭证
 * 删除指定WebAuthn凭证。参考：W3C WebAuthn Level 2、FIDO2 CTAP 2.1。
 */
export async function mfaWebauthnCredentialsByCredentialsDelete(credentialId: string) {
  await api.delete(`/mfa/api/v1/mfa/webauthn/credentials/${credentialId}`);
}

/**
 * 获取WebAuthn凭证详情
 * 根据ID获取指定WebAuthn凭证的详细信息。参考：W3C WebAuthn Level 2、FIDO2 CTAP 2.1。
 */
export async function mfaWebauthnCredentialsByCredentials(credentialId: string) {
  const res = await api.get(`/mfa/api/v1/mfa/webauthn/credentials/${credentialId}`);
  return res.data;
}

/**
 * 重命名WebAuthn凭证
 * 重命名指定WebAuthn凭证的设备名称。参考：W3C WebAuthn Level 2、FIDO2 CTAP 2.1。
 */
export async function mfaWebauthnCredentialsByCredentialsPut(credentialId: string, data: UpdateWebAuthnCredentialRequest) {
  const res = await api.put(`/mfa/api/v1/mfa/webauthn/credentials/${credentialId}`, data);
  return res.data;
}

// ============================================================
// Notification Service
// ============================================================

/**
 * 创建公告
 * 创建新的公告，支持草稿/定时发布，可指定目标租户和角色 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminAnnouncementsPost(data: CreateAnnouncementRequest) {
  const res = await api.post(`/notification/api/v1/admin/announcements`, data);
  return res.data;
}

/**
 * 删除公告
 * 删除指定公告（仅在draft状态可删除） 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminAnnouncementsByAnnouncementsDelete(announcementId: string) {
  await api.delete(`/notification/api/v1/admin/announcements/${announcementId}`);
}

/**
 * 更新公告
 * 编辑指定公告（仅在draft状态可编辑） 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminAnnouncementsByAnnouncementsPut(announcementId: string, data: UpdateAnnouncementRequest) {
  const res = await api.put(`/notification/api/v1/admin/announcements/${announcementId}`, data);
  return res.data;
}

/**
 * 发布公告
 * 将公告从draft/scheduled状态发布为published，向目标用户推送通知 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminAnnouncementsPublishByAnnouncementsPost(announcementId: string) {
  const res = await api.post(`/notification/api/v1/admin/announcements/${announcementId}/publish`);
  return res.data;
}

/**
 * 撤回公告
 * 将已发布的公告撤回到草稿状态（unpublish） 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminAnnouncementsUnpublishByAnnouncementsPost(announcementId: string) {
  const res = await api.post(`/notification/api/v1/admin/announcements/${announcementId}/unpublish`);
  return res.data;
}

/**
 * 管理员查看指定用户通知列表
 * 管理员按 user_id 查询指定用户的通知历史记录，支持按类型、已读状态、日期范围筛选
 */
export async function adminNotifications(params?: {
  user_id: string;  // 用户ID
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  type?: string;  // 通知类型
  is_read?: boolean;  // 是否已读
  start_date?: string;  // 开始日期
  end_date?: string;  // 结束日期
}) {
  const res = await api.get(`/notification/api/v1/admin/notifications`, { params });
  return res.data;
}

/**
 * 广播通知
 * 向租户下所有用户或指定用户群发送通知消息，适用于系统维护通知、安全告警等场景 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminNotificationsBroadcastPost(data: BroadcastNotificationRequest) {
  const res = await api.post(`/notification/api/v1/admin/notifications/broadcast`, data);
  return res.data;
}

/**
 * 创建事件映射
 * 创建事件类型到通知模板的映射关系 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminNotificationsEventMappingsPost(data: CreateEventMappingRequest) {
  const res = await api.post(`/notification/api/v1/admin/notifications/event-mappings`, data);
  return res.data;
}

/**
 * 删除事件映射
 * 删除指定ID的事件映射 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminNotificationsEventMappingsByEventMappingsDelete(announcementId: string) {
  await api.delete(`/notification/api/v1/admin/notifications/event-mappings/${announcementId}`);
}

/**
 * 更新事件映射
 * 更新指定ID的事件映射配置 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminNotificationsEventMappingsByEventMappingsPut(announcementId: string, data: UpdateEventMappingRequest) {
  const res = await api.put(`/notification/api/v1/admin/notifications/event-mappings/${announcementId}`, data);
  return res.data;
}

/**
 * 创建全局变量
 * 创建租户/应用级别的全局变量（如品牌名称、支持邮箱等） 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminNotificationsGlobalVariablesPost(data: CreateGlobalVariableRequest) {
  const res = await api.post(`/notification/api/v1/admin/notifications/global-variables`, data);
  return res.data;
}

/**
 * 删除全局变量
 * 删除指定ID的全局变量 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminNotificationsGlobalVariablesByGlobalVariablesDelete(announcementId: string) {
  await api.delete(`/notification/api/v1/admin/notifications/global-variables/${announcementId}`);
}

/**
 * 更新全局变量
 * 更新指定ID的全局变量值 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminNotificationsGlobalVariablesByGlobalVariablesPut(announcementId: string, data: UpdateGlobalVariableRequest) {
  const res = await api.put(`/notification/api/v1/admin/notifications/global-variables/${announcementId}`, data);
  return res.data;
}

/**
 * 获取平台级通知统计
 * 获取平台所有租户的通知发送、阅读等聚合统计数据 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminNotificationsPlatformStats() {
  const res = await api.get(`/notification/api/v1/admin/notifications/platform-stats`);
  return res.data;
}

/**
 * 管理员覆盖用户通知偏好
 * 管理员为指定用户设置通知渠道偏好（邮件/短信/Push等）
 */
export async function adminNotificationsPreferencesByPreferencesPut(userId: string, data: NotificationPreferencesRequest) {
  const res = await api.put(`/notification/api/v1/admin/notifications/preferences/${userId}`, data);
  return res.data;
}

/**
 * 创建通知模板
 * 创建一个新的通知模板，用于后续基于模板发送通知 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminNotificationsTemplatesPost(data: CreateTemplateRequest) {
  const res = await api.post(`/notification/api/v1/admin/notifications/templates`, data);
  return res.data;
}

/**
 * 删除通知模板
 * 删除指定ID的通知模板 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminNotificationsTemplatesByTemplatesDelete(announcementId: string) {
  await api.delete(`/notification/api/v1/admin/notifications/templates/${announcementId}`);
}

/**
 * 更新通知模板
 * 更新指定ID的通知模板内容 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminNotificationsTemplatesByTemplatesPut(announcementId: string, data: UpdateTemplateRequest) {
  const res = await api.put(`/notification/api/v1/admin/notifications/templates/${announcementId}`, data);
  return res.data;
}

/**
 * 跨 locale 复制模板
 * 将指定模板复制到目标 locale，用于国际化支持 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function adminNotificationsTemplatesCloneToLocaleByTemplatesPost(announcementId: string, data: CloneTemplateToLocaleRequest) {
  const res = await api.post(`/notification/api/v1/admin/notifications/templates/${announcementId}/clone-to-locale`, data);
  return res.data;
}

/**
 * 列出公告
 * 分页查询公告列表，支持按状态过滤和关键词搜索 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function announcements(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  status?: string;  // 状态过滤: draft/scheduled/published/expired
  search?: string;  // 搜索关键词
}) {
  const res = await api.get(`/notification/api/v1/announcements`, { params });
  return res.data;
}

/**
 * 获取公告详情
 * 获取指定公告的详细信息，包含阅读统计（views/dismissals） 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function announcementsByAnnouncements(announcementId: string) {
  const res = await api.get(`/notification/api/v1/announcements/${announcementId}`);
  return res.data;
}

/**
 * 获取公告统计
 * 获取指定公告的阅读/送达统计数据 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function announcementsStatsByAnnouncements(announcementId: string) {
  const res = await api.get(`/notification/api/v1/announcements/${announcementId}/stats`);
  return res.data;
}

/**
 * 获取通知列表
 * 查询当前用户收到的通知列表，支持仅查询未读选项 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notifications(params?: {
  unread_only?: boolean;  // 仅查询未读通知
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/notification/api/v1/notifications`, { params });
  return res.data;
}

/**
 * 发送通知
 * 向指定用户发送一条通知消息，支持多种通知类型，记录发送状态并触发事件通知 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsPost(data: SendNotificationRequest) {
  const res = await api.post(`/notification/api/v1/notifications`, data);
  return res.data;
}

/**
 * 列出事件映射
 * 获取当前租户的所有事件映射列表 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsEventMappings() {
  const res = await api.get(`/notification/api/v1/notifications/event-mappings`);
  return res.data;
}

/**
 * 获取事件映射
 * 获取指定ID的事件映射详情 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsEventMappingsByEventMappings(announcementId: string) {
  const res = await api.get(`/notification/api/v1/notifications/event-mappings/${announcementId}`);
  return res.data;
}

/**
 * 列出全局变量
 * 获取当前租户的所有全局变量列表 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsGlobalVariables() {
  const res = await api.get(`/notification/api/v1/notifications/global-variables`);
  return res.data;
}

/**
 * 获取全局变量
 * 获取指定ID的全局变量详情 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsGlobalVariablesByGlobalVariables(announcementId: string) {
  const res = await api.get(`/notification/api/v1/notifications/global-variables/${announcementId}`);
  return res.data;
}

/**
 * 获取通知偏好设置
 * 获取指定用户的通知接收偏好，包括各渠道开关、免打扰时段等设置 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsPreferencesByPreferences(userId: string) {
  const res = await api.get(`/notification/api/v1/notifications/preferences/${userId}`);
  return res.data;
}

/**
 * 更新通知偏好设置
 * 更新指定用户的通知接收偏好，包括App内通知、邮件、短信、推送等渠道的开关控制 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsPreferencesByPreferencesPut(userId: string, data: NotificationPreferencesRequest) {
  const res = await api.put(`/notification/api/v1/notifications/preferences/${userId}`, data);
  return res.data;
}

/**
 * 确认安全公告订阅
 * Trust Center公开端点，用户点击邮件中的确认链接后调用此端点完成订阅确认。需要email和token参数。受IP级别频率限制保护。
 */
export async function notificationsPublicSecurityConfirm(params?: {
  email: string;  // 订阅邮箱
  token: string;  // 确认令牌
}) {
  const res = await api.get(`/notification/api/v1/notifications/public/security-confirm`, { params });
  return res.data;
}

/**
 * 订阅安全公告
 * Trust Center: 公开订阅安全公告和合规更新（无认证） 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsPublicSecuritySubscribePost(data: SecuritySubscribeRequest) {
  const res = await api.post(`/notification/api/v1/notifications/public/security-subscribe`, data);
  return res.data;
}

/**
 * 退订安全公告
 * Trust Center: 公开退订安全公告（无认证） 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsPublicSecurityUnsubscribePost(data: SecurityUnsubscribeRequest) {
  const res = await api.post(`/notification/api/v1/notifications/public/security-unsubscribe`, data);
  return res.data;
}

/**
 * 标记全部通知已读
 * 将当前用户的所有未读通知一次性标记为已读状态 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsReadAllPut() {
  const res = await api.put(`/notification/api/v1/notifications/read-all`);
  return res.data;
}

/**
 * 获取通知已读/未读报告
 * 基于数据库中真实通知记录统计已读数、未读数、阅读率等运营指标 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsReadReport() {
  const res = await api.get(`/notification/api/v1/notifications/read-report`);
  return res.data;
}

/**
 * 发送通知（兼容端点）
 * 与 /notifications 相同功能的兼容端点，向指定用户发送通知 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsSendPost(data: SendNotificationRequest) {
  const res = await api.post(`/notification/api/v1/notifications/send`, data);
  return res.data;
}

/**
 * 批量发送通知
 * 向多个用户同时发送相同的通知消息，适用于系统公告、运营活动等场景 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsSendBatchPost(data: BatchSendNotificationRequest) {
  const res = await api.post(`/notification/api/v1/notifications/send-batch`, data);
  return res.data;
}

/**
 * 使用模板发送通知
 * 使用指定模板向用户发送通知，支持模板变量替换 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsSendFromTemplatePost(data: SendFromTemplateRequest) {
  const res = await api.post(`/notification/api/v1/notifications/send-from-template`, data);
  return res.data;
}

/**
 * 获取通知统计
 * 获取当前租户的通知发送、送达、阅读等聚合统计数据 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsStats() {
  const res = await api.get(`/notification/api/v1/notifications/stats`);
  return res.data;
}

/**
 * SSE实时通知流
 * 通过Server-Sent Events实时推送通知，客户端需传入user_id查询参数进行订阅 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsStream(params?: {
  user_id: string;  // 用户ID
}) {
  const res = await api.get(`/notification/api/v1/notifications/stream`, { params });
  return res.data;
}

/**
 * 列出通知模板
 * 获取所有通知模板列表，支持包含已停用模板的选项 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsTemplates(params?: {
  include_inactive?: boolean;  // 包含已停用模板
  type?: string;  // 通知类型过滤
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/notification/api/v1/notifications/templates`, { params });
  return res.data;
}

/**
 * 列出可用模板
 * 返回平台默认模板和本租户自定义模板的聚合列表 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsTemplatesAvailable() {
  const res = await api.get(`/notification/api/v1/notifications/templates/available`);
  return res.data;
}

/**
 * 获取通知模板
 * 获取指定ID的通知模板详情 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsTemplatesByTemplates(announcementId: string) {
  const res = await api.get(`/notification/api/v1/notifications/templates/${announcementId}`);
  return res.data;
}

/**
 * 发送测试通知
 * 向指定渠道和目标发送一条测试通知，创建测试通知记录到数据库，用于验证通知服务配置是否正确 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsTestPost(data: TestNotificationRequest) {
  const res = await api.post(`/notification/api/v1/notifications/test`, data);
  return res.data;
}

/**
 * 获取通知趋势
 * 返回指定天数内每日通知发送量和已读量的趋势数据 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsTrend(params?: {
  days?: number;  // 天数（默认30）
}) {
  const res = await api.get(`/notification/api/v1/notifications/trend`, { params });
  return res.data;
}

/**
 * 获取未读通知列表
 * 获取当前用户的所有未读通知列表 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsUnread() {
  const res = await api.get(`/notification/api/v1/notifications/unread`);
  return res.data;
}

/**
 * 获取未读通知数量
 * 获取当前用户的未读通知数量及最后通知时间 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsUnreadCount() {
  const res = await api.get(`/notification/api/v1/notifications/unread-count`);
  return res.data;
}

/**
 * 删除通知
 * 删除指定ID的通知记录（软验证用户ID匹配） 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsByNotificationsDelete(notificationId: string, data: DeleteNotificationRequest) {
  await api.delete(`/notification/api/v1/notifications/${notificationId}`, { data });
}

/**
 * 获取通知详情
 * 获取指定通知的详细信息
 */
export async function notificationsByNotifications(notificationId: string) {
  const res = await api.get(`/notification/api/v1/notifications/${notificationId}`);
  return res.data;
}

/**
 * 标记通知已读
 * 将指定通知标记为已读状态，记录已读时间 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsReadByNotificationsPut(notificationId: string) {
  const res = await api.put(`/notification/api/v1/notifications/${notificationId}/read`);
  return res.data;
}

/**
 * 标记通知未读
 * 将指定通知标记为未读状态 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function notificationsUnreadByNotificationsPut(notificationId: string) {
  const res = await api.put(`/notification/api/v1/notifications/${notificationId}/unread`);
  return res.data;
}

/**
 * 删除推送订阅
 * 根据 endpoint 删除 Web Push 订阅 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function pushSubscriptionsDelete(params?: {
  endpoint: string;  // 订阅端点URL
}) {
  await api.delete(`/notification/api/v1/push/subscriptions`, { params });
}

/**
 * 列出推送订阅
 * 查询当前用户的 Web Push 订阅列表 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function pushSubscriptions() {
  const res = await api.get(`/notification/api/v1/push/subscriptions`);
  return res.data;
}

/**
 * 注册 Web Push 推送订阅
 * 注册 Web Push 订阅（RFC 8030 VAPID），用于接收推送通知 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function pushSubscriptionsPost(data: PushSubscriptionRequest) {
  const res = await api.post(`/notification/api/v1/push/subscriptions`, data);
  return res.data;
}

/**
 * 获取推送订阅详情
 * 根据ID查询 Web Push 订阅详情
 */
export async function pushSubscriptionsBySubscriptions(id: string) {
  const res = await api.get(`/notification/api/v1/push/subscriptions/${id}`);
  return res.data;
}

/**
 * 获取 VAPID 公钥
 * 返回 Web Push VAPID 公钥，供前端注册 Push 订阅时使用 参考：CAN-SPAM Act (15 U.S.C. §7701) — Commercial Email Compliance。
 */
export async function pushVapidPublicKey() {
  const res = await api.get(`/notification/api/v1/push/vapid-public-key`);
  return res.data;
}

// ============================================================
// Oauth Service
// ============================================================

/**
 * 列出 OAuth 客户端
 * 返回当前租户下分页的 OAuth 客户端列表，支持按名称和状态过滤
 */
export async function adminOauthClients(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  name?: string;  // 按名称搜索
  status?: string;  // 按状态筛选（active/suspended）
}) {
  const res = await api.get(`/oauth/api/v1/admin/oauth/clients`, { params });
  return res.data;
}

/**
 * 创建 OAuth 客户端
 * 创建一个新的 OAuth 客户端，返回凭据（client_secret 仅返回一次）。支持配置 redirect_uris, scopes, grant_types, JWKS, FAPI profile 等。
 */
export async function adminOauthClientsPost(data: CreateClientRequest) {
  const res = await api.post(`/oauth/api/v1/admin/oauth/clients`, data);
  return res.data;
}

/**
 * 删除 OAuth 客户端
 * 软删除指定的 OAuth 客户端及其关联令牌
 */
export async function adminOauthClientsByClientsDelete(clientId: string) {
  await api.delete(`/oauth/api/v1/admin/oauth/clients/${clientId}`);
}

/**
 * 获取 OAuth 客户端详情
 * 根据 client_id 获取指定客户端的完整信息
 */
export async function adminOauthClientsByClients(clientId: string) {
  const res = await api.get(`/oauth/api/v1/admin/oauth/clients/${clientId}`);
  return res.data;
}

/**
 * 更新 OAuth 客户端配置
 * 更新指定 OAuth 客户端的配置信息（redirect_uris, scopes, grant_types, name, status, JWKS 等）
 */
export async function adminOauthClientsByClientsPut(clientId: string, data: UpdateClientRequest) {
  const res = await api.put(`/oauth/api/v1/admin/oauth/clients/${clientId}`, data);
  return res.data;
}

/**
 * 获取 OAuth 客户端审计日志
 * 返回指定客户端的变更审计日志（操作人、操作时间、操作类型、变更详情等）
 */
export async function adminOauthClientsAuditLogsByClients(clientId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/oauth/api/v1/admin/oauth/clients/${clientId}/audit-logs`, { params });
  return res.data;
}

/**
 * 克隆 OAuth 客户端
 * 克隆指定客户端，返回新凭据（client_secret 仅返回一次）。保留原客户端的 redirect_uris, scopes, grant_types, JWKS 等配置。
 */
export async function adminOauthClientsCloneByClientsPost(clientId: string) {
  const res = await api.post(`/oauth/api/v1/admin/oauth/clients/${clientId}/clone`);
  return res.data;
}

/**
 * 轮换 OAuth 客户端密钥
 * 为指定客户端生成新密钥，旧密钥立即失效（移至历史表，仍可验证4小时）
 */
export async function adminOauthClientsRotateSecretByClientsPost(clientId: string) {
  const res = await api.post(`/oauth/api/v1/admin/oauth/clients/${clientId}/rotate-secret`);
  return res.data;
}

/**
 * 列出 OAuth 客户端所有密钥
 * 返回指定客户端的所有密钥元数据（不含密钥值）
 */
export async function adminOauthClientsSecretsByClients(clientId: string) {
  const res = await api.get(`/oauth/api/v1/admin/oauth/clients/${clientId}/secrets`);
  return res.data;
}

/**
 * 创建 OAuth 客户端密钥
 * 为指定客户端创建一个新密钥（secret_value 仅返回一次）。最多支持2个有效密钥。
 */
export async function adminOauthClientsSecretsByClientsPost(clientId: string) {
  const res = await api.post(`/oauth/api/v1/admin/oauth/clients/${clientId}/secrets`);
  return res.data;
}

/**
 * 删除 OAuth 客户端密钥
 * 硬删除指定密钥（至少保留一个密钥）
 */
export async function adminOauthClientsSecretsByClientsBySecretsDelete(clientId: string, secretId: string) {
  await api.delete(`/oauth/api/v1/admin/oauth/clients/${clientId}/secrets/${secretId}`);
}

/**
 * 停用 OAuth 客户端密钥
 * 将指定密钥状态设为停用（仍可验证现有令牌，但不接受新令牌）
 */
export async function adminOauthClientsSecretsDeactivateByClientsBySecretsPut(clientId: string, secretId: string) {
  const res = await api.put(`/oauth/api/v1/admin/oauth/clients/${clientId}/secrets/${secretId}/deactivate`);
  return res.data;
}

/**
 * 获取 OAuth 客户端统计数据
 * 返回指定客户端的令牌使用统计（活跃 token 数、最后请求时间等）
 */
export async function adminOauthClientsStatsByClients(clientId: string) {
  const res = await api.get(`/oauth/api/v1/admin/oauth/clients/${clientId}/stats`);
  return res.data;
}

/**
 * 撤销 OAuth 客户端所有令牌
 * 撤销指定客户端的所有活跃令牌，支持可选宽限期（grace_period，秒级）
 */
export async function adminOauthClientsTokensByClientsDelete(clientId: string, params?: {
  grace_period?: number;  // 宽限期（秒）
}) {
  await api.delete(`/oauth/api/v1/admin/oauth/clients/${clientId}/tokens`, { params });
}

/**
 * 列出 OAuth 客户端活跃令牌
 * 返回指定客户端的活跃访问令牌和刷新令牌列表
 */
export async function adminOauthClientsTokensByClients(clientId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/oauth/api/v1/admin/oauth/clients/${clientId}/tokens`, { params });
  return res.data;
}

/**
 * 列出设备授权会话
 * 分页列出当前租户下所有设备授权码会话，支持按状态和客户端ID过滤。仅管理员可访问。
 */
export async function adminOauthDevices(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  status?: string;  // 状态过滤（pending/authorized/denied/expired）
  client_id?: string;  // 客户端ID过滤
}) {
  const res = await api.get(`/oauth/api/v1/admin/oauth/devices`, { params });
  return res.data;
}

/**
 * 撤销设备授权
 * 撤销指定的设备授权会话，将设备授权状态标记为已过期。仅管理员可访问。
 */
export async function adminOauthDevicesByDevicesDelete(deviceCode: string) {
  await api.delete(`/oauth/api/v1/admin/oauth/devices/${deviceCode}`);
}

/**
 * 列出OAuth提供商
 * 获取当前租户下所有OAuth提供商的列表，包括名称、ID、启用状态等信息。仅管理员可访问。
 */
export async function adminOauthProviders() {
  const res = await api.get(`/oauth/api/v1/admin/oauth/providers`);
  return res.data;
}

/**
 * 创建OAuth提供商
 * 创建一个新的OAuth提供商配置，包括名称、Client ID、Client Secret、授权/令牌/用户信息端点URL等信息。仅管理员可访问。
 */
export async function adminOauthProvidersPost(data: AdminCreateProviderRequest) {
  const res = await api.post(`/oauth/api/v1/admin/oauth/providers`, data);
  return res.data;
}

/**
 * 删除OAuth提供商
 * 删除指定的OAuth提供商配置。仅管理员可访问。
 */
export async function adminOauthProvidersByProvidersDelete(name: string) {
  await api.delete(`/oauth/api/v1/admin/oauth/providers/${name}`);
}

/**
 * 更新OAuth提供商
 * 更新指定OAuth提供商的配置信息，支持部分更新（仅提交需要修改的字段）。仅管理员可访问。
 */
export async function adminOauthProvidersByProvidersPut(name: string, data: AdminUpdateProviderRequest) {
  const res = await api.put(`/oauth/api/v1/admin/oauth/providers/${name}`, data);
  return res.data;
}

/**
 * 启停OAuth提供商
 * 启用或禁用指定的OAuth提供商。仅管理员可访问。
 */
export async function adminOauthProvidersToggleByProvidersPut(name: string, data: AdminToggleProviderRequest) {
  const res = await api.put(`/oauth/api/v1/admin/oauth/providers/${name}/toggle`, data);
  return res.data;
}

/**
 * 批量撤销用户令牌
 * 批量撤销指定用户的所有访问令牌和刷新令牌。JWT 认证保护，仅管理员可访问。
 */
export async function adminOauthTokensUserByUserDelete(userId: string) {
  await api.delete(`/oauth/api/v1/admin/oauth/tokens/user/${userId}`);
}

/**
 * OAuth 2.0 授权端点
 * OAuth 2.0 授权端点。提供 redirect_uri 时返回 302 重定向；未提供时返回 JSON 授权码。支持 PKCE 和 PAR（通过 request_uri）。参考：RFC 6749 §4.1.1-4.1.2.1 (Authorization Code Grant)、RFC 7636 (PKCE)、RFC 9126 (PAR)、OAuth 2.1 可选 iss 参数。
 */
export async function oauthAuthorize(params?: {
  response_type: string;  // 响应类型（仅支持 code）
  client_id: string;  // 客户端ID
  redirect_uri?: string;  // 重定向URI
  scope?: string;  // 请求的权限范围
  state?: string;  // 防CSRF状态参数
  iss?: string;  // Issuer URL（OAuth 2.1）
  nonce?: string;  // OIDC nonce 参数
  code_challenge?: string;  // PKCE Code Challenge（RFC 7636）
  code_challenge_method?: string;  // PKCE 方法（S256）
  authorization_details?: string;  // Authorization Details（RFC 9396）
  request_uri?: string;  // PAR Request URI（RFC 9126）
}) {
  const res = await api.get(`/oauth/api/v1/oauth/authorize`, { params });
  return res.data;
}

/**
 * OAuth 2.0 授权端点（POST）
 * OAuth 2.0 授权端点（POST 方式）。用户确认授权后，提供 redirect_uri 时返回 302 重定向；未提供时返回 JSON 授权码。支持 PKCE、PAR 和 consent 自动保存。参考：RFC 6749 §4.1.1-4.1.2.1 (Authorization Code Grant)、RFC 7636 (PKCE)、RFC 9126 (PAR)。
 */
export async function oauthAuthorizePost(data: Record<string, unknown>) {
  const res = await api.post(`/oauth/api/v1/oauth/authorize`, data);
  return res.data;
}

/**
 * 绑定 OAuth 账号
 * 将当前用户的 Autional 账号与第三方 OAuth 提供商账号绑定。需 JWT 认证，请求体中的 user_id 必须与 JWT subject 一致。
 */
export async function oauthBindPost(data: BindOAuthRequest) {
  const res = await api.post(`/oauth/api/v1/oauth/bind`, data);
  return res.data;
}

/**
 * 获取客户端公开信息
 * 根据 client_id 返回客户端的非敏感公开信息（名称、Logo、Scopes、TenantID）。用于 consent 授权页面展示。
 */
export async function oauthClientByClient(clientId: string) {
  const res = await api.get(`/oauth/api/v1/oauth/client/${clientId}`);
  return res.data;
}

/**
 * 获取 OAuth 连接列表
 * 返回指定用户的所有第三方 OAuth 连接。需 JWT 认证，路径中的 user_id 必须与 JWT subject 一致。
 */
export async function oauthConnectionsByConnections(userId: string) {
  const res = await api.get(`/oauth/api/v1/oauth/connections/${userId}`);
  return res.data;
}

/**
 * 获取授权同意列表
 * 获取当前用户已授权的所有 OAuth 客户端同意记录，包括客户端 ID、授权范围及授权时间。
 */
export async function oauthConsents() {
  const res = await api.get(`/oauth/api/v1/oauth/consents`);
  return res.data;
}

/**
 * 撤销授权同意
 * 撤销当前用户对特定 OAuth 客户端的一条授权同意记录，撤销后该客户端的访问令牌将失效。
 */
export async function oauthConsentsByConsentsDelete(id: string) {
  await api.delete(`/oauth/api/v1/oauth/consents/${id}`);
}

/**
 * 设备授权请求
 * OAuth 2.0 设备授权端点。设备发起授权请求，获取 device_code 和 user_code，用户随后在浏览器中输入 user_code 完成授权。公开端点，无需认证。参考：RFC 8628 §3.1 (Device Authorization Grant)。
 */
export async function oauthDeviceAuthorizePost(data: DeviceAuthorizationRequest) {
  const res = await api.post(`/oauth/api/v1/oauth/device/authorize`, data);
  return res.data;
}

/**
 * 设备授权验证（用户侧）
 * 用户在浏览器中输入 user_code 并批准/拒绝设备授权。需要 JWT 认证。参考：RFC 8628 §3.3 (User Interaction)。
 */
export async function oauthDeviceVerifyPost(data: DeviceAuthorizationVerifyRequest) {
  const res = await api.post(`/oauth/api/v1/oauth/device/verify`, data);
  return res.data;
}

/**
 * 获取 DPoP Nonce
 * DPoP (Demonstration of Proof-of-Possession) Nonce 端点。客户端在发起 DPoP 绑定请求前调用，返回 nonce 通过 DPoP-Nonce 响应头传递。
 */
export async function oauthDpopNonce() {
  const res = await api.get(`/oauth/api/v1/oauth/dpop/nonce`);
  return res.data;
}

/**
 * 令牌自省
 * OAuth 2.0 令牌自省端点。检查令牌的活跃状态，返回令牌的元数据（sub, client_id, scope, exp 等）。返回扁平 JSON（无 code/message 信封）。参考：RFC 7662 (Token Introspection)。
 */
export async function oauthIntrospectPost() {
  const res = await api.post(`/oauth/api/v1/oauth/introspect`);
  return res.data;
}

/**
 * 获取 OAuth 提供商列表
 * 返回当前租户下所有已启用的 OAuth 提供商列表
 */
export async function oauthProviders() {
  const res = await api.get(`/oauth/api/v1/oauth/providers`);
  return res.data;
}

/**
 * 推送授权请求（PAR）
 * OAuth 2.0 推送授权请求端点（PAR）。客户端将授权参数提前推送到授权服务器，获取 request_uri 后在授权请求中使用。返回扁平 JSON（无 code/message 信封）。参考：RFC 9126 (Pushed Authorization Requests)。
 */
export async function oauthPushedAuthorizationPost(data: PushedAuthorizationRequest) {
  const res = await api.post(`/oauth/api/v1/oauth/pushed-authorization`, data);
  return res.data;
}

/**
 * 刷新访问令牌
 * OAuth 2.0 刷新令牌端点。使用 refresh_token 换取新的 access_token 和 refresh_token（轮换）。返回扁平 JSON（无 code/message 信封）。参考：RFC 6749 §6 (Refreshing an Access Token)。
 */
export async function oauthRefreshPost(data: Record<string, unknown>) {
  const res = await api.post(`/oauth/api/v1/oauth/refresh`, data);
  return res.data;
}

/**
 * 动态客户端注册
 * OAuth 2.0 动态客户端注册端点。客户端自助注册并获取 client_id、client_secret 和 registration_access_token。限流：同一IP每小时最多10次注册。参考：RFC 7591 §2 (Dynamic Client Registration Protocol)。
 */
export async function oauthRegisterPost(data: ClientRegistrationRequest) {
  const res = await api.post(`/oauth/api/v1/oauth/register`, data);
  return res.data;
}

/**
 * 删除客户端注册
 * OAuth 2.0 动态客户端注册删除端点。使用 Registration Access Token 软删除客户端注册。参考：RFC 7591 §2.3 (Client Delete Request)。
 */
export async function oauthRegisterByRegisterDelete(clientId: string) {
  await api.delete(`/oauth/api/v1/oauth/register/${clientId}`);
}

/**
 * 读取客户端注册
 * OAuth 2.0 动态客户端注册读取端点。使用 Registration Access Token 读取客户端当前元数据。参考：RFC 7591 §3 (Client Read Request)。
 */
export async function oauthRegisterByRegister(clientId: string) {
  const res = await api.get(`/oauth/api/v1/oauth/register/${clientId}`);
  return res.data;
}

/**
 * 更新客户端注册
 * OAuth 2.0 动态客户端注册更新端点。使用 Registration Access Token 更新客户端元数据（redirect_uris, grant_types, scope, JWKS 等）。参考：RFC 7591 §2.2 (Client Update Request)。
 */
export async function oauthRegisterByRegisterPut(clientId: string, data: ClientRegistrationUpdateRequest) {
  const res = await api.put(`/oauth/api/v1/oauth/register/${clientId}`, data);
  return res.data;
}

/**
 * 撤销令牌
 * OAuth 2.0 令牌撤销端点。成功返回 200 OK（无响应体）。支持撤销 access_token 和 refresh_token。参考：RFC 7009 (Token Revocation)。
 */
export async function oauthRevokePost(data: Record<string, unknown>) {
  const res = await api.post(`/oauth/api/v1/oauth/revoke`, data);
  return res.data;
}

/**
 * 获取OAuth客户端风险评估
 * 根据 client_id 查询该 OAuth 客户端的风险评估日志，返回风险评分、风险等级及建议措施。
 */
export async function oauthRiskAssessment(params?: {
  client_id: string;  // OAuth客户端ID
}) {
  const res = await api.get(`/oauth/api/v1/oauth/risk-assessment`, { params });
  return res.data;
}

/**
 * OAuth 2.0 令牌端点
 * OAuth 2.0 令牌端点。支持 authorization_code、refresh_token、client_credentials、urn:ietf:params:oauth:grant-type:device_code 四种授权类型。支持 private_key_jwt 客户端认证和 DPoP。返回扁平 JSON（无 code/message 信封）。参考：RFC 6749 §4.1.3 (Authorization Code Grant)、§4.3 (Resource Owner Password)、§4.4 (Client Credentials)、RFC 6749 §5.1-5.2、RFC 7636 (PKCE)、RFC 8628 §3.4 (Device Code)。
 */
export async function oauthTokenPost() {
  const res = await api.post(`/oauth/api/v1/oauth/token`);
  return res.data;
}

/**
 * 令牌交换（Token Exchange）
 * 实现 RFC 8693 令牌交换标准，支持 subject_token 和 actor_token 的委托链，将原始 JWT 交换为下游服务的受限访问令牌。用于 NHI Workload 身份委托场景。参考：RFC 8693 (OAuth 2.0 Token Exchange)。
 */
export async function oauthTokenExchangePost() {
  const res = await api.post(`/oauth/api/v1/oauth/token-exchange`);
  return res.data;
}

/**
 * 解绑 OAuth 账号
 * 删除指定的 OAuth 连接，解除 Autional 用户与第三方 OAuth 提供商的绑定。需 JWT 认证。
 */
export async function oauthUnbindByUnbindDelete(connectionId: string) {
  await api.delete(`/oauth/api/v1/oauth/unbind/${connectionId}`);
}

/**
 * 获取用户信息
 * OpenID Connect UserInfo 端点。使用 Bearer Token 认证，返回扁平 UserInfo JSON（无 code/message 信封）。当 scope 包含 "profile" 时，从 profile-service 查询用户资料并合并到响应中。当配置了 verification-service 时，额外查询年龄分组/未成年人状态。参考：OpenID Connect Core 1.0 §5.3 (UserInfo Endpoint)。
 */
export async function oauthUserinfo() {
  const res = await api.get(`/oauth/api/v1/oauth/userinfo`);
  return res.data;
}

/**
 * 获取 OAuth 授权 URL
 * 根据提供商名称生成第三方 OAuth 授权跳转 URL。state 参数可选，不传则自动生成并签名。
 */
export async function oauthAuthorizeByOauth(provider: string, params?: {
  state?: string;  // OAuth state 参数
}) {
  const res = await api.get(`/oauth/api/v1/oauth/${provider}/authorize`, { params });
  return res.data;
}

/**
 * OAuth 授权回调
 * 第三方 OAuth 提供商授权完成后的回调端点。交换授权码获取访问令牌并拉取用户信息。
 */
export async function oauthCallbackByOauth(provider: string, params?: {
  code: string;  // 第三方返回的授权码
  state: string;  // 签名后的 state 参数
}) {
  const res = await api.get(`/oauth/api/v1/oauth/${provider}/callback`, { params });
  return res.data;
}

// ============================================================
// Pay Service
// ============================================================

/**
 * 验证支付事件账本完整性
 * 逐条重算支付事件哈希链，验证账本完整性。发现篡改时返回断裂位置。
 */
export async function adminPayIntegrityByIntegrity(payId: string) {
  const res = await api.get(`/pay/api/v1/admin/pay/integrity/${payId}`);
  return res.data;
}

/**
 * 查询支付渠道列表
 * 查询当前租户的所有支付渠道配置列表。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function adminPaymentsChannels() {
  const res = await api.get(`/pay/api/v1/admin/payments/channels`);
  return res.data;
}

/**
 * 创建支付渠道
 * 创建支付渠道配置，支持微信支付、支付宝、Stripe等。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function adminPaymentsChannelsPost(data: CreateChannelRequest) {
  const res = await api.post(`/pay/api/v1/admin/payments/channels`, data);
  return res.data;
}

/**
 * 删除支付渠道
 * 删除指定的支付渠道配置。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function adminPaymentsChannelsByChannelsDelete(paymentId: string) {
  await api.delete(`/pay/api/v1/admin/payments/channels/${paymentId}`);
}

/**
 * 查询支付渠道详情
 * 根据渠道ID查询支付渠道的详细配置信息。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function adminPaymentsChannelsByChannels(paymentId: string) {
  const res = await api.get(`/pay/api/v1/admin/payments/channels/${paymentId}`);
  return res.data;
}

/**
 * 更新支付渠道
 * 更新支付渠道的配置信息、名称、状态或Webhook密钥。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function adminPaymentsChannelsByChannelsPut(paymentId: string, data: UpdateChannelRequest) {
  const res = await api.put(`/pay/api/v1/admin/payments/channels/${paymentId}`, data);
  return res.data;
}

/**
 * 执行对账
 * 对支付网关记录与内部记录进行对账，检测差异金额。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function adminPaymentsReconciliationPost(params?: {
  channel?: string;  // 支付渠道编码
  start_date?: string;  // 开始日期（YYYY-MM-DD）
  end_date?: string;  // 结束日期（YYYY-MM-DD）
}) {
  const res = await api.post(`/pay/api/v1/admin/payments/reconciliation`, undefined, { params });
  return res.data;
}

/**
 * 查询对账历史
 * 查询对账历史记录列表，支持按支付渠道和时间范围筛选。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function adminPaymentsReconciliationHistory(params?: {
  channel?: string;  // 支付渠道编码
  start?: string;  // 开始日期（YYYY-MM-DD）
  end?: string;  // 结束日期（YYYY-MM-DD）
}) {
  const res = await api.get(`/pay/api/v1/admin/payments/reconciliation/history`, { params });
  return res.data;
}

/**
 * 删除对账记录
 * 删除指定的对账记录。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function adminPaymentsReconciliationByReconciliationDelete(paymentId: string) {
  await api.delete(`/pay/api/v1/admin/payments/reconciliation/${paymentId}`);
}

/**
 * 查询Webhook记录
 * 查询支付网关Webhook回调记录列表。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function adminPaymentsWebhooks(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/pay/api/v1/admin/payments/webhooks`, { params });
  return res.data;
}

/**
 * 删除Webhook记录
 * 删除指定的Webhook回调记录。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function adminPaymentsWebhooksByWebhooksDelete(paymentId: string) {
  await api.delete(`/pay/api/v1/admin/payments/webhooks/${paymentId}`);
}

/**
 * 查询支付列表
 * 查询支付订单列表，支持按应用ID和状态筛选。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function payments(params?: {
  app_id?: string;  // 应用ID
  status?: string;  // 支付状态
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/pay/api/v1/payments`, { params });
  return res.data;
}

/**
 * 创建支付订单
 * 创建支付订单，指定支付渠道和金额。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function paymentsPost(data: CreatePaymentRequest) {
  const res = await api.post(`/pay/api/v1/payments`, data);
  return res.data;
}

/**
 * 创建退款
 * 为已支付的订单创建退款。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function paymentsRefundPost(data: RefundRequest) {
  const res = await api.post(`/pay/api/v1/payments/refund`, data);
  return res.data;
}

/**
 * 支付网关返回回调
 * 接收支付网关的同步回调（用户完成支付后的浏览器重定向），查找支付订单并302重定向至前端结果页面。
 */
export async function paymentsReturnByReturn(channel: string, params?: {
  order_id: string;  // 支付订单ID
  status: string;  // 支付状态（success/fail/pending）
}) {
  const res = await api.get(`/pay/api/v1/payments/return/${channel}`, { params });
  return res.data;
}

/**
 * 取消支付
 * 取消待支付的订单。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function paymentsByPaymentsDelete(paymentId: string) {
  await api.delete(`/pay/api/v1/payments/${paymentId}`);
}

/**
 * 查询支付详情
 * 根据支付ID查询支付订单的详细信息。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function paymentsByPayments(paymentId: string) {
  const res = await api.get(`/pay/api/v1/payments/${paymentId}`);
  return res.data;
}

/**
 * 生成发票
 * 为已支付订单生成发票记录。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function paymentsInvoiceByPaymentsPost(paymentId: string) {
  const res = await api.post(`/pay/api/v1/payments/${paymentId}/invoice`);
  return res.data;
}

/**
 * 获取支付回执
 * 获取已完成支付订单的回执信息。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function paymentsReceiptByPayments(paymentId: string) {
  const res = await api.get(`/pay/api/v1/payments/${paymentId}/receipt`);
  return res.data;
}

/**
 * 查询退款详情
 * 根据退款ID查询退款详情，支持通过支付ID或退款ID查询。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function paymentsRefundByPayments(paymentId: string) {
  const res = await api.get(`/pay/api/v1/payments/${paymentId}/refund`);
  return res.data;
}

/**
 * 查询支付退款列表
 * 查询指定支付订单的所有退款记录。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function paymentsRefundsByPayments(paymentId: string) {
  const res = await api.get(`/pay/api/v1/payments/${paymentId}/refunds`);
  return res.data;
}

/**
 * 查询退款详情
 * 根据退款ID查询退款详情，支持通过支付ID或退款ID查询。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function refundsByRefunds(refundId: string) {
  const res = await api.get(`/pay/api/v1/refunds/${refundId}`);
  return res.data;
}

/**
 * 接收支付网关回调
 * 接收并处理支付网关（微信支付、支付宝、Stripe等）的Webhook回调通知，验证签名后更新支付状态。参考：PCI DSS v4.0 Req 3.3 (Mask PAN)、PCI DSS v4.0 Req 4 (Encrypt Transmission)。
 */
export async function webhooksPaymentByPaymentPost(channel: string) {
  const res = await api.post(`/pay/api/v1/webhooks/payment/${channel}`);
  return res.data;
}

// ============================================================
// Point Service
// ============================================================

/**
 * 获取积分规则列表
 * 管理员操作，查询租户下的积分规则列表。默认仅返回启用的规则，设置 include_disabled=true 可同时返回已禁用的规则。
 */
export async function adminPointRules(params?: {
  include_disabled?: boolean;  // 包含已禁用规则
}) {
  const res = await api.get(`/point/api/v1/admin/point-rules`, { params });
  return res.data;
}

/**
 * 创建积分规则
 * 管理员操作，为租户创建新的积分规则。规则匹配事件类型后自动触发积分发放。
 */
export async function adminPointRulesPost(data: CreatePointRuleRequest) {
  const res = await api.post(`/point/api/v1/admin/point-rules`, data);
  return res.data;
}

/**
 * 规则试算
 * 管理员操作，dry-run 试算给定事件类型匹配的规则参数和预期积分。不实际发放积分，不修改任何数据。
 */
export async function adminPointRulesTestPost(data: TestRuleRequest) {
  const res = await api.post(`/point/api/v1/admin/point-rules/test`, data);
  return res.data;
}

/**
 * 删除积分规则
 * 管理员操作，软删除积分规则（设置 enabled=false），不物理删除记录。已禁用的规则再次调用返回404。
 */
export async function adminPointRulesByPointRulesDelete(id: string) {
  await api.delete(`/point/api/v1/admin/point-rules/${id}`);
}

/**
 * 获取单个积分规则详情
 * 管理员操作，根据规则ID获取规则详情。
 */
export async function adminPointRulesByPointRules(id: string) {
  const res = await api.get(`/point/api/v1/admin/point-rules/${id}`);
  return res.data;
}

/**
 * 更新积分规则
 * 管理员操作，部分更新积分规则字段，仅更新请求中提供的字段（name、event_type、points、multiplier、daily_limit、total_limit、enabled）。
 */
export async function adminPointRulesByPointRulesPut(id: string, data: UpdatePointRuleRequest) {
  const res = await api.put(`/point/api/v1/admin/point-rules/${id}`, data);
  return res.data;
}

/**
 * 验证积分账户事件链完整性
 * 管理员操作，逐块验证积分账户的 hash-chain 完整性。检测篡改事件。
 */
export async function adminPointIntegrityByIntegrity(accountId: string) {
  const res = await api.get(`/point/api/v1/admin/point/integrity/${accountId}`);
  return res.data;
}

/**
 * 查询积分账户列表
 * 分页查询租户下所有积分账户，可按状态筛选。
 */
export async function adminPoints(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  status?: "active" | "suspended" | "closed";  // 状态筛选
}) {
  const res = await api.get(`/point/api/v1/admin/points`, { params });
  return res.data;
}

/**
 * 创建积分账户
 * 为用户在当前租户下创建积分账户。同一用户在同一租户下只能有一个积分账户。
 */
export async function adminPointsPost(data: CreatePointAccountRequest) {
  const res = await api.post(`/point/api/v1/admin/points`, data);
  return res.data;
}

/**
 * 应用积分规则
 * 管理员操作，根据事件类型匹配租户下已启用的积分规则并自动发放积分。计算逻辑：基础积分 × multiplier，若配置 daily_limit 则检查当日已获得量。
 */
export async function adminPointsApplyRulePost(data: ApplyPointRuleRequest) {
  const res = await api.post(`/point/api/v1/admin/points/apply-rule`, data);
  return res.data;
}

/**
 * 批量发放积分
 * 管理员操作，一次请求向多个用户发放积分。逐条处理，每条记录独立处理，某条失败不影响其他记录。
 */
export async function adminPointsBatchEarnPost(data: BatchEarnRequest) {
  const res = await api.post(`/point/api/v1/admin/points/batch-earn`, data);
  return res.data;
}

/**
 * 删除租户积分配置
 * 管理员操作，删除当前租户的积分配置。
 */
export async function adminPointsConfigDelete() {
  await api.delete(`/point/api/v1/admin/points/config`);
}

/**
 * 获取租户积分配置
 * 管理员操作，查询当前租户的积分配置，包含积分类型、兑换比率、过期策略、功能开关等。
 */
export async function adminPointsConfig() {
  const res = await api.get(`/point/api/v1/admin/points/config`);
  return res.data;
}

/**
 * 更新租户积分配置
 * 管理员操作，更新当前租户的积分配置参数（积分类型、兑换比率、过期策略、功能开关等）。仅更新请求中提供的字段。
 */
export async function adminPointsConfigPut(data: UpdateTenantConfigRequest) {
  const res = await api.put(`/point/api/v1/admin/points/config`, data);
  return res.data;
}

/**
 * 管理员租户级积分统计
 * 管理员操作，获取当前租户的聚合统计数据：账户总数、活跃账户、总余额、总获得/消费/过期、本月数据、总交易数。
 */
export async function adminPointsStats() {
  const res = await api.get(`/point/api/v1/admin/points/stats`);
  return res.data;
}

/**
 * 管理员查询交易记录
 * 管理员操作，分页查询租户下所有用户的积分交易记录，支持按类型、用户筛选，按创建时间倒序排列。
 */
export async function adminPointsTransactions(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  type?: "earn" | "spend" | "expire" | "freeze" | "unfreeze" | "refund" | "adjust";  // 交易类型
  user_id?: string;  // 用户ID筛选
}) {
  const res = await api.get(`/point/api/v1/admin/points/transactions`, { params });
  return res.data;
}

/**
 * 删除积分账户
 * 管理员操作，删除指定用户的积分账户（物理删除）。
 */
export async function adminPointsByPointsDelete(userId: string) {
  await api.delete(`/point/api/v1/admin/points/${userId}`);
}

/**
 * 调整积分
 * 管理员操作，对用户积分进行调整。正数增加积分，负数扣减积分。建议填写明确的 reason 以便审计追溯。
 */
export async function adminPointsAdjustByPointsPost(userId: string, data: AdjustPointsRequest) {
  const res = await api.post(`/point/api/v1/admin/points/${userId}/adjust`, data);
  return res.data;
}

/**
 * 处理积分过期
 * 管理员操作，手动触发积分过期，将指定积分从可用余额扣除并标记为已过期。请求的 amount 超过当前可用余额时按比例结算。通过 X-Idempotency-Key 请求头实现幂等。
 */
export async function adminPointsExpireByPointsPost(userId: string, data: ExpirePointsRequest) {
  const res = await api.post(`/point/api/v1/admin/points/${userId}/expire`, data);
  return res.data;
}

/**
 * 冻结积分
 * 管理员操作，冻结用户可用积分，将指定数额从可用余额转入冻结余额。冻结期间积分不可消费。
 */
export async function adminPointsFreezeByPointsPost(userId: string, data: FreezePointsRequest) {
  const res = await api.post(`/point/api/v1/admin/points/${userId}/freeze`, data);
  return res.data;
}

/**
 * 更新积分账户状态
 * 管理员操作，修改积分账户状态。suspended 状态不可进行 earn/spend 操作，closed 状态不可逆。
 */
export async function adminPointsStatusByPointsPut(userId: string, data: UpdateAccountStatusRequest) {
  const res = await api.put(`/point/api/v1/admin/points/${userId}/status`, data);
  return res.data;
}

/**
 * 解冻积分
 * 管理员操作，将之前冻结的积分解冻，恢复为可用余额。解冻数额不能超过当前冻结余额。
 */
export async function adminPointsUnfreezeByPointsPost(userId: string, data: UnfreezePointsRequest) {
  const res = await api.post(`/point/api/v1/admin/points/${userId}/unfreeze`, data);
  return res.data;
}

/**
 * 获取积分账户详情
 * 根据用户ID获取积分账户信息，包含可用余额、冻结余额、总获得、总消费、过期积分、积分类型、兑换比率等。
 */
export async function pointsByPoints(userId: string) {
  const res = await api.get(`/point/api/v1/points/${userId}`);
  return res.data;
}

/**
 * 确认扣除冻结积分
 * 从冻结余额中确认扣除积分。适用于订单确认后实际扣减冻结积分的场景。工作流：Freeze → ConfirmDeduction 或 Unfreeze。
 */
export async function pointsConfirmDeductionByPointsPost(userId: string, data: ConfirmDeductionRequest) {
  const res = await api.post(`/point/api/v1/points/${userId}/confirm-deduction`, data);
  return res.data;
}

/**
 * 获得积分
 * 为用户账户添加积分。如果账户不存在则自动创建。通过 X-Idempotency-Key 请求头实现幂等。
 */
export async function pointsEarnByPointsPost(userId: string, data: EarnPointsRequest) {
  const res = await api.post(`/point/api/v1/points/${userId}/earn`, data);
  return res.data;
}

/**
 * 积分兑换
 * 将积分兑换为指定类型的物品（如优惠券、折扣等）。需要租户开启 ExchangeEnabled 配置。兑换后积分即扣除，不可逆。
 */
export async function pointsExchangeByPointsPost(userId: string, data: ExchangePointsRequest) {
  const res = await api.post(`/point/api/v1/points/${userId}/exchange`, data);
  return res.data;
}

/**
 * 查询即将过期积分
 * 查询用户账户中在未来N天内即将过期的积分明细，包含每笔的来源、数额、到期日、剩余天数。
 */
export async function pointsExpiringByPoints(userId: string, params?: {
  days?: number;  // 查询天数范围
}) {
  const res = await api.get(`/point/api/v1/points/${userId}/expiring`, { params });
  return res.data;
}

/**
 * 退回积分
 * 将已消费的积分退还给用户，用于订单退款、交易撤销等场景。建议传入 related_tx_id 以建立退款链路。
 */
export async function pointsRefundByPointsPost(userId: string, data: RefundPointsRequest) {
  const res = await api.post(`/point/api/v1/points/${userId}/refund`, data);
  return res.data;
}

/**
 * 积分账户风险评分
 * 基于多维度因子（冻结次数、消费比率、近期获取频率、负余额、交易活跃度）对积分账户进行反作弊/套利风险评估。
 */
export async function pointsRiskScoreByPoints(userId: string) {
  const res = await api.get(`/point/api/v1/points/${userId}/risk-score`);
  return res.data;
}

/**
 * 消费积分
 * 从用户账户扣除可用积分。账户必须存在且余额充足，冻结积分不可用于消费。
 */
export async function pointsSpendByPointsPost(userId: string, data: SpendPointsRequest) {
  const res = await api.post(`/point/api/v1/points/${userId}/spend`, data);
  return res.data;
}

/**
 * 积分统计
 * 获取用户积分账户的综合统计数据：当前余额、总获得/消费/过期、本月数据、30天内即将过期积分。
 */
export async function pointsStatsByPoints(userId: string) {
  const res = await api.get(`/point/api/v1/points/${userId}/stats`);
  return res.data;
}

/**
 * 查询交易记录
 * 分页查询用户的积分交易历史，支持按类型筛选，按创建时间倒序排列。
 */
export async function pointsTransactionsByPoints(userId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  type?: "earn" | "spend" | "expire" | "freeze" | "unfreeze" | "refund" | "adjust";  // 交易类型
}) {
  const res = await api.get(`/point/api/v1/points/${userId}/transactions`, { params });
  return res.data;
}

/**
 * 获取单笔交易详情
 * 根据交易ID查询交易详情，包括余额快照（balance_before / balance_after）。
 */
export async function pointsTransactionsByPointsByTransactions(userId: string, txId: string) {
  const res = await api.get(`/point/api/v1/points/${userId}/transactions/${txId}`);
  return res.data;
}

/**
 * 积分转账
 * 将积分从当前用户账户转给同租户下另一用户。需要租户开启 TransferEnabled 配置。通过 X-Idempotency-Key 请求头防幂等重复转账。
 */
export async function pointsTransferByPointsPost(userId: string, data: TransferPointsRequest) {
  const res = await api.post(`/point/api/v1/points/${userId}/transfer`, data);
  return res.data;
}

/**
 * 积分现金价值
 * 根据积分类型和兑换比率计算当前余额对应的现金价值。cash_value = balance / exchange_rate。仅 cash_equivalent 类型可兑换。
 */
export async function pointsValueByPoints(userId: string) {
  const res = await api.get(`/point/api/v1/points/${userId}/value`);
  return res.data;
}

// ============================================================
// Profile Service
// ============================================================

/**
 * 搜索用户资料
 * 根据搜索词、国家、城市等条件分页搜索用户资料。管理员权限，仅能查看本租户下的用户资料。
 */
export async function adminProfiles(params?: {
  keyword?: string;  // 搜索关键词（匹配姓名、邮箱等）
  country?: string;  // 国家筛选
  city?: string;  // 城市筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/profile/api/v1/admin/profiles`, { params });
  return res.data;
}

/**
 * 查询待审批列表
 * 查询当前租户所有待审批的请求，管理员读权限。返回审批请求列表及其当前状态。
 */
export async function adminProfilesApprovalRequests() {
  const res = await api.get(`/profile/api/v1/admin/profiles/approval-requests`);
  return res.data;
}

/**
 * 创建审批请求
 * 为指定用户创建资料变更审批请求，支持 archive（归档）、export（导出）、delete（删除）、correct（更正）操作类型。管理员权限。参考：GDPR Art 16 (更正权)、GDPR Art 17 (被遗忘权)。
 */
export async function adminProfilesApprovalRequestsPost(data: ApprovalRequest) {
  const res = await api.post(`/profile/api/v1/admin/profiles/approval-requests`, data);
  return res.data;
}

/**
 * 删除审批请求
 * 删除指定的待审批请求，仅限 pending 状态的请求可以删除。管理员权限。
 */
export async function adminProfilesApprovalRequestsByApprovalRequestsDelete(requestId: string) {
  await api.delete(`/profile/api/v1/admin/profiles/approval-requests/${requestId}`);
}

/**
 * 批准审批请求
 * 批准指定的审批请求，执行审批对应的操作（归档/导出/删除/更正）。发布审批应用事件。管理员权限。
 */
export async function adminProfilesApprovalRequestsApproveByApprovalRequestsPost(requestId: string) {
  const res = await api.post(`/profile/api/v1/admin/profiles/approval-requests/${requestId}/approve`);
  return res.data;
}

/**
 * 拒绝审批请求
 * 拒绝指定的审批请求，需要提供拒绝原因，已拒绝的请求不可再操作。管理员权限。
 */
export async function adminProfilesApprovalRequestsRejectByApprovalRequestsPost(requestId: string, data: RejectApprovalBody) {
  const res = await api.post(`/profile/api/v1/admin/profiles/approval-requests/${requestId}/reject`, data);
  return res.data;
}

/**
 * 批量归档用户资料
 * 批量归档指定用户的资料，单次最多 100 个用户。管理员写权限。参考：GDPR Art 5 (数据最小化原则)。
 */
export async function adminProfilesBatchArchivePost(data: BatchRequest) {
  const res = await api.post(`/profile/api/v1/admin/profiles/batch-archive`, data);
  return res.data;
}

/**
 * 批量删除用户资料
 * 批量软删除指定用户的资料，单次最多 100 个用户。管理员写权限。参考：GDPR Art 17 (被遗忘权)。
 */
export async function adminProfilesBatchDeletePost(data: BatchRequest) {
  const res = await api.post(`/profile/api/v1/admin/profiles/batch-delete`, data);
  return res.data;
}

/**
 * 批量导出用户资料
 * 批量导出指定用户的资料数据，单次最多 100 个用户。管理员写权限。参考：GDPR Art 20 (数据可携带权)。
 */
export async function adminProfilesBatchExportPost(data: BatchRequest) {
  const res = await api.post(`/profile/api/v1/admin/profiles/batch-export`, data);
  return res.data;
}

/**
 * 列出字段模板
 * 获取当前租户的所有自定义字段模板，包括系统预设字段和租户自定义字段。管理员读权限。
 */
export async function adminProfilesFieldSchemas() {
  const res = await api.get(`/profile/api/v1/admin/profiles/field-schemas`);
  return res.data;
}

/**
 * 创建字段模板
 * 为租户创建新的自定义字段模板，定义字段的类型、验证规则和是否需同意等属性。发布字段模板创建事件。管理员写权限。参考：GDPR Art 5 (数据最小化原则)。
 */
export async function adminProfilesFieldSchemasPost(data: FieldSchemaDTO) {
  const res = await api.post(`/profile/api/v1/admin/profiles/field-schemas`, data);
  return res.data;
}

/**
 * 删除字段模板
 * 删除指定字段模板（系统字段不可删除），发布字段模板删除事件。管理员写权限。
 */
export async function adminProfilesFieldSchemasByFieldSchemasDelete(fieldKey: string) {
  await api.delete(`/profile/api/v1/admin/profiles/field-schemas/${fieldKey}`);
}

/**
 * 更新字段模板
 * 更新指定字段模板的配置，发布字段模板更新事件。管理员写权限。参考：GDPR Art 5 (数据最小化原则)。
 */
export async function adminProfilesFieldSchemasByFieldSchemasPut(fieldKey: string, data: FieldSchemaDTO) {
  const res = await api.put(`/profile/api/v1/admin/profiles/field-schemas/${fieldKey}`, data);
  return res.data;
}

/**
 * 删除租户资料策略
 * 删除租户策略配置，恢复为系统默认值。发布策略重置事件。管理员权限。
 */
export async function adminProfilesPolicyDelete() {
  await api.delete(`/profile/api/v1/admin/profiles/policy`);
}

/**
 * 获取租户资料策略
 * 获取当前租户的资料管理策略配置，包括字段必填规则、隐私默认值等。管理员权限。
 */
export async function adminProfilesPolicy() {
  const res = await api.get(`/profile/api/v1/admin/profiles/policy`);
  return res.data;
}

/**
 * 创建租户资料策略
 * 创建租户资料管理策略配置，发布策略创建事件。管理员写权限。
 */
export async function adminProfilesPolicyPost(data: ProfilePolicyDTO) {
  const res = await api.post(`/profile/api/v1/admin/profiles/policy`, data);
  return res.data;
}

/**
 * 更新租户资料策略
 * 部分更新租户的资料管理策略配置，发布策略更新事件。管理员权限。
 */
export async function adminProfilesPolicyPut(data: ProfilePolicyDTO) {
  const res = await api.put(`/profile/api/v1/admin/profiles/policy`, data);
  return res.data;
}

/**
 * 获取资料统计
 * 获取租户的资料统计数据，包括总用户数、资料完整度分布、字段填充率等。管理员读权限。
 */
export async function adminProfilesStats() {
  const res = await api.get(`/profile/api/v1/admin/profiles/stats`);
  return res.data;
}

/**
 * 删除资料版本记录
 * 删除指定的用户资料历史版本快照，用于版本清理。管理员权限。
 */
export async function adminProfilesVersionsByVersionsDelete(requestId: string) {
  await api.delete(`/profile/api/v1/admin/profiles/versions/${requestId}`);
}

/**
 * 删除 Webhook 配置
 * 删除当前租户的 Webhook 回调配置。发布 Webhook 配置删除事件。管理员写权限。
 */
export async function adminProfilesWebhookDelete() {
  await api.delete(`/profile/api/v1/admin/profiles/webhook`);
}

/**
 * 获取 Webhook 配置
 * 获取当前租户的资料变更 Webhook 回调配置，包括回调 URL、密钥、订阅事件列表和启用状态。管理员读权限。
 */
export async function adminProfilesWebhook() {
  const res = await api.get(`/profile/api/v1/admin/profiles/webhook`);
  return res.data;
}

/**
 * 创建 Webhook 配置
 * 创建租户资料变更 Webhook 回调配置，发布 Webhook 配置创建事件。管理员写权限。
 */
export async function adminProfilesWebhookPost(data: WebhookConfigDTO) {
  const res = await api.post(`/profile/api/v1/admin/profiles/webhook`, data);
  return res.data;
}

/**
 * 更新 Webhook 配置
 * 更新当前租户的 Webhook 回调配置，包含回调 URL、密钥、事件列表和启用状态。发布 Webhook 配置更新事件。管理员写权限。
 */
export async function adminProfilesWebhookPut(data: WebhookConfigDTO) {
  const res = await api.put(`/profile/api/v1/admin/profiles/webhook`, data);
  return res.data;
}

/**
 * 归档用户资料
 * 将指定用户的资料进行归档处理，管理员权限。参考：GDPR Art 5 (数据最小化原则)。
 */
export async function adminProfilesArchiveByProfilesPost(userId: string, data: ArchiveProfileRequest) {
  const res = await api.post(`/profile/api/v1/admin/profiles/${userId}/archive`, data);
  return res.data;
}

/**
 * 导出用户资料
 * 按指定格式导出用户资料数据，管理员权限。触发资料导出事件用于审计。参考：GDPR Art 20 (数据可携带权)。
 */
export async function adminProfilesExportByProfiles(userId: string, params?: {
  format?: string;  // 导出格式（json/csv）
}) {
  const res = await api.get(`/profile/api/v1/admin/profiles/${userId}/export`, { params });
  return res.data;
}

/**
 * 获取资料版本历史
 * 获取指定用户资料的所有历史版本快照，用于审计追踪和变更回溯。管理员读权限。
 */
export async function adminProfilesVersionsByProfiles(userId: string) {
  const res = await api.get(`/profile/api/v1/admin/profiles/${userId}/versions`);
  return res.data;
}

/**
 * 快捷获取当前用户头像
 * 根据当前认证用户身份获取头像URL，无需指定user_id参数。
 */
export async function profileAvatar() {
  const res = await api.get(`/profile/api/v1/profile/avatar`);
  return res.data;
}

/**
 * 用户资料列表
 * 分页查询当前租户下的用户资料列表（简化版），支持关键词搜索
 */
export async function profiles(params?: {
  keyword?: string;  // 搜索关键词
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/profile/api/v1/profiles`, { params });
  return res.data;
}

/**
 * 删除用户资料
 * 软删除指定用户的资料，删除前生成数据快照用于审计。参考：GDPR Art 17 (被遗忘权)、GDPR Art 5 (数据最小化原则)。
 */
export async function profilesByProfilesDelete(userId: string) {
  await api.delete(`/profile/api/v1/profiles/${userId}`);
}

/**
 * 获取用户资料
 * 根据用户ID获取完整的用户资料信息。参考：GDPR Art 5 (数据最小化原则)、GDPR Art 16 (更正权)。
 */
export async function profilesByProfiles(userId: string) {
  const res = await api.get(`/profile/api/v1/profiles/${userId}`);
  return res.data;
}

/**
 * 创建或更新用户资料
 * 根据用户ID创建新资料或更新现有资料信息。参考：GDPR Art 5 (数据最小化原则)、GDPR Art 16 (更正权)。
 */
export async function profilesByProfilesPut(userId: string, data: UpdateProfileRequest) {
  const res = await api.put(`/profile/api/v1/profiles/${userId}`, data);
  return res.data;
}

/**
 * 更新用户头像
 * 更新指定用户的头像URL地址。参考：GDPR Art 5 (数据最小化原则)。
 */
export async function profilesAvatarByProfilesPut(userId: string, data: UpdateAvatarRequest) {
  const res = await api.put(`/profile/api/v1/profiles/${userId}/avatar`, data);
  return res.data;
}

/**
 * 上传用户头像
 * 接收头像文件上传，转发至 storage-service 存储，并将返回的 URL 更新到用户资料中。支持 JPEG、PNG、GIF、WebP 格式，大小限制 10MB。
 */
export async function profilesAvatarUploadByProfilesPost(userId: string) {
  const res = await api.post(`/profile/api/v1/profiles/${userId}/avatar/upload`);
  return res.data;
}

/**
 * 获取资料完成度
 * 计算用户资料的完成百分比和缺失字段列表，帮助用户了解资料完整性。
 */
export async function profilesCompletenessByProfiles(userId: string) {
  const res = await api.get(`/profile/api/v1/profiles/${userId}/completeness`);
  return res.data;
}

/**
 * 查询用户同意记录
 * 返回当前用户所有字段的同意状态，含字段 Schema 的 RequiresConsent 标记。参考：GDPR Art 7 (同意条件)、ePrivacy Directive 2002/58/EC Art 5(3)。
 */
export async function profilesConsentsByProfiles(userId: string) {
  const res = await api.get(`/profile/api/v1/profiles/${userId}/consents`);
  return res.data;
}

/**
 * 授予数据收集同意
 * 用户主动同意特定字段的数据收集与处理。发布同意授予事件用于审计。参考：GDPR Art 7 (同意条件)。
 */
export async function profilesConsentsByProfilesPost(userId: string, data: GrantConsentRequest) {
  const res = await api.post(`/profile/api/v1/profiles/${userId}/consents`, data);
  return res.data;
}

/**
 * 撤销数据收集同意
 * 用户撤销特定字段的数据收集同意。参考：GDPR Art 7(3) (撤回同意权)。
 */
export async function profilesConsentsByProfilesByConsentsDelete(userId: string, fieldKey: string) {
  await api.delete(`/profile/api/v1/profiles/${userId}/consents/${fieldKey}`);
}

/**
 * 自助导出用户资料
 * 用户自助导出个人资料数据，实现GDPR数据可携带权。触发资料导出事件用于审计。参考：GDPR Art 20 (数据可携带权)。
 */
export async function profilesExportByProfiles(userId: string, params?: {
  format?: string;  // 导出格式（json/csv）
}) {
  const res = await api.get(`/profile/api/v1/profiles/${userId}/export`, { params });
  return res.data;
}

/**
 * 获取自定义字段
 * 获取用户资料的所有自定义字段键值对。参考：GDPR Art 5 (数据最小化原则)。
 */
export async function profilesFieldsByProfiles(userId: string) {
  const res = await api.get(`/profile/api/v1/profiles/${userId}/fields`);
  return res.data;
}

/**
 * 更新自定义字段
 * 更新用户资料的自定义字段键值对。参考：GDPR Art 5 (数据最小化原则)、GDPR Art 16 (更正权)。
 */
export async function profilesFieldsByProfilesPut(userId: string, data: ProfileFieldsRequest) {
  const res = await api.put(`/profile/api/v1/profiles/${userId}/fields`, data);
  return res.data;
}

/**
 * 获取用户偏好设置
 * 获取当前用户的偏好设置，包括主题、语言、时区和通知偏好。
 */
export async function profilesPreferencesByProfiles(userId: string) {
  const res = await api.get(`/profile/api/v1/profiles/${userId}/preferences`);
  return res.data;
}

/**
 * 更新用户偏好设置
 * 更新当前用户的偏好设置，包括主题、语言、时区和通知偏好。
 */
export async function profilesPreferencesByProfilesPut(userId: string, data: UpdatePreferencesRequest) {
  const res = await api.put(`/profile/api/v1/profiles/${userId}/preferences`, data);
  return res.data;
}

/**
 * 获取隐私设置
 * 获取用户资料的隐私控制设置，包括资料可见性、邮箱展示、手机号展示、位置展示等。
 */
export async function profilesPrivacyByProfiles(userId: string) {
  const res = await api.get(`/profile/api/v1/profiles/${userId}/privacy`);
  return res.data;
}

/**
 * 更新隐私设置
 * 更新用户资料的隐私控制设置，发布隐私更新事件。参考：GDPR Art 5 (数据最小化原则)、ePrivacy Directive 2002/58/EC Art 5(3)。
 */
export async function profilesPrivacyByProfilesPut(userId: string, data: PrivacySettingsDTO) {
  const res = await api.put(`/profile/api/v1/profiles/${userId}/privacy`, data);
  return res.data;
}

/**
 * 获取隐私影响评估
 * 基于用户资料数据动态计算隐私影响评分，评估数据收集的隐私风险等级。参考：GDPR Art 35 (数据保护影响评估)。
 */
export async function profilesPrivacyImpactByProfiles(userId: string) {
  const res = await api.get(`/profile/api/v1/profiles/${userId}/privacy-impact`);
  return res.data;
}

/**
 * 获取公开资料
 * 根据用户隐私设置获取公开可见的资料信息，隐藏设置了非公开的字段。参考：GDPR Art 5 (数据最小化原则)。
 */
export async function profilesPublicByProfiles(userId: string) {
  const res = await api.get(`/profile/api/v1/profiles/${userId}/public`);
  return res.data;
}

/**
 * 删除用户标签
 * 删除指定用户的所有标签。
 */
export async function profilesTagsByProfilesDelete(userId: string) {
  await api.delete(`/profile/api/v1/profiles/${userId}/tags`);
}

/**
 * 设置用户标签
 * 为指定用户设置标签列表，覆盖已有标签。
 */
export async function profilesTagsByProfilesPost(userId: string, data: SetTagsRequest) {
  const res = await api.post(`/profile/api/v1/profiles/${userId}/tags`, data);
  return res.data;
}

/**
 * 创建资料版本快照
 * 为指定用户手动创建资料版本快照，保存当前资料状态到版本历史
 */
export async function profilesVersionsByProfilesPost(userId: string) {
  const res = await api.post(`/profile/api/v1/profiles/${userId}/versions`);
  return res.data;
}

// ============================================================
// Rbac Service
// ============================================================

/**
 * 列出审批请求
 * 列出租户下的所有审批请求，支持按状态筛选（pending/approved/rejected/cancelled）和分页。参考：NIST SP 800-53 AC-2 (Account Management)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminApprovalRequests(params?: {
  status?: string;  // 审批状态（pending/approved/rejected/cancelled）
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/rbac/api/v1/admin/approval-requests`, { params });
  return res.data;
}

/**
 * 批准审批请求
 * 批准指定的审批请求，执行审批请求中的操作（如分配角色）。仅在 pending 状态下可审批。参考：NIST SP 800-53 AC-2 (Account Management)、AC-5 (Separation of Duties)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminApprovalRequestsApproveByApprovalRequestsPost(requestId: string, data: ApproveRejectRequest) {
  const res = await api.post(`/rbac/api/v1/admin/approval-requests/${requestId}/approve`, data);
  return res.data;
}

/**
 * 拒绝审批请求
 * 拒绝指定的审批请求，需提供拒绝原因。仅在 pending 状态下可拒绝。参考：NIST SP 800-53 AC-2 (Account Management)、AC-5 (Separation of Duties)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminApprovalRequestsRejectByApprovalRequestsPost(requestId: string, data: ApproveRejectRequest) {
  const res = await api.post(`/rbac/api/v1/admin/approval-requests/${requestId}/reject`, data);
  return res.data;
}

/**
 * 查询权限列表
 * 查询租户下的RBAC权限列表，支持分页和按资源/操作/分类筛选。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminPermissions(params?: {
  resource?: string;  // 资源类型（模糊匹配）
  action?: string;  // 操作类型（模糊匹配）
  category?: string;  // 分类（模糊匹配）
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/rbac/api/v1/admin/permissions`, { params });
  return res.data;
}

/**
 * 创建权限
 * 创建新的RBAC权限项，用于角色授权。权限编码全局唯一，支持 allow/deny 效果、资源分类和标签。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminPermissionsPost(data: CreatePermissionRequest) {
  const res = await api.post(`/rbac/api/v1/admin/permissions`, data);
  return res.data;
}

/**
 * 权限模拟/试算
 * 模拟指定用户对一组资源和操作的权限检查结果（不更改任何数据），用于排查权限问题或预验证RBAC策略。参考：NIST SP 800-53 AC-3 (Access Enforcement)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminPermissionsSimulatePost(data: SimulatePermissionRequest) {
  const res = await api.post(`/rbac/api/v1/admin/permissions/simulate`, data);
  return res.data;
}

/**
 * 删除权限
 * 根据权限ID删除指定权限，删除前检查是否仍有角色引用（有角色引用时拒绝删除）。参考：NIST SP 800-53 AC-2 (Account Management)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminPermissionsByPermissionsDelete(permissionId: string) {
  await api.delete(`/rbac/api/v1/admin/permissions/${permissionId}`);
}

/**
 * 获取权限详情
 * 根据权限ID获取权限的详细信息，包括资源、操作类型、效果、分类和标签。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminPermissionsByPermissions(permissionId: string) {
  const res = await api.get(`/rbac/api/v1/admin/permissions/${permissionId}`);
  return res.data;
}

/**
 * 更新权限信息
 * 根据权限ID更新权限的名称、描述、分类和标签（编码、资源和操作不可变更）。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminPermissionsByPermissionsPut(permissionId: string, data: UpdatePermissionRequest) {
  const res = await api.put(`/rbac/api/v1/admin/permissions/${permissionId}`, data);
  return res.data;
}

/**
 * 获取权限的角色列表
 * 查询拥有指定权限的所有角色（"哪些角色包含此权限"反向查询）。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminPermissionsRolesByPermissions(permissionId: string) {
  const res = await api.get(`/rbac/api/v1/admin/permissions/${permissionId}/roles`);
  return res.data;
}

/**
 * 获取权限的用户列表
 * 查询拥有指定权限的所有用户ID（通过角色继承或直赋），用于安全审计和权限溯源。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminPermissionsUsersByPermissions(permissionId: string) {
  const res = await api.get(`/rbac/api/v1/admin/permissions/${permissionId}/users`);
  return res.data;
}

/**
 * 查询角色列表
 * 查询租户下的RBAC角色列表，支持分页和按编码/名称筛选。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRoles(params?: {
  code?: string;  // 角色编码（模糊匹配）
  name?: string;  // 角色名称（模糊匹配）
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/rbac/api/v1/admin/roles`, { params });
  return res.data;
}

/**
 * 创建角色
 * 创建新的RBAC角色，用于权限管理。角色编码全局唯一，支持设置父角色建立层级继承关系、数据范围(DataScope)控制。参考：NIST SP 800-53 AC-2 (Account Management)、AC-5 (Separation of Duties)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesPost(data: CreateRoleRequest) {
  const res = await api.post(`/rbac/api/v1/admin/roles`, data);
  return res.data;
}

/**
 * 批量撤销权限
 * 为多个角色批量撤销权限。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesBatchPermissionsDelete(data: BatchRevokePermissionsRequest) {
  await api.delete(`/rbac/api/v1/admin/roles/batch/permissions`, { data });
}

/**
 * 批量分配权限
 * 为多个角色批量分配权限，分配前验证权限归属同一租户。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesBatchPermissionsPost(data: BatchAssignPermissionsRequest) {
  const res = await api.post(`/rbac/api/v1/admin/roles/batch/permissions`, data);
  return res.data;
}

/**
 * 列出职责分离冲突对
 * 查询租户下所有已配置的职责分离（SoD）冲突对。参考：NIST SP 800-53 AC-5 (Separation of Duties)。
 */
export async function adminRolesConflictPairs() {
  const res = await api.get(`/rbac/api/v1/admin/roles/conflict-pairs`);
  return res.data;
}

/**
 * 创建职责分离（SoD）冲突对
 * 创建新的职责分离冲突对，指定两个互斥的角色（如审批者与操作者不可为同一人）。创建后，系统在分配角色时自动检测并阻止冲突。参考：NIST SP 800-53 AC-5 (Separation of Duties)。
 */
export async function adminRolesConflictPairsPost(data: CreateConflictPairRequest) {
  const res = await api.post(`/rbac/api/v1/admin/roles/conflict-pairs`, data);
  return res.data;
}

/**
 * 删除职责分离冲突对
 * 删除指定的职责分离（SoD）冲突对，删除后相关角色不再互斥。参考：NIST SP 800-53 AC-5 (Separation of Duties)。
 */
export async function adminRolesConflictPairsByConflictPairsDelete(pairId: string) {
  await api.delete(`/rbac/api/v1/admin/roles/conflict-pairs/${pairId}`);
}

/**
 * 列出默认角色
 * 列出租户的所有默认角色及优先级。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesDefaults() {
  const res = await api.get(`/rbac/api/v1/admin/roles/defaults`);
  return res.data;
}

/**
 * 添加租户默认角色
 * 添加租户级别默认角色，新用户注册时自动分配该角色。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesDefaultsPost(data: AddDefaultRoleRequest) {
  const res = await api.post(`/rbac/api/v1/admin/roles/defaults`, data);
  return res.data;
}

/**
 * 移除默认角色
 * 移除租户的默认角色，移除后新用户不再自动分配该角色。参考：NIST SP 800-53 AC-2 (Account Management)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesDefaultsByDefaultsDelete(roleId: string) {
  await api.delete(`/rbac/api/v1/admin/roles/defaults/${roleId}`);
}

/**
 * 删除角色
 * 根据角色ID删除指定角色，删除前会检查是否有关联用户（有用户关联时拒绝删除）。参考：NIST SP 800-53 AC-2 (Account Management)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesByRolesDelete(roleId: string) {
  await api.delete(`/rbac/api/v1/admin/roles/${roleId}`);
}

/**
 * 获取角色详情
 * 根据角色ID获取角色的详细信息，包括角色名称、描述、数据范围、父子层级关系等。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesByRoles(roleId: string) {
  const res = await api.get(`/rbac/api/v1/admin/roles/${roleId}`);
  return res.data;
}

/**
 * 更新角色信息
 * 根据角色ID更新角色的名称、描述、父角色和数据范围配置。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesByRolesPut(roleId: string, data: UpdateRoleRequest) {
  const res = await api.put(`/rbac/api/v1/admin/roles/${roleId}`, data);
  return res.data;
}

/**
 * 请求角色变更审批
 * 创建角色变更审批请求（如为用户分配角色、移除角色等），提交后进入审批流程等待管理员审批。参考：NIST SP 800-53 AC-2 (Account Management)、AC-5 (Separation of Duties)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesApprovalRequestsByRolesPost(roleId: string, data: RequestApprovalRequest) {
  const res = await api.post(`/rbac/api/v1/admin/roles/${roleId}/approval-requests`, data);
  return res.data;
}

/**
 * 获取子角色列表
 * 查询指定角色的所有直接子角色（下一层级）。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesChildrenByRoles(roleId: string) {
  const res = await api.get(`/rbac/api/v1/admin/roles/${roleId}/children`);
  return res.data;
}

/**
 * 添加子角色
 * 将指定角色设为当前角色的子角色，建立层级继承关系（子角色自动继承父角色权限）。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesChildrenByRolesPost(roleId: string, data: AddRoleChildRequest) {
  const res = await api.post(`/rbac/api/v1/admin/roles/${roleId}/children`, data);
  return res.data;
}

/**
 * 移除子角色
 * 解除指定角色与子角色的层级继承关系。参考：NIST SP 800-53 AC-2 (Account Management)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesChildrenByRolesByChildrenDelete(roleId: string, childId: string) {
  await api.delete(`/rbac/api/v1/admin/roles/${roleId}/children/${childId}`);
}

/**
 * 克隆角色
 * 复制现有角色的全部属性和权限创建新角色，需指定新的角色编码和名称。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesCloneByRolesPost(roleId: string, data: CloneRoleRequest) {
  const res = await api.post(`/rbac/api/v1/admin/roles/${roleId}/clone`, data);
  return res.data;
}

/**
 * 获取角色有效权限
 * 查询角色的所有有效权限（直接分配的权限 + 从所有父角色层级继承的权限），去重后的扁平列表。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesEffectivePermissionsByRoles(roleId: string) {
  const res = await api.get(`/rbac/api/v1/admin/roles/${roleId}/effective-permissions`);
  return res.data;
}

/**
 * 获取祖先角色链
 * 查询指定角色的所有祖先角色（父→祖父→...→根），按层级从近到远排列。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesParentsByRoles(roleId: string) {
  const res = await api.get(`/rbac/api/v1/admin/roles/${roleId}/parents`);
  return res.data;
}

/**
 * 撤销角色权限
 * 从指定角色中撤销一个或多个已分配的权限。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesPermissionsByRolesDelete(roleId: string, data: RevokePermissionsRequest) {
  await api.delete(`/rbac/api/v1/admin/roles/${roleId}/permissions`, { data });
}

/**
 * 获取角色直接分配的权限
 * 根据角色ID获取该角色直接分配的所有权限列表（不含从父角色继承的权限）。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesPermissionsByRoles(roleId: string) {
  const res = await api.get(`/rbac/api/v1/admin/roles/${roleId}/permissions`);
  return res.data;
}

/**
 * 为角色分配权限
 * 为指定角色批量分配一个或多个权限，分配前验证权限归属同一租户。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesPermissionsByRolesPost(roleId: string, data: AssignPermissionsRequest) {
  const res = await api.post(`/rbac/api/v1/admin/roles/${roleId}/permissions`, data);
  return res.data;
}

/**
 * 获取角色的用户列表
 * 查询拥有指定角色的所有用户ID（"谁有此角色"反向查询），用于安全审计和权限溯源。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminRolesUsersByRoles(roleId: string) {
  const res = await api.get(`/rbac/api/v1/admin/roles/${roleId}/users`);
  return res.data;
}

/**
 * 批量移除角色
 * 为多个用户批量移除角色（最多1000个用户），返回每个用户的移除结果。参考：NIST SP 800-53 AC-2 (Account Management)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminUsersBatchRolesDelete(data: BatchRemoveRolesRequest) {
  await api.delete(`/rbac/api/v1/admin/users/batch/roles`, { data });
}

/**
 * 批量分配角色
 * 为多个用户批量分配角色（最多1000个用户），自动执行SoD冲突检测，返回每个用户的分配结果。参考：NIST SP 800-53 AC-2 (Account Management)、AC-5 (Separation of Duties)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminUsersBatchRolesPost(data: BatchAssignRolesRequest) {
  const res = await api.post(`/rbac/api/v1/admin/users/batch/roles`, data);
  return res.data;
}

/**
 * 撤销用户直赋权限
 * 撤销直接分配给用户的一个或多个权限（不影响通过角色继承的权限）。参考：NIST SP 800-53 AC-2 (Account Management)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminUsersPermissionsByUsersDelete(userId: string, data: RevokeDirectPermissionsRequest) {
  await api.delete(`/rbac/api/v1/admin/users/${userId}/permissions`, { data });
}

/**
 * 获取用户有效权限列表
 * 获取指定用户的所有有效权限（聚合：角色直接权限 + 角色层级继承权限 + 用户直赋权限），去重后的扁平列表。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminUsersPermissionsByUsers(userId: string) {
  const res = await api.get(`/rbac/api/v1/admin/users/${userId}/permissions`);
  return res.data;
}

/**
 * 为用户直赋权限
 * 直接分配权限给用户（不通过角色），适用于临时或特殊权限场景。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminUsersPermissionsByUsersPost(userId: string, data: AssignDirectPermissionsRequest) {
  const res = await api.post(`/rbac/api/v1/admin/users/${userId}/permissions`, data);
  return res.data;
}

/**
 * 移除用户角色
 * 从指定用户中移除一个或多个已分配的角色。参考：NIST SP 800-53 AC-2 (Account Management)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminUsersRolesByUsersDelete(userId: string, data: RemoveRolesRequest) {
  await api.delete(`/rbac/api/v1/admin/users/${userId}/roles`, { data });
}

/**
 * 获取用户角色列表
 * 获取指定用户当前拥有的所有角色列表，包含角色详情和层级关系。参考：NIST SP 800-53 AC-2 (Account Management)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminUsersRolesByUsers(userId: string) {
  const res = await api.get(`/rbac/api/v1/admin/users/${userId}/roles`);
  return res.data;
}

/**
 * 为用户分配角色
 * 为指定用户批量分配一个或多个角色，自动执行职责分离（SoD）冲突检测，支持设置有效期和授权类型。参考：NIST SP 800-53 AC-2 (Account Management)、AC-5 (Separation of Duties)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function adminUsersRolesByUsersPost(userId: string, data: AssignRolesRequest) {
  const res = await api.post(`/rbac/api/v1/admin/users/${userId}/roles`, data);
  return res.data;
}

/**
 * 验证用户角色冲突
 * 检查指定用户当前拥有的角色是否存在职责分离（SoD）冲突，返回冲突详情。参考：NIST SP 800-53 AC-5 (Separation of Duties)。
 */
export async function adminUsersRolesValidateByUsersPost(userId: string) {
  const res = await api.post(`/rbac/api/v1/admin/users/${userId}/roles/validate`);
  return res.data;
}

/**
 * 检查用户权限（用户侧）
 * 检查当前登录用户是否拥有指定资源和操作的权限，用于前端按钮级权限控制。参考：NIST SP 800-53 AC-3 (Access Enforcement)、AC-6 (Least Privilege)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function authCheckPermissionPost(data: CheckPermissionRequest) {
  const res = await api.post(`/rbac/api/v1/auth/check-permission`, data);
  return res.data;
}

/**
 * 检查用户角色（用户侧）
 * 检查当前登录用户是否拥有指定的角色编码，用于前端角色门控。参考：NIST SP 800-53 AC-2 (Account Management)、OWASP ASVS V1.2 (Access Control Architecture)。
 */
export async function authCheckRolePost(data: CheckRoleRequest) {
  const res = await api.post(`/rbac/api/v1/auth/check-role`, data);
  return res.data;
}

// ============================================================
// Saml Service
// ============================================================

/**
 * 列出SAML IdP
 * 获取当前租户的所有SAML身份提供商列表
 */
export async function adminSamlProviders(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/saml/api/v1/admin/saml/providers`, { params });
  return res.data;
}

/**
 * 注册SAML IdP
 * 注册一个新的SAML身份提供商配置
 */
export async function adminSamlProvidersPost(data: SamlProviderRequest) {
  const res = await api.post(`/saml/api/v1/admin/saml/providers`, data);
  return res.data;
}

/**
 * 删除SAML IdP
 * 删除SAML身份提供商配置
 */
export async function adminSamlProvidersByProvidersDelete(id: string) {
  await api.delete(`/saml/api/v1/admin/saml/providers/${id}`);
}

/**
 * 获取SAML IdP详情
 * 根据ID获取SAML身份提供商详情
 */
export async function adminSamlProvidersByProviders(id: string) {
  const res = await api.get(`/saml/api/v1/admin/saml/providers/${id}`);
  return res.data;
}

/**
 * 更新SAML IdP
 * 更新SAML身份提供商配置
 */
export async function adminSamlProvidersByProvidersPut(id: string, data: SamlProviderRequest) {
  const res = await api.put(`/saml/api/v1/admin/saml/providers/${id}`, data);
  return res.data;
}

/**
 * 更新属性映射
 * 更新SAML IdP的属性映射配置
 */
export async function adminSamlProvidersAttributeMappingByProvidersPut(id: string, data: UpdateAttributeMappingRequest) {
  const res = await api.put(`/saml/api/v1/admin/saml/providers/${id}/attribute-mapping`, data);
  return res.data;
}

/**
 * 断言消费服务
 * 接收SAML IdP的断言响应，验证并返回访问令牌
 */
export async function samlAcsBySamlPost(providerId: string) {
  const res = await api.post(`/saml/api/v1/saml/${providerId}/acs`);
  return res.data;
}

/**
 * SP-initiated SSO
 * 发起SAML SSO登录，重定向到IdP
 */
export async function samlLoginBySaml(providerId: string) {
  const res = await api.get(`/saml/api/v1/saml/${providerId}/login`);
  return res.data;
}

/**
 * 获取SP元数据
 * 获取SAML服务提供商的元数据XML
 */
export async function samlMetadataBySaml(providerId: string) {
  const res = await api.get(`/saml/api/v1/saml/${providerId}/metadata`);
  return res.data;
}

/**
 * 单点登出
 * 处理SAML单点登出请求
 */
export async function samlSloBySaml(providerId: string) {
  const res = await api.get(`/saml/api/v1/saml/${providerId}/slo`);
  return res.data;
}

/**
 * SP发起的SAML单点登出
 * 构建SAML LogoutRequest并重定向至IdP的SLO端点
 */
export async function samlSloSpBySaml(providerId: string, params?: {
  user_id: string;  // User ID
  session_index?: string;  // Session Index
}) {
  const res = await api.get(`/saml/api/v1/saml/${providerId}/slo/sp`, { params });
  return res.data;
}

// ============================================================
// Secret Service
// ============================================================

/**
 * 列出密钥
 * 管理端分页列出密钥。支持按前缀过滤和状态过滤，返回密钥列表及分页信息。
 */
export async function adminSecrets(params?: {
  prefix?: string;  // 前缀过滤
  status?: string;  // 状态过滤
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/secret/api/v1/admin/secrets`, { params });
  return res.data;
}

/**
 * 创建密钥
 * 管理端创建新密钥
 */
export async function adminSecretsPost(data: StoreSecretRequest) {
  const res = await api.post(`/secret/api/v1/admin/secrets`, data);
  return res.data;
}

/**
 * 批量删除密钥
 * 批量软删除多个密钥。每个密钥独立处理，部分失败不影响其他密钥。软删除后数据保留至清理期后永久删除。
 */
export async function adminSecretsBatchDeletePost(data: BatchRevokeRequest) {
  const res = await api.post(`/secret/api/v1/admin/secrets/batch-delete`, data);
  return res.data;
}

/**
 * 批量吊销密钥
 * 批量吊销多个密钥。每个密钥独立处理，部分失败不影响其他密钥。返回成功和失败的密钥列表。
 */
export async function adminSecretsBatchRevokePost(data: BatchRevokeRequest) {
  const res = await api.post(`/secret/api/v1/admin/secrets/batch-revoke`, data);
  return res.data;
}

/**
 * 获取密钥详情
 * 管理端获取密钥详情，包含元数据（描述、创建时间、更新时间）和所有版本信息。
 */
export async function adminSecretsDetail(params?: {
  key: string;  // 密钥路径
}) {
  const res = await api.get(`/secret/api/v1/admin/secrets/detail`, { params });
  return res.data;
}

/**
 * 获取加密密钥列表
 * 获取系统当前的加密密钥信息，包括 AES 加密密钥的标识、算法和状态。
 */
export async function adminSecretsEncryptionKeys() {
  const res = await api.get(`/secret/api/v1/admin/secrets/encryption-keys`);
  return res.data;
}

/**
 * 删除密钥
 * 管理端删除单个密钥
 */
export async function adminSecretsItemByItemDelete(key: string) {
  await api.delete(`/secret/api/v1/admin/secrets/item/${key}`);
}

/**
 * 列出 JWT 密钥
 * 列出所有 JWT 密钥及相关信息，包括密钥类型（RSA/EC）、算法（RS256/ES256）、指纹、创建时间和状态等。
 */
export async function adminSecretsJwtKeys() {
  const res = await api.get(`/secret/api/v1/admin/secrets/jwt/keys`);
  return res.data;
}

/**
 * 删除密钥策略
 * 删除当前租户的密钥管理策略配置。删除后服务将使用系统默认策略。
 */
export async function adminSecretsPolicyDelete() {
  await api.delete(`/secret/api/v1/admin/secrets/policy`);
}

/**
 * 获取密钥策略
 * 获取当前租户的密钥管理策略配置，包括自动轮换周期、最小密钥长度、版本保留数等策略参数。
 */
export async function adminSecretsPolicy() {
  const res = await api.get(`/secret/api/v1/admin/secrets/policy`);
  return res.data;
}

/**
 * 更新密钥策略
 * 创建或更新当前租户的密钥管理策略配置。支持配置自动轮换周期、最小密钥长度、版本保留数等参数。
 */
export async function adminSecretsPolicyPut(data: SecretPolicyRequest) {
  const res = await api.put(`/secret/api/v1/admin/secrets/policy`, data);
  return res.data;
}

/**
 * 吊销密钥
 * 管理端吊销密钥，将状态设为 revoked。吊销后密钥值不可再获取，已有版本保留审计记录。
 */
export async function adminSecretsRevokePost(params?: {
  key: string;  // 密钥路径
}) {
  const res = await api.post(`/secret/api/v1/admin/secrets/revoke`, undefined, { params });
  return res.data;
}

/**
 * 轮换密钥
 * 管理端轮换密钥值，创建新版本。旧版本保留用于回滚和审计追溯。
 */
export async function adminSecretsRotatePost(data: RotateSecretRequest, params?: {
  key: string;  // 密钥路径
}) {
  const res = await api.post(`/secret/api/v1/admin/secrets/rotate`, data, { params });
  return res.data;
}

/**
 * 更新密钥元数据
 * 管理端更新密钥的描述和/或元数据。至少提供一个更新字段。仅更新元信息，不改变密钥值。
 */
export async function adminSecretsUpdatePost(data: UpdateSecretRequest, params?: {
  key: string;  // 密钥路径
}) {
  const res = await api.post(`/secret/api/v1/admin/secrets/update`, data, { params });
  return res.data;
}

/**
 * 列出密钥版本
 * 管理端列出密钥的所有历史版本，按版本号降序排列，包含每个版本的状态和创建时间。
 */
export async function adminSecretsVersions(params?: {
  key: string;  // 密钥路径
}) {
  const res = await api.get(`/secret/api/v1/admin/secrets/versions`, { params });
  return res.data;
}

/**
 * 获取版本密钥值
 * 管理端获取指定版本的密钥明文值。返回密钥值、版本号及状态。读取后密钥值会在内存中安全擦除。
 */
export async function adminSecretsVersionsValuePost(data: SecretVersionQuery, params?: {
  key: string;  // 密钥路径
}) {
  const res = await api.post(`/secret/api/v1/admin/secrets/versions/value`, data, { params });
  return res.data;
}

/**
 * 获取 JWT 验证公钥
 * 获取 JWT RS256 验证公钥（PEM 格式）。公开端点，无需认证，用于验证 JWT Token 签名。
 */
export async function secretPublicJwtPublicKey() {
  const res = await api.get(`/secret/api/v1/secret/public/jwt/public-key`);
  return res.data;
}

/**
 * 获取密码传输公钥
 * 获取用于密码非对称加密传输的 RSA-2048 公钥（PEM 格式）。公开端点，无需认证。前端用此公钥执行 RSA-OAEP 加密后传输密码。
 */
export async function secretPublicTransmissionPublicKey() {
  const res = await api.get(`/secret/api/v1/secret/public/transmission/public-key`);
  return res.data;
}

// ============================================================
// Session Service
// ============================================================

/**
 * 获取设备风险评分
 * 管理员基于设备关联的所有会话历史（登录次数、撤销数、活跃会话数）评估设备风险评分。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminDevicesRiskByDevices(deviceId: string) {
  const res = await api.get(`/session/api/v1/admin/devices/${deviceId}/risk`);
  return res.data;
}

/**
 * 管理员查询会话列表
 * 管理员查询当前租户下所有活跃会话，支持按用户ID和会话状态筛选，分页返回。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminSessions(params?: {
  user_id?: string;  // 用户ID（可选，用于筛选）
  status?: string;  // 会话状态（active/expired/revoked）
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/session/api/v1/admin/sessions`, { params });
  return res.data;
}

/**
 * 获取活跃会话数量
 * 管理员获取当前租户的活跃会话数量。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminSessionsActiveCount() {
  const res = await api.get(`/session/api/v1/admin/sessions/active-count`);
  return res.data;
}

/**
 * 批量撤销会话
 * 管理员批量撤销指定会话ID列表中的会话，最多100个，同步执行，返回成功/失败统计。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminSessionsBulkDelete(data: Record<string, unknown>) {
  await api.delete(`/session/api/v1/admin/sessions/bulk`, { data });
}

/**
 * 获取会话设备指纹
 * 管理员获取指定会话关联的设备指纹信息，包括浏览器、操作系统、设备型号等元数据。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminSessionsDeviceFingerprint(params?: {
  session_id?: string;  // 会话ID（可选）
}) {
  const res = await api.get(`/session/api/v1/admin/sessions/device-fingerprint`, { params });
  return res.data;
}

/**
 * 清理过期会话
 * 管理员批量清理当前租户下所有已过期的会话记录。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminSessionsExpiredDelete() {
  await api.delete(`/session/api/v1/admin/sessions/expired`);
}

/**
 * 获取会话风险评分
 * 管理员基于会话的IP地址、设备指纹、登录时间、地理位置等多维度评估会话风险评分。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminSessionsRiskScore(params?: {
  session_id?: string;  // 会话ID（可选，不填则返回当前所有会话的汇总风险评分）
}) {
  const res = await api.get(`/session/api/v1/admin/sessions/risk-score`, { params });
  return res.data;
}

/**
 * 获取会话统计
 * 管理员获取当前租户的会话和令牌统计信息，包括活跃总数、撤销数、设备类型分布等多维度数据。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminSessionsStats() {
  const res = await api.get(`/session/api/v1/admin/sessions/stats`);
  return res.data;
}

/**
 * 撤销用户所有会话
 * 管理员撤销指定用户的所有活跃会话，强制该用户所有设备登出。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminSessionsUserByUserDelete(userId: string, data: Record<string, unknown>) {
  await api.delete(`/session/api/v1/admin/sessions/user/${userId}`, { data });
}

/**
 * 查询令牌列表
 * 管理员查询当前租户下的令牌列表，支持按用户ID、令牌类型、状态筛选，分页返回。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminTokens(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  user_id?: string;  // 用户ID（可选，用于筛选）
  type?: string;  // 令牌类型（access/refresh）
  status?: string;  // 令牌状态（active/revoked/expired）
}) {
  const res = await api.get(`/session/api/v1/admin/tokens`, { params });
  return res.data;
}

/**
 * 查询黑名单令牌列表
 * 管理员查询当前租户下的黑名单令牌列表，支持按用户ID筛选，分页返回。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminTokensBlacklist(params?: {
  user_id?: string;  // 用户ID（可选，用于筛选）
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/session/api/v1/admin/tokens/blacklist`, { params });
  return res.data;
}

/**
 * 删除黑名单令牌
 * 管理员根据ID删除指定的黑名单令牌记录。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminTokensBlacklistByBlacklistDelete(deviceId: string) {
  await api.delete(`/session/api/v1/admin/tokens/blacklist/${deviceId}`);
}

/**
 * 重置租户级JWT配置
 * 管理员删除当前租户的自定义JWT配置，恢复为系统默认值。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminTokensConfigDelete() {
  await api.delete(`/session/api/v1/admin/tokens/config`);
}

/**
 * 获取租户级JWT配置
 * 管理员获取当前租户的自定义JWT令牌配置（Access Token TTL、Refresh Token TTL、时钟偏差容忍度）。
未配置时返回系统默认值。参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminTokensConfig() {
  const res = await api.get(`/session/api/v1/admin/tokens/config`);
  return res.data;
}

/**
 * 更新租户级JWT配置
 * 管理员设置当前租户的自定义JWT令牌TTL和时钟偏差容忍度，支持按租户差异化令牌有效期策略。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminTokensConfigPut(data: UpdateTenantJWTConfigRequest) {
  const res = await api.put(`/session/api/v1/admin/tokens/config`, data);
  return res.data;
}

/**
 * 令牌交换
 * OAuth 2.0 令牌交换（RFC 8693），使用已有令牌交换新的访问令牌和刷新令牌。
响应使用系统标准信封 dto_base.DataResponse[T]。参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminTokensExchangePost(data: ExchangeTokenRequest) {
  const res = await api.post(`/session/api/v1/admin/tokens/exchange`, data);
  return res.data;
}

/**
 * 令牌自省
 * OAuth 2.0 令牌自省端点（RFC 7662），检查令牌的当前状态并返回元信息。
响应使用系统标准信封 dto_base.DataResponse[T]。参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminTokensIntrospectPost(data: IntrospectTokenRequest) {
  const res = await api.post(`/session/api/v1/admin/tokens/introspect`, data);
  return res.data;
}

/**
 * 撤销所有令牌
 * 管理员撤销指定用户的所有令牌（支持按类型筛选 access/refresh），强制重新认证。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminTokensRevokeAllPost(data: RevokeAllTokensRequest) {
  const res = await api.post(`/session/api/v1/admin/tokens/revoke-all`, data);
  return res.data;
}

/**
 * 获取令牌详情
 * 管理员根据令牌ID获取令牌的详细信息，包括用户ID、类型、状态、过期时间等。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function adminTokensByTokens(deviceId: string) {
  const res = await api.get(`/session/api/v1/admin/tokens/${deviceId}`);
  return res.data;
}

/**
 * Admin list trusted devices
 * Admin: list trusted devices for a given user.
 */
export async function adminTrustedDevices(params?: {
  user_id: string;  // User ID
  page?: number;  // Page
  page_size?: number;  // Page size
}) {
  const res = await api.get(`/session/api/v1/admin/trusted-devices`, { params });
  return res.data;
}

/**
 * Admin revoke trusted device
 * Admin: revoke a trusted device by ID.
 */
export async function adminTrustedDevicesByTrustedDevicesDelete(deviceId: string) {
  await api.delete(`/session/api/v1/admin/trusted-devices/${deviceId}`);
}

/**
 * 查询用户会话列表
 * 查询指定用户的活跃会话列表，支持租户隔离和分页。
非管理员只能查询自己的会话。参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function sessions(params?: {
  auth_user_id: string;  // 认证用户ID
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/session/api/v1/sessions`, { params });
  return res.data;
}

/**
 * 创建会话
 * 为用户创建新的会话，记录设备信息、IP地址、User-Agent等上下文，
返回访问令牌（Access Token）和刷新令牌（Refresh Token）。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function sessionsPost(data: CreateSessionRequest) {
  const res = await api.post(`/session/api/v1/sessions`, data);
  return res.data;
}

/**
 * 刷新令牌
 * 使用刷新令牌（Refresh Token）获取新的访问令牌（Access Token）和轮换后的刷新令牌。
支持刷新频率限制，防止令牌滥用。参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function sessionsRefreshPost(data: RefreshTokensRequest) {
  const res = await api.post(`/session/api/v1/sessions/refresh`, data);
  return res.data;
}

/**
 * 旋转访问令牌
 * 使用刷新令牌（Refresh Token）仅获取新的访问令牌（Access Token），
不轮换刷新令牌（Refresh Token）。参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function sessionsRotateAccessPost(data: RefreshTokensRequest) {
  const res = await api.post(`/session/api/v1/sessions/rotate-access`, data);
  return res.data;
}

/**
 * 查询用户会话列表
 * 查询当前认证用户自己的所有活跃会话列表，JWT用户身份必须与路径参数 user_id 匹配。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function sessionsUserSessionsByUser(userId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/session/api/v1/sessions/user/${userId}/sessions`, { params });
  return res.data;
}

/**
 * 撤销会话
 * 根据会话ID撤销指定会话，使该会话立即失效，可选附带撤销原因。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function sessionsBySessionsDelete(sessionId: string, data: Record<string, unknown>) {
  await api.delete(`/session/api/v1/sessions/${sessionId}`, { data });
}

/**
 * 获取会话详情
 * 根据会话ID获取会话的详细信息，包括用户信息、设备信息、登录时间、MFA验证状态等。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function sessionsBySessions(sessionId: string) {
  const res = await api.get(`/session/api/v1/sessions/${sessionId}`);
  return res.data;
}

/**
 * 更新会话活动时间
 * 更新指定会话的最后活动时间，用于会话保活和空闲超时检测。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function sessionsActivityBySessionsPost(sessionId: string) {
  const res = await api.post(`/session/api/v1/sessions/${sessionId}/activity`);
  return res.data;
}

/**
 * 升级会话MFA验证状态
 * 在完成多因素认证（MFA）步进认证后，将指定会话标记为MFA已验证状态。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function sessionsUpgradeMfaBySessionsPost(sessionId: string) {
  const res = await api.post(`/session/api/v1/sessions/${sessionId}/upgrade-mfa`);
  return res.data;
}

/**
 * 验证会话有效性
 * 验证指定会话和访问令牌的有效性，返回令牌中的用户声明信息。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function sessionsValidateBySessionsPost(sessionId: string) {
  const res = await api.post(`/session/api/v1/sessions/${sessionId}/validate`);
  return res.data;
}

/**
 * 将令牌加入黑名单
 * 将指定的访问令牌或刷新令牌加入黑名单，使其立即失效。
常用场景：用户登出、密码修改、账号异常冻结。参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function tokensBlacklistPost(data: AddToBlacklistRequest) {
  const res = await api.post(`/session/api/v1/tokens/blacklist`, data);
  return res.data;
}

/**
 * 检查令牌黑名单状态
 * 查询指定令牌是否已被加入黑名单，通过黑名单仓库进行真实查询。
参考：RFC 7519 (JWT)、NIST SP 800-63B §4 (Session Management)。
 */
export async function tokensBlacklistCheck(params?: {
  token: string;  // 待检查的令牌
}) {
  const res = await api.get(`/session/api/v1/tokens/blacklist/check`, { params });
  return res.data;
}

/**
 * List my trusted devices
 * Lists trusted devices for the current user.
 */
export async function trustedDevices() {
  const res = await api.get(`/session/api/v1/trusted-devices`);
  return res.data;
}

/**
 * Trust device
 * Marks device as trusted for current user. Trust expires after DefaultTrustedDeviceTTLDays (30 days).
 */
export async function trustedDevicesPost(data: TrustDeviceRequest) {
  const res = await api.post(`/session/api/v1/trusted-devices`, data);
  return res.data;
}

/**
 * Revoke my trusted device
 * Revokes a trusted device by ID. Device must belong to the authenticated user.
 */
export async function trustedDevicesByTrustedDevicesDelete(deviceId: string) {
  await api.delete(`/session/api/v1/trusted-devices/${deviceId}`);
}

// ============================================================
// Status Service
// ============================================================

/**
 * SVG服务状态徽章
 * 返回指定服务的SVG状态徽章，可用于README、仪表盘等场景嵌入展示
 */
export async function statusBadgeByBadge(service: string) {
  const res = await api.get(`/status/api/v1/status/badge/${service}`);
  return res.data;
}

/**
 * 查询事件列表
 * 查询系统事件/事故列表，支持按严重级别、状态、影响服务过滤
 */
export async function statusIncidents(params?: {
  severity?: string;  // 严重级别: critical/major/minor/maintenance
  status?: string;  // 事件状态: investigating/identified/monitoring/resolved
  service?: string;  // 影响的服务ID
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/status/api/v1/status/incidents`, { params });
  return res.data;
}

/**
 * 创建事件
 * 创建新的系统事件（管理接口，需要管理员权限）
 */
export async function statusIncidentsPost(data: CreateIncidentRequest) {
  const res = await api.post(`/status/api/v1/status/incidents`, data);
  return res.data;
}

/**
 * 删除事件
 * 删除指定事件（管理接口，需要管理员权限）
 */
export async function statusIncidentsByIncidentsDelete(incidentId: string) {
  await api.delete(`/status/api/v1/status/incidents/${incidentId}`);
}

/**
 * 查询事件详情
 * 根据事件ID查询单个事件的完整详情（含进展更新）
 */
export async function statusIncidentsByIncidents(incidentId: string) {
  const res = await api.get(`/status/api/v1/status/incidents/${incidentId}`);
  return res.data;
}

/**
 * 更新事件
 * 更新事件信息（管理接口，需要管理员权限）
 */
export async function statusIncidentsByIncidentsPut(incidentId: string, data: UpdateIncidentRequest) {
  const res = await api.put(`/status/api/v1/status/incidents/${incidentId}`, data);
  return res.data;
}

/**
 * 添加事件进展更新
 * 为指定事件添加进展更新记录（管理接口，需要管理员权限）
 */
export async function statusIncidentsUpdatesByIncidentsPost(incidentId: string, data: AddIncidentUpdateRequest) {
  const res = await api.post(`/status/api/v1/status/incidents/${incidentId}/updates`, data);
  return res.data;
}

/**
 * 机器可读系统状态
 * 返回所有注册服务的健康状态JSON（基于服务注册表），供外部监控和服务发现使用
 */
export async function statusJson() {
  const res = await api.get(`/status/api/v1/status/json`);
  return res.data;
}

/**
 * 查询计划维护列表
 * 查询计划维护日历列表，支持按状态过滤
 */
export async function statusMaintenances(params?: {
  status?: string;  // 维护状态: scheduled/in_progress/completed/cancelled
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/status/api/v1/status/maintenances`, { params });
  return res.data;
}

/**
 * 创建维护预告
 * 创建新的计划维护预告（管理接口，需要管理员权限）
 */
export async function statusMaintenancesPost(data: CreateMaintenanceRequest) {
  const res = await api.post(`/status/api/v1/status/maintenances`, data);
  return res.data;
}

/**
 * 删除维护预告
 * 删除指定的计划维护预告（管理接口，需要管理员权限）
 */
export async function statusMaintenancesByMaintenancesDelete(id: string) {
  await api.delete(`/status/api/v1/status/maintenances/${id}`);
}

/**
 * 查询维护详情
 * 根据维护ID查询单个计划维护的完整信息
 */
export async function statusMaintenancesByMaintenances(id: string) {
  const res = await api.get(`/status/api/v1/status/maintenances/${id}`);
  return res.data;
}

/**
 * 更新维护预告
 * 更新维护预告信息或状态（管理接口，需要管理员权限）
 */
export async function statusMaintenancesByMaintenancesPut(id: string, data: UpdateMaintenanceRequest) {
  const res = await api.put(`/status/api/v1/status/maintenances/${id}`, data);
  return res.data;
}

/**
 * 查询服务延迟趋势
 * 查询指定服务的历史延迟趋势（P95延迟，数据来源 Prometheus）
 */
export async function statusMetricsLatency(params?: {
  service: string;  // 服务ID
  range?: string;  // 时间范围: 1h/24h/7d/30d
}) {
  const res = await api.get(`/status/api/v1/status/metrics/latency`, { params });
  return res.data;
}

/**
 * 查询服务可用率趋势
 * 查询指定服务的历史可用率趋势（来自 Prometheus up 指标）
 */
export async function statusMetricsUptime(params?: {
  service: string;  // 服务ID
  range?: string;  // 时间范围: 1h/24h/7d/30d
}) {
  const res = await api.get(`/status/api/v1/status/metrics/uptime`, { params });
  return res.data;
}

/**
 * 系统状态概览
 * 获取系统整体状态概览，包含服务健康数、活跃事件数等汇总信息
 */
export async function statusOverview() {
  const res = await api.get(`/status/api/v1/status/overview`);
  return res.data;
}

/**
 * RSS事件与维护订阅源
 * 生成最近事件和即将到来的维护预告的 RSS 2.0 订阅源，供 RSS 阅读器订阅
 */
export async function statusRss() {
  const res = await api.get(`/status/api/v1/status/rss`);
  return res.data;
}

/**
 * 获取服务目录
 * 返回所有已注册服务及其元数据信息，按业务分组展示
 */
export async function statusServices() {
  const res = await api.get(`/status/api/v1/status/services`);
  return res.data;
}

/**
 * 取消订阅
 * 通过取消订阅令牌退订状态通知
 */
export async function statusSubscriptionsDelete(data: UnsubscribeRequest) {
  await api.delete(`/status/api/v1/status/subscriptions`, { data });
}

/**
 * 查询订阅者列表
 * 查询所有订阅者信息（管理接口，需要管理员权限）
 */
export async function statusSubscriptions(params?: {
  verified?: boolean;  // 是否已验证
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}) {
  const res = await api.get(`/status/api/v1/status/subscriptions`, { params });
  return res.data;
}

/**
 * 订阅状态通知
 * 通过邮箱订阅系统状态变更通知，提交后需验证邮箱完成激活
 */
export async function statusSubscriptionsPost(data: SubscribeRequest) {
  const res = await api.post(`/status/api/v1/status/subscriptions`, data);
  return res.data;
}

/**
 * 查询订阅通知偏好
 * 根据邮箱查询订阅者的通知偏好设置
 */
export async function statusSubscriptionsPreferences(params?: {
  email: string;  // 订阅邮箱地址
}) {
  const res = await api.get(`/status/api/v1/status/subscriptions/preferences`, { params });
  return res.data;
}

/**
 * 更新订阅通知偏好
 * 更新订阅者的通知偏好设置（通知类型、摘要频率、关注分类等）
 */
export async function statusSubscriptionsPreferencesPut(data: SubscriptionPreferencesRequest) {
  const res = await api.put(`/status/api/v1/status/subscriptions/preferences`, data);
  return res.data;
}

/**
 * 验证订阅邮箱
 * 通过邮件中的验证令牌激活订阅
 */
export async function statusSubscriptionsVerifyPost(params?: {
  token: string;  // 邮件中的验证令牌
}) {
  const res = await api.post(`/status/api/v1/status/subscriptions/verify`, undefined, { params });
  return res.data;
}

// ============================================================
// Storage Service
// ============================================================

/**
 * 管理员获取存储桶列表
 * 获取当前租户的所有存储桶列表，支持分页查询。参考：GDPR Art 32 (Security of Processing)。
 */
export async function adminStorageBuckets(params?: {
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/storage/api/v1/admin/storage/buckets`, { params });
  return res.data;
}

/**
 * 管理员创建存储桶
 * 为当前租户创建新的存储桶（逻辑记录 + MinIO物理桶），支持设置可见性（private/public/temp）和描述。默认桶不可删除。参考：GDPR Art 32 (Security of Processing)。
 */
export async function adminStorageBucketsPost(data: CreateBucketRequest) {
  const res = await api.post(`/storage/api/v1/admin/storage/buckets`, data);
  return res.data;
}

/**
 * 管理员删除存储桶
 * 删除指定存储桶及MinIO中对应的物理桶。默认桶（default bucket）不可删除。参考：GDPR Art 32 (Security of Processing)。
 */
export async function adminStorageBucketsByBucketsDelete(name: string) {
  await api.delete(`/storage/api/v1/admin/storage/buckets/${name}`);
}

/**
 * 管理员获取存储桶详情
 * 根据存储桶名称获取指定存储桶的详细信息，包括可见性、默认标记和描述。参考：GDPR Art 32 (Security of Processing)。
 */
export async function adminStorageBucketsByBuckets(name: string) {
  const res = await api.get(`/storage/api/v1/admin/storage/buckets/${name}`);
  return res.data;
}

/**
 * 管理员更新存储桶
 * 更新指定存储桶的可见性、描述或默认标记。默认桶不可取消默认。参考：GDPR Art 32 (Security of Processing)。
 */
export async function adminStorageBucketsByBucketsPut(name: string, data: UpdateBucketRequest) {
  const res = await api.put(`/storage/api/v1/admin/storage/buckets/${name}`, data);
  return res.data;
}

/**
 * 管理员清理过期pending上传
 * 清理超过指定时间的pending状态上传文件记录及其MinIO对象。仅处理metadata.status=pending的文件，硬删除记录并移除存储对象。参考：GDPR Art 32 (Security of Processing)。
 */
export async function adminStorageCleanStaleUploadsPost(params?: {
  older_than_hours?: number;  // 过期小时数（默认24小时，最小1小时）
}) {
  const res = await api.post(`/storage/api/v1/admin/storage/clean-stale-uploads`, undefined, { params });
  return res.data;
}

/**
 * 管理员获取数据保留策略
 * 查询当前租户的数据保留策略配置，包括保留天数、自动删除和删除前归档开关。参考：GDPR Art 32 (Security of Processing)。
 */
export async function adminStorageDataRetentionPolicy() {
  const res = await api.get(`/storage/api/v1/admin/storage/data-retention-policy`);
  return res.data;
}

/**
 * 管理员配置数据保留策略
 * 配置当前租户的数据保留策略（保留天数、自动删除开关、删除前归档开关）。首次调用创建策略，后续调用更新。查询最旧文件以评估策略影响范围。参考：GDPR Art 32 (Security of Processing)。
 */
export async function adminStorageDataRetentionPolicyPost(data: DataRetentionPolicyRequest) {
  const res = await api.post(`/storage/api/v1/admin/storage/data-retention-policy`, data);
  return res.data;
}

/**
 * 管理员查询存储加密状态
 * 基于MinIO实际SSL/TLS配置返回存储服务的传输加密状态（UseSSL），供管理员进行合规审计与安全评估。参考：GDPR Art 32 (Security of Processing)。
 */
export async function adminStorageEncryptionStatus() {
  const res = await api.get(`/storage/api/v1/admin/storage/encryption-status`);
  return res.data;
}

/**
 * 管理员获取存储配额
 * 获取当前租户的存储配额及已使用情况（已用字节数、可用字节数、使用百分比）。参考：GDPR Art 32 (Security of Processing)。
 */
export async function adminStorageQuota() {
  const res = await api.get(`/storage/api/v1/admin/storage/quota`);
  return res.data;
}

/**
 * 管理员更新存储配额
 * 更新当前租户的存储配额上限（字节数）。记录审计日志（变更前后配额），发布QuotaUpdatedEvent。参考：GDPR Art 32 (Security of Processing)。
 */
export async function adminStorageQuotaPut(data: UpdateStorageQuotaRequest) {
  const res = await api.put(`/storage/api/v1/admin/storage/quota`, data);
  return res.data;
}

/**
 * 管理员存储统计
 * 获取当前租户的存储使用统计，包括文件数量、总大小、按MIME类型分布等管理数据。参考：GDPR Art 32 (Security of Processing)。
 */
export async function adminStorageStats() {
  const res = await api.get(`/storage/api/v1/admin/storage/stats`);
  return res.data;
}

/**
 * 获取文件列表
 * 获取当前用户在指定文件夹下的文件列表，支持分页和文件名关键词搜索，结果按创建时间倒序排列。参考：GDPR Art 32 (Security of Processing)。
 */
export async function files(params?: {
  parent_id?: string;  // 父文件夹ID，不填则查询根目录文件
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20，最大100）
  keyword?: string;  // 文件名关键词搜索
}) {
  const res = await api.get(`/storage/api/v1/files`, { params });
  return res.data;
}

/**
 * 上传文件
 * 上传文件到对象存储服务，支持图片、视频、文档等多种文件类型。自动计算SHA-256哈希校验值，记录文件元数据并触发审计日志。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesPost() {
  const res = await api.post(`/storage/api/v1/files`);
  return res.data;
}

/**
 * 批量下载（ZIP打包）
 * 批量下载多个文件，将所有文件打包为ZIP压缩包流式返回。跳过下载失败的文件继续处理其余。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesBatchDownloadPost(data: BatchDownloadRequest) {
  const res = await api.post(`/storage/api/v1/files/batch-download`, data);
  return res.data;
}

/**
 * 批量删除（旧版兼容）
 * 批量删除文件或文件夹的旧版兼容端点，内部转发到同功能的 /storage/batch-delete 处理逻辑。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesBulkDeletionsPost(data: BatchDeleteRequest) {
  const res = await api.post(`/storage/api/v1/files/bulk-deletions`, data);
  return res.data;
}

/**
 * 批量上传准备
 * 批量准备上传任务，为每个文件生成预签名上传URL（最多50个文件）。自动检查文件类型白名单和租户存储配额，批量创建文件记录。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesBulkUploadsPost(data: BulkUploadPrepareRequest) {
  const res = await api.post(`/storage/api/v1/files/bulk-uploads`, data);
  return res.data;
}

/**
 * 初始化分片上传
 * 初始化大文件分片上传任务，为每个分片生成预签名PUT上传URL。自动检查文件类型白名单和租户存储配额（配额不足时拒绝）。创建multipart_pending状态的文件记录。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesMultipartInitPost(data: InitMultipartUploadRequest) {
  const res = await api.post(`/storage/api/v1/files/multipart/init`, data);
  return res.data;
}

/**
 * 中止分片上传
 * 中止分片上传任务，清理MinIO中所有已上传的分片临时对象，硬删除文件记录。仅文件所有者可操作。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesMultipartByMultipartDelete(fileId: string) {
  await api.delete(`/storage/api/v1/files/multipart/${fileId}`);
}

/**
 * 完成分片上传
 * 验证所有分片已成功上传至MinIO，使用ComposeObjects合并分片为目标文件，清理临时分片对象。仅文件所有者可操作。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesMultipartCompleteByMultipartPost(fileId: string) {
  const res = await api.post(`/storage/api/v1/files/multipart/${fileId}/complete`);
  return res.data;
}

/**
 * 通过分享链接下载
 * 使用分享Token直接下载文件，无需认证。自动验证分享有效性（未过期、未达访问上限），支持 HTTP Range 请求。记录访问次数。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesSharedByShared(token: string) {
  const res = await api.get(`/storage/api/v1/files/shared/${token}`);
  return res.data;
}

/**
 * 获取上传预签名URL
 * 为指定文件生成一个预签名PUT上传URL（最大300秒过期），客户端可直接上传文件到对象存储。创建pending状态的文件记录。SF3安全收紧。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesUploadUrlPost(data: CreateUploadURLRequest) {
  const res = await api.post(`/storage/api/v1/files/upload-url`, data);
  return res.data;
}

/**
 * 删除文件
 * 根据文件ID软删除文件及其存储对象，记录审计日志（含文件快照beforeSnapshot）。被删除文件进入回收站，可在保留期内恢复。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesByFilesDelete(fileId: string) {
  await api.delete(`/storage/api/v1/files/${fileId}`);
}

/**
 * 更新文件
 * 更新文件名称或自定义元数据（metadata JSON合并）。验证文件存在且非文件夹，发布FileUpdatedEvent事件。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesByFilesPatch(fileId: string, data: UpdateFileNameRequest) {
  const res = await api.patch(`/storage/api/v1/files/${fileId}`, data);
  return res.data;
}

/**
 * 复制文件
 * 复制文件到指定目标文件夹，在MinIO中执行服务端复制（CopyObject）避免数据搬运，支持自定义新文件名。复制失败时自动回滚。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesCopyByFilesPost(fileId: string, data: CopyFileTargetRequest) {
  const res = await api.post(`/storage/api/v1/files/${fileId}/copy`, data);
  return res.data;
}

/**
 * 下载文件
 * 根据文件ID下载文件，通过租户隔离进行私有文件访问控制，记录下载指标。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesDownloadByFiles(fileId: string) {
  const res = await api.get(`/storage/api/v1/files/${fileId}/download`);
  return res.data;
}

/**
 * 获取文件元数据
 * 获取文件的详细元数据信息，包括MinIO对象存储中的实际信息（最后修改时间、ETag校验值、大小等），用于校验数据库与存储一致性。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesMetadataByFiles(fileId: string) {
  const res = await api.get(`/storage/api/v1/files/${fileId}/metadata`);
  return res.data;
}

/**
 * 移动文件
 * 将文件移动到指定目标文件夹，在MinIO中先复制后删除以实现对象迁移。自动检测循环引用（禁止将文件夹移入自身或子文件夹）。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesMoveByFilesPost(fileId: string, data: MoveFileRequest) {
  const res = await api.post(`/storage/api/v1/files/${fileId}/move`, data);
  return res.data;
}

/**
 * 生成预签名URL
 * 为文件生成临时访问URL，默认5分钟有效期（最大15分钟），可在有效期内无需认证直接访问/下载文件。SF3安全收紧。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesPresignedUrlByFiles(fileId: string, params?: {
  expires?: number;  // 过期秒数（默认300秒，最大900秒）
}) {
  const res = await api.get(`/storage/api/v1/files/${fileId}/presigned-url`, { params });
  return res.data;
}

/**
 * 文件预览
 * 获取文件预览：图片文件返回缩略图（Lanczos重采样），PDF文件返回预签名下载URL，其他文件返回download_only状态及预签名URL。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesPreviewByFiles(fileId: string, params?: {
  width?: number;  // 缩略图宽度（默认200，最大1200）
  height?: number;  // 缩略图高度（默认200，最大1200）
}) {
  const res = await api.get(`/storage/api/v1/files/${fileId}/preview`, { params });
  return res.data;
}

/**
 * 取消分享链接
 * 根据文件ID和分享Token取消文件分享链接，仅分享创建者可操作。记录审计日志。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesShareByFilesDelete(fileId: string, params?: {
  token: string;  // 分享Token
}) {
  await api.delete(`/storage/api/v1/files/${fileId}/share`, { params });
}

/**
 * 查看分享详情
 * 根据文件ID查看该文件的分享详情，包括Token、过期时间、访问统计等。仅分享创建者可查看。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesShareByFiles(fileId: string) {
  const res = await api.get(`/storage/api/v1/files/${fileId}/share`);
  return res.data;
}

/**
 * 创建分享链接
 * 为文件创建临时分享链接，支持设置过期时间和最大访问次数限制。分享者即当前认证用户。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesShareByFilesPost(fileId: string, data: CreateShareRequest) {
  const res = await api.post(`/storage/api/v1/files/${fileId}/share`, data);
  return res.data;
}

/**
 * 生成缩略图
 * 为图片文件生成指定尺寸的缩略图，支持自定义宽高、JPEG质量和输出格式（jpeg/png），使用Lanczos重采样算法保证缩略图质量。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesThumbnailByFiles(fileId: string, params?: {
  width?: number;  // 缩略图宽度（默认200，单位像素）
  height?: number;  // 缩略图高度（默认200，单位像素）
  quality?: number;  // JPEG质量（默认80，范围1-100）
  format?: string;  // 输出格式：jpeg / png（默认jpeg）
}) {
  const res = await api.get(`/storage/api/v1/files/${fileId}/thumbnail`, { params });
  return res.data;
}

/**
 * 上传完成确认
 * 确认预签名上传的文件已完成真实上传，从MinIO获取实际文件大小和ContentType，更新文件状态从pending到completed。仅文件所有者可确认。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesUploadCompleteByFilesPost(fileId: string) {
  const res = await api.post(`/storage/api/v1/files/${fileId}/upload-complete`);
  return res.data;
}

/**
 * 获取文件版本列表
 * 列出MinIO中指定文件的所有历史版本（含版本ID、大小、ETag、是否当前版本、创建时间），支持客户端分页。需MinIO开启版本控制。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesVersionsByFiles(fileId: string) {
  const res = await api.get(`/storage/api/v1/files/${fileId}/versions`);
  return res.data;
}

/**
 * 恢复文件版本
 * 将文件恢复到指定的历史版本，使用MinIO CopyObjectVersion将历史版本复制为当前版本。同步更新文件大小。记录审计日志，发布VersionRestoredEvent。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesVersionsRestoreByFilesByVersionsPost(fileId: string, versionId: string) {
  const res = await api.post(`/storage/api/v1/files/${fileId}/versions/${versionId}/restore`);
  return res.data;
}

/**
 * 更新文件可见性
 * 切换文件的公开状态（private ↔ public），在MinIO私有桶和公开桶之间迁移对象。记录审计日志。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesVisibilityByFilesPatch(fileId: string, data: UpdateFileVisibilityRequest) {
  const res = await api.patch(`/storage/api/v1/files/${fileId}/visibility`, data);
  return res.data;
}

/**
 * 添加水印
 * 为图片文件添加文字水印，生成带水印的新文件。支持自定义水印文字内容、位置（左上/右上/居中/左下/右下）、透明度和字体大小。参考：GDPR Art 32 (Security of Processing)。
 */
export async function filesWatermarkByFilesPost(fileId: string, data: WatermarkRequest) {
  const res = await api.post(`/storage/api/v1/files/${fileId}/watermark`, data);
  return res.data;
}

/**
 * 创建文件夹
 * 在指定父文件夹下创建新文件夹，支持验证父文件夹存在性。参考：GDPR Art 32 (Security of Processing)。
 */
export async function foldersPost(data: CreateFolderRequest) {
  const res = await api.post(`/storage/api/v1/folders`, data);
  return res.data;
}

/**
 * 获取文件夹内容
 * 列出指定文件夹下的所有文件和子文件夹（最多500条），按创建时间倒序。参考：GDPR Art 32 (Security of Processing)。
 */
export async function foldersContentsByFolders(folderId: string) {
  const res = await api.get(`/storage/api/v1/folders/${folderId}/contents`);
  return res.data;
}

/**
 * 列出分享
 * 列出当前用户创建的所有文件分享链接，支持分页。结果按创建时间倒序排列。参考：GDPR Art 32 (Security of Processing)。
 */
export async function shares(params?: {
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/storage/api/v1/shares`, { params });
  return res.data;
}

/**
 * 批量删除文件/文件夹
 * 批量删除指定ID的文件或文件夹。非空文件夹拒绝删除，需要先清空子项。删除前记录快照用于审计追溯。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storageBatchDeletePost(data: BatchDeleteRequest) {
  const res = await api.post(`/storage/api/v1/storage/batch-delete`, data);
  return res.data;
}

/**
 * 批量移动文件/文件夹
 * 将多个文件或文件夹移动到指定目标文件夹。自动检测循环引用（禁止将文件夹移入自身或子文件夹），发布BatchMovedEvent。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storageBatchMovePost(data: Record<string, unknown>) {
  const res = await api.post(`/storage/api/v1/storage/batch-move`, data);
  return res.data;
}

/**
 * Storage API 创建文件夹
 * Storage API版本：创建新文件夹，支持验证父文件夹存在性，发布FolderCreatedEvent领域事件。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storageFoldersPost(data: CreateFolderRequest) {
  const res = await api.post(`/storage/api/v1/storage/folders`, data);
  return res.data;
}

/**
 * 删除文件夹
 * Storage API版本：删除空文件夹，非空文件夹拒绝删除（需先清空子项）。软删除后记录审计日志，发布FolderDeletedEvent。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storageFoldersByFoldersDelete(folderId: string) {
  await api.delete(`/storage/api/v1/storage/folders/${folderId}`);
}

/**
 * 获取文件夹内容
 * Storage API版本：获取文件夹详情及内容列表（最多500条），包含文件夹元数据和子项列表。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storageFoldersByFolders(folderId: string) {
  const res = await api.get(`/storage/api/v1/storage/folders/${folderId}`);
  return res.data;
}

/**
 * 更新文件夹
 * 重命名文件夹。记录审计日志，发布FolderUpdatedEvent。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storageFoldersByFoldersPatch(folderId: string, data: UpdateFolderNameRequest) {
  const res = await api.patch(`/storage/api/v1/storage/folders/${folderId}`, data);
  return res.data;
}

/**
 * 公开：获取存储加密状态
 * Trust Center：获取存储加密状态公开信息（无需认证，无需租户ID），供外部合规审计和信任中心展示。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storagePublicEncryptionStatus() {
  const res = await api.get(`/storage/api/v1/storage/public/encryption-status`);
  return res.data;
}

/**
 * 公开：获取合规报告列表
 * Trust Center：获取公开可下载的合规报告列表（无需认证），支持分页。仅返回公开文件。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storagePublicReports(params?: {
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/storage/api/v1/storage/public/reports`, { params });
  return res.data;
}

/**
 * 公开：下载合规报告
 * Trust Center：下载公开合规报告文件（无需认证）。设置1小时HTTP公共缓存。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storagePublicReportsDownloadByReports(fileId: string) {
  const res = await api.get(`/storage/api/v1/storage/public/reports/${fileId}/download`);
  return res.data;
}

/**
 * 获取存储配额
 * 获取当前租户的存储使用量和配额信息（已用字节数、可用字节数、使用百分比），供普通用户查看。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storageQuota() {
  const res = await api.get(`/storage/api/v1/storage/quota`);
  return res.data;
}

/**
 * 清空回收站
 * 硬删除回收站中当前租户的所有文件和文件夹。记录审计日志。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storageTrashDelete() {
  await api.delete(`/storage/api/v1/storage/trash`);
}

/**
 * 获取回收站列表
 * 列出当前用户已软删除（进入回收站）的文件和文件夹，支持分页查询。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storageTrash(params?: {
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}) {
  const res = await api.get(`/storage/api/v1/storage/trash`, { params });
  return res.data;
}

/**
 * 从回收站永久删除
 * 从回收站中硬删除文件/文件夹（从数据库和MinIO中彻底移除）。支持重试删除存储对象（最多3次）。验证文件确实在回收站中。发布FilePermanentlyDeletedEvent。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storageTrashByTrashDelete(trashId: string) {
  await api.delete(`/storage/api/v1/storage/trash/${trashId}`);
}

/**
 * 从回收站恢复文件
 * 恢复已软删除的文件或文件夹到正常状态（清除deleted_at字段）。验证文件确实在回收站中。记录审计日志，发布FileRestoredEvent。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storageTrashRestoreByTrashPost(trashId: string) {
  const res = await api.post(`/storage/api/v1/storage/trash/${trashId}/restore`);
  return res.data;
}

/**
 * 存储使用趋势
 * 获取指定时间范围内的存储使用趋势数据（按日/周），优先使用快照表数据，无快照时回退到当前总量。参考：GDPR Art 32 (Security of Processing)。
 */
export async function storageTrends(params?: {
  period?: string;  // 趋势周期：day(按日，默认)/week(按周)
}) {
  const res = await api.get(`/storage/api/v1/storage/trends`, { params });
  return res.data;
}

// ============================================================
// Tenant Service
// ============================================================

/**
 * 查询租户列表
 * 查询租户列表，支持分页和筛选
 */
export async function adminTenants(params?: {
  status?: string;  // 状态筛选
  plan?: string;  // 计划筛选
  search?: string;  // 关键词搜索
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/tenant/api/v1/admin/tenants`, { params });
  return res.data;
}

/**
 * 创建租户
 * 创建新租户
 */
export async function adminTenantsPost(data: CreateTenantRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants`, data);
  return res.data;
}

/**
 * 获取全部租户统计
 * 返回所有租户的状态分布和按计划分组的数量统计
 */
export async function adminTenantsStats() {
  const res = await api.get(`/tenant/api/v1/admin/tenants/stats`);
  return res.data;
}

/**
 * 删除租户
 * 根据租户ID删除租户及其所有关联数据，此操作不可逆
 */
export async function adminTenantsByTenantsDelete(tenantId: string) {
  await api.delete(`/tenant/api/v1/admin/tenants/${tenantId}`);
}

/**
 * 获取租户详情
 * 根据租户ID获取租户的详细信息，包括基本信息、配置和状态
 */
export async function adminTenantsByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}`);
  return res.data;
}

/**
 * 更新租户信息
 * 根据租户ID更新租户的基本信息、配置参数
 */
export async function adminTenantsByTenantsPut(tenantId: string, data: UpdateTenantRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}`, data);
  return res.data;
}

/**
 * 激活租户
 * 将指定租户的状态设为激活，恢复服务访问
 */
export async function adminTenantsActivateByTenantsPost(tenantId: string) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/activate`);
  return res.data;
}

/**
 * 列出租户 API Keys
 * 获取指定租户的所有 API Key 列表（仅显示前缀，不含完整 key）
 */
export async function adminTenantsApiKeysByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/api-keys`);
  return res.data;
}

/**
 * 创建租户 API Key
 * 为指定租户创建 API Key，返回完整 key（仅显示一次），用于外部系统集成。参考：NIST SP 800-53 AC-2 (Account Management)
 */
export async function adminTenantsApiKeysByTenantsPost(tenantId: string, data: CreateApiKeyRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/api-keys`, data);
  return res.data;
}

/**
 * 吊销租户 API Key
 * 吊销指定 API Key，使其立即失效
 */
export async function adminTenantsApiKeysByTenantsByApiKeysDelete(tenantId: string, keyId: string) {
  await api.delete(`/tenant/api/v1/admin/tenants/${tenantId}/api-keys/${keyId}`);
}

/**
 * 轮换租户 API Key
 * 轮换指定 API Key，生成新 key 并使旧 key 立即失效
 */
export async function adminTenantsApiKeysRotateByTenantsByApiKeysPost(tenantId: string, keyId: string) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/api-keys/${keyId}/rotate`);
  return res.data;
}

/**
 * 列出应用类型
 * 列出租户的自定义应用类型
 */
export async function adminTenantsAppTypesByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/app-types`);
  return res.data;
}

/**
 * 创建自定义应用类型
 * 为租户创建自定义应用类型
 */
export async function adminTenantsAppTypesByTenantsPost(tenantId: string, data: CreateAppTypeRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/app-types`, data);
  return res.data;
}

/**
 * 删除应用类型
 * 删除自定义应用类型
 */
export async function adminTenantsAppTypesByTenantsByAppTypesDelete(tenantId: string, typeId: string) {
  await api.delete(`/tenant/api/v1/admin/tenants/${tenantId}/app-types/${typeId}`);
}

/**
 * 更新应用类型
 * 更新自定义应用类型的名称和描述
 */
export async function adminTenantsAppTypesByTenantsByAppTypesPut(tenantId: string, typeId: string, data: UpdateAppTypeRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}/app-types/${typeId}`, data);
  return res.data;
}

/**
 * 列出应用
 * 查询指定租户下的应用列表，支持分页和筛选
 */
export async function adminTenantsApplicationsByTenants(tenantId: string, params?: {
  type?: string;  // 应用类型
  status?: string;  // 状态
  search?: string;  // 搜索关键词
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/applications`, { params });
  return res.data;
}

/**
 * 创建应用
 * 在指定租户下创建新应用
 */
export async function adminTenantsApplicationsByTenantsPost(tenantId: string, data: CreateApplicationRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/applications`, data);
  return res.data;
}

/**
 * 删除应用
 * 删除指定应用（支持软删除和永久删除）
 */
export async function adminTenantsApplicationsByTenantsByApplicationsDelete(tenantId: string, appId: string, params?: {
  permanent?: boolean;  // 是否永久删除
}) {
  await api.delete(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}`, { params });
}

/**
 * 获取应用详情
 * 获取指定应用信息
 */
export async function adminTenantsApplicationsByTenantsByApplications(tenantId: string, appId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}`);
  return res.data;
}

/**
 * 更新应用
 * 更新应用属性（部分更新）
 */
export async function adminTenantsApplicationsByTenantsByApplicationsPut(tenantId: string, appId: string, data: UpdateApplicationRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}`, data);
  return res.data;
}

/**
 * 激活应用
 * 将暂停或未激活的应用设置为活跃状态
 */
export async function adminTenantsApplicationsActivateByTenantsByApplicationsPost(tenantId: string, appId: string) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/activate`);
  return res.data;
}

/**
 * 列出应用成员
 * 查询应用中的所有用户及其角色
 */
export async function adminTenantsApplicationsMembersByTenantsByApplications(tenantId: string, appId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/members`, { params });
  return res.data;
}

/**
 * 分配用户应用角色
 * 为用户在指定应用中分配角色和权限
 */
export async function adminTenantsApplicationsMembersByTenantsByApplicationsPost(tenantId: string, appId: string, data: AssignUserAppRoleRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/members`, data);
  return res.data;
}

/**
 * 撤销用户应用角色
 * 移除用户在应用中的角色分配
 */
export async function adminTenantsApplicationsMembersByTenantsByApplicationsByMembersDelete(tenantId: string, appId: string, roleId: string) {
  await api.delete(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/members/${roleId}`);
}

/**
 * 更新用户应用角色
 * 更新用户在应用中的角色或权限
 */
export async function adminTenantsApplicationsMembersByTenantsByApplicationsByMembersPut(tenantId: string, appId: string, roleId: string, data: UpdateUserAppRoleRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/members/${roleId}`, data);
  return res.data;
}

/**
 * 列出应用默认角色
 * 查询应用的所有默认角色模板
 */
export async function adminTenantsApplicationsRolesByTenantsByApplications(tenantId: string, appId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/roles`);
  return res.data;
}

/**
 * 创建应用默认角色
 * 为应用创建默认角色模板
 */
export async function adminTenantsApplicationsRolesByTenantsByApplicationsPost(tenantId: string, appId: string, data: CreateAppDefaultRoleRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/roles`, data);
  return res.data;
}

/**
 * 删除应用默认角色
 * 删除指定的默认角色模板
 */
export async function adminTenantsApplicationsRolesByTenantsByApplicationsByRolesDelete(tenantId: string, appId: string, roleId: string) {
  await api.delete(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/roles/${roleId}`);
}

/**
 * 获取应用默认角色
 * 获取指定默认角色详情
 */
export async function adminTenantsApplicationsRolesByTenantsByApplicationsByRoles(tenantId: string, appId: string, roleId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/roles/${roleId}`);
  return res.data;
}

/**
 * 更新应用默认角色
 * 更新默认角色权限、描述等
 */
export async function adminTenantsApplicationsRolesByTenantsByApplicationsByRolesPut(tenantId: string, appId: string, roleId: string, data: UpdateAppDefaultRoleRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/roles/${roleId}`, data);
  return res.data;
}

/**
 * 暂停应用
 * 暂停指定应用
 */
export async function adminTenantsApplicationsSuspendByTenantsByApplicationsPost(tenantId: string, appId: string, data: SuspendApplicationRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/suspend`, data);
  return res.data;
}

/**
 * 获取认证策略
 * 获取指定租户的认证策略配置，包括MFA、会话、OAuth等设置
 */
export async function adminTenantsAuthPolicyByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/auth-policy`);
  return res.data;
}

/**
 * 更新认证策略
 * 更新指定租户的认证策略配置
 */
export async function adminTenantsAuthPolicyByTenantsPut(tenantId: string, data: UpdateAuthPolicyRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}/auth-policy`, data);
  return res.data;
}

/**
 * 获取品牌配置
 * 获取指定租户的品牌定制配置，包括Logo、主题色等
 */
export async function adminTenantsBrandingByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/branding`);
  return res.data;
}

/**
 * 更新品牌配置
 * 更新指定租户的品牌定制配置
 */
export async function adminTenantsBrandingByTenantsPut(tenantId: string, data: UpdateBrandingRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}/branding`, data);
  return res.data;
}

/**
 * 查询租户数据分类分级
 * 查询指定租户的数据分类分级配置，用于数据安全治理与合规审计
 */
export async function adminTenantsDataClassificationByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/data-classification`);
  return res.data;
}

/**
 * 更新租户数据分类分级
 * 更新指定租户的数据分类分级配置，支持自定义敏感数据等级与保护策略
 */
export async function adminTenantsDataClassificationByTenantsPost(tenantId: string, data: UpdateDataClassificationRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/data-classification`, data);
  return res.data;
}

/**
 * 获取部门列表
 * 查询指定租户下的所有部门信息，支持构建组织架构树
 */
export async function adminTenantsDepartmentsByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/departments`);
  return res.data;
}

/**
 * 创建部门
 * 在指定租户下创建新部门，可指定父部门以构建层级组织架构
 */
export async function adminTenantsDepartmentsByTenantsPost(tenantId: string, data: CreateDepartmentRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/departments`, data);
  return res.data;
}

/**
 * 删除部门
 * 删除指定租户下的某个部门，通常会校验该部门下是否还有成员或子部门
 */
export async function adminTenantsDepartmentsByTenantsByDepartmentsDelete(tenantId: string, deptId: string) {
  await api.delete(`/tenant/api/v1/admin/tenants/${tenantId}/departments/${deptId}`);
}

/**
 * 更新部门
 * 更新指定租户下某个部门的名称或层级信息
 */
export async function adminTenantsDepartmentsByTenantsByDepartmentsPut(tenantId: string, deptId: string, data: UpdateDepartmentRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}/departments/${deptId}`, data);
  return res.data;
}

/**
 * 获取域名列表
 * 获取指定租户绑定的所有自定义域名列表
 */
export async function adminTenantsDomainsByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/domains`);
  return res.data;
}

/**
 * 添加域名
 * 为指定租户添加新的自定义域名
 */
export async function adminTenantsDomainsByTenantsPost(tenantId: string, data: AddDomainRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/domains`, data);
  return res.data;
}

/**
 * 删除域名
 * 从指定租户中删除已绑定的自定义域名
 */
export async function adminTenantsDomainsByTenantsByDomainsDelete(tenantId: string, domain: string) {
  await api.delete(`/tenant/api/v1/admin/tenants/${tenantId}/domains/${domain}`);
}

/**
 * 获取邀请配置
 * 获取指定租户的邀请配置，包括邀请过期天数和默认角色
 */
export async function adminTenantsInvitationConfigByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/invitation-config`);
  return res.data;
}

/**
 * 更新邀请配置
 * 更新指定租户的邀请配置，包括邀请过期天数和默认角色
 */
export async function adminTenantsInvitationConfigByTenantsPut(tenantId: string, data: UpdateInvitationConfigRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}/invitation-config`, data);
  return res.data;
}

/**
 * 获取邀请列表
 * 获取指定租户的所有邀请记录，支持按状态筛选和分页
 */
export async function adminTenantsInvitationsByTenants(tenantId: string, params?: {
  status?: string;  // 状态筛选: pending/accepted/revoked/expired
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/invitations`, { params });
  return res.data;
}

/**
 * 删除邀请
 * 管理员永久删除邀请记录（不可逆操作，区别于RevokeInvitation的状态变更）
 */
export async function adminTenantsInvitationsByTenantsByInvitationsDelete(tenantId: string, inviteId: string) {
  await api.delete(`/tenant/api/v1/admin/tenants/${tenantId}/invitations/${inviteId}`);
}

/**
 * 重新发送邀请
 * 重新发送指定租户下的邀请，更新过期时间并重置状态为待处理
 */
export async function adminTenantsInvitationsResendByTenantsByInvitationsPost(tenantId: string, inviteId: string) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/invitations/${inviteId}/resend`);
  return res.data;
}

/**
 * 撤销邀请
 * 撤销指定租户下的某个邀请，将其状态标记为已撤销
 */
export async function adminTenantsInvitationsRevokeByTenantsByInvitationsPost(tenantId: string, inviteId: string) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/invitations/${inviteId}/revoke`);
  return res.data;
}

/**
 * 获取成员列表
 * 获取指定租户的所有成员列表，支持分页和筛选
 */
export async function adminTenantsMembersByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/members`);
  return res.data;
}

/**
 * 添加成员
 * 向指定租户添加新成员，可设置角色和权限
 */
export async function adminTenantsMembersByTenantsPost(tenantId: string, data: AddMemberRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/members`, data);
  return res.data;
}

/**
 * 批量审批成员
 * 批量通过多个成员的加入申请
 */
export async function adminTenantsMembersBatchApproveByTenantsPost(tenantId: string, data: BatchApproveRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/members/batch-approve`, data);
  return res.data;
}

/**
 * 批量导入成员
 * 通过CSV/Excel文件批量导入成员到指定租户
 */
export async function adminTenantsMembersBulkImportByTenantsPost(tenantId: string, data: BulkImportMembersRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/members/bulk-import`, data);
  return res.data;
}

/**
 * 邀请成员
 * 向指定邮箱发送租户加入邀请链接
 */
export async function adminTenantsMembersInviteByTenantsPost(tenantId: string, data: InviteMemberRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/members/invite`, data);
  return res.data;
}

/**
 * 列出待审批成员
 * 返回租户下所有待审批的成员列表
 */
export async function adminTenantsMembersPendingByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/members/pending`);
  return res.data;
}

/**
 * 移除成员
 * 从指定租户中移除某个成员
 */
export async function adminTenantsMembersByTenantsByMembersDelete(tenantId: string, memberId: string) {
  await api.delete(`/tenant/api/v1/admin/tenants/${tenantId}/members/${memberId}`);
}

/**
 * 更新成员信息
 * 更新指定租户中某个成员的角色和权限
 */
export async function adminTenantsMembersByTenantsByMembersPut(tenantId: string, memberId: string, data: UpdateMemberRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}/members/${memberId}`, data);
  return res.data;
}

/**
 * 通过成员审批
 * 通过指定成员的加入申请并分配角色
 */
export async function adminTenantsMembersApproveByTenantsByMembersPost(tenantId: string, memberId: string, data: ApproveMemberRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/members/${memberId}/approve`, data);
  return res.data;
}

/**
 * 拒绝成员审批
 * 拒绝指定成员的加入申请
 */
export async function adminTenantsMembersRejectByTenantsByMembersPost(tenantId: string, memberId: string, data: RejectMemberRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/members/${memberId}/reject`, data);
  return res.data;
}

/**
 * 获取未成年人保护配置
 * 获取指定租户的未成年人保护配置，包括防沉迷、宵禁、消费限额等
 */
export async function adminTenantsMinorsProtectionByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/minors-protection`);
  return res.data;
}

/**
 * 更新未成年人保护配置
 * 更新指定租户的未成年人保护配置
 */
export async function adminTenantsMinorsProtectionByTenantsPut(tenantId: string, data: UpdateMinorsProtectionConfigRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}/minors-protection`, data);
  return res.data;
}

/**
 * 获取组织架构图
 * 查询指定租户的组织架构图数据，包含部门层级、负责人等可视化信息
 */
export async function adminTenantsOrgChartByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/org-chart`);
  return res.data;
}

/**
 * 更新组织架构图
 * 更新指定租户的组织架构图配置，支持批量调整部门关系与展示样式
 */
export async function adminTenantsOrgChartByTenantsPost(tenantId: string, data: UpdateOrgChartRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/org-chart`, data);
  return res.data;
}

/**
 * 获取资源配额
 * 获取指定租户的资源配额信息，包括用户上限、存储限制等
 */
export async function adminTenantsQuotaByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/quota`);
  return res.data;
}

/**
 * 更新资源配额
 * 更新指定租户的资源配额限制
 */
export async function adminTenantsQuotaByTenantsPut(tenantId: string, data: UpdateResourceQuotaRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}/quota`, data);
  return res.data;
}

/**
 * 获取安全策略
 * 获取指定租户的安全策略配置，包括密码强度、登录限制等
 */
export async function adminTenantsSecurityPolicyByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/security-policy`);
  return res.data;
}

/**
 * 更新安全策略
 * 更新指定租户的安全策略配置
 */
export async function adminTenantsSecurityPolicyByTenantsPut(tenantId: string, data: UpdateSecurityPolicyRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}/security-policy`, data);
  return res.data;
}

/**
 * 获取租户统计概览
 * 获取租户的成员数量、应用数量等统计信息，供仪表盘使用
 */
export async function adminTenantsStatisticsByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/statistics`);
  return res.data;
}

/**
 * 暂停租户
 * 暂停指定租户的服务访问，保留所有数据
 */
export async function adminTenantsSuspendByTenantsPost(tenantId: string) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/suspend`);
  return res.data;
}

/**
 * 列出 Webhook
 * 列出租户的所有 Webhook 订阅
 */
export async function adminTenantsWebhooksByTenants(tenantId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks`);
  return res.data;
}

/**
 * 创建 Webhook
 * 为租户注册事件回调 Webhook
 */
export async function adminTenantsWebhooksByTenantsPost(tenantId: string, data: CreateWebhookRequest) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks`, data);
  return res.data;
}

/**
 * 删除 Webhook
 * 删除指定的 Webhook 订阅
 */
export async function adminTenantsWebhooksByTenantsByWebhooksDelete(tenantId: string, hookId: string) {
  await api.delete(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}`);
}

/**
 * 获取 Webhook 详情
 * 获取指定 Webhook 的详细信息
 */
export async function adminTenantsWebhooksByTenantsByWebhooks(tenantId: string, hookId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}`);
  return res.data;
}

/**
 * 更新 Webhook
 * 更新 Webhook 的 URL、事件或状态
 */
export async function adminTenantsWebhooksByTenantsByWebhooksPut(tenantId: string, hookId: string, data: UpdateWebhookRequest) {
  const res = await api.put(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}`, data);
  return res.data;
}

/**
 * 列出 Webhook 投递记录
 * 分页查询 Webhook 投递历史，支持按状态筛选
 */
export async function adminTenantsWebhooksDeliveriesByTenantsByWebhooks(tenantId: string, hookId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  status?: string;  // 状态筛选
}) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}/deliveries`, { params });
  return res.data;
}

/**
 * 获取投递详情
 * 获取单次投递的详细信息，包含请求和响应内容
 */
export async function adminTenantsWebhooksDeliveriesByTenantsByWebhooksByDeliveries(tenantId: string, hookId: string, deliveryId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}/deliveries/${deliveryId}`);
  return res.data;
}

/**
 * 重试投递
 * 手动重新投递失败的 Webhook 消息
 */
export async function adminTenantsWebhooksDeliveriesRetryByTenantsByWebhooksByDeliveriesPost(tenantId: string, hookId: string, deliveryId: string) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}/deliveries/${deliveryId}/retry`);
  return res.data;
}

/**
 * 轮换签名密钥
 * 生成新的 Webhook 签名密钥，旧密钥立即失效
 */
export async function adminTenantsWebhooksRotateSecretByTenantsByWebhooksPost(tenantId: string, hookId: string) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}/rotate-secret`);
  return res.data;
}

/**
 * 获取 Webhook 投递统计
 * 获取 Webhook 投递统计数据（成功率、平均延迟、失败原因分布）
 */
export async function adminTenantsWebhooksStatsByTenantsByWebhooks(tenantId: string, hookId: string) {
  const res = await api.get(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}/stats`);
  return res.data;
}

/**
 * 测试 Webhook
 * 向 Webhook URL 发送测试事件，验证配置是否正确
 */
export async function adminTenantsWebhooksTestByTenantsByWebhooksPost(tenantId: string, hookId: string) {
  const res = await api.post(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}/test`);
  return res.data;
}

/**
 * 列出可用事件类型
 * 发现所有可订阅的 Webhook 事件类型及其所属领域
 */
export async function adminWebhooksEventTypes() {
  const res = await api.get(`/tenant/api/v1/admin/webhooks/event-types`);
  return res.data;
}

/**
 * 获取事件 Schema
 * 获取指定事件类型的描述信息和示例 payload
 */
export async function adminWebhooksEventTypesSchemaByEventTypes(event: string) {
  const res = await api.get(`/tenant/api/v1/admin/webhooks/event-types/${event}/schema`);
  return res.data;
}

/**
 * 接受邀请
 * 通过邀请token接受租户成员邀请，加入租户
 */
export async function invitationsAcceptByInvitationsPost(token: string, data: AcceptInvitationRequest) {
  const res = await api.post(`/tenant/api/v1/invitations/${token}/accept`, data);
  return res.data;
}

/**
 * 公开租户列表
 * 返回所有活跃租户的基本信息，供登录页选择
 */
export async function tenantPublicTenants() {
  const res = await api.get(`/tenant/api/v1/tenant/public/tenants`);
  return res.data;
}

/**
 * 公开租户详情
 * 返回租户的公开配置（基本信息、品牌定制、认证策略、安全策略），用于登录页初始化，无需认证
 */
export async function tenantPublicTenantsByTenants(slug: string) {
  const res = await api.get(`/tenant/api/v1/tenant/public/tenants/${slug}`);
  return res.data;
}

/**
 * 获取用户可访问的应用列表
 * 查询用户在所有租户下可访问的应用列表
 */
export async function usersApplicationsByUsers(userId: string) {
  const res = await api.get(`/tenant/api/v1/users/${userId}/applications`);
  return res.data;
}

/**
 * 获取用户所属租户列表
 * 查询用户作为成员的所有租户，含角色和加入时间
 */
export async function usersTenantsByUsers(userId: string) {
  const res = await api.get(`/tenant/api/v1/users/${userId}/tenants`);
  return res.data;
}

// ============================================================
// Thirdparty Service
// ============================================================

// ============================================================
// Verification Service
// ============================================================

/**
 * 查询认证列表
 * 管理员查询租户下所有实名认证记录，支持按认证状态、日期范围过滤和分页，返回脱敏后的认证信息列表
 */
export async function adminVerifications(params?: {
  status?: string;  // 认证状态过滤：verified/pending/rejected/expired
  date_from?: string;  // 起始日期 (YYYY-MM-DD)
  date_to?: string;  // 截止日期 (YYYY-MM-DD)
  page?: number;  // 页码，默认1
  page_size?: number;  // 每页数量，默认20
}) {
  const res = await api.get(`/verification/api/v1/admin/verifications`, { params });
  return res.data;
}

/**
 * 导出认证记录
 * 导出认证记录为CSV文件，包含ID、用户ID、状态、方法、提供方、年龄分组、活体分数、核验时间、拒绝原因、过期时间、重试次数、创建时间等字段。支持按状态和日期范围过滤，最多导出1000条
 */
export async function adminVerificationsExport(params?: {
  status?: string;  // 认证状态过滤：verified/pending/rejected/expired
  date_from?: string;  // 起始日期 (YYYY-MM-DD)
  date_to?: string;  // 截止日期 (YYYY-MM-DD)
}) {
  const res = await api.get(`/verification/api/v1/admin/verifications/export`, { params });
  return res.data;
}

/**
 * 管理员解除监护关系
 * 管理员手动解除指定的监护关系，解除后监护人不再有权管理该未成年人
 */
export async function adminVerificationsGuardiansDelete(data: RemoveGuardianRequest) {
  await api.delete(`/verification/api/v1/admin/verifications/guardians`, { data });
}

/**
 * 管理员查询监护关系
 * 管理员根据监护人ID或未成年用户ID查询监护关系列表，至少需提供一个查询参数
 */
export async function adminVerificationsGuardians(params?: {
  guardian_user_id?: string;  // 监护人用户ID
  minor_user_id?: string;  // 未成年用户ID
}) {
  const res = await api.get(`/verification/api/v1/admin/verifications/guardians`, { params });
  return res.data;
}

/**
 * 列出提供方配置
 * 分页查询提供方配置列表，支持按通道类型和启用状态过滤，按优先级排序
 */
export async function adminVerificationsProviders(params?: {
  channel?: string;  // 通道类型过滤：ocr/verify/liveness
  is_active?: boolean;  // 是否仅查询已启用的配置
  page?: number;  // 页码，默认1
  page_size?: number;  // 每页数量，默认20
}) {
  const res = await api.get(`/verification/api/v1/admin/verifications/providers`, { params });
  return res.data;
}

/**
 * 创建提供方配置
 * 为指定验证通道（OCR/核验/活体）创建身份验证提供方配置，包含优先级和JSON配置项。配置后可被服务用于选择验证服务提供商
 */
export async function adminVerificationsProvidersPost(data: CreateProviderConfigRequest) {
  const res = await api.post(`/verification/api/v1/admin/verifications/providers`, data);
  return res.data;
}

/**
 * 删除提供方配置
 * 删除指定的提供方配置，删除后将不再用于验证服务提供商选择
 */
export async function adminVerificationsProvidersByProvidersDelete(verificationId: string) {
  await api.delete(`/verification/api/v1/admin/verifications/providers/${verificationId}`);
}

/**
 * 获取提供方配置详情
 * 根据配置ID获取单个提供方配置的详细信息，包括JSON配置内容和启用状态
 */
export async function adminVerificationsProvidersByProviders(verificationId: string) {
  const res = await api.get(`/verification/api/v1/admin/verifications/providers/${verificationId}`);
  return res.data;
}

/**
 * 更新提供方配置
 * 更新提供方配置的JSON配置内容、启用状态或优先级
 */
export async function adminVerificationsProvidersByProvidersPut(verificationId: string, data: UpdateProviderConfigRequest) {
  const res = await api.put(`/verification/api/v1/admin/verifications/providers/${verificationId}`, data);
  return res.data;
}

/**
 * 获取认证统计
 * 获取租户下认证记录的统计汇总：总认证数、已验证、待处理、已拒绝、已过期、未认证、未成年用户数量
 */
export async function adminVerificationsStats() {
  const res = await api.get(`/verification/api/v1/admin/verifications/stats`);
  return res.data;
}

/**
 * 获取认证详情
 * 管理员查看指定认证记录的详细信息，包括脱敏姓名、身份证提示、活体分数、人工覆盖记录等
 */
export async function adminVerificationsByVerifications(verificationId: string) {
  const res = await api.get(`/verification/api/v1/admin/verifications/${verificationId}`);
  return res.data;
}

/**
 * 转入人工审核
 * 管理员将认证记录转入人工审核状态，需填写审核原因。此操作需要Step-up重新认证
 */
export async function adminVerificationsManualReviewByVerificationsPost(verificationId: string, data: ManualReviewRequest) {
  const res = await api.post(`/verification/api/v1/admin/verifications/${verificationId}/manual-review`, data);
  return res.data;
}

/**
 * 人工覆盖认证状态
 * 管理员手动覆盖认证状态（如从未通过改为通过），需提供目标状态值和原因说明。此操作需要Step-up重新认证，操作记录会写入审计日志
 */
export async function adminVerificationsOverrideByVerificationsPost(verificationId: string, data: OverrideRequest) {
  const res = await api.post(`/verification/api/v1/admin/verifications/${verificationId}/override`, data);
  return res.data;
}

/**
 * 重置重试计数
 * 管理员重置指定认证记录的重试次数为零，允许用户重新提交认证。此操作需要Step-up重新认证
 */
export async function adminVerificationsResetByVerificationsPost(verificationId: string) {
  const res = await api.post(`/verification/api/v1/admin/verifications/${verificationId}/reset`);
  return res.data;
}

/**
 * 解决人工审核
 * 管理员解决人工审核：批准(approved)或拒绝(rejected)。仅manual_review状态的记录可操作。此操作需要Step-up重新认证
 */
export async function adminVerificationsResolveReviewByVerificationsPost(verificationId: string, data: ResolveReviewRequest) {
  const res = await api.post(`/verification/api/v1/admin/verifications/${verificationId}/resolve-review`, data);
  return res.data;
}

/**
 * 授权同意
 * 用户授权实名认证数据收集和处理，需提供同意项列表（如数据收集、人脸信息处理等）
 */
export async function verificationConsentPost(data: GrantConsentRequest, params?: {
  verification_id: string;  // 认证ID
}) {
  const res = await api.post(`/verification/api/v1/verification/consent`, data, { params });
  return res.data;
}

/**
 * 解除监护关系
 * 删除指定的监护关系，解除后监护人不再有权管理该未成年人
 */
export async function verificationGuardiansDelete(data: RemoveGuardianRequest) {
  await api.delete(`/verification/api/v1/verification/guardians`, { data });
}

/**
 * 创建监护关系
 * 为未成年用户创建监护关系。监护人必须是已认证的成年用户，创建后需监护人授权同意
 */
export async function verificationGuardiansPost(data: CreateGuardianRequest) {
  const res = await api.post(`/verification/api/v1/verification/guardians`, data);
  return res.data;
}

/**
 * 更新监护关系
 * 更新监护关系类型或同意范围，仅监护人本人可操作
 */
export async function verificationGuardiansIdPut(data: UpdateGuardianRequest) {
  const res = await api.put(`/verification/api/v1/verification/guardians/:id`, data);
  return res.data;
}

/**
 * 监护人授权同意
 * 已通过身份验证的监护人给予同意，授权未成年人进行实名认证。可选指定同意范围
 */
export async function verificationGuardiansIdConsentPost(data: GuardianConsentRequest) {
  const res = await api.post(`/verification/api/v1/verification/guardians/:id/consent`, data);
  return res.data;
}

/**
 * 监护人身份验证
 * 监护人通过JWT确认身份，完成对指定监护关系的身份验证，验证后可为未成年人授权
 */
export async function verificationGuardiansIdVerifyPost() {
  const res = await api.post(`/verification/api/v1/verification/guardians/:id/verify`);
  return res.data;
}

/**
 * 获取我的被监护人列表
 * 获取当前用户作为监护人的所有被监护人列表，包含未成年用户的保护设置信息
 */
export async function verificationGuardiansMinors() {
  const res = await api.get(`/verification/api/v1/verification/guardians/minors`);
  return res.data;
}

/**
 * 开始活体检测
 * 发起活体检测会话，返回会话令牌和动作序列（如眨眼、张嘴、摇头等），需在会话过期前完成检测
 */
export async function verificationLivenessBeginPost(data: BeginLivenessRequest) {
  const res = await api.post(`/verification/api/v1/verification/liveness/begin`, data);
  return res.data;
}

/**
 * 完成活体检测
 * 提交活体检测视频Base64数据，验证用户活体动作，返回活体检测分数和是否通过
 */
export async function verificationLivenessVerifyPost(data: CompleteLivenessRequest) {
  const res = await api.post(`/verification/api/v1/verification/liveness/verify`, data);
  return res.data;
}

/**
 * 获取我的认证状态
 * 获取当前用户的最新实名认证状态，包括认证状态、核验方法、年龄分组、过期时间等。若尚未提交认证则返回未认证状态
 */
export async function verificationMe() {
  const res = await api.get(`/verification/api/v1/verification/me`);
  return res.data;
}

/**
 * 获取我的认证详情
 * 获取当前用户的完整认证详情，包括状态、方法、提供方、活体检测分数、拒绝原因等
 */
export async function verificationMeDetail() {
  const res = await api.get(`/verification/api/v1/verification/me/detail`);
  return res.data;
}

/**
 * 获取未成年用户的监护人列表
 * 根据未成年人用户ID查询其所有监护人列表，包含关系类型和授权状态
 */
export async function verificationMinorsGuardians(params?: {
  minor_user_id: string;  // 未成年人用户ID
}) {
  const res = await api.get(`/verification/api/v1/verification/minors/guardians`, { params });
  return res.data;
}

/**
 * 设置未成年人保护配置
 * 监护人设置未成年人的保护限制：每日使用时长、夜间模式时段、功能限制列表。需先完成同意授权
 */
export async function verificationMinorsProtectionPut(data: SetMinorProtectionRequest) {
  const res = await api.put(`/verification/api/v1/verification/minors/protection`, data);
  return res.data;
}

/**
 * 提交OCR识别
 * 上传身份证正反面Base64图片进行OCR识别，提取姓名和身份证号。参考：GB/T 35273-2020 (个人信息安全规范)。
 */
export async function verificationOcrPost(data: SubmitOCRRequest) {
  const res = await api.post(`/verification/api/v1/verification/ocr`, data);
  return res.data;
}

/**
 * 提交身份核验
 * 提交身份核验请求，可指定核验方法（如自动、NFC、人工审核）和确认信息。核验通过后更新认证状态和年龄分组
 */
export async function verificationVerifyPost(data: SubmitVerificationRequest, params?: {
  verification_id: string;  // 认证ID
}) {
  const res = await api.post(`/verification/api/v1/verification/verify`, data, { params });
  return res.data;
}

// ============================================================
// Wallet Service
// ============================================================

/**
 * 钱包列表
 * 查询钱包列表，支持按状态筛选和分页
 */
export async function adminWallets(params?: {
  status?: "active" | "frozen" | "closed";  // 状态筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/wallet/api/v1/admin/wallets`, { params });
  return res.data;
}

/**
 * 创建钱包
 * 为指定用户创建钱包，支持指定币种。参考：GAAP/IFRS (Double-Entry Accounting Principles)。
 */
export async function adminWalletsPost(data: CreateWalletRequest) {
  const res = await api.post(`/wallet/api/v1/admin/wallets`, data);
  return res.data;
}

/**
 * 批量冻结
 * 批量冻结多个用户钱包资金
 */
export async function adminWalletsBatchFreezePost(data: BatchFreezeRequest) {
  const res = await api.post(`/wallet/api/v1/admin/wallets/batch-freeze`, data);
  return res.data;
}

/**
 * 批量解冻
 * 批量解冻多个冻结记录
 */
export async function adminWalletsBatchUnfreezePost(data: BatchUnfreezeRequest) {
  const res = await api.post(`/wallet/api/v1/admin/wallets/batch-unfreeze`, data);
  return res.data;
}

/**
 * 优惠券列表
 * 获取优惠券列表
 */
export async function adminWalletsCoupons() {
  const res = await api.get(`/wallet/api/v1/admin/wallets/coupons`);
  return res.data;
}

/**
 * 创建优惠券
 * 创建新的优惠券
 */
export async function adminWalletsCouponsPost(data: CreateCouponRequest) {
  const res = await api.post(`/wallet/api/v1/admin/wallets/coupons`, data);
  return res.data;
}

/**
 * 删除优惠券
 * 删除指定优惠券
 */
export async function adminWalletsCouponsByCouponsDelete(couponId: string) {
  await api.delete(`/wallet/api/v1/admin/wallets/coupons/${couponId}`);
}

/**
 * 更新优惠券
 * 更新指定优惠券
 */
export async function adminWalletsCouponsByCouponsPut(couponId: string, data: UpdateCouponRequest) {
  const res = await api.put(`/wallet/api/v1/admin/wallets/coupons/${couponId}`, data);
  return res.data;
}

/**
 * 优惠券使用记录
 * 获取指定优惠券的使用记录列表
 */
export async function adminWalletsCouponsUsagesByCoupons(id: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/wallet/api/v1/admin/wallets/coupons/${id}/usages`, { params });
  return res.data;
}

/**
 * 反欺诈规则
 * 获取反欺诈规则列表
 */
export async function adminWalletsFraudRules() {
  const res = await api.get(`/wallet/api/v1/admin/wallets/fraud-rules`);
  return res.data;
}

/**
 * 更新反欺诈规则
 * 批量更新反欺诈规则
 */
export async function adminWalletsFraudRulesPost(data: UpdateFraudRulesRequest) {
  const res = await api.post(`/wallet/api/v1/admin/wallets/fraud-rules`, data);
  return res.data;
}

/**
 * 删除反欺诈规则
 * 删除指定ID的反欺诈规则
 */
export async function adminWalletsFraudRulesByFraudRulesDelete(walletId: string) {
  await api.delete(`/wallet/api/v1/admin/wallets/fraud-rules/${walletId}`);
}

/**
 * 删除冻结记录
 * 管理员删除指定冻结记录
 */
export async function adminWalletsFreezeRecordsByFreezeRecordsDelete(walletId: string) {
  await api.delete(`/wallet/api/v1/admin/wallets/freeze-records/${walletId}`);
}

/**
 * 对账
 * 获取指定租户的对账数据
 */
export async function adminWalletsReconciliation(params?: {
  date?: string;  // 对账日期
}) {
  const res = await api.get(`/wallet/api/v1/admin/wallets/reconciliation`, { params });
  return res.data;
}

/**
 * 钱包快照列表
 * 分页查询所有钱包快照记录，按快照日期倒序排列
 */
export async function adminWalletsSnapshots(params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/wallet/api/v1/admin/wallets/snapshots`, { params });
  return res.data;
}

/**
 * 删除钱包策略
 * 删除指定租户和应用的策略配置
 */
export async function adminWalletsTenantsAppsPolicyByTenantsByAppsDelete(tenantId: string, appId: string) {
  await api.delete(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/apps/${appId}/policy`);
}

/**
 * 查询钱包策略
 * 获取指定应用的钱包策略配置
 */
export async function adminWalletsTenantsAppsPolicyByTenantsByApps(tenantId: string, appId: string) {
  const res = await api.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/apps/${appId}/policy`);
  return res.data;
}

/**
 * 更新钱包策略
 * 创建或更新指定应用的钱包策略配置
 */
export async function adminWalletsTenantsAppsPolicyByTenantsByAppsPut(tenantId: string, appId: string, data: WalletPolicy) {
  const res = await api.put(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/apps/${appId}/policy`, data);
  return res.data;
}

/**
 * 应用钱包总览
 * 获取指定租户下指定应用的钱包余额汇总
 */
export async function adminWalletsTenantsAppsSummaryByTenantsByApps(tenantId: string, appId: string) {
  const res = await api.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/apps/${appId}/summary`);
  return res.data;
}

/**
 * 争议列表
 * 获取租户下的争议列表
 */
export async function adminWalletsTenantsDisputesByTenants(tenantId: string, params?: {
  status?: string;  // 状态
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/disputes`, { params });
  return res.data;
}

/**
 * 争议处理
 * 处理指定争议
 */
export async function adminWalletsTenantsDisputesResolveByTenantsByDisputesPost(tenantId: string, disputeId: string, data: Record<string, unknown>) {
  const res = await api.post(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/disputes/${disputeId}/resolve`, data);
  return res.data;
}

/**
 * 租户级统计
 * 获取租户下所有钱包的聚合统计数据
 */
export async function adminWalletsTenantsStatsByTenants(tenantId: string, params?: {
  period?: string;  // 统计周期
  start_date?: string;  // 开始日期
  end_date?: string;  // 结束日期
}) {
  const res = await api.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/stats`, { params });
  return res.data;
}

/**
 * 租户钱包总览
 * 获取指定租户下所有钱包的余额汇总
 */
export async function adminWalletsTenantsSummaryByTenants(tenantId: string) {
  const res = await api.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/summary`);
  return res.data;
}

/**
 * 租户级交易流水
 * 获取租户下所有交易流水
 */
export async function adminWalletsTenantsTransactionsByTenants(tenantId: string, params?: {
  type?: string;  // 交易类型
  status?: string;  // 状态
  start_date?: string;  // 开始日期
  end_date?: string;  // 结束日期
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/transactions`, { params });
  return res.data;
}

/**
 * webhook回调记录列表
 * 分页查询webhook回调记录，支持按状态筛选
 */
export async function adminWalletsWebhookPayloads(params?: {
  gateway?: string;  // 支付网关筛选
  status?: string;  // 状态筛选 (pending/processed/failed)
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/wallet/api/v1/admin/wallets/webhook-payloads`, { params });
  return res.data;
}

/**
 * webhook回调记录详情
 * 获取单条webhook回调记录详情
 */
export async function adminWalletsWebhookPayloadsByWebhookPayloads(walletId: string) {
  const res = await api.get(`/wallet/api/v1/admin/wallets/webhook-payloads/${walletId}`);
  return res.data;
}

/**
 * 提现申请列表
 * 用户查看自己的提现申请列表
 */
export async function adminWalletsWithdrawals(params?: {
  status?: string;  // 状态筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/wallet/api/v1/admin/wallets/withdrawals`, { params });
  return res.data;
}

/**
 * 审批提现
 * 审批通过提现申请
 */
export async function adminWalletsWithdrawalsApproveByWithdrawalsPost(walletId: string, data: ApproveWithdrawalRequest) {
  const res = await api.post(`/wallet/api/v1/admin/wallets/withdrawals/${walletId}/approve`, data);
  return res.data;
}

/**
 * 拒绝提现
 * 拒绝提现申请
 */
export async function adminWalletsWithdrawalsRejectByWithdrawalsPost(walletId: string, data: RejectWithdrawalRequest) {
  const res = await api.post(`/wallet/api/v1/admin/wallets/withdrawals/${walletId}/reject`, data);
  return res.data;
}

/**
 * 手动调账
 * 管理员手动调整用户余额（需审计）
 */
export async function adminWalletsAdjustByWalletsPost(userId: string, data: Record<string, unknown>) {
  const res = await api.post(`/wallet/api/v1/admin/wallets/${userId}/adjust`, data);
  return res.data;
}

/**
 * 删除钱包
 * 删除指定钱包
 */
export async function adminWalletsByWalletsDelete(walletId: string) {
  await api.delete(`/wallet/api/v1/admin/wallets/${walletId}`);
}

/**
 * 更新钱包
 * 更新钱包状态
 */
export async function adminWalletsByWalletsPut(walletId: string, data: UpdateWalletRequest) {
  const res = await api.put(`/wallet/api/v1/admin/wallets/${walletId}`, data);
  return res.data;
}

/**
 * 验证钱包完整性
 * 验证指定钱包的事件哈希链完整性，检测篡改或数据损坏
 */
export async function adminWalletsIntegrityByWallets(walletId: string) {
  const res = await api.get(`/wallet/api/v1/admin/wallets/${walletId}/integrity`);
  return res.data;
}

/**
 * 查询兑换率
 * 查询两种币种之间的当前兑换率，生成60秒有效的报价ID
 */
export async function exchangeRates(params?: {
  from: string;  // 源币种
  to: string;  // 目标币种
}) {
  const res = await api.get(`/wallet/api/v1/exchange-rates`, { params });
  return res.data;
}

/**
 * 执行兑换
 * 使用报价ID执行币种兑换。参考：GAAP/IFRS (Double-Entry Accounting Principles)。quote_id在60秒内有效，兑换后即失效防止重放。
 */
export async function exchangeRatesConvertPost(data: ExchangeConvertRequest) {
  const res = await api.post(`/wallet/api/v1/exchange-rates/convert`, data);
  return res.data;
}

/**
 * 钱包列表
 * 查询钱包列表，支持按状态筛选和分页
 */
export async function wallets(params?: {
  status?: "active" | "frozen" | "closed";  // 状态筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/wallet/api/v1/wallets`, { params });
  return res.data;
}

/**
 * 创建钱包
 * 为指定用户创建钱包，支持指定币种。参考：GAAP/IFRS (Double-Entry Accounting Principles)。
 */
export async function walletsPost(data: CreateWalletRequest) {
  const res = await api.post(`/wallet/api/v1/wallets`, data);
  return res.data;
}

/**
 * 优惠券列表
 * 获取优惠券列表
 */
export async function walletsCoupons() {
  const res = await api.get(`/wallet/api/v1/wallets/coupons`);
  return res.data;
}

/**
 * 创建优惠券
 * 创建新的优惠券
 */
export async function walletsCouponsPost(data: CreateCouponRequest) {
  const res = await api.post(`/wallet/api/v1/wallets/coupons`, data);
  return res.data;
}

/**
 * 钱包快照
 * 查询指定日期的钱包余额快照
 */
export async function walletsSnapshot(params?: {
  date: string;  // 快照日期（YYYY-MM-DD）
}) {
  const res = await api.get(`/wallet/api/v1/wallets/snapshot`, { params });
  return res.data;
}

/**
 * 余额快照
 * 生成钱包余额快照
 */
export async function walletsSnapshotPost(data: SnapshotRequest) {
  const res = await api.post(`/wallet/api/v1/wallets/snapshot`, data);
  return res.data;
}

/**
 * 取消交易
 * 取消指定交易
 */
export async function walletsTransactionsCancelByTransactionsPost(walletId: string, data: CancelTransactionRequest) {
  const res = await api.post(`/wallet/api/v1/wallets/transactions/${walletId}/cancel`, data);
  return res.data;
}

/**
 * 交易争议
 * 对指定交易发起争议
 */
export async function walletsTransactionsDisputeByTransactionsPost(walletId: string, data: TransactionDisputeRequest) {
  const res = await api.post(`/wallet/api/v1/wallets/transactions/${walletId}/dispute`, data);
  return res.data;
}

/**
 * 钱包转账
 * 在用户之间转账。参考：GAAP/IFRS (Double-Entry Accounting Principles)，确保借貸平衡。
 */
export async function walletsTransferPost(data: TransferRequest) {
  const res = await api.post(`/wallet/api/v1/wallets/transfer`, data);
  return res.data;
}

/**
 * 获取钱包详情
 * 获取指定用户的钱包详情，包含余额、冻结金额、币种和状态信息
 */
export async function walletsByWallets(userId: string) {
  const res = await api.get(`/wallet/api/v1/wallets/${userId}`);
  return res.data;
}

/**
 * 查询余额
 * 获取指定用户钱包余额
 */
export async function walletsBalanceByWallets(userId: string) {
  const res = await api.get(`/wallet/api/v1/wallets/${userId}/balance`);
  return res.data;
}

/**
 * 余额变动历史
 * 获取用户钱包余额变动审计追踪
 */
export async function walletsBalanceHistoryByWallets(userId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/wallet/api/v1/wallets/${userId}/balance-history`, { params });
  return res.data;
}

/**
 * 用户优惠券
 * 获取指定用户的优惠券列表
 */
export async function walletsCouponsByWallets(userId: string) {
  const res = await api.get(`/wallet/api/v1/wallets/${userId}/coupons`);
  return res.data;
}

/**
 * 兑换优惠券
 * 用户使用优惠券码兑换优惠券
 */
export async function walletsCouponsRedeemByWalletsByCouponsPost(userId: string, code: string, params?: {
  wallet_id?: string;  // 钱包ID
}) {
  const res = await api.post(`/wallet/api/v1/wallets/${userId}/coupons/${code}/redeem`, undefined, { params });
  return res.data;
}

/**
 * 钱包充值
 * 向指定用户钱包充值。参考：GAAP/IFRS (Double-Entry Accounting Principles)。
 */
export async function walletsDepositByWalletsPost(userId: string, data: DepositRequest) {
  const res = await api.post(`/wallet/api/v1/wallets/${userId}/deposit`, data);
  return res.data;
}

/**
 * 争议列表
 * 用户查看自己的交易争议列表
 */
export async function walletsDisputesByWallets(userId: string, params?: {
  status?: string;  // 状态筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/wallet/api/v1/wallets/${userId}/disputes`, { params });
  return res.data;
}

/**
 * 冻结资金
 * 冻结指定用户钱包中的资金
 */
export async function walletsFreezeByWalletsPost(userId: string, data: FreezeRequest) {
  const res = await api.post(`/wallet/api/v1/wallets/${userId}/freeze`, data);
  return res.data;
}

/**
 * 冻结记录
 * 获取指定用户的冻结记录
 */
export async function walletsFreezesByWallets(userId: string, params?: {
  status?: string;  // 状态
}) {
  const res = await api.get(`/wallet/api/v1/wallets/${userId}/freezes`, { params });
  return res.data;
}

/**
 * 钱包退款
 * 对指定用户钱包进行退款
 */
export async function walletsRefundByWalletsPost(userId: string, data: RefundRequest) {
  const res = await api.post(`/wallet/api/v1/wallets/${userId}/refund`, data);
  return res.data;
}

/**
 * 钱包统计
 * 获取指定用户的钱包统计数据
 */
export async function walletsStatsByWallets(userId: string, params?: {
  period?: string;  // 统计周期
  start_date?: string;  // 开始日期
  end_date?: string;  // 结束日期
}) {
  const res = await api.get(`/wallet/api/v1/wallets/${userId}/stats`, { params });
  return res.data;
}

/**
 * 交易记录
 * 获取指定用户的交易记录
 */
export async function walletsTransactionsByWallets(userId: string, params?: {
  type?: string;  // 交易类型
  status?: string;  // 状态
  start_date?: string;  // 开始日期
  end_date?: string;  // 结束日期
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/wallet/api/v1/wallets/${userId}/transactions`, { params });
  return res.data;
}

/**
 * 解冻资金
 * 解冻指定用户钱包中的冻结资金
 */
export async function walletsUnfreezeByWalletsPost(userId: string, data: UnfreezeRequest) {
  const res = await api.post(`/wallet/api/v1/wallets/${userId}/unfreeze`, data);
  return res.data;
}

/**
 * 钱包提现
 * 从指定用户钱包提现。参考：GAAP/IFRS (Double-Entry Accounting Principles)。
 */
export async function walletsWithdrawByWalletsPost(userId: string, data: WithdrawRequest) {
  const res = await api.post(`/wallet/api/v1/wallets/${userId}/withdraw`, data);
  return res.data;
}

/**
 * 申请提现
 * 提交提现申请
 */
export async function walletsWithdrawRequestByWalletsPost(userId: string, data: WithdrawalRequest) {
  const res = await api.post(`/wallet/api/v1/wallets/${userId}/withdraw/request`, data);
  return res.data;
}

/**
 * 提现申请列表
 * 用户查看自己的提现申请列表
 */
export async function walletsWithdrawalsByWallets(userId: string, params?: {
  status?: string;  // 状态筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}) {
  const res = await api.get(`/wallet/api/v1/wallets/${userId}/withdrawals`, { params });
  return res.data;
}
