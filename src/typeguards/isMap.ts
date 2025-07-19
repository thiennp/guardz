import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a Map object.
 * Optionally validates the key and value types of the Map.
 *
 * @param keyGuard - Optional type guard for Map keys
 * @param valueGuard - Optional type guard for Map values
 * @returns A type guard function that validates Map objects
 * 
 * @example
 * ```typescript
 * import { isMap, isString, isNumber } from 'guardz';
 * 
 * // Basic Map validation
 * const isAnyMap = isMap();
 * console.log(isAnyMap(new Map())); // true
 * console.log(isAnyMap(new Map([['a', 1]]))); // true
 * console.log(isAnyMap({})); // false
 * console.log(isAnyMap([])); // false
 * 
 * // Map with specific key/value types
 * const isStringNumberMap = isMap(isString, isNumber);
 * console.log(isStringNumberMap(new Map([['a', 1], ['b', 2]]))); // true
 * console.log(isStringNumberMap(new Map([[1, 'a']]))); // false (wrong key/value types)
 * 
 * // With type narrowing
 * const data: unknown = new Map([['user1', 100], ['user2', 200]]);
 * if (isMap(isString, isNumber)(data)) {
 *   // data is now typed as Map<string, number>
 *   data.forEach((value, key) => {
 *     console.log(`${key}: ${value.toFixed(2)}`);
 *   });
 * }
 * ```
 */
export function isMap<K = unknown, V = unknown>(
  keyGuard?: TypeGuardFn<K>,
  valueGuard?: TypeGuardFn<V>
): TypeGuardFn<Map<K, V>> {
  return function (value, config): value is Map<K, V> {
    if (!(value instanceof Map)) {
      if (config) {
        config.callbackOnError(generateTypeGuardError(value, config.identifier, "Map"));
      }
      return false;
    }

    // If no key/value guards provided, just validate it's a Map
    if (!keyGuard && !valueGuard) {
      return true;
    }

    // Validate each entry if guards are provided
    for (const [key, val] of value.entries()) {
      if (keyGuard && !keyGuard(key, config ? { ...config, identifier: `${config.identifier}.key` } : null)) {
        return false;
      }
      if (valueGuard && !valueGuard(val, config ? { ...config, identifier: `${config.identifier}.value` } : null)) {
        return false;
      }
    }

    return true;
  };
} 