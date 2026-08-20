# Phase 12 — Authentication

**7 problems** · Vault folder: `10-authentication`

## Read first

- `NextJs-Vault/10-authentication/Sessions and Cookies.md`
- `NextJs-Vault/10-authentication/Protecting Routes.md`
- `NextJs-Vault/10-authentication/Role-Based Access.md`

## The one idea in this phase

Two words people use interchangeably and shouldn't:

- **Authentication** — *who are you?* (login)
- **Authorization** — *are you allowed to do this?* (roles, permissions)

And the rule that matters most:

> **The check must live as close to the data as possible.**

A layout check is convenience. A middleware check is an optimisation. **The page or
action that touches the data is the only real boundary.**

## Scope honesty

Passwords in `data/users.json` are plain strings, and your session token can be a
signed JSON blob rather than a real JWT.

**That is acceptable for a local training app with no real secrets.** In production
both would be unacceptable — password hashing (argon2/bcrypt) and a vetted session
library are non-negotiable. The point here is the **Next.js mechanics**, not
implementing crypto.

## Build this first

`lib/session.ts` with three things you'll use in every problem:

```
getSession(): Promise<Session | null>       null is a normal outcome
requireSession(): Promise<Session>          redirects instead of returning null
requireRole(role): Promise<Session>         throws/redirects on wrong role
```

Type `Session.role` as `Role` from `lib/types.ts` — the literal union, **never
`string`**.

---

## Problem 1 — Login flow

**Goal:** a real session cookie replacing Phase 10's naive version.

**Files:** `app/actions/auth.ts`, `app/(auth)/login/page.tsx`

### Steps

1. Look up the user with `getUserByEmail`
2. Compare the password
3. Build a session payload — user id and role, **never the password**
4. `await cookies()` then `.set()` with:
   - `httpOnly: true`
   - `secure: process.env.NODE_ENV === "production"`
   - `sameSite: "lax"`
   - an explicit `maxAge`
5. On failure return **"Invalid email or password"** — never say which was wrong
6. **Comment why** that wording matters
7. Redirect on success

### What you need to know

**Why the vague error message.** "No user with that email" is a **user enumeration**
vulnerability. An attacker scripts a few thousand addresses, keeps the ones that come
back "wrong password", and now has a confirmed list of real accounts to attack. Same
message for both cases gives them nothing.

`secure: true` in development would break login entirely — `localhost` is HTTP. Hence
the environment check.

### Verify

The cookie is set, **unreadable from `document.cookie`**, and carries enough to
identify the user and their role.

---

## Problem 2 — Logout flow

**Goal:** logging out actually ends the session, and Back doesn't restore it.

**File:** `app/actions/auth.ts`

### Steps

1. `await cookies()` then `.delete()` the session cookie
2. **Invalidate server-side too**, not just the cookie
3. Redirect to `/login`
4. Use a **`<form>` with a Server Action** — not a `<Link>`
5. **Comment why a GET link would be wrong**
6. Log out, then press Back

### What you need to know

**Why logout must be POST, not a GET link.** GET requests are supposed to be *safe* —
no side effects. Anything can trigger one:

- a `<img src="/logout">` on any site logs your users out
- browsers and link prefetchers fetch GET URLs speculatively

That's **CSRF**, and it's why every state-changing operation is POST.

**Why deleting the cookie isn't enough:** if someone copied the cookie value, deleting
their browser's copy doesn't stop them replaying it. Real invalidation is server-side.

### Verify

After logout, protected pages redirect. **The Back button does not restore access.**

---

## Problem 3 — Protected dashboard

**Goal:** the check runs in the **page**, not just the layout.

**File:** `app/dashboard/page.tsx`

### Steps

1. Call `requireSession()` as the **first thing** in the component
2. It redirects to `/login` when there's no valid session
3. **Only after that**, fetch any data
4. Log out and hit `/dashboard`
5. Revisit `app/dashboard/layout.tsx` from Phase 2 — keep the layout check as a UX
   convenience, but understand it is **not the boundary**

### What you need to know

**Why the layout is not enough.** Layouts don't re-run on every navigation — that's
the whole point of Phase 2 Problem 1. A layout check can be skipped by client-side
navigation in ways a page check cannot.

**The order in steps 1–3 matters.** Check first, fetch second. Fetching before
checking means you did the database work for a request you were about to reject — and
if anything leaks through an error message or a log, you leaked data you never should
have read.

### Verify

Hitting `/dashboard` logged out redirects **before any data is fetched**.

---

## Problem 4 — Admin-only page, with 401 vs 403

**Goal:** a logged-in viewer gets "forbidden", not a login redirect.

**File:** `app/admin/page.tsx`

### Steps

1. Delete Phase 2's hardcoded `const role: Role = "viewer"`
2. Read the role from the **verified session**
3. **No session** → redirect to `/login` (that's 401 territory)
4. **Session, wrong role** → render a forbidden page (403)
5. Log in as a viewer and hit `/admin`

### What you need to know

| | Meaning | Correct response |
|---|---|---|
| **401 Unauthorized** | not logged in | send them to log in |
| **403 Forbidden** | logged in, not allowed | tell them no — logging in again won't help |

Sending a logged-in viewer to the login page is a real UX bug: they log in again, land
back on `/admin`, get bounced again, and conclude the app is broken.

**Read the role from the verified session, never from anything the client sent.** A
client-supplied role is just a request, not a fact.

### Verify

Logged in as a viewer, `/admin` shows **"forbidden"**, not the login page.

---

## Problem 5 — Role-based navigation

**Goal:** hidden UI is cosmetic — prove the route still rejects you.

**File:** `app/_components/Nav.tsx`

### Steps

1. Get the session on the **server**
2. Pass **only the role** to the client component — never the whole session object
3. Conditionally render admin links
4. **Then attack your own app:** log in as a viewer, open devtools, unhide the admin
   link, and click it

### What you need to know

**Hiding a link is not access control.** It's UX — it stops people from clicking
things that would fail. Anyone can unhide it in two seconds.

**If step 4 gets you into `/admin`, your app is broken and Problem 4 isn't done.** The
check in the page is what protects you; the hidden link just tidies the interface.

Never send the whole session to the client. It contains more than the browser needs,
and everything you send is readable.

### Verify

Unhiding the link and clicking it **still gets rejected**.

---

## Problem 6 — Session-aware homepage

**Goal:** render differently for logged-in and anonymous visitors, redirecting neither.

**File:** `app/(marketing)/page.tsx`

### Steps

1. Use `getSession()` — the one that **returns null** rather than redirecting
2. Render a personalised greeting or a sign-in prompt
3. Run `npm run build` and compare the marker against your Phase 9 baseline
4. **Comment what that costs**
5. **Then improve it:** move the personalised part into its own component inside
   `<Suspense>` and see whether the rest can still prerender

### What you need to know

**This is why there are two session functions.** A protected page wants
`requireSession()` — absence is an error. A public page wants `getSession()` —
absence is completely normal.

The return types encode that. `Promise<Session | null>` forces you to handle the null;
`Promise<Session>` doesn't, because it never returns one.

**Step 3 is the cost:** reading `cookies()` makes this route dynamic. Your homepage
just stopped being a static file. Step 5 is the mitigation — the same technique as
Phase 9 Problem 6.

### Verify

Both states render. `npm run build` marks the route dynamic — **confirm the marker
changed** from your Phase 9 baseline.

---

## Problem 7 — Protected Route Handler

**Goal:** API endpoints return **status codes**, not redirects.

**File:** `app/api/protected/route.ts`

### Steps

1. Read and verify the session from `request.cookies`
2. **No session** → 401, with a `WWW-Authenticate` header
3. **Wrong role** → 403
4. Use the same JSON error shape as Phase 8
5. **Never leak internal error details** in the response
6. **Then go back and secure Phase 8's mutating endpoints** — they're currently wide
   open to anyone

### What you need to know

**Why redirecting an API client is wrong.** A `fetch()` follows redirects silently. Your
mobile app asks for JSON, gets a 200 with an HTML login page, and crashes on
`res.json()` with a confusing parse error. The real problem — "you're not
authenticated" — is nowhere in that message.

Pages redirect. **APIs return status codes.** Same session logic, different response.

**Step 6 is not optional.** Phase 8 built `POST`, `PUT`, `PATCH`, and `DELETE`
endpoints with no auth at all. Right now anyone on the internet can delete your
products. Fix that now.

### Verify

```bash
curl -i http://localhost:3000/api/protected
```

Returns **401**. With a viewer's cookie, **403**.

---

## Done when

- Login and logout work end to end against seeded users
- Protected pages redirect when logged out
- A viewer gets **403** on `/admin`, not a login redirect
- Unhiding a hidden admin link in devtools achieves **nothing**
- API endpoints return 401/403 rather than redirecting
- **Every mutating Server Action and endpoint checks authorization**

---

## Recall questions

1. Define authentication vs authorization in one sentence each.
2. What does `httpOnly` protect against? What does `sameSite`? They defend different
   attacks — name both.
3. Why is "invalid email or password" better than "no user with that email"? Name the
   attack.
4. Why must logout be a POST rather than a GET link?
5. Middleware, layout, and page can all check auth. Which is authoritative, and why is
   middleware alone insufficient?
6. A user edits the DOM to reveal a hidden admin link and clicks it. What stops them?
7. Why is redirecting an API client on auth failure wrong?
8. What is **IDOR**, and which of your endpoints is vulnerable if you check role but
   not ownership?

---

## Not yet

Middleware (Phase 13) adds a fast pre-filter **on top of** this. The checks you wrote
here remain the actual boundary.
