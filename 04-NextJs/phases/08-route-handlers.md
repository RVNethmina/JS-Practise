# Phase 8 — Route Handlers

Concept folder: **08-api-route-handlers** · 8 problems

## Read first

- `NextJs-Vault/08-api-route-handlers/Route Handlers.md`
- `NextJs-Vault/08-api-route-handlers/Request and Response.md`
- `NextJs-Vault/08-api-route-handlers/Dynamic API Routes.md`

## What you're building

A JSON API — for a hypothetical mobile client, which is the **legitimate** reason to
build one. Your pages keep reading `db` directly.

Phase 11 will point some pages at these endpoints, deliberately, to make caching
observable. That's a teaching device, not architecture advice.

Test with `curl` or the browser, not just by clicking around.

---

## Problem 1 — GET users

**File:** `app/api/users/route.ts`

- Export a named `async function GET` — the **name** is the HTTP method
- `Response.json(...)` or `NextResponse.json(...)`
- Explicit 200 status, typed response body

**Verify:** `/api/users` returns JSON with the right content-type.

---

## Problem 2 — POST user

**File:** `app/api/users/route.ts` (same file)

- `export async function POST(request: Request)`
- `await request.json()` — then **validate**, don't trust it
- 201 with the created resource; 400 on invalid input
- `request.json()` **throws** on malformed JSON — try/catch it

**Verify:** valid POST → 201. Garbage body → 400, not 500. Test with:

```bash
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "not json"
```

---

## Problem 3 — GET product by id

**File:** `app/api/products/[id]/route.ts`

- Second argument holds params: `{ params: Promise<{ id: string }> }`
- `await` it — same async rule as pages
- 404 with a JSON error body when not found

**Verify:** `/api/products/1` returns the product; `/api/products/999` returns 404.

---

## Problem 4 — Update product

**File:** `app/api/products/[id]/route.ts`

Add PUT and PATCH.

- PUT replaces the whole resource; PATCH updates some fields
- Comment the semantic difference
- Validate both bodies
- 200 with the updated resource, 404 if missing

**Verify:** PATCH with one field leaves the others intact.

---

## Problem 5 — Delete product

**File:** `app/api/products/[id]/route.ts`

- 204 No Content on success — **no body**
- 404 if it didn't exist
- Decide and document: is deleting an already-deleted resource an error?

Try `Response.json(null, { status: 204 })` first and see what happens.

**Verify:** the 204 response has an empty body.

---

## Problem 6 — Search endpoint

**File:** `app/api/search/route.ts`

- Read params from `request.nextUrl.searchParams`
- Require `q`; 400 when missing
- Optional `limit`, parsed and **clamped** to a maximum

**Verify:** `?q=phone&limit=5` works; no `q` returns 400; `?limit=999999` is clamped.

---

## Problem 7 — Paginated endpoint

**File:** `app/api/products/route.ts`

- `page` and `pageSize` from the query string with defaults
- Return `{ items, page, pageSize, total, totalPages }`
- Clamp `pageSize` — comment why
- Handle a page beyond the last

**Verify:** `?page=2&pageSize=10` returns the right slice and metadata.

---

## Problem 8 — Dynamic resource endpoint

**File:** `app/api/[resource]/route.ts`

One handler serving multiple resource types.

- `await params` for the resource name
- **Whitelist** the allowed names — reject anything else with 404
- Comment why a whitelist is mandatory, not optional

Try requesting a resource name you didn't whitelist and confirm it's rejected.

**Verify:** `/api/users` and `/api/products` work; `/api/secrets` 404s.

---

## Done when

- Every endpoint returns correct status codes
- Malformed JSON produces 400, never 500
- 204 responses have empty bodies
- `pageSize` and `limit` are clamped
- The generic resource route rejects anything unlisted
- You've tested with `curl`, not just the browser

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

## Not yet

No auth on these endpoints (Phase 12 adds 401/403). No caching (Phase 11).
