import { TypeGuardFn } from '../typeguards/isType';
import { ValidationResult, ValidationContext } from './validationTypes';
import { createValidationResult } from './createValidationResult';
import { createValidationError } from './createValidationError';
import { createTreeNode } from './createTreeNode';
import { getExpectedTypeName } from './getExpectedTypeName';
import {
  getTypeGuardSchema,
  getTypeGuardItemGuard,
  isArrayTypeGuard,
  isNestedObjectTypeGuard,
} from './typeGuardMeta';
import { validateObject } from './validateObject';
import { validateArray } from './validateArray';

/**
 * Validate a single property using functional approach
 * @param key - The property key to validate
 * @param value - The value to validate
 * @param typeGuard - The type guard function to use
 * @param context - The validation context
 * @returns A ValidationResult for this property
 */
export const validateProperty = <T>(
  key: string,
  value: unknown,
  typeGuard: TypeGuardFn<T>,
  context: ValidationContext
): ValidationResult => {
  const propertyPath = `${context.path}.${key}`;
  const propertyContext: ValidationContext = {
    path: propertyPath,
    config: context.config || null,
    ...(context.parentTree && { parentTree: context.parentTree })
  };

  const errorMode = context.config?.errorMode || 'multi';
  const schema = getTypeGuardSchema(typeGuard);
  const itemGuard = getTypeGuardItemGuard(typeGuard);

  if (errorMode === 'multi' || errorMode === 'json') {
    if (schema) {
      return validateObject(value, schema, propertyContext);
    }

    if (itemGuard && isArrayTypeGuard(typeGuard)) {
      return validateArray(value, itemGuard, propertyContext);
    }
  }

  const validateWithConfig = (config: any) => {
    const isValid = typeGuard(value, config);
    const expectedType = getExpectedTypeName(typeGuard);

    return isValid
      ? createValidationResult(true, [], createTreeNode(propertyPath, true, expectedType, value))
      : (() => {
          const error = createValidationError(
            propertyPath,
            expectedType,
            value,
            `Expected ${propertyPath} (${JSON.stringify(value)}) to be "${expectedType}"`
          );

          const treeNode = createTreeNode(propertyPath, false, expectedType, value);
          treeNode.errors = [error];

          return createValidationResult(false, [error], treeNode);
        })();
  };

  if (isNestedObjectTypeGuard(typeGuard)) {
    const nestedConfig = context.config
      ? { ...context.config, identifier: propertyPath }
      : null;

    return validateWithConfig(nestedConfig);
  }

  return validateWithConfig(null);
};
