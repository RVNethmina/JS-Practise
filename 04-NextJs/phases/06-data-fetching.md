# Phase 6 — Data Fetching

Concept folder: **06-data-fetching** · 7 problems

## Read first

- `NextJs-Vault/06-data-fetching/Server-Side Data Fetching.md`
- `NextJs-Vault/06-data-fetching/Sequential vs Parallel Fetching.md`

## What you're building

Deeper data work: pagination, dependent data, deliberate waterfalls you then fix,
and proper failure handling.

Still reading `db` directly. `fetch` arrives in Phase 11 when there's an API to hit
and a cache to observe.

---

## Problem 1 — Fetch user list

**File:** `app/users/page.tsx` (extend Phase 3's version)

Harden it. Type the result properly, handle an empty list, handle a throw from `db`.

**Verify:** data in initial HTML; an empty dataset renders an empty state, not a
crash.

---

## Problem 2 — Product list with cache annotations

**File:** `app/(shop)/products/page.tsx`

You have no `fetch` yet, so this is preparation. In comments at the top, write the
three variants you'd use if this were `fetch`, and when each is right:

```
fetch(url)                              // Next 15+ default
fetch(url, { cache: "force-cache" })
fetch(url, { next: { revalidate: 60 } })
```

Then implement the page with `db`.

**Verify:** the page works. The comments are your Phase 11 starting point.

---

## Problem 3 — Product detail and request memoization

**File:** `app/(shop)/products/[id]/page.tsx`

Extract a `getProduct(id)` helper used by **both** `generateMetadata` and the page.

- Do **not** manually cache it
- `console.log` inside and count the calls per request
- Then wrap it in React's `cache()` and count again

**Verify:** you can state the before and after counts, and explain the difference.

`fetch` gets memoization automatically; a `db` call does not. That's exactly what
`cache()` is for.

---

## Problem 4 — Blog post

**File:** `app/blog/[slug]/page.tsx`

Extend Phase 5's version with a per-post view. `notFound()` for missing posts.

Add a comment recording where `next: { revalidate: 3600 }` would go once this uses
`fetch`.

**Verify:** posts render; missing slugs 404.

---

## Problem 5 — Paginated results

**File:** `app/(shop)/products/page.tsx`

Server-side pagination driven by `searchParams`.

- Read `page`, default to 1
- Fetch only that slice
- Previous/Next links with `next/link`, **preserving other query params**
- Disable Previous on page 1, Next on the last page
- Handle a `page` beyond the end

**Verify:** navigating pages updates the URL and refetches. `?page=999` doesn't
crash.

---

## Problem 6 — Dependent data

**File:** `app/users/[username]/page.tsx`

Fetch a user, then that user's posts using an id from the first response — a genuine
dependency.

Then add a **third** fetch that doesn't depend on either, and run it in parallel with
the first.

Comment the timing of each approach.

**Verify:** the independent fetch doesn't wait for the dependent chain. You measured
it.

---

## Problem 7 — Handle a failed request

**Files:** `app/(shop)/products/page.tsx`, plus a lab route

Two failure strategies:

- **Version A** — throw, let an error boundary catch it (boundary arrives in Phase 7;
  for now confirm the throw propagates)
- **Version B** — catch locally, render an inline fallback with the rest of the page
  intact

Comment when each is right.

Add a `shouldFail` flag to a `db` function so you can trigger failure on demand.

**Verify:** version B keeps the page usable; version A takes the route down.

---

## Bonus lab — the waterfall

**File:** `app/lab/waterfall/page.tsx`

Two sections side by side: one doing three sequential awaits, one doing
`Promise.all`. Render elapsed ms for each.

**Verify:** the numbers differ by roughly 2×–3× with your `db` delays. Screenshot it
mentally — this is the interview answer.

---

## Done when

- Pagination works and preserves query params
- You have measured sequential vs parallel timings
- `cache()` demonstrably reduces call counts
- A deliberately failing fetch is handled both ways

## Recall questions

1. `await res.json()` returns `any`. Why is that dangerous, and what are two ways to
   make it safe?
2. What is request memoization, how long does it last, and what makes two calls "the
   same"?
3. Why doesn't `fetch` reject on an HTTP 500? What does it take to make it throw?
4. When is a waterfall acceptable and when is it a bug?
5. This page reads `searchParams` so it can't be static. Does that mean nothing about
   it can be cached?
6. How would `<Suspense>` change the user experience of a waterfall without removing
   the waterfall?

## Not yet

No `loading.tsx` or `error.tsx` yet (Phase 7) — failures are raw. No `fetch`, no
Data Cache (Phase 11).
