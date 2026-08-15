# Phase 5 — Dynamic Routes

Concept folder: **05-dynamic-routes** · 6 problems

## Read first

- `NextJs-Vault/05-dynamic-routes/Dynamic Segments and Params.md`
- `NextJs-Vault/05-dynamic-routes/generateStaticParams.md`
- `NextJs-Vault/01-routing/Dynamic and Catch-All Routes.md` (re-read)

## What you're building

Phase 1 made dynamic routes exist. This phase makes them real: pre-generated at
build time, properly validated, correctly 404-ing.

---

## Problem 1 — Product detail route

**File:** `app/(shop)/products/[id]/page.tsx`

- Explicit props type: `{ params: Promise<{ id: string }> }`
- Params are always **strings**, even for numeric ids
- Convert and validate before using as a lookup key — `notFound()` on garbage

**Verify:** `/products/42` works. `/products/abc` 404s rather than crashing.
`typeof id` is `"string"`.

---

## Problem 2 — Blog post route

**File:** `app/blog/[slug]/page.tsx`

Pre-generate every post at build time.

- `generateStaticParams` returning all slugs
- The returned object's keys must match the segment name exactly
- Add `generateMetadata` for per-post title and description

**Verify:** `npm run build` lists each post as its own statically generated route
(`●`). Count them against your seed data.

---

## Problem 3 — User profile route

**File:** `app/users/[username]/page.tsx`

404 properly for unknown users.

- `notFound()` when the user doesn't exist
- Add `app/users/[username]/not-found.tsx` with a custom message

**Verify:** an unknown username renders your custom UI **and** returns a real 404
status. Check the network tab — not just the visual.

---

## Problem 4 — Category route with filters

**File:** `app/(shop)/shop/[category]/page.tsx`

Category listing that also reads `?sort=price&page=2`.

- `await` both `params` and `searchParams`
- Default the missing `sort`
- Parse `page` from string to number safely

**Verify:** the URL above reads all three values. Then run `npm run build` — this
route is now `ƒ` dynamic. Understand why before moving on.

---

## Problem 5 — Documentation route

**File:** `app/docs/[[...slug]]/page.tsx`

Extend Phase 1's version.

- `slug` is `string[] | undefined` — handle bare `/docs`
- Breadcrumbs from segments
- `generateStaticParams` for the known doc pages

**Verify:** `/docs` and `/docs/guides/setup` both render, both pre-generated.

---

## Problem 6 — Nested product variant route

**File:** `app/(shop)/products/[productId]/variants/[variantId]/page.tsx`

Two dynamic segments at different levels.

- Type it: `Promise<{ productId: string; variantId: string }>`
- `generateStaticParams` must return every valid **combination**

**Verify:** `/products/1/variants/red` resolves both. The build shows one route per
combination.

Note this changes the segment name from `[id]` to `[productId]` — you'll need to
reconcile that with Problem 1. Decide which name wins and update consistently.

---

## Done when

- Every dynamic route validates its params before use
- `npm run build` shows pre-generated routes for posts, docs, and variants
- Unknown ids produce genuine 404 statuses
- The category route is correctly marked dynamic

## Recall questions

1. Why are route params always strings? What must you do before using one as a
   database id?
2. What happens if someone visits a slug `generateStaticParams` didn't return? What
   config controls it?
3. `notFound()` throws. Why is throwing the right mechanism rather than returning
   some UI?
4. Using `searchParams` makes a page dynamically rendered. Why must that be true?
5. Write the exact `params` type for `[[...slug]]` versus `[...slug]`.
6. For nested dynamic routes, how does `generateStaticParams` work at each level?
   Can the child access the parent's generated params?

## Not yet

No `revalidate` (Phase 11). No error boundaries (Phase 7). Pre-generation only.
