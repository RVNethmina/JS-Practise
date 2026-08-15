# Phase 14 — TypeScript Hardening Pass

Concept folder: **15-typescript-nextjs** · 7 problems

The final phase. You're not building new features — you're going back through the
whole app and typing it properly.

This is the highest-value phase in the plan, because it hits **both** of your gap
tracks at once.

## Read first

- `NextJs-Vault/15-typescript-nextjs/Typing Route Params.md`
- `NextJs-Vault/15-typescript-nextjs/Typing Handlers and Actions.md`
- `NextJs-Vault/03-server-components/The Server-Client Boundary.md` (for Problem 5)

## Before you start

Find every `any` and every `as` in the app:

```bash
cd practice-app && npx tsc --noEmit
grep -rn ": any\|as string\|as number\|as Product" app lib --include=*.ts --include=*.tsx
```

Write down the count. The phase is done when it's zero, or every remaining one has a
comment justifying it.

---

## Problem 1 — Type dynamic route params

**Files:** every `app/**/[*]/page.tsx`

Write all three shapes by hand, no `any`:

```
[id]        -> { params: Promise<{ id: string }> }
[...slug]   -> { params: Promise<{ slug: string[] }> }
[[...slug]] -> { params: Promise<{ slug?: string[] }> }
```

Apply consistently across every dynamic route you've built.

**Verify:** typing `params` as a plain object and reading `.id` off it is a compile
error.

---

## Problem 2 — Type API responses

**Files:** `app/api/**/route.ts`

- An `ApiResponse<T>` discriminated union: success and error variants
- Handler return type `Promise<Response>`
- Note that `Response.json()` does **not** carry the body type — comment why, and
  show how `NextResponse.json<T>()` differs

**Verify:** returning a body shape not matching your union is rejected.

Then, in a client component, `fetch` one of your own endpoints and observe that
`res.json()` gives you `any`. Close that gap — Problem 2's recall question asks how.

---

## Problem 3 — Type form actions

**Files:** `app/actions/*.ts`

- `FormState = { errors?: Record<string, string[]>; values?: Record<string, string>; message?: string }`
- Signature: `(prevState: FormState, formData: FormData) => Promise<FormState>`
- `formData.get()` returns `FormDataEntryValue | null` — **narrow it, don't cast**

**Verify:** passing `formData.get("email")` straight into a `string` parameter is a
compile error.

Find every `as string` on a `formData.get()` call in your codebase and replace it
with a narrowing check.

---

## Problem 4 — Type Server Component props

**Files:** async page and layout components

- Async components return `Promise<React.ReactNode>` — annotating as `JSX.Element` is
  an error
- `children` is `React.ReactNode`, not `JSX.Element`
- Write one generic Server Component taking a typed data array

**Verify:** annotating an async component as returning `JSX.Element` directly fails.

---

## Problem 5 — Type Client Component props

**Files:** every `"use client"` component receiving server data

- Props must be **serializable** — type them so non-serializable values are
  impossible
- Include an event handler prop defined client-side
- Type a Server Action passed as a prop — that one **is** allowed

**Verify:** a prop typed as `Date` or a plain callback from a Server Component is
rejected.

---

## Problem 6 — Type query parameters

**File:** `lib/params.ts`, applied everywhere `searchParams` is read

Extract the helpers you've been rewriting:

- `searchParams: Promise<{ [key: string]: string | string[] | undefined }>`
- `single(v)` — narrow to one string
- `toInt(v, fallback, max)` — parse with default and bounds
- Handle the repeated-param case

Then replace every ad-hoc `searchParams` parse in the app with these.

**Verify:** using a `searchParams` value directly as a `string` is a compile error.

---

## Problem 7 — Type the authentication session

**File:** `lib/session.ts`

- `Session` with `role` as a **literal union**, not `string`
- `getSession(): Promise<Session | null>` — null is a normal outcome
- `requireSession(): Promise<Session>` — redirects instead of returning null
- A **type guard** validating a decoded token really is a `Session`

**Verify:** using `getSession()`'s result without a null check is a compile error.

---

## Done when

- `npx tsc --noEmit` is clean
- Zero unjustified `any` or `as` in `app/` and `lib/`
- Every dynamic route's params are explicitly typed
- `lib/params.ts` is used everywhere instead of inline parsing
- `npm run build` succeeds

## Recall questions

1. Why is a route param typed `string` rather than `number`, even for `/products/42`?
2. Even with a typed handler, the client gets `any` from `res.json()`. How do you
   close that gap across the network? Three approaches.
3. What exactly is `FormDataEntryValue`, and why isn't it just `string`?
4. React's types historically didn't allow async components. What changed, and what
   error did people hit?
5. Dates, Maps, and functions can't cross the server/client boundary — but Server
   Actions can. What makes them special?
6. Why is the `searchParams` value type a union including an array? What produces the
   array case?
7. Why two session functions instead of one? What does the difference in return type
   buy each caller?

## After this phase

The app is done. Go to `04-NextJs/16-nextjs-interview/` — the closed-book assessment
folder, still empty by design. Rebuild selected pieces from scratch with the docs and
this app closed.

That folder is the real test. Everything up to here was practice with a safety net.
