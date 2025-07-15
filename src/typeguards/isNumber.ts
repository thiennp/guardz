import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a valid number (excludes NaN).
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a valid number (not NaN), false otherwise
 * 
 * @example
 * ```typescript
 * import { isNumber } from 'guardz';
 * 
 * console.log(isNumber(123)); // true
 * console.log(isNumber(0)); // true
 * console.log(isNumber(-42.5)); // true
 * console.log(isNumber(Infinity)); // true
 * console.log(isNumber(NaN)); // false
 * console.log(isNumber("123")); // false
 * console.log(isNumber(null)); // false
 * 
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isNumber(data)) {
 *   // data is now typed as number
 *   console.log(data.toFixed(2));
 * }
 * ```
 */
export const isNumber: TypeGuardFn<number> = function (value, config): value is number {
  if (typeof value !== "number" || isNaN(value)) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "number"));
    }
    return false;
  }

  return true;
};
