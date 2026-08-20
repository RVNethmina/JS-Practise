# Phase 13 — Proxy (formerly Middleware)

**5 problems** · Vault folder: `11-middleware`

> ⚠️ **Next.js 16 renamed this feature.** `middleware.ts` is **deprecated** and is now
> `proxy.ts`, exporting a function called `proxy` instead of `middleware`. Everything
> else works the same. Every tutorial you find online will say "middleware".
>
> There's an official codemod if you ever migrate an old project:
> ```bash
> npx @next/codemod@canary middleware-to-proxy .
> ```

## Read first

- `NextJs-Vault/11-middleware/Middleware Fundamentals.md`
- `NextJs-Vault/11-middleware/Matchers and Redirects.md`
- `NextJs-Vault/10-authentication/Protecting Routes.md` (re-read the "three places"
  table)

> **The vault notes for this folder predate the rename.** Read them for the concepts —
> matchers, rewrite vs redirect — and mentally substitute `proxy` for `middleware`.
> The authoritative current reference is bundled with the app:
> `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`

## What you're building

**One file: `proxy.ts` at the project root** — beside `app/`, not inside it. One file
for the whole application.

```
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: "/dashboard/:path*",
};
```

Mark it `async` if you need `await` inside.

## Two corrections to what you may have read

**1. It runs on the Node.js runtime now.** In Next 15 and earlier, middleware ran on
the **Edge runtime**, which banned Node APIs and most database drivers. **As of Next
16, Proxy defaults to Node.js.** Older material that tells you "you can't use Node
APIs in middleware" is out of date.

Related: the `runtime` config option is **not available** in a Proxy file. Setting it
**throws an error**.

**2. Next.js actively recommends using it as a last resort.** Straight from the
bundled docs:

> We recommend users avoid relying on Middleware unless no other options exist.

Part of the reason for the rename was that "middleware" invited overuse. **"Proxy"
signals what it is: a network boundary in front of your app.**

## This is an optimisation layer, not a security boundary

The Phase 12 checks remain what actually protects your data. Proxy just avoids
burning a full render on an obviously-logged-out request.

The docs are explicit about why you can't lean on it:

> Proxy is meant to be invoked separately of your render code and in optimized cases
> **deployed to your CDN** — you should not attempt relying on shared modules or
> globals.

It may not even run in the same place as your app.

---

## Problem 1 — Protect the dashboard route

**Goal:** `/dashboard` redirects when logged out, and nothing else is affected.

**File:** `proxy.ts` at the project root

### Steps

1. Create `proxy.ts` beside `app/` — **not inside it**
2. Export a function named `proxy` taking `NextRequest`
3. Read the session cookie: `request.cookies.get("session")`
4. Missing → `NextResponse.redirect(new URL("/login", request.url))`
5. Present → `NextResponse.next()`
6. Export a `config` with a `matcher` limiting it to `/dashboard/:path*`
7. **Confirm the matcher is actually limiting scope** — visit `/products` and `/about`
   logged out and check they're untouched

### What you need to know

- `request.cookies` is **synchronous** here — unlike `await cookies()` in a page. The
  request object already has them.
- **The URL must be absolute.** `new URL("/login", request.url)` builds it from the
  current request. A bare `"/login"` string throws.
- **Without a `matcher`, the proxy runs on every single request** — including every
  image, stylesheet, and font. That's a real performance cost on every asset.

### Verify

1. `/dashboard` redirects when logged out
2. `/products` and `/about` are unaffected

---

## Problem 2 — Preserve the intended destination

**Goal:** logging in from `/dashboard/settings` returns you to `/dashboard/settings`,
and an attacker can't redirect you off-site.

**File:** `proxy.ts`

### Steps

1. Before redirecting, read the requested path from `request.nextUrl.pathname`
2. Append it as `?callbackUrl=<path>`
3. On the login side, read `callbackUrl` and redirect there after success
4. **Validate it before using it**
5. Test all three:
   - `?callbackUrl=/dashboard/settings` → should work
   - `?callbackUrl=https://example.com` → must be **blocked**
   - `?callbackUrl=//example.com` → must **also** be blocked

### What you need to know

**This is an Open Redirect vulnerability**, and it's a genuinely common one.

The exploit: an attacker sends `yourapp.com/login?callbackUrl=https://evil.com/fake`.
The victim sees your real domain, logs in for real, then gets bounced to a
pixel-perfect fake asking them to "log in again". They do. Their credentials are gone.

**Why `startsWith("/")` is not enough:** `//example.com` starts with `/` and passes
that check — but browsers read it as a **protocol-relative URL** meaning
`https://example.com`. It's off-site.

The safer test: it must start with `/` **and not** with `//`. Better still, parse it
and confirm the origin matches yours.

### Verify

All three cases behave correctly, including the protocol-relative one.

---

## Problem 3 — Redirect authenticated users away from login

**Goal:** the inverse guard, without an infinite redirect loop.

**File:** `proxy.ts` — the **same** `proxy` function

### Steps

1. **Create the loop on purpose first:** match **everything** and redirect to `/login`
   whenever there's no session
2. Load any page. Watch the browser give up with a "too many redirects" error.
3. Understand why: `/login` has no session either, so it redirects to `/login`, which
   redirects to `/login`…
4. **Now fix it.** One matcher covering both `/dashboard` and `/login`, with branching
   inside:
   - on `/dashboard` **without** a session → go to `/login`
   - on `/login` **with** a session → go to `/dashboard`
   - anything else → `NextResponse.next()`
5. **Comment the rule** that prevents loops

### What you need to know

**The general rule:** never redirect a path to itself, directly or through a chain.
Before redirecting, ask whether the destination would also match this condition. If it
would, exclude it.

Doing step 1 deliberately means you'll recognise the symptom instantly when it happens
for real — and it will.

### Verify

**No infinite redirect in either state.** Logged out on `/login` works. Logged in on
`/dashboard` works.

---

## Problem 4 — Locale routing with rewrite

**Goal:** content is localised while the URL stays clean.

**File:** `proxy.ts`

### Steps

1. Read the `Accept-Language` header from `request.headers`
2. Pick a locale, falling back to a default
3. Use **`NextResponse.rewrite`**, not `redirect`
4. You'll need somewhere to rewrite *to* — a `/en/about` page or a `[locale]` route
5. **Comment the difference** — specifically what the URL bar shows for each
6. **Then swap `rewrite` for `redirect`** and watch the URL bar change

### What you need to know

| | `rewrite` | `redirect` |
|---|---|---|
| URL bar shows | the **original** URL | the **new** URL |
| Round trips | one | **two** |
| Browser knows | nothing changed | it moved |

**Rewrite is a server-side lie, in a good way.** The visitor asked for `/about`, the
server quietly served `/en/about`, and the address bar still says `/about`. No extra
request.

Redirect tells the browser "go here instead", so the browser makes a **second**
request. Right when the resource genuinely moved; wrong for transparently serving
different content at the same URL.

Step 6 makes the difference undeniable in one second of watching.

### Verify

With `rewrite`, localised content appears and the URL stays `/about`. With `redirect`,
the URL changes.

---

## Problem 5 — Security headers

**Goal:** every response carries baseline security headers.

**File:** `proxy.ts`

### Steps

1. Create the response: `const response = NextResponse.next()`
2. Mutate `response.headers` with `.set()`
3. Add:
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - a basic `Content-Security-Policy`
4. Return the response
5. **Comment what attack each one mitigates**
6. Check the Network tab

### What you need to know

| Header | Attack it stops |
|---|---|
| `X-Frame-Options: DENY` | **Clickjacking** — your site loaded in a hidden iframe over a fake UI |
| `X-Content-Type-Options: nosniff` | **MIME sniffing** — an uploaded "image" executed as a script |
| `Referrer-Policy` | **Leaking URLs** — a reset token in a URL sent to third parties via the Referer header |
| `Content-Security-Policy` | **XSS** — restricts where scripts may load from |

CSP is the modern replacement for `X-Frame-Options` via its `frame-ancestors`
directive. Send both — older browsers only understand the first.

Start your CSP permissive. A strict one will break Next's inline scripts and you'll
spend the afternoon debugging a blank page rather than learning the concept.

### Verify

The headers appear on **every** response in the Network tab.

---

## Done when

- `/dashboard` redirects logged out, via the proxy
- `callbackUrl` works and rejects **both** absolute and protocol-relative URLs
- No redirect loop in any state — and you deliberately created one first
- Locale rewrite keeps the URL clean; you've seen redirect differ
- Security headers on every response
- You can explain why the proxy is **not** a sufficient security boundary

---

## Recall questions

1. What was this file called before Next 16, and what changed about its default
   runtime in that release?
2. `rewrite` vs `redirect` — which changes the browser URL, which costs a round trip,
   and when would you deliberately choose redirect?
3. Describe a proxy config that **would** cause an infinite redirect loop. What is the
   general rule for avoiding it?
4. Blindly redirecting to a user-supplied `callbackUrl` is a known vulnerability. Name
   it and describe the exploit.
5. Why is `startsWith("/")` insufficient for validating a redirect target?
6. What does `X-Frame-Options` prevent, and which modern CSP directive replaces it?
7. Why is the proxy not a sufficient security boundary? Give three reasons.
8. Next's own docs recommend avoiding this feature unless nothing else works. Why?

---

## Not yet

Phase 14 is the final TypeScript hardening pass over everything you've built.
