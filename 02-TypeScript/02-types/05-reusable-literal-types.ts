/**
 * 02-types — Problem 5: Create reusable literal types
 *
 * Define `HttpMethod` as a union of "GET" | "POST" | "PUT" | "PATCH" |
 * "DELETE", and `Theme` as "light" | "dark". Write `request(method, url)`
 * and a `let theme: Theme` variable you reassign.
 *
 * Must compile:
 * - request("GET", "/users")
 * - theme = "dark"
 *
 * Must be rejected:
 * - request("FETCH", "/users")
 * - theme = "blue"
 *
 * Answer without looking once done: why declare a named type alias for a
 * literal union instead of inlining the literals at every call site?
 *
 * Theory: TS-Vault/02-types/Literal Types and Readonly Properties.md
 */

// your code here

export {};
