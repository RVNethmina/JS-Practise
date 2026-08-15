/**
 * 01-basics — Problem 9: Create typed utility function
 *
 * Write four small utilities, fully typed, no `any`, explicit return types:
 * 1. `clamp(value, min, max)` — number held between the bounds
 * 2. `toTitleCase(input)` — "hello world" -> "Hello World"; handle empty string
 * 3. `percentage(part, total)` — decide what happens when total is 0, and
 *    make the return type honest about it
 * 4. `pickFirst(items, fallback)` — first element of a string[], or the
 *    fallback when empty. No generics — that's folder 08.
 *
 * Must compile:
 * - all four with valid input, including empty-array and empty-string cases
 *
 * Must be rejected:
 * - clamp("5", 0, 10)
 * - using percentage's result as a number without handling the zero case
 * - pickFirst with a number array
 *
 * Answer without looking once done: for `percentage`, is `number | null`
 * better than throwing? Argue it either way.
 *
 * Theory: TS-Vault/01-basics/any, unknown, never, void.md
 */

// your code here

export {};
