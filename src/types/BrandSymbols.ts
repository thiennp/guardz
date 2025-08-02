import type { Branded } from '../typeguards/isBranded';

/**
 * Predefined brand symbols for common use cases.
 * 
 * These symbols can be used to create branded types with unique symbols,
 * providing better type safety and avoiding string literal conflicts.
 * 
 * @example
 * ```typescript
 * import { Branded, isBranded, BrandSymbols } from 'guardz';
 * 
 * type UserId = Branded<number, typeof BrandSymbols.UserId>;
 * type Email = Branded<string, typeof BrandSymbols.Email>;
 * 
 * const isUserId = isBranded<UserId>((value) => {
 *   return typeof value === 'number' && value > 0 && Number.isInteger(value);
 * });
 * 
 * const isEmail = isBranded<Email>((value) => {
 *   if (typeof value !== 'string') return false;
 *   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 *   return emailRegex.test(value);
 * });
 * ```
 */
export const BrandSymbols = {
  UserId: Symbol('UserId'),
  Email: Symbol('Email'),
  Password: Symbol('Password'),
  Age: Symbol('Age'),
  PhoneNumber: Symbol('PhoneNumber'),
  URL: Symbol('URL'),
  UUID: Symbol('UUID'),
  Timestamp: Symbol('Timestamp'),
  PositiveNumber: Symbol('PositiveNumber'),
  NonEmptyString: Symbol('NonEmptyString'),
  ApiResponse: Symbol('ApiResponse'),
  DatabaseId: Symbol('DatabaseId'),
  SessionToken: Symbol('SessionToken'),
  FilePath: Symbol('FilePath'),
  Currency: Symbol('Currency'),
} as const;

/**
 * Type for accessing predefined brand symbols.
 */
export type BrandSymbolsType = typeof BrandSymbols;

/**
 * Utility type to create branded types with predefined symbols.
 * 
 * @template T - The base type
 * @template K - The key of the predefined brand symbol
 * @returns A branded type using the predefined brand symbol
 * 
 * @example
 * ```typescript
 * import { BrandedWith } from 'guardz';
 * 
 * type UserId = BrandedWith<number, 'UserId'>;
 * type Email = BrandedWith<string, 'Email'>;
 * ```
 */
export type BrandedWith<T, K extends keyof BrandSymbolsType> = Branded<T, BrandSymbolsType[K]>;
