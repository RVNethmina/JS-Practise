# Phase 13 — Proxy (formerly Middleware)

**5 problems** · Vault folder: `11-middleware`

> ⚠️ **Next.js 16 renamed this feature.** `middleware.ts` is **deprecated** and is now
> `proxy.ts`, exporting a function called `proxy` instead of `middleware`.
>
> Every tutorial you find online will say "middleware". There's an official codemod
> for old projects:
> ```bash
> npx @next/codemod@canary middleware-to-proxy .
> ```

## Read first

- `NextJs-Vault/11-middleware/Middleware Fundamentals.md`
- `NextJs-Vault/11-middleware/Matchers and Redirects.md`
- `NextJs-Vault/10-authentication/Protecting Routes.md` (re-read the "three places" table)

> [!warning] The vault notes for this folder predate the rename **and** the runtime change
> Read them for the concepts — matchers, rewrite vs redirect — and substitute `proxy`
> for `middleware`. For anything about the Edge runtime, trust this brief: it changed
> in Next 16 and the notes are out of date. Authoritative reference:
> `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`

## The shape

**One file: `proxy.ts` at the project root** — beside `app/`, not inside it.

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: "/dashboard/:path*",
};
```

Mark it `async` if you need `await` inside.

---

## Three corrections to what you'll read elsewhere — all measured

### 1. It runs on the **Node.js runtime** now, not Edge

Pre-16, middleware ran on the Edge runtime: no Node APIs, no `node:fs`, most database
drivers unusable. **As of Next 16 it defaults to Node.js.**

Verified by importing `lib/users.ts` (whose `db-core.ts` helpers use `node:fs`) into a proxy:

```
GET /probe-proxy   ->  HTTP 404,  x-user-count: 5
```

The proxy **read the JSON file off disk and it worked**. The old "import your db and
watch the Edge runtime reject it" exercise no longer fails.

### 2. You cannot set a runtime — it's a build error

```ts
export const runtime = "edge";   // ❌
```

```
Error: Route segment config is not allowed in Proxy file at "./proxy.ts".
Proxy always runs on Node.js runtime.
```

### 3. Next.js actively recommends avoiding it

From the migration notes:

> *"We recommend users avoid relying on Middleware unless no other options exist."*

Part of the reason for the rename was that "middleware" invited overuse. **"Proxy"
signals what it is: a network boundary in front of your app.**

---

## This is an optimisation layer, not a security boundary

Your Phase 12 checks remain what actually protects data. The proxy just avoids burning
a full render on an obviously-logged-out request.

Three reasons it can't be the boundary — and note that **"it can't reach your
database" is no longer one of them**:

1. **It may not run where your app runs.** The docs: *"in optimized cases deployed to
   your CDN… you should not attempt relying on shared modules or globals."*
2. **A matcher can miss paths.** Add a route tomorrow, forget the matcher, it's
   unprotected — and nothing tells you.
3. **It can only see the request.** It can't know whether *this user* owns *this
   record*. That check has to live next to the data.

> [!info] What you cannot call in a proxy
> `revalidateTag` and `updateTag` are server-only in a different sense — the docs say
> they *"cannot be called in Client Components or Proxy"*. Cache invalidation belongs
> in Server Actions and Route Handlers.

## What you'll have built by the end

```
proxy.ts                    <- ALL five problems live in this one file
app/[locale]/about/page.tsx <- P4  a target to rewrite to
```

Everything accumulates into one `proxy` function. By Problem 5 it does five jobs, and
keeping it readable is part of the exercise.

---

## Problem 1 — Protect the dashboard

**Goal:** `/dashboard` redirects when logged out; nothing else is touched.

**File:** `proxy.ts` *(new)*

### Build

1. Create `proxy.ts` beside `app/` — **not inside it**
2. `export function proxy(request: NextRequest)`
3. Read the cookie: `request.cookies.get("session")`
4. Missing → `NextResponse.redirect(new URL("/login", request.url))`
5. Present → `NextResponse.next()`
6. `export const config = { matcher: "/dashboard/:path*" }`
7. Check `/products` and `/about` are unaffected

### What you need to know

- `request.cookies` is **synchronous** here — unlike `await cookies()` in a page. The
  request object already has them.
- **The URL must be absolute.** `new URL("/login", request.url)` builds it from the
  current request; a bare `"/login"` string throws.
- **Without a matcher the proxy runs on every request** — every image, stylesheet and
  font. Real cost on every asset.
- Only *presence* is checked here. You could `verifySession` too, but the page already
  does that properly — this is the fast pre-filter.

### Test

`/dashboard` redirects logged out. `/about` returns 200 with no interference.

To prove the matcher scopes correctly, set a header in the proxy
(`res.headers.set("x-proxy-ran", "1")`) and confirm it appears on `/dashboard` but not
on `/about`.

---

## Problem 2 — Preserve the intended destination

**Goal:** logging in from `/dashboard/settings` returns you there — and an attacker
can't redirect you off-site.

**File:** `proxy.ts` *(edit)*

### Build

1. Read `request.nextUrl.pathname` before redirecting
2. Append it: `loginUrl.searchParams.set("callbackUrl", pathname)`
3. On the login side (Phase 12 Problem 1 already accepts `callbackUrl`), **validate it
   before redirecting**
4. Test all three:

| `?callbackUrl=` | Must |
|---|---|
| `/dashboard/settings` | work |
| `https://evil.com` | be **blocked** |
| `//evil.com` | be **blocked** |

### This is an Open Redirect vulnerability

The exploit: an attacker sends `yourapp.com/login?callbackUrl=https://evil.com/fake`.
The victim sees your real domain, logs in for real, then gets bounced to a
pixel-perfect fake asking them to "log in again". Credentials gone.

**Why `startsWith("/")` is not enough:** `//evil.com` starts with `/` and passes that
check — but browsers read it as a **protocol-relative URL** meaning
`https://evil.com`. It's off-site.

Safer: must start with `/` **and not** with `//`. Better still, construct the URL and
compare its origin to yours.

### Test

All three rows above behave correctly, including the protocol-relative one.

---

## Problem 3 — Redirect logged-in users away from login

**Goal:** the inverse guard, without an infinite loop.

**File:** `proxy.ts` *(same function)*

### Build — create the loop first, on purpose

1. Match **everything** and redirect to `/login` whenever there's no session
2. Load any page. Watch the browser give up: *"too many redirects"*
3. Understand it: `/login` has no session either, so it redirects to `/login`, which
   redirects to `/login`…
4. **Now fix it.** One matcher covering both areas, branching inside:
   - on `/dashboard` **without** a session → `/login`
   - on `/login` **with** a session → `/dashboard`
   - anything else → `NextResponse.next()`
5. Comment the rule that prevents loops

```ts
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
```

### The general rule

**Never redirect a path to itself, directly or through a chain.** Before redirecting,
ask whether the destination would also match this condition. If it would, exclude it.

Doing step 1 deliberately means you'll recognise the symptom instantly when it happens
for real — and it will.

### Test

No infinite redirect in either state. Logged out on `/login` works; logged in on
`/dashboard` works.

---

## Problem 4 — Locale routing with rewrite

**Goal:** content is localised while the URL stays clean.

**Files:** `proxy.ts` *(edit)*, `app/[locale]/about/page.tsx` *(new)*

### Build

1. Create a target to rewrite to: `app/[locale]/about/page.tsx`, reading
   `params.locale` and rendering different text for `en` / `fr`
2. In the proxy, read `request.headers.get("accept-language")`
3. Pick a locale, defaulting to `en`
4. `NextResponse.rewrite(new URL(`/${locale}/about`, request.url))` when the path is
   `/about`
5. **Comment what the URL bar shows for each**
6. **Then swap `rewrite` for `redirect`** and watch the difference

### rewrite vs redirect

| | `rewrite` | `redirect` |
|---|---|---|
| URL bar shows | the **original** URL | the **new** URL |
| Round trips | one | **two** |
| Browser knows | nothing changed | it moved |

**Rewrite is a server-side lie, in a good way.** The visitor asked for `/about`, the
server quietly served `/en/about`, and the address bar still says `/about`. No extra
request.

Redirect tells the browser "go here instead", so it makes a **second** request. Right
when a resource genuinely moved; wrong for transparently serving different content at
the same URL.

### Test

```bash
curl -s -H "Accept-Language: fr" http://localhost:3000/about | grep -o "Bonjour\|Hello"
curl -s -H "Accept-Language: en" http://localhost:3000/about | grep -o "Bonjour\|Hello"
```

Different content, same URL. Then swap to `redirect` and watch the address bar change.

---

## Problem 5 — Security headers

**Goal:** every response carries baseline security headers.

**File:** `proxy.ts` *(edit)*

### Build

1. `const response = NextResponse.next();`
2. `response.headers.set(...)` for each
3. Return it
4. **Comment what attack each one stops**
5. Widen the matcher so these apply broadly

| Header | Value | Stops |
|---|---|---|
| `X-Frame-Options` | `DENY` | **Clickjacking** — your site in a hidden iframe over a fake UI |
| `X-Content-Type-Options` | `nosniff` | **MIME sniffing** — an uploaded "image" executed as script |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | **URL leakage** — a reset token sent to third parties via `Referer` |
| `Content-Security-Policy` | start permissive | **XSS** — restricts where scripts may load from |

CSP is the modern replacement for `X-Frame-Options` via its `frame-ancestors`
directive. Send both — older browsers only understand the first.

> [!warning] Start your CSP permissive
> A strict one breaks Next's inline scripts, and you'll spend the afternoon debugging
> a blank page instead of learning the concept.

### Test

```bash
curl -s -I http://localhost:3000/about | grep -iE "x-frame|x-content|referrer|content-security"
```

All four present. Check a few different routes.

---

## Done when

- `/dashboard` redirects logged out, via the proxy
- `callbackUrl` works and rejects **both** absolute and protocol-relative URLs
- No redirect loop in any state — and you deliberately created one first
- Locale rewrite keeps the URL clean; you've seen redirect differ
- Security headers on every response
- You can explain why the proxy is **not** a sufficient security boundary — without
  saying "it can't reach the database"

---

## Recall questions

1. What was this file called before Next 16, and what changed about its default
   runtime in that release?
2. What happens if you `export const runtime` from a proxy file?
3. `rewrite` vs `redirect` — which changes the browser URL, which costs a round trip,
   and when would you deliberately choose redirect?
4. Describe a proxy config that **would** cause an infinite redirect loop. What's the
   general rule for avoiding it?
5. Blindly redirecting to a user-supplied `callbackUrl` is a known vulnerability. Name
   it and describe the exploit.
6. Why is `startsWith("/")` insufficient for validating a redirect target?
7. What does `X-Frame-Options` prevent, and which modern CSP directive replaces it?
8. Give three reasons the proxy isn't a sufficient security boundary — now that "it
   can't reach your database" is no longer true.
9. Next's own docs recommend avoiding this feature unless nothing else works. Why?

---

## Not yet

Phase 14 is the final TypeScript hardening pass over everything you've built.
