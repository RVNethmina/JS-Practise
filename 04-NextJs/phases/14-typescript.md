# Phase 14 — TypeScript Hardening Pass

**7 problems** · Vault folder: `15-typescript-nextjs`

The final phase. **You're not building new features** — you're going back through the
whole app and typing it properly.

This is the highest-value phase in the plan, because it hits **both** of your gap
tracks at once: TypeScript and Next.js, in the same edit.

## Read first

- `NextJs-Vault/15-typescript-nextjs/Typing Route Params.md`
- `NextJs-Vault/15-typescript-nextjs/Typing Handlers and Actions.md`
- `NextJs-Vault/03-server-components/The Server-Client Boundary.md` (for Problem 5)

## Before you start — get your baseline number

```bash
cd C:\Hello\My_Projects\JS-Practise\04-NextJs\practise-app && npx tsc --noEmit
```

```bash
grep -rn ": any\|as string\|as number\|as Product" app lib --include=*.ts --include=*.tsx
```

**Write down the count.** The phase is done when it's zero — or when every survivor has
a comment justifying it.

## The rule for this phase

**`as` is not a fix. It's a silencer.**

```
const email = formData.get("email") as string;   ❌ lying to the compiler
```

That compiles. At runtime, if the field is a file upload, `email` is a `File` and
your next line crashes. The `as` didn't make it a string — it stopped TypeScript
telling you it might not be.

**Narrow instead of casting:**

```
const raw = formData.get("email");
if (typeof raw !== "string") return { error: "..." };
// TypeScript now KNOWS raw is a string — because you checked
```

---

## Problem 1 — Type dynamic route params

**Goal:** every dynamic route has an explicit, correct params type.

**Files:** every `app/**/[*]/page.tsx`

### Steps

1. Go through **every** dynamic route you've built
2. Apply the right shape:
   ```
   [id]        →  { params: Promise<{ id: string }> }
   [...slug]   →  { params: Promise<{ slug: string[] }> }
   [[...slug]] →  { params: Promise<{ slug?: string[] }> }
   ```
3. Remove any `any` you find in these props
4. **Then test it:** type `params` as a plain object (not a Promise) and read `.id`

### What you need to know

The three shapes differ in exactly the way the routes do:

- `[id]` — one segment, always present → `string`
- `[...slug]` — one or more → `string[]`, always defined
- `[[...slug]]` — **zero** or more → `string[] | undefined`, hence the `?`

That `?` is the type system encoding "bare `/docs` is a valid URL". Get it wrong and
you'll crash mapping over `undefined`.

### Verify

Typing `params` as a plain object and reading `.id` off it is a **compile error**.

---

## Problem 2 — Type API responses

**Goal:** a consistent, typed response shape across every endpoint.

**Files:** `app/api/**/route.ts`

### Steps

1. Define a discriminated union in a shared file:
   ```
   type ApiResponse<T> =
     | { success: true; data: T }
     | { success: false; error: string };
   ```
2. Use it for every endpoint's body
3. Type handlers as returning `Promise<Response>`
4. **Comment that `Response.json()` does not carry the body type**, and show how
   `NextResponse.json<T>()` differs
5. **Then find the hole:** in a Client Component, `fetch` one of your own endpoints and
   hover over `await res.json()`

### What you need to know

**A discriminated union** is two shapes sharing a literal field that tells them apart.
Once you check `if (result.success)`, TypeScript **narrows** to the matching branch —
so `.data` is only reachable on success and `.error` only on failure. You cannot read
the wrong one.

**Step 5 is the real lesson.** `res.json()` returns **`any`**, always. Your beautiful
server types stop at the network boundary — types are compile-time only, and nothing
about them survives being serialized to JSON and parsed back.

Three ways to close that gap (the recall question asks for them):
1. A runtime validator (Zod or similar) that parses **and** types
2. A hand-written type guard
3. A shared generated client where both sides derive from one schema

`as ApiResponse<Product>` is **not** one of them — it's the same lie as before.

### Verify

Returning a body shape not matching your union is rejected. You can state what
`res.json()` gives the client.

---

## Problem 3 — Type form actions

**Goal:** no `as string` anywhere near `FormData`.

**Files:** `app/actions/*.ts`

### Steps

1. Define the shared shape:
   ```
   type FormState = {
     errors?: Record<string, string[]>;
     values?: Record<string, string>;
     message?: string;
   };
   ```
2. Type actions as
   `(prevState: FormState, formData: FormData) => Promise<FormState>`
3. **Find every `as string` on a `formData.get()` call** and replace it with narrowing
4. Consider a small helper — `getString(formData, "email"): string | null`
5. **Then test it:** pass `formData.get("email")` straight into a `string` parameter

### What you need to know

`formData.get()` returns `FormDataEntryValue | null`, and `FormDataEntryValue` is
`string | File`.

**The `File` case is not theoretical.** Any `<input type="file">` produces one. So
does a crafted request — and Server Actions are public HTTP endpoints, so anyone can
send whatever they like.

`null` is the other case: the field simply wasn't submitted.

### Verify

Passing `formData.get("email")` into a `string` parameter is a **compile error**. Zero
`as string` on FormData in the codebase.

---

## Problem 4 — Type Server Component props

**Goal:** correct return types on async components.

**Files:** async page and layout components

### Steps

1. Let async components **infer** their return type — don't annotate `JSX.Element`
2. If you annotate at all, it's `Promise<React.ReactNode>`
3. Type `children` as `React.ReactNode`, never `JSX.Element`
4. Write **one** generic Server Component that takes a typed data array:
   ```
   function List<T>({ items, render }: { items: T[]; render: (item: T) => ReactNode })
   ```
5. **Then test it:** annotate an async component as returning `JSX.Element`

### What you need to know

An `async function` returns a **Promise**. So an async component returns
`Promise<ReactNode>`, not `ReactNode`. Annotating `JSX.Element` is simply wrong about
what the function returns.

React's types **historically didn't allow** async components at all — you'd get
"'Page' cannot be used as a JSX component". That was a types-lag problem, fixed in
React 19's types. If you hit it in an old project, that's the cause.

`React.ReactNode` covers elements, strings, numbers, arrays, null. `JSX.Element` covers
only a single element — so it **rejects a valid string child**.

### Verify

Annotating an async component as returning `JSX.Element` directly is an error.

---

## Problem 5 — Type Client Component props

**Goal:** make non-serializable props impossible to pass.

**Files:** every `"use client"` component receiving server data

### Steps

1. Go through each one and type its props explicitly
2. Make sure no prop type is `Date`, `Map`, `Set`, or a plain function
3. Add one **event handler** prop defined **client-side** — that's fine
4. Type a **Server Action** passed as a prop — that one **is** allowed
5. **Then test both directions:** try typing a prop as `Date`, and try passing a plain
   callback from a Server Component

### What you need to know

Props crossing the boundary are **serialized** — converted to JSON, sent over the wire,
rebuilt in the browser. What survives: strings, numbers, booleans, null, arrays, plain
objects, and Promises.

What doesn't: `Date`, `Map`, `Set`, class instances, and functions.

**Why Server Actions are the exception.** They aren't sent as code. Next replaces the
function with a **reference id**, and the client gets a stub that makes an HTTP request
back to the server when called. The function never crosses — only its address does.

This is why `lib/types.ts` deliberately keeps `createdAt` as a `string`.

### Verify

A prop typed `Date`, or a plain callback from a Server Component, is rejected.

---

## Problem 6 — Type query parameters, once

**Goal:** one helper module replacing every ad-hoc `searchParams` parse in the app.

**File:** `lib/params.ts`

### Steps

1. Define the type once:
   ```
   type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
   ```
2. Write `single(v)` — narrow `string | string[] | undefined` to one string
3. Write `toInt(v, fallback, max)` — parse with a default and bounds, handling `NaN`,
   negatives, and zero
4. Decide the repeated-param policy: first value, last value, or reject
5. **Then go replace every inline `searchParams` parse in the app** — Phase 5's
   category route, Phase 6's pagination, everywhere

### What you need to know

You have now written this parsing logic **at least four separate times**, slightly
differently each time. That's exactly the point of this problem — you feel the
duplication only after living with it.

The value is `string | string[] | undefined` because:
- `undefined` — the key wasn't there
- `string` — the normal case
- `string[]` — **the key appeared twice**: `?tab=a&tab=b`

That third case is why you can't just treat it as a string. Real users, crawlers, and
badly-built links all produce it.

### Verify

Using a `searchParams` value directly as a `string` is a compile error. Every call site
now goes through `lib/params.ts`.

---

## Problem 7 — Type the session

**Goal:** the null case is impossible to forget.

**File:** `lib/session.ts`

### Steps

1. Define `Session` with `role: Role` — the **literal union** from `lib/types.ts`,
   never `string`
2. `getSession(): Promise<Session | null>` — null is a **normal** outcome
3. `requireSession(): Promise<Session>` — redirects instead of returning null
4. Write a **type guard** validating that a decoded token really is a `Session`:
   ```
   function isSession(value: unknown): value is Session { ... }
   ```
5. **Then test it:** use `getSession()`'s result without a null check

### What you need to know

**Why two functions instead of one?** The return types do the work:

- `Promise<Session | null>` — the caller **must** handle null. Right for a public page
  where being logged out is normal.
- `Promise<Session>` — no null to handle. Right for a protected page, because if
  there's no session the function already redirected and this code never runs.

One function returning a nullable type would force pointless null checks on protected
pages. Two functions encode the intent in the type.

**Why the type guard matters.** A decoded token is `unknown` — it came from outside
your program, possibly forged. `value is Session` is a **type predicate**: TypeScript
trusts your check and narrows afterwards. That makes it the one place where getting the
logic right actually matters — so validate every field, don't just check for null.

Typing `role` as `string` would let `"admni"` compile and silently never match any
role check. The literal union catches it at build time.

### Verify

Using `getSession()`'s result without a null check is a compile error.

---

## Done when

```bash
npx tsc --noEmit          # clean
npm run build             # succeeds
```

- Zero unjustified `any` or `as` in `app/` and `lib/`
- Every dynamic route's params are explicitly typed
- `lib/params.ts` is used everywhere instead of inline parsing
- Your starting `grep` count is now zero

---

## Recall questions

1. Why is a route param typed `string` rather than `number`, even for `/products/42`?
2. Even with a typed handler, the client gets `any` from `res.json()`. How do you close
   that gap across the network? Three approaches.
3. What exactly is `FormDataEntryValue`, and why isn't it just `string`?
4. React's types historically didn't allow async components. What changed, and what
   error did people hit?
5. Dates, Maps, and functions can't cross the server/client boundary — but Server
   Actions can. What makes them special?
6. Why is the `searchParams` value type a union including an array? What produces the
   array case?
7. Why two session functions instead of one? What does the difference in return type
   buy each caller?

---

## After this phase

**The app is done.**

Go to `04-NextJs/16-nextjs-interview/` — the closed-book assessment folder, still empty
by design. Rebuild selected pieces **from scratch** with the docs and this app closed.

That folder is the real test. Everything up to here was practice with a safety net.
