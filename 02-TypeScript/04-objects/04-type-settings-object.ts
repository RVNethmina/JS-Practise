/**
 * 04-objects — Problem 4: Type settings object
 *
 * Define `Settings` with `readonly userId: number`, a nested
 * `notifications: { email: boolean; sms: boolean }`, and
 * `theme: "light" | "dark"`.
 *
 * Must compile:
 * - mutating settings.notifications.email
 *
 * Must be rejected:
 * - reassigning settings.userId
 *
 * Answer without looking once done: `userId` is readonly — does that make
 * the nested `notifications` object readonly too? Why or why not?
 *
 * Theory: TS-Vault/04-objects/Optional and Readonly Properties.md
 */

// your code here

export {};
