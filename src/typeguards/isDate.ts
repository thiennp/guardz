import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a valid Date object.
 *
 * Note: This function checks for both Date instance and valid date values.
 * Invalid dates (like `new Date("invalid")`) will return false.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a valid Date object, false otherwise
 *
 * @example
 * ```typescript
 * import { isDate } from 'guardz';
 *
 * console.log(isDate(new Date())); // true
 * console.log(isDate(new Date("2023-01-01"))); // true
 * console.log(isDate(new Date("invalid"))); // false (invalid date)
 * console.log(isDate("2023-01-01")); // false (string, not Date)
 * console.log(isDate(1640995200000)); // false (timestamp, not Date)
 * console.log(isDate(null)); // false
 *
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isDate(data)) {
 *   // data is now typed as Date
 *   console.log(data.getFullYear());
 * }
 * ```
 */
export const isDate: TypeGuardFn<Date> = function (
  value,
  config
): value is Date {
  if (!(value instanceof Date) || isNaN(value.getTime())) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'Date')
      );
    }
    return false;
  }
  return true;
};
