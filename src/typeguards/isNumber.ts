import { generateTypeGuardError } from "@/typeguards/generateTypeGuardError";

import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a number.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is a number, otherwise false.
 */
export const isNumber: TypeGuardFn<number> = function (value, config): value is number {
  if (typeof value !== "number" || isNaN(value)) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "number"));
    }
    return false;
  }

  return true;
};
