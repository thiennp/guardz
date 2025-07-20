import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a URLSearchParams object.
 *
 * This type guard validates that a value is a URLSearchParams instance, which is available
 * in all modern JavaScript environments.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a URLSearchParams object, false otherwise
 *
 * @example
 * ```typescript
 * import { isURLSearchParams } from 'guardz';
 *
 * console.log(isURLSearchParams(new URLSearchParams())); // true
 * console.log(isURLSearchParams(new URLSearchParams('?name=john&age=30'))); // true
 * console.log(isURLSearchParams(new URLSearchParams({ name: 'john', age: '30' }))); // true
 * console.log(isURLSearchParams('name=john&age=30')); // false (string, not URLSearchParams)
 * console.log(isURLSearchParams({ name: 'john' })); // false (object, not URLSearchParams)
 *
 * // With type narrowing
 * const data: unknown = getQueryParams();
 * if (isURLSearchParams(data)) {
 *   // data is now typed as URLSearchParams
 *   console.log('Name:', data.get('name'));
 *   console.log('Age:', data.get('age'));
 *   data.append('newParam', 'value');
 * }
 *
 * // With error handling
 * const queryData: unknown = getQueryParams();
 * if (!isURLSearchParams(queryData, { identifier: 'queryParams' })) {
 *   console.error('Invalid query parameters');
 *   return;
 * }
 * // queryData is now typed as URLSearchParams
 * ```
 */
export const isURLSearchParams: TypeGuardFn<URLSearchParams> = function (
  value,
  config
): value is URLSearchParams {
  if (typeof URLSearchParams === 'undefined') {
    // URLSearchParams is not available in this environment
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(
          value,
          config.identifier,
          'URLSearchParams (not available in this environment)'
        )
      );
    }
    return false;
  }

  if (!(value instanceof URLSearchParams)) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'URLSearchParams')
      );
    }
    return false;
  }

  return true;
};
