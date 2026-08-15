# App Spec — Storefront + Admin

The product you're building across all 15 phases. Read this once at the start of
Phase 0, then refer back as each phase adds routes.

Keep it **ugly**. Minimal CSS, no component library, no design work. Every hour
spent on styling is an hour not spent on the concepts this track exists to teach.

## Entities

Define these in `lib/types.ts` in Phase 0. Phase 14 hardens them.

```
Product
  id, slug, name, description, price, categoryId,
  tags[], inStock, createdAt, variants[]

ProductVariant
  id, productId, name, sku, priceDelta, inStock

Category
  id, slug, name, description

Post              (blog)
  id, slug, title, excerpt, body, authorId, publishedAt, tags[]

User
  id, username, name, email, passwordHash, role, createdAt

Doc               (documentation pages, addressed by path segments)
  slug[], title, body
```

`User.role` must be a **literal union** — `"admin" | "editor" | "viewer"` — never
`string`. `Product.price` is an integer in cents; floats and money don't mix.

## Data layer

`lib/db.ts` reads and writes JSON files in `data/`. No ORM, no database.

Seed roughly: 20 products across 4 categories, some with variants; 10 blog posts; 8
docs pages at varying depths; 5 users covering all three roles.

The contract — implement as you need them, not all at once:

```
getProducts(opts?)     getProduct(id)      getProductBySlug(slug)
getCategories()        getCategory(slug)   getProductsByCategory(slug)
getPosts()             getPost(slug)
getUsers()             getUser(username)
getDoc(slug[])
createProduct(data)    updateProduct(id, data)    deleteProduct(id)
```

**Add an artificial delay to every read.** Something like `await sleep(300)`, with a
couple of deliberately slow functions at 2000ms. Without latency, streaming and
Suspense are invisible and Phases 7 and 9 teach you nothing.

### Direct access vs the API — both, deliberately

**Phases 3–7 read `db` directly** from Server Components. This is the *correct*
production pattern; the vault's `Route Handlers.md` note says so explicitly — you
don't build an HTTP endpoint just to feed your own pages.

**Phase 8 builds the API** for a hypothetical mobile client — the legitimate reason
to have one.

**Phase 11 switches selected routes to `fetch()` those endpoints.** Self-fetching is
a production anti-pattern. It's used here on purpose: the Data Cache only applies to
`fetch`, so this is the only way to make cache hits, tags, and revalidation
observable. The Phase 11 brief repeats this warning.

## Route map

Phase numbers show when each route first appears. Later phases revisit many of them.

```
app/
  layout.tsx                                  root layout            P0
  globals.css                                                        P0

  (marketing)/
    layout.tsx                                marketing shell        P2
    page.tsx                                  /                      P1
    about/page.tsx                            /about                 P1
    pricing/page.tsx                          /pricing               P1

  (shop)/
    layout.tsx                                shop shell             P2
    products/
      page.tsx                                /products              P3
      loading.tsx                                                    P7
      error.tsx                                                      P7
      [id]/
        page.tsx                              /products/1            P1
        not-found.tsx                                                P7
        variants/[variantId]/page.tsx         /products/1/variants/x P5
    shop/[category]/page.tsx                  /shop/electronics      P5

  blog/
    page.tsx                                  /blog                  P9
    [slug]/page.tsx                           /blog/hello-world      P5

  docs/[[...slug]]/page.tsx                   /docs, /docs/a/b       P1

  users/
    page.tsx                                  /users                 P3
    [username]/page.tsx                       /users/ravindu         P1

  (auth)/
    layout.tsx                                centred card shell     P2
    login/page.tsx                            /login                 P10
    register/page.tsx                         /register              P1

  dashboard/
    layout.tsx                                                       P2
    page.tsx                                  /dashboard             P3
    loading.tsx                                                      P7
    error.tsx                                                        P7
    settings/
      layout.tsx                              nested layout          P2
      page.tsx                                /dashboard/settings    P1
      profile/page.tsx                        .../settings/profile   P1
    analytics/
      page.tsx                                                       P7
      error.tsx                               nested boundary        P7

  admin/
    layout.tsx                                RBAC gate              P2
    page.tsx                                  /admin                 P12
    products/
      page.tsx                                /admin/products        P10
      new/page.tsx                                                   P10
      [id]/edit/page.tsx                                             P10

  reports/page.tsx                            server transformation  P3

  api/
    users/route.ts                            GET, POST              P8
    products/route.ts                         GET paginated          P8
    products/[id]/route.ts                    GET PUT PATCH DELETE   P8
    search/route.ts                           GET ?q=                P8
    protected/route.ts                        401/403 demo           P12
    [resource]/route.ts                       whitelisted generic    P8

  lab/                                        experiments only
    layout.tsx                                                       P4
    counter/page.tsx                                                 P4
    hydration/page.tsx                        deliberate mismatch    P4
    waterfall/page.tsx                        timing comparison      P6
    cache-compare/page.tsx                    cached vs uncached     P11
    static-demo/page.tsx                                             P11
    dynamic-demo/page.tsx                                            P11

middleware.ts                                 project root           P13

lib/
  types.ts                                                           P0
  db.ts                                                              P0
  session.ts                                                         P12
  params.ts                                   searchParams helpers   P14

data/
  products.json  categories.json  posts.json  users.json  docs.json   P0
```

## The lab folder

`app/lab/` holds routes whose whole purpose is to **break or compare** something —
a deliberate hydration mismatch, a timed waterfall, a cached fetch next to an
uncached one.

They don't belong in the real app surface, and they'd look bizarre in a portfolio,
which is fine: this app is a training rig, not a portfolio piece. You already have
ten of those.

## Users and roles

Seed one user per role. Passwords are plain strings in the seed file — this is a
local training app with no real secrets, and hashing is not what you're here to
learn. The Phase 12 brief flags exactly where that would be unacceptable in
production.

```
admin@example.com     role: admin     full access
editor@example.com    role: editor    can edit own content
viewer@example.com    role: viewer    read-only
```
