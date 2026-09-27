// API endpoint constants — single source of truth for all API paths
// Matches generated API (web/packages/shared/src/generated/api.ts) — derived from swagger.json
// Path format: /{service-name}/api/v1/{resource}  (BFF gateway routing)
// Do NOT modify manually — paths must match backend route registrations

// ──────────────────────────────── Identity Service ────────────────────────────────

export const IDENTITY = {
	// Auth (public)
	AUTH_LOGIN: '/identity/api/v1/auth/login',
	AUTH_LOGIN_EMAIL_CODE: '/identity/api/v1/auth/login/email-code',
	AUTH_LOGIN_PHONE_CODE: '/identity/api/v1/auth/login/phone-code',
	AUTH_REGISTER: '/identity/api/v1/auth/register',
	AUTH_REGISTER_EMAIL_CODE: '/identity/api/v1/auth/register/email-code',
	AUTH_REGISTER_PHONE_CODE: '/identity/api/v1/auth/register/phone-code',
	AUTH_REGISTER_INVITATION: '/identity/api/v1/auth/register/invitation',
	AUTH_REGISTER_OAUTH: '/identity/api/v1/auth/register/oauth',
	AUTH_REGISTER_REAPPLY: '/identity/api/v1/auth/register/reapply',
	AUTH_CHECK_EMAIL: '/identity/api/v1/auth/register/check-email',
	AUTH_CHECK_USERNAME: '/identity/api/v1/auth/register/check-username',
	AUTH_REFRESH: '/identity/api/v1/auth/refresh',

	// Auth /me (authenticated user)
	ME: '/identity/api/v1/auth/me',
	ME_DELETE: '/identity/api/v1/auth/me', // DELETE
	ME_PUT: '/identity/api/v1/auth/me', // PUT
	ME_PASSWORD: '/identity/api/v1/auth/me/password',
	ME_PASSWORD_STRENGTH: '/identity/api/v1/auth/me/password-strength',
	ME_SESSIONS: '/identity/api/v1/auth/me/sessions',
	ME_SESSIONS_DELETE_ALL: '/identity/api/v1/auth/me/sessions', // DELETE
	ME_SESSION: (id: string) => `/identity/api/v1/auth/me/sessions/${id}`,
	ME_DEVICES: '/identity/api/v1/auth/me/devices',
	ME_DEVICE: (id: string) => `/identity/api/v1/auth/me/devices/${id}`,
	ME_DEVICE_TRUST: (id: string) => `/identity/api/v1/auth/me/devices/${id}/trust`,
	ME_AUDIT: '/identity/api/v1/auth/me/audit-logs',
	ME_TENANTS: '/identity/api/v1/auth/me/tenants',
	ME_PERMISSIONS: '/identity/api/v1/auth/me/permissions',
	ME_SWITCH_TENANT: '/identity/api/v1/auth/me/switch-tenant',
	ME_ROLE_ACTIVATIONS: '/identity/api/v1/auth/me/role-activations',
	ME_MEMBERSHIPS: '/identity/api/v1/auth/me/memberships',
	ME_CONSENT: '/identity/api/v1/auth/me/consent',
	ME_CONSENT_HISTORY: '/identity/api/v1/auth/me/consent-history',
	ME_CHILDREN_CONSENT: '/identity/api/v1/auth/me/children-consent',
	ME_DELETE_ACCOUNT: '/identity/api/v1/auth/me/delete-account',
	ME_EXPORT_DATA: '/identity/api/v1/auth/me/export-data',
	ME_EMAIL_CHANGE: '/identity/api/v1/auth/me/email/change',
	ME_EMAIL_VERIFY: '/identity/api/v1/auth/me/email/verify',
	ME_EMAIL_CHANGE_CANCEL: '/identity/api/v1/auth/me/email/change/cancel',
	ME_REAUTHENTICATE: '/identity/api/v1/auth/me/reauthenticate',
	ME_EMAIL_VERIFICATION_STATUS: '/identity/api/v1/auth/me/email-verification-status',
	ME_PHONE_CHANGE: '/identity/api/v1/auth/me/phone/change',
	ME_PHONE_VERIFY: '/identity/api/v1/auth/me/phone/verify',
	ME_PHONE_CHANGE_CANCEL: '/identity/api/v1/auth/me/phone/change/cancel',
	ME_PHONE_VERIFICATION_STATUS: '/identity/api/v1/auth/me/phone-verification-status',
	ME_RECOVERY_CONTACTS: '/identity/api/v1/auth/me/recovery-contacts',
	ME_RECOVERY_CONTACT: (id: string) => `/identity/api/v1/auth/me/recovery-contacts/${id}`,
	ME_SECURITY_EVENTS: '/identity/api/v1/auth/me/security-events',
	ME_SECURITY_EVENT_DISMISS: (id: string) =>
		`/identity/api/v1/auth/me/security-events/${id}/dismiss`,
	ME_SAML_LINKS: '/identity/api/v1/auth/me/saml-links',
	ME_SAML_LINK: (id: string) => `/identity/api/v1/auth/me/saml-links/${id}`,
	ME_WEBAUTHN_CREDENTIALS: '/identity/api/v1/auth/me/webauthn-credentials',
	ME_WEBAUTHN_CREDENTIAL: (id: string) => `/identity/api/v1/auth/me/webauthn-credentials/${id}`,
	ME_AUTHENTICATOR_DEVICES: '/identity/api/v1/auth/me/authenticator/devices',
	ME_AUTHENTICATOR_DEVICE: (id: string) => `/identity/api/v1/auth/me/authenticator/devices/${id}`,
	ME_AUTHENTICATOR_BACKUP: '/identity/api/v1/auth/me/authenticator/backup',
	ME_AUTHENTICATOR_BACKUP_ID: (id: string) => `/identity/api/v1/auth/me/authenticator/backup/${id}`,
	ME_STOP_IMPERSONATION: '/identity/api/v1/auth/me/stop-impersonation',

	// Admin
	ADMIN_AGENTS: '/identity/api/v1/admin/agents',
	ADMIN_AGENT: (id: string) => `/identity/api/v1/admin/agents/${id}`,
	ADMIN_AGENTS_CREDENTIALS: (id: string) => `/identity/api/v1/admin/agents/${id}/credentials`,
	ADMIN_AGENTS_ACTIVITY: (id: string) => `/identity/api/v1/admin/agents/${id}/activity`,
	ADMIN_AGENTS_PERMISSIONS: (id: string) => `/identity/api/v1/admin/agents/${id}/permissions`,
	ADMIN_ROBOTS: '/identity/api/v1/admin/robots',
	ADMIN_ROBOT: (id: string) => `/identity/api/v1/admin/robots/${id}`,
	ADMIN_DEVICES: '/identity/api/v1/admin/iots',
	ADMIN_DEVICE: (id: string) => `/identity/api/v1/admin/iots/${id}`,
	ADMIN_USERS: '/identity/api/v1/admin/users',
	ADMIN_USER: (id: string) => `/identity/api/v1/admin/users/${id}`,
	ADMIN_CONSENTS: '/identity/api/v1/admin/consents',
	ADMIN_ROLES: '/identity/api/v1/admin/roles',
	ADMIN_ROLE: (id: string) => `/identity/api/v1/admin/roles/${id}`,
	ADMIN_PERMISSIONS: '/identity/api/v1/admin/permissions',
	ADMIN_SESSIONS: '/identity/api/v1/admin/sessions',
	ADMIN_POLICIES_NHI: '/identity/api/v1/admin/policies/nhi',
	ADMIN_SECURITY_AUTH_CONFIG: '/identity/api/v1/admin/security/auth-config',
	ADMIN_MEMBERS_PENDING: '/identity/api/v1/admin/members/pending',
	ADMIN_MEMBER_APPROVE: (id: string) => `/identity/api/v1/admin/members/${id}/approve`,
	ADMIN_MEMBER_REJECT: (id: string) => `/identity/api/v1/admin/members/${id}/reject`,
	ADMIN_MEMBERS_BATCH_APPROVE: '/identity/api/v1/admin/members/batch-approve',
	ADMIN_USER_PASSWORD_STATUS: (userId: string) =>
		`/identity/api/v1/admin/users/${userId}/password-status`,
	ADMIN_ABAC_POLICIES: '/identity/api/v1/admin/abac-policies',
	ADMIN_ABAC_POLICY: (id: string) => `/identity/api/v1/admin/abac-policies/${id}`,
	ADMIN_ROLE_ACTIVATIONS: '/identity/api/v1/admin/role-activations',
	ADMIN_ROLE_ACTIVATION_APPROVE: (id: string) =>
		`/identity/api/v1/admin/role-activations/${id}/approve`,
	ADMIN_ROLE_ACTIVATION_REVOKE: (id: string) =>
		`/identity/api/v1/admin/role-activations/${id}/revoke`,
	ADMIN_IOT: (id: string) => `/identity/api/v1/admin/iots/${id}`,
	ADMIN_ROBOT_COMMISSION: (id: string) => `/identity/api/v1/admin/robots/${id}/commission`,
	ADMIN_ROBOT_DECOMMISSION: (id: string) => `/identity/api/v1/admin/robots/${id}/decommission`,
	ADMIN_ROBOT_INTENT: (id: string) => `/identity/api/v1/admin/robots/${id}/intent`,
} as const;

// ──────────────────────────────── MFA Service ─────────────────────────────────────

export const MFA = {
	STATUS: (userId: string) => `/mfa/api/v1/mfa/status/${userId}`,
	TOTP_ENABLE: '/mfa/api/v1/mfa/totp/enable',
	TOTP_VERIFY: '/mfa/api/v1/mfa/totp/verify',
	TOTP_DISABLE: '/mfa/api/v1/mfa/totp/disable',
	TOTP_SETUP: '/mfa/api/v1/mfa/totp/setup',
	TOTP_VALIDATE: '/mfa/api/v1/mfa/totp/validate',
	TOTP_DEVICES: '/mfa/api/v1/mfa/totp/devices',
	TOTP_DEVICE: (id: string) => `/mfa/api/v1/mfa/totp/devices/${id}`,
	TOTP_DEVICE_ENABLE: (id: string) => `/mfa/api/v1/mfa/totp/devices/${id}/enable`,
	TOTP_DEVICE_DISABLE: (id: string) => `/mfa/api/v1/mfa/totp/devices/${id}/disable`,
	BACKUP_CODES_GENERATE: '/mfa/api/v1/mfa/backup-codes/generate',
	BACKUP_CODES_VERIFY: '/mfa/api/v1/mfa/backup-codes/verify',
	BACKUP_CODES: '/mfa/api/v1/mfa/backup-codes',
	BACKUP_CODES_COUNT: '/mfa/api/v1/mfa/backup-codes/count',
	METHODS: '/mfa/api/v1/mfa/methods',
	METHOD_DELETE: (methodType: string) => `/mfa/api/v1/mfa/methods/${methodType}`,
	CHALLENGE: '/mfa/api/v1/mfa/challenge',
	STEP_UP: '/mfa/api/v1/mfa/step-up',
	CREDENTIAL_PRIMARY: (id: string) => `/mfa/api/v1/mfa/credentials/${id}/primary`,
	PUSH_CHALLENGE: '/mfa/api/v1/mfa/push/challenge',
	PUSH_APPROVE: '/mfa/api/v1/mfa/push/approve',
	PUSH_DENY: '/mfa/api/v1/mfa/push/deny',
	PUSH_SUBSCRIPTIONS: '/mfa/api/v1/mfa/push/subscriptions',
	PUSH_HISTORY: '/mfa/api/v1/mfa/push/history',
	EMAIL_SEND: '/mfa/api/v1/mfa/email/send',
	EMAIL_VERIFY: '/mfa/api/v1/mfa/email/verify',
	EMAIL_ENROLL: '/mfa/api/v1/mfa/email/enroll',
	EMAIL_DISABLE: '/mfa/api/v1/mfa/email/disable',
	SMS_SEND: '/mfa/api/v1/mfa/sms/send',
	SMS_VERIFY: '/mfa/api/v1/mfa/sms/verify',
	SMS_ENROLL: '/mfa/api/v1/mfa/sms/enroll',
	SMS_DISABLE: '/mfa/api/v1/mfa/sms/disable',
	WEBAUTHN_CREDENTIALS: '/mfa/api/v1/mfa/webauthn/credentials',
	WEBAUTHN_CREDENTIAL: (id: string) => `/mfa/api/v1/mfa/webauthn/credentials/${id}`,
	TRUSTED_DEVICES: '/mfa/api/v1/mfa/trusted-devices',
	TRUSTED_DEVICE: (id: string) => `/mfa/api/v1/mfa/trusted-devices/${id}`,
	DEVICES_SYNC: '/mfa/api/v1/mfa/devices/sync',
	// Admin
	ADMIN_IP_WHITELIST: '/mfa/api/v1/admin/mfa/ip-whitelist',
	ADMIN_RISK_POLICIES: '/mfa/api/v1/admin/mfa/risk-policies',
	ADMIN_PUSH_CHALLENGES: '/mfa/api/v1/admin/mfa/push/challenges',
	ADMIN_PUSH_STATS: '/mfa/api/v1/admin/mfa/push/stats',
	ADMIN_RESET: (userId: string) => `/mfa/api/v1/admin/mfa/reset/${userId}`,
} as const;

// ──────────────────────────────── OAuth Service ───────────────────────────────────

export const OAUTH = {
	CLIENTS: '/oauth/api/v1/admin/oauth/clients',
	CLIENT: (id: string) => `/oauth/api/v1/admin/oauth/clients/${id}`,
	CLIENT_SECRETS: (id: string) => `/oauth/api/v1/admin/oauth/clients/${id}/secrets`,
	TOKEN: '/oauth/api/v1/oauth/token',
	REFRESH: '/oauth/api/v1/oauth/refresh',
} as const;

// ──────────────────────────────── Tenant Service ──────────────────────────────────

export const TENANT = {
	ADMIN_TENANTS: '/tenant/api/v1/admin/tenants',
	ADMIN_TENANT: (id: string) => `/tenant/api/v1/admin/tenants/${id}`,
	ADMIN_APPLICATIONS: (tid: string) => `/tenant/api/v1/admin/tenants/${tid}/applications`,
	ADMIN_APPLICATION: (tid: string, aid: string) =>
		`/tenant/api/v1/admin/tenants/${tid}/applications/${aid}`,
	ADMIN_MEMBERS: (tid: string) => `/tenant/api/v1/admin/tenants/${tid}/members`,
	ADMIN_INVITATIONS: (tid: string) => `/tenant/api/v1/admin/tenants/${tid}/members/invite`,
	ADMIN_WEBHOOKS: (tid: string) => `/tenant/api/v1/admin/tenants/${tid}/webhooks`,
	ADMIN_WEBHOOK: (tid: string, hid: string) =>
		`/tenant/api/v1/admin/tenants/${tid}/webhooks/${hid}`,
	ADMIN_INVITATION_CONFIG: (id: string) => `/tenant/api/v1/admin/tenants/${id}/invitation-config`,
	MINORS_PROTECTION: (tid: string) => `/tenant/api/v1/admin/tenants/${tid}/minors-protection`,
	SOD_CONFIG: (tid: string) => `/tenant/api/v1/admin/tenants/${tid}/sod-config`,
} as const;

// ──────────────────────────────── Billing Service ─────────────────────────────────

export const BILLING = {
	ADMIN_PLANS: '/billing/api/v1/admin/billing/plans',
	ADMIN_PLAN: (id: string) => `/billing/api/v1/admin/billing/plans/${id}`,
	ADMIN_PLAN_FEATURE_GATES: (id: string) =>
		`/billing/api/v1/admin/billing/plans/${id}/feature-gates`,
	ADMIN_FEATURE_GATES: '/billing/api/v1/admin/billing/feature-gates',
	ADMIN_FEATURE_GATE_OVERRIDES: '/billing/api/v1/admin/billing/feature-gates/overrides',
	ADMIN_SUBSCRIPTION_APPS: (tid: string) =>
		`/billing/api/v1/admin/billing/subscription/apps/${tid}`,
	ADMIN_RECORDS: '/billing/api/v1/admin/billing/records',
	ADMIN_RECORD: (id: string) => `/billing/api/v1/admin/billing/records/${id}`,
	ADMIN_PAYMENT_GATEWAYS: '/billing/api/v1/admin/billing/payment-gateways',
	ADMIN_PAYMENT_GATEWAY: (id: string) => `/billing/api/v1/admin/billing/payment-gateways/${id}`,
	ADMIN_REFUND_APPROVALS: '/billing/api/v1/admin/billing/refund-approval',
	ADMIN_REFUND_APPROVAL: (id: string) => `/billing/api/v1/admin/billing/refund-approval/${id}`,
	ADMIN_CREDIT_NOTE: (number: string) => `/billing/api/v1/admin/billing/credit-note/${number}`,
	ADMIN_INVOICE_CREDIT_NOTE: (invoiceNumber: string) =>
		`/billing/api/v1/admin/billing/invoice/${invoiceNumber}/credit-note`,
	ADMIN_DUNNING_SETTINGS: (tid: string) => `/billing/api/v1/admin/billing/dunning-settings/${tid}`,
	ADMIN_METERED_USAGE: (tid: string) => `/billing/api/v1/admin/billing/metered-usage/${tid}`,
	ADMIN_REVENUE_AMORTIZATION: '/billing/api/v1/admin/billing/revenue-amortization',
	ADMIN_TAX_EXPORT: '/billing/api/v1/admin/billing/tax-export',
	ADMIN_ALERTS: '/billing/api/v1/admin/billing/alerts',
	// User
	SUBSCRIPTION: (tid: string) => `/billing/api/v1/billing/subscription/${tid}`,
	RECORDS: (tid: string) => `/billing/api/v1/billing/records/${tid}`,
	USAGE_CURRENT: (tid: string) => `/billing/api/v1/billing/usage/${tid}/current`,
	USAGE_TIMELINE: (tid: string) => `/billing/api/v1/billing/usage/${tid}/timeline`,
	USAGE_ENDPOINTS: (tid: string) => `/billing/api/v1/billing/usage/${tid}/endpoints`,
} as const;

// ──────────────────────────────── Audit Service ───────────────────────────────────

export const AUDIT = {
	ADMIN_LOGS: '/audit/api/v1/admin/audit/logs',
	ADMIN_LOG: (id: string) => `/audit/api/v1/admin/audit/logs/${id}`,
	ADMIN_ALERTS: '/audit/api/v1/admin/audit/alerts',
	ADMIN_ALERT: (id: string) => `/audit/api/v1/admin/audit/alerts/${id}`,
	ADMIN_ANOMALIES: '/audit/api/v1/admin/audit/anomalies',
	ADMIN_ANOMALY: (id: string) => `/audit/api/v1/admin/audit/anomalies/${id}`,
	ADMIN_SIEM_CONNECTORS: '/audit/api/v1/admin/audit/siem/connectors',
	ADMIN_SIEM_CONNECTOR: (id: string) => `/audit/api/v1/admin/audit/siem/connectors/${id}`,
	ADMIN_RETENTION: '/audit/api/v1/admin/audit/retention-policy',
	ADMIN_ARCHIVE: '/audit/api/v1/admin/audit/archive',
	ADMIN_ARCHIVE_STATUS: '/audit/api/v1/admin/audit/archive/status',
	ADMIN_EXPORT: '/audit/api/v1/admin/audit/export',
	ADMIN_EXPORT_JOBS: '/audit/api/v1/admin/audit/export/jobs',
	ADMIN_EXPORT_DOWNLOAD: (jobId: string) => `/audit/api/v1/admin/audit/export/${jobId}/download`,
	ADMIN_STATS: '/audit/api/v1/admin/audit/stats',
	ADMIN_SERVER_LOGS: '/audit/api/v1/admin/audit/server-logs',
	ADMIN_SERVER_LOG_SERVICES: '/audit/api/v1/admin/audit/server-logs/services',
	ADMIN_TENANT_CONFIG: '/audit/api/v1/admin/audit/tenant-config',
	ADMIN_INCIDENTS: '/audit/api/v1/admin/audit/incidents',
	ADMIN_STREAM: '/audit/api/v1/admin/audit/stream',
	ADMIN_HASHCHAIN: (tid: string) => `/audit/api/v1/admin/audit/hashchain/${tid}`,
	ADMIN_MERKLE_PROOF: '/audit/api/v1/admin/audit/merkle-proof',
	ADMIN_VERIFICATIONS: '/audit/api/v1/admin/audit/verifications',
	// Reports
	ADMIN_REPORT_SECURITY: '/audit/api/v1/admin/audit/reports/security',
	ADMIN_REPORT_COMPLIANCE: '/audit/api/v1/admin/audit/reports/compliance',
	// Compliance sub-resources
	ADMIN_COMPLIANCE_PIAS: '/audit/api/v1/admin/audit/compliance/pias',
	ADMIN_COMPLIANCE_BREACHES: '/audit/api/v1/admin/audit/compliance/breaches',
	ADMIN_COMPLIANCE_DATA_CLASS: '/audit/api/v1/admin/audit/compliance/data-classifications',
	ADMIN_COMPLIANCE_CROSS_BORDER: '/audit/api/v1/admin/audit/compliance/cross-border-transfers',
	ADMIN_COMPLIANCE_AI_DECISIONS: '/audit/api/v1/admin/audit/compliance/ai-decisions',
	ADMIN_COMPLIANCE_CLEANUP: '/audit/api/v1/admin/audit/compliance/cleanup-records',
	ADMIN_COMPLIANCE_SOD_RULES: '/audit/api/v1/admin/audit/compliance/sod-rules',
	ADMIN_COMPLIANCE_ROLE_ACTIONS: '/audit/api/v1/admin/audit/compliance/role-action-mappings',
	ADMIN_BILLING_EVENTS: '/audit/api/v1/admin/audit/billing-events',
	ADMIN_PAYMENT_EVENTS: '/audit/api/v1/admin/audit/payment-events',
	ADMIN_WALLET_EVENTS: '/audit/api/v1/admin/audit/wallet-events',
	// Public
	PUBLIC_HASHCHAIN: '/audit/api/v1/audit/public/hashchain',
	PUBLIC_LOGS_SUMMARY: '/audit/api/v1/audit/public/logs-summary',
	PUBLIC_STATS: '/audit/api/v1/audit/public/stats',
} as const;

// ──────────────────────────────── Profile Service ─────────────────────────────────

export const PROFILE = {
	PROFILE: (uid: string) => `/profile/api/v1/profiles/${uid}`,
	AVATAR_UPLOAD: (uid: string) => `/profile/api/v1/profiles/${uid}/avatar/upload`,
	ADMIN_APPROVAL_REQUESTS: '/profile/api/v1/admin/profiles/approval-requests',
	ADMIN_APPROVAL_APPROVE: (id: string) =>
		`/profile/api/v1/admin/profiles/approval-requests/${id}/approve`,
	ADMIN_APPROVAL_REJECT: (id: string) =>
		`/profile/api/v1/admin/profiles/approval-requests/${id}/reject`,
	ADMIN_POLICY: '/profile/api/v1/admin/profiles/policy',
	ADMIN_FIELD_SCHEMAS: '/profile/api/v1/admin/profiles/field-schemas',
	ADMIN_FIELD_SCHEMA: (fieldKey: string) =>
		`/profile/api/v1/admin/profiles/field-schemas/${fieldKey}`,
	ADMIN_WEBHOOK: '/profile/api/v1/admin/profiles/webhook',
	PROFILE_VERSIONS: (userId: string) => `/profile/api/v1/admin/profiles/${userId}/versions`,
} as const;

// ──────────────────────────────── Notification Service ────────────────────────────

export const NOTIFICATION = {
	NOTIFICATIONS: '/notifications/api/v1/notifications',
	UNREAD: '/notifications/api/v1/notifications/unread',
	UNREAD_COUNT: '/notifications/api/v1/notifications/unread-count',
	READ_ALL: '/notifications/api/v1/notifications/read-all',
	READ_REPORT: '/notifications/api/v1/notifications/read-report',
	STATS: '/notifications/api/v1/notifications/stats',
	STREAM: '/notifications/api/v1/notifications/stream',
	TREND: '/notifications/api/v1/notifications/trend',
	TEMPLATES: '/notifications/api/v1/notifications/templates',
	TEMPLATE: (id: string) => `/notifications/api/v1/notifications/templates/${id}`,
	TEMPLATES_AVAILABLE: '/notifications/api/v1/notifications/templates/available',
	PREFERENCES: (uid: string) => `/notifications/api/v1/notifications/preferences/${uid}`,
	EVENT_MAPPINGS: '/notifications/api/v1/notifications/event-mappings',
	GLOBAL_VARIABLES: '/notifications/api/v1/notifications/global-variables',
	SEND: '/notifications/api/v1/notifications/send',
	SEND_BATCH: '/notifications/api/v1/notifications/send-batch',
	SEND_FROM_TEMPLATE: '/notifications/api/v1/notifications/send-from-template',
	TEST: '/notifications/api/v1/notifications/test',
	ANNOUNCEMENTS: '/notifications/api/v1/announcements',
	// Admin
	ADMIN_TEMPLATES: '/notifications/api/v1/admin/notifications/templates',
	ADMIN_TEMPLATE: (id: string) => `/notifications/api/v1/admin/notifications/templates/${id}`,
	ADMIN_TEMPLATE_CLONE_LOCALE: (id: string) =>
		`/notifications/api/v1/admin/notifications/templates/${id}/clone-to-locale`,
	ADMIN_ANNOUNCEMENTS: '/notifications/api/v1/admin/announcements',
	ADMIN_ANNOUNCEMENT: (id: string) => `/notifications/api/v1/admin/announcements/${id}`,
	ADMIN_ANNOUNCEMENT_PUBLISH: (id: string) =>
		`/notifications/api/v1/admin/announcements/${id}/publish`,
	ADMIN_ANNOUNCEMENT_UNPUBLISH: (id: string) =>
		`/notifications/api/v1/admin/announcements/${id}/unpublish`,
	ADMIN_BROADCAST: '/notifications/api/v1/admin/notifications/broadcast',
	ADMIN_EVENT_MAPPINGS: '/notifications/api/v1/admin/notifications/event-mappings',
	ADMIN_GLOBAL_VARIABLES: '/notifications/api/v1/admin/notifications/global-variables',
	ADMIN_PLATFORM_STATS: '/notifications/api/v1/admin/notifications/platform-stats',
} as const;

// ──────────────────────────────── Secret Service ──────────────────────────────────

export const SECRET = {
	ADMIN_SECRETS: '/secret/api/v1/admin/secrets',
	ADMIN_POLICY: '/secret/api/v1/admin/secrets/policy',
	ADMIN_ENCRYPTION_KEYS: '/secret/api/v1/admin/secrets/encryption-keys',
	ADMIN_JWT_KEYS: '/secret/api/v1/admin/secrets/jwt/keys',
	ADMIN_BATCH_REVOKE: '/secret/api/v1/admin/secrets/batch-revoke',
	ADMIN_BATCH_DELETE: '/secret/api/v1/admin/secrets/batch-delete',
	ADMIN_SECRET_BY_KEY: (key: string) => `/secret/api/v1/admin/secrets/${key}`,
} as const;

// ──────────────────────────────── Compliance Service ──────────────────────────────

export const COMPLIANCE = {
	ADMIN_COMPLIANCE: '/compliance/api/v1/admin/compliance',
	ADMIN_POLICY: '/compliance/api/v1/admin/compliance/policy',
	ADMIN_MINORS: '/compliance/api/v1/admin/compliance/minors',
	ADMIN_STANDARDS: '/compliance/api/v1/admin/compliance/standards',
	ADMIN_TENANT_SELF_SCORE: '/compliance/api/v1/admin/compliance/tenants/self/score',
	ADMIN_TENANT_SELF_POLICY: '/compliance/api/v1/admin/compliance/tenants/self/policy',
	ADMIN_TENANT_SELF_OVERRIDES: '/compliance/api/v1/admin/compliance/tenants/self/overrides',
	ADMIN_TENANT_SELF_STANDARDS: '/compliance/api/v1/admin/compliance/tenants/self/standards',
	ADMIN_TENANT_SELF_GAP_ANALYSIS: '/compliance/api/v1/admin/compliance/tenants/self/gap-analysis',
	ADMIN_TENANT_SELF_READINESS: (stdId: string) =>
		`/compliance/api/v1/admin/compliance/tenants/self/readiness/${stdId}`,
	ADMIN_TENANT_SELF_OVERRIDE: (param: string) =>
		`/compliance/api/v1/admin/compliance/tenants/self/overrides/${param}`,
	ADMIN_BREACH_NOTIFICATIONS: '/compliance/api/v1/admin/compliance/breach-notifications',
	ADMIN_LEGAL_DOCUMENTS: '/compliance/api/v1/admin/compliance/legal-documents',
	ADMIN_LEGAL_DOCUMENT: (id: string) => `/compliance/api/v1/admin/compliance/legal-documents/${id}`,
	ADMIN_LEGAL_DOCUMENT_PUBLISH: (id: string) =>
		`/compliance/api/v1/admin/compliance/legal-documents/${id}/publish`,
	ADMIN_LEGAL_DOCUMENT_ARCHIVE: (id: string) =>
		`/compliance/api/v1/admin/compliance/legal-documents/${id}/archive`,
} as const;

// ──────────────────────────────── Wallet Service ──────────────────────────────────

export const WALLET = {
	ADMIN_WALLETS: '/wallet/api/v1/admin/wallets',
	ADMIN_TRANSACTIONS: '/wallet/api/v1/admin/wallets/tenant/default/transactions',
	ADMIN_COUPONS: '/wallet/api/v1/admin/wallets/coupons',
	ADMIN_FRAUD_RULES: '/wallet/api/v1/admin/wallets/fraud-rules',
	ADMIN_BATCH_FREEZE: '/wallet/api/v1/admin/wallets/batch-freeze',
	ADMIN_BATCH_UNFREEZE: '/wallet/api/v1/admin/wallets/batch-unfreeze',
	ADMIN_WALLET_INTEGRITY: (walletId: string) =>
		`/wallet/api/v1/admin/wallets/${walletId}/integrity`,
} as const;

// ──────────────────────────────── Point Service ───────────────────────────────────

export const POINT = {
	ADMIN_CONFIG: '/point/api/v1/admin/points/config',
} as const;

// ──────────────────────────────── Storage Service ─────────────────────────────────

export const STORAGE = {
	ADMIN_FILES: '/storage/api/v1/admin/storage/files',
	ADMIN_STATS: '/storage/api/v1/admin/storage/stats',
	FILE_DOWNLOAD: (id: string) => `/storage/api/v1/storage/files/${id}/download`,
} as const;

// ──────────────────────────────── Communication Service ───────────────────────────

export const COMMUNICATION = {
	ADMIN_PROVIDERS: '/communication/api/v1/admin/communication/providers',
} as const;

// ──────────────────────────────── Status Service ─────────────────────────────────

export const STATUS = {
	INCIDENT: (id: string) => `/status/api/v1/status/incidents/${id}`,
	MAINTENANCE: (id: string) => `/status/api/v1/status/maintenances/${id}`,
	SUBSCRIBERS: '/status/api/v1/status/subscriptions',
} as const;

// ──────────────────────────────── RBAC Service ────────────────────────────────────

export const RBAC = {
	ADMIN_APPROVAL_REQUESTS: '/rbac/api/v1/admin/approval-requests',
	ADMIN_APPROVAL_REQUESTS_APPROVE: (requestId: string) =>
		`/rbac/api/v1/admin/approval-requests/${requestId}/approve`,
	ADMIN_APPROVAL_REQUESTS_REJECT: (requestId: string) =>
		`/rbac/api/v1/admin/approval-requests/${requestId}/reject`,
	ADMIN_ROLE_APPROVAL_REQUESTS: (roleId: string) =>
		`/rbac/api/v1/admin/roles/${roleId}/approval-requests`,
} as const;

// ──────────────────────────────── Verification Service ────────────────────────────

export const VERIFICATION = {
	ADMIN_VERIFICATION: (id: string) => `/verification/api/v1/admin/verifications/${id}`,
	ADMIN_VERIFICATION_OVERRIDE: (id: string) =>
		`/verification/api/v1/admin/verifications/${id}/override`,
	ADMIN_VERIFICATION_RESET_RETRY: (id: string) =>
		`/verification/api/v1/admin/verifications/${id}/reset`,
} as const;

// ──────────────────────────────── Session Service ─────────────────────────────────

export const SESSION = {
	ADMIN_SESSIONS: '/session/api/v1/admin/sessions',
} as const;

// ──────────────────────────────── Aggregated ──────────────────────────────────────

export const API = {
	IDENTITY,
	MFA,
	OAUTH,
	TENANT,
	BILLING,
	AUDIT,
	PROFILE,
	NOTIFICATION,
	SECRET,
	COMPLIANCE,
	WALLET,
	POINT,
	STORAGE,
	COMMUNICATION,
	STATUS,
	RBAC,
	SESSION,
	VERIFICATION,
} as const;

export type ApiPaths = typeof API;
