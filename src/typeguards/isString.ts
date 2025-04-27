import { generateTypeGuardError } from "@/typeguards/generateTypeGuardError";

import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a string.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is a string, otherwise false.
 */
export const isString: TypeGuardFn<string> = function (value, config): value is string {
  if (typeof value !== "string") {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "string"));
    }
    return false;
  }
  return true;
};
