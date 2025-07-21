import { ValidationTree } from './validationTypes';

/**
 * Create a validation tree node
 * @param path - The path of this node in the validation tree
 * @param valid - Whether this node is valid
 * @param expectedType - Optional expected type for this node
 * @param actualValue - Optional actual value for this node
 * @returns A ValidationTree node
 */
export const createTreeNode = (
  path: string, 
  valid: boolean, 
  expectedType?: string, 
  actualValue?: unknown
): ValidationTree => ({
  valid,
  path,
  ...(expectedType && { expectedType }),
  ...(actualValue !== undefined && { actualValue }),
  children: {},
  errors: []
}); 