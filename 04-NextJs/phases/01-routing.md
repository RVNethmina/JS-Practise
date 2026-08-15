# Phase 1 — Routing

Concept folder: **01-routing** · 6 problems

The first phase where the folder structure *is* the answer. Build every route as a
real path in `app/` — that's the point of this whole restructure.

## Read first

- `NextJs-Vault/01-routing/App Router and File-System Routing.md`
- `NextJs-Vault/01-routing/Dynamic and Catch-All Routes.md`
- `NextJs-Vault/01-routing/Route Groups and Private Folders.md`

## What you're building

The skeleton of the whole site. Pages render placeholder content — no data fetching
yet. You're proving you can produce any URL shape the app needs.

---

## Problem 1 — Home route

**File:** `app/(marketing)/page.tsx`

Root route of the app. A heading and some content.

- Default export a component. A named export alone is a build error.
- The component *name* is arbitrary; the file name is what routes.
- Export a `metadata` object setting the page title.
- Link to `/products` with `next/link`, not `<a>`.

**Verify:** `/` renders it. View source — the text is in the initial HTML.

---

## Problem 2 — Nested dashboard route

**Files:** `app/dashboard/page.tsx`, `app/dashboard/settings/page.tsx`,
`app/dashboard/settings/profile/page.tsx`

Three levels of nesting, each its own folder with a `page.tsx`.

Also create `app/dashboard/utils.ts` with any exported function in it. Then try
visiting `/dashboard/utils`.

**Verify:** all three routes render. `/dashboard/utils` is a 404 — colocating a
non-page file in a route folder does not make it routable.

---

## Problem 3 — Dynamic product route

**File:** `app/(shop)/products/[id]/page.tsx`

Matches `/products/1`, `/products/anything`. Read the id and render it.

- Type the props explicitly. `params` is a **Promise** in Next 15+ — the component
  must be `async` and `await` it.
- Forgetting the `await` doesn't error. You get `undefined`, because you destructured
  a Promise that has no `id` property. Do it wrong once so you recognise the symptom.

**Verify:** `/products/42` shows `42`.

---

## Problem 4 — Dynamic user route

**File:** `app/users/[username]/page.tsx`

Profile route that also reads a query parameter (`?tab=posts`).

- `await` both `params` and `searchParams` — both are Promises.
- Handle `tab` being absent.
- Handle `?tab=a&tab=b`. Look at what type you actually get.

**Verify:** `/users/ravindu?tab=posts` renders both values. The repeated-param case
doesn't crash.

---

## Problem 5 — Catch-all documentation route

**File:** `app/docs/[[...slug]]/page.tsx`

Handles `/docs`, `/docs/a`, `/docs/a/b/c` at any depth. Render breadcrumbs from the
segments.

- `slug` is a **string array**, not a string.
- Use the optional form `[[...slug]]` so bare `/docs` matches.
- In a comment, record what `[...slug]` would match differently.

**Verify:** `/docs` and `/docs/guides/setup` both render.

---

## Problem 6 — Route group for auth pages

**Files:** `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`

Login and register grouped under `(auth)`, which must **not** appear in the URL.

Placeholder forms only — the real login is Phase 10, hardened in Phase 12.

Also add `app/(marketing)/about/page.tsx` and `app/(marketing)/pricing/page.tsx`
while you're here.

**Verify:** `/login` and `/register` work. `/auth/login` is a 404.

---

## Done when

- Every route above resolves
- `/dashboard/utils` 404s
- `/docs` (bare) renders, not 404
- No route group name appears in any URL
- `npm run build` lists every route in its table

## Recall questions

Closed book:

1. Name at least five reserved file names in the App Router and what each does.
2. What makes a folder become a routable URL segment?
3. Write the `params` type for `[id]`, `[...slug]`, and `[[...slug]]`.
4. Does `/docs` match `[...slug]`? Does it match `[[...slug]]`?
5. Why did Next.js make `params` async in v15? What does it enable?
6. Name two distinct problems route groups solve. One is organisational — what's the
   other?

## Not yet

No layouts beyond root (Phase 2). No data fetching (Phase 3). No
`generateStaticParams` (Phase 5). Pages render placeholder content only.
