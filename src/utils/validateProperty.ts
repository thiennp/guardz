import { TypeGuardFn } from '../typeguards/isType';
import { ValidationResult, ValidationContext } from './validationTypes';
import { createValidationResult } from './createValidationResult';
import { createValidationError } from './createValidationError';
import { createTreeNode } from './createTreeNode';
import { getExpectedTypeName } from './getExpectedTypeName';

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

  // Unified validation function to avoid duplicate checks
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

  // Use functional approach to handle nested vs regular type guards
  const validateNestedTypeGuard = () => {
    // In multi mode, don't pass config to avoid duplicate error reporting
    // Let the validation utils handle all error reporting
    const errorMode = context.config?.errorMode || 'multi';
    const nestedConfig = (context.config && errorMode !== 'multi') ? {
      ...context.config,
      identifier: propertyPath
    } : null;
    
    return validateWithConfig(nestedConfig);
  };

  const validateRegularTypeGuard = () => {
    // Don't pass config to avoid duplicate callbacks when using validation utils
    return validateWithConfig(null);
  };

  // Use functional composition to determine validation strategy
  return !typeGuard.name ? validateNestedTypeGuard() : validateRegularTypeGuard();
}; 