/**
 * 07-unions-intersections — Problem 5: Build discriminated API results
 *
 * Define `ApiResult<T>` as `{ ok: true; value: T } | { ok: false; error:
 * string }`. Write `unwrap<T>(result): T` that returns the value or throws.
 *
 * Must compile:
 * - unwrap<number>({ ok: true, value: 42 })
 *
 * Must be rejected:
 * - unwrap<number>({ ok: true, error: "bad" })
 *
 * Answer without looking once done: this discriminates on a boolean rather
 * than a string literal. Does narrowing still work? Why?
 *
 * Theory: TS-Vault/07-unions-intersections/Discriminated Unions.md
 */

// your code here

export {};
