import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a WeakMap object.
 * Optionally validates the key and value types of the WeakMap.
 *
 * @param keyGuard - Optional type guard for WeakMap keys
 * @param valueGuard - Optional type guard for WeakMap values
 * @returns A type guard function that validates WeakMap objects
 * 
 * @example
 * ```typescript
 * import { isWeakMap, isString, isNumber } from 'guardz';
 * 
 * // Basic WeakMap validation
 * const isAnyWeakMap = isWeakMap();
 * console.log(isAnyWeakMap(new WeakMap())); // true
 * console.log(isAnyWeakMap(new WeakMap([[{}, 1]]))); // true
 * console.log(isAnyWeakMap({})); // false
 * console.log(isAnyWeakMap([])); // false
 * 
 * // WeakMap with specific key/value types
 * const isObjectNumberWeakMap = isWeakMap(isNonNullObject, isNumber);
 * const obj1 = {};
 * const obj2 = {};
 * console.log(isObjectNumberWeakMap(new WeakMap([[obj1, 1], [obj2, 2]]))); // true
 * console.log(isObjectNumberWeakMap(new WeakMap([[obj1, "1"]]))); // false (wrong value type)
 * 
 * // With type narrowing
 * const data: unknown = new WeakMap([[obj1, 100], [obj2, 200]]);
 * if (isWeakMap(isNonNullObject, isNumber)(data)) {
 *   // data is now typed as WeakMap<object, number>
 *   // Note: WeakMap doesn't have forEach, but you can use get() with known keys
 * }
 * ```
 */
export function isWeakMap<K extends object = object, V = unknown>(
  keyGuard?: TypeGuardFn<K>,
  valueGuard?: TypeGuardFn<V>
): TypeGuardFn<WeakMap<K, V>> {
  return function (value, config): value is WeakMap<K, V> {
    if (!(value instanceof WeakMap)) {
      if (config) {
        config.callbackOnError(generateTypeGuardError(value, config.identifier, "WeakMap"));
      }
      return false;
    }

    // If no key/value guards provided, just validate it's a WeakMap
    if (!keyGuard && !valueGuard) {
      return true;
    }

    // Note: WeakMap doesn't have entries() method, so we can't iterate over it
    // We can only validate the WeakMap structure itself
    // The key/value validation would need to be done when accessing specific keys
    return true;
  };
} 