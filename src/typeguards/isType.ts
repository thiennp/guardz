import { isNonNullObject } from './isNonNullObject';
import { validateObject, reportValidationResults } from '../utils/validationUtils';
import { attachTypeGuardMeta } from '../utils/typeGuardMeta';

export interface TypeGuardFnConfig {
  readonly callbackOnError: (errorMessage: string) => void;
  readonly identifier: string;
  readonly errorMode?: 'single' | 'multi' | 'json';
}

export type TypeGuardFn<T> = (
  value: unknown,
  config?: TypeGuardFnConfig | null
) => value is T;

/**
 * Creates a type guard function for validating objects against a schema.
 *
 * The data type that comes from different sources (like from server side, library, url params) is not always reliable.
 * Therefore, we need to use this function to ensure the data type is correct.
 *
 * @template T - The type to validate
 * @param propsTypesToCheck - Object mapping property keys to their type guard functions
 * @returns A type guard function that validates the object structure
 *
 * @example
 * ```typescript
 * import { isType, isString, isNumber } from 'guardz';
 *
 * interface User {
 *   name: string;
 *   age: number;
 * }
 *
 * const isUser = isType<User>({
 *   name: isString,
 *   age: isNumber,
 * });
 *
 * const data: unknown = { name: 'John', age: 30 };
 * if (isUser(data)) {
 *   // TypeScript now knows data is User
 *   console.log(data.name); // Safe to access
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Nested object validation
 * interface Address {
 *   street: string;
 *   city: string;
 * }
 *
 * interface User {
 *   name: string;
 *   address: Address;
 * }
 *
 * const isAddress = isType<Address>({
 *   street: isString,
 *   city: isString,
 * });
 *
 * const isUser = isType<User>({
 *   name: isString,
 *   address: isAddress,
 * });
 * ```
 */
export function isType<T>(propsTypesToCheck: {
  [P in keyof T]: TypeGuardFn<T[P]>;
}): TypeGuardFn<T> {
  // Validate input
  if (!isNonNullObject(propsTypesToCheck, null)) {
    throw new TypeError('propsTypesToCheck must be a non-null object');
  }

  function isTypeGuard(value: unknown, config?: TypeGuardFnConfig | null): value is T {
    const errorMode = config?.errorMode || 'multi';

    if (errorMode === 'multi' || errorMode === 'json') {
      const context = {
        path: config?.identifier || 'root',
        config: config || null
      };

      const result = validateObject(value, propsTypesToCheck, context);
      reportValidationResults(result, config || null);

      return result.valid;
    }

    if (!isNonNullObject(value, config)) return false;

    return Object.keys(propsTypesToCheck).every(function (key) {
      const typeGuardFn = propsTypesToCheck[key as keyof T];
      return typeGuardFn(
        value[key],
        config ? { ...config, identifier: `${config.identifier}.${key}` } : null
      );
    });
  }

  return attachTypeGuardMeta(isTypeGuard, { schema: propsTypesToCheck });
}
