import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard that validates objects with index signatures.
 * 
 * This function validates that an object has properties with keys of a specific type
 * and values of a specific type. It's useful for validating objects with dynamic keys
 * like `{ [key: string]: T }` or `{ [key: number]: T }`.
 *
 * Note: For number keys, this validates that the string keys can be converted to numbers.
 * JavaScript object keys are always strings, so `{ 1: true }` becomes `{ "1": true }`.
 *
 * @template K - The type of the keys (string or number)
 * @template V - The type of the values
 * @param keyGuard - Type guard function for validating keys
 * @param valueGuard - Type guard function for validating values
 * @returns A type guard function that validates index signature objects
 *
 * @example
 * ```typescript
 * import { isIndexSignature, isString, isNumber, isBoolean } from 'guardz';
 *
 * // String-keyed object with number values
 * const isStringNumberMap = isIndexSignature(isString, isNumber);
 * 
 * // Number-keyed object with boolean values
 * const isNumberBooleanMap = isIndexSignature(isNumber, isBoolean);
 *
 * console.log(isStringNumberMap({ a: 1, b: 2, c: 3 })); // true
 * console.log(isStringNumberMap({ "key1": 10, "key2": 20 })); // true
 * console.log(isStringNumberMap({ a: 1, b: "2" })); // false (mixed value types)
 * console.log(isStringNumberMap({ 1: "a", 2: "b" })); // false (number keys)
 *
 * console.log(isNumberBooleanMap({ 1: true, 2: false })); // true
 * console.log(isNumberBooleanMap({ "1": true })); // true (string keys that are numbers)
 * console.log(isNumberBooleanMap({ "abc": true })); // false (non-numeric string keys)
 *
 * // With type narrowing
 * const data: unknown = getDataFromAPI();
 * if (isStringNumberMap(data)) {
 *   // data is now typed as { [key: string]: number }
 *   Object.entries(data).forEach(([key, value]) => {
 *     console.log(`${key}: ${value * 2}`); // Safe to use as number
 *   });
 * }
 * ```
 */
export function isIndexSignature<K extends string | number, V>(
  keyGuard: TypeGuardFn<K>,
  valueGuard: TypeGuardFn<V>
): TypeGuardFn<{ [P in K]: V }> {
  return function (value, config): value is { [P in K]: V } {
    // Check if it's a plain object
    const isPlainObject =
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      value.constructor === Object;

    if (!isPlainObject) {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(value, config.identifier, 'Object')
        );
      }
      return false;
    }

    // Cast to Record<string | number, unknown> for iteration
    const obj = value as Record<string | number, unknown>;

    // Get all property names (string keys) and symbols
    const stringKeys = Object.getOwnPropertyNames(obj);
    const symbolKeys = Object.getOwnPropertySymbols(obj);
    const allKeys = [...stringKeys, ...symbolKeys];

    // Check all entries
    return allKeys.every((key, index) => {
      const val = obj[key as keyof typeof obj];
      
      const keyValid = keyGuard(
        key as K,
        config
          ? { ...config, identifier: `${config.identifier}[key:${index}]` }
          : null
      );

      const valueValid = valueGuard(
        val,
        config
          ? { ...config, identifier: `${config.identifier}[value:${index}]` }
          : null
      );

      return keyValid && valueValid;
    });
  };
} 