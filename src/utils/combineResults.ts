import { ValidationResult, ValidationTree } from './validationTypes';
import { createValidationResult } from './createValidationResult';
import { createTreeNode } from './createTreeNode';

/**
 * Combine multiple validation results into a single result
 * @param results - Array of validation results to combine
 * @param parentPath - Optional parent path for the combined result
 * @returns A combined ValidationResult
 */
export const combineResults = (
  results: ValidationResult[], 
  parentPath?: string
): ValidationResult => {
  const allValid = results.every(r => r.valid);
  const allErrors = results.flatMap(r => r.errors);
  
  // Create a simple flat structure
  const combinedTree: ValidationTree = {
    valid: allValid,
    path: parentPath || 'root',
    children: {},
    errors: allErrors
  };

  // Add individual property trees as children
  results.forEach(result => {
    if (result.tree) {
      const key = result.tree.path.split('.').pop() || 'unknown';
      combinedTree.children![key] = result.tree;
    }
  });

  return createValidationResult(allValid, allErrors, combinedTree);
}; 