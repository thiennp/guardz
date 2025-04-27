import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a null or undefined.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is null or undefined, otherwise false.
 */
export const isNil: TypeGuardFn<null | undefined> = function (value, config): value is null | undefined {
  if (value !== null && value !== undefined) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "null | undefined"));
    }
    return false;
  }

  return true;
};
