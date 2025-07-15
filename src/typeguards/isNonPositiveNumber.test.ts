import { isNonPositiveNumber } from './isNonPositiveNumber';

describe('isNonPositiveNumber', () => {
  describe('Valid non-positive numbers', () => {
    test('should return true for zero', () => {
      expect(isNonPositiveNumber(0)).toBe(true);
    });

    test('should return true for negative integers', () => {
      expect(isNonPositiveNumber(-1)).toBe(true);
      expect(isNonPositiveNumber(-42)).toBe(true);
      expect(isNonPositiveNumber(-100)).toBe(true);
    });

    test('should return true for negative decimals', () => {
      expect(isNonPositiveNumber(-0.1)).toBe(true);
      expect(isNonPositiveNumber(-3.14159)).toBe(true);
      expect(isNonPositiveNumber(-0.000001)).toBe(true);
    });

    test('should return true for negative zero', () => {
      expect(isNonPositiveNumber(-0)).toBe(true);
    });

    test('should return true for very small negative numbers', () => {
      expect(isNonPositiveNumber(-Number.MIN_VALUE)).toBe(true);
      expect(isNonPositiveNumber(-1e-10)).toBe(true);
    });

    test('should return true for large negative numbers', () => {
      expect(isNonPositiveNumber(-1000000)).toBe(true);
      expect(isNonPositiveNumber(-1e10)).toBe(true);
    });
  });

  describe('Invalid values (positive numbers)', () => {
    test('should return false for positive integers', () => {
      expect(isNonPositiveNumber(1)).toBe(false);
      expect(isNonPositiveNumber(42)).toBe(false);
      expect(isNonPositiveNumber(100)).toBe(false);
    });

    test('should return false for positive decimals', () => {
      expect(isNonPositiveNumber(0.1)).toBe(false);
      expect(isNonPositiveNumber(3.14159)).toBe(false);
      expect(isNonPositiveNumber(0.000001)).toBe(false);
    });

    test('should return false for very small positive numbers', () => {
      expect(isNonPositiveNumber(Number.MIN_VALUE)).toBe(false);
      expect(isNonPositiveNumber(1e-10)).toBe(false);
    });

    test('should return false for large positive numbers', () => {
      expect(isNonPositiveNumber(1000000)).toBe(false);
      expect(isNonPositiveNumber(1e10)).toBe(false);
    });
  });

  describe('Invalid values (non-numbers)', () => {
    test('should return false for strings', () => {
      expect(isNonPositiveNumber('0')).toBe(false);
      expect(isNonPositiveNumber('-1')).toBe(false);
      expect(isNonPositiveNumber('hello')).toBe(false);
      expect(isNonPositiveNumber('')).toBe(false);
    });

    test('should return false for booleans', () => {
      expect(isNonPositiveNumber(true)).toBe(false);
      expect(isNonPositiveNumber(false)).toBe(false);
    });

    test('should return false for null and undefined', () => {
      expect(isNonPositiveNumber(null)).toBe(false);
      expect(isNonPositiveNumber(undefined)).toBe(false);
    });

    test('should return false for objects', () => {
      expect(isNonPositiveNumber({})).toBe(false);
      expect(isNonPositiveNumber([])).toBe(false);
      expect(isNonPositiveNumber({ value: -1 })).toBe(false);
    });

    test('should return false for functions', () => {
      expect(isNonPositiveNumber(() => -1)).toBe(false);
      expect(isNonPositiveNumber(Math.abs)).toBe(false);
    });

    test('should return false for symbols', () => {
      expect(isNonPositiveNumber(Symbol('test'))).toBe(false);
    });
  });

  describe('Special number values', () => {
    test('should return false for NaN', () => {
      expect(isNonPositiveNumber(NaN)).toBe(false);
    });

    test('should return false for positive Infinity', () => {
      expect(isNonPositiveNumber(Infinity)).toBe(false);
    });

    test('should return false for negative Infinity', () => {
      expect(isNonPositiveNumber(-Infinity)).toBe(false);
    });
  });

  describe('Error handling', () => {
    test('should call error callback when validation fails', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'testValue',
        callbackOnError: mockCallback,
      };

      isNonPositiveNumber(1, config);
      expect(mockCallback).toHaveBeenCalledWith('Expected testValue (1) to be "NonPositiveNumber"');
    });

    test('should call error callback for string values', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'stringValue',
        callbackOnError: mockCallback,
      };

      isNonPositiveNumber('hello', config);
      expect(mockCallback).toHaveBeenCalledWith('Expected stringValue ("hello") to be "NonPositiveNumber"');
    });

    test('should call error callback for NaN', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'nanValue',
        callbackOnError: mockCallback,
      };

      isNonPositiveNumber(NaN, config);
      expect(mockCallback).toHaveBeenCalledWith('Expected nanValue (NaN) to be "NonPositiveNumber"');
    });

    test('should call error callback for Infinity', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'infinityValue',
        callbackOnError: mockCallback,
      };

      isNonPositiveNumber(Infinity, config);
      expect(mockCallback).toHaveBeenCalledWith('Expected infinityValue (Infinity) to be "NonPositiveNumber"');
    });
  });

  describe('Real-world use cases', () => {
         test('should validate temperature below freezing in Celsius', () => {
       const temperatures = [-10, -5, 0, 5, 10];
       const belowOrAtFreezing = temperatures.filter(x => isNonPositiveNumber(x));
       expect(belowOrAtFreezing).toEqual([-10, -5, 0]);
     });

     test('should validate debt amounts (negative balances)', () => {
       const balances = [-1000, -50.25, 0, 100.50, 200];
       const debtsOrZero = balances.filter(x => isNonPositiveNumber(x));
       expect(debtsOrZero).toEqual([-1000, -50.25, 0]);
     });

     test('should validate coordinate values below or at origin', () => {
       const coordinates = [-5, -2.5, 0, 1.5, 3];
       const belowOrAtOrigin = coordinates.filter(x => isNonPositiveNumber(x));
       expect(belowOrAtOrigin).toEqual([-5, -2.5, 0]);
     });

     test('should validate decreases in value (non-positive changes)', () => {
       const priceChanges = [-15.5, -5, 0, 2.5, 10];
       const decreasesOrNoChange = priceChanges.filter(x => isNonPositiveNumber(x));
       expect(decreasesOrNoChange).toEqual([-15.5, -5, 0]);
     });
  });

  describe('Type narrowing', () => {
    test('should narrow type correctly', () => {
      const data: unknown = -5;
      if (isNonPositiveNumber(data)) {
        // TypeScript should infer data as NonPositiveNumber here
        expect(typeof data).toBe('number');
        expect(data <= 0).toBe(true);
      }
    });
  });
}); 