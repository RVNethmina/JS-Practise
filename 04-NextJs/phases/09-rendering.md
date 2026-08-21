# Phase 9 — Rendering

**6 problems** · Vault folder: `13-rendering`

> From here on, **`npm run build` is your primary instrument.** Its route table is
> the only reliable way to see what Next.js actually decided. Guessing does not work.

## Read first

- `NextJs-Vault/13-rendering/Static vs Dynamic Rendering.md`
- `NextJs-Vault/13-rendering/Streaming and Suspense.md`

## The one idea in this phase

Every route gets one of two treatments:

| Marker | Name | When it renders | Speed |
|---|---|---|---|
| `○` / `●` | **Static** | once, at build time | instant — it's a file |
| `ƒ` | **Dynamic** | on every request | slower — work per visit |

**You don't choose directly.** Next infers it: use a **dynamic API** anywhere in the
route, and the whole route becomes dynamic. The dynamic APIs are `cookies()`,
`headers()`, `searchParams`, `connection()`, and any uncached `fetch`.

The second idea is **streaming**: wrap a slow section in `<Suspense>` and Next sends
the rest of the page immediately, filling that hole in when the data arrives.

## Do this before you start

```bash
cd C:\Hello\My_Projects\JS-Practise\04-NextJs\practise-app && npm run build
```

**Write down the marker for every route.** That's your baseline — every problem in
this phase is measured against it.

---

## Problem 1 — Fully static blog

**Goal:** the blog is entirely built at build time, and an unlisted slug 404s.

**Files:** `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`

### Steps

1. Confirm `generateStaticParams` returns every post
2. **Remove every dynamic API** from this route — no `cookies()`, no `searchParams`,
   nothing
3. Build. Confirm one `●` entry per post.
4. Add `export const dynamicParams = false`
5. Build again, then visit a slug that isn't in your seed data

### What you need to know

`dynamicParams` controls what happens for a value `generateStaticParams` didn't
return:

- **`true`** (default) — render it on demand, then cache it. New posts work without a
  rebuild.
- **`false`** — 404 immediately. Only the listed values exist.

`false` is right for a fixed set — docs pages, marketing routes. `true` is right when
content is added after deploy.

### Verify

1. One `●` route per post, count matching your data
2. With `dynamicParams = false`, an unlisted slug 404s

---

## Problem 2 — Dynamic dashboard

**Goal:** watch a route flip from static to dynamic because of **one line**.

**File:** `app/dashboard/page.tsx`

### Steps

1. Note the current marker from your baseline
2. Add `const cookieStore = await cookies()` — imported from `next/headers`
3. Read a fake session value from it
4. Build again and compare the marker

### What you need to know

**`cookies()` is async in Next 15+.** It used to be synchronous. Old tutorials get
this wrong.

**Why reading a cookie forces dynamic:** cookies are per-visitor. If Next prerendered
this page at build time, it would have to bake in *someone's* cookie — and serve that
to everyone. Impossible, so it renders per request instead.

This is the single most important cause-and-effect in the whole phase.

### Verify

The route flipped to `ƒ`, and **you can point at the exact line** that caused it.

---

## Problem 3 — Mixed server and client page

**Goal:** map the boundary precisely and prove what's in the bundle.

**File:** `app/(shop)/products/page.tsx`

### Steps

1. Server Component fetches and renders the list
2. A small Client Component handles sorting
3. A **third** arrangement: a Client Component that wraps a Server Component passed as
   `children`
4. **Draw the tree in a comment**, marking every node server or client
5. Measure what actually ships: `npm run build && npm start`, then
   **DevTools → Network → "JS" filter → hard-reload** and read *transferred*

> ⚠️ Older tutorials say to read the **First Load JS** column from
> `npm run build`. **Next 16 removed it** — the upgrade guide says those metrics
> were *"inaccurate in server-driven architectures using React Server
> Components"*. Measure in the browser, or use `npx next experimental-analyze`.

### What you need to know

**Step 3 is the subtle one.** A Client Component **cannot import** a Server Component
— but it **can render** one passed as `children`:

```
<ClientWrapper>
  <ServerThing />        ← allowed: the page composed this, not ClientWrapper
</ClientWrapper>
```

The difference: `ClientWrapper` never sees the component, only its **already-rendered
output**. The composition happened on the server. Importing would mean the client
needs the code; receiving as children means it only needs the result.

That distinction is a favourite interview question.

### Verify

The client bundle contains only the two interactive components. You have the First
Load JS number.

---

## Problem 4 — Streaming dashboard sections

**Goal:** the page shell paints immediately and three sections fill in as their data
arrives.

**File:** `app/dashboard/page.tsx`

### Steps — **do it wrong first**

1. **Wrong version:** `await` all three fetches in the parent, then wrap each section
   in `<Suspense>` anyway
2. Load it. **Nothing streams** — the whole page waits. Note that.
3. **Now fix it.** Extract each section into its **own async component** that does
   **its own** fetch
4. In the parent, render `<Suspense fallback={...}><StatsSection /></Suspense>` — with
   **no `await` in the parent at all**
5. Give each a distinct fallback
6. Confirm the delays differ: 600 / 800 / 1200ms

### What you need to know

**Why the wrong version fails — this is the whole lesson.**

Streaming works by sending HTML in pieces. Next can only send the shell early if the
shell doesn't depend on the slow data.

When you `await` in the parent, the **parent function itself** is suspended. Nothing
can render — not the shell, not the fallbacks — because the parent hasn't returned.
The `<Suspense>` wrappers are pointless: their content is already resolved by the time
they render.

**The await must live inside the component the boundary wraps.** Then the parent
returns instantly with three holes, and each fills independently.

```
❌ parent awaits  →  parent blocked  →  nothing renders  →  no streaming
✅ child awaits   →  parent returns  →  shell + fallbacks →  each fills in
```

### Verify

1. The shell appears immediately
2. The 600ms section fills first, the 1200ms one last
3. You watched the wrong version fail to stream

---

## Problem 5 — Pre-render popular products only

**Goal:** top products are instant; the rest are slow **once**, then fast.

**File:** `app/(shop)/products/[id]/page.tsx`

### Steps

1. `generateStaticParams` returns only the **top N** ids (5 is fine)
2. Leave `dynamicParams` at its default (`true`)
3. Add `export const revalidate = 60`
4. Build — confirm only N entries
5. `npm start`, then request an **unlisted** id and time it
6. Request **the same** id again and time it

### What you need to know

This is **Incremental Static Regeneration (ISR)**, and it's the pattern real
e-commerce sites use.

First request to an unlisted id: rendered on demand (slow), **then written to disk**.
Every later request serves that file (fast). You get static performance for a catalogue
too large to fully prebuild.

`revalidate = 60` means a stored page is considered stale after 60 seconds. The next
visitor still gets the stale copy immediately, and a refresh happens in the
background — **stale-while-revalidate**. Know that term.

### Verify

Listed ids are instant. An unlisted one is slow once — the **second** request is
measurably faster.

---

## Problem 6 — Static shell with a streaming personalised section

**Goal:** the page frame paints instantly even though part of it is per-user.

**File:** `app/users/[username]/page.tsx`

### Steps

1. Keep the static parts — headings, layout, anything not per-user — outside any
   boundary
2. Put the personalised part in its own async component
3. Wrap **only that** in `<Suspense>`
4. Comment on how Partial Prerendering would change this

### What you need to know

This is the payoff of Problems 2 and 4 combined. Reading per-user data normally makes
the whole route dynamic. Isolating it behind a boundary means the **shell** can still
be prerendered while only the personalised hole is dynamic.

**Partial Prerendering (PPR)** is the Next feature that formalises this. In Next 16 it
is tied to **Cache Components** (`cacheComponents: true` in `next.config.ts`), which
is **not enabled in this app**. So write the comment, don't enable it — turning it on
changes caching semantics across the whole app and would invalidate Phase 11.

### Verify

The shell paints before the personalised data arrives.

---

## Done when

- You have **before/after build tables** and can explain every marker change
- Streaming visibly works — you watched sections fill in
- You've seen streaming **fail** by awaiting in the parent
- An unlisted product id is slow once, then fast
- You can name every API that forces dynamic rendering

---

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

---

## Not yet

No `fetch` caching (Phase 11 — next). **Rendering mode and data caching are separate
axes**; this phase is only the first one.
