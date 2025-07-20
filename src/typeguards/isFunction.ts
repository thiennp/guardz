import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a function.
 *
 * This type guard validates that a value is callable, including regular functions,
 * arrow functions, class constructors, and methods.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a function, false otherwise
 *
 * @example
 * ```typescript
 * import { isFunction } from 'guardz';
 *
 * console.log(isFunction(() => {})); // true
 * console.log(isFunction(function() {})); // true
 * console.log(isFunction(class {})); // true
 * console.log(isFunction(Math.max)); // true
 * console.log(isFunction('not a function')); // false
 * console.log(isFunction(123)); // false
 *
 * // With type narrowing
 * const data: unknown = getCallback();
 * if (isFunction(data)) {
 *   // data is now typed as Function
 *   data(); // Safe to call
 * }
 *
 * // With error handling
 * const callback: unknown = getCallback();
 * if (!isFunction(callback, { identifier: 'onSuccess' })) {
 *   console.error('Invalid callback function');
 *   return;
 * }
 * // callback is now typed as Function
 * ```
 */
export const isFunction: TypeGuardFn<Function> = function (
  value,
  config
): value is Function {
  if (typeof value !== 'function') {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'Function')
      );
    }
    return false;
  }

  return true;
};
