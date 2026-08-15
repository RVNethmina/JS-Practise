/**
 * 08-generics — Problem 5: Generic repository
 *
 * Write `class Repository<T extends { id: number }>` with add, getById,
 * getAll. Instantiate it for `{ id: number; name: string }`.
 *
 * Must compile:
 * - userRepo.add({ id: 1, name: "Ravindu" })
 *
 * Must be rejected:
 * - userRepo.add({ id: 2 })
 *
 * Answer without looking once done: why does the class need
 * `T extends { id: number }` rather than a bare `T`? What breaks in
 * `getById` without the constraint?
 *
 * Theory: TS-Vault/08-generics/Generic Constraints.md
 */

// your code here

export {};
