/**
 * 04-objects — Problem 7: Validate nested object types
 *
 * Define an `Order` type with `id`, an `items` array of
 * `{ productId, quantity }`, and a nested `shipping` object with `address`
 * and `method: "standard" | "express"`. Write `isValidOrder(order): boolean`.
 *
 * Must compile:
 * - isValidOrder on a well-formed order
 *
 * Must be rejected:
 * - an order whose shipping.method is "overnight"
 *
 * Answer without looking once done: when a nested property has an invalid
 * literal value, which line does TypeScript report the error on — the outer
 * object or the nested one? Why does that matter for @ts-expect-error?
 *
 * Theory: TS-Vault/04-objects/Object Type Syntax and Nesting.md
 */

// your code here

export {};
