import { isNonNegativeInteger } from './isNonNegativeInteger';

describe('isNonNegativeInteger', () => {
  describe('Valid non-negative integers', () => {
    test('should return true for zero', () => {
      expect(isNonNegativeInteger(0)).toBe(true);
      expect(isNonNegativeInteger(-0)).toBe(true);
    });

    test('should return true for positive integers', () => {
      expect(isNonNegativeInteger(1)).toBe(true);
      expect(isNonNegativeInteger(2)).toBe(true);
      expect(isNonNegativeInteger(42)).toBe(true);
      expect(isNonNegativeInteger(100)).toBe(true);
      expect(isNonNegativeInteger(999)).toBe(true);
    });

    test('should return true for large positive integers', () => {
      expect(isNonNegativeInteger(1000000)).toBe(true);
      expect(isNonNegativeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
    });
  });

  describe('Invalid values (negative integers)', () => {
    test('should return false for negative integers', () => {
      expect(isNonNegativeInteger(-1)).toBe(false);
      expect(isNonNegativeInteger(-2)).toBe(false);
      expect(isNonNegativeInteger(-42)).toBe(false);
      expect(isNonNegativeInteger(-100)).toBe(false);
    });

    test('should return false for large negative integers', () => {
      expect(isNonNegativeInteger(-1000000)).toBe(false);
      expect(isNonNegativeInteger(Number.MIN_SAFE_INTEGER)).toBe(false);
    });
  });

  describe('Invalid values (decimals)', () => {
    test('should return false for positive decimals', () => {
      expect(isNonNegativeInteger(1.5)).toBe(false);
      expect(isNonNegativeInteger(3.14159)).toBe(false);
      expect(isNonNegativeInteger(0.1)).toBe(false);
      expect(isNonNegativeInteger(0.999)).toBe(false);
    });

    test('should return false for negative decimals', () => {
      expect(isNonNegativeInteger(-1.5)).toBe(false);
      expect(isNonNegativeInteger(-3.14159)).toBe(false);
      expect(isNonNegativeInteger(-0.1)).toBe(false);
    });
  });

  describe('Invalid values (non-numbers)', () => {
    test('should return false for strings', () => {
      expect(isNonNegativeInteger('0')).toBe(false);
      expect(isNonNegativeInteger('1')).toBe(false);
      expect(isNonNegativeInteger('42')).toBe(false);
      expect(isNonNegativeInteger('hello')).toBe(false);
      expect(isNonNegativeInteger('')).toBe(false);
    });

    test('should return false for booleans', () => {
      expect(isNonNegativeInteger(true)).toBe(false);
      expect(isNonNegativeInteger(false)).toBe(false);
    });

    test('should return false for null and undefined', () => {
      expect(isNonNegativeInteger(null)).toBe(false);
      expect(isNonNegativeInteger(undefined)).toBe(false);
    });

    test('should return false for objects', () => {
      expect(isNonNegativeInteger({})).toBe(false);
      expect(isNonNegativeInteger([])).toBe(false);
      expect(isNonNegativeInteger({ value: 1 })).toBe(false);
    });

    test('should return false for functions', () => {
      expect(isNonNegativeInteger(() => 1)).toBe(false);
      expect(isNonNegativeInteger(Math.abs)).toBe(false);
    });

    test('should return false for symbols', () => {
      expect(isNonNegativeInteger(Symbol('test'))).toBe(false);
    });
  });

  describe('Special number values', () => {
    test('should return false for NaN', () => {
      expect(isNonNegativeInteger(NaN)).toBe(false);
    });

    test('should return false for positive Infinity', () => {
      expect(isNonNegativeInteger(Infinity)).toBe(false);
    });

    test('should return false for negative Infinity', () => {
      expect(isNonNegativeInteger(-Infinity)).toBe(false);
    });
  });

  describe('Error handling', () => {
    test('should call error callback when validation fails', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'testValue',
        callbackOnError: mockCallback,
      };

      isNonNegativeInteger(-1, config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected testValue (-1) to be "NonNegativeInteger"'
      );
    });

    test('should call error callback for decimal values', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'decimalValue',
        callbackOnError: mockCallback,
      };

      isNonNegativeInteger(1.5, config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected decimalValue (1.5) to be "NonNegativeInteger"'
      );
    });

    test('should call error callback for string values', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'stringValue',
        callbackOnError: mockCallback,
      };

      isNonNegativeInteger('hello', config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected stringValue ("hello") to be "NonNegativeInteger"'
      );
    });

    test('should call error callback for NaN', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'nanValue',
        callbackOnError: mockCallback,
      };

      isNonNegativeInteger(NaN, config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected nanValue (NaN) to be "NonNegativeInteger"'
      );
    });
  });

  describe('Real-world use cases', () => {
    test('should validate array indices (0-based)', () => {
      const indices = [0, 1, 2, 10, -1, 1.5, '2'];
      const validIndices = indices.filter(x => isNonNegativeInteger(x));
      expect(validIndices).toEqual([0, 1, 2, 10]);
    });

    test('should validate counts and quantities', () => {
      const counts = [0, 1, 5, 10, 100, -1, 2.5, 'many'];
      const validCounts = counts.filter(x => isNonNegativeInteger(x));
      expect(validCounts).toEqual([0, 1, 5, 10, 100]);
    });

    test('should validate age in years', () => {
      const ages = [0, 1, 25, 65, 100, -1, 25.5, '30'];
      const validAges = ages.filter(x => isNonNegativeInteger(x));
      expect(validAges).toEqual([0, 1, 25, 65, 100]);
    });

    test('should validate score values', () => {
      const scores = [0, 50, 100, 1000, -10, 95.5, '100'];
      const validScores = scores.filter(x => isNonNegativeInteger(x));
      expect(validScores).toEqual([0, 50, 100, 1000]);
    });

    test('should validate retry attempts', () => {
      const attempts = [0, 1, 2, 3, 5, -1, 2.5, null];
      const validAttempts = attempts.filter(x => isNonNegativeInteger(x));
      expect(validAttempts).toEqual([0, 1, 2, 3, 5]);
    });

    test('should validate file sizes in bytes', () => {
      const fileSizes = [0, 1024, 2048, 1000000, -1, 1024.5, '2048'];
      const validSizes = fileSizes.filter(x => isNonNegativeInteger(x));
      expect(validSizes).toEqual([0, 1024, 2048, 1000000]);
    });

    test('should validate timeout values in milliseconds', () => {
      const timeouts = [0, 1000, 5000, 30000, -1, 1500.5, '3000'];
      const validTimeouts = timeouts.filter(x => isNonNegativeInteger(x));
      expect(validTimeouts).toEqual([0, 1000, 5000, 30000]);
    });
  });

  describe('Type narrowing', () => {
    test('should narrow type correctly', () => {
      const data: unknown = 5;
      if (isNonNegativeInteger(data)) {
        // TypeScript should infer data as NonNegativeInteger here
        expect(typeof data).toBe('number');
        expect(data >= 0).toBe(true);
        expect(Number.isInteger(data)).toBe(true);
      }
    });
  });
});
