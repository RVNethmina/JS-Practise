# Phase 8 — Route Handlers

**8 problems** · Vault folder: `08-api-route-handlers`

## Read first

- `NextJs-Vault/08-api-route-handlers/Route Handlers.md`
- `NextJs-Vault/08-api-route-handlers/Request and Response.md`
- `NextJs-Vault/08-api-route-handlers/Dynamic API Routes.md`

## The one idea

A **Route Handler** is a file named `route.ts` that returns data instead of HTML. You
export functions **named after HTTP methods**:

```ts
export async function GET(request: Request) { ... }
export async function POST(request: Request) { ... }
```

**The function name IS the routing.** No method-checking `if` statement anywhere.

> [!warning] `route.ts` and `page.tsx` cannot live in the same folder
> Both would claim the same URL. Next fails the build.

## Why build an API at all?

**For a hypothetical mobile client.** That's the legitimate reason.

Your pages keep reading `db` **directly** — building an HTTP endpoint to feed your own
server-rendered pages is a pointless network round trip. Phase 11 will deliberately
point some pages at these endpoints to make caching visible; that's a teaching device,
not architecture advice.

## Test with `curl`, not the browser

The browser only sends GET. You'll miss most of your own bugs.

```bash
curl.exe -i http://localhost:3000/api/users
```

`-i` shows the status line and headers, which is most of what you're checking here.

## What you'll have built by the end

```
lib/db-core.ts                   <- writeJson (below)
lib/users.ts                     <- createUser (below)
lib/products.ts                  <- updateProduct, deleteProduct (below)
lib/api.ts                       <- shared response helpers (below)
app/api/users/route.ts           <- P1 GET, P2 POST
app/api/products/route.ts        <- P7 GET paginated
app/api/products/[id]/route.ts   <- P3 GET, P4 PUT/PATCH, P5 DELETE
app/api/search/route.ts          <- P6 GET
app/api/[resource]/route.ts      <- P8 GET, whitelisted
```

---

## Problem 0 — Setup you need before anything else

**The data layer is currently read-only.** There is no way to write to the JSON files,
so POST, PUT, PATCH and DELETE are impossible until you add this.

### 0a. A writer, mirroring `readJson` — in `lib/db-core.ts`

It goes beside `readJson`, and it must be **exported** so `users.ts` and `products.ts`
can use it:

```ts
import { readFile, writeFile } from "node:fs/promises";

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  await writeFile(
    path.join(DATA_DIR, filename),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}
```

`null, 2` pretty-prints it, so you can open `data/products.json` and read the change.

> [!info] Mutations now persist across restarts
> That's deliberate — Phase 10 asks you to confirm `data/*.json` actually changed on
> disk. If you corrupt the seed data while experimenting, `git checkout data/` puts it
> back.

### 0b. Three write functions

Each goes in the file for its entity, and imports `writeJson` from `./db-core`.

```ts
// lib/users.ts
export async function createUser(
  input: { username: string; name: string; email: string; role: Role }
): Promise<PublicUser>

// lib/products.ts
export async function updateProduct(
  id: string,
  patch: Partial<Omit<Product, "id">>
): Promise<Product | null>

// lib/products.ts
export async function deleteProduct(id: string): Promise<boolean>
```

- `createUser` — generate `id` as `u-{n+1}`, set `createdAt` to now, store a
  placeholder `passwordHash`, return the user **without** it
- `updateProduct` — merge `patch` over the existing product, save, return it.
  `null` when the id doesn't exist
- `deleteProduct` — `true` if something was removed, `false` if the id wasn't there

### 0c. One error shape, used everywhere — `lib/api.ts` *(new file)*

Pick the shape once so every endpoint answers the same way:

```ts
import { NextResponse } from "next/server";

export type ApiError = { error: string };

export function apiError(message: string, status: number) {
  return NextResponse.json<ApiError>({ error: message }, { status });
}
```

Phase 14 Problem 2 upgrades this into a discriminated union covering success too.

---

## Problem 1 — GET users

**Goal:** `/api/users` returns JSON.

**File:** `app/api/users/route.ts` *(new)*

### Build

1. `export async function GET()`
2. `await getUsers()`
3. `return NextResponse.json(users, { status: 200 })`

No params needed, so `GET` takes no arguments here.

### Test

```bash
curl.exe -i http://localhost:3000/api/users
```

Status 200, `content-type: application/json`, five users in the body.

---

## Problem 2 — POST user

**Goal:** valid JSON creates a user; garbage returns 400, never 500.

**File:** `app/api/users/route.ts` *(same file, second export)*

### Build

1. `export async function POST(request: Request)`
2. **Wrap `await request.json()` in try/catch** — it *throws* on malformed input.
   In the catch, `return apiError("Invalid JSON body", 400)`
3. Then validate the parsed object separately: `username`, `name`, `email` must be
   non-empty strings; `role` must be one of `"admin" | "editor" | "viewer"`
4. Invalid → `apiError("...", 400)` naming which field failed
5. Valid → `await createUser(...)`, return it with **201**

### Why two separate checks

`request.json()` returns **`any`**. TypeScript will happily let you write
`body.email.toLowerCase()` and crash at runtime.

Two distinct failures:

| Input | What happens | Response |
|---|---|---|
| `not json` | `request.json()` **throws** | catch → 400 |
| `{"foo":1}` | parses fine, fails your checks | 400 |

**500 means your server broke. 400 means the client sent something bad.** Returning
500 for bad input triggers alerts and tells the client to retry something that will
never work.

### Test

```bash
curl.exe -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "not json"
```

Must be **400**, not 500.

```bash
curl.exe -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"username\":\"zara\",\"name\":\"Zara\",\"email\":\"z@example.com\",\"role\":\"viewer\"}"
```

**201**, and `data/users.json` now has six users.

---

## Problem 3 — GET product by id

**Goal:** `/api/products/p-1` returns the product; `/api/products/p-9999` returns a
JSON 404.

**File:** `app/api/products/[id]/route.ts` *(new)*

### Build

Params arrive in the **second argument**, and they're a Promise, same as pages:

```ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  ...
}
```

Null result → `apiError("Product not found", 404)`.

### Why not `notFound()`

`notFound()` renders an **HTML page**. An API client asked for JSON and would get a
login-page-shaped surprise, then crash on `res.json()`. Return a JSON body with a 404
status instead.

### Test

```bash
curl.exe -i http://localhost:3000/api/products/p-1
curl.exe -i http://localhost:3000/api/products/p-9999
```

200 with the product; 404 with `{"error":"Product not found"}`.

---

## Problem 4 — PUT and PATCH

**Goal:** both work, and differ correctly.

**File:** `app/api/products/[id]/route.ts` *(same file)*

### Build

1. `export async function PUT(request, { params })` — **replace**: require `name`,
   `description`, `price`, `categoryId`, `inStock`. Missing any → 400
2. `export async function PATCH(request, { params })` — **merge**: accept any subset,
   reject unknown keys
3. Both: 404 when `updateProduct` returns null, 200 with the updated product otherwise
4. Both: same JSON-parse try/catch as Problem 2
5. Comment the semantic difference

### What you need to know

**PUT is idempotent** — sending it five times leaves the same result as once. **PATCH
usually is too**, but not necessarily: `{ "increment": 1 }` isn't.

This matters because clients retry on network failure. A non-idempotent endpoint can
double-apply.

### Test

```bash
curl.exe -i -X PATCH http://localhost:3000/api/products/p-1 -H "Content-Type: application/json" -d "{\"price\":19900}"
```

200, and the product's **name and tags are unchanged** — only the price moved.

```bash
curl.exe -i -X PUT http://localhost:3000/api/products/p-1 -H "Content-Type: application/json" -d "{\"price\":19900}"
```

**400** — PUT demands the whole resource.

---

## Problem 5 — DELETE

**Goal:** a correct 204 with a genuinely empty body.

**File:** `app/api/products/[id]/route.ts` *(same file)*

### Build

1. `export async function DELETE(request, { params })`
2. **First, deliberately try** `return NextResponse.json(null, { status: 204 })` and
   see what happens
3. Then do it right: `return new Response(null, { status: 204 })`
4. 404 when `deleteProduct` returns false
5. **Decide and write down:** is deleting an already-deleted product an error?

### Why step 2 fails

**204 means "No Content" — the body must be empty.** `NextResponse.json(null, ...)`
tries to write `"null"` as a body, contradicting the status. Seeing the failure beats
reading about it.

### On step 5

No single right answer. Returning 204 for an already-gone resource makes DELETE
idempotent, which is friendlier for retries. Returning 404 is more literal. **Pick one
and write down why** — interviewers ask this to see if you reason about API design.

### Test

```bash
curl.exe -i -X DELETE http://localhost:3000/api/products/p-20
```

**204**, and nothing after the headers. Then `git checkout data/products.json` to
restore it.

---

## Problem 6 — Search endpoint

**Goal:** `/api/search?q=desk&limit=5` works; a missing `q` is a 400.

**File:** `app/api/search/route.ts` *(new)*

### Build

1. `export async function GET(request: NextRequest)` — import `NextRequest` from
   `next/server`
2. Read with `request.nextUrl.searchParams` — **synchronous** here, unlike a page's
   `searchParams` Promise
3. Missing or empty `q` → `apiError("Query parameter 'q' is required", 400)`
4. Optional `limit`: parse, default 10, **clamp to 50**
5. `await getProducts({ search: q, pageSize: limit })`

### Why clamp

Without it, `?limit=999999999` lets any anonymous caller ask your server to build an
enormous response. That's a denial-of-service vector and it costs one line to prevent.

Note `getProducts` already clamps `pageSize` to 50 internally — clamp here **as well**,
so your endpoint's contract doesn't silently depend on someone else's ceiling.

### Test

```bash
curl.exe -i "http://localhost:3000/api/search?q=desk&limit=5"
curl.exe -i "http://localhost:3000/api/search"
curl.exe -s "http://localhost:3000/api/search?q=desk&limit=999999" | head -c 200
```

Works; 400; clamped to at most 50 items.

---

## Problem 7 — Paginated endpoint

**Goal:** `/api/products?page=2&pageSize=5` returns the right slice plus metadata.

**File:** `app/api/products/route.ts` *(new)*

### Build

1. `export async function GET(request: NextRequest)`
2. Read `page` and `pageSize`, defaulting to 1 and 10
3. Parse safely — `NaN`, `0`, negatives all fall back to the default
4. Clamp `pageSize` to 50
5. Return the whole `ProductListResult`:
   `{ items, page, pageSize, total, totalPages }`
6. A page past the end returns **empty items with 200**, not an error

### Why return the metadata

`getProducts` already returns this shape, so pass it through almost verbatim. Sending
the counts alongside the items means the client never needs a second request to build
pagination controls.

### Test

```bash
curl.exe -s "http://localhost:3000/api/products?page=2&pageSize=5"
curl.exe -s "http://localhost:3000/api/products?page=999&pageSize=5"
```

First: 5 items, `page: 2`, `total: 20`, `totalPages: 4`. Second: 200 with the last
page (`getProducts` clamps) — note what it does and whether you agree.

---

## Problem 8 — Dynamic resource endpoint

**Goal:** one handler serving several resource types — safely.

**File:** `app/api/[resource]/route.ts` *(new)*

### Build

1. `await params` for the resource name
2. **A whitelist as a lookup object**, not an if-chain:
   ```ts
   const RESOURCES = {
     categories: getCategories,
     posts: getPosts,
     docs: getDocs,
   } as const;
   ```
3. Not a key of `RESOURCES` → `apiError("Unknown resource", 404)`
4. Otherwise call the mapped function and return it
5. Comment why a whitelist is mandatory, not a nicety

> [!info] Why these three and not `users` / `products`
> **A static segment beats a dynamic one.** `app/api/users/route.ts` wins over
> `app/api/[resource]/route.ts` for `/api/users`.
>
> The bundled docs don't state this outright, so it was verified with two throwaway
> handlers:
>
> ```
> /api/probe  ->  {"handler":"STATIC /api/probe"}
> /api/other  ->  {"handler":"DYNAMIC [res]","res":"other"}
> ```
>
> Picking resources that **don't** have their own file makes it obvious this route is
> doing the work. Then hit `/api/users` and watch the specific file still win.

### Why a whitelist

**This is the security problem of the phase.** Passing a user-controlled URL segment
into a filename, a table name, or a dynamic import is how **path traversal** and
**injection** happen. `/api/../../etc/passwd` is not hypothetical.

**A denylist is always wrong** — you'll never think of every bad value. Enumerate what
IS allowed and reject everything else.

### Test

```bash
curl.exe -i http://localhost:3000/api/categories
curl.exe -i http://localhost:3000/api/secrets
curl.exe -s http://localhost:3000/api/users | head -c 80
```

200; **404**; and `/api/users` still returns your Problem 1 handler's output, proving
the static file wins.

---

## Done when

- Every endpoint returns correct status codes
- Malformed JSON produces **400, never 500**
- The 204 has a genuinely empty body
- `pageSize` and `limit` are clamped
- `/api/secrets` 404s
- **You tested with `curl`**, not just the browser
- `data/users.json` visibly changed after your POST
- `npm run build` passes

---

## Recall questions

1. In Next 15+, are GET Route Handlers cached by default? This changed from 14 — what's
   the current behaviour and how do you opt into the other?
2. Why is validating `request.json()` non-negotiable? What type does it return?
3. Write the full signature of a dynamic Route Handler from memory.
4. PUT is idempotent. What does that mean, and is PATCH idempotent?
5. How do you return a 204 correctly? What goes wrong with
   `NextResponse.json(null, { status: 204 })`?
6. What's the security risk of passing a route param into a table name or file path?
   Name the vulnerability class.
7. Offset vs cursor pagination — one concrete problem with offset on a
   frequently-changing dataset.
8. When should you build a Route Handler at all, versus reading `db` directly?
9. Why does `/api/users` hit the specific file rather than `[resource]`?

---

## Not yet

**No auth on any of these** — including the ones that write and delete. Right now
anyone on the internet could empty your product catalogue. Phase 12 Problem 7 adds
401/403 and comes back to secure these specific endpoints. No caching (Phase 11).
