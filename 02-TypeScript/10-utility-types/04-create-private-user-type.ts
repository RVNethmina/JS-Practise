/**
 * 10-utility-types — Problem 4: Create private user type
 *
 * From the same `FullUser`, derive
 * `PrivateFields = Pick<FullUser, "passwordHash" | "email">`.
 *
 * Must compile:
 * - an object with exactly those two fields
 *
 * Must be rejected:
 * - an object missing `email`
 *
 * Answer without looking once done: Pick and Omit are complements. When is
 * Pick the better choice, and when is Omit — think about what happens when
 * someone later adds a new field to FullUser.
 *
 * Theory: TS-Vault/10-utility-types/Pick and Omit.md
 */

// your code here

export {};
