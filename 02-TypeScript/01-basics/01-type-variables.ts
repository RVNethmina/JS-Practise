/**
 * 01-basics — Problem 1: Type variables
 *
 * Declare variables covering every primitive type, and practise the difference
 * between explicit annotation and inference.
 *
 * Must compile:
 * - one variable of each primitive: string, number, boolean, bigint, symbol
 * - a variable that may be null
 * - a variable that may be undefined
 * - a `const` holding a string literal
 * - a `let` holding a string
 *
 * Must be rejected (mark with `// @ts-expect-error` on the line above):
 * - assigning a number to a string-typed variable
 * - assigning null to a plain `string` (not `string | null`)
 * - calling a method on an `unknown` value before narrowing it
 *
 * Answer without looking once done: what does `const x = 5` infer, and how
 * does that differ from `let x = 5`?
 *
 * Theory: TS-Vault/01-basics/Type Annotations and Inference.md
 *         TS-Vault/01-basics/Primitive Types.md
 */

const a: string = "hello";
const b: number = 34;
const c: boolean = true;
const d: bigint = 899809890809n;
const e: symbol = Symbol("id");

let email: string | null = null;
let password: string | undefined;

const immutable = "Hello There!";
let muttable = "GoodBye!";

// @ts-expect-error
const age: string = 23;

// @ts-expect-error
const name: string = null;

function useUnknownValue(value: unknown): void {
  // @ts-expect-error
  value.toUpperCase();
}

export {};
