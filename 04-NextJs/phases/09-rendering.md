# Phase 9 — Rendering

Concept folder: **13-rendering** · 6 problems

From here on, **`npm run build` is your primary instrument.** Its route table is the
only reliable way to see what Next.js actually decided.

## Read first

- `NextJs-Vault/13-rendering/Static vs Dynamic Rendering.md`
- `NextJs-Vault/13-rendering/Streaming and Suspense.md`

## Before you start

Run `npm run build` and write down the current marker for every route — `○` static,
`●` SSG, `ƒ` dynamic. You'll compare against this throughout the phase.

---

## Problem 1 — Static blog page

**Files:** `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`

Fully static, generated at build.

- `generateStaticParams` for every post
- No dynamic APIs anywhere in the tree
- Set `dynamicParams` and observe what changes

**Verify:** the build emits one entry per post. Set `dynamicParams = false` and
confirm an unlisted slug 404s instead of rendering.

---

## Problem 2 — Dynamic dashboard page

**File:** `app/dashboard/page.tsx`

Per-user, cannot be static.

- Read a fake session from `cookies()` — remember it's **async** in Next 15+
- Confirm the build marks it `ƒ`

**Verify:** the route flipped from whatever it was to dynamic. You can point at the
exact line that caused it.

---

## Problem 3 — Mixed server and client page

**File:** `app/(shop)/products/page.tsx`

Deliberately mix both component types and map the boundary.

- Server Component fetches and renders the list
- A small Client Component handles sorting
- Another Client Component wraps a Server Component passed as `children`
- **Draw the tree in a comment**, marking each node server or client

**Verify:** the client bundle contains only the two interactive components. Check
the build's First Load JS for the route.

---

## Problem 4 — Streaming dashboard sections

**File:** `app/dashboard/page.tsx`

Three independently-loading sections.

- Each in its own `<Suspense>` with a distinct fallback
- Each section is an async component doing **its own** fetch
- Do **not** await them in the parent — that defeats streaming entirely
- Give them different delays in `db.ts` (200ms / 800ms / 2000ms)

**Do it wrong first:** await all three in the parent, keep the Suspense wrappers, and
observe that nothing streams. Then push the awaits down.

**Verify:** fast sections paint first; slow ones fill in progressively. The shell
appears immediately.

---

## Problem 5 — Pre-rendered product route

**File:** `app/(shop)/products/[id]/page.tsx`

Pre-render popular products, generate the rest on demand.

- `generateStaticParams` returns only the top N
- Leave `dynamicParams` true
- Add `revalidate`

**Verify:** listed ids are instant. An unlisted one works but is slower **once**,
then fast. Confirm the second request is faster.

---

## Problem 6 — Dynamic user route with a static shell

**File:** `app/users/[username]/page.tsx`

Static parts render immediately; personalised content streams.

- Static shell (layout, headings) paints first
- Personalised part inside `<Suspense>`
- Comment on how Partial Prerendering would change this

**Verify:** the shell paints before the personalised data arrives.

---

## Done when

- You have before/after build tables and can explain every marker change
- Streaming visibly works — you watched sections fill in
- You've seen streaming *fail* by awaiting in the parent
- An unlisted product id is slow once, then fast

## Recall questions

1. What does `export const dynamicParams = false` do for an unlisted slug?
2. List every API that forces a route into dynamic rendering. There are more than
   three.
3. A Client Component can **render** a Server Component passed as children but cannot
   **import** one. Explain that distinction precisely.
4. What exactly does the server send, and in what order, when streaming? Why does
   awaiting in the parent break it?
5. Describe what happens on the first request to an unlisted product versus the
   second. Where does the generated page go?
6. What problem does Partial Prerendering solve that static and dynamic rendering
   alone cannot? Is it stable?
7. This dashboard is dynamic and uncacheable. Name two techniques that still make it
   fast.

## Not yet

No `fetch` caching (Phase 11 — next). Rendering mode and data caching are separate
axes; this phase is only the first.
