import { generateTypeGuardError } from "@/typeguards/generateTypeGuardError";

import type { TypeGuardFn } from "./isType";

/**
 * Checks if a given value is an object with valid type properties.
 *
 * @param {(item: unknown) => boolean} predicate - The predicate function to apply to each property's value in the object.
 * @return {(value, MOCK_TYPE_GUARD_FN_CONFIG) => value is Record<string, T>} Returns a type-guard function that returns true if the
 *   value is an object with valid type properties, false otherwise.
 */
export function isObjectWithEachItem<T>(predicate: TypeGuardFn<T>): TypeGuardFn<Record<string, T | undefined>> {
  return function (value, config): value is Record<string, T> {
    // Stricter check for plain objects
    const isPlainObject = typeof value === 'object' && value !== null && !Array.isArray(value) && value.constructor === Object;

    if (!isPlainObject) {
      if (config) {
        config.callbackOnError(generateTypeGuardError(value, config.identifier, "Object"));
      }
      return false;
    }

    // Cast value to Record<string, unknown> for Object.values compatibility if needed by strict checks
    const obj = value as Record<string, unknown>; 

    return Object.values(obj).every((item, index) => // Use obj here
      predicate(
        item,
        config
          ? {
              ...config,
              identifier: `${config.identifier}[${index}]`,
            }
          : null,
      ),
    );
  };
}
