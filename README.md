# design-stack

可复用的设计技能、参考体系与安装脚本。目标：换一台机器，一条命令恢复设计工作流。

> 目前服务于 [rak-blog](https://github.com/Thecnfor) 的 ctOS ASCII 视觉系统，也适用于任何深色、字符化、HUD 风格的前端项目。

## 内容

| 技能 | 用途 |
|---|---|
| [`ctos-ui`](./skills/ctos-ui/SKILL.md) | ctOS / Watch Dogs 风格视觉语言：信号色、HUD、扫描线、锁定框、glitch |
| [`ascii-storm`](./skills/ascii-storm/SKILL.md) | 分级 ASCII 风暴：Canvas 编排、性能、降级、移动端 |
| [`shadcn-conventions`](./skills/shadcn-conventions/SKILL.md) | shadcn/ui + Tailwind v4 的初始化、组件、registry 校验约定 |
| [`find-design`](./skills/find-design/SKILL.md) | 设计参考检索工作流：从灵感站到 DESIGN.md token |
| [`design-md`](./skills/design-md/SKILL.md) | 如何写一份可执行的 DESIGN.md |

另含：

- `agents/design-reviewer.md` — 设计审查 agent
- `docs/refs/` — 灵感站、ASCII 工具链、技能清单、技术栈核验
- `install.sh` — 将技能软链接到 `~/.claude/skills`

## 安装

```bash
git clone https://github.com/Thecnfor/design-stack.git
cd design-stack
./install.sh
```

默认链接到 `~/.claude/skills`，可用环境变量覆盖：

```bash
CLAUDE_SKILLS_DIR=~/.agents/skills ./install.sh
```

## 外部工具（按需安装，脚本不自动执行网络安装）

```bash
# ascii.rest — 动画 ASCII 作品
npx ascii.rest list

# React Bits — GradientASCII
npx shadcn@latest add @react-bits/GradientASCII-TS-TW

# shadcn registry 校验
npx shadcn@latest registry validate

# AntiSlop — Rust 代码扫描 CLI（不是设计 skill）
brew install skew202/tap/antislop
```

ASCII Magic MCP：

```bash
claude mcp add --transport http ascii-magic https://www.ascii-magic.com/mcp
```

## 设计原则

1. 风暴是背景，内容永远是前景。
2. 静止时安静，交互时爆发。
3. 同一个世界，不同强度。
4. 组件先于页面。
5. 可降级是一等公民。
6. 中文优先。

## 核验状态

链接与版本核验于 2026-10-17。`docs/refs/` 中标注「待核验」的条目只作为候选，不写进关键路径。

## License

MIT
