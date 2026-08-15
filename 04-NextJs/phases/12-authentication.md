# Phase 12 — Authentication

Concept folder: **10-authentication** · 7 problems

## Read first

- `NextJs-Vault/10-authentication/Sessions and Cookies.md`
- `NextJs-Vault/10-authentication/Protecting Routes.md`
- `NextJs-Vault/10-authentication/Role-Based Access.md`

## What you're building

Real sessions replacing the fakes from Phases 2 and 10.

**Scope honesty:** passwords in `data/users.json` are plain strings, and your session
token can be a signed JSON blob rather than a real JWT library. That is acceptable
for a local training app with no real secrets. In production, both would be
unacceptable — password hashing (argon2/bcrypt) and a vetted session library are
non-negotiable. The point here is the *Next.js mechanics*, not implementing crypto.

---

## Problem 1 — Login flow

**Files:** `app/actions/auth.ts`, `app/(auth)/login/page.tsx`

Harden Phase 10's mechanism into a real session.

- `await cookies()`
- `httpOnly`, `secure` (prod only), `sameSite: "lax"`, explicit `maxAge`
- Never store the password anywhere
- Return "Invalid email or password" — never reveal *which* was wrong. Comment why.

**Verify:** the cookie is set, unreadable from `document.cookie`, and carries enough
to identify the user and role.

---

## Problem 2 — Logout flow

**File:** `app/actions/auth.ts`

- Delete the cookie via the awaited store
- Invalidate server-side too, not just the cookie
- Redirect to `/login`
- Use a **form + Server Action**, not a link. Comment why a GET link is wrong.

**Verify:** after logout, protected pages redirect. The back button doesn't restore
access.

---

## Problem 3 — Protected dashboard

**File:** `app/dashboard/page.tsx`

Verify the session **in the page**, not only the layout.

- Read and verify the cookie
- `redirect("/login")` when absent or invalid
- Do the check as close to the **data** as possible

**Verify:** hitting `/dashboard` logged out redirects before any data is fetched.

Now revisit `app/dashboard/layout.tsx` from Phase 2. Keep the layout check as a UX
convenience, but understand it is not the boundary.

---

## Problem 4 — Admin-only page

**File:** `app/admin/page.tsx`

Replace Phase 2's hardcoded role constant.

- Distinguish **401** (not logged in) from **403** (logged in, not allowed)
- Redirect to login for the first; show a forbidden page for the second
- Read the role from the **verified session**, never a client-sent value

**Verify:** log in as `viewer@example.com` and hit `/admin`. You get "forbidden", not
the login page.

---

## Problem 5 — Role-based navigation

**File:** `app/_components/Nav.tsx`

Different links per role.

- Fetch the session on the **server**, pass only the role to the client
- Never send the whole session object to the browser

Then: log in as viewer, open devtools, unhide the admin link, and click it.

**Verify:** the route still rejects you. If it doesn't, the app is broken and
Problem 4 isn't done.

---

## Problem 6 — Session-aware page

**File:** `app/(marketing)/page.tsx`

Homepage rendering differently for logged-in and anonymous visitors, redirecting
neither.

- Read the session optionally — absence is normal
- Note that reading `cookies()` makes the page **dynamic**
- Comment what that costs and how you'd keep most of the page static

**Verify:** both states render. `npm run build` marks the route dynamic — confirm the
marker changed from Phase 9's baseline.

Then isolate the personalised header inside `<Suspense>` and see whether the rest can
still prerender.

---

## Problem 7 — Unauthorized response handler

**File:** `app/api/protected/route.ts`

Protect a Route Handler with proper status codes.

- 401 with a `WWW-Authenticate` header when there's no valid session
- 403 when authenticated but lacking permission
- Consistent JSON error shape
- Never leak internal error details

**Verify:**

```bash
curl -i http://localhost:3000/api/protected
```

returns 401. With a viewer's cookie, 403.

Also add auth checks to the mutating endpoints from Phase 8 — they're currently wide
open.

---

## Done when

- Login and logout work end to end against seeded users
- Protected pages redirect when logged out
- A viewer gets 403 on `/admin`, not a login redirect
- Unhiding a hidden admin link in devtools achieves nothing
- API endpoints return 401/403 rather than redirecting
- Every Server Action that mutates checks authorization

## Recall questions

1. Define authentication vs authorization in one sentence each.
2. What does `httpOnly` protect against? What does `sameSite`? They defend different
   attacks — name both.
3. Why is "invalid email or password" better than "no user with that email"? Name the
   attack.
4. Why must logout be a POST rather than a GET link?
5. Middleware, layout, and page can all check auth. Which is authoritative, and why
   is middleware alone insufficient?
6. A user edits the DOM to reveal a hidden admin link and clicks it. What stops them?
7. Why is redirecting an API client on auth failure wrong?
8. What is IDOR, and which of your endpoints is vulnerable if you check role but not
   ownership?

## Not yet

Middleware (Phase 13) adds the fast pre-filter on top of this. The checks you wrote
here remain the actual boundary.
