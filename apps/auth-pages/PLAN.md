# Auth Pages 详细功能规划

> Autional `apps/auth-pages` 模块 — 认证/注册/找回密码全流程页面规划
>
> 版本: v1.0 | 日期: 2026-05-07 | 状态: 规划中
> 对标产品: Auth0 Universal Login / Keycloak Login Theme / AWS Cognito Hosted UI

---

## 1. 产品定位与架构角色

Auth Pages 是 Autional 五大 UI 产品之一，属于**流程轻量型**（单焦点、低信息密度）：

| 维度 | 定位 |
|------|------|
| **目标用户** | P4 最终用户（登录场景的所有终端用户） |
| **交付形态** | 托管页面 (Hosted SPA) + 未来可嵌入 SDK |
| **域名方案** | `login.{tenant-domain}.iam.tianv.com`（多租户独立域名） |
| **架构层** | Layer 4 之上，直接调用 Gateway Service (port 11080) |
| **风格特征** | 无导航、居中小卡片、Mobile-first、品牌可定制 |

### 1.1 与现有代码的衔接

当前 `apps/auth-pages` 已实现 3 个基础页面：
- `/` — 登录页
- `/register` — 注册页
- `/forgot-password` — 忘记密码页

**技术栈已确定**：Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS + `@autional-cn/ui` + React Hook Form + Zod + Zustand + TanStack Query + Axios

---

## 2. 页面清单

| 优先级 | 页面路由 | 页面名称 | 功能描述 | 对应后端 API |
|--------|----------|----------|----------|-------------|
| **P0** | `/` | 登录页 | 用户名+密码 / 社交登录 / 企业 SSO / Passkey | `POST /auth/login` |
| **P0** | `/register` | 注册页 | 邮箱/手机注册、用户名实时检查、密码强度 | `POST /auth/register` |
| **P0** | `/forgot-password` | 忘记密码 | 邮箱验证 → 发送重置链接 | `POST /auth/forgot-password` |
| **P0** | `/reset-password` | 重置密码 | 通过 Token 验证后设置新密码 | `POST /auth/reset-password` |
| **P0** | `/verify-email` | 邮箱验证 | 验证邮件链接落地页 | `POST /auth/verify-email` |
| **P0** | `/verify-phone` | 手机验证 | 输入短信验证码完成验证 | `POST /auth/verify-phone` |
| **P1** | `/mfa-challenge` | MFA 验证页 | TOTP / SMS / Email / Passkey 挑战 | `POST /mfa/totp/validate` / `/mfa/sms/verify` / `/mfa/email/verify` |
| **P1** | `/mfa-setup` | MFA 设置引导 | 首次登录强制引导设置 MFA | `POST /auth/mfa/setup` |
| **P1** | `/oauth/authorize` | OAuth 授权页 | 第三方应用请求权限 → 用户同意/拒绝 | `GET/POST /oauth/authorize` |
| **P1** | `/oauth/callback` | OAuth 回调 | 第三方 IdP 回调处理（中转页） | `GET /oauth/{provider}/callback` |
| **P2** | `/sso/initiate` | SSO 发起页 | 企业 SSO 入口（SP-initiated） | `POST /auth/sso/initiate` |
| **P2** | `/passkey` | Passkey 登录/注册 | WebAuthn 注册/认证流程 | `POST /auth/webauthn/login/begin` / `POST /auth/webauthn/register/begin` |
| **P2** | `/error` | 错误页 | 通用错误、Session 过期、权限不足、IP 受限 | — |
| **P2** | `/account-deletion` | 账号删除确认 | GDPR Right to Erasure 确认页 | `POST /auth/me/delete-account` |

### 2.1 页面优先级说明

- **P0（4~6 周内完成）**：形成基础认证闭环。用户能注册 → 验证邮箱 → 登录 → 忘记密码重置。
- **P1（2~4 周）**：补充 MFA 和 OAuth 流程，覆盖企业级登录场景。
- **P2（按需排期）**：SSO、Passkey、错误页、账号删除等高级/边缘场景。

---

## 3. 各页面详细功能点

### 3.1 登录页 (`/`)

**布局**：居中卡片布局 (`max-w-sm`)，顶部可展示租户 Logo

**字段与校验**：

| 字段 | 类型 | 校验规则 | 说明 |
|------|------|----------|------|
| 用户名 | text | `required`, `min(3)`, `max(32)` | 支持用户名/邮箱/手机号（由后端判定） |
| 密码 | password | `required`, `min(1)` | 密码输入框带显示/隐藏切换 |
| 记住我 | checkbox | optional | 控制 Token 持久化策略 |

**交互逻辑**：
1. 用户输入 → 前端 Zod 实时校验（blur 触发）
2. 点击登录 → Loading 状态 → `POST /auth/login`
3. 登录成功 → 存储 Token + User → 根据返回上下文决定跳转：
   - 若用户未验证邮箱 → 跳转 `/verify-email`
   - 若租户强制 MFA 但未设置 → 跳转 `/mfa-setup`
   - 若需 MFA 验证 → 跳转 `/mfa-challenge`
   - 正常 → 跳转 `redirect_uri`（或默认 dashboard）
4. 登录失败 → 展示后端返回的错误消息（code → i18n 映射）
5. 社交登录按钮区：根据 `GET /auth/oauth/providers` 动态渲染
6. 企业 SSO 入口：若租户配置了 SSO，展示"企业登录"按钮

**底部链接**：忘记密码 → `/forgot-password` | 注册账号 → `/register`

**调用 API**：
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/oauth/providers`（获取可用社交登录列表）
- `GET /api/v1/tenants/{id}/branding`（获取租户品牌配置）

---

### 3.2 注册页 (`/register`)

**布局**：居中卡片布局

**字段与校验**：

| 字段 | 类型 | 校验规则 | 说明 |
|------|------|----------|------|
| 用户名 | text | `required`, `min(3)`, `max(32)`, 正则 `[a-zA-Z0-9_]+` | 实时检查唯一性 |
| 邮箱 | email | `required`, `email` 格式 | 实时检查唯一性 |
| 密码 | password | `required`, `min(8)` | 密码强度实时提示（调用密码策略） |
| 确认密码 | password | `required`, 必须与密码一致 | — |
| 同意条款 | checkbox | `required` | 链接到隐私政策和服务条款 |

**交互逻辑**：
1. 用户名输入后 debounce(500ms) → `GET /auth/register/check-username`
2. 邮箱输入后 debounce(500ms) → `GET /auth/register/check-email`
3. 密码输入实时评估强度 → 调用 `GET /security/password-policy` 获取策略后本地校验
4. 提交 → `POST /auth/register` → 成功后自动登录或跳转邮箱验证
5. 注册成功 → 发送验证邮件 → 提示用户查收

**调用 API**：
- `GET /api/v1/auth/register/check-username`
- `GET /api/v1/auth/register/check-email`
- `GET /api/v1/security/password-policy`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/send-verification-email`

---

### 3.3 忘记密码页 (`/forgot-password`)

**布局**：居中卡片布局

**字段与校验**：

| 字段 | 类型 | 校验规则 |
|------|------|----------|
| 邮箱 | email | `required`, `email` 格式 |

**交互逻辑**：
1. 输入邮箱 → 提交 → `POST /auth/forgot-password`
2. 无论邮箱是否存在，统一提示"重置链接已发送"（防枚举）
3. 60 秒冷却倒计时，禁止重复提交

**调用 API**：
- `POST /api/v1/auth/forgot-password`

---

### 3.4 重置密码页 (`/reset-password`)

**布局**：居中卡片布局

**字段与校验**：

| 字段 | 类型 | 校验规则 |
|------|------|----------|
| 新密码 | password | `required`, `min(8)`, 符合密码策略 |
| 确认新密码 | password | `required`, 与新密码一致 |
| 验证码 | text | `required`（从 URL query `token` 自动填充） |

**交互逻辑**：
1. 页面加载从 URL 解析 `?token=xxx`
2. 先调用 `POST /auth/verify-reset-code` 验证 Token 有效性
3. Token 无效/过期 → 展示错误 + "重新发送链接"按钮
4. Token 有效 → 渲染密码设置表单
5. 提交 → `POST /auth/reset-password` → 成功后自动登录

**调用 API**：
- `POST /api/v1/auth/verify-reset-code`
- `POST /api/v1/auth/reset-password`

---

### 3.5 邮箱验证页 (`/verify-email`)

**布局**：居中卡片布局（结果页）

**交互逻辑**：
1. 从 URL 解析 `?token=xxx`
2. 页面加载自动调用 `POST /auth/verify-email`
3. 成功 → 展示绿色成功状态 + "前往登录"按钮
4. 失败（已过期）→ 展示错误 + "重新发送验证邮件"按钮 → `POST /auth/resend-verification-email`
5. 已验证 → 提示"邮箱已验证"

**调用 API**：
- `POST /api/v1/auth/verify-email`
- `POST /api/v1/auth/resend-verification-email`

---

### 3.6 手机验证页 (`/verify-phone`)

**布局**：居中卡片布局

**字段与校验**：

| 字段 | 类型 | 校验规则 |
|------|------|----------|
| 手机号 | tel | `required`, 按地区校验 |
| 验证码 | text | `required`, `length(6)` |

**交互逻辑**：
1. 输入手机号 → 点击"获取验证码" → `POST /auth/send-sms-code`
2. 60 秒倒计时，冷却期间按钮 disabled
3. 输入验证码 → `POST /auth/verify-phone`
4. 成功 → 自动跳转登录后目标页

**调用 API**：
- `POST /api/v1/auth/send-sms-code`
- `POST /api/v1/auth/verify-phone`
- `POST /api/v1/auth/resend-sms-code`

---

### 3.7 MFA 验证页 (`/mfa-challenge`)

**布局**：居中卡片布局，支持多 Tab 切换验证方式

**字段与校验**：

| 字段 | 类型 | 校验规则 | 说明 |
|------|------|----------|------|
| TOTP 验证码 | text | `required`, `length(6)` | Google Authenticator 等 |
| SMS 验证码 | text | `required`, `length(6)` | 短信验证 |
| Email 验证码 | text | `required`, `length(6)` | 邮件验证 |

**交互逻辑**：
1. 登录后若后端返回 `mfa_required: true` 且携带 `mfa_token`（临时令牌）
2. 根据用户已启用的 MFA 方式展示对应 Tab：
   - TOTP → 输入 6 位数字 → `POST /mfa/totp/validate`
   - SMS → 点击"发送验证码" → `POST /mfa/sms/send` → 输入 → `POST /mfa/sms/verify`
   - Email → 同上，调用 `/mfa/email/*`
3. 验证成功 → 换取正式 Access Token → 跳转目标页
4. 验证失败 → 展示剩余尝试次数，超限则锁定

**调用 API**：
- `POST /api/v1/mfa/totp/validate`
- `POST /api/v1/mfa/sms/send`
- `POST /api/v1/mfa/sms/verify`
- `POST /api/v1/mfa/email/send`
- `POST /api/v1/mfa/email/verify`
- `POST /api/v1/auth/mfa/verify`（TOTP 便捷端点）

---

### 3.8 MFA 设置引导页 (`/mfa-setup`)

**布局**：Step-by-Step 向导式，每步一个焦点

**流程**：
1. **选择方式**：TOTP / SMS / Email / Passkey（根据租户策略过滤可用选项）
2. **TOTP 设置**：
   - 调用 `POST /auth/mfa/setup` 获取 QR Code URL + Secret
   - 展示二维码 + 手动输入 Secret
   - 用户输入验证器中的 6 位码 → `POST /auth/mfa/enable`
   - 成功后展示**备用恢复码**（10 个一次性码）→ 强制用户保存 → `POST /auth/mfa/regenerate-backup-codes`
3. **SMS/Email 设置**：
   - 输入手机号/邮箱 → 发送验证码 → 验证 → 启用
4. **完成**：跳转登录后目标页

**调用 API**：
- `POST /api/v1/auth/mfa/setup`
- `POST /api/v1/auth/mfa/enable`
- `POST /api/v1/auth/mfa/regenerate-backup-codes`
- `POST /api/v1/mfa/totp/verify`
- `GET /api/v1/mfa/status/{user_id}`

---

### 3.9 OAuth 授权页 (`/oauth/authorize`)

**布局**：居中卡片，展示应用信息 + 权限列表

**交互逻辑**：
1. 从 URL 解析 `?client_id=xxx&redirect_uri=xxx&scope=xxx&state=xxx`
2. 调用 `GET /oauth/clients/{client_id}` 获取应用信息（名称、Logo、开发者）
3. 用户未登录 → 先跳转登录页，完成后带参数返回
4. 用户已登录 → 展示授权确认界面：
   - 应用名称 + Logo
   - 请求的权限列表（scope 中文翻译）
   - "同意" / "拒绝" 按钮
5. 点击同意 → `POST /oauth/authorize` → 302 跳转 `redirect_uri?code=xxx&state=xxx`
6. 点击拒绝 → 跳转 `redirect_uri?error=access_denied`

**调用 API**：
- `GET /api/v1/oauth/clients/{client_id}`
- `POST /api/v1/oauth/authorize`

---

### 3.10 OAuth 回调页 (`/oauth/callback`)

**布局**：全屏 Loading 页

**交互逻辑**：
1. 从 URL 解析 `?code=xxx&state=xxx`
2. 校验 `state` 防 CSRF（与登录前存储的 state 比对）
3. 调用后端交换 Token（或后端自动处理）
4. 成功 → 跳转目标页；失败 → 跳转 `/error?type=oauth_failed`

**调用 API**：
- `GET /api/v1/oauth/{provider}/callback`

---

### 3.11 错误页 (`/error`)

**布局**：居中卡片，根据错误类型展示不同插图和文案

**错误类型**：

| 类型 | Query 参数 | 文案 | 操作 |
|------|-----------|------|------|
| session_expired | `?type=session_expired` | 您的会话已过期，请重新登录 | 跳转登录页 |
| unauthorized | `?type=unauthorized` | 您没有权限访问此页面 | 跳转首页 |
| ip_restricted | `?type=ip_restricted` | 当前 IP 不被允许访问 | 联系管理员 |
| account_locked | `?type=account_locked` | 账户已被锁定 | 联系管理员 |
| oauth_failed | `?type=oauth_failed` | 第三方登录失败 | 重试或换方式 |
| generic | `?type=generic` | 发生未知错误 | 返回首页 |

---

## 4. 状态管理设计

### 4.1 状态分层

```
┌─────────────────────────────────────────┐
│         Auth Pages 状态架构              │
├─────────────────────────────────────────┤
│  Server State (TanStack Query)          │
│  ├── 用户登录/注册/验证 API              │
│  ├── 租户品牌配置                        │
│  └── OAuth 提供者列表                    │
├─────────────────────────────────────────┤
│  Client State (Zustand)                 │
│  ├── authStore — Token + User + 登录态   │
│  ├── tenantStore — 当前租户 + 品牌配置   │
│  └── uiStore — 全局 Loading / Toast      │
├─────────────────────────────────────────┤
│  URL State (Next.js Router)             │
│  ├── redirect_uri / returnTo             │
│  ├── tenant（子域名解析）                │
│  └── OAuth state / code                  │
└─────────────────────────────────────────┘
```

### 4.2 authStore（认证核心）

```typescript
interface AuthState {
  // Token
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;   // JWT exp timestamp

  // 用户基础信息
  user: {
    id: string;
    username: string;
    email: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    status: 'active' | 'locked' | 'disabled';
  } | null;

  // 登录态
  isAuthenticated: boolean;
  isLoading: boolean;              // 初始化加载中（页面刷新后恢复会话）

  // Action
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  clearAuth: () => void;
  updateUser: (partial: Partial<User>) => void;
}
```

**持久化策略**：
- 使用 `zustand/middleware` 的 `persist` 将 Token 存入 `localStorage`
- **注意**：当前实现使用 localStorage，生产环境建议迁移到 HttpOnly Cookie（由 Gateway 统一设置）
- `tokenExpiresAt` 用于判断本地 Token 是否即将过期，提前触发刷新

### 4.3 Token 刷新机制

```
请求 API
  ├── Access Token 有效？
  │   ├── YES → 正常请求
  │   └── NO → 是否即将过期（< 5分钟）？
  │       ├── YES → 静默刷新
  │       └── NO → 跳转登录页
```

**实现方式**：在 Axios Response Interceptor 中统一处理 401：
1. 收到 401 → 尝试 `POST /auth/refresh`（携带 refreshToken）
2. 刷新成功 → 更新 store → 重放原请求
3. 刷新失败 → 清除登录态 → 跳转登录页

### 4.4 多租户选择

当前后端缺口：`POST /auth/login` 不返回租户/角色信息。在 `/auth/me/session-context` 上线前，采用过渡方案：

```
登录成功
  → GET /users/{userId}/tenants
  → 判断租户数量：
    ├── 0 个 → 错误（用户不属于任何租户）
    ├── 1 个 → 自动选中，获取权限，跳转
    └── 多 个 → 展示租户选择器 → 用户选择 → 获取权限 → 跳转
```

**tenantStore 设计**：

```typescript
interface TenantState {
  currentTenantId: string | null;
  tenants: Array<{
    tenantId: string;
    tenantName: string;
    role: 'owner' | 'admin' | 'member';
    logoUrl?: string;
  }>;
  branding: {
    primaryColor: string;
    logoUrl: string;
    faviconUrl: string;
    customCss: string;
  } | null;
  setCurrentTenant: (tenantId: string) => void;
  loadBranding: (tenantId: string) => Promise<void>;
}
```

---

## 5. 后端 API 列表

### 5.1 认证核心 API

| 方法 | 端点 | 用途 | 优先级 |
|------|------|------|--------|
| POST | `/auth/login` | 用户登录 | P0 |
| POST | `/auth/register` | 用户注册 | P0 |
| POST | `/auth/logout` | 用户登出 | P0 |
| POST | `/auth/refresh` | 刷新访问令牌 | P0 |
| GET | `/auth/me` | 获取当前登录用户信息 | P0 |
| POST | `/auth/forgot-password` | 忘记密码 | P0 |
| POST | `/auth/reset-password` | 重置密码 | P0 |
| POST | `/auth/verify-email` | 验证邮箱地址 | P0 |
| POST | `/auth/verify-phone` | 验证手机号 | P0 |
| POST | `/auth/verify-reset-code` | 验证重置验证码 | P0 |
| GET | `/auth/register/check-username` | 检查用户名是否可用 | P0 |
| GET | `/auth/register/check-email` | 检查邮箱是否可用 | P0 |
| POST | `/auth/send-verification-email` | 发送邮箱验证邮件 | P0 |
| POST | `/auth/resend-verification-email` | 重新发送邮箱验证邮件 | P0 |
| POST | `/auth/send-sms-code` | 发送短信验证码 | P0 |
| POST | `/auth/resend-sms-code` | 重新发送短信验证码 | P0 |

### 5.2 MFA API

| 方法 | 端点 | 用途 | 优先级 |
|------|------|------|--------|
| GET | `/auth/mfa/status` | 获取 TOTP 状态 | P1 |
| POST | `/auth/mfa/setup` | 设置 TOTP | P1 |
| POST | `/auth/mfa/enable` | 启用 TOTP | P1 |
| POST | `/auth/mfa/disable` | 禁用 TOTP | P1 |
| POST | `/auth/mfa/verify` | 验证 TOTP 码 | P1 |
| POST | `/auth/mfa/regenerate-backup-codes` | 重新生成备用码 | P1 |
| POST | `/mfa/totp/validate` | 验证 TOTP（登录时） | P1 |
| POST | `/mfa/totp/verify` | 验证并启用 TOTP | P1 |
| POST | `/mfa/sms/send` | 发送 MFA 短信验证码 | P1 |
| POST | `/mfa/sms/verify` | 验证 MFA 短信验证码 | P1 |
| POST | `/mfa/email/send` | 发送 MFA 邮件验证码 | P1 |
| POST | `/mfa/email/verify` | 验证 MFA 邮件验证码 | P1 |
| POST | `/mfa/challenge` | 创建通用 MFA 挑战 | P1 |
| GET | `/mfa/risk-policy` | 获取 MFA 风险策略 | P2 |

### 5.3 OAuth / SSO API

| 方法 | 端点 | 用途 | 优先级 |
|------|------|------|--------|
| GET | `/auth/oauth/providers` | 获取 OAuth 提供商列表 | P1 |
| GET | `/auth/oauth/{provider}` | 发起 OAuth 登录 | P1 |
| GET | `/auth/oauth/{provider}/callback` | OAuth 回调 | P1 |
| GET | `/oauth/authorize` | 授权页面(GET) | P1 |
| POST | `/oauth/authorize` | 授权提交(POST) | P1 |
| POST | `/auth/sso/initiate` | 启动企业 SSO | P2 |
| POST | `/auth/sso/callback` | 企业 SSO 回调 | P2 |

### 5.4 WebAuthn (Passkey) API

| 方法 | 端点 | 用途 | 优先级 |
|------|------|------|--------|
| POST | `/auth/webauthn/login/begin` | 开始 Passkey 登录 | P2 |
| POST | `/auth/webauthn/login/complete` | 完成 Passkey 登录 | P2 |
| POST | `/auth/webauthn/register/begin` | 开始 Passkey 注册 | P2 |
| POST | `/auth/webauthn/register/complete` | 完成 Passkey 注册 | P2 |

### 5.5 租户/品牌 API

| 方法 | 端点 | 用途 | 优先级 |
|------|------|------|--------|
| GET | `/tenants/{id}/branding` | 获取租户品牌配置 | P0 |
| GET | `/users/{userId}/tenants` | 获取用户所属租户列表 | P0 |
| GET | `/security/password-policy` | 获取密码策略 | P0 |

### 5.6 后端缺口与过渡方案

| 缺口 | 影响 | 过渡方案 |
|------|------|----------|
| `/auth/me/session-context` 缺失 | 登录后需调 3 个 API 才能确定权限 | 先调 `/auth/me` + `/users/{id}/tenants` |
| `/auth/branding` 公开端点缺失 | 未登录时无法获取品牌配置 | 走 `/tenants/{id}/branding` 并确保 Gateway 允许匿名访问 |
| `POST /auth/login` 不返回 tenant/role | 登录后需额外调租户列表 | 登录成功后顺序调用 `/auth/me` → `/users/{id}/tenants` |

---

## 6. 品牌定制（White-Label）方案

### 6.1 定制范围

| 维度 | 可定制项 | 数据来源 |
|------|----------|----------|
| **视觉** | Logo、Favicon、主色调、背景色/图、边框圆角 | `GET /tenants/{id}/branding` |
| **字体** | 字体族（可选，默认 Inter） | 同上 |
| **文案** | 页面标题、副标题、底部链接文案 | i18n + 租户配置覆盖 |
| **高级** | 自定义 CSS（沙箱注入） | `branding.custom_css` |
| **域名** | `login.{tenant-domain}.iam.tianv.com` | DNS + Gateway 路由 |

### 6.2 Design Token 动态注入流程

```
Auth Pages 加载
  → 从子域名解析 tenant_id（如 login.acme.iam.tianv.com → tenant=acme）
  → 调用 GET /tenants/{id}/branding（公开/匿名端点）
  → 将品牌配置映射为 CSS 变量注入 :root
  → 若配置了 custom_css，创建 <style> 标签注入（需 CSS Sanitizer）
  → 渲染品牌化登录页
```

### 6.3 CSS 变量映射

```css
:root {
  --color-brand: #3b82f6;           /* branding.primary_color */
  --color-brand-hover: #2563eb;     /* primary-600 */
  --logo-url: url('https://...');    /* branding.logo_url */
  --font-sans: 'Inter', ...;         /* branding.font_family */
  --radius-md: 8px;                  /* branding.border_radius */
}
```

### 6.4 安全约束

- **custom_css 必须沙箱化**：只允许修改 Auth Pages 自有 DOM 内的样式，禁止 `@import` 外部资源
- **Logo/Favicon URL 必须 HTTPS**：非 HTTPS 拒绝加载
- **主色调合法性校验**：必须是有效的 HEX 颜色码
- **CSP 策略**：设置 `style-src 'self' 'unsafe-inline'` 以支持动态 CSS 变量（未来可优化为 nonce）

---

## 7. 多语言方案

### 7.1 语言范围

| 语言 | 代码 | 优先级 |
|------|------|--------|
| 简体中文 | `zh-CN` | P0（默认） |
| 英文 | `en-US` | P0 |

> **注意**：日文 (`ja-JP`) 永久不在支持范围内（UI_PLANNING_MASTER.md 最终决策）。其他语言按商业需求逐个审批。

### 7.2 实现方案

采用 **Next.js i18n 路由** 或 **自定义语言检测**：

```
语言检测优先级：
  1. URL 参数 ?lang=en-US
  2. 用户上次选择（localStorage）
  3. 浏览器 Accept-Language 头
  4. 租户默认语言（branding.default_language）
  5. 回退 zh-CN
```

**技术选型**：推荐使用 `next-intl` 或自研轻量方案（因页面数量少，词汇量有限）：

### 7.3 需要翻译的内容

1. **所有 UI 文本**：标题、标签、按钮、提示、链接
2. **表单校验错误**：Zod 错误消息需走 i18n
3. **后端错误码映射**：后端返回 `code + message`，前端优先按 code 匹配 i18n 文案，fallback 用后端 message
4. **邮件模板中的链接文案**：如"点击验证邮箱"等（邮件模板本身由后端/communication-service 负责）

---

## 8. 组件拆分建议

### 8.1 页面级组件（App Router Pages）

```
src/app/
├── page.tsx                    # 登录页
├── register/page.tsx           # 注册页
├── forgot-password/page.tsx    # 忘记密码
├── reset-password/page.tsx     # 重置密码
├── verify-email/page.tsx       # 邮箱验证
├── verify-phone/page.tsx       # 手机验证
├── mfa-challenge/page.tsx      # MFA 验证
├── mfa-setup/page.tsx          # MFA 设置引导
├── oauth/
│   ├── authorize/page.tsx      # OAuth 授权确认
│   └── callback/page.tsx       # OAuth 回调
├── sso/
│   └── initiate/page.tsx       # SSO 发起
├── passkey/page.tsx            # Passkey 登录/注册
├── error/page.tsx              # 错误页
└── layout.tsx                  # 根布局（注入品牌变量）
```

### 8.2 可复用组件（src/components/）

```
src/components/
├── auth/
│   ├── AuthCard.tsx            # 居中认证卡片容器（统一阴影/圆角/宽度）
│   ├── AuthHeader.tsx          # Logo + 标题 + 副标题
│   ├── SocialLoginButtons.tsx  # 社交登录按钮组（动态渲染可用提供商）
│   ├── TenantSelector.tsx      # 多租户选择器（Modal / Dropdown）
│   └── BrandingInjector.tsx    # 品牌 CSS 变量注入逻辑
├── form/
│   ├── FormInput.tsx           # 统一表单输入（Label + Input + Error）
│   ├── PasswordInput.tsx       # 密码输入（带显示/隐藏切换 + 强度条）
│   ├── VerificationCode.tsx    # 6 位验证码输入框（自动聚焦/跳转）
│   └── CountdownButton.tsx     # 带冷却倒计时的按钮（获取验证码）
├── mfa/
│   ├── TOTPChallenge.tsx       # TOTP 验证组件
│   ├── SMSChallenge.tsx        # SMS 验证组件
│   ├── EmailChallenge.tsx      # Email 验证组件
│   └── BackupCodeInput.tsx     # 备用恢复码输入
├── oauth/
│   ├── OAuthConsentCard.tsx    # OAuth 授权确认卡片
│   └── OAuthCallbackHandler.tsx # OAuth 回调处理逻辑
└── ui/
    ├── LoadingScreen.tsx       # 全屏 Loading（回调页用）
    ├── ErrorState.tsx          # 错误状态展示（插图 + 文案 + 操作）
    └── SuccessState.tsx        # 成功状态展示
```

### 8.3 Hooks（src/hooks/）

```
src/hooks/
├── use-auth.ts                 # 封装 authStore + 自动刷新逻辑
├── use-tenant.ts               # 租户解析 + 品牌加载
├── use-password-policy.ts      # 获取并校验密码策略
├── use-oauth-state.ts          # OAuth state 生成与校验
├── use-webauthn.ts             # WebAuthn 浏览器 API 封装
└── use-countdown.ts            # 通用倒计时 Hook
```

### 8.4 Lib 层增强（src/lib/）

```
src/lib/
├── api.ts                      # Axios 实例 + 拦截器（需增强 Token 刷新）
├── auth-store.ts               # Zustand 认证状态（已存在，需扩展）
├── tenant-store.ts             # Zustand 租户状态（新增）
├── i18n.ts                     # 国际化工具函数
├── branding.ts                 # 品牌配置获取 + CSS 变量注入
└── validators.ts               # Zod Schema 统一出口
```

---

## 9. 安全设计要点

| 安全项 | 要求 | 实现方式 |
|--------|------|----------|
| **CSRF 防护** | Auth Pages 必须带 CSRF Token | 初期：Double Submit Cookie；后期：Backend 签发 CSRF Token |
| **XSS 防护** | 禁止将 Token 写入非 HttpOnly Cookie | 当前使用 localStorage，未来切 Cookie 后需 Gateway 统一设置 HttpOnly |
| **Clickjacking** | 防止被嵌入恶意 iframe | 响应头 `X-Frame-Options: DENY` 或 CSP `frame-ancestors` |
| **密码策略** | 实时校验后端策略 | 登录前调用 `GET /security/password-policy` |
| **Rate Limiting** | 登录/注册/验证码接口限流 | 前端按钮冷却 + 后端 Gateway 限流双重保障 |
| **验证码防枚举** | 忘记密码接口统一响应 | 无论邮箱是否存在均提示"已发送" |
| **OAuth State** | 防止 CSRF | 随机生成 state，回调时严格比对 |
| **自定义 CSS 沙箱** | 防止恶意样式注入 | 只允许特定 CSS 属性，禁止 `@import` 和 `url()` |

---

## 10. 响应式策略

Auth Pages 采用 **Mobile-first** 设计：

| 断点 | 布局调整 |
|------|----------|
| `< 640px` | 卡片宽度 `100% - 32px`，内边距压缩，社交登录按钮垂直堆叠 |
| `640px+` | 卡片 `max-w-sm` (384px)，居中展示 |
| `1024px+` | 可选左右分栏（左侧品牌图/文案，右侧表单）—— 由租户配置决定 |

---

## 11. 实施路线图

### Phase 1.1（第 1~2 周）：基础认证闭环

- [ ] 登录页增强：记住我、社交登录按钮区、错误码 i18n
- [ ] 注册页增强：用户名/邮箱实时检查、密码强度、密码策略对接
- [ ] 忘记密码页：冷却倒计时、已发送状态持久化
- [ ] 新增：重置密码页、邮箱验证页
- [ ] API 层增强：Token 刷新拦截器、401 统一处理
- [ ] 状态管理：authStore 扩展 tokenExpiresAt、tenantStore 初始化

### Phase 1.2（第 3~4 周）：品牌定制 + 多租户

- [ ] 品牌配置获取 + CSS 变量注入
- [ ] 子域名租户解析（`login.{tenant}.localhost` 本地模拟）
- [ ] 多租户选择器（登录后）
- [ ] 布局组件化：AuthCard、AuthHeader、BrandingInjector

### Phase 1.3（第 5~6 周）：MFA + 安全增强

- [ ] MFA 验证页（TOTP/SMS/Email Tab 切换）
- [ ] MFA 设置引导页（QR Code 展示 + 备用码保存）
- [ ] 手机验证页
- [ ] 错误页（session_expired / unauthorized / generic）

### Phase 1.4（第 7~8 周）：OAuth + 国际化

- [ ] OAuth 授权确认页
- [ ] OAuth 回调处理
- [ ] 多语言切换（zh-CN / en-US）
- [ ] 所有文案 i18n 化
- [ ] E2E 测试（Playwright）覆盖核心流程

### Phase 2（按需）：高级认证方式

- [ ] 企业 SSO 发起页
- [ ] Passkey 登录/注册（WebAuthn）
- [ ] 账号删除确认页

---

## 12. 附录：现有代码评估

### 12.1 现有实现清单

| 文件 | 状态 | 评估 |
|------|------|------|
| `src/app/page.tsx` | ✅ 已实现 | 基础登录功能完整，需增强：社交登录、记住我、错误码映射 |
| `src/app/register/page.tsx` | ✅ 已实现 | 基础注册功能完整，需增强：实时检查、密码强度、密码策略 |
| `src/app/forgot-password/page.tsx` | ✅ 已实现 | 基础功能完整，需增强：冷却倒计时、已发送状态持久化 |
| `src/app/layout.tsx` | ✅ 已实现 | 需增强：动态 title（按页面）、品牌 favicon 注入 |
| `src/lib/api.ts` | ⚠️ 待增强 | 缺少 Token 刷新逻辑、TenantID Header 注入 |
| `src/lib/auth-store.ts` | ⚠️ 待增强 | 缺少 tokenExpiresAt、isLoading 初始化状态 |
| `package.json` | ✅ 已就绪 | 技术栈完整，无需变更 |

### 12.2 需要新增的文件

- `src/lib/tenant-store.ts`
- `src/lib/branding.ts`
- `src/lib/i18n.ts`
- `src/lib/validators.ts`
- `src/hooks/use-auth.ts`
- `src/hooks/use-tenant.ts`
- `src/hooks/use-password-policy.ts`
- `src/components/auth/*`
- `src/components/form/*`
- `src/components/mfa/*`

---

## 13. 关键依赖与外部接口

| 依赖 | 版本 | 用途 |
|------|------|------|
| next | 15.5.15 | App Router、SSR/SSG |
| react / react-dom | 19.2.5 | UI 框架 |
| typescript | 5.8.3 | 类型安全 |
| tailwindcss | 3.4.17 | 样式 |
| @autional-cn/ui | workspace | 共享 UI 组件（Button / Input / Label） |
| @tanstack/react-query | 5.75.0 | Server State 管理 |
| zustand | 5.0.13 | Client State 管理 |
| react-hook-form | 7.75.0 | 表单管理 |
| zod | 3.23.8 | 表单校验 |
| axios | 1.16.0 | HTTP 客户端 |

---

*文档结束。本规划基于 `UI_PLANNING_MASTER.md` v1.0 和 `document/generated/api-index/API_INDEX.md`（544 端点）编制，随后端 API 演进需同步更新。*
