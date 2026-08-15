/**
 * 05-interfaces — Problem 6: Service interface
 *
 * Declare `interface ServiceInterface` with `init(): Promise<void>` and
 * `isReady(): boolean`. Implement it in a `NotificationService` class. Then
 * write a second class that deliberately omits `init` and mark it rejected.
 *
 * Must compile:
 * - service.isReady()
 *
 * Must be rejected:
 * - a class declaring `implements ServiceInterface` without `init`
 *
 * Answer without looking once done: does `implements` change the class's
 * runtime behaviour at all, or is it purely a compile-time check?
 *
 * Theory: TS-Vault/05-interfaces/Implementing Interfaces in Classes.md
 */

// your code here

export {};
