import { stringify } from "@/stringify";

import type { TypeGuardFn } from "./isType";

/**
 * Creates a type guard that checks if a value matches at least one of several type guards.
 * 
 * This is different from `isOneOf` which checks against literal values. This function
 * combines multiple type guard functions and returns true if the value passes any of them.
 * Useful for union types where each type needs its own validation logic.
 *
 * @template T - The union type of all possible types
 * @param typeGuards - Array of type guard functions to check against
 * @returns A type guard function that validates against any of the provided type guards
 * 
 * @example
 * ```typescript
 * import { isOneOfTypes, isString, isNumber, isBoolean, isType } from 'guardz';
 * 
 * // Simple union types
 * const isStringOrNumber = isOneOfTypes(isString, isNumber);
 * const isPrimitive = isOneOfTypes(isString, isNumber, isBoolean);
 * 
 * console.log(isStringOrNumber("hello")); // true
 * console.log(isStringOrNumber(42)); // true
 * console.log(isStringOrNumber(true)); // false
 * 
 * // Complex union types
 * interface User {
 *   type: "user";
 *   name: string;
 * }
 * 
 * interface Admin {
 *   type: "admin";
 *   permissions: string[];
 * }
 * 
 * const isUser = isType<User>({ type: isEqualTo("user"), name: isString });
 * const isAdmin = isType<Admin>({ type: isEqualTo("admin"), permissions: isArrayWithEachItem(isString) });
 * const isPerson = isOneOfTypes(isUser, isAdmin);
 * 
 * const data: unknown = getUserInput();
 * if (isPerson(data)) {
 *   // data is now typed as User | Admin
 *   console.log(data.type); // TypeScript knows this exists on both types
 * }
 * ```
 */
export function isOneOfTypes<T>(...typeGuards: TypeGuardFn<T>[]): TypeGuardFn<T> {
  return function (value: unknown, config): value is T {
    const isValid = typeGuards.some((typeGuard) => typeGuard(value, null));

    if (!isValid && config) {
      const valueString = stringify(value);
      const displayValue = valueString.length > 200 ? config.identifier : `${config.identifier} (${valueString})`;

      const errorMessages = [
        `Expected ${displayValue} type to match one of "${typeGuards.map((fn) => fn.name).join(" | ")}"`,
      ];

      typeGuards.forEach((typeGuard) =>
        typeGuard(value, {
          ...config,
          callbackOnError: (error) => {
            const newError = `- ${error}`;
            if (!errorMessages.includes(newError)) {
              errorMessages.push(newError);
            }
          },
        }),
      );

      config.callbackOnError(errorMessages.join("\n"));
    }

    return isValid;
  };
}
