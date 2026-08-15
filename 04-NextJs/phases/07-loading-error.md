# Phase 7 — Loading and Error Handling

Concept folder: **07-loading-error** · 6 problems

This phase is why `lib/db.ts` has artificial delays. Without them nothing here is
visible.

## Read first

- `NextJs-Vault/07-loading-error/loading.tsx and Suspense.md`
- `NextJs-Vault/07-loading-error/not-found and Error Boundaries.md`

---

## Problem 1 — Dashboard loading state

**File:** `app/dashboard/loading.tsx`

- Sits beside `page.tsx`, no imports or wiring
- Default export
- Must be **synchronous** — it renders instantly

**Verify:** navigate to `/dashboard` and see it. If it flashes past, raise the delay
in `db.ts` temporarily.

---

## Problem 2 — Product loading skeleton

**File:** `app/(shop)/products/loading.tsx`

Skeleton matching the real product grid's shape.

- Mirror the real layout's dimensions to avoid layout shift
- A fixed number of placeholder cards
- `aria-busy` plus a screen-reader-only "Loading" label

**Verify:** no visible jump when real content replaces it.

---

## Problem 3 — API error UI

**File:** `app/dashboard/error.tsx`

- **Must** be a Client Component — `"use client"`, no exceptions
- Props: `{ error: Error & { digest?: string }, reset: () => void }`
- Log the error in a `useEffect`
- Display a friendly message, **not** `error.message` raw. Comment why.

**Verify:** trigger your `shouldFail` flag from Phase 6 and see this UI instead of a
crash.

Then run `npm run build && npm start` and trigger it again in production mode.
Compare what `error.message` contains versus dev. That difference is the whole point
of `digest`.

---

## Problem 4 — Product not-found page

**File:** `app/(shop)/products/[id]/not-found.tsx`

- A Server Component, unlike `error.tsx`
- Triggered by `notFound()` from the page
- Link back to the product list

**Verify:** the response status is genuinely 404 in the network tab, not 200.

---

## Problem 5 — Nested error boundary

**Files:** `app/dashboard/error.tsx`, `app/dashboard/analytics/error.tsx`,
`app/dashboard/analytics/page.tsx`

A failure in analytics must not take down the whole dashboard.

Then, deliberately: throw an error inside `app/dashboard/layout.tsx` itself. Observe
which boundary catches it.

**Verify:** breaking analytics leaves the rest of the dashboard usable. The layout
error is **not** caught by `dashboard/error.tsx` — you've seen it and can explain
why.

---

## Problem 6 — Retry button

**File:** `app/dashboard/error.tsx`

Working retry via the `reset` prop.

- Call `reset()` on click
- Track attempt count; stop offering retry after N failures
- Comment what `reset()` actually re-runs

Make your `shouldFail` flag intermittent — fail the first two calls, then succeed —
so retry can genuinely recover.

**Verify:** retry eventually succeeds against the intermittent failure.

---

## Done when

- Loading UI appears on slow routes
- The skeleton causes no layout shift
- A thrown error shows your boundary, not a crash
- Missing products return a real 404
- Analytics can break without killing the dashboard
- Retry recovers from intermittent failure

## Recall questions

1. `loading.tsx` is sugar for something. What does Next.js actually wrap your page
   in, and where?
2. Why is a shape-matched skeleton better than a spinner? Name the Core Web Vital.
3. Why must `error.tsx` be a Client Component?
4. What is `digest` for? Why isn't the real message sent to the browser in
   production?
5. Name three differences between `not-found.tsx` and `error.tsx`.
6. An `error.tsx` doesn't catch errors thrown by the layout at its own level. Why
   not, and where must the boundary live?
7. Does `reset()` re-run the server fetch or only re-render the client? What does
   that imply for a genuinely broken backend?

## Not yet

No streaming with manual `<Suspense>` (Phase 9). `loading.tsx` is the coarse
all-or-nothing version for now.
