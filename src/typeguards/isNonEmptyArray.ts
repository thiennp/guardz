import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn, TypeGuardFnConfig } from "./isType";
import type { NonEmptyArray } from "@/types/NonEmptyArray";

/**
 * Checks if a value is a non-empty array.
 * 
 * This function validates that the value is an array and contains at least one element.
 * It does not validate the types of the elements within the array.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a non-empty array, false otherwise
 * 
 * @example
 * ```typescript
 * import { isNonEmptyArray } from 'guardz';
 * 
 * console.log(isNonEmptyArray([1, 2, 3])); // true
 * console.log(isNonEmptyArray(["hello"])); // true
 * console.log(isNonEmptyArray([null, undefined])); // true (contains elements)
 * console.log(isNonEmptyArray([])); // false (empty)
 * console.log(isNonEmptyArray("not array")); // false
 * console.log(isNonEmptyArray(null)); // false
 * 
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isNonEmptyArray(data)) {
 *   // data is now typed as NonEmptyArray<unknown>
 *   console.log(data[0]); // Safe to access first element
 *   console.log(data.length); // Will be >= 1
 * }
 * 
 * // Combine with other type guards for specific element types
 * import { isArrayWithEachItem, isString } from 'guardz';
 * const isStringArray = isArrayWithEachItem(isString);
 * 
 * if (isNonEmptyArray(data) && isStringArray(data)) {
 *   // data is now a non-empty array of strings
 * }
 * ```
 */
export const isNonEmptyArray = function <T>(value: T[] | undefined | null, config?: TypeGuardFnConfig | null): value is NonEmptyArray<T> {
  if (!Array.isArray(value) || value.length === 0) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "NonEmptyArray"));
    }
    return false;
  }
  return true;
};
