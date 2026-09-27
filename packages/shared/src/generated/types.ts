// Auto-generated from swagger.json annotations
// DO NOT EDIT — run `python scripts/generate_api_ts.py` to regenerate
// Generated: 2026-08-22 06:50:43

// ============================================================
// Shared generic types
// ============================================================

export interface PageInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface DataResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  pagination: PageInfo;
}

// ============================================================
// audit-service
// ============================================================

export interface AuditTenantConfig {
  bruteForceMinAttempts?: number;
  bruteForceSeverityCritical?: number;
  bruteForceSeverityHigh?: number;
  createdAt?: string;
  id?: string;
  offHoursEnd?: number;
  offHoursMinEvents?: number;
  offHoursStart?: number;
  tenantId?: string;
  updatedAt?: string;
}

/** 添加异常调查评论 */
export interface AddAnomalyCommentRequest {
  content: string;  // 评论内容 | @example 经初步分析，此为合法用户使用VPN访问
}

export interface AddIncidentCommentRequest {
  content: string;  // @example 已确认攻击源头并封锁IP
}

export interface AlertDataResponse {
  code?: number;
  data?: AlertResponse;
  message?: string;
  timestamp?: string;
}

export interface AlertListResponse {
  code?: number;
  items?: AlertResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface AlertResponse {
  acknowledgedAt?: string;  // @example 2024-01-01T01:00:00Z
  assignee?: string;  // @example analyst-001
  createdAt?: string;  // @example 2024-01-01T00:00:00Z
  escalatedAt?: string;  // @example 2024-01-01T02:00:00Z
  id?: string;  // @example alert_abc123
  message?: string;  // @example 用户频繁登录失败
  resolvedAt?: string;  // @example 2024-01-01T03:00:00Z
  resolvedBy?: string;  // @example op-001
  severity?: string;  // @example high
  source?: string;  // @example anomaly_detector
  status?: string;  // @example open
  tenantId?: string;  // @example tnt_abc123
  title?: string;  // @example 暴力破解检测
  type?: string;  // @example anomaly
  updatedAt?: string;  // @example 2024-01-01T00:00:00Z
}

/** 异常调查评论 */
export interface AnomalyCommentResponse {
  authorId?: string;  // 评论者ID | @example usr_analyst001
  authorName?: string;  // 评论者名 | @example Zhang San
  content?: string;  // 内容 | @example 经调查确认为误报
  createdAt?: number;  // 时间戳 | @example 1713175800
  id?: string;  // 评论ID | @example cmt_abc123
}

export interface AnomalyDetailResponse {
  code?: number;
  data?: AnomalyResponse;
  message?: string;
  timestamp?: string;
}

export interface AnomalyDetectListResponse {
  code?: number;
  data?: AnomalyResponse[];
  message?: string;
  timestamp?: string;
}

export interface AnomalyListResponse {
  code?: number;
  items?: AnomalyResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface AnomalyRelatedListResponse {
  code?: number;
  items?: AnomalyResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 审计异常记录 */
export interface AnomalyResponse {
  assignee?: string;  // 分析师 | @example usr_analyst001
  comments?: AnomalyCommentResponse[];  // 评论
  createdAt?: number;  // 创建时间戳 | @example 1713175800
  description?: string;  // 描述 | @example 检测到连续5次登录失败
  detectedAt?: number;  // 检测时间戳 | @example 1713175800
  eventIds?: string[];  // 关联事件ID
  id?: string;  // 异常ID | @example ano_abc123
  mitreTactic?: string;  // MITRE战术 | @example T1110
  relatedCaseId?: string;  // 关联案件ID
  resolvedAt?: number;  // 解决时间戳
  resolvedBy?: string;  // 解决者
  severity?: string;  // 严重程度 | @example high
  status?: string;  // 状态 | @example open
  tenantId?: string;  // 租户ID | @example tnt_abc123
  type?: string;  // 类型 | @example brute_force
  updatedAt?: number;  // 更新时间戳
  userId?: string;  // 用户ID | @example usr_abc123
}

export interface AnomalyTimelineDetailResponse {
  code?: number;
  data?: AnomalyTimelineResponse;
  message?: string;
  timestamp?: string;
}

/** 异常关联的用户事件时间线，包含设备/会话上下文 */
export interface AnomalyTimelineResponse {
  anomaly?: AnomalyResponse;
  context?: ContextSummary;
  events?: AuditLogResponse[];
  loginSessions?: DeviceSummary[];
}

export interface ArchiveStatsDetailResponse {
  code?: number;
  data?: ArchiveStatsResponse;
  message?: string;
  timestamp?: string;
}

/** 审计日志归档操作结果统计 */
export interface ArchiveStatsResponse {
  archivedCount?: number;  // @example 1000
  deletedCount?: number;  // @example 1000
  tenantId?: string;  // @example tnt_abc123
}

export interface ArchiveStatusDetailResponse {
  code?: number;
  data?: ArchiveStatusResponse;
  message?: string;
  timestamp?: string;
}

/** 审计日志归档状态 */
export interface ArchiveStatusResponse {
  bucket?: string;  // 存储桶 | @example audit-archive
  days?: number;  // 保留天数 | @example 90
  enabled?: boolean;  // 启用 | @example True
  lastArchive?: number;  // 上次归档时间戳 | @example 1711929600
}

export interface AssignAlertRequest {
  assignee: string;  // @example analyst-001
}

/** 分配异常给安全分析师 */
export interface AssignAnomalyRequest {
  assignee: string;  // 分析师ID | @example usr_analyst001
}

export interface AuditLogDetailResponse {
  code?: number;
  data?: AuditLogResponse;
  message?: string;
  timestamp?: string;
}

export interface AuditLogListResponse {
  code?: number;
  items?: AuditLogResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 审计日志记录信息 */
export interface AuditLogResponse {
  action?: string;  // 操作 | @example user.login
  appId?: string;  // 应用ID | @example app_xyz
  duration?: number;  // 耗时(ms) | @example 150
  id?: string;  // 日志ID | @example audit_abc123
  ip?: string;  // IP | @example 192.168.1.1
  level?: string;  // 级别 | @example info
  message?: string;  // 消息 | @example 用户登录成功
  metadata?: Record<string, unknown>;  // 元数据
  module?: string;  // 模块 | @example identity
  operatorId?: string;  // 操作者ID | @example usr_abc123
  operatorType?: string;  // 操作者类型 | @example user
  requestId?: string;  // 请求ID | @example req_xyz789
  sequence?: number;  // 序列号 | @example 12345
  status?: number;  // 状态 | @example 0
  targetId?: string;  // 目标ID | @example usr_target
  targetType?: string;  // 目标类型 | @example user
  tenantId?: string;  // 租户ID | @example tnt_abc123
  timestamp?: number;  // 时间戳 | @example 1713175800
  userAgent?: string;  // UA | @example Mozilla/5.0...
}

export interface AuditStatsDetailResponse {
  code?: number;
  data?: AuditStatsResponse;
  message?: string;
  timestamp?: string;
}

/** 审计日志统计信息 */
export interface AuditStatsResponse {
  activeTenants?: number;
  avgResponseMs?: number;
  byAction?: Record<string, number>;  // 按操作
  byLevel?: Record<string, number>;  // 按级别
  byModule?: Record<string, number>;  // 按模块
  byStatus?: Record<string, number>;  // 按状态
  mttdMinutes?: number;
  mttrMinutes?: number;
  tenantId?: string;  // 租户ID | @example tnt_abc123
  todayEntries?: number;
  totalLogs?: number;  // 总数 | @example 1000000
  trend?: TimePointResp[];  // 趋势
}

export interface BatchCreateStatusResponse {
  count?: number;  // @example 10
  status?: string;  // @example created
}

/** 单条合规检查项 */
export interface ComplianceCheckResp {
  description?: string;  // 描述 | @example 所有数据已加密
  issues?: string[];  // 问题
  item?: string;  // 检查项 | @example 数据加密
  passed?: boolean;  // 是否通过 | @example True
  severity?: string;  // 严重程度 | @example high
  status?: string;  // 状态 | @example passed
}

export interface ComplianceReportDetailResponse {
  code?: number;
  data?: ComplianceReportResponse;
  message?: string;
  timestamp?: string;
}

/** 合规审计报告 */
export interface ComplianceReportResponse {
  checks?: ComplianceCheckResp[];  // 检查项
  complianceScore?: number;  // 合规得分 | @example 95
  generatedAt?: number;  // 生成时间戳 | @example 1713175800
  overallStatus?: string;  // 状态 | @example pass
  period?: string;  // 周期 | @example 30d
  recommendations?: string[];  // 建议
  standard?: string;  // 标准 | @example GDPR
}

/** 异常关联事件的高层统计信息 */
export interface ContextSummary {
  timeSpanSeconds?: number;  // @example 86400
  totalEvents?: number;  // @example 27
  uniqueDevices?: number;  // @example 3
  uniqueIps?: number;  // @example 2
}

export interface CreateBreachNotificationRequest {
  affectedUsers?: number;  // @example 150
  description?: string;  // @example Suspicious API access patterns detected
  severity: string;  // @example high
  title: string;  // @example Unauthorized access detected
}

export interface CreateCleanupRecordRequest {
  count?: number;  // @example 5000
  period?: string;  // @example 2024-01-01~2024-06-30
  recordType: string;  // @example retention_cleanup
}

export interface CreateCrossBorderTransferRequest {
  dataType: string;  // @example user_profiles
  fromCountry: string;  // @example CN
  purpose?: string;  // @example Data backup replication
  safeguard?: string;  // @example Standard Contractual Clauses
  toCountry: string;  // @example SG
}

export interface CreateDataClassificationRequest {
  dataSetName: string;  // @example User Profile Data
  description?: string;  // @example Contains personally identifiable information
  tiers: string;  // @example PII/Confidential
}

export interface CreateIDResponse {
  id?: string;  // @example pia_abc123
}

export interface CreateIncidentRequest {
  assignee?: string;  // @example analyst-001
  description?: string;  // @example 发现多个租户账户遭到暴力破解攻击
  relatedEvidenceIds?: string[];
  severity: string;  // @example critical
  sourceAnomalyIds?: string[];
  title: string;  // @example 多账户暴力破解
}

export interface CreatePIARequest {
  dataTypes?: string[];  // @example ['["email"', '"name"', '"phone"]']
  description?: string;  // @example Processing customer personal data
  name: string;  // @example Customer Data Processing
  purpose?: string;  // @example Marketing analytics
  riskLevel?: string;  // @example medium
}

export interface CreateStatusResponse {
  status?: string;  // @example created
}

export interface DeleteStatusResponse {
  status?: string;  // 状态 | @example deleted
}

/** 异常时间线中某个设备指纹的摘要信息 */
export interface DeviceSummary {
  eventCount?: number;  // @example 5
  fingerprint?: string;  // @example f7a3c8e1b2d4...
  firstSeen?: number;  // @example 1713175800
  ip?: string;  // @example 192.168.1.1
  lastSeen?: number;  // @example 1713180000
  userAgent?: string;  // @example Mozilla/5.0...
}

export interface ExportJobDetailResponse {
  code?: number;
  data?: ExportJobResponse;
  message?: string;
  timestamp?: string;
}

export interface ExportJobListResponse {
  code?: number;
  items?: ExportJobResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ExportJobRequest {
  actions?: string[];  // 操作类型筛选 | @example ['["create"', '"update"]']
  endDate?: string;  // 结束日期(YYYY-MM-DD) | @example 2026-01-31
  format: string;  // 导出格式: json/csv | @example json
  modules?: string[];  // 模块筛选 | @example ['["order"', '"user"]']
  startDate?: string;  // 开始日期(YYYY-MM-DD) | @example 2026-01-01
}

/** 审计日志导出任务信息 */
export interface ExportJobResponse {
  contentType?: string;  // 内容类型 | @example text/csv
  filename?: string;  // 文件名 | @example audit_logs_20260510.csv
  generatedAt?: number;  // 生成时间戳 | @example 1713175800
  jobId?: string;  // 任务ID | @example exp_abc123
  recordCount?: number;  // 记录数 | @example 1000
  status?: string;  // 状态 | @example completed
}

export interface ExportJobStatusDetailResponse {
  code?: number;
  data?: ExportJobStatusResponse;
  message?: string;
  timestamp?: string;
}

/** 审计日志导出任务状态 */
export interface ExportJobStatusResponse {
  jobId?: string;  // 任务ID | @example exp_abc123
  status?: string;  // 状态 | @example completed
}

export interface FieldViolation {
  code?: string;  // Code 是错误代码（可选） 用于程序识别错误类型，如 "required", "format", "range"
  description?: string;  // Description 是人类可读的错误描述 应该说明违反了什么规则，如 "必须是一个有效的邮箱地址"
  field?: string;  // Field 是错误字段的路径 使用点号表示嵌套字段，如 "user.email" 或 "addresses[0].city"
  standard?: string;  // Standard 是指向权威规范文档的 URI 引用 用于告知 API 消费者具体违反哪个标准 示例："https://www.rfc-editor.org/info/rfc5322"
  value?: unknown;  // Value 是导致错误的值（可选，开发模式下使用） 生产环境可能不返回此字段以避免泄露敏感信息
}

export interface HashChainDetailResponse {
  code?: number;
  data?: HashChainResponse;
  message?: string;
  timestamp?: string;
}

/** 哈希链详细信息 */
export interface HashChainResponse {
  endHash?: string;  // 结束哈希 | @example def456...
  isValid?: boolean;  // 有效 | @example True
  logCount?: number;  // 日志数 | @example 100000
  startHash?: string;  // 起始哈希 | @example abc123...
  tenantId?: string;  // 租户ID | @example tnt_abc123
  verifiedAt?: number;  // 验证时间戳 | @example 1713175800
}

export interface IncidentDataResponse {
  code?: number;
  data?: IncidentResponse;
  message?: string;
  timestamp?: string;
}

export interface IncidentListResponse {
  code?: number;
  items?: IncidentResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface IncidentResponse {
  assignee?: string;  // @example analyst-001
  createdAt?: string;  // @example 2026-01-01T00:00:00Z
  description?: string;  // @example 发现多个租户账户遭到暴力破解攻击
  id?: string;  // @example inc_abc123
  relatedEvidenceIds?: string[];
  resolvedAt?: string;  // @example 2026-01-01T03:00:00Z
  resolvedBy?: string;  // @example op-001
  severity?: string;  // @example critical
  sourceAnomalyIds?: string[];
  status?: string;  // @example open
  tenantId?: string;  // @example tnt_abc123
  title?: string;  // @example 多账户暴力破解
  updatedAt?: string;  // @example 2026-01-01T00:00:00Z
}

export interface LinkAnomalyRequest {
  caseId: string;  // @example CASE-2026-001
}

export interface ListResponsedto_ServerLogResponse {
  code?: number;
  items?: ServerLogResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface MerkleProofDetailResponse {
  code?: number;
  data?: MerkleProofResponse;
  message?: string;
  timestamp?: string;
}

/** 指定审计日志条目的 Merkle Proof，用于第三方验证日志未被篡改 */
export interface MerkleProofResponse {
  entryId?: string;  // 审计日志ID | @example audit_001
  leafCount?: number;  // 总叶子数 | @example 1000
  leafHash?: string;  // 叶节点哈希 | @example abc123...
  leafIndex?: number;  // 叶节点索引 | @example 42
  proof?: string[];  // Proof 路径 | @example ['[R:def456', 'L:ghi789]']
  rootHash?: string;  // Merkle Root | @example a3f5c8...
  tenantId?: string;  // 租户ID | @example tenant-1
}

export interface MerkleProofsDetailResponse {
  code?: number;
  data?: MerkleProofsResponse;
  message?: string;
  timestamp?: string;
}

/** 批量查询多个审计日志条目的 Merkle Proof */
export interface MerkleProofsRequest {
  entryIds: string[];  // 条目ID列表 | @example ['["audit_001"', '"audit_002"]']
}

export interface MerkleProofsResponse {
  found?: number;  // 成功找到的数量 | @example 3
  notFound?: string[];  // 未找到的条目ID | @example ['["audit_003"', '"audit_005"]']
  proofs?: MerkleProofResponse[];  // Proof 列表
  total?: number;  // 总数 | @example 5
}

export interface MerkleRootDetailResponse {
  code?: number;
  data?: MerkleRootResponse;
  message?: string;
  timestamp?: string;
}

/** 指定租户审计日志的 Merkle Root 摘要 */
export interface MerkleRootResponse {
  generatedAt?: number;  // 生成时间 | @example 1713175800
  leafCount?: number;  // 叶子节点数 | @example 1000
  period?: string;  // 时间范围 | @example 2026-01-01~2026-01-31
  rootHash?: string;  // Merkle Root 哈希 | @example a3f5c8...
  tenantId?: string;  // 租户ID | @example tenant-1
}

export interface MessageResponse {
  code?: number;  // @example 0
  message?: string;  // @example success
}

export interface Problem {
  code?: number;  // Code 是业务错误码 用于程序处理特定错误场景 示例：30101001
  detail?: string;  // Detail 是针对此具体错误实例的人类可读解释 可以包含具体的错误细节，如"Field 'email' is required"
  errors?: FieldViolation[];  // Errors 是字段级验证错误列表（扩展字段） 遵循 Web API 标准实践，每个错误包含字段名和错误信息
  i18nArgs?: Record<string, unknown>;  // I18nArgs 是国际化参数 用于动态填充翻译模板
  i18nKey?: string;  // I18nKey 是国际化键 用于客户端本地化错误消息 示例："error.user_not_found"
  instance?: string;  // Instance 是发生问题的具体URI引用 通常是请求的URL，可能包含查询参数 示例："/api/v1/users?limit=invalid"
  requestId?: string;  // RequestID 是请求唯一标识 用于日志关联和问题追踪 示例："req_550e8400-e29b-41d4-a716-446655440000"
  retryAfter?: number;  // RetryAfter 用于 429 Too Many Requests 响应 指示客户端应在多少秒后重试请求（RFC 6585）
  service?: string;  // Service 是服务名 用于微服务架构中定位错误来源 示例："auth-service"
  spanId?: string;  // SpanID 是当前 span 标识 用于精确定位分布式链路中的当前节点
  status?: number;  // Status 是产生的HTTP状态码 用于客户端区分问题类型，不随Accept-Language变化 示例：400, 401, 403, 404, 500
  timestamp?: string;  // Timestamp 是错误发生时间 ISO 8601 格式 示例："2026-04-03T12:00:00Z"
  title?: string;  // Title 是简短、人类可读的问题类型摘要 相同的 Type 应该始终有相同的 Title（不随实例变化） 示例："Invalid Request Parameters"
  traceId?: string;  // TraceID 是分布式追踪标识 遵循 W3C Trace Context 标准 示例："00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01"
  type?: string;  // Type 是标识问题类型的URI引用 当该URI被解引用时，应提供人类可读的文档 示例："https://api.example.com/errors/invalid-request"
}

export interface PublicAuditStats {
  byLevel?: Record<string, number>;
  byModule?: Record<string, number>;
  byStatus?: Record<string, number>;
  totalLogs?: number;  // @example 1000000
}

export interface PublicAuditStatsDetailResponse {
  code?: number;
  data?: PublicAuditStats;
  message?: string;
  timestamp?: string;
}

export interface PublicHashChain {
  endHash?: string;  // 前16位 | @example 789ghi012jkl...
  lastValidated?: string;  // @example 2026-05-12T00:00:00Z
  logCount?: number;  // @example 100000
  startHash?: string;  // 前16位 | @example abc123def456...
}

export interface PublicHashChainDetailResponse {
  code?: number;
  data?: PublicHashChain;
  message?: string;
  timestamp?: string;
}

export interface PublicLogsSummary {
  activeSince?: string;  // @example 2025-01-01T00:00:00Z
  lastActivity?: string;  // @example 2026-05-12T10:00:00Z
  moduleCount?: number;  // @example 12
  totalLogs?: number;  // @example 1000000
}

export interface PublicLogsSummaryDetailResponse {
  code?: number;
  data?: PublicLogsSummary;
  message?: string;
  timestamp?: string;
}

/** 记录AI自动化决策参数 */
export interface RecordAIDecisionRequest {
  decisionId: string;  // 决策ID | @example ai-dec-001
  input?: Record<string, unknown>;  // 输入
  model: string;  // 模型 | @example risk-scoring-v1
  output?: Record<string, unknown>;  // 输出
  reviewed?: boolean;  // 已复核
  reviewer?: string;  // 复核人
}

export interface RetentionPolicyDetailResponse {
  code?: number;
  data?: RetentionPolicyResponse;
  message?: string;
  timestamp?: string;
}

/** 租户审计日志保留策略配置 */
export interface RetentionPolicyRequest {
  archiveTo?: string;  // 归档目标 | @example minio
  bucket?: string;  // 归档桶名 | @example audit-archive
  days?: number;  // 保留天数 | @example 90
  enabled?: boolean;  // 是否启用自动归档 | @example True
}

export interface RetentionPolicyResponse {
  archiveTo?: string;  // 归档目标 | @example minio
  bucket?: string;  // 归档桶名 | @example audit-archive
  createdAt?: number;  // 创建时间 | @example 1713175800
  days?: number;  // 保留天数 | @example 90
  enabled?: boolean;  // 是否启用自动归档 | @example True
  tenantId?: string;  // 租户ID | @example tenant-1
  updatedAt?: number;  // 更新时间 | @example 1713175800
}

export interface SIEMConnectorDetailResponse {
  code?: number;
  data?: SIEMConnectorResponse;
  message?: string;
  timestamp?: string;
}

export interface SIEMConnectorListResponse {
  code?: number;
  items?: SIEMConnectorResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface SIEMConnectorRequest {
  apiKey?: string;  // API Key | @example tok-xxx
  config?: Record<string, unknown>;  // 扩展配置
  enabled?: boolean;  // 是否启用 | @example True
  endpoint: string;  // 端点 | @example https://splunk.example.com:8088
  index?: string;  // 索引 | @example main
  name: string;  // 名称 | @example Splunk-Prod
  type: "splunk" | "elk" | "cef";  // 类型 | @example splunk
}

export interface SIEMConnectorResponse {
  config?: Record<string, unknown>;  // 扩展配置
  createdAt?: number;  // 创建时间 | @example 1713175800
  enabled?: boolean;  // 是否启用 | @example True
  endpoint?: string;  // 端点 | @example https://...
  id?: string;  // ID | @example siem_abc123
  index?: string;  // 索引 | @example main
  lastTestedAt?: number;  // 最近测试时间
  name?: string;  // 名称 | @example Splunk-Prod
  tenantId?: string;  // 租户ID | @example tenant-1
  testStatus?: string;  // 测试状态 | @example passed
  type?: string;  // 类型 | @example splunk
  updatedAt?: number;  // 更新时间 | @example 1713175800
}

export interface SIEMTestResultResponse {
  message?: string;  // 消息 | @example connection ok
  status?: string;  // 状态 | @example passed
  success?: boolean;  // 是否成功 | @example True
}

/** 安全详情 */
export interface SecurityDetailsResp {
  failedLoginIps?: Record<string, number>;  // 失败登录IP
  suspiciousUsers?: string[];  // 可疑用户
  unusualAccessTimes?: TimeRangeResp[];  // 异常访问时间
}

export interface SecurityReportDetailResponse {
  code?: number;
  data?: SecurityReportResponse;
  message?: string;
  timestamp?: string;
}

/** 安全审计报告 */
export interface SecurityReportResponse {
  details?: SecurityDetailsResp;  // 详情
  generatedAt?: number;  // 生成时间戳 | @example 1713175800
  period?: string;  // 周期 | @example 7d
  recommendations?: string[];  // 建议
  summary?: SecuritySummaryResp;  // 摘要
  topRisks?: SecurityRiskResp[];  // 主要风险
}

/** 单条安全风险 */
export interface SecurityRiskResp {
  count?: number;  // 数量 | @example 15
  description?: string;  // 描述 | @example 检测到暴力破解
  severity?: string;  // 严重程度 | @example high
  type?: string;  // 类型 | @example brute_force
}

/** 安全摘要统计 */
export interface SecuritySummaryResp {
  anomaliesDetected?: number;  // 异常 | @example 10
  blockedIps?: number;  // 被阻止IP | @example 5
  failedLogins?: number;  // 失败登录 | @example 50
  suspiciousActivities?: number;  // 可疑活动 | @example 20
  totalEvents?: number;  // 总事件 | @example 10000
}

export interface ServerLogResponse {
  level?: string;  // @example error
  message?: string;  // @example failed to connect to database
  service?: string;  // @example identity-service
  timestamp?: string;  // @example 2026-06-04T12:00:00Z
  traceId?: string;  // @example a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
  userId?: string;  // @example usr_abc123
}

export interface ServerLogServicesResponse {
  services?: string[];  // @example ['["identity-service"', '"wallet-service"]']
}

/** 时间点统计 */
export interface TimePointResp {
  count?: number;  // 数量 | @example 100
  timestamp?: number;  // 时间戳 | @example 1713175800
}

/** 时间范围 */
export interface TimeRangeResp {
  end?: number;  // 结束时间戳 | @example 1713179400
  start?: number;  // 开始时间戳 | @example 1713175800
}

export interface UpdateAlertStatusRequest {
  status: string;  // @example acknowledged
}

/** 更新异常调查状态 */
export interface UpdateAnomalyStatusRequest {
  assignee?: string;  // 分析师 | @example usr_analyst001
  status: string;  // 状态 | @example investigating
}

export interface UpdateIncidentStatusRequest {
  status: string;  // @example investigating
}

export interface VerificationResultListResponse {
  code?: number;
  items?: VerificationResultResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 后台定时哈希链验证的单租户结果 */
export interface VerificationResultResponse {
  entriesChecked?: number;  // @example 10000
  errorMessage?: string;
  lastHash?: string;  // @example abc123def456...
  lastSequence?: number;  // @example 12345
  tenantId?: string;  // @example tnt_abc123
  valid?: boolean;  // @example True
  validatedAt?: number;  // @example 1713175800
}

export interface VerifyChainDetailResponse {
  code?: number;
  data?: VerifyChainResponse;
  message?: string;
  timestamp?: string;
}

/** 哈希链验证结果 */
export interface VerifyChainResponse {
  brokenAt?: number;  // 断裂位置
  checkedCount?: number;  // 检查数 | @example 10000
  firstHash?: string;  // 首哈希 | @example a1b2c3d4e5f6...
  lastHash?: string;  // 末哈希 | @example f6e5d4c3b2a1...
  message?: string;  // 信息
  valid?: boolean;  // 有效 | @example True
}

export interface SimpleResponse {
  code?: number;
  message?: string;
  timestamp?: string;
}

// ============================================================
// billing-service
// ============================================================

export interface FeatureGate {
  description?: string;  // 功能描述
  enabled?: boolean;  // 当前租户是否启用
  key?: string;  // "nhi", "mfa", "sso", "audit_export"
  name?: string;  // "Non-Human Identities" (展示名)
}

export interface TenantFeatureGateOverride {
  createdAt?: string;
  enabled?: boolean;
  gateKey?: string;
  id?: string;
  tenantId?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface AppBillingEventRequest {
  action: string;  // suspend/resume/delete | @example suspend
}

export interface AppResourcePricingInputDTO {
  includedUnits?: number;  // @example 10000
  overageUnitPrice?: number;  // @example 0.05
  resourceType: string;  // @example api_calls
  unitLabel?: string;  // @example 次
  unitPrice?: number;  // @example 0.01
}

export interface AppResourcePricingResponse {
  id?: string;  // @example arp_001
  includedUnits?: number;  // @example 10000
  overageUnitPrice?: number;  // @example 0.05
  resourceType?: string;  // @example api_calls
  subscriptionAppId?: string;  // @example sa_001
  unitLabel?: string;  // @example 次
  unitPrice?: number;  // @example 0.01
}

export interface AppSubscriptionDetailResponse {
  code?: number;
  data?: SubscriptionAppResponse;
  message?: string;
  timestamp?: string;
}

export interface BalanceDetailResponse {
  code?: number;
  data?: BalanceResponse;
  message?: string;
  timestamp?: string;
}

export interface BalanceResponse {
  balance?: number;  // @example 500
  currency?: string;  // @example CNY
  frozenAmount?: number;  // @example 0
  userId?: string;  // @example usr_abc123
}

export interface BillingRecordListResponse {
  code?: number;
  items?: BillingRecordResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface BillingRecordResponse {
  amount?: number;  // @example 99
  appId?: string;  // @example app_001
  createdAt?: string;  // @example 2026-04-01T00:00:00Z
  currency?: string;  // @example CNY
  description?: string;  // @example 专业版月度订阅
  invoiceNumber?: string;  // @example INV-2026-001
  lineItems?: InvoiceLineItemResponse[];
  recordId?: string;  // @example rec_001
  status?: string;  // @example paid
  tenantId?: string;  // @example tnt_xyz789
  type?: string;  // @example subscription
}

export interface ConfigureAppPricingRequest {
  pricings: AppResourcePricingInputDTO[];
}

export interface CreateBillingRecordInternalRequest {
  amount: number;  // @example 99
  appId?: string;  // @example app_001
  currency?: string;  // @example CNY
  description?: string;  // @example 月度订阅
  invoiceNumber?: string;  // @example INV-2026-001
  paymentMethod?: string;  // @example alipay
  periodEnd: string;  // @example 2026-06-01T00:00:00Z
  periodStart: string;  // @example 2026-05-01T00:00:00Z
  status: string;  // @example paid
  subscriptionId: string;  // @example sub_001
}

export interface CreatePaymentGatewayRequest {
  code: string;  // @example alipay
  config: string;  // @example {"app_id":"123456"}
  name: string;  // @example 支付宝
}

export interface CreatePlanRequest {
  auditLogDays?: number;  // @example 90
  currency?: string;  // @example CNY
  description?: string;  // @example 适用于大型团队
  maxApiRequests?: number;  // @example 100000
  maxBandwidthGb?: number;  // @example 1024
  maxStorageGb?: number;  // @example 100
  maxUsers?: number;  // @example 100
  mfaEnabled?: boolean;  // @example True
  monthlyPrice: number;  // @example 499
  name: string;  // @example 专业版
  plan: string;  // @example pro
  ssoEnabled?: boolean;  // @example True
  supportLevel?: string;  // @example priority
  yearlyPrice: number;  // @example 4999
}

export interface CreateUsageAlertRequest {
  appId?: string;  // @example app_001
  name: string;  // @example API调用量告警
  notificationChannels: string;  // @example email,in_app
  resourceType: string;  // @example api_calls
  thresholdPercent: number;  // @example 80
}

export interface CreditBalanceDetailResponse {
  code?: number;
  data?: CreditBalanceResponse;
  message?: string;
  timestamp?: string;
}

export interface CreditBalanceResponse {
  balance?: number;  // @example 150
  currency?: string;  // @example CNY
  tenantId?: string;  // @example tnt_xyz789
  updatedAt?: string;  // @example 2026-05-12T10:00:00Z
}

export interface CreditNoteDetailResponse {
  code?: number;
  data?: CreditNoteResponse;
  message?: string;
  timestamp?: string;
}

export interface CreditNoteListResponse {
  code?: number;
  items?: CreditNoteResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface CreditNoteRequest {
  amount: number;  // @example 99
  invoiceNumber: string;  // @example INV-2026-001
  reason: string;  // @example 服务取消
}

export interface CreditNoteResponse {
  amount?: number;  // @example 99
  appliedAt?: string;  // @example 2026-04-15T12:00:00Z
  creditNoteNumber?: string;  // @example CN-2026-001
  invoiceNumber?: string;  // @example INV-2026-001
  issuedAt?: string;  // @example 2026-04-15T10:00:00Z
  reason?: string;  // @example 服务取消
  status?: string;  // @example issued
  tenantId?: string;  // @example tnt_abc123
}

export interface CreditTransactionListResponse {
  code?: number;
  items?: CreditTransactionResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface CreditTransactionResponse {
  amount?: number;  // @example 50
  balance?: number;  // @example 150
  createdAt?: string;  // @example 2026-05-12T10:00:00Z
  id?: string;  // @example ctr_001
  remark?: string;  // @example 套餐降级按比例信用
  source?: string;  // @example proration
  sourceId?: string;  // @example sub_xyz789
  tenantId?: string;  // @example tnt_xyz789
  type?: string;  // @example credit
}

export interface CurrentUsageDetailResponse {
  code?: number;
  data?: CurrentUsageResponse;
  message?: string;
  timestamp?: string;
}

export interface CurrentUsageResponse {
  apiCallsToday?: number;  // @example 150
  storageGb?: number;  // @example 2.5
  users?: number;  // @example 8
}

export interface DunningSettingsDetailResponse {
  code?: number;
  data?: DunningSettingsResponse;
  message?: string;
  timestamp?: string;
}

export interface DunningSettingsRequest {
  autoCancelDays?: number;  // @example 30
  emailTemplates?: string;
  gracePeriodDays?: number;  // @example 7
  retrySchedule?: string;  // @example [1,3,7,14]
}

export interface DunningSettingsResponse {
  autoCancelDays?: number;  // @example 30
  createdAt?: string;  // @example 2026-05-12T10:00:00Z
  emailTemplates?: string;
  gracePeriodDays?: number;  // @example 7
  retrySchedule?: string;  // @example [1,3,7,14]
  status?: string;  // @example active
  tenantId?: string;  // @example tnt_xyz789
  updatedAt?: string;  // @example 2026-05-12T10:00:00Z
}

export interface EndpointStatsImportRecord {
  appId?: string;  // @example app_001
  avgLatencyMs?: number;  // @example 12.5
  date: string;  // @example 2026-05-10
  endpoint: string;
  errorCount?: number;  // @example 50
  requestCount?: number;  // @example 15000
}

export interface EndpointStatsImportRequest {
  records: EndpointStatsImportRecord[];
}

export interface EndpointUsageDetailResponse {
  code?: number;
  data?: EndpointUsageListResponse;
  message?: string;
  timestamp?: string;
}

export interface EndpointUsageItem {
  avgLatencyMs?: number;  // @example 12.5
  endpoint?: string;
  errorCount?: number;  // @example 50
  requestCount?: number;  // @example 15000
}

export interface EndpointUsageListResponse {
  appId?: string;  // @example app_001
  days?: number;  // @example 7
  endpoints?: EndpointUsageItem[];
  tenantId?: string;  // @example tnt_xyz789
}

export interface ExecuteRefundDetailResponse {
  code?: number;
  data?: ExecuteRefundResponse;
  message?: string;
  timestamp?: string;
}

export interface ExecuteRefundRequest {
  userId: string;  // @example usr_abc123
}

export interface ExecuteRefundResponse {
  amount?: number;  // @example 99
  refundId?: string;  // @example ref_001
  status?: string;  // @example completed
  walletTransactionId?: string;  // @example txn_def456
}

export interface ExportUserDataRequest {
  userId: string;  // @example usr_abc123
}

export interface ExportUserDataResponse {
  code?: number;
  data?: ExportUserDataResult;
  message?: string;
  timestamp?: string;
}

export interface ExportUserDataResult {
  billingRecords?: BillingRecordResponse[];
  creditBalance?: CreditBalanceResponse;
  creditTransactions?: CreditTransactionResponse[];
  exportedAt?: string;
  meteredBillingRecords?: MeteredBillingExportItem[];
  note?: string;
  subscription?: SubscriptionResponse;
  tenantId?: string;
  usageAlerts?: UsageAlertResponse[];
  usageStats?: UsageStatsExportItem[];
  userId?: string;
}

export interface ExtendTrialRequest {
  extendDays: number;  // @example 14
}

export interface InvoiceDetailResponse {
  code?: number;
  data?: InvoiceResponse;
  message?: string;
  timestamp?: string;
}

export interface InvoiceLineItemResponse {
  amount?: number;  // @example 99
  description?: string;  // @example 专业版月度订阅
  quantity?: number;  // @example 1
  resourceType?: string;  // @example subscription
  taxAmount?: number;  // @example 5.94
  taxRate?: number;  // @example 0.06
  unitPrice?: number;  // @example 99
}

export interface InvoiceResponse {
  amount?: number;  // @example 104.94
  appId?: string;  // @example app_001
  currency?: string;  // @example CNY
  dueDate?: string;  // @example 2026-04-15T00:00:00Z
  invoiceNumber?: string;  // @example INV-2026-001
  issuedAt?: string;  // @example 2026-04-01T00:00:00Z
  lineItems?: InvoiceLineItemResponse[];
  paidAt?: string;  // @example 2026-04-10T15:00:00Z
  status?: string;  // @example issued
  tenantId?: string;  // @example tnt_xyz789
}

export interface ListResponsedto_SubscriptionResponse {
  code?: number;
  items?: SubscriptionResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface MeteredBillingExportItem {
  includedUnits?: number;
  overageAmount?: string;
  overageUnits?: number;
  periodEnd?: string;
  periodStart?: string;
  resourceType?: string;
  status?: string;
  totalUsage?: number;
}

export interface MeteredBillingListResponse {
  code?: number;
  data?: MeteredBillingResponse[];
  message?: string;
  timestamp?: string;
}

export interface MeteredBillingResponse {
  appId?: string;
  id?: string;
  overageAmount?: string;
  overageUnits?: number;
  periodEnd?: string;
  periodStart?: string;
  resourceType?: string;
  status?: string;
  tenantId?: string;
  totalUsage?: number;
}

export interface MeteringReportRequest {
  amount: number;  // @example 1000
  appId?: string;  // @example app_001
  resourceType: string;  // @example api_calls
}

export interface PaymentGatewayDetailResponse {
  code?: number;
  data?: PaymentGatewayResponse;
  message?: string;
  timestamp?: string;
}

export interface PaymentGatewayListResponse {
  code?: number;
  items?: PaymentGatewayResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PaymentGatewayResponse {
  code?: string;  // @example alipay
  config?: string;
  createdAt?: string;  // @example 2026-01-01T00:00:00Z
  id?: string;  // @example pg_001
  name?: string;  // @example 支付宝
  status?: string;  // @example active
  updatedAt?: string;  // @example 2026-04-10T14:20:00Z
}

export interface PlanChangeRequest {
  billingCycle?: string;  // @example monthly
  newPlan: string;  // @example enterprise
}

export interface PlanPricingDetailResponse {}

export interface PlanPricingModelDetailResponse {}

export interface PlanQuotasDetailResponse {
  code?: number;
  data?: PlanQuotasResponse;
  message?: string;
  timestamp?: string;
}

export interface PlanQuotasResponse {
  maxApiRequests?: number;  // @example 100000
  maxBandwidthBytes?: number;  // @example 107374182400
  maxEmailDaily?: number;  // @example 5000
  maxSmsDaily?: number;  // @example 1000
  maxStorageBytes?: number;  // @example 10737418240
  maxUsers?: number;  // @example 500
  name?: string;  // @example Professional
  plan?: string;  // @example pro
}

export interface ProrationCalculateDetailResponse {
  code?: number;
  data?: ProrationCalculateResponse;
  message?: string;
  timestamp?: string;
}

export interface ProrationCalculateRequest {
  billingCycle?: string;  // @example monthly
  newPlan: string;  // @example enterprise
}

export interface ProrationCalculateResponse {
  currency?: string;  // @example CNY
  currentBillingEnd?: string;  // @example 2026-06-01T00:00:00Z
  currentPlan?: string;  // @example pro
  message?: string;  // @example 升级将产生按比例费用 ¥249.50（剩余15天）
  prorationAmount?: number;  // @example 249.5
  remainingDays?: number;  // @example 15
  targetPlan?: string;  // @example enterprise
  tenantId?: string;  // @example tnt_xyz789
}

export interface PublicPlansDetailResponse {}

export interface QuotaCheckDetailResponse {
  code?: number;
  data?: QuotaCheckResponse;
  message?: string;
  timestamp?: string;
}

export interface QuotaCheckInternalRequest {
  appId?: string;  // @example app_001
  requestedAmount: number;  // @example 100
  resourceType: string;  // @example api_calls
}

export interface QuotaCheckResponse {
  allowed?: boolean;  // @example True
  current?: number;  // @example 5000
  limit?: number;  // @example 10000
  message?: string;
  remaining?: number;  // @example 5000
  resourceType?: string;  // @example api_calls
}

export interface RefundApprovalDetailResponse {
  code?: number;
  data?: RefundApprovalResponse;
  message?: string;
  timestamp?: string;
}

export interface RefundApprovalListResponse {
  code?: number;
  items?: RefundApprovalResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface RefundApprovalRequest {
  amount: number;  // @example 99
  invoiceNumber: string;  // @example INV-2026-001
  reason: string;  // @example 服务不满意
  reviewerComments?: string;  // @example 审批通过
  transactionId: string;  // @example txn_abc123
}

export interface RefundApprovalResponse {
  amount?: number;  // @example 99
  approvedAt?: string;  // @example 2026-04-15T14:00:00Z
  approvedBy?: string;  // @example admin@example.com
  invoiceNumber?: string;  // @example INV-2026-001
  refundId?: string;  // @example ref_001
  status?: string;  // @example approved
  transactionId?: string;  // @example txn_abc123
}

export interface RevenueAmortizationDetailResponse {
  code?: number;
  data?: RevenueAmortizationResponse;
  message?: string;
  timestamp?: string;
}

export interface RevenueAmortizationItem {
  amount?: number;  // @example 99
  period?: string;  // @example 2026-04
  status?: string;  // @example recognized
}

export interface RevenueAmortizationResponse {
  amortizedAmount?: number;  // @example 396
  endDate?: string;  // @example 2026-12-31T00:00:00Z
  items?: RevenueAmortizationItem[];
  pendingAmount?: number;  // @example 792
  startDate?: string;  // @example 2026-01-01T00:00:00Z
  subscriptionId?: string;  // @example sub_001
  totalAmount?: number;  // @example 1188
}

export interface SubscribeRequestDTO {
  autoRenew?: boolean;  // @example True
  billingCycle: string;  // @example monthly
  plan: string;  // @example pro
  trialDays?: number;  // @example 14
}

export interface SubscriptionAppResponse {
  appId?: string;  // @example app_001
  createdAt?: string;  // @example 2026-04-01T00:00:00Z
  id?: string;  // @example sa_001
  pricings?: AppResourcePricingResponse[];
  status?: string;  // @example active
  subscriptionId?: string;  // @example sub_001
  tenantId?: string;  // @example tnt_xyz789
}

export interface SubscriptionDetailResponse {
  code?: number;
  data?: SubscriptionResponse;
  message?: string;
  timestamp?: string;
}

export interface SubscriptionResponse {
  adminUserId?: string;  // @example usr_abc123
  amount?: number;  // @example 499
  autoRenew?: boolean;  // @example True
  billingCycle?: string;  // @example monthly
  cancelAtPeriodEnd?: boolean;  // @example False
  currency?: string;  // @example CNY
  currentPeriodEnd?: string;  // @example 2026-02-01T00:00:00Z
  currentPeriodStart?: string;  // @example 2026-01-01T00:00:00Z
  gracePeriodDays?: number;  // @example 7
  planId?: string;  // @example pro
  status?: string;  // @example active
  tenantId?: string;  // @example tnt_xyz789
  trialEndDate?: string;  // @example 2026-01-15T00:00:00Z
}

export interface TaxExportDetailResponse {
  code?: number;
  data?: TaxExportResponse;
  message?: string;
  timestamp?: string;
}

export interface TaxExportListResponse {
  code?: number;
  items?: TaxExportResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface TaxExportResponse {
  downloadUrl?: string;  // @example https://storage.example.com/...
  expiresAt?: string;  // @example 2026-04-16T10:00:00Z
  format?: string;  // @example pdf
  period?: string;  // @example 2026-Q1
  taxReportId?: string;  // @example tax_2026q1
}

export interface TenantStatisticsDetailResponse {
  code?: number;
  data?: TenantStatisticsResponse;
  message?: string;
  timestamp?: string;
}

export interface TenantStatisticsResponse {
  activeUsers?: number;  // @example 45
  appId?: string;  // @example app_001
  mrr?: number;  // @example 99
  retentionRate?: number;  // @example 0.95
  tenantId?: string;  // @example tnt_xyz789
  totalSpend?: number;  // @example 1188
}

export interface TrialActionDetailResponse {
  code?: number;
  data?: TrialActionResult;
  message?: string;
  timestamp?: string;
}

export interface TrialActionResult {
  message?: string;  // @example 试用期已延长14天
  plan?: string;  // @example pro
  status?: string;  // @example active
  tenantId?: string;  // @example tnt_xyz789
  trialEndDate?: string;  // @example 2026-06-01T00:00:00Z
}

export interface UpdatePaymentGatewayRequest {
  config?: string;  // @example {"app_id":"654321"}
  name?: string;  // @example 支付宝国际版
  status?: string;  // @example active
}

export interface UpdatePlanRequest {
  auditLogDays?: number;  // @example 90
  description?: string;  // @example 适用于大型团队
  maxApiRequests?: number;  // @example 100000
  maxBandwidthGb?: number;  // @example 1024
  maxStorageGb?: number;  // @example 100
  maxUsers?: number;  // @example 100
  mfaEnabled?: boolean;  // @example True
  monthlyPrice?: number;  // @example 499
  name?: string;  // @example 专业版
  ssoEnabled?: boolean;  // @example True
  status?: string;  // @example active
  supportLevel?: string;  // @example priority
  yearlyPrice?: number;  // @example 4999
}

export interface UpdateSubscriptionRequestDTO {
  autoRenew?: boolean;  // @example False
  billingCycle?: string;  // @example yearly
  plan?: string;  // @example enterprise
}

export interface UpdateUsageAlertRequest {
  name?: string;
  notificationChannels?: string;
  resourceType?: string;
  status?: string;
  thresholdPercent?: number;
}

export interface UsageAlertDetailResponse {
  code?: number;
  data?: UsageAlertResponse;
  message?: string;
  timestamp?: string;
}

export interface UsageAlertListResponse {
  code?: number;
  items?: UsageAlertResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface UsageAlertResponse {
  appId?: string;  // @example app_001
  createdAt?: string;  // @example 2026-05-01T00:00:00Z
  id?: string;  // @example ua_001
  lastTriggeredAt?: string;  // @example 2026-05-10T08:00:00Z
  name?: string;  // @example API调用量告警
  notificationChannels?: string;  // @example email,in_app
  resourceType?: string;  // @example api_calls
  status?: string;  // @example active
  tenantId?: string;  // @example tnt_xyz789
  thresholdPercent?: number;  // @example 80
  updatedAt?: string;  // @example 2026-05-05T10:00:00Z
}

export interface UsageStatItem {
  limit?: number;  // @example 100
  unit?: string;  // @example 个
  used?: number;  // @example 8
}

export interface UsageStatsDetailResponse {
  code?: number;
  data?: UsageStatsResponse;
  message?: string;
  timestamp?: string;
}

export interface UsageStatsExportItem {
  apiRequests?: number;
  bandwidthUsed?: number;
  date?: string;
  failedLogins?: number;
  loginAttempts?: number;
  mfaVerifications?: number;
  storageUsed?: number;
  userCount?: number;
}

export interface UsageStatsResponse {
  apiCalls?: UsageStatItem;
  appId?: string;  // @example app_001
  periodEnd?: string;  // @example 2026-04-01
  periodStart?: string;  // @example 2026-03-01
  storage?: UsageStatItem;
  tenantId?: string;  // @example tnt_xyz789
  users?: UsageStatItem;
}

export interface UsageTimelineDetailResponse {
  code?: number;
  data?: UsageTimelineResponse;
  message?: string;
  timestamp?: string;
}

export interface UsageTimelinePoint {
  apiRequests?: number;  // @example 15000
  bandwidthGb?: number;  // @example 15
  date?: string;  // @example 2026-05-01
  storageGb?: number;  // @example 2.5
  users?: number;  // @example 120
}

export interface UsageTimelineResponse {
  appId?: string;  // @example app_001
  days?: number;  // @example 30
  tenantId?: string;  // @example tnt_xyz789
  timeline?: UsageTimelinePoint[];
}

export interface FeatureGateCheckRequest {
  gateKey?: string;
}

export interface FeatureGateCheckResult {
  effective?: boolean;
  gateKey?: string;
  planEntitled?: boolean;
  tenantOverride?: boolean;
}

export interface FeatureGateResponse {
  featureGates?: FeatureGate[];
}

export interface OverrideRequest {
  enabled?: boolean;
  gateKey: string;
}

export interface OverrideResponse {
  overrides?: TenantFeatureGateOverride[];
}

// ============================================================
// communication-service
// ============================================================

export interface ChannelRateLimitData {
  maxPerHour?: number;
  maxPerMin?: number;
  provider?: string;
  tenantId?: string;
}

export interface AvailableTemplateListResponse {
  code?: number;
  items?: AvailableTemplateResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface AvailableTemplateResponse {
  channel?: string;  // @example email
  code?: string;  // @example welcome
  isActive?: boolean;  // @example True
  isCustomized?: boolean;  // @example False
  locale?: string;  // @example zh-CN
  name?: string;  // @example 欢迎邮件
  source?: string;  // platform | tenant | @example platform
  subject?: string;
  variables?: string[];
}

/** 批量发送消息的请求参数 */
export interface BulkSendRequest {
  channel: "sms" | "email";  // @example sms
  content: string;  // @example 您的验证码是123456
  recipients: string[];  // @example ['["13800138000"', '"13900139000"]']
  subject?: string;  // @example 通知
  template?: string;  // @example verify_code
  userId?: string;  // @example usr_abc123
  variables?: Record<string, string>;
}

export interface CallbackResultDetailResponse {
  code?: number;
  data?: CallbackResultResponse;
  message?: string;
  timestamp?: string;
}

/** 提供商回调结果 */
export interface CallbackResultResponse {
  provider?: string;  // @example aliyun
  received?: boolean;  // @example True
}

export interface CancelScheduledRequest {
  cancelKey?: string;
}

export interface ChannelHealthDataResponse {
  code?: number;
  data?: ChannelHealthResponse;
  message?: string;
  timestamp?: string;
}

/** 渠道连通性检查结果 */
export interface ChannelHealthResponse {
  channel?: string;  // @example sms
  message?: string;  // @example SMS provider is reachable
  provider?: string;  // @example aliyun
  status?: string;  // @example healthy
}

export interface CloneTemplateToLocaleRequest {
  content?: string;
  subject?: string;
  targetLocale: string;  // @example en-US
}

export interface CommunicationDashboardDataResponse {
  code?: number;
  data?: CommunicationDashboardResponse;
  message?: string;
  timestamp?: string;
}

/** 通信服务各渠道投递统计数据 */
export interface CommunicationDashboardResponse {
  byChannel?: Record<string, number>;
  byStatus?: Record<string, number>;
  delivered?: number;  // @example 980
  deliveryRate?: number;  // @example 0.98
  failed?: number;  // @example 20
  totalSent?: number;  // @example 1000
}

export interface CommunicationLogDetailResponse {
  code?: number;
  data?: CommunicationLogResponse;
  message?: string;
  timestamp?: string;
}

export interface CommunicationLogListResponse {
  code?: number;
  items?: CommunicationLogResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 消息发送日志记录 */
export interface CommunicationLogResponse {
  channel?: string;  // @example sms
  content?: string;  // @example 您的验证码是123456
  createdAt?: string;  // @example 2026-04-15T10:00:00Z
  error?: string;  // @example 发送超时
  id?: string;  // @example log_abc123
  provider?: string;  // @example aliyun
  recipient?: string;  // @example 138****8000
  response?: string;
  sentAt?: string;  // @example 2026-04-15T10:01:00Z
  status?: string;  // @example delivered
  templateId?: string;  // @example tpl_abc123
  tenantId?: string;  // @example tnt_xyz789
  updatedAt?: string;  // @example 2026-04-15T10:00:00Z
  userId?: string;  // @example usr_abc123
}

export interface CreateProviderConfigRequest {
  channel: "sms" | "email" | "push";  // @example sms
  config: string;  // @example {"access_key":"..."}
  priority?: number;  // @example 10
  provider: string;  // @example aliyun
}

/** 注册设备推送令牌的请求参数 */
export interface CreatePushTokenRequest {
  deviceId?: string;  // @example iPhone15-001
  platform: "ios" | "android" | "web" | "desktop";  // @example ios
  token: string;  // @example device_token_xxx
  userId: string;  // @example usr_abc123
}

/** 创建消息模板的请求参数 */
export interface CreateTemplateRequest {
  channel: "sms" | "email" | "push";  // @example sms
  code: string;  // @example verify_code
  content: string;  // @example 您的验证码是{code}，5分钟内有效
  contentType?: string;  // @example text
  description?: string;  // @example 用于发送登录验证码
  format?: string;  // @example simple
  name: string;  // @example 验证码模板
  subject?: string;  // @example 验证码通知
  textContent?: string;  // @example Your code is {code}
  variables?: string[];  // @example ['["code"]']
}

export interface CreateTemplateResponse {
  code?: number;  // @example 0
  data?: MessageTemplateResponse;
  message?: string;  // @example success
}

export interface DataResponseany {
  code?: number;
  data?: unknown;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_PreviewTemplateResponse {
  code?: number;
  data?: PreviewTemplateResponse;
  message?: string;
  timestamp?: string;
}

/** 发送邮件请求参数 */
export interface EmailRequest {
  bcc?: string[];  // 密送 | @example ['manager@example.com']
  cancelKey?: string;  // @example order-123
  cc?: string[];  // 抄送 | @example ['admin@example.com']
  content?: string;  // 内容 | @example <h1>欢迎！</h1>
  isHtml?: boolean;  // HTML格式 | @example False
  sendAt?: string;  // @example 2026-06-07T10:00:00Z
  subject: string;  // 主题 | @example 账户激活邮件
  template?: string;  // 模板 | @example welcome_email
  to: string[];  // 收件人 | @example ['user@example.com']
  userId?: string;  // 用户ID | @example usr_abc123
  variables?: Record<string, string>;  // 变量
}

export interface EraseUserDataRequest {
  userId: string;  // @example usr_abc123
}

export interface ExportUserDataDetailResponse {
  code?: number;
  data?: ExportUserDataResponse;
  message?: string;
  timestamp?: string;
}

export interface InternalSendDetailResponse {
  code?: number;
  data?: InternalSendResponse;
  message?: string;
  timestamp?: string;
}

/** 内部服务间统一发送消息的请求参数 */
export interface InternalSendRequest {
  channel: string;  // @example email
  content?: string;  // @example 您的验证码是123456
  metadata?: Record<string, string>;
  subject?: string;  // @example 账户激活
  template?: string;  // @example welcome
  to: string;  // @example user@example.com
  userId?: string;  // @example usr_abc123
  variables?: Record<string, string>;
}

/** 内部统一发送接口的响应信息 */
export interface InternalSendResponse {
  channel?: string;  // @example email
  messageId?: string;  // @example internal-1234567890
  status?: string;  // @example queued
  to?: string;  // @example user@example.com
}

export interface ListResponsedto_ProviderConfigResponse {
  code?: number;
  items?: ProviderConfigResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface MessageTemplateDetailResponse {
  code?: number;
  data?: MessageTemplateResponse;
  message?: string;
  timestamp?: string;
}

/** 消息模板数据 */
export interface MessageTemplateResponse {
  channel?: string;  // @example sms
  code?: string;  // @example verify_code
  content?: string;  // @example 您的验证码是{code}，5分钟内有效
  contentType?: string;  // @example text
  createdAt?: string;  // @example 2026-04-15T10:00:00Z
  description?: string;  // @example 用于发送登录验证码
  id?: string;  // @example tpl_abc123
  isActive?: boolean;  // @example True
  name?: string;  // @example 验证码模板
  subject?: string;  // @example 验证码通知
  tenantId?: string;  // @example tnt_xyz789
  updatedAt?: string;  // @example 2026-04-15T10:00:00Z
  variables?: string[];  // @example ['["code"]']
  version?: number;  // @example 1
}

export interface OKResponse {
  code?: number;  // @example 0
  message?: string;  // @example success
}

/** 模板预览渲染结果，包含渠道、主题、正文、纯文本版的渲染效果 */
export interface PreviewTemplateResponse {
  channel?: string;  // @example sms
  code?: string;  // @example verify_code
  content?: RenderedContent;
  contentType?: string;  // @example text
  name?: string;  // @example 验证码模板
  subject?: RenderedContent;
  textContent?: RenderedContent;
}

export interface ProviderConfigDataResponse {
  code?: number;
  data?: ProviderConfigResponse;
  message?: string;
  timestamp?: string;
}

export interface ProviderConfigResponse {
  appId?: string;
  channel?: string;
  config?: string;
  createdAt?: string;
  id?: string;
  isActive?: boolean;
  priority?: number;
  provider?: string;
  tenantId?: string;
  updatedAt?: string;
}

/** 发送推送通知请求参数 */
export interface PushRequest {
  body: string;  // 内容 | @example 您有一条新消息
  channel?: string;  // 渠道 | @example ios
  data?: Record<string, unknown>;  // 数据
  deviceToken?: string;  // 设备Token | @example device_token_xxx
  platform?: "all" | "ios" | "android" | "web" | "desktop";  // 平台 | @example all
  title: string;  // 标题 | @example 新消息通知
  userId: string;  // 用户ID | @example usr_abc123
}

export interface PushResultDetailResponse {
  code?: number;
  data?: PushResultResponse;
  message?: string;
  timestamp?: string;
}

/** 推送发送结果 */
export interface PushResultResponse {
  sent?: boolean;  // @example True
  tokensFailed?: number;  // @example 0
  tokensSent?: number;  // @example 2
}

export interface PushTokenDataResponse {
  code?: number;
  data?: PushTokenResponse;
  message?: string;
  timestamp?: string;
}

export interface PushTokenListResponse {
  code?: number;
  items?: PushTokenResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 推送令牌信息 */
export interface PushTokenResponse {
  createdAt?: string;  // @example 2026-04-15T10:00:00Z
  deviceId?: string;  // @example iPhone15-001
  id?: string;  // @example pt_abc123
  isActive?: boolean;  // @example True
  platform?: string;  // @example ios
  userId?: string;  // @example usr_abc123
}

export interface RateLimitsDetailResponse {
  code?: number;
  data?: RateLimitsResponse;
  message?: string;
  timestamp?: string;
}

/** 通信服务各发送渠道的速率限制配置 */
export interface RateLimitsResponse {
  email?: ChannelRateLimitData;
  push?: ChannelRateLimitData;
  sms?: ChannelRateLimitData;
}

export interface RenderedContent {
  error?: string;
  rendered?: string;  // @example 您的验证码是123456，5分钟内有效
}

/** 发送短信请求参数 */
export interface SMSRequest {
  cancelKey?: string;  // @example order-123
  content?: string;  // 内容 | @example 您的验证码是123456
  phone: string;  // 手机号 | @example 13800138000
  sendAt?: string;  // @example 2026-06-07T10:00:00Z
  template?: string;  // 模板 | @example verify_code
  userId?: string;  // 用户ID | @example usr_abc123
  variables?: Record<string, string>;  // 变量
}

export interface TemplateDetailDataResponse {
  code?: number;
  data?: TemplateDetailResponse;
  message?: string;
  timestamp?: string;
}

/** 模板详情数据（包含渲染示例） */
export interface TemplateDetailResponse {
  channel?: string;  // @example sms
  code?: string;  // @example verify_code
  content?: string;  // @example 您的验证码是{code}，5分钟内有效
  contentType?: string;  // @example text
  createdAt?: string;  // @example 2026-04-15T10:00:00Z
  description?: string;  // @example 用于发送登录验证码
  id?: string;  // @example tpl_abc123
  isActive?: boolean;  // @example True
  name?: string;  // @example 验证码模板
  renderExample?: string;  // @example 您的验证码是[code]，5分钟内有效
  subject?: string;  // @example 验证码通知
  tenantId?: string;  // @example tnt_xyz789
  updatedAt?: string;  // @example 2026-04-15T10:00:00Z
  variables?: string[];  // @example ['["code"]']
  version?: number;  // @example 1
}

export interface TemplateListResponse {
  code?: number;
  items?: TemplateResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 模板数据 */
export interface TemplateResponse {
  channel?: string;  // @example sms
  code?: string;  // @example verify_code
  content?: string;  // @example 您的验证码是{code}，5分钟内有效
  contentType?: string;  // @example text
  createdAt?: string;  // @example 2026-04-15T10:00:00Z
  description?: string;  // @example 用于发送登录验证码
  id?: string;  // @example tpl_abc123
  isActive?: boolean;  // @example True
  name?: string;  // @example 验证码模板
  subject?: string;  // @example 验证码通知
  tenantId?: string;  // @example tnt_xyz789
  updatedAt?: string;  // @example 2026-04-15T10:00:00Z
  variables?: string[];  // @example ['["code"]']
  version?: number;  // @example 1
}

export interface TemplateStatsListResponse {
  code?: number;
  items?: TemplateStatsResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface TemplateStatsResponse {
  channel?: string;  // @example sms
  delivered?: number;  // @example 480
  failed?: number;  // @example 20
  templateCode?: string;  // @example verify_code
  totalSent?: number;  // @example 500
}

export interface TemplateVersionListResponse {
  code?: number;
  items?: TemplateVersionResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface TemplateVersionResponse {
  changedBy?: string;  // @example usr_abc123
  channel?: string;  // @example sms
  code?: string;  // @example verify_code
  content?: string;  // @example 您的验证码是{code}，5分钟内有效
  contentType?: string;  // @example text
  createdAt?: string;  // @example 2026-04-15T10:00:00Z
  id?: string;  // @example tv_abc123
  name?: string;  // @example 验证码模板
  subject?: string;  // @example 验证码通知
  templateId?: string;  // @example tpl_abc123
  textContent?: string;
  variables?: string;  // @example ["code"]
  version?: number;  // @example 3
}

export interface UpdateProviderConfigRequest {
  config?: string;
  isActive?: boolean;
  priority?: number;
}

export interface UpdatePushTokenRequest {
  isActive?: boolean;  // @example True
  userId: string;  // @example usr_abc123
}

/** 更新消息模板的请求参数 */
export interface UpdateTemplateRequest {
  content?: string;  // @example 您的验证码是{code}，10分钟内有效
  contentType?: string;  // @example text
  description?: string;  // @example 更新版验证码模板
  format?: string;  // @example go-template
  isActive?: boolean;  // @example True
  name?: string;  // @example 验证码模板v2
  subject?: string;  // @example 验证码通知v2
  textContent?: string;  // @example Your code is {code}, valid for 10 min
  variables?: string[];  // @example ['["code"]']
}

// ============================================================
// compliance-service
// ============================================================

export interface Evidence {
  appId?: string;
  collectedAt?: string;
  collectorId?: string;
  controlId?: string;
  controlType?: string;
  createdAt?: string;
  deletedAt?: DeletedAt;
  description?: string;
  fileUrl?: string;
  id?: string;
  tenantId?: string;
  title?: string;
  updatedAt?: string;
}

export interface AIDecisionItemResponse {
  code?: number;
  data?: AIDecisionResponse;
  message?: string;
  timestamp?: string;
}

export interface AIDecisionListResponse {
  code?: number;
  items?: AIDecisionResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface AIDecisionRequest {
  decisionId: string;  // @example DEC-2026-001
  input?: string;  // @example {"credit_score":720,"amount":5000}
  model: string;  // @example credit_risk_v3
  output?: string;  // @example {"decision":"approved","confidence":0.92}
}

export interface AIDecisionResponse {
  createdAt?: string;  // @example 2026-05-01T10:00:00Z
  decisionId?: string;  // @example DEC-2026-001
  id?: string;  // @example 01JQ...
  input?: string;  // @example {"credit_score":720,"amount":5000}
  model?: string;  // @example credit_risk_v3
  output?: string;  // @example {"decision":"approved","confidence":0.92}
  reviewed?: boolean;  // @example False
  reviewer?: string;  // @example compliance_officer
}

export interface AuditFindingItem {
  assigneeId?: string;  // @example usr_security_lead
  controlId?: string;  // @example 01JQ...
  controlType?: string;  // @example iso27001
  createdAt?: string;  // @example 2026-05-01T10:00:00Z
  description?: string;  // @example A.9.1.2 requires quarterly review, last review 6 months ago
  dueDate?: string;  // @example 2026-06-01T00:00:00Z
  id?: string;  // @example 01JQ...
  remediationPlan?: string;  // @example Establish automated review reminders
  severity?: string;  // @example high
  status?: string;  // @example open
  title?: string;  // @example Access Control Policy Not Reviewed
}

export interface AuditFindingItemResponse {
  code?: number;
  data?: AuditFindingItem;
  message?: string;
  timestamp?: string;
}

export interface AuditFindingListResponse {
  code?: number;
  items?: AuditFindingItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface BreachNotificationItemResponse {
  code?: number;
  data?: BreachNotificationResponse;
  message?: string;
  timestamp?: string;
}

export interface BreachNotificationListResponse {
  code?: number;
  items?: BreachNotificationResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface BreachNotificationRequest {
  affectedUsers?: number;  // @example 1000
  description: string;  // @example 发现未经授权的数据库访问
  severity: string;  // @example high
  title: string;  // @example 数据库泄露事件
}

export interface BreachNotificationResponse {
  affectedUsers?: number;  // @example 1000
  createdAt?: string;  // @example 2026-05-01T10:00:00Z
  description?: string;  // @example Unauthorized database access detected
  id?: string;  // @example 01JQ...
  reportedAt?: string;  // @example 2026-05-01T14:00:00Z
  reportedToDpa?: boolean;  // @example True
  severity?: string;  // @example high
  status?: string;  // @example reported
  title?: string;  // @example Database Breach Incident
}

export interface CertificationItem {
  auditor?: string;
  certificateUrl?: string;
  createdAt?: string;
  criteriaScopes?: string;
  framework?: string;
  id?: string;
  lastAuditedDate?: string;
  nextAuditDate?: string;
  status?: string;
}

export interface CertificationItemResponse {
  code?: number;
  data?: CertificationItem;
  message?: string;
  timestamp?: string;
}

export interface CertificationListResponse {
  code?: number;
  items?: CertificationItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface CleanupRecordListResponse {
  code?: number;
  items?: CleanupRecordResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface CleanupRecordResponse {
  createdAt?: string;  // @example 2026-05-01T10:00:00Z
  dateRange?: string;  // @example 2024-01-01 to 2025-12-31
  id?: string;  // @example 01JQ...
  operatorId?: string;  // @example usr_admin_001
  reason?: string;  // @example Retention policy expired
  recordsCount?: number;  // @example 1500
}

export interface ComplianceProfileResponse {
  aiReviewRequired?: boolean;  // @example False
  autoDeleteEnabled?: boolean;  // @example True
  breachReportThreshold?: number;  // @example 1
  consentTtlYears?: number;  // @example 1
  dataProtectionOfficer?: string;  // @example dpo@example.com
  defaultRetentionDays?: number;  // @example 365
  enabledFrameworks?: string[];  // @example ['["gdpr"', '"iso27001"', '"sox"]']
  maxConcurrentErasures?: number;  // @example 10
  penTestScheduleDays?: number;  // @example 365
  scoreWeights?: string;  // @example {"iso27001":0.25,"soc2":0.15,"gdpr":0.15,"issues":0.25,"pen_test":0.10,"breach":0.10}
  selectedStandards?: string[];  // @example ['["pci_dss_v4"', '"dengbao_l3"]']
  sodAutoInitEnabled?: boolean;  // @example True
  tenantId?: string;  // @example 01JQ...
}

export interface ComplianceScoreResponse {
  grade?: string;  // @example B
  overallScore?: number;  // @example 85.5
  tenantId?: string;
}

export interface ComplianceStatusDetailResponse {
  code?: number;
  data?: ComplianceStatusResponse;
  message?: string;
  timestamp?: string;
}

/** 整体合规状态 */
export interface ComplianceStatusResponse {
  evaluationError?: string;  // 评估错误
  gdprCompliant?: boolean;  // GDPR | @example True
  iso27001Compliant?: boolean;  // ISO27001 | @example True
  lastAuditDate?: string;  // 上次审计 | @example 2026-01-15T00:00:00Z
  nextAuditDate?: string;  // 下次审计 | @example 2026-07-15T00:00:00Z
  openBreaches?: number;  // 开放泄露 | @example 2
  openIssues?: number;  // 未解决问题 | @example 8
  overallStatus?: string;  // 总体状态 | @example non_compliant
  pendingDsar?: number;  // 待处理DSAR | @example 5
  pendingPias?: number;  // 待处理PIA | @example 1
  sodRulesEnabled?: number;  // 启用SoD | @example 3
  soxCompliant?: boolean;  // SOX | @example True
}

/** 用户同意记录 */
export interface ConsentItem {
  consentMethod?: string;  // 同意方式 | @example explicit
  expiredAt?: string;  // 过期时间 | @example 2026-04-16T14:00:00Z
  granted?: boolean;  // 是否同意 | @example True
  grantedAt?: string;  // 同意时间 | @example 2026-04-15T10:00:00Z
  id?: string;  // 同意记录ID | @example consent_001
  purpose?: string;  // 处理目的 | @example marketing_communication
  service?: string;  // 服务名称 | @example newsletter
  userId?: string;  // 用户ID | @example usr_abc123
}

export interface ConsentItemResponse {
  code?: number;
  data?: ConsentItem;
  message?: string;
  timestamp?: string;
}

export interface ConsentListResponse {
  code?: number;
  items?: ConsentItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ControlItemResponse {
  description?: string;  // @example 单因子认证时密码最小长度 12 字符
  id?: string;  // @example pci_8.6.3
  name?: string;  // @example 最小密码长度 (单因子)
  operator?: string;  // @example gte
  parameter?: string;  // @example password_min_length_sfa
  requirement?: string;  // @example 8.6.3
  severity?: string;  // @example critical
  tags?: string[];  // @example ['["password"', '"complexity"]']
  value?: unknown;  // @example 12
}

export interface CreateAuditFindingRequest {
  assigneeId: string;  // @example usr_security_lead
  controlId: string;  // @example 01JQ...
  controlType: string;  // @example iso27001
  description: string;  // @example A.9.1.2 要求每季度审查但上次审查距今已6个月
  dueDate: string;  // @example 2026-06-01T00:00:00Z
  remediationPlan?: string;  // @example 建立自动化审查提醒并在一周内完成审查
  severity: "critical" | "high" | "medium" | "low";  // @example high
  title: string;  // @example 访问控制策略未定期审查
}

export interface CreateCertificationRequest {
  auditor?: string;  // @example Ernst & Young
  certificateUrl?: string;  // @example https://trust.example.com/certs/soc2-2026.pdf
  criteriaScopes?: string;  // @example ["Security","Availability","Confidentiality"]
  framework: string;  // @example SOC2 Type II
  lastAuditedDate?: string;  // @example 2026-03-15
  nextAuditDate?: string;  // @example 2026-09-15
}

/** 用户同意请求参数 */
export interface CreateConsentRequest {
  consentMethod?: string;  // 同意方式 | @example explicit
  granted: boolean;  // 是否同意 | @example True
  purpose: string;  // 目的 | @example marketing_communication
  service: string;  // 服务 | @example newsletter
  userId: string;  // 用户ID | @example usr_abc123
}

/** 创建GDPR数据主体访问请求参数 */
export interface CreateDSARRequest {
  additionalInfo?: string;  // 补充信息 | @example 请提供所有与账户相关的数据
  address?: string;  // 地址 | @example 123 Main St, City
  email?: string;  // 邮箱 | @example user@example.com
  phone?: string;  // 电话 | @example +8613800138000
  type: "access" | "delete" | "portability";  // 请求类型 | @example access
  userId: string;  // 用户ID | @example usr_abc123
}

export interface CreateDengbaoControlRequest {
  category?: string;  // @example 物理安全
  code: string;  // @example G3-01
  description?: string;  // @example 机房应具备防火、防水、防雷等物理防护措施
  evidenceUrl?: string;  // @example https://docs.example.com/dengbao/G3-01
  level: string;  // @example Level 3
  name: string;  // @example 安全物理环境
  status?: string;  // @example non_compliant
}

/** 用户请求删除其数据请求参数 */
export interface CreateErasureRequest {
  confirmationCode?: string;  // 确认码 | @example DELETE-CONFIRM-123
  dataCategories: string[];  // 数据类别 | @example ['["profile"', '"history"]']
  reason?: string;  // 删除原因 | @example 账户不再使用
  userId: string;  // 用户ID | @example usr_abc123
}

export interface CreateEvidenceRequest {
  collectedAt: string;  // @example 2026-05-01T10:00:00Z
  collectorId: string;  // @example usr_auditor_001
  controlId: string;  // @example 01JQ...
  controlType: string;  // @example iso27001
  description?: string;  // @example A.9.1.2 访问控制策略的年度审批记录
  fileUrl: string;  // @example https://docs.example.com/evidence/ac-policy.pdf
  title: string;  // @example 访问控制策略审批记录
}

export interface CreateHIPAAControlRequest {
  category?: string;  // @example Administrative Safeguards
  code: string;  // @example 164.308(a)(1)
  description?: string;  // @example Implement policies and procedures to prevent, detect, contain, and correct security violations
  evidenceUrl?: string;  // @example https://docs.example.com/hipaa/164.308.a.1
  name: string;  // @example Security Management Process
  status?: string;  // @example compliant
}

export interface CreateISO27001ControlRequest {
  category?: string;  // @example 组织控制
  code: string;  // @example A.5.1.1
  description?: string;  // @example 应定义并批准信息安全策略
  evidenceUrl?: string;  // @example https://docs.example.com/iso27001/A.5.1.1
  name: string;  // @example 信息安全策略
  status?: string;  // @example compliant
}

export interface CreateLegalDocumentRequest {
  content: string;  // @example [{"title":"1. 引言","body":"..."}]
  docType: string;  // @example terms
  effectiveAt?: string;  // @example 2026-06-09T00:00:00Z
  lang: string;  // @example zh-CN
  tenantId?: string;  // @example 01JQ...（空=平台级）
  title: string;  // @example 服务条款
  version: string;  // @example v1
}

/** 用户自助提交数据主体访问请求（user_id 从 JWT 提取） */
export interface CreateMyDSARRequest {
  email?: string;  // 邮箱 | @example user@example.com
  type: "access" | "delete" | "portability";  // 请求类型 | @example access
}

export interface CreatePCIDSSControlRequest {
  category?: string;  // @example Build and Maintain a Secure Network
  code: string;  // @example Req.1.1
  description?: string;  // @example Install and maintain a firewall configuration to protect cardholder data
  evidenceUrl?: string;  // @example https://docs.example.com/pcidss/Req.1.1
  name: string;  // @example Install and maintain a firewall
  status?: string;  // @example compliant
}

export interface CreatePIPLControlRequest {
  category?: string;  // @example 个人信息处理规则
  code: string;  // @example Art.13
  description?: string;  // @example 处理个人信息前应告知并取得个人同意
  evidenceUrl?: string;  // @example https://docs.example.com/pipl/Art.13
  name: string;  // @example 告知-同意规则
  status?: string;  // @example compliant
}

export interface CreatePSD2ControlRequest {
  category?: string;  // @example Security Measures
  code: string;  // @example Art.95.1
  description?: string;  // @example Implement strong customer authentication for electronic payment transactions
  evidenceUrl?: string;  // @example https://docs.example.com/psd2/Art.95.1
  name: string;  // @example Strong Customer Authentication
  status?: string;  // @example compliant
}

export interface CreatePenTestReportRequest {
  conductedAt: string;  // @example 2026-04-01T00:00:00Z
  findings?: number;  // @example 5
  nextTestDate: string;  // @example 2026-07-01T00:00:00Z
  severity: string;  // @example medium
  summary: string;  // @example Security assessment summary
  title: string;  // @example Q1 2026 Penetration Test
}

export interface CreateRegulatoryWatchItemRequest {
  category: string;  // @example Data Protection
  effectiveDate: string;  // @example 2026-06-01T00:00:00Z
  region: string;  // @example EU
  regulation: string;  // @example GDPR Art. 17
  summary: string;  // @example New right to erasure requirements
  title: string;  // @example GDPR Enforcement Update
}

/** 创建数据保留策略请求参数 */
export interface CreateRetentionPolicyRequest {
  autoDelete?: boolean;  // 自动删除 | @example True
  dataType: string;  // 数据类型 | @example user_activity_logs
  legalBasis: string;  // 法律依据 | @example 合同义务
  name: string;  // 策略名称 | @example 用户日志保留策略
  purpose: string;  // 目的 | @example 安全审计
  retentionPeriodDays: number;  // 保留天数 | @example 365
}

export interface CreateSOXITGCControlRequest {
  controlId: string;  // @example ITGC-001
  controlType: string;  // @example preventive
  description?: string;  // @example Ensures only authorized personnel have access
  name: string;  // @example Access Control
}

export interface CreateSoDRuleRequest {
  description: string;
  enabled?: boolean;
  name: string;
  rolesA: string;
  rolesB: string;
}

export interface CreateSubProcessorRequest {
  applicableServices: string;  // @example Cloud Infrastructure
  category?: string;  // @example infrastructure
  complianceLinks?: string;  // @example https://aws.amazon.com/compliance/
  entityName: string;  // @example Amazon Web Services EMEA SARL
  locations?: string;  // @example ["EU (Frankfurt)","US (Virginia)"]
  purpose?: string;  // @example Infrastructure Hosting
  subjectMatter?: string;  // @example Customer data stored on cloud infrastructure
  transferMechanism?: string;  // @example Standard Contractual Clauses
}

export interface CrossBorderTransferItemResponse {
  code?: number;
  data?: CrossBorderTransferResponse;
  message?: string;
  timestamp?: string;
}

export interface CrossBorderTransferListResponse {
  code?: number;
  items?: CrossBorderTransferResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface CrossBorderTransferResponse {
  createdAt?: string;  // @example 2026-05-01T10:00:00Z
  dataCategory?: string;  // @example User Personal Data
  id?: string;  // @example 01JQ...
  legalBasis?: string;  // @example Standard Contractual Clauses
  originRegion?: string;  // @example EU
  status?: string;  // @example approved
  targetRegion?: string;  // @example US
}

export interface CurrentConfigRequest {
  parameters?: Record<string, unknown>;
}

/** GDPR数据主体访问请求记录 */
export interface DSARItem {
  completedAt?: string;  // 完成时间 | @example 2026-04-20T14:00:00Z
  createdAt?: string;  // 创建时间 | @example 2026-04-15T10:00:00Z
  id?: string;  // DSAR ID | @example dsar_001
  status?: string;  // 状态 | @example pending
  type?: string;  // 请求类型 | @example access
  userId?: string;  // 用户ID | @example usr_abc123
}

export interface DSARItemResponse {
  code?: number;
  data?: DSARItem;
  message?: string;
  timestamp?: string;
}

export interface DSARListResponse {
  code?: number;
  items?: DSARItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface DSARStatusDetailResponse {
  code?: number;
  data?: DSARStatusResponse;
  message?: string;
  timestamp?: string;
}

/** DSAR 状态跟踪响应 */
export interface DSARStatusResponse {
  completedAt?: string;  // 完成时间 | @example 2026-04-20T14:00:00Z
  createdAt?: string;  // 创建时间 | @example 2026-04-15T10:00:00Z
  id?: string;  // DSAR ID | @example dsar_001
  status?: string;  // 状态 | @example processing
  type?: string;  // 请求类型 | @example access
}

export interface DataClassificationItemResponse {
  code?: number;
  data?: DataClassificationResponse;
  message?: string;
  timestamp?: string;
}

export interface DataClassificationListResponse {
  code?: number;
  items?: DataClassificationResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface DataClassificationRequest {
  classification: string;  // @example confidential
  dataCategory: string;  // @example 用户个人资料
  description?: string;  // @example 包含姓名、地址、联系方式等
  retentionRequired?: boolean;  // @example True
}

export interface DataClassificationResponse {
  classification?: string;  // @example confidential
  createdAt?: string;  // @example 2026-05-01T10:00:00Z
  dataCategory?: string;  // @example User Personal Data
  description?: string;  // @example Contains name, address, contact info
  id?: string;  // @example 01JQ...
  retentionRequired?: boolean;  // @example True
}

export interface DataResponsearray_dto_ScoreSnapshotItem {
  code?: number;
  data?: ScoreSnapshotItem[];
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_ComplianceProfileResponse {
  code?: number;
  data?: ComplianceProfileResponse;
  message?: string;
  timestamp?: string;
}

export interface DengbaoControlItem {
  category?: string;  // @example 物理安全
  controlId?: string;  // @example G3-01
  controlName?: string;  // @example 安全物理环境
  evidenceUrl?: string;  // @example https://docs.example.com/...
  id?: string;  // @example 01JQ...
  lastReviewed?: string;  // @example 2026-04-01T00:00:00Z
  status?: string;  // @example non_compliant
}

export interface DengbaoControlItemResponse {
  code?: number;
  data?: DengbaoControlItem;
  message?: string;
  timestamp?: string;
}

export interface DengbaoControlListResponse {
  code?: number;
  items?: DengbaoControlItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 数据删除请求记录 */
export interface ErasureItem {
  completedAt?: string;  // 完成时间 | @example 2026-04-20T14:00:00Z
  createdAt?: string;  // 创建时间 | @example 2026-04-15T10:00:00Z
  dataCategories?: string[];  // 数据类别 | @example ['["profile"', '"history"]']
  id?: string;  // 删除请求ID | @example erasure_001
  reason?: string;  // 删除原因 | @example 账户不再使用
  status?: string;  // 状态 | @example processing
  userId?: string;  // 用户ID | @example usr_abc123
}

export interface ErasureItemResponse {
  code?: number;
  data?: ErasureItem;
  message?: string;
  timestamp?: string;
}

export interface ErasureListResponse {
  code?: number;
  items?: ErasureItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ErrorResponse {
  code?: number;  // @example 400
  message?: string;  // @example invalid request
}

export interface EvidenceItem {
  collectedAt?: string;  // @example 2026-05-01T10:00:00Z
  collectorId?: string;  // @example usr_auditor_001
  controlId?: string;  // @example 01JQ...
  controlType?: string;  // @example iso27001
  createdAt?: string;  // @example 2026-05-01T10:00:00Z
  description?: string;  // @example Annual approval record for A.9.1.2
  fileUrl?: string;  // @example https://docs.example.com/evidence/ac-policy.pdf
  id?: string;  // @example 01JQ...
  title?: string;  // @example Access Control Policy Approval
}

export interface EvidenceItemResponse {
  code?: number;
  data?: EvidenceItem;
  message?: string;
  timestamp?: string;
}

export interface EvidenceListResponse {
  code?: number;
  items?: EvidenceItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface GapReportResponse {
  criticalGaps?: number;  // @example 2
  highGaps?: number;  // @example 3
  lowGaps?: number;  // @example 0
  mediumGaps?: number;  // @example 1
  overallScore?: number;  // @example 75
  parameters?: ParameterGapItem[];
  standards?: string[];
}

export interface HIPAAControlItem {
  category?: string;  // @example Administrative Safeguards
  controlId?: string;  // @example 164.308(a)(1)
  controlName?: string;  // @example Security Management Process
  evidenceUrl?: string;  // @example https://docs.example.com/...
  id?: string;  // @example 01JQ...
  lastReviewed?: string;  // @example 2026-04-01T00:00:00Z
  status?: string;  // @example compliant
}

export interface HIPAAControlItemResponse {
  code?: number;
  data?: HIPAAControlItem;
  message?: string;
  timestamp?: string;
}

export interface HIPAAControlListResponse {
  code?: number;
  items?: HIPAAControlItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** ISO 27001安全控制项 */
export interface ISO27001ControlItem {
  category?: string;  // 类别 | @example 组织安全
  controlId?: string;  // 控制ID | @example A.5.1.1
  controlName?: string;  // 控制名称 | @example 信息安全策略
  evidenceUrl?: string;  // 证据 | @example https://docs.example.com/...
  id?: string;  // 主键ID | @example 01JQ...
  lastReviewed?: string;  // 审查时间 | @example 2026-04-01T00:00:00Z
  status?: string;  // 状态 | @example implemented
}

export interface ISO27001ControlItemResponse {
  code?: number;
  data?: ISO27001ControlItem;
  message?: string;
  timestamp?: string;
}

export interface ISO27001ControlListResponse {
  code?: number;
  items?: ISO27001ControlItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface LegalDocumentItem {
  content?: string;  // @example [{"title":"1. 引言","body":"..."}]
  docType?: string;  // @example terms
  effectiveAt?: string;  // @example 2026-06-09T00:00:00Z
  id?: string;  // @example 01JQ...
  lang?: string;  // @example zh-CN
  status?: string;  // @example published
  tenantId?: string;
  title?: string;  // @example 服务条款
  version?: string;  // @example v1
}

export interface LegalDocumentItemResponse {
  code?: number;
  data?: LegalDocumentItem;
  message?: string;
  timestamp?: string;
}

export interface ListLegalDocumentsResponse {
  code?: number;
  items?: LegalDocumentItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsecompliance_Evidence {
  code?: number;
  items?: Evidence[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface OverrideItem {
  createdAt?: string;  // @example 2026-06-04T10:00:00Z
  createdBy?: string;  // @example admin_xxx
  parameter?: string;  // @example password_min_length_sfa
  reason?: string;  // @example 内部安全要求
  value?: unknown;  // @example 16
}

export interface OverrideListResponse {
  overrides?: OverrideItem[];
}

export interface PCIDSSControlItem {
  category?: string;  // @example Build and Maintain a Secure Network
  controlId?: string;  // @example Req.1.1
  controlName?: string;  // @example Install and maintain a firewall
  evidenceUrl?: string;  // @example https://docs.example.com/...
  id?: string;  // @example 01JQ...
  lastReviewed?: string;  // @example 2026-04-01T00:00:00Z
  status?: string;  // @example compliant
}

export interface PCIDSSControlItemResponse {
  code?: number;
  data?: PCIDSSControlItem;
  message?: string;
  timestamp?: string;
}

export interface PCIDSSControlListResponse {
  code?: number;
  items?: PCIDSSControlItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PIAItemResponse {
  code?: number;
  data?: PIAResponse;
  message?: string;
  timestamp?: string;
}

export interface PIAListResponse {
  code?: number;
  items?: PIAResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PIARequest {
  data?: string;  // @example {"processing_activity":"用户行为分析"}
  description: string;  // @example 评估用户画像功能的隐私风险
  title: string;  // @example 新用户画像功能PIA
}

export interface PIAResponse {
  createdAt?: string;  // @example 2026-05-01T10:00:00Z
  description?: string;  // @example Privacy impact assessment for user profiling feature
  id?: string;  // @example 01JQ...
  status?: string;  // @example completed
  title?: string;  // @example New User Profiling PIA
}

export interface PIPLControlItem {
  category?: string;  // @example 个人信息处理规则
  controlId?: string;  // @example Art.13
  controlName?: string;  // @example 告知-同意规则
  evidenceUrl?: string;  // @example https://docs.example.com/...
  id?: string;  // @example 01JQ...
  lastReviewed?: string;  // @example 2026-04-01T00:00:00Z
  status?: string;  // @example compliant
}

export interface PIPLControlItemResponse {
  code?: number;
  data?: PIPLControlItem;
  message?: string;
  timestamp?: string;
}

export interface PIPLControlListResponse {
  code?: number;
  items?: PIPLControlItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PSD2ControlItem {
  category?: string;  // @example Security Measures
  controlId?: string;  // @example Art.95.1
  controlName?: string;  // @example Strong Customer Authentication
  evidenceUrl?: string;  // @example https://docs.example.com/...
  id?: string;  // @example 01JQ...
  lastReviewed?: string;  // @example 2026-04-01T00:00:00Z
  status?: string;  // @example compliant
}

export interface PSD2ControlItemResponse {
  code?: number;
  data?: PSD2ControlItem;
  message?: string;
  timestamp?: string;
}

export interface PSD2ControlListResponse {
  code?: number;
  items?: PSD2ControlItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ParameterGapItem {
  compliant?: boolean;  // @example False
  controlRef?: string;  // @example pci_8.6.3
  current?: unknown;  // @example 8
  description?: string;  // @example 最小密码长度 (单因子)
  operator?: string;  // @example gte
  parameter?: string;  // @example password_min_length_sfa
  required?: unknown;  // @example 12
  severity?: string;  // @example critical
  standard?: string;  // @example pci_dss_v4
}

/** 安全渗透测试报告 */
export interface PenTestReportItem {
  findings?: number;  // 发现问题数 | @example 5
  nextTestDate?: string;  // 下次测试 | @example 2026-07-01T00:00:00Z
  reportId?: string;  // 报告ID | @example pentest_2026q1
  severity?: string;  // 严重级别 | @example medium
  testedAt?: string;  // 测试时间 | @example 2026-04-01T00:00:00Z
  title?: string;  // 标题 | @example 2026年Q1渗透测试报告
}

export interface PenTestReportItemResponse {
  code?: number;
  data?: PenTestReportItem;
  message?: string;
  timestamp?: string;
}

export interface PenTestReportListResponse {
  code?: number;
  items?: PenTestReportItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PrivacyPolicyDetailResponse {
  code?: number;
  data?: PrivacyPolicyResponse;
  message?: string;
  timestamp?: string;
}

export interface PrivacyPolicyListResponse {
  code?: number;
  items?: PrivacyPolicyVersionItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 隐私政策版本信息（公开） */
export interface PrivacyPolicyResponse {
  content?: string;  // 政策内容 | @example # 隐私政策 最后更新: 2026-01-01 ...
  effectiveAt?: string;  // 生效时间 | @example 2026-01-15T00:00:00Z
  publishedAt?: string;  // 发布时间 | @example 2026-01-01T00:00:00Z
  summary?: string;  // 摘要 | @example 本隐私政策说明我们如何收集和使用您的个人数据
  version?: string;  // 版本号 | @example 1.0
}

/** 隐私政策版本历史记录（公开） */
export interface PrivacyPolicyVersionItem {
  effectiveAt?: string;  // 生效时间 | @example 2026-04-15T00:00:00Z
  publishedAt?: string;  // 发布时间 | @example 2026-04-01T00:00:00Z
  summary?: string;  // 摘要 | @example 新增数据传输附录
  version?: string;  // 版本号 | @example 2.0
}

export interface PublicAuditFinding {
  category?: string;  // @example access_control
  controlType?: string;  // @example iso27001
  createdAt?: string;  // @example 2026-04-15T10:00:00Z
  severity?: string;  // @example high
  status?: string;  // @example open
  title?: string;  // @example 访问控制策略审查
}

export interface PublicAuditFindingListResponse {
  code?: number;
  items?: PublicAuditFinding[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicBreachNotification {
  affectedUsersRange?: string;  // @example <100
  description?: string;  // @example 发现并修复了数据库访问配置问题
  disclosedAt?: string;  // @example 2026-04-20T10:00:00Z
  reportedToDpa?: boolean;  // @example True
  severity?: string;  // @example high
  title?: string;  // @example 数据库未授权访问
}

export interface PublicBreachNotificationListResponse {
  code?: number;
  items?: PublicBreachNotification[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicCertification {
  auditor?: string;  // @example Ernst & Young
  certificateUrl?: string;  // @example https://trust.example.com/certs/soc2-2026.pdf
  criteriaScopes?: string;  // @example ["Security","Availability","Confidentiality"]
  framework?: string;  // @example SOC2 Type II
  lastAuditedDate?: string;  // @example 2026-03-15
  nextAuditDate?: string;  // @example 2026-09-15
}

export interface PublicCertificationListResponse {
  code?: number;
  items?: PublicCertification[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicComplianceStatusDetailResponse {
  code?: number;
  data?: PublicComplianceStatusResponse;
  message?: string;
  timestamp?: string;
}

export interface PublicComplianceStatusResponse {
  frameworksEnabled?: string[];  // @example ['["gdpr"', '"iso27001"', '"sox"]']
  gdprCompliant?: boolean;  // @example True
  iso27001Compliant?: boolean;  // @example True
  lastAuditDate?: string;  // @example 2026-03-15
  nextAuditDate?: string;  // @example 2026-09-15
  openIssuesRange?: string;  // @example 1-5
  overallStatus?: string;  // @example compliant
  soxCompliant?: boolean;  // @example True
}

export interface PublicCrossBorderTransfer {
  dataCategory?: string;  // @example 用户个人资料
  legalBasis?: string;  // @example Standard Contractual Clauses
  originRegion?: string;  // @example EU
  targetRegion?: string;  // @example US
}

export interface PublicCrossBorderTransferListResponse {
  code?: number;
  items?: PublicCrossBorderTransfer[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicDataClassification {
  classification?: string;  // @example confidential
  dataCategory?: string;  // @example 用户个人资料
  description?: string;  // @example 包含姓名、地址、联系方式等
  retentionRequired?: boolean;  // @example True
}

export interface PublicDataClassificationListResponse {
  code?: number;
  items?: PublicDataClassification[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicDengbaoControl {
  category?: string;  // @example 物理安全
  controlId?: string;  // @example G3-01
  controlName?: string;  // @example 安全物理环境
  status?: string;  // @example non_compliant
}

export interface PublicDengbaoListResponse {
  code?: number;
  items?: PublicDengbaoControl[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicHIPAAAListResponse {
  code?: number;
  items?: PublicHIPAAControl[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicHIPAAControl {
  category?: string;  // @example Administrative Safeguards
  controlId?: string;  // @example 164.308(a)(1)
  controlName?: string;  // @example Security Management Process
  status?: string;  // @example compliant
}

export interface PublicISO27001Control {
  category?: string;  // @example 组织安全
  controlId?: string;  // @example A.5.1.1
  controlName?: string;  // @example 信息安全策略
  status?: string;  // @example implemented
}

export interface PublicISO27001ControlListResponse {
  code?: number;
  items?: PublicISO27001Control[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicLegalDocument {
  content?: string;  // @example [{"title":"1. 服务说明","body":"..."}]
  docType?: string;  // @example terms
  effectiveAt?: string;  // @example 2026-06-09T00:00:00Z
  id?: string;  // @example 01JQ...
  lang?: string;  // @example zh-CN
  status?: string;  // @example published
  title?: string;  // @example 服务条款
  updatedAt?: string;  // @example 2026-06-09T00:00:00Z
  version?: string;  // @example v1
}

export interface PublicPCIDSSControl {
  category?: string;  // @example Build and Maintain a Secure Network
  controlId?: string;  // @example Req.1.1
  controlName?: string;  // @example Install and maintain a firewall
  status?: string;  // @example compliant
}

export interface PublicPCIListResponse {
  code?: number;
  items?: PublicPCIDSSControl[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicPIA {
  createdAt?: string;  // @example 2026-04-15T10:00:00Z
  description?: string;  // @example 评估新功能的隐私风险
  status?: string;  // @example completed
  title?: string;  // @example 新功能隐私影响评估
}

export interface PublicPIAListResponse {
  code?: number;
  items?: PublicPIA[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicPIPLControl {
  category?: string;  // @example 个人信息处理规则
  controlId?: string;  // @example Art.13
  controlName?: string;  // @example 告知-同意规则
  status?: string;  // @example compliant
}

export interface PublicPIPLListResponse {
  code?: number;
  items?: PublicPIPLControl[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicPSD2Control {
  category?: string;  // @example Security Measures
  controlId?: string;  // @example Art.95.1
  controlName?: string;  // @example Strong Customer Authentication
  status?: string;  // @example compliant
}

export interface PublicPSD2ListResponse {
  code?: number;
  items?: PublicPSD2Control[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicPenTestReport {
  findings?: number;  // @example 5
  nextTestAt?: string;  // @example 2026-06-01T00:00:00Z
  severity?: string;  // @example medium
  summary?: string;  // @example Quarterly penetration test completed successfully
  testedAt?: string;  // @example 2026-03-01T00:00:00Z
  title?: string;  // @example 2026 Q1 Penetration Test
}

export interface PublicPenTestReportListResponse {
  code?: number;
  items?: PublicPenTestReport[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicSecurityScoreResponse {
  code?: number;
  data?: SecurityScore;
  message?: string;
  timestamp?: string;
}

export interface PublicSubProcessor {
  applicableServices?: string;  // @example Cloud Infrastructure
  category?: string;  // @example infrastructure
  complianceLinks?: string;  // @example https://aws.amazon.com/compliance/
  entityName?: string;  // @example Amazon Web Services EMEA SARL
  locations?: string;  // @example ["EU (Frankfurt)","US (Virginia)"]
  purpose?: string;  // @example Infrastructure Hosting
  subjectMatter?: string;  // @example Customer data stored on cloud infrastructure
  transferMechanism?: string;  // @example Standard Contractual Clauses
}

export interface PublicSubProcessorListResponse {
  code?: number;
  items?: PublicSubProcessor[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ReadinessReportResponse {
  complianceRate?: number;  // @example 77.8
  failedControls?: ParameterGapItem[];
  passedControls?: number;  // @example 7
  readyForAudit?: boolean;  // @example False
  recommendations?: string[];
  standardId?: string;  // @example pci_dss_v4
  standardName?: string;  // @example PCI DSS v4.0.1
  totalControls?: number;  // @example 9
}

/** 法规动态更新 */
export interface RegulatoryUpdateItem {
  affectedServices?: string[];  // 受影响服务 | @example ['["identity"', '"profile"]']
  effectiveDate?: string;  // 生效日期 | @example 2026-06-01T00:00:00Z
  impactLevel?: string;  // 影响级别 | @example high
  jurisdiction?: string;  // 管辖 | @example EU
  regulation?: string;  // 法规名称 | @example GDPR Art. 17
  summary?: string;  // 摘要 | @example 新增数据删除权利的具体要求
  updateId?: string;  // 更新ID | @example reg_001
}

export interface RegulatoryWatchItemResponse {
  code?: number;
  data?: RegulatoryUpdateItem;
  message?: string;
  timestamp?: string;
}

export interface RegulatoryWatchListResponse {
  code?: number;
  items?: RegulatoryUpdateItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ResolvedParamItem {
  mergeRule?: string;  // @example max
  overridden?: boolean;  // @example False
  overrideValue?: unknown;
  severity?: string;  // @example critical
  source?: string[];  // @example ['["pci_dss_v4"', '"dengbao_l3"]']
  value?: unknown;
}

export interface ResolvedPolicyResponse {
  parameters?: Record<string, ResolvedParamItem>;
  resolvedAt?: string;  // @example 2026-06-04T10:00:00Z
  standards?: string[];  // @example ['["pci_dss_v4"', '"dengbao_l3"]']
  tenantId?: string;
  version?: string;  // @example a1b2c3d4
}

/** 数据保留策略 */
export interface RetentionPolicyItem {
  dataType?: string;  // 数据类型 | @example user_activity_logs
  legalBasis?: string;  // 法律依据 | @example 合同义务
  policyId?: string;  // 策略ID | @example ret_001
  purpose?: string;  // 保留目的 | @example 安全审计
  retentionPeriodDays?: number;  // 保留天数 | @example 365
  status?: string;  // 状态 | @example active
}

export interface RetentionPolicyItemResponse {
  code?: number;
  data?: RetentionPolicyItem;
  message?: string;
  timestamp?: string;
}

export interface RetentionPolicyListResponse {
  code?: number;
  items?: RetentionPolicyItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface RetentionPolicyPublicListResponse {
  code?: number;
  items?: RetentionPolicyPublicResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 数据保留策略公示信息（公开） */
export interface RetentionPolicyPublicResponse {
  dataCategory?: string;  // 数据类别 | @example user_profile
  description?: string;  // 说明 | @example 用户账户相关数据, 保留至账户注销后365天
  legalBasis?: string;  // 法律依据 | @example GDPR Art.6(1)(b) - 合同必要性
  retentionDays?: number;  // 保留天数 | @example 365
}

export interface ReviewAIDecisionRequest {
  reviewed: boolean;
  reviewer: string;
}

/** 撤回用户同意请求参数 */
export interface RevokeConsentRequest {
  purpose: string;  // 处理目的 | @example marketing
  reason?: string;  // 撤回原因 | @example 不再希望接收营销邮件
  userId: string;  // 用户ID | @example usr_abc123
}

/** SOX法案IT一般控制项 */
export interface SOXITGCItem {
  controlId?: string;  // 控制ID | @example IT-001
  controlType?: string;  // 控制类型 | @example preventive
  description?: string;  // 描述 | @example 访问权限管理
  lastTestDate?: string;  // 测试日期 | @example 2026-04-01T00:00:00Z
  status?: string;  // 状态 | @example effective
  testResult?: string;  // 测试结果 | @example 通过
}

export interface SOXITGCItemResponse {
  code?: number;
  data?: SOXITGCItem;
  message?: string;
  timestamp?: string;
}

export interface SOXITGCListResponse {
  code?: number;
  items?: SOXITGCItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ScoreSnapshotItem {
  appId?: string;
  id?: string;
  openBreaches?: number;
  openIssues?: number;
  overallStatus?: string;
  pendingDsar?: number;
  pendingPias?: number;
  score?: number;
  snapshotDate?: string;
  tenantId?: string;
}

export interface SecurityScore {
  calculatedAt?: string;  // @example 2026-05-09T12:00:00Z
  dimensions?: SecurityScoreDim[];
  grade?: string;  // @example A
  maxScore?: number;  // @example 100
  methodologyVersion?: string;  // @example v1.0
  overallScore?: number;  // @example 94
}

export interface SecurityScoreDim {
  name?: string;  // @example iso27001_coverage
  score?: number;  // @example 98
  weight?: number;  // @example 0.3
}

export interface SoDCheckResponse {
  checkedAt?: string;
  isCompliant?: boolean;
  rules?: SoDRuleResult[];
  tenantId?: string;
  totalRules?: number;
  violations?: number;
}

export interface SoDRuleItemResponse {
  code?: number;
  data?: SoDRuleResponse;
  message?: string;
  timestamp?: string;
}

export interface SoDRuleListResponse {
  code?: number;
  items?: SoDRuleResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface SoDRuleResponse {
  description?: string;  // @example Finance and Audit roles must not be held by the same user
  enabled?: boolean;  // @example True
  id?: string;  // @example 01JQ...
  name?: string;  // @example Finance-Audit SoD
  rolesA?: string;  // @example role_finance_admin
  rolesB?: string;  // @example role_audit
}

export interface SoDRuleResult {
  affectedUsers?: string[];
  description?: string;
  isViolated?: boolean;
  ruleId?: string;
  ruleName?: string;
}

export interface StandardDetailResponse {
  category?: string;  // @example financial
  controls?: ControlItemResponse[];
  description?: string;  // @example 支付卡行业数据安全标准
  id?: string;  // @example pci_dss_v4
  name?: string;  // @example PCI DSS v4.0.1
  version?: string;  // @example 4.0.1
}

export interface StandardItemResponse {
  category?: string;  // @example financial
  description?: string;  // @example 支付卡行业数据安全标准
  id?: string;  // @example pci_dss_v4
  name?: string;  // @example PCI DSS v4.0.1
  version?: string;  // @example 4.0.1
}

export interface StandardsUpdatedResponse {
  parameterCount?: number;
  resolvedAt?: string;
  standards?: string[];
}

export interface SubProcessorItem {
  applicableServices?: string;
  category?: string;
  complianceLinks?: string;
  createdAt?: string;
  entityName?: string;
  id?: string;
  locations?: string;
  purpose?: string;
  status?: string;
  subjectMatter?: string;
  transferMechanism?: string;
}

export interface SubProcessorItemResponse {
  code?: number;
  data?: SubProcessorItem;
  message?: string;
  timestamp?: string;
}

export interface SubProcessorListResponse {
  code?: number;
  items?: SubProcessorItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface TenantStandardsRequest {
  standards: string[];  // @example ['["pci_dss_v4"', '"dengbao_l3"]']
}

export interface UpdateAIDecisionRequest {
  decisionId?: string;  // @example DEC-2026-002
  input?: string;  // @example {"credit_score":680}
  model?: string;  // @example credit_risk_v3
  output?: string;  // @example {"decision":"rejected"}
}

export interface UpdateAuditFindingRequest {
  assigneeId?: string;
  description?: string;
  dueDate?: string;  // @example 2026-06-15T00:00:00Z
  remediationPlan?: string;
  severity?: string;  // @example high
  status?: string;  // @example in_progress
  title?: string;  // @example 访问控制策略未定期审查
}

export interface UpdateBreachNotificationRequest {
  affectedUsers?: number;  // @example 500
  description?: string;  // @example Updated breach details
  reportedToDpa?: boolean;  // @example True
  severity?: string;  // @example critical
  status?: string;  // @example reported
  title?: string;  // @example Updated Breach Notification
}

export interface UpdateComplianceCertificationRequest {
  auditor?: string;  // @example Deloitte
  certificateUrl?: string;  // @example https://trust.example.com/certs/soc2-2026.pdf
  criteriaScopes?: string;  // @example ["Security","Availability"]
  framework?: string;  // @example SOC2 Type II
  lastAuditedDate?: string;  // @example 2026-06-15
  nextAuditDate?: string;  // @example 2026-12-15
  status?: string;  // @example active
}

export interface UpdateCrossBorderTransferRequest {
  dataCategory?: string;  // @example Payment Data
  legalBasis?: string;  // @example Binding Corporate Rules
  originRegion?: string;  // @example EU
  status?: string;  // @example active
  targetRegion?: string;  // @example US
}

/** 更新DSAR状态请求参数 */
export interface UpdateDSARRequest {
  rejectionReason?: string;  // 拒绝原因 | @example 数据包含第三方信息无法提供
  responseData?: Record<string, unknown>;  // 响应数据
  status: "processing" | "completed" | "rejected";  // 新状态 | @example completed
}

export interface UpdateDataClassificationRequest {
  classification?: string;  // @example restricted
  dataCategory?: string;  // @example Payment Data
  description?: string;  // @example Updated classification description
  retentionRequired?: boolean;  // @example True
}

export interface UpdateDengbaoControlRequest {
  category?: string;  // @example 物理安全
  description?: string;  // @example 机房应具备防火、防水、防雷等物理防护措施
  evidenceUrl?: string;  // @example https://docs.example.com/dengbao/G3-01
  level?: string;  // @example Level 3
  name?: string;  // @example 安全物理环境
  status?: string;  // @example compliant
}

/** 更新删除权请求状态 */
export interface UpdateErasureRequest {
  status: "pending" | "processing" | "completed" | "rejected";  // 新状态 | @example completed
}

export interface UpdateEvidenceRequest {
  collectedAt?: string;  // @example 2026-05-01T10:00:00Z
  collectorId?: string;  // @example usr_auditor_001
  description?: string;  // @example A.9.1.2 访问控制策略的年度审批记录
  fileUrl?: string;  // @example https://docs.example.com/evidence/ac-policy-v2.pdf
  title?: string;  // @example 访问控制策略审批记录
}

export interface UpdateHIPAAControlRequest {
  category?: string;  // @example Administrative Safeguards
  description?: string;  // @example Implement policies and procedures
  evidenceUrl?: string;  // @example https://docs.example.com/hipaa/164.308.a.1
  name?: string;  // @example Security Management Process
  status?: string;  // @example compliant
}

export interface UpdateISO27001ControlRequest {
  category?: string;  // @example 组织控制
  description?: string;  // @example 应定义并批准信息安全策略
  evidenceUrl?: string;  // @example https://docs.example.com/iso27001/A.5.1.1
  name?: string;  // @example 信息安全策略
  status?: string;  // @example compliant
}

export interface UpdateLegalDocumentRequest {
  content?: string;  // @example [{"title":"1. 引言","body":"..."}]
  effectiveAt?: string;  // @example 2026-06-10T00:00:00Z
  lang?: string;  // @example zh-CN
  title?: string;  // @example 更新后的服务条款
}

export interface UpdatePCIDSSControlRequest {
  category?: string;  // @example Build and Maintain a Secure Network
  description?: string;  // @example Install and maintain a firewall configuration
  evidenceUrl?: string;  // @example https://docs.example.com/pcidss/Req.1.1
  name?: string;  // @example Install and maintain a firewall
  status?: string;  // @example compliant
}

export interface UpdatePIARequest {
  data?: string;  // @example {"processing_activity":"updated"}
  description?: string;  // @example Updated assessment of privacy risks
  status?: string;  // @example completed
  title?: string;  // @example Updated Privacy Impact Assessment
}

export interface UpdatePIPLControlRequest {
  category?: string;  // @example 个人信息处理规则
  description?: string;  // @example 处理个人信息前应告知并取得个人同意
  evidenceUrl?: string;  // @example https://docs.example.com/pipl/Art.13
  name?: string;  // @example 告知-同意规则
  status?: string;  // @example compliant
}

export interface UpdatePSD2ControlRequest {
  category?: string;  // @example Security Measures
  description?: string;  // @example Implement strong customer authentication
  evidenceUrl?: string;  // @example https://docs.example.com/psd2/Art.95.1
  name?: string;  // @example Strong Customer Authentication
  status?: string;  // @example compliant
}

export interface UpdatePenTestReportRequest {
  conductedAt?: string;  // @example 2026-04-01T00:00:00Z
  findings?: number;  // @example 5
  nextTestDate?: string;  // @example 2026-07-01T00:00:00Z
  severity?: string;  // @example medium
  summary?: string;  // @example 安全评估总结
  title?: string;  // @example 2026年Q1渗透测试报告
}

export interface UpdateRegulatoryWatchItemRequest {
  category?: string;  // @example 数据保护
  effectiveDate?: string;  // @example 2026-06-01T00:00:00Z
  region?: string;  // @example EU
  regulation?: string;  // @example GDPR Art. 17
  summary?: string;  // @example 新增数据删除权利
  title?: string;  // @example GDPR 更新
}

export interface UpdateRetentionPolicyRequest {
  autoDelete?: boolean;  // @example True
  dataType?: string;  // @example user_activity_logs
  legalBasis?: string;  // @example 合同义务
  name?: string;  // @example 用户日志保留策略
  purpose?: string;  // @example 安全审计
  retentionPeriodDays?: number;  // @example 365
}

export interface UpdateSOXITGCControlRequest {
  controlType?: string;  // @example preventive
  description?: string;  // @example 访问权限管理
  lastTestDate?: string;  // @example 2026-04-01T00:00:00Z
  name?: string;  // @example 访问权限管理
  status?: string;  // @example effective
  testResult?: string;  // @example 通过
}

export interface UpdateSoDRuleRequest {
  description?: string;  // @example Updated SoD rule description
  enabled?: boolean;  // @example True
  name?: string;  // @example Finance-Audit SoD
  rolesA?: string;  // @example ["role_finance_admin"]
  rolesB?: string;  // @example ["role_auditor"]
}

export interface UpdateSubProcessorRequest {
  applicableServices?: string;  // @example Cloud Infrastructure
  category?: string;  // @example infrastructure
  complianceLinks?: string;  // @example https://aws.amazon.com/compliance/
  entityName?: string;  // @example AWS EMEA SARL
  locations?: string;  // @example ["EU (Frankfurt)"]
  purpose?: string;  // @example Infrastructure Hosting
  status?: string;  // @example active
  subjectMatter?: string;  // @example Customer data storage
  transferMechanism?: string;  // @example Standard Contractual Clauses
}

export interface UpdateVendorRiskAssessmentRequest {
  remarks?: string;  // @example 评估通过
  riskLevel?: string;  // @example medium
  score?: number;  // @example 35
}

export interface UpsertComplianceProfileRequest {
  aiReviewRequired?: boolean;  // @example False
  autoDeleteEnabled?: boolean;
  breachReportThreshold?: number;  // @example 1
  consentTtlYears?: number;  // @example 1
  dataProtectionOfficer?: string;  // @example dpo@example.com
  defaultRetentionDays?: number;  // @example 365
  enabledFrameworks?: string[];  // @example ['["gdpr"', '"iso27001"', '"sox"]']
  maxConcurrentErasures?: number;  // @example 10
  penTestScheduleDays?: number;  // @example 365
  scoreWeights?: string;  // @example {"iso27001":0.25,"soc2":0.15,"gdpr":0.15,"issues":0.25,"pen_test":0.10,"breach":0.10}
  selectedStandards?: string[];  // @example ['["pci_dss_v4"', '"dengbao_l3"]']
  sodAutoInitEnabled?: boolean;  // @example True
}

/** 管理隐私政策版本 */
export interface UpsertPrivacyPolicyRequest {
  content: string;  // 政策内容 | @example # 隐私政策 ...
  effectiveAt: string;  // 生效时间 | @example 2026-04-15T00:00:00Z
  status?: string;  // 状态 | @example active
  summary?: string;  // 摘要 | @example 新增数据传输附录
  version: string;  // 版本号 | @example 2.0
}

export interface VendorRiskAssessmentDetailResponse {
  code?: number;
  data?: VendorRiskAssessmentResponse;
  message?: string;
  timestamp?: string;
}

export interface VendorRiskAssessmentListResponse {
  code?: number;
  items?: VendorRiskAssessmentResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 供应商安全风险评估请求参数 */
export interface VendorRiskAssessmentRequest {
  remarks: string;  // 评估备注 | @example 评估通过
  riskLevel: string;  // 风险等级 | @example medium
  score: number;  // 风险评分 | @example 35
  vendorName: string;  // 供应商名称 | @example CloudProvider XYZ
}

/** 供应商风险评估结果 */
export interface VendorRiskAssessmentResponse {
  assessmentDate?: string;  // 评估日期 | @example 2026-04-01T00:00:00Z
  complianceCertifications?: string[];  // 合规认证 | @example ['["SOC2"', '"ISO27001"]']
  riskFactors?: string[];  // 风险因素 | @example ['["数据中心位置"', '"数据加密"]']
  riskLevel?: string;  // 风险等级 | @example medium
  riskScore?: number;  // 风险评分 | @example 35
  validUntil?: string;  // 有效期 | @example 2027-04-01T00:00:00Z
  vendorId?: string;  // 供应商ID | @example vendor_001
}

export interface DeletedAt {
  time?: string;
  valid?: boolean;  // Valid is true if Time is not NULL
}

// ============================================================
// gateway-service
// ============================================================

export interface EnvVarEntry {
  category?: string;
  key?: string;
  masked?: boolean;
  source?: string;
  value?: string;
}

export interface EnvVarsResult {
  total?: number;
  variables?: EnvVarEntry[];
}

export interface FeatureFlagInfo {
  category?: string;
  description?: string;
  key?: string;
  value?: string;
}

export interface FeatureFlagsResult {
  services?: ServiceFeatureFlagsResult[];
  summary?: FeatureFlagsSummary;
}

export interface FeatureFlagsSummary {
  enabledFlags?: number;
  totalFlags?: number;
}

export interface GatewayInfo {
  service?: string;
  uptime?: string;
  version?: string;
}

export interface InfraCredential {
  category?: string;
  consumers?: string[];
  container?: string;
  infrastructure?: string;
  key?: string;
  name?: string;
  sourceFile?: string;
}

export interface InfraCredentialsResult {
  credentials?: InfraCredential[];
  total?: number;
}

export interface RateLimitStatsResult {
  available?: boolean;
  providerName?: string;
}

export interface SchedulerItem {
  enabled?: boolean;
  interval?: string;
  lastCount?: number;
  lastError?: string;
  lastRun?: string;
  name?: string;
  running?: boolean;
}

export interface ServiceFeatureFlagsResult {
  displayName?: string;
  flags?: FeatureFlagInfo[];
  port?: number;
  service?: string;
}

export interface ServiceMeta {
  category?: string;
  grpcPort?: number;
  name?: string;
  port?: number;
}

export interface ServiceSchedulerInfo {
  schedulers?: SchedulerItem[];
  serviceName?: string;
  servicePort?: number;
}

export interface SystemRuntimeResult {
  gateway?: GatewayInfo;
  services?: ServiceMeta[];
}

export interface SystemSchedulersResult {
  services?: ServiceSchedulerInfo[];
}

export interface TopologyEntry {
  dependsOn?: string[];
  port?: string;
}

export interface TopologyResult {
  metrics?: Record<string, string>;
  topology?: Record<string, TopologyEntry>;
}

export interface SwaggerHealthResponse {
  checks?: Record<string, string>;
  checksLatency?: Record<string, string>;
  service?: string;
  status?: string;
  timestamp?: string;
  uptime?: string;
  version?: string;
}

// ============================================================
// identity-service
// ============================================================

export interface AddFamilyMemberRequest {
  email: string;  // 成员邮箱（必须为租户内已存在用户） | @example child@example.com
  role: string;  // 成员角色（枚举） | @example child_limited
}

export interface AgentActivityInfo {
  action?: string;
  createdAt?: string;
  detail?: string;
  operatorId?: string;
}

export interface AgentCredentialInfo {
  agentId?: string;
  createdAt?: string;
  credType?: string;
  id?: string;
  keyPrefix?: string;
  name?: string;
  status?: string;
}

export interface AgentInfo {
  callbackUrl?: string;
  createdAt?: string;
  description?: string;
  identityId?: string;
  jitTtl?: number;
  lastRotatedAt?: string;
  name?: string;
  ownerId?: string;
  rotationDays?: number;
  status?: string;
  updatedAt?: string;
  workloadSubtype?: string;
}

export interface AgentPermissionInfo {
  action?: string;
  code?: string;
  effect?: string;
  name?: string;
  resource?: string;
}

export interface CreateAgentCredentialRequest {
  credType?: string;
  name: string;
}

export interface CreateAgentCredentialResult {
  credential?: AgentCredentialInfo;
  rawKey?: string;
}

export interface CreateAgentRequest {
  description?: string;
  jitTtl?: number;
  name: string;
  roleCode?: string;  // default: agent_executor
  rotationDays?: number;
  workloadSubtype?: string;  // default: agent
}

export interface CreateDeviceRequest {
  firmwareVer?: string;
  hardwareId?: string;
  manufacturer?: string;
  name: string;
  workloadSubtype?: string;
}

export interface CreateRobotRequest {
  firmwareVer?: string;
  location?: string;
  model?: string;
  name: string;
  workloadSubtype?: string;
}

export interface FamilyMemberInfo {
  assignedAt?: string;  // 加入时间（RFC3339） | @example 2026-08-07T10:00:00Z
  deviceId?: string;  // 设备ID | @example dev_abc123
  email?: string;  // 成员邮箱（补查，缺失置空） | @example child@example.com
  id?: string;  // 成员ID（= user_id = 元组 subject_id） | @example usr_xyz789
  role?: string;  // 成员角色（枚举） | @example child_limited
  status?: string;  // 状态（固定 active） | @example active
  userId?: string;  // 用户ID（= id） | @example usr_xyz789
  username?: string;  // 成员用户名（补查，缺失置空） | @example child01
}

export interface PairDeviceRequest {
  userCode?: string;
}

export interface RiskEventDayCount {
  count?: number;
  date?: string;
}

export interface RiskEventTypeCount {
  count?: number;
  eventType?: string;
}

export interface RiskScoreRange {
  count?: number;
  range?: string;  // low, medium, high, critical
}

export interface RobotInfo {
  createdAt?: string;
  firmwareVer?: string;
  identityId?: string;
  lastHealthAt?: string;
  location?: string;
  model?: string;
  name?: string;
  ownerId?: string;
  safetyPolicy?: string;
  status?: string;
  updatedAt?: string;
  workloadSubtype?: string;
}

export interface SCIMAttribute {
  caseExact?: boolean;
  description?: string;
  multiValued?: boolean;
  mutability?: string;
  name?: string;
  required?: boolean;
  returned?: string;
  subAttributes?: SCIMAttribute[];
  type?: string;
  uniqueness?: string;
}

export interface SCIMAuthScheme {
  description?: string;
  name?: string;
  primary?: boolean;
  type?: string;
}

export interface SCIMBulkSupported {
  maxOperations?: number;
  maxPayloadSize?: number;
  supported?: boolean;
}

export interface SCIMEmail {
  primary?: boolean;
  type?: string;
  value?: string;
}

export interface SCIMFilterSupported {
  maxResults?: number;
  supported?: boolean;
}

export interface SCIMGroup {
  displayName?: string;
  externalId?: string;
  id?: string;
  members?: SCIMMember[];
  meta?: SCIMMeta;
  schemas?: string[];
}

export interface SCIMGroupRef {
  ref?: string;
  display?: string;
  value?: string;
}

export interface SCIMListResponse {
  Resources?: unknown;
  itemsPerPage?: number;
  schemas?: string[];
  startIndex?: number;
  totalResults?: number;
}

export interface SCIMMember {
  ref?: string;
  display?: string;
  value?: string;
}

export interface SCIMMeta {
  created?: string;
  lastModified?: string;
  location?: string;
  resourceType?: string;
}

export interface SCIMName {
  familyName?: string;
  formatted?: string;
  givenName?: string;
}

export interface SCIMPatchOperation {
  op?: string;
  path?: string;
  value?: unknown;
}

export interface SCIMPhoneNumber {
  type?: string;
  value?: string;
}

export interface SCIMResourceType {
  description?: string;
  endpoint?: string;
  id?: string;
  meta?: SCIMMeta;
  name?: string;
  schema?: string;
  schemaExtensions?: string[];
  schemas?: string[];
}

export interface SCIMSchemaDefinition {
  attributes?: SCIMAttribute[];
  description?: string;
  id?: string;
  meta?: SCIMMeta;
  name?: string;
  schemas?: string[];
}

export interface SCIMServiceProviderConfig {
  authenticationSchemes?: SCIMAuthScheme[];
  bulk?: SCIMBulkSupported;
  changePassword?: SCIMSupported;
  etag?: SCIMSupported;
  filter?: SCIMFilterSupported;
  meta?: SCIMMeta;
  patch?: SCIMSupported;
  schemas?: string[];
  sort?: SCIMSupported;
}

export interface SCIMSupported {
  supported?: boolean;
}

export interface SCIMUser {
  active?: boolean;
  displayName?: string;
  emails?: SCIMEmail[];
  externalId?: string;
  groups?: SCIMGroupRef[];
  id?: string;
  meta?: SCIMMeta;
  name?: SCIMName;
  phoneNumbers?: SCIMPhoneNumber[];
  schemas?: string[];
  userName?: string;
}

export interface SignalWeights {
  credentialLeaked?: number;
  ipBadReputation?: number;
  ipUnknown?: number;
  ipVpn?: number;
  loginFailureHigh?: number;
  loginFailureModerate?: number;
  mfaMethodChanged?: number;
  newCountry?: number;
  newDeviceOrIp?: number;
  sessionHijack?: number;
  unknownDevice?: number;
  unusualLocation?: number;
  unusualTime?: number;
  velocityAnomaly?: number;
}

export interface TopRiskUser {
  avgScore?: number;
  count?: number;
  maxScore?: number;
  userId?: string;
}

export interface TransferDeviceRequest {
  newOwnerId?: string;
}

export interface UpdateAgentRequest {
  callbackUrl?: string;
  description?: string;
  name?: string;
}

export interface UpdateRobotRequest {
  firmwareVer?: string;
  location?: string;
  name?: string;
  safetyPolicy?: string;
}

export interface UserConsent {
  granted?: boolean;
  id?: string;
  ipAddress?: string;
  recordedAt?: string;
  revokedAt?: string;
  scope?: string;  // marketing, analytics, third_party, terms, privacy
  tenantId?: string;
  userAgent?: string;
  userId?: string;
  version?: string;  // 政策版本号
}

export interface ABACPolicyResponse {
  condition?: string;
  createdAt?: string;
  description?: string;
  effect?: string;
  enabled?: boolean;
  id?: string;
  name?: string;
  priority?: number;
  tenantId?: string;
  updatedAt?: string;
}

export interface ActivationResponse {
  activatedAt?: string;
  createdAt?: string;
  expireAt?: string;
  id?: string;
  justification?: string;
  revokedAt?: string;
  roleId?: string;
  status?: string;
  tenantId?: string;
  userId?: string;
}

export interface AddIPRestrictionRequest {
  label?: string;
  value: string;
}

/** 添加身份凭证请求参数 */
export interface AddIdentityRequest {
  code?: string;  // 验证码
  identifier: string;  // 标识
  password?: string;  // 密码
  type: "email" | "phone";  // 类型
}

export interface AddIdentityResponse {
  code?: number;
  data?: IdentityResponse;
  message?: string;
  timestamp?: string;
}

/** 添加备用联系方式 */
export interface AddRecoveryContactRequest {
  type: "email" | "phone";  // 类型
  value: string;  // 联系方式
}

/** 管理员模拟其他用户登录请求 */
export interface AdminImpersonateRequest {
  reason?: string;  // @example Troubleshooting user issue
  userId: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
}

/** 管理员模拟用户登录响应 */
export interface AdminImpersonateResponse {
  accessToken?: string;  // @example eyJhbGciOi...
  expiresIn?: number;  // @example 1800
  refreshToken?: string;  // @example eyJhbGciOi...
  tokenType?: string;  // @example Bearer
  user?: UserInfo;
}

export interface AdminImpersonateResponseWrapper {
  code?: number;
  data?: AdminImpersonateResponse;
  message?: string;
  timestamp?: string;
}

export interface AdminStatsData {
  active?: number;
  inactive?: number;
  revoked?: number;
  total?: number;
}

/** 匿名认证请求参数 */
export interface AnonymousSigninRequest {
  tenantId?: string;  // 租户ID | @example tnt_xyz789
}

/** API Key异常检测结果 */
export interface ApiKeyAnomalyResponse {
  description?: string;  // @example High authentication failure rate detected
  keyId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  severity?: string;  // @example high
  type?: string;  // @example high_failure_rate
  value?: number;  // @example 0.85
}

export interface ApiKeyAuditLogListResponse {
  code?: number;
  items?: ApiKeyAuditLogResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ApiKeyAuditLogResponse {
  action?: string;  // @example api_key.created
  apiKeyId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  createdAt?: string;  // @example 2024-01-01T00:00:00Z
  detail?: string;  // @example API key created successfully
  id?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  ip?: string;  // @example 192.168.1.100
  success?: boolean;  // @example True
  userAgent?: string;  // @example Mozilla/5.0
}

export interface ApiKeyListResponse {
  code?: number;
  items?: ApiKeyResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ApiKeyResponse {
  createdAt?: string;  // @example 2024-01-01T00:00:00Z
  environment?: string;  // @example live
  expiresAt?: string;  // @example 2025-01-15T00:00:00Z
  id?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  ipRestrictions?: IpRestrictionDTO[];
  lastUsedAt?: string;  // @example 2024-01-15T10:30:00Z
  lastUsedIp?: string;  // @example 192.168.1.100
  name?: string;  // @example my-api-key
  scopes?: string[];  // @example ['["read"', '"write"]']
  status?: string;  // @example active
  tenantId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  updatedAt?: string;  // @example 2024-06-15T12:00:00Z
  usageCount?: number;  // @example 42
  userId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
}

export interface ApiKeyUsageResponse {
  id?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  lastUsedAt?: string;  // @example 2024-01-15T10:30:00Z
  lastUsedIp?: string;  // @example 192.168.1.100
  name?: string;  // @example my-api-key
  status?: string;  // @example active
  usageCount?: number;  // @example 42
}

/** 认证用户信息 */
export interface AuthUserResponse {
  ageGroup?: string;  // 年龄分组
  birthDate?: string;  // 出生日期 (RFC3339)
  createdAt?: string;  // 创建时间 | @example 2026-01-01T00:00:00Z
  email?: string;  // 邮箱 | @example john@example.com
  emailVerifiedAt?: string;  // 邮箱验证时间 | @example 2026-01-10T08:00:00Z
  id?: string;  // 用户ID | @example usr_abc123
  isMinor?: boolean;  // 是否未成年人
  lastLoginAt?: string;  // 最后登录 | @example 2026-04-14T10:30:00Z
  lastLoginIp?: string;  // 最后登录IP | @example 192.168.1.1
  lockedUntil?: string;  // 锁定截止 | @example 2026-04-15T12:00:00Z
  loginFailCount?: number;  // 失败次数 | @example 0
  metadata?: Record<string, unknown>;  // 扩展元数据
  mfaEnabled?: boolean;  // 是否启用MFA | @example False
  mfaType?: string;  // MFA类型 | @example totp
  mustChangePassword?: boolean;  // 需要强制修改密码 | @example False
  passwordChangedAt?: string;  // 密码最后修改时间
  pendingParentalConsent?: boolean;  // 是否等待家长同意
  phone?: string;  // 手机号 | @example 13800138000
  phoneVerifiedAt?: string;  // 手机验证时间 | @example 2026-01-10T08:00:00Z
  status?: string;  // 状态 | @example active
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  updatedAt?: string;  // 更新时间 | @example 2026-04-10T14:20:00Z
  username?: string;  // 用户名 | @example john_doe
}

export interface AuthenticatorBackupDetailResponse {
  code?: number;
  data?: AuthenticatorBackupResponse;
  message?: string;
  timestamp?: string;
}

export interface AuthenticatorBackupResponse {
  accountCount?: number;  // @example 5
  backupType?: string;  // @example totp
  checksum?: string;  // @example sha256-hash
  createdAt?: string;  // @example 2026-05-12T12:00:00Z
  deviceName?: string;  // @example iPhone 15
  encryptedData?: string;  // @example AES-GCM-encrypted-base64...
  id?: string;  // @example backup-abc123
  version?: number;  // @example 1
}

export interface AuthenticatorBackupUploadRequest {
  accountCount?: number;  // @example 5
  backupType?: string;  // @example totp
  checksum?: string;  // @example sha256-hash
  deviceName?: string;  // @example iPhone 15
  encryptedData: string;  // @example AES-GCM-encrypted-base64...
}

export interface AuthenticatorDeviceItem {
  createdAt?: string;  // @example 2026-05-12T12:00:00Z
  deviceId?: string;  // @example dev-abc123
  deviceName?: string;  // @example iPhone 15
  deviceType?: string;  // @example totp
  enabled?: boolean;  // @example True
  lastUsedAt?: string;  // @example 2026-05-12T12:00:00Z
}

export interface AuthenticatorDeviceListResponse {
  code?: number;
  items?: AuthenticatorDeviceItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 批量创建用户单项 */
export interface BatchCreateUserItem {
  email?: string;  // 邮箱
  metadata?: Record<string, string>;  // 扩展元数据
  password: string;  // 密码
  phone?: string;  // 手机号
  username?: string;  // 用户名
}

/** 批量创建用户请求 */
export interface BatchCreateUserRequest {
  users: BatchCreateUserItem[];  // 用户列表
}

export interface BatchRevokeRequest {
  ids: string[];
}

export interface BatchRevokeResponse {
  failed?: string[];
  revoked?: number;
}

/** 批量更新用户状态请求 */
export interface BatchUpdateUserStatusRequest {
  status: "active" | "banned" | "pending" | "suspended" | "locked" | "deleted";  // 目标状态
  userIds: string[];  // 用户ID列表
}

/** 绑定OAuth账户请求 */
export interface BindOAuthRequest {
  code: string;  // Code
  codeVerifier?: string;  // PKCE code verifier
  provider: string;  // Provider
}

export interface BootstrapAdminRequest {
  userId: string;
}

export interface BootstrapAdminResponse {
  message?: string;
  roleId?: string;
}

/** 登录页品牌定制（Logo/主色/自定义CSS/隐私条款URL） */
export interface BrandingInfo {
  companyName?: string;  // @example My Company
  customCss?: string;  // @example .login-btn { border-radius: 12px; }
  faviconUrl?: string;  // @example https://cdn.example.com/favicon.ico
  loginPageDescription?: string;  // @example Sign in to your account
  loginPageTitle?: string;  // @example Welcome
  logoUrl?: string;  // @example https://cdn.example.com/logo.png
  primaryColor?: string;  // @example #3b82f6
  privacyPolicyUrl?: string;  // @example https://example.com/privacy
  secondaryColor?: string;  // @example #10b981
  termsOfServiceUrl?: string;  // @example https://example.com/terms
}

export interface CertificateDetailResponse {
  code?: number;
  data?: ProviderCertificateResponse;
  message?: string;
  timestamp?: string;
}

export interface CertificateListResponse {
  code?: number;
  items?: ProviderCertificateResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 发起邮箱变更请求（password 可选：携带即单密码放行，缺省走重认证闸门，AC-006/008） */
export interface ChangeEmailRequest {
  newEmail: string;  // 新邮箱
  password?: string;  // 当前密码（可选，*string 兼容三态：缺省/nil/空串 → 走闸门）
}

export interface ChangePasswordResponse {
  code?: number;
  message?: string;
}

/** 发起手机号变更请求（password 可选：携带即单密码放行，缺省走重认证闸门，AC-006/008） */
export interface ChangePhoneRequest {
  newPhone: string;  // 新手机号(E.164格式)
  password?: string;  // 当前密码（可选，*string 兼容三态：缺省/nil/空串 → 走闸门）
}

/** 检查邮箱可用性请求 */
export interface CheckEmailRequest {
  email: string;  // Email | @example user@example.com
}

/** 检查邮箱可用性结果 */
export interface CheckEmailResponse {
  available?: boolean;  // Is available | @example True
  email?: string;  // Email | @example user@example.com
}

/** 内部检查权限请求 */
export interface CheckPermissionInternalRequest {
  action: string;  // Action
  resource: string;  // Resource
  tenantId: string;  // Tenant ID
  userId: string;  // User ID
}

/** 检查权限请求 (user_id derived from JWT context) */
export interface CheckPermissionRequest {
  action: string;  // Action
  resource: string;  // Resource
}

/** 检查角色请求 (user_id derived from JWT context) */
export interface CheckRoleRequest {
  roleCode: string;  // Role code
}

/** 检查用户名可用性请求 */
export interface CheckUsernameRequest {
  username: string;  // Username | @example john_doe
}

/** 检查用户名可用性结果 */
export interface CheckUsernameResponse {
  available?: boolean;  // Is available | @example True
  username?: string;  // Username | @example john_doe
}

/** 未成年人家长同意验证状态 */
export interface ChildrenConsentResponse {
  id?: string;  // 记录ID | @example child_consent_001
  method?: string;  // 验证方式 | @example email
  parentEmail?: string;  // 家长邮箱 | @example parent@example.com
  parentPhone?: string;  // 家长手机 | @example 13800138000
  recordedAt?: string;  // 记录时间 | @example 2026-04-15T10:30:00Z
  status?: string;  // 状态 | @example pending
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  userId?: string;  // 用户ID | @example usr_abc123
  verified?: boolean;  // 是否已验证 | @example True
  verifiedAt?: string;  // 验证时间 | @example 2026-04-15T10:30:00Z
}

export interface CleanupExpiredResponse {
  expiredCount?: number;
  message?: string;
}

/** 完成账户恢复（重置密码） */
export interface CompleteAccountRecoveryRequest {
  code: string;  // 验证码
  newPassword: string;  // 新密码
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
  recoveryToken: string;  // 恢复令牌
}

export interface CompleteAccountRecoveryResponse {
  message?: string;
}

/** 租户选中的合规标准信息 */
export interface ComplianceProfileInfo {
  resolvedAt?: string;  // @example 2026-06-15T10:00:00Z
  standards?: string[];  // @example ['["nist_sp800_63b_v4"', '"dengbao_l3"]']
}

/** 当前配置与合规标准之间的差距 */
export interface ComplianceWarningItem {
  current?: unknown;  // @example 8
  description?: string;  // @example NIST v4 AAL2 requires 15 characters
  parameter?: string;  // @example password_min_length_sfa
  required?: unknown;  // @example 15
  severity?: string;  // @example high
}

/** 用户隐私同意历史 */
export interface ConsentHistoryResponse {
  history?: UserConsent[];  // History
  userId?: string;  // User ID | @example user-001
}

/** 同意管理请求参数 */
export interface ConsentRequest {
  granted?: boolean;  // Granted
  metadata?: Record<string, unknown>;  // Metadata
  scope: string;  // Scope | @example marketing
}

export interface CreateABACPolicyRequest {
  condition: string;
  description?: string;
  effect?: string;
  name: string;
  priority?: number;
}

export interface CreateApiKeyRequest {
  environment?: "live" | "test";
  expiresAt?: string;
  name: string;
  scopes?: string[];
}

export interface CreateApiKeyResponse {
  createdAt?: string;
  environment?: string;
  expiresAt?: string;
  id?: string;
  name?: string;
  rawKey?: string;
  scopes?: string[];
  status?: string;
}

/** 为身份提供商上传签名/加密证书 */
export interface CreateCertificateRequest {
  certPem: string;  // @example -----BEGIN CERTIFICATE-----...
  name: string;  // @example My SAML Signing Cert
  type: "signing" | "encryption";  // @example signing
}

/** 创建身份提供商请求参数 */
export interface CreateIDPRequest {
  attributeMapping?: Record<string, string>;  // 字段映射
  authUrl?: string;  // 授权端点 | @example https://example.com/auth
  clientId: string;  // Client ID | @example client_123
  clientSecret: string;  // Client Secret | @example secret_456
  config?: Record<string, unknown>;  // 额外配置
  displayName?: string;  // 前端展示名称 | @example My OIDC Provider
  iconUrl?: string;  // 图标URL | @example https://example.com/icon.png
  name: string;  // 显示名称 | @example My OIDC Provider
  scopes?: string[];  // 权限范围 | @example ['[openid', 'profile', 'email]']
  sortOrder?: number;  // 排序 | @example 0
  tokenUrl?: string;  // Token端点 | @example https://example.com/token
  type: string;  // 类型 | @example custom
  userInfoUrl?: string;  // 用户信息端点 | @example https://example.com/userinfo
}

export interface CreateUserResponse {
  code?: number;
  data?: UserWithIdentitiesResponse;
  message?: string;
  timestamp?: string;
}

/** 停用账户请求参数 */
export interface DeactivateAccountRequest {
  password?: string;  // Password | @example CurrentP@ssw0rd
}

export interface DeactivateAccountResponse {
  code?: number;
  message?: string;
}

/** 删除账户结果 */
export interface DeleteAccountResponse {
  deletedAt?: string;  // Deletion time | @example 2026-04-15T10:00:00Z
  message?: string;  // Message
  userId?: string;  // User ID | @example user-001
}

export interface DeviceListResponse {
  code?: number;
  items?: DeviceResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 用户设备信息（含安全增强字段） */
export interface DeviceResponse {
  browser?: string;  // 浏览器 | @example Safari
  createdAt?: string;  // 首次登录 | @example 2026-01-01T00:00:00Z
  deviceFingerprint?: string;  // 设备指纹 | @example sha256:abc123def
  deviceName?: string;  // 设备名称 | @example My iPhone
  id?: string;  // 设备ID | @example dev_abc123
  ip?: string;  // IP | @example 192.168.1.1
  isTrusted?: boolean;  // 是否信任 | @example True
  lastSeen?: string;  // 最近使用 | @example 2026-04-15T10:30:00Z
  loginCount?: number;  // 登录次数 | @example 42
  os?: string;  // 系统 | @example iOS 17
  sessionId?: string;  // 关联会话 | @example sess_123
  trustScore?: number;  // 信任评分 | @example 85
  type?: string;  // 类型 | @example mobile
  userId?: string;  // 用户ID | @example usr_abc123
}

export interface DiscoverTenantInfo {
  displayName?: string;
  id?: string;
  membershipApproval?: string;
  name?: string;
}

export interface EmailStatusResponse {
  email?: string;
  emailVerified?: boolean;
  verificationSent?: boolean;
}

export interface EmailVerificationResponse {
  expiresIn?: number;
}

export interface EmailVerifiedResponse {
  email?: string;
}

/** GDPR数据导出结果 GDPR数据导出结果（个人信息聚合数据） */
export interface ExportMyDataResponse {
  auditLogs?: unknown;
  billingData?: unknown;
  communicationData?: unknown;
  devices?: unknown;
  exportAt?: string;  // @example 2026-04-19T10:00:00Z
  notificationData?: unknown;
  oauthData?: unknown;
  pointData?: unknown;
  profileData?: unknown;
  sessionData?: unknown;
  storageData?: unknown;
  user?: unknown;
  walletData?: unknown;
}

/** 忘记密码请求参数 */
export interface ForgotPasswordRequest {
  identity: string;  // Email or phone
}

/** 忘记密码响应 */
export interface ForgotPasswordResponse {
  expiresIn?: number;  // Expiration time
  message?: string;  // Message
}

/** 生成一次性票据请求参数 */
export interface GenerateTicketInput {
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  userId: string;  // 用户ID | @example usr_abc123
}

/** Web3钱包登录票据 */
export interface GenerateTicketResponse {
  expiresIn?: number;  // @example 300
  ticket?: string;  // @example a1b2c3d4e5f6...
}

export interface GetChildrenConsentResponse {
  code?: number;
  data?: Record<string, unknown>;
  message?: string;
}

export interface GetIdentitiesResponse {
  code?: number;
  data?: IdentityListData;
  message?: string;
  timestamp?: string;
}

export interface GetMySessionsResponse {
  code?: number;
  data?: unknown;
  message?: string;
}

/** HTTP修改密码请求 */
export interface HTTPChangePasswordRequest {
  newPassword: string;  // New password
  oldPassword?: string;  // Old password (optional for admin reset)
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
}

/** HTTP重置密码请求 */
export interface HTTPResetPasswordRequest {
  forceChange?: boolean;  // Force user to change password on next login
  newPassword: string;  // New password (或 hash)
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
  resetToken: string;  // Reset token
}

/** HTTP创建用户请求 */
export interface HTTPUserCreateRequest {
  email?: string;  // Email
  forcePasswordChange?: boolean;  // Force user to change password on first login
  metadata?: Record<string, string>;  // Metadata
  password: string;  // Password
  phone?: string;  // Phone
  username?: string;  // Username
}

export interface IDPDetailResponse {
  code?: number;
  data?: IDPResponse;
  message?: string;
  timestamp?: string;
}

export interface IDPListResponse {
  code?: number;
  items?: IDPResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 身份提供商详细信息 */
export interface IDPResponse {
  attributeMapping?: Record<string, string>;  // 字段映射
  authUrl?: string;  // 授权端点 | @example https://example.com/auth
  clientId?: string;  // Client ID | @example client_123
  config?: Record<string, unknown>;  // 额外配置
  createdAt?: string;  // 创建时间 | @example 2026-01-01T00:00:00Z
  displayName?: string;  // 前端展示名称 | @example My OIDC Provider
  iconUrl?: string;  // 图标URL | @example https://example.com/icon.png
  id?: string;  // 提供商ID | @example idp_abc123
  isPopular?: boolean;  // 常用提供商 | @example False
  isSystem?: boolean;  // 系统内置 | @example False
  name?: string;  // 显示名称 | @example My OIDC Provider
  scopes?: string[];  // 权限范围 | @example ['[openid', 'profile', 'email]']
  sortOrder?: number;  // 排序 | @example 0
  status?: string;  // 状态 | @example active
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  tokenUrl?: string;  // Token端点 | @example https://example.com/token
  type?: string;  // 类型 | @example custom
  typeDisplayName?: string;  // 类型显示名称 | @example 自定义
  updatedAt?: string;  // 更新时间 | @example 2026-04-10T14:20:00Z
  userInfoUrl?: string;  // 用户信息端点 | @example https://example.com/userinfo
}

export interface IdentityListData {
  identities?: IdentityResponse[];
}

/** 用户身份凭证信息 */
export interface IdentityResponse {
  createdAt?: string;  // 创建时间 | @example 2026-01-01T00:00:00Z
  id?: string;  // 凭证ID | @example id_abc123
  identifier?: string;  // 标识(脱敏) | @example j***@example.com
  isPrimary?: boolean;  // 是否主凭证 | @example True
  isVerified?: boolean;  // 是否验证 | @example True
  type?: string;  // 类型 | @example email
  userId?: string;  // 用户ID | @example usr_abc123
  verifiedAt?: string;  // 验证时间 | @example 2026-01-10T08:00:00Z
}

export interface ImpersonateRequest {
  reason?: string;  // 模拟原因
}

export interface ImpersonateResponse {
  expiresAt?: string;  // @example 2026-06-16T11:00:00Z
  impersonationToken?: string;  // @example eyJhbGciOi...
}

/** 从OIDC discovery URL导入身份提供商配置 */
export interface ImportOIDCDiscoveryRequest {
  discoveryUrl: string;  // @example https://idp.example.com/.well-known/openid-configuration
}

/** 从SAML metadata URL导入身份提供商配置 */
export interface ImportSAMLMetadataRequest {
  metadataUrl: string;  // @example https://idp.example.com/metadata.xml
}

export interface KeyExchangeResponse {
  algorithm?: string;  // "ECDH-P256-HKDF-SHA256-AES256GCM"
  expiresIn?: number;  // TTL in seconds
  keyExchangeId?: string;
  serverPubKey?: string;  // base64 ECDH P-256 public key
}

export interface LdapGroupRoleMappingRequest {
  mapping: Record<string, string>;
}

export interface LdapGroupRoleMappingResponse {
  directoryName?: string;
  mapping?: Record<string, string>;
}

export interface LdapHealthResponse {
  directoryName?: string;
  error?: string;
  healthy?: boolean;
}

export interface LdapLoginRequest {
  password: string;
  tenantId?: string;  // 显式指定租户（可选，兜底 X-Tenant-ID header）
  username: string;
}

export interface LdapLoginResponse {
  accessToken?: string;
  isNewUser?: boolean;
  refreshToken?: string;
  userId?: string;
}

export interface LdapTestConnectionRequest {
  directoryName: string;
}

export interface LdapTestConnectionResponse {
  connected?: boolean;
  directoryName?: string;
  error?: string;
  latencyMs?: number;
  mapping?: Record<string, string>;
  success?: boolean;
}

export interface LinkSAMLUserRequest {
  email: string;
  name?: string;
  nameId: string;
  providerId: string;
}

export interface LinkSAMLUserResponse {
  isNew?: boolean;
  userId?: string;
}

export interface ListResponseany {
  code?: number;
  items?: unknown[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsedomain_AgentActivityInfo {
  code?: number;
  items?: AgentActivityInfo[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsedomain_AgentCredentialInfo {
  code?: number;
  items?: AgentCredentialInfo[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsedomain_AgentInfo {
  code?: number;
  items?: AgentInfo[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsedomain_AgentPermissionInfo {
  code?: number;
  items?: AgentPermissionInfo[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsedomain_FamilyMemberInfo {
  code?: number;
  items?: FamilyMemberInfo[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsedomain_RobotInfo {
  code?: number;
  items?: RobotInfo[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsedto_ABACPolicyResponse {
  code?: number;
  items?: ABACPolicyResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsedto_ActivationResponse {
  code?: number;
  items?: ActivationResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsedto_ChildrenConsentResponse {
  code?: number;
  items?: ChildrenConsentResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsedto_DeviceResponse {
  code?: number;
  items?: DeviceResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsedto_MakerCheckerRecordResponse {
  code?: number;
  items?: MakerCheckerRecordResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsedto_WebAuthnCredentialResponse {
  code?: number;
  items?: WebAuthnCredentialResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsegitee_com_linmes_authms_microservices_identityservice_internal_device_domain_DeviceInfo {
  code?: number;
  items?: DeviceInfo[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsehandler_SamlLinkedAccountInfo {
  code?: number;
  items?: SamlLinkedAccountInfo[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface LoginByCodeResponse {
  accessToken?: string;
  expiresIn?: number;
  isNewUser?: boolean;
  refreshToken?: string;
  tokenType?: string;
  user?: UserInfo;
  userId?: string;  // User ID (redundant with User.ID for flat access)
}

export interface LoginByEmailCodeRequest {
  captchaChallengeId?: string;
  captchaToken?: string;
  code: string;
  email: string;
  registerIfNew?: boolean;
  tenantId?: string;
}

export interface LoginByPhoneCodeRequest {
  captchaChallengeId?: string;
  captchaToken?: string;
  code: string;
  phone: string;
  registerIfNew?: boolean;
  tenantId?: string;
}

export interface LoginHistoryListResponse {
  code?: number;
  items?: LoginHistoryResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 用户登录历史记录 */
export interface LoginHistoryResponse {
  browser?: string;  // 浏览器 | @example Chrome
  createdAt?: string;  // 登录时间 | @example 2026-04-15T10:30:00Z
  deviceType?: string;  // 设备类型 | @example desktop
  failReason?: string;  // 失败原因
  id?: string;  // 记录ID | @example hist_abc123
  ip?: string;  // IP地址 | @example 192.168.1.1
  location?: string;  // 地理位置 | @example Beijing
  loginType?: string;  // 登录类型 | @example password
  os?: string;  // 操作系统 | @example Windows 10
  sessionId?: string;  // 会话ID | @example sess_123
  status?: string;  // 状态 | @example success
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  userAgent?: string;  // User-Agent | @example Mozilla/5.0
  userId?: string;  // 用户ID | @example usr_abc123
}

/** 用户登录请求参数 */
export interface LoginRequest {
  captchaChallengeId?: string;  // CAPTCHA challenge ID
  captchaProvider?: string;  // CAPTCHA provider (pow/turnstile)
  captchaToken?: string;  // CAPTCHA verification token (PoW/Turnstile)
  clientNonce?: string;  // hash 模式: 客户端随机 nonce
  clientPubKey?: string;  // symmetric 模式: 客户端 ECDH 临时公钥
  identity: string;  // Username/Email/Phone
  keyExchangeId?: string;  // symmetric 模式: ECDH 密钥交换 ID
  keyId?: string;  // asymmetric 模式: 服务端公钥 ID
  password: string;  // Password or hash/ciphertext (取决于 password_transmission)
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
  tenantId?: string;  // Tenant ID
}

/** 用户登录结果 */
export interface LoginResponse {
  accessToken?: string;  // Access token | @example eyJhbGciOi...
  challengeToken?: string;  // MFA challenge token (short-lived, requires MFA verification) | @example chg_abc123...
  expiresIn?: number;  // Expiration time | @example 1800
  mfaCheckReason?: string;  // MFA触发原因描述 | @example new_device
  mustChangePassword?: boolean;  // Password must be changed | @example False
  passwordExpiresIn?: number;  // Days until password expires | @example 30
  passwordWarning?: string;  // Password warning: expiring/expired_grace/expired | @example expiring
  refreshToken?: string;  // Refresh token | @example eyJhbGciOi...
  requiredMfaMethods?: string[];  // MFA推荐方法列表
  requiresMfa?: boolean;  // 自适应MFA: 需要额外MFA验证 | @example False
  riskAssessment?: RiskAssessmentInfo;  // Risk assessment
  riskLevel?: string;  // 风险等级: low/medium/high | @example low
  tokenType?: string;  // Token type | @example Bearer
  user?: UserInfo;  // User info
  userId?: string;  // User ID (redundant with User.ID for flat access)
}

export interface LogoutAllSessionsResponse {
  code?: number;
  message?: string;
}

export interface LogoutResponse {
  code?: number;
  data?: Record<string, unknown>;
  message?: string;
}

export interface LogoutSessionResponse {
  code?: number;
  message?: string;
}

export interface MagicLinkConfirmResponse {
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  tokenType?: string;
  user?: UserInfo;
}

export interface MagicLinkRequest {
  email: string;
  redirectUrl?: string;
}

/** 双人复核记录请求 */
export interface MakerCheckerRecordRequest {
  approver: string;  // Approver | @example user-002
  details?: Record<string, unknown>;  // Details
  operation: string;  // Operation | @example delete_user
  requester: string;  // Requester | @example user-001
}

/** 双人复核记录响应 */
export interface MakerCheckerRecordResponse {
  approver?: string;  // Approver
  operation?: string;  // Operation
  recordId?: string;  // Record ID
  requester?: string;  // Requester
  status?: string;  // Status
}

export interface MembershipInfo {
  joinedAt?: string;  // @example 2026-01-15T10:30:00Z
  role?: string;  // @example member
  status?: string;  // active / pending / disabled | @example active
  tenantId?: string;  // @example tnt_abc123
  tenantName?: string;  // @example acme-corp
}

export interface MembershipListResponseWrapper {
  code?: number;
  items?: MembershipInfo[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 合并用户请求（合并从账户到主账户） */
export interface MergeUsersRequest {
  primaryUserId: string;  // 主账户用户ID
  secondaryUserId: string;  // 从账户用户ID
}

export interface MyPermissionsResponse {
  permissions?: string[];
}

export interface MyPermissionsResponseWrapper {
  code?: number;
  data?: MyPermissionsResponse;
  message?: string;
  timestamp?: string;
}

export interface MyTenantsResponse {
  tenants?: TenantInfo[];
}

export interface MyTenantsResponseWrapper {
  code?: number;
  data?: MyTenantsResponse;
  message?: string;
  timestamp?: string;
}

/** NHI (非人类身份) 策略配置请求 */
export interface NHIPolicyRequest {
  agentDefaultTtl?: string;  // @example 1h
  agentMaxCount?: number;  // @example 100
  deviceMaxPerOwner?: number;  // @example 10
  robotMaxCount?: number;  // @example 100
  rotationDaysDefault?: number;  // @example 90
}

/** NHI (非人类身份) 策略配置 */
export interface NHIPolicyResponse {
  agentDefaultTtl?: string;  // @example 1h
  agentMaxCount?: number;  // @example 100
  deviceMaxPerOwner?: number;  // @example 10
  robotMaxCount?: number;  // @example 100
  rotationDaysDefault?: number;  // @example 90
  updatedAt?: string;  // @example 2026-06-09T10:30:00Z
}

export interface NHIPolicyResponseWrapper {
  code?: number;
  data?: NHIPolicyResponse;
  message?: string;
  timestamp?: string;
}

export interface OAuthBindingStatsResponse {
  byProvider?: Record<string, number>;
  tenantId?: string;
}

/** OAuth/SSO回调响应 */
export interface OAuthCallbackResponse {
  accessToken?: string;  // Access token | @example eyJhbGciOi...
  challengeToken?: string;  // MFA challenge token | @example chg_abc123...
  expiresIn?: number;  // Expiration time | @example 1800
  isNewUser?: boolean;  // Is new user | @example False
  mfaCheckReason?: string;  // MFA check reason | @example new_device
  provider?: string;  // Provider | @example github
  refreshToken?: string;  // Refresh token | @example eyJhbGciOi...
  requiredMfaMethods?: string[];  // MFA recommended methods
  requiresMfa?: boolean;  // Requires MFA | @example False
  riskLevel?: string;  // Risk level | @example low
  state?: string;  // State | @example random-state
  tokenType?: string;  // Token type | @example Bearer
}

export interface OAuthProviderHealthResponse {
  providers?: unknown;
}

export interface PasskeyAuthBeginRequest {
  email?: string;
  mediation?: string;  // "conditional" 启用条件UI(免填写邮箱自动填充)
  tenantId?: string;
}

export interface PasskeyAuthenticateCompleteRequest {
  credential: AuthenticationResponse;
  email?: string;
}

/** 密码策略配置 */
export interface PasswordPolicyResponse {
  captchaEnabled?: boolean;  // 是否启用CAPTCHA验证
  changeCooldownMinutes?: number;  // 密码修改冷却时间 | @example 0
  checkBreachedPasswords?: boolean;  // 是否检测已泄露密码
  expiryDays?: number;  // 密码过期天数 | @example 90
  forceChangeOnFirstLogin?: boolean;  // 首次登录强制修改密码
  gracePeriodDays?: number;  // 过期宽限天数 | @example 7
  historyCount?: number;  // 密码历史保留数量 | @example 5
  identityThreshold?: number;  // 登录限速账号阈值
  ipThreshold?: number;  // 登录限速IP阈值
  loginMethods?: string[];
  maxLength?: number;  // 最大长度 | @example 128
  minLength?: number;  // 最小长度 | @example 8
  oauthProviders?: string[];
  passwordTransmission?: string;  // 密码传输方式
  pepperEnabled?: boolean;  // US-P13: 服务端Pepper加密启用
  requireDigit?: boolean;  // 需要数字 | @example True
  requireLower?: boolean;  // 需要小写字母 | @example True
  requireSpecial?: boolean;  // 需要特殊字符 | @example True
  requireUpper?: boolean;  // 需要大写字母 | @example True
  ssoProviders?: string[];
  unicodeAllowed?: boolean;  // 是否允许Unicode密码（NFC标准化）
}

export interface PasswordStatusResponse {
  active?: boolean;  // 密码是否有效
  mustChangePassword?: boolean;  // 需要强制修改密码
  passwordChangedAt?: string;  // 密码最后修改时间
  passwordExpiresIn?: number;  // 密码剩余天数
  passwordWarning?: string;  // 密码警告: expiring/expired_grace/expired
}

/** 密码强度检查中的单个检查项 */
export interface PasswordStrengthCheckItem {
  key?: string;  // @example min_length
  label?: string;  // @example At least 8 characters
  passed?: boolean;  // @example True
}

/** 密码强度检查结果，包含分数和各项检查详情 */
export interface PasswordStrengthResponse {
  checks?: PasswordStrengthCheckItem[];
  crackSeconds?: number;  // @example 31557600
  crackTime?: string;  // @example centuries
  isStrong?: boolean;  // @example False
  score?: number;  // @example 75
  suggestions?: string[];  // @example ['Add another word or two']
  warning?: string;  // @example This is a common password
}

export interface PasswordStrengthResponseWrapper {
  code?: number;
  data?: PasswordStrengthResponse;
  message?: string;
  timestamp?: string;
}

export interface PermissionCheckDetailResponse {
  action?: string;
  allowed?: boolean;
  resource?: string;
  userId?: string;
}

export interface PermissionCheckResponse {
  allowed?: boolean;
}

export interface PhoneStatusResponse {
  phone?: string;
  phoneVerified?: boolean;
  verificationSent?: boolean;
}

export interface PhoneVerificationResponse {
  expiresIn?: number;
  phone?: string;
}

export interface PhoneVerifiedResponse {
  phone?: string;
}

/** 身份提供商证书信息 */
export interface ProviderCertificateResponse {
  createdAt?: string;  // @example 2026-04-15T10:30:00Z
  expiresAt?: string;  // @example 2027-04-15T10:30:00Z
  fingerprint?: string;  // @example sha256:abc123def456
  id?: string;  // @example cert_abc123
  name?: string;  // @example My SAML Signing Cert
  providerId?: string;  // @example idp_xyz789
  status?: string;  // @example active
  type?: string;  // @example signing
}

/** 公开认证配置，包含租户基本信息、密码策略、品牌定制 */
export interface PublicAuthConfigResponse {
  branding?: BrandingInfo;
  breachCheckEnabled?: boolean;
  captchaEnabled?: boolean;
  captchaProvider?: string;
  complianceProfile?: ComplianceProfileInfo;
  complianceWarnings?: ComplianceWarningItem[];
  crossTenantSwitchEnabled?: boolean;
  deviceFingerprintEnabled?: boolean;
  displayName?: string;  // @example My Tenant
  identityThreshold?: number;
  ipThreshold?: number;
  loginMethods?: string[];
  magicLinkEnabled?: boolean;
  maxConcurrentSessions?: number;
  membershipApproval?: string;
  oauthClientId?: string;  // @example app-01KV1ZCSJ5ZJ8G78B4TDG398NK
  oauthProviders?: string[];
  passkeyEnabled?: boolean;
  passwordPolicy?: PasswordPolicyResponse;
  pepperEnabled?: boolean;
  silentChallengeEnabled?: boolean;
  ssoProviders?: string[];
  tenantId?: string;  // @example tnt_xyz789
  tenantName?: string;  // @example my-tenant
  transmissionNonce?: string;
  transmissionNonceExpiresAt?: string;
  transmissionPublicKey?: string;
  transmissionPublicKeyId?: string;
}

export interface QrLoginCancelRequest {
  token: string;
}

export interface QrLoginConfirmRequest {
  token: string;
}

export interface QrLoginInitiateResponse {
  expiresIn?: number;
  numberMatching?: string;
  sessionToken?: string;
}

export interface QrLoginScanRequest {
  deviceInfo?: string;
  token: string;
}

export interface QrLoginStatusResponse {
  accessToken?: string;
  expiresIn?: number;
  numberMatching?: string;
  refreshToken?: string;
  status?: string;
}

/** 敏感操作前强制重新认证 */
export interface ReAuthenticateRequest {
  mfaCode?: string;  // MFA验证码
  password: string;  // 当前密码
}

/** 重新认证成功响应 */
export interface ReAuthenticateResponse {
  expiresIn?: number;  // 有效期 | @example 300
  message?: string;  // 结果消息 | @example re-authentication successful
  stepUpToken?: string;  // Step-up token | @example stepup_abc...
}

export interface ReapplyRegistrationRequest {
  email: string;  // Email
  invitationCode?: string;  // 邀请码
  reason?: string;  // 申请理由
}

export interface ReapplyRegistrationResponse {
  message?: string;
}

export interface ReapplyRegistrationResponseWrapper {
  code?: number;
  data?: ReapplyRegistrationResponse;
  message?: string;
  timestamp?: string;
}

export interface RecordConsentResponse {
  code?: number;
  data?: Record<string, unknown>;
  message?: string;
}

/** 记录登录失败请求 */
export interface RecordLoginFailureRequest {
  identifier: string;  // Identifier
  ip?: string;  // IP address
}

/** 记录登录成功请求 */
export interface RecordLoginSuccessRequest {
  ip?: string;  // IP address
  userId: string;  // User ID
}

export interface RecoverAccountRequest {
  identity: string;
}

export interface RecoverAccountResetRequest {
  code: string;
  identity: string;
  newPassword: string;
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
}

export interface RecoverAccountResetResponse {
  message?: string;
}

export interface RecoverAccountResponse {
  contactTypes?: string[];
  expiresIn?: number;
  maskedTo?: string;
  message?: string;
}

export interface RecoveryContactListResponse {
  code?: number;
  items?: RecoveryContactResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 备用联系方式 */
export interface RecoveryContactResponse {
  createdAt?: string;  // 创建时间 | @example 2026-04-15T10:30:00Z
  id?: string;  // 联系方式ID | @example rc_abc123
  type?: string;  // 类型 | @example email
  value?: string;  // 脱敏值 | @example ba***@example.com
  verified?: boolean;  // 是否已验证 | @example True
}

/** 刷新令牌请求参数 */
export interface RefreshTokenRequest {
  refreshToken: string;  // Refresh token
}

export interface RegisterByEmailCodeRequest {
  code: string;
  email: string;
  tenantId?: string;
  username?: string;
}

/** 邀请注册请求参数 */
export interface RegisterByInvitationRequest {
  invitationCode: string;
  password: string;
  username?: string;
}

/** OAuth显式补充注册请求参数 */
export interface RegisterByOAuthRequest {
  agreeTerms: boolean;
  password: string;
  pendingToken: string;
  phone?: string;
  username?: string;
}

export interface RegisterByOAuthResponse {
  code?: number;
  data?: LoginByCodeResponse;
  message?: string;
  timestamp?: string;
}

export interface RegisterByPhoneCodeRequest {
  code: string;
  phone: string;
  tenantId?: string;
  username?: string;
}

/** 用户注册请求参数 */
export interface RegisterRequest {
  birthDate?: string;  // Birth date (format: "2006-01-02")
  clientNonce?: string;  // hash 模式: 客户端随机 nonce
  email?: string;  // Email
  invitationCode?: string;  // 邀请码（invitation_only 模式下必填）
  password: string;  // Password or hash/ciphertext
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
  phone?: string;  // Phone
  tenantId?: string;  // 对齐 LoginRequest — 若填写则覆盖 header 推导值
  username?: string;  // Username
}

/** 用户注册结果 */
export interface RegisterResponse {
  membershipStatus?: string;  // 成员状态（审批模式下为 pending） | @example pending
  message?: string;  // Message | @example registration successful
  status?: string;  // Status | @example active
  userId?: string;  // User ID | @example usr_abc123
}

/** 通过备用邮箱/安全问题/信任设备发起账户恢复 */
export interface RequestAccountRecoveryRequest {
  identity: string;  // 已知的身份标识 | @example john@example.com
  method: "backup_email" | "security_qa" | "trusted_device" | "sms";  // 恢复方法
}

export interface RequestAccountRecoveryResponseWrapper {
  code?: number;
  message?: string;
  timestamp?: string;
}

export interface RequestActivationRequest {
  duration: string;
  justification: string;
  roleId: string;
}

export interface RequestMagicLinkRequest {
  email: string;
  tenantId?: string;
}

export interface ResendSMSCodeRequest {
  phone: string;
}

export interface ResendVerificationEmailRequest {
  email: string;
}

/** 重置密码请求参数 */
export interface ResetPasswordRequest {
  code: string;  // Verification code
  identity: string;  // Email or phone
  newPassword: string;
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
}

/** 重置密码响应 */
export interface ResetPasswordResponse {
  message?: string;  // Message
}

export interface RevokeActivationRequest {
  reason: string;
}

export interface RevokeConsentResponse {
  code?: number;
  message?: string;
}

export interface RiskAssessmentInfo {
  level?: string;
  recommendedMfaMethods?: string[];
  requireMfa?: boolean;
  score?: number;
}

export interface RiskEventListResponse {
  code?: number;
  items?: RiskEventResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface RiskEventResponse {
  createdAt?: string;  // 事件时间
  deviceId?: string;  // 设备ID
  eventType?: string;  // 事件类型
  geoLocation?: string;  // 地理位置
  id?: string;  // 事件ID
  ip?: string;  // 来源IP
  metadata?: string;  // 元数据
  riskScore?: number;  // 风险分数
  userId?: string;  // 用户ID
}

export interface RoleCheckResponse {
  hasRole?: boolean;
}

/** 吊销旧证书并上传新证书 */
export interface RotateCertificateRequest {
  certPem: string;  // @example -----BEGIN CERTIFICATE-----...
  name?: string;  // @example Rotated SAML Signing Cert
}

/** SSO回调请求 */
export interface SSOCallbackRequest {
  code: string;  // Code | @example saml-response-base64
  provider: string;  // Provider | @example saml
  state: string;  // State | @example random-state
}

export interface SSOCallbackResponse {
  code?: number;
  data?: Record<string, unknown>;
  message?: string;
}

/** SSO登录启动请求 */
export interface SSOInitiateRequest {
  provider: string;  // Provider | @example saml
  returnUrl?: string;  // Return URL | @example https://app.example.com/callback
  tenantId?: string;  // Tenant ID | @example tenant-001
}

/** SSO登录启动响应 */
export interface SSOInitiateResponse {
  authUrl?: string;  // Authorization URL
  provider?: string;  // Provider
  returnUrl?: string;  // Return URL
  state?: string;  // State parameter
  tenantId?: string;  // Tenant ID
}

/** 标记安全事件为已处理 */
export interface SecurityEventDismissRequest {
  reason?: string;  // 处理原因 | @example This was me, recognized device
}

export interface SecurityEventListResponse {
  code?: number;
  items?: SecurityEventResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 用户安全事件 */
export interface SecurityEventResponse {
  createdAt?: string;  // 事件时间 | @example 2026-04-15T10:30:00Z
  description?: string;  // 描述 | @example New login from Beijing, CN
  dismissed?: boolean;  // 是否已处理 | @example False
  id?: string;  // 事件ID | @example evt_abc123
  ip?: string;  // 来源IP | @example 203.0.113.1
  location?: string;  // 来源位置 | @example Beijing, CN
  severity?: string;  // 严重级别 | @example medium
  type?: string;  // 事件类型 | @example anomalous_login
}

/** 用户账户安全状态 */
export interface SecurityStatusResponse {
  canLogin?: boolean;  // 是否可以登录 | @example True
  emailVerified?: boolean;  // 邮箱验证 | @example True
  isLocked?: boolean;  // 是否锁定 | @example False
  lockUntil?: string;  // 锁定截止 | @example 2026-04-15T12:00:00Z
  loginFailCount?: number;  // 失败次数 | @example 0
  maxAttempts?: number;  // 最大尝试次数 | @example 5
  mfaEnabled?: boolean;  // MFA启用 | @example True
  phoneVerified?: boolean;  // 手机验证 | @example True
}

export interface SecurityStatusResponse2 {
  code?: number;
  data?: SecurityStatusResponse;
  message?: string;
  timestamp?: string;
}

/** 信任设备请求参数 */
export interface SelfTrustDeviceRequest {
  trusted?: boolean;  // Is trusted | @example True
}

export interface SendSMSCodeRequest {
  phone: string;
}

export interface SendVerificationEmailRequest {
  email: string;
}

export interface SessionPolicyResponse {
  refreshTokenRotation?: boolean;
  sessionBindToDevice?: boolean;
  sessionConcurrentLimit?: number;
  sessionIdleTtlMinutes?: number;
  sessionTtlMinutes?: number;
}

export interface SimpleResponseWrapper {
  code?: number;
  message?: string;
}

export interface StopImpersonationResponse {
  accessToken?: string;  // @example eyJhbGciOi...
  expiresIn?: number;  // @example 1800
  refreshToken?: string;  // @example eyJhbGciOi...
  tokenType?: string;  // @example Bearer
}

export interface SwitchTenantRequest {
  tenantId: string;
}

export interface SwitchTenantResponse {
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  tokenType?: string;
  user?: UserInfo;
}

export interface SwitchTenantResponseWrapper {
  code?: number;
  data?: SwitchTenantResponse;
  message?: string;
  timestamp?: string;
}

export interface TenantInfo {
  id?: string;
  name?: string;
  role?: string;
}

/** 票据签名登录请求参数 */
export interface TicketSigninRequest {
  ticket: string;  // 一次性票据 | @example a1b2c3d4...
}

/** 信任设备请求参数 */
export interface TrustDeviceRequest {
  trust: boolean;  // 是否信任
}

/** 解绑OAuth账户请求 */
export interface UnbindOAuthRequest {
  provider: string;  // Provider
}

/** 解锁账户请求参数 */
export interface UnlockAccountRequest {
  reason: string;  // 解锁原因（审计追踪必需）
}

export interface UpdateABACPolicyRequest {
  condition?: string;
  description?: string;
  effect?: string;
  enabled?: boolean;
  name?: string;
  priority?: number;
}

export interface UpdateAgeClassificationRequest {
  birthDate: string;  // @example 2010-03-15
  digitalConsentAge?: number;  // @example 13
  minorsAgeThreshold?: number;  // @example 18
}

export interface UpdateApiKeyScopesRequest {
  scopes: string[];
}

export interface UpdateApiKeyStatusRequest {
  status: "active" | "inactive";
}

/** 更新身份提供商的字段映射配置 */
export interface UpdateAttributeMappingRequest {
  mappings: Record<string, string>;
}

/** 更新全局认证安全配置 */
export interface UpdateAuthConfigRequest {
  breachCheckEnabled?: boolean;
  captchaEnabled?: boolean;
  changeCooldownMinutes?: number;  // 密码修改冷却时间（分钟）
  crossTenantSwitchEnabled?: boolean;
  deviceFingerprintEnabled?: boolean;
  expiryDays?: number;  // 密码过期天数
  gracePeriodDays?: number;  // 过期宽限天数
  historyCount?: number;  // 密码历史保留数量
  identityThreshold?: number;
  ipThreshold?: number;
  lockDurationSec?: number;  // 账户锁定时间（秒）
  loginMethods?: string[];
  magicLinkEnabled?: boolean;
  maxLength?: number;  // 最大长度
  maxLoginAttempts?: number;  // 最大登录失败次数
  membershipApproval?: string;
  minLength?: number;  // 最小长度
  oauthProviders?: string[];
  passkeyEnabled?: boolean;
  passwordTransmission?: string;  // 密码传输方式
  pepperEnabled?: boolean;
  requireDigit?: boolean;  // 需要数字
  requireLower?: boolean;  // 需要小写字母
  requireSpecial?: boolean;  // 需要特殊字符
  requireUpper?: boolean;  // 需要大写字母
  silentChallengeEnabled?: boolean;
  ssoProviders?: string[];
  unicodeAllowed?: boolean;
}

export interface UpdateCurrentUserAuthResponse {
  code?: number;
  message?: string;
}

/** 更新身份提供商请求参数 */
export interface UpdateIDPRequest {
  attributeMapping?: Record<string, string>;  // 字段映射
  authUrl?: string;  // 授权端点 | @example https://example.com/auth
  clientId?: string;  // Client ID | @example client_123
  clientSecret?: string;  // Client Secret | @example secret_456
  config?: Record<string, unknown>;  // 额外配置
  displayName?: string;  // 前端展示名称 | @example My OIDC Provider
  iconUrl?: string;  // 图标URL | @example https://example.com/icon.png
  name?: string;  // 显示名称 | @example My OIDC Provider
  scopes?: string[];  // 权限范围 | @example ['[openid', 'profile', 'email]']
  sortOrder?: number;  // 排序 | @example 0
  status?: string;  // 状态 | @example active
  tokenUrl?: string;  // Token端点 | @example https://example.com/token
  userInfoUrl?: string;  // 用户信息端点 | @example https://example.com/userinfo
}

/** 更新身份提供商的JIT（Just-In-Time）用户自动创建策略配置 */
export interface UpdateJITConfigRequest {
  attributeMappingId?: string;  // @example attr_map_001
  autoCreateUser?: boolean;  // @example True
  defaultRole?: string;  // @example member
  enabled?: boolean;  // @example True
}

/** 运行时更新密码策略请求 */
export interface UpdatePasswordPolicyRequest {
  changeCooldownMinutes?: number;  // 密码修改冷却时间（分钟）
  checkBreachedPasswords?: boolean;  // 是否检测已泄露密码
  expiryDays?: number;  // 密码过期天数
  gracePeriodDays?: number;  // 过期宽限天数
  historyCount?: number;  // 密码历史保留数量
  lockDurationSec?: number;  // 账户锁定时间（秒）
  maxLength?: number;  // 最大长度
  maxLoginAttempts?: number;  // 最大登录失败次数
  minLength?: number;  // 最小长度
  passwordTransmission?: string;  // 密码传输方式
  requireDigit?: boolean;  // 需要数字
  requireLower?: boolean;  // 需要小写字母
  requireSpecial?: boolean;  // 需要特殊字符
  requireUpper?: boolean;  // 需要大写字母
}

/** 更新当前认证用户请求 */
export interface UpdateUserAuthRequest {
  metadata?: Record<string, string>;  // Metadata (flat string map)
  mfaEnabled?: boolean;  // MFAEnabled
  username?: string;  // Username
}

export interface UpdateUserResponse {
  code?: number;
  data?: AuthUserResponse;
  message?: string;
  timestamp?: string;
}

/** 更新用户状态请求参数 */
export interface UpdateUserStatusRequest {
  reason?: string;  // 原因
  status: "active" | "banned" | "pending" | "suspended" | "locked" | "deleted";  // 目标状态
}

export interface UserDetailResponse {
  code?: number;
  data?: UserWithIdentitiesResponse;
  message?: string;
  timestamp?: string;
}

/** 用户基本信息 */
export interface UserInfo {
  createdAt?: string;  // Account creation time | @example 2026-01-15T10:30:00Z
  email?: string;  // Email | @example john@example.com
  id?: string;  // User ID | @example usr_abc123
  lastLoginAt?: string;  // Last login time | @example 2026-07-20T08:00:00Z
  mustChangePassword?: boolean;  // Password must be changed | @example False
  passwordExpiresIn?: number;  // Days until password expires | @example 30
  passwordWarning?: string;  // Password warning: expiring/expired_grace/expired | @example expiring
  phone?: string;  // Phone | @example 13800138000
  status?: string;  // Status | @example active
  username?: string;  // Username | @example john.doe
}

export interface UserInfoResponseWrapper {
  code?: number;
  data?: UserInfo;
  message?: string;
  timestamp?: string;
}

export interface UserListResponse {
  code?: number;
  items?: AuthUserResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 更新用户请求参数 */
export interface UserUpdateRequest {
  ageGroup?: string;  // 年龄段
  birthDate?: string;  // 出生日期
  departmentId?: string;  // 部门ID
  email?: string;  // 邮箱
  isMinor?: boolean;  // 是否未成年
  nickname?: string;  // 昵称
  pendingParentalConsent?: boolean;  // 是否等待家长同意
  phone?: string;  // 手机号
  reason?: string;  // 变更原因（变更 email 时必填，ADR-07）
  role?: string;  // 角色
  username?: string;  // 用户名
}

export interface UserWithIdentitiesResponse {
  identities?: IdentityResponse[];
  user?: AuthUserResponse;
}

export interface ValidateKeyRequest {
  apiKey: string;
}

export interface ValidateKeyResult {
  ipRestrictions?: IpRestrictionDTO[];
  keyId?: string;
  scopes?: string[];
  status?: string;
  tenantId?: string;
  userId?: string;
}

export interface VerificationTrackingQueryResponse {
  channel?: string;
  createdAt?: string;
  error?: string;
  expiresAt?: string;
  purpose?: string;
  sentAt?: string;
  status?: string;
  trackingId?: string;
}

/** 验证账户恢复验证码 */
export interface VerifyAccountRecoveryRequest {
  code: string;  // 验证码
  recoveryToken: string;  // 恢复令牌
}

/** 验证邮箱/手机号变更 */
export interface VerifyChangeRequest {
  code: string;  // 验证码
}

export interface VerifyEmailRequest {
  code: string;
  email: string;
}

export interface VerifyMFAChallengeRequest {
  challengeToken: string;
  code: string;
  mfaMethod?: string;  // totp/sms/email/push — default totp; for push, code is challenge_id
}

export interface VerifyPasswordData {
  userId?: string;
  valid?: boolean;
}

/** 验证密码请求 */
export interface VerifyPasswordRequest {
  identifier: string;  // Identifier
  password: string;  // Password
}

export interface VerifyPasswordResponse {
  code?: number;
  data?: VerifyPasswordData;
  message?: string;
  timestamp?: string;
}

export interface VerifyPhoneRequest {
  code: string;
  phone: string;
}

/** 验证重置码请求参数 */
export interface VerifyResetCodeRequest {
  code: string;  // Verification code
  identity: string;  // Email or phone
}

export interface Web3VerifyRequest {
  address: string;  // @example 0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B
  message: string;  // @example Sign this message to verify wallet ownership.
  signature: string;  // @example 0x1234abc...
}

export interface Web3VerifyResponse {
  address?: string;  // @example 0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B
  message?: string;  // @example Signature verification successful
  verified?: boolean;  // @example True
}

export interface WebAuthnAuthenticatorSelection {
  authenticatorAttachment?: string;
  residentKey?: string;
  userVerification?: string;
}

export interface WebAuthnCredentialDescriptor {
  id?: string;
  transports?: string[];
  type?: string;
}

export interface WebAuthnCredentialParameter {
  alg?: number;
  type?: string;
}

export interface WebAuthnCredentialResponse {
  aaguid?: string;
  attestationType?: string;
  authenticatorAttachment?: string;
  authenticatorName?: string;
  backupEligible?: boolean;
  backupState?: boolean;
  createdAt?: string;
  credentialId?: string;
  id?: string;
  lastUsedAt?: string;
  name?: string;
  signCount?: number;
  transports?: string;
  userId?: string;
  userVerified?: boolean;
}

export interface WebAuthnLoginOptionsResponse {
  allowCredentials?: WebAuthnCredentialDescriptor[];
  challenge?: string;
  rpId?: string;
  timeout?: number;
  userVerification?: string;
}

export interface WebAuthnLoginResponse {
  publicKey?: WebAuthnLoginOptionsResponse;
}

export interface WebAuthnLoginResponseWrapper {
  code?: number;
  data?: WebAuthnLoginResponse;
  message?: string;
  timestamp?: string;
}

export interface WebAuthnRPEntity {
  id?: string;
  name?: string;
}

/** WebAuthn navigator.credentials.create() 的 publicKey 参数 */
export interface WebAuthnRegistrationOptionsResponse {
  attestation?: string;
  authenticatorSelection?: WebAuthnAuthenticatorSelection;
  challenge?: string;
  pubKeyCredParams?: WebAuthnCredentialParameter[];
  rp?: WebAuthnRPEntity;
  timeout?: number;
  user?: WebAuthnUserEntity;
}

export interface WebAuthnRegistrationResponse {
  publicKey?: WebAuthnRegistrationOptionsResponse;
}

export interface WebAuthnRegistrationResponseWrapper {
  code?: number;
  data?: WebAuthnRegistrationResponse;
  message?: string;
  timestamp?: string;
}

export interface WebAuthnUserEntity {
  displayName?: string;
  id?: string;
  name?: string;
}

export interface IpRestrictionDTO {
  id?: string;
  label?: string;
  status?: string;
  value?: string;
}

export interface DataResponsearray_dto_ActivationResponse {
  code?: number;
  data?: ActivationResponse[];
  message?: string;
  timestamp?: string;
}

export interface DataResponsearray_dto_DiscoverTenantInfo {
  code?: number;
  data?: DiscoverTenantInfo[];
  message?: string;
  timestamp?: string;
}

export interface DataResponsearray_dto_LdapHealthResponse {
  code?: number;
  data?: LdapHealthResponse[];
  message?: string;
  timestamp?: string;
}

export interface DataResponsedomain_AgentCredentialInfo {
  code?: number;
  data?: AgentCredentialInfo;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedomain_AgentInfo {
  code?: number;
  data?: AgentInfo;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedomain_CreateAgentCredentialResult {
  code?: number;
  data?: CreateAgentCredentialResult;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedomain_FamilyMemberInfo {
  code?: number;
  data?: FamilyMemberInfo;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedomain_RobotInfo {
  code?: number;
  data?: RobotInfo;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_ABACPolicyResponse {
  code?: number;
  data?: ABACPolicyResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_ActivationResponse {
  code?: number;
  data?: ActivationResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_AuthUserResponse {
  code?: number;
  data?: AuthUserResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_BootstrapAdminResponse {
  code?: number;
  data?: BootstrapAdminResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_CleanupExpiredResponse {
  code?: number;
  data?: CleanupExpiredResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_ImpersonateResponse {
  code?: number;
  data?: ImpersonateResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_KeyExchangeResponse {
  code?: number;
  data?: KeyExchangeResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_LdapGroupRoleMappingResponse {
  code?: number;
  data?: LdapGroupRoleMappingResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_LdapLoginResponse {
  code?: number;
  data?: LdapLoginResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_LdapTestConnectionResponse {
  code?: number;
  data?: LdapTestConnectionResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_LinkSAMLUserResponse {
  code?: number;
  data?: LinkSAMLUserResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_PasswordStrengthResponse {
  code?: number;
  data?: PasswordStrengthResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_PermissionCheckDetailResponse {
  code?: number;
  data?: PermissionCheckDetailResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_PermissionCheckResponse {
  code?: number;
  data?: PermissionCheckResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_PublicAuthConfigResponse {
  code?: number;
  data?: PublicAuthConfigResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_QrLoginInitiateResponse {
  code?: number;
  data?: QrLoginInitiateResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_QrLoginStatusResponse {
  code?: number;
  data?: QrLoginStatusResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_RoleCheckResponse {
  code?: number;
  data?: RoleCheckResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_SessionPolicyResponse {
  code?: number;
  data?: SessionPolicyResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_StopImpersonationResponse {
  code?: number;
  data?: StopImpersonationResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_VerificationTrackingQueryResponse {
  code?: number;
  data?: VerificationTrackingQueryResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_Web3VerifyResponse {
  code?: number;
  data?: Web3VerifyResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_identityservice_internal_device_domain_DeviceInfo {
  code?: number;
  data?: DeviceInfo;
  message?: string;
  timestamp?: string;
}

export interface DataResponsehandler_IssueIntentTokenResponse {
  code?: number;
  data?: IssueIntentTokenResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsehandler_riskConfigResponse {
  code?: number;
  data?: RiskConfigResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsehandler_riskDashboardResponse {
  code?: number;
  data?: RiskDashboardResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsestring {
  code?: number;
  data?: string;
  message?: string;
  timestamp?: string;
}

export interface DeviceInfo {
  createdAt?: string;
  firmwareVer?: string;
  hardwareId?: string;
  identityId?: string;
  manufacturer?: string;
  name?: string;
  ownerId?: string;
  pairingCode?: string;
  status?: string;
  updatedAt?: string;
  workloadSubtype?: string;
}

export interface BackchannelLogoutRequest {
  logoutToken?: string;
}

export interface CheckPublicPasswordStrengthRequest {
  password: string;  // @example MyP@ssw0rd!
}

export interface IssueIntentTokenRequest {
  actions?: string[];
  allowedZones?: string[];
  maxSpeed?: number;
}

export interface IssueIntentTokenResponse {
  intentToken?: string;
}

export interface RevokeIntentTokenRequest {
  intentToken?: string;
}

export interface SamlLinkedAccountInfo {
  email?: string;
  id?: string;
  linkedAt?: string;
  nameId?: string;
  providerId?: string;
  providerName?: string;
}

export interface SelfServicePasswordStrengthRequest {
  password: string;  // @example MyP@ssw0rd!
}

export interface BeginLoginRequest {
  password: string;
}

export interface BeginRegistrationRequest {
  displayName?: string;
  password: string;
  userName: string;
}

export interface CompleteLoginRequest {
  id?: string;
  rawId?: string;
  response?: Record<string, unknown>;
  type?: string;
  userId?: string;
}

export interface CompleteRegistrationRequest {
  credential: CredentialCreation;
}

export interface RiskConfigRequest {
  criticalThreshold?: number;
  elevatedThreshold?: number;
  highThreshold?: number;
  learningPeriodDays?: number;
  moderateThreshold?: number;
  sessionRiskEnabled?: boolean;
  signalWeights?: SignalWeights;
}

export interface RiskConfigResponse {
  criticalThreshold?: number;
  elevatedThreshold?: number;
  highThreshold?: number;
  learningPeriodDays?: number;
  moderateThreshold?: number;
  sessionRiskEnabled?: boolean;
  signalWeights?: SignalWeights;
  tenantId?: string;
}

export interface RiskDashboardResponse {
  dayCounts?: RiskEventDayCount[];
  scoreRanges?: RiskScoreRange[];
  tenantId?: string;
  todayTotal?: number;
  topEventTypes?: RiskEventTypeCount[];
  topRiskUsers?: TopRiskUser[];
}

export interface AuthenticationResponse {
  id?: string;
  rawId?: string;
  response?: Record<string, unknown>;
  type?: string;
  userId?: string;
}

export interface CredentialCreation {
  id?: string;
  rawId?: string;
  response?: Record<string, unknown>;
  type?: string;
}

// ============================================================
// mfa-service
// ============================================================

export interface AdminBackupCodesListItem {
  count?: number;  // @example 8
  userId?: string;  // @example user-abc123
}

export interface AdminBackupCodesListResponse {
  code?: number;
  items?: AdminBackupCodesListItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface AdminPushChallengeItem {
  challengeId?: string;  // @example chal-abc123
  createdAt?: string;  // @example 2026-05-25T08:00:00Z
  loginContext?: string;  // @example login from Beijing
  numberMatching?: string;  // @example 42
  resolvedAt?: string;  // @example 2026-05-25T08:05:00Z
  status?: string;  // @example pending
  userId?: string;  // @example user-001
}

export interface AdminPushChallengeListResponse {
  code?: number;
  items?: AdminPushChallengeItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface BackupCodeVerifyDetailResponse {
  code?: number;
  data?: BackupCodeVerifyResponse;
  message?: string;
  timestamp?: string;
}

export interface BackupCodeVerifyRequest {
  code: string;  // @example 12345678
}

export interface BackupCodeVerifyResponse {
  remainingCodes?: number;  // @example 9
  valid?: boolean;  // @example True
}

export interface BackupCodesCountDetailResponse {
  code?: number;
  data?: BackupCodesCountResponse;
  message?: string;
  timestamp?: string;
}

export interface BackupCodesCountResponse {
  count?: number;  // @example 8
  maxCodes?: number;  // @example 10
  message?: string;
  shouldRegenerate?: boolean;  // @example False
}

export interface BackupCodesDetailResponse {
  code?: number;
  data?: BackupCodesResponse;
  message?: string;
  timestamp?: string;
}

export interface BackupCodesResponse {
  codes?: string[];  // @example ['["12345678"', '"23456789"]']
  message?: string;  // @example Store these backup codes securely
}

export interface BeginWebAuthnRegistrationRequest {
  displayName?: string;
}

export interface CreateIPWhitelistRequest {
  cidr: string;  // @example 192.168.1.0/24
  label: string;  // @example office network
}

export interface DataResponseprotocol_CredentialCreation {
  code?: number;
  data?: CredentialCreation;
  message?: string;
  timestamp?: string;
}

export interface DeviceSyncDetailResponse {
  code?: number;
  data?: DeviceSyncResponse;
  message?: string;
  timestamp?: string;
}

export interface DeviceSyncListResponse {
  code?: number;
  items?: DeviceSyncResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface DeviceSyncRequest {
  deviceFingerprint?: string;  // @example fp-abc123
  deviceName: string;  // @example iPhone 15
  totpDevices: string;  // @example [{"secret":"JBSWY3DPEHPK3PXP"}]
}

export interface DeviceSyncResponse {
  createdAt?: string;  // @example 2026-05-21T12:00:00Z
  deviceFingerprint?: string;  // @example fp-abc123
  deviceName?: string;  // @example iPhone 15
  id?: string;  // @example devsync_abc123
  lastSyncAt?: string;  // @example 2026-05-21T12:00:00Z
  totpDevices?: string;  // @example [{"secret":"JBSWY3DPEHPK3PXP"}]
}

export interface DisabledDetailResponse {
  code?: number;
  data?: DisabledResponse;
  message?: string;
  timestamp?: string;
}

export interface DisabledResponse {
  disabled?: boolean;  // @example True
}

export interface EmailDisableRequest {
  code: string;
}

export interface EmailEnrollDetailResponse {
  code?: number;
  data?: EmailEnrollResponse;
  message?: string;
  timestamp?: string;
}

export interface EmailEnrollRequest {
  email: string;  // @example user@example.com
}

export interface EmailEnrollResponse {
  email?: string;  // @example user@example.com
  enabled?: boolean;  // @example False
  methodType?: string;  // @example email
  status?: string;  // @example pending_verification
  verified?: boolean;  // @example False
}

export interface EmailSendData {
  expires?: string;
  sent?: boolean;
}

export interface EmailSendDetailResponse {
  code?: number;
  data?: EmailSendData;
  message?: string;
  timestamp?: string;
}

export interface EmailSendRequest {
  email: string;
  purpose?: string;
}

export interface EmailVerifyDetailResponse {
  code?: number;
  data?: ValidResponse;
  message?: string;
  timestamp?: string;
}

export interface EmailVerifyRequest {
  code: string;
  email?: string;  // 邮箱地址，用于创建 MFAConfig 记录
}

export interface EvaluateRiskPolicyDetailResponse {
  code?: number;
  data?: EvaluateRiskPolicyResponse;
  message?: string;
  timestamp?: string;
}

export interface EvaluateRiskPolicyRequest {
  deviceFingerprint?: string;
  ip?: string;
  userId: string;
}

export interface EvaluateRiskPolicyResponse {
  isNewDevice?: boolean;  // @example False
  level?: string;  // @example medium
  requiredMethods?: string[];  // @example ['["totp"', '"sms"]']
}

export interface FinishWebAuthnRegistrationRequest {
  id: string;
  rawId: string;
  response: Record<string, unknown>;
  type: string;
}

export interface GenerateBackupCodesRequest {}

export interface GetBackupCodesDetailResponse {
  code?: number;
  data?: GetBackupCodesResponse;
  message?: string;
  timestamp?: string;
}

export interface GetBackupCodesResponse {
  codes?: string[];  // @example ['["12345678"', '"23456789"]']
  count?: number;  // @example 8
  message?: string;  // @example Store these codes securely
}

export interface IPWhitelistDetailResponse {
  code?: number;
  data?: IPWhitelistResponse;
  message?: string;
  timestamp?: string;
}

export interface IPWhitelistListResponse {
  code?: number;
  items?: IPWhitelistResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface IPWhitelistResponse {
  cidr?: string;  // @example 192.168.1.0/24
  createdAt?: string;  // @example 2026-05-15T08:00:00Z
  enabled?: boolean;  // @example True
  id?: string;  // @example wl_abc123
  label?: string;  // @example office network
  tenantId?: string;  // @example tnt_001
}

export interface InternalEraseMFARequest {
  tenantId: string;
  userId: string;
}

export interface InternalMFAStatusDetailResponse {
  code?: number;
  data?: InternalMFAStatusResponse;
  message?: string;
  timestamp?: string;
}

export interface InternalMFAStatusResponse {
  email?: MFAMethodStatus;
  sms?: MFAMethodStatus;
  totp?: MFAMethodStatus;
}

export interface InternalTOTPDisableRequest {
  tenantId: string;
  userId: string;
}

export interface InternalTOTPValidateRequest {
  code: string;
  tenantId?: string;
  userId: string;
}

export interface MFAChallengeDetailResponse {
  code?: number;
  data?: MFAChallengeResponse;
  message?: string;
  timestamp?: string;
}

export interface MFAChallengeRequest {
  method: string;  // @example sms
}

export interface MFAChallengeResponse {
  challengeId?: string;  // @example challenge-1234567890
  createdAt?: string;  // @example 2026-04-14T12:00:00Z
  expiresIn?: number;  // @example 300
  method?: string;  // @example sms
  tenantId?: string;  // @example tenant-001
  userId?: string;  // @example user-001
}

export interface MFAConfigAuditLogItem {
  action?: string;  // @example mfa_totp.enabled
  id?: string;  // @example log_abc123
  message?: string;  // @example TOTP enabled successfully
  module?: string;  // @example data
  operatorId?: string;  // @example usr_admin
  targetId?: string;  // @example mfa_abc123
  targetType?: string;  // @example mfa_totp
  tenantId?: string;  // @example tnt_001
  timestamp?: string;  // @example 2026-05-15T10:00:00Z
}

export interface MFAConfigAuditLogListResponse {
  code?: number;
  items?: MFAConfigAuditLogItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface MFADeletedResponse {
  deleted?: boolean;  // @example True
  type?: string;  // @example sms
}

export interface MFAMethodDeleteDetailResponse {
  code?: number;
  data?: MFADeletedResponse;
  message?: string;
  timestamp?: string;
}

export interface MFAMethodItem {
  createdAt?: string;  // @example 2026-05-14T08:00:00Z
  detail?: string;  // @example +8613800****000
  enabled?: boolean;  // @example True
  methodType?: string;  // @example totp
  primary?: boolean;  // @example True
  verified?: boolean;  // @example True
}

export interface MFAMethodListResponse {
  code?: number;
  items?: MFAMethodItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface MFAMethodStatus {
  email?: string;  // @example user@example.com
  enabled?: boolean;  // @example True
  phone?: string;  // @example +8613800****000
  verified?: boolean;  // @example True
}

export interface MFAStatusDetailResponse {
  code?: number;
  data?: MFAStatusResponse;
  message?: string;
  timestamp?: string;
}

export interface MFAStatusResponse {
  emailAddress?: string;  // @example user@example.com
  emailEnabled?: boolean;  // @example True
  smsEnabled?: boolean;  // @example False
  smsPhone?: string;  // @example +8613800****000
  totpEnabled?: boolean;  // @example True
}

export interface PushApproveRequest {
  challengeId: string;  // @example chal-abc123
  deviceKey?: string;  // @example hmac-sig
  numberMatching: string;  // @example 42
}

export interface PushChallengeDetailResponse {
  code?: number;
  data?: PushChallengeResponse;
  message?: string;
  timestamp?: string;
}

export interface PushChallengeRequest {
  deviceId?: string;  // @example dev-001
  loginContext?: string;  // @example login from Beijing
}

export interface PushChallengeResponse {
  challengeId?: string;  // @example chal-abc123
  createdAt?: string;  // @example 2026-05-12T12:00:00Z
  expiresIn?: number;  // @example 120
  loginContext?: string;  // @example login from Beijing
  numberMatching?: string;  // @example 42
  status?: string;  // @example pending
  userId?: string;  // @example user-001
}

export interface PushChallengeStatusDetailResponse {
  code?: number;
  data?: PushChallengeStatusResponse;
  message?: string;
  timestamp?: string;
}

export interface PushChallengeStatusResponse {
  challengeId?: string;  // @example chal-abc123
  loginContext?: string;  // @example login from Beijing
  numberMatching?: string;  // @example 42
  resolvedAt?: string;  // @example 2026-05-25T12:05:00Z
  status?: string;  // @example approved
}

export interface PushDenyRequest {
  challengeId: string;  // @example chal-abc123
  deviceKey?: string;  // @example hmac-sig
  numberMatching: string;  // @example 42
}

export interface PushHistoryItem {
  challengeId?: string;  // @example chal-abc123
  createdAt?: string;  // @example 2026-05-25T08:00:00Z
  loginContext?: string;  // @example login from Beijing
  resolvedAt?: string;  // @example 2026-05-25T08:05:00Z
  status?: string;  // @example approved
}

export interface PushHistoryListResponse {
  code?: number;
  items?: PushHistoryItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PushStatsDetailResponse {
  code?: number;
  data?: PushStatsResponse;
  message?: string;
  timestamp?: string;
}

export interface PushStatsResponse {
  approved?: number;  // @example 89
  denied?: number;  // @example 12
  expired?: number;  // @example 34
  pending?: number;  // @example 125
  total?: number;  // @example 260
}

export interface RiskPolicyDetailResponse {
  code?: number;
  data?: RiskPolicyResponse;
  message?: string;
  timestamp?: string;
}

export interface RiskPolicyItem {
  createdAt?: string;  // @example 2026-05-25T08:00:00Z
  description?: string;  // @example High-risk policy for new devices
  enabled?: boolean;  // @example True
  id?: string;  // @example rp_abc123
  level?: string;  // @example high
  requiredMethods?: string[];  // @example ['["totp"', '"sms"]']
  updatedAt?: string;  // @example 2026-05-25T08:00:00Z
}

export interface RiskPolicyItemDetailResponse {
  code?: number;
  data?: RiskPolicyItem;
  message?: string;
  timestamp?: string;
}

export interface RiskPolicyLevel {
  requiredMethods?: string[];  // @example ['["totp"', '"sms"]']
}

export interface RiskPolicyListResponseWrap {
  code?: number;
  items?: RiskPolicyItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface RiskPolicyResponse {
  highRisk?: RiskPolicyLevel;
  lowRisk?: RiskPolicyLevel;
  mediumRisk?: RiskPolicyLevel;
  tenantId?: string;  // @example tnt_abc123
}

export interface SMSDisableRequest {
  code: string;
}

export interface SMSEnrollDetailResponse {
  code?: number;
  data?: SMSEnrollResponse;
  message?: string;
  timestamp?: string;
}

export interface SMSEnrollRequest {
  phone: string;  // @example +8613800138000
}

export interface SMSEnrollResponse {
  enabled?: boolean;  // @example False
  methodType?: string;  // @example sms
  phone?: string;  // @example +8613800****000
  status?: string;  // @example pending_verification
  verified?: boolean;  // @example False
}

export interface SMSSendDetailResponse {
  code?: number;
  data?: SMSSendResponse;
  message?: string;
  timestamp?: string;
}

export interface SMSSendRequest {
  phone: string;
  purpose?: string;  // login, bind, reset
}

export interface SMSSendResponse {
  expires?: string;  // @example 2026-05-25T12:05:00Z
  sent?: boolean;  // @example True
}

export interface SMSVerifyDetailResponse {
  code?: number;
  data?: SMSVerifyResponse;
  message?: string;
  timestamp?: string;
}

export interface SMSVerifyRequest {
  code: string;
  phone?: string;  // 手机号，用于创建 MFAConfig 记录
}

export interface SMSVerifyResponse {
  valid?: boolean;  // @example True
}

export interface SetPrimaryCredentialDetailResponse {
  code?: number;
  data?: SetPrimaryCredentialResponse;
  message?: string;
  timestamp?: string;
}

export interface SetPrimaryCredentialRequest {
  type: string;
}

export interface SetPrimaryCredentialResponse {
  credentialId?: string;  // @example cred_abc123def456
  primary?: boolean;  // @example True
  type?: string;  // @example totp
}

export interface StepUpDetailResponse {
  code?: number;
  data?: StepUpResponse;
  message?: string;
  timestamp?: string;
}

export interface StepUpRequest {
  code: string;  // @example 123456
  method: "totp" | "sms" | "email";  // @example totp
  userId: string;  // @example usr_abc123
}

export interface StepUpResponse {
  expiresIn?: number;  // @example 300
  message?: string;  // @example step-up authentication successful
  stepUpToken?: string;  // @example eyJ...
  valid?: boolean;  // @example True
}

export interface TOTPDeviceItem {
  createdAt?: string;  // @example 2026-05-12T12:00:00Z
  deviceId?: string;  // @example dev-abc123
  deviceName?: string;  // @example iPhone 15
  enabled?: boolean;  // @example True
  lastUsedAt?: string;  // @example 2026-05-12T12:00:00Z
  verified?: boolean;  // @example True
}

export interface TOTPDeviceListResponse {
  code?: number;
  items?: TOTPDeviceItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface TOTPDeviceRegisterDetailResponse {
  code?: number;
  data?: TOTPDeviceRegisterResponse;
  message?: string;
  timestamp?: string;
}

export interface TOTPDeviceRegisterRequest {
  account?: string;  // @example user@example.com
  deviceFingerprint?: string;  // @example fp-abc123
  deviceName: string;  // @example iPhone 15
}

export interface TOTPDeviceRegisterResponse {
  deviceId?: string;  // @example dev-abc123
  deviceName?: string;  // @example iPhone 15
  qrCode?: string;  // @example data:image/png;base64,...
  qrCodeUrl?: string;  // @example otpauth://totp/...
  secret?: string;  // @example JBSWY3DPEHPK3PXP
}

export interface TOTPDeviceRevokeRequest {
  code: string;  // @example 123456
}

export interface TOTPDisableRequest {
  code: string;
}

export interface TOTPEnableDetailResponse {
  code?: number;
  data?: TOTPEnableResponse;
  message?: string;
  timestamp?: string;
}

export interface TOTPEnableRequest {
  account?: string;
  deviceName?: string;
}

export interface TOTPEnableResponse {
  backupCodes?: string[];  // @example ['["12345678"', '"23456789"]']
  qrCode?: string;  // @example data:image/png;base64,iVBORw0KGgo...
  qrCodeUrl?: string;  // @example otpauth://totp/Autional:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Autional
  secret?: string;  // @example JBSWY3DPEHPK3PXP
  setupUrl?: string;  // @example https://auth.example.com/mfa/totp/setup
}

export interface TOTPValidateRequest {
  code: string;
  userId: string;
}

export interface TOTPVerifyRequest {
  code: string;
}

export interface TrustedDeviceCountDetailResponse {
  code?: number;
  data?: TrustedDeviceCountResponse;
  message?: string;
  timestamp?: string;
}

export interface TrustedDeviceCountResponse {
  count?: number;  // @example 3
}

export interface TrustedDeviceDataResponse {
  code?: number;
  data?: TrustedDeviceItem;
  message?: string;
  timestamp?: string;
}

export interface TrustedDeviceItem {
  createdAt?: string;  // @example 2026-05-25T08:00:00Z
  deviceName?: string;  // @example iPhone 15
  id?: string;  // @example td_abc123
  ipAddress?: string;  // @example 192.168.1.100
  trustedUntil?: string;  // @example 2026-06-25T08:00:00Z
}

export interface TrustedDeviceListResponse {
  code?: number;
  items?: TrustedDeviceItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface UpdateIPWhitelistRequest {
  cidr?: string;
  enabled?: boolean;
  label?: string;
}

export interface UpdateRiskPolicyByLevelRequest {
  description?: string;
  enabled?: boolean;
  requiredMethods: string[];
}

export interface UpdateRiskPolicyRequest {
  highRisk: string[];
  lowRisk: string[];
  mediumRisk: string[];
}

export interface UpdateWebAuthnCredentialRequest {
  name: string;
}

export interface ValidDetailResponse {
  code?: number;
  data?: ValidResponse;
  message?: string;
  timestamp?: string;
}

export interface ValidResponse {
  valid?: boolean;  // @example True
}

export interface WebAuthnCredentialDataResponse {
  code?: number;
  data?: WebAuthnCredentialItem;
  message?: string;
  timestamp?: string;
}

export interface WebAuthnCredentialItem {
  createdAt?: string;  // @example 2026-05-20T08:00:00Z
  credentialId?: string;  // @example cred_xyz789
  deviceInfo?: string;  // @example FIDO2
  id?: string;  // @example wc_abc123
  lastUsedAt?: string;  // @example 2026-05-25T08:00:00Z
  name?: string;  // @example YubiKey 5C
}

export interface WebAuthnCredentialListResponse {
  code?: number;
  items?: WebAuthnCredentialItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export type AttestationFormat = "packed" | "tpm" | "android-key" | "android-safetynet" | "fido-u2f" | "apple" | "compound" | "none";

export type AuthenticationExtensions = Record<string, unknown>;

export type AuthenticatorAttachment = "platform" | "cross-platform";

export interface AuthenticatorSelection {
  authenticatorAttachment?: AuthenticatorAttachment;  // AuthenticatorAttachment If this member is present, eligible authenticators are filtered to only authenticators attach...
  requireResidentKey?: boolean;  // RequireResidentKey this member describes the Relying Party's requirements regarding resident credentials. If the para...
  residentKey?: ResidentKeyRequirement;  // ResidentKey this member describes the Relying Party's requirements regarding resident credentials per Webauthn Level 2.
  userVerification?: UserVerificationRequirement;  // UserVerification This member describes the Relying Party's requirements regarding user verification for the create() ...
}

export type AuthenticatorTransport = "usb" | "nfc" | "ble" | "smart-card" | "hybrid" | "internal";

export type ConveyancePreference = "none" | "indirect" | "direct" | "enterprise";

export interface CredentialDescriptor {
  id?: number[];  // CredentialID The ID of a credential to allow/disallow.
  transports?: AuthenticatorTransport[];  // The authenticator transports that can be used.
  type?: CredentialType;  // The valid credential types.
}

export type CredentialMediationRequirement = "" | "silent" | "optional" | "conditional" | "required";

export interface CredentialParameter {
  alg?: COSEAlgorithmIdentifier;
  type?: CredentialType;
}

export type CredentialType = "public-key";

export interface PublicKeyCredentialCreationOptions {
  attestation?: ConveyancePreference;
  attestationFormats?: AttestationFormat[];
  authenticatorSelection?: AuthenticatorSelection;
  challenge?: number[];
  excludeCredentials?: CredentialDescriptor[];
  extensions?: AuthenticationExtensions;
  hints?: PublicKeyCredentialHints[];
  pubKeyCredParams?: CredentialParameter[];
  rp?: RelyingPartyEntity;
  timeout?: number;
  user?: UserEntity;
}

export type PublicKeyCredentialHints = "security-key" | "client-device" | "hybrid";

export interface RelyingPartyEntity {
  id?: string;  // A unique identifier for the Relying Party entity, which sets the RP ID.
  name?: string;  // A human-palatable name for the entity. Its function depends on what the PublicKeyCredentialEntity represents: When in...
}

export type ResidentKeyRequirement = "discouraged" | "preferred" | "required";

export interface UserEntity {
  displayName?: string;  // A human-palatable name for the user account, intended only for display. For example, "Alex P. Müller" or "田中 倫". The ...
  id?: unknown;  // ID is the user handle of the user account entity. To ensure secure operation, authentication and authorization decisi...
  name?: string;  // A human-palatable name for the entity. Its function depends on what the PublicKeyCredentialEntity represents: When in...
}

export type UserVerificationRequirement = "required" | "preferred" | "discouraged";

export type COSEAlgorithmIdentifier = "-7" | "-8" | "-9" | "-19" | "-35" | "-36" | "-37" | "-38" | "-39" | "-47" | "-48" | "-49" | "-50" | "-51" | "-52" | "-257" | "-258" | "-259" | "-65535";

// ============================================================
// notification-service
// ============================================================

export interface AnnouncementDetailResponse {
  code?: number;
  data?: AnnouncementResponse;
  message?: string;
  timestamp?: string;
}

export interface AnnouncementListResponse {
  code?: number;
  items?: AnnouncementResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 公告信息响应 */
export interface AnnouncementResponse {
  content?: string;  // @example 系统将于2026-05-15进行升级维护
  createdAt?: string;  // @example 2026-05-09T12:00:00Z
  dismissals?: number;  // @example 5
  expireAt?: string;  // @example 2026-05-20T12:00:00Z
  id?: string;  // @example ann_abc123
  publishAt?: string;  // @example 2026-05-10T12:00:00Z
  status?: string;  // @example published
  targetRoles?: string[];
  tenantId?: string;  // @example tnt_xyz789
  title?: string;  // @example 系统升级公告
  updatedAt?: string;  // @example 2026-05-09T12:00:00Z
  views?: number;  // @example 100
}

export interface AnnouncementStatsDetailResponse {
  code?: number;
  data?: AnnouncementStatsResponse;
  message?: string;
  timestamp?: string;
}

/** 公告阅读统计 */
export interface AnnouncementStatsResponse {
  dismissals?: number;  // @example 5
  views?: number;  // @example 100
}

export interface BatchSendNotificationDetailResponse {
  code?: number;
  data?: BatchSendNotificationResponse;
  message?: string;
}

/** 批量发送通知请求参数 */
export interface BatchSendNotificationRequest {
  content: string;  // 内容 | @example 您的账户已成功升级
  priority?: string;  // 优先级 | @example medium
  title: string;  // 标题 | @example 系统通知
  type?: string;  // 类型 | @example system
  userIds: string[];  // 用户ID列表 | @example ['usr_001', 'usr_002']
}

/** 批量发送通知结果 */
export interface BatchSendNotificationResponse {
  notificationIds?: string[];  // 通知ID列表 | @example ['["ntf_001"]']
  sentCount?: number;  // 发送数量 | @example 5
}

export interface BroadcastNotificationDetailResponse {
  code?: number;
  data?: BroadcastNotificationResponse;
  message?: string;
}

/** 全租户广播通知的请求参数 */
export interface BroadcastNotificationRequest {
  content: string;  // 内容 | @example 系统将于今晚22:00-23:00进行维护
  title: string;  // 标题 | @example 系统公告
  type?: string;  // 类型 | @example system
}

/** 广播通知的响应结果 */
export interface BroadcastNotificationResponse {
  broadcastId?: string;  // 广播ID | @example broadcast-1234567890
  content?: string;  // 内容 | @example 系统将于今晚22:00-23:00进行维护
  recipients?: number;  // 接收人数 | @example 100
  title?: string;  // 标题 | @example 系统公告
  type?: string;  // 类型 | @example system
}

/** 单个通知渠道的偏好 */
export interface ChannelPref {
  enabled?: boolean;  // 启用 | @example True
  quietHoursEnd?: string;  // 免打扰结束 | @example 08:00
  quietHoursStart?: string;  // 免打扰开始 | @example 22:00
  types?: string[];  // 类型 | @example ['["system"', '"user"]']
}

/** 渠道偏好响应 */
export interface ChannelPrefResponse {
  enabled?: boolean;  // 启用 | @example True
  quietHoursEnd?: string;  // 免打扰结束 | @example 08:00
  quietHoursStart?: string;  // 免打扰开始 | @example 22:00
  types?: string[];  // 类型
}

/** 创建公告的请求参数 */
export interface CreateAnnouncementRequest {
  content: string;  // @example 系统将于2026-05-15进行升级维护
  expireAt?: string;  // @example 2026-05-20T12:00:00Z
  publishAt?: string;  // @example 2026-05-10T12:00:00Z
  targetRoles?: string[];
  title: string;  // @example 系统升级公告
}

export interface CreateEventMappingRequest {
  channel?: string;
  eventType: string;
  priority?: string;
  templateCode: string;
}

export interface CreateGlobalVariableRequest {
  key: string;
  value: string;
}

export interface DataResponsedto_ExportUserDataResponse {
  code?: number;
  data?: ExportUserDataResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_NotificationPreferencesResponse {
  code?: number;
  data?: NotificationPreferencesResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_NotificationResponse {
  code?: number;
  data?: NotificationResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_TemplateResponse {
  code?: number;
  data?: TemplateResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsehandler_HealthErrorResponse {
  code?: number;
  data?: HealthErrorResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsemap_string_string {
  code?: number;
  data?: Map_string_string;
  message?: string;
  timestamp?: string;
}

export interface DeleteNotificationDetailResponse {
  code?: number;
  data?: DeleteNotificationResponse;
  message?: string;
  timestamp?: string;
}

/** 删除通知请求参数 */
export interface DeleteNotificationRequest {
  notificationId: string;  // 通知ID | @example ntf_abc123
  userId: string;  // 用户ID | @example usr_abc123
}

/** 删除通知结果 */
export interface DeleteNotificationResponse {
  deleted?: boolean;  // 删除成功 | @example True
  notificationId?: string;  // 通知ID | @example ntf_abc123
}

export interface EraseUserNotificationsRequest {
  userId: string;
}

export interface EventMappingDetailResponse {
  code?: number;
  data?: EventMappingResponse;
  message?: string;
  timestamp?: string;
}

export interface EventMappingListResponse {
  code?: number;
  items?: EventMappingResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface EventMappingResponse {
  appId?: string;
  channel?: string;
  eventType?: string;
  id?: string;
  isEnabled?: boolean;
  priority?: string;
  templateCode?: string;
  tenantId?: string;
}

export interface GlobalVariableDetailResponse {
  code?: number;
  data?: GlobalVariableResponse;
  message?: string;
  timestamp?: string;
}

export interface GlobalVariableListResponse {
  code?: number;
  items?: GlobalVariableResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface GlobalVariableResponse {
  appId?: string;
  id?: string;
  key?: string;
  tenantId?: string;
  value?: string;
}

export interface InternalCreateTemplateRequest {
  code?: string;
  content?: string;
  format?: string;
  locale?: string;
  name?: string;
  priority?: string;
  title?: string;
  type?: string;
  variables?: string[];
}

export interface InternalPushSendRequest {
  body: string;  // @example Login from Beijing - Approve?
  data?: Record<string, unknown>;
  title: string;  // @example New Login Attempt
  userId?: string;  // @example user-001
}

export interface ListResponsedto_NotificationResponse {
  code?: number;
  items?: NotificationResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface MarkReadDetailResponse {
  code?: number;
  data?: MarkReadResponse;
  message?: string;
  timestamp?: string;
}

/** 标记已读结果 */
export interface MarkReadResponse {
  markedCount?: number;  // 标记数量 | @example 5
  success?: boolean;  // 成功 | @example True
}

export interface NotificationDetailResponse {
  code?: number;
  data?: NotificationResponse;
  message?: string;
  timestamp?: string;
}

export interface NotificationListResponse {
  code?: number;
  items?: NotificationResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface NotificationPreferencesDetailResponse {
  code?: number;
  data?: NotificationPreferencesResponse;
  message?: string;
  timestamp?: string;
}

/** 更新通知偏好设置请求参数 */
export interface NotificationPreferencesRequest {
  channels?: Record<string, ChannelPref>;  // 渠道设置
  emailEnabled?: boolean;  // 邮件启用 | @example True
  pushEnabled?: boolean;  // 推送启用 | @example True
  smsEnabled?: boolean;  // 短信启用 | @example False
  userId: string;  // 用户ID | @example usr_abc123
}

/** 用户通知偏好设置 */
export interface NotificationPreferencesResponse {
  channels?: Record<string, ChannelPrefResponse>;  // 渠道设置
  emailEnabled?: boolean;  // 邮件启用 | @example True
  pushEnabled?: boolean;  // 推送启用 | @example True
  quietHours?: Record<string, ChannelPrefResponse>;  // 免打扰时段
  smsEnabled?: boolean;  // 短信启用 | @example False
  typePrefs?: Record<string, ChannelPrefResponse>;  // 通知类型偏好
  updatedAt?: string;  // 更新时间 | @example 2026-04-15T10:30:00Z
  userId?: string;  // 用户ID | @example usr_abc123
}

/** 通知信息响应 */
export interface NotificationResponse {
  actionUrl?: string;  // 操作链接 | @example /security
  content?: string;  // 内容 | @example 您的账户已成功升级
  createdAt?: string;  // 创建时间 | @example 2026-04-15T10:30:00Z
  eventType?: string;  // @example status.incident.created
  id?: string;  // 通知ID | @example ntf_abc123
  isRead?: boolean;  // 是否已读 | @example False
  metadata?: string;  // 元数据JSON | @example {"ip":"1.2.3.4"}
  priority?: string;  // 优先级 | @example medium
  readAt?: string;  // 阅读时间 | @example 2026-04-15T11:00:00Z
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  title?: string;  // 标题 | @example 系统通知
  type?: string;  // 类型 | @example system
  userId?: string;  // 用户ID | @example usr_abc123
}

export interface NotificationStatsDetailResponse {
  code?: number;
  data?: NotificationStatsResponse;
  message?: string;
  timestamp?: string;
}

/** 通知发送与阅读统计（notification 层不追踪投递状态，仅追踪已读/未读） */
export interface NotificationStatsResponse {
  byType?: Record<string, number>;  // 按类型
  readRate?: number;  // 阅读率 | @example 0.45
  totalRead?: number;  // 总阅读 | @example 450
  totalSent?: number;  // 总发送 | @example 1000
}

export interface PushSendDetailResponse {
  code?: number;
  data?: PushSendResponse;
  message?: string;
  timestamp?: string;
}

export interface PushSendResponse {
  failed?: number;  // @example 0
  sent?: number;  // @example 3
  total?: number;  // @example 3
}

export interface PushSubscriptionDetailResponse {
  code?: number;
  data?: PushSubscriptionResponse;
  message?: string;
  timestamp?: string;
}

export interface PushSubscriptionKeys {
  auth: string;  // @example xK2s9...
  p256dh: string;  // @example BP7S2s9...
}

export interface PushSubscriptionListResponse {
  code?: number;
  items?: PushSubscriptionResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PushSubscriptionRequest {
  deviceName?: string;  // @example Chrome on Windows
  deviceType?: string;  // @example web
  endpoint: string;  // @example https://fcm.googleapis.com/fcm/send/...
  keys: PushSubscriptionKeys;
  userAgent?: string;
}

export interface PushSubscriptionResponse {
  createdAt?: string;  // @example 2026-05-12T12:00:00Z
  deviceName?: string;  // @example Chrome on Windows
  deviceType?: string;  // @example web
  endpoint?: string;  // @example https://fcm.googleapis.com/fcm/send/...
  id?: string;  // @example sub-abc123
}

export interface ReadReportDetailResponse {
  code?: number;
  data?: ReadReportResponse;
  message?: string;
  timestamp?: string;
}

/** 通知已读/未读统计报告 */
export interface ReadReportResponse {
  readCount?: number;  // 已读 | @example 450
  readRate?: number;  // 阅读率 | @example 0.45
  tenantId?: string;  // 租户ID | @example tenant-001
  totalSent?: number;  // 总发送 | @example 1000
  unreadCount?: number;  // 未读 | @example 550
}

export interface SecuritySubscribeDetailResponse {
  code?: number;
  data?: SecuritySubscribeResponse;
  message?: string;
  timestamp?: string;
}

export interface SecuritySubscribeRequest {
  captchaProvider?: string;
  captchaToken?: string;
  company?: string;  // @example Example Inc
  email: string;  // @example security@example.com
  topics?: string[];  // @example ['["security_advisory"', '"compliance_update"]']
}

export interface SecuritySubscribeResponse {
  message?: string;  // @example 确认邮件已发送
  status?: string;  // @example pending_confirmation
}

export interface SecurityUnsubscribeDetailResponse {
  code?: number;
  data?: SecurityUnsubscribeResponse;
  message?: string;
  timestamp?: string;
}

export interface SecurityUnsubscribeRequest {
  email: string;  // @example security@example.com
  token?: string;  // @example unsub_token_abc123
}

export interface SecurityUnsubscribeResponse {
  message?: string;  // @example 已取消订阅
  status?: string;  // @example unsubscribed
}

/** 使用模板发送通知请求参数 */
export interface SendFromTemplateRequest {
  templateId: string;  // 模板ID | @example tpl_abc123
  userId: string;  // 用户ID | @example usr_abc123
  variables: Record<string, unknown>;  // 变量
}

export interface SendNotificationCompatDetailResponse {
  code?: number;
  data?: SendNotificationCompatResponse;
  message?: string;
  timestamp?: string;
}

/** 发送通知的响应结果（兼容端点） */
export interface SendNotificationCompatResponse {
  id?: string;  // 通知ID | @example notif-1234567890
  status?: string;  // 状态 | @example sent
}

/** 发送通知的请求参数 */
export interface SendNotificationRequest {
  aggregationKey?: string;  // 聚合键（同key通知聚合为一条） | @example new_follower
  content: string;  // 内容 | @example 您的账户已成功升级
  metadata?: Record<string, unknown>;  // 元数据
  priority?: string;  // 优先级 | @example medium
  title: string;  // 标题 | @example 系统通知
  type?: string;  // 类型 | @example system
  userId: string;  // 用户ID | @example usr_abc123
}

export interface TestNotificationDetailResponse {
  code?: number;
  data?: TestNotificationResponse;
  message?: string;
}

/** 发送测试通知的请求参数 */
export interface TestNotificationRequest {
  channel: string;  // 渠道 | @example email
  target: string;  // 目标 | @example user@example.com
}

/** 测试通知发送结果 */
export interface TestNotificationResponse {
  channel?: string;  // 渠道 | @example email
  status?: string;  // 状态 | @example sent
  target?: string;  // 目标 | @example user@example.com
  testId?: string;  // 测试ID | @example test-1234567890
}

export interface TrendPoint {
  date?: string;  // @example 2026-06-04
  read?: number;  // @example 30
  sent?: number;  // @example 45
}

export interface TrendResponse {
  code?: number;
  items?: TrendPoint[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface UnreadCountDetailResponse {
  code?: number;
  data?: UnreadCountResponse;
  message?: string;
  timestamp?: string;
}

/** 用户未读通知数量 */
export interface UnreadCountResponse {
  lastNotificationAt?: string;  // 最后通知 | @example 2026-04-15T10:30:00Z
  unreadCount?: number;  // 未读数 | @example 5
  userId?: string;  // 用户ID | @example usr_abc123
}

/** 更新公告的请求参数（仅在draft状态可编辑） */
export interface UpdateAnnouncementRequest {
  content?: string;
  expireAt?: string;
  publishAt?: string;
  targetRoles?: string[];
  title?: string;
}

export interface UpdateEventMappingRequest {
  channel?: string;
  isEnabled?: boolean;
  priority?: string;
  templateCode?: string;
}

export interface UpdateGlobalVariableRequest {
  value: string;
}

export interface VapidPublicKeyDetailResponse {
  code?: number;
  data?: VapidPublicKeyResponse;
  message?: string;
  timestamp?: string;
}

/** Web Push VAPID 公钥，前端注册 Push 订阅时使用 */
export interface VapidPublicKeyResponse {
  publicKey?: string;  // VAPID 公钥 | @example BEL5Oa...
}

export interface HealthErrorResponse {
  error?: string;
}

export type Map_string_string = Record<string, string>;

// ============================================================
// oauth-service
// ============================================================

export interface AdminCreateProviderRequest {
  authUrl?: string;
  clientId: string;
  clientSecret: string;
  displayName?: string;
  enabled?: boolean;
  name: string;
  redirectUrl?: string;
  scopes?: string;
  tokenUrl?: string;
  userInfoUrl?: string;
}

export interface AdminToggleProviderRequest {
  enabled?: boolean;
}

export interface AdminUpdateProviderRequest {
  authUrl?: string;
  clientId?: string;
  clientSecret?: string;
  displayName?: string;
  redirectUrl?: string;
  scopes?: string;
  tokenUrl?: string;
  userInfoUrl?: string;
}

export interface AuthorizationDetailDTO {
  actions?: string[];  // 操作 | @example ['["list_accounts"', '"read_balances"]']
  constraints?: Record<string, unknown>;  // 扩展约束
  dataTypes?: string[];  // 数据类型 | @example ['["account_details"', '"balances"]']
  identifier?: string;  // 标识符 | @example account-12345
  locations?: string[];  // 位置 | @example ['["https://example.com/accounts"]']
  type?: string;  // 授权类型 | @example account_information
}

/** OAuth授权URL响应 */
export interface AuthorizeURLResponse {
  authUrl?: string;  // 授权URL | @example https://provider.com/authorize?client_id=...
  state?: string;  // 状态 | @example random-state-string
}

export interface BatchRevokeUserTokensResponse {
  revokedAccessTokens?: number;
  revokedRefreshTokens?: number;
}

export interface ClientRegistrationDetailResponse {
  code?: number;
  data?: ClientRegistrationResponse;
  message?: string;
  timestamp?: string;
}

/** OAuth 2.0 Dynamic Client Registration request (RFC 7591 §2) */
export interface ClientRegistrationRequest {
  applicationType?: string;  // 应用类型 | @example web
  clientName?: string;  // 客户端名称 | @example My Application
  clientUri?: string;  // 客户端主页URL | @example https://app.example.com
  contacts?: string[];  // 联系人 | @example ['["admin@example.com"]']
  grantTypes?: string[];  // 授权类型 | @example ['["authorization_code"', '"refresh_token"]']
  jwks?: string;  // JWKS文档
  jwksUri?: string;  // JWKS URI | @example https://app.example.com/jwks.json
  logoUri?: string;  // Logo URL | @example https://app.example.com/logo.png
  policyUri?: string;  // 隐私政策URL | @example https://app.example.com/privacy
  redirectUris: string[];  // 回调URI列表 | @example ['["https://app.example.com/callback"]']
  scope?: string;  // 权限范围 | @example openid profile email
  softwareId?: string;  // 软件ID | @example my-app-v1
  softwareVersion?: string;  // 软件版本 | @example 1.0.0
  tokenEndpointAuthMethod?: string;  // Token端点认证方法 | @example client_secret_basic
  tosUri?: string;  // 服务条款URL | @example https://app.example.com/tos
}

/** OAuth 2.0 Dynamic Client Registration response (RFC 7591 §2.1) */
export interface ClientRegistrationResponse {
  applicationType?: string;  // 应用类型 | @example web
  clientId?: string;  // 客户端ID | @example 01JNXXXXX...
  clientIdIssuedAt?: number;  // 客户端ID签发时间 | @example 1715692800
  clientName?: string;  // 客户端名称 | @example My Application
  clientSecret?: string;  // 客户端密钥 | @example sec_abc123...
  clientSecretExpiresAt?: number;  // 客户端密钥过期时间(0=永不过期) | @example 0
  clientUri?: string;  // 客户端主页URL | @example https://app.example.com
  contacts?: string[];  // 联系人 | @example ['["admin@example.com"]']
  grantTypes?: string[];  // 授权类型 | @example ['["authorization_code"', '"refresh_token"]']
  logoUri?: string;  // Logo URL | @example https://app.example.com/logo.png
  policyUri?: string;  // 隐私政策URL | @example https://app.example.com/privacy
  redirectUris?: string[];  // 回调URI列表 | @example ['["https://app.example.com/callback"]']
  registrationAccessToken?: string;  // 注册管理Token | @example reg_abc123...
  registrationClientUri?: string;  // 注册管理URI | @example https://authms.example.com/api/v1/oauth/register/app-123
  scope?: string;  // 权限范围 | @example openid profile email
  tokenEndpointAuthMethod?: string;  // 认证方法 | @example client_secret_basic
  tosUri?: string;  // 服务条款URL | @example https://app.example.com/tos
}

/** OAuth 2.0 Dynamic Client Registration update request (RFC 7591 §2.2) */
export interface ClientRegistrationUpdateRequest {
  applicationType?: string;
  clientName?: string;
  clientUri?: string;
  contacts?: string[];
  grantTypes?: string[];
  jwks?: string;
  jwksUri?: string;
  logoUri?: string;
  policyUri?: string;
  redirectUris?: string[];
  scope?: string;
  softwareId?: string;
  softwareVersion?: string;
  tokenEndpointAuthMethod?: string;
  tosUri?: string;
}

export interface ClientStatsDetailResponse {
  code?: number;
  data?: ClientStatsResponse;
  message?: string;
  timestamp?: string;
}

/** OAuth客户端令牌统计信息 */
export interface ClientStatsResponse {
  activeRefreshTokens?: number;  // @example 5
  activeTokens?: number;  // @example 10
  clientId?: string;  // @example client-001
  lastRequestAt?: string;  // @example 2026-04-15T10:30:00Z
}

export interface CloneClientDetailResponse {
  code?: number;
  data?: CloneClientResponse;
  message?: string;
  timestamp?: string;
}

/** 克隆客户端的结果，包含新客户端的 secret（仅返回一次） */
export interface CloneClientResponse {
  clientAuthMethods?: string;  // @example ["client_secret_basic","private_key_jwt"]
  clientId?: string;  // @example app-456
  clientSecret?: string;  // @example secret_xyz789
  corsOrigins?: string[];  // @example ['["https://app.example.com"]']
  fapiProfile?: string;  // @example fapi1
  grantTypes?: string[];  // @example ['["authorization_code"', '"refresh_token"]']
  id?: string;  // @example 01JNXXXXX...
  jwksUri?: string;  // @example https://client.example.com/.well-known/jwks.json
  name?: string;  // @example My Application (clone)
  redirectUris?: string[];  // @example ['["https://app.example.com/callback"]']
  scopes?: string[];  // @example ['["openid"', '"profile"', '"email"]']
  status?: string;  // @example active
}

export interface ConsentCheckResult {
  hasConsent?: boolean;  // @example True
}

export interface ConsentResponse {
  clientId?: string;  // @example app-123
  grantedAt?: string;  // @example 2026-04-15T10:30:00Z
  id?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  scopes?: string;  // @example openid profile email
}

export interface CreateClientDetailResponse {
  code?: number;
  data?: CreateClientResponse;
  message?: string;
}

export interface CreateClientRequest {
  clientAuthMethods?: string[];
  fapiProfile?: string;
  grantTypes?: string[];
  isConfidential?: boolean;
  jwks?: string;
  jwksUri?: string;
  logoUrl?: string;
  name: string;
  privacyPolicy?: string;
  redirectUris: string[];
  scopes?: string[];
  termsUrl?: string;
  website?: string;
}

/** OAuth客户端创建结果 */
export interface CreateClientResponse {
  clientAuthMethods?: string;  // @example ["client_secret_basic","private_key_jwt"]
  clientId?: string;  // @example app-123
  clientSecret?: string;  // @example secret_abc123
  corsOrigins?: string[];  // @example ['["https://app.example.com"]']
  fapiProfile?: string;  // @example fapi1
  grantTypes?: string[];  // @example ['["authorization_code"', '"refresh_token"]']
  id?: string;  // @example 01JNXXXXX...
  isConfidential?: boolean;  // @example True
  jwks?: string;
  jwksUri?: string;  // @example https://client.example.com/.well-known/jwks.json
  logoUrl?: string;  // @example https://app.example.com/logo.png
  name?: string;  // @example My Application
  privacyPolicy?: string;  // @example https://app.example.com/privacy
  redirectUris?: string[];  // @example ['["https://app.example.com/callback"]']
  scopes?: string[];  // @example ['["openid"', '"profile"', '"email"]']
  status?: string;  // @example active
  termsUrl?: string;  // @example https://app.example.com/terms
  website?: string;  // @example https://app.example.com
}

export interface CreateClientSecretDetailResponse {
  code?: number;
  data?: CreateClientSecretResponse;
  message?: string;
  timestamp?: string;
}

/** OAuth客户端密钥创建结果，secret_value 仅在此响应中返回一次 */
export interface CreateClientSecretResponse {
  createdAt?: string;  // @example 2026-04-15T10:30:00Z
  secretId?: string;  // @example secret-abc123
  secretValue?: string;  // @example sec_xyz789...
  status?: string;  // @example active
}

export interface DataResponsearray_dto_OAuthClientItem {
  code?: number;
  data?: OAuthClientItem[];
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_AuthorizeURLResponse {
  code?: number;
  data?: AuthorizeURLResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_CreateClientResponse {
  code?: number;
  data?: CreateClientResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_OAuthBindData {
  code?: number;
  data?: OAuthBindData;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_OAuthCallbackResponse {
  code?: number;
  data?: OAuthCallbackResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_OAuthConnectionListData {
  code?: number;
  data?: OAuthConnectionListData;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_OAuthProviderItem {
  code?: number;
  data?: OAuthProviderItem;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_OAuthProviderListData {
  code?: number;
  data?: OAuthProviderListData;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_PublicClientInfo {
  code?: number;
  data?: PublicClientInfo;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_RiskAssessmentResponse {
  code?: number;
  data?: RiskAssessmentResponse;
  message?: string;
  timestamp?: string;
}

export interface DeviceAuthorizationDetailResponse {
  code?: number;
  data?: DeviceAuthorizationResponse;
  message?: string;
  timestamp?: string;
}

export interface DeviceAuthorizationListItem {
  clientId?: string;  // @example app-123
  createdAt?: string;  // @example 2026-01-15T10:20:00Z
  deviceCode?: string;  // @example 7Q4mXp2vKd9Wn3sT8rY5uB1cF0jL6aH
  expiresAt?: string;  // @example 2026-01-15T10:30:00Z
  interval?: number;  // @example 5
  pollCount?: number;  // @example 3
  scope?: string;  // @example openid profile
  status?: string;  // @example pending
  updatedAt?: string;  // @example 2026-01-15T10:22:00Z
  userCode?: string;  // @example BDJW-DSXQ
  userId?: string;  // @example user-abc
}

/** 设备码授权请求（RFC 8628 §3.1） */
export interface DeviceAuthorizationRequest {
  clientId: string;  // @example app-123
  scope?: string;  // @example openid profile
}

/** 设备码授权响应（RFC 8628 §3.2） */
export interface DeviceAuthorizationResponse {
  deviceCode?: string;  // @example 7Q4mXp2vKd9Wn3sT8rY5uB1cF0jL6aH
  expiresIn?: number;  // @example 600
  interval?: number;  // @example 5
  userCode?: string;  // @example BDJW-DSXQ
  verificationUri?: string;  // @example https://authms.example.com/device
}

/** 用户在浏览器中授权设备（RFC 8628 §3.3） */
export interface DeviceAuthorizationVerifyRequest {
  approve?: boolean;  // @example True
  userCode: string;  // @example BDJW-DSXQ
}

export interface InternalIntrospectResponse {
  active?: boolean;
  clientId?: string;
  exp?: number;
  scope?: string;
  userId?: string;
}

export interface ListResponsedto_DeviceAuthorizationListItem {
  code?: number;
  items?: DeviceAuthorizationListItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface OAuthAuditLogItem {
  action?: string;
  id?: string;
  ip?: string;
  level?: string;
  message?: string;
  module?: string;
  operatorId?: string;
  operatorType?: string;
  status?: number;
  targetId?: string;
  targetType?: string;
  tenantId?: string;
  timestamp?: number;
}

export interface OAuthAuditLogListResponse {
  code?: number;
  items?: OAuthAuditLogItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface OAuthBindData {
  connection?: OAuthConnectionItem;
}

export interface OAuthClientItem {
  clientAuthMethods?: string;  // @example ["client_secret_basic","private_key_jwt"]
  clientId?: string;  // @example app-123
  corsOrigins?: string[];  // @example ['["https://app.example.com"]']
  createdAt?: string;  // @example 2026-04-15T10:30:00Z
  deletedAt?: string;
  fapiProfile?: string;  // @example fapi1
  grantTypes?: string[];  // @example ['["authorization_code"]']
  id?: string;  // @example client_abc123
  isConfidential?: boolean;  // @example True
  jwksUri?: string;  // @example https://client.example.com/.well-known/jwks.json
  logoUrl?: string;  // @example https://app.example.com/logo.png
  name?: string;  // @example My App
  privacyPolicy?: string;  // @example https://app.example.com/privacy
  redirectUris?: string[];  // @example ['["https://app.example.com/callback"]']
  scopes?: string[];  // @example ['["openid"', '"profile"]']
  secretLastFour?: string;  // @example bcde
  status?: string;  // @example active
  tenantId?: string;  // @example tenant_abc123
  termsUrl?: string;  // @example https://app.example.com/terms
  updatedAt?: string;  // @example 2026-04-15T10:30:00Z
  website?: string;  // @example https://app.example.com
}

export interface OAuthClientItemDetailResponse {
  code?: number;
  data?: OAuthClientItem;
  message?: string;
  timestamp?: string;
}

export interface OAuthClientListResponse {
  code?: number;
  items?: OAuthClientItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface OAuthClientSecretDetailResponse {
  code?: number;
  data?: OAuthClientSecretResponse;
  message?: string;
  timestamp?: string;
}

/** OAuth客户端密钥列表 */
export interface OAuthClientSecretListData {
  secrets?: OAuthClientSecretResponse[];
}

export interface OAuthClientSecretListDetailResponse {
  code?: number;
  data?: OAuthClientSecretListData;
  message?: string;
  timestamp?: string;
}

/** OAuth客户端密钥信息，不含实际密钥值 */
export interface OAuthClientSecretResponse {
  createdAt?: string;  // @example 2026-04-15T10:30:00Z
  description?: string;  // @example Secondary client secret
  expiresAt?: string;  // @example 2026-05-15T10:30:00Z
  lastUsedAt?: string;  // @example 2026-04-15T12:00:00Z
  secretId?: string;  // @example secret-abc123
  status?: string;  // @example active
  updatedAt?: string;  // @example 2026-04-15T10:30:00Z
}

export interface OAuthConnectionItem {
  createdAt?: string;  // @example 2026-04-15T10:30:00Z
  id?: string;  // @example conn_abc123
  profileData?: Record<string, unknown>;
  providerId?: string;  // @example github
  providerUserId?: string;  // @example 12345678
  tenantId?: string;  // @example tenant_abc123
  tokenExpiry?: string;  // @example 2026-04-15T10:30:00Z
  updatedAt?: string;  // @example 2026-04-15T10:30:00Z
  userId?: string;  // @example usr_abc123
}

export interface OAuthConnectionListData {
  connections?: OAuthConnectionItem[];
}

/** OAuth标准错误响应 */
export interface OAuthErrorResponse {
  error?: string;  // 错误码 | @example invalid_request
  errorDescription?: string;  // 错误描述 | @example Missing required parameter
  errorUri?: string;  // 错误URI | @example https://docs.example.com/errors
  state?: string;  // 状态 | @example state-123
}

export interface OAuthProviderItem {
  authUrl?: string;  // @example https://github.com/login/oauth/authorize
  clientId?: string;  // @example client-id
  createdAt?: string;  // @example 2026-04-15T10:30:00Z
  displayName?: string;  // @example GitHub
  enabled?: boolean;  // @example True
  id?: string;  // @example prov_abc123
  name?: string;  // @example github
  redirectUrl?: string;  // @example https://app.example.com/callback
  scopes?: string;  // @example ["read:user","user:email"]
  tenantId?: string;  // @example tenant_abc123
  tokenUrl?: string;  // @example https://github.com/login/oauth/access_token
  updatedAt?: string;  // @example 2026-04-15T10:30:00Z
  userInfoUrl?: string;  // @example https://api.github.com/user
}

export interface OAuthProviderListData {
  providers?: OAuthProviderItem[];
}

export interface OAuthProviderListDetailResponse {
  code?: number;
  data?: OAuthProviderListData;
  message?: string;
  timestamp?: string;
}

/** OAuth令牌信息，不包含令牌原文 */
export interface OAuthTokenItem {
  createdAt?: string;  // @example 2026-04-15T10:30:00Z
  expiresAt?: string;  // @example 2026-04-15T10:45:00Z
  scope?: string;  // @example openid profile email
  tokenType?: string;  // @example access_token
  userId?: string;  // @example usr_abc123
}

export interface OAuthTokenListResponse {
  code?: number;
  items?: OAuthTokenItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** OAuth令牌响应 */
export interface OAuthTokenResponse {
  accessToken?: string;  // 访问令牌 | @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  authorizationDetails?: AuthorizationDetailDTO[];  // RAR授权详情
  dpopAccessTokenBound?: boolean;  // 访问令牌DPoP绑定确认(RFC 9449)
  dpopSigningAlg?: string;  // DPoP签名算法(RFC 9449)
  expiresIn?: number;  // 过期秒数 | @example 3600
  idToken?: string;  // OIDC ID令牌 | @example eyJhbGci...
  refreshToken?: string;  // 刷新令牌 | @example rt_abc123
  scope?: string;  // 范围 | @example openid profile email
  tokenType?: string;  // 令牌类型 | @example Bearer
}

export interface OIDCUserInfoResponse {
  ageGroup?: string;
  birthdate?: string;  // @example 1990-01-15
  clientId?: string;  // Internal | @example app-123
  familyName?: string;  // @example Doe
  gender?: string;  // @example male
  givenName?: string;  // @example John
  isMinor?: boolean;  // Verification (age/minor status)
  locale?: string;  // @example en-US
  name?: string;  // OIDC Standard Claims（可选，scope=profile 时填充） | @example John Doe
  nickname?: string;  // @example Johnny
  picture?: string;  // @example https://cdn.example.com/avatars/usr_abc123.jpg
  preferredUsername?: string;  // @example john
  scope?: string;  // @example openid profile
  sub?: string;  // 用户ID（必填） | @example usr_abc123
  updatedAt?: number;  // @example 1743728400
  website?: string;  // @example https://johndoe.com
  zoneinfo?: string;  // @example America/Los_Angeles
}

export interface PublicClientInfo {
  clientName?: string;
  logoUri?: string;
  scopes?: string[];
  tenantId?: string;
}

/** PAR请求参数 */
export interface PushedAuthorizationRequest {
  authorizationDetails?: AuthorizationDetailDTO[];  // RAR授权详情
  clientId: string;  // 客户端ID | @example app-123
  clientSecret?: string;  // 客户端密钥 | @example secret_abc123
  codeChallenge?: string;  // 代码挑战 | @example E9Melhoa2Ow...
  codeChallengeMethod?: string;  // 挑战方法 | @example S256
  nonce?: string;  // 随机数 | @example nonce-123
  redirectUri: string;  // 回调URI | @example https://app.example.com/callback
  resources?: string[];  // 资源
  responseType: string;  // 响应类型 | @example code
  scope: string;  // 范围 | @example openid profile
  state?: string;  // 状态 | @example state-123
}

/** PAR响应 */
export interface PushedAuthorizationResponse {
  expiresIn?: number;  // 过期秒数 | @example 90
  requestUri?: string;  // 请求URI | @example urn:example:request_uri:xxx
}

export interface RevokeClientTokensDetailResponse {
  code?: number;
  data?: RevokeClientTokensResponse;
  message?: string;
  timestamp?: string;
}

/** 撤销客户端所有令牌的结果 */
export interface RevokeClientTokensResponse {
  gracePeriod?: number;  // @example 3600
  revokedAccessTokens?: number;  // @example 10
  revokedRefreshTokens?: number;  // @example 5
}

/** OAuth风险评估结果 */
export interface RiskAssessmentResponse {
  assessmentId?: string;  // 评估ID | @example risk_abc123
  recommendedActions?: string[];  // 建议操作
  requiresStepUp?: boolean;  // 需要增强 | @example False
  riskIndicators?: string[];  // 风险指标
  riskLevel?: string;  // 风险等级 | @example medium
  riskScore?: number;  // 风险评分 | @example 45
}

export interface RotateSecretDetailResponse {
  code?: number;
  data?: RotateSecretResponse;
  message?: string;
  timestamp?: string;
}

export interface RotateSecretResponse {
  clientId?: string;
  newSecret?: string;
  rotatedAt?: string;
}

export interface UpdateClientRequest {
  clientAuthMethods?: string[];
  fapiProfile?: string;
  grantTypes?: string[];
  isConfidential?: boolean;
  jwks?: string;
  jwksUri?: string;
  logoUrl?: string;
  name?: string;
  privacyPolicy?: string;
  redirectUris?: string[];
  scopes?: string[];
  status?: string;
  termsUrl?: string;
  website?: string;
}

export interface AuthorizeCodeResponse {
  code?: string;
  state?: string;
}

export interface SwaggerBatchRevokeDetailResponse {
  code?: number;
  data?: BatchRevokeUserTokensResponse;
  message?: string;
}

export interface SwaggerInternalIntrospectDetailResponse {
  code?: number;
  data?: InternalIntrospectResponse;
  message?: string;
}

// ============================================================
// pay-service
// ============================================================

export interface CreateChannelRequest {
  code: string;  // @example wechat
  config: string;  // @example {}
  name: string;  // @example 微信支付
  webhookSecret?: string;  // @example whsec_abc
}

export interface CreatePaymentRequest {
  amount: string;  // @example 100.00
  channelCode: string;  // @example wechat
  currency?: string;  // @example CNY
  idempotencyKey?: string;  // @example ik_abc123
  itemDescription?: string;  // @example 账户充值
  targetId?: string;  // @example wallet_target_id
  targetType?: string;  // @example wallet_recharge
}

export interface EraseUserPaymentDataRequest {
  userId: string;  // @example usr_abc123
}

export interface ExportUserPaymentDataRequest {
  userId: string;  // @example usr_abc123
}

export interface RefundRequest {
  amount: string;  // @example 50.00
  idempotencyKey?: string;  // @example ref_ik_abc123
  paymentId: string;  // @example pay_abc123
  reason?: string;  // @example 用户退款申请
}

export interface UpdateChannelRequest {
  config?: string;  // @example {}
  name?: string;  // @example 微信支付新
  status?: string;  // @example active
  webhookSecret?: string;  // @example whsec_xyz
}

// ============================================================
// point-service
// ============================================================

export interface PointIntegrityResult {
  accountId?: string;
  brokenAt?: number;
  lastHash?: string;
  total?: number;
  valid?: boolean;
}

export interface AdjustPointsRequest {
  amount: number;  // 正数增加，负数减少
  reason?: string;
}

export interface ApplyPointRuleRequest {
  eventType: string;
  metadata?: Record<string, unknown>;
  userId: string;
}

export interface BatchEarnItem {
  amount?: number;  // @example 100
  error?: string;
  newBalance?: number;  // @example 1100
  success?: boolean;  // @example True
  userId?: string;  // @example user-001
}

export interface BatchEarnRequest {
  description?: string;
  source?: string;
  users: BatchEarnUser[];
}

export interface BatchEarnResponse {
  code?: number;
  data?: BatchEarnResult;
  message?: string;
  timestamp?: string;
}

export interface BatchEarnResult {
  failedCount?: number;  // @example 1
  results?: BatchEarnItem[];
  successCount?: number;  // @example 3
}

export interface BatchEarnUser {
  amount: number;
  userId: string;
}

export interface ConfirmDeductionRequest {
  amount: number;
  reason?: string;
}

export interface CreatePointAccountRequest {
  userId: string;
}

export interface CreatePointRuleRequest {
  dailyLimit?: number;
  eventType: string;
  multiplier?: number;
  name: string;
  points: number;
  totalLimit?: number;
}

export interface DataResponsedomain_PointIntegrityResult {
  code?: number;
  data?: PointIntegrityResult;
  message?: string;
  timestamp?: string;
}

export interface DeleteUserDataRequest {
  userId: string;
}

export interface EarnPointsRequest {
  amount: number;
  description?: string;
  expiresAt?: string;
  source?: string;
}

export interface ExchangePointsRequest {
  amount: number;
  description?: string;
  exchangeType?: string;
  source?: string;
}

export interface ExpirePointsRequest {
  amount: number;
  description?: string;
}

export interface ExpiringPointDetailResponse {
  code?: number;
  data?: ExpiringPointsResponse;
  message?: string;
  timestamp?: string;
}

export interface ExpiringPointResponse {
  amount?: number;  // @example 500
  daysLeft?: number;  // @example 7
  expiresAt?: string;  // @example 2026-06-15T00:00:00Z
  source?: string;  // @example signup_bonus
  transactionId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
}

export interface ExpiringPointsResponse {
  daysThreshold?: number;  // @example 30
  expiringPoints?: ExpiringPointResponse[];
  totalExpiring?: number;  // @example 1500
  userId?: string;  // @example usr_example_001
}

export interface FreezePointsRequest {
  amount: number;
  reason?: string;
}

export interface PointAccountDetailResponse {
  code?: number;
  data?: PointAccountResponse;
  message?: string;
  timestamp?: string;
}

export interface PointAccountListResponse {
  code?: number;
  items?: PointAccountResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PointAccountResponse {
  balance?: number;  // @example 1500
  createdAt?: string;  // @example 2026-01-15T10:30:00Z
  exchangeRate?: number;  // @example 100
  expiredPoints?: number;  // @example 100
  frozenBalance?: number;  // @example 200
  id?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  pointsType?: string;  // @example cash_equivalent
  status?: string;  // @example active
  tenantId?: string;  // @example tnt_example_001
  totalEarned?: number;  // @example 5000
  totalSpent?: number;  // @example 3500
  updatedAt?: string;  // @example 2026-04-10T14:20:00Z
  userId?: string;  // @example usr_example_001
  version?: number;  // @example 3
}

export interface PointOperationData {
  account?: PointAccountResponse;
  pointsEarned?: number;  // @example 100
  transaction?: PointTransactionResponse;
}

export interface PointOperationResponse {
  code?: number;
  data?: PointOperationData;
  message?: string;
  timestamp?: string;
}

export interface PointRiskScoreDetailResponse {
  code?: number;
  data?: PointRiskScoreResponse;
  message?: string;
  timestamp?: string;
}

export interface PointRiskScoreResponse {
  factors?: string[];  // @example ['["normal_behavior"', '"trusted_device"]']
  riskLevel?: string;  // @example low
  riskScore?: number;  // @example 10
  userId?: string;  // @example usr_example_001
}

export interface PointRuleDetailResponse {
  code?: number;
  data?: PointRuleResponse;
  message?: string;
  timestamp?: string;
}

export interface PointRuleListResponse {
  code?: number;
  data?: PointRuleResponse[];
  message?: string;
  timestamp?: string;
}

export interface PointRuleResponse {
  createdAt?: string;  // @example 2026-01-15T10:30:00Z
  dailyLimit?: number;  // @example 3
  enabled?: boolean;  // @example True
  eventType?: string;  // @example daily_checkin
  expiryDays?: number;  // @example 365
  id?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  multiplier?: number;  // @example 1.5
  name?: string;  // @example 每日签到
  points?: number;  // @example 10
  priority?: number;  // @example 1
  tenantId?: string;  // @example tnt_example_001
  totalLimit?: number;  // @example 100
  updatedAt?: string;  // @example 2026-04-10T14:20:00Z
}

export interface PointStatsDetailResponse {
  code?: number;
  data?: PointStatsResponse;
  message?: string;
  timestamp?: string;
}

export interface PointStatsResponse {
  currentBalance?: number;  // @example 1500
  earnedThisMonth?: number;  // @example 200
  expiringSoon?: number;  // @example 500
  spentThisMonth?: number;  // @example 150
  totalEarned?: number;  // @example 5000
  totalExpired?: number;  // @example 100
  totalSpent?: number;  // @example 3500
  userId?: string;  // @example usr_example_001
}

export interface PointTransactionDetailResponse {
  code?: number;
  data?: PointTransactionResponse;
  message?: string;
  timestamp?: string;
}

export interface PointTransactionListResponse {
  code?: number;
  items?: PointTransactionResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PointTransactionResponse {
  accountId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  amount?: number;  // @example 100
  balanceAfter?: number;  // @example 1500
  balanceBefore?: number;  // @example 1400
  createdAt?: string;  // @example 2026-04-15T10:30:00Z
  description?: string;  // @example 每日签到奖励
  expiresAt?: string;  // @example 2027-01-15T10:30:00Z
  id?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  idempotencyKey?: string;  // @example ik_abc123
  reason?: string;  // @example 签到奖励
  relatedId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  source?: string;  // @example daily_checkin
  status?: string;  // @example completed
  type?: string;  // @example earn
  updatedAt?: string;  // @example 2026-04-15T10:30:00Z
  userId?: string;  // @example usr_example_001
}

export interface PointValueResponse {
  code?: number;
  data?: PointValueResult;
  message?: string;
  timestamp?: string;
}

export interface PointValueResult {
  balance?: number;  // @example 5000
  cashValue?: string;  // @example 50
  exchangeRate?: number;  // @example 100
  pointsType?: string;  // @example cash_equivalent
  userId?: string;  // @example user-001
}

export interface RefundPointsRequest {
  amount: number;
  description?: string;
  relatedTxId?: string;
}

export interface RuleTestResponse {
  code?: number;  // @example 0
  data?: RuleTestResult;
  message?: string;  // @example success
}

export interface RuleTestResult {
  dailyRemaining?: number;  // @example 3
  effectiveRate?: number;  // @example 2
  points?: number;  // @example 100
}

export interface SpendPointsRequest {
  amount: number;
  description?: string;
  source?: string;
}

export interface TenantConfigDetailResponse {
  code?: number;
  data?: TenantConfigResponse;
  message?: string;
  timestamp?: string;
}

export interface TenantConfigResponse {
  defaultExpiryDays?: number;  // @example 365
  earnEnabled?: boolean;  // @example True
  exchangeEnabled?: boolean;  // @example True
  exchangeRate?: number;  // @example 100
  expireEnabled?: boolean;  // @example True
  expiryMode?: string;  // @example rolling
  maxBalance?: number;  // @example 100000
  minSpendPoints?: number;  // @example 10
  pointsType?: string;  // @example cash_equivalent
  spendEnabled?: boolean;  // @example True
  tenantId?: string;  // @example tnt_example_001
  transferEnabled?: boolean;  // @example True
}

export interface TenantPointStatsDetailResponse {
  code?: number;
  data?: TenantPointStatsResponse;
  message?: string;
  timestamp?: string;
}

export interface TenantPointStatsResponse {
  activeAccounts?: number;  // @example 38
  earnedThisMonth?: number;  // @example 20000
  spentThisMonth?: number;  // @example 15000
  tenantId?: string;  // @example tnt_example_001
  totalAccounts?: number;  // @example 42
  totalBalance?: number;  // @example 150000
  totalEarned?: number;  // @example 500000
  totalExpired?: number;  // @example 10000
  totalFrozen?: number;  // @example 5000
  totalSpent?: number;  // @example 350000
  totalTransactions?: number;  // @example 1234
}

export interface TestRuleRequest {
  eventType: string;
}

export interface TransferPointsRequest {
  amount: number;
  description?: string;
  reason?: string;
  source?: string;
  toUserId: string;
}

export interface UnfreezePointsRequest {
  amount: number;
  reason?: string;
}

export interface UpdateAccountStatusRequest {
  status: string;
}

export interface UpdatePointRuleRequest {
  dailyLimit?: number;
  enabled?: boolean;
  eventType?: string;
  multiplier?: number;
  name?: string;
  points?: number;
  totalLimit?: number;
}

export interface UpdateTenantConfigRequest {
  defaultExpiryDays?: number;
  earnEnabled?: boolean;
  exchangeEnabled?: boolean;
  exchangeRate?: number;
  expireEnabled?: boolean;
  expiryMode?: string;
  maxBalance?: number;
  minSpendPoints?: number;
  pointsType?: string;
  spendEnabled?: boolean;
  transferEnabled?: boolean;
}

// ============================================================
// profile-service
// ============================================================

export interface ProfileField {
  key: string;
  label?: string;
  value: string;
}

export interface ApprovalDetailResponse {
  code?: number;
  data?: ApprovalResponse;
  message?: string;
  timestamp?: string;
}

export interface ApprovalListDetailResponse {
  code?: number;
  data?: ApprovalListResponse;
  message?: string;
  timestamp?: string;
}

export interface ApprovalListResponse {
  items?: ApprovalResponse[];
}

export interface ApprovalRequest {
  action?: string;
  fieldChanges?: Record<string, unknown>;
  reason?: string;
  userIds?: string[];
}

export interface ApprovalResponse {
  action?: string;
  approvedAt?: string;
  id?: string;
  reason?: string;
  status?: string;
  userId?: string;
}

export interface ArchiveProfileDetailResponse {
  code?: number;
  data?: ArchiveProfileResponse;
  message?: string;
  timestamp?: string;
}

export interface ArchiveProfileRequest {
  reason?: string;  // @example 用户主动申请归档
}

export interface ArchiveProfileResponse {
  archived?: boolean;  // @example True
  archivedAt?: string;  // @example 2026-04-15T10:30:00Z
  reason?: string;  // @example 用户主动申请归档
  userId?: string;  // @example usr_abc123
}

export interface BatchItemError {
  error?: string;
  userId?: string;
}

export interface BatchRequest {
  reason?: string;
  userIds: string[];
}

export interface BatchResult {
  errors?: BatchItemError[];
  failed?: number;
  success?: number;
  total?: number;
}

export interface BatchResultResponse {
  code?: number;
  data?: BatchResult;
  message?: string;
  timestamp?: string;
}

export interface CompletenessData {
  completeness?: unknown;
}

export interface CompletenessResponse {
  code?: number;
  data?: CompletenessData;
  message?: string;
  timestamp?: string;
}

export interface ConsentField {
  consented?: boolean;  // @example True
  dataClassification?: string;  // @example sensitive
  displayName?: string;  // @example Health Data
  fieldKey?: string;  // @example health_data
  requiresConsent?: boolean;  // @example True
}

export interface ConsentListDetailResponse {
  code?: number;
  data?: ConsentListResponse;
  message?: string;
  timestamp?: string;
}

export interface DeletedData {
  deleted?: boolean;
}

export interface DeletedResponse {
  code?: number;
  data?: DeletedData;
  message?: string;
  timestamp?: string;
}

export interface ExportProfileData {
  address?: string;
  avatarUrl?: string;
  bio?: string;
  birthDate?: string;
  city?: string;
  country?: string;
  createdAt?: string;
  customFields?: Record<string, unknown>;
  firstName?: string;
  gender?: string;
  lastName?: string;
  nickname?: string;
  preferences?: Record<string, unknown>;
  socialLinks?: Record<string, unknown>;
  tenantId?: string;
  updatedAt?: string;
  userId?: string;
  website?: string;
}

export interface ExportProfileInternalRequest {
  userId: string;
}

export interface ExportProfileResponse {
  code?: number;
  data?: ExportProfileData;
  message?: string;
  timestamp?: string;
}

export interface FieldSchemaDTO {
  dataClassification?: string;
  displayName?: string;
  fieldKey?: string;
  fieldType?: string;
  helpText?: string;
  isRequired?: boolean;
  isSystem?: boolean;
  options?: string[];
  placeholder?: string;
  requiresConsent?: boolean;
  sortOrder?: number;
  validationRegex?: string;
}

export interface FieldSchemaDetailResponse {
  code?: number;
  data?: FieldSchemaDTO;
  message?: string;
  timestamp?: string;
}

export interface FieldSchemaListDetailResponse {
  code?: number;
  data?: FieldSchemaListResponse;
  message?: string;
  timestamp?: string;
}

export interface FieldSchemaListResponse {
  schemas?: FieldSchemaDTO[];
}

export interface FieldsData {
  fields?: unknown;
}

export interface FieldsResponse {
  code?: number;
  data?: FieldsData;
  message?: string;
  timestamp?: string;
}

export interface GrantConsentRequest {
  fieldKeys: string[];  // @example ['["health_data"', '"biometric_data"]']
}

export interface InternalProfilesData {
  profiles?: UserProfileResponse[];
}

export interface InternalProfilesResponse {
  code?: number;
  data?: InternalProfilesData;
  message?: string;
  timestamp?: string;
}

export interface MyAvatarDetailResponse {
  code?: number;
  data?: MyAvatarResponse;
  message?: string;
  timestamp?: string;
}

export interface MyAvatarResponse {
  avatarUrl?: string;  // @example https://cdn.example.com/avatars/default.png
  updatedAt?: string;  // @example 2026-04-19T12:00:00Z
  userId?: string;  // @example user-001
}

export interface PreferencesDetailResponse {
  code?: number;
  data?: PreferencesResponse;
  message?: string;
  timestamp?: string;
}

export interface PreferencesResponse {
  preferences?: Record<string, unknown>;
}

export interface PrivacyData {
  privacy?: unknown;
}

export interface PrivacyImpactDetailResponse {
  code?: number;
  data?: PrivacyImpactResponse;
  message?: string;
  timestamp?: string;
}

export interface PrivacyImpactResponse {
  recommendations?: string[];
  riskFactors?: number;  // @example 3
  riskLevel?: string;  // @example medium
  riskScore?: number;  // @example 45
  userId?: string;  // @example usr_abc123
}

export interface PrivacyResponse {
  code?: number;
  data?: PrivacyData;
  message?: string;
  timestamp?: string;
}

export interface PrivacySettingsDTO {
  profileVisibility?: string;  // @example public
  showDepartment?: boolean;  // @example False
  showEmail?: boolean;  // @example False
  showLocation?: boolean;  // @example False
  showPhone?: boolean;  // @example False
}

export interface ProfileData {
  profile?: unknown;
}

export interface ProfileDetailResponse {
  code?: number;
  data?: UserProfileResponse;
  message?: string;
  timestamp?: string;
}

export interface ProfileFieldsRequest {
  fields: ProfileField[];
}

export interface ProfileListResponse {}

export interface ProfilePolicyDTO {
  allowedAvatarTypes?: string[];
  autoArchiveAfterDays?: number;
  avatarUploadEnabled?: boolean;
  cacheTtlSeconds?: number;
  completenessEnabled?: boolean;
  completenessWeights?: Record<string, number>;
  customFieldsEnabled?: boolean;
  defaultProfileVisibility?: string;
  defaultShowEmail?: boolean;
  defaultShowLocation?: boolean;
  defaultShowPhone?: boolean;
  maxAvatarSizeBytes?: number;
  maxCustomFields?: number;
  maxSocialLinks?: number;
  maxTagsPerUser?: number;
  privacyImpactEnabled?: boolean;
  publicProfileEnabled?: boolean;
  requiredFields?: string[];
  retentionDaysAfterDelete?: number;
  socialLinksEnabled?: boolean;
  tagsEnabled?: boolean;
}

export interface ProfilePolicyDetailResponse {
  code?: number;
  data?: ProfilePolicyResponse;
  message?: string;
  timestamp?: string;
}

export interface ProfilePolicyResponse {
  allowedAvatarTypes?: string[];
  autoArchiveAfterDays?: number;
  avatarUploadEnabled?: boolean;
  cacheTtlSeconds?: number;
  completenessEnabled?: boolean;
  completenessWeights?: Record<string, number>;
  customFieldsEnabled?: boolean;
  defaultProfileVisibility?: string;
  defaultShowEmail?: boolean;
  defaultShowLocation?: boolean;
  defaultShowPhone?: boolean;
  maxAvatarSizeBytes?: number;
  maxCustomFields?: number;
  maxSocialLinks?: number;
  maxTagsPerUser?: number;
  privacyImpactEnabled?: boolean;
  publicProfileEnabled?: boolean;
  requiredFields?: string[];
  retentionDaysAfterDelete?: number;
  socialLinksEnabled?: boolean;
  tagsEnabled?: boolean;
  tenantId?: string;
  updatedAt?: string;
}

export interface ProfileResponse {
  code?: number;
  data?: ProfileData;
  message?: string;
  timestamp?: string;
}

export interface ProfileStatsDetailResponse {
  code?: number;
  data?: ProfileStatsResponse;
  message?: string;
  timestamp?: string;
}

export interface ProfileStatsResponse {
  activeProfiles?: number;
  archivedProfiles?: number;
  avgCompleteness?: number;  // P3: implement avg profile completeness
  completenessDistribution?: Record<string, number>;
  deletedProfiles?: number;
  recentActivity24h?: number;
  totalProfiles?: number;
}

export interface RejectApprovalBody {
  reason?: string;
}

export interface RevokeConsentDetailResponse {
  code?: number;
  data?: RevokeConsentResponse;
  message?: string;
  timestamp?: string;
}

export interface SetTagsRequest {
  tags: string[];
}

export interface SuccessData {
  success?: boolean;
}

export interface SuccessResponse {
  code?: number;
  data?: SuccessData;
  message?: string;
  timestamp?: string;
}

export interface UpdateAvatarRequest {
  avatarUrl: string;  // @example https://example.com/avatar.jpg
}

export interface UpdatePreferencesRequest {
  language?: string;  // @example zh-CN
  notifications?: Record<string, unknown>;
  theme?: string;  // @example dark
  timezone?: string;  // @example Asia/Shanghai
}

export interface UpdateProfileRequest {
  address?: string;  // @example 123 Main St
  avatarUrl?: string;  // @example https://example.com/avatar.jpg
  bio?: string;  // @example Software Engineer
  birthdate?: string;  // @example 1990-01-15
  city?: string;  // @example San Francisco
  country?: string;  // @example US
  customFields?: Record<string, unknown>;
  firstName?: string;  // @example John
  gender?: string;  // @example male
  language?: string;  // @example en-US
  lastName?: string;  // @example Doe
  nickname?: string;  // @example Johnny
  socialLinks?: Record<string, string>;
  timezone?: string;  // @example America/Los_Angeles
  website?: string;  // @example https://johndoe.com
}

export interface UploadAvatarData {
  avatarUrl?: string;
  profile?: unknown;
}

export interface UploadAvatarResponse {
  code?: number;
  data?: UploadAvatarData;
  message?: string;
  timestamp?: string;
}

export interface UpsertProfileNamesRequest {
  firstName?: string;  // @example John
  lastName?: string;  // @example Doe
  nickname?: string;  // @example Johnny
}

export interface UserProfileResponse {}

export interface VersionDetailResponse {
  code?: number;
  data?: VersionResponse;
  message?: string;
  timestamp?: string;
}

export interface VersionListDetailResponse {
  code?: number;
  data?: VersionListResponse;
  message?: string;
  timestamp?: string;
}

export interface VersionListResponse {
  versions?: VersionResponse[];
}

export interface VersionResponse {
  changeType?: string;
  changedAt?: string;
  changedBy?: string;
  snapshot?: Record<string, unknown>;
  version?: number;
}

export interface WebhookConfigDTO {
  events?: string[];
  isEnabled?: boolean;
  secret?: string;
  url?: string;
}

export interface WebhookConfigDetailResponse {
  code?: number;
  data?: WebhookConfigResponse;
  message?: string;
  timestamp?: string;
}

export interface WebhookConfigResponse {
  events?: string[];
  isEnabled?: boolean;
  tenantId?: string;
  updatedAt?: string;
  url?: string;
}

// ============================================================
// rbac-service
// ============================================================

export interface ListResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_ApprovalRequestResponse {
  code?: number;
  items?: ApprovalRequestResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_PermissionResponse {
  code?: number;
  items?: PermissionResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_RoleResponse {
  code?: number;
  items?: RoleResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface DataResponsearray_gitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_ConflictPairResponse {
  code?: number;
  data?: ConflictPairResponse[];
  message?: string;
  timestamp?: string;
}

export interface DataResponsearray_gitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_DefaultRoleResponse {
  code?: number;
  data?: DefaultRoleResponse[];
  message?: string;
  timestamp?: string;
}

export interface DataResponsearray_gitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_PermissionResponse {
  code?: number;
  data?: PermissionResponse[];
  message?: string;
  timestamp?: string;
}

export interface DataResponsearray_gitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_RebacRelationshipDTO {
  code?: number;
  data?: RebacRelationshipDTO[];
  message?: string;
  timestamp?: string;
}

export interface DataResponsearray_gitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_RoleResponse {
  code?: number;
  data?: RoleResponse[];
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_ApprovalRequestResponse {
  code?: number;
  data?: ApprovalRequestResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_BootstrapAdminResponse {
  code?: number;
  data?: BootstrapAdminResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_ConflictPairResponse {
  code?: number;
  data?: ConflictPairResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_PermissionCheckDetailResponse {
  code?: number;
  data?: PermissionCheckDetailResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_PermissionCheckResponse {
  code?: number;
  data?: PermissionCheckResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_PermissionResponse {
  code?: number;
  data?: PermissionResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_RebacDeleteResult {
  code?: number;
  data?: RebacDeleteResult;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_RebacRelationshipDTO {
  code?: number;
  data?: RebacRelationshipDTO;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_RoleCheckResponse {
  code?: number;
  data?: RoleCheckResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_RoleResponse {
  code?: number;
  data?: RoleResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_UserIDsResponse {
  code?: number;
  data?: UserIDsResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_rbacservice_internal_handler_dto_ValidateUserRolesResponse {
  code?: number;
  data?: ValidateUserRolesResponse;
  message?: string;
  timestamp?: string;
}

export interface SimulatePermissionCheck {
  action?: string;
  resource?: string;
}

export interface AddDefaultRoleRequest {
  roleId: string;  // 角色ID
}

export interface AddRoleChildRequest {
  childId: string;  // 子角色ID
}

export interface ApprovalRequestResponse {
  action?: string;  // @example assign_role
  createdAt?: string;  // @example 2026-04-15T10:30:00Z
  id?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  payload?: string;  // @example {}
  reason?: string;
  requesterId?: string;  // @example usr_example_001
  reviewerId?: string;  // @example usr_example_003
  roleId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  status?: string;  // @example pending
  targetId?: string;  // @example usr_example_002
  tenantId?: string;  // @example tnt_example_001
}

export interface ApproveRejectRequest {
  reason?: string;  // 原因
}

export interface AssignDirectPermissionsRequest {
  permissionIds: string[];
}

export interface AssignPermissionsRequest {
  permissionIds: string[];  // Permission IDs
}

export interface AssignRolesRequest {
  departmentId?: string;  // Department ID
  expireAt?: string;  // Expiration time
  grantType?: string;  // Grant type
  roleIds: string[];  // Role IDs
}

export interface BatchAssignPermissionsRequest {
  permissionIds: string[];  // 权限ID列表
  roleIds: string[];  // 角色ID列表
}

export interface BatchAssignRolesRequest {
  roleIds: string[];  // 角色ID列表
  userIds: string[];  // 用户ID列表
}

export interface BatchRemoveRolesRequest {
  roleIds: string[];
  userIds: string[];
}

export interface BatchRevokePermissionsRequest {
  permissionIds: string[];
  roleIds: string[];
}

export interface CloneRoleRequest {
  code: string;  // 新角色编码
  name: string;  // 新角色名称
}

export interface ConflictPairResponse {
  createdAt?: string;  // 创建时间 | @example 2026-04-15T10:30:00Z
  description?: string;  // 描述 | @example 审批与操作职责分离
  id?: string;  // 冲突对ID | @example cp_abc123
  roleIdA?: string;  // 角色A ID | @example role_admin
  roleIdB?: string;  // 角色B ID | @example role_operator
}

export interface CreateConflictPairRequest {
  description?: string;  // 描述
  roleIdA: string;  // 角色A的ID
  roleIdB: string;  // 角色B的ID
}

export interface CreatePermissionRequest {
  action: string;  // Action
  category?: string;  // Category
  code: string;  // Permission code
  description?: string;  // Description
  effect?: Effect;  // Effect
  name: string;  // Permission name
  resource: string;  // Resource
  tags?: string;  // Tags
}

export interface CreateRoleRequest {
  code: string;  // Role code
  dataScope?: string;  // Data scope
  description?: string;  // Description
  name: string;  // Role name
  parentId?: string;  // Parent role ID
}

export interface DefaultRoleResponse {
  createdAt?: string;  // @example 2026-01-01T00:00:00Z
  id?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  priority?: number;  // @example 0
  roleId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  tenantId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
}

export interface PermissionResponse {
  action?: string;  // 操作类型 | @example create
  category?: string;  // 分类 | @example user_mgmt
  code?: string;  // 权限编码 | @example user:create
  createdAt?: string;  // 创建时间 | @example 2026-01-01T00:00:00Z
  description?: string;  // 描述 | @example 创建用户权限
  effect?: Effect;  // 效果 | @example allow
  id?: string;  // 权限ID | @example perm_abc123
  name?: string;  // 权限名称 | @example 创建用户
  resource?: string;  // 资源类型 | @example user
  tags?: string;  // 标签 | @example 管理,账户
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  updatedAt?: string;  // 更新时间 | @example 2026-04-10T14:20:00Z
}

export interface RebacAddRequest {
  objectId: string;  // 对象ID（设备ID）
  objectType: string;  // 对象类型（白名单: device）
  relation: string;  // 关系（角色，枚举/长度校验）
  subjectId: string;  // 主体ID（用户ID）
  subjectType: string;  // 主体类型（白名单: user）
}

export interface RebacDeleteResult {
  deleted?: number;  // 受影响行数 | @example 2
}

export interface RebacRelationshipDTO {
  createdAt?: string;  // 创建时间（RFC3339） | @example 2026-08-07T10:00:00Z
  objectId?: string;  // 对象ID（设备ID） | @example dev_abc123
  objectType?: string;  // 对象类型（白名单: device） | @example device
  relation?: string;  // 关系（角色） | @example parent_admin
  subjectId?: string;  // 主体ID（用户ID） | @example usr_xyz789
  subjectType?: string;  // 主体类型（白名单: user） | @example user
  tenantId?: string;  // 租户ID | @example 01KSQCBNVMS6SX64PJS937CE33
}

export interface RebacRemoveRequest {
  objectId: string;  // 对象ID（设备ID）
  objectType: string;  // 对象类型（白名单: device）
  subjectId: string;  // 主体ID（用户ID）
  subjectType: string;  // 主体类型（白名单: user）
}

export interface RemoveRolesRequest {
  roleIds?: string[];  // Role IDs
}

export interface RequestApprovalRequest {
  action: string;  // 操作
  expireAt?: string;  // 过期时间
  payload?: string;  // 附加数据
  targetId: string;  // 目标ID
}

export interface RevokeDirectPermissionsRequest {
  permissionIds: string[];
}

export interface RevokePermissionsRequest {
  permissionIds: string[];  // Permission IDs
}

export interface RoleResponse {
  code?: string;  // 角色编码 | @example admin
  createdAt?: string;  // 创建时间 | @example 2026-01-01T00:00:00Z
  dataScope?: string;  // 数据范围 | @example self
  description?: string;  // 描述 | @example 系统管理员
  id?: string;  // 角色ID | @example rol_abc123
  isSystem?: boolean;  // 是否系统角色 | @example False
  name?: string;  // 角色名称 | @example 管理员
  parentId?: string;  // 父角色ID | @example rol_parent
  permissionCount?: number;  // 关联权限数量 | @example 0
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  updatedAt?: string;  // 更新时间 | @example 2026-04-10T14:20:00Z
}

export interface SimulatePermissionRequest {
  checks: SimulatePermissionCheck[];
  userId: string;
}

export interface UpdatePermissionRequest {
  category?: string;  // Category
  description?: string;  // Description
  name?: string;  // Permission name
  tags?: string;  // Tags
}

export interface UpdateRoleRequest {
  dataScope?: string;  // Data scope
  description?: string;  // Description
  name?: string;  // Role name
  parentId?: string;  // Parent role ID
}

export interface UserIDsResponse {
  userIds?: string[];  // @example ['["01ARZ3NDEKTSV4RRFFQ69G5FAV"]']
}

export interface ValidateUserRolesResponse {
  conflicts?: ConflictPairResponse[];
  hasConflict?: boolean;  // @example False
}

export type Effect = "allow" | "deny";

// ============================================================
// saml-service
// ============================================================

export interface ListResponsegitee_com_linmes_authms_microservices_samlservice_internal_handler_dto_SamlSessionItem {
  code?: number;
  items?: SamlSessionItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsegitee_com_linmes_authms_microservices_samlservice_internal_handler_dto_SamlUserLinkItem {
  code?: number;
  items?: SamlUserLinkItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface EraseUserSamlLinksRequest {
  tenantId: string;
  userId: string;
}

export interface SAMLSLODetailResponse {
  code?: number;
  data?: SAMLSLOResponse;
  message?: string;
  timestamp?: string;
}

export interface SAMLSLOResponse {
  logoutCount?: number;
  message?: string;
  nameId?: string;
  status?: string;  // @example success
}

export interface SAMLTokenDetailResponse {
  code?: number;
  data?: SAMLTokenResponse;
  message?: string;
  timestamp?: string;
}

export interface SAMLTokenResponse {
  accessToken?: string;
  expiresIn?: number;  // @example 3600
  relayState?: string;
  tokenType?: string;  // @example Bearer
}

export interface SamlLinkedAccountItem {
  email?: string;  // @example user@example.com
  id?: string;  // @example 01JNXXXXX...
  linkedAt?: string;  // @example 2026-05-31T10:00:00Z
  nameId?: string;  // @example user@idp.com
  providerId?: string;  // @example 01JNPPPPP...
  providerName?: string;  // @example Azure AD
}

export interface SamlLinkedAccountsResponse {
  items?: SamlLinkedAccountItem[];
}

export interface SamlProviderItem {
  allowIdpInitiated?: boolean;  // @example False
  certificateExpiry?: string;
  createdAt?: string;  // @example 2026-05-31T10:00:00Z
  defaultRedirectUri?: string;  // @example https://app.example.com
  enabled?: boolean;  // @example True
  entityId?: string;  // @example https://login.microsoftonline.com/example/saml2
  forceAuthn?: boolean;  // @example False
  hasBackupCert?: boolean;  // @example False
  id?: string;  // @example 01JNXXXXX...
  name?: string;  // @example Azure AD
  nameIdFormat?: string;  // @example urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
  sloUrl?: string;  // @example https://login.microsoftonline.com/example/saml2/slo
  ssoUrl?: string;  // @example https://login.microsoftonline.com/example/saml2
  tenantId?: string;  // @example 01JNYYYYY...
  updatedAt?: string;  // @example 2026-05-31T10:00:00Z
  wantAuthnSigned?: boolean;  // @example True
}

export interface SamlProviderItemDetailResponse {
  code?: number;
  data?: SamlProviderItem;
  message?: string;
  timestamp?: string;
}

export interface SamlProviderListData {
  providers?: SamlProviderItem[];
}

export interface SamlProviderListDetailResponse {
  code?: number;
  data?: SamlProviderListData;
  message?: string;
  timestamp?: string;
}

export interface SamlProviderRequest {
  allowIdpInitiated?: boolean;  // @example False
  certificate: string;  // @example -----BEGIN CERTIFICATE----- MIID -----END CERTIFICATE-----
  certificateBackup?: string;  // @example -----BEGIN CERTIFICATE----- MIID -----END CERTIFICATE-----
  defaultRedirectUri?: string;  // @example https://app.example.com
  enabled?: boolean;  // @example True
  entityId: string;  // @example https://login.microsoftonline.com/example/saml2
  forceAuthn?: boolean;  // @example False
  name: string;  // @example Azure AD
  nameIdFormat?: string;  // @example urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
  shouldClearBackup?: boolean;  // @example False
  sloUrl?: string;  // @example https://login.microsoftonline.com/example/saml2/slo
  ssoUrl: string;  // @example https://login.microsoftonline.com/example/saml2
  wantAuthnSigned?: boolean;  // @example True
}

export interface SamlSessionItem {
  createdAt?: string;  // @example 2026-05-31T10:00:00Z
  expiresAt?: string;  // @example 2026-06-01T10:00:00Z
  id?: string;  // @example 01JNXXXXX...
  nameId?: string;  // @example user@idp.com
  providerId?: string;  // @example 01JNPPPPP...
  sessionIndex?: string;  // @example session-abc123
  tenantId?: string;  // @example 01JNYYYYY...
  userId?: string;  // @example 01JNZZZZZ...
}

export interface SamlUserLinkItem {
  createdAt?: string;  // @example 2026-05-31T10:00:00Z
  email?: string;  // @example user@example.com
  id?: string;  // @example 01JNXXXXX...
  nameId?: string;  // @example user@idp.com
  providerId?: string;  // @example 01JNPPPPP...
  tenantId?: string;  // @example 01JNYYYYY...
  updatedAt?: string;  // @example 2026-05-31T10:00:00Z
  userId?: string;  // @example 01JNZZZZZ...
}

// ============================================================
// secret-service
// ============================================================

export interface DataResponsearray_gitee_com_linmes_authms_microservices_secretservice_internal_handler_dto_SecretVersionResponse {
  code?: number;
  data?: SecretVersionResponse[];
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_secretservice_internal_handler_dto_BatchGetResponse {
  code?: number;
  data?: BatchGetResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_secretservice_internal_handler_dto_BatchResult {
  code?: number;
  data?: BatchResult;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_secretservice_internal_handler_dto_EncryptionKeysDetailResponse {
  code?: number;
  data?: EncryptionKeysDetailResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_secretservice_internal_handler_dto_JWTKeyResponse {
  code?: number;
  data?: JWTKeyResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_secretservice_internal_handler_dto_JWTKeysListResponse {
  code?: number;
  data?: JWTKeysListResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_secretservice_internal_handler_dto_JWTPublicKeyResponse {
  code?: number;
  data?: JWTPublicKeyResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_secretservice_internal_handler_dto_SecretDetailResponse {
  code?: number;
  data?: SecretDetailResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_secretservice_internal_handler_dto_SecretPolicyResponse {
  code?: number;
  data?: SecretPolicyResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_secretservice_internal_handler_dto_SecretResponse {
  code?: number;
  data?: SecretResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_secretservice_internal_handler_dto_SecretValueResponse {
  code?: number;
  data?: SecretValueResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_secretservice_internal_handler_dto_TransmissionDecryptResponse {
  code?: number;
  data?: TransmissionDecryptResponse;
  message?: string;
  timestamp?: string;
}

export interface ListResponsegitee_com_linmes_authms_microservices_secretservice_internal_handler_dto_SecretResponse {
  code?: number;
  items?: SecretResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface BatchGetRequest {
  keys: string[];
}

export interface BatchGetResponse {
  errors?: SecretErrorResponse[];
  values?: SecretValueResponse[];
}

export interface BatchKeyError {
  error?: string;  // @example secret not found
  key?: string;  // @example missing.key
}

export interface EncryptionKeyInfo {
  algorithm?: string;  // @example AES-256-GCM
  keyId?: string;  // @example enc_abc123
  secretsCount?: number;  // @example 42
  servicesUsing?: string[];  // @example ['["identity-service"', '"session-service"]']
  status?: string;  // @example active
}

export interface EncryptionKeysDetailResponse {
  keys?: EncryptionKeyInfo[];
}

export interface JWTKeyInfo {
  algorithm?: string;  // @example RS256
  createdAt?: string;  // @example 2025-01-15T10:30:00Z
  fingerprint?: string;  // @example a1b2c3d4e5f6...
  hasPrivateKey?: boolean;  // @example True
  hasPublicKey?: boolean;  // @example True
  keyId?: string;  // @example key_abc123
  keySize?: number;  // @example 2048
  keyType?: string;  // @example RSA
  status?: string;  // @example active
  updatedAt?: string;  // @example 2025-01-15T10:30:00Z
  version?: number;  // @example 1
}

export interface JWTKeyResponse {}

export interface JWTKeysListResponse {
  keys?: JWTKeyInfo[];
}

export interface JWTPublicKeyResponse {
  publicKey?: string;  // @example -----BEGIN PUBLIC KEY----- ... -----END PUBLIC KEY-----
}

export interface RotateSecretRequest {
  value: string;
}

export interface SecretDetailResponse {
  appId?: string;  // @example app_xyz
  createdAt?: string;  // @example 2025-01-15T10:30:00Z
  description?: string;  // @example JWT signing key
  expiresAt?: string;
  id?: string;  // @example sec_abc123
  key?: string;  // @example jwt_secret
  metadata?: Record<string, unknown>;
  notifyBefore?: number;
  status?: string;  // @example active
  updatedAt?: string;  // @example 2025-01-15T10:30:00Z
  version?: number;  // @example 1
  versions?: SecretVersionResponse[];
}

export interface SecretErrorResponse {
  error?: string;  // @example secret not found
  key?: string;  // @example missing.secret
}

export interface SecretPolicyRequest {
  autoRotateDays?: number;
  defaultTtl?: Duration;
  maxTtl?: Duration;
  maxVersions?: number;
  notificationDaysBefore?: number;
  requireRotationForFallbackKeys?: boolean;
}

export interface SecretPolicyResponse {
  autoRotateDays?: number;  // @example 90
  defaultTtl?: Duration;  // @example 0
  maxTtl?: Duration;  // @example 31536000000000000
  maxVersions?: number;  // @example 10
  notificationDaysBefore?: number;  // @example 7
  requireRotationForFallbackKeys?: boolean;  // @example True
  tenantId?: string;  // @example tnt_abc123
  updatedAt?: string;  // @example 2025-01-15T10:30:00Z
}

export interface SecretResponse {
  appId?: string;  // @example app_xyz
  createdAt?: string;  // @example 2025-01-15T10:30:00Z
  description?: string;  // @example JWT signing key
  expiresAt?: string;
  id?: string;  // @example sec_abc123
  key?: string;  // @example jwt_secret
  metadata?: Record<string, unknown>;
  notifyBefore?: number;
  status?: string;  // @example active
  updatedAt?: string;  // @example 2025-01-15T10:30:00Z
  version?: number;  // @example 1
}

export interface SecretValueResponse {
  encoding?: string;  // @example utf-8
  key?: string;  // @example jwt_secret
  status?: string;  // @example active
  value?: string;  // @example my-secret-value
  version?: number;  // @example 1
}

export interface SecretVersionQuery {
  version: number;
}

export interface SecretVersionResponse {
  createdAt?: string;  // @example 2025-01-15T10:30:00Z
  createdBy?: string;  // @example system
  version?: number;  // @example 1
}

export interface StoreSecretRequest {
  description?: string;
  expiresAt?: string;
  key: string;
  metadata?: Record<string, unknown>;
  notifyBefore?: number;
  value: string;
}

export interface TransmissionDecryptRequest {
  ciphertext: string;  // base64(RSA-OAEP encrypted password)
  keyId?: string;  // 公钥 ID (预留多密钥支持)
}

export interface TransmissionDecryptResponse {
  plaintext?: string;  // @example my-decrypted-password
}

export interface UpdateSecretRequest {
  description?: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
  notifyBefore?: number;
  value?: string;
}

export type Duration = "-9223372036854775808" | "9223372036854775807" | "1" | "1000" | "1000000" | "1000000000" | "60000000000" | "3600000000000";

// ============================================================
// session-service
// ============================================================

export interface AccessTokenResponse {
  accessToken?: string;
}

/** 当前活跃会话数量 */
export interface ActiveCountResponse {
  count?: number;  // 数量 | @example 42
  timestamp?: string;  // 时间 | @example 2026-04-15T10:00:00Z
}

export interface ActiveSessionStatus {
  active?: boolean;  // @example True
  sessionCount?: number;  // @example 3
}

/** 将令牌加入黑名单请求参数 */
export interface AddToBlacklistRequest {
  reason?: string;  // 原因
  token: string;  // 令牌
  tokenType: "access" | "refresh";  // 类型
  userId: string;  // 用户ID
}

/** 检查令牌是否在黑名单中 */
export interface BlacklistCheckResponse {
  blacklisted?: boolean;  // 是否黑名单 | @example False
  reason?: string;  // 原因
  token?: string;  // 令牌 | @example abc123...
}

export interface BlacklistTokenRequest {
  appId?: string;  // 应用ID
  expiresAt?: number;  // 过期时间
  reason?: string;  // 原因
  token: string;  // 令牌
  tokenType: string;  // 类型
  userId: string;  // 用户ID
}

export interface BlacklistedTokenListResponse {
  code?: number;
  items?: BlacklistedTokenResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 黑名单令牌信息 */
export interface BlacklistedTokenResponse {
  createdAt?: string;  // @example 2026-04-15T08:00:00Z
  expiresAt?: string;  // @example 2026-04-16T08:00:00Z
  id?: string;  // @example bl_01ARZ3NDEKTSV4RRFFQ69G5FAV
  reason?: string;  // @example manual_revoke
  tokenHash?: string;  // @example a1b2c3d4e5f6...
  userId?: string;  // @example usr_abc123
}

export interface CreateSessionData {
  session?: SessionResponse;
  tokens?: TokenPairResponse;
}

/** 创建新会话请求参数 */
export interface CreateSessionRequest {
  amr?: string[];  // @example ['password', 'totp']
  appId?: string;  // @example app_xyz
  authUserId: string;  // @example usr_abc123
  browser?: string;  // @example Chrome 123
  deviceFingerprint?: string;  // @example sha256:a1b2c3d4
  deviceId?: string;  // @example dev_abc123
  deviceType?: string;  // @example desktop
  ip?: string;  // @example 192.168.1.1
  os?: string;  // @example Windows 11
  userAgent?: string;  // @example Mozilla/5.0
}

export interface CreateTrustedDeviceRequest {
  browser?: string;
  deviceFingerprint: string;
  deviceType?: string;
  ip?: string;
  os?: string;
  userId: string;
}

export interface DataResponsedto_CreateSessionData {
  code?: number;
  data?: CreateSessionData;
  message?: string;
  timestamp?: string;
}

/** 设备指纹信息 */
export interface DeviceFingerprintResponse {
  browser?: string;  // 浏览器 | @example Chrome 123
  deviceHash?: string;  // 哈希 | @example a1b2c3d4e5f6...
  deviceType?: string;  // 类型 | @example desktop
  fingerprintId?: string;  // 指纹ID | @example fp_abc123
  firstSeenAt?: string;  // 首次 | @example 2026-01-01T00:00:00Z
  ip?: string;  // IP | @example 192.168.1.1
  isTrusted?: boolean;  // 是否信任 | @example True
  lastSeenAt?: string;  // 最近 | @example 2026-04-15T10:30:00Z
  location?: string;  // 位置 | @example 北京市
  os?: string;  // 系统 | @example Windows 11
  screenRes?: string;  // 分辨率 | @example 1920x1080
}

export interface DeviceRiskResponse {
  activeSessions?: number;  // @example 3
  auditFailureCount?: number;  // @example 0
  deviceId?: string;  // @example dev_01ARZ3NDEKTSV4RRFFQ69G5FAV
  evaluatedAt?: string;  // @example 2026-04-15T10:30:00Z
  revokedSessions?: number;  // @example 2
  riskFactors?: string[];  // @example ['["unusual_location"', '"new_device"]']
  riskLevel?: string;  // @example low
  riskScore?: number;  // @example 35
  totalSessions?: number;  // @example 15
}

export interface ExchangeTokenRequest {
  audience?: string;  // 目标受众 | @example api.example.com
  grantType: string;  // 授权类型 | @example urn:ietf:params:oauth:grant-type:token-exchange
  subjectToken: string;  // 主题令牌 | @example eyJhbGciOiJIUzI1NiIs...
}

export interface GenerateTokensRequest {
  appId?: string;  // 应用ID
  authUserId: string;  // 用户ID
  sessionId: string;  // 会话ID
  tenantId: string;  // 租户ID
}

export interface GetSessionData {
  session?: SessionResponse;
}

export interface IntrospectTokenRequest {
  token: string;  // 令牌
  type?: string;  // access, refresh (optional hint)
}

/** 刷新访问令牌请求参数 */
export interface RefreshTokensRequest {
  refreshToken: string;  // 刷新令牌
}

export interface RevokeAllTokensRequest {
  reason?: string;  // 原因 | @example suspicious activity
  type?: string;  // 为空则撤销所有类型 | @example access
  userId?: string;  // 用户ID | @example usr_abc123
}

/** 风险评估因素 */
export interface RiskFactor {
  description?: string;  // 描述 | @example 登录地点异常
  score?: number;  // 评分 | @example 20
  type?: string;  // 类型 | @example unusual_location
  weight?: number;  // 权重 | @example 30
}

/** 会话风险评分结果 */
export interface RiskScoreResponse {
  evaluatedAt?: string;  // 评估时间 | @example 2026-04-14T12:00:00Z
  factors?: RiskFactor[];  // 因素
  recommendedAction?: string;  // 建议 | @example allow
  riskLevel?: string;  // 等级 | @example low
  riskScore?: number;  // 评分 | @example 25
  sessionId?: string;  // 会话ID | @example sess_abc123
}

export interface SessionListResponse {
  code?: number;
  items?: SessionResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 用户会话信息 */
export interface SessionResponse {
  amr?: string;  // 认证方法引用 | @example password,totp
  authenticatedAt?: string;  // 认证时间 | @example 2026-04-15T08:00:00Z
  createdAt?: string;  // 创建时间 | @example 2026-04-15T08:00:00Z
  deviceId?: string;  // 设备ID | @example dev_abc123
  deviceType?: string;  // 设备类型 | @example desktop
  expiresAt?: string;  // 过期时间 | @example 2026-04-16T08:00:00Z
  geoip?: string;  // GeoIP 地理位置 | @example Beijing, CN
  id?: string;  // 会话ID | @example sess_abc123
  idleExpiresAt?: string;  // 空闲过期时间 | @example 2026-04-15T12:00:00Z
  ip?: string;  // IP | @example 192.168.1.1
  lastActiveAt?: string;  // 最后活跃 | @example 2026-04-15T10:30:00Z
  status?: string;  // 状态 | @example active
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  userAgent?: string;  // UA | @example Mozilla/5.0...
  userId?: string;  // 用户ID | @example usr_abc123
}

/** 用户会话统计数据 */
export interface SessionStatsResponse {
  activeSessions?: number;  // 活跃 | @example 3
  deviceBreakdown?: Record<string, number>;  // 设备分布 | @example {'desktop': 5, 'mobile': 10}
  expiredSessions?: number;  // 过期 | @example 10
  revokedSessions?: number;  // 已撤销 | @example 2
  totalSessions?: number;  // 总会话数 | @example 15
  updatedAt?: string;  // 统计时间 | @example 2026-04-15T10:00:00Z
  userId?: string;  // 用户ID | @example usr_abc123
}

export interface TenantJWTConfigResponse {
  accessExpiry?: string;  // @example 24h
  leeway?: string;  // @example 5s
  refreshExpiry?: string;  // @example 168h
  tenantId?: string;  // @example tnt_example_001
}

export interface TokenDetailResponse {
  code?: number;
  data?: TokenInfoResponse;
  message?: string;
  timestamp?: string;
}

export interface TokenExchangeResponse {
  accessToken?: string;  // @example eyJhbGciOiJIUzI1NiIs...
  audience?: string;  // @example api.example.com
  expiresIn?: number;  // @example 3600
  grantType?: string;  // @example urn:ietf:params:oauth:grant-type:token-exchange
  refreshToken?: string;  // @example eyJhbGciOiJIUzI1NiIs...
  tokenType?: string;  // @example Bearer
}

/** 令牌详细信息 */
export interface TokenInfoResponse {
  createdAt?: string;  // 创建时间 | @example 2026-04-15T08:00:00Z
  expiresAt?: string;  // 过期时间 | @example 2026-04-15T09:00:00Z
  id?: string;  // 令牌ID | @example tok_abc123
  ip?: string;  // IP | @example 192.168.1.1
  status?: string;  // 状态 | @example active
  tokenType?: string;  // 类型 | @example access
  userAgent?: string;  // UA | @example Mozilla/5.0...
  userId?: string;  // 用户ID | @example usr_abc123
}

/** Token自省结果 */
export interface TokenIntrospectionResponse {
  active?: boolean;  // 是否有效 | @example True
  clientId?: string;  // 客户端 | @example app_xyz
  exp?: number;  // 过期 | @example 1713175200
  iat?: number;  // 签发 | @example 1713171600
  iss?: string;  // 签发者 | @example auth.example.com
  scope?: string;  // 范围 | @example read write
  sub?: string;  // 主题 | @example usr_abc123
  tokenType?: string;  // 类型 | @example access
  username?: string;  // 用户名 | @example john.doe
}

export interface TokenListResponse {
  code?: number;
  items?: TokenInfoResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 访问令牌和刷新令牌 */
export interface TokenPairResponse {
  accessToken?: string;  // 访问令牌 | @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  expiresIn?: number;  // 过期秒数 | @example 3600
  refreshToken?: string;  // 刷新令牌 | @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  tokenType?: string;  // 类型 | @example Bearer
}

export interface TokenValidationResponse {
  claims?: unknown;
  error?: string;
  valid?: boolean;  // @example True
}

export interface TrustedDeviceResponse {
  browser?: string;
  createdAt?: string;
  deviceFingerprint?: string;
  deviceName?: string;
  deviceType?: string;
  id?: string;
  ip?: string;
  os?: string;
  tenantId?: string;
  trustedUntil?: string;
  userId?: string;
}

export interface UpdateTenantJWTConfigRequest {
  accessExpiry: string;
  leeway?: string;
  refreshExpiry: string;
}

export interface UpgradeSessionMFAResponse {
  message?: string;  // @example session MFA status upgraded
  mfaVerified?: boolean;  // @example True
  sessionId?: string;  // @example sess_abc123
}

export interface UserSessionsExportResponse {
  sessions?: SessionResponse[];
  total?: number;  // @example 5
}

export interface ValidateAccessTokenRequest {
  accessToken: string;  // 访问令牌
  deviceFingerprint?: string;  // BindToDevice 检查
}

// ============================================================
// status-service
// ============================================================

export type IncidentSeverity = "critical" | "major" | "minor" | "maintenance";

export type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved" | "draft";

export type MaintenanceStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface AddIncidentUpdateRequest {
  message: string;  // @example 已确认问题原因为数据库连接池耗尽
  status: IncidentStatus;  // @example identified
}

export interface CreateMaintenanceRequest {
  affectedServices?: string[];  // @example ['["audit-service"]']
  description?: string;  // @example 审计服务将进行数据库索引优化升级
  scheduledEndAt: string;  // @example 2026-05-20T04:00:00Z
  scheduledStartAt: string;  // @example 2026-05-20T02:00:00Z
  title: string;  // @example 审计服务数据库升级
}

export interface IncidentUpdateDataResponse {
  code?: number;
  data?: IncidentUpdateResponse;
  message?: string;
}

export interface IncidentUpdateResponse {
  createdAt?: string;  // @example 2026-05-20T10:15:00Z
  id?: string;  // @example 01HX5J9K0A3B
  message?: string;  // @example Identified database connection pool exhaustion as root cause
  status?: IncidentStatus;  // @example identified
}

export interface JSONStatusDataResponse {
  code?: number;
  data?: JSONStatusResponse;
  message?: string;
}

export interface JSONStatusResponse {
  activeIncidents?: number;
  lastUpdated?: string;
  overallStatus?: string;
  services?: ServiceStatusItem[];
  uptime?: string;
}

export interface LatencyDataResponse {
  code?: number;
  data?: LatencyMetricsResponse;
  message?: string;
}

export interface LatencyMetricsResponse {
  available?: boolean;  // Available 标记 Prometheus 数据源是否可用（查询失败或未部署时为 false）
  points?: MetricsDataPoint[];
  range?: string;  // @example 24h
  service?: string;  // @example identity-service
}

export interface MaintenanceDataResponse {
  code?: number;
  data?: MaintenanceResponse;
  message?: string;
}

export interface MaintenanceListResponse {
  code?: number;
  items?: MaintenanceResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface MaintenanceResponse {
  affectedServices?: string[];  // @example ['["audit-service"]']
  createdAt?: string;  // @example 2026-05-20T10:00:00Z
  description?: string;  // @example Scheduled database index optimization for audit-service
  id?: string;  // @example 01HX5KA1B2C3
  scheduledEndAt?: string;  // @example 2026-05-22T04:00:00Z
  scheduledStartAt?: string;  // @example 2026-05-22T02:00:00Z
  status?: MaintenanceStatus;  // @example scheduled
  title?: string;  // @example Database Index Optimization
  updatedAt?: string;  // @example 2026-05-20T10:00:00Z
}

export interface MetricsDataPoint {
  timestamp?: string;  // @example 2026-05-20T10:00:00Z
  value?: number;  // @example 99.95
}

export interface OverviewDataResponse {
  code?: number;
  data?: OverviewResponse;
  message?: string;
}

export interface OverviewResponse {
  activeIncidents?: number;  // @example 0
  lastUpdated?: string;  // @example 2026-05-09T10:00:00Z
  overallStatus?: string;  // @example healthy
  servicesHealthy?: number;  // @example 15
  servicesTotal?: number;  // @example 15
}

export interface ServiceCatalogDataResponse {
  code?: number;
  data?: ServiceCatalogResponse;
  message?: string;
}

export interface ServiceCatalogItem {
  category?: string;
  description?: string;
  id?: string;
  name?: string;
  port?: number;
}

export interface ServiceCatalogResponse {
  allServices?: ServiceCatalogItem[];
  groups?: ServiceGroupItem[];
  lastUpdated?: string;
  totalCount?: number;
}

export interface ServiceGroupItem {
  description?: string;
  id?: string;
  name?: string;
  services?: ServiceCatalogItem[];
}

export interface ServiceStatusItem {
  id?: string;
  latency?: string;
  name?: string;
  status?: string;
  uptime7d?: string;
}

export interface SubscribeDataResponse {
  code?: number;
  data?: SubscribeResponse;
  message?: string;
}

export interface SubscribeRequest {
  company?: string;  // @example Acme Corp
  email: string;  // @example user@example.com
  message?: string;  // @example 我想了解贵公司的安全认证方案
  name?: string;  // @example 张三
  phone?: string;  // @example +86 13800138000
}

export interface SubscribeResponse {
  email?: string;  // @example user@example.com
  id?: string;  // @example 01HX5KB3C4D5
  message?: string;  // @example Successfully subscribed to status notifications
}

export interface SubscriptionListItem {
  categories?: string[];
  createdAt?: string;
  digestFrequency?: string;
  email?: string;
  id?: string;
  isVerified?: boolean;
  notifyIncidents?: boolean;
  notifyMaintenance?: boolean;
  notifyRecovery?: boolean;
}

export interface SubscriptionListResponse {
  code?: number;
  items?: SubscriptionListItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface SubscriptionPreferencesDataResponse {
  code?: number;
  data?: SubscriptionPreferencesResponse;
  message?: string;
}

export interface SubscriptionPreferencesRequest {
  categories?: string[];
  digestFrequency?: string;  // immediate, daily, weekly
  email: string;
  notifyIncidents?: boolean;
  notifyMaintenance?: boolean;
  notifyRecovery?: boolean;
  token: string;
}

export interface SubscriptionPreferencesResponse {
  categories?: string[];
  createdAt?: string;
  digestFrequency?: string;
  email?: string;
  notifyIncidents?: boolean;
  notifyMaintenance?: boolean;
  notifyRecovery?: boolean;
  updatedAt?: string;
  verified?: boolean;
}

export interface UnsubscribeRequest {
  token: string;
}

export interface UpdateIncidentRequest {
  affectedServices?: string[];
  description?: string;
  resolvedAt?: string;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  title?: string;
}

export interface UpdateMaintenanceRequest {
  affectedServices?: string[];
  description?: string;
  scheduledEndAt?: string;
  scheduledStartAt?: string;
  status?: MaintenanceStatus;
  title?: string;
}

export interface UptimeDataResponse {
  code?: number;
  data?: UptimeMetricsResponse;
  message?: string;
}

export interface UptimeMetricsResponse {
  available?: boolean;  // Available 标记 Prometheus 数据源是否可用（查询失败或未部署时为 false）
  points?: MetricsDataPoint[];
  range?: string;  // @example 24h
  service?: string;  // @example identity-service
}

// ============================================================
// storage-service
// ============================================================

/** 批量删除文件请求参数 */
export interface BatchDeleteRequest {
  fileIds: string[];  // 文件ID列表 | @example ['["file_001"', '"file_002"]']
  force?: boolean;  // 强制删除 | @example False
}

export interface BatchDeleteResultDetailResponse {
  code?: number;
  data?: BatchDeleteResultResponse;
  message?: string;
  timestamp?: string;
}

export interface BatchDeleteResultResponse {
  deletedCount?: number;  // @example 5
  ids?: string[];  // @example ['["file_001"', '"file_002"]']
}

/** 批量下载文件请求参数 */
export interface BatchDownloadRequest {
  fileIds: string[];  // 文件ID列表 | @example ['["file_001"', '"file_002"]']
}

export interface BatchMoveResultDetailResponse {
  code?: number;
  data?: BatchMoveResultResponse;
  message?: string;
  timestamp?: string;
}

export interface BatchMoveResultResponse {
  ids?: string[];  // @example ['["file_001"', '"file_002"]']
  movedCount?: number;  // @example 3
  targetId?: string;  // @example folder_002
}

export interface BucketDetailResponse {
  code?: number;
  data?: BucketResponse;
  message?: string;
  timestamp?: string;
}

export interface BucketListResponse {
  code?: number;
  items?: BucketResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface BucketResponse {
  createdAt?: string;
  description?: string;
  id?: string;
  isDefault?: boolean;
  name?: string;
  physicalName?: string;
  visibility?: string;
}

export interface BulkUploadFileInfo {
  contentType: string;  // @example image/jpeg
  filename: string;  // @example photo.jpg
  size: number;  // @example 1048576
}

export interface BulkUploadPrepareRequest {
  files: BulkUploadFileInfo[];
}

export interface BulkUploadURLsDetailResponse {
  code?: number;
  data?: BulkUploadURLsResponse;
  message?: string;
  timestamp?: string;
}

export interface BulkUploadURLsResponse {
  count?: number;  // @example 5
  uploadUrls?: UploadURLInfo[];
}

export interface CopyFileTargetRequest {
  newName?: string;  // @example copy-of-file.pdf
  targetFolderId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
}

export interface CreateBucketRequest {
  description?: string;
  name: string;
  visibility?: string;
}

export interface CreateFolderRequest {
  name: string;  // @example My Folder
  parentId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
}

export interface CreateFolderResponse {
  code?: number;
  data?: FolderMetadataResponse;
  message?: string;
  timestamp?: string;
}

export interface CreateShareRequest {
  expiresIn?: string;  // @example 24h
  maxAccess?: number;  // @example 10
  password?: string;  // @example mypassword
}

export interface CreateUploadURLDetailResponse {
  code?: number;
  data?: CreateUploadURLResponse;
  message?: string;
  timestamp?: string;
}

export interface CreateUploadURLRequest {
  contentType: string;
  expiresIn?: number;
  filename: string;
  parentId?: string;
  visibility?: string;
}

export interface CreateUploadURLResponse {
  expiresIn?: number;
  fields?: Record<string, string>;
  fileId?: string;
  key?: string;
  uploadUrl?: string;
}

export interface DataRetentionPolicyDetailResponse {
  code?: number;
  data?: DataRetentionPolicyResponse;
  message?: string;
  timestamp?: string;
}

/** 数据保留策略配置请求参数 */
export interface DataRetentionPolicyRequest {
  archiveBeforeDelete?: boolean;  // 删除前归档? | @example True
  autoDelete?: boolean;  // 自动删除 | @example True
  retentionDays: number;  // 保留天数 | @example 365
}

/** 数据保留策略配置结果 */
export interface DataRetentionPolicyResponse {
  archiveBeforeDelete?: boolean;  // 删除前归档? | @example True
  autoDelete?: boolean;  // 自动删除 | @example True
  effectiveAt?: string;  // 生效时间 | @example 2026-04-15T10:00:00Z
  retentionDays?: number;  // 保留天数 | @example 365
  tenantId?: string;  // 租户ID | @example tnt_xyz789
}

export interface EncryptionStatusDetailResponse {
  code?: number;
  data?: EncryptionStatusResponse;
  message?: string;
  timestamp?: string;
}

/** 存储服务加密配置与状态 */
export interface EncryptionStatusResponse {
  algorithm?: string;  // 算法 | @example AES-256-GCM
  encryptionAtRest?: boolean;  // 静态加密 | @example True
  encryptionInTransit?: boolean;  // 传输加密 | @example True
  keyRotationDate?: string;  // 轮换日期 | @example 2026-04-01T00:00:00Z
  tenantId?: string;  // 租户ID | @example tnt_xyz789
}

export interface FileCopyResultDetailResponse {
  code?: number;
  data?: FileCopyResultResponse;
  message?: string;
  timestamp?: string;
}

export interface FileCopyResultResponse {
  copiedFile?: FileMetadataResponse;
  originalFile?: FileMetadataResponse;
}

export interface FileListResponse {
  code?: number;
  items?: FileMetadataResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface FileMetadataDetailResponse {
  code?: number;
  data?: FileMetadataResponse;
  message?: string;
  timestamp?: string;
}

export interface FileMetadataExtendedDetailResponse {
  code?: number;
  data?: FileMetadataExtendedResponse;
  message?: string;
  timestamp?: string;
}

/** 文件详细元数据信息，包含MinIO存储信息 */
export interface FileMetadataExtendedResponse {
  accessUrl?: string;  // @example https://cdn.example.com/file_abc123.jpg
  bucket?: string;  // @example avatars
  checksum?: string;  // @example abc123
  contentType?: string;  // @example image/jpeg
  createdAt?: string;  // @example 2026-04-15T10:00:00Z
  filename?: string;  // @example avatar.jpg
  id?: string;  // @example file_abc123
  isPublic?: boolean;  // @example False
  key?: string;  // @example 2026/04/file_abc123.jpg
  metadata?: string;
  minioInfo?: MinioInfoResponse;
  modifiedAt?: string;  // @example 2026-04-15T10:30:00Z
  originalName?: string;  // @example avatar.jpg
  ownerId?: string;  // @example usr_abc123
  path?: string;  // @example 2026/04/file_abc123.jpg
  provider?: string;  // @example minio
  size?: number;  // @example 102400
  tenantId?: string;  // @example tnt_xyz789
}

export interface FileMetadataListDetailResponse {
  code?: number;
  data?: FileMetadataResponse[];
  message?: string;
  timestamp?: string;
}

/** 文件元数据信息 */
export interface FileMetadataResponse {
  bucket?: string;  // 存储桶 | @example avatars
  createdAt?: string;  // 创建时间 | @example 2026-04-15T10:00:00Z
  etag?: string;  // ETag | @example "abc123def456"
  fileId?: string;  // 文件ID | @example file_abc123
  isPublic?: boolean;  // 可见性? | @example False
  mimeType?: string;  // MIME类型 | @example image/jpeg
  name?: string;  // 文件名称 | @example avatar.jpg
  objectName?: string;  // 对象名称? | @example 2026/04/file_abc123.jpg
  originalName?: string;  // 原始名称 | @example avatar.jpg
  ownerId?: string;  // 所有ID | @example usr_abc123
  parentId?: string;  // 父文件夹 | @example folder_001
  size?: number;  // 文件大小 | @example 102400
  storageClass?: string;  // 存储类别 | @example standard
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  updatedAt?: string;  // 更新时间 | @example 2026-04-15T10:30:00Z
}

export interface FilePreviewData {
  fileId?: string;
  mimeType?: string;
  name?: string;
  presignedUrl?: string;
  preview?: string;
  size?: number;
  suggestion?: string;
}

export interface FilePreviewDetailResponse {
  code?: number;
  data?: FilePreviewData;
  message?: string;
  timestamp?: string;
}

export interface FileShareDetailResponse {
  code?: number;
  data?: FileShareResponse;
  message?: string;
  timestamp?: string;
}

/** 文件分享链接信息 */
export interface FileShareResponse {
  expiresAt?: string;  // 过期时间 | @example 2026-04-15T11:00:00Z
  shareUrl?: string;  // 分享URL | @example https://storage.example.com/shared/abc123
  token?: string;  // Token | @example tkn_abc123
}

export interface FileVersionDetailResponse {
  code?: number;
  data?: FileVersionResponse;
  message?: string;
  timestamp?: string;
}

/** 文件版本记录 */
export interface FileVersionItem {
  createdAt?: string;  // 创建时间 | @example 2026-04-15T10:00:00Z
  createdBy?: string;  // 创建者 | @example usr_abc123
  etag?: string;  // ETag | @example "def456"
  fileId?: string;  // 文件ID | @example file_abc123
  isCurrent?: boolean;  // 当前版本 | @example True
  size?: number;  // 版本大小 | @example 102400
  versionId?: string;  // 版本ID | @example ver_abc123
}

/** 文件版本历史列表 */
export interface FileVersionResponse {
  currentVersion?: string;  // 当前版本 | @example ver_latest
  fileId?: string;  // 文件ID | @example file_abc123
  versions?: FileVersionItem[];  // 版本列表
}

export interface FolderContentsDetailResponse {
  code?: number;
  data?: FolderContentsResultResponse;
  message?: string;
  timestamp?: string;
}

export interface FolderContentsResultResponse {
  contents?: FileMetadataResponse[];
  folder?: FolderMetadataResponse;
}

export interface FolderMetadataDetailResponse {
  code?: number;
  data?: FolderMetadataResponse;
  message?: string;
  timestamp?: string;
}

/** 文件夹元数据信息 */
export interface FolderMetadataResponse {
  createdAt?: string;  // 创建时间 | @example 2026-04-01T00:00:00Z
  fileCount?: number;  // 文件数 | @example 15
  folderId?: string;  // 文件夹ID | @example folder_abc123
  isPublic?: boolean;  // 是否公开 | @example False
  name?: string;  // 文件夹名称? | @example 项目文档
  ownerId?: string;  // 所有ID | @example usr_abc123
  parentId?: string;  // 父文件夹 | @example folder_root
  subfolderCount?: number;  // 子文件夹数? | @example 3
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  updatedAt?: string;  // 更新时间 | @example 2026-04-10T14:20:00Z
}

export interface InitMultipartUploadRequest {
  contentType: string;  // @example video/mp4
  fileName: string;  // @example large-video.mp4
  folderId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  partCount: number;  // @example 4
  totalSize: number;  // @example 1073741824
  visibility?: string;  // @example private
}

export interface InternalBatchDeleteRequest {
  ids: string[];
  userId: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
}

export interface MimeTypeStat {
  count?: number;  // @example 1500
  mimeType?: string;  // @example image/png
  size?: number;  // @example 536870912
}

/** MinIO存储对象统计信息 */
export interface MinioInfoResponse {
  contentType?: string;  // @example image/jpeg
  etag?: string;  // @example "abc123"
  lastModified?: string;  // @example 2026-04-15T10:30:00Z
  size?: number;  // @example 102400
}

/** 移动文件请求参数 */
export interface MoveFileRequest {
  targetFolderId: string;  // 目标文件夹? | @example folder_002
  targetOwnerId?: string;  // 目标所有? | @example usr_456
}

export interface MultipartInitData {
  expiresIn?: number;  // @example 3600
  fileId?: string;  // @example file_abc123
  parts?: MultipartPartInfo[];
  uploadId?: string;  // @example upload_abc123
}

export interface MultipartInitDataDetailResponse {
  code?: number;
  data?: MultipartInitData;
  message?: string;
  timestamp?: string;
}

export interface MultipartPartInfo {
  partNumber?: number;
  partPath?: string;
  partSize?: number;
  uploadUrl?: string;
}

export interface PresignedURLDetailResponse {
  code?: number;
  data?: PresignedURLResponse;
  message?: string;
  timestamp?: string;
}

/** 预签名URL信息 */
export interface PresignedURLResponse {
  expiresIn?: number;  // 有效期? | @example 3600
  url?: string;  // 访问URL | @example https://storage.example.com/...
}

export interface PublicEncryptionStatus {
  algorithm?: string;  // @example AES-256-GCM
  encryptionAtRest?: boolean;  // @example True
  encryptionInTransit?: boolean;  // @example True
  keyManagement?: string;  // @example KMS
}

export interface PublicEncryptionStatusDetailResponse {
  code?: number;
  data?: PublicEncryptionStatus;
  message?: string;
  timestamp?: string;
}

export interface PublicReport {
  accessLevel?: string;  // @example public
  contentType?: string;  // @example application/pdf
  createdAt?: string;  // @example 2026-04-15T10:00:00Z
  description?: string;  // @example 2026年度SOC2 Type II审计报告
  filename?: string;  // @example SOC2-Type-II-Report-2026.pdf
  id?: string;  // @example file_abc123
  size?: number;  // @example 2048000
  title?: string;  // @example SOC2 Type II Report
}

export interface PublicReportListResponse {
  code?: number;
  items?: PublicReport[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ShareDetailDetailResponse {
  code?: number;
  data?: ShareDetailResponse;
  message?: string;
  timestamp?: string;
}

/** 文件分享详细信息 */
export interface ShareDetailResponse {
  accessCount?: number;  // 访问次数 | @example 3
  createdAt?: string;  // 创建时间 | @example 2026-04-15T10:00:00Z
  expiresAt?: string;  // 过期时间 | @example 2026-04-15T11:00:00Z
  fileId?: string;  // 文件ID | @example file_abc123
  fileName?: string;  // 文件名称 | @example document.pdf
  id?: string;  // 分享ID | @example share_abc123
  maxAccess?: number;  // 最大访问 | @example 10
  token?: string;  // Token | @example tkn_abc123
}

export interface ShareListResponse {
  code?: number;
  items?: ShareResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 分享列表项信息 */
export interface ShareResponse {
  createdAt?: string;  // 创建时间 | @example 2026-04-15T10:00:00Z
  expiresAt?: string;  // 过期时间 | @example 2026-04-15T11:00:00Z
  fileId?: string;  // 文件ID | @example file_abc123
  fileName?: string;  // 文件名称 | @example document.pdf
  id?: string;  // 分享ID | @example share_abc123
}

export interface StorageQuotaDetailResponse {
  code?: number;
  data?: StorageQuotaResponse;
  message?: string;
  timestamp?: string;
}

/** 存储配额信息 */
export interface StorageQuotaResponse {
  availableBytes?: number;  // 可用 | @example 96636764160
  bucketQuotas?: Record<string, number>;  // 桶配额?
  quotaBytes?: number;  // 配额 | @example 107374182400
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  usagePercent?: number;  // 使用百分比
  usedBytes?: number;  // 已用 | @example 10737418240
}

export interface StorageStatsDetailResponse {
  code?: number;
  data?: StorageStatsResponse;
  message?: string;
  timestamp?: string;
}

/** 存储使用统计 */
export interface StorageStatsResponse {
  mimeTypes?: MimeTypeStat[];  // 按类型统计?
  totalFiles?: number;  // 总文件数 | @example 50000
  totalSize?: number;  // 总大小? | @example 536870912000
}

export interface StorageTrendItem {
  date?: string;  // @example 2026-05-20
  usedBytes?: number;  // @example 10737418240
}

export interface StorageTrendsDetailResponse {
  code?: number;
  data?: StorageTrendsResponse;
  message?: string;
  timestamp?: string;
}

export interface StorageTrendsResponse {
  data?: StorageTrendItem[];
  period?: string;  // @example day
  updated?: string;  // @example 2026-05-26T10:00:00Z
}

export interface TenantUsageDetailResponse {
  code?: number;
  data?: TenantUsageResponse;
  message?: string;
  timestamp?: string;
}

export interface TenantUsageResponse {
  fileCount?: number;  // @example 250
  tenantId?: string;  // @example tnt_xyz789
  usedBytes?: number;  // @example 1073741824
}

export interface UpdateBucketRequest {
  description?: string;
  isDefault?: boolean;
  visibility?: string;
}

export interface UpdateFileNameRequest {
  metadata?: Record<string, unknown>;
  name?: string;  // @example new-name.pdf
}

/** 更新文件可见性请求参数 */
export interface UpdateFileVisibilityRequest {
  visibility: "private" | "public";  // 可见性? | @example public
}

export interface UpdateFolderNameRequest {
  name: string;  // @example New Folder Name
}

/** 更新存储配额请求参数 */
export interface UpdateStorageQuotaRequest {
  quotaBytes: number;  // 新配额? | @example 214748364800
}

export interface UploadFileDetailResponse {
  code?: number;
  data?: UploadFileResponse;
  message?: string;
  timestamp?: string;
}

/** 文件上传结果 */
export interface UploadFileResponse {
  createdAt?: string;  // 上传时间 | @example 2026-04-15T10:00:00Z
  fileId?: string;  // 文件ID | @example file_abc123
  fileName?: string;  // 文件数 | @example document.pdf
  size?: number;  // 文件大小 | @example 204800
  thumbnailUrl?: string;  // 缩略图? | @example https://...
  url?: string;  // 访问URL | @example https://storage.example.com/...
}

export interface UploadURLInfo {
  fields?: Record<string, string>;
  fileId?: string;  // @example file_abc123
  uploadUrl?: string;  // @example https://minio:9000/bucket/object?signature=...
}

export interface WatermarkRequest {
  fontSize?: number;  // @example 48
  opacity?: number;  // @example 0.3
  position?: string;  // @example center
  text: string;  // @example Confidential
}

// ============================================================
// tenant-service
// ============================================================

export interface OrgChartNode {
  id?: string;
  name?: string;
  parentId?: string;
}

export interface TenantStats {
  active?: number;
  byPlan?: Record<string, number>;
  inactive?: number;
  pending?: number;
  suspended?: number;
  total?: number;
}

export interface TenantStatsResult {
  stats?: TenantStats;
}

export type WebhookBackoffStrategy = "linear" | "exponential";

export interface AcceptInvitationDetailResponse {
  code?: number;
  data?: AcceptInvitationResponse;
  message?: string;
  timestamp?: string;
}

/** 接受租户邀请 */
export interface AcceptInvitationRequest {
  userId: string;  // @example usr_xyz789
}

/** 接受邀请后的租户信息 */
export interface AcceptInvitationResponse {
  acceptedAt?: string;  // @example 2026-05-02T10:30:00Z
  memberId?: string;  // @example tmb_abc123
  role?: string;  // @example member
  tenantId?: string;  // @example tnt_abc123
  tenantName?: string;  // @example ACME Corporation
}

/** 添加租户自定义域名请求参数 */
export interface AddDomainRequest {
  domain: string;  // 域名 | @example acme.example.com
  isPrimary?: boolean;  // 是否主域名 | @example False
}

/** 添加租户成员请求参数 */
export interface AddMemberRequest {
  departmentId?: string;  // 部门ID | @example dept_001
  role?: string;  // 角色 | @example member
  userId: string;  // 用户ID | @example usr_abc123
}

export interface AppDefaultRoleDetailResponse {
  code?: number;
  data?: AppDefaultRoleResponse;
  message?: string;
}

export interface AppDefaultRoleListResponse {
  code?: number;
  items?: AppDefaultRoleResponse[];
  message?: string;
  pagination?: PageInfo;
  total?: number;
}

/** 应用默认角色详情 */
export interface AppDefaultRoleResponse {
  applicationId?: string;  // @example app_abc123
  createdAt?: string;
  description?: string;
  id?: string;  // @example adr_abc123
  isSystem?: boolean;
  order?: number;
  permissions?: string[];  // @example ['["read"]']
  role?: string;  // @example viewer
  tenantId?: string;  // @example tnt_abc123
  updatedAt?: string;
}

export interface AppQuotaResultResponse {
  allowed?: boolean;  // @example True
  appId?: string;  // @example app-123
  current?: number;  // @example 500
  limit?: number;  // @example 1000
  message?: string;  // @example within quota
  remaining?: number;  // @example 500
  requested?: number;  // @example 100
}

export interface AppSecurityPolicyDetailResponse {
  code?: number;
  data?: AppSecuritySettings;
  message?: string;
  timestamp?: string;
}

export interface AppSecuritySettings {
  appId?: string;
  maxConcurrentSessions?: number;
  requireMfa?: boolean;
  sessionTimeout?: number;
}

export interface ApplicationDetailResponse {
  code?: number;
  data?: ApplicationResponse;
  message?: string;
  timestamp?: string;
}

export interface ApplicationListResponse {
  code?: number;
  items?: ApplicationResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 应用详情 */
export interface ApplicationResponse {
  adminUrl?: string;
  category?: string;
  code?: string;  // @example my-app
  createdAt?: string;
  description?: string;
  entryUrl?: string;
  iconUrl?: string;
  id?: string;  // @example app_abc123
  isDefault?: boolean;
  isPlatform?: boolean;
  logoUrl?: string;
  maxConcurrentSessions?: number;
  maxUsers?: number;
  name?: string;  // @example My Application
  order?: number;
  requireMfa?: boolean;
  sessionTimeout?: number;
  status?: string;  // @example active
  tenantId?: string;  // @example tnt_abc123
  type?: string;  // @example custom
  updatedAt?: string;
  version?: string;
}

export interface ApplicationTypeDetailResponse {
  code?: number;
  data?: ApplicationTypeResponse;
  message?: string;
  timestamp?: string;
}

export interface ApplicationTypeListResponse {
  code?: number;
  items?: ApplicationTypeResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ApplicationTypeResponse {
  code?: string;  // @example custom-crm
  createdAt?: string;  // @example 2026-01-01T00:00:00Z
  description?: string;  // @example 租户自定义应用类型
  id?: string;  // @example 550e8400-e29b-41d4-a716-446655440000
  name?: string;  // @example 自定义 CRM
  tenantId?: string;  // @example tenant-123
  updatedAt?: string;  // @example 2026-01-01T00:00:00Z
}

export interface ApproveMemberRequest {
  message?: string;
  role?: string;
}

/** 为用户在应用中分配角色 */
export interface AssignUserAppRoleRequest {
  expiresAt?: string;
  permissions?: string[];  // @example ['["read"', '"write"]']
  role: string;  // @example admin
  userId: string;  // @example usr_xyz789
}

export interface AuthPolicyDetailResponse {
  code?: number;
  data?: AuthPolicyResponse;
  message?: string;
  timestamp?: string;
}

export interface AuthPolicyResponse {
  captchaEnabled?: boolean;
  changeCooldownMinutes?: number;
  checkBreachedPasswords?: boolean;
  crossTenantSwitchEnabled?: boolean;
  deviceFingerprintEnabled?: boolean;
  deviceTrustDurationHours?: number;
  expiryDays?: number;
  forceChangeOnFirstLogin?: boolean;
  gracePeriodDays?: number;
  historyCount?: number;
  lockoutAttempts?: number;
  lockoutDurationMinutes?: number;
  loginMethods?: string;
  magicLinkEnabled?: boolean;
  maxConcurrentSessions?: number;
  maxDevicesPerUser?: number;
  maxLength?: number;
  mfaEnabled?: boolean;
  mfaEnforceForAll?: boolean;
  mfaEnforceForHighRisk?: boolean;
  mfaEnforceForNewDevice?: boolean;
  mfaMethods?: string;
  mfaPreferredMethods?: string;
  mfaRequiredUserRole?: string;
  minLength?: number;
  oauthProviders?: string;
  otpCodeLength?: number;
  otpEmailTtlMinutes?: number;
  otpMaxAttempts?: number;
  otpSmsTtlMinutes?: number;
  passkeyEnabled?: boolean;
  passkeyMaxCredentials?: number;
  passkeyUserVerification?: string;
  passwordTransmission?: string;
  pepperEnabled?: boolean;
  refreshTokenRotation?: boolean;
  rememberMeDays?: number;
  requireDigits?: boolean;
  requireLowercase?: boolean;
  requireSpecialChars?: boolean;
  requireUppercase?: boolean;
  sessionBindToDevice?: boolean;
  sessionIdleTimeout?: string;
  sessionTimeout?: string;
  silentChallengeEnabled?: boolean;
  ssoProviders?: string;
  tenantId?: string;
  web3Enabled?: boolean;
}

export interface BatchApproveRequest {
  memberIds: string[];
  role?: string;
}

export interface BatchApproveResponseWrapper {
  code?: number;
  data?: BatchApproveResultResponse;
  message?: string;
  timestamp?: string;
}

export interface BatchApproveResultResponse {
  failed?: number;
  succeeded?: number;
}

export interface BrandingDetailResponse {
  code?: number;
  data?: BrandingResponse;
  message?: string;
  timestamp?: string;
}

/** 租户品牌定制配置 */
export interface BrandingResponse {
  companyName?: string;  // 公司名称
  createdAt?: string;  // 创建时间 | @example 2026-01-01T00:00:00Z
  customCss?: string;  // 自定义CSS
  emailSenderAddress?: string;  // 邮件发送者地址
  emailSenderName?: string;  // 邮件发送者名称
  faviconUrl?: string;  // Favicon URL | @example https://...
  loginPageDescription?: string;  // 登录页描述
  loginPageTitle?: string;  // 登录页标题
  logoUrl?: string;  // Logo URL | @example https://...
  primaryColor?: string;  // 主题色 | @example #0066CC
  privacyPolicyUrl?: string;  // 隐私政策URL
  secondaryColor?: string;  // 辅助色 | @example #F5F5F5
  tenantId?: string;  // 租户ID | @example tnt_abc123
  termsOfServiceUrl?: string;  // 服务条款URL
  updatedAt?: string;  // 更新时间 | @example 2026-01-01T00:00:00Z
}

/** 批量导入成员单项 */
export interface BulkImportMemberItem {
  email: string;  // 邮箱
  role?: string;  // 角色
}

/** 批量导入租户成员请求参数 */
export interface BulkImportMembersRequest {
  members: BulkImportMemberItem[];  // 成员列表
}

export interface CheckAppQuotaResultDetailResponse {
  code?: number;
  data?: AppQuotaResultResponse;
  message?: string;
  timestamp?: string;
}

/** 配额检查结果 */
export interface CheckQuotaResponse {
  allowed?: boolean;  // 是否允许 | @example True
  currentUsage?: number;  // 当前使用量 | @example 45
  limit?: number;  // 上限 | @example 100
  message?: string;  // 消息 | @example 配额充足
}

/** 创建应用默认角色模板 */
export interface CreateAppDefaultRoleRequest {
  description?: string;  // @example Read-only access
  isSystem?: boolean;
  order?: number;
  permissions?: string[];  // @example ['["read"]']
  role: string;  // @example viewer
}

/** 创建新应用请求参数 */
export interface CreateApplicationRequest {
  adminUrl?: string;
  category?: string;
  code?: string;  // @example my-app
  description?: string;  // @example A custom application
  entryUrl?: string;
  iconUrl?: string;
  isDefault?: boolean;
  logoUrl?: string;
  maxConcurrentSessions?: number;
  maxUsers?: number;
  name: string;  // @example My Application
  order?: number;
  requireMfa?: boolean;
  sessionTimeout?: number;
  type?: string;  // @example custom
  version?: string;
}

/** 创建租户部门的请求参数 */
export interface CreateDepartmentRequest {
  code?: string;  // 部门编码 | @example RD
  managerId?: string;  // 负责人ID | @example usr_001
  name: string;  // 部门名称 | @example 技术研发部
  parentId?: string;  // 父部门ID | @example dept-root
}

/** 创建新租户请求参数 */
export interface CreateTenantRequest {
  displayName: string;  // 显示名称 | @example ACME Corp
  domain?: string;  // 域名 | @example acme.example.com
  name: string;  // 租户名称 | @example acme-corp
  ownerId: string;  // 所有者ID | @example usr_xyz789
  plan?: string;  // 订阅计划 | @example free
}

export interface CreateWebhookRequest {
  backoffStrategy?: WebhookBackoffStrategy;
  events?: string[];
  headers?: Record<string, string>;
  maxRetries?: number;
  secret?: string;
  timeoutSecs?: number;
  url?: string;
}

/** 数据分类项 */
export interface DataClassification {
  color?: string;  // 颜色 | @example #FF0000
  description?: string;  // 描述 | @example 机密数据
  label?: string;  // 标签 | @example 机密
  level?: string;  // 级别 | @example confidential
}

export interface DataClassificationDetailResponse {
  code?: number;
  data?: DataClassificationResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsearray_dto_TenantInfo {
  code?: number;
  data?: TenantInfo[];
  message?: string;
  timestamp?: string;
}

export interface DataResponsedomain_TenantStatsResult {
  code?: number;
  data?: TenantStatsResult;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_AuthPolicyResponse {
  code?: number;
  data?: AuthPolicyResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_CreateApiKeyResponse {
  code?: number;
  data?: CreateApiKeyResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_MemberResponse {
  code?: number;
  data?: MemberResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_PublicTenantDetailResponse {
  code?: number;
  data?: PublicTenantDetailResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_RotateApiKeyResponse {
  code?: number;
  data?: RotateApiKeyResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_TenantInfo {
  code?: number;
  data?: TenantInfo;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_TenantResponse {
  code?: number;
  data?: TenantResponse;
  message?: string;
  timestamp?: string;
}

export interface DepartmentDetailResponse {
  code?: number;
  data?: DepartmentResponse;
  message?: string;
  timestamp?: string;
}

export interface DepartmentListResponse {
  code?: number;
  data?: DepartmentResponse[];
  message?: string;
}

/** 租户部门信息 */
export interface DepartmentResponse {
  code?: string;  // 部门编码 | @example RD
  createdAt?: string;  // 创建时间 | @example 2026-01-15T10:30:00Z
  departmentId?: string;  // 部门ID | @example dept_001
  managerId?: string;  // 负责人ID | @example usr_001
  membersCount?: number;  // 成员数量 | @example 25
  name?: string;  // 部门名称 | @example 技术研发部
  parentId?: string;  // 父部门ID | @example dept_root
  tenantId?: string;  // 租户ID | @example tnt_abc123
}

export interface DomainDetailResponse {
  code?: number;
  data?: DomainResponse;
  message?: string;
  timestamp?: string;
}

export interface DomainListResponse {
  code?: number;
  items?: DomainResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 租户自定义域名信息 */
export interface DomainResponse {
  createdAt?: string;  // 创建时间 | @example 2026-01-01T00:00:00Z
  domain?: string;  // 域名 | @example acme.example.com
  isPrimary?: boolean;  // 是否主域名 | @example True
  tenantId?: string;  // 租户ID | @example tnt_abc123
  verified?: boolean;  // 是否验证 | @example True
}

export interface EraseUserRequest {
  userId?: string;
}

export interface EventSchemaDetailResponse {
  code?: number;
  data?: EventSchemaResponse;
  message?: string;
  timestamp?: string;
}

export interface EventSchemaResponse {
  action?: string;  // @example created
  description?: string;  // @example Triggered when a new user is created
  domain?: string;  // @example user
  eventType?: string;  // @example user.created
  example?: unknown;
}

export interface EventTypeListResponse {
  items?: EventTypeResponse[];
}

export interface EventTypeResponse {
  action?: string;  // @example created
  domain?: string;  // @example user
  eventType?: string;  // @example user.created
}

export interface InternalValidateApiKeyRequest {
  apiKey: string;
}

export interface InternalValidateApiKeyResponse {
  name?: string;
  scope?: string;
  tenantId?: string;
  valid?: boolean;
}

export interface InvitationConfigDetailResponse {
  code?: number;
  data?: InvitationConfigResponse;
  message?: string;
  timestamp?: string;
}

export interface InvitationConfigResponse {
  defaultInviteRole?: string;
  inviteExpiryDays?: number;
  tenantId?: string;
}

export interface InvitationListResponse {
  code?: number;
  items?: InvitationResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 租户邀请信息 */
export interface InvitationResponse {
  createdAt?: string;  // @example 2026-05-31T10:00:00Z
  email?: string;  // @example user@example.com
  expiresAt?: string;  // @example 2026-06-07T10:00:00Z
  invitationId?: string;  // @example inv_abc123
  inviterId?: string;  // @example usr_inviter
  role?: string;  // @example member
  status?: string;  // @example pending
  tenantId?: string;  // @example tnt_abc123
  updatedAt?: string;  // @example 2026-05-31T10:00:00Z
}

/** 邀请成员加入租户请求参数 */
export interface InviteMemberRequest {
  departmentId?: string;  // 部门ID | @example dept_001
  email: string;  // 邮箱 | @example user@example.com
  role?: string;  // 角色 | @example member
  sendEmail?: boolean;  // 发送邮件 | @example True
}

export interface ListResponsedto_ApiKeyResponse {
  code?: number;
  items?: ApiKeyResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface MemberDetailResponse {
  code?: number;
  data?: MemberResponse;
  message?: string;
  timestamp?: string;
}

export interface MemberListResponse {
  code?: number;
  items?: MemberResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 租户成员信息 */
export interface MemberResponse {
  departmentId?: string;  // 部门ID | @example dept_001
  joinedAt?: string;  // 加入时间 | @example 2026-01-15T10:30:00Z
  role?: string;  // 角色 | @example member
  status?: string;  // 状态 | @example active
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  userId?: string;  // 用户ID | @example usr_abc123
}

export interface MembershipCheckDetailResponse {
  code?: number;
  data?: MembershipCheckResponse;
  message?: string;
  timestamp?: string;
}

/** 检查用户是否为租户成员的结果 */
export interface MembershipCheckResponse {
  isMember?: boolean;  // @example True
  role?: string;  // @example admin
  status?: string;  // @example active
}

export interface MinorsProtectionConfigResponse {
  childDefaultMaxPrivacy?: boolean;  // @example True
  contentFilterEnabled?: boolean;  // @example False
  dailyUsageLimitMin?: number;  // @example 60
  digitalConsentAge?: number;  // @example 13
  liveStreamBlockedUnder16?: boolean;  // @example False
  minorDataRetentionDays?: number;  // @example 365
  minorsAgeThreshold?: number;  // @example 18
  monthlySpendLimit?: number;  // @example 10000
  nightModeEnabled?: boolean;  // @example False
  nightModeEnd?: string;  // @example 06:00
  nightModeStart?: string;  // @example 22:00
  tenantId?: string;  // @example tnt_abc123
}

/** 密码策略详细配置 */
export interface PasswordPolicyConfig {
  maxLength?: number;  // 最大长度 | @example 128
  minLength?: number;  // 最小长度 | @example 8
  requireDigit?: boolean;  // 要求数字 | @example True
  requireLowercase?: boolean;  // 要求小写字母 | @example True
  requireSpecial?: boolean;  // 要求特殊字符 | @example False
  requireUppercase?: boolean;  // 要求大写字母 | @example True
}

export interface PendingMemberListResponse {
  code?: number;
  items?: PendingMemberResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PendingMemberResponse {
  daysRemaining?: number;
  expiresAt?: string;
  memberId?: string;
  reason?: string;
  requestedAt?: string;
  requestedRole?: string;
  userId?: string;
}

export interface PublicAuthPolicy {
  breachCheckEnabled?: boolean;
  captchaEnabled?: boolean;
  crossTenantSwitchEnabled?: boolean;
  loginMethods?: string[];
  magicLinkEnabled?: boolean;
  maxConcurrentSessions?: number;
  mfaEnforceForAll?: boolean;
  mfaMethods?: string[];
  oauthProviders?: string[];
  passkeyEnabled?: boolean;
  ssoProviders?: string[];
}

export interface PublicSecurityPolicy {
  lockoutAttempts?: number;
  maxLength?: number;
  minLength?: number;
  passwordTransmission?: string;
  requireDigit?: boolean;
  requireLower?: boolean;
  requireSpecial?: boolean;
  requireUpper?: boolean;
  unicodeAllowed?: boolean;
}

export interface PublicTenantDetailResponse {
  authPolicy?: PublicAuthPolicy;
  branding?: BrandingInfo;
  securityPolicy?: PublicSecurityPolicy;
  tenant?: PublicTenantInfo;
}

export interface PublicTenantInfo {
  displayName?: string;
  domain?: string;
  id?: string;
  membershipApproval?: string;
  name?: string;
}

export interface PublicTenantListResponse {
  code?: number;
  items?: PublicTenantResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface PublicTenantResponse {
  displayName?: string;  // @example Acme Corporation
  id?: string;  // @example 01KTKJF63AQ6BAKDP8RAMJ3KEK
  name?: string;  // @example acme-corp
}

export interface RegisterTrialTenantRequest {
  adminEmail: string;
  adminPassword: string;
  agreementAccepted?: boolean;
  agreementVersion?: string;
  displayName?: string;
  invitationCode?: string;
  name: string;
}

export interface RejectMemberRequest {
  reason: string;
}

export interface ResourceQuotaDetailResponse {
  code?: number;
  data?: ResourceQuotaResponse;
  message?: string;
  timestamp?: string;
}

/** 租户资源配额信息 */
export interface ResourceQuotaResponse {
  activeUsers?: number;  // 活跃用户数 | @example 45
  apiCallsPerMonth?: number;  // API调用上限 | @example 10000
  storageGb?: number;  // 存储上限 | @example 50
  tenantId?: string;  // 租户ID | @example tnt_abc123
  usedApiCalls?: number;  // 已用API调用 | @example 5230
  usedStorageGb?: number;  // 已用存储 | @example 23.5
  usersLimit?: number;  // 用户上限 | @example 100
}

export interface RotateApiKeyResponse {
  apiKey?: string;  // @example tk_f6e7d8c9a0b1...
  createdAt?: string;  // @example 2026-05-12T16:00:00Z
  id?: string;  // @example tak_001
  keyPrefix?: string;  // @example tk_f6e7d8c9
  message?: string;  // @example 请立即保存新API Key，旧Key已失效
}

export interface SecurityPolicyDetailResponse {
  code?: number;
  data?: SecurityPolicyResponse;
  message?: string;
  timestamp?: string;
}

/** 租户安全策略配置 */
export interface SecurityPolicyResponse {
  ipWhitelist?: string[];  // IP白名单
  mfaRequired?: boolean;  // 强制MFA | @example True
  passwordPolicy?: PasswordPolicyConfig;  // 密码策略
  sessionPolicy?: SessionPolicyConfig;  // 会话策略
  tenantId?: string;  // 租户ID | @example tnt_abc123
}

/** 会话策略详细配置 */
export interface SessionPolicyConfig {
  maxConcurrentSessions?: number;  // 最大并发会话数 | @example 10
  timeoutSeconds?: number;  // 会话超时（秒） | @example 1800
}

/** 暂停应用参数 */
export interface SuspendApplicationRequest {
  reason?: string;  // @example Maintenance
}

export interface TenantDetailResponse {
  code?: number;
  data?: TenantResponse;
  message?: string;
  timestamp?: string;
}

export interface TenantListResponse {
  code?: number;
  items?: TenantResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface TenantOverviewDetailResponse {
  code?: number;
  data?: TenantOverviewResponse;
  message?: string;
  timestamp?: string;
}

/** 租户概览统计信息（成员数、应用数等） */
export interface TenantOverviewResponse {
  activeAppCount?: number;  // @example 6
  appCount?: number;  // @example 8
  maxUsers?: number;  // @example 100
  memberCount?: number;  // @example 45
  tenantId?: string;  // @example tnt_abc123
}

/** 租户详细信息 */
export interface TenantResponse {
  brandCustomCss?: string;
  brandFaviconUrl?: string;
  brandLogoUrl?: string;
  brandPrimaryColor?: string;
  createdAt?: string;  // 创建时间 | @example 2026-01-01T00:00:00Z
  displayName?: string;  // 显示名称 | @example ACME Corporation
  domain?: string;  // 域名 | @example acme.example.com
  id?: string;  // 租户ID | @example tnt_abc123
  maxApiRequests?: number;  // API请求上限 | @example 10000
  maxBandwidth?: number;  // 带宽上限(bytes/month) | @example 104857600
  maxStorage?: number;  // 存储上限(bytes) | @example 1073741824
  maxUsers?: number;  // 用户上限 | @example 100
  name?: string;  // 租户名称（用作 URL slug） | @example acme-corp
  ownerId?: string;  // 所有者ID | @example usr_xyz789
  plan?: string;  // 订阅计划 | @example professional
  status?: string;  // 状态 | @example active
  updatedAt?: string;  // 更新时间 | @example 2026-04-10T14:20:00Z
}

/** 更新应用默认角色模板 */
export interface UpdateAppDefaultRoleRequest {
  description?: string;
  isSystem?: boolean;
  order?: number;
  permissions?: string[];
  role?: string;
}

/** 更新应用参数 */
export interface UpdateApplicationRequest {
  adminUrl?: string;
  category?: string;
  description?: string;
  entryUrl?: string;
  iconUrl?: string;
  isDefault?: boolean;
  logoUrl?: string;
  maxConcurrentSessions?: number;
  maxUsers?: number;
  name?: string;
  order?: number;
  requireMfa?: boolean;
  sessionTimeout?: number;
  type?: string;
  version?: string;
}

export interface UpdateAuthPolicyRequest {
  captchaEnabled?: boolean;
  changeCooldownMinutes?: number;
  checkBreachedPasswords?: boolean;
  crossTenantSwitchEnabled?: boolean;
  deviceFingerprintEnabled?: boolean;
  deviceTrustDurationHours?: number;
  expiryDays?: number;
  forceChangeOnFirstLogin?: boolean;
  gracePeriodDays?: number;
  historyCount?: number;
  lockoutAttempts?: number;
  lockoutDurationMinutes?: number;
  loginMethods?: string;
  magicLinkEnabled?: boolean;
  maxConcurrentSessions?: number;
  maxDevicesPerUser?: number;
  maxLength?: number;
  mfaEnabled?: boolean;
  mfaEnforceForAll?: boolean;
  mfaEnforceForHighRisk?: boolean;
  mfaEnforceForNewDevice?: boolean;
  mfaMethods?: string;
  mfaPreferredMethods?: string;
  mfaRequiredUserRole?: string;
  minLength?: number;
  oauthProviders?: string;
  otpCodeLength?: number;
  otpEmailTtlMinutes?: number;
  otpMaxAttempts?: number;
  otpSmsTtlMinutes?: number;
  passkeyEnabled?: boolean;
  passkeyMaxCredentials?: number;
  passkeyUserVerification?: string;
  passwordTransmission?: string;
  pepperEnabled?: boolean;
  refreshTokenRotation?: boolean;
  rememberMeDays?: number;
  requireDigits?: boolean;
  requireLowercase?: boolean;
  requireSpecialChars?: boolean;
  requireUppercase?: boolean;
  sessionBindToDevice?: boolean;
  sessionIdleTimeout?: string;
  sessionTimeout?: string;
  silentChallengeEnabled?: boolean;
  ssoProviders?: string;
  web3Enabled?: boolean;
}

/** 更新租户品牌定制请求参数 */
export interface UpdateBrandingRequest {
  companyName?: string;  // 公司名称
  customCss?: string;  // 自定义CSS
  emailSenderAddress?: string;  // 邮件发送者地址
  emailSenderName?: string;  // 邮件发送者名称
  faviconUrl?: string;  // Favicon URL | @example https://...
  loginPageDescription?: string;  // 登录页描述
  loginPageTitle?: string;  // 登录页标题
  logoUrl?: string;  // Logo URL | @example https://...
  primaryColor?: string;  // 主题色 | @example #0066CC
  privacyPolicyUrl?: string;  // 隐私政策URL
  secondaryColor?: string;  // 辅助色 | @example #F5F5F5
  termsOfServiceUrl?: string;  // 服务条款URL
}

/** 更新租户部门的请求参数 */
export interface UpdateDepartmentRequest {
  code?: string;  // 部门编码 | @example RD
  managerId?: string;  // 负责人ID | @example usr_001
  name?: string;  // 部门名称 | @example 产品研发部
  parentId?: string;  // 父部门ID | @example dept-root
}

export interface UpdateInvitationConfigRequest {
  defaultInviteRole?: string;
  inviteExpiryDays?: number;
}

/** 更新租户成员请求参数 */
export interface UpdateMemberRequest {
  departmentId?: string;  // 部门ID | @example dept_002
  role?: string;  // 角色 | @example admin
  status?: string;  // 状态 | @example active
}

export interface UpdateMinorsProtectionConfigRequest {
  childDefaultMaxPrivacy?: boolean;
  contentFilterEnabled?: boolean;
  dailyUsageLimitMin?: number;
  digitalConsentAge?: number;
  liveStreamBlockedUnder16?: boolean;
  minorDataRetentionDays?: number;
  minorsAgeThreshold?: number;
  monthlySpendLimit?: number;
  nightModeEnabled?: boolean;
  nightModeEnd?: string;
  nightModeStart?: string;
}

export interface UpdateOrgChartRequest {
  nodes?: OrgChartNode[];
}

/** 更新租户资源配额请求参数 */
export interface UpdateResourceQuotaRequest {
  maxApiRequests?: number;
  maxBandwidth?: number;
  maxStorage?: number;
  maxUsers?: number;
}

/** 更新租户安全策略请求参数 */
export interface UpdateSecurityPolicyRequest {
  allowedIpRanges?: string[];
  blockedCountries?: string[];
  lockDuration?: string;
  maxAttemptsPerUser?: number;
  maxConcurrentSessions?: number;
  mfaRequired?: boolean;
  passwordMaxLength?: number;
  passwordMinLength?: number;
  requireDigit?: boolean;
  requireLowercase?: boolean;
  requireSpecial?: boolean;
  requireUppercase?: boolean;
  sessionTimeout?: string;
}

/** 更新租户信息请求参数 */
export interface UpdateTenantRequest {
  displayName?: string;  // 显示名称 | @example ACME Ltd
  domain?: string;  // 域名 | @example acme2.example.com
  membershipApproval?: string;  // 成员加入方式: open/approval_required/invitation_only | @example open
  metadata?: Record<string, string>;  // 元数据
  plan?: string;  // 订阅计划 | @example professional
}

/** 更新用户应用角色 */
export interface UpdateUserAppRoleRequest {
  expiresAt?: string;
  isActive?: boolean;
  permissions?: string[];
  role?: string;
}

export interface UpdateWebhookRequest {
  backoffStrategy?: WebhookBackoffStrategy;
  events?: string[];
  headers?: Record<string, string>;
  isActive?: boolean;
  maxRetries?: number;
  secret?: string;
  timeoutSecs?: number;
  url?: string;
}

export interface UserAppRoleDetailResponse {
  code?: number;
  data?: UserAppRoleResponse;
  message?: string;
}

export interface UserAppRoleListResponse {
  code?: number;
  items?: UserAppRoleResponse[];
  message?: string;
  pagination?: PageInfo;
  total?: number;
}

/** 用户应用角色详情 */
export interface UserAppRoleResponse {
  applicationId?: string;  // @example app_abc123
  assignedBy?: string;
  createdAt?: string;
  expiresAt?: string;
  id?: string;  // @example uar_abc123
  isActive?: boolean;
  permissions?: string[];  // @example ['["read"', '"write"]']
  role?: string;  // @example admin
  tenantId?: string;  // @example tnt_abc123
  updatedAt?: string;
  userId?: string;  // @example usr_xyz789
}

export interface UserApplicationListResponse {
  code?: number;
  items?: UserApplicationResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 用户可访问的应用概要信息 */
export interface UserApplicationResponse {
  appCode?: string;  // @example my-app
  appId?: string;  // @example app_abc123
  appName?: string;  // @example My Application
  isActive?: boolean;
  role?: string;  // @example editor
  tenantId?: string;  // @example tnt_abc123
  tenantName?: string;  // @example acme-corp
}

export interface UserPermissionDetailResponse {
  code?: number;
  data?: UserPermissionResponse;
  message?: string;
  timestamp?: string;
}

/** 用户在应用中的权限信息 */
export interface UserPermissionResponse {
  appCode?: string;  // @example my-app
  appId?: string;  // @example app_abc123
  hasAccess?: boolean;
  permissions?: string[];  // @example ['["read"', '"write"]']
  role?: string;  // @example editor
}

export interface UserTenantListResponse {
  code?: number;
  items?: UserTenantResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 用户所属租户的概要信息 */
export interface UserTenantResponse {
  displayName?: string;  // @example ACME Corporation
  joinedAt?: string;  // @example 2026-01-15T10:30:00Z
  role?: string;  // @example admin
  status?: string;  // @example active
  tenantId?: string;  // @example tnt_abc123
  tenantName?: string;  // @example acme-corp
}

export interface ValidateInvitationDetailResponse {
  code?: number;
  data?: ValidateInvitationResponse;
  message?: string;
  timestamp?: string;
}

/** 验证邀请码后返回的邀请信息 */
export interface ValidateInvitationResponse {
  email?: string;  // @example user@example.com
  invitedBy?: string;  // @example usr_xyz789
  role?: string;  // @example member
  status?: string;  // @example pending
  tenantId?: string;  // @example tnt_abc123
}

export interface WebhookDeliveryLogDetailResponse {
  code?: number;
  data?: WebhookDeliveryLogResponse;
  message?: string;
  timestamp?: string;
}

export interface WebhookDeliveryLogListResponse {
  code?: number;
  items?: WebhookDeliveryLogResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface WebhookDeliveryLogResponse {
  attempt?: number;  // @example 1
  createdAt?: string;  // @example 2026-01-01T00:00:00Z
  durationMs?: number;  // @example 150
  error?: string;
  eventType?: string;  // @example user.created
  id?: string;  // @example 550e8400-e29b-41d4-a716-446655440000
  payload?: string;
  requestId?: string;  // @example uuid-123
  response?: string;
  status?: string;  // @example delivered
  statusCode?: number;  // @example 200
  tenantId?: string;  // @example tenant-123
  url?: string;  // @example https://example.com/webhook
  webhookId?: string;  // @example wh_abc123
}

export interface WebhookDeliveryStatsDetailResponse {
  code?: number;
  data?: WebhookDeliveryStatsResponse;
  message?: string;
  timestamp?: string;
}

export interface WebhookDeliveryStatsResponse {
  avgDurationMs?: number;  // @example 120.5
  failCount?: number;  // @example 50
  pendingCount?: number;  // @example 0
  successCount?: number;  // @example 950
  successRate?: number;  // @example 95
  totalCount?: number;  // @example 1000
}

export interface WebhookDetailResponse {
  code?: number;
  data?: WebhookResponse;
  message?: string;
  timestamp?: string;
}

export interface WebhookListResponse {
  code?: number;
  items?: WebhookResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface WebhookResponse {
  backoffStrategy?: string;  // @example exponential
  createdAt?: string;  // @example 2026-01-01T00:00:00Z
  events?: string[];  // @example ['["user.created"', '"user.updated"]']
  headers?: string;  // @example {"X-Custom":"value"}
  id?: string;  // @example 550e8400-e29b-41d4-a716-446655440000
  isActive?: boolean;  // @example True
  maxRetries?: number;  // @example 3
  tenantId?: string;  // @example tenant-123
  timeoutSecs?: number;  // @example 10
  updatedAt?: string;  // @example 2026-01-01T00:00:00Z
  url?: string;  // @example https://example.com/webhook
}

export interface CreateAppTypeRequest {
  code: string;
  description?: string;
  name: string;
}

export interface UpdateAppTypeRequest {
  description?: string;
  name?: string;
}

// ============================================================
// thirdparty-service
// ============================================================

export interface Challenge {
  data?: ChallengeData;
  expiresAt?: string;
  id?: string;
  siteKey?: string;
  tenantId?: string;
  type?: string;
}

export interface ChallengeData {
  challenge?: string;
  difficulty?: number;
  tenantId?: string;
}

export interface DataResponsecaptcha_Challenge {
  code?: number;
  data?: Challenge;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_thirdpartyservice_internal_dto_CaptchaVerifyResponse {
  code?: number;
  data?: CaptchaVerifyResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_thirdpartyservice_internal_dto_ExportUserDataResponse {
  code?: number;
  data?: ExportUserDataResponse;
  message?: string;
  timestamp?: string;
}

export interface CaptchaVerifyRequest {
  action?: string;
  challengeId?: string;
  provider: string;
  remoteIp?: string;
  token: string;
}

export interface CaptchaVerifyResponse {
  action?: string;
  errorCodes?: string[];
  provider?: string;
  score?: number;
  success?: boolean;
}

// ============================================================
// verification-service
// ============================================================

export interface DataResponsegitee_com_linmes_authms_microservices_verificationservice_internal_handler_dto_AdminVerificationDetail {
  code?: number;
  data?: AdminVerificationDetail;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_verificationservice_internal_handler_dto_BeginLivenessResponse {
  code?: number;
  data?: BeginLivenessResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_verificationservice_internal_handler_dto_GuardianRelationshipResponse {
  code?: number;
  data?: GuardianRelationshipResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_verificationservice_internal_handler_dto_LivenessResultResponse {
  code?: number;
  data?: LivenessResultResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_verificationservice_internal_handler_dto_ProviderConfigResponse {
  code?: number;
  data?: ProviderConfigResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_verificationservice_internal_handler_dto_StatsResponse {
  code?: number;
  data?: StatsResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_verificationservice_internal_handler_dto_SubmitOCRResponse {
  code?: number;
  data?: SubmitOCRResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_verificationservice_internal_handler_dto_VerificationDetailResponse {
  code?: number;
  data?: VerificationDetailResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsegitee_com_linmes_authms_microservices_verificationservice_internal_handler_dto_VerificationStatusResponse {
  code?: number;
  data?: VerificationStatusResponse;
  message?: string;
  timestamp?: string;
}

export interface ListResponsegitee_com_linmes_authms_microservices_verificationservice_internal_handler_dto_GuardianRelationshipResponse {
  code?: number;
  items?: GuardianRelationshipResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsegitee_com_linmes_authms_microservices_verificationservice_internal_handler_dto_MinorProfileResponse {
  code?: number;
  items?: MinorProfileResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsegitee_com_linmes_authms_microservices_verificationservice_internal_handler_dto_ProviderConfigResponse {
  code?: number;
  items?: ProviderConfigResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ListResponsegitee_com_linmes_authms_microservices_verificationservice_internal_handler_dto_VerificationListItem {
  code?: number;
  items?: VerificationListItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface AdminVerificationDetail {
  ageGroup?: string;
  createdAt?: string;
  dateOfBirth?: string;
  expiresAt?: string;
  gender?: string;
  id?: string;
  idNumberHint?: string;
  livenessScore?: string;
  maskedName?: string;
  maxRetries?: number;
  method?: string;
  overrideBy?: string;
  overrideReason?: string;
  provider?: string;
  providerRespId?: string;
  rejectedAt?: string;
  rejectedReason?: string;
  retryCount?: number;
  status?: string;
  tenantId?: string;
  updatedAt?: string;
  userId?: string;
  verifiedAt?: string;
}

export interface BeginLivenessRequest {
  verificationId: string;
}

export interface BeginLivenessResponse {
  actionSequence?: string;
  expiresAt?: number;
  sessionToken?: string;
}

export interface CompleteLivenessRequest {
  sessionToken: string;
  videoData?: string;
}

export interface CreateGuardianRequest {
  guardianUserId: string;
  minorUserId: string;
  relationType: string;
}

export interface EraseUserInternalRequest {
  tenantId: string;
  userId: string;
}

export interface GuardianConsentRequest {
  consentScope?: string;
}

export interface GuardianRelationshipResponse {
  consentAt?: string;
  consentGiven?: boolean;
  consentScope?: string;
  createdAt?: string;
  guardianUserId?: string;
  id?: string;
  minorUserId?: string;
  relationType?: string;
  verified?: boolean;
  verifiedAt?: string;
}

export interface LivenessResultResponse {
  passed?: boolean;
  score?: number;
}

export interface ManualReviewRequest {
  reason: string;
}

export interface MinorProfileResponse {
  ageGroup?: string;
  consentGranted?: boolean;
  dailyLimitMinutes?: number;
  guardianUserId?: string;
  isMinor?: boolean;
  nightModeEnd?: string;
  nightModeStart?: string;
  restrictions?: string[];
  userId?: string;
}

export interface RemoveGuardianRequest {
  guardianUserId: string;
  minorUserId: string;
}

export interface ResolveReviewRequest {
  reason: string;
  resolution: "approved" | "rejected";
}

export interface SetMinorProtectionRequest {
  dailyLimitMinutes?: number;
  minorUserId: string;
  nightModeEnd?: string;
  nightModeStart?: string;
  restrictions?: string[];
}

export interface StatsResponse {
  expired?: number;
  minorCount?: number;
  pending?: number;
  rejected?: number;
  total?: number;
  unverified?: number;
  verified?: number;
}

export interface SubmitOCRRequest {
  backImage: string;
  frontImage: string;
}

export interface SubmitOCRResponse {
  ocrConfidence?: number;
  ocrIdNumber?: string;
  ocrName?: string;
  status?: string;
  verificationId?: string;
}

export interface SubmitVerificationRequest {
  confirmedIdNumber?: string;
  confirmedName?: string;
  method: VerificationMethod;
}

export interface UpdateGuardianRequest {
  consentScope?: string;
  relationType?: string;
}

export interface VerificationDetailResponse {
  ageGroup?: string;
  expiresAt?: string;
  livenessScore?: string;
  maxRetries?: number;
  method?: string;
  provider?: string;
  providerRespId?: string;
  rejectedReason?: string;
  retryCount?: number;
  status?: string;
  verificationId?: string;
  verifiedAt?: string;
}

export interface VerificationListItem {
  ageGroup?: string;
  createdAt?: string;
  expiresAt?: string;
  id?: string;
  livenessScore?: string;
  method?: string;
  provider?: string;
  rejectedReason?: string;
  retryCount?: number;
  status?: string;
  updatedAt?: string;
  userId?: string;
  verifiedAt?: string;
}

export interface VerificationStatusResponse {
  ageGroup?: string;
  expiresAt?: string;
  maxRetries?: number;
  method?: string;
  provider?: string;
  retryCount?: number;
  status?: string;
  verificationId?: string;
  verifiedAt?: string;
}

export type VerificationMethod = "ocr" | "two_element" | "three_element" | "four_element" | "manual";

// ============================================================
// wallet-service
// ============================================================

export interface WalletIntegrityResult {
  brokenAt?: number;
  lastHash?: string;
  total?: number;
  valid?: boolean;
  walletId?: string;
}

export interface WalletPolicy {
  applicationId?: string;
  autoApproveLimit?: number;
  createdAt?: string;
  dailyWithdrawLimit?: number;
  defaultListPageSize?: number;
  exportPageSize?: number;
  id?: string;
  idempotencyTtl?: number;
  internalClientTimeout?: number;
  maxBalance?: number;  // 0 = 无限制
  minWithdrawAmount?: number;
  monthlyWithdrawLimit?: number;
  quoteCacheTtl?: number;
  rateLimitPerHour?: number;
  rateLimitPerMin?: number;
  supportedCurrencies?: string;  // comma-separated
  tenantId?: string;
  timezone?: string;  // 租户时区，用于日限额计算
  transferEnabled?: boolean;
  updatedAt?: string;
  withdrawalRequireReview?: boolean;
}

export interface AdjustBalanceResponse {
  code?: number;
  data?: ManualAdjustResult;
  message?: string;
  timestamp?: string;
}

export interface ApproveWithdrawalRequest {
  approvedBy?: string;
  remark?: string;
}

export interface BalanceHistoryEntry {
  amount?: string;  // @example 100.50
  balanceAfter?: string;  // @example 1000.50
  balanceBefore?: string;  // @example 900.00
  date?: string;  // @example 2026-04-15T10:30:00Z
  description?: string;  // @example 账户充值
  transactionId?: string;  // @example 01ARZ3NDEKTSV4RRFFQ69G5FAV
  type?: string;  // @example deposit
}

export interface BalanceHistoryListResponse {
  code?: number;
  items?: BalanceHistoryEntry[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface BatchFreezeRequest {
  amount: string;
  reason?: string;
  userIds: string[];
}

export interface BatchFreezeResponse {
  code?: number;
  data?: BatchFreezeResult;
  message?: string;
  timestamp?: string;
}

export interface BatchFreezeResult {
  frozenCount?: number;  // @example 5
}

export interface BatchUnfreezeRequest {
  freezeIds: string[];
  reason?: string;
}

export interface BatchUnfreezeResponse {
  code?: number;
  data?: BatchUnfreezeResult;
  message?: string;
  timestamp?: string;
}

export interface BatchUnfreezeResult {
  errors?: string[];  // @example ['["frz_xyz: already released"]']
  failed?: number;  // @example 1
  succeeded?: number;  // @example 9
  total?: number;  // @example 10
}

export interface CancelTransactionDetailResponse {
  code?: number;
  data?: CancelTransactionResult;
  message?: string;
  timestamp?: string;
}

/** 取消交易请求参数 */
export interface CancelTransactionRequest {
  reason?: string;  // 原因 | @example 重复下单
}

export interface CancelTransactionResult {
  cancelled?: boolean;  // 是否取消成功
  refundAmount?: string;  // 退款金额 | @example 100.00
}

export interface CouponCreateDetailResponse {
  code?: number;
  data?: CouponCreateResult;
  message?: string;
  timestamp?: string;
}

export interface CouponCreateResult {
  code?: string;  // 优惠券码 | @example SUMMER2026
  couponId?: string;  // 优惠券ID | @example cpn_abc123
  currency?: string;  // 货币 | @example CNY
  expiresAt?: string;  // 过期时间 | @example 2026-12-31T23:59:59Z
  status?: string;  // 状态 | @example active
  type?: string;  // 类型 | @example discount
  value?: string;  // 价值 | @example 10.00
}

export interface CouponListResponse {
  code?: number;
  items?: CouponResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 优惠券信息 */
export interface CouponResponse {
  code?: string;  // 码 | @example DISCOUNT20
  createdAt?: string;  // 创建 | @example 2026-01-01T00:00:00Z
  id?: string;  // ID | @example cpn_abc123
  minAmount?: string;  // 最低消费 | @example 100.00
  name?: string;  // 名称 | @example 20元优惠券
  status?: string;  // 状态 | @example unused
  type?: string;  // 类型 | @example cash
  usedAt?: string;  // 使用时间
  usedOrderId?: string;  // 订单ID
  validFrom?: string;  // 生效 | @example 2026-01-01T00:00:00Z
  validUntil?: string;  // 失效 | @example 2026-12-31T23:59:59Z
  value?: string;  // 价值 | @example 20.00
}

export interface CouponUsageListResponse {
  code?: number;
  items?: CouponUsageResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface CouponUsageResponse {
  createdAt?: string;  // @example 2026-01-15T10:00:00Z
  id?: string;  // @example cu_001
  userId?: string;  // @example user_001
  walletId?: string;  // @example wallet_001
}

/** 创建优惠券请求参数 */
export interface CreateCouponRequest {
  code: string;  // @example SUMMER2026
  currency?: string;  // @example CNY
  expiresAt?: string;  // @example 2026-12-31T23:59:59Z
  minSpend?: string;  // @example 50.00
  name?: string;  // @example 夏日优惠券
  type: string;  // @example discount
  value: string;  // @example 10.00
}

/** 创建新钱包请求参数 */
export interface CreateWalletRequest {
  currency?: string;  // 货币 | @example CNY
  userId: string;  // 用户ID | @example usr_abc123
}

export interface DataResponsedomain_WalletIntegrityResult {
  code?: number;
  data?: WalletIntegrityResult;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_ExchangeConvertResponse {
  code?: number;
  data?: ExchangeConvertResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_ExchangeRateResponse {
  code?: number;
  data?: ExchangeRateResponse;
  message?: string;
  timestamp?: string;
}

export interface DataResponsedto_WebhookPayloadResponse {
  code?: number;
  data?: WebhookPayloadResponse;
  message?: string;
  timestamp?: string;
}

export interface DepositDetailResponse {
  code?: number;
  data?: DepositResult;
  message?: string;
  timestamp?: string;
}

/** 钱包充值请求参数 */
export interface DepositRequest {
  amount: string;  // 金额 | @example 100.00
  description?: string;  // 描述 | @example 账户充值
  referenceId?: string;  // 外部参考 | @example order_123
}

export interface DepositResult {
  transaction?: TransactionResponse;  // 交易记录
  wallet?: WalletResponse;  // 钱包信息
}

export interface DisputeListItem {
  createdAt?: string;
  id?: string;
  reason?: string;
  status?: string;
  transactionId?: string;
  userId?: string;
}

export interface DisputeListResponse {
  code?: number;
  items?: DisputeListItem[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface DisputeSubmitDetailResponse {
  code?: number;
  data?: DisputeSubmitResult;
  message?: string;
  timestamp?: string;
}

export interface DisputeSubmitResult {
  disputeId?: string;  // 争议ID | @example dsp-001
  status?: string;  // 状态 | @example submitted
}

export interface ExchangeConvertRequest {
  amount: string;  // @example 100.00
  quoteId: string;  // @example qt_abc123def
  remark?: string;  // @example USD to CNY conversion
}

export interface ExchangeConvertResponse {
  fromAmount?: string;  // @example 100.00
  fromCurrency?: string;  // @example USD
  message?: string;  // @example 兑换成功
  quoteId?: string;  // @example qt_abc123def
  rate?: number;  // @example 7.24
  toAmount?: string;  // @example 724.00
  toCurrency?: string;  // @example CNY
  transactionId?: string;  // @example txn_001
}

export interface ExchangeRateResponse {
  expiresAt?: string;  // @example 2026-05-12T10:01:00Z
  fromCurrency?: string;  // @example USD
  quoteId?: string;  // @example qt_abc123def
  rate?: number;  // @example 7.24
  toCurrency?: string;  // @example CNY
}

/** 单条反欺诈规则配置 */
export interface FraudRuleItem {
  enabled?: boolean;  // 是否启用
  name?: string;  // 名称 | @example 单笔限额
  ruleId?: string;  // 规则ID | @example rule-001
  threshold?: string;  // 阈值 | @example 10000
}

export interface FraudRuleListResponse {
  code?: number;
  items?: FraudRuleResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 反欺诈规则配置 */
export interface FraudRuleResponse {
  action?: string;  // 动作 | @example block
  condition?: string;  // 条件 | @example 单笔超过5000
  id?: string;  // 规则ID | @example fraud_abc123
  name?: string;  // 名称 | @example 单笔限额
  priority?: number;  // 优先级 | @example 1
  status?: string;  // 状态 | @example enabled
  type?: string;  // 类型 | @example amount_limit
  updatedAt?: string;  // 更新时间 | @example 2026-04-15T10:00:00Z
}

export interface FreezeDetailResponse {
  code?: number;
  data?: FreezeResult;
  message?: string;
  timestamp?: string;
}

export interface FreezeRecordListResponse {
  code?: number;
  items?: FreezeRecordResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 资金冻结记录 */
export interface FreezeRecordResponse {
  amount?: string;  // 金额 | @example 100.00
  createdAt?: string;  // 创建 | @example 2026-04-10T00:00:00Z
  id?: string;  // 记录ID | @example frz_abc123
  reason?: string;  // 原因 | @example 争议冻结
  releasedAt?: string;  // 解冻 | @example 2026-04-15T00:00:00Z
  status?: string;  // 状态 | @example active
  walletId?: string;  // 钱包ID | @example wlt_abc123
}

/** 冻结资金请求参数 */
export interface FreezeRequest {
  amount: string;  // 金额 | @example 100.00
  reason?: string;  // 原因 | @example 争议冻结
}

export interface FreezeResult {
  freeze?: FreezeRecordResponse;  // 冻结记录
  wallet?: WalletResponse;  // 钱包信息
}

export interface ListResponsedto_WebhookPayloadResponse {
  code?: number;
  items?: WebhookPayloadResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface ManualAdjustResult {
  transaction?: TransactionResponse;
  wallet?: WalletResponse;
}

export interface ReconciliationDetail {
  date?: string;  // 对账日期 | @example 2026-04-14
  records?: ReconciliationRecord[];  // 各钱包对账记录
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  walletCount?: number;  // 钱包数量 | @example 100
}

export interface ReconciliationDetailResponse {
  code?: number;
  data?: ReconciliationDetail;
  message?: string;
  timestamp?: string;
}

/** 单个钱包的对账记录 */
export interface ReconciliationRecord {
  closingBalance?: string;  // 期末余额 | @example 1200.00
  openingBalance?: string;  // 期初余额 | @example 1000.00
  totalDeposit?: string;  // 累计充值 | @example 500.00
  totalRefund?: string;  // 累计退款 | @example 0.00
  totalTransferIn?: string;  // 累计转入 | @example 100.00
  totalTransferOut?: string;  // 累计转出 | @example 50.00
  totalWithdraw?: string;  // 累计提现 | @example 200.00
  transactionCount?: number;  // 交易笔数 | @example 10
  userId?: string;  // 用户ID | @example usr_abc123
  walletId?: string;  // 钱包ID | @example wlt_abc123
}

export interface RedeemCouponResponse {
  code?: number;
  data?: CouponResponse;
  message?: string;
  timestamp?: string;
}

export interface RefundDetailResponse {
  code?: number;
  data?: RefundResult;
  message?: string;
  timestamp?: string;
}

export interface RefundResult {
  transaction?: TransactionResponse;  // 退款交易记录
  wallet?: WalletResponse;  // 钱包信息
}

export interface RejectWithdrawalRequest {
  remark?: string;
}

export interface ResolveDisputeResponse {
  code?: number;
  data?: ResolveDisputeResult;
  message?: string;
  timestamp?: string;
}

export interface ResolveDisputeResult {
  disputeId?: string;  // @example dsp_01ARZ3NDEKTSV4RRFFQ69G5FAV
  status?: string;  // @example resolved
}

export interface SnapshotCreateDetailResponse {
  code?: number;
  data?: SnapshotCreateResult;
  message?: string;
  timestamp?: string;
}

export interface SnapshotCreateResult {
  snapshotCount?: number;  // 快照记录数 | @example 100
  snapshotDate?: string;  // 快照日期 | @example 2026-04-14
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  walletsTotal?: number;  // 钱包总数 | @example 100
}

/** 生成钱包余额快照的请求参数 */
export interface SnapshotRequest {
  snapshotDate: string;  // 快照日期 | @example 2026-04-14
}

export interface TenantBalanceSummaryResponse {
  activeWalletCount?: number;  // @example 38
  totalBalance?: string;  // @example 50000.00
  totalFrozenBalance?: string;  // @example 5000.00
  walletCount?: number;  // @example 42
}

/** 对钱包交易发起争议申诉的请求参数 */
export interface TransactionDisputeRequest {
  contact?: string;  // 联系方式 | @example user@example.com
  evidence?: string[];  // 证据
  reason: string;  // 原因 | @example 未授权交易
}

export interface TransactionListResponse {
  code?: number;
  items?: TransactionResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

/** 交易记录信息 */
export interface TransactionResponse {
  amount?: string;  // 金额 | @example 100.00
  balanceAfter?: string;  // 后余额 | @example 1000.00
  balanceBefore?: string;  // 前余额 | @example 900.00
  counterpartyId?: string;  // 对方 | @example usr_xyz456
  createdAt?: string;  // 创建时间 | @example 2026-04-15T10:30:00Z
  currency?: string;  // 货币 | @example CNY
  description?: string;  // 描述 | @example 账户充值
  id?: string;  // 交易ID | @example txn_abc123
  referenceId?: string;  // 参考 | @example order_123
  status?: string;  // 状态 | @example completed
  type?: string;  // 类型 | @example deposit
  walletId?: string;  // 钱包ID | @example wlt_abc123
}

export interface TransferDetailResponse {
  code?: number;
  data?: TransferResult;
  message?: string;
  timestamp?: string;
}

/** 转账请求参数 */
export interface TransferRequest {
  amount: string;  // 金额 | @example 100.00
  description?: string;  // 描述 | @example 转账给对方
  fromUserId: string;  // 转出用户 | @example usr_abc123
  toUserId: string;  // 转入用户 | @example usr_xyz456
}

export interface TransferResult {
  fromTransaction?: TransactionResponse;  // 转出交易记录
  fromWallet?: WalletResponse;  // 转出方钱包
  toTransaction?: TransactionResponse;  // 转入交易记录
  toWallet?: WalletResponse;  // 转入方钱包
}

export interface UnfreezeDetailResponse {
  code?: number;
  data?: UnfreezeResult;
  message?: string;
  timestamp?: string;
}

/** 解冻资金请求参数 */
export interface UnfreezeRequest {
  freezeId: string;  // 冻结记录ID | @example frz_abc123
}

export interface UnfreezeResult {
  freeze?: FreezeRecordResponse;  // 冻结记录
  wallet?: WalletResponse;  // 钱包信息
}

export interface UpdateCouponRequest {
  code?: string;
  expiresAt?: string;
  minSpend?: string;
  name?: string;
  type?: string;
  value?: string;
}

/** 批量更新反欺诈规则配置的请求参数 */
export interface UpdateFraudRulesRequest {
  rules: FraudRuleItem[];  // 规则列表
}

export interface UpdateWalletRequest {
  status: string;
}

export interface WalletDetailResponse {
  code?: number;
  data?: WalletResponse;
  message?: string;
  timestamp?: string;
}

export interface WalletListResponse {
  code?: number;
  items?: WalletResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface WalletPolicyResponse {
  applicationId?: string;  // @example app_example_001
  autoApproveLimit?: string;  // @example 1000.00
  dailyWithdrawLimit?: string;  // @example 5000.00
  maxBalance?: string;  // @example 100000.00
  minWithdrawAmount?: string;  // @example 10.00
  monthlyWithdrawLimit?: string;  // @example 50000.00
  supportedCurrencies?: string;  // @example CNY,USD
  tenantId?: string;  // @example tnt_example_001
  timezone?: string;  // @example Asia/Shanghai
  transferEnabled?: boolean;  // @example True
  withdrawalRequireReview?: boolean;  // @example True
}

/** 用户钱包信息 */
export interface WalletResponse {
  applicationId?: string;  // 应用ID | @example app_abc123
  balance?: string;  // 余额 | @example 1000.00
  createdAt?: string;  // 创建时间 | @example 2026-01-01T00:00:00Z
  currency?: string;  // 货币 | @example CNY
  frozenBalance?: string;  // 冻结 | @example 100.00
  status?: string;  // 状态 | @example active
  tenantId?: string;  // 租户ID | @example tnt_xyz789
  updatedAt?: string;  // 更新时间 | @example 2026-04-15T10:30:00Z
  userId?: string;  // 用户ID | @example usr_abc123
  walletId?: string;  // 钱包ID | @example wlt_abc123
}

export interface WalletSnapshotListResponse {
  code?: number;
  items?: WalletSnapshotResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface WalletSnapshotResponse {
  balance?: string;  // @example 100.0000
  snapshotAt?: string;  // @example 2026-06-04T00:00:00Z
  userId?: string;  // @example user_001
  walletId?: string;  // @example wallet_abc123
}

export interface WalletStatsDetail {
  averageTransaction?: string;  // 平均交易金额 | @example 500.00
  endDate?: string;  // 结束日期 | @example 2026-04-30
  largestTransaction?: string;  // 最大单笔交易 | @example 5000.00
  period?: string;  // 统计周期 | @example month
  startDate?: string;  // 开始日期 | @example 2026-04-01
  totalDeposits?: string;  // 总充值 | @example 10000.00
  totalTransfersIn?: string;  // 总转入 | @example 20000.00
  totalTransfersOut?: string;  // 总转出 | @example 15000.00
  totalWithdrawals?: string;  // 总提现 | @example 5000.00
  transactionCount?: number;  // 交易笔数 | @example 150
}

export interface WalletStatsDetailResponse {
  code?: number;
  data?: WalletStatsDetail;
  message?: string;
  timestamp?: string;
}

/** webhook回调记录 */
export interface WebhookPayloadResponse {
  createdAt?: string;  // 创建 | @example 2026-04-10T00:00:00Z
  eventType?: string;  // 事件类型 | @example payment.success
  gateway?: string;  // 支付网关 | @example wechat
  id?: string;  // 记录ID | @example wh_abc123
  status?: string;  // 状态 | @example processed
}

export interface WithdrawDetailResponse {
  code?: number;
  data?: WithdrawResult;
  message?: string;
  timestamp?: string;
}

/** 钱包提现请求参数 */
export interface WithdrawRequest {
  amount: string;  // 金额 | @example 50.00
  description?: string;  // 描述 | @example 余额提现
  referenceId?: string;  // 参考 | @example withdraw_123
}

export interface WithdrawResult {
  transaction?: TransactionResponse;  // 交易记录
  wallet?: WalletResponse;  // 钱包信息
}

export interface WithdrawalRequest {
  amount: string;
  remark?: string;
}

export interface WithdrawalRequestListResponse {
  code?: number;
  items?: WithdrawalRequestResponse[];  // 统一使用 items
  message?: string;
  pagination?: PageInfo;  // 分页信息（嵌套对象）
  timestamp?: string;
  total?: number;  // 总条数（平铺，便于直接读取）
}

export interface WithdrawalRequestResponse {
  amount?: string;  // @example 100.50
  id?: string;  // @example wdr_01ARZ3NDEKTSV4RRFFQ69G5FAV
  status?: string;  // @example pending
  userId?: string;  // @example usr_example_001
}
