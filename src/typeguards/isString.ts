import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a string.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a string, false otherwise
 *
 * @example
 * ```typescript
 * import { isString } from 'guardz';
 *
 * console.log(isString("hello")); // true
 * console.log(isString("")); // true
 * console.log(isString(123)); // false
 * console.log(isString(null)); // false
 *
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isString(data)) {
 *   // data is now typed as string
 *   console.log(data.toUpperCase());
 * }
 * ```
 */
export const isString: TypeGuardFn<string> = function (
  value,
  config
): value is string {
  if (typeof value !== 'string') {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'string')
      );
    }
    return false;
  }
  return true;
};
