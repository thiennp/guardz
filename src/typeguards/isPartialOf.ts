import { isNonNullObject } from './isNonNullObject';
import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard that checks if a value is a partial object matching a specific type.
 * 
 * This function validates that an object contains a subset of properties from a given type,
 * where all present properties must match their expected types. Missing properties are allowed.
 * This is useful for validating optional or incomplete data structures.
 *
 * @param propsTypesToCheck - Object mapping property names to their type guard functions
 * @returns A type guard function that validates partial objects
 *
 * @example
 * ```typescript
 * import { isPartialOf, isString, isNumber, isBoolean } from 'guardz';
 *
 * interface User {
 *   name: string;
 *   age: number;
 *   email: string;
 *   isActive: boolean;
 * }
 *
 * // Create a partial type guard for User
 * const isPartialUser = isPartialOf<User>({
 *   name: isString,
 *   age: isNumber,
 *   email: isString,
 *   isActive: isBoolean
 * });
 *
 * // Valid partial objects
 * console.log(isPartialUser({ name: "John" })); // true
 * console.log(isPartialUser({ name: "John", age: 30 })); // true
 * console.log(isPartialUser({ name: "John", age: 30, email: "john@example.com" })); // true
 * console.log(isPartialUser({})); // true (empty object is valid)
 *
 * // Invalid partial objects
 * console.log(isPartialUser({ name: 123 })); // false (wrong type)
 * console.log(isPartialUser({ name: "John", age: "30" })); // false (wrong type)
 * console.log(isPartialUser("not an object")); // false (not an object)
 *
 * // With type narrowing
 * const data: unknown = getPartialUserData();
 * if (isPartialUser(data)) {
 *   // data is now typed as Partial<User>
 *   if (data.name) {
 *     console.log(`User name: ${data.name}`); // Safe to access
 *   }
 *   if (data.age) {
 *     console.log(`User age: ${data.age}`); // Safe to access
 *   }
 * }
 * ```
 */
export function isPartialOf<T>(propsTypesToCheck: {
  [P in keyof T]?: TypeGuardFn<T[P]>;
}): TypeGuardFn<Partial<T>> {
  return function (value, config): value is Partial<T> {
    if (!isNonNullObject(value, config)) {
      return false;
    }

    for (const key in propsTypesToCheck) {
      if (
        Object.prototype.hasOwnProperty.call(propsTypesToCheck, key) &&
        Object.prototype.hasOwnProperty.call(value, key)
      ) {
        const typeGuardFn = propsTypesToCheck[key as keyof T];
        const propertyValue = value[key as keyof typeof value];

        if (
          typeGuardFn &&
          !typeGuardFn(
            propertyValue,
            config
              ? { ...config, identifier: `${config.identifier}.${key}` }
              : null
          )
        ) {
          return false;
        }
      }
    }

    return true;
  };
}
