import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard that checks if a value is an array where each item matches a specific type.
 *
 * This is a higher-order function that takes a type guard for the items and returns
 * a type guard for arrays containing those items.
 *
 * @param predicate - The type guard function to apply to each array item
 * @returns A type guard function that checks if the value is an array with valid items
 *
 * @example
 * ```typescript
 * import { isArrayWithEachItem, isString, isNumber, isType } from 'guardz';
 *
 * const isStringArray = isArrayWithEachItem(isString);
 * const isNumberArray = isArrayWithEachItem(isNumber);
 *
 * console.log(isStringArray(["hello", "world"])); // true
 * console.log(isStringArray([])); // true (empty array is valid)
 * console.log(isStringArray(["hello", 123])); // false (mixed types)
 * console.log(isStringArray("not an array")); // false
 *
 * // With complex types
 * const isUser = isType({ name: isString, age: isNumber });
 * const isUserArray = isArrayWithEachItem(isUser);
 *
 * const users = [{ name: "John", age: 30 }, { name: "Jane", age: 25 }];
 * if (isUserArray(users)) {
 *   // users is now typed as Array<{ name: string; age: number; }>
 *   users.forEach(user => console.log(user.name));
 * }
 * ```
 */
export function isArrayWithEachItem<T>(
  predicate: TypeGuardFn<T>
): TypeGuardFn<T[]> {
  const arrayGuard = function (value: unknown, config?: import('./isType').TypeGuardFnConfig | null): value is T[] {
    if (!Array.isArray(value)) {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(value, config.identifier, 'Array')
        );
      }
      return false;
    }

    return value.every((item, index) =>
      predicate(
        item,
        config
          ? {
              ...config,
              identifier: `${config.identifier}[${index}]`,
            }
          : null
      )
    );
  };
  
  // Set the name property so getExpectedTypeName can identify it as an Array type guard
  Object.defineProperty(arrayGuard, 'name', {
    value: 'isArray',
    writable: false,
    configurable: true
  });
  
  return arrayGuard;
}
