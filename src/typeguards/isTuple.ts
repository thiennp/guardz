import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard that validates a tuple (fixed-length array with specific types at each position).
 *
 * This is useful for validating coordinate pairs, RGB values, or any data structure
 * where you need exactly N elements of specific types in a specific order.
 *
 * @param typeGuards - Array of type guard functions for each position in the tuple
 * @returns A type guard function that validates the tuple structure
 *
 * @example
 * ```typescript
 * import { isTuple, isString, isNumber, isBoolean } from 'guardz';
 *
 * // Coordinate pair [x, y]
 * const isCoordinate = isTuple(isNumber, isNumber);
 *
 * // RGB color [red, green, blue]
 * const isRGBColor = isTuple(isNumber, isNumber, isNumber);
 *
 * // Mixed tuple [name, age, isActive]
 * const isUserTuple = isTuple(isString, isNumber, isBoolean);
 *
 * console.log(isCoordinate([10, 20])); // true
 * console.log(isCoordinate([10])); // false (wrong length)
 * console.log(isCoordinate([10, "20"])); // false (wrong type)
 *
 * console.log(isRGBColor([255, 128, 0])); // true
 * console.log(isUserTuple(["John", 30, true])); // true
 *
 * // With type narrowing
 * const data: unknown = getDataFromAPI();
 * if (isCoordinate(data)) {
 *   // data is now typed as [number, number]
 *   const [x, y] = data;
 *   console.log(`Position: (${x}, ${y})`);
 * }
 * ```
 */
export function isTuple<T extends readonly unknown[]>(
  ...typeGuards: { [K in keyof T]: TypeGuardFn<T[K]> }
): TypeGuardFn<T> {
  return function (value, config): value is T {
    if (!Array.isArray(value)) {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(value, config.identifier, 'array')
        );
      }
      return false;
    }

    if (value.length !== typeGuards.length) {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(
            value,
            config.identifier,
            `tuple of length ${typeGuards.length}, but got length ${value.length}`
          )
        );
      }
      return false;
    }

    return typeGuards.every((guard, index) =>
      guard(
        value[index],
        config
          ? { ...config, identifier: `${config.identifier}[${index}]` }
          : null
      )
    );
  };
}
