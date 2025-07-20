import { isOneOf } from './isOneOf';
import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard that checks if a value matches any value from an enum.
 *
 * This function extracts all values from an enum object and creates a type guard
 * that validates against any of those values.
 *
 * @template T - The enum type
 * @param enumValue - The enum object to check against
 * @returns A type guard function that validates enum values
 *
 * @example
 * ```typescript
 * import { isEnum } from 'guardz';
 *
 * enum Color {
 *   RED = "red",
 *   GREEN = "green",
 *   BLUE = "blue"
 * }
 *
 * enum Status {
 *   PENDING = 0,
 *   APPROVED = 1,
 *   REJECTED = 2
 * }
 *
 * const isColor = isEnum(Color);
 * const isStatus = isEnum(Status);
 *
 * console.log(isColor("red")); // true
 * console.log(isColor("blue")); // true
 * console.log(isColor("yellow")); // false
 * console.log(isStatus(1)); // true
 * console.log(isStatus(5)); // false
 *
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isColor(data)) {
 *   // data is now typed as Color
 *   console.log(`Selected color: ${data}`);
 * }
 * ```
 */
export function isEnum<T extends Record<number | string, unknown>>(
  enumValue: T
): TypeGuardFn<T[keyof T]> {
  return function (value, config): value is T[keyof T] {
    return isOneOf(...Object.values(enumValue))(value, config);
  };
}
