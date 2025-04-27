import type { TypeGuardFn, TypeGuardFnConfig } from "./isType";

/**
 * Creates a new type guard function that first checks using a base type guard
 * and then applies an additional refinement check (tolerance).
 *
 * @template T
 * @param {TypeGuardFn<T>} baseGuard - The base type guard function (e.g., isNumber).
 * @param {(value: T) => boolean} refinement - A function that performs the additional check (returns true if valid).
 * @returns {TypeGuardFn<T>} A new type guard function.
 */
export function guardWithTolerance<T>(
  baseGuard: TypeGuardFn<T>,
  refinement: (value: T) => boolean,
): TypeGuardFn<T> {
  return function (value: unknown, config?: TypeGuardFnConfig | null): value is T {
    // First, check if the base guard passes. If not, report error (if config provided) and return false.
    if (!baseGuard(value, config)) {
      return false;
    }
    // If the base guard passed, apply the refinement check.
    // No separate error reporting for refinement failure in this version.
    return refinement(value);
  };
}
