/**
 * 07-unions-intersections — Problem 4: Combine permissions with user types
 *
 * Define `BaseUser = { id, name }` and
 * `Permissions = { canEdit: boolean; canDelete: boolean }`. Intersect them
 * into `PermissionedUser`.
 *
 * Must compile:
 * - a user with all four fields
 *
 * Must be rejected:
 * - a user missing `canDelete`
 *
 * Answer without looking once done: intersection means "must satisfy both".
 * What happens if you intersect two types that declare the same property
 * with incompatible types — is that an error, or something stranger?
 *
 * Theory: TS-Vault/07-unions-intersections/Intersections in Depth.md
 */

// your code here

export {};
