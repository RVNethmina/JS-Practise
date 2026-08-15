# Phase 2 — Layouts

Concept folder: **02-layouts** · 7 problems

## Read first

- `NextJs-Vault/02-layouts/Layouts and Nesting.md`
- `NextJs-Vault/02-layouts/Metadata.md`
- `NextJs-Vault/01-routing/Route Groups and Private Folders.md` (again — the
  multiple-shells idea is the point of Problem 7)

## What you're building

Shells around the routes from Phase 1. By the end, the marketing site and the app
look like different products despite sharing a root layout.

---

## Problem 1 — Dashboard layout

**File:** `app/dashboard/layout.tsx`

Wraps everything under `/dashboard`. Header plus a content area.

- Accept and render `children`, typed `React.ReactNode`
- Default export

**Verify:** navigate `/dashboard` → `/dashboard/settings`. The layout does **not**
remount. Prove it: add a `useState` counter to a client child in the layout,
increment it, navigate, and confirm the value survives.

---

## Problem 2 — Admin layout with an access check

**File:** `app/admin/layout.tsx`

An async layout that redirects non-admins before rendering.

- Layouts can be `async` Server Components
- Use `redirect()` from `next/navigation`
- No real sessions yet — fake it with a hardcoded role constant you can flip

**Verify:** flipping the constant redirects you away from `/admin`.

This is deliberately insufficient as security. Phase 12 explains why and fixes it.

---

## Problem 3 — Auth layout

**File:** `app/(auth)/layout.tsx`

Centred card, no site navigation.

**Verify:** `/login` has no site nav; `/dashboard` still does.

---

## Problem 4 — Nested settings layout

**File:** `app/dashboard/settings/layout.tsx`

Nests *inside* the dashboard layout, adding a settings sub-nav.

In a comment, write the full wrapper chain for
`/dashboard/settings/profile`, outermost first.

**Verify:** that URL shows root shell → dashboard nav → settings sub-nav → page.

---

## Problem 5 — Shared navigation with active highlighting

**File:** `app/_components/Nav.tsx`, used from a layout

Links that highlight the current route.

- `next/link` for navigation
- Active detection needs `usePathname()`, a client hook — so this component needs
  `"use client"`
- The layout using it stays a Server Component

Note the `_components` folder: the underscore prefix keeps it out of routing.

**Verify:** the current page's link is visually distinct.

---

## Problem 6 — Shared sidebar with persistent state

**File:** `app/dashboard/_components/Sidebar.tsx`

Collapsible sidebar in the dashboard layout. The collapsed state must **survive
navigation** between dashboard pages.

- The toggle is interactive → Client Component
- Fetch the nav items on the **server** and pass them down as props

**Verify:** collapse it, navigate to another dashboard page, it's still collapsed.

---

## Problem 7 — Multiple route groups

**Files:** `app/(marketing)/layout.tsx`, `app/(shop)/layout.tsx`

Two groups with genuinely different shells. Marketing gets a public header; shop
gets its own.

Then, deliberately: create `app/(marketing)/about/page.tsx` **and**
`app/(shop)/about/page.tsx`. Run the build.

**Verify:** `/` has the marketing header, `/products` has the shop shell. The
duplicate `/about` fails the build — read the error, then delete one.

---

## Done when

- Layout state survives navigation between sibling pages
- `/dashboard/settings/profile` shows three nested shells
- The active nav link highlights correctly
- Marketing and shop look like different sites
- You've seen the route-group collision error and fixed it

## Recall questions

1. What state survives navigation between two pages sharing a layout, and what is
   thrown away? Why does that matter for a scroll position or an open dropdown?
2. Write the full component tree for `/dashboard/settings/profile`, outside in. How
   many layouts wrap the page?
3. A Client Component sits inside a Server Component layout. Does that make the whole
   layout client-side? What ends up in the browser bundle?
4. Why does layout state survive navigation but page state doesn't? What is Next.js
   actually preserving?
5. Is a layout a safe place to enforce authorization? What can it not protect
   against?
6. Can two route groups both define a page for the same URL path?
7. `layout.tsx` vs `template.tsx` — when would you reach for the second?

## Not yet

No real auth (Phase 12) — the admin check is a hardcoded constant. No data fetching
in layouts beyond the sidebar's nav items.
