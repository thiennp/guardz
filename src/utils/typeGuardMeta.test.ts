import { isString } from '../typeguards/isString';
import { isType } from '../typeguards/isType';
import { isSchema } from '../typeguards/isSchema';
import { isArrayWithEachItem } from '../typeguards/isArrayWithEachItem';
import { isUndefinedOr } from '../typeguards/isUndefinedOr';
import {
  attachTypeGuardMeta,
  getTypeGuardInnerGuard,
  getTypeGuardItemGuard,
  getTypeGuardSchema,
  getTypeGuardWrapperKind,
  isArrayTypeGuard,
  isNestedObjectTypeGuard,
} from './typeGuardMeta';
import type { TypeGuardFn } from '../typeguards/isType';

describe('typeGuardMeta', () => {
  it('should read schema metadata from isType guards', () => {
    const guard = isType({ name: isString });
    expect(getTypeGuardSchema(guard)).toEqual({ name: isString });
    expect(isNestedObjectTypeGuard(guard)).toBe(true);
  });

  it('should read schema metadata from isSchema guards', () => {
    const guard = isSchema({ name: isString });
    expect(getTypeGuardSchema(guard)).toBeDefined();
    expect(isNestedObjectTypeGuard(guard)).toBe(true);
  });

  it('should detect nested guards by function name', () => {
    const namedTypeGuard = function isTypeGuard() {
      return true;
    } as TypeGuardFn<unknown>;

    const namedSchemaGuard = function isSchemaGuard() {
      return true;
    } as TypeGuardFn<unknown>;

    expect(isNestedObjectTypeGuard(namedTypeGuard)).toBe(true);
    expect(isNestedObjectTypeGuard(namedSchemaGuard)).toBe(true);
    expect(isNestedObjectTypeGuard(isString)).toBe(false);
  });

  it('should read item guard metadata and detect array guards', () => {
    const arrayGuard = isArrayWithEachItem(isString);
    expect(getTypeGuardItemGuard(arrayGuard)).toBe(isString);
    expect(isArrayTypeGuard(arrayGuard)).toBe(true);
  });

  it('should detect array guards by function name', () => {
    const namedArrayGuard = function isArrayGuard() {
      return true;
    } as TypeGuardFn<unknown>;

    const legacyArrayGuard = function isArray() {
      return true;
    } as TypeGuardFn<unknown>;

    expect(isArrayTypeGuard(namedArrayGuard)).toBe(true);
    expect(isArrayTypeGuard(legacyArrayGuard)).toBe(true);
    expect(isArrayTypeGuard(isString)).toBe(false);
  });

  it('should read wrapper metadata from composable guards', () => {
    const guard = isUndefinedOr(isString);
    expect(getTypeGuardInnerGuard(guard)).toBe(isString);
    expect(getTypeGuardWrapperKind(guard)).toBe('undefinedOr');
  });

  it('should return undefined for guards without metadata', () => {
    expect(getTypeGuardSchema(isString)).toBeUndefined();
    expect(getTypeGuardItemGuard(isString)).toBeUndefined();
    expect(getTypeGuardInnerGuard(isString)).toBeUndefined();
    expect(getTypeGuardWrapperKind(isString)).toBeUndefined();
  });

  it('should attach metadata to guards', () => {
    const guard = ((value: unknown): value is string => typeof value === 'string') as TypeGuardFn<string>;
    const withMeta = attachTypeGuardMeta(guard, { schema: { value: isString } });
    expect(getTypeGuardSchema(withMeta)).toEqual({ value: isString });
  });
});
