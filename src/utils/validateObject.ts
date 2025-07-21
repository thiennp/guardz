import { TypeGuardFn } from '../typeguards/isType';
import { isNonNullObject } from '../typeguards/isNonNullObject';
import { ValidationResult, ValidationContext } from './validationTypes';
import { createValidationResult } from './createValidationResult';
import { createValidationError } from './createValidationError';
import { createTreeNode } from './createTreeNode';
import { combineResults } from './combineResults';
import { validateProperty } from './validateProperty';
import { getExpectedTypeName } from './getExpectedTypeName';

/**
 * Validate an object with multiple properties using functional approach
 * @param value - The value to validate
 * @param propsTypesToCheck - Object containing type guards for each property
 * @param context - The validation context
 * @returns A ValidationResult for the entire object
 */
export const validateObject = <T>(
  value: unknown,
  propsTypesToCheck: { [P in keyof T]: TypeGuardFn<T[P]> },
  context: ValidationContext
): ValidationResult => {
  // Handle non-object values functionally
  const handleNonObjectValue = () => {
    const error = createValidationError(
      context.path,
      'non-null object',
      value,
      `Expected ${context.path} (${JSON.stringify(value)}) to be "non-null object"`
    );
    
    const treeNode = createTreeNode(context.path, false, 'non-null object', value);
    treeNode.errors = [error];
    
    // For JSON mode, don't include the error in the result.errors array
    const errorMode = context.config?.errorMode || 'single';
    return errorMode === 'json' 
      ? createValidationResult(false, [], treeNode)
      : createValidationResult(false, [error], treeNode);
  };

  // Handle single error mode functionally
  const handleSingleErrorMode = (): ValidationResult => {
    const findFirstError = (keys: string[]): ValidationResult => {
      if (keys.length === 0) {
        return createValidationResult(true, [], createTreeNode(context.path, true, 'object', value));
      }
      
      const [key, ...remainingKeys] = keys;
      if (!key) {
        return findFirstError(remainingKeys);
      }
      
      const typeGuard = propsTypesToCheck[key as keyof T];
      const propertyPath = `${context.path}.${key}`;
      const propertyValue = (value as any)[key];
      
      // Use validateProperty to avoid duplicate validation logic
      const propertyResult = validateProperty(key, propertyValue, typeGuard, context);
      
      return propertyResult.valid 
        ? findFirstError(remainingKeys)
        : propertyResult;
    };
    
    return findFirstError(Object.keys(propsTypesToCheck));
  };

  // Handle multi/json error mode functionally
  const handleMultiJsonMode = (): ValidationResult => {
    const results = Object.keys(propsTypesToCheck).map(key => {
      const typeGuard = propsTypesToCheck[key as keyof T];
      return validateProperty(key, (value as any)[key], typeGuard, context);
    });
    
    const combinedResult = combineResults(results, context.path);
    const rootTree = createTreeNode(context.path, combinedResult.valid, 'object', value);
    rootTree.children = {};
    
    results.forEach(result => {
      if (result.tree) {
        const key = result.tree.path.split('.').pop() || 'unknown';
        rootTree.children![key] = result.tree;
      }
    });
    
    return createValidationResult(combinedResult.valid, combinedResult.errors, rootTree);
  };

  // Main validation logic using functional composition
  return !isNonNullObject(value, null)
    ? handleNonObjectValue()
    : (() => {
        const errorMode = context.config?.errorMode || 'single';
        return errorMode === 'single' 
          ? handleSingleErrorMode()
          : handleMultiJsonMode();
      })();
}; 