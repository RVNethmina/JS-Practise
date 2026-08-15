/**
 * 07-unions-intersections — Problem 1: Model loading / success / error states
 *
 * Define a generic `RequestState<T>` discriminated union with three members:
 * { status: "loading" }, { status: "success"; data: T },
 * { status: "error"; message: string }. Write `render<T>(state): string`
 * using a switch over `status`.
 *
 * Must compile:
 * - render<number>({ status: "success", data: 42 })
 *
 * Must be rejected:
 * - render<number>({ status: "success", message: "oops" })
 *
 * Answer without looking once done: why is this three-member union better
 * than one object with `isLoading`, `data`, and `error` all optional?
 *
 * Theory: TS-Vault/07-unions-intersections/Discriminated Unions.md
 */

// your code here

export {};
