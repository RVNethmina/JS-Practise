# Phase 2 — Layouts

**7 problems** · Vault folder: `02-layouts`

## Read first

- `NextJs-Vault/02-layouts/Layouts and Nesting.md`
- `NextJs-Vault/02-layouts/Metadata.md`
- `NextJs-Vault/01-routing/Route Groups and Private Folders.md` (again — the
  multiple-shells idea is what Problem 7 is about)

## The one idea in this phase

A **layout** is a wrapper around your pages — header, sidebar, footer. Create
`layout.tsx` in any folder and it automatically wraps that folder **and everything
below it**. You never import it.

The behaviour that makes layouts special: **when you navigate between pages that
share a layout, the layout is NOT rebuilt.** React keeps the same instance alive and
swaps only the page underneath. So its state survives.

```
On /dashboard, you collapse the sidebar
  → click a link to /dashboard/settings
  → the sidebar is STILL collapsed
```

That's Problem 1, and it's what interviewers ask about.

## What you're building

Shells around the routes from Phase 1. By the end, the marketing site and the app
should look like different products despite sharing a root layout.

---

## Problem 1 — Dashboard layout

**Goal:** every page under `/dashboard` gets the same header, and that header's state
survives navigation.

**File:** `app/dashboard/layout.tsx`

### Steps

1. Create `layout.tsx` in `app/dashboard/`
2. `export default` a function that takes `{ children }`
3. Type it: `{ children: React.ReactNode }`
4. Return a wrapper `<div>` with a heading, then `{children}`
5. **Then prove the state claim:** make a small `"use client"` counter component with
   a `useState` and a button. Render it in this layout.
6. Click it up to 5, then navigate to `/dashboard/settings`
7. Now move that same counter into `page.tsx` instead and repeat

### What you need to know

- **`children` is the page the visitor asked for.** Next.js passes it in based on the
  URL. You never write `<DashboardLayout><SettingsPage /></DashboardLayout>` — Next
  does that for you.
- Type it `React.ReactNode`, which means "anything React can render". Do **not** use
  `JSX.Element` — that's narrower and rejects valid children like a plain string.

### Verify

1. `/dashboard` and `/dashboard/settings` both show the header
2. **Counter in the layout:** survives navigation, still says 5
3. **Counter in the page:** resets to 0

Actually do step 2 and 3. Reading about it is not the same as watching it.

---

## Problem 2 — Admin layout with an access check

**Goal:** `/admin` redirects you away unless you're an admin.

**File:** `app/admin/layout.tsx`

### Steps

1. Create the layout as an **`async`** function
2. Above the component, declare a fake role you can edit by hand:
   ```
   const role: Role = "viewer";   // flip to "admin" to get in
   ```
   Import `Role` from `@/lib/types`
3. Inside the component, if the role isn't `"admin"`, call `redirect("/")`
4. Import `redirect` from `next/navigation`
5. Otherwise render the admin shell around `{children}`
6. Flip the constant both ways and confirm both behaviours

### What you need to know

- **Layouts can be `async` Server Components.** That's how they can check things
  before rendering.
- `redirect()` **throws** internally. Code after it never runs, so you don't need an
  `else`.
- Type the constant `Role`, not `string`. With `string`, a typo like `"admni"`
  compiles fine and silently never matches.

### This is deliberately insufficient as security

A hardcoded constant is not authentication. Worse, **a layout is not a security
boundary** — Phase 12 explains exactly why and replaces this. For now you're
learning the mechanism.

### Verify

1. With `"viewer"` → `/admin` redirects away
2. With `"admin"` → `/admin` renders

---

## Problem 3 — Auth layout

**Goal:** `/login` and `/register` have a centred card and **no site navigation**.

**File:** `app/(auth)/layout.tsx`

### Steps

1. Create `layout.tsx` inside the `(auth)` route group folder
2. Render a centred container around `{children}`
3. Deliberately **do not** include the site nav

### What you need to know

This is the payoff for route groups. `(auth)` doesn't change any URL, but it gives
`/login` and `/register` their own shell — which is the actual reason route groups
exist.

### Verify

1. `/login` has the centred card, no site nav
2. `/dashboard` still has its nav — proving the auth layout is scoped

---

## Problem 4 — Nested settings layout

**Goal:** `/dashboard/settings/profile` shows **three** nested shells at once.

**File:** `app/dashboard/settings/layout.tsx`

### Steps

1. Create the layout with a settings sub-nav plus `{children}`
2. Visit `/dashboard/settings/profile`
3. **In a comment at the bottom of the file, write the full wrapper chain**,
   outermost first

### What you need to know

Layouts stack. Every `layout.tsx` between `app/` and the page wraps it, outermost
first:

```
RootLayout            app/layout.tsx           html + body
  DashboardLayout     app/dashboard/           top nav
    SettingsLayout    .../settings/            sub-nav
      ProfilePage     .../profile/page.tsx     the content
```

**You cannot skip an ancestor layout.** If `app/dashboard/layout.tsx` exists, every
page under `/dashboard` gets it, no opt-out. If you need a page under that path
*without* the shell, restructure with route groups so it isn't under that folder.

### Verify

1. `/dashboard/settings/profile` visibly shows root shell → dashboard nav → settings
   sub-nav → page content
2. Your comment lists all four, in order

---

## Problem 5 — Shared navigation with active highlighting

**Goal:** the link for the page you're currently on looks different from the others.

**File:** `app/_components/Nav.tsx`, rendered from a layout

### Steps

1. Create `app/_components/` — the **underscore prefix** keeps it out of routing
2. Create `Nav.tsx` with `"use client"` as the very first line
3. Import `usePathname` from `next/navigation` and call it
4. Render your `<Link>` list
5. For each link, compare its `href` to the current pathname and apply a different
   style when they match
6. Render `<Nav />` from a layout — **the layout stays a Server Component**

### What you need to know

- `usePathname()` is a **hook**, so this component must be `"use client"`.
- **A Server Component can render a Client Component.** The layout doesn't become
  client just because it renders `<Nav />`. Only `Nav.tsx` and its imports ship to
  the browser.
- `_components` with the underscore is a **private folder** — Next.js excludes it
  from routing entirely.

### Verify

1. The current page's link is visually distinct
2. Navigating updates which link is highlighted
3. The layout file has no `"use client"` in it

---

## Problem 6 — Collapsible sidebar with persistent state

**Goal:** collapse the sidebar, navigate to another dashboard page, it's still
collapsed.

**File:** `app/dashboard/_components/Sidebar.tsx`, rendered from the dashboard layout

### Steps

1. Create `Sidebar.tsx` as a Client Component with a `useState` boolean for collapsed
2. Add a toggle button
3. In `app/dashboard/layout.tsx` (a **Server** Component), `await getCategories()`
4. Pass the result down: `<Sidebar categories={categories} />`
5. Type the props properly — `{ categories: Category[] }`
6. Collapse it, navigate, confirm it stayed collapsed

### What you need to know

This is the **split pattern**, and it's the most important habit in this whole track:

```
SERVER (layout.tsx)          CLIENT (Sidebar.tsx)
fetches the data             holds useState
ships no JS to browser       ships its own code
passes data down as props    handles the click
```

The state survives navigation because it lives in a **layout**, and layouts aren't
rebuilt on navigation (Problem 1).

### Verify

1. Collapse, then navigate `/dashboard` → `/dashboard/settings`. Still collapsed.
2. Category names came from `db.ts`, fetched on the server

---

## Problem 7 — Multiple route groups with different shells

**Goal:** the marketing site and the shop look like different products.

**Files:** `app/(marketing)/layout.tsx`, `app/(shop)/layout.tsx`

### Steps

1. Create a layout in each group, with **visibly different** headers
2. Confirm `/` gets the marketing shell and `/products` gets the shop shell
3. **Then break it on purpose:** create **both** `app/(marketing)/about/page.tsx`
   **and** `app/(shop)/about/page.tsx`
4. Run `npm run build`
5. Read the error, then delete one of them

### What you need to know

Route groups let one app have several completely different shells without any of it
showing in the URL.

But the collision in step 3 is the limit: **both files resolve to `/about`.** Next
can't pick one, so the build fails. Route groups organise files — they do **not**
create separate URL namespaces.

### Verify

1. `/` and `/products` have visibly different headers
2. You saw the duplicate-route build error and can describe why it happened

---

## Done when

- Layout state survives navigation between sibling pages (you tested it)
- `/dashboard/settings/profile` shows three nested shells
- The active nav link highlights correctly
- Marketing and shop look like different sites
- You've seen the route-group collision error and fixed it

---

## Recall questions

1. What state survives navigation between two pages sharing a layout, and what is
   thrown away? Why does that matter for a scroll position or an open dropdown?
2. Write the full component tree for `/dashboard/settings/profile`, outside in. How
   many layouts wrap the page?
3. A Client Component sits inside a Server Component layout. Does that make the whole
   layout client-side? What ends up in the browser bundle?
4. Why does layout state survive navigation but page state doesn't? What is Next.js
   actually preserving?
5. Is a layout a safe place to enforce authorization? What can it not protect against?
6. Can two route groups both define a page for the same URL path?
7. `layout.tsx` vs `template.tsx` — when would you reach for the second?

---

## Not yet

No real auth (Phase 12) — the admin check is a hardcoded constant. No data fetching
in layouts beyond the sidebar's nav items.
