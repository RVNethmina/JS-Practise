/**
 * 03-functions — Problem 6: Type a callback-based API
 *
 * Define `FetchCallback<T> = (error: Error | null, data: T | null) => void`
 * and `fetchData<T>(url: string, callback: FetchCallback<T>): void`.
 *
 * Must compile:
 * - fetchData<{ id: number }>("/api/user", (error, data) => { ... })
 *
 * Must be rejected:
 * - a callback whose `error` parameter is typed `string` instead of `Error | null`
 *
 * Answer without looking once done: why does this pattern make both `error`
 * and `data` potentially null, and what does that force the caller to do?
 *
 * Theory: TS-Vault/03-functions/Function Type Aliases and Callbacks.md
 */

// your code here

export {};
