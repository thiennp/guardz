import { NonNegativeNumber } from "@/types/NonNegativeNumber";
import { TypeGuardFn } from "./isType";
import { generateTypeGuardError } from "./generateTypeGuardError";

/**
 * Checks if a value is a non-negative number.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @returns {boolean} Returns true if the value is a non-negative number, otherwise false.
 */
export const isNonNegativeNumber: TypeGuardFn<NonNegativeNumber> = function (value, config): value is NonNegativeNumber {
  if (typeof value !== "number" || isNaN(value) || value < 0) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "NonNegativeNumber"));
    }
    return false;
  }
  return true;
};
