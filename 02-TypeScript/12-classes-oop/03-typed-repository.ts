/**
 * 12-classes-oop — Problem 3: Typed repository
 *
 * Define `interface Entity { id: number }`. Write
 * `class Repository<T extends Entity>` with add and findById. Then write
 * `class ProductRepository extends Repository<{ id: number; name: string }>`.
 *
 * Must compile:
 * - repo.add({ id: 1, name: "Widget" })
 *
 * Must be rejected:
 * - repo.add({ id: 1 })
 *
 * Answer without looking once done: the subclass FIXES the generic parameter
 * rather than staying generic. When would you want the subclass to stay
 * generic instead?
 *
 * Theory: TS-Vault/12-classes-oop/Generics with Classes.md
 */

// your code here

export {};
