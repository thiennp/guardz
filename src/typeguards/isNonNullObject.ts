import { generateTypeGuardError } from './generateTypeGuardError';

import type { TypeGuardFn } from './isType';

export type NonNullObject = Record<number | string, unknown>;

/**
 * Checks if a value is a non-null object.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @returns {boolean} Returns true if the value is a non-null object, otherwise false.
 */
export const isNonNullObject: TypeGuardFn<NonNullObject> = function (
  value,
  config
): value is NonNullObject {
  // Exclude arrays
  const isValid =
    typeof value === 'object' && value !== null && !Array.isArray(value);
  if (!isValid && config) {
    config.callbackOnError(
      generateTypeGuardError(value, config.identifier, 'non-null object')
    );
  }
  return isValid;
};
