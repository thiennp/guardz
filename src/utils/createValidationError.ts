import { ValidationError } from './validationTypes';

/**
 * Create a validation error object
 * @param path - The path where the error occurred
 * @param expectedType - The expected type
 * @param actualValue - The actual value that caused the error
 * @param message - The error message
 * @returns A ValidationError object
 */
export const createValidationError = (
  path: string, 
  expectedType: string, 
  actualValue: unknown, 
  message: string
): ValidationError => ({
  path,
  expectedType,
  actualValue,
  message
}); 