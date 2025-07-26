import { isNumeric } from './isNumeric';

describe('isNumeric', () => {
  describe('valid number keys', () => {
    it('should accept numbers', () => {
      expect(isNumeric(0)).toBe(true);
      expect(isNumeric(1)).toBe(true);
      expect(isNumeric(-1)).toBe(true);
      expect(isNumeric(123)).toBe(true);
      expect(isNumeric(1.5)).toBe(true);
      expect(isNumeric(-1.5)).toBe(true);
      expect(isNumeric(Infinity)).toBe(true);
      expect(isNumeric(-Infinity)).toBe(true);
    });

    it('should accept string representations of numbers', () => {
      expect(isNumeric("0")).toBe(true);
      expect(isNumeric("1")).toBe(true);
      expect(isNumeric("-1")).toBe(true);
      expect(isNumeric("123")).toBe(true);
      expect(isNumeric("1.5")).toBe(true);
      expect(isNumeric("-1.5")).toBe(true);
      expect(isNumeric("1.0")).toBe(true);
      expect(isNumeric("0.0")).toBe(true);
    });

    it('should accept scientific notation', () => {
      expect(isNumeric("1e2")).toBe(true);
      expect(isNumeric("1.5e-3")).toBe(true);
      expect(isNumeric("-1e+5")).toBe(true);
    });

    it('should accept hexadecimal strings', () => {
      expect(isNumeric("0xff")).toBe(true);
      expect(isNumeric("0XFF")).toBe(true);
    });
  });

  describe('invalid number keys', () => {
    it('should reject non-numeric strings', () => {
      expect(isNumeric("abc")).toBe(false);
      expect(isNumeric("hello")).toBe(false);
      expect(isNumeric("1abc")).toBe(false);
      expect(isNumeric("abc123")).toBe(false);
      expect(isNumeric("")).toBe(false);
      expect(isNumeric(" ")).toBe(false);
    });

    it('should reject strings that are not exact number representations', () => {
      expect(isNumeric("1.0.0")).toBe(false);
      expect(isNumeric("1,000")).toBe(false);
      expect(isNumeric("1 000")).toBe(false);
      expect(isNumeric("1.0.0")).toBe(false);
    });

    it('should reject other types', () => {
      expect(isNumeric(null)).toBe(false);
      expect(isNumeric(undefined)).toBe(false);
      expect(isNumeric(true)).toBe(false);
      expect(isNumeric(false)).toBe(false);
      expect(isNumeric([])).toBe(false);
      expect(isNumeric({})).toBe(false);
      expect(isNumeric(() => {})).toBe(false);
      expect(isNumeric(Symbol('test'))).toBe(false);
    });

    it('should reject NaN', () => {
      expect(isNumeric(NaN)).toBe(false);
      expect(isNumeric("NaN")).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle very large numbers', () => {
      expect(isNumeric("9999999999999999")).toBe(true);
      expect(isNumeric("1e308")).toBe(true);
    });

    it('should handle very small numbers', () => {
      expect(isNumeric("1e-308")).toBe(true);
      expect(isNumeric("0.0000000000000001")).toBe(true);
    });

    it('should handle zero variations', () => {
      expect(isNumeric("0")).toBe(true);
      expect(isNumeric("0.0")).toBe(true);
      expect(isNumeric("-0")).toBe(true);
      expect(isNumeric("+0")).toBe(false); // +0 is not a valid number key
    });

    it('should handle decimal precision', () => {
      expect(isNumeric("1.0000000000000001")).toBe(true);
      expect(isNumeric("1.0000000000000002")).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should provide meaningful error messages', () => {
      const errors: string[] = [];
      const config = {
        identifier: 'testKey',
        callbackOnError: (error: string) => errors.push(error)
      };

      isNumeric("abc", config);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('testKey');
      expect(errors[0]).toContain('number key');
    });

    it('should not call error callback for valid values', () => {
      const errors: string[] = [];
      const config = {
        identifier: 'testKey',
        callbackOnError: (error: string) => errors.push(error)
      };

      isNumeric("123", config);
      expect(errors.length).toBe(0);
    });
  });

  describe('type narrowing', () => {
    it('should provide proper type narrowing', () => {
      const data: unknown = "123";
      
      if (isNumeric(data)) {
        // TypeScript should know data is number
        expect(typeof data).toBe('string'); // Actually string, but can be converted to number
        expect(Number(data)).toBe(123);
      }
    });

    it('should work with number values', () => {
      const data: unknown = 456;
      
      if (isNumeric(data)) {
        // TypeScript should know data is number
        expect(typeof data).toBe('number');
        expect(data).toBe(456);
      }
    });
  });

  describe('integration with isIndexSignature', () => {
    it('should work with isIndexSignature for number-keyed objects', () => {
      const { isIndexSignature } = require('./isIndexSignature');
      const { isBoolean } = require('./isBoolean');

      const isNumberBooleanMap = isIndexSignature(isNumeric, isBoolean);

      expect(isNumberBooleanMap({ 1: true, 2: false })).toBe(true);
      expect(isNumberBooleanMap({ "1": true, "2": false })).toBe(true);
      expect(isNumberBooleanMap({ "1": true, "abc": false })).toBe(false);
    });
  });
}); 