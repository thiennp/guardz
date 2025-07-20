import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is null or undefined (nil).
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is null or undefined, false otherwise
 *
 * @example
 * ```typescript
 * import { isNil } from 'guardz';
 *
 * console.log(isNil(null)); // true
 * console.log(isNil(undefined)); // true
 * console.log(isNil("")); // false
 * console.log(isNil(0)); // false
 * console.log(isNil(false)); // false
 * console.log(isNil({})); // false
 *
 * // Useful for checking if a value needs initialization
 * const data: unknown = getUserInput();
 * if (isNil(data)) {
 *   // data is now typed as null | undefined
 *   console.log("Value is null or undefined");
 * }
 * ```
 */
export const isNil: TypeGuardFn<null | undefined> = function (
  value,
  config
): value is null | undefined {
  if (value !== null && value !== undefined) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'null | undefined')
      );
    }
    return false;
  }

  return true;
};
