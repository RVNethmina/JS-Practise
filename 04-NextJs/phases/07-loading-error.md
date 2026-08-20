# Phase 7 — Loading and Error Handling

**6 problems** · Vault folder: `07-loading-error`

> This phase is **why `lib/db.ts` has artificial delays.** Without them, nothing here
> is visible. If a loading state flashes past too fast to see, raise the delay in
> `db.ts` temporarily.

## Read first

- `NextJs-Vault/07-loading-error/loading.tsx and Suspense.md`
- `NextJs-Vault/07-loading-error/not-found and Error Boundaries.md`

## The one idea in this phase

Three more **reserved filenames**, each dropped beside a `page.tsx`. You never import
or wire them — Next.js finds them by name and applies them to that route segment and
everything below it.

| File | Fires when | Server or Client? |
|---|---|---|
| `loading.tsx` | the page is awaiting data | Server |
| `error.tsx` | anything in the segment throws | **Client — mandatory** |
| `not-found.tsx` | `notFound()` is called | Server |

`loading.tsx` is **sugar**: Next wraps your `page.tsx` in a `<Suspense>` boundary and
uses your file as the fallback. Knowing that is a common interview question.

---

## Problem 1 — Dashboard loading state

**Goal:** navigating to `/dashboard` shows a loading state instead of a frozen screen.

**File:** `app/dashboard/loading.tsx`

### Steps

1. Create `loading.tsx` **beside** `app/dashboard/page.tsx`
2. `export default` a function returning a simple "Loading dashboard…" message
3. **Do not** make it `async` — it must render instantly
4. Navigate to `/dashboard` and watch

### What you need to know

- **No imports, no wiring.** The filename is the entire API.
- It must be **synchronous**. An `async` loading component would itself need to load,
  which defeats the point.
- It applies to `/dashboard` **and every route beneath it** that doesn't have its own.

### Verify

You see the loading state before the dashboard appears. If it's too fast, raise the
`db.ts` delay temporarily.

---

## Problem 2 — Product loading skeleton

**Goal:** a skeleton shaped like the real content, so nothing jumps when data arrives.

**File:** `app/(shop)/products/loading.tsx`

### Steps

1. Create the file beside the products page
2. Render a fixed number of placeholder cards — grey blocks
3. **Match the real layout's dimensions** — same widths, heights, spacing, grid
4. Add `aria-busy="true"` on the container
5. Add a visually-hidden "Loading products" label for screen readers
6. Reload and watch the swap closely

### What you need to know

**Why a shaped skeleton beats a spinner:** a spinner is the wrong size, so when real
content arrives the page **jumps**. That jump is measured as **Cumulative Layout
Shift (CLS)**, a Core Web Vital that affects your search ranking. Know that name.

A skeleton that matches dimensions produces zero shift — the grey blocks are simply
replaced in place.

`aria-busy` tells assistive tech the region is updating, so it isn't announced as
finished content.

### Verify

**No visible jump** when real content replaces the skeleton.

---

## Problem 3 — Dashboard error boundary

**Goal:** a thrown error shows your UI instead of crashing the route.

**File:** `app/dashboard/error.tsx`

### Steps

1. `"use client"` as the **first line — this is not optional**
2. Type the props exactly:
   ```
   { error: Error & { digest?: string }, reset: () => void }
   ```
3. Log the error in a `useEffect`
4. Display a **friendly message**, not `error.message` raw
5. **Comment why** you're not showing the raw message
6. Flip `shouldFail` from Phase 6 and confirm this UI appears
7. Then run `npm run build && npm start` and trigger it again in **production mode**
8. Compare what `error.message` contains in dev versus prod

### What you need to know

**Why `"use client"` is mandatory:** error boundaries use React's
`componentDidCatch` mechanism, which only exists in client-side React. There is no
server equivalent. This is a hard requirement, not a style choice.

**Steps 7–8 are the real lesson.** In production, Next **replaces** the real error
message with a generic one and gives you a `digest` — a hash you can match against
your server logs.

Why: the real message might contain a database connection string, a file path, or an
internal ID. Sending that to a browser hands an attacker a map of your system. The
digest lets *you* find the error without telling *them* anything.

### Verify

1. Triggering the failure shows your UI, not a crash
2. You can state the difference between the dev and prod `error.message`

---

## Problem 4 — Product not-found page

**Goal:** a missing product shows custom UI **and** returns a real 404 status.

**File:** `app/(shop)/products/[id]/not-found.tsx`

### Steps

1. Create the file in the `[id]` folder
2. It is a **Server Component** — no `"use client"`, unlike `error.tsx`
3. Friendly message plus a `<Link>` back to `/products`
4. Visit an invalid id and **check the Network tab status code**

### What you need to know

Three differences from `error.tsx`, worth memorising:

| | `not-found.tsx` | `error.tsx` |
|---|---|---|
| Component type | Server | **Client** |
| Triggered by | `notFound()` | any throw |
| Has a `reset` | no | yes |

`notFound()` isn't a failure — it's an expected outcome with a correct HTTP status.
Errors are unexpected.

### Verify

**Network tab shows 404**, not 200. Check the status, not the pixels.

---

## Problem 5 — Nested error boundaries

**Goal:** one broken section doesn't take down the whole dashboard.

**Files:** `app/dashboard/error.tsx`, `app/dashboard/analytics/error.tsx`,
`app/dashboard/analytics/page.tsx`

### Steps

1. Create `app/dashboard/analytics/page.tsx` that throws
2. Give it its **own** `error.tsx` in that folder
3. Confirm `/dashboard/analytics` shows the analytics error while the rest of the
   dashboard still works
4. **Then the experiment:** throw an error inside `app/dashboard/layout.tsx` itself
5. Observe which boundary catches it

### What you need to know

Error boundaries work like layouts — **the nearest one up the tree wins.** A more
specific boundary contains the blast radius.

**Step 4 is the subtle part.** `app/dashboard/error.tsx` does **not** catch an error
thrown by `app/dashboard/layout.tsx`. The boundary is rendered *inside* that layout,
so if the layout itself fails, the boundary never got created. The error escapes to
the **parent** segment's boundary.

That has a practical consequence: to protect a layout, the boundary must live **one
level up**.

### Verify

1. Breaking analytics leaves the rest of the dashboard usable
2. The layout error is **not** caught by `dashboard/error.tsx` — you've seen it and
   can explain why

---

## Problem 6 — Retry button

**Goal:** a Retry button that genuinely recovers from an intermittent failure.

**File:** `app/dashboard/error.tsx`

### Steps

1. Make your failure **intermittent**: fail the first two calls, then succeed
2. Add a button calling `reset()`
3. Track attempts with `useState`; after 3 failures, stop offering retry and show a
   permanent message instead
4. Comment what `reset()` actually re-runs
5. Click through until it recovers

### What you need to know

`reset()` re-renders the segment, which **re-runs the server render** — including the
data fetch. That's why it can genuinely recover.

But if the backend is properly down, retry will fail identically every time. That's
why the attempt cap matters: an infinite Retry button that never works is worse than
an honest "this is broken" message.

### Verify

Retry eventually succeeds against the intermittent failure, and the cap stops it
after 3.

---

## Done when

- Loading UI appears on slow routes
- The skeleton causes **no layout shift**
- A thrown error shows your boundary, not a crash
- Missing products return a **real 404**
- Analytics can break without killing the dashboard
- Retry recovers from intermittent failure
- You can explain the dev-vs-prod `error.message` difference

---

## Recall questions

1. `loading.tsx` is sugar for something. What does Next.js actually wrap your page in,
   and where?
2. Why is a shape-matched skeleton better than a spinner? Name the Core Web Vital.
3. Why must `error.tsx` be a Client Component?
4. What is `digest` for? Why isn't the real message sent to the browser in production?
5. Name three differences between `not-found.tsx` and `error.tsx`.
6. An `error.tsx` doesn't catch errors thrown by the layout at its own level. Why not,
   and where must the boundary live?
7. Does `reset()` re-run the server fetch or only re-render the client? What does that
   imply for a genuinely broken backend?

---

## Not yet

No streaming with manual `<Suspense>` (Phase 9). `loading.tsx` is the coarse,
all-or-nothing version for now — Phase 9 makes it granular.
