# Phase 10 — Server Actions

**7 problems** · Vault folder: `09-server-actions`

## Read first

- `NextJs-Vault/09-server-actions/Server Actions Fundamentals.md`
- `NextJs-Vault/09-server-actions/Forms and useActionState.md`
- `NextJs-Vault/09-server-actions/Revalidation after Mutation.md`

## The one idea in this phase

A **Server Action** is an async function that runs on the server but can be called
directly from a form — **no API endpoint, no `fetch`, no `onSubmit`**.

```
"use server";

export async function createUser(formData: FormData) {
  // runs on the server
}
```

Then in JSX:

```
<form action={createUser}>
```

Note: `action=`, **not** `onSubmit=`.

**The killer feature: this works with JavaScript disabled.** Next generates a real
HTML form pointing at a real endpoint. That's **progressive enhancement**, and it's
why Problem 1 makes you turn JS off. Your Phase 4 contact form is completely dead
without JS; this one isn't.

## Add these to `lib/db.ts` first

You need write functions for the first time:

```
createProduct(data)   updateProduct(id, data)   deleteProduct(id)
```

They should actually write to `data/products.json` — you want to see the file change
on disk.

## On the login action (Problem 5)

You build the **mechanism** here: form → action → set a cookie. **Phase 12** turns it
into a verified session with role checks. That second pass is where the security
thinking lives, so don't try to do it all now.

---

## Problem 1 — Create user action

**Goal:** a form that submits **with JavaScript disabled**.

**Files:** `app/actions/users.ts`, plus a form page

### Steps

1. Create `app/actions/users.ts` with `"use server"` as the **first line of the file**
2. Export an `async function` taking `formData: FormData`
3. Read fields with `formData.get("name")`
4. **Narrow the result** — `formData.get()` returns `FormDataEntryValue | null`, not
   `string`
5. Validate, then write via `db`
6. In the page, `<form action={createUser}>` with `name` attributes on every input
7. **Open devtools → Settings → Debugger → Disable JavaScript. Submit again.**

### What you need to know

- **The `name` attribute is how data reaches the action.** No `name`, no data. This is
  plain HTML form behaviour.
- The action **must** be `async`, even if it doesn't await anything.
- **Do not `as string`** the result of `formData.get()`. Check it:
  ```
  const raw = formData.get("name");
  if (typeof raw !== "string") return { error: "..." };
  ```
  `as string` lies to the compiler and crashes at runtime on a file upload field.

### Verify

**With JavaScript disabled, the form still works.** That's the whole point of the
problem. Compare with your Phase 4 contact form, which does nothing at all.

---

## Problem 2 — Update profile with validation errors

**Goal:** invalid input shows per-field errors **and keeps what the user typed**.

**Files:** `app/actions/profile.ts`, `app/dashboard/settings/profile/page.tsx`

### Steps

1. The action signature becomes `(prevState, formData)` — **two** arguments
2. Return an object rather than throwing:
   `{ errors?: Record<string, string[]>, values?: Record<string, string>, message?: string }`
3. On the client, `useActionState` from **`react`**
4. It returns `[state, formAction, isPending]` — put `formAction` in `action={}`
5. Render `state.errors` beside the matching fields
6. Use **`defaultValue`**, not `value`, on the inputs

### What you need to know

- **`useActionState` was called `useFormState` in React 18** and lived in
  `react-dom`. It's now `useActionState` from `react`. Older tutorials use the old
  name and import path — that's the single most common breakage here.
- `prevState` is whatever the action returned last time. First render gets the initial
  value you passed.
- **Why `defaultValue` and not `value`:** `value` makes the input controlled, which
  requires JavaScript. `defaultValue` keeps it uncontrolled, so the form still works
  with JS off — consistent with Problem 1.

**Returning `values` is what preserves the typed input.** Without it, a validation
failure wipes the form and the user retypes everything. That's the difference between
a form people tolerate and one they abandon.

### Verify

Invalid data shows field errors **and the inputs still contain what was typed**.

---

## Problem 3 — Create product, revalidate, redirect

**Goal:** after creating, the list shows the new product immediately.

**Files:** `app/actions/products.ts`, `app/admin/products/new/page.tsx`

### Steps

1. Write the create action with validation
2. After a successful insert, call `revalidatePath("/admin/products")`
3. **Then** call `redirect("/admin/products")`
4. **Order matters — revalidate before redirect. Comment why.**
5. **Then break it deliberately:** wrap the whole body, including the `redirect`, in a
   `try/catch`. Run it. Watch it break.

### What you need to know

**Why revalidate first:** `redirect()` **throws** internally — that's how it stops
execution. Anything after it never runs. Put `revalidatePath` second and it never
fires, so the user lands on a page showing stale data.

**Why step 5 breaks:** since `redirect()` works by throwing, a `try/catch` around it
**catches the redirect** and swallows it. The navigation silently never happens, and
your catch block treats a successful redirect as an error.

The fix: keep `redirect()` **outside** the try/catch, after it.

This trips up a lot of people. Seeing it once is worth more than reading it.

### Verify

1. After creating, the list shows the new product immediately
2. `data/products.json` actually changed on disk
3. You saw the try/catch version break and know why

---

## Problem 4 — Delete with a pending state

**Goal:** the delete button says "Deleting…" while it's in flight.

**Files:** `app/actions/products.ts`, a delete button component

### Steps

1. Bind the id: `deleteProduct.bind(null, product.id)` — or a hidden input
2. Create a **separate** submit-button component with `"use client"`
3. In it, call `useFormStatus` from `react-dom` and use `pending` to set the label and
   disable
4. Render that button **inside** the `<form>`
5. Revalidate after deleting
6. **First, try putting `useFormStatus` in the component that renders the `<form>`.**
   It won't work.

### What you need to know

**Why step 6 fails — this is not a style rule.** `useFormStatus` reads from a React
context that the `<form>` **provides**. A component can't read a context its own
output creates — at the moment it runs, the form doesn't exist yet.

The hook must be called by a component **rendered inside** the form, so it's below the
provider in the tree.

`.bind(null, id)` creates a new function with the first argument pre-filled. It's how
you pass an id to an action without a hidden input.

### Verify

The button shows "Deleting…" and is disabled while in flight.

---

## Problem 5 — Login form action (mechanism only)

**Goal:** logging in sets an httpOnly cookie that JavaScript cannot read.

**Files:** `app/actions/auth.ts`, `app/(auth)/login/page.tsx`

### Steps

1. Read email and password from `FormData`, narrowing both
2. `await getUserByEmail(email)`
3. Compare the password against the seeded user
4. `const cookieStore = await cookies()` — **async in Next 15+**
5. `cookieStore.set(...)` with `httpOnly: true`, `secure` in production,
   `sameSite: "lax"`, an explicit `maxAge`
6. **Comment what each flag defends against**
7. Bad credentials → **return** an error message, don't throw
8. Success → `redirect()`
9. In the browser console, type `document.cookie`

### What you need to know

| Flag | Defends against |
|---|---|
| `httpOnly` | **XSS** — injected JS cannot read the cookie |
| `secure` | **network sniffing** — HTTPS only |
| `sameSite` | **CSRF** — not sent on cross-site requests |
| `maxAge` | **indefinite sessions** — a stolen cookie expires |

**Why return rather than throw:** a throw triggers your `error.tsx` boundary, which is
for *unexpected* failures. A wrong password is an entirely expected outcome and
belongs in the form's own UI.

### Verify

The cookie is in devtools → Application → Cookies, and **`document.cookie` does not
show it**. That's `httpOnly` working.

**Phase 12 replaces the naive cookie value with a real verified session.**

---

## Problem 6 — Server-side validation that can't be bypassed

**Goal:** bypassing the client validation still gets rejected.

**File:** `app/actions/contact.ts`

### Steps

1. Validate on the **server**: required fields, email format, max lengths
2. Return structured errors keyed by field name
3. Preserve submitted values
4. **Also** add matching client-side validation for fast feedback
5. **Then bypass it:** in devtools, remove the `required` attributes and any maxlength,
   and submit garbage

### What you need to know

**Client-side validation is UX, not security.** It exists to give instant feedback
without a round trip. It stops **nothing**.

An attacker doesn't use your form at all — they `curl` the endpoint directly. Server
Actions compile to real HTTP endpoints, so yours is reachable without ever loading
your page.

**Every validation must exist on the server. The client copy is a convenience.**

### Verify

With the client validation stripped in devtools, the server **still rejects** the
submission.

---

## Problem 7 — Mutation with revalidation, two strategies

**Goal:** compare path-based and tag-based invalidation, plus an optimistic update.

**File:** `app/actions/products.ts`

### Steps

1. **Version A:** `revalidatePath("/admin/products")`
2. **Version B:** `revalidateTag("products")` — write it, then note what's missing
3. Add `useOptimistic` on the client so the list updates instantly
4. Confirm it reconciles when the server responds

### What you need to know

**Version B is deliberately incomplete.** `revalidateTag` only works on fetches that
were **tagged**, and you have no tagged fetches yet — that's Phase 11 Problem 3. Write
the call, comment what it needs, move on.

The difference:
- **`revalidatePath`** — "this URL is stale". Simple, but you must know every affected
  URL.
- **`revalidateTag`** — "everything tagged `products` is stale". One call updates every
  page displaying products, wherever it lives.

`useOptimistic` shows the change **before** the server confirms. If the action fails,
React rolls it back automatically.

### Verify

The list updates instantly, then reconciles with the server result.

---

## Done when

- A form submits **with JavaScript disabled**
- Validation errors return **without losing typed input**
- The pending state works via `useFormStatus` in a child component
- You've seen `redirect()` break inside a `try/catch`
- Server-side validation rejects a client-bypassed submission
- **`data/*.json` actually changes on disk** after a mutation

---

## Recall questions

1. What is progressive enhancement, and why can a Server Action form work without JS
   when a `useState` form cannot?
2. Why return errors instead of throwing? What would throwing trigger?
3. `redirect()` throws. What does that mean for code after it, and for wrapping it in
   `try/catch`?
4. Why must the `useFormStatus` component be a **child** of the form?
5. Why is client-side validation never sufficient? Describe exactly how an attacker
   bypasses it.
6. A Server Action compiles to a public HTTP endpoint. What follows from that for
   authorization?
7. `revalidateTag` vs `revalidatePath` — when does each win?

---

## Not yet

No real session verification (Phase 12). No tagged fetches (Phase 11) — **Version B of
Problem 7 is incomplete by design.**
