---
name: ascii-storm
description: Use when building a tiered animated ASCII storm, digital-rain, or character-grid background for a web app. Covers Canvas orchestration, density tiers, pause/visibility handling, reduced-motion fallback, mobile throttling, and integrating ascii.rest or React Bits instead of writing a renderer from scratch.
---

# ASCII Storm

A thin orchestration layer over an existing ASCII renderer. Never write a full character renderer from scratch if `ascii.rest` or React Bits fits.

## Architecture

```
data-storm attribute (full | medium | low | hud | off)
        │
        ▼
<AsciiStorm />  (client component, fixed, aria-hidden, pointer-events-none)
        │
        ├─ density / fps / trail / streams from a config table
        ├─ requestAnimationFrame loop (throttled by fps)
        ├─ visibility + reduced-motion + resize handling
        └─ optional ascii.rest piece or React Bits GradientASCII
```

Set the tier on the root element from the route:

```ts
function stormForPath(pathname: string) {
  if (pathname === "/") return "full";
  if (pathname === "/about") return "low";
  if (pathname.startsWith("/posts/")) return "low";
  if (pathname.startsWith("/posts") || pathname.startsWith("/notes") || pathname.startsWith("/projects")) return "medium";
  if (pathname.startsWith("/admin") || pathname.startsWith("/hub")) return "hud";
  return "low";
}
```

A client provider updates `document.documentElement.dataset.storm` on pathname change. The canvas observes the attribute with `MutationObserver`.

## Tier config

| Tier | Cell | Alpha | FPS | Trail | Streams | Pulse |
|---|---|---|---|---|---|---|
| full | 22px | 0.22 | 24 | 9 | 1 | yes |
| medium | 40px | 0.12 | 18 | 6 | 1 | no |
| low | 72px | 0.06 | 10 | 4 | 1 | no |
| hud | 48px | 0.08 | 10 | 5 | 1 | light |
| off | 72px | 0.04 | 1 | 3 | 1 | no |

Mobile: multiply cell by 1.6, force one stream, cap FPS at 18.

## Implementation rules

1. **Canvas, not DOM.** One `<canvas>` with `ctx.fillText`; never one element per glyph.
2. **Explicit trails.** Clear each frame and draw N glyphs behind each head with decreasing alpha. Do not rely on translucent fills that accumulate over the page background.
3. **DPR cap 2.** `canvas.width = width * min(dpr, 2)`.
4. **Throttle by timestamp.** Run rAF but skip painting until `1000 / fps` has elapsed.
5. **Pause on `document.hidden`.** Cancel rAF; restart on visible.
6. **Rebuild on resize and on tier change.** Recompute columns, font size, and canvas dimensions.
7. **Reduced motion:** draw one static frame and return; no rAF.
8. **Accessibility:** `aria-hidden="true"`; canvas is fixed, `pointer-events-none`, behind content (`z-0`), content at `z-10`.
9. **Readability:** body text must sit on a surface or vignette; never let dense glyphs run through paragraphs.
10. **Color semantics:** warm white/gray body, rare pink heads at ~4–6% probability. No multicolor rainbow, no bright green.

## Skeleton

See `references/storm-skeleton.tsx` for a complete client component. It implements tiers, two streams, pulse, DPR, visibility pause, reduced motion, resize, and a `MutationObserver` on `data-storm`.

## Using libraries instead

- `ascii.rest`: `import { Ascii } from "ascii.rest/react"` and render `<Ascii piece="..." />`. Use for hero set pieces, 404s, empty states.
- React Bits: `npx shadcn@latest add @react-bits/GradientASCII-TS-TW`. Use when you want cursor-reactive gradient ASCII without a custom loop.
- ASCII Magic MCP: generate static ASCII art from images offline, store in `public/ascii/`.

## Pitfalls

- Drawing one stream per column makes the storm look like sparse vertical dashes. Use 2 streams at full/hud intensity.
- A route-glitch overlay that animates but never fades out will permanently tint the page. End at `opacity: 0`; keep `pointer-events: none`.
- `prefers-reduced-motion` must be read at mount and on change; a single initial check misses users who toggle it.
- Mobile at full density drains battery. Throttle FPS and streams, not just alpha.
- Don't put the canvas above content. It must never intercept pointer events or reduce text contrast.
