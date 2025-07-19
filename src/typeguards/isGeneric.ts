import type { TypeGuardFn, TypeGuardFnConfig } from "./isType";

/**
 * Creates a generic type guard function that wraps another type guard.
 * This is useful for creating reusable type guards that can be applied to different contexts
 * while maintaining the same validation logic.
 *
 * @param typeGuard - The type guard function to wrap
 * @returns A generic type guard function that uses the provided type guard
 * 
 * @example
 * ```typescript
 * import { isGeneric, isString, isNumber } from 'guardz';
 * 
 * // Create a generic string validator
 * const isGenericString = isGeneric(isString);
 * 
 * // Use it in different contexts
 * const data1: unknown = "hello";
 * const data2: unknown = 123;
 * 
 * if (isGenericString(data1)) {
 *   console.log(data1.toUpperCase()); // data1 is typed as string
 * }
 * 
 * if (isGenericString(data2)) {
 *   console.log(data2.toUpperCase()); // This won't execute
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Create a generic number validator
 * const isGenericNumber = isGeneric(isNumber);
 * 
 * interface User {
 *   id: number;
 *   age: number;
 *   score: number;
 * }
 * 
 * const isUser = isType<User>({
 *   id: isGenericNumber,
 *   age: isGenericNumber,
 *   score: isGenericNumber,
 * });
 * 
 * const user: unknown = { id: 1, age: 25, score: 100 };
 * if (isUser(user)) {
 *   console.log(user.id + user.age + user.score); // All are typed as number
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // With error handling
 * const isGenericString = isGeneric(isString);
 * 
 * const errors: string[] = [];
 * const config = {
 *   identifier: 'user.name',
 *   callbackOnError: (error: string) => errors.push(error),
 * };
 * 
 * const data: unknown = 123;
 * const result = isGenericString(data, config);
 * // errors now contains: [ 'Expected user.name ("123") to be "string"' ]
 * ```
 */
export function isGeneric<T>(typeGuard: TypeGuardFn<T>): TypeGuardFn<T> {
  return function (value: unknown, config?: TypeGuardFnConfig | null): value is T {
    return typeGuard(value, config);
  };
} 