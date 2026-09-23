# Phase 7 — Loading and Error Handling

**6 problems** · Vault folder: `07-loading-error`

> This phase is **why the data functions have artificial delays.** Without them
> nothing here is visible. If a loading state flashes past too fast to see, temporarily
> raise `DELAYS` in `lib/db-core.ts`.

## Read first

- `NextJs-Vault/07-loading-error/loading.tsx and Suspense.md`
- `NextJs-Vault/07-loading-error/not-found and Error Boundaries.md`

## The one idea

Three more **reserved filenames**, dropped beside a `page.tsx`. You never import or
wire them — Next finds them by name and applies them to that route segment and
everything below it.

| File | Fires when | Server or Client? |
|---|---|---|
| `loading.tsx` | the page is awaiting data | Server |
| `error.tsx` | anything in the segment throws | **Client — mandatory** |
| `not-found.tsx` | `notFound()` is called | Server |

## What you'll have built by the end

```
app/dashboard/loading.tsx               ← P1  new
app/dashboard/error.tsx                 ← P3  new
app/dashboard/analytics/page.tsx        ← P3  new, throws on demand
app/dashboard/analytics/error.tsx       ← P5  new, extended in P6
app/(shop)/products/(list)/loading.tsx  ← P2  new
app/(shop)/products/[id]/not-found.tsx  ← P4  new
lib/dashboard.ts                        ← P3 and P6 additions
app/globals.css                         ← P2 skeleton class
```

---

## Problem 1 — Dashboard loading state

**Goal:** navigating to `/dashboard` shows a loading message instead of a frozen
screen for ~1.2 seconds.

**File:** `app/dashboard/loading.tsx` *(new)*

### Build

1. `export default function DashboardLoading()`
2. Return `<p>Loading dashboard…</p>` — that is genuinely all
3. **Do not** make it `async`, and give it no props

### Why

`loading.tsx` is sugar: Next wraps your `page.tsx` in `<Suspense>` and uses this file
as the fallback. Knowing that is a common interview question.

It must be synchronous — an `async` loading component would itself need to load.

### Test

Navigate to `/dashboard` with `npm run dev`. You see the message, then the dashboard.
It covers `/dashboard/settings` too, since those pages have no `loading.tsx` of their own.

---

## Problem 2 — Product loading skeleton

**Goal:** a skeleton shaped like the real content, so nothing jumps when data arrives.

**Files:** `app/(shop)/products/(list)/loading.tsx` *(new)*, `app/globals.css` *(edit)*

> [!danger] Where this file goes matters, and it's not obvious
> The natural place is `app/(shop)/products/loading.tsx`. **Don't.**
>
> `loading.tsx` covers its segment *and every child*, so that location also wraps
> `/products/[id]` in a Suspense boundary. Once a response starts streaming, the
> HTTP status is already sent — so `notFound()` in the detail page can no longer
> return 404. It renders your not-found UI with a **200**, silently breaking
> Problem 4.
>
> Fix: put the list page and its loading file in a `(list)` route group, so the
> boundary can't reach `[id]`:
>
> ```
> app/(shop)/products/
> ├── (list)/
> │   ├── page.tsx        → /products     (URL unchanged)
> │   └── loading.tsx     → covers ONLY the list
> └── [id]/
>     ├── page.tsx        → /products/p-1
>     └── not-found.tsx
> ```
>
> Moving `page.tsx` down one level means its imports change from
> `./_components/...` to `../_components/...`.
>
> This is also better UI: a six-row list skeleton is the wrong shape for a single
> product page anyway.

### Build

1. Container `<div>` with `aria-busy="true"`
2. A visually-hidden `<span>` reading "Loading products", for screen readers
3. Six placeholder rows — matching `pageSize: 6` on the real page
4. Add a `.skeleton-row` class to `globals.css`: fixed height, grey background,
   rounded corners, bottom margin
5. Match the real list's width and spacing

### Why

A spinner is the wrong size, so real content arriving makes the page **jump**. That
jump is measured as **Cumulative Layout Shift (CLS)**, a Core Web Vital that affects
search ranking. Know that name.

### Test

Load `/products` and watch the swap. **No visible jump.** `getProducts` has a 2000ms
delay, so you get a good look.

---

## Problem 3 — Dashboard error boundary

**Goal:** a thrown error shows your UI instead of a crash.

**Files:** `lib/dashboard.ts` *(edit)*, `app/dashboard/analytics/page.tsx` *(new)*,
`app/dashboard/error.tsx` *(new)*

### 3a. Add to `lib/dashboard.ts`

```ts
export type AnalyticsSummary = {
  pageViews: number;
  conversionRate: number;
  topReferrer: string;
};

export async function getAnalytics(
  options: { fail?: boolean } = {}
): Promise<AnalyticsSummary>
```

- `await sleep(DELAYS.fast)` first
- If `options.fail` is true, `throw new Error("Analytics provider timed out")`
- Otherwise return three plausible hardcoded numbers

### 3b. `app/dashboard/analytics/page.tsx`

- Props: `searchParams: Promise<{ [key: string]: string | string[] | undefined }>`
- Read `?fail=1`, pass it as `getAnalytics({ fail })`
- Render the three numbers, plus links to `?fail=1` and back

> Reading `searchParams` makes this route **dynamic**. Expected — note it, Phase 9
> re-baselines the whole build table.

### 3c. `app/dashboard/error.tsx`

1. `"use client"` as the **first line — not optional**
2. Props typed exactly:
   ```ts
   { error: Error & { digest?: string }; reset: () => void }
   ```
3. `useEffect(() => { console.error(error); }, [error])`
4. Render a **friendly** message — **not** `error.message`
5. Show `error.digest` in small text when present
6. A button calling `reset()`
7. Comment why you don't show the raw message

### Why `"use client"` is mandatory

Error boundaries use React's `componentDidCatch`, which only exists in client-side
React. There is no server equivalent. A hard requirement, not a style choice.

### Test

| URL | Expect |
|---|---|
| `/dashboard/analytics` | 200, three numbers |
| `/dashboard/analytics?fail=1` | your error UI — **and the dashboard nav and sidebar still visible**, because the boundary renders inside the layout |

Then run `npm run build && npm start` and hit `?fail=1` again. **Compare
`error.message` in dev versus production.** In prod, Next replaces it with a generic
string and gives you a `digest` hash — because the real message could contain a
connection string or a file path. The digest lets *you* find it in your logs without
handing an attacker a map.

---

## Problem 4 — Product not-found page

**Goal:** a missing product shows custom UI **and** returns a real 404 status.

**File:** `app/(shop)/products/[id]/not-found.tsx` *(new)*

### Build

1. A **Server** Component — no `"use client"`, unlike `error.tsx`
2. Heading "Product not found", one sentence, and a `<Link href="/products">`
   **with text between the tags**
3. No props — `not-found.tsx` receives none

### Why

`notFound()` isn't a failure — it's an expected outcome with a correct HTTP status.
Errors are unexpected. Three differences worth memorising:

| | `not-found.tsx` | `error.tsx` |
|---|---|---|
| Component type | Server | **Client** |
| Triggered by | `notFound()` | any throw |
| Has `reset` | no | yes |

### Test

`/products/p-9999` shows your UI, and the **Network tab shows 404**, not 200. Check
the status, not the pixels — a "404 page" returning 200 gets indexed by search engines.

---

## Problem 5 — Nested error boundary

**Goal:** one broken section stops taking down the whole dashboard.

**File:** `app/dashboard/analytics/error.tsx` *(new)*

### Build

1. Same shape as P3's — `"use client"`, same props
2. A message specific to analytics, e.g. "Analytics is unavailable."
3. A `reset()` button

### Test — the comparison IS the problem

Load `/dashboard/analytics?fail=1` **before** and **after** adding this file:

| | Before P5 | After P5 |
|---|---|---|
| Who catches it | `dashboard/error.tsx` | `analytics/error.tsx` |
| What you see | whole dashboard content replaced | only the analytics panel replaced |

The nearest boundary up the tree wins, so a more specific one contains the blast radius.

### Then the layout experiment

Temporarily add `throw new Error("layout boom");` at the top of
`app/dashboard/layout.tsx`, and load `/dashboard`.

**`app/dashboard/error.tsx` does NOT catch it.** That boundary renders *inside* the
layout, so when the layout itself fails the boundary was never created. The error
escapes to the parent segment.

Practical consequence: **to protect a layout, the boundary must live one level up.**
Remove the throw afterwards.

---

## Problem 6 — Retry button

**Goal:** a Retry that genuinely recovers, and gives up after 3 tries.

**Files:** `lib/dashboard.ts` *(edit)*, `app/dashboard/analytics/page.tsx` *(edit)*,
`app/dashboard/analytics/error.tsx` *(edit)*

### 6a. Make the failure intermittent — add to `lib/dashboard.ts`

```ts
let analyticsAttempts = 0;

export async function getFlakyAnalytics(): Promise<AnalyticsSummary> {
  analyticsAttempts++;
  await sleep(DELAYS.fast);

  if (analyticsAttempts <= 2) {
    throw new Error(`Analytics timed out (attempt ${analyticsAttempts})`);
  }

  return { pageViews: 12043, conversionRate: 2.4, topReferrer: "google.com" };
}
```

Fails the first two calls, succeeds from the third. Restart the server to reset it.

### 6b. Use it

In `app/dashboard/analytics/page.tsx`, read a second param `?flaky=1` and call
`getFlakyAnalytics()` instead of `getAnalytics()` when it's set.

### 6c. Extend `app/dashboard/analytics/error.tsx`

Two things here are **not obvious**, and both were found by testing rather than
reading:

> [!warning] `reset()` alone does NOT re-fetch from the server
> It re-renders the boundary from the payload the client already has — which still
> contains the error. Click Retry twice and the server function runs **zero** extra
> times. Prove it with a `console.log` in `getFlakyAnalytics`.
>
> You need **`router.refresh()`** to force a fresh server request.

> [!warning] `useState` cannot hold the attempt count
> `reset()` **remounts** the boundary, so `useState(0)` starts at 0 again every time
> and the counter never climbs past 1. Use a **module-level variable**, which
> survives the remount.

```tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

let attemptCount = 0;   // module scope — survives the remount

export default function AnalyticsError({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(attemptCount);

  useEffect(() => { console.error(error); }, [error]);

  function retry() {
    attemptCount += 1;
    setAttempts(attemptCount);
    router.refresh();   // re-fetch on the server
    reset();            // re-render the boundary
  }

  return (
    <div>
      <h2>Analytics is unavailable.</h2>
      {error.digest && <p>Reference: {error.digest}</p>}
      {attempts < 3
        ? <button onClick={retry}>Try again ({attempts}/3)</button>
        : <p>Still failing. Try again later.</p>}
    </div>
  );
}
```

`attemptCount` only resets on a full page load, not on success. Fine for a lab.

### Why the cap

Even with `router.refresh()`, a genuinely dead backend fails identically every time.
An infinite Retry that never works is worse than an honest "this is broken".

### Test

`/dashboard/analytics?flaky=1` → error → Retry → error **and the counter reads
(1/3)** → Retry → **succeeds**, showing 12043 / 2.4% / google.com.

Two ways to tell it's wrong:

- counter stuck at **(0/3)** → your count is in `useState`
- **the digest never changes** between retries → you're missing `router.refresh()`

Restart the server to reset `analyticsAttempts` before trying again.

---

## Done when

- Loading UI appears on `/dashboard` and `/products`
- The products skeleton causes **no layout shift**
- `?fail=1` shows your boundary, not a crash
- `/products/p-9999` returns a **real 404**
- Analytics breaks without killing the dashboard
- The layout throw escaped `dashboard/error.tsx` — you watched it happen
- Retry recovers on the third attempt and caps at 3
- `npm run build` passes

---

## Recall questions

1. `loading.tsx` is sugar for something. What does Next wrap your page in, and where?
2. Why is a shape-matched skeleton better than a spinner? Name the Core Web Vital.
3. Why must `error.tsx` be a Client Component?
4. What is `digest` for? Why isn't the real message sent to the browser in production?
5. Name three differences between `not-found.tsx` and `error.tsx`.
6. An `error.tsx` doesn't catch errors thrown by the layout at its own level. Why not,
   and where must the boundary live?
7. Does `reset()` re-run the server fetch, or only re-render the client? What must you
   pair it with to actually re-fetch?
8. Why can't the retry counter live in `useState`?
9. `loading.tsx` on a parent segment changes what `notFound()` can do in a child
   route. What changes, and why?

---

## Not yet

No streaming with manual `<Suspense>` (Phase 9). `loading.tsx` is the coarse,
all-or-nothing version for now — Phase 9 makes it granular.
