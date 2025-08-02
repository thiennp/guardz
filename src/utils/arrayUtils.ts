import type { TypeGuardFn } from '../typeguards/isType';

/**
 * Creates an array-compatible version of a type guard that can be used directly
 * with array methods like filter, map, find, etc.
 * 
 * This wrapper handles the parameter mismatch between array methods (which pass
 * value, index, array) and our type guards (which expect value, config).
 * 
 * @param typeGuard - The type guard function to wrap
 * @returns A function that can be used directly with array methods
 */
export function by<T>(typeGuard: TypeGuardFn<T>): (value: unknown) => value is T {
  return function(value: unknown): value is T {
    return typeGuard(value, null);
  };
}
