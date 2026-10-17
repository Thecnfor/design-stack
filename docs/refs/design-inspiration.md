# 设计灵感与参考体系

> 用途：在动手前快速找到"对标物"，避免凭感觉设计。
> 原则：**看结构，不抄皮肤**。提取的是层级、间距、节奏、交互模式，不是像素级复刻。

---

## 1. 设计系统样本库（AI 可读）

| 站点 | 提供什么 | 怎么用 | 核验 |
|---|---|---|---|
| [styles.refero.design](https://styles.refero.design) | 2000+ 真实产品网站拆解出的设计系统，含配色、字体、间距、组件，并提供 **DESIGN.md**；支持 MCP | 找 Linear / Vercel / Figma / Cursor / OpenAI 等对标物；下载 DESIGN.md 喂给编码 agent | ✅ 已核验 |
| [designmd.me](https://designmd.me) | 输入任意网址，反向生成 DESIGN.md（颜色、字体、间距、圆角、阴影、断点、组件 token）+ HTML 预览 + Figma 导入 | 选 2–3 个参考站，生成 token 后做差异对比，提炼我们自己的 token | ✅ 已核验 |
| [open-design.ai](https://open-design.ai) | 开源（Apache-2.0）设计工作台，150+ 开源设计系统，prompt → 可运行 HTML 原型 | 需要快速试布局时用；也可作为设计系统来源 | ✅ 已核验 |
| [designmd.supply](https://designmd.supply) | DESIGN.md 资源集合 | 找现成 DESIGN.md 模板 | 待核验 |
| [getdesign.md](https://getdesign.md) | DESIGN.md 相关工具/资源 | 同上 | 待核验 |
| [design-md.hyperbrowser.ai](https://design-md.hyperbrowser.ai) | 浏览器驱动的设计系统提取 | 需要抓取动态站点样式时用 | 待核验 |
| [typeui.sh](https://typeui.sh) | 字体/排版方向参考 | 定字体尺度与配对 | ⚠️ 本次请求被限流，未完成核验 |
| [aura.build](https://aura.build) | AI UI/落地页生成 | 只用于找布局灵感，不直接采用生成结果 | 待核验 |
| [neuform.ai](https://neuform.ai) | AI 表单/界面生成 | 表单与后台界面参考 | 待核验 |

## 2. 视觉灵感画廊

| 站点 | 侧重 | 用法 |
|---|---|---|
| [posts.design](http://posts.design) | 海报/版式/字体实验 | 提取标题排版、网格、留白节奏 |
| [designbookmark.com](http://designbookmark.com) | 设计书签合集 | 找同类个人站/作品集 |
| [deck.gallery](http://deck.gallery) | 演示文稿版式 | 提取信息层级与分屏节奏，用于项目页 |
| [logosystem.co](http://logosystem.co) | Logo 与品牌系统 | 个人标识、字标（wordmark）方向 |
| [visualjournal.it](http://visualjournal.it) | 视觉日记/编辑设计 | 文章页的编辑感排版 |
| [brandguidelines.net](http://brandguidelines.net) | 品牌规范 | 学习如何写"约束"而不是"风格" |
| [recent.design](http://recent.design) | 近期设计作品流 | 保持对当前审美的敏感度 |
| [noiced.com](http://noiced.com) | 设计灵感/作品 | 同上 |

## 3. 动效与图标（不造轮子）

| 资源 | 提供什么 | 用法 |
|---|---|---|
| [lucide-animated.com](https://lucide-animated.com) | Lucide 图标的动画版 | 导航/状态图标；与 shadcn 默认 Lucide 同源 |
| [lordicon.com](https://lordicon.com) | 高质量动画图标（Lottie） | 空状态、成功/失败反馈 |
| [flaticon.com/animated-icons](https://www.flaticon.com/animated-icons) | 动画图标库 | 备选；注意授权 |
| [allsvgicons.com](https://allsvgicons.com) | SVG 图标集合 | 静态图标补充 |
| [useanimations.com](https://useanimations.com) | 免费动画图标 | 轻量交互反馈 |
| [svgator.com](https://svgator.com) | SVG 动画编辑器 | 需要定制矢量动画时使用 |

**使用边界**：图标动画只用于反馈与状态，不用于装饰性循环播放；首屏不加载大型 Lottie。

## 4. 提取方法（每次找参考都跑一遍）

1. **截图**：桌面 1440、移动 390 各一张。
2. **拆层级**：一屏最多几个视觉层级？标题/正文/元信息各占多少？
3. **量间距**：记录 3 个关键间距（区块、卡片、行内），换算成 8px 网格。
4. **记交互**：hover、focus、切换、加载各是什么反馈？时长多少？
5. **写一句结论**：这个参考解决了我们的什么问题？（例："文章列表用分隔线而非卡片，降低视觉噪声"）
6. **落到 token**：只把可复用的部分写进 `DESIGN.md`，不复制具体品牌色。

## 5. 本项目已确定的对标

| 维度 | 对标 | 取什么 | 不取什么 |
|---|---|---|---|
| 整体秩序 | Vercel | 黑白灰、精确间距、克制动效 | 极简到没有性格 |
| 信息密度 | Linear | 列表节奏、键盘优先、细节反馈 | 产品化的复杂侧栏 |
| 氛围 | Watch Dogs / ctOS | 字符风暴、HUD、扫描/锁定 | 游戏 UI 的拟物装饰 |
| 组件 | shadcn/ui | 可读源码、可组合、无障碍 | 默认主题的"AI 味" |
| ASCII | ascii.rest / React Bits | 现成动画原语 | 全屏重型 WebGL |
