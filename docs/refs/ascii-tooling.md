# ASCII 艺术工具链

> 目标：用现成库生成/播放 ASCII，不自己写字符渲染引擎。
> 运行时分三层：**素材层（离线）→ 播放层（现成库）→ 编排层（自研，薄）**。

---

## 1. 运行时播放（优先用这些）

### ascii.rest

- 站点：<https://ascii.rest/>
- 内容：239 个动画 ASCII 作品（34 个全彩场景、UI 组件、数据可视化、字体效果、Logo、3D 形状、物理模拟、生物）。
- 形态：每个作品是一个**无依赖的 TypeScript 模块**，MIT 许可。
- 接入方式：

```bash
# 直接跑一个
npx ascii.rest donut
npx ascii.rest list

# 安装
pnpm add ascii.rest
```

```tsx
// React / Next.js
import { Ascii } from "ascii.rest/react";

export function Hero() {
  return <Ascii piece="donut" />;
}
```

```html
<!-- 纯 HTML -->
<script type="module" src="https://ascii.rest/ascii.js"></script>
<ascii-art piece="donut"></ascii-art>
```

- 其他入口：`ascii.rest/astro`（SSR 首帧）、`ascii.rest/pieces`（按需引入）、`ascii.rest/terminal`（终端 splash）。
- Agent skill：`npx skills add bas3line/ascii`，把每个作品的用法装进 Claude Code / Cursor / Codex。
- 降级：页面不可见时暂停；`prefers-reduced-motion` 下只保留首帧（库已处理）。

**本项目用法**：落地页的"风暴脉冲"可以直接复用其中的粒子/噪声类作品；文章页的 404、空状态用小型作品。

### React Bits — Gradient ASCII

- 页面：<https://reactbits.dev/backgrounds/gradient-ascii>
- 内容：用 ASCII 字符渲染柔和渐变光晕，**光标经过时字符会 scramble**。
- 安装（shadcn registry）：

```bash
npx shadcn@latest add @react-bits/GradientASCII-TS-TW
```

- 源码：<https://github.com/DavidHDev/react-bits>
- 变体：JS/TS × CSS/Tailwind。

**本项目用法**：作为 `/posts`、`/projects` 页面的 30% 强度背景；它的"光标扰动"正好对应 ctOS 的交互爆发。

### 自研编排层（唯一要自己写的部分）

`components/ctos/ascii-storm.tsx` 只负责：

- 读取 `data-storm` 强度；
- 选择字符集、密度、帧率；
- 页面不可见/降级时暂停；
- 组合 `ascii.rest` 作品或轻量 canvas 字符雨。

不重写字符渲染算法。

---

## 2. 离线素材生产

### ASCII Magic MCP

- 站点：<https://ascii-magic.com/mcp-server>
- 能力：把图片转成 ASCII、halftone、LEGO、voxel 等 100+ 风格；返回下载链接。
- 接入 Claude Code：

```bash
claude mcp add --transport http ascii-magic https://www.ascii-magic.com/mcp
# 然后在 Claude Code 里 /mcp → Authenticate
```

- 工具：`stylize_image`、`suggest_styles`、`list_styles`、`create_upload`、`encode_recipe`、`decode_recipe`、`account_status`。
- 限制：云端服务，接受图片 URL；上传文件仅 Claude Code 可用；免费账号 15 种风格；下载链接 24 小时有效。

**本项目用法**：把头像、项目截图、文章封面转成 ASCII 版本，作为静态素材放进 `public/ascii/`，不进运行时依赖。

### ASC11

- 站点：<https://asc11.com/>
- 定位：图片与视频转 ASCII 的生成器。
- 核验状态：页面仅返回标题，具体 API/导出能力待核验。作为备选，不写进关键路径。

### ascii-magic.com 之外的选择

| 工具 | 用途 | 备注 |
|---|---|---|
| `figlet` / `toilet` | 生成 ASCII 大字标题 | 适合离线生成后作为静态文本 |
| `chafa` | 终端图片转 ASCII | Linux 下批量生成素材 |
| `jp2a` | 图片转 ASCII | 轻量、可脚本化 |

---

## 3. 字符集与美学约定

### 风暴字符集

```
主雨幕： 01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ
HUD：    . : ; + = - / \ | [ ] { } < > ( ) # %
块元素：  ░ ▒ ▓ █ ▄ ▀ ▌ ▐
中文注：  风 暴 信 号 连 接 锁 定 目 标
```

规则：

- 雨幕以半角片假名 + 数字为主，保证等宽与密度。
- HUD 只用 ASCII 可打印字符，不用 emoji。
- 中文只出现在"被锁定/被识别的目标"上，数量极少，形成语义高光。
- 颜色只用 token：青绿 = 信号，琥珀 = 注意，红 = 危险。

### 密度与帧率

| 强度 | 列密度 | 帧率 | 字符寿命 |
|---|---|---|---|
| full | 1 列 / 18px | 30fps | 1.5–4s |
| medium | 1 列 / 40px | 20fps | 2–5s |
| low | 1 列 / 80px | 12fps | 3–7s |
| hud | 静态网格 + 偶发脉冲 | 12fps | — |
| off | 单帧 | 0 | — |

---

## 4. 性能与降级清单

- [ ] canvas 尺寸按 `devicePixelRatio` 上限 2。
- [ ] 移动端列数减半、帧率上限 20。
- [ ] `document.visibilitychange` 暂停 rAF。
- [ ] `IntersectionObserver` 离开视口暂停。
- [ ] `prefers-reduced-motion: reduce` → 渲染静态首帧。
- [ ] 首屏不加载大型 ASCII 组件：`dynamic(..., { ssr: false })`。
- [ ] 提供 `aria-hidden="true"`，风暴不进入无障碍树。
- [ ] 正文区域永远覆盖不透明或高不透明度背景，风暴不穿透文字。

---

## 5. 参考实现路径（按优先级）

1. `ascii.rest` 的 React 组件直接嵌入（最快）。
2. React Bits GradientASCII（需要光标扰动时）。
3. 轻量 canvas 字符雨（需要完全控制分级/暂停时）。
4. 静态 ASCII 文本（降级/SSR 首帧）。

> 任何情况下都不要引入 Three.js / WebGL 只为做字符雨。
