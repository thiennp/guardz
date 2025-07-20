import type { TypeGuardFn } from './isType';

/**
 * A type guard function that always returns true and types the value as unknown.
 *
 * This is useful when you want to explicitly indicate that a value can be of any type
 * but should be treated as unknown (requiring further type checking before use).
 *
 * @param _value - The value to check (always passes)
 * @param _config - Optional configuration (unused)
 * @returns Always returns true
 *
 * @example
 * ```typescript
 * import { isUnknown } from 'guardz';
 *
 * console.log(isUnknown("hello")); // true
 * console.log(isUnknown(123)); // true
 * console.log(isUnknown(null)); // true
 * console.log(isUnknown(undefined)); // true
 *
 * // Useful for accepting any input that needs further validation
 * const data: any = getDataFromAPI();
 * if (isUnknown(data)) {
 *   // data is now typed as unknown, forcing you to validate further
 *   // console.log(data.someProperty); // TypeScript error
 * }
 * ```
 */
export const isUnknown: TypeGuardFn<unknown> = function (
  _value: unknown
): _value is unknown {
  return true;
};
