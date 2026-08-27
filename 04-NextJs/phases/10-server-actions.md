# Phase 10 — Server Actions

**7 problems** · Vault folder: `09-server-actions`

## Read first

- `NextJs-Vault/09-server-actions/Server Actions Fundamentals.md`
- `NextJs-Vault/09-server-actions/Forms and useActionState.md`
- `NextJs-Vault/09-server-actions/Revalidation after Mutation.md`

## The one idea

A **Server Action** is an async function that runs on the server but is called
straight from a form — **no API endpoint, no `fetch`, no `onSubmit`**.

```ts
"use server";

export async function createUser(formData: FormData) {
  // runs on the server
}
```

```tsx
<form action={createUser}>
```

Note `action=`, **not** `onSubmit=`.

**The killer feature: this works with JavaScript disabled.** Next generates a real
HTML form pointing at a real endpoint. That's **progressive enhancement**, and it's
why Problem 1 makes you turn JS off. Your Phase 4 contact form is completely dead
without JS; this one isn't.

## Three hooks, three different packages — get these right

| Hook | Import from | Used for |
|---|---|---|
| `useActionState` | **`react`** | form state + errors (P2) |
| `useFormStatus` | **`react-dom`** | pending state (P4) |
| `useOptimistic` | **`react`** | instant UI (P7) |

> [!warning] React 18 tutorials will mislead you
> `useActionState` was called **`useFormState`** and lived in `react-dom`. It moved
> and was renamed in React 19. This app runs React 19.2.8, so use the names above.

## Before you start — two blockers

**1. Flip the admin gate.** `app/admin/layout.tsx` has:

```ts
const role: Role = "viewer";   // ← redirects you to /login
```

Every admin route in this phase is unreachable until you set it to `"admin"`. Phase 12
replaces this with a real session.

**2. You need `createProduct`.** Phase 8 Problem 0 added `writeJson`,
`updateProduct` and `deleteProduct`. This phase needs one more:

```ts
export async function createProduct(
  input: Omit<Product, "id" | "createdAt" | "variants">
): Promise<Product>
```

Generate `id` as `p-{n+1}`, set `createdAt` to now, default `variants` to `[]`, append,
`writeJson`, return the new product.

> If you haven't done Phase 8 yet, do its Problem 0 first — nothing here works without
> `writeJson`.

## What you'll have built by the end

```
lib/db.ts                                   <- createProduct
lib/form.ts                                 <- shared FormState type
app/actions/users.ts                        <- P1
app/actions/profile.ts                      <- P2
app/actions/products.ts                     <- P3, P4, P7
app/actions/auth.ts                         <- P5
app/actions/contact.ts                      <- P6
app/admin/users/new/page.tsx                <- P1
app/dashboard/settings/profile/page.tsx     <- P2  replace the stub
app/admin/products/page.tsx                 <- P3  the list
app/admin/products/new/page.tsx             <- P3  the form
app/admin/products/_components/DeleteButton.tsx   <- P4  client
app/admin/products/_components/SubmitButton.tsx   <- P4  client
app/(auth)/login/page.tsx                   <- P5  replace the stub
```

## On the login action (Problem 5)

You build the **mechanism** here: form → action → set a cookie. **Phase 12** turns it
into a verified session with role checks. That second pass is where the security
thinking lives, so don't try to do it all now.

---

## Problem 1 — Create user, working without JavaScript

**Goal:** a form that submits **with JavaScript disabled**.

**Files:** `app/actions/users.ts` *(new)*, `app/admin/users/new/page.tsx` *(new)*

### 1a. The action

1. `"use server";` as the **first line of the file** — not inside the function
2. `export async function createUserAction(formData: FormData)`
3. Read fields with `formData.get("username")` etc.
4. **Narrow, don't cast:**
   ```ts
   const raw = formData.get("username");
   if (typeof raw !== "string" || !raw.trim()) { /* handle */ }
   ```
5. Call `createUser(...)` from Phase 8
6. `redirect("/admin/users")` afterwards — create that list page too, or redirect to
   `/users`

### 1b. The form page

A Server Component. `<form action={createUserAction}>` with four inputs carrying
`name="username"`, `name="name"`, `name="email"`, `name="role"` (a `<select>`).

### What you need to know

- **The `name` attribute is how data reaches the action.** No `name`, no data. That's
  plain HTML form behaviour, not a React thing.
- The action **must** be `async`, even if it never awaits.
- **Never `as string`** on `formData.get()`. It returns `FormDataEntryValue | null`,
  where `FormDataEntryValue` is `string | File`. A file upload field really does give
  you a `File`, and `as string` just stops TypeScript warning you before it crashes.

### Test

Fill it in and submit — a user appears in `data/users.json`.

Then **devtools → Ctrl+Shift+P → "Disable JavaScript"**, reload, and submit again.

**It still works.** That's the whole problem. Compare with `/contact` from Phase 4,
which does nothing at all with JS off.

---

## Problem 2 — Validation errors that keep what you typed

**Goal:** invalid input shows per-field errors **and preserves the input**.

**Files:** `lib/form.ts` *(new)*, `app/actions/profile.ts` *(new)*,
`app/dashboard/settings/profile/page.tsx` *(replace the stub)*

### 2a. One shared shape — `lib/form.ts`

```ts
export type FormState = {
  errors?: Record<string, string[]>;
  values?: Record<string, string>;
  message?: string;
};

export const emptyFormState: FormState = {};
```

### 2b. The action — note the **two** parameters

```ts
"use server";
export async function updateProfileAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState>
```

- Validate `name` (non-empty) and `email` (contains `@`)
- On failure **return** `{ errors, values }` — do **not** throw
- On success return `{ message: "Saved" }`
- There's no session yet, so hardcode which user you're editing: `"u-1"`

### 2c. The page — a Client Component

```tsx
"use client";
import { useActionState } from "react";

const [state, formAction] = useActionState(updateProfileAction, emptyFormState);
```

- `<form action={formAction}>`
- Render `state.errors?.name` beside each field
- **`defaultValue={state.values?.name ?? ""}`** — not `value`

### Why `defaultValue`, not `value`

`value` makes the input **controlled**, which needs JavaScript. `defaultValue` keeps it
uncontrolled, so the form still works with JS off — consistent with Problem 1.

**Returning `values` is what preserves the input.** Without it, a validation failure
wipes the form and the user retypes everything.

### Why return instead of throw

A throw triggers your `error.tsx` boundary, which is for *unexpected* failures. A bad
email is entirely expected and belongs in the form's own UI.

### Test

Submit an invalid email. You see the field error **and the boxes still contain what you
typed**.

---

## Problem 3 — Revalidate, then redirect (order matters)

**Goal:** after creating, the list shows the new product immediately.

**Files:** `app/actions/products.ts` *(new)*, `app/admin/products/page.tsx` *(new)*,
`app/admin/products/new/page.tsx` *(new)*

### Build

1. `app/admin/products/page.tsx` — a Server Component listing all products from
   `getProducts({ pageSize: 50 })`, with a link to `new`
2. `createProductAction(formData)` in `app/actions/products.ts`
3. Validate, then `await createProduct(...)`
4. `revalidatePath("/admin/products")` — import from `next/cache`
5. **Then** `redirect("/admin/products")` — import from `next/navigation`
6. **Comment why that order matters**

### 3b. Then break it on purpose

Wrap the whole body — **including the `redirect`** — in a `try/catch`. Run it. Watch
the navigation silently not happen, and your catch block treat success as an error.

### Why the order matters

`redirect()` **throws** internally — that's how it stops execution. Put
`revalidatePath` after it and it never runs, so the user lands on a page showing stale
data.

### Why the try/catch breaks it

Since `redirect()` works by throwing, a `try/catch` around it **catches the redirect**
and swallows it. The fix is to keep `redirect()` **outside** the try, after it.

This trips up a lot of people. Seeing it once is worth more than reading it.

### Test

Create a product → you land on the list → the new product is **already there**.
`data/products.json` has 21 entries.

---

## Problem 4 — Delete, with a pending state

**Goal:** the delete button says "Deleting…" while in flight.

**Files:** `app/actions/products.ts` *(edit)*,
`app/admin/products/_components/DeleteButton.tsx` *(new)*,
`app/admin/products/_components/SubmitButton.tsx` *(new)*

### Build

1. `deleteProductAction(id: string)` — call `deleteProduct(id)`, then
   `revalidatePath("/admin/products")`
2. In the list, bind the id per row:
   ```tsx
   <form action={deleteProductAction.bind(null, product.id)}>
     <SubmitButton label="Delete" pendingLabel="Deleting…" />
   </form>
   ```
3. `SubmitButton.tsx` — `"use client"`, calls `useFormStatus()` from **`react-dom`**,
   uses `pending` for the label and `disabled`
4. **First, deliberately** put `useFormStatus()` in the component that renders the
   `<form>` instead. It won't work.

### Why step 4 fails — not a style rule

`useFormStatus` reads a context that the `<form>` **provides**. A component can't read
a context its own output creates — at the moment it runs, the form doesn't exist yet.

The hook must be called by a component rendered **inside** the form, below the provider.

### About `.bind(null, id)`

Creates a new function with the first argument pre-filled. It's how you pass an id to
an action without a hidden input. The `null` is the `this` value, which actions ignore.

### Test

Click Delete — the button reads "Deleting…" and is disabled, then the row disappears.

---

## Problem 5 — Login mechanism (cookie only)

**Goal:** logging in sets an `httpOnly` cookie that JavaScript cannot read.

**Files:** `app/actions/auth.ts` *(new)*, `app/(auth)/login/page.tsx` *(replace stub)*

### Build

1. Read `email` and `password` from `FormData`, narrowing both
2. `await getUserByEmail(email)`
3. Compare the password against the seeded user
   *(passwords are plain text in the seed — Phase 12 discusses why that's unacceptable
   in production)*
4. `const cookieStore = await cookies();` — **async in Next 15+**
5. `cookieStore.set("session", user.id, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 })`
6. **Comment what each flag defends against**
7. Bad credentials → **return** an error message via `useActionState`, don't throw
8. Success → `redirect("/dashboard")`
9. In the browser console, type `document.cookie`

### The flags

| Flag | Defends against |
|---|---|
| `httpOnly` | **XSS** — injected JS can't read the cookie |
| `secure` | **network sniffing** — HTTPS only |
| `sameSite` | **CSRF** — not sent on cross-site requests |
| `maxAge` | **indefinite sessions** — a stolen cookie expires |

`secure: true` in development would break login, because `localhost` is HTTP. Hence the
environment check.

### Test

The cookie appears in devtools → Application → Cookies, and **`document.cookie` does
not show it.** That's `httpOnly` working.

---

## Problem 6 — Server validation you can't bypass

**Goal:** stripping the client validation still gets rejected.

**File:** `app/actions/contact.ts` *(new)*, wired into the Phase 4 contact form

### Build

1. Server-side: required fields, email format, `message` max 1000 chars
2. Return structured errors keyed by field, same `FormState` shape as Problem 2
3. Preserve submitted values
4. Keep the existing client-side validation for fast feedback
5. **Then bypass it:** in devtools, delete the `required` attributes and any maxlength,
   and submit garbage

### Why

**Client-side validation is UX, not security.** It gives instant feedback without a
round trip. It stops nothing.

An attacker doesn't use your form at all — they `curl` the endpoint. Server Actions
compile to real HTTP endpoints, so yours is reachable without ever loading your page.

**Every validation must exist on the server. The client copy is a convenience.**

### Test

With client validation stripped in devtools, the server **still rejects** it.

---

## Problem 7 — Optimistic update

**Goal:** the list changes instantly, then reconciles with the server.

**File:** `app/actions/products.ts` *(edit)*, plus a client list component

### Build

1. **Version A:** confirm `revalidatePath("/admin/products")` from Problem 3 works
2. **Version B:** write `revalidateTag("products", "max")` — then note what's missing
3. Add `useOptimistic` from **`react`** so a deleted row vanishes before the server
   confirms
4. Confirm it rolls back if the action fails

### Version B is deliberately incomplete

`revalidateTag` only affects fetches that were **tagged**, and you have no tagged
fetches yet — that's Phase 11 Problem 3. Write the call, comment what it needs, move on.

| Call | Invalidates |
|---|---|
| `revalidatePath("/admin/products")` | that one URL — you must know every affected URL |
| `revalidateTag("products", "max")` | everything tagged `products`, wherever it lives |

> [!warning] `revalidateTag` needs **two** arguments in Next 16
> The single-argument form you'll see everywhere online is deprecated, and TypeScript
> rejects it: `TS2554: Expected 2 arguments, but got 1`.
>
> Next 16 also adds **`updateTag(tag)`** — Server Actions only — which expires
> immediately instead of serving stale. After a user's own save, that's usually the
> one you want. Phase 11 Problem 3 measures the difference.

`useOptimistic` shows the change before the server confirms. If the action throws,
React rolls it back automatically.

### Test

Delete a row — it disappears **instantly**, before the 300ms round trip finishes.

---

## Done when

- A form submits **with JavaScript disabled**
- Validation errors return **without losing typed input**
- The pending state works via `useFormStatus` in a **child** component
- You've seen `redirect()` break inside a `try/catch`
- Server validation rejects a client-bypassed submission
- **`data/*.json` visibly changed on disk** after your mutations
- `npm run build` passes

---

## Recall questions

1. What is progressive enhancement, and why can a Server Action form work without JS
   when a `useState` form cannot?
2. Why return errors instead of throwing? What would throwing trigger?
3. `redirect()` throws. What does that mean for code after it, and for wrapping it in
   `try/catch`?
4. Why must the `useFormStatus` component be a **child** of the form?
5. Why is client-side validation never sufficient? Describe exactly how it's bypassed.
6. A Server Action compiles to a public HTTP endpoint. What follows for authorization?
7. `revalidateTag` vs `revalidatePath` — when does each win?
8. Which package does each of the three hooks come from, and which one was renamed?

---

## Not yet

No real session verification (Phase 12) — the login cookie is just a user id, and
anyone could forge it. No tagged fetches (Phase 11), so **Version B of Problem 7 is
incomplete by design**.
