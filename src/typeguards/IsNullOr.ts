import type { TypeGuardFn } from "./isType";

/**
 * Creates a type guard that checks if a value is either null or matches a specific type.
 * 
 * This is a higher-order function that takes a type guard and returns a new type guard
 * that also accepts null values.
 *
 * @param typeGuardFn - The type guard function to check against
 * @returns A new type guard function that accepts the original type or null
 * 
 * @example
 * ```typescript
 * import { isNullOr, isString, isNumber } from 'guardz';
 * 
 * const isStringOrNull = isNullOr(isString);
 * const isNumberOrNull = isNullOr(isNumber);
 * 
 * console.log(isStringOrNull("hello")); // true
 * console.log(isStringOrNull(null)); // true
 * console.log(isStringOrNull(undefined)); // false
 * console.log(isStringOrNull(123)); // false
 * 
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isStringOrNull(data)) {
 *   // data is now typed as string | null
 *   console.log(data?.toUpperCase()); // Safe optional chaining
 * }
 * ```
 */
export function isNullOr<T>(typeGuardFn: TypeGuardFn<T>): TypeGuardFn<T | null> {
  return function (value, config): value is T | null {
    if (value === null) {
      return true;
    }
    return typeGuardFn(value, config);
  };
}
