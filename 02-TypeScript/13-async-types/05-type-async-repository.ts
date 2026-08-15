/**
 * 13-async-types — Problem 5: Type async repository
 *
 * Define `interface AsyncRepository<T>` with
 * `findById(id): Promise<T | null>` and `save(item): Promise<void>`.
 * Implement it in a class. Then write a broken class omitting `save`.
 *
 * Must compile:
 * - repo.findById(1)
 *
 * Must be rejected:
 * - the class missing `save`
 *
 * Answer without looking once done: the interface says `Promise<T | null>`.
 * Could an implementation return a plain `T | null` without async? Why or
 * why not?
 *
 * Theory: TS-Vault/13-async-types/Typing API Responses.md
 */

// your code here

export {};
