---
name: design-md
description: Use when writing a DESIGN.md specification for a new product or redesign. Produces an agent-readable document covering positioning, principles, visual tokens, typography, motion, information architecture, tech stack, content model, performance budgets, security, roadmap, and acceptance criteria.
---

# DESIGN.md

A DESIGN.md is the single source of truth an agent reads before writing UI. It must be concrete enough to implement and short enough to stay true.

## Required sections

1. **Positioning** — who it serves, what it is, what it is not.
2. **Principles** — 4–6 rules that resolve trade-offs.
3. **Architecture** — route groups, surfaces, auth boundaries.
4. **Visual system** — concept, color tokens, type scale, grid, radii, elevation.
5. **Motion** — durations, easings, interaction inventory, degradation.
6. **Information architecture** — every route and its purpose.
7. **Tech stack** — verified versions and why each choice was made.
8. **Content model** — collections/fields, required vs optional.
9. **Performance budgets** — LCP, INP, CLS, JS size, frame budget.
10. **Security** — auth, rate limits, tokens, upload rules, audit.
11. **Roadmap** — phases, each independently shippable.
12. **Risks** — impact and mitigation.
13. **Acceptance criteria** — testable, not aspirational.

## Quality bar

- Every color has a semantic role, not just a hex value.
- Every motion has a duration and a reduced-motion behavior.
- Every route has an access rule and a visual intensity.
- Every version claim is verified or marked as a risk.
- Phase 1 is shippable on its own; later phases do not block it.
- No "TBD" and no vague adjectives like "modern" or "delightful" without a concrete rule.

## Template

See `references/template.md` for a fill-in skeleton.

## Common failure modes

- A mood board instead of a spec.
- Tokens copied from a reference brand, producing a clone.
- Motion described but no degradation path.
- Roadmap where Phase 1 depends on Phase 3.
- Performance and accessibility bolted on at the end.
- Too long to read; split into `DESIGN.md` + `docs/refs/*` instead.
