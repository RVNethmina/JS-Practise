# Phase 11 — Caching

Concept folder: **12-caching** · 6 problems

**The hardest phase and the most-asked Next.js interview topic.** Budget double the
time you'd expect. Do not skip the lab routes — cache behaviour is invisible without
them.

## Read first

All six, in order:

- `NextJs-Vault/12-caching/The Four Caches.md`
- `NextJs-Vault/12-caching/Request Memoization.md`
- `NextJs-Vault/12-caching/The Data Cache.md`
- `NextJs-Vault/12-caching/Revalidation Strategies.md`
- `NextJs-Vault/12-caching/Cache Invalidation.md`
- `NextJs-Vault/09-server-actions/Revalidation after Mutation.md` (re-read)

## The deliberate anti-pattern

**The Data Cache only applies to `fetch`.** Your pages have been reading `db`
directly, which is correct production architecture — but it means you have no Data
Cache to observe.

So in this phase, selected pages will `fetch()` your own Route Handlers from Phase 8.

**This is a production anti-pattern.** Self-fetching adds a network hop to reach data
you could read directly. It is used here on purpose, because it is the only way to
make cache hits, tags, and revalidation *visible*. Never do this in real work — the
vault's `Route Handlers.md` note explains the correct approach.

For the `db`-direct case, `unstable_cache` is the equivalent tool, and Problem 3
covers it.

## How to observe caching

Three techniques, used throughout:

1. **`console.log` in the Route Handler** — count how often it actually runs
2. **Render a timestamp** — `new Date().toISOString()` in the output; a frozen
   timestamp means a cache hit
3. **`npm run build`** — the route table shows the rendering decision

---

## Problem 1 — Cache product data

**File:** `app/(shop)/products/page.tsx`

Switch to `fetch("http://localhost:3000/api/products", { cache: "force-cache" })`.

- `console.log` in the Route Handler; reload repeatedly and count
- Then remove `force-cache` (Next 15+ default is uncached) and count again

**Verify:** with `force-cache` the log fires once. Without it, every reload.

---

## Problem 2 — Revalidate blog data

**File:** `app/blog/page.tsx`

Time-based revalidation, two ways:

- Per-fetch: `fetch(url, { next: { revalidate: 60 } })`
- Per-route: `export const revalidate = 60`

Set both to different values and work out which wins. Comment the precedence.

Use 10 seconds while experimenting so you're not waiting a minute.

**Verify:** content refreshes after the window, not on every request. Watch the
timestamp freeze then jump.

---

## Problem 3 — Invalidate after mutation

**Files:** `app/actions/products.ts`, `app/(shop)/products/page.tsx`

Complete Version B from Phase 10.

- Tag the fetches: `next: { tags: ["products"] }`
- `revalidateTag("products")` in the action
- Also demonstrate `revalidatePath`, and `revalidatePath("/blog", "layout")`
- Then do the same for a `db`-direct read using `unstable_cache` with tags

**Verify:** creating a product updates every page displaying products. Confirm the
layout-scoped variant hits nested routes too.

---

## Problem 4 — Statically rendered page

**File:** `app/lab/static-demo/page.tsx`

A page guaranteed static — then broken on purpose.

- No `cookies()`, no `headers()`, no `searchParams`, no uncached fetch
- Render a build-time timestamp
- `npm run build` — confirm the `○` marker
- Then add `cookies()` and rebuild

**Verify:** the marker flips to `ƒ`. The timestamp changes from frozen to
per-request.

---

## Problem 5 — Dynamically rendered page

**File:** `app/lab/dynamic-demo/page.tsx`

- `export const dynamic = "force-dynamic"`
- Then achieve the same implicitly by reading `cookies()`
- Note what `fetchCache` controls instead

**Verify:** the build marks it dynamic; content differs per request.

---

## Problem 6 — Compare cached and uncached

**File:** `app/lab/cache-compare/page.tsx`

Both on one page, side by side.

- Fetch A: `{ cache: "force-cache" }`
- Fetch B: `{ cache: "no-store" }`
- Render a timestamp from each
- Reload ten times and record which changes

**Verify:** A is frozen, B updates every reload. Then check the build marker for this
route and explain what the `no-store` fetch did to the whole page.

---

## Done when

- You can name all four caches without looking
- You have observed a cache hit via a frozen timestamp and a silent log
- `revalidateTag` updates multiple pages from one mutation
- You've watched a route flip static → dynamic by adding one line
- You can explain why "dynamically rendered" and "uncached data" are different axes

## Recall questions

1. Name all four caches, what each stores, where it lives, and how long it lasts.
2. In Next 14 plain `fetch()` was cached by default; in 15 it isn't. Why the change,
   and what breaks if you assume the old behaviour?
3. Describe stale-while-revalidate. Who gets the stale response, who triggers the
   refresh, and who pays for it?
4. `revalidateTag` vs `revalidatePath` — and what does
   `revalidatePath("/blog", "layout")` do that `revalidatePath("/blog")` doesn't?
5. One `no-store` fetch is on a page. What does that do to the page's rendering mode?
   Can other fetches on it still be cached?
6. What is request memoization, and how does it differ from the Data Cache?
7. When is `force-dynamic` the right tool versus letting a dynamic API opt you in
   naturally? What's the risk of reaching for it early?

## Not yet

Nothing. This is the deepest phase. Auth and middleware follow, but they're smaller.
