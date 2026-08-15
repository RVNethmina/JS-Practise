/**
 * 13-async-types — Problem 3: Type async retry function
 *
 * Write `retryAsync<T>(fn: () => Promise<T>, attempts: number): Promise<T>`
 * that awaits fn, catching and retrying on failure, rethrowing the last
 * error.
 *
 * Must compile:
 * - const result: number = await retryAsync(() => Promise.resolve(42), 3)
 *
 * Must be rejected:
 * - assigning that same call's result to a string
 *
 * Answer without looking once done: why `() => Promise<T>` rather than just
 * `Promise<T>` as the parameter? What breaks if you pass the promise
 * directly?
 *
 * Theory: TS-Vault/13-async-types/Generic Async Functions.md
 */

// your code here

export {};
