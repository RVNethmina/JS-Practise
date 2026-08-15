/**
 * 09-narrowing — Problem 1: Safely process unknown input
 *
 * Write `processInput(input: unknown): string` that handles string, number,
 * and array cases via typeof / Array.isArray, returning a fallback for
 * anything else.
 *
 * Must compile:
 * - processInput("hello"), processInput(42)
 *
 * Must be rejected:
 * - calling any method on the unknown parameter before narrowing
 *
 * Answer without looking once done: why does `typeof input === "string"`
 * change what you're allowed to do with `input` on the very next line?
 *
 * Theory: TS-Vault/09-narrowing/typeof and instanceof Narrowing.md
 */

// your code here

export {};
