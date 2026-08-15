# 04 — Next.js

**You learn this track by building one real application.**

Start here: **[BUILD-PLAN.md](BUILD-PLAN.md)**

## Why this track works differently

The other tracks use isolated exercise files. That doesn't work for Next.js:

- **Routing *is* folder structure.** "Build a dynamic product route" is answered by a
  file existing at `app/products/[id]/page.tsx`. An exercise file can only hold what
  that file's *contents* would be — the part that actually teaches routing is
  missing.
- **Caching, streaming, and the static/dynamic decision are runtime behaviour.** You
  cannot typecheck a cache hit. You have to run the app and watch.

So this track is a 15-phase build of a storefront + admin app. You write all the
code; the briefs are specifications.

## Layout

| Path | What |
|---|---|
| [BUILD-PLAN.md](BUILD-PLAN.md) | Start here — the app, the phases, how to work |
| [APP-SPEC.md](APP-SPEC.md) | Entities, full route map, data layer contract |
| [PROGRESS.md](PROGRESS.md) | 90-problem checklist |
| `phases/` | 15 briefs, one per phase |
| `practice-app/` | The app you build (Phase 0 creates it) |
| `16-nextjs-interview/` | Closed-book assessment — stays empty until the end |

Theory lives outside this repo, in the **NextJs-Vault** Obsidian vault at
`C:\Hello\Notes\NextJs-Vault` — 50 notes mirroring the 14 concept folders. Each
phase brief names the notes to read before you start.

## Quick start

```bash
cd C:\Hello\My_Projects\JS-Practise\04-NextJs && npx create-next-app@latest practice-app --typescript --app --eslint --no-src-dir --no-tailwind
```

Then open [phases/00-scaffold.md](phases/00-scaffold.md).

## Verification

`tsc` cannot verify this track. Two tools replace it:

```bash
cd practice-app && npm run dev
```

```bash
cd practice-app && npm run build
```

The build's route table (`○` static, `●` SSG, `ƒ` dynamic) is your primary instrument
from Phase 9 onward. Reading it is a skill worth building — one stray `cookies()` in
a shared component silently flips a whole page to dynamic.
