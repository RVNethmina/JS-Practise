/**
 * 01-basics — Problem 6: Safely handle unknown input
 *
 * Write `describeInput(input: unknown): string` — the parameter must be
 * `unknown`, not `any`, not a union. Return a description based on what the
 * value turns out to be at runtime: number, string, boolean, null, array,
 * plain object, or anything else. Use `typeof`, `Array.isArray`, and an
 * explicit null check.
 *
 * Then write `parseJsonSafely(raw: string): unknown` and use it with
 * describeInput.
 *
 * Finally `getStringLength(input: unknown): number` — string length, array
 * element count, or 0 for everything else.
 *
 * Must compile:
 * - calling all three with a number, string, null, array, and object
 *
 * Must be rejected:
 * - calling a string method on the unknown parameter before narrowing it
 * - assigning the unknown parameter straight into a string
 *
 * Answer without looking once done: why does `typeof null === "object"`
 * matter here, and what breaks if you forget it?
 *
 * Theory: TS-Vault/01-basics/any, unknown, never, void.md
 */

// your code here

export {};
