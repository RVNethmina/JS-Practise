/**
 * 09-narrowing — Problem 4: Validate object shape
 *
 * Define `Point = { x: number; y: number }`. Write
 * `isPoint(value: unknown): value is Point` that checks typeof object, not
 * null, the `in` operator for both keys, and that both are numbers. Use it
 * in `describePoint(value: unknown): string`.
 *
 * Must compile:
 * - describePoint({ x: 1, y: 2 }) and describePoint("nope")
 *
 * Must be rejected:
 * - reading value.x on an unknown without narrowing
 *
 * Answer without looking once done: why is the `value !== null` check
 * required BEFORE the `in` checks, and what does that have to do with
 * `typeof null`?
 *
 * Theory: TS-Vault/09-narrowing/Custom Type Predicates.md
 *         TS-Vault/09-narrowing/The in Operator and Truthiness.md
 */

// your code here

export {};
