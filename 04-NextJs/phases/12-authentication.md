# Phase 12 — Authentication

**7 problems** · Vault folder: `10-authentication`

## Read first

- `NextJs-Vault/10-authentication/Sessions and Cookies.md`
- `NextJs-Vault/10-authentication/Protecting Routes.md`
- `NextJs-Vault/10-authentication/Role-Based Access.md`

## The one idea

Two words people use interchangeably and shouldn't:

- **Authentication** — *who are you?* (login)
- **Authorization** — *are you allowed to do this?* (roles)

And the rule that matters most:

> **The check must live as close to the data as possible.**
>
> A layout check is convenience. A proxy check is an optimisation.
> **The page or action that touches the data is the only real boundary.**

## Where you can and can't touch cookies — get this right first

Straight from the Next 16 docs:

| Operation | Server Component | Server Action | Route Handler |
|---|---|---|---|
| **read** `.get()` | ✅ | ✅ | ✅ |
| **write** `.set()` | ❌ | ✅ | ✅ |
| **delete** `.delete()` | ❌ | ✅ | ✅ |

> [!danger] You cannot set a cookie while rendering a page
> *"HTTP does not allow setting cookies after streaming starts, so you must use `.set`
> in a Server Function or Route Handler."*
>
> This is why login and logout are **Server Actions**, not something a page does. If
> you try it in a page you'll get a runtime error, and the reason isn't obvious.

Also: `cookies()` is **async** in Next 15+ — `await cookies()`, always.

## Your seed credentials

`data/users.json`, with passwords in plain text:

| Email | Password | Role |
|---|---|---|
| `admin@example.com` | `admin123` | admin |
| `editor@example.com` | `editor123` | editor |
| `viewer@example.com` | `viewer123` | viewer |
| `kavindi@example.com` | `kavindi123` | editor |
| `tharindu@example.com` | `tharindu123` | viewer |

> [!warning] The field is called `passwordHash` and contains no hash
> That naming is a deliberate landmine. In production a plain-text password column is
> a serious incident. See the scope note below.

## Scope honesty

Passwords are plain strings and your session token will be a signed JSON blob rather
than a real JWT. **That's acceptable for a local training app with no real secrets.**

In production both are unacceptable — password hashing (argon2/bcrypt) and a vetted
session library are non-negotiable. **The point here is the Next.js mechanics**, not
implementing crypto. Don't carry this code anywhere real.

## What you'll have built by the end

```
lib/session.ts                       <- P0  new, the core of the phase
app/actions/auth.ts                  <- P1, P2  rewrite Phase 10's version
app/(auth)/login/page.tsx            <- P1  edit
app/dashboard/page.tsx               <- P3  add requireSession
app/admin/layout.tsx                 <- P4  delete the hardcoded role
app/admin/page.tsx                   <- P4  role check
app/forbidden/page.tsx               <- P4  new
app/_components/Nav.tsx              <- P5  role-aware links
app/(marketing)/page.tsx             <- P6  optional session
app/api/protected/route.ts           <- P7  new
app/api/products/[id]/route.ts       <- P7  secure the mutations
```

---

## Problem 0 — `lib/session.ts`, the spine of the phase

Every other problem imports from here. Build it first.

### The token

Keep it simple and honest: base64 of `{ userId, role }` plus a signature.

```ts
import { createHmac } from "node:crypto";

const SECRET = process.env.SESSION_SECRET ?? "dev-only-not-a-real-secret";

export type Session = {
  userId: string;
  role: Role;          // the literal union from lib/types.ts — never string
};

export function signSession(session: Session): string
export function verifySession(token: string): Session | null
```

- `signSession` — JSON → base64 → append `.` + HMAC-SHA256 of the base64 part
- `verifySession` — split on `.`, recompute the HMAC, **compare before parsing**,
  return `null` on any mismatch

### The three readers

```ts
export async function getSession(): Promise<Session | null>
export async function requireSession(): Promise<Session>
export async function requireRole(role: Role): Promise<Session>
```

- `getSession` — read the `session` cookie, `verifySession` it, return `null` if
  absent or invalid. **Null is a normal outcome.**
- `requireSession` — calls `getSession`, `redirect("/login")` when null
- `requireRole` — calls `requireSession`, then `redirect("/forbidden")` on wrong role

### And a type guard

```ts
export function isSession(value: unknown): value is Session
```

Validate **every field**. The decoded token came from outside your program and could
be forged.

### Why three functions instead of one

The **return types** do the work:

| Function | Returns | Right for |
|---|---|---|
| `getSession` | `Session \| null` | public pages — logged out is normal |
| `requireSession` | `Session` | protected pages — no null to handle |
| `requireRole` | `Session` | admin pages |

One nullable function would force pointless null checks on protected pages. Two
encode the intent in the type.

---

## Problem 1 — Login flow

**Goal:** a real signed session replacing Phase 10's naive cookie.

**Files:** `app/actions/auth.ts` *(rewrite)*, `app/(auth)/login/page.tsx` *(edit)*

### Build

1. `getUserByEmail(email)`, compare `user.passwordHash` to the submitted password
2. Build `{ userId: user.id, role: user.role }`, `signSession` it
3. `(await cookies()).set("session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24, path: "/" })`
4. On failure return **"Invalid email or password"** — never say which was wrong
5. **Comment why** that wording matters
6. Support `?callbackUrl=` — redirect there on success, defaulting to `/dashboard`
   *(Phase 13 hardens the validation on this)*

### Why the vague error message

"No user with that email" is a **user enumeration** vulnerability. An attacker scripts
a few thousand addresses, keeps the ones that come back "wrong password", and now has
a confirmed list of real accounts. Same message for both cases gives them nothing.

### Test

Log in as `admin@example.com` / `admin123`. The cookie appears in devtools →
Application → Cookies, and **`document.cookie` does not show it**.

Then paste the cookie value into a decoder — you can read the payload (it's base64,
not encryption) but you **cannot forge one**, because you don't have the secret.
Change one character and reload: `verifySession` returns null and you're logged out.

---

## Problem 2 — Logout flow

**Goal:** logging out actually ends the session, and Back doesn't restore it.

**File:** `app/actions/auth.ts` *(edit)*

### Build

1. `(await cookies()).delete("session")`
2. `redirect("/login")`
3. Use a **`<form>` with a Server Action** — not a `<Link>`
4. **Comment why a GET link would be wrong**
5. Log out, then press Back

### Why logout must be POST

GET requests are supposed to be **safe** — no side effects. Anything can trigger one:

- `<img src="https://yourapp.com/logout">` on any website logs your users out
- browsers and link prefetchers fetch GET URLs speculatively

That's **CSRF**, and it's why every state-changing operation is POST.

> [!info] Real invalidation needs server state
> Deleting the cookie removes the browser's copy. If someone already copied the token,
> it stays valid until `maxAge` expires — you'd need a server-side revocation list to
> stop that. Note it; don't build it.

### Test

After logout, protected pages redirect. **The Back button doesn't restore access.**

---

## Problem 3 — Protected dashboard

**Goal:** the check runs in the **page**, not just the layout.

**File:** `app/dashboard/page.tsx` *(edit)*

### Build

1. `const session = await requireSession();` as the **first line** of the component
2. **Only then** fetch data
3. Replace the `cookies()` call you added in Phase 9 Problem 2 with this
4. Log out, hit `/dashboard`
5. Revisit `app/dashboard/layout.tsx` — keep any layout check as UX, but know it's
   **not** the boundary

### Why the order matters

**Check first, fetch second.** Fetching before checking means you did the database work
for a request you were about to reject — and if anything leaks through a log or an
error message, you leaked data you should never have read.

### Why a layout isn't enough

Layouts **don't re-run on navigation** — that's the whole point of Phase 2 Problem 1.
A layout check can be skipped by client-side navigation in ways a page check cannot.

### Test

Logged out, `/dashboard` redirects to `/login` **before any data is fetched** — put a
log in `getStats` and confirm it doesn't fire.

---

## Problem 4 — Admin only, with 401 vs 403

**Goal:** a logged-in viewer gets "forbidden", not a login redirect.

**Files:** `app/admin/layout.tsx` *(edit)*, `app/admin/page.tsx` *(edit)*,
`app/forbidden/page.tsx` *(new)*

### Build

1. **Delete** `const role: Role = "viewer";` from `app/admin/layout.tsx` — the
   hardcoded gate that's been blocking you since Phase 10
2. In `app/admin/page.tsx`: `const session = await requireRole("admin");`
3. Create `app/forbidden/page.tsx` — a plain page saying the account lacks permission,
   with a link home
4. Log in as `viewer@example.com` and hit `/admin`

### The distinction

| | Meaning | Correct response |
|---|---|---|
| **401 Unauthorized** | not logged in | send them to log in |
| **403 Forbidden** | logged in, not allowed | tell them no — logging in again won't help |

Sending a logged-in viewer to the login page is a real UX bug: they log in again, land
back on `/admin`, get bounced again, and conclude the app is broken.

**Read the role from the verified session, never from anything the client sent.**

### Test

| Logged in as | `/admin` shows |
|---|---|
| nobody | the login page |
| `viewer@example.com` | **forbidden** |
| `admin@example.com` | the admin page |

---

## Problem 5 — Role-based navigation

**Goal:** prove that hiding UI is cosmetic.

**File:** `app/_components/Nav.tsx` *(edit)*

### Build

1. Get the session on the **server** (in the layout that renders `Nav`)
2. Pass **only the role** down as a prop — never the whole session
3. Conditionally render the Admin link
4. **Then attack your own app:** log in as a viewer, open devtools, unhide the admin
   link, click it

### Why

**Hiding a link is not access control.** It's UX — it stops people clicking things
that would fail. Anyone can unhide it in two seconds.

> [!danger] If step 4 gets you into `/admin`, your app is broken and Problem 4 isn't done.

Never send the whole session to the client. It contains more than the browser needs,
and everything you send is readable.

### Test

Unhiding the link and clicking it **still gets rejected**.

---

## Problem 6 — Session-aware homepage

**Goal:** render differently for logged-in and anonymous visitors, redirecting neither.

**File:** `app/(marketing)/page.tsx` *(edit)*

### Build

1. Use `getSession()` — the one that **returns null** rather than redirecting
2. Render a greeting or a sign-in prompt
3. `npm run build` and compare the marker against your Phase 9 baseline
4. **Comment what that costs**
5. **Then improve it:** move the personalised bit into its own component inside
   `<Suspense>` and see whether the rest can still prerender

### Why this problem exists

It's where the two session functions earn their separate existence. A protected page
wants `requireSession()` — absence is an error. A public page wants `getSession()` —
absence is completely normal.

**Step 3 is the cost:** reading `cookies()` makes this route dynamic. Your homepage
just stopped being a static file. Step 5 is the mitigation — same technique as Phase 9
Problem 6.

### Test

Both states render. `/` flipped from `○` to `ƒ` — confirm against the Phase 9 table.

---

## Problem 7 — Protected Route Handler

**Goal:** APIs return **status codes**, not redirects.

**Files:** `app/api/protected/route.ts` *(new)*,
`app/api/products/[id]/route.ts` *(edit)*

### Build

1. In the new handler, read the cookie from `request.cookies.get("session")` —
   **synchronous** on `NextRequest`, unlike `await cookies()`
2. `verifySession` it
3. No valid session → **401** with a `WWW-Authenticate: Bearer` header
4. Valid but wrong role → **403**
5. Use the same `apiError` shape from Phase 8's `lib/api.ts`
6. **Never leak internal error details**
7. **Then go back and secure Phase 8's mutating endpoints** — `POST`, `PUT`, `PATCH`,
   `DELETE` are all currently wide open

### Why redirecting an API client is wrong

A `fetch()` follows redirects silently. Your mobile app asks for JSON, gets a 200 with
an HTML login page, and crashes on `res.json()` with a confusing parse error. The real
problem — "you're not authenticated" — appears nowhere in that message.

**Pages redirect. APIs return status codes.** Same session logic, different response.

### Step 7 is not optional

Phase 8 built endpoints that create, update and delete with no auth at all. Right now
anyone on the internet can empty your product catalogue.

### Test

```bash
curl -i http://localhost:3000/api/protected
```

**401.** With a viewer's cookie, **403**. And:

```bash
curl -i -X DELETE http://localhost:3000/api/products/p-1
```

**401**, not 204.

---

## Done when

- Login and logout work end to end against the seeded users
- A tampered cookie logs you out — you tried it
- Protected pages redirect **before fetching**
- A viewer gets **403** on `/admin`, not a login redirect
- Unhiding a hidden admin link in devtools achieves **nothing**
- API endpoints return 401/403 rather than redirecting
- **Every mutating endpoint checks authorization**
- `npm run build` passes

---

## Recall questions

1. Define authentication vs authorization in one sentence each.
2. Where can you `.set()` a cookie, and where can't you? Why the restriction?
3. What does `httpOnly` protect against? What does `sameSite`? Different attacks —
   name both.
4. Why is "invalid email or password" better than "no user with that email"?
5. Why must logout be a POST rather than a GET link?
6. Proxy, layout, and page can all check auth. Which is authoritative, and why is the
   proxy alone insufficient?
7. A user edits the DOM to reveal a hidden admin link and clicks it. What stops them?
8. Why is redirecting an API client on auth failure wrong?
9. What is **IDOR**, and which of your endpoints is vulnerable if you check role but
   not ownership?

---

## Not yet

Phase 13 adds the proxy as a **fast pre-filter** on top of this. The checks you wrote
here remain the actual boundary.
