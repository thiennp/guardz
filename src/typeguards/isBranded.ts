import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn, TypeGuardFnConfig } from './isType';

/**
 * Branded type helper - creates a branded type with a specific brand identifier.
 * 
 * @template T - The base type
 * @template B - The brand identifier (string literal type)
 * @returns A branded type that extends T with a brand property
 * 
 * @example
 * ```typescript
 * type UserId = Branded<number, 'UserId'>;
 * type Email = Branded<string, 'Email'>;
 * ```
 */
export type Branded<T, B extends string> = T & { __brand: B };

/**
 * Creates a type guard function for a branded type.
 * 
 * This utility allows developers to create custom type guards for branded types
 * by providing a validation function that throws an error if validation fails.
 * 
 * @template T - The base type
 * @template U - The branded type (extends Branded<T, any>)
 * @param validation - A function that validates the value and throws an error if invalid
 * @returns A type guard function that validates and narrows to the branded type
 * 
 * @example
 * ```typescript
 * import { isBranded } from 'guardz';
 * 
 * // Define a branded type
 * type UserId = Branded<number, 'UserId'>;
 * 
 * // Create a type guard for UserId
 * const isUserId = isBranded<UserId>((value) => {
 *   if (typeof value !== 'number' || value <= 0 || !Number.isInteger(value)) {
 *     throw new Error('UserId must be a positive integer');
 *   }
 * });
 * 
 * // Usage
 * const id: unknown = 123;
 * if (isUserId(id)) {
 *   // id is now typed as UserId
 *   console.log(id); // number & { __brand: 'UserId' }
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
 * // Email validation
 * type Email = Branded<string, 'Email'>;
 * 
 * const isEmail = isBranded<Email>((value) => {
 *   if (typeof value !== 'string') {
 *     throw new Error('Email must be a string');
 *   }
 *   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 *   if (!emailRegex.test(value)) {
 *     throw new Error('Invalid email format');
 *   }
 * });
 * 
 * // Usage
 * const email: unknown = 'user@example.com';
 * if (isEmail(email)) {
 *   // email is now typed as Email
 *   console.log(email); // string & { __brand: 'Email' }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Complex validation with multiple checks
 * type Age = Branded<number, 'Age'>;
 * 
 * const isAge = isBranded<Age>((value) => {
 *   if (typeof value !== 'number') {
 *     throw new Error('Age must be a number');
 *   }
 *   if (!Number.isInteger(value)) {
 *     throw new Error('Age must be an integer');
 *   }
 *   if (value < 0) {
 *     throw new Error('Age cannot be negative');
 *   }
 *   if (value > 150) {
 *     throw new Error('Age cannot exceed 150');
 *   }
 * });
 * ```
 */
export function isBranded<T extends Branded<any, any>>(
  validation: (value: unknown) => void
): TypeGuardFn<T> {
  return function (value, config): value is T {
    try {
      validation(value);
      return true;
    } catch (error) {
      if (config) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        config.callbackOnError(
          generateTypeGuardError(value, config.identifier, errorMessage)
        );
      }
      return false;
    }
  };
}