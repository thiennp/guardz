import { isNonNullObject } from "./isNonNullObject";

export interface TypeGuardFnConfig {
  readonly callbackOnError: (errorMessage: string) => void;
  readonly identifier: string;
}

export type TypeGuardFn<T> = (value: unknown, config?: TypeGuardFnConfig | null) => value is T;

/**
 * The data type that comes from different sources (like from server side, library, url params) is not always reliable.
 * Therefore, we need to use this function to ensure the data type is correct.
 *
 * Usage:
 *   Case 1:
 *     data = { prop1: 1, prop2: 'lorem' };
 *     isPropertyTypeValid<DataType>(data, { prop1: ['number'], prop2: ['string'] }); // true
 *
 *   Case 2:
 *     data = { prop1: 1, prop2: { prop3: 'lorem' } };
 *     isPropertyTypeValid<DataType['prop2']>(data.prop2, { prop3: ['string'] })
 *       && isPropertyTypeValid(data, { prop1: ['number'] }); // true
 *
 * @param propsTypesToCheck - list of keys and possible types that it can have
 * @return - a type-guard function to check whether the data type is correct
 */
export function isType<T>(propsTypesToCheck: {
  [P in keyof T]: TypeGuardFn<T[P]>;
}): TypeGuardFn<T> {
  return function (value, config): value is T {
    if (!isNonNullObject(value, config)) {
      return false;
    }

    return Object.keys(propsTypesToCheck).every(function (key) {
      const typeGuardFn = propsTypesToCheck[key as keyof T];
      return typeGuardFn(value[key], config ? { ...config, identifier: `${config.identifier}.${key}` } : null);
    });
  };
}
