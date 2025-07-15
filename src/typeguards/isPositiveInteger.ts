import { generateTypeGuardError } from "./generateTypeGuardError";
import type { PositiveInteger } from "@/types/PositiveInteger";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a positive integer (greater than 0 and a whole number).
 * 
 * Note: This excludes zero, negative numbers, decimals, NaN, and Infinity.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a positive integer, false otherwise
 * 
 * @example
 * ```typescript
 * import { isPositiveInteger } from 'guardz';
 * 
 * console.log(isPositiveInteger(1)); // true
 * console.log(isPositiveInteger(42)); // true
 * console.log(isPositiveInteger(100)); // true
 * console.log(isPositiveInteger(0)); // false (zero is not positive)
 * console.log(isPositiveInteger(-1)); // false
 * console.log(isPositiveInteger(1.5)); // false (not an integer)
 * console.log(isPositiveInteger(NaN)); // false
 * console.log(isPositiveInteger("5")); // false
 * 
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isPositiveInteger(data)) {
 *   // data is now typed as PositiveInteger
 *   console.log(`ID: ${data}`); // Safe to use as positive integer
 * }
 * ```
 */
export const isPositiveInteger: TypeGuardFn<PositiveInteger> = function (value, config): value is PositiveInteger {
  if (typeof value !== "number" || isNaN(value) || value <= 0 || !isFinite(value) || !Number.isInteger(value)) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "PositiveInteger"));
    }
    return false;
  }
  return true;
}; 