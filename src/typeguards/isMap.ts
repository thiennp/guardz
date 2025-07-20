import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a Map object.
 *
 * This type guard validates that a value is a Map instance, which is available
 * in all modern JavaScript environments.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a Map object, false otherwise
 *
 * @example
 * ```typescript
 * import { isMap } from 'guardz';
 *
 * console.log(isMap(new Map())); // true
 * console.log(isMap(new Map([['key', 'value']]))); // true
 * console.log(isMap({})); // false (plain object)
 * console.log(isMap([])); // false (array)
 * console.log(isMap('not a map')); // false
 *
 * // With type narrowing
 * const data: unknown = getData();
 * if (isMap(data)) {
 *   // data is now typed as Map<unknown, unknown>
 *   console.log('Map size:', data.size);
 *   data.set('newKey', 'newValue');
 * }
 *
 * // With error handling
 * const cache: unknown = getCache();
 * if (!isMap(cache, { identifier: 'userCache' })) {
 *   console.error('Invalid cache data structure');
 *   return;
 * }
 * // cache is now typed as Map<unknown, unknown>
 * ```
 */
export const isMap: TypeGuardFn<Map<unknown, unknown>> = function (
  value,
  config
): value is Map<unknown, unknown> {
  if (!(value instanceof Map)) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'Map')
      );
    }
    return false;
  }

  return true;
};
