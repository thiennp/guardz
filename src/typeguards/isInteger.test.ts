import { isInteger } from './isInteger';

describe('isInteger', () => {
  describe('valid integers', () => {
    it('should return true for positive integers', () => {
      expect(isInteger(1)).toBe(true);
      expect(isInteger(42)).toBe(true);
      expect(isInteger(123456789)).toBe(true);
    });

    it('should return true for zero', () => {
      expect(isInteger(0)).toBe(true);
    });

    it('should return true for negative integers', () => {
      expect(isInteger(-1)).toBe(true);
      expect(isInteger(-42)).toBe(true);
      expect(isInteger(-123456789)).toBe(true);
    });

    it('should return true for integers with decimal point but no fractional part', () => {
      expect(isInteger(1.0)).toBe(true);
      expect(isInteger(42.0)).toBe(true);
      expect(isInteger(-5.0)).toBe(true);
    });

    it('should return true for large integers within safe range', () => {
      expect(isInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
      expect(isInteger(Number.MIN_SAFE_INTEGER)).toBe(true);
    });
  });

  describe('invalid values', () => {
    it('should return false for decimal numbers', () => {
      expect(isInteger(1.5)).toBe(false);
      expect(isInteger(3.14)).toBe(false);
      expect(isInteger(-2.7)).toBe(false);
      expect(isInteger(0.1)).toBe(false);
    });

    it('should return false for NaN', () => {
      expect(isInteger(NaN)).toBe(false);
    });

    it('should return false for Infinity', () => {
      expect(isInteger(Infinity)).toBe(false);
      expect(isInteger(-Infinity)).toBe(false);
    });

    it('should return false for non-number types', () => {
      expect(isInteger('123')).toBe(false);
      expect(isInteger('0')).toBe(false);
      expect(isInteger(true)).toBe(false);
      expect(isInteger(false)).toBe(false);
      expect(isInteger(null)).toBe(false);
      expect(isInteger(undefined)).toBe(false);
      expect(isInteger({})).toBe(false);
      expect(isInteger([])).toBe(false);
      expect(isInteger(() => {})).toBe(false);
    });

    it('should return false for BigInt values', () => {
      expect(isInteger(BigInt(123))).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should not call error callback for valid integers', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'testValue', callbackOnError: mockCallback };

      isInteger(42, config);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should call error callback for invalid values', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'testValue', callbackOnError: mockCallback };

      isInteger(3.14, config);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('Expected testValue (3.14) to be "integer"');
    });

    it('should call error callback for non-numbers', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'testValue', callbackOnError: mockCallback };

      isInteger('123', config);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('Expected testValue ("123") to be "integer"');
    });

    it('should call error callback for NaN', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'testValue', callbackOnError: mockCallback };

      isInteger(NaN, config);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('Expected testValue (NaN) to be "integer"');
    });

    it('should call error callback for Infinity', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'testValue', callbackOnError: mockCallback };

      isInteger(Infinity, config);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('Expected testValue (Infinity) to be "integer"');
    });
  });

  describe('real-world use cases', () => {
    it('should validate user IDs', () => {
      const userIds = [1, 42, 1001, 999999];
      const invalidIds = [1.5, '123', null, undefined];

      userIds.forEach(id => {
        expect(isInteger(id)).toBe(true);
      });

      invalidIds.forEach(id => {
        expect(isInteger(id)).toBe(false);
      });
    });

    it('should validate array indices', () => {
      const validIndices = [0, 1, 2, 10, 100];
      const invalidIndices = [1.5, '0', null];

      validIndices.forEach(index => {
        expect(isInteger(index)).toBe(true);
      });

      invalidIndices.forEach(index => {
        expect(isInteger(index)).toBe(false);
      });
    });

    it('should validate quantities and counts', () => {
      const validCounts = [0, 1, 5, 100, 1000];
      const invalidCounts = [1.5, '5', null];

      validCounts.forEach(count => {
        expect(isInteger(count)).toBe(true);
      });

      invalidCounts.forEach(count => {
        expect(isInteger(count)).toBe(false);
      });
    });
  });
}); 