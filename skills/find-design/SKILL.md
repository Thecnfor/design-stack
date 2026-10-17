---
name: find-design
description: Use when you need design references before building or redesigning UI, want to extract a DESIGN.md/token set from a real product, or need to escape generic AI aesthetics. Covers design-system galleries, inspiration archives, icon/animation sources, and a repeatable extraction workflow.
---

# Find Design

Do not start from a blank canvas. Find 2–3 concrete references, extract structure, then write your own tokens.

## Source map

### Design-system extractors (AI-readable)

| Source | Use | Status |
|---|---|---|
| https://styles.refero.design | 2,000+ real product design systems with DESIGN.md; MCP available | verified |
| https://designmd.me | URL → DESIGN.md tokens + HTML preview + Figma | verified |
| https://open-design.ai | 150+ open-source design systems, prompt → prototype | verified |
| https://designmd.supply | DESIGN.md collection | unverified |
| https://getdesign.md | DESIGN.md tools | unverified |
| https://design-md.hyperbrowser.ai | browser-driven extraction | unverified |
| https://typeui.sh | typography direction | rate-limited at check |
| https://aura.build | AI landing-page layouts | unverified |
| https://neuform.ai | AI form/interface generation | unverified |

### Inspiration galleries

- https://posts.design — posters, type, grid
- https://designbookmark.com — curated bookmarks
- https://deck.gallery — deck layouts and hierarchy
- https://logosystem.co — logo and wordmark systems
- https://visualjournal.it — editorial design
- https://brandguidelines.net — brand constraints
- https://recent.design — recent work feed
- https://noiced.com — design inspiration

### Icon and motion sources

- https://lucide-animated.com — animated Lucide icons
- https://lordicon.com — Lottie icon library
- https://www.flaticon.com/animated-icons — animated icons
- https://allsvgicons.com — SVG icon sets
- https://useanimations.com — free animated icons
- https://svgator.com — SVG animation editor

## Extraction workflow

1. **Capture** desktop 1440 and mobile 390 screenshots.
2. **Hierarchy** — how many levels fit on one screen? What is primary/secondary/meta?
3. **Spacing** — record three key gaps (section, card, inline) and snap to an 8px grid.
4. **Type** — record display/body/meta sizes, line heights, max measure.
5. **Interaction** — hover, focus, transition, loading. Record duration and easing.
6. **Write one sentence** — what problem does this reference solve for us?
7. **Tokenize** — write only reusable decisions into DESIGN.md; never copy a brand color verbatim.

## Rules

- Extract structure, not skin. If the result is recognizable as the source brand, you copied too much.
- Prefer sources with real product UI over dribbble-style shots.
- Verify links before putting them in a critical path; mark unverified sources explicitly.
- Use at most three references per project. More becomes noise.
- Feed the final DESIGN.md to the coding agent, not the raw screenshots.
