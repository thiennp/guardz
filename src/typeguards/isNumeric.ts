import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';
import type { Numeric } from '../types/Numeric';

/**
 * Checks if a value is numeric (a number or a string that can be converted to a number).
 * 
 * This type guard validates that a value is either a number or a string that can be
 * converted to a number. This is useful for validating numeric values in various contexts
 * like form inputs, API data, object keys, etc.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a number or a string that can be converted to a number, false otherwise
 *
 * @example
 * ```typescript
 * import { isNumeric } from 'guardz';
 *
 * console.log(isNumeric(1)); // true
 * console.log(isNumeric("1")); // true
 * console.log(isNumeric("123")); // true
 * console.log(isNumeric("abc")); // false
 * console.log(isNumeric("1.5")); // true
 * console.log(isNumeric("1.0")); // true
 * console.log(isNumeric("0")); // true
 * console.log(isNumeric("")); // false
 * console.log(isNumeric(null)); // false
 * console.log(isNumeric(undefined)); // false
 *
 * // With type narrowing
 * const data: unknown = getDataFromAPI();
 * if (isNumeric(data)) {
 *   // data is now typed as Numeric
 *   console.log(Number(data)); // Safe to convert
 * }
 * ```
 */
export const isNumeric: TypeGuardFn<Numeric> = function (
  value,
  config
): value is Numeric {
  // Check if it's already a number
  if (typeof value === 'number') {
    // Reject NaN
    if (!isNaN(value)) {
      return true;
    } else {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(value, config.identifier, 'number key')
        );
      }
      return false;
    }
  }

  // Check if it's a string that can be converted to a number
  if (typeof value === 'string') {
    // Handle edge cases
    if (value === '' || value === ' ' || value === 'NaN' || value === '+0') {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(value, config.identifier, 'number key')
        );
      }
      return false;
    }
    
    const num = Number(value);
    // Check if it's a valid number (not NaN)
    if (!isNaN(num)) {
      return true;
    } else {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(value, config.identifier, 'number key')
        );
      }
      return false;
    }
  }

  // Not a valid number key
  if (config) {
    config.callbackOnError(
      generateTypeGuardError(value, config.identifier, 'number key')
    );
  }
  return false;
}; 