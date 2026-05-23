import type { TypeGuardFn, TypeGuardFnConfig } from './isType';
import { attachTypeGuardMeta } from '../utils/typeGuardMeta';

/**
 * A function that takes a type guard function of type T,
 * and returns a new function that checks if a value is either of type T, null, or undefined.
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
  function isNilOrGuard(
    value: unknown,
    config?: TypeGuardFnConfig | null
  ): value is T | null | undefined {
    if (value === null || value === undefined) {
      return true;
    }
    return typeGuardFn(value, config);
  }

  return attachTypeGuardMeta(isNilOrGuard, {
    innerGuard: typeGuardFn,
    wrapperKind: 'nilOr',
  });
}
