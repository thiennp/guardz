import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a Set object.
 * Optionally validates the element types of the Set.
 *
 * @param elementGuard - Optional type guard for Set elements
 * @returns A type guard function that validates Set objects
 * 
 * @example
 * ```typescript
 * import { isSet, isString, isNumber } from 'guardz';
 * 
 * // Basic Set validation
 * const isAnySet = isSet();
 * console.log(isAnySet(new Set())); // true
 * console.log(isAnySet(new Set([1, 2, 3]))); // true
 * console.log(isAnySet({})); // false
 * console.log(isAnySet([])); // false
 * 
 * // Set with specific element types
 * const isStringSet = isSet(isString);
 * console.log(isStringSet(new Set(['a', 'b', 'c']))); // true
 * console.log(isStringSet(new Set(['a', 1, 'c']))); // false (mixed types)
 * 
 * // With type narrowing
 * const data: unknown = new Set(['apple', 'banana', 'cherry']);
 * if (isSet(isString)(data)) {
 *   // data is now typed as Set<string>
 *   data.forEach(item => {
 *     console.log(item.toUpperCase());
 *   });
 * }
 * ```
 */
export function isSet<T = unknown>(elementGuard?: TypeGuardFn<T>): TypeGuardFn<Set<T>> {
  return function (value, config): value is Set<T> {
    if (!(value instanceof Set)) {
      if (config) {
        config.callbackOnError(generateTypeGuardError(value, config.identifier, "Set"));
      }
      return false;
    }

    // If no element guard provided, just validate it's a Set
    if (!elementGuard) {
      return true;
    }

    // Validate each element if guard is provided
    for (const element of value) {
      if (!elementGuard(element, config ? { ...config, identifier: `${config.identifier}.element` } : null)) {
        return false;
      }
    }

    return true;
  };
} 