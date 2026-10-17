---
name: shadcn-conventions
description: Use when initializing shadcn/ui in a Next.js project, adding components via the CLI, theming with Tailwind CSS v4, or validating a shadcn registry. Covers the 2026 CLI presets (Nova), Radix/Base/Aria bases, Tailwind v4 CSS-first tokens, and component ownership rules.
---

# shadcn/ui Conventions

shadcn/ui is source code you own, not a dependency you import. Add components via the CLI, then edit them.

## Init (Next.js 16 + Tailwind v4)

```bash
pnpm dlx shadcn@latest init -t next -b radix -p nova -y --css-variables
```

- `-b radix` uses the classic Radix primitives. Use `base` (Base UI) or `aria` only when the project already standardized on them.
- `-p nova` is the Lucide + Geist preset; it matches Vercel/Linear-style projects.
- `--css-variables` is required for token-driven theming.
- `init` rewrites `app/globals.css`, `components.json`, and adds `components/ui/button.tsx` + `lib/utils.ts`. Commit before running.

## Add components

```bash
pnpm dlx shadcn@latest add badge card separator input textarea tabs dropdown-menu
```

Rules:

1. Add only components you use. Each one is code in your repo.
2. Restyle via CSS variables in `globals.css`, not by editing every component.
3. Keep the `data-slot` attributes; they are used by variants and tests.
4. New shadcn versions import `cn` from the `cn` package. Older setups use `@/lib/utils`. Do not mix.
5. The new Button uses `radix-ui`'s `Slot.Root` for `asChild`.

## Tailwind v4 theming

- No `tailwind.config.ts`. Tokens live in CSS.
- Map runtime variables into Tailwind with `@theme inline`.
- Define `:root` and `.dark` separately if you support both; a dark-only app can put dark values in `:root` and add `color-scheme: dark`.
- Use `oklch()` or hex consistently; do not mix color spaces within one scale.

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-ring: var(--ring);
  --font-sans: var(--font-geist-sans), "PingFang SC", sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
}
```

## Registry validation

When publishing your own registry or components:

```bash
pnpm dlx shadcn@latest registry validate
```

This validates schema, paths, and dependency resolution. It is **not** a general CSS/ESLint pass. For style quality use `baseline-ui`, `impeccable`, or `design-taste-frontend`.

## Next.js 16 notes

- `layout.tsx` may use generated `LayoutProps<"/">`. Keep it.
- Dynamic pages should use `PageProps<"/route/[slug]">` and `await params`.
- If a route reads `params` and Next 16 reports `instant-shell-url-data`, either wrap URL-dependent UI in `<Suspense>` or declare `export const instant = false` for a blocking route.
- Add `data-scroll-behavior="smooth"` to `<html>` if you use `scroll-behavior: smooth`, otherwise Next warns during route transitions.

## Anti-patterns

- Copy-pasting component code from a blog instead of the CLI.
- Forking a component to change one color; change the token.
- Installing a second UI kit next to shadcn.
- Adding all components "just in case".
- Editing generated `components/ui/*` in ways that make future `add` updates conflict.
