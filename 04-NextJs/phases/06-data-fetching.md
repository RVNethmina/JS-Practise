# Phase 6 — Data Fetching

**7 problems + 1 lab** · Vault folder: `06-data-fetching`

## Read first

- `NextJs-Vault/06-data-fetching/Server-Side Data Fetching.md`
- `NextJs-Vault/06-data-fetching/Sequential vs Parallel Fetching.md`

## What you're building

Deeper data work: pagination, dependent data, deliberate waterfalls you then fix, and
proper failure handling.

Still reading `db` **directly**. `fetch` arrives in Phase 11, when there's an API to
hit and a cache to observe.

## Set this up first — you need it for Problems 6 and 7

Add a failure switch to `lib/db.ts`:

```
export let shouldFail = false;
export function setShouldFail(v: boolean) { shouldFail = v; }
```

Then at the top of one or two read functions, throw when it's set. You'll flip this
to trigger failures on demand for the rest of this phase and all of Phase 7.

---

## Problem 1 — Harden the user list

**Goal:** `/users` survives an empty dataset and a thrown error.

**File:** `app/users/page.tsx` (extend Phase 3's version)

### Steps

1. Type the result explicitly rather than relying on inference
2. Handle `users.length === 0` — render an empty state, not a blank page
3. Temporarily make `getUsers` throw and see what the raw failure looks like
4. Leave it throwing for now — Phase 7 adds the boundary that catches it

### What you need to know

An empty array and a failed fetch are **different states** and need different UI.
"No users yet" is information; a blank page is a bug report waiting to happen.

### Verify

1. Data appears in the initial HTML
2. An empty dataset renders your empty state, not a crash

---

## Problem 2 — Cache annotations (preparation only)

**Goal:** write down the three `fetch` caching modes before you need them.

**File:** `app/(shop)/products/page.tsx`

### Steps

1. At the top of the file, add a comment block with all three variants and **when
   each is right**:
   ```
   fetch(url)                               // Next 15+ default: NOT cached
   fetch(url, { cache: "force-cache" })     // cache forever until revalidated
   fetch(url, { next: { revalidate: 60 } }) // cache, refresh after 60s
   ```
2. Implement the page with `db` as usual

### What you need to know

**This changed between versions and it's a common interview question.** In Next 14,
plain `fetch()` was cached by default. Since Next 15 it is **not**. Tutorials written
for 14 will tell you the opposite.

You have no `fetch` yet, so nothing to test. These comments are your Phase 11 starting
point.

### Verify

The page still works. The comments are written.

---

## Problem 3 — Request memoization with `cache()`

**Goal:** stop `getProduct` running twice per request.

**File:** `app/(shop)/products/[id]/page.tsx`

### Steps

1. Make sure `generateMetadata` **and** the page both call `getProduct(id)`
2. Put `console.log("DB HIT", id)` inside `getProduct` in `lib/db.ts`
3. Load `/products/1` and **count the log lines. Write the number down.**
4. Now wrap the function in React's `cache()`:
   ```
   import { cache } from "react";
   export const getProduct = cache(async (id: string) => { ... });
   ```
5. Reload and **count again**
6. Write both counts in a comment with a one-line explanation

### What you need to know

You saw this in Phase 3 Problem 2 and were told to leave it. This is the fix.

- **Before:** 2 calls — one from `generateMetadata`, one from the page
- **After:** 1 call — the second gets the memoized result

`cache()` deduplicates calls with **the same arguments** within **a single request**.
It is not a persistent cache; it's gone when the request ends. That's exactly what you
want here — no staleness risk, no invalidation to think about.

**`fetch` gets this automatically. A `db` call does not.** That asymmetry is precisely
what `cache()` exists to close.

### Verify

You can state the before and after counts and explain the difference in one sentence.

---

## Problem 4 — Blog post detail

**Goal:** each post renders; a missing slug 404s.

**File:** `app/blog/[slug]/page.tsx` (extend Phase 5's version)

### Steps

1. `await getPost(slug)`, `notFound()` on null
2. Render title, date, body
3. Add a comment marking **exactly where** `next: { revalidate: 3600 }` would go once
   this uses `fetch`

### Verify

1. Posts render
2. Missing slugs 404
3. The comment marks the future revalidate location

---

## Problem 5 — Server-side pagination

**Goal:** `/products?page=2` shows the second page, and Previous/Next work without
losing other query params.

**File:** `app/(shop)/products/page.tsx`

### Steps

1. Read `page` from `searchParams`, defaulting to 1
2. Parse it safely — handle `"abc"`, `"0"`, `"-5"`, and missing
3. Pass it to `getProducts({ page, pageSize: 12 })`
4. Use the returned `total` and `totalPages` for the controls
5. Build Previous/Next as `<Link>`s that **preserve the other query params**
6. Disable Previous on page 1 and Next on the last page
7. Test `?page=999`

### What you need to know

`getProducts` returns the pagination metadata **with** the items:

```
{ items, page, pageSize, total, totalPages }
```

so you never need a second count query.

**Step 5 is where people get this wrong.** Don't hardcode `href={"?page=" + n}` — that
wipes out `?q=headphones` from the Phase 4 SearchBox. Copy the existing params with
`new URLSearchParams`, change only `page`, and rebuild the string.

That's the moment the URL-as-state idea pays off: the search term and the page number
live in the same place and compose naturally.

### Verify

1. Navigating pages updates the URL and shows different products
2. `?q=phone&page=2` keeps **both** when you click Next
3. `?page=999` doesn't crash — shows an empty state or clamps

---

## Problem 6 — Dependent data, plus one independent fetch

**Goal:** a genuine dependency chain, with an unrelated fetch running alongside it
instead of behind it.

**File:** `app/users/[username]/page.tsx`

### Steps

1. `await getUser(username)` — you need the user's `id` before anything else
2. Use that id to fetch that user's posts — **genuinely dependent**, it cannot start
   earlier
3. Now add a **third** fetch that depends on neither, such as `getCategories()`
4. Start the third one **in parallel with the first**, not after the chain
5. Time all three approaches and comment the numbers

### What you need to know

**Not every waterfall is a bug.** Step 2 genuinely cannot start before step 1 finishes
— you don't have the id yet. That's a *necessary* waterfall.

Step 3 is a *bug* if you `await` it last, because it never needed to wait at all.

The pattern for mixing them:

```
start the independent one (no await yet)
await the first dependent one
await the second dependent one
await the independent one   ← it's been running the whole time
```

Remember: **calling starts the work, `await` only waits.**

### Verify

The independent fetch doesn't add to the total time. You measured it.

---

## Problem 7 — Handle a failed request, two ways

**Goal:** the same failing call, handled two ways, so you can see the difference in
blast radius.

### What you're building

A fake "recommendations service" that you can break on demand. Then two pages that
call it:

- `/products` **catches** the failure → only the Recommended strip degrades
- `/lab/failure` **doesn't catch** → the whole route dies

### 1. Add to `lib/db.ts`

```ts
export async function getRecommendations(
  options: { fail?: boolean } = {}
): Promise<Product[]>
```

- `await sleep(DELAYS.fast)` first
- If `options.fail` is true, `throw new Error("Recommendation service unavailable")`
- Otherwise return 3 products tagged `"bestseller"`

> **Why an argument and not the global `shouldFail`?** `shouldFail` is module state
> on the server — flipping it breaks *every* page at once and stays broken until you
> flip it back. A per-call argument keeps the failure to one request. Keep
> `shouldFail` for Phase 7, where you *want* a route genuinely down.

### 2. Version B — catch locally, in `app/(shop)/products/page.tsx`

Add above the `return`:

```ts
let recommendations: Product[] = [];
let recsFailed = false;

try {
  recommendations = await getRecommendations({
    fail: single(query.failrecs) === "1",
  });
} catch {
  recsFailed = true;
}
```

Then a `<section>` after `<ProductFilter>`: heading "Recommended", and either the
list or "Recommendations are unavailable right now" when `recsFailed`.

### 3. Version A — let it throw, in `app/lab/failure/page.tsx` *(new file)*

- Read `?fail=1` from `searchParams`
- `await getProducts({ pageSize: 1 })` and show the total
- `await getRecommendations({ fail })` with **no try/catch**
- Render the list, plus links to `?fail=1` and back

### 4. Comment when each is right

### Test these exact URLs

| URL | Expect |
|---|---|
| `/lab/failure` | 200 |
| `/lab/failure?fail=1` | **500** — whole route gone |
| `/products` | 200 |
| `/products?failrecs=1` | **200** — catalogue, search and pagination still work, only the strip says "unavailable" |

### The rule

| | Version A — throw | Version B — catch |
|---|---|---|
| Effect | whole route replaced by error UI | one section degrades |
| Right when | the data **is** the page | the data is one widget among many |
| Example | product detail with no product | a "recommended items" sidebar |

**If the page is meaningless without this data, throw. If the page is still useful,
catch.**

And: an empty `catch` that shows nothing isn't error handling, it's hiding. Either
tell the user or log it somewhere you'll actually look.

---

## Bonus lab — the waterfall, side by side

**Goal:** one page showing sequential vs parallel timings next to each other.

**File:** `app/lab/waterfall/page.tsx`

### What you're building

**Three separate `async` functions in this one file**, each timing itself and
returning `{ ms, ... }`. The page calls all three and renders a table.

Use `getPosts()` (300ms), `getUsers()` (300ms), `getStats()` (800ms).

### 1. `runSequential()`

Three `await`s on separate lines. Time it with `Date.now()` either side.
Return `{ ms, counts: [posts.length, users.length, stats.totalProducts] }`.

### 2. `runParallel()`

Same three, one `Promise.all([...])`. Same return shape.

### 3. `runBroken()`

```ts
await Promise.all([getPosts, getUsers, getStats]);   // note: NO ()
```

Return `{ ms, types: results.map((r) => typeof r) }`.

### 4. The page

Call all three, render a 3-row table: **Approach · Time · What came back**.

### Expected numbers

| Row | Time | What came back |
|---|---|---|
| A — sequential | ~1400ms | `10, 5, 20` |
| B — Promise.all | ~800ms | `10, 5, 20` |
| C — missing `()` | **~0ms** | `function, function, function` ⚠️ |

**Row C is the point of including it.** It looks like the fastest result on the page,
but those aren't promises — they're function objects. `Promise.all` resolves
non-promise values instantly, so it finishes having fetched nothing.

TypeScript won't save you: it only complains if you actually *use* the results. Render
just the timings and it stays silent.

A vs B is the mental model: **1400 ≈ the sum. 800 ≈ the slowest one.** Parallel isn't
"faster on average" — it's bounded by your slowest fetch.

---

## Done when

- Pagination works and preserves other query params
- You have measured sequential vs parallel timings
- `cache()` demonstrably reduced the call count — you have both numbers
- A deliberately failing fetch is handled both ways

---

## Recall questions

1. `await res.json()` returns `any`. Why is that dangerous, and what are two ways to
   make it safe?
2. What is request memoization, how long does it last, and what makes two calls "the
   same"?
3. Why doesn't `fetch` reject on an HTTP 500? What does it take to make it throw?
4. When is a waterfall acceptable and when is it a bug?
5. This page reads `searchParams` so it can't be static. Does that mean nothing about
   it can be cached?
6. How would `<Suspense>` change the user experience of a waterfall **without**
   removing the waterfall?

---

## Not yet

No `loading.tsx` or `error.tsx` yet (Phase 7) — failures are raw. No `fetch`, no Data
Cache (Phase 11).
