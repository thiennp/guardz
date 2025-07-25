import { isNullOr } from './isNullOr';
import { isUndefinedOr } from './isUndefinedOr';
import type { TypeGuardFn } from './isType';

/**
 * A function that takes a type guard function of type T,
 * and returns a new function that checks if a value is either of type T, null, or undefined.
 * This is equivalent to `isUndefinedOr(isNullOr(typeGuardFn))`.
 *
 * @param {function} typeGuardFn - the callback function that checks if a value is of type T
 * @returns {function} - a function that returns true if the value is of type T, null, or undefined, false otherwise
 *
 * @example
 * ```typescript
 * import { isNilOr, isString } from 'guardz';
 *
 * const isStringOrNil = isNilOr(isString);
 *
 * console.log(isStringOrNil("hello")); // true
 * console.log(isStringOrNil(null)); // true
 * console.log(isStringOrNil(undefined)); // true
 * console.log(isStringOrNil(123)); // false
 *
 * // Usage with type narrowing
 * const data: unknown = getDataFromSomewhere();
 * if (isStringOrNil(data)) {
 *   // data is now typed as string | null | undefined
 *   console.log(data?.toUpperCase()); // TypeScript knows this is safe
 * }
 * ```
 */
export function isNilOr<T>(
  typeGuardFn: TypeGuardFn<T>
): TypeGuardFn<T | null | undefined> {
  return isUndefinedOr(isNullOr(typeGuardFn));
}
