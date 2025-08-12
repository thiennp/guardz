import { getExpectedTypeName } from './getExpectedTypeName';
import { isString } from '../typeguards/isString';
import { isNumber } from '../typeguards/isNumber';
import { isBoolean } from '../typeguards/isBoolean';

describe('getExpectedTypeName', () => {
  describe('standard type guards', () => {
    it('should extract type name from isString', () => {
      expect(getExpectedTypeName(isString)).toBe('string');
    });

    it('should extract type name from isNumber', () => {
      expect(getExpectedTypeName(isNumber)).toBe('number');
    });

    it('should extract type name from isBoolean', () => {
      expect(getExpectedTypeName(isBoolean)).toBe('boolean');
    });

    it('should extract type name from isArrayWithEachItem', () => {
      const { isArrayWithEachItem } = require('../typeguards/isArrayWithEachItem');
      const isStringArray = isArrayWithEachItem(isString);
      expect(getExpectedTypeName(isStringArray)).toBe('Array');
    });
  });

  describe('custom type guards', () => {
    it('should handle custom isUser type guard', () => {
      const isUser = (value: unknown): value is { name: string; age: number } => {
        return typeof value === 'object' && value !== null;
      };
      expect(getExpectedTypeName(isUser)).toBe('user');
    });

    it('should handle custom isEmail type guard', () => {
      const isEmail = (value: unknown): value is string => {
        return typeof value === 'string' && value.includes('@');
      };
      expect(getExpectedTypeName(isEmail)).toBe('email');
    });

    it('should handle custom isPositiveNumber type guard', () => {
      const isPositiveNumber = (value: unknown): value is number => {
        return typeof value === 'number' && value > 0;
      };
      expect(getExpectedTypeName(isPositiveNumber)).toBe('positivenumber');
    });
  });

  describe('anonymous functions', () => {
    it('should return "object" for anonymous isType functions', () => {
      const anonymousGuard = (value: unknown): value is { id: number } => {
        return typeof value === 'object' && value !== null;
      };
      // Remove the name to simulate anonymous function
      Object.defineProperty(anonymousGuard, 'name', { value: '' });
      expect(getExpectedTypeName(anonymousGuard)).toBe('object');
    });

    it('should return "object" for functions with empty name', () => {
      const emptyNameGuard = (value: unknown): value is { id: number } => {
        return typeof value === 'object' && value !== null;
      };
      Object.defineProperty(emptyNameGuard, 'name', { value: '' });
      expect(getExpectedTypeName(emptyNameGuard)).toBe('object');
    });
  });

  describe('edge cases', () => {
    it('should return "unknown" for functions not starting with "is"', () => {
      const validateUser = (value: unknown): value is { name: string } => {
        return typeof value === 'object' && value !== null;
      };
      expect(getExpectedTypeName(validateUser)).toBe('unknown');
    });

    it('should handle single character after "is"', () => {
      const isA = (value: unknown): value is string => {
        return value === 'a';
      };
      expect(getExpectedTypeName(isA)).toBe('a');
    });

    it('should handle camelCase after "is"', () => {
      const isUserProfile = (value: unknown): value is { name: string } => {
        return typeof value === 'object' && value !== null;
      };
      expect(getExpectedTypeName(isUserProfile)).toBe('userprofile');
    });

    it('should handle PascalCase after "is"', () => {
      const isUserProfile = (value: unknown): value is { name: string } => {
        return typeof value === 'object' && value !== null;
      };
      expect(getExpectedTypeName(isUserProfile)).toBe('userprofile');
    });
  });

  describe('performance', () => {
    it('should handle large number of calls efficiently', () => {
      const start = performance.now();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of Array.from({ length: 10000 })) {
        getExpectedTypeName(isString);
      }
      const end = performance.now();
      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    });
  });
}); 