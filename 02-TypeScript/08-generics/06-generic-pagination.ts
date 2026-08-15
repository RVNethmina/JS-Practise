/**
 * 08-generics — Problem 6: Generic pagination
 *
 * Define `Page<T> = { items: T[]; page: number; totalPages: number }` and
 * `createPage<T>(items, page, pageSize, total): Page<T>`.
 *
 * Must compile:
 * - createPage(["a", "b"], 1, 2, 10) assigned to Page<string>
 *
 * Must be rejected:
 * - a Page<string> literal whose items are numbers
 *
 * Answer without looking once done: `T` appears only inside `items: T[]`.
 * How does TypeScript infer `T` from the `items` argument alone?
 *
 * Theory: TS-Vault/08-generics/Generic Types and Interfaces.md
 */

// your code here

export {};
