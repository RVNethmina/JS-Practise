/**
 * 09-narrowing — Problem 3: Narrow API response union
 *
 * Define `LoadingResponse`, `SuccessResponse<T>`, `ErrorResponse`, and a
 * union `ApiResponseUnion<T>` discriminated on `state`. Write
 * `getPayload<T>(response): T | null`.
 *
 * Must compile:
 * - getPayload<number>({ state: "success", payload: 42 })
 *
 * Must be rejected:
 * - returning response.payload without narrowing on state first
 *
 * Answer without looking once done: why does the return type have to include
 * `null` here, and what would you change to avoid that?
 *
 * Theory: TS-Vault/09-narrowing/Narrowing Discriminated Unions.md
 */

// your code here

export {};
