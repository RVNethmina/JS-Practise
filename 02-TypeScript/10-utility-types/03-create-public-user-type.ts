/**
 * 10-utility-types — Problem 3: Create public user type
 *
 * Define `FullUser` (id, name, passwordHash, email). Derive
 * `PublicUser = Omit<FullUser, "passwordHash">`.
 *
 * Must compile:
 * - a PublicUser without passwordHash
 *
 * Must be rejected:
 * - a PublicUser object that includes passwordHash
 *
 * Answer without looking once done: `Omit` doesn't error if you misspell the
 * key you're omitting. Why not, and what would you use to make that safer?
 *
 * Theory: TS-Vault/10-utility-types/Pick and Omit.md
 */

// your code here

export {};
