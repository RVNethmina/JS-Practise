# Phase 9 — Rendering

**6 problems** · Vault folder: `13-rendering`

> From here on, **`npm run build` is your primary instrument.** Its route table is the
> only reliable way to see what Next.js actually decided. Guessing does not work.

## Read first

- `NextJs-Vault/13-rendering/Static vs Dynamic Rendering.md`
- `NextJs-Vault/13-rendering/Streaming and Suspense.md`

## The one idea

Every route gets one of two treatments:

| Marker | Name | When it renders | Speed |
|---|---|---|---|
| `○` / `●` | **Static** | once, at build time | instant — it's a file |
| `ƒ` | **Dynamic** | on every request | work per visit |

**You don't choose directly.** Next infers it: use a **dynamic API** anywhere in the
route and the whole route becomes dynamic. Those APIs are `cookies()`, `headers()`,
`searchParams`, `connection()`, and any uncached `fetch`.

The second idea is **streaming**: wrap a slow section in `<Suspense>` and Next sends
the rest of the page immediately, filling that hole in when the data arrives.

## Your baseline — this is the current table

Run `npm run build` and confirm it matches. Every problem below is measured against it.

```
○ /                          ○ /lab/counter
○ /about                     ○ /lab/dropdown
○ /admin                     ƒ /lab/failure
○ /blog                      ○ /lab/hydration
● /blog/[slug]      ×10      ○ /lab/modal
○ /contact                   ○ /lab/waterfall
○ /dashboard          ← P2   ○ /login
ƒ /dashboard/analytics       ○ /pricing
○ /dashboard/settings        ƒ /products               ← P3
○ /dashboard/settings/profile ƒ /products/[id]         ← P5
● /docs/[[...slug]]  ×8      ● /products/[id]/variants/[variantId] ×16
                             ○ /register
                             ○ /reports
                             ƒ /shop/[category]
                             ○ /users
                             ƒ /users/[username]       ← P6
```

Four routes change in this phase. **Write down the before value each time.**

## What you'll have built by the end

```
app/blog/[slug]/page.tsx                    <- P1  add dynamicParams
app/dashboard/page.tsx                      <- P2  add cookies(), P4 restructure
app/dashboard/_components/StatsSection.tsx  <- P4  new
app/dashboard/_components/OrdersSection.tsx <- P4  new
app/dashboard/_components/NotifSection.tsx  <- P4  new
app/(shop)/products/(list)/page.tsx         <- P3  add sort + collapsible
app/(shop)/products/_components/SortSelect.tsx    <- P3  new, client
app/(shop)/products/_components/Collapsible.tsx   <- P3  new, client
app/(shop)/products/[id]/page.tsx           <- P5  add generateStaticParams
app/users/[username]/page.tsx               <- P6  add Suspense shell
app/users/[username]/_components/UserPosts.tsx    <- P6  new
```

---

## Problem 1 — Lock the blog to its listed slugs

**Goal:** an unlisted slug 404s **without running your page**.

**File:** `app/blog/[slug]/page.tsx` *(edit)*

### Build

1. Confirm the build already shows **10** `●` blog routes — it does
2. Add one line at the top of the file:
   ```ts
   export const dynamicParams = false;
   ```
3. Rebuild, then `npm start`
4. Visit `/blog/does-not-exist`

### What changes

`dynamicParams` controls what happens for a value `generateStaticParams` didn't return:

| Value | Unlisted slug | Use when |
|---|---|---|
| `true` (default) | rendered on demand, then cached | content is added after deploy |
| `false` | **404 immediately**, your page never runs | the set is fixed |

### Test

Put `console.log("[BlogPost] PAGE COMPONENT RAN")` at the top of `BlogPost`, then hit
`/blog/does-not-exist` with and without the config line. Measured:

```
dynamicParams default   ->  HTTP 404,  page component ran 1 time
dynamicParams = false   ->  HTTP 404,  page component ran 0 times
```

**Same 404 either way — what differs is whether your code ran at all.**

Without it, Next renders your page, `getPost` returns null, and your `notFound()`
produces the 404. With it, Next rejects the request before your component is reached.

> [!info] Not available with Cache Components
> The docs note `dynamicParams` doesn't exist when `cacheComponents` is enabled. It
> isn't enabled here — see the Problem 6 warning for why we're leaving it off.

> Leave `dynamicParams = false` in place. A fixed set of seeded posts is exactly the
> case it's for.

---

## Problem 2 — Flip the dashboard to dynamic with one line

**Goal:** watch `/dashboard` go `○` → `ƒ` because of a single API call.

**File:** `app/dashboard/page.tsx` *(edit)*

### Build

1. Note the baseline: `/dashboard` is currently **`○`**
2. Add at the top of the component:
   ```ts
   import { cookies } from "next/headers";
   // ...
   const cookieStore = await cookies();
   const lastVisit = cookieStore.get("last-visit")?.value ?? "first time";
   ```
3. Render `lastVisit` somewhere on the page
4. Rebuild and compare the marker

There's no real session yet — Phase 12 builds that. Reading *any* cookie is enough to
prove the point.

### Why one cookie forces dynamic

**`cookies()` is async in Next 15+.** It used to be synchronous; old tutorials get this
wrong.

Cookies are **per-visitor**. If Next prerendered this page at build time it would have
to bake in *somebody's* cookie and serve that to everyone. Impossible — so it renders
per request instead.

This is the single most important cause-and-effect in the phase.

### Test

`/dashboard` is now **`ƒ`**, and you can point at the exact line. To see it in a
browser, set the cookie by hand in devtools → Application → Cookies.

---

## Problem 3 — Map the boundary on one page

**Goal:** three component relationships on one page, drawn out in a comment.

**Files:** `app/(shop)/products/(list)/page.tsx` *(edit)*,
`app/(shop)/products/_components/SortSelect.tsx` *(new)*,
`app/(shop)/products/_components/Collapsible.tsx` *(new)*

### 3a. `SortSelect.tsx` — a plain Client Component

- `"use client"`, a `<select>` with the four `ProductSort` values
- On change, write `?sort=` to the URL with `useRouter().replace` — same pattern as
  `SearchBox`
- The page reads `sort` from `searchParams` and passes it to `getProducts`

### 3b. `Collapsible.tsx` — a Client Component that wraps server content

```tsx
"use client";
export default function Collapsible({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) { /* useState open/closed, render children when open */ }
```

**It must not import anything server-side.** It only declares a `children` hole.

### 3c. Use it from the page

```tsx
<Collapsible title="Category guide">
  <CategoryBlurb />     {/* an async SERVER component you write inline or in a file */}
</Collapsible>
```

`CategoryBlurb` should `await getCategories()` and render them.

### 3d. Draw the tree in a comment

Mark every node **server** or **client**, and note which of the three relationships
each edge is.

### The distinction being tested

```
❌ A Client Component cannot IMPORT a Server Component
✅ A Client Component CAN RENDER one passed as children
```

`Collapsible` never sees `CategoryBlurb` — only its **already-rendered output**. The
*page* did the composing, on the server. This is the same pattern as the Phase 4 modal,
and a favourite interview question.

### Test

Sorting changes the URL and the results. The collapsible opens and closes without a
network request. `npm run build` still shows `/products` as `ƒ` (it already reads
`searchParams`).

---

## Problem 4 — Stream the dashboard, wrongly first

**Goal:** the shell paints instantly and three sections fill in as their data lands.

**Files:** `app/dashboard/page.tsx` *(restructure)*, three new section components

### Delays you're working with

| Function | Delay |
|---|---|
| `getNotifications()` | 600ms |
| `getStats()` | 800ms |
| `getRecentOrders()` | 1200ms |

### 4a. Do it WRONG first — this is the lesson

Keep the current `Promise.all` in the page, and just wrap each rendered section in
`<Suspense>`:

```tsx
const [stats, orders, notifications] = await Promise.all([...]);

return (
  <Suspense fallback={<p>Loading stats…</p>}>
    <section>{/* uses stats */}</section>
  </Suspense>
  // ...
);
```

Load it. **Nothing streams** — you wait ~1200ms, then everything appears at once. The
fallbacks never show.

**Why:** the `await` suspends the **parent function**. Until it returns, nothing renders
— not the shell, not the fallbacks. By the time those `<Suspense>` wrappers exist, the
data is already resolved, so they have nothing to wait for.

### 4b. Now fix it

Create three components, each doing **its own** fetch:

```
app/dashboard/_components/StatsSection.tsx    async, awaits getStats()
app/dashboard/_components/OrdersSection.tsx   async, awaits getRecentOrders()
app/dashboard/_components/NotifSection.tsx    async, awaits getNotifications()
```

Then in `page.tsx`, **remove the `Promise.all` entirely** and render:

```tsx
<Suspense fallback={<p>Loading stats…</p>}><StatsSection /></Suspense>
<Suspense fallback={<p>Loading orders…</p>}><OrdersSection /></Suspense>
<Suspense fallback={<p>Loading notifications…</p>}><NotifSection /></Suspense>
```

**No `await` in the page at all** apart from the `cookies()` call from Problem 2.

```
❌ parent awaits  ->  parent blocked  ->  nothing renders  ->  no streaming
✅ child awaits   ->  parent returns  ->  shell + fallbacks -> each fills in
```

### Note on `loading.tsx`

`app/dashboard/loading.tsx` from Phase 7 still applies. It covers the gap **before**
the page returns; these three boundaries cover the gaps **inside** it. Coarse then
fine — they're not in conflict.

### Test

Notifications (600ms) appear first, then stats (800ms), then orders (1200ms). Throttle
to Slow 3G in devtools if it's too quick to see.

---

## Problem 5 — Pre-render popular products only

**Goal:** listed ids are instant; unlisted ones are slow **once**, then fast.

**File:** `app/(shop)/products/[id]/page.tsx` *(edit)*

### Build

1. Add `generateStaticParams` returning **only the first 5** product ids:
   ```ts
   export async function generateStaticParams() {
     const { items } = await getProducts({ pageSize: 5 });
     return items.map((p) => ({ id: p.id }));
   }
   ```
2. Leave `dynamicParams` at its default (`true`) — **don't** set it false here
3. Add `export const revalidate = 60;`
4. `npm run build` — confirm exactly **5** `●` entries
5. `npm start`, then time two requests to an **unlisted** id:
   ```bash
   curl -s -o /dev/null -w "%{time_total}s\n" http://localhost:3000/products/p-15
   curl -s -o /dev/null -w "%{time_total}s\n" http://localhost:3000/products/p-15
   ```

### What you're seeing

This is **Incremental Static Regeneration (ISR)**, and it's what real e-commerce does.

First request to an unlisted id: rendered on demand (slow), **then written to disk**.
Every later request serves that file. Static performance for a catalogue too big to
fully prebuild.

`revalidate = 60` means a stored page goes stale after 60s. The next visitor still gets
the stale copy **immediately**, and a refresh happens in the background —
**stale-while-revalidate**. Know that term.

### Test

Five `●` rows. The second `curl` to `p-15` is **measurably faster** than the first.

> This changes the route from `ƒ` to a mix. Note how the table renders that.

---

## Problem 6 — Static shell, streaming personalisation

**Goal:** the page frame paints instantly even though part of it is per-user.

**Files:** `app/users/[username]/page.tsx` *(edit)*,
`app/users/[username]/_components/UserPosts.tsx` *(new)*

### Build

1. Move the posts fetch out of the page into `UserPosts.tsx`, an async component
   taking `{ userId }: { userId: string }`
2. The page still awaits `getUser(username)` — you need the id, and the name is part
   of the shell
3. Wrap only the posts in `<Suspense fallback={<p>Loading posts…</p>}>`
4. Keep the categories fetch as-is (the parallel one from Phase 6 Problem 6)
5. Comment how Partial Prerendering would change this

### What this combines

Problem 2 showed per-user data makes a route dynamic. Problem 4 showed a boundary lets
the rest render first. Together: the **shell** paints while only the personalised hole
waits.

> [!warning] Don't enable Partial Prerendering
> In Next 16, PPR is tied to **Cache Components** (`cacheComponents: true` in
> `next.config.ts`), which is **not enabled in this app**. Turning it on changes
> caching semantics app-wide and would invalidate everything you measure in Phase 11.
>
> Write the comment. Leave the flag alone.

### Test

The heading and username appear before the posts list. Throttle to Slow 3G to see it
clearly.

---

## Done when

- You have **before/after markers** for all four changed routes
- `/blog/does-not-exist` 404s **without your page running**
- `/dashboard` flipped `○` → `ƒ` and you can name the line
- Streaming visibly works — and you watched it **fail** first
- An unlisted product id is slow once, then fast
- `npm run build` passes

---

## Measuring bundle size — this changed in Next 16

> ⚠️ Most tutorials say to read the **First Load JS** column from `npm run build`.
> **Next 16 removed it.** From the official upgrade guide, the metrics were
> *"inaccurate in server-driven architectures using React Server Components"*.

Measure in the browser instead:

```bash
npm run build && npm start
```

**DevTools → Network → the "JS" filter → hard-reload (Ctrl+F5)**, then read
*transferred*. There's also `npx next experimental-analyze` for a full breakdown.

---

## Recall questions

1. What does `export const dynamicParams = false` do for an unlisted slug — and what
   does it stop from happening?
2. List every API that forces a route into dynamic rendering. There are more than three.
3. A Client Component can **render** a Server Component passed as children but cannot
   **import** one. Explain that distinction precisely.
4. What exactly does the server send, and in what order, when streaming? Why does
   awaiting in the parent break it?
5. Describe what happens on the first request to an unlisted product versus the second.
   Where does the generated page go?
6. What problem does Partial Prerendering solve that static and dynamic rendering alone
   cannot? What is it tied to in Next 16?
7. This dashboard is dynamic and uncacheable. Name two techniques that still make it
   fast.

---

## Not yet

No `fetch` caching (Phase 11 — next). **Rendering mode and data caching are separate
axes**; this phase is only the first one.
