/**
 * 01-basics — Problem 5: Type function return values
 *
 * Write, each with an EXPLICIT return type:
 * 1. `add` returning a number
 * 2. `getFullName` returning a string
 * 3. `logMessage` returning void
 * 4. `findUser` returning `User | null` — define a small User type inline
 * 5. `fail` that always throws, returning never
 * 6. `fetchCount` — an async function returning a count
 *
 * Must compile:
 * - all six
 * - awaiting fetchCount into a plain number
 *
 * Must be rejected:
 * - returning a string from add
 * - returning a value from logMessage
 * - assigning findUser's result straight into a User without a null check
 * - typing fetchCount as returning plain `number` instead of `Promise<number>`
 *
 * Answer without looking once done: what is the return type of an async
 * function that returns 5, and how is `never` different from `void`?
 *
 * Theory: TS-Vault/01-basics/any, unknown, never, void.md
 */

// your code here

export {};
