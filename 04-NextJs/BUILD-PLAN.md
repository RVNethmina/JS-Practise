# Next.js Track — Build Plan

You learn Next.js by **building one real application**, in phases, from scratch.

Isolated exercise files don't work for this framework. Routing *is* folder
structure — the answer to "build a dynamic product route" is a file at
`app/products/[id]/page.tsx`, and the location is most of the answer. Caching,
streaming, and the static/dynamic decision are runtime behaviour you have to
*observe*, not code you can typecheck.

So: one app, fifteen phases, built by you.

## The three pieces

| Piece | Where | What it is |
|---|---|---|
| **Theory** | `C:\Hello\Notes\NextJs-Vault` | 50 notes. Read before each phase. |
| **Briefs** | `04-NextJs/phases/` | 15 specs. What to build, how to verify. |
| **The app** | `04-NextJs/practise-app/` | You build this. I don't touch it. |

Briefs contain **no solution code**. They are specifications — routes to create,
requirements, acceptance criteria, and closed-book recall questions.

## How to run a phase

1. **Read the vault notes** listed at the top of the brief. All of them, first.
2. **Build what the brief specifies.** From memory where you can.
3. **Verify** against the "Done when" list by actually running the app.
4. **Answer the recall questions** closed-book. If you can't, the phase isn't done
   even if the code works.

Stuck? The Show / Hint / Check modes from [FOCUS.md](../FOCUS.md) apply per problem:

- **Show** — full worked solution with reasoning. First problem of a genuinely new
  concept only, then close it and rewrite from memory.
- **Hint** — the approach in words plus the file skeleton. Your default.
- **Check** — you write it cold, I review. Use this as much as possible.

## The app

A **storefront with an admin area**. Public marketing pages, a product catalogue, a
blog, docs, user accounts, a private dashboard, and an admin CRUD area — plus a JSON
API for a hypothetical mobile client.

That spread is deliberate: it produces natural homes for static rendering, ISR,
dynamic routes, protected routes, streaming, mutations, and caching without any of
it feeling contrived.

Full entity and route map: [APP-SPEC.md](APP-SPEC.md).

## Phases

Dependency-ordered. Each phase only needs what earlier phases built.

| # | Phase | Concept folder | Problems |
|---|---|---|---|
| 0 | [Scaffold](phases/00-scaffold.md) | — | setup |
| 1 | [Routing](phases/01-routing.md) | 01-routing | 6 |
| 2 | [Layouts](phases/02-layouts.md) | 02-layouts | 7 |
| 3 | [Server Components](phases/03-server-components.md) | 03-server-components | 5 |
| 4 | [Client Components](phases/04-client-components.md) | 04-client-components | 7 |
| 5 | [Dynamic Routes](phases/05-dynamic-routes.md) | 05-dynamic-routes | 6 |
| 6 | [Data Fetching](phases/06-data-fetching.md) | 06-data-fetching | 7 |
| 7 | [Loading & Errors](phases/07-loading-error.md) | 07-loading-error | 6 |
| 8 | [Route Handlers](phases/08-route-handlers.md) | 08-api-route-handlers | 8 |
| 9 | [Rendering](phases/09-rendering.md) | 13-rendering | 6 |
| 10 | [Server Actions](phases/10-server-actions.md) | 09-server-actions | 7 |
| 11 | [Caching](phases/11-caching.md) | 12-caching | 6 |
| 12 | [Authentication](phases/12-authentication.md) | 10-authentication | 7 |
| 13 | [Middleware](phases/13-middleware.md) | 11-middleware | 5 |
| 14 | [TypeScript pass](phases/14-typescript.md) | 15-typescript-nextjs | 7 |

90 problems total. Track progress in [PROGRESS.md](PROGRESS.md).

**Phase 11 (Caching) is the hardest and the most-asked in interviews.** Budget extra
time. Don't skip the lab routes — they exist because cache behaviour is invisible
otherwise.

## Two ordering notes

**Server Actions (10) come before Caching (11).** The original FOCUS.md order had
caching first, but "invalidate data after mutation" needs a mutation to exist.

**The login form is built twice, deliberately.** Phase 10 builds it as a *mechanism*
— form, action, set a cookie. Phase 12 hardens it into a verified session with role
checks. That's not redundancy; the second pass is where the security thinking lives.

## Verification

`tsc` cannot check this track. Two tools replace it.

**Running the app** — every "Done when" item is checkable in a browser:

```bash
cd C:\Hello\My_Projects\JS-Practise\04-NextJs\practise-app && npm run dev
```

**The build output** — from Phase 9 onward this is your primary instrument. It marks
every route `○` static, `●` SSG, or `ƒ` dynamic, which is the only reliable way to
confirm a rendering or caching change did what you intended:

```bash
cd C:\Hello\My_Projects\JS-Practise\04-NextJs\practise-app && npm run build
```

Get in the habit of reading that route table. One stray `cookies()` in a shared
component can silently flip a whole page to dynamic, and you would never notice at
runtime.

## Version note

`create-next-app` installs **Next 16 / React 19**. The vault notes were written for
15+. Everything they emphasise still holds — async `params` / `searchParams` /
`cookies()`, uncached-by-default `fetch`, `useActionState` replacing `useFormState`.
Next 16 adds APIs the notes don't cover; briefs flag where to check current docs
rather than assume.

If a tutorial you find online contradicts a note, check its date. Anything written
for Next 14 gets caching backwards.
