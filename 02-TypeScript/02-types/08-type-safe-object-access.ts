/**
 * 02-types — Problem 8: Create type-safe object access
 *
 * Define `Settings` with darkMode, fontSize, language. Write
 * `hasKey<T extends object>(obj, key): key is keyof T` and use it inside
 * `getSetting(settings, key: string): unknown` to safely look up a
 * dynamic key.
 *
 * Must compile:
 * - getSetting(settings, "darkMode")
 *
 * Must be rejected:
 * - accessing settings["unknownKey"] directly (a key not in Settings)
 *
 * Answer without looking once done: why does bracket-notation access with a
 * literal string key get checked against the object's known keys, while a
 * plain `string`-typed key wouldn't be?
 *
 * Theory: TS-Vault/02-types/keyof, Indexed Access, and typeof.md
 */

// your code here

export {};
