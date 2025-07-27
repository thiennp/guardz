import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';
import type { DateLike } from '../types/DateLike';

/**
 * Checks if a value can be treated as a Date.
 * 
 * This type guard validates that a value is either a Date object or can be converted to a Date.
 * It accepts Date objects, string representations (ISO strings, common date formats), and numeric
 * timestamps (Unix timestamps). This is useful for validating date values from various sources
 * like form inputs, API responses, configuration files, etc.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a Date or can be converted to a Date, false otherwise
 *
 * @example
 * ```typescript
 * import { isDateLike } from 'guardz';
 *
 * console.log(isDateLike(new Date())); // true
 * console.log(isDateLike("2023-01-01")); // true
 * console.log(isDateLike("2023-01-01T00:00:00Z")); // true
 * console.log(isDateLike("01/01/2023")); // true
 * console.log(isDateLike(1672531200000)); // true (Unix timestamp)
 * console.log(isDateLike("invalid-date")); // false
 * console.log(isDateLike("")); // false
 * console.log(isDateLike(null)); // false
 * console.log(isDateLike(undefined)); // false
 *
 * // With type narrowing
 * const data: unknown = getDataFromAPI();
 * if (isDateLike(data)) {
 *   // data is now typed as DateLike
 *   console.log(data.toISOString()); // Safe to use Date methods
 * }
 * ```
 */
export const isDateLike: TypeGuardFn<DateLike> = function (
  value,
  config
): value is DateLike {
  // Check if it's already a Date object
  if (value instanceof Date) {
    // Check if it's a valid date (not Invalid Date)
    if (!isNaN(value.getTime())) {
      return true;
    } else {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(value, config.identifier, 'date-like')
        );
      }
      return false;
    }
  }

  // Check if it's a string that can be converted to a Date
  if (typeof value === 'string') {
    // Handle empty strings
    if (value.trim() === '') {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(value, config.identifier, 'date-like')
        );
      }
      return false;
    }

    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return true;
    } else {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(value, config.identifier, 'date-like')
        );
      }
      return false;
    }
  }

  // Check if it's a number that can be converted to a Date
  if (typeof value === 'number') {
    // Check if it's a reasonable timestamp (non-negative and not too large)
    if (value >= 0 && value < 8640000000000000) { // Max safe timestamp
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return true;
      }
    }
    
    // Not a valid timestamp
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'date-like')
      );
    }
    return false;
  }

  // Not a valid date-like value
  if (config) {
    config.callbackOnError(
      generateTypeGuardError(value, config.identifier, 'date-like')
    );
  }
  return false;
}; 