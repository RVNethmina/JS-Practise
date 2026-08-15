/**
 * 11-advanced-types — Problem 5: Transform API object types
 *
 * Define `ApiShape` (id: number, name: string, active: boolean). Write a
 * mapped type `Stringified<T>` that turns EVERY property's value type into
 * `string`, keeping the same keys.
 *
 * Must compile:
 * - an object where every field is a string
 *
 * Must be rejected:
 * - an object where `id` is still a number
 *
 * Answer without looking once done: this maps over keys but ignores the
 * original value type entirely. How would you write one that only stringifies
 * the NUMBER fields and leaves the rest alone?
 *
 * Theory: TS-Vault/11-advanced-types/Mapped Types.md
 */

// your code here

export {};
