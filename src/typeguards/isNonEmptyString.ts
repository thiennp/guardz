import { generateTypeGuardError } from "@/typeguards/generateTypeGuardError";
import type { NonEmptyString } from "@/types/NonEmptyString";

import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a non-empty string.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is a non-empty string, otherwise false.
 */
export const isNonEmptyString: TypeGuardFn<NonEmptyString> = function (value, config): value is NonEmptyString {
  if (typeof value !== "string" || value.trim().length === 0) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "NonEmptyString"));
    }
    return false;
  }
  return true;
};
