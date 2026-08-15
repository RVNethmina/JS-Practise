/**
 * 11-advanced-types — Problem 4: Build event name types
 *
 * Define `EntityName = "user" | "post" | "comment"` and
 * `EventAction = "created" | "updated" | "deleted"`. Use a template literal
 * type to build `EventName` as every combination ("user.created", etc).
 * Write `emit(event: EventName)`.
 *
 * Must compile:
 * - emit("user.created"), emit("post.deleted")
 *
 * Must be rejected:
 * - emit("user.archived")
 *
 * Answer without looking once done: how many members does EventName have,
 * and why? What's the general rule for template literal types over unions?
 *
 * Theory: TS-Vault/11-advanced-types/Template Literal Types.md
 */

// your code here

export {};
