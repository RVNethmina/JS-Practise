/**
 * 13-async-types — Problem 4: Type pagination response
 *
 * Define `PaginatedResponse<T> = { items: T[]; nextCursor: string | null }`.
 * Write `fetchPage(cursor): Promise<PaginatedResponse<{ id: number }>>`.
 *
 * Must compile:
 * - awaiting fetchPage(null) and reading page.items.length
 *
 * Must be rejected:
 * - an async function returning an object missing `nextCursor`
 *
 * Answer without looking once done: `nextCursor: string | null` — why is
 * null better than undefined or an empty string for signalling "no more
 * pages"?
 *
 * Theory: TS-Vault/13-async-types/Typing API Responses.md
 */

// your code here

export {};
