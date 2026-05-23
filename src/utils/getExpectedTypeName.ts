import { TypeGuardFn } from '../typeguards/isType';

/**
 * Returns true when the type guard represents a nested object schema (isType / isSchema).
 */
export const isNestedObjectTypeGuard = (typeGuardFn: TypeGuardFn<any>): boolean => {
  const fnName = typeGuardFn.name;
  if (!fnName) {
    return true;
  }
  return fnName === 'isTypeGuard' || fnName === 'isSchemaGuard';
};

/**
 * Returns the display name of a type guard for error messages (e.g. isStringGuard -> isString).
 */
export const getTypeGuardDisplayName = (typeGuardFn: TypeGuardFn<any>): string => {
  const fnName = typeGuardFn.name;
  if (!fnName) {
    return 'isType';
  }
  if (fnName.endsWith('Guard')) {
    return fnName.slice(0, -5);
  }
  return fnName;
};

/**
 * Get the expected type name from a type guard function
 * @param typeGuardFn - The type guard function to analyze
 * @returns The expected type name as a string
 */
export const getExpectedTypeName = (typeGuardFn: TypeGuardFn<any>): string => {
  const fnName = typeGuardFn.name;
  if (fnName.startsWith('is')) {
    // Remove 'is' prefix and 'Guard' suffix if present
    let typeName = fnName.slice(2);
    if (typeName.endsWith('Guard')) {
      typeName = typeName.slice(0, -5);
    }
    // Special case for nested isType/isSchema calls - return 'object'
    if (typeName === 'Type' || typeName === 'Schema') {
      return 'object';
    }
    // Special case for Array to maintain proper casing
    if (typeName === 'Array') {
      return 'Array';
    }
    return typeName.toLowerCase();
  }
  // For nested isType calls (which have empty names), return 'object' instead of 'unknown'
  if (!fnName) {
    return 'object';
  }
  return 'unknown';
};
