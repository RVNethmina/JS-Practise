/**
 * 03-functions — Problem 5: Build typed retry function
 *
 * Write `retry<T>(fn: () => T, attempts: number): T` that calls `fn` up to
 * `attempts` times, returning the first successful result or rethrowing the
 * last error.
 *
 * Must compile:
 * - const result: number = retry(() => 42, 3)
 *
 * Must be rejected:
 * - assigning that same call into a variable typed `string`
 *
 * Answer without looking once done: what type should the variable holding
 * the caught error be, and why isn't it safe to type it as `Error`?
 *
 * Theory: TS-Vault/03-functions/Generic Functions.md
 */

// your code here

export {};
