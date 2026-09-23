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
    ├── db-core.ts          shared helpers: readJson, writeJson, sleep, DELAYS
    ├── products.ts         product reads (and later, writes)
    ├── categories.ts       category reads
    ├── posts.ts            post reads
    ├── users.ts            user reads (and later, writes)
    ├── docs.ts             doc reads
    ├── dashboard.ts        stats, orders, notifications, sales records
    └── types.ts            every entity type
```

**One file per entity.** Pages import from the file that owns the data:

```ts
import { getProducts } from "@/lib/products";
import { getUsers } from "@/lib/users";
```

`db-core.ts` is plumbing for the other `lib/` files. App code never imports from it.

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

## The data functions

Every one is `async` and artificially slow. **The delays are the point** — without
them, `loading.tsx` never appears and Phases 7 and 9 teach you nothing.

The delays live in `lib/db-core.ts`:

```
DELAYS.fast = 300ms
DELAYS.slow = 4000ms
```

| Function | File | Returns | Delay |
|---|---|---|---|
| `getProducts(options?)` | `products.ts` | `Promise<ProductListResult>` | slow |
| `getProduct(id)` | `products.ts` | `Promise<Product \| null>` | fast |
| `getCategories()` | `categories.ts` | `Promise<Category[]>` | fast |
| `getCategory(slug)` | `categories.ts` | `Promise<Category \| null>` | fast |
| `getPosts()` | `posts.ts` | `Promise<Post[]>` | fast |
| `getPost(slug)` | `posts.ts` | `Promise<Post \| null>` | fast |
| `getUsers()` | `users.ts` | `Promise<PublicUser[]>` | fast |
| `getUser(username)` | `users.ts` | `Promise<PublicUser \| null>` | fast |
| `getUserByEmail(email)` | `users.ts` | `Promise<User \| null>` | fast |
| `getDoc(slug: string[])` | `docs.ts` | `Promise<Doc \| null>` | fast |
| `getStats()` | `dashboard.ts` | `Promise<DashboardStats>` | 800ms |
| `getRecentOrders()` | `dashboard.ts` | `Promise<RecentOrder[]>` | 1200ms |
| `getNotifications()` | `dashboard.ts` | `Promise<Notification[]>` | 600ms |
| `getSalesRecords()` | `dashboard.ts` | `Promise<SalesRecord[]>` | fast, 10,000 rows |

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

## Adding data functions later

Later phases add functions that don't exist yet. **Each one goes in the file for its
entity.** Shared helpers go in `db-core.ts`.

| Phase | Adds | File |
|---|---|---|
| 5 | `getDocs` | `docs.ts` |
| 6 | `shouldFail` switch, `failIfAsked` | `db-core.ts` |
| 6 | `getRecommendations` | `products.ts` |
| 6 | `getPostsByAuthor` | `posts.ts` |
| 7 | `getAnalytics`, `getFlakyAnalytics` | `dashboard.ts` |
| 8 | `writeJson` | `db-core.ts` |
| 8 | `createUser` | `users.ts` |
| 8 | `updateProduct`, `deleteProduct` | `products.ts` |
| 10 | `createProduct` | `products.ts` |
| 10 | `updateUser` | `users.ts` |
| 11 | `getCachedCategories` | `categories.ts` |

Add them when the brief asks, not before.

An entity file imports the helpers it needs from `db-core.ts`:

```ts
import { DELAYS, sleep, readJson, writeJson } from "./db-core";
```

---

## Not yet

No route groups, no dynamic routes, no layouts beyond root, no fetching from
components. **Phase 1 starts the actual routing.**
