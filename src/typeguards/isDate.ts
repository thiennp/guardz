import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is of type Date.
 *
 * @param [value] - The value to be checked.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is of type Date, otherwise false.
 */
export const isDate: TypeGuardFn<Date> = function (value, config): value is Date {
  if (!(value instanceof Date) || isNaN(value.getTime())) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "Date"));
    }
    return false;
  }

  return true;
};
