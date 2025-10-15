import { isNonNullObject } from './isNonNullObject';
import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard that checks if a value is an object that contains
 * at least the selected subset of properties (picked keys) from a type.
 *
 * Notes:
 * - This utility is designed to be composed with a full object type guard
 *   (e.g., from `isType`/`isSchema`). It ensures the specified keys exist.
 * - Validation of the picked properties' value types should be ensured by the
 *   provided base type guard if you call it beforehand or compose it externally.
 */
export function isPick<T, K extends keyof T>(
  _baseTypeGuard: TypeGuardFn<T>,
  ...pickedKeys: K[]
): TypeGuardFn<Pick<T, K>> {
  return function (value, config): value is Pick<T, K> {
    if (!isNonNullObject(value, config)) {
      return false;
    }

    for (const key of pickedKeys) {
      if (!Object.prototype.hasOwnProperty.call(value, key as PropertyKey)) {
        // Delegate to base type guard to produce the correct expected type message
        if (config) _baseTypeGuard(value, config);
        return false;
      }
    }

    return true;
  };
}


