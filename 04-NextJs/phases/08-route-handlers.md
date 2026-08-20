# Phase 8 — Route Handlers

**8 problems** · Vault folder: `08-api-route-handlers`

## Read first

- `NextJs-Vault/08-api-route-handlers/Route Handlers.md`
- `NextJs-Vault/08-api-route-handlers/Request and Response.md`
- `NextJs-Vault/08-api-route-handlers/Dynamic API Routes.md`

## The one idea in this phase

A **Route Handler** is a file named `route.ts` that responds to HTTP requests instead
of rendering HTML. You export functions **named after HTTP methods**:

```
export async function GET(request: Request) { ... }
export async function POST(request: Request) { ... }
```

**The function name is the routing.** `GET` handles GET, `POST` handles POST. There's
no method-checking `if` statement.

`route.ts` and `page.tsx` **cannot coexist in the same folder** — both would claim the
same URL.

## Why build this at all?

**For a hypothetical mobile client.** That's the legitimate reason for an API.

Your pages keep reading `db` **directly** — building an HTTP endpoint to feed your own
server-rendered pages is a pointless network round trip.

Phase 11 will point some pages at these endpoints *deliberately*, to make caching
observable. That's a teaching device, not architecture advice.

## Test with `curl`, not the browser

The browser can only send GET. You'll miss most of your own bugs.

```bash
curl -i http://localhost:3000/api/users
```

`-i` shows the status line and headers, which is most of what you're checking here.

---

## Problem 1 — GET users

**Goal:** `/api/users` returns JSON.

**File:** `app/api/users/route.ts`

### Steps

1. Create `app/api/users/route.ts`
2. Export a named `async function GET`
3. `await getUsers()` from `@/lib/db`
4. Return `Response.json(users)` — or `NextResponse.json(users)`
5. Set the status explicitly rather than relying on the default
6. Type the response body

### Verify

```bash
curl -i http://localhost:3000/api/users
```

Status 200, `content-type: application/json`, users in the body.

---

## Problem 2 — POST user

**Goal:** posting valid JSON creates a user; posting garbage returns 400, never 500.

**File:** `app/api/users/route.ts` (same file — a second export)

### Steps

1. `export async function POST(request: Request)`
2. **Wrap `await request.json()` in a `try/catch`** — it *throws* on malformed input
3. In the catch, return 400 with a JSON error body
4. Then **validate** the parsed object — check every field you need exists and has the
   right type
5. Invalid → 400 with which fields failed
6. Valid → create it, return **201** with the created resource

### What you need to know

`request.json()` returns **`any`**. TypeScript will happily let you read
`body.email.toLowerCase()` off it and crash at runtime.

Two separate failures, both must be handled:
- **Malformed JSON** → `request.json()` throws → catch → 400
- **Valid JSON, wrong shape** → parses fine, fails your validation → 400

**A 500 means your server broke. A 400 means the client sent something bad.** Sending
500 for bad input is a bug — it triggers alerts and tells the client to retry
something that will never work.

### Verify

```bash
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "not json"
```

Returns **400**, not 500. A valid body returns 201.

---

## Problem 3 — GET product by id

**Goal:** `/api/products/1` returns the product; `/api/products/999` returns a JSON 404.

**File:** `app/api/products/[id]/route.ts`

### Steps

1. Dynamic segment folders work exactly as in pages
2. Params arrive in the **second argument**:
   ```
   export async function GET(
     request: Request,
     { params }: { params: Promise<{ id: string }> }
   )
   ```
3. `await params` — same async rule as pages
4. `await getProduct(id)`
5. Null → return 404 **with a JSON error body**, not `notFound()`

### What you need to know

`notFound()` renders an HTML page. **An API client wants JSON.** Return a proper JSON
error shape with a 404 status instead.

Pick one error shape now and use it for every endpoint in this phase — something like
`{ error: "Product not found" }`. Consistency is what makes an API usable.

### Verify

`/api/products/1` → 200 with the product. `/api/products/999` → 404 with a JSON body.

---

## Problem 4 — Update product (PUT and PATCH)

**Goal:** both methods work and differ correctly.

**File:** `app/api/products/[id]/route.ts`

### Steps

1. Add `PUT` and `PATCH` exports to the same file
2. **PUT replaces the whole resource** — require every field
3. **PATCH updates some fields** — merge with what exists
4. Validate both bodies
5. **Comment the semantic difference**
6. 200 with the updated resource; 404 if it doesn't exist
7. Test PATCH with **one** field and confirm the others survive

### What you need to know

- **PUT is idempotent** — sending it five times leaves the same result as once.
- **PATCH usually is too**, but not necessarily — `{ "increment": 1 }` isn't.

Idempotency matters because clients retry on network failure. A non-idempotent
endpoint can double-apply.

### Verify

PATCH with one field leaves the others intact. PUT with a partial body is rejected.

---

## Problem 5 — Delete product

**Goal:** a correct 204 with a genuinely empty body.

**File:** `app/api/products/[id]/route.ts`

### Steps

1. Add a `DELETE` export
2. **First, try `Response.json(null, { status: 204 })`** and see what happens
3. Then do it correctly: `new Response(null, { status: 204 })`
4. 404 if it didn't exist
5. **Decide and document:** is deleting an already-deleted resource an error?

### What you need to know

**204 means "No Content" — the body must be empty.** `Response.json(null, ...)` tries
to write `"null"` as a body, which contradicts the status. Step 2 is there so you see
the failure rather than reading about it.

Step 5 has no single right answer. Returning 204 for an already-deleted resource makes
DELETE idempotent, which is friendlier for retries. Returning 404 is more literal.
**Pick one, write down why.** Interviewers ask this to see if you reason about API
design.

### Verify

The 204 response has a genuinely empty body — check with `curl -i`.

---

## Problem 6 — Search endpoint

**Goal:** `/api/search?q=phone&limit=5` works; a missing `q` is a 400.

**File:** `app/api/search/route.ts`

### Steps

1. Read params from `request.nextUrl.searchParams` (needs `NextRequest`)
2. **Require `q`** — missing → 400 with a message saying so
3. Read optional `limit`, parse it, and **clamp it** to a maximum
4. Pass into `getProducts({ search: q })`
5. Test `?limit=999999`

### What you need to know

`request.nextUrl.searchParams` is a `URLSearchParams` — `.get()` returns
`string | null`. **Synchronous** here, unlike a page's `searchParams` Promise.

**Why clamp `limit`:** without it, `?limit=999999999` lets any anonymous caller ask
your server to build an enormous response. That's a denial-of-service vector, and it
costs one line to prevent.

### Verify

`?q=phone&limit=5` works. No `q` → 400. `?limit=999999` returns the clamped count.

---

## Problem 7 — Paginated endpoint

**Goal:** `/api/products?page=2&pageSize=10` returns the right slice plus metadata.

**File:** `app/api/products/route.ts`

### Steps

1. Read `page` and `pageSize` with defaults
2. Parse both safely — reject or clamp `NaN`, zero, negatives
3. **Clamp `pageSize`** and comment why
4. Return `{ items, page, pageSize, total, totalPages }`
5. Handle a page beyond the last — empty `items`, not an error
6. Test `?page=2&pageSize=10`

### What you need to know

`getProducts` already returns exactly this shape, so you can pass it through almost
verbatim.

Returning the metadata alongside the items means the client never needs a second
request to build pagination controls.

### Verify

`?page=2&pageSize=10` returns the right slice with correct `total` and `totalPages`.
A page past the end returns empty items with a 200.

---

## Problem 8 — Dynamic resource endpoint

**Goal:** one handler serving several resource types — safely.

**File:** `app/api/[resource]/route.ts`

### Steps

1. `await params` for the resource name
2. **Whitelist the allowed names** — an explicit array or a lookup object mapping
   names to functions
3. Anything not on the list → 404
4. **Comment why a whitelist is mandatory, not a nicety**
5. Test `/api/secrets`

### What you need to know

**This is the security problem of the phase.** Passing a user-controlled URL segment
into a filename, a table name, or a dynamic import is how **path traversal** and
**injection** happen. A request for `/api/../../etc/passwd` or `/api/admin_tokens` is
not hypothetical — it's the first thing an attacker tries.

**A denylist is always wrong** — you'll never think of every bad value. A whitelist
is the only correct shape: enumerate what's allowed, reject everything else.

Note this route may **conflict** with `app/api/users/route.ts` from Problem 1. Static
segments win over dynamic ones, so `/api/users` hits the specific file. Confirm that's
actually what happens.

### Verify

`/api/users` and `/api/products` work. **`/api/secrets` 404s.**

---

## Done when

- Every endpoint returns correct status codes
- Malformed JSON produces **400, never 500**
- 204 responses have genuinely empty bodies
- `pageSize` and `limit` are clamped
- The generic resource route rejects anything unlisted
- **You've tested with `curl`**, not just the browser

---

## Recall questions

1. In Next 15+, are GET Route Handlers cached by default? This changed from 14 —
   what's the current behaviour and how do you opt into the other?
2. Why is validating `request.json()` non-negotiable? What type does it return?
3. Write the full signature of a dynamic Route Handler from memory.
4. PUT is idempotent. What does that mean, and is PATCH idempotent?
5. How do you return a 204 correctly? What goes wrong with
   `Response.json(null, { status: 204 })`?
6. What's the security risk of passing a route param into a database table name or
   file path? Name the vulnerability class.
7. Offset vs cursor pagination — one concrete problem with offset on a
   frequently-changing dataset.
8. When should you build a Route Handler at all, versus reading `db` directly?

---

## Not yet

**No auth on these endpoints** — they are wide open, including the mutating ones.
Phase 12 adds 401/403. No caching (Phase 11).
