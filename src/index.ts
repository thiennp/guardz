// Core type guard function
export {
  isType,
  type TypeGuardFn,
  type TypeGuardFnConfig,
} from './typeguards/isType';

// Schema-based type guard functions
export { isSchema, isShape, isNestedType } from './typeguards/isSchema';

// Object type guard aliases
export { isObjectWith } from './typeguards/isObjectWith';
export { isObject } from './typeguards/isObject';

// Guard with tolerance
export { guardWithTolerance } from './typeguards/guardWithTolerance';

// Branded type utilities
export { isBranded, type Branded, type PredicateFn } from './typeguards/isBranded';

// Primitive type guards
export { isAny } from './typeguards/isAny';
export { isBoolean } from './typeguards/isBoolean';
export { isDate } from './typeguards/isDate';
export { isDefined } from './typeguards/isDefined';
export { isNil } from './typeguards/isNil';
export { isNumber } from './typeguards/isNumber';
export { isString } from './typeguards/isString';
export { isUnknown } from './typeguards/isUnknown';

// Function type guards
export { isFunction } from './typeguards/isFunction';

// Web API type guards
export { isFile } from './typeguards/isFile';
export { isFileList } from './typeguards/isFileList';
export { isBlob } from './typeguards/isBlob';
export { isFormData } from './typeguards/isFormData';
export { isURL } from './typeguards/isURL';
export { isURLSearchParams } from './typeguards/isURLSearchParams';

// Collection type guards
export { isMap } from './typeguards/isMap';
export { isSet } from './typeguards/isSet';
export { isIndexSignature } from './typeguards/isIndexSignature';

// Error type guards
export { isError } from './typeguards/isError';

// Array type guards
export { isArrayWithEachItem } from './typeguards/isArrayWithEachItem';
export { isNonEmptyArray } from './typeguards/isNonEmptyArray';
export { isNonEmptyArrayWithEachItem } from './typeguards/isNonEmptyArrayWithEachItem';
export { isTuple } from './typeguards/isTuple';

// Object type guards
export { isNonNullObject } from './typeguards/isNonNullObject';
export { isObjectWithEachItem } from './typeguards/isObjectWithEachItem';
export { isPartialOf } from './typeguards/isPartialOf';

// String type guards
export { isNonEmptyString } from './typeguards/isNonEmptyString';

// Number type guards
export { isNonNegativeNumber } from './typeguards/isNonNegativeNumber';
export { isPositiveNumber } from './typeguards/isPositiveNumber';
export { isNonPositiveNumber } from './typeguards/isNonPositiveNumber';
export { isNegativeNumber } from './typeguards/isNegativeNumber';
export { isInteger } from './typeguards/isInteger';
export { isPositiveInteger } from './typeguards/isPositiveInteger';
export { isNegativeInteger } from './typeguards/isNegativeInteger';
export { isNonNegativeInteger } from './typeguards/isNonNegativeInteger';
export { isNonPositiveInteger } from './typeguards/isNonPositiveInteger';
export { isNumeric } from './typeguards/isNumeric';
export { isBooleanLike } from './typeguards/isBooleanLike';
export { isDateLike } from './typeguards/isDateLike';

// BigInt type guards
export { isBigInt } from './typeguards/isBigInt';

// Union type guards
export { isOneOf } from './typeguards/isOneOf';
export { isOneOfTypes } from './typeguards/isOneOfTypes';

// Composite type guards
export { isIntersectionOf } from './typeguards/isIntersectionOf';
export { isExtensionOf } from './typeguards/isExtensionOf';

// Nullable/Undefined type guards
export { isNullOr } from './typeguards/isNullOr';
export { isUndefinedOr } from './typeguards/isUndefinedOr';
export { isNilOr } from './typeguards/isNilOr';

// Special type guards
export { isAsserted } from './typeguards/isAsserted';
export { isEnum } from './typeguards/isEnum';
export { isEqualTo } from './typeguards/isEqualTo';
export { isRegex } from './typeguards/isRegex';
export { isPattern } from './typeguards/isPattern';

// Type guard error generation
export { generateTypeGuardError } from './typeguards/generateTypeGuardError';

// Array utilities for type guard compatibility
export { by } from './utils/arrayUtils';

// Validation types and utilities (for multi and json error modes)
export type { ValidationError, ValidationTree, ValidationResult, ValidationContext } from './utils/validationUtils';

// Utility types
export type { NonEmptyArray } from './types/NonEmptyArray';
export type { NonEmptyString } from './types/NonEmptyString';
export type { NonNegativeNumber } from './types/NonNegativeNumber';
export type { NonPositiveNumber } from './types/NonPositiveNumber';
export type { NegativeNumber } from './types/NegativeNumber';
export type { Nullable } from './types/Nullable';
export type { PositiveNumber } from './types/PositiveNumber';
export type { Integer } from './types/Integer';
export type { PositiveInteger } from './types/PositiveInteger';
export type { NegativeInteger } from './types/NegativeInteger';
export type { NonNegativeInteger } from './types/NonNegativeInteger';
export type { NonPositiveInteger } from './types/NonPositiveInteger';

// Utility branded types
export type { Numeric } from './types/Numeric';
export type { DateLike } from './types/DateLike';
export type { BooleanLike } from './types/BooleanLike';
export type { Pattern } from './types/Pattern';

// Type converters - convert branded types to their real types
export { toNumber } from './converters/toNumber';
export { toDate } from './converters/toDate';
export { toBoolean } from './converters/toBoolean';
