# Phase 10 — Server Actions

Concept folder: **09-server-actions** · 7 problems

## Read first

- `NextJs-Vault/09-server-actions/Server Actions Fundamentals.md`
- `NextJs-Vault/09-server-actions/Forms and useActionState.md`
- `NextJs-Vault/09-server-actions/Revalidation after Mutation.md`

## What you're building

The admin CRUD area. First writes to `db.ts` — you'll need `createProduct`,
`updateProduct`, `deleteProduct`.

**On the login action (Problem 5):** you build the *mechanism* here — form, action,
set a cookie. Phase 12 turns it into a verified session with role checks. That
second pass is where the security thinking lives, so don't try to do it all now.

---

## Problem 1 — Create user action

**Files:** `app/actions/users.ts`, plus a form

- `"use server"` at the top of the actions file
- The action receives `FormData`
- `<form action={createUser}>` — no `onSubmit`, no `fetch`
- Must be `async`

**Verify:** **disable JavaScript** in devtools and submit. It still works.

That's the whole point. Compare with the Phase 4 contact form, which is dead without
JS.

---

## Problem 2 — Update profile action

**File:** `app/actions/profile.ts`, used from `app/dashboard/settings/profile/page.tsx`

Return validation errors to the form.

- `useActionState` (React 19) on the client — this was `useFormState` in React 18,
  and old tutorials use the old name
- Action signature becomes `(prevState, formData)`
- Return `{ errors?, values?, message? }` rather than throwing
- Use `defaultValue` on inputs, not `value` — keeps them uncontrolled and JS-free

**Verify:** invalid data shows field errors **and preserves what was typed**.

---

## Problem 3 — Create product action

**Files:** `app/actions/products.ts`, `app/admin/products/new/page.tsx`

- `revalidatePath("/admin/products")` after a successful insert
- Then `redirect("/admin/products")`
- **Order matters** — revalidate before redirect. Comment why.

**Verify:** after creating, the list shows the new product immediately.

Then deliberately wrap the whole thing in a `try/catch` including the `redirect`.
Watch it break. Understand why before fixing it.

---

## Problem 4 — Delete product action

**Files:** `app/actions/products.ts`, a delete button component

- Bind the id with `.bind(null, id)` or a hidden input
- `useFormStatus` in a **child** component for the pending state
- Revalidate afterwards

Try putting `useFormStatus` in the component that renders the `<form>` first. It
won't work. That's not a style rule — understand the reason.

**Verify:** the button shows "Deleting..." while in flight.

---

## Problem 5 — Login form action (mechanism only)

**Files:** `app/actions/auth.ts`, `app/(auth)/login/page.tsx`

- `cookies()` is **async** in Next 15+ — await it
- Set `httpOnly`, `secure`, `sameSite` — comment what each defends against
- Return an error message for bad credentials; don't throw
- Redirect on success
- Match against the seeded users from `data/users.json`

**Verify:** the cookie appears in devtools and is **not** readable from
`document.cookie`.

Phase 12 replaces the naive cookie value with a real verified session.

---

## Problem 6 — Validated form submission

**File:** `app/actions/contact.ts`

Full validation: required fields, email format, max lengths.

- Validate on the **server** — client validation is UX, not security
- Structured errors keyed by field name
- Preserve submitted values
- Add matching client-side validation for fast feedback

**Verify:** bypass the client validation via devtools and confirm the server still
rejects it.

---

## Problem 7 — Mutation with revalidation

**File:** `app/actions/products.ts`

Two invalidation strategies, compared.

- **Version A:** `revalidatePath("/admin/products")`
- **Version B:** `revalidateTag("products")` — requires tagged fetches, so this one
  properly lands in Phase 11. Write it and note what's missing.
- Add an optimistic update with `useOptimistic`

**Verify:** the list updates instantly (optimistic), then reconciles.

---

## Done when

- A form submits with JavaScript disabled
- Validation errors return without losing typed input
- The pending state works via `useFormStatus`
- You've seen `redirect()` break inside a `try/catch`
- Server-side validation rejects a client-bypassed submission
- `data/*.json` actually changes on disk after a mutation

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

## Not yet

No real session verification (Phase 12). No tagged fetches (Phase 11) — Version B of
Problem 7 is incomplete by design.
