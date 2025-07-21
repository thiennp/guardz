import { generateTypeGuardError } from './generateTypeGuardError';
import { isNil } from './isNil';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is not null and not undefined (is defined).
 *
 * This is the opposite of isNil - it returns true for any value that is not null or undefined.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is not null and not undefined, false otherwise
 *
 * @example
 * ```typescript
 * import { isDefined } from 'guardz';
 *
 * console.log(isDefined("hello")); // true
 * console.log(isDefined(0)); // true
 * console.log(isDefined(false)); // true
 * console.log(isDefined("")); // true
 * console.log(isDefined({})); // true
 * console.log(isDefined([])); // true
 * console.log(isDefined(null)); // false
 * console.log(isDefined(undefined)); // false
 *
 * // Useful for filtering out null/undefined values
 * const data: unknown = getUserInput();
 * if (isDefined(data)) {
 *   // data is now typed as NonNullable<unknown>
 *   // TypeScript knows data is not null or undefined
 * }
 * ```
 */
export const isDefined: TypeGuardFn<NonNullable<unknown>> = function (
  value,
  config
): value is NonNullable<unknown> {
  if (isNil(value, null)) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'isDefined')
      );
    }
    return false;
  }

  return true;
};
