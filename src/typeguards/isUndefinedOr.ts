import type { TypeGuardFn } from "./isType";

/**
 * Creates a type guard that checks if a value is either undefined or matches a specific type.
 * 
 * This is a higher-order function that takes a type guard and returns a new type guard
 * that also accepts undefined values.
 *
 * @param typeGuardFn - The type guard function to check against
 * @returns A new type guard function that accepts the original type or undefined
 * 
 * @example
 * ```typescript
 * import { isUndefinedOr, isString, isNumber } from 'guardz';
 * 
 * const isStringOrUndefined = isUndefinedOr(isString);
 * const isNumberOrUndefined = isUndefinedOr(isNumber);
 * 
 * console.log(isStringOrUndefined("hello")); // true
 * console.log(isStringOrUndefined(undefined)); // true
 * console.log(isStringOrUndefined(null)); // false
 * console.log(isStringOrUndefined(123)); // false
 * 
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isStringOrUndefined(data)) {
 *   // data is now typed as string | undefined
 *   console.log(data?.toUpperCase()); // Safe optional chaining
 * }
 * ```
 */
export function isUndefinedOr<T>(typeGuardFn: TypeGuardFn<T>): TypeGuardFn<T | undefined> {
  return function (value, config): value is T | undefined {
    if (value === undefined) {
      return true;
    }
    return typeGuardFn(value, config);
  };
}
