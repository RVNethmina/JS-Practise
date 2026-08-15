/**
 * 07-unions-intersections — Problem 6: Exhaustively handle states
 *
 * Define `TrafficLight = "red" | "yellow" | "green"` and an
 * `assertNever(value: never): never` helper. Write `nextLight(light)` with a
 * switch whose `default` branch calls assertNever.
 *
 * Then write a SECOND version that deliberately omits one case, and mark the
 * assertNever call as rejected — proving the compiler catches the gap.
 *
 * Must compile:
 * - the complete nextLight
 *
 * Must be rejected:
 * - the assertNever call in the version missing a case
 *
 * Answer without looking once done: why does the missing-case version fail
 * at the assertNever call rather than at the switch itself? What is the type
 * of `light` in that default branch?
 *
 * Theory: TS-Vault/07-unions-intersections/Exhaustiveness Checking with never.md
 */

// your code here

export {};
