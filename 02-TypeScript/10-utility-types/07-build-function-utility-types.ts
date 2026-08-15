/**
 * 10-utility-types — Problem 7: Build function utility types
 *
 * Given `createUser(name: string, age: number)`, derive
 * `CreateUserParams = Parameters<typeof createUser>` and
 * `CreateUserReturn = ReturnType<typeof createUser>`. Call createUser by
 * spreading a params tuple.
 *
 * Must compile:
 * - const params: CreateUserParams = ["Ravindu", 28]
 * - createUser(...params)
 *
 * Must be rejected:
 * - a params tuple with only one element
 *
 * Answer without looking once done: why is `typeof createUser` needed rather
 * than just `createUser`? What's the difference between the value and type
 * namespaces?
 *
 * Theory: TS-Vault/10-utility-types/ReturnType, Parameters, Awaited.md
 */

// your code here

export {};
