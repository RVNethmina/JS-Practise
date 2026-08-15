/**
 * 05-interfaces — Problem 5: Repository interface
 *
 * Declare `interface RepositoryInterface<T>` with findById, findAll, save,
 * delete. Write a class `InMemoryUserRepository` that implements it for a
 * `{ id: number; name: string }` entity.
 *
 * Must compile:
 * - repo.save({ id: 1, name: "Ravindu" })
 *
 * Must be rejected:
 * - repo.save({ id: 2 })  (missing name)
 *
 * Answer without looking once done: if the class omits one of the four
 * methods, where does TypeScript report the error — the method, or the
 * class declaration line?
 *
 * Theory: TS-Vault/05-interfaces/Implementing Interfaces in Classes.md
 */

// your code here

export {};
