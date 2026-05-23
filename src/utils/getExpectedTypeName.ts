import { TypeGuardFn } from '../typeguards/isType';
import {
  getTypeGuardInnerGuard,
  getTypeGuardWrapperKind,
} from './typeGuardMeta';

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
  const wrapperKind = getTypeGuardWrapperKind(typeGuardFn);
  const innerGuard = getTypeGuardInnerGuard(typeGuardFn);

  if (wrapperKind && innerGuard) {
    const innerType = getExpectedTypeName(innerGuard);
    if (wrapperKind === 'undefinedOr') {
      return `${innerType} | undefined`;
    }
    if (wrapperKind === 'nullOr') {
      return `${innerType} | null`;
    }
    if (wrapperKind === 'nilOr') {
      return `${innerType} | null | undefined`;
    }
  }

  const fnName = typeGuardFn.name;
  if (fnName.startsWith('is')) {
    let typeName = fnName.slice(2);
    if (typeName.endsWith('Guard')) {
      typeName = typeName.slice(0, -5);
    }
    if (typeName === 'Type' || typeName === 'Schema') {
      return 'object';
    }
    if (typeName === 'Array') {
      return 'Array';
    }
    return typeName.toLowerCase();
  }

  if (!fnName) {
    return 'unknown';
  }

  return 'unknown';
};
