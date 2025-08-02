import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a Symbol.
 *
 * This function validates that the value is a Symbol primitive, including
 * both regular symbols and unique symbols.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a Symbol, false otherwise
 *
 * @example
 * ```typescript
 * import { isSymbol } from 'guardz';
 * 
 * const symbol1 = Symbol('test');
 * const symbol2 = Symbol('unique') as unique symbol;
 * const notSymbol = 'not a symbol';
 * 
 * console.log(isSymbol(symbol1)); // true
 * console.log(isSymbol(symbol2)); // true
 * console.log(isSymbol(notSymbol)); // false
 * 
 * // With type narrowing
 * const data: unknown = Symbol('user');
 * if (isSymbol(data)) {
 *   // data is now typed as symbol
 *   console.log(`Symbol: ${data.toString()}`);
 * }
 * 
 * // With error handling
 * const invalidValue: unknown = 123;
 * isSymbol(invalidValue, {
 *   callbackOnError: (error) => console.error(error),
 *   identifier: 'symbol'
 * }); // false, calls error callback
 * ```
 * 
 * @example
 * ```typescript
 * // Using with branded types
 * import { isSymbol, Branded } from 'guardz';
 * 
 * const UserIdBrand = Symbol('UserId');
 * type UserId = Branded<symbol, typeof UserIdBrand>;
 * 
 * const isUserId = isSymbol; // Direct use for symbol validation
 * 
 * const userId: unknown = UserIdBrand;
 * if (isUserId(userId)) {
 *   // userId is now typed as symbol
 *   console.log('Valid user ID symbol');
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Array filtering with symbols
 * import { isSymbol, by } from 'guardz';
 * 
 * const mixedData = [
 *   Symbol('a'),
 *   'string',
 *   123,
 *   Symbol('b'),
 *   Symbol('c')
 * ];
 * 
 * const symbols = mixedData.filter(by(isSymbol));
 * console.log(symbols); // [Symbol(a), Symbol(b), Symbol(c)]
 * ```
 */
export const isSymbol: TypeGuardFn<symbol> = function (
  value,
  config
): value is symbol {
  if (typeof value !== 'symbol') {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'symbol')
      );
    }
    return false;
  }
  return true;
}; 