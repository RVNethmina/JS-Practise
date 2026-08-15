/**
 * 11-advanced-types — Problem 7: Build type-safe event maps
 *
 * Define an `EventMap` where each key maps to its own payload shape: login
 * ({ userId }), logout ({ userId, reason }), error ({ message }). Write
 * `emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void`.
 *
 * Must compile:
 * - emit("login", { userId: 1 })
 * - emit("logout", { userId: 1, reason: "manual" })
 *
 * Must be rejected:
 * - emit("login", { userId: 1, reason: "manual" })
 *
 * Answer without looking once done: this is the pattern behind typed event
 * emitters and typed reducers. Explain how the payload type is derived from
 * the event name argument at each call site.
 *
 * Theory: TS-Vault/11-advanced-types/Recursive and Key Remapping.md
 */

// your code here

export {};
