import { isNonNullObject } from "./isNonNullObject";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a partial of a given type.
 *
 * @param propsTypesToCheck - The properties to check in the value.
 * @return {TypeGuardFn<Partial<T>>} - A type guard function that returns true if the value is a partial of the given type, false otherwise.
 */
export function isPartialOf<T>(propsTypesToCheck: {
  [P in keyof T]?: TypeGuardFn<T[P]>;
}): TypeGuardFn<Partial<T>> {
  return function (value, config): value is Partial<T> {
    if (!isNonNullObject(value, config)) {
      return false;
    }

    for (const key in propsTypesToCheck) {
      if (Object.prototype.hasOwnProperty.call(propsTypesToCheck, key) && 
          Object.prototype.hasOwnProperty.call(value, key)) 
      {
        const typeGuardFn = propsTypesToCheck[key as keyof T];
        const propertyValue = value[key as keyof typeof value];
        
        if (typeGuardFn && !typeGuardFn(propertyValue, config ? { ...config, identifier: `${config.identifier}.${key}` } : null)) {
          return false;
        }
      }
    }

    return true;
  };
}
