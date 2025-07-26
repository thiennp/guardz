import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn, TypeGuardFnConfig } from './isType';

/**
 * Checks if a value is a Set object.
 *
 * This type guard validates that a value is a Set instance, which is available
 * in all modern JavaScript environments.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a Set object, false otherwise
 *
 * @example
 * ```typescript
 * import { isSet } from 'guardz';
 *
 * console.log(isSet(new Set())); // true
 * console.log(isSet(new Set([1, 2, 3]))); // true
 * console.log(isSet([])); // false (array)
 * console.log(isSet({})); // false (object)
 * console.log(isSet('not a set')); // false
 *
 * // With type narrowing
 * const data: unknown = getData();
 * if (isSet(data)) {
 *   // data is now typed as Set<unknown>
 *   console.log('Set size:', data.size);
 *   data.add('newValue');
 * }
 *
 * // With error handling
 * const uniqueValues: unknown = getUniqueValues();
 * if (!isSet(uniqueValues, { identifier: 'userIds' })) {
 *   console.error('Invalid unique values data structure');
 *   return;
 * }
 * // uniqueValues is now typed as Set<unknown>
 * ```
 */
export const isSet = function<T>(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is Set<T> {
  if (!(value instanceof Set)) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'Set')
      );
    }
    return false;
  }

  return true;
};
