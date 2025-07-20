import { isNegativeInteger } from './isNegativeInteger';

describe('isNegativeInteger', () => {
  describe('Valid negative integers', () => {
    test('should return true for negative integers', () => {
      expect(isNegativeInteger(-1)).toBe(true);
      expect(isNegativeInteger(-2)).toBe(true);
      expect(isNegativeInteger(-42)).toBe(true);
      expect(isNegativeInteger(-100)).toBe(true);
      expect(isNegativeInteger(-999)).toBe(true);
    });

    test('should return true for large negative integers', () => {
      expect(isNegativeInteger(-1000000)).toBe(true);
      expect(isNegativeInteger(Number.MIN_SAFE_INTEGER)).toBe(true);
    });
  });

  describe('Invalid values (zero and positive integers)', () => {
    test('should return false for zero', () => {
      expect(isNegativeInteger(0)).toBe(false);
      expect(isNegativeInteger(-0)).toBe(false);
    });

    test('should return false for positive integers', () => {
      expect(isNegativeInteger(1)).toBe(false);
      expect(isNegativeInteger(42)).toBe(false);
      expect(isNegativeInteger(100)).toBe(false);
    });

    test('should return false for large positive integers', () => {
      expect(isNegativeInteger(1000000)).toBe(false);
      expect(isNegativeInteger(Number.MAX_SAFE_INTEGER)).toBe(false);
    });
  });

  describe('Invalid values (decimals)', () => {
    test('should return false for negative decimals', () => {
      expect(isNegativeInteger(-1.5)).toBe(false);
      expect(isNegativeInteger(-3.14159)).toBe(false);
      expect(isNegativeInteger(-0.1)).toBe(false);
      expect(isNegativeInteger(-0.999)).toBe(false);
    });

    test('should return false for positive decimals', () => {
      expect(isNegativeInteger(1.5)).toBe(false);
      expect(isNegativeInteger(3.14159)).toBe(false);
      expect(isNegativeInteger(0.1)).toBe(false);
    });
  });

  describe('Invalid values (non-numbers)', () => {
    test('should return false for strings', () => {
      expect(isNegativeInteger('-1')).toBe(false);
      expect(isNegativeInteger('-42')).toBe(false);
      expect(isNegativeInteger('hello')).toBe(false);
      expect(isNegativeInteger('')).toBe(false);
    });

    test('should return false for booleans', () => {
      expect(isNegativeInteger(true)).toBe(false);
      expect(isNegativeInteger(false)).toBe(false);
    });

    test('should return false for null and undefined', () => {
      expect(isNegativeInteger(null)).toBe(false);
      expect(isNegativeInteger(undefined)).toBe(false);
    });

    test('should return false for objects', () => {
      expect(isNegativeInteger({})).toBe(false);
      expect(isNegativeInteger([])).toBe(false);
      expect(isNegativeInteger({ value: -1 })).toBe(false);
    });

    test('should return false for functions', () => {
      expect(isNegativeInteger(() => -1)).toBe(false);
      expect(isNegativeInteger(Math.abs)).toBe(false);
    });

    test('should return false for symbols', () => {
      expect(isNegativeInteger(Symbol('test'))).toBe(false);
    });
  });

  describe('Special number values', () => {
    test('should return false for NaN', () => {
      expect(isNegativeInteger(NaN)).toBe(false);
    });

    test('should return false for positive Infinity', () => {
      expect(isNegativeInteger(Infinity)).toBe(false);
    });

    test('should return false for negative Infinity', () => {
      expect(isNegativeInteger(-Infinity)).toBe(false);
    });
  });

  describe('Error handling', () => {
    test('should call error callback when validation fails', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'testValue',
        callbackOnError: mockCallback,
      };

      isNegativeInteger(0, config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected testValue (0) to be "NegativeInteger"'
      );
    });

    test('should call error callback for positive values', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'positiveValue',
        callbackOnError: mockCallback,
      };

      isNegativeInteger(5, config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected positiveValue (5) to be "NegativeInteger"'
      );
    });

    test('should call error callback for decimal values', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'decimalValue',
        callbackOnError: mockCallback,
      };

      isNegativeInteger(-1.5, config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected decimalValue (-1.5) to be "NegativeInteger"'
      );
    });

    test('should call error callback for string values', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'stringValue',
        callbackOnError: mockCallback,
      };

      isNegativeInteger('hello', config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected stringValue ("hello") to be "NegativeInteger"'
      );
    });
  });

  describe('Real-world use cases', () => {
    test('should validate error codes', () => {
      const errorCodes = [-1, -2, -404, -500, 0, 1, -1.5, '-1'];
      const validErrorCodes = errorCodes.filter(x => isNegativeInteger(x));
      expect(validErrorCodes).toEqual([-1, -2, -404, -500]);
    });

    test('should validate debt amounts in cents', () => {
      const amounts = [-100, -250, -1000, 0, 100, -50.5, '-100'];
      const validDebts = amounts.filter(x => isNegativeInteger(x));
      expect(validDebts).toEqual([-100, -250, -1000]);
    });

    test('should validate temperature in Celsius (below zero)', () => {
      const temperatures = [-10, -5, -30, 0, 5, -2.5, '-5'];
      const belowFreezing = temperatures.filter(x => isNegativeInteger(x));
      expect(belowFreezing).toEqual([-10, -5, -30]);
    });

    test('should validate floor numbers (basement levels)', () => {
      const floors = [-1, -2, -3, 0, 1, 2, -1.5, 'B1'];
      const basementFloors = floors.filter(x => isNegativeInteger(x));
      expect(basementFloors).toEqual([-1, -2, -3]);
    });

    test('should validate coordinate positions (left/down from origin)', () => {
      const coordinates = [-5, -10, -1, 0, 1, 5, -2.5, '-3'];
      const negativeCoords = coordinates.filter(x => isNegativeInteger(x));
      expect(negativeCoords).toEqual([-5, -10, -1]);
    });

    test('should validate time offsets (hours behind UTC)', () => {
      const offsets = [-8, -5, -12, 0, 3, 8, -4.5, '-8'];
      const behindUTC = offsets.filter(x => isNegativeInteger(x));
      expect(behindUTC).toEqual([-8, -5, -12]);
    });
  });

  describe('Type narrowing', () => {
    test('should narrow type correctly', () => {
      const data: unknown = -5;
      if (isNegativeInteger(data)) {
        // TypeScript should infer data as NegativeInteger here
        expect(typeof data).toBe('number');
        expect(data < 0).toBe(true);
        expect(Number.isInteger(data)).toBe(true);
      }
    });
  });
});
