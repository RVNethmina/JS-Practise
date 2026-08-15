# Phase 4 — Client Components

Concept folder: **04-client-components** · 7 problems

## Read first

- `NextJs-Vault/04-client-components/Client Components and use client.md`
- `NextJs-Vault/04-client-components/Client Navigation and Hooks.md`
- `NextJs-Vault/04-client-components/Browser APIs and Hydration.md`

## What you're building

Interactivity, plus the lab routes where you deliberately break things to see how
they fail.

Create `app/lab/layout.tsx` first — a plain wrapper with a heading marking these as
experiments.

---

## Problem 1 — Interactive counter

**File:** `app/lab/counter/page.tsx` plus a `Counter` client component

The simplest possible Client Component.

- `"use client"` as the **very first line**, before imports
- `useState` for the count
- The page rendering it stays a Server Component

**Verify:** clicking works. View source — the initial count is still in the HTML,
because Client Components are server-rendered on first load too.

---

## Problem 2 — Client search box

**File:** `app/(shop)/products/_components/SearchBox.tsx`

Search input that writes to the URL query string, debounced.

- `useRouter` and `useSearchParams` from **`next/navigation`** — not `next/router`,
  that's the Pages Router
- Debounce so you don't push a URL per keystroke
- Use `router.replace`, not `push`. Try `push` first and mash the back button to
  feel why.
- Wrap the component using `useSearchParams` in `<Suspense>`

**Verify:** typing updates the URL; back button isn't flooded.

---

## Problem 3 — Modal

**File:** `app/_components/Modal.tsx`

Closes on Escape and backdrop click.

- `useEffect` for the keydown listener, with **cleanup**
- Accept `children` so a Server Component can pass server-rendered content in

**Verify:** Escape closes it; the listener is removed on unmount. Then render it from
a Server Component with a server-rendered child inside.

---

## Problem 4 — Dropdown

**File:** `app/_components/Dropdown.tsx`

Closes on outside click.

- `useRef` for the container
- Document-level click listener, cleaned up
- Escape closes, focus is managed

**Verify:** clicking outside closes, inside doesn't.

Then remove `"use client"` and run it. Read the error carefully — note that it fails
on the *server*, not in the browser.

---

## Problem 5 — Controlled form

**File:** `app/(marketing)/contact/_components/ContactForm.tsx`

Controlled inputs, client-side validation, submitting state.

- `useState` per field, validate on submit, per-field errors
- Disable submit while submitting, `preventDefault`

**Verify:** invalid input shows errors with no page reload.

Then **disable JavaScript** in devtools and try again. It's completely dead. Keep
that in mind — Phase 10 rebuilds this with a Server Action that still works.

---

## Problem 6 — Theme toggle with localStorage

**Files:** `app/lab/hydration/page.tsx`, `app/_components/ThemeToggle.tsx`

Persist a theme choice to `localStorage`.

**Do it wrong first, on purpose.** Read `localStorage` during render. Load the page.
Read the console error in full and write down what it says.

Then fix it: read inside `useEffect`, render a neutral placeholder until mounted.

**Verify:** theme survives a full reload, with no hydration warning.

---

## Problem 7 — Interactive dashboard filter

**Files:** `app/dashboard/page.tsx` (server),
`app/dashboard/_components/Filters.tsx` (client)

Server fetches; client filters by date range and category.

- Keep the Client Component **as small as possible** — push the boundary down
- `useMemo` for the filtered result

Then deliberately move `"use client"` to the top of `page.tsx` instead. Run
`npm run build` and compare the First Load JS for that route before and after.

**Verify:** filtering is instant, no network requests. You have the two bundle
numbers written down.

---

## Done when

- Every interactive component works
- You've seen and can describe the hydration mismatch error
- You've seen what happens to a `document`-touching component without `"use client"`
- You have before/after bundle sizes from Problem 7
- The controlled form's failure without JS is confirmed

## Recall questions

1. `"use client"` does **not** mean "render only in the browser." What does it
   actually mean? What happens to the component on initial page load?
2. Why does URL state beat `useState` for search and filters? Three concrete
   benefits.
3. A Client Component accepts `children` from a Server Component. How, if client
   components can't import server components? What is actually being passed?
4. What is a hydration mismatch? Why does reading `localStorage` during render cause
   one?
5. Why push the client boundary as far down the tree as possible? What is the cost
   of marking a high-level component `"use client"`?
6. Which import path do the App Router navigation hooks come from, and what's the
   wrong one?
7. `router.push` vs `router.replace` — when does the difference matter?

## Not yet

No Server Actions (Phase 10). The contact form stays JavaScript-dependent for now —
that contrast is the point.
