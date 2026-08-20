# Phase 1 — Routing

**6 problems** · Vault folder: `01-routing`

## Read first

- `NextJs-Vault/01-routing/App Router and File-System Routing.md`
- `NextJs-Vault/01-routing/Dynamic and Catch-All Routes.md`
- `NextJs-Vault/01-routing/Route Groups and Private Folders.md`

## The one idea in this phase

**In the App Router, folders ARE your URLs.** There is no route config file. You do
not register anything. You create a folder, put `page.tsx` inside it, and that URL
now exists.

```
app/dashboard/page.tsx        →  /dashboard
app/dashboard/settings/page.tsx  →  /dashboard/settings
```

The file must be named exactly `page.tsx`. `Page.tsx`, `index.tsx`, or
`dashboard.tsx` do nothing.

## What you're building

The skeleton of the whole site. **No data fetching in this phase** — pages render
hardcoded placeholder text. You are only proving you can produce any URL shape the
app needs.

---

## Problem 1 — Home route

**Goal:** visiting `/` shows your homepage.

**File:** `app/(marketing)/page.tsx`

### Steps

1. Create the folder `app/(marketing)/` — with the round brackets, they matter
2. Create `page.tsx` inside it
3. Write a function and **`export default`** it
4. Return some JSX — a `<h1>` and a paragraph
5. Above the component, export a `metadata` object that sets the page title
6. Add a link to `/products` using `<Link>` from `next/link`

### What you need to know

- **`export default` is required.** A named export alone gives you a build error.
- The **function name doesn't matter** — `HomePage`, `Foo`, anything. The *file
  location* is what creates the route.
- `metadata` is a plain exported object. Next.js reads it and writes the `<title>`
  tag for you:
  ```
  export const metadata = { title: "..." };
  ```
- Use `<Link href="/products">`, never `<a href="/products">`. `<a>` triggers a full
  page reload and throws away everything React has in memory.

### Verify

1. Go to `/` — your page renders
2. Right-click → **View Page Source** (not devtools). Your heading text is in the raw
   HTML.
3. The browser tab shows your title

### Common mistakes

- Forgetting `export default` → build error
- Naming the file `Page.tsx` → route doesn't exist
- Using `<a>` instead of `<Link>` → works, but it's a full reload

---

## Problem 2 — Nested dashboard routes

**Goal:** three URLs nested three levels deep.

**Files:**
- `app/dashboard/page.tsx` → `/dashboard`
- `app/dashboard/settings/page.tsx` → `/dashboard/settings`
- `app/dashboard/settings/profile/page.tsx` → `/dashboard/settings/profile`

### Steps

1. Create all three folders, nested inside each other
2. Put a `page.tsx` in each, with a heading naming which page it is
3. **Then the experiment:** create `app/dashboard/utils.ts` containing any exported
   function — a one-liner is fine
4. Try visiting `/dashboard/utils` in the browser

### What you need to know

Every level of nesting is just a folder inside a folder. There is no limit and no
registration step.

Step 3 is the actual lesson: **only `page.tsx` creates a route.** You can safely keep
helper files, types, and components inside route folders. They never become URLs.

### Verify

1. All three URLs render their own page
2. **`/dashboard/utils` is a 404** — that's the expected result, not a bug

### Common mistakes

- Assuming any file in `app/` becomes a URL. Only the reserved names do.

---

## Problem 3 — Dynamic product route

**Goal:** `/products/1`, `/products/42`, `/products/anything` all hit one file.

**File:** `app/(shop)/products/[id]/page.tsx`

### Steps

1. Create the folder `[id]` — **square brackets are literal**, you type them
2. Create `page.tsx` inside
3. Make the component **`async`**
4. Give it a props parameter typed as:
   ```
   { params: Promise<{ id: string }> }
   ```
5. Inside, `await params` and pull `id` out of the result
6. Render the id on the page

### What you need to know

- The folder name inside brackets becomes the **property name**. `[id]` → `params.id`.
  `[productId]` → `params.productId`.
- **`params` is a Promise in Next 15+.** It used to be a plain object. That's why the
  component must be `async` and you must `await`. Older tutorials will not do this.
- The value is **always a string**, even for `/products/42`. You get `"42"`, not `42`.

### Do it wrong once, deliberately

Skip the `await` and destructure `params` directly. **You get no error** — you get
`undefined`, because you destructured a Promise, and a Promise has no `id` property.

Do this once so you recognise the symptom. A mysterious `undefined` in a dynamic
route is almost always a missing `await`.

### Verify

1. `/products/42` renders `42`
2. `/products/hello` renders `hello`
3. Log `typeof id` — it's `"string"`

---

## Problem 4 — Dynamic user route with query params

**Goal:** `/users/ravindu?tab=posts` reads both the username and the tab.

**File:** `app/users/[username]/page.tsx`

### Steps

1. Create the route folder and `page.tsx`
2. Type the props with **both**:
   ```
   {
     params: Promise<{ username: string }>;
     searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
   }
   ```
3. `await` both
4. Render the username and the `tab` value
5. Handle `tab` being missing — pick a sensible default
6. Try `/users/ravindu?tab=a&tab=b` and look at what `tab` actually is

### What you need to know

- **`params`** = the `[bracket]` parts of the path. **`searchParams`** = the `?key=value`
  part. Different things, both Promises.
- `searchParams` values are `string | string[] | undefined`:
  - `undefined` — the key wasn't in the URL
  - `string` — normal case
  - `string[]` — **the key appeared more than once**, as in step 6
- That array case is why you can't just treat it as a string. Real users send weird
  URLs; crawlers send weirder ones.

### Verify

1. `/users/ravindu?tab=posts` shows both values
2. `/users/ravindu` (no query) doesn't crash — shows your default
3. `/users/ravindu?tab=a&tab=b` doesn't crash

---

## Problem 5 — Catch-all documentation route

**Goal:** one file handles `/docs`, `/docs/guides`, `/docs/guides/setup/advanced` —
any depth.

**File:** `app/docs/[[...slug]]/page.tsx`

### Steps

1. Create the folder `[[...slug]]` — double brackets, three dots
2. Type `params` as `Promise<{ slug?: string[] }>` — note the `?`
3. `await` it
4. Handle `slug` being `undefined` (that's bare `/docs`)
5. Render breadcrumbs by mapping over the segments
6. In a comment, write down what `[...slug]` (single brackets) would match differently

### What you need to know

Three bracket forms, and the difference matters:

| Folder | Matches | `params` type |
|---|---|---|
| `[id]` | exactly one segment | `{ id: string }` |
| `[...slug]` | one or more segments, **not** the bare path | `{ slug: string[] }` |
| `[[...slug]]` | zero or more — **includes** the bare path | `{ slug?: string[] }` |

`/docs/a/b` gives you `slug = ["a", "b"]` — an **array**, not the string `"a/b"`.

Bare `/docs` with `[[...slug]]` gives `slug === undefined`. Handle it or you'll crash
mapping over nothing.

### Verify

1. `/docs` renders (does **not** 404)
2. `/docs/guides/setup` renders with two breadcrumb segments
3. Your comment explains the single-bracket difference

---

## Problem 6 — Route group for auth pages

**Goal:** `/login` and `/register` work, and the word "auth" appears nowhere in the URL.

**Files:**
- `app/(auth)/login/page.tsx` → `/login`
- `app/(auth)/register/page.tsx` → `/register`
- `app/(marketing)/about/page.tsx` → `/about`
- `app/(marketing)/pricing/page.tsx` → `/pricing`

### Steps

1. Create `app/(auth)/` with the round brackets
2. Add `login/page.tsx` and `register/page.tsx` inside
3. Put placeholder forms in them — inputs and a button, **nothing functional**
4. Add the two marketing pages while you're here
5. Try visiting `/auth/login`

### What you need to know

**A folder in round brackets is invisible to the URL.** It exists purely to organise
files and — the real reason — to let different groups have **different layouts**
(Phase 2).

```
app/(auth)/login/page.tsx    →  /login        NOT /auth/login
```

Login stays a placeholder here. Phase 10 makes it work; Phase 12 makes it secure.

### Verify

1. `/login` and `/register` render
2. **`/auth/login` is a 404** — proves the group name is not in the URL
3. `/about` and `/pricing` render

---

## Done when

- Every route above resolves in the browser
- `/dashboard/utils` 404s
- Bare `/docs` renders rather than 404ing
- No route group name (`(auth)`, `(marketing)`, `(shop)`) appears in any URL
- `npm run build` lists every route in its table

```bash
cd C:\Hello\My_Projects\JS-Practise\04-NextJs\practise-app && npm run build
```

---

## Recall questions

Closed book — write the answers before checking.

1. Name at least five reserved file names in the App Router and what each does.
2. What exactly makes a folder become a routable URL segment?
3. Write the `params` type for `[id]`, `[...slug]`, and `[[...slug]]`.
4. Does `/docs` match `[...slug]`? Does it match `[[...slug]]`?
5. Why did Next.js make `params` async in v15? What does that enable?
6. Name two distinct problems route groups solve. One is organisational — what's the
   other?

---

## Not yet

No layouts beyond root (Phase 2). No data fetching (Phase 3). No
`generateStaticParams` (Phase 5). Pages render placeholder content only.
