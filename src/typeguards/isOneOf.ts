
import { stringify } from "@/stringify";
import type { TypeGuardFn } from "./isType";

/**
 * Creates a type guard that checks if a value matches one of several specific values.
 * 
 * This function creates a type guard that validates against a list of exact values
 * using strict equality (===). Useful for union types of literal values.
 *
 * @template T - The union type of all possible values
 * @param values - The list of valid values to check against
 * @returns A type guard function that validates against the provided values
 * 
 * @example
 * ```typescript
 * import { isOneOf } from 'guardz';
 * 
 * const isColor = isOneOf("red", "green", "blue");
 * const isStatus = isOneOf(200, 404, 500);
 * const isBooleanOrNull = isOneOf(true, false, null);
 * 
 * console.log(isColor("red")); // true
 * console.log(isColor("yellow")); // false
 * console.log(isStatus(404)); // true
 * console.log(isStatus(201)); // false
 * 
 * // With type narrowing
 * type Theme = "light" | "dark" | "auto";
 * const isTheme = isOneOf("light", "dark", "auto");
 * 
 * const data: unknown = getUserInput();
 * if (isTheme(data)) {
 *   // data is now typed as "light" | "dark" | "auto"
 *   console.log(`Theme selected: ${data}`);
 * }
 * 
 * // Mixed types
 * const isMixed = isOneOf("none", 0, false);
 * if (isMixed(data)) {
 *   // data is typed as "none" | 0 | false
 * }
 * ```
 */
export function isOneOf<T>(...acceptableValues: T[]): TypeGuardFn<T> {
  return function (value, config): value is T {
    const isValid = acceptableValues.some(function (acceptableValue) {
      return value === acceptableValue;
    });

    if (!isValid && config) {
      config.callbackOnError(
        `${config.identifier} (${stringify(value)}) must be one of following values ${acceptableValues
          .map(stringify)
          .join(" | ")}`,
      );
    }

    return isValid;
  };
}
