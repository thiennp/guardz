import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * A predicate function that validates a value and returns true if valid, false otherwise.
 * 
 * @param value - The value to validate
 * @returns True if the value is valid, false otherwise
 */
export type PredicateFn = (value: unknown) => boolean;

/**
 * Branded type helper - creates a branded type with a specific brand identifier.
 * 
 * Supports both string literal types and unique symbols for maximum flexibility.
 * 
 * @template T - The base type
 * @template B - The brand identifier (string literal type or unique symbol)
 * @returns A branded type that extends T with a brand property
 * 
 * @example
 * ```typescript
 * // String-based brands (current approach)
 * type UserId = Branded<number, 'UserId'>;
 * type Email = Branded<string, 'Email'>;
 * 
 * // Symbol-based brands (unique symbol approach)
 * const UserIdBrand = Symbol('UserId') as unique symbol;
 * type UserIdSymbol = Branded<number, typeof UserIdBrand>;
 * 
 * const EmailBrand = Symbol('Email') as unique symbol;
 * type EmailSymbol = Branded<string, typeof EmailBrand>;
 * ```
 */
export type Branded<T, B extends string | symbol> = T & { readonly brand: B };

/**
 * Creates a type guard function for a branded type.
 * 
 * This utility allows developers to create custom type guards for branded types
 * by providing a predicate function that returns true if the value is valid.
 * 
 * @template T - The base type
 * @template U - The branded type (extends Branded<T, any>)
 * @param predicate - A PredicateFn that validates the value and returns true if valid, false otherwise
 * @returns A type guard function that validates and narrows to the branded type
 * 
 * @example
 * ```typescript
 * import { isBranded } from 'guardz';
 * 
 * // String-based branded type
 * type UserId = Branded<number, 'UserId'>;
 * 
 * // Create a type guard for UserId
 * const isUserId = isBranded<UserId>((value) => {
 *   return typeof value === 'number' && value > 0 && Number.isInteger(value);
 * });
 * 
 * // Usage
 * const id: unknown = 123;
 * if (isUserId(id)) {
 *   // id is now typed as UserId
 *   console.log(id); // number & { readonly brand: 'UserId' }
 * }
 * 
 * // With error handling
 * const invalidId: unknown = -1;
 * isUserId(invalidId, {
 *   callbackOnError: (error) => console.error(error),
 *   identifier: 'userId'
 * }); // false, calls error callback
 * ```
 * 
 * @example
 * ```typescript
 * // Email validation with string brand
 * type Email = Branded<string, 'Email'>;
 * 
 * const isEmail = isBranded<Email>((value) => {
 *   if (typeof value !== 'string') return false;
 *   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 *   return emailRegex.test(value);
 * });
 * 
 * // Usage
 * const email: unknown = 'user@example.com';
 * if (isEmail(email)) {
 *   // email is now typed as Email
 *   console.log(email); // string & { readonly brand: 'Email' }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Unique symbol branded types
 * const UserIdBrand = Symbol('UserId') as unique symbol;
 * type UserIdSymbol = Branded<number, typeof UserIdBrand>;
 * 
 * const isUserIdSymbol = isBranded<UserIdSymbol>((value) => {
 *   return typeof value === 'number' && value > 0 && Number.isInteger(value);
 * });
 * 
 * // Usage
 * const id: unknown = 456;
 * if (isUserIdSymbol(id)) {
 *   // id is now typed as UserIdSymbol
 *   console.log(id); // number & { readonly brand: typeof UserIdBrand }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Complex validation with multiple checks
 * type Age = Branded<number, 'Age'>;
 * 
 * const isAge = isBranded<Age>((value) => {
 *   if (typeof value !== 'number') return false;
 *   if (!Number.isInteger(value)) return false;
 *   if (value < 0) return false;
 *   if (value > 150) return false;
 *   return true;
 * });
 * ```
 */
export function isBranded<T extends Branded<any, any>>(
  predicate: PredicateFn
): TypeGuardFn<T> {
  return function (value, config): value is T {
    if (!predicate(value)) {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(value, config.identifier, 'branded type validation')
        );
      }
      return false;
    }
    return true;
  };
}
