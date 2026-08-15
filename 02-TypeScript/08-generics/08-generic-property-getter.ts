/**
 * 08-generics — Problem 8: Generic property getter
 *
 * Write `getProperty<T, K extends keyof T>(obj: T, key: K): T[K]`. Use it to
 * read `id` and `name` off a user object with correct return types.
 *
 * Must compile:
 * - const id: number = getProperty(user, "id")
 * - const name: string = getProperty(user, "name")
 *
 * Must be rejected:
 * - getProperty(user, "email")
 *
 * Answer without looking once done: this is THE classic generics interview
 * question. Explain what `K extends keyof T` and the return type `T[K]` are
 * each doing, and why the return type is precise rather than a union of all
 * property types.
 *
 * Theory: TS-Vault/08-generics/Generic Constraints.md
 *         TS-Vault/08-generics/keyof with Generics.md
 */

// your code here

export {};
