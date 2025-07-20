import { isPositiveInteger } from './isPositiveInteger';

describe('isPositiveInteger', () => {
  describe('Valid positive integers', () => {
    test('should return true for positive integers', () => {
      expect(isPositiveInteger(1)).toBe(true);
      expect(isPositiveInteger(2)).toBe(true);
      expect(isPositiveInteger(42)).toBe(true);
      expect(isPositiveInteger(100)).toBe(true);
      expect(isPositiveInteger(999)).toBe(true);
    });

    test('should return true for large positive integers', () => {
      expect(isPositiveInteger(1000000)).toBe(true);
      expect(isPositiveInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
    });
  });

  describe('Invalid values (zero and negative integers)', () => {
    test('should return false for zero', () => {
      expect(isPositiveInteger(0)).toBe(false);
      expect(isPositiveInteger(-0)).toBe(false);
    });

    test('should return false for negative integers', () => {
      expect(isPositiveInteger(-1)).toBe(false);
      expect(isPositiveInteger(-42)).toBe(false);
      expect(isPositiveInteger(-100)).toBe(false);
    });

    test('should return false for large negative integers', () => {
      expect(isPositiveInteger(-1000000)).toBe(false);
      expect(isPositiveInteger(Number.MIN_SAFE_INTEGER)).toBe(false);
    });
  });

  describe('Invalid values (decimals)', () => {
    test('should return false for positive decimals', () => {
      expect(isPositiveInteger(1.5)).toBe(false);
      expect(isPositiveInteger(3.14159)).toBe(false);
      expect(isPositiveInteger(0.1)).toBe(false);
      expect(isPositiveInteger(0.999)).toBe(false);
    });

    test('should return false for negative decimals', () => {
      expect(isPositiveInteger(-1.5)).toBe(false);
      expect(isPositiveInteger(-3.14159)).toBe(false);
      expect(isPositiveInteger(-0.1)).toBe(false);
    });
  });

  describe('Invalid values (non-numbers)', () => {
    test('should return false for strings', () => {
      expect(isPositiveInteger('1')).toBe(false);
      expect(isPositiveInteger('42')).toBe(false);
      expect(isPositiveInteger('hello')).toBe(false);
      expect(isPositiveInteger('')).toBe(false);
    });

    test('should return false for booleans', () => {
      expect(isPositiveInteger(true)).toBe(false);
      expect(isPositiveInteger(false)).toBe(false);
    });

    test('should return false for null and undefined', () => {
      expect(isPositiveInteger(null)).toBe(false);
      expect(isPositiveInteger(undefined)).toBe(false);
    });

    test('should return false for objects', () => {
      expect(isPositiveInteger({})).toBe(false);
      expect(isPositiveInteger([])).toBe(false);
      expect(isPositiveInteger({ value: 1 })).toBe(false);
    });

    test('should return false for functions', () => {
      expect(isPositiveInteger(() => 1)).toBe(false);
      expect(isPositiveInteger(Math.abs)).toBe(false);
    });

    test('should return false for symbols', () => {
      expect(isPositiveInteger(Symbol('test'))).toBe(false);
    });
  });

  describe('Special number values', () => {
    test('should return false for NaN', () => {
      expect(isPositiveInteger(NaN)).toBe(false);
    });

    test('should return false for positive Infinity', () => {
      expect(isPositiveInteger(Infinity)).toBe(false);
    });

    test('should return false for negative Infinity', () => {
      expect(isPositiveInteger(-Infinity)).toBe(false);
    });
  });

  describe('Error handling', () => {
    test('should call error callback when validation fails', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'testValue',
        callbackOnError: mockCallback,
      };

      isPositiveInteger(0, config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected testValue (0) to be "PositiveInteger"'
      );
    });

    test('should call error callback for negative values', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'negativeValue',
        callbackOnError: mockCallback,
      };

      isPositiveInteger(-5, config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected negativeValue (-5) to be "PositiveInteger"'
      );
    });

    test('should call error callback for decimal values', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'decimalValue',
        callbackOnError: mockCallback,
      };

      isPositiveInteger(1.5, config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected decimalValue (1.5) to be "PositiveInteger"'
      );
    });

    test('should call error callback for string values', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'stringValue',
        callbackOnError: mockCallback,
      };

      isPositiveInteger('hello', config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected stringValue ("hello") to be "PositiveInteger"'
      );
    });
  });

  describe('Real-world use cases', () => {
    test('should validate user IDs', () => {
      const userIds = [1, 2, 42, 100, 0, -1, 1.5, '5'];
      const validIds = userIds.filter(x => isPositiveInteger(x));
      expect(validIds).toEqual([1, 2, 42, 100]);
    });

    test('should validate page numbers', () => {
      const pageNumbers = [1, 2, 3, 10, 0, -1, 2.5, '1'];
      const validPages = pageNumbers.filter(x => isPositiveInteger(x));
      expect(validPages).toEqual([1, 2, 3, 10]);
    });

    test('should validate item quantities', () => {
      const quantities = [1, 5, 10, 0, -2, 3.5, 'many'];
      const validQuantities = quantities.filter(x => isPositiveInteger(x));
      expect(validQuantities).toEqual([1, 5, 10]);
    });

    test('should validate database primary keys', () => {
      const primaryKeys = [1, 999, 123456, 0, -1, null, undefined];
      const validKeys = primaryKeys.filter(x => isPositiveInteger(x));
      expect(validKeys).toEqual([1, 999, 123456]);
    });

    test('should validate array indices (1-based)', () => {
      const indices = [1, 2, 3, 10, 0, -1, 1.2, '2'];
      const validIndices = indices.filter(x => isPositiveInteger(x));
      expect(validIndices).toEqual([1, 2, 3, 10]);
    });

    test('should validate port numbers', () => {
      const ports = [80, 443, 3000, 8080, 0, -1, 80.5, '3000'];
      const validPorts = ports.filter(x => isPositiveInteger(x));
      expect(validPorts).toEqual([80, 443, 3000, 8080]);
    });
  });

  describe('Type narrowing', () => {
    test('should narrow type correctly', () => {
      const data: unknown = 5;
      if (isPositiveInteger(data)) {
        // TypeScript should infer data as PositiveInteger here
        expect(typeof data).toBe('number');
        expect(data > 0).toBe(true);
        expect(Number.isInteger(data)).toBe(true);
      }
    });
  });
});
