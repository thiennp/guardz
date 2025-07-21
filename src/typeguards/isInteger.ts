import { generateTypeGuardError } from './generateTypeGuardError';
import { isNumber } from './isNumber';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is an integer (whole number).
 *
 * This validates that a value is a number and has no fractional part.
 * Useful for validating IDs, counts, array indices, and other whole number data.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is an integer, false otherwise
 *
 * @example
 * ```typescript
 * import { isInteger } from 'guardz';
 *
 * console.log(isInteger(123)); // true
 * console.log(isInteger(0)); // true
 * console.log(isInteger(-5)); // true
 * console.log(isInteger(123.0)); // true
 * console.log(isInteger(123.45)); // false
 * console.log(isInteger(NaN)); // false
 * console.log(isInteger(Infinity)); // false
 * console.log(isInteger("123")); // false
 *
 * // Useful for validating data like IDs, counts, etc.
 * const data: unknown = getUserInput();
 * if (isInteger(data)) {
 *   // data is now typed as number and guaranteed to be an integer
 *   console.log(`Processing ID: ${data}`);
 * }
 * ```
 */
export const isInteger: TypeGuardFn<number> = function (
  value,
  config
): value is number {
  if (!isNumber(value, null) || !Number.isInteger(value)) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'integer')
      );
    }
    return false;
  }
  return true;
};
