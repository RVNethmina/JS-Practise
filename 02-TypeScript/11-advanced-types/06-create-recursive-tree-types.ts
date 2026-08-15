/**
 * 11-advanced-types — Problem 6: Create recursive tree types
 *
 * Define a `Comment` type with id, text, and `replies: Comment[]`. Build a
 * two-level nested comment.
 *
 * Must compile:
 * - a comment with one nested reply
 *
 * Must be rejected:
 * - a reply missing its own `replies` field
 *
 * Answer without looking once done: the nested reply must ALSO have a
 * `replies` array, even if empty. How would you change the type so leaf
 * nodes can omit it entirely?
 *
 * Theory: TS-Vault/11-advanced-types/Recursive and Key Remapping.md
 */

// your code here

export {};
