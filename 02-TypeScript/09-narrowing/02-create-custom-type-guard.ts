/**
 * 09-narrowing — Problem 2: Create custom type guard
 *
 * Define `Cat = { kind: "cat"; meow(): void }`, `Dog = { kind: "dog";
 * bark(): void }`, `Animal = Cat | Dog`. Write a type predicate
 * `isCat(animal: Animal): animal is Cat` and use it in `speak(animal)`.
 *
 * Must compile:
 * - speak() calling meow in the isCat branch and bark in the else
 *
 * Must be rejected:
 * - calling animal.meow() without narrowing first
 *
 * Answer without looking once done: what does the `animal is Cat` return
 * type do that a plain `boolean` return type would not?
 *
 * Theory: TS-Vault/09-narrowing/Custom Type Predicates.md
 */

// your code here

export {};
