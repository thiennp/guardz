import { generateTypeGuardError } from './generateTypeGuardError';
import { stringify } from '@/stringify';
import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard that checks if a value is exactly equal to a specific value.
 *
 * Uses strict equality (===) for comparison. This is useful for literal types
 * and specific value validation.
 *
 * @template T - The literal type of the expected value
 * @param expectedValue - The exact value to compare against
 * @returns A type guard function that validates exact equality
 *
 * @example
 * ```typescript
 * import { isEqualTo } from 'guardz';
 *
 * const isHello = isEqualTo("hello");
 * const isZero = isEqualTo(0);
 * const isTrue = isEqualTo(true);
 * const isNull = isEqualTo(null);
 *
 * console.log(isHello("hello")); // true
 * console.log(isHello("Hello")); // false (case sensitive)
 * console.log(isZero(0)); // true
 * console.log(isZero("0")); // false (different types)
 * console.log(isTrue(true)); // true
 * console.log(isTrue(1)); // false
 *
 * // Useful for literal types
 * type Theme = "light" | "dark";
 * const isLightTheme = isEqualTo("light" as const);
 *
 * const data: unknown = getUserInput();
 * if (isLightTheme(data)) {
 *   // data is now typed as "light"
 *   console.log("Light theme selected");
 * }
 * ```
 */
export function isEqualTo<T>(expectedValue: T): TypeGuardFn<T> {
  return function (value, config): value is T {
    if (value !== expectedValue) {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(
            value,
            config.identifier,
            `equal to ${stringify(expectedValue)}`
          )
        );
      }
      return false;
    }
    return true;
  };
}
