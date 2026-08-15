# Phase 3 — Server Components

Concept folder: **03-server-components** · 5 problems

**The most important phase in the track.** The server/client boundary is what Next.js
interviews are actually about — caching, rendering, and actions are all downstream of
it. Don't rush.

## Read first

- `NextJs-Vault/03-server-components/Server Components Fundamentals.md`
- `NextJs-Vault/03-server-components/The Server-Client Boundary.md`
- `NextJs-Vault/06-data-fetching/Sequential vs Parallel Fetching.md` (for Problem 3)

## What you're building

Real data on the page for the first time. Components call `lib/db.ts` **directly** —
no API, no `fetch`, no `useEffect`.

That's the correct production pattern. You don't build an HTTP endpoint to feed your
own pages. Phase 8 builds the API for a hypothetical mobile client, which is the
legitimate reason to have one.

---

## Problem 1 — Server-rendered user list

**File:** `app/users/page.tsx`

Fetch users from `db` and render them.

- `async` Server Component — no directive; Server Components are the default
- `await` the data directly in the component body
- Type the result

**Verify:** view page source. The user names are in the initial HTML, not fetched
afterwards.

---

## Problem 2 — Server-rendered product page

**File:** `app/(shop)/products/[id]/page.tsx` (extend Phase 1's version)

Fetch one product. Call `notFound()` when it doesn't exist.

- `await params` for the id
- `notFound()` from `next/navigation` for missing products
- Add `generateMetadata` setting the title from the product name

**Verify:** a valid id renders; an invalid one 404s; the tab title shows the product.

Add a `console.log` inside your `getProduct`. Note how many times it fires per
request — `generateMetadata` and the page both call it. You'll explain why in
Problem 3's recall questions.

---

## Problem 3 — Server-rendered dashboard

**File:** `app/dashboard/page.tsx`

Three independent datasets — stats, recent orders, notifications — in separate
sections.

- Fetch all three in **parallel**, not sequentially
- Use `Promise.all`, or start the promises before awaiting
- In a comment, record the timing if done sequentially versus in parallel

Time it. With 300ms+ delays in `db.ts` the difference is obvious.

**Verify:** total render time ≈ the slowest single fetch, not the sum.

---

## Problem 4 — Server-side data transformation

**File:** `app/reports/page.tsx`

Fetch a large raw dataset, aggregate it heavily on the server, render only the
summary.

- Imagine 10,000 rows — generate them in `db.ts` if your seed is too small
- Only the computed summary reaches the browser
- Use a genuinely heavy operation so the point lands

**Verify:** the raw rows appear nowhere in the page source or the RSC payload.

---

## Problem 5 — Pass server data into a client component

**Files:** `app/(shop)/products/page.tsx` (server),
`app/(shop)/products/_components/ProductFilter.tsx` (client)

Server fetches products; a client component filters them.

- Server Component fetches and passes data down as props
- Client Component holds the filter state
- **Deliberately try passing a function as a prop.** Read the error. Then remove it.
- Also try passing a `Date` object and see what happens.

**Verify:** filtering works with zero network requests after initial load.

---

## Done when

- Data appears in initial HTML on every page above
- The dashboard's three fetches run in parallel — you've measured it
- You've seen the error from passing a non-serializable prop across the boundary
- `/reports` ships the summary but not the raw data

## Recall questions

1. Compare Problem 1 to the `useEffect` + `useState` approach in plain React. Name
   three things that disappear.
2. `generateMetadata` and the page both fetch the same product. Does that mean two
   network requests? What prevents the duplication?
3. What is a request waterfall? Which of these is one?
   `const a = await getA(); const b = await getB();` versus
   `const [a, b] = await Promise.all([getA(), getB()]);`
4. Explain the bundle-size argument for Server Components. Contrast with what a
   traditional SPA must ship.
5. Exactly what can and cannot cross the server-to-client boundary? Why is that the
   rule — what does Next have to do to those props?
6. Name five things a Server Component cannot do.

## Not yet

No `"use client"` beyond the one filter (Phase 4 goes deep). No `loading.tsx` or
`error.tsx` (Phase 7). No `fetch` — direct `db` access only.
