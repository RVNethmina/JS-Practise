# Next.js Track — Progress

90 problems across 15 phases. Tick a problem only when the code works **and** you can
answer that phase's recall questions closed-book.

A phase counts as done when every problem is ticked and the "Done when" list in its
brief passes.

---

## Phase 0 — [Scaffold](phases/00-scaffold.md)

- [ ] `create-next-app` run, dev server starts
- [ ] `lib/types.ts` — entities, `role` as a literal union, no `any`
- [ ] `data/*.json` — seed data
- [ ] `lib/db.ts` — async reads, artificial delays (300ms / 2000ms)
- [ ] `app/layout.tsx` + `globals.css`
- [ ] `npm run build` succeeds

## Phase 1 — [Routing](phases/01-routing.md) · 6

- [ ] 1 Home route
- [ ] 2 Nested dashboard route (+ `/dashboard/utils` 404s)
- [ ] 3 Dynamic product route
- [ ] 4 Dynamic user route (+ repeated `?tab=` handled)
- [ ] 5 Catch-all documentation route
- [ ] 6 Route group for auth pages
- [ ] Recall questions

## Phase 2 — [Layouts](phases/02-layouts.md) · 7

- [ ] 1 Dashboard layout (state survives navigation — proven)
- [ ] 2 Admin layout with access check
- [ ] 3 Auth layout
- [ ] 4 Nested settings layout
- [ ] 5 Shared navigation with active highlighting
- [ ] 6 Shared sidebar with persistent state
- [ ] 7 Multiple route groups (+ collision error seen)
- [ ] Recall questions

## Phase 3 — [Server Components](phases/03-server-components.md) · 5

- [ ] 1 Server-rendered user list
- [ ] 2 Server-rendered product page
- [ ] 3 Server-rendered dashboard (parallel — timed)
- [ ] 4 Server-side data transformation
- [ ] 5 Pass server data into client component (+ boundary error seen)
- [ ] Recall questions

## Phase 4 — [Client Components](phases/04-client-components.md) · 7

- [ ] 1 Interactive counter
- [ ] 2 Client search box (URL state)
- [ ] 3 Modal (server children passed in)
- [ ] 4 Dropdown (+ no-`"use client"` error seen)
- [ ] 5 Controlled form (+ confirmed dead without JS)
- [ ] 6 Theme toggle (+ hydration mismatch seen, then fixed)
- [ ] 7 Dashboard filter (+ before/after bundle sizes recorded)
- [ ] Recall questions

## Phase 5 — [Dynamic Routes](phases/05-dynamic-routes.md) · 6

- [ ] 1 Product detail route
- [ ] 2 Blog post route (`generateStaticParams`)
- [ ] 3 User profile route (real 404 status)
- [ ] 4 Category route with filters
- [ ] 5 Documentation route
- [ ] 6 Nested product variant route
- [ ] Recall questions

## Phase 6 — [Data Fetching](phases/06-data-fetching.md) · 7

- [ ] 1 Fetch user list
- [ ] 2 Product list with cache annotations
- [ ] 3 Product detail + `cache()` (call counts recorded)
- [ ] 4 Blog post
- [ ] 5 Paginated results
- [ ] 6 Dependent data (timings recorded)
- [ ] 7 Handle failed request (both strategies)
- [ ] Bonus: `lab/waterfall` timing comparison
- [ ] Recall questions

## Phase 7 — [Loading & Errors](phases/07-loading-error.md) · 6

- [ ] 1 Dashboard loading state
- [ ] 2 Product loading skeleton
- [ ] 3 API error UI (+ prod vs dev `error.message` compared)
- [ ] 4 Product not-found page (real 404)
- [ ] 5 Nested error boundary (+ layout error observed)
- [ ] 6 Retry button (recovers from intermittent failure)
- [ ] Recall questions

## Phase 8 — [Route Handlers](phases/08-route-handlers.md) · 8

- [ ] 1 GET users
- [ ] 2 POST user (malformed JSON → 400)
- [ ] 3 GET product by id
- [ ] 4 Update product (PUT + PATCH)
- [ ] 5 Delete product (204, empty body)
- [ ] 6 Search endpoint (limit clamped)
- [ ] 7 Paginated endpoint
- [ ] 8 Dynamic resource endpoint (whitelisted)
- [ ] Tested with `curl`
- [ ] Recall questions

## Phase 9 — [Rendering](phases/09-rendering.md) · 6

- [ ] Baseline build table recorded
- [ ] 1 Static blog page
- [ ] 2 Dynamic dashboard page
- [ ] 3 Mixed server/client page (tree drawn)
- [ ] 4 Streaming dashboard (+ seen it fail by awaiting in parent)
- [ ] 5 Pre-rendered product route
- [ ] 6 Dynamic user route with static shell
- [ ] Recall questions

## Phase 10 — [Server Actions](phases/10-server-actions.md) · 7

- [ ] 1 Create user action (**works with JS disabled**)
- [ ] 2 Update profile action (`useActionState`)
- [ ] 3 Create product action (+ `redirect` in `try/catch` broken, then fixed)
- [ ] 4 Delete product action (`useFormStatus` in a child)
- [ ] 5 Login form action (mechanism only)
- [ ] 6 Validated form submission (client bypass rejected)
- [ ] 7 Mutation with revalidation (+ `useOptimistic`)
- [ ] Recall questions

## Phase 11 — [Caching](phases/11-caching.md) · 6

- [ ] All six vault notes read
- [ ] 1 Cache product data (log counts recorded)
- [ ] 2 Revalidate blog data (precedence worked out)
- [ ] 3 Invalidate after mutation (tags + `unstable_cache`)
- [ ] 4 Statically rendered page (+ flipped to dynamic)
- [ ] 5 Dynamically rendered page
- [ ] 6 Compare cached and uncached
- [ ] Can name all four caches unprompted
- [ ] Recall questions

## Phase 12 — [Authentication](phases/12-authentication.md) · 7

- [ ] 1 Login flow
- [ ] 2 Logout flow
- [ ] 3 Protected dashboard
- [ ] 4 Admin-only page (401 vs 403)
- [ ] 5 Role-based navigation (+ DOM-unhide attack fails)
- [ ] 6 Session-aware page
- [ ] 7 Unauthorized response handler
- [ ] Phase 8 mutating endpoints now authorized
- [ ] Recall questions

## Phase 13 — [Middleware](phases/13-middleware.md) · 5

- [ ] 1 Protect dashboard route (+ Edge import error seen)
- [ ] 2 Redirect preserving destination (`//evil.com` blocked)
- [ ] 3 Redirect authenticated away from login (+ loop created, then fixed)
- [ ] 4 Locale routing (rewrite vs redirect compared)
- [ ] 5 Security headers
- [ ] Recall questions

## Phase 14 — [TypeScript pass](phases/14-typescript.md) · 7

- [ ] `any` / `as` count recorded before starting
- [ ] 1 Type dynamic route params
- [ ] 2 Type API responses
- [ ] 3 Type form actions
- [ ] 4 Type Server Component props
- [ ] 5 Type Client Component props
- [ ] 6 Type query parameters (`lib/params.ts`)
- [ ] 7 Type the authentication session
- [ ] `npx tsc --noEmit` clean
- [ ] Recall questions

---

## Final

- [ ] `npm run build` clean, route table understood line by line
- [ ] All 15 phases' recall questions answerable closed-book
- [ ] `16-nextjs-interview/` — closed-book rebuild of selected pieces

## Notes

Keep a running list here of things that surprised you. Anything that made you say
"wait, why?" is worth writing down — those are the moments that become interview
answers.
