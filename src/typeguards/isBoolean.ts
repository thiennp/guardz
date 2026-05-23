import { reportTypeGuardError } from '../utils/reportTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a boolean.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a boolean, false otherwise
 *
 * @example
 * ```typescript
 * import { isBoolean } from 'guardz';
 *
 * console.log(isBoolean(true)); // true
 * console.log(isBoolean(false)); // true
 * console.log(isBoolean(1)); // false
 * console.log(isBoolean(0)); // false
 * console.log(isBoolean("true")); // false
 * console.log(isBoolean(null)); // false
 *
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isBoolean(data)) {
 *   // data is now typed as boolean
 *   console.log(data ? "yes" : "no");
 * }
 * ```
 */
export const isBoolean: TypeGuardFn<boolean> = function isBooleanGuard(
  value,
  config
): value is boolean {
  if (typeof value !== 'boolean') {
    reportTypeGuardError(config, value, 'boolean');
    return false;
  }
  return true;
};
