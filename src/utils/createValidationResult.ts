import { ValidationResult, ValidationError, ValidationTree } from './validationTypes';

/**
 * Create a validation result object
 * @param valid - Whether the validation passed
 * @param errors - Array of validation errors (default: empty array)
 * @param tree - Optional validation tree structure
 * @returns A ValidationResult object
 */
export const createValidationResult = (
  valid: boolean, 
  errors: ValidationError[] = [], 
  tree?: ValidationTree
): ValidationResult => ({
  valid,
  errors: Array.isArray(errors) ? [...errors] : [],
  ...(tree && { tree: { ...tree } })
}); 