/**
 * 13-async-types — Problem 6: Type concurrent request helper
 *
 * Write `fetchAll<T>(requests: (() => Promise<T>)[]): Promise<T[]>` using
 * Promise.all over the mapped request functions.
 *
 * Must compile:
 * - const results: number[] = await fetchAll([() => Promise.resolve(1)])
 *
 * Must be rejected:
 * - assigning those results to a string[]
 *
 * Answer without looking once done: Promise.all rejects as soon as ONE
 * promise rejects. Which combinator would you use instead to get every
 * result including the failures, and what's its return type?
 *
 * Theory: TS-Vault/13-async-types/Generic Async Functions.md
 */

// your code here

export {};
