import { Nullable } from '@/types/Nullable';
import type { TypeGuardFn, TypeGuardFnConfig } from './isType';

/**
 * Validates data against a type guard but returns the data regardless of validation result.
 *
 * This function is useful when you want to perform type validation and log errors,
 * but still proceed with the potentially invalid data. It will attempt validation
 * and trigger error callbacks if provided, but always returns the data cast to the expected type.
 *
 * @template T - The expected type after validation
 * @param data - The data to validate
 * @param typeGuardFn - The type guard function to use for validation
 * @param config - Optional configuration for error handling
 * @returns The data cast to type T (regardless of validation result)
 *
 * @example
 * ```typescript
 * import { guardWithTolerance, isString, isType } from 'guardz';
 *
 * interface User {
 *   name: string;
 *   age: number;
 * }
 *
 * const isUser = isType<User>({ name: isString, age: isNumber });
 *
 * // Data from unreliable source
 * const userData: unknown = { name: "John", age: "30" }; // age is string, not number
 *
 * // Use with error logging
 * const user = guardWithTolerance(userData, isUser, {
 *   identifier: 'userData',
 *   callbackOnError: (error) => {
 *     console.warn('Validation failed:', error);
 *     // Log to monitoring service, etc.
 *   }
 * });
 *
 * // user is typed as User, even though validation failed
 * // You can proceed with the data but should handle potential issues
 * console.log(user.name); // Works fine
 * // Be careful with user.age since it might not be a number
 *
 * // Without error handling - just cast and proceed
 * const user2 = guardWithTolerance(userData, isUser);
 * ```
 */
export function guardWithTolerance<T>(
  data: unknown,
  typeGuardFn: TypeGuardFn<T>,
  config?: Nullable<TypeGuardFnConfig>
): T {
  typeGuardFn(data, config);
  return data as T;
}
