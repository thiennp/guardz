import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a boolean.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is a boolean, otherwise false.
 */
export const isBoolean: TypeGuardFn<boolean> = function (value, config): value is boolean {
  if (typeof value !== "boolean") {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "boolean"));
    }
    return false;
  }
  return true;
};
