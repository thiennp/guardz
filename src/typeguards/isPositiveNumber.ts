import { PositiveNumber } from '@/types/PositiveNumber';
import { TypeGuardFn } from './isType';
import { generateTypeGuardError } from './generateTypeGuardError';

/**
 * Checks if a value is a positive number (greater than 0).
 *
 * Note: This excludes zero, negative numbers, NaN, and Infinity.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a positive number, false otherwise
 *
 * @example
 * ```typescript
 * import { isPositiveNumber } from 'guardz';
 *
 * console.log(isPositiveNumber(1)); // true
 * console.log(isPositiveNumber(42.5)); // true
 * console.log(isPositiveNumber(0.001)); // true
 * console.log(isPositiveNumber(0)); // false (zero is not positive)
 * console.log(isPositiveNumber(-1)); // false
 * console.log(isPositiveNumber(NaN)); // false
 * console.log(isPositiveNumber(Infinity)); // false
 * console.log(isPositiveNumber("5")); // false
 *
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isPositiveNumber(data)) {
 *   // data is now typed as PositiveNumber
 *   console.log(Math.sqrt(data)); // Safe since we know it's positive
 * }
 * ```
 */
export const isPositiveNumber: TypeGuardFn<PositiveNumber> = function (
  value,
  config
): value is PositiveNumber {
  if (
    typeof value !== 'number' ||
    isNaN(value) ||
    value <= 0 ||
    !isFinite(value)
  ) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'PositiveNumber')
      );
    }
    return false;
  }
  return true;
};
