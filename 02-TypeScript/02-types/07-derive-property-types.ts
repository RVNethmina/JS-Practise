/**
 * 02-types — Problem 7: Derive property types
 *
 * Define `Product` with id, name, price, inStock. Derive
 * `ProductKey = keyof Product` and `ProductName = Product["name"]`. Write
 * `getProperty<K extends ProductKey>(product, key): Product[K]`.
 *
 * Must compile:
 * - getProperty(product, "name")
 *
 * Must be rejected:
 * - getProperty(product, "weight")
 *
 * Answer without looking once done: what does `keyof Product` evaluate to,
 * and how does that differ from the indexed access `Product["name"]`?
 *
 * Theory: TS-Vault/02-types/keyof, Indexed Access, and typeof.md
 */

// your code here

export {};
