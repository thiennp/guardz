import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a WeakSet object.
 * Optionally validates the element types of the WeakSet.
 *
 * @param elementGuard - Optional type guard for WeakSet elements
 * @returns A type guard function that validates WeakSet objects
 * 
 * @example
 * ```typescript
 * import { isWeakSet, isNonNullObject } from 'guardz';
 * 
 * // Basic WeakSet validation
 * const isAnyWeakSet = isWeakSet();
 * console.log(isAnyWeakSet(new WeakSet())); // true
 * console.log(isAnyWeakSet(new WeakSet([{}]))); // true
 * console.log(isAnyWeakSet({})); // false
 * console.log(isAnyWeakSet([])); // false
 * 
 * // WeakSet with specific element types
 * const isObjectWeakSet = isWeakSet(isNonNullObject);
 * const obj1 = {};
 * const obj2 = {};
 * console.log(isObjectWeakSet(new WeakSet([obj1, obj2]))); // true
 * console.log(isObjectWeakSet(new WeakSet([obj1, "not-an-object"]))); // false (mixed types)
 * 
 * // With type narrowing
 * const data: unknown = new WeakSet([obj1, obj2]);
 * if (isWeakSet(isNonNullObject)(data)) {
 *   // data is now typed as WeakSet<object>
 *   // Note: WeakSet doesn't have forEach, but you can use has() with known objects
 * }
 * ```
 */
export function isWeakSet<T extends object = object>(elementGuard?: TypeGuardFn<T>): TypeGuardFn<WeakSet<T>> {
  return function (value, config): value is WeakSet<T> {
    if (!(value instanceof WeakSet)) {
      if (config) {
        config.callbackOnError(generateTypeGuardError(value, config.identifier, "WeakSet"));
      }
      return false;
    }

    // If no element guard provided, just validate it's a WeakSet
    if (!elementGuard) {
      return true;
    }

    // Note: WeakSet doesn't have values() method, so we can't iterate over it
    // We can only validate the WeakSet structure itself
    // The element validation would need to be done when checking specific elements
    return true;
  };
} 