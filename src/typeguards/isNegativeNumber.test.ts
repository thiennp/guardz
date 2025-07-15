import { isNegativeNumber } from './isNegativeNumber';

describe('isNegativeNumber', () => {
  describe('Valid negative numbers', () => {
    test('should return true for negative integers', () => {
      expect(isNegativeNumber(-1)).toBe(true);
      expect(isNegativeNumber(-42)).toBe(true);
      expect(isNegativeNumber(-100)).toBe(true);
    });

    test('should return true for negative decimals', () => {
      expect(isNegativeNumber(-0.1)).toBe(true);
      expect(isNegativeNumber(-3.14159)).toBe(true);
      expect(isNegativeNumber(-0.000001)).toBe(true);
    });

    test('should return true for very small negative numbers', () => {
      expect(isNegativeNumber(-Number.MIN_VALUE)).toBe(true);
      expect(isNegativeNumber(-1e-10)).toBe(true);
    });

    test('should return true for large negative numbers', () => {
      expect(isNegativeNumber(-1000000)).toBe(true);
      expect(isNegativeNumber(-1e10)).toBe(true);
    });
  });

  describe('Invalid values (zero and positive numbers)', () => {
    test('should return false for zero', () => {
      expect(isNegativeNumber(0)).toBe(false);
      expect(isNegativeNumber(-0)).toBe(false);
    });

    test('should return false for positive integers', () => {
      expect(isNegativeNumber(1)).toBe(false);
      expect(isNegativeNumber(42)).toBe(false);
      expect(isNegativeNumber(100)).toBe(false);
    });

    test('should return false for positive decimals', () => {
      expect(isNegativeNumber(0.1)).toBe(false);
      expect(isNegativeNumber(3.14159)).toBe(false);
      expect(isNegativeNumber(0.000001)).toBe(false);
    });

    test('should return false for very small positive numbers', () => {
      expect(isNegativeNumber(Number.MIN_VALUE)).toBe(false);
      expect(isNegativeNumber(1e-10)).toBe(false);
    });

    test('should return false for large positive numbers', () => {
      expect(isNegativeNumber(1000000)).toBe(false);
      expect(isNegativeNumber(1e10)).toBe(false);
    });
  });

  describe('Invalid values (non-numbers)', () => {
    test('should return false for strings', () => {
      expect(isNegativeNumber('-1')).toBe(false);
      expect(isNegativeNumber('-42.5')).toBe(false);
      expect(isNegativeNumber('hello')).toBe(false);
      expect(isNegativeNumber('')).toBe(false);
    });

    test('should return false for booleans', () => {
      expect(isNegativeNumber(true)).toBe(false);
      expect(isNegativeNumber(false)).toBe(false);
    });

    test('should return false for null and undefined', () => {
      expect(isNegativeNumber(null)).toBe(false);
      expect(isNegativeNumber(undefined)).toBe(false);
    });

    test('should return false for objects', () => {
      expect(isNegativeNumber({})).toBe(false);
      expect(isNegativeNumber([])).toBe(false);
      expect(isNegativeNumber({ value: -1 })).toBe(false);
    });

    test('should return false for functions', () => {
      expect(isNegativeNumber(() => -1)).toBe(false);
      expect(isNegativeNumber(Math.abs)).toBe(false);
    });

    test('should return false for symbols', () => {
      expect(isNegativeNumber(Symbol('test'))).toBe(false);
    });
  });

  describe('Special number values', () => {
    test('should return false for NaN', () => {
      expect(isNegativeNumber(NaN)).toBe(false);
    });

    test('should return false for positive Infinity', () => {
      expect(isNegativeNumber(Infinity)).toBe(false);
    });

    test('should return false for negative Infinity', () => {
      expect(isNegativeNumber(-Infinity)).toBe(false);
    });
  });

  describe('Error handling', () => {
    test('should call error callback when validation fails', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'testValue',
        callbackOnError: mockCallback,
      };

      isNegativeNumber(0, config);
      expect(mockCallback).toHaveBeenCalledWith('Expected testValue (0) to be "NegativeNumber"');
    });

    test('should call error callback for positive values', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'positiveValue',
        callbackOnError: mockCallback,
      };

      isNegativeNumber(5, config);
      expect(mockCallback).toHaveBeenCalledWith('Expected positiveValue (5) to be "NegativeNumber"');
    });

    test('should call error callback for string values', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'stringValue',
        callbackOnError: mockCallback,
      };

      isNegativeNumber('hello', config);
      expect(mockCallback).toHaveBeenCalledWith('Expected stringValue ("hello") to be "NegativeNumber"');
    });

    test('should call error callback for NaN', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'nanValue',
        callbackOnError: mockCallback,
      };

      isNegativeNumber(NaN, config);
      expect(mockCallback).toHaveBeenCalledWith('Expected nanValue (NaN) to be "NegativeNumber"');
    });

    test('should call error callback for Infinity', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'infinityValue',
        callbackOnError: mockCallback,
      };

      isNegativeNumber(-Infinity, config);
      expect(mockCallback).toHaveBeenCalledWith('Expected infinityValue (-Infinity) to be "NegativeNumber"');
    });
  });

  describe('Real-world use cases', () => {
         test('should validate temperature below freezing in Celsius', () => {
       const temperatures = [-10, -5, 0, 5, 10];
       const belowFreezing = temperatures.filter(x => isNegativeNumber(x));
       expect(belowFreezing).toEqual([-10, -5]);
     });

     test('should validate debt amounts (strictly negative balances)', () => {
       const balances = [-1000, -50.25, 0, 100.50, 200];
       const debts = balances.filter(x => isNegativeNumber(x));
       expect(debts).toEqual([-1000, -50.25]);
     });

     test('should validate coordinate values below origin', () => {
       const coordinates = [-5, -2.5, 0, 1.5, 3];
       const belowOrigin = coordinates.filter(x => isNegativeNumber(x));
       expect(belowOrigin).toEqual([-5, -2.5]);
     });

     test('should validate price decreases (strictly negative changes)', () => {
       const priceChanges = [-15.5, -5, 0, 2.5, 10];
       const decreases = priceChanges.filter(x => isNegativeNumber(x));
       expect(decreases).toEqual([-15.5, -5]);
     });

     test('should validate losses in trading', () => {
       const tradingResults = [-250.75, -10, 0, 50.25, 100];
       const losses = tradingResults.filter(x => isNegativeNumber(x));
       expect(losses).toEqual([-250.75, -10]);
     });

     test('should validate altitude below sea level', () => {
       const altitudes = [-400, -50.5, 0, 100, 2000];
       const belowSeaLevel = altitudes.filter(x => isNegativeNumber(x));
       expect(belowSeaLevel).toEqual([-400, -50.5]);
     });
  });

  describe('Type narrowing', () => {
    test('should narrow type correctly', () => {
      const data: unknown = -5;
      if (isNegativeNumber(data)) {
        // TypeScript should infer data as NegativeNumber here
        expect(typeof data).toBe('number');
        expect(data < 0).toBe(true);
      }
    });
  });
}); 