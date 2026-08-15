/**
 * 07-unions-intersections — Problem 3: Notification event union
 *
 * Define `NotificationEvent` discriminated on `channel`: email (address),
 * sms (phoneNumber), push (deviceToken). Write `send(event)` with a switch
 * handling all three.
 *
 * Must compile:
 * - send({ channel: "sms", phoneNumber: "0771234567" })
 *
 * Must be rejected:
 * - send({ channel: "sms", address: "x@example.com" })
 *
 * Answer without looking once done: what property makes a good discriminant?
 * Could you discriminate on a `number` field instead of a string literal?
 *
 * Theory: TS-Vault/07-unions-intersections/Discriminated Unions.md
 */

// your code here

export {};
