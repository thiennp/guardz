import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a RegExp object.
 *
 * This type guard validates that a value is a regular expression object,
 * including both literal regex patterns and RegExp constructor instances.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a RegExp, false otherwise
 *
 * @example
 * ```typescript
 * import { isRegex } from 'guardz';
 *
 * console.log(isRegex(/abc/)); // true
 * console.log(isRegex(new RegExp('abc'))); // true
 * console.log(isRegex(/^[a-z]+$/)); // true
 * console.log(isRegex('not a regex')); // false
 * console.log(isRegex(123)); // false
 * console.log(isRegex(null)); // false
 *
 * // With type narrowing
 * const data: unknown = getPattern();
 * if (isRegex(data)) {
 *   // data is now typed as RegExp
 *   console.log(data.test('test string'));
 * }
 *
 * // With error handling
 * const pattern: unknown = getPattern();
 * if (!isRegex(pattern, { identifier: 'emailPattern' })) {
 *   console.error('Invalid regex pattern');
 *   return;
 * }
 * // pattern is now typed as RegExp
 * ```
 */
export const isRegex: TypeGuardFn<RegExp> = function (
  value,
  config
): value is RegExp {
  if (!(value instanceof RegExp)) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'RegExp')
      );
    }
    return false;
  }

  return true;
};
