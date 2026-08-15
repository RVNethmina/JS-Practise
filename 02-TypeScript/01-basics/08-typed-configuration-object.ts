/**
 * 01-basics — Problem 8: Create typed configuration object
 *
 * Define an `AppConfig` type with:
 * - appName: string, readonly
 * - port: number
 * - environment: exactly "development" | "staging" | "production"
 * - apiUrl: string
 * - timeoutMs: optional number
 * - features: nested object with darkMode and analytics booleans
 * - retries: a readonly tuple of three numbers
 *
 * Create one valid config. Then write `loadConfig(overrides)` that takes a
 * partial set of overrides and returns a complete AppConfig, filling
 * anything missing from a default. Type `overrides` by hand — do not use
 * `Partial`, that's folder 10.
 *
 * Must compile:
 * - a config with timeoutMs omitted
 * - overriding only port
 *
 * Must be rejected:
 * - environment: "prod"
 * - reassigning appName
 * - a config missing apiUrl
 * - an extra property (e.g. debug: true) in an object literal
 * - mutating retries[0]
 *
 * Answer without looking once done: why does an extra property get rejected
 * in a literal but not when the object is assigned via a variable first?
 *
 * Theory: TS-Vault/01-basics/Object Types.md
 */

// your code here

export {};
