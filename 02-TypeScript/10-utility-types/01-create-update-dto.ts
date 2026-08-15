/**
 * 10-utility-types — Problem 1: Create update DTO
 *
 * Define `User` (id, name, email, bio). Derive
 * `UpdateUserDto = Partial<Omit<User, "id">>` — every field optional, and
 * `id` not updatable. Write `updateUser(id, changes): User`.
 *
 * Must compile:
 * - updateUser(1, { name: "Nethmina" }) and updateUser(1, {})
 *
 * Must be rejected:
 * - updateUser(1, { id: 2 })
 *
 * Answer without looking once done: why compose Omit INSIDE Partial rather
 * than the other way round? Does the order actually change the result here?
 *
 * Theory: TS-Vault/10-utility-types/Partial, Required, Readonly.md
 *         TS-Vault/10-utility-types/Pick and Omit.md
 */

// your code here

export {};
