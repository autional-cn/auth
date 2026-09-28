# Autional 身份认证

**域名**：[auth.autional.cn](https://auth.autional.cn)
**技术栈**：Vite + React 19 + TypeScript + Tailwind CSS
**仓库**：[github.com/autional-cn/auth](https://github.com/autional-cn/auth)

登录、注册、多因素认证与单点登录。

## 开发

```bash
pnpm install
pnpm dev      # http://localhost:13101
pnpm build    # 构建产物：apps/auth-pages/dist/
pnpm test     # Vitest 单元测试
```

## 部署

推送至 `main` 分支后由 Vercel 自动部署。
