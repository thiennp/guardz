import { generateTypeGuardError } from './generateTypeGuardError';
import type { NonPositiveNumber } from '@/types/NonPositiveNumber';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a non-positive number (less than or equal to 0).
 *
 * Note: This includes zero but excludes positive numbers, NaN, and Infinity.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a non-positive number, false otherwise
 *
 * @example
 * ```typescript
 * import { isNonPositiveNumber } from 'guardz';
 *
 * console.log(isNonPositiveNumber(0)); // true
 * console.log(isNonPositiveNumber(-1)); // true
 * console.log(isNonPositiveNumber(-42.5)); // true
 * console.log(isNonPositiveNumber(-0.001)); // true
 * console.log(isNonPositiveNumber(1)); // false
 * console.log(isNonPositiveNumber(0.1)); // false
 * console.log(isNonPositiveNumber(NaN)); // false
 * console.log(isNonPositiveNumber(Infinity)); // false
 * console.log(isNonPositiveNumber("-5")); // false
 *
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isNonPositiveNumber(data)) {
 *   // data is now typed as NonPositiveNumber
 *   console.log(Math.abs(data)); // Safe to use absolute value
 * }
 * ```
 */
export const isNonPositiveNumber: TypeGuardFn<NonPositiveNumber> = function (
  value,
  config
): value is NonPositiveNumber {
  if (
    typeof value !== 'number' ||
    isNaN(value) ||
    value > 0 ||
    !isFinite(value)
  ) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'NonPositiveNumber')
      );
    }
    return false;
  }
  return true;
};
