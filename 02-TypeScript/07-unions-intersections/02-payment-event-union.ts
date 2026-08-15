/**
 * 07-unions-intersections — Problem 2: Payment event union
 *
 * Define `PaymentEvent` discriminated on `type`: initiated (amount),
 * succeeded (transactionId), failed (reason). Write
 * `logPaymentEvent(event)` that narrows to "succeeded" and reads
 * transactionId.
 *
 * Must compile:
 * - logPaymentEvent({ type: "succeeded", transactionId: "tx_1" })
 *
 * Must be rejected:
 * - logPaymentEvent({ type: "succeeded", reason: "card declined" })
 *
 * Answer without looking once done: inside `if (event.type === "succeeded")`,
 * why can TypeScript suddenly see `transactionId` when it isn't on every
 * member of the union?
 *
 * Theory: TS-Vault/07-unions-intersections/Discriminated Unions.md
 */

// your code here

export {};
