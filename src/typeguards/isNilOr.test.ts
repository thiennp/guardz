import { isNilOr } from './isNilOr';
import { isString } from './isString';
import { isNumber } from './isNumber';
import { isType } from './isType';

describe('isNilOr', () => {
  describe('with isString', () => {
    const isStringOrNil = isNilOr(isString);

    it('should return true for valid string values', () => {
      expect(isStringOrNil('hello')).toBe(true);
      expect(isStringOrNil('')).toBe(true);
      expect(isStringOrNil('123')).toBe(true);
    });

    it('should return true for null', () => {
      expect(isStringOrNil(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isStringOrNil(undefined)).toBe(true);
    });

    it('should return false for non-string, non-null, non-undefined values', () => {
      expect(isStringOrNil(123)).toBe(false);
      expect(isStringOrNil(true)).toBe(false);
      expect(isStringOrNil([])).toBe(false);
      expect(isStringOrNil({})).toBe(false);
    });
  });

  describe('with isNumber', () => {
    const isNumberOrNil = isNilOr(isNumber);

    it('should return true for valid number values', () => {
      expect(isNumberOrNil(123)).toBe(true);
      expect(isNumberOrNil(0)).toBe(true);
      expect(isNumberOrNil(-123)).toBe(true);
      expect(isNumberOrNil(123.45)).toBe(true);
    });

    it('should return true for null', () => {
      expect(isNumberOrNil(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isNumberOrNil(undefined)).toBe(true);
    });

    it('should return false for NaN (since isNumber excludes NaN)', () => {
      expect(isNumberOrNil(NaN)).toBe(false);
    });

    it('should return false for non-number, non-null, non-undefined values', () => {
      expect(isNumberOrNil('123')).toBe(false);
      expect(isNumberOrNil(true)).toBe(false);
      expect(isNumberOrNil([])).toBe(false);
      expect(isNumberOrNil({})).toBe(false);
    });
  });

  describe('with complex object types', () => {
    interface User {
      name: string;
      age: number;
    }

    const isUser = isType<User>({
      name: isString,
      age: isNumber,
    });

    const isUserOrNil = isNilOr(isUser);

    it('should return true for valid User objects', () => {
      const validUser = { name: 'John', age: 30 };
      expect(isUserOrNil(validUser)).toBe(true);
    });

    it('should return true for null', () => {
      expect(isUserOrNil(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isUserOrNil(undefined)).toBe(true);
    });

    it('should return false for invalid User objects', () => {
      const invalidUser = { name: 'John' }; // missing age
      expect(isUserOrNil(invalidUser)).toBe(false);
    });

    it('should return false for non-User, non-null, non-undefined values', () => {
      expect(isUserOrNil('not a user')).toBe(false);
      expect(isUserOrNil(123)).toBe(false);
      expect(isUserOrNil([])).toBe(false);
    });
  });

  describe('error handling', () => {
    const isStringOrNil = isNilOr(isString);

    it('should work with error configuration', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'testValue',
      };

      const result = isStringOrNil(123, config);
      expect(result).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should not trigger errors for null values', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'testValue',
      };

      const result = isStringOrNil(null, config);
      expect(result).toBe(true);
      expect(errors.length).toBe(0);
    });

    it('should not trigger errors for undefined values', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'testValue',
      };

      const result = isStringOrNil(undefined, config);
      expect(result).toBe(true);
      expect(errors.length).toBe(0);
    });
  });

  describe('equivalence to isUndefinedOr(isNullOr(...))', () => {
    const isStringOrNil = isNilOr(isString);
    const isEquivalent = (value: unknown) => {
      const { isUndefinedOr } = require('./isUndefinedOr');
      const { isNullOr } = require('./IsNullOr');
      return isUndefinedOr(isNullOr(isString))(value);
    };

    const testValues = [
      'hello',
      '',
      123,
      0,
      true,
      false,
      null,
      undefined,
      [],
      {},
      NaN,
    ];

    testValues.forEach((value) => {
      it(`should be equivalent to isUndefinedOr(isNullOr(isString)) for value: ${JSON.stringify(value)}`, () => {
        expect(isStringOrNil(value)).toBe(isEquivalent(value));
      });
    });
  });
}); 