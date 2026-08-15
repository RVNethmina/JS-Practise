/**
 * 02-types — Problem 6: Model nullable API values
 *
 * Define `ApiUser` with `email: string | null` and
 * `lastLoginAt: string | undefined`. Write `formatEmail(user): string`
 * that returns a fallback message when email is null.
 *
 * Then declare a standalone `let maybeEmail: string | null` and demonstrate
 * that assigning `undefined` to it is rejected.
 *
 * Must compile:
 * - formatEmail(user) for a user with email: null
 * - maybeEmail = "test@example.com"
 *
 * Must be rejected:
 * - maybeEmail = undefined
 *
 * Answer without looking once done: why are `null` and `undefined` not
 * interchangeable in TypeScript's type system, even though `==` treats them
 * as equal at runtime?
 *
 * Theory: TS-Vault/02-types/Nullable and Optional Properties.md
 */

// your code here

export {};
