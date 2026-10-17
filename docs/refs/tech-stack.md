# 技术栈核验与安装路径

> 核验日期：2026-10-17
> 原则：版本以官方发布为准；本文件只记录**已核验**的结论，未核验项明确标注。

---

## 1. 当前仓库基线

| 项 | 值 |
|---|---|
| Next.js | 16.4.2 |
| React | 19.3.0 |
| Tailwind CSS | v4（`@tailwindcss/turbopack`） |
| TypeScript | 5.x |
| 包管理器 | pnpm 10.33.2 |
| 路由 | App Router |
| 特殊约定 | `layout.tsx` 使用生成的 `LayoutProps<"/">` 类型 |

> `AGENTS.md` 提醒：这是与训练数据不同的 Next.js。写代码前读 `node_modules/next/dist/docs/`。

---

## 2. Payload CMS 3 × Next.js 16

### 结论

- **Payload 3.73+ 官方支持 Next.js 16**（发布说明标注于 v3.73）。
- 社区 starter 已使用 **Next 16.1 + Payload 3.76 + Tailwind 4.1 + shadcn/ui**。
- Payload 与 Next 同进程运行，`payload.find()` 本地 API 无网络开销。

### 官方来源

- 发布说明：<https://payloadcms.com/posts/releases/new-in-payload-dashboards-developer-control-and-nextjs-16>
- Starter：<https://github.com/TiagoGranelli/nextjs-payload-starter>
- 官方仓库：<https://github.com/payloadcms/payload>

### 安装路径（推荐）

不要从零手写 Payload 配置。先以官方/社区 starter 为参考，抽取最小配置：

```bash
pnpm add payload @payloadcms/db-postgres @payloadcms/richtext-lexical @payloadcms/next
```

需要的环境变量：

```bash
DATABASE_URI=postgres://...
PAYLOAD_SECRET=...
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

目录约定（与 starter 对齐）：

```
src/app/(payload)/admin/[[...segments]]/page.tsx
src/app/(payload)/api/[...slug]/route.ts
src/app/(payload)/layout.tsx
src/collections/Users.ts
src/collections/Media.ts
src/collections/Posts.ts
src/payload.config.ts
```

### 风险

- 3.76 与 16.4.2 的组合未在官方文档逐条列出；先跑最小 build。
- Payload Admin 的样式隔离较强；ctOS 化只能通过 CSS 变量与槽位，不 fork。
- Next 16 的缓存/预取行为变化可能影响 Payload 的 draft preview，Phase 1 先不做 preview。

---

## 3. shadcn/ui × Tailwind v4 × Next 16

### 结论

- shadcn/ui 支持 Tailwind v4（CSS-first，`@theme inline`）。
- Next 16 项目可直接 `shadcn init`。
- 2026-05 起 CLI 支持 registry include/validate。

### 命令

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button badge card separator input textarea tabs dropdown-menu
```

### 注意

- `init` 会改写 `app/globals.css` 与 `components.json`；先提交当前状态，便于对比。
- Tailwind v4 不再需要 `tailwind.config.ts`；token 写在 CSS 的 `@theme` 中。
- 本项目使用 `new-york` 风格 + 自定义 ctOS 变量。

---

## 4. 动画

| 库 | 用途 | 版本 |
|---|---|---|
| motion（原 Framer Motion） | 复杂编排、路由过渡 | 12.x |
| CSS transitions | 90% 的 hover/focus | 原生 |
| ascii.rest | ASCII 动画原语 | latest |
| React Bits | GradientASCII 背景 | shadcn registry |

原则：能用 CSS 就不引 JS；JS 动画只用于需要编排或中断的场景。

---

## 5. Hub 模块

| 模块 | 选型 | 说明 |
|---|---|---|
| 终端 | xterm.js + WebSocket + node-pty / ttyd | 单会话 |
| 远程桌面 | noVNC + websockify | 短 token、只读默认 |
| 监控 | `/proc` 采集 或 Prometheus + SSE | 页面不可见时暂停 |
| 文件 | S3 SDK / MinIO | 预签名 URL |
| 审计 | Payload collection `AuditLog` | 90 天保留 |
| 认证 | Payload Auth | 单 owner，关闭注册 |

---

## 6. 开发命令

```bash
pnpm dev          # 开发服务器
pnpm build        # 生产构建
pnpm lint         # ESLint
pnpm type-check   # tsc --noEmit（需补脚本）
```

---

## 7. 未核验/待办

- [ ] Payload 3.76 在 Next 16.4.2 上的实际 build（Phase 1 第一步）。
- [ ] React Bits GradientASCII 在 Tailwind v4 下的样式兼容。
- [ ] ascii.rest React 组件在 RSC 边界下的 client 标记。
- [ ] noVNC 与 Next 同域反代的 WebSocket 配置。
- [ ] 中文系统字体栈在目标浏览器（Safari/Chrome/Firefox）的实际断行。
