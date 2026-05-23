import { ValidationTree } from './validationTypes';

const simplifyChildNode = (tree: ValidationTree): Record<string, any> => {
  if (tree.children && Object.keys(tree.children).length > 0) {
    const value: Record<string, any> = {};
    Object.entries(tree.children).forEach(([key, childTree]) => {
      value[key] = simplifyChildNode(childTree);
    });

    return {
      valid: tree.valid,
      value,
      ...(tree.expectedType && { expectedType: tree.expectedType }),
    };
  }

  return {
    valid: tree.valid,
    value: tree.actualValue,
    ...(tree.expectedType && { expectedType: tree.expectedType }),
  };
};

/**
 * Create a simplified flat tree structure for JSON output
 * @param tree - The validation tree to simplify
 * @returns A simplified tree structure as a plain object
 */
export const createSimplifiedTree = (tree: ValidationTree): Record<string, any> => {
  const rootKey = tree.path.split('.').pop() || 'root';
  const result: Record<string, any> = {};

  if (tree.children && Object.keys(tree.children).length) {
    const value: Record<string, any> = {};
    Object.entries(tree.children).forEach(([key, childTree]) => {
      value[key] = simplifyChildNode(childTree);
    });

    result[rootKey] = {
      valid: tree.valid,
      value,
    };
  } else {
    result[rootKey] = {
      valid: tree.valid,
      value: tree.actualValue,
      ...(tree.expectedType && { expectedType: tree.expectedType }),
    };
  }

  return result;
};
