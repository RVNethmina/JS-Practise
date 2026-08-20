# Phase 0 — Scaffold and Data Layer

**Status: DONE.** You already built this. This file is now your **reference sheet** —
the contract every later phase relies on. When a brief says "call `getProducts`",
this page tells you what that returns.

Nothing here is interview material. Come back to it to look things up.

---

## What exists

```
04-NextJs/practise-app/
├── app/
│   └── layout.tsx          root layout — the ONLY one with <html> and <body>
├── data/
│   ├── categories.json
│   ├── docs.json
│   ├── posts.json
│   ├── products.json
│   └── users.json
└── lib/
    ├── db.ts               async read functions over those JSON files
    └── types.ts            every entity type
```

---

## The data types

From `lib/types.ts`. Import them with `import type { Product } from "@/lib/types";`

| Type | Shape | Notes |
|---|---|---|
| `Product` | `id, slug, name, description, price, categoryId, tags[], inStock, createdAt, variants[]` | `price` is **integer cents** — 1999 means $19.99 |
| `ProductVariant` | `id, productId, name, sku, priceDelta, inStock` | `priceDelta` is added to the parent price |
| `Category` | `id, slug, name, description` | |
| `Post` | `id, slug, title, excerpt, body, authorId, publishedAt, tags[]` | |
| `User` | `id, username, name, email, passwordHash, role, createdAt` | |
| `PublicUser` | `Omit<User, "passwordHash">` | **Always use this** for anything the browser sees |
| `Doc` | `slug: string[], title, body` | `slug` is path segments; the index doc has `[]` |
| `Role` | `"admin" \| "editor" \| "viewer"` | A literal union, never `string` |

### Two rules that bite later

**1. `price` is cents, not dollars.** Divide by 100 only when displaying:
`${(product.price / 100).toFixed(2)}`. Doing money in floats causes rounding bugs.

**2. `createdAt` is a `string`, not a `Date`.** A `Date` object **cannot** be passed
from a Server Component to a Client Component — it isn't serializable and the pass
fails. Keeping it as an ISO string means it's safe to pass anywhere. Parse to a
`Date` only at the moment you format it. You'll hit this in Phase 3, Problem 5.

---

## The `lib/db.ts` functions

Every one is `async` and artificially slow. **The delays are the point** — without
them, `loading.tsx` never appears and Phases 7 and 9 teach you nothing.

```
DELAYS.fast = 300ms
DELAYS.slow = 2000ms
```

| Function | Returns | Delay |
|---|---|---|
| `getProducts(options?)` | `Promise<ProductListResult>` | slow |
| `getProduct(id)` | `Promise<Product \| null>` | fast |
| `getCategories()` | `Promise<Category[]>` | fast |
| `getCategory(slug)` | `Promise<Category \| null>` | fast |
| `getPosts()` | `Promise<Post[]>` | fast |
| `getPost(slug)` | `Promise<Post \| null>` | fast |
| `getUsers()` | `Promise<PublicUser[]>` | fast |
| `getUser(username)` | `Promise<PublicUser \| null>` | fast |
| `getUserByEmail(email)` | `Promise<User \| null>` | fast |
| `getDoc(slug: string[])` | `Promise<Doc \| null>` | fast |
| `getStats()` | `Promise<DashboardStats>` | 800ms |
| `getRecentOrders()` | `Promise<RecentOrder[]>` | 1200ms |
| `getNotifications()` | `Promise<Notification[]>` | 600ms |
| `getSalesRecords()` | `Promise<SalesRecord[]>` | fast, 10,000 rows |

### `getProducts` in detail

You'll use this more than anything else.

**Input** — `GetProductsOptions`, all optional:

```
category?     filter by category SLUG ("electronics"), not categoryId
search?       case-insensitive match on name + description
tag?          only products carrying this tag
inStockOnly?  boolean
sort?         "newest" | "price-asc" | "price-desc" | "name"
page?         1-based; below 1 is clamped to 1
pageSize?     clamped to a maximum
```

**Output** — `ProductListResult`:

```
{ items: Product[], page: number, pageSize: number, total: number, totalPages: number }
```

The metadata comes back with the items so you never need a second count query.
Destructure what you need:

```
const { items, total } = await getProducts({ pageSize: 12 });
```

### The three functions that return `null`

`getProduct`, `getPost`, `getUser`, `getCategory`, `getDoc` return `null` when
nothing matches. TypeScript **forces** you to handle it — you cannot read `.name`
off a `Product | null`. That's deliberate. Later phases call `notFound()` on the
null branch.

---

## Verify Phase 0 is sound

Run each of these. All four must pass before any later phase makes sense.

```bash
cd C:\Hello\My_Projects\JS-Practise\04-NextJs\practise-app && npm run dev
```

1. Dev server starts with no errors
2. `npx tsc --noEmit` reports nothing
3. `npm run build` succeeds and prints a route table
4. Open `lib/types.ts` — search for `any`. There should be none.

---

## Adding to `db.ts` later

Some phases need write functions that don't exist yet:

| Needed by | Functions |
|---|---|
| Phase 10 | `createProduct`, `updateProduct`, `deleteProduct` |
| Phase 6, 7 | a `shouldFail` flag to trigger errors on demand |

Add them when the brief asks, not before.

---

## Not yet

No route groups, no dynamic routes, no layouts beyond root, no fetching from
components. **Phase 1 starts the actual routing.**
