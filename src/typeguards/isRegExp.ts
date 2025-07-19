import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a RegExp object.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a RegExp object, false otherwise
 * 
 * @example
 * ```typescript
 * import { isRegExp } from 'guardz';
 * 
 * console.log(isRegExp(/abc/)); // true
 * console.log(isRegExp(new RegExp('abc'))); // true
 * console.log(isRegExp(/abc/g)); // true
 * console.log(isRegExp("abc")); // false
 * console.log(isRegExp(123)); // false
 * console.log(isRegExp(null)); // false
 * 
 * // With type narrowing
 * const data: unknown = /^[a-z]+$/i;
 * if (isRegExp(data)) {
 *   // data is now typed as RegExp
 *   console.log(data.test("hello")); // true
 *   console.log(data.flags); // "i"
 * }
 * ```
 */
export const isRegExp: TypeGuardFn<RegExp> = function (value, config): value is RegExp {
  if (!(value instanceof RegExp)) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "RegExp"));
    }
    return false;
  }
  return true;
}; 