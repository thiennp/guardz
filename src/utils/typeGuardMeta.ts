import { TypeGuardFn } from '../typeguards/isType';

export type TypeGuardWrapperKind = 'undefinedOr' | 'nullOr' | 'nilOr';

export type TypeGuardMeta = {
  schema?: Record<string, TypeGuardFn<any>>;
  itemGuard?: TypeGuardFn<any>;
  innerGuard?: TypeGuardFn<any>;
  wrapperKind?: TypeGuardWrapperKind;
};

export type TypeGuardWithMeta<T> = TypeGuardFn<T> & TypeGuardMeta;

export const getTypeGuardSchema = (
  typeGuardFn: TypeGuardFn<any>
): Record<string, TypeGuardFn<any>> | undefined =>
  (typeGuardFn as TypeGuardWithMeta<any>).schema;

export const getTypeGuardItemGuard = (
  typeGuardFn: TypeGuardFn<any>
): TypeGuardFn<any> | undefined =>
  (typeGuardFn as TypeGuardWithMeta<any>).itemGuard;

export const getTypeGuardInnerGuard = (
  typeGuardFn: TypeGuardFn<any>
): TypeGuardFn<any> | undefined =>
  (typeGuardFn as TypeGuardWithMeta<any>).innerGuard;

export const getTypeGuardWrapperKind = (
  typeGuardFn: TypeGuardFn<any>
): TypeGuardWrapperKind | undefined =>
  (typeGuardFn as TypeGuardWithMeta<any>).wrapperKind;

export const isNestedObjectTypeGuard = (typeGuardFn: TypeGuardFn<any>): boolean => {
  if (getTypeGuardSchema(typeGuardFn)) {
    return true;
  }

  const fnName = typeGuardFn.name;
  return fnName === 'isTypeGuard' || fnName === 'isSchemaGuard';
};

export const isArrayTypeGuard = (typeGuardFn: TypeGuardFn<any>): boolean => {
  if (getTypeGuardItemGuard(typeGuardFn)) {
    return true;
  }

  const fnName = typeGuardFn.name;
  return fnName === 'isArray' || fnName === 'isArrayGuard';
};

export const attachTypeGuardMeta = <T>(
  typeGuardFn: TypeGuardFn<T>,
  meta: TypeGuardMeta
): TypeGuardFn<T> => Object.assign(typeGuardFn, meta);
