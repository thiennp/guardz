// Re-export all validation functions from their individual files
export type { ValidationError, ValidationTree, ValidationResult, ValidationContext } from './validationTypes';
export { getExpectedTypeName } from './getExpectedTypeName';
export { createValidationResult } from './createValidationResult';
export { createValidationError } from './createValidationError';
export { createTreeNode } from './createTreeNode';
export { combineResults } from './combineResults';
export { createSimplifiedTree } from './createSimplifiedTree';
export { validateProperty } from './validateProperty';
export { validateObject } from './validateObject';
export { reportValidationResults } from './reportValidationResults';

// Import all functions to create the Validation object
import { createValidationResult } from './createValidationResult';
import { combineResults } from './combineResults';
import { createValidationError } from './createValidationError';
import { createTreeNode } from './createTreeNode';
import { validateProperty } from './validateProperty';
import { validateObject } from './validateObject';
import { reportValidationResults } from './reportValidationResults';
import { createSimplifiedTree } from './createSimplifiedTree';

// Export the Validation object for backward compatibility
export const Validation = {
  result: createValidationResult,
  combine: combineResults,
  error: createValidationError,
  treeNode: createTreeNode,
  property: validateProperty,
  object: validateObject,
  report: reportValidationResults,
  createSimplifiedTree
}; 