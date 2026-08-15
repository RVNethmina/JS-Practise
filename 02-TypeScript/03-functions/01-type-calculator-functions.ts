/**
 * 03-functions — Problem 1: Type calculator functions
 *
 * Define `Operation = (a: number, b: number) => number`. Write add,
 * subtract, multiply, divide as `Operation`-typed values, and
 * `calculate(a, b, op: Operation): number`.
 *
 * Must compile:
 * - calculate(4, 2, add)
 *
 * Must be rejected:
 * - calculate(4, 2, (a: string, b: string) => a + b)
 *
 * Answer without looking once done: why does a callback with
 * `(a: string, b: string)` fail assignability to `Operation`, even though
 * function parameters are sometimes described as "more flexible" than plain
 * values?
 *
 * Theory: TS-Vault/03-functions/Function Type Aliases and Callbacks.md
 */

// your code here

export {};
