/**
 * 06-type-aliases — Problem 3: Event type
 *
 * Define `EventType` as a union of three object shapes discriminated by a
 * `kind` field: click (x, y), keypress (key), scroll (deltaY). Write
 * `handleEvent(event)` that narrows on `kind` and reads click coordinates.
 *
 * Must compile:
 * - handleEvent({ kind: "click", x: 10, y: 20 })
 *
 * Must be rejected:
 * - handleEvent({ kind: "click", key: "Enter" })
 *
 * Answer without looking once done: what makes a union "discriminated", and
 * why does that specific shape let TypeScript narrow inside an if-block?
 *
 * Theory: TS-Vault/06-type-aliases/Unions in Type Aliases.md
 */

// your code here

export {};
