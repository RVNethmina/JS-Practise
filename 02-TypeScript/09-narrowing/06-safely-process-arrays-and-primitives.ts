/**
 * 09-narrowing — Problem 6: Safely process arrays and primitives
 *
 * Write `sumIfNumbers(value: unknown): number` that returns the sum when
 * given an array of numbers, the value itself when given a number, and 0
 * otherwise. Use Array.isArray plus an `.every` check.
 *
 * Must compile:
 * - sumIfNumbers([1, 2, 3]), sumIfNumbers(5), sumIfNumbers("nope")
 *
 * Must be rejected:
 * - reading value.length off an unknown without narrowing
 *
 * Answer without looking once done: after `Array.isArray(value)`, what
 * exactly is `value` narrowed to — and why isn't it `number[]` even after
 * the `.every` check passes?
 *
 * Theory: TS-Vault/09-narrowing/The in Operator and Truthiness.md
 */

// your code here

export {};
