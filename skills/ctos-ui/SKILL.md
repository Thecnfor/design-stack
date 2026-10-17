---
name: ctos-ui
description: Use when designing or implementing ctOS / Watch Dogs style dark interfaces with ASCII storm backgrounds, HUD chrome, signal colors, scanlines, target lock-on, or restrained glitch micro-interactions. Also use when reviewing a dark tech UI for "AI slop" or generic neon cyberpunk.
---

# ctOS UI

A visual language for interfaces that feel like a data layer over reality: restrained, legible, and alive only when touched.

## Core idea

ctOS is not neon cyberpunk. It is:

- **Near-black + warm white + one restrained pink.** Pink marks focus, punctuation, status dots, radar sweeps, and very few storm glyphs. Nothing else is colored.
- **Character grid as structure.** ASCII is a material, not a skin. Align it to the same 8px grid as body copy.
- **Quiet at rest, loud on interaction.** Ambient scanlines and occasional glitches are low intensity. Hover, focus, and route changes trigger the burst.
- **Precision over decoration.** Thin borders, small radii, monospace metadata, minimal shadows.

## Non-negotiables

1. Body text contrast ≥ WCAG AA (4.5:1). Signal colors never carry paragraphs.
2. `prefers-reduced-motion: reduce` freezes all ambient animation and skips scrambles.
3. Every interactive element has a visible 2px focus ring (`--ring`), never `outline: none`.
4. ASCII effects are `aria-hidden`; the real text stays in the accessibility tree.
5. No mouse-only information. Coordinate readouts are desktop-only garnish.

## Tokens

Use CSS variables, not hard-coded hex values in components.

```css
:root {
  --ctos-bg: #08070a;
  --ctos-surface: #0e0c10;
  --ctos-elevated: #141117;
  --ctos-border: #282229;
  --ctos-border-hi: #453a44;
  --ctos-fg: #f5f2f4;
  --ctos-fg-muted: #9a8e95;
  --ctos-fg-dim: #6b5f67;
  --ctos-pink: #efa9c2;
  --ctos-pink-soft: #c77e99;
  --ctos-red: #ff6b8a;
  --ctos-grid: rgba(242, 167, 195, 0.05);
}
```

Semantics:

| Token | Meaning | Allowed uses |
|---|---|---|
| pink | accent / focus / current | focus ring, active nav, punctuation, status dot, radar sweep, rare storm glyph |
| pink-soft | secondary accent | experiment status, secondary markers |
| red-pink | danger | errors, delete, alert |
| warm white | content | headings, body, primary button fill |

Pink is an accent, not a fill. Never use it for paragraphs, button backgrounds, or large surfaces.

## Typography

- Latin UI: Geist Sans. Mono/HUD: Geist Mono.
- Chinese body: system stack (`PingFang SC`, `Noto Sans CJK SC`, `Microsoft YaHei`). Do not ship a full CJK webfont for body copy.
- Body 16–17px / line-height 1.8–1.9 for Chinese. Max width 68ch.
- Metadata: 10–12px mono, uppercase, letter-spacing 0.18em.

## Motion

| Interaction | Duration | Behavior |
|---|---|---|
| text scramble | 240–420ms | random glyphs resolve to final text; preserve width with a hidden ghost |
| target lock | 160ms | four corner brackets fade in on hover/focus |
| route glitch | 80–240ms | brief chromatic shift + 1px displacement, then opacity 0 |
| storm pulse | 600–1200ms | low-frequency density/brightness rise, 8–20s apart |
| panel reveal | 180ms | opacity + 4px translate |

Rules:

- Animate `transform` and `opacity`; never layout properties.
- The route-glitch overlay must end at `opacity: 0` and stay `pointer-events: none`.
- Pause ambient animation on `document.hidden`.

## Components to build (not libraries)

These are small, project-specific compositions. Keep them thin:

- `HudChrome` — fixed bottom/top metadata: path, time, coordinates, status.
- `ScrambleText` — hover/focus text scramble with reserved width.
- `TargetLink` — link/card with four-corner lock-on.
- `AsciiStorm` — see the `ascii-storm` skill.
- `SignalBadge` — status pill using the semantic colors.

Use shadcn/ui for the structural layer (Button, Badge, Card, Separator, Input, Tabs) and restyle via tokens.

## Landing hero (ctOS boot screen)

Do not build a conventional "left text / right card" hero. Build a monitored viewport:

```
┌──────────────────────────────────────────────────────────────┐
│ left rail │      ASCII wordmark + tagline + log      │ radar │
│ vertical  │      (center-aligned, character grid)    │ panel │
├───────────┴──────────────────────────────────────────────┴───────┤
│ POSTS │ NOTES │ PROJECTS │ UPTIME                              │
└──────────────────────────────────────────────────────────────────┘
```

- Three columns: 64px rail, flexible center, 300px instrument panel.
- Thin HUD frame with four corner brackets and a 9s vertical scan sweep.
- Center: ASCII wordmark with a 900ms reveal, pointer-proximity scramble (76px radius), and click burst; tagline; CTAs; a compact `system.log`.
- Right: radar (6s sweep), identity panel, `storm // full` readout.
- Bottom: four telemetry cells with tiny bar charts.
- Add a radial vignette behind the wordmark and text so the storm never harms readability.
- Hide the global bottom HUD on the home route; the hero has its own telemetry strip.

Reference implementations: `references/ascii-wordmark.tsx`, `references/system-log.tsx`, `references/radar.tsx`.

## Review checklist

- [ ] Pink is used only as an accent (focus, punctuation, small status marks); no large pink fills.
- [ ] Only semantic colors are used; no purple neon or multicolor glow.
- [ ] Text remains readable with the storm at full intensity.
- [ ] Focus states are visible on every link, button, and card.
- [ ] Reduced-motion mode is static and complete.
- [ ] HUD is `aria-hidden` and does not trap pointer events.
- [ ] Mobile hides coordinate readouts and lowers storm density.
- [ ] No permanent glitch/scanline overlay remains in the DOM after animation.

See `references/tokens.css` for a copy-paste token block.
