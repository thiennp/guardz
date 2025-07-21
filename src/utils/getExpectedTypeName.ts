import { TypeGuardFn } from '../typeguards/isType';

/**
 * Get the expected type name from a type guard function
 * @param typeGuardFn - The type guard function to analyze
 * @returns The expected type name as a string
 */
export const getExpectedTypeName = (typeGuardFn: TypeGuardFn<any>): string => {
  const fnName = typeGuardFn.name;
  if (fnName.startsWith('is')) {
    return fnName.slice(2).toLowerCase();
  }
  // For nested isType calls (which have empty names), return 'object' instead of 'unknown'
  if (!fnName) {
    return 'object';
  }
  return 'unknown';
}; 