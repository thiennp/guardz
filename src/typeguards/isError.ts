import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is an Error object.
 *
 * This type guard validates that a value is an Error instance or a subclass of Error.
 * It's useful for error handling and validation in try-catch blocks.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is an Error object, false otherwise
 *
 * @example
 * ```typescript
 * import { isError } from 'guardz';
 *
 * console.log(isError(new Error('Something went wrong'))); // true
 * console.log(isError(new TypeError('Invalid type'))); // true
 * console.log(isError(new ReferenceError('Not defined'))); // true
 * console.log(isError('error message')); // false (string)
 * console.log(isError(123)); // false (number)
 * console.log(isError({ message: 'error' })); // false (plain object)
 *
 * // With type narrowing
 * const data: unknown = getErrorData();
 * if (isError(data)) {
 *   // data is now typed as Error
 *   console.log('Error message:', data.message);
 *   console.log('Error stack:', data.stack);
 * }
 *
 * // With error handling
 * try {
 *   // Some operation that might throw
 *   throw new Error('Operation failed');
 * } catch (error) {
 *   if (isError(error, { identifier: 'caughtError' })) {
 *     // error is now typed as Error
 *     console.error('Caught error:', error.message);
 *   } else {
 *     console.error('Unknown error type:', error);
 *   }
 * }
 * ```
 */
export const isError: TypeGuardFn<Error> = function (
  value,
  config
): value is Error {
  if (!(value instanceof Error)) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'Error')
      );
    }
    return false;
  }

  return true;
};
