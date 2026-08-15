/**
 * 01-basics — Problem 2: Type arrays
 *
 * Declare:
 * - an array of strings using `string[]`
 * - the same using `Array<string>`
 * - an array of numbers
 * - an array that holds strings OR numbers (mind operator precedence)
 * - an array of objects, each with `id` and `title`
 * - a nested `number[][]`
 * - a `readonly string[]`
 *
 * Must compile:
 * - pushing a valid element to the mutable arrays
 * - reading index [0] from the readonly array
 *
 * Must be rejected:
 * - pushing a boolean into the string[]
 * - pushing to the readonly array
 * - assigning the string[] into a variable typed number[]
 *
 * Answer without looking once done: what's the difference between
 * `readonly string[]` and `const arr: string[]`? They are not the same thing.
 *
 * Theory: TS-Vault/01-basics/Arrays and Tuples.md
 */

let fruits: string[] = ["apple", "grape"];
let cities: Array<string> = ["Matara", "Galle"];

let ages: number[] = [23, 24, 26, 29];
let mixed: (string | number)[] = ["hello", 1];

let posts: { id: number; title: string }[] = [{ id: 1, title: "First" }];
let grid: number[][] = [
  [1, 2],
  [3, 4],
];

const locked: readonly string[] = ["read", "write"];

// Must compile: pushing a valid element to the mutable arrays
fruits.push("cherry");
ages.push(30);

// Must compile: reading index [0] from the readonly array
const firstPermission: string = locked[0];

// Must be rejected: pushing a boolean into string[]
// @ts-expect-error
fruits.push(true);

// Must be rejected: pushing to the readonly array
// @ts-expect-error
locked.push("execute");

// Must be rejected: assigning string[] into a variable typed number[]
let numsOnly: number[];
// @ts-expect-error
numsOnly = fruits;

export {};
