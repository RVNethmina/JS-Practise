/**
 * 10-utility-types — Problem 8: Type async response
 *
 * Given `async function fetchUser(): Promise<{ id: number; name: string }>`,
 * derive `FetchUserResult = Awaited<ReturnType<typeof fetchUser>>` — the
 * UNWRAPPED type.
 *
 * Must compile:
 * - const user: FetchUserResult = await fetchUser()
 *
 * Must be rejected:
 * - assigning a Promise (not awaited) to FetchUserResult
 *
 * Answer without looking once done: what does Awaited do to a
 * `Promise<Promise<string>>`? Why does that matter?
 *
 * Theory: TS-Vault/10-utility-types/ReturnType, Parameters, Awaited.md
 */

// your code here

export {};
