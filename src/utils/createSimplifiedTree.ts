import { ValidationTree } from './validationTypes';

/**
 * Create a simplified flat tree structure for JSON output
 * @param tree - The validation tree to simplify
 * @returns A simplified tree structure as a plain object
 */
export const createSimplifiedTree = (tree: ValidationTree): Record<string, any> => {
  const rootKey = tree.path.split('.').pop() || 'root';
  const result: Record<string, any> = {};
  
  if (tree.children && Object.keys(tree.children).length) {
    // Object with properties
    const value: Record<string, any> = {};
    Object.entries(tree.children).forEach(([key, childTree]) => {
      value[key] = {
        valid: childTree.valid,
        value: childTree.actualValue,
        ...(childTree.expectedType && { expectedType: childTree.expectedType })
      };
    });
    
    result[rootKey] = {
      valid: tree.valid,
      value
    };
  } else {
    // Primitive value
    result[rootKey] = {
      valid: tree.valid,
      value: tree.actualValue,
      ...(tree.expectedType && { expectedType: tree.expectedType })
    };
  }
  
  return result;
}; 