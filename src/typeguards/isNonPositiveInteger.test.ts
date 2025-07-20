import { isNonPositiveInteger } from './isNonPositiveInteger';

describe('isNonPositiveInteger', () => {
  describe('Valid non-positive integers', () => {
    test('should return true for zero', () => {
      expect(isNonPositiveInteger(0)).toBe(true);
      expect(isNonPositiveInteger(-0)).toBe(true);
    });

    test('should return true for negative integers', () => {
      expect(isNonPositiveInteger(-1)).toBe(true);
      expect(isNonPositiveInteger(-2)).toBe(true);
      expect(isNonPositiveInteger(-42)).toBe(true);
      expect(isNonPositiveInteger(-100)).toBe(true);
      expect(isNonPositiveInteger(-999)).toBe(true);
    });

    test('should return true for large negative integers', () => {
      expect(isNonPositiveInteger(-1000000)).toBe(true);
      expect(isNonPositiveInteger(Number.MIN_SAFE_INTEGER)).toBe(true);
    });
  });

  describe('Invalid values (positive integers)', () => {
    test('should return false for positive integers', () => {
      expect(isNonPositiveInteger(1)).toBe(false);
      expect(isNonPositiveInteger(2)).toBe(false);
      expect(isNonPositiveInteger(42)).toBe(false);
      expect(isNonPositiveInteger(100)).toBe(false);
    });

    test('should return false for large positive integers', () => {
      expect(isNonPositiveInteger(1000000)).toBe(false);
      expect(isNonPositiveInteger(Number.MAX_SAFE_INTEGER)).toBe(false);
    });
  });

  describe('Invalid values (decimals)', () => {
    test('should return false for negative decimals', () => {
      expect(isNonPositiveInteger(-1.5)).toBe(false);
      expect(isNonPositiveInteger(-3.14159)).toBe(false);
      expect(isNonPositiveInteger(-0.1)).toBe(false);
      expect(isNonPositiveInteger(-0.999)).toBe(false);
    });

    test('should return false for positive decimals', () => {
      expect(isNonPositiveInteger(1.5)).toBe(false);
      expect(isNonPositiveInteger(3.14159)).toBe(false);
      expect(isNonPositiveInteger(0.1)).toBe(false);
    });
  });

  describe('Invalid values (non-numbers)', () => {
    test('should return false for strings', () => {
      expect(isNonPositiveInteger('0')).toBe(false);
      expect(isNonPositiveInteger('-1')).toBe(false);
      expect(isNonPositiveInteger('-42')).toBe(false);
      expect(isNonPositiveInteger('hello')).toBe(false);
      expect(isNonPositiveInteger('')).toBe(false);
    });

    test('should return false for booleans', () => {
      expect(isNonPositiveInteger(true)).toBe(false);
      expect(isNonPositiveInteger(false)).toBe(false);
    });

    test('should return false for null and undefined', () => {
      expect(isNonPositiveInteger(null)).toBe(false);
      expect(isNonPositiveInteger(undefined)).toBe(false);
    });

    test('should return false for objects', () => {
      expect(isNonPositiveInteger({})).toBe(false);
      expect(isNonPositiveInteger([])).toBe(false);
      expect(isNonPositiveInteger({ value: -1 })).toBe(false);
    });

    test('should return false for functions', () => {
      expect(isNonPositiveInteger(() => -1)).toBe(false);
      expect(isNonPositiveInteger(Math.abs)).toBe(false);
    });

    test('should return false for symbols', () => {
      expect(isNonPositiveInteger(Symbol('test'))).toBe(false);
    });
  });

  describe('Special number values', () => {
    test('should return false for NaN', () => {
      expect(isNonPositiveInteger(NaN)).toBe(false);
    });

    test('should return false for positive Infinity', () => {
      expect(isNonPositiveInteger(Infinity)).toBe(false);
    });

    test('should return false for negative Infinity', () => {
      expect(isNonPositiveInteger(-Infinity)).toBe(false);
    });
  });

  describe('Error handling', () => {
    test('should call error callback when validation fails', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'testValue',
        callbackOnError: mockCallback,
      };

      isNonPositiveInteger(1, config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected testValue (1) to be "NonPositiveInteger"'
      );
    });

    test('should call error callback for decimal values', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'decimalValue',
        callbackOnError: mockCallback,
      };

      isNonPositiveInteger(-1.5, config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected decimalValue (-1.5) to be "NonPositiveInteger"'
      );
    });

    test('should call error callback for string values', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'stringValue',
        callbackOnError: mockCallback,
      };

      isNonPositiveInteger('hello', config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected stringValue ("hello") to be "NonPositiveInteger"'
      );
    });

    test('should call error callback for NaN', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'nanValue',
        callbackOnError: mockCallback,
      };

      isNonPositiveInteger(NaN, config);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected nanValue (NaN) to be "NonPositiveInteger"'
      );
    });
  });

  describe('Real-world use cases', () => {
    test('should validate error exit codes', () => {
      const exitCodes = [0, -1, -2, -127, 1, 2, -1.5, '0'];
      const validCodes = exitCodes.filter(x => isNonPositiveInteger(x));
      expect(validCodes).toEqual([0, -1, -2, -127]);
    });

    test('should validate floor levels (ground and below)', () => {
      const floors = [0, -1, -2, -3, 1, 2, 3, -1.5, 'B1'];
      const groundAndBelow = floors.filter(x => isNonPositiveInteger(x));
      expect(groundAndBelow).toEqual([0, -1, -2, -3]);
    });

    test('should validate coordinate positions (origin and left/down)', () => {
      const coordinates = [0, -5, -10, -1, 1, 5, 10, -2.5, '-3'];
      const originAndNegative = coordinates.filter(x =>
        isNonPositiveInteger(x)
      );
      expect(originAndNegative).toEqual([0, -5, -10, -1]);
    });

    test('should validate balance changes (neutral and losses)', () => {
      const changes = [0, -100, -50, -1000, 100, 50, -25.5, '-100'];
      const neutralAndLosses = changes.filter(x => isNonPositiveInteger(x));
      expect(neutralAndLosses).toEqual([0, -100, -50, -1000]);
    });

    test('should validate temperature thresholds (freezing and below)', () => {
      const temperatures = [0, -1, -5, -10, 1, 5, 10, -2.5, '0'];
      const freezingAndBelow = temperatures.filter(x =>
        isNonPositiveInteger(x)
      );
      expect(freezingAndBelow).toEqual([0, -1, -5, -10]);
    });

    test('should validate debt levels (zero debt and actual debt)', () => {
      const debts = [0, -500, -1000, -250, 100, 500, -50.25, '0'];
      const zeroAndDebts = debts.filter(x => isNonPositiveInteger(x));
      expect(zeroAndDebts).toEqual([0, -500, -1000, -250]);
    });
  });

  describe('Type narrowing', () => {
    test('should narrow type correctly', () => {
      const data: unknown = -5;
      if (isNonPositiveInteger(data)) {
        // TypeScript should infer data as NonPositiveInteger here
        expect(typeof data).toBe('number');
        expect(data <= 0).toBe(true);
        expect(Number.isInteger(data)).toBe(true);
      }
    });
  });
});
