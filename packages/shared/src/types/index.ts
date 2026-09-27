/**
 * Autional 共享 TypeScript 类型
 * 所有前端应用共用
 */

// ============ 用户 ============

export interface User {
	id: string;
	username: string;
	email: string;
	status: 'active' | 'inactive' | 'locked' | 'pending';
	createdAt?: string;
	updatedAt?: string;
	lastLoginAt?: string;
	avatarUrl?: string;
	phone?: string;
	roles?: RoleSummary[];
	department?: DepartmentSummary;
	mfaEnabled?: boolean;
	/** 后端 /auth/me 返回的扩展字段（可选，向后兼容） */
	metadata?: Record<string, unknown>;
	tenant_type?: string;
	tenant_id?: string;
}

export interface RoleSummary {
	id: string;
	name: string;
}

export interface DepartmentSummary {
	id: string;
	name: string;
}

// ============ 认证 ============

export interface LoginRequest {
	identity: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	expiresIn?: number;
	tokenType?: string;
	user: User;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

// ============ 租户 ============

export interface Tenant {
	id: string;
	name: string;
	domain?: string;
	status: 'active' | 'suspended' | 'pending';
	createdAt?: string;
}

export interface TenantMember {
	userId: string;
	username: string;
	email: string;
	role: 'owner' | 'admin' | 'member';
	status: string;
	joinedAt?: string;
}

// ============ RBAC ============

export interface Role {
	id: string;
	code: string;
	name: string;
	description: string;
}

export interface Permission {
	id: string;
	code: string;
	name: string;
	description: string;
	category: string;
}

// ============ 应用 ============

export interface Application {
	id: string;
	name: string;
	type: 'oidc' | 'saml' | 'custom';
	clientId: string;
	status: string;
	redirectUris: string[];
	createdAt?: string;
}

// ============ 审计 ============

export interface AuditLog {
	id: string;
	createdAt: string;
	actorId: string;
	actorName: string;
	action: string;
	resourceType: string;
	resourceId: string;
	description: string;
	result: 'success' | 'failure';
	ipAddress: string;
}

// ============ 会话 ============

export interface Session {
	id: string;
	userId: string;
	username: string;
	ipAddress: string;
	device: string;
	browser: string;
	location: string;
	riskScore: number;
	createdAt: string;
	lastActiveAt: string;
}

// ============ 部门 ============

export interface Department {
	id: string;
	name: string;
	parentId?: string;
	memberCount: number;
}

// ============ 列表响应 ============

export interface ListResponse<T> {
	items: T[];
	total: number;
	pagination?: {
		page: number;
		pageSize: number;
		totalPages: number;
	};
}

// ============ 分页请求 ============

export interface PageRequest {
	page?: number;
	pageSize?: number;
}

// ============ API 错误 ============

export interface ApiError {
	code: string;
	message: string;
}

// ============ 后端原始响应 ============

export interface ApiResponse<T> {
	code: number;
	message: string;
	data?: T;
	items?: T[];
	total?: number;
	pagination?: {
		page: number;
		pageSize: number;
		totalPages: number;
	};
	timestamp?: number;
}
