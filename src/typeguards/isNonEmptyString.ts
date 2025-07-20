import { generateTypeGuardError } from './generateTypeGuardError';
import type { NonEmptyString } from '@/types/NonEmptyString';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a non-empty string.
 *
 * Note: This function trims whitespace, so strings containing only whitespace
 * characters will be considered empty.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a non-empty string (after trimming), false otherwise
 *
 * @example
 * ```typescript
 * import { isNonEmptyString } from 'guardz';
 *
 * console.log(isNonEmptyString("hello")); // true
 * console.log(isNonEmptyString("a")); // true
 * console.log(isNonEmptyString("")); // false
 * console.log(isNonEmptyString("   ")); // false (only whitespace)
 * console.log(isNonEmptyString(" hello ")); // true (has content after trim)
 * console.log(isNonEmptyString(123)); // false
 * console.log(isNonEmptyString(null)); // false
 *
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isNonEmptyString(data)) {
 *   // data is now typed as NonEmptyString
 *   console.log(data.toUpperCase()); // Safe to use string methods
 * }
 * ```
 */
export const isNonEmptyString: TypeGuardFn<NonEmptyString> = function (
  value,
  config
): value is NonEmptyString {
  if (typeof value !== 'string' || value.trim().length === 0) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'NonEmptyString')
      );
    }
    return false;
  }
  return true;
};
