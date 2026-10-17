# rak-blog — DESIGN.md

> 一个双面单应用：对外是中文个人博客，对内是单人 Web 中枢。
> 视觉母题：**动态 ASCII 风暴 + ctOS 微交互**，骨架来自 Vercel / Linear 的秩序感，组件优先 shadcn/ui。

- 状态：v0.1（设计定稿）
- 更新：2026-10-17
- 技术基线：Next.js 16.4 · React 19.3 · Tailwind CSS v4 · Payload CMS 3.76 · shadcn/ui
- 部署：自有 VPS，单应用 Docker Compose，自有域名

---

## 1. 项目定位

| 面 | 受众 | 目标 | 关键词 |
|---|---|---|---|
| **Public** | 任何访客 | 个人品牌、文章、项目、笔记 | 快速、可读、有记忆点 |
| **Admin** | 仅站主 | 内容生产 + 服务器/生态控制台 | 单人、自举、可扩展 |

两条硬约束：

1. **单应用**：Public 与 Admin 是同一个 Next.js 应用的不同路由，不做双仓库、不做双部署。
2. **不造轮子**：能用成熟库就不自研。ASCII 动画用现成库/组件打底，CMS 用 Payload，认证用 Payload Auth，终端用成熟 Web 终端，远程桌面用 noVNC。

---

## 2. 设计原则

1. **风暴是背景，内容永远是前景。** 任何动效不得降低正文对比度或阅读速度。
2. **静止时安静，交互时爆发。** 常驻层只保留低强度氛围（扫描线、微弱色差、偶发 glitch）；hover / focus / 路由切换才触发强反馈。
3. **同一个世界，不同强度。** 全站共享同一场风暴，按页面分级：落地页 100% → 列表 30% → 文章 5%。
4. **组件先于页面。** 所有 UI 先落到 `components/ui` 或 `components/ctos`，页面只做编排。
5. **可降级是一等公民。** `prefers-reduced-motion`、低性能设备、移动端、无 JS 都必须有明确形态。
6. **中文优先。** 排版、断行、标点、字体栈按中文阅读习惯设计，技术名词保留英文。

---

## 3. 双面架构

```
┌────────────────────────── 单应用 (Next.js App Router) ──────────────────────────┐
│                                                                                │
│  app/(public)                         app/(payload)                             │
│  ├─ /                 风暴落地页       ├─ /admin           Payload Admin UI      │
│  ├─ /posts            文章列表         ├─ /api/*           Payload REST/GraphQL  │
│  ├─ /posts/[slug]     文章页           └─ /api/graphql                           │
│  ├─ /notes            短笔记                                                    │
│  ├─ /projects         项目              app/(hub)                                 │
│  ├─ /about            关于              ├─ /hub             中枢仪表盘            │
│  └─ layout.tsx        公开站外壳        ├─ /hub/terminal    Web 终端              │
│                                         ├─ /hub/desktop     noVNC 远程桌面        │
│  app/(auth)                             ├─ /hub/files       文件管理              │
│  └─ /login             单用户登录        ├─ /hub/metrics     服务器监控            │
│                                         └─ /hub/audit       审计日志              │
│                                                                                │
├────────────────────────────────────────────────────────────────────────────────┤
│  lib/            db (Payload adapter) · auth · rbac · storm · motion            │
│  components/     ui (shadcn) · ctos (HUD/glitch/storm) · content · hub          │
│  collections/    Posts · Notes · Projects · Media · Users · AuditLog            │
│  globals/        SiteSettings · Navigation · HubSettings                        │
└────────────────────────────────────────────────────────────────────────────────┘
                                     │
                         ┌───────────┴───────────┐
                         │  Postgres · Redis     │
                         │  S3/MinIO · noVNC     │
                         └───────────────────────┘
```

### 3.1 路由分组

| 分组 | 路径 | 访问控制 | 风暴强度 |
|---|---|---|---|
| `(public)` | `/` `/posts` `/notes` `/projects` `/about` | 公开 | 100 / 30 / 30 / 30 / 10 |
| `(auth)` | `/login` | 公开（限流） | 60 |
| `(payload)` | `/admin` `/api` | Payload Auth | — |
| `(hub)` | `/hub/*` | 站主 only | 20 |

> `(payload)` 的目录结构由 Payload 官方模板生成，不要手工改写；业务页面放在 `(public)` 与 `(hub)`。

### 3.2 认证与权限

- 使用 **Payload Auth**（`Users` collection），只允许一个 `role: owner` 账号。
- `Users` 关闭公开注册；登录失败按 IP + 账号双维度限流。
- `/hub/*` 与 Payload Admin 共用会话；`/admin` 之外的中枢路由由 middleware 校验 `role === 'owner'`。
- 远程桌面与终端不复用浏览器会话直接连内网，必须经服务端签发的短期 token。

---

## 4. 视觉系统：ctOS ASCII Storm

### 4.1 概念

参考《看门狗》的 ctOS：城市被数据化，界面像一层覆盖在现实上的 HUD。我们不复刻游戏 UI，而是提取四个特征：

1. **字符即像素** —— 一切图形都可以退化为 ASCII 字符网格。
2. **扫描与锁定** —— 目标框、坐标、状态读数、扫描线。
3. **信号噪声** —— 偶发 glitch、色差、丢帧感，暗示"系统在运行"。
4. **克制的科技色** —— 近黑底 + 暖白前景 + 一点点高级粉，不用霓虹紫或多色发光。

### 4.2 风暴分级

| Token | 页面 | 说明 |
|---|---|---|
| `storm-full` | `/` | 全屏字符雨 + 偶发风暴脉冲 + HUD |
| `storm-medium` | `/posts` `/notes` `/projects` | 30% 密度，稀疏字符漂移，不做竖向雨幕 |
| `storm-low` | `/posts/[slug]` `/about` | 5% 密度，极淡纹理，正文区域进一步降为 0 |
| `storm-hud` | `/login` `/hub/*` | 低密度 + HUD 边框，强调"控制台"感 |
| `storm-off` | 打印、`prefers-reduced-motion` | 静态首帧或纯 CSS 纹理 |

强度通过根布局的 `data-storm="full|medium|low|hud|off"` 下发，`<AsciiStorm />` 读取后决定密度与帧率。

### 4.3 色彩

```css
/* 背景层 */
--ctos-bg:        #08070A;   /* 页面底色，近黑带极轻微紫调 */
--ctos-surface:   #0E0C10;   /* 卡片/面板 */
--ctos-elevated:  #141117;   /* 浮层/下拉 */
--ctos-border:    #282229;   /* 常规边框 */
--ctos-border-hi: #453A44;   /* hover/激活边框 */

/* 前景层 */
--ctos-fg:        #F5F2F4;   /* 主文字，暖白 */
--ctos-fg-muted:  #9A8E95;   /* 次级文字 */
--ctos-fg-dim:    #6B5F67;   /* 元信息/占位 */

/* 点缀色 */
--ctos-pink:      #EFA9C2;   /* 高级粉：焦点、标点、状态点 */
--ctos-pink-soft: #C77E99;   /* 次级粉：实验态、次要标记 */
--ctos-red:       #FF6B8A;   /* 错误、危险操作（同色族的偏红粉） */
--ctos-grid:      rgba(242, 167, 195, 0.05);
```

使用规则：

- **粉色是点缀，不是主色。** 只用于焦点环、当前项、标点、状态点、雷达扫描、极少量风暴字符。不用于大段文字、按钮填充或大面积背景。
- 主按钮使用暖白底 + 近黑字；粉色只出现在 hover/focus 的边缘与细节。
- 危险态使用偏红的粉，仍属于同一色族，避免引入第二套语义色。
- 正文始终使用 `--ctos-fg`，保证对比度 ≥ WCAG AA。

### 4.4 字体

| 用途 | 字体 | 说明 |
|---|---|---|
| 拉丁正文/UI | **Geist Sans** | `next/font/google` 自托管 |
| 代码/ASCII/HUD | **Geist Mono** | 等宽，字符网格的基础 |
| 中文正文 | 系统中文栈 | `"PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif` |
| 中文标题（可选） | 霞鹜文楷 / 思源宋体 | 仅用于文章标题，按需子集化，不首屏加载 |

中文不引入全量 Web 字体。标题的个性通过字重、字距、行高和 ASCII 装饰实现，而不是字体文件。

```css
--font-sans: var(--font-geist-sans), "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
--font-mono: var(--font-geist-mono), "SFMono-Regular", Consolas, monospace;
```

### 4.5 排版尺度

| Token | 字号/行高 | 用途 |
|---|---|---|
| `text-display` | 72/1.02（桌面）· 44/1.05（移动） | 落地页主标题 |
| `text-h1` | 40/1.15 | 文章标题 |
| `text-h2` | 28/1.3 | 章节标题 |
| `text-body` | 17/1.85 | 中文正文（比英文更松） |
| `text-small` | 14/1.6 | 元信息 |
| `text-mono` | 12/1.5 | HUD、时间戳、坐标 |

中文正文最大宽度 `68ch`，段落间距 `1.1em`，中英混排使用 `text-autospace` 思路（浏览器支持不足时用空格与 `font-feature-settings` 兜底）。

### 4.6 网格、间距、圆角

- 8px 基线网格；4px 用于图标与紧凑控件。
- 容器：`max-w-[1200px]`，正文 `max-w-[720px]`。
- 圆角：`--radius-sm: 4px`、`--radius-md: 8px`、`--radius-lg: 12px`。ctOS 面板默认 0–4px，内容卡片 8–12px。
- 边框优先于阴影；阴影只用于浮层，且带粉色微光。

### 4.7 动效

| 场景 | 时长 | 曲线 | 说明 |
|---|---|---|---|
| hover 文本 scramble | 240–420ms | linear | 字符随机回正 |
| 目标锁定框 | 160ms | `cubic-bezier(.2,.8,.2,1)` | 四角括号收拢 |
| 路由切换 glitch | 80ms × 2 | steps | 短暂色差 + 位移 |
| 风暴脉冲 | 600–1200ms | ease-out | 低频、随机，不规律 |
| 面板展开 | 180ms | `cubic-bezier(.2,.8,.2,1)` | 高度/透明度 |

所有动画必须：

- 支持 `prefers-reduced-motion: reduce` → 直接跳到终态。
- 页面不可见时暂停（`document.visibilitychange`）。
- 使用 `transform` / `opacity`，避免布局抖动。

### 4.8 微交互清单

| 交互 | 触发 | 表现 |
|---|---|---|
| `ScrambleText` | hover / focus | 字符随机替换后回正，保留最终文本可选中 |
| `TargetFrame` | hover 链接/卡片 | 四角括号 + 细扫描线 |
| `HudChrome` | 常驻 | 左上坐标、右上时间、底部状态栏，低对比 |
| `RouteGlitch` | 路由切换 | 80ms 色差 + 1–2px 位移，然后恢复 |
| `StormPulse` | 随机 8–20s | 密度/亮度短促上升后回落 |
| `CursorReadout` | 鼠标移动（桌面） | HUD 显示 `x/y` 与当前元素类型 |
| `LockOn` | 点击主 CTA | 目标框收拢 + 一次扫描线 |

### 4.9 可访问性

- 对比度：正文 ≥ 4.5:1，大字 ≥ 3:1；粉色仅用于非文本信号与标点。
- 焦点可见：2px 粉色 outline + 2px offset，不使用 `outline: none`。
- 键盘可达：所有交互元素可 Tab 到达；scramble 不阻塞读屏文本。
- 动效降级：`prefers-reduced-motion` 下风暴只渲染静态首帧。
- 移动端：风暴密度减半，隐藏鼠标坐标读数，HUD 只保留顶部状态。

### 4.10 首页构图（ctOS 启动界面）

首页不是常规"左文右卡"，而是一块被监控的视窗：

```
┌──────────────────────────────────────────────────────────────┐
│ 监视轨    │         ASCII 字标（逐字解锁 + 鼠标扰动）   │ 雷达  │
│ CTOS...   │              ID: XRAK                     │ 98%   │
│ 竖向刻度  │        写代码，造系统，记录噪音。          │ 身份  │
│           │        RAK 的个人博客与 Web 中枢           │ 面板  │
│           │        [阅读文章] [关于我]                 │       │
│           │        system.log（滚动状态）              │ 状态  │
├───────────┴──────────────────────────────────────────────┴───────┤
│ POSTS 03 │ NOTES 03 │ PROJECTS 04 │ UPTIME 99.9%               │
└──────────────────────────────────────────────────────────────────┘
```

元素规则：

| 元素 | 行为 | 降级 |
|---|---|---|
| ASCII 字标 | mount 时 900ms 逐字解锁；鼠标 76px 内字符随机化；点击 220ms 全字标 burst | 静态字标 |
| HUD 框角 | 四角细括号 + 左监视轨 + 竖向刻度 | 静态 |
| 雷达 | 6s 旋转扫描 + 粉色/柔粉 blip | 静态 |
| 系统日志 | 每 3.2s 轮换一行状态，带光标 | 固定首行 |
| 扫描带 | 9s 从上到下扫过视窗 | 隐藏 |
| 中央暗角 | 径向渐变压暗字标与正文背后区域，保证可读性 | 保留 |

> 首页隐藏全局底部 HUD，避免与统计条重叠；其他页面保留。

---

## 5. 信息架构

### 5.1 Public

| 路由 | 内容 | 风暴 |
|---|---|---|
| `/` | ASCII 风暴 + 名字/一句话 + 最新文章 + 导航 | full |
| `/posts` | 文章列表：标题、日期、标签、摘要 | medium |
| `/posts/[slug]` | 文章正文、目录、上一篇/下一篇 | low |
| `/notes` | 短笔记流：时间、正文、可选链接 | medium |
| `/projects` | 项目卡片：名称、状态、技术栈、链接 | medium |
| `/about` | 自我介绍、经历、联系方式 | low |

### 5.2 Admin / Hub

| 路由 | 模块 | Phase |
|---|---|---|
| `/admin` | Payload 内容管理 | 1 |
| `/hub` | 中枢仪表盘：系统状态、快捷入口 | 1 |
| `/hub/terminal` | Web 终端（xterm.js + WebSocket） | 2 |
| `/hub/desktop` | noVNC 远程桌面 | 2 |
| `/hub/files` | 文件管理（S3/MinIO） | 2 |
| `/hub/metrics` | CPU/内存/磁盘/网络 | 2 |
| `/hub/audit` | 登录、发布、危险操作日志 | 2 |
| `/hub/tasks` | 定时任务/队列 | 3 |

> 用户已确认目标是"全量中枢"，但工程上仍按 Phase 落地；DESIGN.md 覆盖全量，实施计划按阶段拆分。

---

## 6. 技术栈（已核验）

| 层 | 选型 | 版本基线 | 备注 |
|---|---|---|---|
| 框架 | Next.js App Router | 16.4.x | 本仓库已装 16.4.2 |
| UI | React | 19.3.x | Server Components 默认 |
| 样式 | Tailwind CSS v4（CSS-first） | 4.x | 已装 `@tailwindcss/turbopack` |
| 组件 | shadcn/ui | latest | 通过 CLI 添加，源码进仓库 |
| CMS | Payload CMS 3 | 3.76.x | 3.73+ 官方支持 Next 16 |
| 数据库 | PostgreSQL | 16+ | Payload Postgres adapter |
| 缓存/队列 | Redis | 7+ | 会话、限流、任务队列 |
| 对象存储 | S3 / MinIO | — | 媒体文件 |
| 动画 | motion（Framer Motion） | 12.x | 复杂编排；CSS 能做的优先 CSS |
| ASCII | ascii.rest / React Bits GradientASCII | latest | 现成组件打底，自研 storm 只做组合层 |
| 终端 | xterm.js + WebSocket | 5.x | Phase 2 |
| 远程桌面 | noVNC + websockify | latest | Phase 2 |
| 认证 | Payload Auth | 3.76.x | 单用户 owner |
| 图标 | Lucide | latest | shadcn 默认 |
| 校验 | Zod | 3.x/4.x | 环境变量与表单 |

### 6.1 为什么是 Payload 3 而不是自研 CMS

- 3.73 起官方声明兼容 Next 16，3.76 的 starter 已在 Next 16 上运行。
- 自带 Users / Media / 版本 / 草稿 / REST / GraphQL / Admin UI。
- 与 Next 同进程，`payload.find()` 本地 API 零网络开销。
- 代价：Admin UI 定制受限于 Payload 的主题系统；ctOS 化通过 CSS 变量 + 自定义组件槽（`beforeNav` / `afterNav` / dashboard widgets）实现，不 fork。

### 6.2 为什么 ASCII 风暴仍要自己写一层

现成库解决的是"单块 ASCII 艺术品"：

- `ascii.rest` 提供 239 个无依赖的动画 ASCII 模块；
- `@react-bits/GradientASCII` 提供光标扰动渐变 ASCII 背景；
- `ascii-magic` MCP 用于把图片转成 ASCII 素材（离线生产，不进运行时）。

但"全站分级 + 路由联动 + HUD + 可降级"的组合逻辑没有现成库。我们的 `components/ctos/ascii-storm.tsx` 只做**编排层**：字符集、密度、帧率、暂停、降级，渲染原语尽量复用上述库或保持简单 canvas 实现。

---

## 7. 内容模型（Payload Collections）

### Posts

```ts
{
  title: string
  slug: string            // unique, index
  excerpt: string
  content: richText | mdx // 二选一，首版用 richText
  cover?: Media
  tags: string[]
  publishedAt: date
  status: 'draft' | 'published'
  featured: boolean
}
```

### Notes

```ts
{
  body: richText
  createdAt: date
  tags?: string[]
  link?: string
}
```

### Projects

```ts
{
  name: string
  slug: string
  summary: string
  description: richText
  status: 'active' | 'archived' | 'experiment'
  stack: string[]
  repoUrl?: string
  liveUrl?: string
  cover?: Media
  order: number
}
```

### Media

- S3/MinIO 存储，`imageSizes` 生成 400/800/1600 三档。
- 上传类型白名单：jpg/png/webp/avif/svg。
- SVG 上传按代码处理，禁止脚本。

### Users

- 单用户，`role: 'owner'`。
- 关闭注册；密码 ≥ 16 位；强制 2FA（Phase 2）。

### AuditLog

```ts
{ action, actor, target, ip, userAgent, createdAt, meta }
```

---

## 8. Admin 中枢模块设计

### 8.1 仪表盘 `/hub`

- 系统状态：CPU、内存、磁盘、负载、运行时长。
- 内容状态：草稿数、最近发布、待处理媒体。
- 快捷入口：写文章、终端、桌面、日志。
- 视觉：ctOS 面板 + 低密度风暴 + 实时数字。

### 8.2 终端 `/hub/terminal`

- xterm.js + WebSocket，服务端用 `node-pty` 或独立 `ttyd` 容器。
- 单会话、可复制粘贴、可调整字号。
- 危险命令二次确认由服务端拦截（至少 `rm -rf /`、`dd`、`mkfs`）。

### 8.3 远程桌面 `/hub/desktop`

- noVNC + websockify，目标为 VPS 上的 XFCE 或宿主桌面。
- 仅站主可访问；短期 token；默认只读模式，点击"接管"后才允许输入。
- 移动端提示"建议桌面端使用"。

### 8.4 文件与监控

- 文件：列出、上传、下载、删除（软删除）、预览图片/文本。
- 监控：Prometheus 指标或 `/proc` 采集，SSE 推送，页面不可见时暂停。

### 8.5 审计

- 登录、发布、删除、终端开启、桌面接管、文件删除全部写入 `AuditLog`。
- 保留 90 天，支持按 action/时间筛选。

---

## 9. 性能预算

| 指标 | 目标 |
|---|---|
| LCP（移动 4G） | < 2.0s |
| INP | < 200ms |
| CLS | < 0.05 |
| 首屏 JS（gzip） | < 180KB |
| 风暴 canvas | 桌面 ≤ 2ms/帧，移动 ≤ 4ms/帧 |
| 帧率 | 桌面 30fps 上限，移动 20fps 上限，不可见时 0 |
| 字体 | 首屏只加载 Geist Sans/Mono latin 子集 |

优化手段：

- 风暴组件 `dynamic(() => import(...), { ssr: false })`，不阻塞首屏 HTML。
- 字符网格按设备像素比上限 2 渲染；移动端列数减半。
- 使用 `IntersectionObserver` 与 `visibilitychange` 暂停。
- 图片 `next/image` + AVIF/WebP；文章首图 `priority`，其余懒加载。

---

## 10. 安全

- 全站 HTTPS，HSTS。
- CSP：禁止内联脚本（Next 的 nonce 方案），`connect-src` 仅允许自身与 WebSocket 端点。
- 登录：限流 + 失败延迟 + 可选 TOTP。
- `/hub/*`、`/admin`、`/api/*` 均需 owner 会话。
- 远程桌面/终端使用短期签名 token，token 绑定 IP + UA，5 分钟过期。
- 上传文件类型白名单 + 大小限制 + 病毒扫描（ClamAV，Phase 2）。
- 审计日志不可在前端删除。
- 环境变量用 Zod 在启动时校验，缺失即失败。

---

## 11. 路线图

### Phase 1 — 能看、能写、能发（当前）

- [x] DESIGN.md 与 refs 文档
- [x] shadcn/ui + Tailwind v4 设计令牌
- [x] ASCII 风暴落地页 + HUD + 微交互
- [x] `/posts` `/notes` `/projects` `/about` 骨架
- [ ] Payload 3 + Postgres 接入，Posts/Notes/Projects/Media/Users
- [ ] 单用户登录与 `/hub` 仪表盘骨架

### Phase 2 — 中枢

- [ ] Web 终端（xterm.js）
- [ ] noVNC 远程桌面
- [ ] 文件管理（S3/MinIO）
- [ ] 系统监控
- [ ] 审计日志
- [ ] 2FA

### Phase 3 — 生态

- [ ] 定时任务/队列
- [ ] 多站点/多项目中枢
- [ ] 公开 API 与 Webhook
- [ ] 插件式 hub 模块

---

## 12. 风险与对策

| 风险 | 影响 | 对策 |
|---|---|---|
| Payload 3.76 与 Next 16.4 的边界兼容问题 | 构建/运行时错误 | 先用官方 starter 的最小配置验证；锁定版本；CI 跑 build |
| 全站风暴导致移动端掉帧/耗电 | 体验差、跳出 | 分级 + 降帧 + 静态降级 + 默认移动端 medium |
| Payload Admin UI 难以 ctOS 化 | 后台视觉割裂 | 只定制主题变量与槽位，不 fork；接受"功能区更务实" |
| 远程桌面/终端的安全面 | 服务器被控 | 短期 token、IP 绑定、只读默认、审计、二次确认 |
| 中文字体体积 | LCP 变差 | 不加载全量中文字体，系统栈 + 可选子集 |
| 单应用承载 Public + Hub | 耦合、构建变慢 | 路由分组隔离；Hub 组件独立 chunk；按需加载 |

---

## 13. 验收标准（Phase 1）

1. `pnpm build` 与 `pnpm lint` 通过。
2. 桌面与移动端首屏均能看到 ASCII 风暴，且滚动/路由切换不卡顿。
3. `prefers-reduced-motion` 下无持续动画，内容完整可读。
4. `/posts` `/notes` `/projects` `/about` 可导航，键盘焦点可见。
5. 文章页正文对比度达到 WCAG AA。
6. `/admin` 可登录并创建一篇草稿；公开站能读到已发布内容。
7. Lighthouse 移动端 Performance ≥ 85，Accessibility ≥ 95。

---

## 14. 参考文档

- `docs/refs/design-inspiration.md` — 设计灵感站与方法论
- `docs/refs/ascii-tooling.md` — ASCII 艺术工具链
- `docs/refs/design-skills.md` — 可复用设计技能与仓库
- `docs/refs/tech-stack.md` — 技术栈核验与安装路径
