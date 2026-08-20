# Phase 5 — Dynamic Routes

**6 problems** · Vault folder: `05-dynamic-routes`

## Read first

- `NextJs-Vault/05-dynamic-routes/Dynamic Segments and Params.md`
- `NextJs-Vault/05-dynamic-routes/generateStaticParams.md`
- `NextJs-Vault/01-routing/Dynamic and Catch-All Routes.md` (re-read)

## The one idea in this phase

Phase 1 made dynamic routes **exist**. This phase makes them **real**:

- **Validated** — garbage in the URL 404s instead of crashing
- **Pre-generated** — built into HTML files at build time, not rendered per request
- **Correctly 404-ing** — a real HTTP 404 status, not a 200 with sad text

The new tool is **`generateStaticParams`**. You export it from a dynamic route and it
returns the list of values to build pages for. Next then generates one HTML file per
value at build time.

```
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

**The key in that returned object must exactly match the folder name.** `[slug]` →
`{ slug: ... }`. A mismatch fails silently.

## Your instrument

```bash
cd C:\Hello\My_Projects\JS-Practise\04-NextJs\practise-app && npm run build
```

The route table tells you what Next actually decided:

```
○  Static     prerendered at build time
●  SSG        prerendered per generateStaticParams entry
ƒ  Dynamic    rendered on demand, per request
```

**Run it before and after each problem.** A marker that didn't change means the thing
you thought you did, you didn't do.

---

## Problem 1 — Product detail route, validated

**Goal:** `/products/42` works; `/products/abc` 404s instead of crashing.

**File:** `app/(shop)/products/[id]/page.tsx`

### Steps

1. Type props explicitly: `{ params: Promise<{ id: string }> }`
2. `await params`
3. **Validate before using it as a lookup key** — if the id isn't a shape your data
   could contain, call `notFound()` immediately
4. Then `await getProduct(id)` and `notFound()` on `null`
5. Log `typeof id` once and confirm what you get

### What you need to know

**Route params are always strings.** `/products/42` gives `"42"`, never `42`. If your
lookup compares against a number, it silently never matches.

There are two separate failure cases and both need handling:
- **Malformed input** — `abc` where you expect a numeric id
- **Well-formed but missing** — `9999` looks fine, nothing has that id

### Verify

1. `/products/42` renders
2. `/products/abc` gives a 404 page, not a crash
3. `typeof id` logs `"string"`

---

## Problem 2 — Blog post route, pre-generated

**Goal:** every blog post becomes its own HTML file at build time.

**File:** `app/blog/[slug]/page.tsx`

### Steps

1. Create the route, typed `{ params: Promise<{ slug: string }> }`
2. `await getPost(slug)`, `notFound()` on null
3. Export `generateStaticParams` returning `[{ slug }, { slug }, ...]` for every post
4. Export `generateMetadata` for a per-post title and description
5. Also create `app/blog/page.tsx` — the index listing all posts
6. Run `npm run build` and **count** the blog entries against `data/posts.json`

### What you need to know

- `generateStaticParams` runs **at build time, on the server**. It can read `db.ts`
  directly.
- Return an **array of objects**, one per page. The key must match the folder name
  exactly — `[slug]` needs `{ slug: "..." }`.
- Values must be **strings**. A number silently produces nothing.

### Verify

1. `npm run build` lists each post as its own `●` route
2. The count matches your seed data exactly
3. Each post's tab title is its own

---

## Problem 3 — User profile with a custom 404

**Goal:** an unknown username shows *your* not-found UI **and** returns a real 404
status.

**Files:** `app/users/[username]/page.tsx`, `app/users/[username]/not-found.tsx`

### Steps

1. In the page: `await getUser(username)`, `notFound()` when null
2. Create `not-found.tsx` **in the same folder**
3. Give it a friendly message and a `<Link>` back to `/users`
4. It is a **Server Component** — no `"use client"`
5. Visit an unknown username and **open the Network tab**

### What you need to know

- `not-found.tsx` needs no wiring. Calling `notFound()` anywhere in that route
  segment renders it automatically.
- The nearest `not-found.tsx` up the tree wins, same as layouts.

**Step 5 is the actual test.** A page that *looks* like a 404 but returns HTTP 200 is
broken — search engines index it, and monitoring never sees the problem. Check the
**status code**, not the pixels.

### Verify

1. An unknown username shows your custom UI
2. **The Network tab shows status 404**, not 200

---

## Problem 4 — Category route with filters

**Goal:** `/shop/electronics?sort=price&page=2` reads all three values safely.

**File:** `app/(shop)/shop/[category]/page.tsx`

### Steps

1. Type **both** `params` and `searchParams` as Promises
2. `await` both
3. Give `sort` a default when it's missing
4. Parse `page` from string to number **safely** — handle `"abc"`, `"-5"`, and
   missing
5. Pass all of it into `getProducts({ category, sort, page })`
6. Run `npm run build` and look at this route's marker

### What you need to know

`getProducts` takes `category` as a **slug** (`"electronics"`), not a `categoryId`.
That's what the URL segment gives you, so they line up.

`Number("abc")` is `NaN`, and `NaN` propagates silently through everything downstream.
Check for it.

**Step 6 is the lesson:** this route is now `ƒ` **dynamic**. Reading `searchParams`
does that — and it must. Next would have to build a separate HTML file for every
possible combination of every query string, which is infinite. So it renders on
demand instead.

**Understand that before moving on.** It's the foundation of Phase 9 and Phase 11.

### Verify

1. The URL above reads all three values
2. Bad input (`?page=abc`) doesn't crash
3. `npm run build` marks this route `ƒ`, and you can say why

---

## Problem 5 — Documentation route, pre-generated

**Goal:** `/docs` and `/docs/guides/setup` both render and are both built at build
time.

**File:** `app/docs/[[...slug]]/page.tsx`

### Steps

1. Type it `{ params: Promise<{ slug?: string[] }> }` — optional
2. Handle `slug === undefined`, which is bare `/docs`
3. `await getDoc(slug ?? [])` — the index doc has `slug: []`
4. Render breadcrumbs from the segments
5. Add `generateStaticParams` returning every known doc path
6. For the index page, return `{ slug: [] }` — an empty array

### What you need to know

For catch-all routes, `generateStaticParams` returns **arrays** as values:

```
[{ slug: [] }, { slug: ["guides"] }, { slug: ["guides", "setup"] }]
```

The empty array is the bare `/docs` route. Miss it and `/docs` falls back to
on-demand rendering while its children are static — an inconsistency easy to overlook.

### Verify

1. `/docs` and `/docs/guides/setup` both render
2. `npm run build` shows both as pre-generated
3. Breadcrumbs match the path depth

---

## Problem 6 — Nested product variant route

**Goal:** `/products/1/variants/red` reads both dynamic segments.

**File:** `app/(shop)/products/[productId]/variants/[variantId]/page.tsx`

### Steps

1. Create the nested folder structure — a dynamic segment inside a dynamic segment
2. Type it `Promise<{ productId: string; variantId: string }>`
3. Fetch the product, then find the variant within it
4. `notFound()` if either is missing
5. `generateStaticParams` must return **every valid combination**:
   ```
   [{ productId: "1", variantId: "red" }, { productId: "1", variantId: "blue" }, ...]
   ```
6. Build and count the generated routes

### The naming conflict — decide it now

This route uses `[productId]`. Problem 1's route uses `[id]`. **They are sibling
folders under `products/` and cannot both exist** — Next can't tell which should match
`/products/42`.

Pick one name and rename the other consistently. `[id]` is shorter; `[productId]` is
clearer when nested. Either is fine — **just pick one and update every reference**,
including the props types.

### What you need to know

Nesting means the combinations **multiply**. Ten products with five variants each is
fifty generated pages. That's fine at this scale, but it's why real apps pre-generate
only the popular ones and leave the rest on demand — which is exactly Phase 9,
Problem 5.

### Verify

1. `/products/1/variants/red` resolves both values
2. The build shows one route per combination
3. Only one of `[id]` / `[productId]` exists under `products/`

---

## Done when

- Every dynamic route validates its params before use
- `npm run build` shows pre-generated routes for posts, docs, and variants
- Unknown ids produce **genuine 404 statuses** (checked in the Network tab)
- The category route is correctly marked `ƒ` and you can explain why
- The `[id]` vs `[productId]` conflict is resolved

---

## Recall questions

1. Why are route params always strings? What must you do before using one as a
   database id?
2. What happens if someone visits a slug `generateStaticParams` didn't return? What
   config controls that?
3. `notFound()` throws. Why is throwing the right mechanism rather than returning some
   UI?
4. Using `searchParams` makes a page dynamically rendered. Why **must** that be true?
5. Write the exact `params` type for `[[...slug]]` versus `[...slug]`.
6. For nested dynamic routes, how does `generateStaticParams` work at each level? Can
   the child access the parent's generated params?

---

## Not yet

No `revalidate` (Phase 11). No error boundaries (Phase 7). Pre-generation only.
