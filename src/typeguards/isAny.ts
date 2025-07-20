import type { TypeGuardFn } from './isType';

/**
 * A type guard function that always returns true for any value.
 *
 * This is useful when you need a type guard that accepts any type,
 * typically for testing or when building generic type guard compositions.
 *
 * @param _value - The value to check (always passes)
 * @param _config - Optional configuration (unused)
 * @returns Always returns true
 *
 * @example
 * ```typescript
 * import { isAny } from 'guardz';
 *
 * console.log(isAny("hello")); // true
 * console.log(isAny(123)); // true
 * console.log(isAny(null)); // true
 * console.log(isAny(undefined)); // true
 * console.log(isAny({})); // true
 * console.log(isAny([])); // true
 *
 * // Useful in type guard compositions
 * import { isArrayWithEachItem } from 'guardz';
 * const isArrayOfAnything = isArrayWithEachItem(isAny);
 * ```
 */
export const isAny: TypeGuardFn<unknown> = function <T>(
  _value: unknown
): _value is T {
  return true;
};
