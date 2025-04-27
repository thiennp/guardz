import { stringify } from "@/stringify";

import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is exactly equal to a given value.
 *
 * @param exactValue - The value to compare against.
 * @returns {TypeGuardFn<T>} A type guard function that returns true if the value is exactly equal to the given value, false otherwise.
 */
export function isEqualTo<T>(exactValue: T): TypeGuardFn<T> {
  return function (value, config): value is T {
    const isValid = value === exactValue;

    if (!isValid && config) {
      config.callbackOnError(
        `${config.identifier} (${stringify(value)}) must be exactly ${stringify(exactValue)}`,
      );
    }

    return isValid;
  };
}
