import { isNonNullObject } from './isNonNullObject';
import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard that checks an object omits the specified keys.
 *
 * - Composed with a base object type guard (e.g., from `isType`/`isSchema`).
 * - Validation of remaining properties stays with the base guard; this only
 *   enforces that the omitted keys are not present on the object.
 */
export function isOmit<T, K extends keyof T>(
  _baseTypeGuard: TypeGuardFn<T>,
  ...omittedKeys: K[]
): TypeGuardFn<Omit<T, K>> {
  return function (value, config): value is Omit<T, K> {
    if (!isNonNullObject(value, config)) {
      return false;
    }

    let valid = true;
    for (const key of omittedKeys) {
      if (Object.prototype.hasOwnProperty.call(value, key as PropertyKey)) {
        if (config) {
          const identifier = `${config.identifier}.${String(key)}`;
          config.callbackOnError(
            generateTypeGuardError(
              (value as any)[key],
              identifier,
              'undefined'
            )
          );
        }
        valid = false;
      }
    }

    return valid;
  };
}


