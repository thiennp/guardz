import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard that checks if a value is a plain object where each property value matches a specific type.
 *
 * This is a higher-order function that takes a type guard for the property values and returns
 * a type guard for objects containing those values. Only checks enumerable own properties.
 *
 * @param predicate - The type guard function to apply to each property value
 * @returns A type guard function that checks if the value is an object with valid property values
 *
 * @example
 * ```typescript
 * import { isObjectWithEachItem, isString, isNumber } from 'guardz';
 *
 * const isStringRecord = isObjectWithEachItem(isString);
 * const isNumberRecord = isObjectWithEachItem(isNumber);
 *
 * console.log(isStringRecord({ a: "hello", b: "world" })); // true
 * console.log(isStringRecord({})); // true (empty object is valid)
 * console.log(isStringRecord({ a: "hello", b: 123 })); // false (mixed types)
 * console.log(isStringRecord([])); // false (array is not a plain object)
 * console.log(isStringRecord(null)); // false
 *
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isStringRecord(data)) {
 *   // data is now typed as Record<string, string>
 *   Object.keys(data).forEach(key => {
 *     console.log(data[key].toUpperCase());
 *   });
 * }
 * ```
 */
export function isObjectWithEachItem<T>(
  predicate: TypeGuardFn<T>
): TypeGuardFn<Record<string, T>> {
  return function (value, config): value is Record<string, T> {
    // Stricter check for plain objects
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

    // Cast value to Record<string, unknown> for Object.values compatibility if needed by strict checks
    const obj = value as Record<string, unknown>;

    return Object.values(obj).every(
      (
        item,
        index // Use obj here
      ) =>
        predicate(
          item,
          config
            ? {
                ...config,
                identifier: `${config.identifier}[${index}]`,
              }
            : null
        )
    );
  };
}
