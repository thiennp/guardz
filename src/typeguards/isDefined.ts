import { generateTypeGuardError } from "./generateTypeGuardError";
import { isNil } from "./isNil";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is not null and not undefined.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is not null and not undefined, otherwise false.
 */
export const isDefined: TypeGuardFn<NonNullable<unknown>> = function (value, config): value is NonNullable<unknown> {
  if (isNil(value)) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "isDefined"));
    }
    return false;
  }

  return true;
};
