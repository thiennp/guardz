import { isNonNullObject } from './isNonNullObject';
import { validateObject, reportValidationResults } from '../utils/validationUtils';
import { attachTypeGuardMeta } from '../utils/typeGuardMeta';
import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard function for object schemas with improved nested type support.
 * 
 * This function is similar to `isType` but provides better support for deeply nested structures
 * by automatically handling nested type guards without requiring explicit `isType` calls for each level.
 * 
 * Key differences from `isType`:
 * - Automatically detects and handles nested object structures
 * - Provides better error messages for nested validation failures
 * - Supports both inline object definitions and existing type guards
 * - Maintains backward compatibility with existing type guard patterns
 *
 * @template T - The type to validate
 * @param schema - Object mapping property keys to their type guard functions or inline object definitions
 * @returns A type guard function that validates the object structure
 *
 * @example
 * ```typescript
 * import { isSchema, isString, isNumber, isBoolean } from 'guardz';
 *
 * // Simple nested structure
 * const isUser = isSchema({
 *   name: isString,
 *   age: isNumber,
 *   address: {
 *     street: isString,
 *     city: isString,
 *     zipCode: isNumber,
 *   },
 *   preferences: {
 *     theme: isString,
 *     notifications: isBoolean,
 *   },
 * });
 *
 * // Complex nested structure with arrays
 * const isComplexUser = isSchema({
 *   id: isNumber,
 *   profile: {
 *     name: isString,
 *     email: isString,
 *     contacts: [{
 *       type: isString,
 *       value: isString,
 *     }],
 *   },
 *   settings: {
 *     theme: isString,
 *     notifications: {
 *       email: isBoolean,
 *       push: isBoolean,
 *     },
 *   },
 * });
 * ```
 */
export function isSchema<T>(schema: any): TypeGuardFn<T> {
  // Validate input
  if (!isNonNullObject(schema, null)) {
    throw new TypeError('schema must be a non-null object');
  }

  const processedSchema = processNestedSchema(schema);

  function isSchemaGuard(value: unknown, config?: import('./isType').TypeGuardFnConfig | null): value is T {
    const errorMode = config?.errorMode || 'multi';

    if (errorMode === 'multi' || errorMode === 'json') {
      const context = {
        path: config?.identifier || 'root',
        config: config || null
      };

      const result = validateObject(value, processedSchema, context);
      reportValidationResults(result, config || null);

      return result.valid;
    }

    if (!isNonNullObject(value, config)) return false;
    return Object.keys(processedSchema).every(function (key) {
      const typeGuardFn = processedSchema[key];
      if (!typeGuardFn) return false;

      return typeGuardFn(
        value[key],
        config ? { ...config, identifier: `${config.identifier}.${key}` } : null
      );
    });
  }

  return attachTypeGuardMeta(isSchemaGuard, { schema: processedSchema });
}

function resolveSchemaEntry(value: unknown): TypeGuardFn<any> {
  if (typeof value === 'function') {
    return value as TypeGuardFn<any>;
  }

  if (Array.isArray(value)) {
    return createArrayTypeGuard(value);
  }

  if (typeof value === 'object' && value !== null) {
    return isSchema(value);
  }

  return value as TypeGuardFn<any>;
}

/**
 * Process a nested schema by converting inline object definitions to type guards
 */
function processNestedSchema(schema: any): { [key: string]: TypeGuardFn<any> } {
  const processed: { [key: string]: TypeGuardFn<any> } = {};

  for (const [key, value] of Object.entries(schema)) {
    processed[key] = resolveSchemaEntry(value);
  }

  return processed;
}

/**
 * Create a type guard for arrays of objects
 */
function createArrayTypeGuard(arraySchema: any[]): TypeGuardFn<any[]> {
  const itemSchema = arraySchema[0];
  const itemTypeGuard = isSchema(itemSchema);

  function isArrayGuard(value: unknown, config?: import('./isType').TypeGuardFnConfig | null): value is any[] {
    if (!Array.isArray(value)) {
      if (config) {
        config.callbackOnError(
          `Expected ${config.identifier} to be an array`
        );
      }
      return false;
    }

    return value.every((item, index) => {
      return itemTypeGuard(
        item,
        config ? { ...config, identifier: `${config.identifier}[${index}]` } : null
      );
    });
  }

  return attachTypeGuardMeta(isArrayGuard, { itemGuard: itemTypeGuard });
}

// Aliases for backward compatibility and flexibility
export const isShape = isSchema;
export const isNestedType = isSchema; 