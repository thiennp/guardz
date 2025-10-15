import { isNonNullObject } from './isNonNullObject';
import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard that checks an object omits the specified keys.
 *
 * - Composed with a base object type guard (e.g., from `isType`/`isSchema`).
 * - Validation of remaining properties stays with the base guard; this only
 *   enforces that the omitted keys are not present on the object.
 */
export function isOmit<T, K extends keyof T>(
  baseTypeGuard: TypeGuardFn<T>,
  ...omittedKeys: K[]
): TypeGuardFn<Omit<T, K>> {
  return function (value, config): value is Omit<T, K> {
    if (!isNonNullObject(value, config)) {
      return false;
    }

    // Run base guard and collect all error messages, then filter out those for omitted keys
    const collectedMessages: string[] = [];
    const identifier = config?.identifier || 'root';
    const tempConfig = config
      ? { ...config, callbackOnError: (msg: string) => collectedMessages.push(msg) }
      : { identifier, callbackOnError: (msg: string) => collectedMessages.push(msg) };

    baseTypeGuard(value, tempConfig as any);

    const omittedKeyPaths = new Set(
      omittedKeys.map((k) => `${identifier}.${String(k)}`)
    );

    const remaining = collectedMessages.filter((msg) => {
      // Message format: Expected <path> (<value>) to be "<type>"
      // Extract path between 'Expected ' and ' ('
      const afterExpected = msg.slice('Expected '.length);
      const idx = afterExpected.indexOf(' (');
      const path = idx >= 0 ? afterExpected.slice(0, idx) : afterExpected;
      // Drop messages for omitted keys
      if (omittedKeyPaths.has(path)) return false;

      // Also drop messages for missing top-level non-omitted keys
      const topLevelKey = path.startsWith(identifier + '.')
        ? (path.slice(identifier.length + 1).split('.')[0] || '')
        : '';
      if (topLevelKey && !Object.prototype.hasOwnProperty.call(value as any, topLevelKey)) {
        return false;
      }

      return true;
    });

    if (config && remaining.length > 0) {
      for (const m of remaining) config.callbackOnError(m);
    }

    return remaining.length === 0;
  };
}


