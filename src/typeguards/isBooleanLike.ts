import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value can be treated as a boolean.
 * 
 * This type guard validates that a value is either a boolean or can be converted to a boolean.
 * It accepts boolean values, string representations ("true", "false", "1", "0"), and numeric
 * representations (1, 0). This is useful for validating boolean values from various sources
 * like form inputs, API responses, configuration files, etc.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a boolean or can be converted to a boolean, false otherwise
 *
 * @example
 * ```typescript
 * import { isBooleanLike } from 'guardz';
 *
 * console.log(isBooleanLike(true)); // true
 * console.log(isBooleanLike(false)); // true
 * console.log(isBooleanLike("true")); // true
 * console.log(isBooleanLike("false")); // true
 * console.log(isBooleanLike("1")); // true
 * console.log(isBooleanLike("0")); // true
 * console.log(isBooleanLike(1)); // true
 * console.log(isBooleanLike(0)); // true
 * console.log(isBooleanLike("yes")); // false
 * console.log(isBooleanLike("no")); // false
 * console.log(isBooleanLike("")); // false
 * console.log(isBooleanLike(null)); // false
 * console.log(isBooleanLike(undefined)); // false
 *
 * // With type narrowing
 * const data: unknown = getDataFromAPI();
 * if (isBooleanLike(data)) {
 *   // data is now typed as boolean
 *   console.log(Boolean(data)); // Safe to convert
 * }
 * ```
 */
export const isBooleanLike: TypeGuardFn<boolean> = function (
  value,
  config
): value is boolean {
  // Check if it's already a boolean
  if (typeof value === 'boolean') {
    return true;
  }

  // Check if it's a string that can be converted to a boolean
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'true' || lower === 'false' || lower === '1' || lower === '0') {
      return true;
    }
    
    // Not a valid boolean string
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'boolean-like')
      );
    }
    return false;
  }

  // Check if it's a number that can be converted to a boolean
  if (typeof value === 'number') {
    if (value === 1 || value === 0) {
      return true;
    }
    
    // Not a valid boolean number
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'boolean-like')
      );
    }
    return false;
  }

  // Not a valid boolean-like value
  if (config) {
    config.callbackOnError(
      generateTypeGuardError(value, config.identifier, 'boolean-like')
    );
  }
  return false;
}; 