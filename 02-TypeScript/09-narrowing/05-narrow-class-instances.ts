/**
 * 09-narrowing — Problem 5: Narrow class instances
 *
 * Define `class ApiError extends Error` (with statusCode) and
 * `class NetworkError extends Error` (with retryable). Write
 * `handleError(error: unknown): string` that narrows with `instanceof`.
 *
 * Must compile:
 * - handleError(new ApiError(404, "Not found"))
 *
 * Must be rejected:
 * - reading error.statusCode off an unknown without narrowing
 *
 * Answer without looking once done: a catch block's error is typed `unknown`
 * under strict mode. Why did TypeScript make that change, and what did it
 * used to be?
 *
 * Theory: TS-Vault/09-narrowing/typeof and instanceof Narrowing.md
 */

// your code here

export {};
