/**
 * 08-generics — Problem 7: Generic merge utility
 *
 * Write `merge<A extends object, B extends object>(a: A, b: B): A & B` using
 * spread. Merge `{ id: 1 }` with `{ name: "Ravindu" }` and read both fields
 * off the result.
 *
 * Must compile:
 * - const id: number = merged.id
 * - const name: string = merged.name
 *
 * Must be rejected:
 * - const badName: number = merged.name
 *
 * Answer without looking once done: the return type is `A & B`. If both
 * objects had a `id` property with different types, what would the merged
 * type of `id` be?
 *
 * Theory: TS-Vault/08-generics/Generic Constraints.md
 */

// your code here

export {};
