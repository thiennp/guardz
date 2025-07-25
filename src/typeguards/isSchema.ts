import { isNonNullObject } from './isNonNullObject';
import { validateObject, reportValidationResults } from '../utils/validationUtils';
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
  return function (value, config): value is T {
    const errorMode = config?.errorMode || 'single';
    
    // For multi or json modes, use the validation utils
    if (errorMode === 'multi' || errorMode === 'json') {
      const context = {
        path: config?.identifier || 'root',
        config: config || null
      };
      
      const processedSchema = processNestedSchema(schema);
      const result = validateObject(value, processedSchema, context);
      reportValidationResults(result, config || null);
      
      return result.valid;
    }
    
    // Original single error mode behavior
    if (!isNonNullObject(value, config)) {
      return false;
    }

    const processedSchema = processNestedSchema(schema);
    
    return Object.keys(processedSchema).every(function (key) {
      const typeGuardFn = processedSchema[key];
      if (!typeGuardFn) return false;
      
      return typeGuardFn(
        value[key],
        config ? { ...config, identifier: `${config.identifier}.${key}` } : null
      );
    });
  };
}

/**
 * Process a nested schema by converting inline object definitions to type guards
 */
function processNestedSchema(schema: any): { [key: string]: TypeGuardFn<any> } {
  const processed: { [key: string]: TypeGuardFn<any> } = {};
  
  for (const [key, value] of Object.entries(schema)) {
    if (typeof value === 'function') {
      // It's already a type guard function
      processed[key] = value as TypeGuardFn<any>;
    } else if (Array.isArray(value)) {
      // Handle array of object definitions
      processed[key] = createArrayTypeGuard(value);
    } else if (typeof value === 'object' && value !== null) {
      // It's an inline object definition, convert to type guard
      processed[key] = isSchema(value);
    } else {
      // Fallback for other cases
      processed[key] = value as TypeGuardFn<any>;
    }
  }
  
  return processed;
}

/**
 * Create a type guard for arrays of objects
 */
function createArrayTypeGuard(arraySchema: any[]): TypeGuardFn<any[]> {
  // For now, we'll use the first schema in the array
  // In the future, this could be extended to support tuple types
  const itemSchema = arraySchema[0];
  const itemTypeGuard = isSchema(itemSchema);
  
  return function (value, config): value is any[] {
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
  };
}

// Aliases for backward compatibility and flexibility
export const isShape = isSchema;
export const isNestedType = isSchema; 