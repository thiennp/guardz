import { isRegex } from './isRegex';

describe('isRegex', () => {
  describe('valid RegExp values', () => {
    it('should return true for regex literals', () => {
      expect(isRegex(/abc/)).toBe(true);
      expect(isRegex(/^[a-z]+$/)).toBe(true);
      expect(isRegex(/\\d+/)).toBe(true);
      expect(isRegex(/test/i)).toBe(true);
      expect(isRegex(/test/g)).toBe(true);
      expect(isRegex(/test/m)).toBe(true);
      expect(isRegex(/test/gi)).toBe(true);
    });

    it('should return true for RegExp constructor instances', () => {
      expect(isRegex(new RegExp('abc'))).toBe(true);
      expect(isRegex(new RegExp('^[a-z]+$'))).toBe(true);
      expect(isRegex(new RegExp('\\d+'))).toBe(true);
      expect(isRegex(new RegExp('test', 'i'))).toBe(true);
      expect(isRegex(new RegExp('test', 'g'))).toBe(true);
      expect(isRegex(new RegExp('test', 'm'))).toBe(true);
      expect(isRegex(new RegExp('test', 'gi'))).toBe(true);
    });

    it('should return true for complex regex patterns', () => {
      expect(isRegex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)).toBe(true); // email
      expect(isRegex(/^\+?[\d\s\-()]{10,}$/)).toBe(true); // phone
      expect(isRegex(/^https?:\/\/.+/)).toBe(true); // url
      expect(isRegex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)).toBe(true); // complex email
    });
  });

  describe('invalid values', () => {
    it('should return false for strings', () => {
      expect(isRegex('abc')).toBe(false);
      expect(isRegex('/abc/')).toBe(false);
      expect(isRegex('regex pattern')).toBe(false);
      expect(isRegex('')).toBe(false);
    });

    it('should return false for numbers', () => {
      expect(isRegex(123)).toBe(false);
      expect(isRegex(0)).toBe(false);
      expect(isRegex(-1)).toBe(false);
      expect(isRegex(NaN)).toBe(false);
      expect(isRegex(Infinity)).toBe(false);
    });

    it('should return false for booleans', () => {
      expect(isRegex(true)).toBe(false);
      expect(isRegex(false)).toBe(false);
    });

    it('should return false for null and undefined', () => {
      expect(isRegex(null)).toBe(false);
      expect(isRegex(undefined)).toBe(false);
    });

    it('should return false for objects', () => {
      expect(isRegex({})).toBe(false);
      expect(isRegex({ pattern: /abc/ })).toBe(false);
      expect(isRegex([])).toBe(false);
      expect(isRegex([/abc/])).toBe(false);
    });

    it('should return false for functions', () => {
      expect(isRegex(() => {})).toBe(false);
      expect(isRegex(function() {})).toBe(false);
      expect(isRegex(class {})).toBe(false);
    });

    it('should return false for other types', () => {
      expect(isRegex(Symbol('test'))).toBe(false);
      expect(isRegex(BigInt(123))).toBe(false);
      expect(isRegex(new Date())).toBe(false);
      expect(isRegex(new Error())).toBe(false);
    });
  });

  describe('type narrowing', () => {
    it('should narrow type to RegExp when true', () => {
      const value: unknown = /abc/;
      
      if (isRegex(value)) {
        // value should be typed as RegExp
        expect(value.test('abc')).toBe(true);
        expect(value.test('def')).toBe(false);
        expect(value.source).toBe('abc');
        expect(value.flags).toBe('');
      }
    });

    it('should not narrow type when false', () => {
      const value: unknown = 'not a regex';
      
      if (!isRegex(value)) {
        // value should still be unknown
        expect(typeof value).toBe('string');
      }
    });
  });

  describe('error handling', () => {
    it('should call error callback when validation fails', () => {
      const mockCallback = jest.fn();
      const config = {
        callbackOnError: mockCallback,
        identifier: 'testRegex'
      };

      const result = isRegex('not a regex', config);

      expect(result).toBe(false);
      expect(mockCallback).toHaveBeenCalledWith(
        expect.stringContaining('not a regex')
      );
      expect(mockCallback).toHaveBeenCalledWith(
        expect.stringContaining('RegExp')
      );
    });

    it('should not call error callback when validation passes', () => {
      const mockCallback = jest.fn();
      const config = {
        callbackOnError: mockCallback,
        identifier: 'testRegex'
      };

      const result = isRegex(/abc/, config);

      expect(result).toBe(true);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should work without config', () => {
      expect(isRegex(/abc/)).toBe(true);
      expect(isRegex('not a regex')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty regex', () => {
      expect(isRegex(/()/)).toBe(true);
      expect(isRegex(new RegExp(''))).toBe(true);
    });

    it('should handle regex with special characters', () => {
      expect(isRegex(/[.*+?^${}()|[\]\\]/)).toBe(true);
      expect(isRegex(/\\/)).toBe(true);
      expect(isRegex(/"/)).toBe(true);
      expect(isRegex(/'/)).toBe(true);
    });

    it('should handle regex with flags', () => {
      expect(isRegex(/test/i)).toBe(true);
      expect(isRegex(/test/g)).toBe(true);
      expect(isRegex(/test/m)).toBe(true);
      expect(isRegex(/test/s)).toBe(true);
      expect(isRegex(/test/u)).toBe(true);
      expect(isRegex(/test/y)).toBe(true);
      expect(isRegex(/test/igm)).toBe(true);
    });
  });
}); 