/**
 * 12-classes-oop — Problem 7: Class implementing interface
 *
 * Define `interface Comparable<T> { compareTo(other: T): number }`. Write a
 * `Money` class implementing `Comparable<Money>`. Then write a broken class
 * that declares the interface but omits compareTo.
 *
 * Must compile:
 * - a.compareTo(b)
 *
 * Must be rejected:
 * - the class missing compareTo
 *
 * Answer without looking once done: `Comparable<Money>` refers to Money
 * inside Money's own declaration. Why is that legal?
 *
 * Theory: TS-Vault/12-classes-oop/Generics with Classes.md
 */

// your code here

export {};
