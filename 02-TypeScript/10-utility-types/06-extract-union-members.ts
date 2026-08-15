/**
 * 10-utility-types — Problem 6: Extract union members
 *
 * From `Status = "idle" | "loading" | "success" | "error"`, derive
 * `ActiveStatus = Exclude<Status, "idle">` and
 * `TerminalStatus = Extract<Status, "success" | "error">`.
 *
 * Must compile:
 * - assigning "loading" to ActiveStatus, "success" to TerminalStatus
 *
 * Must be rejected:
 * - assigning "idle" to ActiveStatus
 * - assigning "loading" to TerminalStatus
 *
 * Answer without looking once done: Exclude and Extract are built on
 * conditional types distributing over unions. What does "distributing" mean
 * here?
 *
 * Theory: TS-Vault/10-utility-types/Exclude, Extract, NonNullable.md
 */

// your code here

export {};
