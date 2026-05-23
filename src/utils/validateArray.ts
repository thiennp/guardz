import { stringify } from '@/stringify';

import { TypeGuardFn } from '../typeguards/isType';
import { ValidationResult, ValidationContext } from './validationTypes';
import { createValidationResult } from './createValidationResult';
import { createValidationError } from './createValidationError';
import { createTreeNode } from './createTreeNode';
import { combineResults } from './combineResults';
import { validateObject } from './validateObject';
import { getExpectedTypeName } from './getExpectedTypeName';
import { getTypeGuardSchema } from './typeGuardMeta';

/**
 * Validate an array and collect per-index validation errors.
 */
export const validateArray = (
  value: unknown,
  itemGuard: TypeGuardFn<any>,
  context: ValidationContext
): ValidationResult => {
  const propertyPath = context.path;

  if (!Array.isArray(value)) {
    const error = createValidationError(
      propertyPath,
      'Array',
      value,
      `Expected ${propertyPath} (${JSON.stringify(value)}) to be "Array"`
    );
    const treeNode = createTreeNode(propertyPath, false, 'Array', value);
    treeNode.errors = [error];
    return createValidationResult(false, [error], treeNode);
  }

  const itemSchema = getTypeGuardSchema(itemGuard);
  const results = value.map((item, index) => {
    const itemPath = `${propertyPath}[${index}]`;
    const itemContext: ValidationContext = {
      path: itemPath,
      config: context.config || null,
    };

    if (itemSchema) {
      return validateObject(item, itemSchema, itemContext);
    }

    const isValid = itemGuard(item, null);
    const expectedType = getExpectedTypeName(itemGuard);
    const valueString = stringify(item);

    if (isValid) {
      return createValidationResult(
        true,
        [],
        createTreeNode(itemPath, true, expectedType, item)
      );
    }

    const message =
      valueString.length > 200
        ? `Expected ${itemPath} to be "${expectedType}"`
        : `Expected ${itemPath} (${valueString}) to be "${expectedType}"`;
    const error = createValidationError(itemPath, expectedType, item, message);
    const treeNode = createTreeNode(itemPath, false, expectedType, item);
    treeNode.errors = [error];
    return createValidationResult(false, [error], treeNode);
  });

  const combined = combineResults(results, propertyPath);
  const rootTree = createTreeNode(propertyPath, combined.valid, 'Array', value);
  rootTree.children = {};

  results.forEach((result) => {
    if (result.tree) {
      const key = result.tree.path.match(/\[(\d+)\]$/)?.[1] ?? 'unknown';
      rootTree.children![key] = result.tree;
    }
  });

  return createValidationResult(combined.valid, combined.errors, rootTree);
};
