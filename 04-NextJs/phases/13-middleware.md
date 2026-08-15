# Phase 13 — Middleware

Concept folder: **11-middleware** · 5 problems

## Read first

- `NextJs-Vault/11-middleware/Middleware Fundamentals.md`
- `NextJs-Vault/11-middleware/Matchers and Redirects.md`
- `NextJs-Vault/10-authentication/Protecting Routes.md` (re-read the "three places"
  table)

## What you're building

`middleware.ts` at the **project root** — beside `app/`, not inside it. One file for
the whole application.

This is an **optimisation layer**, not a security boundary. The Phase 12 checks
remain what actually protects your data. Middleware just avoids burning a render on
an obviously-logged-out request.

---

## Problem 1 — Protect the dashboard route

**File:** `middleware.ts`

- Export a function named `middleware`
- Export a `config` with a matcher limiting it to dashboard routes
- Read the cookie from `request.cookies` — **synchronous** here, unlike `cookies()`
  in pages

**Verify:** `/dashboard` redirects when logged out. Other routes are untouched —
confirm the matcher is actually limiting scope.

Try importing `lib/db.ts` into the middleware. Read the error. That's the Edge
runtime telling you why this can't be your real auth check.

---

## Problem 2 — Redirect logged-out user, preserving destination

**File:** `middleware.ts`

- Append `?callbackUrl=<original path>` to the login URL
- Build the URL from `request.nextUrl`
- **Validate `callbackUrl`** on the login side before redirecting back

**Verify:** logging in from `/dashboard/settings` returns you there.

Then try `?callbackUrl=https://example.com` and confirm your validation blocks it.
Also try `?callbackUrl=//example.com` — the protocol-relative form. If your check is
`startsWith("/")` alone, that one gets through.

---

## Problem 3 — Redirect authenticated users away from login

**File:** `middleware.ts`

The inverse guard, in the **same** middleware function.

- One matcher covering both `/dashboard` and `/login`
- Avoid a redirect loop — comment how

**Deliberately create the loop first:** match everything and redirect to `/login`
when there's no session. Watch the browser give up. Then fix it.

**Verify:** no infinite redirect in either state.

---

## Problem 4 — Locale routing

**File:** `middleware.ts`

- Read `Accept-Language`
- Use `NextResponse.rewrite`, **not** redirect
- Comment the difference — what does the URL bar show for each?
- Fall back to a default locale

You'll need a `/[locale]/...` route or a simple `/en/about` page to rewrite to.

**Verify:** content is localised while the URL stays clean. Then swap to `redirect`
and watch the URL bar change — that's the distinction.

---

## Problem 5 — Security headers

**File:** `middleware.ts`

- `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- A basic `Content-Security-Policy`
- `NextResponse.next()` then mutate `response.headers`
- Comment what attack each mitigates

**Verify:** headers appear on every response in the network tab.

---

## Done when

- `/dashboard` redirects logged out, via middleware
- `callbackUrl` works and rejects both absolute and protocol-relative URLs
- No redirect loop in any state
- Locale rewrite keeps the URL clean
- Security headers on every response
- You've seen the Edge runtime reject a Node-only import

## Recall questions

1. Middleware runs on the Edge runtime. Name two things you cannot do there that work
   fine in a Server Component.
2. `rewrite` vs `redirect` — which changes the browser URL, which costs a round trip,
   and when would you deliberately choose redirect?
3. Describe a middleware config that **would** cause an infinite redirect loop. What
   is the general rule for avoiding it?
4. Blindly redirecting to a user-supplied `callbackUrl` is a known vulnerability.
   Name it and describe the exploit.
5. Why is `startsWith("/")` insufficient for validating a redirect target?
6. What does `X-Frame-Options` prevent, and what modern CSP directive replaces it?
7. Why is middleware not a sufficient security boundary? Three reasons.

## Not yet

Phase 14 is the final TypeScript hardening pass over everything you've built.
