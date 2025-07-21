import { isType, type TypeGuardFn, type TypeGuardFnConfig } from './isType';

/**
 * Alias for isType - creates a type guard function for a specific object shape.
 * 
 * This function is an alias for isType and provides a shorter, more concise name
 * for creating type guards that validate object structures.
 *
 * @param propsTypesToCheck - Object mapping property keys to their type guard functions
 * @returns A type guard function that validates the object structure
 * 
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 * 
 * const isUser = isObject<User>({
 *   id: isNumber,
 *   name: isString,
 *   email: isString,
 * });
 * 
 * const user = { id: 1, name: 'John', email: 'john@example.com' };
 * if (isUser(user)) {
 *   // user is now typed as User
 *   console.log(user.name); // TypeScript knows this is a string
 * }
 * ```
 */
export function isObject<T>(propsTypesToCheck: {
  [P in keyof T]: TypeGuardFn<T[P]>;
}): TypeGuardFn<T> {
  return isType(propsTypesToCheck);
}

// Re-export types for convenience
export type { TypeGuardFn, TypeGuardFnConfig }; 