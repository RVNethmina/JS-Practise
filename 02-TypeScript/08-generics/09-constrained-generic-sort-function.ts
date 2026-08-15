/**
 * 08-generics — Problem 9: Constrained generic sort function
 *
 * Define `Sortable = { sortOrder: number }` and
 * `sortBySortOrder<T extends Sortable>(items: T[]): T[]` that returns a NEW
 * sorted array (don't mutate the input).
 *
 * Must compile:
 * - sorting an array of objects that each have sortOrder plus extra fields
 *
 * Must be rejected:
 * - sorting an array of objects without sortOrder
 *
 * Answer without looking once done: why does the return type stay `T[]`
 * rather than `Sortable[]`? What would the caller lose if it were `Sortable[]`?
 *
 * Theory: TS-Vault/08-generics/Generic Constraints.md
 */

// your code here

export {};
