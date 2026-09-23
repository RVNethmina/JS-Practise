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

> [!warning] The vault notes predate Next 16 on two APIs
> `revalidateTag` gained a required second argument, and `updateTag` is new. Both are
> covered in Problem 3 below. Read the notes for the *concepts*; trust this brief for
> the *signatures*.

## The four caches — learn these names

| Cache | Stores | Lives | Lasts |
|---|---|---|---|
| **Request Memoization** | duplicate calls in one render | server | one request |
| **Data Cache** | `fetch` results | server, on disk | across requests **and deploys** |
| **Full Route Cache** | rendered HTML | server | until revalidated |
| **Router Cache** | visited routes | **browser** | seconds to minutes |

You already used the first one — `cache()` in Phase 6 Problem 3. This phase is mostly
about the **second**.

## Next 16 changed things — read before you start

| API | Status in Next 16 |
|---|---|
| `fetch(url)` | **not cached** by default (unchanged from 15) |
| `fetch(url, { cache: "force-cache" })` | ✅ how you opt in |
| `revalidatePath(path, type?)` | ✅ unchanged |
| `revalidateTag(tag, profile)` | ⚠️ **second argument now required** |
| `updateTag(tag)` | 🆕 new — Server Actions only |
| `unstable_cache(...)` | ⚠️ deprecated, replaced by `use cache` |
| `use cache` | ❌ needs `cacheComponents: true` — **not enabled here** |

> [!danger] `revalidateTag` takes two arguments now
> ```ts
> revalidateTag(tag: string, profile: string | { expire?: number }): void
> ```
> The single-argument form is **deprecated** and is a TypeScript error:
> `TS2554: Expected 2 arguments, but got 1`.
>
> Use `revalidateTag("products", "max")`. See Problem 3 for what `"max"` means.

## The deliberate anti-pattern — read this before you start

**The Data Cache only applies to `fetch`.** Your pages read `db` directly, which is
correct production architecture — but it means there is **no Data Cache to observe**.

So in this phase, selected pages will `fetch()` your own Route Handlers from Phase 8.

> ⚠️ **This is a production anti-pattern.** Self-fetching adds a network hop to reach
> data you could read directly. It's used here **on purpose**, because it's the only
> way to make cache hits, tags, and revalidation *visible*. Never do this in real work.

For the `db`-direct case, `unstable_cache` is the equivalent — Problem 3 covers it,
deprecation and all.

## Your three instruments

Caching is invisible by default:

1. **`console.log` in the Route Handler** — count how often it *actually* runs
2. **Render a timestamp** — `new Date().toISOString()`. **A frozen timestamp is a
   cache hit.**
3. **`npm run build`** — the route table shows the rendering decision

Use a 10-second revalidate window while experimenting, not 60.

> [!warning] Every measurement here needs a production build
> ```bash
> npm run build && npm start
> ```
> `npm run dev` disables most caching so you can see your edits. Measuring in dev
> tells you nothing.

## What you'll have built by the end

```
app/(shop)/products/(list)/page.tsx   <- P1  swap db for fetch
app/blog/page.tsx                     <- P2  revalidate, two ways
app/actions/products.ts               <- P3  edit
lib/categories.ts                     <- P3  add getCachedCategories
app/lab/static-demo/page.tsx          <- P4  new
app/lab/dynamic-demo/page.tsx         <- P5  new
app/lab/cache-compare/page.tsx        <- P6  new
```

---

## Problem 1 — Cache a fetch, then don't

**Goal:** watch the same fetch hit the server once instead of every reload.

**File:** `app/(shop)/products/(list)/page.tsx` *(edit)*

### Build

1. In `app/api/products/route.ts` (Phase 8 Problem 7), add at the top of `GET`:
   ```ts
   console.log("[api/products] HANDLER RAN", new Date().toISOString());
   ```
2. In the page, replace `await getProducts(...)` with:
   ```ts
   const res = await fetch("http://localhost:3000/api/products?pageSize=6", {
     cache: "force-cache",
   });
   const { items, total, totalPages, page } = await res.json();
   ```
3. `npm run build && npm start`, reload **ten times**, count the log lines
4. Remove `{ cache: "force-cache" }`, rebuild, reload ten times, count again
5. Write both counts in a comment

### What you need to know

**This changed between versions** and it's a favourite interview question:

- **Next 14** — plain `fetch()` was **cached** by default
- **Next 15 and 16** — plain `fetch()` is **not cached**. You opt in.

Tutorials written for 14 tell you the opposite.

> [!info] `res.json()` returns `any`
> Everything downstream is now untyped. Note it — Phase 14 Problem 2 is about closing
> exactly this gap.

### Test

`force-cache` → handler logs **once** across ten reloads. Without it → **ten times**.

---

## Problem 2 — Time-based revalidation

**Goal:** content refreshes on a timer, not on every request.

**File:** `app/blog/page.tsx` *(edit)*

### Build

1. Render `new Date().toISOString()` on the page so freshness is visible
2. **Per-fetch:** `fetch(url, { next: { revalidate: 10 } })`
3. Reload rapidly — the timestamp **freezes**. Wait 10s, reload — it **jumps**.
4. **Per-route:** `export const revalidate = 10` at the top of the file
5. Set them to **different** values (fetch 10, route 60) and work out which wins
6. **Comment the precedence rule you observed**

### Stale-while-revalidate — know this term

1. A request arrives after the window expired
2. Next serves the **stale** copy immediately — that visitor waits for nothing
3. In the background it refetches and replaces the cache
4. The **next** visitor gets fresh data

Nobody ever waits for a revalidation. The tradeoff: one visitor after expiry sees
slightly old data.

### Test

The timestamp freezes, then jumps after the window. You can state which `revalidate`
setting wins when they disagree.

---

## Problem 3 — Invalidate after a mutation

**Goal:** creating a product updates **every** page that shows products.

**Files:** `app/actions/products.ts` *(edit)*, `lib/categories.ts` *(edit)*

### 3a. Tag the fetches

```ts
fetch(url, { next: { tags: ["products"] } })
```

### 3b. Invalidate — and pick the right function

Next 16 gives you **two**, and the difference is the whole problem:

| | `revalidateTag(tag, "max")` | `updateTag(tag)` |
|---|---|---|
| Callable from | Server Actions **and** Route Handlers | **Server Actions only** |
| Next visitor gets | the **stale** copy, refresh happens behind them | **waits** for fresh data |
| Right for | background/bulk invalidation | the user who just made the change |

**After a user's own mutation, `updateTag` is usually what you want** — they should see
their edit immediately, not the version from before they pressed Save.

In `createProductAction`, use `updateTag("products")`.

### 3c. Also demonstrate the path-based forms

```ts
revalidatePath("/admin/products");        // one URL
revalidatePath("/blog", "layout");        // that page AND everything nested under it
```

Signature is `revalidatePath(path, type?)` — `type` is **required** if `path` contains
a dynamic segment like `/product/[slug]`.

### 3d. The `db`-direct equivalent

Add to `lib/categories.ts`:

```ts
import { unstable_cache } from "next/cache";

export const getCachedCategories = unstable_cache(
  async () => {
    console.log("[db] getCachedCategories RAN");
    return readJson<Category[]>("categories.json");
  },
  ["categories"],
  { tags: ["categories"] }
);
```

Use it on a page, reload three times, confirm the log fires **once**.

> [!warning] `unstable_cache` is deprecated in Next 16
> The docs say it's *"been replaced by `use cache`"*. But `use cache` requires
> `cacheComponents: true`, which is **not enabled here** and would invalidate every
> other measurement in this phase.
>
> So: use `unstable_cache`, and know that in a Next 16 greenfield project you'd enable
> Cache Components and write `'use cache'` plus `cacheTag()` instead.

### Measured — this is what SWR actually looks like

A probe using `unstable_cache` with a `"uc-probe"` tag, then
`revalidateTag("uc-probe", "max")`:

```
req1  04:30:58   cached
req2  04:30:58   cached
      --- revalidateTag(tag, "max") ---
req3  04:30:58   ← STILL STALE, served instantly
req4  04:35:35   ← fresh
```

**Request 3 is the important row.** `"max"` marks the entry stale; it doesn't block
anyone. The visitor immediately after invalidation still gets the old copy, and the
refresh happens behind them. That's why `updateTag` exists for the case where that's
not acceptable.

### Test

Creating a product updates every page showing products. `revalidateTag` invalidates
the `unstable_cache` entry too — the log fires again on the next-but-one request.

---

## Problem 4 — A static page, then broken on purpose

**Goal:** watch a route flip static → dynamic from **one added line**.

**File:** `app/lab/static-demo/page.tsx` *(new)*

### Build

1. A page with **no** `cookies()`, **no** `headers()`, **no** `searchParams`, **no**
   uncached fetch
2. Render `new Date().toISOString()`
3. `npm run build` — confirm `○`
4. `npm start`, reload several times — **the timestamp never changes**
5. Add `const c = await cookies();` and read something
6. Rebuild and reload

### What you're seeing

Step 4 is the clearest demonstration of static rendering in the whole track. That
timestamp is **the moment you ran the build**. Every visitor sees the same one until
you rebuild.

### Test

Marker flips `○` → `ƒ`. Timestamp goes from frozen to per-request.

---

## Problem 5 — A dynamic page, two ways

**Goal:** force dynamic explicitly, then achieve the same thing implicitly.

**File:** `app/lab/dynamic-demo/page.tsx` *(new)*

### Build

1. **Explicit:** `export const dynamic = "force-dynamic"` → build, confirm `ƒ`
2. **Remove that line**, read `cookies()` instead → build, same marker
3. Look up `fetchCache` and comment how it differs

### What you need to know

- **`force-dynamic`** — a blunt override: "never prerender this"
- **Reading a dynamic API** — Next infers it, because it genuinely cannot prerender

**Prefer the implicit route.** `force-dynamic` reached for early silently disables
prerendering for a page that didn't need it, and nothing warns you.

`dynamic` controls **rendering**. `fetchCache` controls **data caching**. Different
axes — which is Problem 6.

---

## Problem 6 — Cached and uncached, side by side

**Goal:** see both on one page, and learn what one `no-store` does to the whole route.

**File:** `app/lab/cache-compare/page.tsx` *(new)*

### Build

1. Two fetches to your own API on one page:
   - **A:** `{ cache: "force-cache" }`
   - **B:** `{ cache: "no-store" }`
2. Render a timestamp from each response
3. Reload **ten times**, record which changes
4. `npm run build` and check this route's marker
5. **Explain what the `no-store` fetch did to the whole page**

### The sharpest idea in the phase

Two axes that people constantly conflate:

```
RENDERING       static  <->  dynamic     is the HTML built once or per request?
DATA CACHING    cached  <->  uncached    is the fetch result stored?
```

A `no-store` fetch makes the **route dynamic** — Next can't prerender a page whose data
must be fresh. But cached fetch A **stays cached**. The page re-renders per request,
and A serves from the Data Cache while B goes to the network.

Being able to say *"dynamically rendered does not mean uncached data"* is a strong
interview answer.

### Test

A is frozen, B updates every reload. The route is `ƒ`, and you can explain why A is
still cached anyway.

---

## Done when

- You can name **all four caches** without looking
- You've observed a cache hit via a **frozen timestamp** and a **silent log**
- One mutation updated multiple pages
- You've watched a route flip static → dynamic by adding one line
- You can explain why "dynamically rendered" and "uncached data" are different axes
- You know why `revalidateTag` needs a second argument now

---

## Recall questions

1. Name all four caches, what each stores, where it lives, how long it lasts.
2. In Next 14 plain `fetch()` was cached by default; in 15+ it isn't. What breaks if
   you assume the old behaviour?
3. Describe stale-while-revalidate. Who gets the stale response, who triggers the
   refresh, who waits?
4. `revalidateTag(tag, "max")` vs `updateTag(tag)` — which do you use right after a
   user saves a form, and why?
5. What does `revalidatePath("/blog", "layout")` do that `revalidatePath("/blog")`
   doesn't? When is the second argument **required**?
6. One `no-store` fetch is on a page. What does that do to the rendering mode? Can
   other fetches on it still be cached?
7. What is request memoization, and how does it differ from the Data Cache?
8. `unstable_cache` is deprecated. What replaces it, and what does that replacement
   require you to turn on?

---

## Not yet

Nothing. This is the deepest phase. Auth and middleware follow, but they're smaller.
