# Phase 3 — Server Components

**5 problems** · Vault folder: `03-server-components`

> **The most important phase in the track.** The server/client boundary is what
> Next.js interviews are actually about — caching, rendering, and actions are all
> downstream of it. Don't rush this one.

## Read first

- `NextJs-Vault/03-server-components/Server Components Fundamentals.md`
- `NextJs-Vault/03-server-components/The Server-Client Boundary.md`
- `NextJs-Vault/06-data-fetching/Sequential vs Parallel Fetching.md` (for Problem 3)

## The one idea in this phase

**Every component in `app/` is a Server Component by default.** There's no directive
to add. It runs on the server, and its code never reaches the browser.

Which means it can do this:

```
export default async function Page() {
  const users = await getUsers();   // read the database, right here
  return <ul>...</ul>;
}
```

No `useEffect`. No loading state. No API endpoint. No `fetch`. The component is
`async` and awaits the data directly.

Compare with plain React, where you'd need: an API route, a `useEffect`, a
`useState` for data, another for loading, another for errors, and a spinner. **All of
that disappears.**

## What you're building

Real data on the page for the first time. Components call `lib/db.ts` **directly**.

That's the correct production pattern. You don't build an HTTP endpoint to feed your
own pages — that's a pointless network round trip to reach data you already have.
Phase 8 builds an API for a hypothetical mobile client, which is the legitimate
reason to have one.

---

## Problem 1 — Server-rendered user list

**Goal:** `/users` shows real names from `data/users.json`, present in the initial
HTML.

**File:** `app/users/page.tsx`

### Steps

1. Make the component `async`
2. `await getUsers()` from `@/lib/db`
3. Map over the result into a list, with a `key` on each item
4. Add no `"use client"`, no `useEffect`, no `useState`

### What you need to know

- `getUsers()` returns `PublicUser[]` — the password field is already stripped. Use
  `PublicUser`, never `User`, for anything the browser sees.
- The return type is inferred. You don't need to annotate it.

### Verify

1. `/users` shows the names
2. **View Page Source** (right-click, not devtools). The names are in the raw HTML —
   they were rendered on the server, not fetched afterwards.

### Common mistakes

- Adding `"use client"` out of habit → `useGetUsers is not a function`-style errors,
  because you can't `await` in a Client Component body

---

## Problem 2 — Server-rendered product page

**Goal:** `/products/1` shows a real product; `/products/9999` returns a proper 404;
the browser tab shows the product's name.

**File:** `app/(shop)/products/[id]/page.tsx` (extend Phase 1's version)

### Steps

1. `await params` to get the id
2. `await getProduct(id)`
3. **If the result is `null`, call `notFound()`** — import it from `next/navigation`
4. Below that, render the product's fields
5. Add a second export, `generateMetadata`, that also fetches the product and returns
   `{ title: product.name }`
6. Type it as returning `Promise<Metadata>`, importing `Metadata` from `next`

### What you need to know

- `getProduct` returns `Product | null`. TypeScript **will not let you** read `.name`
  until you've handled the null. That's the type system doing its job.
- `notFound()` throws, so everything after it is unreachable and TypeScript narrows
  the type to `Product` automatically. No `else` needed.
- `generateMetadata` receives the **same props** as the page — including `params`,
  still a Promise.

### The experiment — set up Phase 6

Add `console.log("FETCHING PRODUCT", id)` inside `getProduct` in `lib/db.ts`.

Load `/products/1` once and count the log lines. **You'll see it twice** — once for
`generateMetadata`, once for the page.

Don't fix it yet. Phase 6 Problem 3 shows you the tool (`cache()`). For now just know
it's happening.

### Verify

1. A valid id renders the product
2. An invalid id gives a 404 page
3. The browser tab shows the product name
4. You counted the `console.log` firings

---

## Problem 3 — Server-rendered dashboard, fetched in parallel

**Goal:** three datasets load in the time of the slowest one, not the sum of all three.

**File:** `app/dashboard/page.tsx`

### Steps

1. Import `getStats`, `getRecentOrders`, `getNotifications` from `@/lib/db`
2. **First do it the slow way**, on purpose:
   ```
   const stats  = await getStats();
   const orders = await getRecentOrders();
   const notifs = await getNotifications();
   ```
3. Time it — wrap the page in `console.time` / `console.timeEnd`
4. **Now fix it** with `Promise.all`, destructuring into three variables
5. Time it again
6. Write both numbers in a comment
7. Render three `<section>` blocks, one per dataset

### What you need to know

The delays are `getStats` 800ms, `getRecentOrders` 1200ms, `getNotifications` 600ms.

```
SLOW — 2600ms                  FAST — 1200ms
0 ─── 800 ──── 2000 ── 2600    0 ──────────── 1200
  │stats│                        │stats  │
        │orders   │              │orders       │
                  │notifs│       │notifs │
```

**Why it works — the one insight that matters:**

> Calling a function **starts** the work. `await` only **waits** for it.

Those are two separate moments. In the slow version the `await` is glued onto the
call, so the second request can't begin until the first has completely finished. In
`Promise.all`, all three calls happen first — three requests already in flight — and
only then do you wait.

The slow shape has a name: a **request waterfall**. Know the term.

### On naming the destructured variables

```
const [stats, orders, notifications] = await Promise.all([...]);
```

Those three names are **yours to choose**. Array destructuring is **by position**, not
by name — first result goes into the first name. Rename them to `a, b, c` and it still
works.

That's different from object destructuring, where `const { items } = ...` matches by
**property name** and `items` must be spelled exactly right.

### Verify

1. The page shows all three sections
2. Your measured time is ≈1200ms, not ≈2600ms
3. Both numbers are in a comment

---

## Problem 4 — Server-side data transformation

**Goal:** compute over 10,000 rows and ship only about eight numbers to the browser.

**File:** `app/reports/page.tsx`

### Steps

1. `await getSalesRecords()` — returns 10,000 rows
2. Compute, all in the component body:
   - total revenue (`reduce` over `quantity * unitPrice`)
   - total units
   - revenue grouped by region (a `Map`)
   - top 5 products by units (build a Map, sort, `slice(0, 5)`)
3. Render **only the computed summary**. Never render the raw array.
4. Add `metadata` with a title

### What you need to know

This is the **bundle-size argument** made concrete, and it's a common interview
question.

A traditional React SPA would have to ship all 10,000 rows — roughly 1.5MB of JSON —
across the network so the browser could do this same arithmetic. Here the arithmetic
happens on the server and the browser receives a handful of numbers.

The loop, the `reduce`, and the records **all stay on the server**.

### Verify

1. `/reports` shows the totals
2. **View Page Source** and search for `"soldAt"` or `"productId"`. They are not
   there. Only the computed numbers are.

---

## Problem 5 — Pass server data into a Client Component

**Goal:** the server fetches products; a client component filters them with zero
network requests.

**Files:**
- `app/(shop)/products/page.tsx` — **server**
- `app/(shop)/products/_components/ProductFilter.tsx` — **client**

### Steps

1. In `page.tsx` (stays a Server Component): `await getProducts({ pageSize: 12 })`
2. Destructure `{ items, total }` from the result
3. Render `<ProductFilter products={items} />`
4. In `ProductFilter.tsx`: `"use client"` as the **very first line**
5. Define and export a props type — `{ products: Product[] }`
6. Add `useState` for a search string and a boolean checkbox
7. Filter `products` in the component body and render the survivors
8. Use `<Link>` from `next/link` for each product — capital L, from `next/link`

### What you need to know

**The split — this is the pattern to remember:**

```
SERVER (page.tsx)            CLIENT (ProductFilter.tsx)
reads lib/db.ts              holds useState
can be async                 handles onChange
ships NO code to browser     ships its code
passes data down as props    filters what it was given
```

The page **stays** a Server Component. Only the interactive leaf is client. That's
called **pushing the boundary down**, and it's why this page can still be `async` and
read the database directly.

Note the prop names: the page calls its variable `items`, the component calls its
prop `products`. **Separate names in separate scopes** — the connection is made by
`products={items}`, nothing more.

### Two deliberate failures — do both

**A. Pass a function as a prop.** Add `onSelect: (id: string) => void` to the props
type and pass one from the page. Read the error:

> Functions cannot be passed directly to Client Components unless you explicitly
> expose it by marking it with "use server".

**B. Pass a `Date` object.** Try passing `new Date(product.createdAt)` instead of the
string.

**Why both fail:** props crossing the boundary must be **serialized** — turned into
plain JSON, sent over the network, rebuilt in the browser. Functions and Dates don't
survive that trip. This is exactly why `lib/types.ts` keeps `createdAt` as a string.

Remove both after you've read the errors.

### Verify

1. Typing in the filter narrows the list **instantly, with no network request**
   (check the Network tab — nothing fires)
2. You've read both boundary errors

---

## Done when

- Data appears in the initial HTML on every page above
- The dashboard's three fetches run in parallel — you **measured** it
- You've seen the error from passing a non-serializable prop
- `/reports` ships the summary but not the raw rows
- You know how many times `getProduct` fires per request, and why

---

## Recall questions

1. Compare Problem 1 to the `useEffect` + `useState` approach in plain React. Name
   three things that disappear.
2. `generateMetadata` and the page both fetch the same product. Does that mean two
   database hits? What would prevent the duplication?
3. What is a request waterfall? Which of these is one?
   `const a = await getA(); const b = await getB();` versus
   `const [a, b] = await Promise.all([getA(), getB()]);`
4. Explain the bundle-size argument for Server Components. Contrast with what a
   traditional SPA must ship.
5. Exactly what can and cannot cross the server-to-client boundary? Why is that the
   rule — what does Next have to do to those props?
6. Name five things a Server Component cannot do.

---

## Not yet

No `"use client"` beyond the one filter (Phase 4 goes deep). No `loading.tsx` or
`error.tsx` (Phase 7). No `fetch` — direct `db` access only.
