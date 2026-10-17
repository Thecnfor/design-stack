# 可复用设计技能与工具

> 目标：把"设计能力"变成可安装、可版本化的资产，换机器一条命令恢复。
> 仓库：`Thecnfor/design-stack`（公开）

---

## 1. 本机已具备的技能

以下技能已安装在当前 Claude Code 环境中，可直接调用：

| 技能 | 作用 | 与本项目的关系 |
|---|---|---|
| `design-taste-frontend` | 反模板化前端设计，先读 brief 再定方向 | 落地页与内容页的审美把关 |
| `impeccable` | 设计/重构/审查/打磨前端界面 | 视觉验收、响应式、可访问性 |
| `baseline-ui` | 快速清理间距、层级、排版、布局 | 上线前的 UI 去噪 |
| `frontend-design` | 生成有辨识度的生产级界面 | 组件与页面实现 |
| `ui-theme-designer` | 设计 token / 主题系统 | ctOS token 与暗色主题 |
| `dataviz` | 图表与数据可视化规范 | Hub 仪表盘、监控图表 |
| `find-skills` | 发现并安装新技能 | 扩展 design-stack |

**原则**：先调用已有技能，不重复造同类 skill。

---

## 2. 需要纳入 design-stack 的外部工具

### OpenUI

存在多个同名项目，按用途区分：

| 项目 | 定位 | 仓库 |
|---|---|---|
| wandb/openui | 用自然语言描述 UI，实时渲染 | <https://github.com/wandb/openui> |
| thesysdev/openui | 生成式 UI 框架/协议 | <https://github.com/thesysdev/openui> |
| GC-0719/openUI | 本地设计系统驱动的 AI 前端工作室 | <https://github.com/GC-0719/openUI> |

**纳入方式**：不复制源码，记录用途与安装命令；需要时按上游 README 安装。避免把第三方代码直接 vendor 进技能仓库导致许可证与升级问题。

### shadcn CLI / registry 校验

- 官方文档：<https://ui.shadcn.com/docs/registry/api-reference>
- 2026-05 起支持 registry include 与 validate：<https://ui.shadcn.com/docs/changelog/2026-05-registry-include>
- 本项目用法：

```bash
# 初始化（Next 16 + Tailwind v4）
pnpm dlx shadcn@latest init

# 添加组件
pnpm dlx shadcn@latest add button badge card separator input textarea tabs

# 校验 registry（如果发布自己的组件源）
pnpm dlx shadcn@latest registry validate
```

**"shadcn/lint" 的准确含义**：官方提供的是 **registry 校验**（schema/依赖/路径），不是通用 CSS lint。样式规范交给 `baseline-ui`、`impeccable` 和 ESLint。

### AntiSlop

- 文档：<https://skew202.github.io/antislop/>
- 仓库：<https://github.com/skew202/antislop>
- 定位：**Rust 编写的代码扫描/优化 CLI**（AST + regex），不是设计 skill。
- 安装：

```bash
# Linux/macOS
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/skew202/antislop/releases/latest/download/antislop-installer.sh | sh

# Homebrew
brew install skew202/tap/antislop

# Cargo
cargo install antislop
```

**边界**：它解决代码层面的冗余/体积问题；"设计反 slop"由 `design-taste-frontend` 与 `impeccable` 负责。两者不要混为一谈。

### 图标动画

| 资源 | 交付形态 | 纳入方式 |
|---|---|---|
| lucide-animated.com | React 组件 | 复制单个组件或按其文档安装 |
| lordicon.com | Lottie JSON | 下载素材放 `public/`，运行时用 lottie-react |
| useanimations.com | Lottie/SVG | 同上 |
| svgator.com | SVG 动画导出 | 定制动画时使用 |

---

## 3. design-stack 仓库结构

```
design-stack/
├─ README.md
├─ install.sh                 # 一键安装/链接到 ~/.claude/skills
├─ skills/
│  ├─ ctos-ui/                # 本项目视觉语言（token、HUD、glitch、storm）
│  │  ├─ SKILL.md
│  │  └─ references/
│  ├─ ascii-storm/            # ASCII 风暴编排规范与代码骨架
│  │  ├─ SKILL.md
│  │  └─ references/
│  ├─ shadcn-conventions/     # shadcn 使用与 registry 校验约定
│  │  └─ SKILL.md
│  └─ find-design/            # 设计参考检索工作流
│     └─ SKILL.md
├─ agents/
│  └─ design-reviewer.md
└─ docs/
   └─ refs/                   # 与本仓库 docs/refs 同步
```

### 安装方式

```bash
git clone https://github.com/Thecnfor/design-stack.git
cd design-stack
./install.sh
```

`install.sh` 只做两件事：

1. 把 `skills/*` 软链接到 `~/.claude/skills/`；
2. 打印外部工具的安装命令，不自动执行网络安装。

---

## 4. 新技能准入标准

一个技能要进 design-stack，必须满足：

- [ ] 解决一个**重复出现**的问题，而不是一次性任务。
- [ ] 有明确的触发条件（description 可被 agent 判断）。
- [ ] 有可验证的产出（文件、命令、检查清单）。
- [ ] 不复制第三方源码；只写用法、约束、适配层。
- [ ] 许可证兼容（MIT/Apache-2.0 优先）。

---

## 5. 使用顺序

```
找方向   → find-design / 设计灵感站
定系统   → ui-theme-designer + DESIGN.md
写界面   → shadcn/ui + frontend-design
去 slop  → design-taste-frontend + impeccable
收尾     → baseline-ui
代码扫描 → antislop（可选）
```
