# Phase 0 — Scaffold and Data Layer

No concepts yet. This phase exists so every later phase has something to build on.
Move fast; nothing here is interview material.

## Read first

Nothing. Skim [APP-SPEC.md](../APP-SPEC.md) so you know what you're heading toward.

## Create the app

From `04-NextJs/`:

```bash
npx create-next-app@latest practice-app --typescript --app --eslint --no-src-dir --no-tailwind
```

Say **yes** to the App Router, **no** to Tailwind (styling is a distraction here),
**no** to `src/`. Turbopack is fine either way.

Then confirm it runs:

```bash
cd practice-app && npm run dev
```

## Build

**1. `lib/types.ts`** — the entity types from [APP-SPEC.md](../APP-SPEC.md).

Two rules that matter later: `User.role` is a literal union
(`"admin" | "editor" | "viewer"`), never `string`. `Product.price` is an integer in
cents.

**2. `data/*.json`** — seed files. Roughly 20 products over 4 categories with some
variants, 10 posts, 8 docs at varying path depths, 5 users covering all three roles.

Hand-write or generate it, doesn't matter. Make product names distinguishable so you
can tell at a glance whether a page is showing stale data — that becomes important
in Phase 11.

**3. `lib/db.ts`** — read/write those JSON files.

Implement only what you need now: `getProducts`, `getProduct`, `getCategories`,
`getPosts`, `getPost`, `getUsers`, `getUser`. Add the rest as later phases demand
them.

**Every read function must be async and artificially slow.** Add a `sleep` helper
and put `await sleep(300)` in each one. Make `getProducts` and one dashboard
function ~2000ms.

This is not optional decoration. Without latency, `loading.tsx` never appears,
Suspense boundaries never show a fallback, and Phases 7 and 9 teach you nothing
because everything resolves instantly.

**4. `app/layout.tsx`** — the root layout. It's the only layout that renders
`<html>` and `<body>`. Keep it to almost nothing.

**5. `app/globals.css`** — a handful of rules so the app isn't unreadable. A max
width, a readable font, some spacing. Twenty lines. Resist doing more.

## Done when

- `npm run dev` serves the default page with no errors
- `lib/db.ts` exports async functions returning typed data from the JSON files
- Every read takes at least 300ms
- `lib/types.ts` has no `any`
- `npm run build` succeeds

## Not yet

No route groups, no dynamic routes, no layouts beyond root, no fetching from
components. Phase 1 starts the actual routing.
