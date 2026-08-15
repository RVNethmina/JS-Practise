/**
 * 02-types — Problem 1: Create user role union
 *
 * Define a `UserRole` union of the literals "admin", "editor", "viewer". Write
 * `canEdit(role: UserRole): boolean` that returns true for "admin" or "editor".
 *
 * Must compile:
 * - canEdit("admin"), canEdit("viewer")
 *
 * Must be rejected:
 * - calling canEdit with a string not in the union, e.g. "superadmin"
 *
 * Answer without looking once done: why is a union of string literals safer
 * here than typing the parameter as plain `string`?
 *
 * Theory: TS-Vault/02-types/Unions and Intersections.md
 */

// your code here

export {};
