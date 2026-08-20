# Phase 11 — Caching

**6 problems** · Vault folder: `12-caching`

> **The hardest phase and the most-asked Next.js interview topic.** Budget double the
> time you'd expect. Do **not** skip the lab routes — cache behaviour is invisible
> without them.

## Read first

All six, in this order:

- `NextJs-Vault/12-caching/The Four Caches.md`
- `NextJs-Vault/12-caching/Request Memoization.md`
- `NextJs-Vault/12-caching/The Data Cache.md`
- `NextJs-Vault/12-caching/Revalidation Strategies.md`
- `NextJs-Vault/12-caching/Cache Invalidation.md`
- `NextJs-Vault/09-server-actions/Revalidation after Mutation.md` (re-read)

## The four caches — learn these names

| Cache | Stores | Lives | Lasts |
|---|---|---|---|
| **Request Memoization** | duplicate calls in one render | server | one request |
| **Data Cache** | `fetch` results | server, on disk | across requests **and deploys** |
| **Full Route Cache** | rendered HTML | server | until revalidated |
| **Router Cache** | visited routes | **browser** | seconds to minutes |

You already used the first one — that was `cache()` in Phase 6 Problem 3. This phase
is mostly about the **second**.

## The deliberate anti-pattern — read this before you start

**The Data Cache only applies to `fetch`.** Your pages read `db` directly, which is
correct production architecture — but it means there is **no Data Cache to observe**.

So in this phase, selected pages will `fetch()` your own Route Handlers from Phase 8.

> ⚠️ **This is a production anti-pattern.** Self-fetching adds a network hop to reach
> data you could read directly. It is used here **on purpose**, because it is the only
> way to make cache hits, tags, and revalidation *visible*. Never do this in real work.

For the `db`-direct case, `unstable_cache` is the equivalent tool — Problem 3 covers it.

## How to observe caching — three techniques

Caching is invisible by default. These are your instruments:

1. **`console.log` in the Route Handler** — count how often it *actually* runs
2. **Render a timestamp** — `new Date().toISOString()` in the output. **A frozen
   timestamp means a cache hit.**
3. **`npm run build`** — the route table shows the rendering decision

Use a short revalidate window (10s, not 60s) while experimenting so you're not sitting
around waiting.

---

## Problem 1 — Cache product data

**Goal:** watch the same fetch hit the server once instead of every reload.

**File:** `app/(shop)/products/page.tsx`

### Steps

1. Put `console.log("HANDLER RAN", new Date().toISOString())` in
   `app/api/products/route.ts`
2. In the page, replace the `db` call with:
   ```
   fetch("http://localhost:3000/api/products", { cache: "force-cache" })
   ```
3. Reload **ten times**. Count the log lines in your terminal.
4. Now **remove** `{ cache: "force-cache" }`
5. Reload ten times again. Count again.
6. Write both counts in a comment

### What you need to know

**This is the behaviour that changed between versions**, and it's a favourite
interview question:

- **Next 14** — plain `fetch()` was **cached** by default
- **Next 15+** — plain `fetch()` is **not cached**. You opt in.

Tutorials written for 14 will tell you the opposite. If you assume the old behaviour,
you get a page that never updates and no idea why.

### Verify

With `force-cache` the handler logs **once**. Without it, **every reload**.

---

## Problem 2 — Time-based revalidation

**Goal:** content refreshes on a timer, not on every request.

**File:** `app/blog/page.tsx`

### Steps

1. Render `new Date().toISOString()` on the page so you can see freshness
2. **Per-fetch:** `fetch(url, { next: { revalidate: 10 } })`
3. Reload rapidly — the timestamp **freezes**. Wait 10s, reload — it **jumps**.
4. **Per-route:** `export const revalidate = 10` at the top of the file
5. Now set them to **different** values (say fetch 10, route 60) and work out which
   wins
6. **Comment the precedence rule**

### What you need to know

**Stale-while-revalidate** — know this term and be able to describe it:

1. Request arrives after the window expired
2. Next serves the **stale** copy immediately — that visitor waits for nothing
3. In the background, it refetches and replaces the cache
4. The **next** visitor gets fresh data

Nobody ever waits for a revalidation. The tradeoff: one visitor after expiry sees
slightly old data.

### Verify

The timestamp freezes, then jumps after the window. You can state which of the two
`revalidate` settings wins.

---

## Problem 3 — Invalidate after a mutation

**Goal:** creating a product updates **every** page that displays products.

**Files:** `app/actions/products.ts`, `app/(shop)/products/page.tsx`

### Steps

1. **Tag the fetches:** `fetch(url, { next: { tags: ["products"] } })`
2. In the create action, call `revalidateTag("products")`
3. Create a product and confirm every products page updates
4. Also demonstrate `revalidatePath("/admin/products")`
5. And `revalidatePath("/blog", "layout")` — note how it differs from the plain form
6. **Then the `db`-direct version:** wrap a `db` read in `unstable_cache` with the same
   tag, and confirm `revalidateTag` invalidates it too

### What you need to know

This completes **Version B from Phase 10 Problem 7**, which you left unfinished
because there were no tagged fetches yet.

| Call | Invalidates |
|---|---|
| `revalidatePath("/blog")` | that **one page** |
| `revalidatePath("/blog", "layout")` | that page **and everything nested under it** |
| `revalidateTag("products")` | every fetch tagged `products`, **anywhere in the app** |

Tags win when the same data appears on many pages. You don't have to know or remember
every URL that shows a product.

`unstable_cache` is the `db`-direct equivalent of the Data Cache. The name is a
warning — the API may change. Check the bundled docs in `node_modules/next/dist/docs/`
rather than trusting memory.

### Verify

Creating a product updates every page showing products. The layout-scoped variant
reaches nested routes.

---

## Problem 4 — A statically rendered page, then broken on purpose

**Goal:** watch a route flip static → dynamic from **one added line**.

**File:** `app/lab/static-demo/page.tsx`

### Steps

1. Build a page with **no** `cookies()`, **no** `headers()`, **no** `searchParams`, and
   **no** uncached fetch
2. Render `new Date().toISOString()`
3. `npm run build` — confirm the `○` marker
4. `npm start` and reload several times — **the timestamp never changes.** It's baked
   into a file from build time.
5. **Now add `await cookies()`** and read anything from it
6. Rebuild and reload

### What you need to know

Step 4 is the clearest demonstration of static rendering in the whole track. That
timestamp is **the moment you ran the build**. Every visitor sees the same one, forever,
until you rebuild.

Step 6 flips it: the marker becomes `ƒ` and the timestamp changes per request.

### Verify

The marker flips `○` → `ƒ`, and the timestamp goes from frozen to per-request.

---

## Problem 5 — A dynamically rendered page, two ways

**Goal:** force dynamic explicitly, then achieve the same thing implicitly.

**File:** `app/lab/dynamic-demo/page.tsx`

### Steps

1. **Explicit:** `export const dynamic = "force-dynamic"`
2. Build and confirm `ƒ`
3. **Now remove that line** and instead read `cookies()`
4. Build again — same marker, different cause
5. Look up what `fetchCache` controls and note the difference in a comment

### What you need to know

Two routes to the same destination:

- **`force-dynamic`** — a blunt override: "never prerender this"
- **Reading a dynamic API** — Next infers it, because it genuinely cannot prerender

**Prefer the implicit route.** `force-dynamic` reached for early is a common mistake:
it silently disables prerendering for a page that didn't need it, and nothing warns
you. Let Next infer, and only override when you have a specific reason.

`dynamic` controls **rendering**. `fetchCache` controls **data caching**. Different
axes — which is the point of Problem 6.

### Verify

Both approaches produce `ƒ`. Content differs per request.

---

## Problem 6 — Cached and uncached, side by side

**Goal:** see both behaviours on one page, and learn what one `no-store` does to the
whole route.

**File:** `app/lab/cache-compare/page.tsx`

### Steps

1. Two fetches on the same page:
   - **A:** `{ cache: "force-cache" }`
   - **B:** `{ cache: "no-store" }`
2. Render a timestamp from **each**
3. Reload **ten times** and record which changes
4. Run `npm run build` and check this route's marker
5. **Explain what the `no-store` fetch did to the whole page**

### What you need to know

**This is the sharpest idea in the phase.** Two separate axes that people constantly
conflate:

```
RENDERING       static  ←→  dynamic     is the HTML built once or per request?
DATA CACHING    cached  ←→  uncached    is the fetch result stored?
```

A `no-store` fetch makes the **route dynamic** — Next can't prerender a page whose data
must be fresh every time. But cached fetch A **stays cached** even so. The page
re-renders per request, and fetch A serves from the Data Cache while fetch B goes to
the network.

Being able to say *"dynamically rendered does not mean uncached data"* is a strong
interview answer.

### Verify

A is frozen, B updates every reload. The route is marked `ƒ`, and you can explain why
A is still cached anyway.

---

## Done when

- You can name **all four caches** without looking
- You have observed a cache hit via a **frozen timestamp** and a **silent log**
- `revalidateTag` updates multiple pages from **one** mutation
- You've watched a route flip static → dynamic by adding one line
- You can explain why "dynamically rendered" and "uncached data" are different axes

---

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

---

## A note on Next 16

Next 16 adds **Cache Components** — a `use cache` directive plus `cacheLife`, enabled
by `cacheComponents: true` in `next.config.ts`.

**It is not enabled in this app, and you should not enable it here.** Turning it on
changes caching semantics app-wide and would invalidate everything you just measured.

Know that it exists and that **Partial Prerendering is tied to it** in 16. If a job
description mentions it, read
`node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md` —
the bundled docs are authoritative and current, unlike blog posts.

---

## Not yet

Nothing. This is the deepest phase. Auth and middleware follow, but they're smaller.
