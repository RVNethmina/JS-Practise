/**
 * 08-generics — Problem 4: Generic API response
 *
 * Define `ApiResponse<T> = { status: number; data: T }` and
 * `unwrapData<T>(response): T`.
 *
 * Must compile:
 * - unwrapData on an ApiResponse<{ id: number }>
 *
 * Must be rejected:
 * - an ApiResponse<{ id: number }> whose data.id is a string
 *
 * Answer without looking once done: the generic parameter is on the TYPE
 * here, and also on the function. Are those the same `T`? What connects them?
 *
 * Theory: TS-Vault/08-generics/Generic Types and Interfaces.md
 */

// your code here

export {};
