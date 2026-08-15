/**
 * 03-functions — Problem 4: Create typed higher-order function
 *
 * Write `withLogging<Args extends unknown[], Return>(fn: (...args: Args) =>
 * Return): (...args: Args) => Return` that wraps `fn` with before/after
 * console logs and preserves its signature.
 *
 * Must compile:
 * - wrapping `(a: number, b: number) => number` and calling the wrapped
 *   version with two numbers
 *
 * Must be rejected:
 * - calling the wrapped version with strings instead of numbers
 *
 * Answer without looking once done: why is `Args extends unknown[]` needed
 * here instead of just typing the rest parameter as `any[]`?
 *
 * Theory: TS-Vault/03-functions/Generic Functions.md
 */

// your code here

export {};
