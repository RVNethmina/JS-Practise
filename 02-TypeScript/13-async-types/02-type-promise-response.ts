/**
 * 13-async-types — Problem 2: Type Promise response
 *
 * Write `delay(ms): Promise<void>` using the Promise constructor, and
 * `fetchNumber(): Promise<number>` using Promise.resolve. Await both.
 *
 * Must compile:
 * - await delay(100) and const n: number = await fetchNumber()
 *
 * Must be rejected:
 * - const bad: Promise<string> = fetchNumber()
 *
 * Answer without looking once done: `delay` returns `Promise<void>` but
 * never explicitly resolves a value. Where does the void come from?
 *
 * Theory: TS-Vault/13-async-types/Promise Types and async Returns.md
 */

// your code here

export {};
